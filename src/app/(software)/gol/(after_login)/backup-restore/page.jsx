'use client';

import Badge from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { DataTable } from "@/components/ui/Table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import { useSidebar } from "@/contexts/SidebarProvider";
import {
    Activity,
    AlertCircle,
    Archive,
    BarChart3,
    Calendar,
    CheckCircle,
    Clock,
    CloudUpload,
    Database,
    Download,
    HardDrive,
    History,
    Layers,
    RefreshCw,
    Server,
    Settings,
    Shield,
    TrendingUp,
    Zap
} from "lucide-react";
import { useEffect, useState } from "react";

// Mock backup data - replace with actual data fetching
const mockBackupData = [
  {
    id: "1",
    name: "daily_backup_2024_01_15",
    type: "Automatic",
    size: "2.4 GB",
    created: "2024-01-15 02:00:00",
    status: "Completed",
    description: "Daily automated backup",
    retention: "30 days"
  },
  {
    id: "2",
    name: "manual_backup_2024_01_14",
    type: "Manual",
    size: "2.3 GB",
    created: "2024-01-14 16:30:00",
    status: "Completed",
    description: "Pre-update manual backup",
    retention: "90 days"
  },
  {
    id: "3",
    name: "weekly_backup_2024_01_08",
    type: "Automatic",
    size: "2.1 GB",
    created: "2024-01-08 02:00:00",
    status: "Completed",
    description: "Weekly automated backup",
    retention: "90 days"
  },
  {
    id: "4",
    name: "backup_in_progress",
    type: "Manual",
    size: "1.8 GB",
    created: "2024-01-15 14:45:00",
    status: "In Progress",
    description: "Current backup operation",
    retention: "30 days"
  }
];

// Mock restore history data
const mockRestoreHistory = [
  {
    id: "1",
    backupName: "daily_backup_2024_01_10",
    restoredAt: "2024-01-12 10:30:00",
    restoredBy: "admin@company.com",
    status: "Success",
    duration: "45 minutes",
    reason: "System recovery after hardware failure"
  },
  {
    id: "2",
    backupName: "manual_backup_2024_01_05",
    restoredAt: "2024-01-06 14:15:00",
    restoredBy: "manager@company.com",
    status: "Success",
    duration: "38 minutes",
    reason: "Data corruption recovery"
  }
];

