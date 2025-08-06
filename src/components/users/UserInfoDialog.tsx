"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { NewUserForm } from "@/components/users/NewUserForm";

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

interface UserInfoDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  onUserCreated?: () => void; // Callback to refresh users list
  onUserUpdated?: () => void; // Callback to refresh users list after update
  editingUser?: UserData | null; // User data when editing
}

export const UserInfoDialog = ({
  isOpen,
  onClose,
  onComplete,
  onUserCreated,
  onUserUpdated,
  editingUser,
}: UserInfoDialogProps) => {
  const handleNewUserSubmit = (newUserData: any) => {
    // Handle the new user data
    console.log("New user created:", newUserData);
    onComplete();
    onUserCreated?.(); // Refresh the users list
    onClose();
  };

  const handleUserUpdate = (updatedUserData: any) => {
    // Handle the updated user data
    console.log("User updated:", updatedUserData);
    onComplete();
    onUserUpdated?.(); // Refresh the users list
    onClose();
  };

  const isEditing = !!editingUser;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[370px]" showCloseButton={false}>
        <DialogHeader>
          <div className="flex justify-between items-start">
            <div>
              <DialogTitle className="text-[16px] font-semibold">
                {isEditing ? "Edit User" : "New User"}
              </DialogTitle>
              <p className="text-[14px] text-[#667085]">
                {isEditing ? "Update their details here." : "Add their details here."}
              </p>
            </div>
            <span className="text-sm text-[#667085]">1/1</span>
          </div>
        </DialogHeader>
        <div className="mt-2">
          <NewUserForm 
            onSubmit={isEditing ? handleUserUpdate : handleNewUserSubmit} 
            onCancel={onClose}
            editingUser={editingUser}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};
