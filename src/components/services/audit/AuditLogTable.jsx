import { DataTable } from '@/components/ui/Table';
import Badge from '@/components/ui/Badge';
import {
  User,
  Activity,
  Shield,
  Globe,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

// Helper function to format date
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  } catch (error) {
    return dateString;
  }
};

// Helper function to get user display name
const getUserDisplayName = (userRecord) => {
  if (!userRecord) return 'System';

  if (userRecord.firstname && userRecord.lastname) {
    return `${userRecord.firstname} ${userRecord.lastname}`;
  }

  if (userRecord.username) {
    return userRecord.username;
  }

  if (userRecord.email) {
    return userRecord.email;
  }

  return 'Unknown User';
};

// Helper function to determine status based on action
const getActionStatus = (action) => {
  if (!action) return 'Success';

  const failureActions = ['Failed', 'Error', 'Denied', 'Rejected'];
  const isFailure = failureActions.some(failure =>
    action.toLowerCase().includes(failure.toLowerCase())
  );

  return isFailure ? 'Failed' : 'Success';
};

// Define columns for the audit log table
const auditColumns = [
  {
    accessorKey: "created",
    header: "Timestamp",
    filterable: true,
    cell: ({ row }) => (
      <>
        {formatDate(row.getValue("created"))}
      </>
    ),
  },
  {
    accessorKey: "expand.user",
    header: "User",
    filterable: true,
    cell: ({ row }) => {
      const userRecord = row.original.expand?.user;
      const displayName = getUserDisplayName(userRecord);
      const userEmail = userRecord?.email || 'No email';

      return (
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback>{displayName?.charAt(0)?.toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <span className="text-sm font-medium text-gray-900">{displayName}</span>
            <div className="text-xs text-gray-500">{userEmail}</div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "action",
    header: "Action",
    filterable: true,
    cell: ({ row }) => {
      const action = row.getValue("action");
      return (
        <Badge variant='outline'>
          {action || 'Unknown'}
        </Badge>
      );
    },
  },
  {
    accessorKey: "module",
    header: "Module",
    filterable: true,
    cell: ({ row }) => {
      const module = row.getValue("module") || 'System';
      const subModule = row.original.subModule;
      const getModuleIcon = (module) => {
        if (module.toLowerCase().includes("auth")) return <Shield className="h-3 w-3 mr-2" />;
        if (module.toLowerCase().includes("system")) return <Activity className="h-3 w-3 mr-2" />;
        if (module.toLowerCase().includes("order")) return <Globe className="h-3 w-3 mr-2" />;
        return <Globe className="h-3 w-3" />;
      };
      return (
        <div className="flex items-center gap-2">
          <div className="flex flex-col">
            <Badge variant="outline" className="text-xs font-medium">
              {getModuleIcon(module)}
              {module}
            </Badge>
            {subModule && (
              <span className="text-xs text-gray-500 mt-1">{subModule}</span>
            )}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    filterable: true,
    cell: ({ row }) => {
      const action = row.original.action;
      const status = getActionStatus(action);
      const statusConfig = {
        "Success": {
          bg: "bg-emerald-100",
          text: "text-emerald-800",
          border: "border-emerald-200",
          icon: <TrendingUp className="h-3 w-3" />
        },
        "Failed": {
          bg: "bg-red-100",
          text: "text-red-800",
          border: "border-red-200",
          icon: <AlertTriangle className="h-3 w-3" />
        }
      };
      const config = statusConfig[status] || statusConfig["Success"];
      return (
        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${config.bg} ${config.text} ${config.border}`}>
          {config.icon}
          {status}
        </div>
      );
    },
  },
  {
    accessorKey: "details",
    header: "Details",
    cell: ({ row }) => {
      const details = row.getValue("details") || 'No details available';
      return (
        <>
          {details}
        </>
      );
    },
  },
];

export default function AuditLogTable({ auditData, loading = false }) {
  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden">
      <div className="p-6">
        <DataTable
          data={auditData || []}
          columns={auditColumns}
          displayButtons={true}
          displayFilters={true}
          loading={loading}
        />
      </div>
    </div>
  );
}
