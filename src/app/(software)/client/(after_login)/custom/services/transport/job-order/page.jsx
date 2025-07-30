'use client';

import { useSidebar } from "@/contexts/SidebarProvider";
import { useEffect } from "react";
import CustomTransportJobOrderPage from "@/components/services/custom/transport/job_orders/TransportJobOrderPage";

export default function JobOrderUpdatePage() {
	const { setTitle } = useSidebar();
	useEffect(() => {
		setTitle('Job Order Update')
	}, []);

	return (
		<section className="grid gap-8">
			<CustomTransportJobOrderPage />
		</section>
	)
};
