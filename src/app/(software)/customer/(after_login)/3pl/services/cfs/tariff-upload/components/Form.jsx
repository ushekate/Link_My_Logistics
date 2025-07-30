import React, { useState } from 'react';
import Input from '@/components/ui/Input';
import Label from '@/components/ui/Label';
import Button from '@/components/ui/Button';
import { Plus, Upload } from 'lucide-react';
import OrderInput from './OrderInput';
import { Dialog } from '@/components/ui/Dialog';
import TextArea from '@/components/ui/TextArea';
import { useCollection } from '@/hooks/useCollection';
import { Select, SelectItem } from '@/components/ui/Select';
import ContainerInput from './ContainerInput';
import { toast } from 'sonner';

export default function Form() {
  const { createItem, mutation } = useCollection('warehouse_tariffs_request');

  const [formData, setFormData] = useState({
    agent: '',
    receiptNo: '',
    type: '',
    status: 'Pending',
    fromDate: new Date().toISOString().split('T')[0],
    toDate: new Date().toISOString().split('T')[0],
    remarks: '',
    files: []
  });

  const [orderId, setOrderId] = useState('');
  const [containerNumber, setContainerNumber] = useState('')
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleServiceChange = (value) => {
    setFormData({
      ...formData,
      type: value
    });
  };

  const handleReset = () => {
    setFormData({
      agent: '',
      receiptNo: '',
      type: '',
      status: 'Pending',
      fromDate: new Date().toISOString().split('T')[0],
      toDate: new Date().toISOString().split('T')[0],
      remarks: '',
      files: []
    });
    setOrderId('');
    setContainerNumber('');
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({
      ...prev,
      files
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append('order', orderId);
      data.append('container', containerNumber);
      data.append('type', formData.type);
      data.append('fromDate', formData.fromDate);
      data.append('toDate', formData.toDate);
      data.append('remarks', formData.remarks);
      data.append('status', formData.status);

      // Append each file
      formData.files.forEach((file) => {
        data.append('files', file); // `files` must match the PocketBase field name
      });

      console.log('Form submitted:', data);
      await createItem(data);
      toast.success('Created a new request');
    } catch (error) {
      console.log(error)
      toast.error(error.message);
    } finally {
      handleReset();
      mutation();
      setIsOpen(false);
    }
  };

  return (
    <Dialog
      title={`Create New Request`}
      open={isOpen}
      onOpenChange={setIsOpen}
      trigger={
        <Button
          title={'New'}
          icon={<Plus />}
          className='rounded-md'
          iconPosition='right'
        />
      }
    >
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-4 md:w-[40dvw]">

          <OrderInput setOrderId={setOrderId} />
          <ContainerInput setContainerId={setContainerNumber} />

          <div className="flex flex-col gap-2">
            <Label title="Service Type" />
            <Select value={formData.type} onValueChange={handleServiceChange} placeholder='Select a Service'>
              <SelectItem value='Loaded'>Loaded Container</SelectItem>
              <SelectItem value='Destuff'>Destuffed Container</SelectItem>
            </Select>
          </div>

          <div className='flex flex-col gap-2'>
            <Label title="From" />
            <Input
              type="date"
              name="fromDate"
              value={formData.fromDate}
              onChange={handleChange}
              placeholder="Select date"
              className="bg-accent"
            />
          </div>

          <div className='flex flex-col gap-2'>
            <Label title="To" />
            <Input
              type="date"
              name="toDate"
              value={formData.toDate}
              onChange={handleChange}
              placeholder="Select date"
              className="bg-accent"
            />
          </div>

          <div className="mt-4 flex flex-col gap-2">
            <Label title="Remarks" />
            <TextArea
              name="remarks"
              placeholder="Optional remarks..."
              value={formData.remarks}
              onChange={handleChange}
              className="bg-accent"
            />
          </div>
        </div>

        <div className='flex flex-col gap-2 mt-4'>
          <Label title={'Upload Documents'} />
          <div className="flex items-center gap-2 mt-2">
            <label className="flex items-center cursor-pointer border rounded-xl px-4 py-2 bg-accent">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"></path>
              </svg>
              <span className='text-sm'>Choose File</span>
              <input
                type="file"
                className="hidden"
                multiple
                onChange={handleFileChange}
              />
            </label>
            <span className="ml-2 text-sm text-gray-500">
              {formData.files.length > 0
                ? formData.files.map((file) => file.name).join(', ')
                : 'No files chosen'}
            </span>
          </div>
        </div>

        <div className="mt-6">
          <Button title={'Upload'} icon={<Upload />} iconPosition='right' className='rounded-xl' />
        </div>
      </form>
    </Dialog>
  );
};
