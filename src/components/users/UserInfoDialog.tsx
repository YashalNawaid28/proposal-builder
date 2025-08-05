"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { NewUserForm } from "@/components/users/NewUserForm";

interface UserInfoDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  onUserCreated?: () => void; // Callback to refresh users list
}

export const UserInfoDialog = ({
  isOpen,
  onClose,
  onComplete,
  onUserCreated,
}: UserInfoDialogProps) => {
  const handleNewUserSubmit = (newUserData: any) => {
    // Handle the new user data
    console.log("New user created:", newUserData);
    onComplete();
    onUserCreated?.(); // Refresh the users list
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[370px]" showCloseButton={false}>
        <DialogHeader>
          <div className="flex justify-between items-start">
            <div>
              <DialogTitle className="text-[16px] font-semibold">
                New User
              </DialogTitle>
              <p className="text-[14px] text-[#667085]">
                Add their details here.
              </p>
            </div>
            <span className="text-sm text-[#667085]">1/1</span>
          </div>
        </DialogHeader>
        <div className="mt-2">
          <NewUserForm onSubmit={handleNewUserSubmit} onCancel={onClose} />
        </div>
      </DialogContent>
    </Dialog>
  );
};
