import { DataTable } from '@/components/ui/Table';
import { useCollection } from '@/hooks/useCollection'
import { MoveRight } from 'lucide-react'
import Form from './Form';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileDataTable from '@/components/ui/MobileDataTable';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
// import Link from 'next/link';
import Stats from './Stats'
import { toast } from 'sonner';
import TransportActions from '@/components/actions-buttons/TransportActions';

export default function CustomTransportOrderMovements() {
  const { data, updateItem, mutation, deleteItem, } = useCollection('custom_transport_order_movement', {
    expand: 'order,order.provider,vehicle',
  });
  const { user } = useAuth();
  const [filteredData, setFilteredData] = useState([]);
  const [displayData, setDisplayData] = useState([]);

  const handleStatusUpdate = async (id, status = 'Cancelled') => {
    try {
      switch (user?.role) {
        case 'Root':
          await updateItem(id, {
            status: status,
            golVerified: true,
            golVerifiedBy: user?.id
          });
          toast.success('Updated');
          break;
        case 'Merchant':
          await updateItem(id, {
            status: status,
            merchantVerified: true,
            merchantVerifiedBy: user?.id
          });
          toast.success('Updated');
          break;
        default:
          break;
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message);
    } finally {
      mutation()
    }
  }

  const redirectLink = (id) => {
    switch (user?.role) {
      case 'Merchant':
        return `/client/custom/services/transport/order-movements/view-page/${id}`
      case 'Customer':
        return `/customer/custom/services/transport/order-movements/view-page/${id}`
      case 'Root':
        return `/gol/custom/services/transport/order-movements/view-page/${id}`
      default:
        return ''
    }
  }

  const updateLocation = (id) => {
    switch (user?.role) {
      case 'Merchant':
        return `/client/transport-order-movement-custom/edit/${id}`
      case 'Customer':
        return `/customer/transport-order-movement-custom/edit/${id}`
      case 'Root':
        return `/gol/transport-order-movement-custom/edit/${id}`
      default:
        return ''
    }
  }

  const trackLocation = (id) => {
    switch (user?.role) {
      case 'Merchant':
        return `/client/custom/services/transport/order-movements/view/${id}`
      case 'Customer':
        return `/customer/custom/services/transport/order-movements/view/${id}`
      case 'Root':
        return `/gol/custom/services/transport/order-movements/view/${id}`
      default:
        return ''
    }
  }

  const columns = [
    {
      id: 'id',
      accessorKey: 'order',
      header: 'Order No',
      filterable: true,
      cell: ({ row }) => <div>{row.original.order}</div>,
    },
    {
      id: 'jobOrder',
      accessorKey: 'jobOrder',
      header: 'Job Order',
      filterable: true,
      cell: ({ row }) => <div>{row.original.jobOrder}</div>,
    },
    {
      id: 'vehicleNo',
      accessorKey: 'expand.vehicle.vehicleNo',
      header: 'Vehicle No',
      filterable: true,
      cell: ({ row }) => <div>{row.original?.expand?.vehicle?.vehicleNo}</div>,
    },
    {
      id: 'name',
      accessorKey: 'driver.name',
      header: 'Driver Name',
      filterable: true,
      cell: ({ row }) => <div>{row.original?.driver?.name}</div>,
    },
    {
      id: 'contact',
      accessorKey: 'driver.contact',
      header: 'Driver Contact',
      filterable: true,
      cell: ({ row }) => <div>{row.original?.driver?.contact}</div>,
    },
    {
      id: 'startDate',
      accessorKey: 'startDate',
      header: 'Start Date',
      filterable: true,
      cell: ({ row }) => <div>
        {
          new Date(row.original.startDate).toLocaleDateString('en-US', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })
        }
      </div>,
    },
    {
      id: 'endDate',
      accessorKey: 'endDate',
      header: 'End Date',
      filterable: true,
      cell: ({ row }) => {
        const date = new Date(row.original?.endDate).toLocaleDateString('en-US', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        });
        return (
          <div>
            {date !== 'Invalid Date' ? date : 'Not Yet Delivered'}
          </div>
        )
      },
    },
    {
      id: 'route',
      accessorKey: 'route',
      header: 'Route',
      filterable: false,
      cell: ({ row }) => (
        <div className='flex items-center gap-x-1'>
          <p>{row.original?.expand?.order?.startLocation}</p>
          <MoveRight />
          <p>{row.original?.expand?.order?.endLocation}</p>
        </div>
      ),
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
      cell: ({ row }) => <div className={`${getStatusColor(row.original.status)} rounded-xl px-4 py-2 text-center`}>{row.original.status}</div>,
    },
    {
      id: 'actions',
      accessorKey: 'actions',
      header: 'Actions',
      filterable: false,
      cell: ({ row }) => (
        <TransportActions
          row={row}
          redirectLink={redirectLink(row?.original?.id)}
          updateLink={updateLocation(row?.original?.id)}
          trackLink={trackLocation(row?.original?.id)}
          user={user}
          deleteItem={deleteItem}
          handleStatusUpdate={handleStatusUpdate}
        />
      ),
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Delivered':
        return 'bg-green-100 text-green-800';
      case 'In Transit':
        return 'bg-yellow-100 text-yellow-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  useEffect(() => {
    if (data?.length > 0 && user?.id) {
      let filtered_data = [];
      switch (user?.role) {
        case 'Customer':
          filtered_data = data.filter((item) => item?.expand?.order?.customer === user?.id)
          break;
        case 'Merchant':
          filtered_data = data.filter((item) => item?.expand?.order?.expand?.provider?.author === user?.id)
          break;
        case 'Root':
          filtered_data = data;
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
      <Stats original={filteredData} detail={displayData} setDetail={setDisplayData} />
      <div className="border-2 md:bg-accent md:p-4 rounded-xl mt-8">
        {
          useIsMobile() ? (
            <>
              <h1 className="text-xl font-semibold p-4">Order Movements</h1>
              {
                (user?.role === 'Merchant' || user?.role === 'Root') && (
                  <div className="flex justify-end p-4">
                    <Form />
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
                <h1 className="text-lg font-semibold">Order Movements</h1>
                {
                  (user?.role === 'Merchant' || user?.role === 'Root') && (
                    <Form />
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
  )
};