// Define columns for backup table
const backupColumns = [
  {
    accessorKey: "name",
    header: "Backup Name",
    filterable: true,
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
          <Archive className="h-5 w-5 text-white" />
        </div>
        <div>
          <span className="font-semibold text-gray-900">{row.getValue("name")}</span>
          <div className="text-xs text-gray-500">Database backup</div>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "type",
    header: "Type",
    filterable: true,
    cell: ({ row }) => {
      const type = row.getValue("type");
      const isAutomatic = type === "Automatic";
      return (
        <div className="flex items-center gap-2">
          {isAutomatic ? <Zap className="h-4 w-4 text-blue-500" /> : <Settings className="h-4 w-4 text-purple-500" />}
          <Badge
            className={`font-medium border ${
              isAutomatic
                ? "bg-blue-100 text-blue-800 border-blue-200"
                : "bg-purple-100 text-purple-800 border-purple-200"
            }`}
          >
            {type}
          </Badge>
        </div>
      );
    },
  },
  {
    accessorKey: "size",
    header: "Size",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <HardDrive className="h-4 w-4 text-gray-400" />
        <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">{row.getValue("size")}</span>
      </div>
    ),
  },
  {
    accessorKey: "created",
    header: "Created",
    filterable: true,
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4 text-indigo-500" />
        <div className="font-mono text-sm bg-gray-50 px-2 py-1 rounded">
          {row.getValue("created")}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    filterable: true,
    cell: ({ row }) => {
      const status = row.getValue("status");
      const statusConfig = {
        "Completed": {
          bg: "bg-emerald-100",
          text: "text-emerald-800",
          border: "border-emerald-200",
          icon: <CheckCircle className="h-3 w-3" />
        },
        "In Progress": {
          bg: "bg-blue-100",
          text: "text-blue-800",
          border: "border-blue-200",
          icon: <Activity className="h-3 w-3 animate-spin" />
        },
        "Failed": {
          bg: "bg-red-100",
          text: "text-red-800",
          border: "border-red-200",
          icon: <AlertCircle className="h-3 w-3" />
        }
      };
      const config = statusConfig[status] || statusConfig["Completed"];
      return (
        <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${config.bg} ${config.text} ${config.border}`}>
          {config.icon}
          {status}
        </div>
      );
    },
  },
  {
    accessorKey: "retention",
    header: "Retention",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <Calendar className="h-4 w-4 text-gray-400" />
        <span className="text-sm text-gray-600">{row.getValue("retention")}</span>
      </div>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      const backup = row.original;
      const isCompleted = backup.status === "Completed";
      return (
        <div className="flex gap-2">
          <Button
            variant="outline"
            title="Download"
            icon={<Download className="h-4 w-4" />}
            textSize="text-xs"
            className={`px-3 py-2 transition-all duration-200 ${
              isCompleted
                ? "hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700"
                : "opacity-50 cursor-not-allowed"
            }`}
            disabled={!isCompleted}
          />
          <Button
            variant="outline"
            title="Restore"
            icon={<RefreshCw className="h-4 w-4" />}
            textSize="text-xs"
            className={`px-3 py-2 transition-all duration-200 ${
              isCompleted
                ? "hover:bg-success-light hover:border-success-border hover:text-success"
                : "opacity-50 cursor-not-allowed"
            }`}
            disabled={!isCompleted}
          />
        </div>
      );
    },
  },
];

// Define columns for restore history table
const restoreColumns = [
  {
    accessorKey: "backupName",
    header: "Backup Name",
    filterable: true,
    cell: ({ row }) => (
      <span className="font-medium">{row.getValue("backupName")}</span>
    ),
  },
  {
    accessorKey: "restoredAt",
    header: "Restored At",
    cell: ({ row }) => (
      <div className="font-mono text-sm">
        {row.getValue("restoredAt")}
      </div>
    ),
  },
  {
    accessorKey: "restoredBy",
    header: "Restored By",
    cell: ({ row }) => (
      <span className="text-sm">{row.getValue("restoredBy")}</span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status");
      return (
        <Badge variant={status === "Success" ? "default" : "destructive"}>
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "duration",
    header: "Duration",
    cell: ({ row }) => (
      <span className="text-sm">{row.getValue("duration")}</span>
    ),
  },
  {
    accessorKey: "reason",
    header: "Reason",
    cell: ({ row }) => (
      <div className="max-w-xs truncate text-sm text-gray-600">
        {row.getValue("reason")}
      </div>
    ),
  },
];

export default function BackupRestorePage() {
  const { setTitle } = useSidebar();
  const [backupData, setBackupData] = useState(mockBackupData);
  const [restoreHistory, setRestoreHistory] = useState(mockRestoreHistory);
  const [activeTab, setActiveTab] = useState("backups");

  useEffect(() => {
    setTitle("Backup & Restore");
  }, [setTitle]);

  const handleCreateBackup = () => {
    console.log("Creating new backup...");
    // Implementation for creating a new backup
  };

  const handleUploadBackup = () => {
    console.log("Uploading backup file...");
    // Implementation for uploading backup file
  };

  const handleRefresh = () => {
    console.log("Refreshing backup data...");
    // Implementation for refreshing data
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="relative overflow-hidden bg-white rounded-2xl shadow-xl border border-gray-200/50">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 via-blue-600/5 to-indigo-600/5"></div>
          <div className="relative p-8">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Server className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                    Backup & Restore Center
                  </h1>
                  <p className="text-gray-600 mt-1">Secure data management and disaster recovery solutions</p>
                  <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Shield className="h-4 w-4" />
                      Enterprise-grade security
                    </span>
                    <span className="flex items-center gap-1">
                      <Activity className="h-4 w-4" />
                      Automated backups active
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  title="Refresh"
                  icon={<RefreshCw className="h-4 w-4" />}
                  onClick={handleRefresh}
                  className="hover:bg-purple-50 hover:border-purple-300 transition-all duration-200"
                />
                <Button
                  variant="outline"
                  title="Upload Backup"
                  icon={<CloudUpload className="h-4 w-4" />}
                  onClick={handleUploadBackup}
                  className="hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
                />
                <Button
                  variant="default"
                  title="Create Backup"
                  icon={<Database className="h-4 w-4" />}
                  onClick={handleCreateBackup}
                  className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="group relative overflow-hidden bg-white rounded-2xl shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-blue-600/5"></div>
            <div className="relative p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Total Backups</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{backupData.length}</p>
                  <p className="text-sm text-blue-600 mt-1 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    All systems covered
                  </p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Database className="h-7 w-7 text-white" />
                </div>
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden bg-white rounded-2xl shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-emerald-600/5"></div>
            <div className="relative p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Completed</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {backupData.filter(item => item.status === "Completed").length}
                  </p>
                  <p className="text-sm text-emerald-600 mt-1 flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" />
                    Ready for restore
                  </p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <CheckCircle className="h-7 w-7 text-white" />
                </div>
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden bg-white rounded-2xl shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-amber-600/5"></div>
            <div className="relative p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">In Progress</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {backupData.filter(item => item.status === "In Progress").length}
                  </p>
                  <p className="text-sm text-amber-600 mt-1 flex items-center gap-1">
                    <Activity className="h-3 w-3 animate-spin" />
                    Currently running
                  </p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <Clock className="h-7 w-7 text-white" />
                </div>
              </div>
            </div>
          </div>

          <div className="group relative overflow-hidden bg-white rounded-2xl shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-purple-600/5"></div>
            <div className="relative p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Storage Used</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">9.6 GB</p>
                  <p className="text-sm text-purple-600 mt-1 flex items-center gap-1">
                    <BarChart3 className="h-3 w-3" />
                    78% of quota
                  </p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <HardDrive className="h-7 w-7 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content with Tabs */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="bg-gradient-to-r from-gray-50 to-purple-50 px-6 py-4 border-b border-gray-200/50">
              <TabsList className="grid w-full grid-cols-3 bg-white rounded-xl shadow-sm border border-gray-200">
                <TabsTrigger
                  value="backups"
                  className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white transition-all duration-200"
                >
                  <Archive className="h-4 w-4" />
                  Backups
                </TabsTrigger>
                <TabsTrigger
                  value="restore-history"
                  className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white transition-all duration-200"
                >
                  <History className="h-4 w-4" />
                  History
                </TabsTrigger>
                <TabsTrigger
                  value="settings"
                  className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-purple-600 data-[state=active]:text-white transition-all duration-200"
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="backups" className="p-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold flex items-center gap-3 text-gray-800">
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                        <Archive className="h-4 w-4 text-white" />
                      </div>
                      Available Backups
                    </h2>
                    <p className="text-sm text-gray-600 mt-1">Manage and restore from your backup collection</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm text-gray-600">Auto-backup enabled</span>
                  </div>
                </div>
                <DataTable
                  data={backupData}
                  columns={backupColumns}
                  displayButtons={true}
                  displayFilters={true}
                />
              </div>
            </TabsContent>

            <TabsContent value="restore-history" className="p-6">
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold flex items-center gap-3 text-gray-800">
                    <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center">
                      <History className="h-4 w-4 text-white" />
                    </div>
                    Restore History
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">Track all restore operations and their outcomes</p>
                </div>
                <DataTable
                  data={restoreHistory}
                  columns={restoreColumns}
                  displayButtons={true}
                  displayFilters={true}
                />
              </div>
            </TabsContent>

            <TabsContent value="settings" className="p-6">
              <div className="space-y-8">
                <div>
                  <h2 className="text-xl font-semibold flex items-center gap-3 text-gray-800">
                    <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                      <Settings className="h-4 w-4 text-white" />
                    </div>
                    Backup Configuration
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">Configure automated backup schedules and retention policies</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200/50">
                      <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4">
                        <Zap className="h-5 w-5 text-blue-600" />
                        Automatic Backup Schedule
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-blue-200/50 shadow-sm">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                              <Clock className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-800">Daily Backup</p>
                              <p className="text-sm text-gray-600">Every day at 2:00 AM</p>
                            </div>
                          </div>
                          <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">Enabled</Badge>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-blue-200/50 shadow-sm">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                              <Calendar className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-800">Weekly Backup</p>
                              <p className="text-sm text-gray-600">Every Sunday at 1:00 AM</p>
                            </div>
                          </div>
                          <Badge className="bg-emerald-100 text-emerald-800 border-emerald-200">Enabled</Badge>
                        </div>
                        <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-blue-200/50 shadow-sm">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-gray-400 to-gray-500 rounded-lg flex items-center justify-center">
                              <Archive className="h-5 w-5 text-white" />
                            </div>
                            <div>
                              <p className="font-semibold text-gray-800">Monthly Backup</p>
                              <p className="text-sm text-gray-600">First day of month at 12:00 AM</p>
                            </div>
                          </div>
                          <Badge className="bg-gray-100 text-gray-600 border-gray-200">Disabled</Badge>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl p-6 border border-purple-200/50">
                      <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4">
                        <Layers className="h-5 w-5 text-purple-600" />
                        Retention Policies
                      </h3>
                      <div className="space-y-4">
                        <div className="p-4 bg-white rounded-lg border border-purple-200/50 shadow-sm">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                              <Clock className="h-4 w-4 text-white" />
                            </div>
                            <p className="font-semibold text-gray-800">Daily Backups</p>
                          </div>
                          <p className="text-sm text-gray-600 ml-11">Retain for 30 days</p>
                        </div>
                        <div className="p-4 bg-white rounded-lg border border-purple-200/50 shadow-sm">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                              <Calendar className="h-4 w-4 text-white" />
                            </div>
                            <p className="font-semibold text-gray-800">Weekly Backups</p>
                          </div>
                          <p className="text-sm text-gray-600 ml-11">Retain for 90 days</p>
                        </div>
                        <div className="p-4 bg-white rounded-lg border border-purple-200/50 shadow-sm">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center">
                              <Archive className="h-4 w-4 text-white" />
                            </div>
                            <p className="font-semibold text-gray-800">Monthly Backups</p>
                          </div>
                          <p className="text-sm text-gray-600 ml-11">Retain for 1 year</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-gray-200">
                  <Button
                    variant="default"
                    title="Save Configuration"
                    icon={<Settings className="h-4 w-4" />}
                    className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-lg hover:shadow-xl transition-all duration-200"
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </section>
  );
}
