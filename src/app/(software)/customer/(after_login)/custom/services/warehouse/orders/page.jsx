'use client';

import CustomWarehouseOrderTable from "@/components/services/custom/warehouse/orders/WarehouseOrderTable";
import { useSidebar } from "@/contexts/SidebarProvider";
import { useEffect } from "react";

export default function RescanRequestPage() {
	const { setTitle } = useSidebar();
	useEffect(() => {
		setTitle('My Orders')
	}, []);

	return (
		<section className="grid gap-8">
			<CustomWarehouseOrderTable />
		</section>
	)
}
