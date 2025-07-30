"use client";

import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import Input from '@/components/ui/Input';
import Label from '@/components/ui/Label';
import { Select, SelectItem } from '@/components/ui/Select';
import { PB_URL } from '@/constants/url';
import { useAuth } from '@/contexts/AuthContext';
import { useCollection } from '@/hooks/useCollection';
import { format } from 'date-fns';
import { AlertCircle, Bell, Calendar, Download, ExternalLink, Eye, EyeOff, Search } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ClientNotificationPage() {
  const { user } = useAuth();
  const { data: notifications, loading } = useCollection('notification', {
    filter: 'status = "Active"',
    sort: '-created'
  });

  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [selectedType, setSelectedType] = useState('all');
  const [selectedSender, setSelectedSender] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [readNotifications, setReadNotifications] = useState(new Set());

  useEffect(() => {
    if (notifications) {
      let filtered = [...notifications];

      // Filter by type
      if (selectedType !== 'all') {
        filtered = filtered.filter(notification => notification.type === selectedType);
      }

      // Filter by sender
      if (selectedSender !== 'all') {
        filtered = filtered.filter(notification => notification.sender === selectedSender);
      }

      // Filter by search query
      if (searchQuery.trim()) {
        filtered = filtered.filter(notification =>
          notification.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          notification.description?.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      setFilteredNotifications(filtered);
    }
  }, [notifications, selectedType, selectedSender, searchQuery]);

  const markAsRead = (notificationId) => {
    setReadNotifications(prev => new Set([...prev, notificationId]));
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'event':
        return <Calendar className="w-5 h-5 text-blue-600" />;
      case 'alert':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const getTypeBadge = (type) => {
    switch (type) {
      case 'event':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-800">Event</Badge>;
      case 'alert':
        return <Badge variant="secondary" className="bg-red-100 text-red-800">Alert</Badge>;
      default:
        return <Badge variant="secondary" className="bg-gray-100 text-gray-800">Notification</Badge>;
    }
  };

  const getSenderBadge = (sender) => {
    switch (sender) {
      case 'Admin':
        return <Badge variant="secondary" className="bg-purple-100 text-purple-800">{sender}</Badge>;
      case 'Green Ocean Logistics':
        return <Badge variant="default">{sender}</Badge>;
      case 'IT Support':
        return <Badge variant="secondary" className="bg-orange-100 text-orange-800">{sender}</Badge>;
      default:
        return <Badge variant="secondary">{sender}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--primary)]"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--foreground)] mb-2">Client Notifications</h1>
        <p className="text-[var(--secondary)]">Stay updated with the latest events and alerts for clients</p>
      </div>

      {/* Filters */}
      <div className="bg-[var(--accent)] rounded-lg p-6 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--secondary)] w-4 h-4" />
              <Input
                type="text"
                placeholder="Search notifications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-[var(--accent)]"
              />
            </div>
          </div>
          <Select value={selectedType} onValueChange={setSelectedType} className="min-w-[150px]">
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="event">Events</SelectItem>
            <SelectItem value="alert">Alerts</SelectItem>
          </Select>
          <Select value={selectedSender} onValueChange={setSelectedSender} className="min-w-[200px]">
            <SelectItem value="all">All Senders</SelectItem>
            <SelectItem value="Admin">Admin</SelectItem>
            <SelectItem value="Green Ocean Logistics">Green Ocean Logistics</SelectItem>
            <SelectItem value="IT Support">IT Support</SelectItem>
          </Select>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications found</h3>
            <p className="text-gray-500">Check back later for updates and announcements.</p>
          </div>
        ) : (
          filteredNotifications.map((notification) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
              isRead={readNotifications.has(notification.id)}
              onMarkAsRead={markAsRead}
              onViewDetails={setSelectedNotification}
              getTypeIcon={getTypeIcon}
              getTypeBadge={getTypeBadge}
              getSenderBadge={getSenderBadge}
            />
          ))
        )}
      </div>

      {/* Notification Details Modal */}
      {selectedNotification && (
        <NotificationDetailsModal
          notification={selectedNotification}
          onClose={() => setSelectedNotification(null)}
          getTypeIcon={getTypeIcon}
          getTypeBadge={getTypeBadge}
          getSenderBadge={getSenderBadge}
        />
      )}
    </div>
  );
}

