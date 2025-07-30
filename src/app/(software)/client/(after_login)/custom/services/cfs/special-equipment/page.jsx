'use client';

import { useSidebar } from "@/contexts/SidebarProvider";
import { useEffect } from "react";
import CustomCFSServices from "@/components/services/cfs/services/CFSServices";

export default function SpecialEquipmentPage() {
	const { setTitle } = useSidebar();
	useEffect(() => {
		setTitle('Special Equipment')
	}, []);

	return (
		<section className="grid gap-8">
			<CustomCFSServices serviceName="Special Equipment" />
		</section>
	)
};
