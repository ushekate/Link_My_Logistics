'use client';

import { useSidebar } from "@/contexts/SidebarProvider";
import { useEffect } from "react";
import CustomPricingsRequests from "@/components/services/custom/pricings/CustomPricingsRequests";

export default function RequestsPage() {
	const { setTitle } = useSidebar();

	useEffect(() => {
		setTitle('Pricing Requests')
	}, []);

	return (
		<section className="grid gap-8">
			<CustomPricingsRequests />
		</section>
	)
};
