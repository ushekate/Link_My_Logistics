import { useState } from "react";
import { Upload, Plus } from "lucide-react";
import Button from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import Input from "@/components/ui/Input";
import Label from "@/components/ui/Label";
import { Select, SelectItem } from "@/components/ui/Select";
import { useCollection } from "@/hooks/useCollection";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import TextArea from "@/components/ui/TextArea";
import { fetchData } from "@/lib/collection";
import { sendOrderDetailsEmail } from "@/app/action";
import { createGeneralAuditLog } from "@/utils/auditLogger";
import { AUDIT_ACTIONS } from "@/constants/audit";

export default function Form() {
  const { data: serviceProviders } = useCollection('allowed_service_providers', {
    expand: 'provider,provider.service'
  });
  const { createItem, mutation } = useCollection('transport_orders');
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    consigneeName: '',
    chaName: '',
    provider: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    startLocation: '',
    endLocation: '',
    specialRequest: '',
    vehicleDescription: '',
    orderDescription: '',
    status: 'Pending',
    files: []
  });

  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleReset = () => {
    setFormData({
      consigneeName: '',
      chaName: '',
      provider: '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      startLocation: '',
      endLocation: '',
      specialRequest: '',
      vehicleDescription: '',
      orderDescription: '',
      status: 'Pending',
      files: []
    });
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
      data.append('consigneeName', formData.consigneeName);
      data.append('chaName', formData.chaName);
      data.append('provider', formData.provider);
      data.append('startDate', formData.startDate);
      data.append('endDate', formData.endDate);
      data.append('startLocation', formData.startLocation);
      data.append('endLocation', formData.endLocation);
      data.append('specialRequest', formData.specialRequest);
      data.append('vehicleDescription', formData.vehicleDescription);
      data.append('orderDescription', formData.orderDescription);
      data.append('createdBy', user?.id);
      data.append('customer', user?.id);
      data.append('status', formData.status);

      // Append each file
      formData.files.forEach((file) => {
        data.append('files', file); // `files` must match the PocketBase field name
      });

      console.log('Form submitted:', data);
      const output = await createItem(data);
      const fetchedData = await fetchData({
        collectionName: 'transport_orders',
        options: {
          filter: `id='${output?.id}'`,
          expand: 'provider,customer'
        }
      });
      if (fetchedData?.length === 1) {
        const orderInfo = fetchedData[0];
        await createGeneralAuditLog({
          action: AUDIT_ACTIONS.CREATE,
          module: `Transport`,
          subModule: 'Order',
          details: orderInfo
        });
        await sendOrderDetailsEmail({
          email: orderInfo?.expand?.customer?.email,
          order: orderInfo
        });
      }

      toast.success('Created a new order');
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
      open={isOpen}
      onOpenChange={setIsOpen}
      trigger={
        <Button
          title={'New Order'}
          icon={<Plus className='w-5 h-5' />}
          iconPosition='right'
          className='rounded-md'
          textSize='text-sm'
        />
      }
      title="Create New Order"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 min-w-[60dvw] items-start">
        <div className='flex flex-col gap-2'>
          <Label title={'Consignee Name'} />
          <Input
            type="text"
            name="consigneeName"
            value={formData.consigneeName}
            onChange={handleChange}
            placeholder="Enter Consignee Name"
            className='bg-accent'
          />
        </div>

        <div className='flex flex-col gap-2'>
          <Label title={'CHA Name'} />
          <Input
            type="text"
            name="chaName"
            value={formData.chaName}
            onChange={handleChange}
            placeholder="Enter CHA Name"
            className='bg-accent'
          />
        </div>

        <div className='flex flex-col gap-2'>
          <Label title={'Service Provider'} />
          {
            serviceProviders?.length > 0 && (
              <Select value={formData.provider} onValueChange={(value) => setFormData({ ...formData, provider: value })} placeholder='Select Service Provider'>
                {
                  serviceProviders
                    .filter((provider) => {
                      const services = provider?.expand?.provider?.expand?.service
                      const condition = services.find((service) => service.title === 'Transport')
                      if (condition?.id) {
                        return provider
                      }
                    })
                    .map((provider, index) => (
                      <SelectItem
                        key={index}
                        value={provider?.provider}>{provider?.expand?.provider?.title} - {provider?.expand?.provider?.location}
                      </SelectItem>
                    ))
                }
              </Select>
            )
          }
        </div>

        <div className='flex flex-col gap-2'>
          <Label title="Start Date" />
          <Input
            type="date"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            placeholder="Select date"
            className='bg-accent'
          />
        </div>

        <div className='flex flex-col gap-2'>
          <Label title="End Date" />
          <Input
            type="date"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            placeholder="Select date"
            className='bg-accent'
          />
        </div>

        <div className='flex flex-col gap-2'>
          <Label title={'Start Location'} />
          <Input
            type="text"
            name="startLocation"
            value={formData.startLocation}
            onChange={handleChange}
            placeholder="Enter Start Location"
            className='bg-accent'
          />
        </div>

        <div className='flex flex-col gap-2'>
          <Label title={'End Location'} />
          <Input
            type="text"
            name="endLocation"
            value={formData.endLocation}
            onChange={handleChange}
            placeholder="Enter End Location"
            className='bg-accent'
          />
        </div>

        <div className='flex flex-col gap-2'>
          <Label title={'Special Request'} />
          <TextArea
            name="specialRequest"
            value={formData.specialRequest}
            onChange={handleChange}
            placeholder="Enter any Special Request"
            className='bg-accent'
          />
        </div>


        <div className='flex flex-col gap-2'>
          <Label title={'Vehicle Description'} />
          <TextArea
            name="vehicleDescription"
            value={formData.vehicleDescription}
            onChange={handleChange}
            placeholder="Enter Vehicle Description"
            className='bg-accent'
          />
        </div>

        <div className='flex flex-col gap-2'>
          <Label title={'Order Description'} />
          <TextArea
            name="orderDescription"
            value={formData.orderDescription}
            onChange={handleChange}
            placeholder="Enter Order Description"
            className='bg-accent'
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
        <Button onClick={handleSubmit} title={'Submit Request'} icon={<Upload />} iconPosition='right' className='rounded-xl' />
      </div>
    </Dialog>
  );
}
