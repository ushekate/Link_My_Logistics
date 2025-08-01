'use client';

import { useSidebar } from "@/contexts/SidebarProvider";
import { useEffect } from "react";
import CustomWarehouseServices from "@/components/services/custom/warehouse/services/WarehouseServices";

export default function SpecialEquipmentPage() {
	const { setTitle } = useSidebar();
	useEffect(() => {
		setTitle('Special Equipment')
	}, []);

	return (
		<section className="grid gap-8">
			<CustomWarehouseServices serviceName="Special Equipment" />
		</section>
	)
};
