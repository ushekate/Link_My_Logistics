import MobileDataTable from '@/components/ui/MobileDataTable';
import { DataTable } from '@/components/ui/Table';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { useCollection } from '@/hooks/useCollection';
import { CircleCheckBig, CircleX, Eye, Trash } from 'lucide-react';
import { toast } from 'sonner';
import EditForm from './EditForm';

export default function RequestTable() {
  const { data, deleteItem, updateItem, mutation } = useCollection('warehouse_pricing_request', {
    expand: 'user,serviceProvider'
  });
  const { user } = useAuth();

  const handleStatusUpdate = async (id, status = 'Pending') => {
    try {
      await updateItem(id, {
        status: status,
        golVerified: true,
        golVerifiedBy: user?.id
      });
      toast.success('Updated');
    } catch (error) {
      console.log(error)
      toast.error(error.message);
    } finally {
      mutation()
    }
  }

  const columns = [
    {
      id: 'User',
      accessorKey: 'user',
      header: 'User',
      filterable: true,
      cell: ({ row }) => <div>{row.original?.expand?.user?.name}</div>,
    },
    {
      id: 'serviceProvider',
      accessorKey: 'serviceProvider',
      header: 'Service Provider',
      filterable: true,
      cell: ({ row }) => <div>{row.original?.expand?.serviceProvider?.title}</div>,
    },
    {
      id: 'type',
      accessorKey: 'type',
      header: 'Type',
      filterable: true,
      cell: ({ row }) => <div>{row.original?.type}</div>,
    },
    {
      id: 'preferableRate',
      accessorKey: 'preferableRate',
      header: 'Preferable Rate',
      filterable: true,
      cell: ({ row }) => <div> Rs. {row.original?.preferableRate?.toLocaleString()} </div>,
    },
    {
      id: 'noOfContainers',
      accessorKey: 'noOfContainers',
      header: 'No. of Containers',
      filterable: true,
      cell: ({ row }) => <div> {row.original?.noOfContainers?.toLocaleString()} </div>,
    },
    {
      id: 'avgContainerSize',
      accessorKey: 'avgContainerSize',
      header: 'Avg. Container Size',
      filterable: true,
      cell: ({ row }) => <div> {row.original?.avgContainerSize?.toLocaleString()} </div>,
    },
    {
      id: 'containersPerMonth',
      accessorKey: 'containersPerMonth',
      header: 'Containers Per Month',
      filterable: true,
      cell: ({ row }) => <div> {row.original?.containersPerMonth?.toLocaleString()} </div>,
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
        <div className='flex gap-2 items-center'>
          <Eye
            size={18}
            className="cursor-pointer text-primary"
            onClick={() => console.log('View details for', row.original.id)}
          />
          <CircleCheckBig
            size={18}
            className="cursor-pointer text-primary"
            onClick={() => handleStatusUpdate(row.original.id, 'Accepted')}
          />
          <CircleX
            size={18}
            className="cursor-pointer text-primary"
            onClick={() => handleStatusUpdate(row.original.id, 'Rejected')}
          />
          <EditForm info={row.original} />
          <Trash
            size={18}
            className="cursor-pointer text-primary"
            onClick={async () => {
              console.log('Delete details for', row.original.id);
              const confirmation = confirm('Are you sure you want to delete this entry?');
              if (confirmation) {
                await deleteItem(row.original.id);
              }
            }}
          />
        </div>
      ),
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Accepted':
        return 'bg-success-light text-success';
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div>
      <div className="border-2 md:bg-accent md:p-4 rounded-xl md:mt-8">
        <h1 className="text-xl font-semibold md:p-0 p-4">Requests List</h1>
        {
          useIsMobile() ? (
            <MobileDataTable
              columns={columns}
              data={data?.length > 0 ? data : []}
              displayButtons={true}
              displayFilters={true}
            />
          ) : (
            <DataTable
              columns={columns}
              data={data}
            />
          )
        }
      </div>
    </div>
  );
};
