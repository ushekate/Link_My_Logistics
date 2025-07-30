'use client';

import { useSidebar } from "@/contexts/SidebarProvider";
import { useEffect } from "react";
import CustomCFSServices from "@/components/services/custom/cfs/services/CFSServices";

export default function TaxInvoicePage() {
	const { setTitle } = useSidebar();
	useEffect(() => {
		setTitle('Tax Invoice')
	}, []);

	return (
		<section className="grid gap-8">
			<CustomCFSServices serviceName="Tax Invoice" />
		</section>
	)
};
