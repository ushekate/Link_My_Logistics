'use client';

import { useSidebar } from "@/contexts/SidebarProvider";
import { useEffect } from "react";
import Services3PL from "@/components/services/3pl/services/Services3PL";

export default function TariffUpload() {
	const { setTitle } = useSidebar();

	useEffect(() => {
		setTitle('Tariff Uploads & Requests')
	}, []);

	return (
		<Services3PL service="CFS" serviceName="Tariff Uploads" />
	)
};
