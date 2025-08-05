"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface NewUserFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export const NewUserForm = ({ onSubmit, onCancel }: NewUserFormProps) => {
  const [formData, setFormData] = useState({
    display_name: "",
    email: "",
    job_title: "",
    role: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!formData.display_name.trim()) {
      setError("Name is required");
      return;
    }

    if (!formData.email.trim()) {
      setError("Email is required");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          display_name: formData.display_name,
          email: formData.email,
          job_title: formData.job_title || null,
          role: formData.role || 'employee',
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create user');
      }

      const result = await response.json();
      
      // Map the saved user data to the format expected by the parent component
      const mappedUserData = {
        userName: result.data[0].display_name,
        userEmail: result.data[0].email,
        userJobTitle: result.data[0].job_title,
        userRole: result.data[0].role,
      };

      onSubmit(mappedUserData);
    } catch (error) {
      console.error('Error creating user:', error);
      setError(error instanceof Error ? error.message : 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="text-red-500 text-sm bg-red-50 p-2 rounded">
          {error}
        </div>
      )}
      
      <div>
        <Label htmlFor="display_name" className="text-sm font-medium">
          Name
        </Label>
        <Input
          id="display_name"
          value={formData.display_name}
          onChange={(e) =>
            setFormData({ ...formData, display_name: e.target.value })
          }
          className="mt-1 w-full border-[#DEE1EA] focus:ring-0 focus:outline-none"
          placeholder="Enter user name"
        />
      </div>

      <div>
        <Label htmlFor="email" className="text-sm font-medium">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          value={formData.email}
          onChange={(e) =>
            setFormData({ ...formData, email: e.target.value })
          }
          className="mt-1 w-full border-[#DEE1EA] focus:ring-0 focus:outline-none"
          placeholder="Enter email address"
        />
      </div>

      <div>
        <Label htmlFor="job_title" className="text-sm font-medium">
          Job Title
        </Label>
        <Input
          id="job_title"
          value={formData.job_title}
          onChange={(e) =>
            setFormData({ ...formData, job_title: e.target.value })
          }
          className="mt-1 w-full border-[#DEE1EA] focus:ring-0 focus:outline-none"
          placeholder="Enter job title"
        />
      </div>

      <div>
        <Label htmlFor="role" className="text-sm font-medium">
          Role
        </Label>
        <Select
          value={formData.role}
          onValueChange={(value) =>
            setFormData({ ...formData, role: value })
          }
        >
          <SelectTrigger className="mt-1 w-full border-[#DEE1EA] focus:ring-0 focus:outline-none">
            <SelectValue placeholder="Select role" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="manager">Manager</SelectItem>
            <SelectItem value="employee">Employee</SelectItem>
            <SelectItem value="viewer">Viewer</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <section className="flex items-center text-[14px] gap-2 font-semibold">
        <button
          onClick={onCancel}
          disabled={loading}
          className="bg-[#F9F9FB] h-10 w-full flex items-center justify-center px-3 gap-2 border border-[#E0E0E0] rounded-md disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="h-10 bg-black w-full flex items-center text-white justify-center px-3 gap-2 rounded-md disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Add User'}
        </button>
      </section>
    </div>
  );
}; 