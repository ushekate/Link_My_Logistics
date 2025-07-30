'use client';

import { useSidebar } from "@/contexts/SidebarProvider";
import { useEffect } from "react";
import CustomCFSOrderTable from "@/components/services/custom/cfs/orders/CFSOrderTable";

export default function RescanRequestPage() {
	const { setTitle } = useSidebar();
	useEffect(() => {
		setTitle('My Orders')
	}, []);

	return (
		<section className="grid gap-8">
			<CustomCFSOrderTable />
		</section>
	)
}
