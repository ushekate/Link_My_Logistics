'use client';

import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import MobileDataTable from '@/components/ui/MobileDataTable';
import { DataTable } from '@/components/ui/Table';
import { useAuth } from '@/contexts/AuthContext';
import { useIsMobile } from '@/hooks/use-mobile';
import { useCollection } from '@/hooks/useCollection';
import { Edit, Eye, Plus, Search, Trash, UserCheck, UserX } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import AddUserModal from './AddUserModal';

export default function UserTable({ userType }) {
  const { data, deleteItem, updateItem, mutation } = useCollection('users', {
    filter: `role="${userType}"`
  });
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const router = useRouter();

  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const getStatusBadge = (verified) => {
    if (verified) {
      return (
        <span className="inline-flex items-center px-4 py-2 rounded-full text-xs font-medium bg-success-light text-success">
          Active
        </span>
      );
    } else if (verified === 'N/A') {
      return (
        <span className="inline-flex items-center px-4 py-2 rounded-full text-xs font-medium bg-red-100 text-red-800">
          Blocklist
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center px-4 py-2 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          N/A
        </span>
      );
    }
  };

  const getRoleBadge = (role) => {
    const roleColors = {
      'Merchant': 'bg-blue-100 text-white border border-blue-500 px-4 py-2',
      'Customer': 'bg-purple-100 text-purple-800 border border-purple-500 px-2 py-1',
      'Root': 'bg-red-100 text-red-800 border border-red-500 px-2 py-1',
      'GOLMod': 'bg-orange-100 text-orange-800 border border-orange-500 px-2 py-1',
      'GOLStaff': 'bg-yellow-100 text-yellow-800 border border-yellow-500 px-2 py-1'
    };

    return (
      <Badge className={roleColors[role] || 'bg-gray-100 text-gray-800 border border-gray-500 px-2 py-1'}>
        {role === 'Merchant' ? 'Merchant' : role === 'Customer' ? 'Customer' : role}
      </Badge>
    );
  };

  const getAccessBadge = (role) => {
    const accessMap = {
      'Merchant': 'CFS Access',
      'Customer': 'Customer Access',
      'Root': 'Full Access',
      'GOLMod': 'GOL Admin Access',
      'GOLStaff': 'View Access'
    };

    return accessMap[role] || 'Limited Access';
  };

  const handleStatusToggle = async (userId, currentStatus) => {
    try {
      await updateItem(userId, {
        verified: !currentStatus
      });
      toast.success(`User ${!currentStatus ? 'activated' : 'blocked'} successfully`);
      mutation();
    } catch (error) {
      console.error('Error updating user status:', error);
      toast.error('Failed to update user status');
    }
  };

  const handleDeleteUser = async (userId) => {
    const confirmation = confirm('Are you sure you want to delete this user? This action cannot be undone.');
    if (confirmation) {
      try {
        await deleteItem(userId);
        toast.success('User deleted successfully');
        mutation();
      } catch (error) {
        console.error('Error deleting user:', error);
        toast.error('Failed to delete user');
      }
    }
  };

  const columns = [
    {
      id: 'name',
      accessorKey: 'name',
      header: 'Name',
      filterable: true,
      cell: ({ row }) => {
        const user = row.original;
        const displayName = user.name || `${user.firstname || ''} ${user.lastname || ''}`.trim() || user.username || 'N/A';
        return (
          <div className="font-medium">
            {displayName}
          </div>
        );
      },
    },
    {
      id: 'email',
      accessorKey: 'email',
      header: 'Email ID',
      filterable: true,
      cell: ({ row }) => (
        <div className="text-sm">
          {row.original.email}
        </div>
      ),
    },
    {
      id: 'phone',
      accessorKey: 'phone',
      header: 'Phone No.',
      filterable: true,
      cell: ({ row }) => (
        <div className="text-sm">
          {row.original.phone || 'N/A'}
        </div>
      ),
    },
    {
      id: 'status',
      accessorKey: 'verified',
      header: 'Status',
      filterable: false,
      cell: ({ row }) => getStatusBadge(row.original.verified),
    },
    {
      id: 'role',
      accessorKey: 'role',
      header: 'Role',
      filterable: false,
      cell: ({ row }) => getRoleBadge(row.original.role),
    },
    {
      id: 'access',
      accessorKey: 'access',
      header: 'Access',
      filterable: false,
      cell: ({ row }) => (
        <div className="text-sm">
          {getAccessBadge(row.original.role)}
        </div>
      ),
    },
    {
      id: 'actions',
      accessorKey: 'actions',
      header: 'Action',
      filterable: false,
      cell: ({ row }) => (
        <div className='flex gap-2 items-center'>
          <Eye
            size={18}
            className="cursor-pointer text-primary hover:text-primary/80"
            onClick={() => router.push(`/gol/user_management/${row.original.id}/view`)}
            title="View Details"
          />
          <Edit
            size={18}
            className="cursor-pointer text-primary hover:text-primary/80"
            onClick={() => router.push(`/gol/user_management/${row.original.id}/edit`)}
            title="Edit User"
          />
          {row.original.verified ? (
            <UserX
              size={18}
              className="cursor-pointer text-red-600 hover:text-red-800"
              onClick={() => handleStatusToggle(row.original.id, row.original.verified)}
              title="Block User"
            />
          ) : (
            <UserCheck
              size={18}
              className="cursor-pointer text-green-600 hover:text-green-800"
              onClick={() => handleStatusToggle(row.original.id, row.original.verified)}
              title="Activate User"
            />
          )}
          <Trash
            size={18}
            className="cursor-pointer text-red-600 hover:text-red-800"
            onClick={() => handleDeleteUser(row.original.id)}
            title="Delete User"
          />
        </div>
      ),
    }
  ];

  const mobileColumns = [
    {
      id: 'user_info',
      header: `${userType === 'Merchant' ? 'Client' : 'Customer'} Information`,
      cell: ({ row }) => {
        const userData = row.original;
        const displayName = userData.name || `${userData.firstname || ''} ${userData.lastname || ''}`.trim() || userData.username || 'N/A';

        return (
          <div className="space-y-2">
            <div className="font-medium text-lg">{displayName}</div>
            <div className="text-sm text-gray-600">{userData.email}</div>
            <div className="text-sm text-gray-600">{userData.phone || 'N/A'}</div>
            <div className="flex gap-2 flex-wrap">
              {getStatusBadge(userData.verified)}
              {getRoleBadge(userData.role)}
            </div>
            <div className="text-xs text-gray-500">{getAccessBadge(userData.role)}</div>
          </div>
        );
      },
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => (
        <div className='flex gap-2 items-center justify-end'>
          <Eye
            size={18}
            className="cursor-pointer text-primary"
            onClick={() => router.push(`/gol/user_management/${row.original.id}/view`)}
          />
          <Edit
            size={18}
            className="cursor-pointer text-primary"
            onClick={() => router.push(`/gol/user_management/${row.original.id}/edit`)}
          />
          {row.original.verified ? (
            <UserX
              size={18}
              className="cursor-pointer text-red-600"
              onClick={() => handleStatusToggle(row.original.id, row.original.verified)}
            />
          ) : (
            <UserCheck
              size={18}
              className="cursor-pointer text-green-600"
              onClick={() => handleStatusToggle(row.original.id, row.original.verified)}
            />
          )}
          <Trash
            size={18}
            className="cursor-pointer text-red-600"
            onClick={() => handleDeleteUser(row.original.id)}
          />
        </div>
      ),
    }
  ];

  // Filter data based on search term
  const filteredData = data?.filter(user => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    const displayName = user.name || `${user.firstname || ''} ${user.lastname || ''}`.trim() || user.username || '';
    return (
      displayName.toLowerCase().includes(searchLower) ||
      user.email?.toLowerCase().includes(searchLower) ||
      user.phone?.toString().includes(searchTerm) ||
      user.username?.toLowerCase().includes(searchLower)
    );
  }) || [];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-semibold">
            {userType === 'Merchant' ? 'Client Management' : 'Customer Management'}
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Total {userType === 'Merchant' ? 'Clients' : 'Customers'}: {filteredData.length}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              placeholder="Search user by name/email"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full sm:w-80 bg-gray-50 border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>
          <Button
            variant="default"
            title={`Add New ${userType === 'Merchant' ? 'Client' : 'Customer'}`}
            icon={<Plus size={18} />}
            onClick={() => setShowAddModal(true)}
            className="bg-primary hover:bg-primary/90 text-white px-4 py-2"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {isMobile ? (
          <MobileDataTable
            data={filteredData}
            columns={mobileColumns}
            loading={!data}
          />
        ) : (
          <DataTable
            data={filteredData}
            columns={columns}
            loading={!data}
            displayFilters={false}
          />
        )}
      </div>

      {/* Add User Modal */}
      {showAddModal && (
        <AddUserModal
          userType={userType}
          onClose={() => setShowAddModal(false)}
          onAdd={mutation}
        />
      )}
    </div>
  );
}
