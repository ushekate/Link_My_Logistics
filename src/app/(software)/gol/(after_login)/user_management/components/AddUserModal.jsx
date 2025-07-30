'use client';

import { useState } from 'react';
import { Dialog } from '@/components/ui/Dialog';
import Input from '@/components/ui/Input';
import { Select, SelectItem } from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';
import { useCollection } from '@/hooks/useCollection';
import { toast } from 'sonner';
import { X, UserPlus } from 'lucide-react';
import pbclient from '@/lib/db';

export default function AddUserModal({ userType, onClose, onAdd }) {
  const { Register } = useAuth();
  const { createItem } = useCollection('users');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    firstname: '',
    lastname: '',
    username: '',
    email: '',
    phone: '',
    password: '',
    passwordConfirm: '',
    role: userType,
    verified: true
  });

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

  const validateForm = () => {
    if (!formData.email) {
      toast.error('Email is required');
      return false;
    }
    if (!formData.username) {
      toast.error('Username is required');
      return false;
    }
    if (!formData.password) {
      toast.error('Password is required');
      return false;
    }
    if (formData.password !== formData.passwordConfirm) {
      toast.error('Passwords do not match');
      return false;
    }
    if (formData.password.length < 8) {
      toast.error('Password must be at least 8 characters long');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Create user directly using PocketBase client to include all fields
      const userData = {
        email: formData.email,
        emailVisibility: true,
        username: formData.username,
        password: formData.password,
        passwordConfirm: formData.passwordConfirm,
        name: formData.name,
        firstname: formData.firstname,
        lastname: formData.lastname,
        phone: formData.phone ? Number(formData.phone) : null,
        role: formData.role,
        verified: formData.verified
      };

      await pbclient.collection('users').create(userData);

      toast.success(`${userType === 'Merchant' ? 'Client' : 'Customer'} created successfully`);
      onAdd();
      onClose();
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error('Failed to create user: ' + (error.message || 'Unknown error'));
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

  return (
    <Dialog
      open={true}
      onOpenChange={onClose}
      title={`Add New ${userType === 'Merchant' ? 'Client' : 'Customer'}`}
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
              <label className="block text-sm font-medium mb-1">Username *</label>
              <Input
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                placeholder="Enter username"
                required
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
              <label className="block text-sm font-medium mb-1">Email *</label>
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
              <label className="block text-sm font-medium mb-1">Password *</label>
              <Input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter password (min 8 characters)"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Confirm Password *</label>
              <Input
                name="passwordConfirm"
                type="password"
                value={formData.passwordConfirm}
                onChange={handleInputChange}
                placeholder="Confirm password"
                required
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

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="verified"
                name="verified"
                checked={formData.verified}
                onChange={handleInputChange}
                className="rounded border-gray-300"
              />
              <label htmlFor="verified" className="text-sm font-medium">
                Account Verified/Active
              </label>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> The user will receive login credentials via email. 
              Make sure the email address is correct.
            </p>
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
              title={`Create ${userType === 'Merchant' ? 'Client' : 'Customer'}`}
              icon={<UserPlus size={18} />}
              disabled={isLoading}
            />
          </div>
        </form>
    </Dialog>
  );
}