// NotificationCard Component (same as customer version)
function NotificationCard({
  notification,
  isRead,
  onMarkAsRead,
  onViewDetails,
  getTypeIcon,
  getTypeBadge,
  getSenderBadge
}) {
  const handleCardClick = () => {
    if (!isRead) {
      onMarkAsRead(notification.id);
    }
    onViewDetails(notification);
  };

  return (
    <div
      className={`bg-[var(--accent)] rounded-lg p-6 border-l-4 cursor-pointer transition-all hover:shadow-md ${
        isRead ? 'border-l-gray-300 opacity-75' : 'border-l-[var(--primary)]'
      }`}
      onClick={handleCardClick}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4 flex-1">
          <div className="flex-shrink-0">
            {getTypeIcon(notification.type)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              {getTypeBadge(notification.type)}
              {getSenderBadge(notification.sender)}
              {!isRead && (
                <div className="w-2 h-2 bg-[var(--primary)] rounded-full"></div>
              )}
            </div>
            <h3 className={`text-lg font-semibold mb-2 ${isRead ? 'text-gray-600' : 'text-[var(--foreground)]'}`}>
              {notification.title}
            </h3>
            <p className={`text-sm mb-3 line-clamp-2 ${isRead ? 'text-gray-500' : 'text-[var(--secondary)]'}`}>
              {notification.description}
            </p>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              {notification.sentOn && (
                <span>Sent: {format(new Date(notification.sentOn), 'MMM dd, yyyy')}</span>
              )}
              {notification.date && (
                <span>Event: {format(new Date(notification.date), 'MMM dd, yyyy')}</span>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {isRead ? (
            <EyeOff className="w-4 h-4 text-gray-400" />
          ) : (
            <Eye className="w-4 h-4 text-[var(--primary)]" />
          )}
        </div>
      </div>
    </div>
  );
}

// NotificationDetailsModal Component
function NotificationDetailsModal({
  notification,
  onClose,
  getTypeIcon,
  getTypeBadge,
  getSenderBadge
}) {
  const downloadAttachment = (filename) => {
    const url = `${PB_URL}/api/files/notification/${notification.id}/${filename}`;
    window.open(url, '_blank');
  };

  return (
    <Dialog open={true} onOpenChange={onClose} title="Notification Details">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-start space-x-4 mb-6">
          <div className="flex-shrink-0">
            {getTypeIcon(notification.type)}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-3">
              {getTypeBadge(notification.type)}
              {getSenderBadge(notification.sender)}
            </div>
            <h2 className="text-2xl font-bold text-[var(--foreground)] mb-2">
              {notification.title}
            </h2>
          </div>
        </div>

        <div className="space-y-6">
          {/* Description */}
          <div>
            <Label title="Description" className="text-sm font-medium text-gray-700 mb-2 block" />
            <p className="text-[var(--secondary)] leading-relaxed">
              {notification.description}
            </p>
          </div>

          {/* Event Details */}
          {notification.type === 'event' && (
            <div className="border-t pt-6">
              <Label title="Event Details" className="text-lg font-medium text-gray-900 mb-4 block" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {notification.date && (
                  <div>
                    <Label title="Event Date" className="text-sm font-medium text-gray-700 mb-1 block" />
                    <p className="text-[var(--secondary)]">{format(new Date(notification.date), 'MMMM dd, yyyy')}</p>
                  </div>
                )}
                {notification.start_time && (
                  <div>
                    <Label title="Start Time" className="text-sm font-medium text-gray-700 mb-1 block" />
                    <p className="text-[var(--secondary)]">{format(new Date(notification.start_time), 'hh:mm a')}</p>
                  </div>
                )}
                {notification.end_time && (
                  <div>
                    <Label title="End Time" className="text-sm font-medium text-gray-700 mb-1 block" />
                    <p className="text-[var(--secondary)]">{format(new Date(notification.end_time), 'hh:mm a')}</p>
                  </div>
                )}
                {notification.mode && (
                  <div>
                    <Label title="Mode" className="text-sm font-medium text-gray-700 mb-1 block" />
                    <p className="text-[var(--secondary)] capitalize">{notification.mode}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Links */}
          {(notification.link1 || notification.link2 || notification.link3) && (
            <div className="border-t pt-6">
              <Label title="Related Links" className="text-sm font-medium text-gray-700 mb-3 block" />
              <div className="space-y-2">
                {notification.link1 && (
                  <a
                    href={notification.link1}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-[var(--primary)] hover:text-[var(--primary)]/80 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    {notification.link1}
                  </a>
                )}
                {notification.link2 && (
                  <a
                    href={notification.link2}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-[var(--primary)] hover:text-[var(--primary)]/80 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    {notification.link2}
                  </a>
                )}
                {notification.link3 && (
                  <a
                    href={notification.link3}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-[var(--primary)] hover:text-[var(--primary)]/80 transition-colors"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    {notification.link3}
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Attachments */}
          {notification.attachment && notification.attachment.length > 0 && (
            <div className="border-t pt-6">
              <Label title="Attachments" className="text-sm font-medium text-gray-700 mb-3 block" />
              <div className="space-y-2">
                {notification.attachment.map((file, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    onClick={() => downloadAttachment(file)}
                    className="flex items-center p-3 bg-[var(--accent)] rounded-lg hover:bg-[var(--accent)]/80 transition-colors w-full text-left justify-start"
                    icon={<Download className="w-4 h-4 text-gray-500" />}
                    title={file}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="border-t pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-500">
              {notification.sentOn && (
                <div>
                  <span className="font-medium">Sent on:</span> {format(new Date(notification.sentOn), 'MMM dd, yyyy hh:mm a')}
                </div>
              )}
              {notification.created && (
                <div>
                  <span className="font-medium">Created:</span> {format(new Date(notification.created), 'MMM dd, yyyy hh:mm a')}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-8">
          <Button
            onClick={onClose}
            variant="outline"
            title="Close"
          />
        </div>
      </div>
    </Dialog>
  );
}
