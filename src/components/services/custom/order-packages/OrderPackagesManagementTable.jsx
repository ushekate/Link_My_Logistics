import { DataTable } from "@/components/ui/Table";
import { useCollection } from "@/hooks/useCollection";
import React, { useEffect, useState } from "react";
import Form from "./Form";
import EditForm from "./EditForm";
import { useAuth } from "@/contexts/AuthContext";
import MobileDataTable from "@/components/ui/MobileDataTable";
import { useIsMobile } from "@/hooks/use-mobile";
import DetailsActions from "@/components/actions-buttons/DetailsActions";

export default function OrderPackagesManagementTable() {
  const { data, deleteItem } = useCollection("custom_order_packages", {
    expand: "cfs,cfs.cfs,transport,transport.provider,warehouse,warehouse.provider,customer",
  });
  const { user } = useAuth();
  const [filteredData, setFilteredData] = useState([]);
  const [filteredColumns, setFilteredColumns] = useState([]);

  const columns = [
    {
      id: "id",
      accessorKey: "id",
      header: "Package ID",
      filterable: true,
      cell: ({ row }) => <div>{row.original.id}</div>,
    },
    {
      id: "title",
      accessorKey: "title",
      header: "Title",
      filterable: true,
      cell: ({ row }) => <div>{row.original.title}</div>,
    },
    {
      id: "description",
      accessorKey: "description",
      header: "Description",
      filterable: true,
      cell: ({ row }) => <div>{row.original.description}</div>,
    },
    {
      id: "cfs",
      accessorKey: "cfs",
      header: "CFS Order",
      filterable: true,
      cell: ({ row }) => <div>{row.original.cfs}</div>,
    },
    {
      id: "transport",
      accessorKey: "transport",
      header: "Transport Order",
      filterable: true,
      cell: ({ row }) => <div>{row.original.transport}</div>,
    },
    {
      id: "warehouse",
      accessorKey: "warehouse",
      header: "Warehouse Order",
      filterable: true,
      cell: ({ row }) => <div>{row.original.warehouse}</div>,
    },
    {
      id: "createdBy",
      accessorKey: "warehouse",
      header: "Created By",
      filterable: true,
      cell: ({ row }) => <div>{row.original?.expand?.customer?.username}</div>,
    },
    {
      id: "actions",
      accessorKey: "actions",
      header: "Actions",
      filterable: false,
      cell: ({ row }) => (
        <DetailsActions
          row={row}
          EditForm={EditForm}
          deleteItem={deleteItem}
          showEye={false}
        />
      ),
    },
  ];

  useEffect(() => {
    if (data?.length > 0 && user?.id) {
      let filtered_data = [];
      let filtered_columns = [];
      console.log("Data", data);
      switch (user?.role) {
        case "Customer":
          filtered_data = data.filter((item) => {
            const matchesCFS = item?.expand?.cfs?.customer === user?.id;
            const matchesTransport = item?.expand?.transport?.customer === user?.id;
            const matchesWarehouse = item?.expand?.warehouse?.customer === user?.id;
            return matchesCFS || matchesTransport || matchesWarehouse;
          });
          filtered_columns = columns.filter((item) => item?.id !== "createdBy");
          break;
        case "Merchant":
          filtered_data = data.filter((item) => {
            const matchesCFS = item?.expand?.cfs?.expand?.cfs?.author === user?.id;
            const matchesTransport = item?.expand?.transport?.expand?.provider?.author === user?.id;
            const matchesWarehouse = item?.expand?.warehouse?.expand?.provider?.author === user?.id;
            return matchesCFS || matchesTransport || matchesWarehouse;
          });
          filtered_columns = columns;
          break;
        case "Root":
          filtered_data = data;
          filtered_columns = columns;
          break;
        default:
          break;
      }
      setFilteredData(filtered_data);
      setFilteredColumns(filtered_columns);
    }
  }, [data, user]);

  return (
    <div className="border-2 md:bg-accent md:p-4 rounded-xl mt-8">
      {useIsMobile() ? (
        <>
          <h1 className="text-xl font-semibold p-4">Packages</h1>
          {
            user?.role === 'Root' && (
              <div className="flex justify-end p-4">
                <Form />
              </div>
            )
          }
          <MobileDataTable columns={filteredColumns} data={filteredData} />
        </>
      ) : (
        <>
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-lg font-semibold">Packages</h1>
            {
              user?.role === 'Root' && (
                <Form />
              )
            }
          </div>

          <DataTable columns={filteredColumns} data={filteredData} />
        </>
      )}
    </div>
  );
}
