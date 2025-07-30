import { useState } from "react";
import { Upload, Pencil } from "lucide-react";
import Button from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import Input from "@/components/ui/Input";
import Label from "@/components/ui/Label";
import { useCollection } from "@/hooks/useCollection";
import { toast } from "sonner";
import TextArea from "@/components/ui/TextArea";
import { Select, SelectItem } from "@/components/ui/Select";
import { containerTypes, delayTypes } from "@/constants/common";
import { createGeneralAuditLog } from "@/utils/auditLogger";
import { AUDIT_MODULES, AUDIT_ACTIONS } from "@/constants/audit";

export default function EditForm({
  info = {
    id: '',
    startDate: new Date().toISOString().split('T')[0],
    startLocation: '',
    endLocation: '',
    specialRequest: '',
    preferableRate: '',
    delayType: '',
    containerType: '',
    containersPerMonth: '',
    orderDescription: '',
  }
}) {
  const { updateItem, mutation } = useCollection('custom_pricing_request');
  const [formData, setFormData] = useState({
    id: info.id,
    startDate: new Date(info.startDate).toISOString().split('T')[0],
    startLocation: info.startLocation,
    endLocation: info.endLocation,
    specialRequest: info.specialRequest,
    preferableRate: info.preferableRate,
    delayType: info.delayType,
    containerType: info.containerType,
    containersPerMonth: info.containersPerMonth,
  });
  const [isOpen, setIsOpen] = useState(false);

  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    try {
      if (value !== '') {
        setFormData((prev) => ({
          ...prev,
          [name]: value,
        }));
      } else if (!isNaN(value)) {
        setFormData((prev) => ({
          ...prev,
          [name]: parseInt(value),
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          [name]: '',
        }));
      }

    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleReset = () => {
    setFormData({
      startDate: new Date().toISOString().split('T')[0],
      startLocation: '',
      endLocation: '',
      specialRequest: '',
      preferableRate: '',
      delayType: '',
      containerType: '',
      containersPerMonth: '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    try {
      const updatedPricingRequest = await updateItem(formData.id, {
        startDate: formData.startDate,
        startLocation: formData.startLocation,
        endLocation: formData.endLocation,
        specialRequest: formData.specialRequest,
        preferableRate: formData.preferableRate,
        containerType: formData.containerType,
        delayType: formData.delayType,
        containersPerMonth: formData.containersPerMonth,
      });
      await createGeneralAuditLog({
        action: AUDIT_ACTIONS.EDIT,
        module: AUDIT_MODULES.CUSTOM_PRICINGS,
        subModule: 'Pricing Request',
        details: updatedPricingRequest
      });
      toast.success('Updated the info');
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
        <button
          className='flex items-center justify-between gap-2 p-4 w-full cursor-pointer'
        >
          <p>Edit Details</p>
          <Pencil
            size={18}
            className="cursor-pointer"
          />
        </button>
      }
      title="Update Info"
      className='bg-accent w-full cursor-pointer'
    >
      <div>
        <form className="grid grid-cols-1 gap-4 min-w-[300px]">
          <div className='flex flex-col items-start gap-2'>
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

          <div className='flex flex-col items-start gap-2'>
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

          <div className='flex flex-col items-start gap-2'>
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
            <Label title={'Preferable Rate'} />
            <Input
              type="number"
              name="preferableRate"
              value={formData.preferableRate}
              onChange={handleNumberChange}
              placeholder="Enter Preferable Rate"
              className='bg-accent'
            />
          </div>

          <div className="flex flex-col gap-2 relative">
            <Label title="DPD / Non-DPD" />
            <Select
              placeholder="Choose"
              value={formData.delayType}
              onValueChange={(value) => {
                setFormData({ ...formData, delayType: value })
              }}
            >
              {delayTypes.map((item, index) => (
                <SelectItem key={index} value={item.id}>{item.label}</SelectItem>
              ))}
            </Select>
          </div>

          <div className="flex flex-col gap-2 relative">
            <Label title="Container Type" />
            <Select
              placeholder="Select Container Type"
              value={formData.containerType}
              onValueChange={(value) => {
                setFormData({ ...formData, containerType: value })
              }}
            >
              {containerTypes.map((item, index) => (
                <SelectItem key={index} value={item.id}>{item.label}</SelectItem>
              ))}
            </Select>
          </div>

          <div className='flex flex-col gap-2'>
            <Label title={'No. of Containers Movement per month'} />
            <Input
              type="number"
              name="containersPerMonth"
              value={formData.containersPerMonth}
              onChange={handleNumberChange}
              placeholder="Enter No. of Containers Movement per month"
              className='bg-accent'
            />
          </div>
        </form>

        <div className='mt-8'>
          <Button
            title="Submit"
            icon={<Upload />}
            onClick={handleSubmit}
            className="rounded-xl"
          />
        </div>
      </div>
    </Dialog>
  )
}
