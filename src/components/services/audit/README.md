# Audit Log Components

This directory contains the componentized audit log functionality, broken down into reusable, maintainable components following the established patterns in the codebase.

## 📁 Component Structure

```
src/components/services/audit/
├── AuditLogContainer.jsx    # Main container component with all logic
├── AuditLogHeader.jsx       # Header section with title and actions
├── AuditLogStats.jsx        # Statistics dashboard cards
├── AuditLogTable.jsx        # Data table with audit events
├── index.js                 # Export file for easy imports
└── README.md               # This documentation
```

## 🧩 Components Overview

### 1. **AuditLogContainer.jsx**
**Main container component that orchestrates all other components**

**Responsibilities:**
- Data fetching from PocketBase using `useCollection`
- Authentication and authorization checks
- Error handling and loading states
- Export functionality (CSV generation)
- Refresh functionality
- State management for the entire audit log feature

**Props:** None (self-contained)

**Key Features:**
- Authentication validation
- Real-time data fetching
- CSV export with proper formatting
- Comprehensive error handling
- Loading states with spinners

### 2. **AuditLogHeader.jsx**
**Header section with title, user info, and action buttons**

**Props:**
- `user` (object): Current logged-in user object
- `onRefresh` (function): Callback for refresh action
- `onExport` (function): Callback for export action

**Features:**
- Beautiful gradient design
- User display with fallback logic
- Real-time timestamp
- Action buttons with hover effects
- Responsive layout

### 3. **AuditLogStats.jsx**
**Statistics dashboard with animated cards**

**Props:**
- `auditData` (array): Array of audit log entries

**Features:**
- Real-time statistics calculation
- Animated hover effects
- Success rate calculations
- Unique user counting
- Gradient card designs
- Responsive grid layout

**Statistics Displayed:**
- Total Events
- Successful Operations
- Failed Operations
- Active Users

### 4. **AuditLogTable.jsx**
**Data table component for displaying audit events**

**Props:**
- `auditData` (array): Array of audit log entries
- `loading` (boolean): Loading state indicator

**Features:**
- Custom column definitions
- User avatar and information display
- Action and status badges with color coding
- Module icons and categorization
- Truncated details with hover tooltips
- Built-in filtering and sorting
- Live status indicator

**Column Structure:**
- Timestamp (formatted)
- User (with avatar and email)
- Action (color-coded badge)
- Module (with icons and sub-modules)
- Status (success/failure indicator)
- Details (truncated with tooltip)

## 🔧 Usage Examples

### Basic Usage
```javascript
import AuditLogContainer from '@/components/services/audit/AuditLogContainer';

function AuditLogPage() {
  return <AuditLogContainer />;
}
```

### Individual Component Usage
```javascript
import { 
  AuditLogHeader, 
  AuditLogStats, 
  AuditLogTable 
} from '@/components/services/audit';

function CustomAuditPage() {
  const { user } = useAuth();
  const { data: auditData } = useCollection('audit_logs');

  return (
    <div>
      <AuditLogHeader 
        user={user}
        onRefresh={() => console.log('refresh')}
        onExport={() => console.log('export')}
      />
      <AuditLogStats auditData={auditData} />
      <AuditLogTable auditData={auditData} />
    </div>
  );
}
```

## 🎨 Design Patterns

### 1. **Separation of Concerns**
- **Container**: Logic and data management
- **Presentation**: UI components with minimal logic
- **Utilities**: Helper functions for formatting and calculations

### 2. **Prop Drilling Prevention**
- Each component receives only the data it needs
- No unnecessary prop passing through multiple levels
- Self-contained components with clear interfaces

### 3. **Reusability**
- Components can be used independently
- Consistent prop interfaces
- Flexible styling and customization

### 4. **Error Boundaries**
- Comprehensive error handling in container
- Graceful fallbacks for missing data
- User-friendly error messages

## 🔄 Data Flow

```
AuditLogContainer
├── Fetches data from PocketBase
├── Handles authentication
├── Manages loading/error states
└── Passes data to child components
    ├── AuditLogHeader (user, callbacks)
    ├── AuditLogStats (auditData)
    └── AuditLogTable (auditData, loading)
```

## 🚀 Benefits of Componentization

### 1. **Maintainability**
- Easier to locate and fix issues
- Clear component boundaries
- Isolated testing capabilities

### 2. **Reusability**
- Components can be reused in other parts of the app
- Consistent UI patterns across the application
- Easy to create variations

### 3. **Performance**
- Smaller bundle sizes for individual components
- Better tree-shaking opportunities
- Optimized re-rendering

### 4. **Developer Experience**
- Clear component hierarchy
- Easy to understand and modify
- Better code organization

## 🔧 Customization

### Styling
Each component uses Tailwind CSS classes and can be customized by:
- Modifying the className props
- Extending the component with additional styles
- Using CSS modules for component-specific styles

### Functionality
Components can be extended by:
- Adding new props for additional features
- Creating wrapper components with enhanced functionality
- Implementing custom hooks for shared logic

## 📦 Dependencies

- **React**: Core framework
- **@/contexts/SidebarProvider**: For page title management
- **@/contexts/AuthContext**: For user authentication
- **@/hooks/useCollection**: For PocketBase data fetching
- **@/components/ui/**: UI component library
- **lucide-react**: Icon library

## 🧪 Testing Considerations

Each component can be tested independently:
- **Unit Tests**: Test individual component logic
- **Integration Tests**: Test component interactions
- **E2E Tests**: Test complete user workflows

Example test structure:
```javascript
// AuditLogStats.test.jsx
import { render } from '@testing-library/react';
import AuditLogStats from './AuditLogStats';

test('displays correct statistics', () => {
  const mockData = [/* mock audit data */];
  render(<AuditLogStats auditData={mockData} />);
  // Test statistics calculations
});
```

This componentized structure provides a solid foundation for the audit log functionality while maintaining flexibility for future enhancements and modifications.
