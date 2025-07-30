'use client';

import { useSidebar } from "@/contexts/SidebarProvider";
import { useEffect } from "react";
import CustomCFSServices from "@/components/services/custom/cfs/services/CFSServices";

export default function ContainerStagingPage() {
	const { setTitle } = useSidebar();
	useEffect(() => {
		setTitle('Container Staging')
	}, []);

	return (
		<section className="grid gap-8">
			<CustomCFSServices serviceName="Container Staging" />
		</section>
	)
};
