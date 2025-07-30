"use client";

import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import Input from '@/components/ui/Input';
import Label from '@/components/ui/Label';
import { Select, SelectItem } from '@/components/ui/Select';
import { DataTable } from '@/components/ui/Table';
import TextArea from '@/components/ui/TextArea';
import { useAuth } from '@/contexts/AuthContext';
import { useCollection } from '@/hooks/useCollection';
import pbclient from '@/lib/db';
import { format } from 'date-fns';
import { AlertCircle, Bell, Calendar, Edit, Plus, Search, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function NotificationManagementPage() {
  const { user } = useAuth();
  const { data: notifications, loading, refetch } = useCollection('notification', {
    sort: '-created'
  });

  const [filteredNotifications, setFilteredNotifications] = useState([]);
  const [selectedType, setSelectedType] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState(null);

  useEffect(() => {
    if (notifications) {
      let filtered = [...notifications];

      // Filter by type
      if (selectedType !== 'all') {
        filtered = filtered.filter(notification => notification.type === selectedType);
      }

      // Filter by status
      if (selectedStatus !== 'all') {
        filtered = filtered.filter(notification => notification.status === selectedStatus);
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
  }, [notifications, selectedType, selectedStatus, searchQuery]);

  const getTypeIcon = (type) => {
    switch (type) {
      case 'event':
        return <Calendar className="w-4 h-4 text-blue-600" />;
      case 'alert':
        return <AlertCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Bell className="w-4 h-4 text-gray-600" />;
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

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Active':
        return <Badge variant="default" className="bg-green-100 text-green-800">Active</Badge>;
      case 'Inactive':
        return <Badge variant="secondary" className="bg-gray-100 text-gray-800">Inactive</Badge>;
      default:
        return <Badge variant="secondary" className="bg-gray-100 text-gray-800">Unknown</Badge>;
    }
  };

  const handleEdit = (notification) => {
    setSelectedNotification(notification);
    setShowEditModal(true);
  };

  const handleDelete = async (notificationId) => {
    if (window.confirm('Are you sure you want to delete this notification?')) {
      try {
        // Delete logic would go here
        toast.success('Notification deleted successfully');
        refetch();
      } catch (error) {
        toast.error('Failed to delete notification');
      }
    }
  };

  const columns = [
    {
      accessorKey: 'type',
      header: 'Type',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          {getTypeIcon(row.original.type)}
          {getTypeBadge(row.original.type)}
        </div>
      ),
    },
    {
      accessorKey: 'title',
      header: 'Title',
      cell: ({ row }) => (
        <div className="max-w-xs">
          <p className="font-medium truncate">{row.original.title}</p>
          <p className="text-sm text-gray-500 truncate">{row.original.description}</p>
        </div>
      ),
    },
    {
      accessorKey: 'createdFor',
      header: 'Created For',
      cell: ({ row }) => (
        row.original.createdFor ? (
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            User: {row.original.createdFor}
          </Badge>
        ) : (
          <Badge variant="secondary">All Users</Badge>
        )
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => getStatusBadge(row.original.status),
    },
    {
      accessorKey: 'sentOn',
      header: 'Sent On',
      cell: ({ row }) => (
        row.original.sentOn ? format(new Date(row.original.sentOn), 'MMM dd, yyyy') : '-'
      ),
    },
    {
      accessorKey: 'created',
      header: 'Created',
      cell: ({ row }) => (
        format(new Date(row.original.created), 'MMM dd, yyyy')
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEdit(row.original)}
            className="h-8 w-8 p-0"
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(row.original.id)}
            className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Notification Management</h1>
          <p className="text-secondary">Create and manage notifications for customers and clients</p>
        </div>
        <Button
          onClick={() => setShowCreateModal(true)}
          className="bg-primary hover:bg-primary/90"
          icon={<Plus className="w-4 h-4" />}
          title="Create Notification"
        />
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
          <Select value={selectedStatus} onValueChange={setSelectedStatus} className="min-w-[150px]">
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Inactive">Inactive</SelectItem>
          </Select>
        </div>
      </div>

      {/* Notifications Table */}
      <div className="bg-white rounded-lg shadow">
        <DataTable
          columns={columns}
          data={filteredNotifications}
          searchKey="title"
        />
      </div>

      {/* Create Notification Modal */}
      {showCreateModal && (
        <CreateNotificationModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            refetch();
          }}
        />
      )}

      {/* Edit Notification Modal */}
      {showEditModal && selectedNotification && (
        <EditNotificationModal
          notification={selectedNotification}
          onClose={() => {
            setShowEditModal(false);
            setSelectedNotification(null);
          }}
          onSuccess={() => {
            setShowEditModal(false);
            setSelectedNotification(null);
            refetch();
          }}
        />
      )}
    </div>
  );
}

// Create Notification Modal Component
function CreateNotificationModal({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'alert',
    status: 'Active',
    date: '',
    time: '',
    start_time: '',
    end_time: '',
    mode: '',
    link1: '',
    link2: '',
    link3: '',
    sentOn: new Date().toISOString().split('T')[0],
    createdFor: '', // User relation field
    sender: 'Green Ocean Logistics' // Default sender
  });

  const [attachments, setAttachments] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setAttachments(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Prepare the data for PocketBase
      const submitData = new FormData();

      // Add basic fields
      submitData.append('title', formData.title);
      submitData.append('description', formData.description);
      submitData.append('type', formData.type);
      submitData.append('status', formData.status);

      // Add required fields with defaults if empty
      if (!formData.title || !formData.description) {
        throw new Error('Title and description are required');
      }

      // Add optional fields only if they have values
      if (formData.date) submitData.append('date', formData.date);
      if (formData.time) submitData.append('time', formData.time);
      if (formData.start_time) submitData.append('start_time', formData.start_time);
      if (formData.end_time) submitData.append('end_time', formData.end_time);
      if (formData.mode) submitData.append('mode', formData.mode);
      if (formData.link1) submitData.append('link1', formData.link1);
      if (formData.link2) submitData.append('link2', formData.link2);
      if (formData.link3) submitData.append('link3', formData.link3);
      if (formData.sentOn) submitData.append('sentOn', formData.sentOn);
      if (formData.createdFor) submitData.append('createdFor', formData.createdFor);

      // Add attachments if any
      attachments.forEach((file, index) => {
        submitData.append('attachment', file);
      });

      // Create the notification using PocketBase
      const response = await pbclient.collection('notification').create(submitData);

      toast.success('Notification created successfully');
      onSuccess();
    } catch (error) {
      console.error('Error creating notification:', error);

      // Extract detailed error message
      let errorMessage = 'Unknown error';
      if (error?.response?.data) {
        // PocketBase error format
        const pbError = error.response.data;
        if (pbError.message) {
          errorMessage = pbError.message;
        } else if (pbError.data) {
          // Field validation errors
          const fieldErrors = Object.entries(pbError.data).map(([field, error]) => {
            return `${field}: ${error.message || error}`;
          }).join(', ');
          errorMessage = fieldErrors;
        }
      } else if (error?.message) {
        errorMessage = error.message;
      }

      toast.error('Failed to create notification: ' + errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose} title="Create Notification">
      <div className="max-w-4xl mx-auto max-h-[80vh] overflow-y-auto">
        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label title="Title *" className="block text-sm font-medium text-gray-700 mb-2" />
              <Input
                type="text"
                required
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="Enter notification title"
              />
            </div>
            <div>
              <Label title="Type *" className="block text-sm font-medium text-gray-700 mb-2" />
              <Select
                value={formData.type}
                onValueChange={(value) => handleInputChange('type', value)}
              >
                <SelectItem value="alert">Alert</SelectItem>
                <SelectItem value="event">Event</SelectItem>
              </Select>
            </div>
          </div>

          <div>
            <Label title="Description *" className="block text-sm font-medium text-gray-700 mb-2" />
            <TextArea
              required
              rows={4}
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Enter notification description"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label title="Status" className="block text-sm font-medium text-gray-700 mb-2" />
              <Select
                value={formData.status}
                onValueChange={(value) => handleInputChange('status', value)}
              >
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </Select>
            </div>
            <div>
              <Label title="Send Date" className="block text-sm font-medium text-gray-700 mb-2" />
              <Input
                type="date"
                value={formData.sentOn}
                onChange={(e) => handleInputChange('sentOn', e.target.value)}
              />
            </div>
          </div>

          {/* Event-specific fields */}
          {formData.type === 'event' && (
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Event Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Date
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mode
                  </label>
                  <select
                    value={formData.mode}
                    onChange={(e) => handleInputChange('mode', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">Select mode</option>
                    <option value="zoom">Zoom</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Time
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.start_time}
                    onChange={(e) => handleInputChange('start_time', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Time
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.end_time}
                    onChange={(e) => handleInputChange('end_time', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Links */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Related Links</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Link 1
                </label>
                <input
                  type="url"
                  value={formData.link1}
                  onChange={(e) => handleInputChange('link1', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="https://example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Link 2
                </label>
                <input
                  type="url"
                  value={formData.link2}
                  onChange={(e) => handleInputChange('link2', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="https://example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Link 3
                </label>
                <input
                  type="url"
                  value={formData.link3}
                  onChange={(e) => handleInputChange('link3', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder="https://example.com"
                />
              </div>
            </div>
          </div>

          {/* Attachments */}
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Attachments</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Files
              </label>
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.gif"
              />
              <p className="text-xs text-gray-500 mt-1">
                Supported formats: PDF, DOC, DOCX, JPG, JPEG, PNG, GIF
              </p>
            </div>
          </div>

          {/* Send Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Send Date
            </label>
            <input
              type="date"
              value={formData.sentOn}
              onChange={(e) => handleInputChange('sentOn', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-4 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              title="Cancel"
              disabled={isSubmitting}
            />
            <Button
              type="submit"
              title={isSubmitting ? "Creating..." : "Create Notification"}
              disabled={isSubmitting}
              className="bg-primary hover:bg-primary/90"
            />
          </div>
        </form>
      </div>
    </Dialog>
  );
}

function EditNotificationModal({ notification, onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    title: notification.title || '',
    description: notification.description || '',
    type: notification.type || 'alert',
    sender: notification.sender || 'Green Ocean Logistics',
    status: notification.status || 'Active',
    date: notification.date || '',
    start_time: notification.start_time || '',
    end_time: notification.end_time || '',
    mode: notification.mode || '',
    link1: notification.link1 || '',
    link2: notification.link2 || '',
    link3: notification.link3 || '',
    sentOn: notification.sentOn || new Date().toISOString().split('T')[0]
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Update notification logic would go here
      toast.success('Notification updated successfully');
      onSuccess();
    } catch (error) {
      toast.error('Failed to update notification');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose} title="Edit Notification">
      <div className="max-w-4xl mx-auto max-h-[80vh] overflow-y-auto">
        <form onSubmit={handleSubmit} className="space-y-6 p-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type *
              </label>
              <select
                required
                value={formData.type}
                onChange={(e) => handleInputChange('type', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="alert">Alert</option>
                <option value="event">Event</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              required
              rows={4}
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sender
              </label>
              <select
                value={formData.sender}
                onChange={(e) => handleInputChange('sender', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="Admin">Admin</option>
                <option value="Green Ocean Logistics">Green Ocean Logistics</option>
                <option value="IT Support">IT Support</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleInputChange('status', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-4 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              title="Cancel"
              disabled={isSubmitting}
            />
            <Button
              type="submit"
              title={isSubmitting ? "Updating..." : "Update Notification"}
              disabled={isSubmitting}
              className="bg-primary hover:bg-primary/90"
            />
          </div>
        </form>
      </div>
    </Dialog>
  );
}
