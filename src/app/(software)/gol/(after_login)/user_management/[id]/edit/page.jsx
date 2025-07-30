'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSidebar } from "@/contexts/SidebarProvider";
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { ArrowLeft, Save, User, Mail, Phone, Shield } from 'lucide-react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Select, SelectItem } from '@/components/ui/Select';
import pbclient from '@/lib/db';

export default function EditUserDetails() {
  const { setTitle } = useSidebar();
  const { id } = useParams();
  const router = useRouter();
  const { user: currentUser } = useAuth();
  
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    firstname: '',
    lastname: '',
    username: '',
    email: '',
    phone: '',
    role: '',
    verified: false,
    emailVisibility: false,
    status: ''
  });

  useEffect(() => {
    setTitle('Edit User');
  }, [setTitle]);

  useEffect(() => {
    const fetchUser = async () => {
      if (!id) return;

      try {
        setLoading(true);
        const foundUser = await pbclient.collection('users').getOne(id);
        console.log('Found user:', foundUser); // Debug log

        if (foundUser) {
          setUserData(foundUser);
          setFormData({
            name: foundUser.name || '',
            firstname: foundUser.firstname || '',
            lastname: foundUser.lastname || '',
            username: foundUser.username || '',
            email: foundUser.email || '',
            phone: foundUser.phone || '',
            role: foundUser.role || '',
            verified: foundUser.verified || false,
            emailVisibility: foundUser.emailVisibility || false,
            status: foundUser.status || 'Active'
          });
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        toast.error('Failed to load user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userData) {
      toast.error('User data not found');
      return;
    }

    setSaving(true);

    try {
      // Prepare update data without system fields
      const updateData = {
        name: formData.name,
        firstname: formData.firstname,
        lastname: formData.lastname,
        username: formData.username,
        email: formData.email,
        phone: formData.phone ? Number(formData.phone) : null,
        role: formData.role,
        status: formData.status
      };

      // Note: verified and emailVisibility are system fields in PocketBase auth collection
      // They cannot be updated directly through regular update operations

      await pbclient.collection('users').update(userData.id, updateData);

      toast.success('User updated successfully');
      router.push('/gol/user_management');
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Failed to update user. Please try again.');
    } finally {
      setSaving(false);
    }
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

  const roleOptions = [
    { value: 'Customer', label: 'Customer' },
    { value: 'Merchant', label: 'Client' },
    { value: 'GOLStaff', label: 'GOL Staff' },
    { value: 'GOLMod', label: 'GOL Moderator' },
    { value: 'Root', label: 'Root Admin' }
  ];

  const statusOptions = [
    { value: 'Active', label: 'Active' },
    { value: 'Inactive', label: 'Inactive' },
    { value: 'Pending', label: 'Pending' },
    { value: 'Suspended', label: 'Suspended' },
    { value: 'Blocked', label: 'Blocked' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="outline"
            title="Back"
            icon={<ArrowLeft size={18} />}
            onClick={() => router.push('/gol/user_management')}
            className="mb-4"
          />
          <h1 className="text-2xl font-bold text-foreground">Edit User Details</h1>
          <p className="text-gray-600">Update user information and permissions</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Information Card */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center space-x-2 mb-6">
              <User size={20} className="text-gray-600" />
              <h2 className="text-lg font-semibold">Profile Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter full name"
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                <Input
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  placeholder="Enter username"
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                <Input
                  name="firstname"
                  value={formData.firstname}
                  onChange={handleInputChange}
                  placeholder="Enter first name"
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                <Input
                  name="lastname"
                  value={formData.lastname}
                  onChange={handleInputChange}
                  placeholder="Enter last name"
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Contact Information Card */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center space-x-2 mb-6">
              <Mail size={20} className="text-gray-600" />
              <h2 className="text-lg font-semibold">Contact Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter email address"
                  className="w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <Input
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Enter phone number"
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Role & Permissions Card */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center space-x-2 mb-6">
              <Shield size={20} className="text-gray-600" />
              <h2 className="text-lg font-semibold">Role & Permissions</h2>
            </div>
            <p className="text-sm text-gray-600 mb-4">Note: Account verification and email visibility are system-managed fields and cannot be modified.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => handleSelectChange('role', value)}
                  placeholder="Select role"
                  className="w-full"
                >
                  {roleOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleSelectChange('status', value)}
                  placeholder="Select status"
                  className="w-full"
                >
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </Select>
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="verified"
                  name="verified"
                  checked={formData.verified}
                  disabled={true}
                  className="w-4 h-4 text-green-600 bg-gray-100 border-gray-300 rounded opacity-50 cursor-not-allowed"
                />
                <label htmlFor="verified" className="text-sm font-medium text-gray-500">
                  Account Verified/Active (Read-only)
                </label>
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="emailVisibility"
                  name="emailVisibility"
                  checked={formData.emailVisibility}
                  disabled={true}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded opacity-50 cursor-not-allowed"
                />
                <label htmlFor="emailVisibility" className="text-sm font-medium text-gray-500">
                  Email Visibility (Read-only)
                </label>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-6">
            <Button
              type="button"
              variant="outline"
              title="Cancel"
              onClick={() => router.push('/gol/user_management')}
              disabled={saving}
            />
            <Button
              type="submit"
              variant="default"
              title="Save Changes"
              icon={<Save size={18} />}
              disabled={saving}
              className="bg-green-600 hover:bg-green-700 text-white"
            />
          </div>
        </form>
      </div>
    </div>
  );
}
