'use client';

import { useSidebar } from "@/contexts/SidebarProvider";
import { useEffect } from "react";
import CustomTransportOrderMovements from "@/components/services/custom/transport/order_movements/TransportOrderMovements";

export default function OrderManagementPage() {
	const { setTitle } = useSidebar();

	useEffect(() => {
		setTitle('Transportation Order Movements')
	}, []);

	return (
		<section className="grid gap-8">
			<CustomTransportOrderMovements />
		</section>
	);
};
