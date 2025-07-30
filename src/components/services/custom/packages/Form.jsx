import { useEffect, useState } from "react";
import { Upload, Plus } from "lucide-react";
import Button from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import Input from "@/components/ui/Input";
import Label from "@/components/ui/Label";
import { useCollection } from "@/hooks/useCollection";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import MultiSelectDatalist from "@/components/ui/MultiSelectDatalist";
import { createGeneralAuditLog } from "@/utils/auditLogger";
import { AUDIT_MODULES, AUDIT_ACTIONS } from "@/constants/audit";

export default function Form() {
  const { createItem, mutation } = useCollection("custom_packages");
  const { data: services } = useCollection("services");
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });
  const [selectedServices, setSelectedServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
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
    setSelectedServices([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(user);
    console.log("Form submitted:", formData);
    try {
      const newPackage = await createItem({
        title: formData.title,
        description: formData.description,
        services: selectedServices,
      });
      await createGeneralAuditLog({
        action: AUDIT_ACTIONS.CREATE,
        module: AUDIT_MODULES.CUSTOM_PACKAGES,
        subModule: 'Package',
        details: newPackage
      });
      toast.success("Added the new package");
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      handleReset();
      mutation();
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (services?.length > 0) {
      setFilteredServices(services);
    }
  }, [services]);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={setIsOpen}
      trigger={
        <Button
          title={"Add Package"}
          icon={<Plus className="w-5 h-5" />}
          iconPosition="right"
          className="rounded-md"
          textSize="text-sm"
        />
      }
      title="Create New Package"
      className="bg-accent"
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

        <div className="flex flex-col gap-2 mt-4">
          <Label title={"Services"} />
          <MultiSelectDatalist
            label="Select Services"
            options={filteredServices}
            value={selectedServices}
            onValueChange={setSelectedServices}
            getOptionLabel={(service) => `${service?.title}`}
            getOptionValue={(service) => service?.id}
            placeholder="Choose services..."
          />
        </div>

        <div className="mt-6">
          <Button
            onClick={handleSubmit}
            title="Add New Package"
            icon={<Upload />}
            iconPosition="right"
            className="rounded-xl"
          />
        </div>
      </div>
    </Dialog>
  );
}
