'use client';

import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { Dialog } from '@/components/ui/Dialog';
import { Calendar, CheckCircle, Mail, Phone, Shield, User, XCircle } from 'lucide-react';

export default function UserDetailsModal({ user, onClose }) {
  const getStatusBadge = (verified) => {
    if (verified) {
      return <Badge className="bg-success-light text-success border border-success-border px-2 py-1">Active</Badge>;
    } else {
      return <Badge className="bg-red-100 text-red-800 border border-red-500 px-2 py-1">Blocklist</Badge>;
    }
  };

  const getRoleBadge = (role) => {
    const roleColors = {
      'Merchant': 'bg-blue-100 text-blue-800 border border-blue-500 px-2 py-1',
      'Customer': 'bg-purple-100 text-purple-800 border border-purple-500 px-2 py-1',
      'Root': 'bg-red-100 text-red-800 border border-red-500 px-2 py-1',
      'GOLMod': 'bg-orange-100 text-orange-800 border border-orange-500 px-2 py-1',
      'GOLStaff': 'bg-yellow-100 text-yellow-800 border border-yellow-500 px-2 py-1'
    };

    return (
      <Badge className={roleColors[role] || 'bg-gray-100 text-gray-800 border border-gray-500 px-2 py-1'}>
        {role === 'Merchant' ? 'CFS Admin' : role === 'Customer' ? 'Customer' : role}
      </Badge>
    );
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const displayName = user.name || `${user.firstname || ''} ${user.lastname || ''}`.trim() || user.username || 'N/A';

  return (
    <Dialog
      open={true}
      onOpenChange={onClose}
      title="User Details"
    >
      <div className="space-y-6 w-full max-w-2xl">
          {/* User Header */}
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <User size={32} className="text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold">{displayName}</h3>
              <p className="text-gray-600">{user.email}</p>
              <div className="flex gap-2 mt-2">
                {getStatusBadge(user.verified)}
                {getRoleBadge(user.role)}
              </div>
            </div>
          </div>

          {/* User Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold text-lg border-b pb-2">Personal Information</h4>

              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <User size={18} className="text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="font-medium">{user.name || 'Not provided'}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <User size={18} className="text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">First Name</p>
                    <p className="font-medium">{user.firstname || 'Not provided'}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <User size={18} className="text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Last Name</p>
                    <p className="font-medium">{user.lastname || 'Not provided'}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <User size={18} className="text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Username</p>
                    <p className="font-medium">{user.username || 'Not provided'}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold text-lg border-b pb-2">Contact Information</h4>

              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Mail size={18} className="text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Email Address</p>
                    <p className="font-medium">{user.email}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Phone size={18} className="text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Phone Number</p>
                    <p className="font-medium">{user.phone || 'Not provided'}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Mail size={18} className="text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Email Visibility</p>
                    <div className="flex items-center space-x-1">
                      {user.emailVisibility ? (
                        <CheckCircle size={16} className="text-green-500" />
                      ) : (
                        <XCircle size={16} className="text-red-500" />
                      )}
                      <p className="font-medium">
                        {user.emailVisibility ? 'Public' : 'Private'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Account Information */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg border-b pb-2">Account Information</h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-3">
                <Shield size={18} className="text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Role</p>
                  <p className="font-medium">{user.role === 'Merchant' ? 'Client' : user.role}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <CheckCircle size={18} className="text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Account Status</p>
                  <div className="flex items-center space-x-1">
                    {user.verified ? (
                      <CheckCircle size={16} className="text-green-500" />
                    ) : (
                      <XCircle size={16} className="text-red-500" />
                    )}
                    <p className="font-medium">
                      {user.verified ? 'Verified/Active' : 'Unverified/Blocked'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Calendar size={18} className="text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Created</p>
                  <p className="font-medium">{formatDate(user.created)}</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Calendar size={18} className="text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Last Updated</p>
                  <p className="font-medium">{formatDate(user.updated)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* User ID */}
          <div className="space-y-2">
            <h4 className="font-semibold text-lg border-b pb-2">System Information</h4>
            <div className="bg-gray-50 p-3 rounded">
              <p className="text-sm text-gray-500">User ID</p>
              <p className="font-mono text-sm">{user.id}</p>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button
              variant="outline"
              title="Close"
              onClick={onClose}
            />
          </div>
        </div>
    </Dialog>
  );
}
