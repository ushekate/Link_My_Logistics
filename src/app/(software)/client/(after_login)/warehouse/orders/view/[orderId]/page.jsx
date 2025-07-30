'use client';

import React, { useEffect, } from 'react';
import { useParams } from 'next/navigation';
import { useSidebar } from '@/contexts/SidebarProvider';
import WarehouseOrderView from '@/components/services/warehouse/orders/view/WarehouseOrderView';

export default function OrderViewDetailsPage() {
  const { orderId } = useParams();
  const { setTitle } = useSidebar();

  useEffect(() => {
    // Setting the Page Title in top navbar
    setTitle(`View Order Details`)
  }, []);

  return (
    <WarehouseOrderView orderId={orderId} />
  );
};
