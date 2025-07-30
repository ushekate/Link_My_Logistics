'use client';

import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import MobileDataTable from '@/components/ui/MobileDataTable';
import { Select, SelectItem } from '@/components/ui/Select';
import { DataTable } from '@/components/ui/Table';
import { useSidebar } from "@/contexts/SidebarProvider";
import { useIsMobile } from '@/hooks/use-mobile';
import { useCollection } from '@/hooks/useCollection';
import pbclient from '@/lib/db';
import {
    CheckCircle,
    Eye,
    Search,
    XCircle
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function UserVerificationPage() {
  const { setTitle } = useSidebar();
  const isMobile = useIsMobile();

  // Use useCollection hook for users - temporarily remove filter to see all users
  const {
    data: users,
    error: usersError,
    mutation: refreshUsers,
    updateItem: updateUser
  } = useCollection('users', {
    // filter: 'role="Customer" || role="Merchant"',
    expand: 'user_profile_via_user',
    sort: '-created'
  });

  // Use useCollection hook for user profiles
  const {
    data: userProfiles,
    error: profilesError
  } = useCollection('user_profile', {
    expand: 'user'
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [userTypeFilter, setUserTypeFilter] = useState('CFS');
  const [dateFromFilter, setDateFromFilter] = useState('');
  const [dateToFilter, setDateToFilter] = useState('');

  useEffect(() => {
    setTitle('User Verification');
  }, [setTitle]);

  useEffect(() => {
    if (usersError) {
      console.error('Error fetching users:', usersError);
      toast.error('Failed to load user data');
    }
    if (profilesError) {
      console.error('Error fetching profiles:', profilesError);
      toast.error('Failed to load profile data');
    }
  }, [usersError, profilesError]);

  // Debug logging
  useEffect(() => {
    console.log('=== USER VERIFICATION DEBUG ===');
    console.log('Auth store:', pbclient.authStore);
    console.log('Is authenticated:', pbclient.authStore.isValid);
    console.log('Current user:', pbclient.authStore.record);
    console.log('Users data:', users);
    console.log('Users error:', usersError);
    console.log('User profiles data:', userProfiles);
    console.log('Profiles error:', profilesError);

    // Test direct database access
    const testDbAccess = async () => {
      try {
        console.log('Testing direct database access...');

        // Test basic connection
        console.log('PocketBase URL:', pbclient.baseUrl);

        // Try to get all users without filter first
        const allUsers = await pbclient.collection('users').getFullList();
        console.log('All users from direct call:', allUsers);
        console.log('Total users found:', allUsers.length);

        // Try with filter
        const filteredUsers = await pbclient.collection('users').getFullList({
          filter: 'role="Customer" || role="Merchant"'
        });
        console.log('Filtered users from direct call:', filteredUsers);
        console.log('Filtered users count:', filteredUsers.length);

        // Check what roles exist
        const uniqueRoles = [...new Set(allUsers.map(user => user.role))];
        console.log('Unique roles in database:', uniqueRoles);

      } catch (error) {
        console.error('Direct database access error:', error);
        console.error('Error details:', error.message);
        console.error('Error status:', error.status);
      }
    };

    testDbAccess();
  }, [users, usersError, userProfiles, profilesError]);

  const handleVerificationAction = async (userId, action) => {
    try {
      const updateData = {
        isVerified: action === 'approve',
        status: action === 'approve' ? 'Active' : 'Blocklist'
      };

      await updateUser(userId, updateData);

      toast.success(`User ${action === 'approve' ? 'approved' : 'rejected'} successfully`);
      refreshUsers(); // Refresh data using the hook's mutation function
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Failed to update user status');
    }
  };

  const handleViewUser = (userId) => {
    // Navigate to user details page
    window.open(`/gol/user_management/${userId}/view`, '_blank');
  };

  const getStatusBadge = (user) => {
    if (user.isVerified) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-light text-success">
          Approved
        </span>
      );
    } else if (user.status === 'Blocklist') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          Rejected
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          Pending
        </span>
      );
    }
  };

  const getRoleBadge = (role) => {
    const roleConfig = {
      'Customer': { label: 'Customer', color: 'bg-blue-100 text-blue-800' },
      'Merchant': { label: 'CFS', color: 'bg-purple-100 text-purple-800' }
    };

    const config = roleConfig[role] || { label: role, color: 'bg-gray-100 text-gray-800' };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const getUserProfile = (userId) => {
    return userProfiles?.find(profile => profile.user === userId);
  };

  const filteredUsers = users?.filter(user => {
    const profile = getUserProfile(user.id);
    const matchesSearch = !searchTerm ||
      user.firstname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile?.businessName?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = !statusFilter ||
      (statusFilter === 'Pending' && !user.isVerified && user.status !== 'Blocklist') ||
      (statusFilter === 'Approved' && user.isVerified) ||
      (statusFilter === 'Rejected' && user.status === 'Blocklist');

    const matchesUserType = !userTypeFilter ||
      (userTypeFilter === 'CFS' && user.role === 'Merchant') ||
      (userTypeFilter === 'Customer' && user.role === 'Customer');

    const matchesDateFrom = !dateFromFilter || new Date(user.created) >= new Date(dateFromFilter);
    const matchesDateTo = !dateToFilter || new Date(user.created) <= new Date(dateToFilter);

    return matchesSearch && matchesStatus && matchesUserType && matchesDateFrom && matchesDateTo;
  });

  const columns = [
    {
      id: 'firstName',
      accessorKey: 'firstname',
      header: 'First Name',
      cell: ({ row }) => (
        <div className="font-medium text-gray-900">
          {row.original.firstname || row.original.name?.split(' ')[0] || 'N/A'}
        </div>
      ),
    },
    {
      id: 'lastName',
      accessorKey: 'lastname',
      header: 'Last Name',
      cell: ({ row }) => (
        <div className="text-gray-900">
          {row.original.lastname || row.original.name?.split(' ').slice(1).join(' ') || 'N/A'}
        </div>
      ),
    },
    {
      id: 'role',
      accessorKey: 'role',
      header: 'Role',
      cell: ({ row }) => getRoleBadge(row.original.role),
    },
    {
      id: 'status',
      accessorKey: 'isVerified',
      header: 'Status',
      cell: ({ row }) => getStatusBadge(row.original),
    },
    {
      id: 'actions',
      header: 'Action',
      cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleViewUser(row.original.id)}
            className="text-blue-600 hover:text-blue-800 border-blue-200 hover:border-blue-300"
          >
            <Eye size={16} className="mr-1" />
            View
          </Button>
          {!row.original.isVerified && row.original.status !== 'Blocklist' && (
            <>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleVerificationAction(row.original.id, 'approve')}
                className="text-green-600 hover:text-green-800 border-green-200 hover:border-green-300"
              >
                <CheckCircle size={16} className="mr-1" />
                Approve
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleVerificationAction(row.original.id, 'reject')}
                className="text-red-600 hover:text-red-800 border-red-200 hover:border-red-300"
              >
                <XCircle size={16} className="mr-1" />
                Reject
              </Button>
            </>
          )}
        </div>
      ),
    },
  ];

  const mobileColumns = [
    {
      id: 'userInfo',
      header: 'User Information',
      cell: ({ row }) => {
        const profile = getUserProfile(row.original.id);
        const displayName = row.original.firstname && row.original.lastname
          ? `${row.original.firstname} ${row.original.lastname}`
          : row.original.name || 'N/A';

        return (
          <div className="space-y-2">
            <div className="font-medium text-gray-900">{displayName}</div>
            <div className="text-sm text-gray-600">{row.original.email}</div>
            <div className="flex items-center space-x-2">
              {getRoleBadge(row.original.role)}
              {getStatusBadge(row.original)}
            </div>
            <div className="flex items-center space-x-2 mt-2 flex-wrap">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleViewUser(row.original.id)}
                className="text-blue-600 hover:text-blue-800 border-blue-200 hover:border-blue-300"
              >
                <Eye size={16} className="mr-1" />
                View
              </Button>
              {!row.original.isVerified && row.original.status !== 'Blocklist' && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleVerificationAction(row.original.id, 'approve')}
                    className="text-success hover:text-success border-success-border hover:border-success"
                  >
                    <CheckCircle size={16} className="mr-1" />
                    Approve
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleVerificationAction(row.original.id, 'reject')}
                    className="text-red-600 hover:text-red-800 border-red-200 hover:border-red-300"
                  >
                    <XCircle size={16} className="mr-1" />
                    Reject
                  </Button>
                </>
              )}
            </div>
          </div>
        );
      },
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">User Verification Page</h1>
          <p className="text-gray-600 mt-1">Review and verify user registrations</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            {/* User Type Filter */}
            <div className="flex items-center space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="userType"
                  value="CFS"
                  checked={userTypeFilter === 'CFS'}
                  onChange={(e) => setUserTypeFilter(e.target.value)}
                  className="mr-2 text-green-600 focus:ring-green-500"
                />
                <span className="text-sm font-medium text-gray-700">CFS</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="userType"
                  value="Customer"
                  checked={userTypeFilter === 'Customer'}
                  onChange={(e) => setUserTypeFilter(e.target.value)}
                  className="mr-2 text-green-600 focus:ring-green-500"
                />
                <span className="text-sm font-medium text-gray-700">Customer</span>
              </label>
            </div>

            {/* Search */}
            <div className="relative flex-1 min-w-64">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search Name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-gray-50 border-gray-200"
              />
            </div>

            {/* Status Filter */}
            <Select
              value={statusFilter}
              onValueChange={setStatusFilter}
              placeholder="Status"
              className="min-w-32"
            >
              <SelectItem value="">All Status</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Approved">Approved</SelectItem>
              <SelectItem value="Rejected">Rejected</SelectItem>
            </Select>

            {/* Date Filters */}
            <Input
              type="date"
              placeholder="mm/dd/yyyy"
              value={dateFromFilter}
              onChange={(e) => setDateFromFilter(e.target.value)}
              className="min-w-40"
            />
            <Input
              type="date"
              placeholder="mm/dd/yyyy"
              value={dateToFilter}
              onChange={(e) => setDateToFilter(e.target.value)}
              className="min-w-40"
            />
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="px-6 py-4 border-b bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-900">
              {userTypeFilter === 'CFS' ? 'Container Freight Station(CFS)' : 'Customer Verification'}
            </h2>
          </div>

          <div className="p-6">
            {!users ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-gray-500">Loading users...</div>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-gray-500">No users found matching the criteria</div>
              </div>
            ) : (
              <>
                {isMobile ? (
                  <MobileDataTable
                    data={filteredUsers}
                    columns={mobileColumns}
                    loading={!users}
                    displayFilters={false}
                  />
                ) : (
                  <DataTable
                    data={filteredUsers}
                    columns={columns}
                    loading={!users}
                    displayFilters={false}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}