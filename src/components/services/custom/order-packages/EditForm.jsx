import { useState } from "react";
import { Upload, Pencil } from "lucide-react";
import Button from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import Input from "@/components/ui/Input";
import Label from "@/components/ui/Label";
import { useCollection } from "@/hooks/useCollection";
import { toast } from "sonner";
import { createGeneralAuditLog } from "@/utils/auditLogger";
import { AUDIT_MODULES, AUDIT_ACTIONS } from "@/constants/audit";

export default function EditForm({
  info = {
    id: "",
    title: "",
    description: "",
  },
}) {
  const { updateItem, mutation } = useCollection("custom_order_packages");
  const [formData, setFormData] = useState(info);
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
      title: "",
      description: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedPackage = await updateItem(formData.id, {
        title: formData.title,
        description: formData.description,
      });
      await createGeneralAuditLog({
        action: AUDIT_ACTIONS.EDIT,
        module: AUDIT_MODULES.CUSTOM_ORDER_PACKAGES,
        subModule: 'Package',
        details: updatedPackage
      });
      toast.success("Update the package");
    } catch (error) {
      console.log(error);
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
        <button className="flex items-center justify-between gap-2 p-4 w-full cursor-pointer">
          <p>Edit Details</p>
          <Pencil size={18} className="cursor-pointer" />
        </button>
      }
      title="Update Package Info"
      className="w-full bg-accent cursor-pointer"
    >
      <div className="grid gap-4">
        <div className="flex flex-col gap-2 relative">
          <Label title="Title" />
          <Input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="eg; CFS Only, CFS Plus Warehouse, etc."
            className="bg-accent"
          />
        </div>

        <div className="flex flex-col gap-2 relative">
          <Label title="Description" />
          <Input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter description (optional)"
            className="bg-accent"
          />
        </div>

        <div className="mt-6">
          <Button
            onClick={handleSubmit}
            title="Update Package"
            icon={<Upload />}
            iconPosition="right"
            className="rounded-xl"
          />
        </div>
      </div>
    </Dialog>
  );
}
