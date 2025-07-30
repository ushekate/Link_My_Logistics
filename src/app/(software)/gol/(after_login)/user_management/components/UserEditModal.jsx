'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Dialog } from '@/components/ui/Dialog';
import Input from '@/components/ui/Input';
import { Select, SelectItem } from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import { useCollection } from '@/hooks/useCollection';
import { toast } from 'sonner';
import { X, Save } from 'lucide-react';

export default function UserEditModal({ user, onClose, onUpdate }) {
  const router = useRouter();
  const { updateItem } = useCollection('users');
  const [isLoading, setIsLoading] = useState(false);
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
    status: '',
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        firstname: user.firstname || '',
        lastname: user.lastname || '',
        username: user.username || '',
        email: user.email || '',
        phone: user.phone || '',
        role: user.role || '',
        verified: user.verified || false,
        emailVisibility: user.emailVisibility || false,
        status: user.status || 'Active'
      });
    }
  }, [user]);

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
    setIsLoading(true);

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
      // These would need to be handled through PocketBase admin API or special endpoints

      await updateItem(user.id, updateData);

      toast.success('User updated successfully');
      onUpdate();
      onClose();

      // Redirect to user management page
      router.push('/gol/user_management');
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Failed to update user. Please check the form data.');
    } finally {
      setIsLoading(false);
    }
  };

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
    <Dialog
      open={true}
      onOpenChange={onClose}
      title="Edit User Information"
    >
      <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Full Name</label>
              <Input
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Username</label>
              <Input
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Enter username"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">First Name</label>
              <Input
                name="firstname"
                value={formData.firstname}
                onChange={handleInputChange}
                placeholder="Enter first name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Last Name</label>
              <Input
                name="lastname"
                value={formData.lastname}
                onChange={handleInputChange}
                placeholder="Enter last name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <Input
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter email address"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Phone Number</label>
              <Input
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Enter phone number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Role</label>
              <Select
                value={formData.role}
                onValueChange={(value) => handleSelectChange('role', value)}
                placeholder="Select role"
              >
                {roleOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Status</label>
              <Select
                value={formData.status}
                onValueChange={(value) => handleSelectChange('status', value)}
                placeholder="Select status"
              >
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </Select>
            </div>
          </div>

          {/* Additional Settings Section */}
          <div className="space-y-4 pt-4 border-t">
            <h3 className="text-lg font-medium">Account Settings</h3>
            <p className="text-sm text-gray-600">Note: Account verification and email visibility are managed by the system and cannot be changed here.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
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

              <div className="flex items-center space-x-2">
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

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              title="Cancel"
              onClick={onClose}
              disabled={isLoading}
            />
            <Button
              type="submit"
              variant="default"
              title="Save Changes"
              icon={<Save size={18} />}
              disabled={isLoading}
            />
          </div>
        </form>
    </Dialog>
  );
}
