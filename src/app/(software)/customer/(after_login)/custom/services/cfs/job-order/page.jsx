'use client';

import { useSidebar } from "@/contexts/SidebarProvider";
import { useEffect } from "react";
import CustomCFSJobOrders from "@/components/services/custom/cfs/job_orders/CFSJobOrderPage";

export default function JobOrderUpdatePage() {
	const { setTitle } = useSidebar();
	useEffect(() => {
		setTitle('Job Order Update')
	}, []);

	return (
		<section className="grid gap-8">
			<CustomCFSJobOrders />
		</section>
	)
}
