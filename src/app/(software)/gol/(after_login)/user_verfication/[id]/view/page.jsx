'use client';

import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';
import { useSidebar } from "@/contexts/SidebarProvider";
import { useCollection } from '@/hooks/useCollection';
import {
    ArrowLeft,
    Building,
    CheckCircle,
    Clock,
    Shield,
    User,
    XCircle
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function ViewUserVerification() {
  const { setTitle } = useSidebar();
  const { id } = useParams();
  const router = useRouter();
  const { user: currentUser } = useAuth();

  const [userData, setUserData] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [statusChanging, setStatusChanging] = useState(false);

  // Use useCollection hook for updating user
  const { updateItem: updateUser } = useCollection('users');

  // Use useCollection hook for all users
  const { data: users } = useCollection('users', {
    filter: 'role="Customer" || role="Merchant"',
    sort: '-created'
  });

  // Use useCollection hook for user profiles
  const { data: userProfiles } = useCollection('user_profile', {
    expand: 'user'
  });

  useEffect(() => {
    setTitle('User Verification Details');
  }, [setTitle]);

  useEffect(() => {
    // Find the specific user from the users data
    if (users && id) {
      const foundUser = users.find(user => user.id === id);
      if (foundUser) {
        setUserData(foundUser);
      } else {
        toast.error('User not found');
      }
    }
  }, [users, id]);

  useEffect(() => {
    // Find user profile for this user
    if (userProfiles && userData) {
      const profile = userProfiles.find(p => p.user === userData.id);
      setUserProfile(profile);
    }
  }, [userProfiles, userData]);

  const handleVerificationAction = async (action) => {
    if (!userData) return;

    setStatusChanging(true);
    try {
      const updateData = {
        isVerified: action === 'approve',
        status: action === 'approve' ? 'Active' : 'Blocklist'
      };

      await updateUser(userData.id, updateData);

      setUserData(prev => ({
        ...prev,
        ...updateData
      }));

      toast.success(`User ${action === 'approve' ? 'approved' : 'rejected'} successfully`);
    } catch (error) {
      console.error('Error updating verification status:', error);
      toast.error('Failed to update verification status');
    } finally {
      setStatusChanging(false);
    }
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

  const getStatusBadge = (user) => {
    if (user.isVerified) {
      return <Badge variant="success" icon={<CheckCircle size={16} />}>Approved</Badge>;
    } else if (user.status === 'Blocklist') {
      return <Badge variant="destructive" icon={<XCircle size={16} />}>Rejected</Badge>;
    } else {
      return <Badge variant="warning" icon={<Clock size={16} />}>Pending</Badge>;
    }
  };

  const getRoleBadge = (role) => {
    const roleConfig = {
      'Customer': { label: 'Customer', variant: 'secondary' },
      'Merchant': { label: 'CFS Provider', variant: 'default' }
    };

    const config = roleConfig[role] || { label: role, variant: 'outline' };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (!userData) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <div className="text-gray-500">Loading user details...</div>
          </div>
        </div>
      </div>
    );
  }

  const displayName = userData.firstname && userData.lastname
    ? `${userData.firstname} ${userData.lastname}`
    : userData.name || 'N/A';

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={() => router.back()}
              icon={<ArrowLeft size={20} />}
              title="Back"
            />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">User Verification Details</h1>
              <p className="text-gray-600">Review user information and verification status</p>
            </div>
          </div>

          {/* Action Buttons */}
          {!userData.isVerified && userData.status !== 'Blocklist' && (
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={() => handleVerificationAction('approve')}
                disabled={statusChanging}
                className="text-green-600 hover:text-green-800 border-green-200 hover:border-green-300"
                icon={<CheckCircle size={18} />}
                title={statusChanging ? 'Processing...' : 'Approve User'}
              />
              <Button
                variant="outline"
                onClick={() => handleVerificationAction('reject')}
                disabled={statusChanging}
                className="text-red-600 hover:text-red-800 border-red-200 hover:border-red-300"
                icon={<XCircle size={18} />}
                title={statusChanging ? 'Processing...' : 'Reject User'}
              />
            </div>
          )}
        </div>

        {/* User Information Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Basic Information */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center space-x-3 mb-4">
              <User className="text-blue-600" size={24} />
              <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">Full Name</span>
                <span className="text-sm text-gray-900">{displayName}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">Username</span>
                <span className="text-sm text-gray-900">{userData.username || 'N/A'}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">Email</span>
                <span className="text-sm text-gray-900">{userData.email}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">Phone</span>
                <span className="text-sm text-gray-900">{userData.phone || 'N/A'}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">Role</span>
                {getRoleBadge(userData.role)}
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">Status</span>
                {getStatusBadge(userData)}
              </div>
            </div>
          </div>

          {/* Account Details */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center space-x-3 mb-4">
              <Shield className="text-green-600" size={24} />
              <h2 className="text-lg font-semibold text-gray-900">Account Details</h2>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">Email Verified</span>
                <Badge variant={userData.verified ? 'success' : 'warning'}>
                  {userData.verified ? 'Verified' : 'Unverified'}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">Account Status</span>
                <Badge variant={userData.status === 'Active' ? 'success' : 'destructive'}>
                  {userData.status || 'Inactive'}
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">Registration Date</span>
                <span className="text-sm text-gray-900">{formatDate(userData.created)}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">Last Updated</span>
                <span className="text-sm text-gray-900">{formatDate(userData.updated)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Business Information (if available) */}
        {userProfile && (
          <div className="mt-6">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Building className="text-purple-600" size={24} />
                <h2 className="text-lg font-semibold text-gray-900">Business Information</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500">Business Name</span>
                    <span className="text-sm text-gray-900">{userProfile.businessName || 'N/A'}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500">GST Number</span>
                    <span className="text-sm text-gray-900">{userProfile.gstIn || 'N/A'}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500">PAN Number</span>
                    <span className="text-sm text-gray-900">{userProfile.panNo || 'N/A'}</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <span className="text-sm font-medium text-gray-500">Address</span>
                    <span className="text-sm text-gray-900 text-right max-w-xs">
                      {userProfile.address || 'N/A'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500">Contact</span>
                    <span className="text-sm text-gray-900">{userProfile.contact || 'N/A'}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-500">Documents</span>
                    <span className="text-sm text-gray-900">
                      {userProfile.documents ? 'Uploaded' : 'Not uploaded'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}