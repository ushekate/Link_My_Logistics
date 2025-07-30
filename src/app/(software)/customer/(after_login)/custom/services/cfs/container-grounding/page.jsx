'use client';

import { useSidebar } from "@/contexts/SidebarProvider";
import { useEffect } from "react";
import CustomCFSServices from "@/components/services/custom/cfs/services/CFSServices";

export default function ContainerGroundingPage() {
	const { setTitle } = useSidebar();
	useEffect(() => {
		setTitle('Container Grounding')
	}, []);

	return (
		<section className="grid gap-8">
			<CustomCFSServices serviceName="Container Grounding" />
		</section>
	)
}

