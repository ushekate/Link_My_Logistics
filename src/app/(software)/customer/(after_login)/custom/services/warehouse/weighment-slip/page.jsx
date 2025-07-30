'use client';

import { useSidebar } from "@/contexts/SidebarProvider";
import { useEffect } from "react";
import CustomWarehouseServices from "@/components/services/custom/warehouse/services/WarehouseServices";

export default function WeighmentSlipPage() {
	const { setTitle } = useSidebar();
	useEffect(() => {
		setTitle('Weighment Slip')
	}, []);

	return (
		<section className="grid gap-8">
			<CustomWarehouseServices serviceName="Weighment Slip" />
		</section>
	)
}

