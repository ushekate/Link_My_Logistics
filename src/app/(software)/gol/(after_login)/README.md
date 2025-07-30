# Modern UI Pages - Audit Log & Backup Restore

## 🛡️ Security Audit Log Page
**Location:** `/audit-log/page.jsx`

### ✨ Modern Features:
- **🎨 Beautiful Gradient Design**: Modern gradient backgrounds and glass-morphism effects
- **📊 Interactive Statistics Cards**: Animated hover effects with gradient icons
- **🔍 Advanced Filtering System**: Elegant filter interface with icon-enhanced inputs
- **📈 Real-time Monitoring**: Live status indicators and auto-refresh capabilities
- **🎯 Enhanced Data Visualization**: Color-coded status badges and intuitive icons
- **📱 Responsive Design**: Optimized for all screen sizes with smooth transitions

### 🎨 UI Enhancements:
- **Gradient Backgrounds**: Subtle blue-to-indigo gradients throughout
- **Modern Cards**: Rounded corners, shadows, and hover animations
- **Icon Integration**: Contextual Lucide icons for better visual hierarchy
- **Color-coded Elements**: Status-based color schemes for instant recognition
- **Typography**: Modern font weights and spacing for better readability
- **Interactive Elements**: Hover effects and smooth transitions

### 📊 PocketBase Schema Integration:
**Collection:** `audit_logs`
- **user** (relation): Links to the user who performed the action
- **action** (select): Type of action (Create, Edit, Delete)
- **module** (text): System module (Orders, Users, Authentication, etc.)
- **subModule** (text): Sub-module for more granular tracking
- **details** (text): Detailed description of the action
- **created** (autodate): Automatic timestamp when record is created
- **updated** (autodate): Automatic timestamp when record is updated

### 🔧 Dynamic Features:
- **Real-time Data**: Uses `useCollection` hook for live data fetching
- **Smart Filtering**: Filter by date, module, status, and user
- **Export Functionality**: CSV export with real data
- **Error Handling**: Comprehensive error states and loading indicators
- **Statistics**: Real-time calculation of success rates and user activity
- **AuthContext Integration**: Automatic user authentication and role-based access
- **User-specific Filtering**: Filter audit logs by specific users

## 💾 Backup & Restore Center
**Location:** `/backup-restore/page.jsx`

### ✨ Modern Features:
- **🎨 Premium Design**: Purple-to-indigo gradient theme with enterprise-grade aesthetics
- **📊 Animated Statistics**: Interactive cards with scale animations and gradient backgrounds
- **🗂️ Enhanced Tabbed Interface**: Modern tab design with gradient active states
- **⚡ Smart Status Indicators**: Real-time status with animated progress indicators
- **🔧 Beautiful Settings Panel**: Organized configuration with visual hierarchy
- **📱 Mobile-First Design**: Responsive layout with touch-friendly interactions

### 🎯 Enhanced Sections:
- **💼 Backups Tab**: Professional backup listing with enhanced action buttons
- **📜 History Tab**: Comprehensive restore history with detailed tracking
- **⚙️ Settings Tab**: Visual configuration panels with gradient backgrounds

### Components Used:
- `Tabs` for organizing different sections
- `DataTable` for backup and restore history listings
- `Button` for various actions (create, upload, restore)
- `Badge` for status indicators
- Lucide icons for visual clarity

### Tabs:
1. **Backups**: List of all available backups with actions
2. **Restore History**: Track of all restore operations
3. **Settings**: Configure backup schedules and retention policies

### Data Structure:
**Backup entries include:**
- Backup name and type (Manual/Automatic)
- File size and creation date
- Status and retention period
- Description and actions

**Restore history includes:**
- Backup name and restore timestamp
- User who performed restore
- Duration and success status
- Reason for restoration

## Implementation Notes:

### 🔗 Dynamic Data Integration:
The audit log page is now fully integrated with PocketBase using the `useCollection` hook and real-time data fetching. The backup & restore page uses mock data for demonstration but follows the same pattern for easy integration.

