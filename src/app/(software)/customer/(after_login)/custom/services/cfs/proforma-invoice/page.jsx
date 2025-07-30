'use client';

import { useSidebar } from "@/contexts/SidebarProvider";
import { useEffect } from "react";
import CustomCFSServices from "@/components/services/custom/cfs/services/CFSServices";

export default function ProformaInvoicePage() {
	const { setTitle } = useSidebar();
	useEffect(() => {
		setTitle('Proforma Invoice');
	}, []);

	return (
		<section className="grid gap-8">
			<CustomCFSServices serviceName="Proforma Invoice" />
		</section>
	)
}

