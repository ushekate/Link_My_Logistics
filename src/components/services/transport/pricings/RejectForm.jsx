import { useState } from "react";
import { Upload, CircleX } from "lucide-react";
import Button from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import Input from "@/components/ui/Input";
import Label from "@/components/ui/Label";
import { useCollection } from "@/hooks/useCollection";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { createGeneralAuditLog } from "@/utils/auditLogger";
import { AUDIT_ACTIONS } from "@/constants/audit";

export default function RejectForm({ info }) {
  const { updateItem, mutation } = useCollection('transport_pricing_request');
  const [formData, setFormData] = useState({
    id: info.id,
    reason: info.reason,
    status: 'Rejected'
  });
  const { user } = useAuth();

  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    try {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    } catch (error) {
      console.log(error);
    }
  };

  const handleReset = () => {
    setFormData({
      id: '',
      reason: '',
      status: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    try {
      switch (user?.role) {
        case 'Root':
          const updatedPricing = await updateItem(formData.id, {
            reason: formData.reason,
            status: formData.status,
            golVerified: true,
            golVerifiedBy: user?.id
          });
          await createGeneralAuditLog({
            action: AUDIT_ACTIONS.REJECT,
            module: `Transport`,
            subModule: 'Pricing Request',
            details: updatedPricing
          });
          toast.success('Rejected the request');
          break;
        case 'Merchant':
          const updatedpricing = await updateItem(formData.id, {
            reason: formData.reason,
            status: formData.status,
            merchantVerified: true,
            merchantVerifiedBy: user?.id
          });
          await createGeneralAuditLog({
            action: AUDIT_ACTIONS.REJECT,
            module: `Transport`,
            subModule: 'Pricing Request',
            details: updatedpricing
          });
          toast.success('Rejected the request');
          break;
        default:
          break;
      }
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
          <p>Reject Request</p>
          <CircleX
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
            <Label title={'Reason'} />
            <Input
              type="text"
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              placeholder="Enter a valid reason"
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
};
