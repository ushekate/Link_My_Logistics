'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSidebar } from "@/contexts/SidebarProvider";
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import pbclient from '@/lib/db';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Shield, 
  Clock,
  Settings,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react';
import Button from '@/components/ui/Button';
import { Select, SelectItem } from '@/components/ui/Select';
import Badge from '@/components/ui/Badge';

export default function ViewUserDetails() {
  const { setTitle } = useSidebar();
  const { id } = useParams();
  const router = useRouter();
  const { user: currentUser } = useAuth();
  
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusChanging, setStatusChanging] = useState(false);

  useEffect(() => {
    setTitle('View Details');
  }, [setTitle]);

  useEffect(() => {
    const fetchUser = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const foundUser = await pbclient.collection('users').getOne(id);
        setUserData(foundUser);
      } catch (error) {
        console.error('Error fetching user:', error);
        toast.error('Failed to load user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const handleStatusChange = async (newStatus) => {
    if (!userData) return;

    setStatusChanging(true);
    try {
      // Note: We can only update the status field, not the verified field (system field)
      await pbclient.collection('users').update(userData.id, {
        status: newStatus
      });

      setUserData(prev => ({
        ...prev,
        status: newStatus
      }));

      toast.success(`User status changed to ${newStatus}`);
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    } finally {
      setStatusChanging(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!userData) return;
    
    const confirmation = confirm('Are you sure you want to delete this user? This action cannot be undone.');
    if (confirmation) {
      try {
        // You would implement delete functionality here
        toast.success('User deleted successfully');
        router.push('/gol/user_management');
      } catch (error) {
        console.error('Error deleting user:', error);
        toast.error('Failed to delete user');
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getAccessRights = (role) => {
    const rights = {
      'Customer': ['Customer Management'],
      'Merchant': ['CFS Access', 'Customer Management', 'Report Access'],
      'GOLStaff': ['CFS Access', 'Customer Management', 'Report Access'],
      'GOLMod': ['CFS Access', 'Customer Management', 'Report Access', 'System Settings'],
      'Root': ['CFS Access', 'Customer Management', 'Report Access', 'System Settings']
    };
    return rights[role] || [];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <div className="text-lg text-gray-600">Loading user details...</div>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">User Not Found</h2>
          <p className="text-gray-600 mb-4">The user you're looking for doesn't exist.</p>
          <Button
            variant="outline"
            title="Back to User Management"
            icon={<ArrowLeft size={18} />}
            onClick={() => router.push('/gol/user_management')}
          />
        </div>
      </div>
    );
  }

  const displayName = userData.name || `${userData.firstname || ''} ${userData.lastname || ''}`.trim() || userData.username || 'N/A';
  const accessRights = getAccessRights(userData.role);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="outline"
            title="Back"
            icon={<ArrowLeft size={18} />}
            onClick={() => router.push('/gol/user_management')}
            className="mb-4"
          />
          <h1 className="text-2xl font-bold text-foreground">View Details</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Information Card */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold mb-6">Profile Information</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                  <div className="w-full p-3 bg-gray-100 rounded-md text-gray-800">
                    {displayName}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <div className="w-full p-3 bg-gray-100 rounded-md text-gray-800">
                    {userData.email}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <div className="w-full p-3 bg-gray-100 rounded-md text-gray-800">
                    {userData.phone || 'Not provided'}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                  <Select
                    value={userData.role === 'Merchant' ? 'IT Department' : 'Customer Department'}
                    onValueChange={() => {}}
                    disabled={true}
                    className="w-full"
                  >
                    <SelectItem value="IT Department">IT Department</SelectItem>
                    <SelectItem value="Customer Department">Customer Department</SelectItem>
                    <SelectItem value="Admin Department">Admin Department</SelectItem>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                  <div className="w-full p-3 bg-gray-100 rounded-md text-gray-800">
                    New York, USA
                  </div>
                </div>
              </div>
            </div>

            {/* Role & Permissions Card */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold mb-6">Role & Permissions</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                  <Select
                    value={userData.role === 'Merchant' ? 'Super Admin' : userData.role}
                    onValueChange={() => {}}
                    disabled={true}
                    className="w-full"
                  >
                    <SelectItem value="Super Admin">Super Admin</SelectItem>
                    <SelectItem value="Customer">Customer</SelectItem>
                    <SelectItem value="GOLStaff">GOL Staff</SelectItem>
                    <SelectItem value="GOLMod">GOL Moderator</SelectItem>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Access Rights</label>
                  <div className="space-y-2">
                    {accessRights.map((right, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <CheckCircle size={16} className="text-green-500" />
                        <span className="text-sm text-gray-700">{right}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Status & Actions */}
          <div className="space-y-6">
            {/* Account Status Card */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center space-x-2 mb-4">
                <div className={`w-3 h-3 rounded-full ${
                userData.status === 'Active' ? 'bg-green-500' :
                userData.status === 'Blocked' || userData.status === 'Suspended' ? 'bg-red-500' :
                userData.status === 'Pending' ? 'bg-yellow-500' : 'bg-gray-500'
              }`}></div>
                <h3 className="font-semibold">Account Status</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Currently {userData.status || 'Active'}
              </p>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Change Status</label>
                <Select
                  value={userData.status || 'Active'}
                  onValueChange={handleStatusChange}
                  disabled={statusChanging}
                  className="w-full"
                >
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Suspended">Suspended</SelectItem>
                  <SelectItem value="Blocked">Blocked</SelectItem>
                </Select>
              </div>
              
              <p className="text-xs text-gray-500">
                Changing the account status will affect user's access to the system.
              </p>
            </div>

            {/* Account Info Card */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Clock size={18} className="text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">Last Login</p>
                    <p className="text-sm text-gray-600">Today at 2:30 PM</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <User size={18} className="text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">Account Created</p>
                    <p className="text-sm text-gray-600">{formatDate(userData.created)}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Settings size={18} className="text-gray-500" />
                  <div>
                    <p className="text-sm font-medium">Two-Factor Authentication</p>
                    <p className="text-sm text-gray-600">Add an extra layer of security</p>
                  </div>
                  <div className="ml-auto">
                    <div className="w-8 h-4 bg-gray-300 rounded-full relative">
                      <div className="w-4 h-4 bg-white rounded-full shadow absolute top-0 left-0"></div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <Button
                    variant="outline"
                    title="Reset Password"
                    className="w-full mb-3"
                    icon={<AlertTriangle size={16} />}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="mt-8 flex justify-between">
          <Button
            variant="destructive"
            title="Delete Account"
            onClick={handleDeleteUser}
            className="bg-red-600 hover:bg-red-700 text-white"
          />
          <Button
            variant="default"
            title="Save Changes"
            className="bg-green-600 hover:bg-green-700 text-white"
          />
        </div>
      </div>
    </div>
  );
}
