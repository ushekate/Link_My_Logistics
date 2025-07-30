'use client';

import { useSidebar } from "@/contexts/SidebarProvider";
import { useEffect } from "react";
import CustomCFSServiceRequests from "@/components/services/custom/cfs/service_requests/CFSServiceRequests";

export default function RequestsPage() {
	const { setTitle } = useSidebar();

	useEffect(() => {
		setTitle('Service Requests')
	}, []);

	return (
		<section className="grid gap-8">
			<CustomCFSServiceRequests />
		</section>
	)
};
