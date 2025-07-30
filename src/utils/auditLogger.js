import pbclient from '@/lib/db';
import { AUDIT_ACTIONS, AUDIT_MODULES } from '@/constants/audit';

/**
 * Utility function to create audit log entries
 * @param {Object} params - Audit log parameters
 * @param {string} params.action - Action performed (Create, Edit, Delete)
 * @param {string} params.module - Module name (e.g., "Orders", "Users", "System")
 * @param {string} params.subModule - Sub-module name (optional)
 * @param {string} params.details - Detailed description of the action
 * @param {string} params.userId - ID of the user performing the action (optional, will use current user if not provided)
 * @param {Object} params.userContext - User context object from AuthContext (optional)
 * @returns {Promise<Object|null>} Created audit log record or null if failed
 */
export async function createAuditLog({
  action,
  module,
  subModule = null,
  details,
  userId = null,
  userContext = null
}) {
  try {
    // Get current user from multiple sources
    let currentUser = userId;

    if (!currentUser && userContext) {
      currentUser = userContext.id;
    }

    if (!currentUser && pbclient.authStore.record) {
      currentUser = pbclient.authStore.record.id;
    }

    if (!currentUser) {
      console.warn('No user found for audit log entry');
      return null;
    }

    // Validate required fields
    if (!action || !module || !details) {
      console.error('Missing required fields for audit log:', { action, module, details });
      return null;
    }

    // Create audit log entry
    const auditData = {
      user: currentUser,
      action: action,
      module: module,
      subModule: subModule,
      details: details
    };

    const record = await pbclient.collection('audit_logs').create(auditData);

    console.log('Audit log created:', record);
    return record;

  } catch (error) {
    console.error('Failed to create audit log:', error);
    return null;
  }
}

/**
 * Enhanced audit logger that accepts user context from AuthContext
 * @param {Object} userContext - User object from AuthContext
 * @returns {Object} Audit logger functions with user context
 */
export function createAuditLoggerWithContext(userContext) {
  return {
    log: (params) => createAuditLog({ ...params, userContext }),
    logUserAction: (action, details) => createAuditLog({
      action,
      module: AUDIT_MODULES.USERS,
      details,
      userContext
    }),
    logSystemAction: (action, details) => createAuditLog({
      action,
      module: AUDIT_MODULES.SYSTEM,
      details,
      userContext
    }),
    logOrderAction: (action, orderType, details) => createAuditLog({
      action,
      module: AUDIT_MODULES.ORDERS,
      subModule: orderType,
      details,
      userContext
    })
  };
}


/**
 * Helper functions for common audit log scenarios
 */

export const createGeneralAuditLog = async ({
  action,
  module,
  subModule = null,
  details = {
    id: ''
  }
}) => {

  try {
    // Get current user from multiple sources
    const currentUser = pbclient.authStore.record.id;

    if (!currentUser) {
      console.warn('No user found for audit log entry');
      return null;
    }

    // Validate required fields
    if (!action || !module) {
      console.error('Missing required fields for audit log:', { action, module, details });
      return null;
    }

    // Create audit log entry
    const auditData = {
      user: currentUser,
      action: action,
      module: module,
      subModule: subModule,
      details: `${action} ${action === AUDIT_ACTIONS.CREATE ? 'new' : 'existing'} ${module} ${subModule} entry : ${details?.id}`
    };

    const record = await pbclient.collection('audit_logs').create(auditData);

    console.log('Audit log created:', record);
    return record;

  } catch (error) {
    console.error('Failed to create audit log:', error);
    return null;
  }
}

// User authentication logs
export const logUserLogin = (userEmail, userContext = null) => {
  return createAuditLog({
    action: AUDIT_ACTIONS.LOGIN,
    module: AUDIT_MODULES.AUTHENTICATION,
    details: `User ${userEmail} logged in successfully`,
    userContext
  });
};

export const logUserLogout = (userEmail, userContext = null) => {
  return createAuditLog({
    action: AUDIT_ACTIONS.LOGOUT,
    module: AUDIT_MODULES.AUTHENTICATION,
    details: `User ${userEmail} logged out`,
    userContext
  });
};

export const logFailedLogin = (userEmail, userContext = null) => {
  return createAuditLog({
    action: AUDIT_ACTIONS.FAILED,
    module: AUDIT_MODULES.AUTHENTICATION,
    details: `Failed login attempt for ${userEmail}`,
    userContext
  });
};

// User management logs
export const logUserCreated = (newUserEmail, role) => {
  return createAuditLog({
    action: AUDIT_ACTIONS.CREATE,
    module: AUDIT_MODULES.USERS,
    details: `Created new user account for ${newUserEmail} with role ${role}`
  });
};

export const logUserUpdated = (targetUserEmail, changes) => {
  return createAuditLog({
    action: AUDIT_ACTIONS.EDIT,
    module: AUDIT_MODULES.USERS,
    details: `Updated user ${targetUserEmail}: ${changes}`
  });
};

export const logUserDeleted = (targetUserEmail) => {
  return createAuditLog({
    action: AUDIT_ACTIONS.DELETE,
    module: AUDIT_MODULES.USERS,
    details: `Deleted user account for ${targetUserEmail}`
  });
};

// System logs
export const logSystemSettingsChanged = (settingName, oldValue, newValue) => {
  return createAuditLog({
    action: AUDIT_ACTIONS.EDIT,
    module: AUDIT_MODULES.SYSTEM,
    subModule: AUDIT_MODULES.SETTINGS,
    details: `Changed system setting '${settingName}' from '${oldValue}' to '${newValue}'`
  });
};

export const logBackupCreated = (backupName, size) => {
  return createAuditLog({
    action: AUDIT_ACTIONS.CREATE,
    module: AUDIT_MODULES.BACKUP,
    details: `Created system backup '${backupName}' (${size})`
  });
};

export const logBackupRestored = (backupName) => {
  return createAuditLog({
    action: AUDIT_ACTIONS.RESTORE,
    module: AUDIT_MODULES.BACKUP,
    details: `Restored system from backup '${backupName}'`
  });
};

// Report generation logs
export const logReportGenerated = (reportType, parameters) => {
  return createAuditLog({
    action: AUDIT_ACTIONS.GENERATE,
    module: AUDIT_MODULES.REPORTS,
    subModule: reportType,
    details: `Generated ${reportType} report with parameters: ${JSON.stringify(parameters)}`
  });
};

const auditLogger = {
  createAuditLog,
  logUserLogin,
  logUserLogout,
  logFailedLogin,
  logUserCreated,
  logUserUpdated,
  logUserDeleted,
  logSystemSettingsChanged,
  logBackupCreated,
  logBackupRestored,
  logReportGenerated
};

export default auditLogger;
