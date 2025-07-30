'use client';

import CFSServices from "@/components/services/cfs/services/CFSServices";
import { useSidebar } from "@/contexts/SidebarProvider";
import { useEffect } from "react";

export default function TariffUpload() {
	const { setTitle } = useSidebar();

	useEffect(() => {
		setTitle('Tariff Uploads & Requests')
	}, []);

	return (
		<CFSServices serviceName="Tariff Uploads" />
	)
};
