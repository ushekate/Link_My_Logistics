/**
 * Predefined audit log actions
 */
export const AUDIT_ACTIONS = {
  CREATE: 'Created',
  EDIT: 'Edited',
  DELETE: 'Deleted',
  LOGIN: 'Login',
  LOGOUT: 'Logout',
  RESTORE: 'Restored',
  GENERATE: 'Generated',
  FAILED: 'Failed',
  REJECT: 'Rejected',
  APPROVE: 'Approved',
  CANCEL: 'Cancelled',
  ACCEPT: 'Accepted',
  SUBMIT: 'Submitted',
  PENDING: 'Pending',
  VERIFY: 'Verified',
};

/**
 * Predefined module names
 */
export const AUDIT_MODULES = {
  AUTHENTICATION: 'Authentication',
  USERS: 'Users',
  ORDERS: 'Orders',
  CFS: 'CFS',
  TRANSPORT: 'Transport',
  '3PL': '3PL',
  CUSTOM_CFS: 'Custom CFS',
  CUSTOM_WAREHOUSE: 'Custom Warehouse',
  CUSTOM_TRANSPORT: 'Custom Transport',
  CUSTOM_ORDER_PACKAGES: 'Custom Order Packages',
  CUSTOM_PACKAGES: 'Custom Packages',
  CUSTOM_PRICINGS: 'Custom Pricings',
  WAREHOUSE: 'Warehouse',
  SYSTEM: 'System',
  SETTINGS: 'Settings',
  BACKUP: 'Backup',
  REPORTS: 'Reports'
};
