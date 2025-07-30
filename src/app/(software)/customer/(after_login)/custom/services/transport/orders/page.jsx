'use client';

import { useSidebar } from "@/contexts/SidebarProvider";
import { useEffect } from "react";
import CustomTransportOrderTable from "@/components/services/custom/transport/orders/TransportOrderTable";

export default function RescanRequestPage() {
	const { setTitle } = useSidebar();
	useEffect(() => {
		setTitle('My Orders')
	}, []);

	return (
		<section className="grid gap-8">
			<CustomTransportOrderTable />
		</section>
	)
}
