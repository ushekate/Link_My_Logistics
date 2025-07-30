import { DataTable } from '@/components/ui/Table';
import { useCollection } from '@/hooks/useCollection'
import React, { useEffect, useState } from 'react'
import Form from './Form';
import EditForm from './EditForm';
import { useAuth } from '@/contexts/AuthContext';
import MobileDataTable from '@/components/ui/MobileDataTable';
import { useIsMobile } from '@/hooks/use-mobile';
import DetailsActions from '@/components/actions-buttons/DetailsActions';
import Badge from '@/components/ui/Badge';

export default function PackagesManagementTable() {
  const { data, deleteItem } = useCollection('custom_packages',{
    expand: 'services'
  });
	const { user } = useAuth();
	const [filteredData, setFilteredData] = useState([]);

	const columns = [
		{
			id: 'id',
			accessorKey: 'id',
			header: 'Package ID',
			filterable: true,
			cell: ({ row }) => <div>{row.original.id}</div>,
		},
		{
			id: 'title',
			accessorKey: 'title',
			header: 'Title',
			filterable: true,
			cell: ({ row }) => <div>{row.original.title}</div>,
		},
		{
			id: 'description',
			accessorKey: 'description',
			header: 'Description',
			filterable: true,
			cell: ({ row }) => <div>{row.original?.description}</div>,
		},
    {
      id: 'services',
      accessorKey: 'expand.services.',
      header: 'Services',
      filterable: false,
      cell: ({ row }) => (
        <div className='grid grid-cols-2 gap-2 min-w-[200px]'>
          {
            row.original?.expand?.services
              .slice(0, 5)
              .map((service, index) => (
                <Badge key={index} variant="secondary" className='flex items-center justify-center'>
                  {service.title}
                </Badge>
              ))
          }
          {row.original?.expand?.services.length > 6 && '& so on'}
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
			const filtered_data = data;
			setFilteredData(filtered_data);
		}
	}, [data]);


	return (
		<div className="border-2 md:bg-accent md:p-4 rounded-xl mt-8">
			{
				useIsMobile() ? (
					<>
						<h1 className="text-xl font-semibold p-4">Packages</h1>
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
							<h1 className="text-lg font-semibold">Packages</h1>
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
