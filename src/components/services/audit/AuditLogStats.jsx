import { useMemo } from 'react';
import { Activity, TrendingUp, AlertTriangle, User } from 'lucide-react';

// Helper function to determine status based on action
const getActionStatus = (action) => {
  if (!action) return 'Success';
  
  const failureActions = ['Failed', 'Error', 'Denied', 'Rejected'];
  const isFailure = failureActions.some(failure => 
    action.toLowerCase().includes(failure.toLowerCase())
  );
  
  return isFailure ? 'Failed' : 'Success';
};

export default function AuditLogStats({ auditData }) {
  // Calculate statistics
  const statistics = useMemo(() => {
    if (!auditData) return { total: 0, success: 0, failed: 0, uniqueUsers: 0 };
    
    const total = auditData.length;
    const success = auditData.filter(item => getActionStatus(item.action) === 'Success').length;
    const failed = auditData.filter(item => getActionStatus(item.action) === 'Failed').length;
    const uniqueUsers = new Set(auditData.map(item => item.user).filter(Boolean)).size;
    
    return { total, success, failed, uniqueUsers };
  }, [auditData]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="group relative overflow-hidden bg-white rounded-2xl shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-blue-600/5"></div>
        <div className="relative p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Total Events</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{statistics.total}</p>
              <p className="text-sm text-blue-600 mt-1 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                All records
              </p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <Activity className="h-7 w-7 text-white" />
            </div>
          </div>
        </div>
      </div>

      <div className="group relative overflow-hidden bg-white rounded-2xl shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-emerald-600/5"></div>
        <div className="relative p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Successful</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{statistics.success}</p>
              <p className="text-sm text-emerald-600 mt-1 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                {statistics.total > 0 ? `${((statistics.success / statistics.total) * 100).toFixed(1)}% success rate` : 'No data'}
              </p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <TrendingUp className="h-7 w-7 text-white" />
            </div>
          </div>
        </div>
      </div>

      <div className="group relative overflow-hidden bg-white rounded-2xl shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300">
        <div className="absolute inset-0 bg-gradient-to-br from-red-500/10 to-red-600/5"></div>
        <div className="relative p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Failed</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{statistics.failed}</p>
              <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                {statistics.failed > 0 ? 'Requires attention' : 'All good'}
              </p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <AlertTriangle className="h-7 w-7 text-white" />
            </div>
          </div>
        </div>
      </div>

      <div className="group relative overflow-hidden bg-white rounded-2xl shadow-lg border border-gray-200/50 hover:shadow-xl transition-all duration-300">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-purple-600/5"></div>
        <div className="relative p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Active Users</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{statistics.uniqueUsers}</p>
              <p className="text-sm text-purple-600 mt-1 flex items-center gap-1">
                <User className="h-3 w-3" />
                {statistics.uniqueUsers > 0 ? 'Users tracked' : 'No activity'}
              </p>
            </div>
            <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <User className="h-7 w-7 text-white" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
