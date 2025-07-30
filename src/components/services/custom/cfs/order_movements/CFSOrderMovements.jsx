import { DataTable } from '@/components/ui/Table';
import { useCollection } from '@/hooks/useCollection'
import Form from './Form';
import EditForm from './EditForm';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileDataTable from '@/components/ui/MobileDataTable';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';

export default function CustomCFSOrderMovements() {
	const { data, deleteItem } = useCollection('custom_cfs_order_movement', {
		expand: 'order,order.cfs',
	});
	const { user } = useAuth();
	const [filteredData, setFilteredData] = useState([]);

	const redirectLink = (id) => {
		switch (user?.role) {
			case 'Merchant':
				return `/client/cfs/order-movement/view/${id}`
			case 'Customer':
				return `/customer/cfs/order-movement/view/${id}`
			case 'Root':
				return `/gol/cfs/order-movement/view/${id}`
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
			id: 'igmNo',
			accessorKey: 'expand.order.igmNo',
			header: 'IGM No',
			filterable: true,
			cell: ({ row }) => <div>{row.original?.expand?.order?.igmNo}</div>,
		},
		{
			id: 'blNo',
			accessorKey: 'expand.order.blNo',
			header: 'BL No',
			filterable: true,
			cell: ({ row }) => <div>{row.original?.expand?.order?.blNo}</div>,
		},
		{
			id: 'boeNo',
			accessorKey: 'expand?.order?.boeNo',
			header: 'BOE No',
			filterable: true,
			cell: ({ row }) => <div>{row.original?.expand?.order?.boeNo}</div>,
		},
		{
			id: 'status',
			accessorKey: 'status',
			header: 'Status',
			filterable: true,
			cell: ({ row }) => <div className='font-semibold'>{row.original.status}</div>,
		},
		{
			id: 'remarks',
			accessorKey: 'remarks',
			header: 'Remarks',
			filterable: true,
			cell: ({ row }) => <div>{row.original.remarks}</div>,
		},
		{
			id: 'date',
			accessorKey: 'date',
			header: 'Execution Date',
			filterable: true,
			cell: ({ row }) => <div>
				{
					new Date(row.original.date).toLocaleDateString('en-US', {
						day: 'numeric',
						month: 'short',
						year: 'numeric',
					})
				}
			</div>,
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
          redirectLink={redirectLink(row?.original?.id)}
        />
			),
		}
	];

	useEffect(() => {
		if (data?.length > 0 && user?.id) {
			const filtered_data = data.filter((item) => item?.expand?.order?.expand?.cfs?.author === user?.id);
			setFilteredData(filtered_data);
		}
	}, [data]);

	return (
		<div className="border-2 md:bg-accent md:p-4 rounded-xl mt-8">
			{
				useIsMobile() ? (
					<>
						<h1 className="text-xl font-semibold p-4">Order Movements</h1>
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
							<h1 className="text-lg font-semibold">Order Movements</h1>
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
};
