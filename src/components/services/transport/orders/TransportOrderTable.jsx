import { CircleCheckBig, Download, Eye, Trash } from 'lucide-react';
import { DataTable } from '@/components/ui/Table';
import { useCollection } from '@/hooks/useCollection';
import Form from './Form';
import EditForm from './EditForm';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import MobileDataTable from '@/components/ui/MobileDataTable';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import Stats from './Stats';
import Link from 'next/link';
import RejectForm from './RejectForm';
import RequestsActions from '@/components/actions-buttons/RequestsActions';

export default function TransportOrderTable() {
	const { data, deleteItem, updateItem, mutation } = useCollection('transport_orders', {
		expand: 'provider'
	});
	const { user } = useAuth();
	const [filteredData, setFilteredData] = useState([]);
	const [displayData, setDisplayData] = useState([]);

	const handleStatusUpdate = async (id, status = 'Pending') => {
		try {
			switch (user?.role) {
				case 'Root':
					await updateItem(id, {
						status: status,
						golVerified: true,
						golVerifiedBy: user?.id
					});
					toast.success('Updated the order status.');
					break;
				case 'Merchant':
					await updateItem(id, {
						status: status,
						merchantVerified: true,
						merchantVerifiedBy: user?.id
					});
					toast.success('Updated the order status.');
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
				return `/client/transport/orders/view/${id}`
			case 'Customer':
				return `/customer/transport/orders/view/${id}`
			case 'Root':
				return `/gol/transport/orders/view/${id}`
			default:
				return ''
		}
	}

	const columns = [
		{
			id: 'id',
			accessorKey: 'id',
			header: 'Order ID',
			filterable: true,
			cell: ({ row }) => <div>{row.original.id}</div>,
		},
		{
			id: 'provider',
			accessorKey: 'expand.provider.title',
			header: 'Service Provider',
			filterable: true,
			cell: ({ row }) => <div>{row.original?.expand?.provider?.title}</div>,
		},
		{
			id: 'consigneeName',
			accessorKey: 'consigneeName',
			header: 'Consignee Name',
			filterable: true,
			cell: ({ row }) => <div>{row.original.consigneeName}</div>,
		},
		{
			id: 'chaName',
			accessorKey: 'chaName',
			header: 'CHA Name',
			filterable: true,
			cell: ({ row }) => <div>{row.original.chaName}</div>,
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
			cell: ({ row }) => <div>
				{
					new Date(row.original.endDate).toLocaleDateString('en-US', {
						day: 'numeric',
						month: 'short',
						year: 'numeric',
					})
				}
			</div>,
		},
		{
			id: 'startLocation',
			accessorKey: 'startLocation',
			header: 'Start Location',
			filterable: true,
			cell: ({ row }) => <div>{row.original.startLocation}</div>,
		},
		{
			id: 'endLocation',
			accessorKey: 'endLocation',
			header: 'End Location',
			filterable: true,
			cell: ({ row }) => <div>{row.original.endLocation}</div>,
		},
		{
			id: 'specialRequest',
			accessorKey: 'specialRequest',
			header: 'Special Request',
			filterable: true,
			cell: ({ row }) => <div>{row.original.specialRequest}</div>,
		},
		{
			id: 'vehicleDescription',
			accessorKey: 'vehicleDescription',
			header: 'Vehicle Description',
			filterable: true,
			cell: ({ row }) => <div>{row.original.vehicleDescription}</div>,
		},
		{
			id: 'orderDescription',
			accessorKey: 'orderDescription',
			header: 'Order Description',
			filterable: true,
			cell: ({ row }) => <div>{row.original.orderDescription}</div>,
		},
		{
			id: 'status',
			accessorKey: 'status',
			header: 'Status',
			filterable: true,
			cell: ({ row }) => <div className={`${getStatusColor(row.original.status)} rounded-xl px-4 py-2 text-center`}>{row.original.status}</div>,
		},
		{
			id: 'reason',
			accessorKey: 'reason',
			header: 'Reason',
			filterable: true,
			cell: ({ row }) => <div>{row.original?.reason}</div>,
		},
		{
			id: 'actions',
			accessorKey: 'actions',
			header: 'Actions',
			filterable: false,
			cell: ({ row }) => (
        <RequestsActions
          row={row}
          handleStatusUpdate={handleStatusUpdate}
          RejectForm={RejectForm}
          deleteItem={deleteItem}
          user={user}
          redirectLink={redirectLink(row?.original?.id) || ''}
          EditForm={EditForm}
        />
			),
		}
	];

	const getStatusColor = (status) => {
		switch (status) {
			case 'Accepted':
				return 'bg-green-100 text-green-800';
			case 'Pending':
				return 'bg-yellow-100 text-yellow-800';
			case 'Rejected':
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
					filtered_data = data.filter((item) => item?.customer === user?.id);
					break;
				case 'Merchant':
					filtered_data = data.filter((item) => item?.expand?.provider?.author === user?.id && item?.golVerified);
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
			<Stats original={filteredData} orders={displayData} setOrders={setDisplayData} />
			<div className="border-2 md:bg-accent md:p-4 rounded-xl mt-4">
				{
					useIsMobile() ? (
						<>
							<h1 className="text-xl font-semibold p-4">
								{user?.role === 'Customer' ? 'My Orders' : 'Customer Orders'}
							</h1>
							{
								user?.role === 'Customer' && (
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
								<h1 className="text-xl font-semibold p-4">
									{user?.role === 'Customer' ? 'My Orders' : 'Customer Orders'}
								</h1>
								{
									user?.role === 'Customer' && (
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
