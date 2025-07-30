'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useCollection } from '@/hooks/useCollection';
import { useSidebar } from '@/contexts/SidebarProvider';
import CustomCFSServiceDetailsView from '@/components/services/custom/cfs/services_details/view/CFSServiceDetailsView';

export default function DetailsPage() {
  const { recordId } = useParams();
  const { setTitle } = useSidebar();

  const { data: details } = useCollection('custom_cfs_service_details', {
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
    <CustomCFSServiceDetailsView recordId={recordId} />
  );
};
