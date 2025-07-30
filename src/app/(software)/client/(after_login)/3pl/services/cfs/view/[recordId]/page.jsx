'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useCollection } from '@/hooks/useCollection';
import { useSidebar } from '@/contexts/SidebarProvider';
import ServiceDetailsView3PL from '@/components/services/3pl/services_details/view/ServiceDetailsView3PL';

export default function DetailsPage() {
  const { recordId } = useParams();
  const { setTitle } = useSidebar();

  const { data: details } = useCollection('3pl_service_details', {
    expand: 'order,jobOrder,container,type',
  });

  const [detail, setdetail] = useState({});

  useEffect(() => {
    if (details?.length) {
      const service_detail = details?.find((item) => {
        return item?.id === recordId
      });
      console.log(service_detail)
      setdetail(service_detail)
    }
  }, [details])
  console.log(detail);

  useEffect(() => {
    setTitle(`${detail?.expand?.type?.title} Details`);
  }, [detail]);

  return (
    <ServiceDetailsView3PL recordId={recordId} />
  );
};
