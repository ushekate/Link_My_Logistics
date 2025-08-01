'use client';

import { useSidebar } from "@/contexts/SidebarProvider";
import { useEffect } from "react";
import ServiceRequests3PL from "@/components/services/3pl/service_requests/ServiceRequests3PL";

export default function RequestsPage() {
	const { setTitle } = useSidebar();

	useEffect(() => {
		setTitle('Pricing Requests')
	}, []);

	return (
		<section className="grid gap-8">
			<ServiceRequests3PL />
		</section>
	)
};
