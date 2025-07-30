'use client';

import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useSidebar } from '@/contexts/SidebarProvider';
import CustomCFSServiceRequestView from '@/components/services/custom/cfs/service_requests/view/CFSServiceRequestView';

export default function ServiceRequestViewDetailsPage() {
  const { requestId } = useParams();
  const { setTitle } = useSidebar()

  useEffect(() => {
    // Setting the Page Title in top navbar
    setTitle(`View Service Request Details`)
  }, []);

  return (
    <CustomCFSServiceRequestView requestId={requestId} />
  );
};