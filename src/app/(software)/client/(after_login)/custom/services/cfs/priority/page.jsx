'use client';

import { useSidebar } from "@/contexts/SidebarProvider";
import { useEffect } from "react";
import CustomCFSServices from "@/components/services/custom/cfs/services/CFSServices";

export default function PriorityPage() {
	const { setTitle } = useSidebar();
	useEffect(() => {
		setTitle('Priority Movements')
	}, []);

	return (
		<section className="grid gap-8">
			<CustomCFSServices serviceName="Priority Movements" />
		</section>
	)
};
