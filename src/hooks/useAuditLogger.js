import { useAuth } from '@/contexts/AuthContext';
import { createAuditLoggerWithContext, AUDIT_ACTIONS, AUDIT_MODULES } from '@/utils/auditLogger';

/**
 * Custom hook for audit logging with automatic user context
 * @returns {Object} Audit logging functions with user context
 */
export function useAuditLogger() {
  const { user } = useAuth();
  
  // Create audit logger with current user context
  const auditLogger = createAuditLoggerWithContext(user);
  
  return {
    // Core logging function
    log: auditLogger.log,
    
    // Convenience functions
    logUserAction: auditLogger.logUserAction,
    logSystemAction: auditLogger.logSystemAction,
    logOrderAction: auditLogger.logOrderAction,
    
    // Quick access to constants
    ACTIONS: AUDIT_ACTIONS,
    MODULES: AUDIT_MODULES,
    
    // Specific action helpers
    logCreate: (module, subModule, details) => auditLogger.log({
      action: AUDIT_ACTIONS.CREATE,
      module,
      subModule,
      details
    }),
    
    logEdit: (module, subModule, details) => auditLogger.log({
      action: AUDIT_ACTIONS.EDIT,
      module,
      subModule,
      details
    }),
    
    logDelete: (module, subModule, details) => auditLogger.log({
      action: AUDIT_ACTIONS.DELETE,
      module,
      subModule,
      details
    }),
    
    // Module-specific helpers
    logOrderCreate: (orderType, orderId, customerName) => auditLogger.log({
      action: AUDIT_ACTIONS.CREATE,
      module: AUDIT_MODULES.ORDERS,
      subModule: orderType,
      details: `Created new ${orderType} order ${orderId} for customer ${customerName}`
    }),
    
    logOrderUpdate: (orderType, orderId, changes) => auditLogger.log({
      action: AUDIT_ACTIONS.EDIT,
      module: AUDIT_MODULES.ORDERS,
      subModule: orderType,
      details: `Updated ${orderType} order ${orderId}: ${changes}`
    }),
    
    logOrderDelete: (orderType, orderId) => auditLogger.log({
      action: AUDIT_ACTIONS.DELETE,
      module: AUDIT_MODULES.ORDERS,
      subModule: orderType,
      details: `Deleted ${orderType} order ${orderId}`
    }),
    
    logUserCreate: (newUserEmail, role) => auditLogger.log({
      action: AUDIT_ACTIONS.CREATE,
      module: AUDIT_MODULES.USERS,
      details: `Created new user account for ${newUserEmail} with role ${role}`
    }),
    
    logUserUpdate: (targetUserEmail, changes) => auditLogger.log({
      action: AUDIT_ACTIONS.EDIT,
      module: AUDIT_MODULES.USERS,
      details: `Updated user ${targetUserEmail}: ${changes}`
    }),
    
    logUserDelete: (targetUserEmail) => auditLogger.log({
      action: AUDIT_ACTIONS.DELETE,
      module: AUDIT_MODULES.USERS,
      details: `Deleted user account for ${targetUserEmail}`
    }),
    
    logSettingsChange: (settingName, oldValue, newValue) => auditLogger.log({
      action: AUDIT_ACTIONS.EDIT,
      module: AUDIT_MODULES.SYSTEM,
      subModule: AUDIT_MODULES.SETTINGS,
      details: `Changed system setting '${settingName}' from '${oldValue}' to '${newValue}'`
    }),
    
    logBackupCreate: (backupName, size) => auditLogger.log({
      action: AUDIT_ACTIONS.CREATE,
      module: AUDIT_MODULES.BACKUP,
      details: `Created system backup '${backupName}' (${size})`
    }),
    
    logBackupRestore: (backupName) => auditLogger.log({
      action: 'Restore',
      module: AUDIT_MODULES.BACKUP,
      details: `Restored system from backup '${backupName}'`
    }),
    
    logPricingUpdate: (serviceType, changes) => auditLogger.log({
      action: AUDIT_ACTIONS.EDIT,
      module: AUDIT_MODULES.PRICING,
      subModule: serviceType,
      details: `Updated pricing for ${serviceType}: ${changes}`
    }),
    
    logTariffUpload: (fileName, serviceType) => auditLogger.log({
      action: AUDIT_ACTIONS.CREATE,
      module: AUDIT_MODULES.TARIFF,
      subModule: serviceType,
      details: `Uploaded new tariff file '${fileName}' for ${serviceType}`
    }),
    
    logReportGenerate: (reportType, parameters) => auditLogger.log({
      action: 'Generate',
      module: AUDIT_MODULES.REPORTS,
      subModule: reportType,
      details: `Generated ${reportType} report with parameters: ${JSON.stringify(parameters)}`
    }),
    
    // Current user info
    currentUser: user
  };
}

export default useAuditLogger;
