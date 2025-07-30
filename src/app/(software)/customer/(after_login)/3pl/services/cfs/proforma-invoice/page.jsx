'use client';

import { useSidebar } from "@/contexts/SidebarProvider";
import { useEffect } from "react";
import CFSServices from "@/components/services/cfs/services/CFSServices";

export default function ProformaInvoicePage() {
	const { setTitle } = useSidebar();
	useEffect(() => {
		setTitle('Proforma Invoice');
	}, []);

	return (
		<section className="grid gap-8">
			<CFSServices serviceName="Proforma Invoice" />
		</section>
	)
}

