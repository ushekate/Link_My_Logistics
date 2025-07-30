import { useState, useEffect } from 'react';
import { useCollection } from './useCollection';
import { useAuth } from '@/contexts/AuthContext';

export function useNotifications(userType = 'customer') {
  const { user } = useAuth();
  const [filters, setFilters] = useState({
    type: 'all',
    sender: 'all',
    status: 'all',
    search: ''
  });

  // Fetch notifications based on user type
  const { data: notifications, loading, error, refetch } = useCollection('notification', {
    filter: `status = "Active"`,
    sort: '-created'
  });

  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [readNotifications, setReadNotifications] = useState(new Set());

  // Load read notifications from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(`readNotifications_${user?.id}_${userType}`);
    if (stored) {
      setReadNotifications(new Set(JSON.parse(stored)));
    }
  }, [user?.id, userType]);

  // Save read notifications to localStorage
  useEffect(() => {
    if (readNotifications.size > 0) {
      localStorage.setItem(
        `readNotifications_${user?.id}_${userType}`,
        JSON.stringify([...readNotifications])
      );
    }
  }, [readNotifications, user?.id, userType]);

  // Filter notifications based on current filters
  useEffect(() => {
    if (notifications) {
      let filtered = [...notifications];

      // Filter by type
      if (filters.type !== 'all') {
        filtered = filtered.filter(notification => notification.type === filters.type);
      }

      // Filter by sender
      if (filters.sender !== 'all') {
        filtered = filtered.filter(notification => notification.sender === filters.sender);
      }

      // Filter by status (for admin view)
      if (filters.status !== 'all') {
        filtered = filtered.filter(notification => notification.status === filters.status);
      }

      // Filter by search query
      if (filters.search.trim()) {
        filtered = filtered.filter(notification =>
          notification.title?.toLowerCase().includes(filters.search.toLowerCase()) ||
          notification.description?.toLowerCase().includes(filters.search.toLowerCase())
        );
      }

      setFilteredNotifications(filtered);
    }
  }, [notifications, filters]);

  // Mark notification as read
  const markAsRead = (notificationId) => {
    setReadNotifications(prev => new Set([...prev, notificationId]));
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    const allIds = filteredNotifications.map(n => n.id);
    setReadNotifications(prev => new Set([...prev, ...allIds]));
  };

  // Get unread count
  const unreadCount = filteredNotifications.filter(n => !readNotifications.has(n.id)).length;

  // Update filters
  const updateFilters = (newFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  // Get notification statistics
  const getStats = () => {
    const total = filteredNotifications.length;
    const unread = unreadCount;
    const events = filteredNotifications.filter(n => n.type === 'event').length;
    const alerts = filteredNotifications.filter(n => n.type === 'alert').length;

    return { total, unread, events, alerts };
  };

  return {
    notifications: filteredNotifications,
    loading,
    error,
    refetch,
    filters,
    updateFilters,
    readNotifications,
    markAsRead,
    markAllAsRead,
    unreadCount,
    getStats,
    isRead: (notificationId) => readNotifications.has(notificationId)
  };
}

// Notification type helpers
export const getTypeIcon = (type) => {
  const icons = {
    event: 'Calendar',
    alert: 'AlertCircle',
    default: 'Bell'
  };
  return icons[type] || icons.default;
};

export const getTypeBadge = (type) => {
  const badges = {
    event: { className: 'bg-blue-100 text-blue-800', label: 'Event' },
    alert: { className: 'bg-red-100 text-red-800', label: 'Alert' },
    default: { className: 'bg-gray-100 text-gray-800', label: 'Notification' }
  };
  return badges[type] || badges.default;
};

export const getSenderBadge = (sender) => {
  const badges = {
    'Admin': { className: 'bg-purple-100 text-purple-800' },
    'Green Ocean Logistics': { className: 'bg-primary/10 text-primary' },
    'IT Support': { className: 'bg-orange-100 text-orange-800' },
    default: { className: 'bg-gray-100 text-gray-800' }
  };
  return badges[sender] || badges.default;
};

export const getStatusBadge = (status) => {
  const badges = {
    'Active': { className: 'bg-success-light text-success' },
    'Inactive': { className: 'bg-gray-100 text-gray-800' },
    default: { className: 'bg-gray-100 text-gray-800' }
  };
  return badges[status] || badges.default;
};

// Notification creation/update helpers
export const createNotificationPayload = (formData, attachments = []) => {
  const payload = {
    title: formData.title,
    description: formData.description,
    type: formData.type,
    sender: formData.sender,
    status: formData.status,
    sentOn: formData.sentOn
  };

  // Add event-specific fields
  if (formData.type === 'event') {
    if (formData.date) payload.date = formData.date;
    if (formData.start_time) payload.start_time = formData.start_time;
    if (formData.end_time) payload.end_time = formData.end_time;
    if (formData.mode) payload.mode = formData.mode;
  }

  // Add links
  if (formData.link1) payload.link1 = formData.link1;
  if (formData.link2) payload.link2 = formData.link2;
  if (formData.link3) payload.link3 = formData.link3;

  return payload;
};

// Date formatting helpers
export const formatNotificationDate = (date, includeTime = false) => {
  if (!date) return '-';
  
  const options = includeTime 
    ? { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }
    : { year: 'numeric', month: 'short', day: 'numeric' };
    
  return new Date(date).toLocaleDateString('en-US', options);
};

// Notification priority helpers
export const getNotificationPriority = (notification) => {
  if (notification.type === 'alert') return 'high';
  if (notification.type === 'event') return 'medium';
  return 'low';
};

export const sortNotificationsByPriority = (notifications) => {
  const priorityOrder = { high: 3, medium: 2, low: 1 };
  
  return [...notifications].sort((a, b) => {
    const aPriority = priorityOrder[getNotificationPriority(a)];
    const bPriority = priorityOrder[getNotificationPriority(b)];
    
    if (aPriority !== bPriority) {
      return bPriority - aPriority; // Higher priority first
    }
    
    // If same priority, sort by date (newest first)
    return new Date(b.created) - new Date(a.created);
  });
};
