'use client';

import { useSidebar } from "@/contexts/SidebarProvider";
import { useEffect } from "react";
import CustomCFSServices from "@/components/services/custom/cfs/services/CFSServices";

export default function TariffUpload() {
	const { setTitle } = useSidebar();

	useEffect(() => {
		setTitle('Tariff Uploads & Requests')
	}, []);

	return (
		<CustomCFSServices serviceName="Tariff Uploads" />
	)
};
