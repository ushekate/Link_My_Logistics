import DetailsActions from '@/components/actions-buttons/DetailsActions';
import MobileDataTable from '@/components/ui/MobileDataTable';
import { DataTable } from '@/components/ui/Table';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { useCollection } from '@/hooks/useCollection';
import { useEffect, useState } from 'react';
import EditForm from './EditForm';
import Form from './Form';

export default function VehicleManagementTable() {
  const { data, deleteItem } = useCollection('vehicles', {
    expand: 'ownedBy',
  });
  const { user } = useAuth();
  const [filteredData, setFilteredData] = useState([]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Open':
        return 'bg-success-light text-success border-2 border-success-border';
      case 'Busy':
        return 'bg-yellow-100 text-yellow-800 border-2 border-yellow-500';
      case 'Damaged':
        return 'bg-red-100 text-red-800 border-2 border-red-600';
      default:
        return 'bg-gray-100 text-gray-800 border-2 border-gray-500';
    }
  };

  const columns = [
    {
      id: 'id',
      accessorKey: 'id',
      header: 'Vehicle ID',
      filterable: true,
      cell: ({ row }) => <div>{row.original.id}</div>,
    },
    {
      id: 'vehicleNo',
      accessorKey: 'vehicleNo',
      header: 'Vehicle No.',
      filterable: true,
      cell: ({ row }) => <div>{row.original.vehicleNo}</div>,
    },
    {
      id: 'ownedBy',
      accessorKey: 'expand.ownedBy.name',
      header: 'Owned By',
      filterable: true,
      cell: ({ row }) => <div>{row.original?.expand?.ownedBy?.name}</div>,
    },
    {
      id: 'name',
      accessorKey: 'name',
      header: 'Name',
      filterable: true,
      cell: ({ row }) => <div>{row.original.name}</div>,
    },
    {
      id: 'status',
      accessorKey: 'status',
      header: 'Status',
      filterable: true,
      cell: ({ row }) => (
        <div className={`px-2 py-1 text-xs rounded-full ${getStatusColor(row.original.status)}`}>
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
          showEye={false}
        />
      ),
    }
  ];

  useEffect(() => {
    if (data?.length > 0 && user?.id) {
      const filtered_data = data.filter((item) => item?.ownedBy === user?.id);
      setFilteredData(filtered_data);
    }
  }, [data]);


  return (
    <div className="border-2 md:bg-accent md:p-4 rounded-xl mt-8">
      {
        useIsMobile() ? (
          <>
            <h1 className="text-xl font-semibold p-4">Vehicles</h1>
            <div className="flex justify-end p-4">
              <Form />
            </div>
            <MobileDataTable
              columns={columns}
              data={filteredData}
            />
          </>
        ) : (
          <>
            <div className="flex items-center justify-between gap-4">
              <h1 className="text-lg font-semibold">Vehicles</h1>
              <Form />
            </div>

            <DataTable
              columns={columns}
              data={filteredData}
            />
          </>
        )
      }
    </div>
  )
}
