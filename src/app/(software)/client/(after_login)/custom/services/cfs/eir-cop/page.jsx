'use client';

import { useSidebar } from "@/contexts/SidebarProvider";
import { useEffect } from "react";
import CustomCFSServices from "@/components/services/custom/cfs/services/CFSServices";

export default function EIRPage() {
	const { setTitle } = useSidebar();
	useEffect(() => {
		setTitle('EIR Copy');
	}, []);

	return (
		<section className="grid gap-8">
			<CustomCFSServices serviceName="EIR Copy" />
		</section>
	)
}

