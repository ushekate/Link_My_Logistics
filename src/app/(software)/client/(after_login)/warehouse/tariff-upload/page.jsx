'use client';

import WarehouseServices from "@/components/services/warehouse/services/WarehouseServices";
import { useSidebar } from "@/contexts/SidebarProvider";
import { useEffect } from "react";

export default function TariffUpload() {
  const { setTitle } = useSidebar();

  useEffect(() => {
    setTitle('Tariff Uploads & Requests')
  }, []);

  return (
    <WarehouseServices serviceName="Tariff Uploads" />
  )
};