### 🎨 Modern Design System:
- **Gradient Backgrounds**: Sophisticated color transitions and glass-morphism effects
- **Interactive Elements**: Hover animations, scale transforms, and smooth transitions
- **Modern Typography**: Enhanced font weights, spacing, and visual hierarchy
- **Responsive Layout**: Mobile-first design with adaptive breakpoints
- **Consistent Theming**: Unified color palette with CSS variables
- **Accessibility**: High contrast ratios and keyboard navigation support

### 🚀 Performance Optimizations:
- **Smooth Animations**: Hardware-accelerated CSS transitions
- **Optimized Rendering**: Efficient component updates and re-renders
- **Responsive Images**: Adaptive icon sizing and vector graphics

### 🛠️ Audit Logger Utility:
**Location:** `/src/utils/auditLogger.js`

A comprehensive utility for creating audit log entries throughout the application:

#### Key Functions:
- **createAuditLog()**: Core function for creating audit entries
- **Predefined Actions**: CREATE, EDIT, DELETE constants
- **Module Constants**: Standardized module names
- **Helper Functions**: Ready-to-use functions for common scenarios

#### Usage Examples:

**Using the useAuditLogger Hook (Recommended):**
```javascript
import { useAuditLogger } from '@/hooks/useAuditLogger';

function MyComponent() {
  const auditLogger = useAuditLogger();

  const handleOrderCreate = async () => {
    // Automatically uses current user context
    await auditLogger.logOrderCreate('CFS', 'ORD-2024-001', 'ABC Corp');
  };

  const handleCustomAction = async () => {
    await auditLogger.log({
      action: 'Custom Action',
      module: 'Custom Module',
      details: 'Custom action performed'
    });
  };
}
```

**Direct Utility Usage:**
```javascript
import { logUserLogin, logOrderCreated, createAuditLog } from '@/utils/auditLogger';

// Log user authentication (now automatic in AuthContext)
await logUserLogin(user.email, user);

// Log order creation
await logOrderCreated('CFS', 'ORD-2024-001', 'ABC Corp');

// Custom audit log with user context
await createAuditLog({
  action: 'Custom Action',
  module: 'Custom Module',
  details: 'Custom action performed',
  userContext: user
});
```

### 🔐 **Enhanced AuthContext Integration:**

**Automatic Audit Logging:**
- **Login Events**: Automatically logs successful and failed login attempts
- **Logout Events**: Tracks user logout activities
- **Role Validation**: Logs role mismatch attempts
- **User Context**: Passes full user object to audit logs

**Security Features:**
- **Authentication Checks**: Verifies user is logged in before showing audit logs
- **Role-based Access**: Optional role-based access control (commented out but ready)
- **User Information Display**: Shows current logged-in user in the header
- **Session Tracking**: Tracks user sessions and activities

**New Hook: useAuditLogger**
**Location:** `/src/hooks/useAuditLogger.js`

Provides a convenient way to log audit events with automatic user context:
- **Automatic User Context**: No need to manually pass user information
- **Convenience Methods**: Pre-built functions for common audit scenarios
- **Type Safety**: Consistent action and module constants
- **Easy Integration**: Simple hook-based API

### 🚀 Future Enhancements:
1. **Real-time Updates**: WebSocket integration for live audit log updates
2. **Advanced Analytics**: Trend analysis and security insights
3. **Automated Alerts**: Real-time notifications for suspicious activities
4. **IP Geolocation**: Track user locations for security analysis
5. **Session Management**: Enhanced session tracking and timeout handling
6. **Compliance Reports**: Generate compliance-ready audit reports
7. **Advanced Filtering**: Time range filters, bulk actions, and search functionality

### Security Considerations:
- Audit logs should be tamper-proof and encrypted
- Access controls should be implemented based on user roles
- Backup files should be securely stored and encrypted
- Restore operations should require proper authorization

### Performance:
- Implement pagination for large datasets
- Add search functionality for quick data retrieval
- Consider caching for frequently accessed data
- Optimize table rendering for better performance
