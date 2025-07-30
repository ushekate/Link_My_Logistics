'use client';

import { useSidebar } from "@/contexts/SidebarProvider";
import { useEffect } from "react";
import CustomWarehouseServices from "@/components/services/custom/warehouse/services/WarehouseServices";

export default function TaxInvoicePage() {
	const { setTitle } = useSidebar();
	useEffect(() => {
		setTitle('Tax Invoice')
	}, []);

	return (
		<section className="grid gap-8">
			<CustomWarehouseServices serviceName="Tax Invoice" />
		</section>
	)
};
