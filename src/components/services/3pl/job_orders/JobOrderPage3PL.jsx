import React, { useState, useEffect } from 'react';
import { DataTable } from '@/components/ui/Table';
import Form from './Form';
import { useCollection } from '@/hooks/useCollection';
import EditForm from './EditForm';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileDataTable from '@/components/ui/MobileDataTable';
import { useAuth } from '@/contexts/AuthContext';
import Stats from './Stats';
import DetailsActions from '@/components/actions-buttons/DetailsActions';

export default function JobOrderPage3PL({ service = '' }) {
  const { data, deleteItem } = useCollection('3pl_job_order', {
    expand: 'order,order.provider,service,serviceType'
  });
  const { user } = useAuth();
  const [filteredData, setFilteredData] = useState([]);
  const [displayData, setDisplayData] = useState([]);

  const getStatusClass = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-100 text-green-800 border border-green-500';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-500';
      case 'Rejected':
        return 'bg-red-100 text-red-800 border border-red-500';
      default:
        return 'bg-gray-300 text-gray-800 border border-gray-800';
    }
  };

  const columns = [
    {
      id: 'id',
      accessorKey: 'id',
      header: 'Job ID',
      filterable: true,
      cell: ({ row }) => <div>{row.original.id}</div>,
    },
    {
      id: 'Order ID',
      accessorKey: 'order',
      header: 'Order No.',
      filterable: true,
      cell: ({ row }) => <div>{row.original.order}</div>,
    },
    {
      id: 'consigneeName',
      accessorKey: 'expand.order.consigneeName',
      header: 'Customer Name',
      filterable: true,
      cell: ({ row }) => <div>{row.original?.expand?.order?.consigneeName}</div>,
    },
    {
      id: 'fromDate',
      accessorKey: 'fromDate',
      header: 'From Date',
      filterable: true,
      cell: ({ row }) => <div>
        {
          new Date(row.original.fromDate).toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })
        }
      </div>,
    },
    {
      id: 'toDate',
      accessorKey: 'toDate',
      header: 'To Date',
      filterable: true,
      cell: ({ row }) => <div>
        {
          new Date(row.original.toDate).toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })
        }
      </div>,
    },
    {
      id: 'serviceType',
      accessorKey: 'expand.serviceType.title',
      header: 'Service',
      filterable: true,
      cell: ({ row }) => <div>{row.original?.expand?.serviceType?.title}</div>,
    },
    {
      id: 'remarks',
      accessorKey: 'remarks',
      header: 'Remarks',
      filterable: true,
      cell: ({ row }) => <div>{row.original.remarks}</div>,
    },
    {
      id: 'status',
      accessorKey: 'status',
      header: 'Status',
      filterable: true,
      cell: ({ row }) => (
        <div className={`px-2 py-1 text-xs rounded-full ${getStatusClass(row.original.status)}`}>
          {row.original.status}
        </div>
      ),
    },
    {
      id: 'actions',
      accessorKey: 'actions',
      header: 'Actions',
      filterable: false,
      cell: ({ row }) => (
        <DetailsActions
          row={row}
          EditForm={EditForm}
          deleteItem={deleteItem}
        />
      ),
    }
  ];

  useEffect(() => {
    if (data?.length > 0 && user?.id) {
      let filtered_data = [];
      switch (user?.role) {
        case 'Customer':
          filtered_data = data.filter((item) =>
            item?.expand?.order?.customer === user?.id
            && item?.expand?.service?.title === service
          )
          break;
        case 'Merchant':
          filtered_data = data.filter((item) =>
            item?.expand?.order?.expand?.provider?.author === user?.id
            && item?.expand?.service?.title === service
          )
          break;
        case 'Root':
          filtered_data = data.filter((item) =>
            item?.expand?.service?.title === service
          );
          break;
        default:
          break;
      }
      setFilteredData(filtered_data);
      setDisplayData(filtered_data);
    }
  }, [data, user]);


  return (
    <>
      <Stats original={filteredData} jobOrders={displayData} setJobOrders={setDisplayData} />
      <div className="border md:bg-accent md:p-4 rounded-xl mt-4">
        {
          useIsMobile() ? (
            <>
              <h1 className="text-xl font-semibold p-4">Job Orders</h1>
              {
                user?.role === 'Merchant' && (
                  <div className="flex justify-end p-4">
                    <Form service={service} />
                  </div>
                )
              }
              <MobileDataTable
                columns={columns}
                data={displayData}
              />
            </>
          ) : (
            <>
              <div className="flex items-center justify-between gap-4">
                <h1 className="text-xl font-semibold p-4">Job Orders</h1>
                {
                  user?.role === 'Merchant' && (
                    <Form service={service} />
                  )
                }
              </div>
              <DataTable
                columns={columns}
                data={displayData}
              />
            </>
          )
        }
      </div>
    </>
  );
};
