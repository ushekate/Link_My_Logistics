import { Shield, Clock, Activity, User, RefreshCw, Download } from 'lucide-react';
import Button from '@/components/ui/Button';

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

export default function AuditLogHeader({ user, onRefresh, onExport }) {
  return (
    <div className="relative overflow-hidden bg-white rounded-2xl shadow-xl border border-gray-200/50">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-indigo-600/5"></div>
      <div className="relative p-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Security Audit Log
              </h1>
              <p className="text-gray-600 mt-1">Monitor and track all system activities in real-time</p>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  Logged in as: {getUserDisplayName(user)}
                </span>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              title="Refresh"
              icon={<RefreshCw className="h-4 w-4" />}
              onClick={onRefresh}
              className="rounded-md"
            />
            <Button
              variant="default"
              title="Export Report"
              icon={<Download className="h-4 w-4" />}
              onClick={onExport}
              className="rounded-md"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
