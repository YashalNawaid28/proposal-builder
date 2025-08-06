"use client";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface UserData {
  id: string;
  display_name: string;
  email: string;
  avatar_url?: string;
  last_active_at?: string;
  created_at: string;
  updated_at?: string;
  status: string;
  role?: string;
  job_count?: number;
  job_title?: string;
}

interface NewUserFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  editingUser?: UserData | null;
}

export const NewUserForm = ({
  onSubmit,
  onCancel,
  editingUser,
}: NewUserFormProps) => {
  const [formData, setFormData] = useState({
    display_name: "",
    email: "",
    job_title: "",
    role: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pre-fill form when editing
  useEffect(() => {
    if (editingUser) {
      setFormData({
        display_name: editingUser.display_name || "",
        email: editingUser.email || "",
        job_title: editingUser.job_title || "",
        role: editingUser.role || "",
      });
    }
  }, [editingUser]);

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
      if (editingUser) {
        // Update existing user
        const response = await fetch(`/api/users/${editingUser.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            display_name: formData.display_name,
            email: formData.email,
            job_title: formData.job_title || null,
            role: formData.role || "employee",
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to update user");
        }

        const result = await response.json();

        // Map the updated user data to the format expected by the parent component
        const mappedUserData = {
          userName: result.data.display_name,
          userEmail: result.data.email,
          userJobTitle: result.data.job_title,
          userRole: result.data.role,
        };

        onSubmit(mappedUserData);
      } else {
        // Create new user
        const response = await fetch("/api/users", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            display_name: formData.display_name,
            email: formData.email,
            job_title: formData.job_title || null,
            role: formData.role || "employee",
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to create user");
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
      }
    } catch (error) {
      console.error("Error saving user:", error);
      setError(error instanceof Error ? error.message : "Failed to save user");
    } finally {
      setLoading(false);
    }
  };

  const isEditing = !!editingUser;

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
          autoFocus={false}
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
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          className="mt-1 w-full border-[#DEE1EA] focus:ring-0 focus:outline-none"
          placeholder="Enter email address"
          autoFocus={false}
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
          autoFocus={false}
        />
      </div>

      <div>
        <Label htmlFor="role" className="text-sm font-medium">
          Role
        </Label>
        <Select
          value={formData.role}
          onValueChange={(value) => setFormData({ ...formData, role: value })}
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
          {loading
            ? isEditing
              ? "Updating..."
              : "Creating..."
            : isEditing
            ? "Update"
            : "Add User"}
        </button>
      </section>
    </div>
  );
};
