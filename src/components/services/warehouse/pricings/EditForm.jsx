import { useState } from "react";
import { Upload, Pencil } from "lucide-react";
import Button from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import Input from "@/components/ui/Input";
import Label from "@/components/ui/Label";
import { useCollection } from "@/hooks/useCollection";
import { toast } from "sonner";
import { Select, SelectItem } from "@/components/ui/Select";
import { containerTypes, delayTypes } from "@/constants/common";
import { createGeneralAuditLog } from "@/utils/auditLogger";
import { AUDIT_ACTIONS } from "@/constants/audit";

export default function EditForm({ info }) {
  const { updateItem, mutation } = useCollection('warehouse_pricing_request');
  const [formData, setFormData] = useState({
    id: info.id,
    preferableRate: info.preferableRate,
    delayType: info.delayType,
    containerType: info.containerType,
    containersPerMonth: info.containersPerMonth,
    status: info.status,
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

  const handleReset = () => {
    setFormData({
      preferableRate: '',
      noOfContainers: '',
      avgContainerSize: '',
      containersPerMonth: '',
      type: 'Normal',
      status: 'Pending'
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    try {
      const updatedPricing = await updateItem(formData.id, {
        preferableRate: formData.preferableRate,
        noOfContainers: formData.noOfContainers,
        avgContainerSize: formData.avgContainerSize,
        containersPerMonth: formData.containersPerMonth,
        type: formData.type,
        status: formData.status,
      });
      await createGeneralAuditLog({
        action: AUDIT_ACTIONS.EDIT,
        module: `Warehouse`,
        subModule: 'Pricing Request',
        details: updatedPricing
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
