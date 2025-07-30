'use client';

import { useSidebar } from "@/contexts/SidebarProvider";
import { useEffect } from "react";
import CustomWarehouseServices from "@/components/services/custom/warehouse/services/WarehouseServices";

export default function TariffUpload() {
	const { setTitle } = useSidebar();

	useEffect(() => {
		setTitle('Tariff Uploads & Requests')
	}, []);

	return (
		<CustomWarehouseServices serviceName="Tariff Uploads" />
	)
};
