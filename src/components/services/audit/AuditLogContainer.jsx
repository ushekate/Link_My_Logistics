import { useEffect, useMemo } from "react";
import { useSidebar } from "@/contexts/SidebarProvider";
import { useAuth } from "@/contexts/AuthContext";
import { useCollection } from "@/hooks/useCollection";
import { RefreshCw } from "lucide-react";
import Button from "@/components/ui/Button";

import AuditLogHeader from "./AuditLogHeader";
import AuditLogStats from "./AuditLogStats";
import AuditLogTable from "./AuditLogTable";

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

export default function AuditLogContainer() {
  const { setTitle } = useSidebar();
  const { user, loading: authLoading } = useAuth();

  // Fetch audit logs from PocketBase
  const {
    data: auditData,
    error: auditError,
    mutation: refreshAuditData,
  } = useCollection('audit_logs', {
    expand: 'user',
    sort: '-created',
    perPage: 100
  });

  useEffect(() => {
    setTitle("Audit Log");
  }, [setTitle]);

  const handleExport = () => {
    if (!auditData || auditData.length === 0) {
      alert("No data to export");
      return;
    }

    // Create CSV content
    const headers = ['Timestamp', 'User', 'Action', 'Module', 'Sub Module', 'Details'];
    const csvContent = [
      headers.join(','),
      ...auditData.map(item => [
        formatDate(item.created),
        getUserDisplayName(item.expand?.user),
        item.action || 'N/A',
        item.module || 'N/A',
        item.subModule || 'N/A',
        `"${(item.details || 'N/A').replace(/"/g, '""')}"`
      ].join(','))
    ].join('\n');

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `audit_log_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRefresh = () => {
    refreshAuditData();
  };

  // Authentication check
  if (authLoading) {
    return (
      <section className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2 text-lg">Authenticating...</span>
          </div>
        </div>
      </section>
    );
  }

  // User access check
  if (!user) {
    return (
      <section className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="p-6 rounded-xl shadow-2xl bg-red-50 border border-red-200">
            <h2 className="text-lg font-semibold text-red-800 mb-2">Access Denied</h2>
            <p className="text-red-600">You must be logged in to view audit logs.</p>
          </div>
        </div>
      </section>
    );
  }

  // Loading state
  if (!auditData && !auditError) {
    return (
      <section className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2 text-lg">Loading audit logs...</span>
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (auditError) {
    return (
      <section className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="p-6 rounded-xl shadow-2xl bg-red-50 border border-red-200">
            <h2 className="text-lg font-semibold text-red-800 mb-2">Error Loading Audit Logs</h2>
            <p className="text-red-600 mb-4">
              {auditError.message || 'Failed to load audit data. Please try refreshing the page.'}
            </p>
            <Button
              variant="outline"
              title="Retry"
              icon={<RefreshCw className="h-4 w-4" />}
              onClick={handleRefresh}
              className="border-red-300 text-red-700 hover:bg-red-100"
            />
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen p-6">
      <div className="space-y-8">
        {/* Header Section */}
        <AuditLogHeader
          user={user}
          onRefresh={handleRefresh}
          onExport={handleExport}
        />

        {/* Statistics Dashboard */}
        <AuditLogStats auditData={auditData} />

        {/* Audit Events Table */}
        <AuditLogTable
          auditData={auditData}
          loading={!auditData && !auditError}
        />
      </div>
    </section>
  );
}
