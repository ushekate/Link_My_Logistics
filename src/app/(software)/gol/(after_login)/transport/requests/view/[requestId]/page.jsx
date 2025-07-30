'use client';

import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useSidebar } from '@/contexts/SidebarProvider';
import TransportServiceRequestView from '@/components/services/transport/service_requests/view/TransportServiceRequestView';

export default function ServiceRequestViewDetailsPage() {
  const { requestId } = useParams();
  const { setTitle } = useSidebar()

  useEffect(() => {
    // Setting the Page Title in top navbar
    setTitle(`View Service Request Details`)
  }, []);

  return (
    <TransportServiceRequestView requestId={requestId} />
  );
};
