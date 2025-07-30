'use client';

import { useSidebar } from "@/contexts/SidebarProvider";
import { useEffect } from "react";
import CFSOrderTable from "@/components/services/cfs/orders/CFSOrderTable";
import { useAuth } from "@/contexts/AuthContext";
import customerClientChatService from "@/services/customerClientChatService";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function RescanRequestPage() {
	const { setTitle } = useSidebar();
	const { user } = useAuth();
	const router = useRouter();

	useEffect(() => {
		setTitle('My Orders')
	}, []);

	const handleChatWithClient = async (order) => {
		try {
			if (!order.expand?.cfs?.author) {
				toast.error('Client information not found for this order');
				return;
			}

			const clientId = order.expand.cfs.author; // The client who created the CFS
			const customerId = user.id; // Current customer user
			const subject = `Order #${order.id} - ${order.status === 'Rejected' ? 'Rejection Discussion' : 'Order Inquiry'}`;
			const serviceType = 'CFS';

			// Try to find existing chat session between this customer and client
			const existingSessions = await customerClientChatService.getChatSessions(customerId, 'customer');
			const existingSession = existingSessions.find(session =>
				session.client === clientId &&
				session.status !== 'Close'
			);

			if (existingSession) {
				// Navigate to existing chat
				router.push(`/customer/chat?session=${existingSession.id}`);
				return;
			}

			// Create new chat session
			const newSession = await customerClientChatService.createChatSession(
				customerId,
				clientId,
				subject,
				serviceType
			);

			if (newSession) {
				toast.success('Chat session created successfully');
				// Navigate to the customer chat page with the new session
				router.push(`/customer/chat?session=${newSession.id}`);
			}
		} catch (error) {
			console.error('Error creating chat with client:', error);
			toast.error('Failed to start chat with client: ' + error.message);
		}
	};

	return (
		<section className="grid gap-8">
			<CFSOrderTable onChatWithClient={handleChatWithClient} />
		</section>
	)
}