"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface NewClientFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export const NewClientForm = ({ onSubmit, onCancel }: NewClientFormProps) => {
  const [formData, setFormData] = useState({
    clientName: "",
    clientLocation: "",
    clientContact: "",
    clientPhone: "",
  });

  const handleSubmit = () => {
    onSubmit(formData);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="newClientName">Client Name</Label>
        <Input
          id="newClientName"
          value={formData.clientName}
          onChange={(e) =>
            setFormData({ ...formData, clientName: e.target.value })
          }
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="newClientLocation">Client Location</Label>
        <Input
          id="newClientLocation"
          value={formData.clientLocation}
          onChange={(e) =>
            setFormData({ ...formData, clientLocation: e.target.value })
          }
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="newClientContact">Client Contact</Label>
        <Input
          id="newClientContact"
          value={formData.clientContact}
          onChange={(e) =>
            setFormData({ ...formData, clientContact: e.target.value })
          }
          className="mt-1"
        />
      </div>
      <div>
        <Label htmlFor="newClientPhone">Client Phone</Label>
        <Input
          id="newClientPhone"
          value={formData.clientPhone}
          onChange={(e) =>
            setFormData({ ...formData, clientPhone: e.target.value })
          }
          className="mt-1"
        />
      </div>
      <div className="flex justify-end gap-3 mt-6">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} className="bg-black hover:bg-gray-800">
          Add Client
        </Button>
      </div>
    </div>
  );
};
