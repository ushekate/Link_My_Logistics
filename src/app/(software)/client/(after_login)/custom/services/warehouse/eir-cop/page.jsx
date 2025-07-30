'use client';

import { useSidebar } from "@/contexts/SidebarProvider";
import { useEffect } from "react";
import CustomWarehouseServices from "@/components/services/custom/warehouse/services/WarehouseServices";

export default function EIRPage() {
	const { setTitle } = useSidebar();
	useEffect(() => {
		setTitle('EIR Copy');
	}, []);

	return (
		<section className="grid gap-8">
			<CustomWarehouseServices serviceName="EIR Copy" />
		</section>
	)
}

