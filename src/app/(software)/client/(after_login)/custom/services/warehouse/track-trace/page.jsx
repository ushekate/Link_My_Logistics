'use client';

import { useSidebar } from "@/contexts/SidebarProvider";
import { useEffect } from "react";
import CustomWarehouseTrackTrace from "@/components/services/custom/warehouse/track-and-trace/WarehouseTrackTrace";

export default function TrackTrace() {
	const { setTitle } = useSidebar();

	useEffect(() => {
		setTitle('Track & Trace');
	}, []);

	return (
		<CustomWarehouseTrackTrace />
	)
}

