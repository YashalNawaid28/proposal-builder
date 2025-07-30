"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface NewClientFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export const NewClientForm = ({ onSubmit, onCancel }: NewClientFormProps) => {
  const [formData, setFormData] = useState({
    clientName: "",
    location: "",
    clientContact: "",
    clientPhone: "",
  });

  const handleSubmit = () => {
    onSubmit(formData);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="newClientName" className="text-sm font-medium">
          Client Name
        </Label>
        <Input
          id="newClientName"
          value={formData.clientName}
          onChange={(e) =>
            setFormData({ ...formData, clientName: e.target.value })
          }
          className="mt-1 w-full border-[#DEE1EA] focus:ring-0 focus:outline-none"
        />
      </div>
      <div>
        <Label htmlFor="location" className="text-sm font-medium">
          Location
        </Label>
        <Input
          id="location"
          value={formData.location}
          onChange={(e) =>
            setFormData({ ...formData, location: e.target.value })
          }
          className="mt-1 w-full border-[#DEE1EA] focus:ring-0 focus:outline-none"
        />
      </div>
      <div>
        <Label htmlFor="newClientContact" className="text-sm font-medium">
          Client Contact
        </Label>
        <Input
          id="newClientContact"
          value={formData.clientContact}
          onChange={(e) =>
            setFormData({ ...formData, clientContact: e.target.value })
          }
          className="mt-1 w-full border-[#DEE1EA] focus:ring-0 focus:outline-none"
        />
      </div>
      <div>
        <Label htmlFor="newClientPhone" className="text-sm font-medium">
          Phone
        </Label>
        <Input
          id="newClientPhone"
          value={formData.clientPhone}
          onChange={(e) =>
            setFormData({ ...formData, clientPhone: e.target.value })
          }
          className="mt-1 mb-2 w-full border-[#DEE1EA] focus:ring-0 focus:outline-none"
        />
      </div>
      <section className="flex items-center text-[14px] gap-2 font-semibold">
        <button
          onClick={onCancel}
          className="bg-[#F9F9FB] h-10 w-full flex items-center justify-center px-3 gap-2 border border-[#E0E0E0] rounded-md"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="h-10 bg-black w-full flex items-center text-white justify-center px-3 gap-2 rounded-md"
        >
          Add Job
        </button>
      </section>
    </div>
  );
};
