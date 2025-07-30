'use client';

import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useSidebar } from '@/contexts/SidebarProvider';
import ServiceRequestView3PL from '@/components/services/3pl/service_requests/view/ServiceRequestView3PL';

export default function ServiceRequestViewDetailsPage() {
  const { requestId } = useParams();
  const { setTitle } = useSidebar()

  useEffect(() => {
    // Setting the Page Title in top navbar
    setTitle(`View Service Request Details`)
  }, []);

  return (
    <ServiceRequestView3PL requestId={requestId} />
  );
};