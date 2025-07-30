'use client';

import React, { useEffect, } from 'react';
import { useParams } from 'next/navigation';
import { useSidebar } from '@/contexts/SidebarProvider';
import OrderView3PL from '@/components/services/3pl/orders/view/OrderView3PL';

export default function OrderViewDetailsPage() {
  const { orderId } = useParams();
  const { setTitle } = useSidebar();

  useEffect(() => {
    // Setting the Page Title in top navbar
    setTitle(`View Order Details`)
  }, []);

  return (
    <OrderView3PL orderId={orderId} />
  );
}

