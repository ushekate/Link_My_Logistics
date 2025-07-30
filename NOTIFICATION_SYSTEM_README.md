# Notification System Documentation

## Overview

The notification system provides a comprehensive solution for managing notifications, events, and updates across the Green Ocean Logistics platform. It supports separate notification flows for customers, clients, and GOL administrators.

## Architecture

### Flow Structure
```
GOL Admin → Creates Notifications → Customers & Clients View Notifications
```

### Components Structure
```
src/
├── app/(software)/
│   ├── customer/(after_login)/notifications/page.jsx    # Customer notification view
│   ├── client/(after_login)/notifications/page.jsx      # Client notification view
│   └── gol/(after_login)/notification-management/page.jsx # GOL admin management
├── hooks/
│   └── useNotifications.js                              # Shared notification logic
└── notification-schema-unnati.json                      # PocketBase schema
```

## Features

### For Customers & Clients
- **View Notifications**: Browse all active notifications
- **Filter & Search**: Filter by type, sender, and search content
- **Read Status**: Track read/unread notifications with persistence
- **Detailed View**: View full notification details with attachments
- **Event Information**: See event dates, times, and meeting links
- **Attachment Downloads**: Download notification attachments

### For GOL Administrators
- **Create Notifications**: Create new notifications with rich content
- **Manage Notifications**: Edit, delete, and update existing notifications
- **Event Management**: Create event notifications with dates, times, and links
- **Attachment Support**: Upload and manage file attachments
- **Status Control**: Activate/deactivate notifications
- **Bulk Operations**: Manage multiple notifications efficiently

## Notification Types

### 1. Alert Notifications
- **Purpose**: Important announcements, system updates, policy changes
- **Fields**: Title, description, sender, links, attachments
- **Priority**: High
- **Icon**: AlertCircle (red)

### 2. Event Notifications
- **Purpose**: Meetings, webinars, training sessions, company events
- **Fields**: All alert fields + event date, start/end time, mode (Zoom, etc.)
- **Priority**: Medium
- **Icon**: Calendar (blue)

## Schema Structure

Based on `notification-schema-unnati.json`:

```json
{
  "id": "string",
  "title": "string (required)",
  "description": "string (required)",
  "type": "string (alert|event)",
  "sender": "string",
  "status": "string (Active|Inactive)",
  "date": "datetime (for events)",
  "start_time": "datetime (for events)",
  "end_time": "datetime (for events)",
  "mode": "string (zoom, etc.)",
  "link1": "url",
  "link2": "url", 
  "link3": "url",
  "attachment": "file[]",
  "sentOn": "datetime",
  "created": "datetime",
  "updated": "datetime"
}
```

## Usage Examples

### Customer/Client Notification Page
```jsx
import NotificationPage from '@/app/(software)/customer/(after_login)/notifications/page';

// The page automatically:
// - Fetches active notifications
// - Provides filtering and search
// - Tracks read status
// - Shows detailed views
```

### GOL Management Page
```jsx
import NotificationManagement from '@/app/(software)/gol/(after_login)/notification-management/page';

// Features:
// - Create new notifications
// - Edit existing notifications
// - Delete notifications
// - View all notifications in table format
```

### Using the Notification Hook
```jsx
import { useNotifications } from '@/hooks/useNotifications';

function MyComponent() {
  const {
    notifications,
    loading,
    markAsRead,
    unreadCount,
    updateFilters
  } = useNotifications('customer');

  // Use the hook data and methods
}
```

## Styling & UI

### Design System
- **Primary Colors**: Uses CSS variables (bg-primary, text-primary)
- **Success Colors**: Uses success variables (bg-success-light, text-success)
- **Consistent Badges**: Type and sender badges with semantic colors
- **Responsive Design**: Mobile-friendly layouts
- **Accessibility**: Proper ARIA labels and keyboard navigation

### Key UI Components
- **NotificationCard**: Displays notification summary with read status
- **NotificationDetailsModal**: Full notification view with all details
- **FilterBar**: Search and filter controls
- **CreateNotificationModal**: Form for creating new notifications
- **EditNotificationModal**: Form for editing existing notifications

## Data Flow

### Reading Notifications
1. User opens notification page
2. `useCollection` hook fetches notifications from PocketBase
3. Notifications are filtered based on user preferences
4. Read status is loaded from localStorage
5. UI displays notifications with proper styling

### Creating Notifications (GOL Admin)
1. Admin clicks "Create Notification"
2. Modal opens with comprehensive form
3. Form validates required fields
4. Data is submitted to PocketBase
5. Notification appears for customers/clients

### Marking as Read
1. User clicks on notification
2. Notification ID is added to read set
3. Read status is saved to localStorage
4. UI updates to show read state

## File Attachments

### Upload Process
- Files are uploaded through PocketBase file API
- Supported formats: PDF, DOC, DOCX, JPG, JPEG, PNG, GIF
- Multiple files can be attached to a single notification

### Download Process
- Files are served through PocketBase file URL
- Format: `${PB_URL}/api/files/notification/${notificationId}/${filename}`
- Downloads open in new tab/window

## Persistence

### Read Status
- Stored in localStorage per user and user type
- Key format: `readNotifications_{userId}_{userType}`
- Automatically synced across browser sessions

### Filter Preferences
- Can be extended to save user filter preferences
- Currently resets on page reload

## Security Considerations

### Access Control
- Customers only see active notifications
- Clients only see active notifications
- GOL admins can see and manage all notifications

### Data Validation
- Required fields enforced on frontend and backend
- URL validation for links
- File type validation for attachments

## Future Enhancements

### Planned Features
1. **Push Notifications**: Browser push notifications for new alerts
2. **Email Integration**: Send notifications via email
3. **User Targeting**: Send notifications to specific user groups
4. **Notification Templates**: Pre-defined templates for common notifications
5. **Analytics**: Track notification open rates and engagement
6. **Scheduling**: Schedule notifications for future delivery
7. **Rich Text Editor**: Enhanced text formatting for descriptions

### Technical Improvements
1. **Real-time Updates**: WebSocket integration for live notifications
2. **Caching**: Implement notification caching for better performance
3. **Pagination**: Handle large numbers of notifications efficiently
4. **Search Enhancement**: Full-text search capabilities
5. **Mobile App**: React Native integration for mobile notifications

## Troubleshooting

### Common Issues
1. **Notifications not loading**: Check PocketBase connection and collection permissions
2. **Read status not persisting**: Verify localStorage is enabled
3. **Attachments not downloading**: Check file permissions and PocketBase URL
4. **Filters not working**: Ensure filter values match schema field values

### Debug Tips
- Check browser console for API errors
- Verify PocketBase collection exists and has correct schema
- Test with different user types to ensure proper access control
- Use browser dev tools to inspect localStorage for read status

## API Integration

### PocketBase Setup
1. Create `notification` collection with schema from `notification-schema-unnati.json`
2. Set appropriate permissions for different user types
3. Configure file upload settings for attachments
4. Test API endpoints with sample data

### Environment Variables
```env
NEXT_PUBLIC_PB_URL=your_pocketbase_url
```

This notification system provides a robust foundation for communication between GOL administrators and their customers/clients, with room for future enhancements and scalability.
