'use client';

import PackagesManagementTable from "@/components/services/custom/packages/PackagesManagementTable";
import { useSidebar } from "@/contexts/SidebarProvider";
import { useEffect } from "react";

export default function PackageManagementPage() {
	const { setTitle } = useSidebar();
	useEffect(() => {
		setTitle('Packages Management');
	}, []);

	return (
		<section>
			<PackagesManagementTable />
		</section>
	)
};
