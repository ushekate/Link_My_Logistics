'use client';

import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useSidebar } from '@/contexts/SidebarProvider';
import CustomWarehouseServiceRequestView from '@/components/services/custom/warehouse/service_requests/view/WarehouseServiceRequestView';

export default function ServiceRequestViewDetailsPage() {
  const { requestId } = useParams();
  const { setTitle } = useSidebar()

  useEffect(() => {
    // Setting the Page Title in top navbar
    setTitle(`View Service Request Details`)
  }, []);

  return (
    <CustomWarehouseServiceRequestView requestId={requestId} />
  );
};