'use client';

import { useSidebar } from "@/contexts/SidebarProvider";
import { useEffect } from "react";
import OrderPackagesManagementTable from "@/components/services/custom/order-packages/OrderPackagesManagementTable";

export default function RequestsPage() {
	const { setTitle } = useSidebar();

	useEffect(() => {
		setTitle('Order Packages')
	}, []);

	return (
		<section className="grid gap-8">
			<OrderPackagesManagementTable />
		</section>
	)
};
