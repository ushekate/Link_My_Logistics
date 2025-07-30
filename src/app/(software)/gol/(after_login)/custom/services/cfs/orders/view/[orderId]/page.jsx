'use client';

import React, { useEffect, } from 'react';
import { useParams } from 'next/navigation';
import { useSidebar } from '@/contexts/SidebarProvider';
import CustomCFSOrderView from '@/components/services/custom/cfs/orders/view/CFSOrderView';

export default function OrderViewDetailsPage() {
  const { orderId } = useParams();
  const { setTitle } = useSidebar();

  useEffect(() => {
    // Setting the Page Title in top navbar
    setTitle(`View Order Details`)
  }, []);

  return (
    <CustomCFSOrderView orderId={orderId} />
  );
}

