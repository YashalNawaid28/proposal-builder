import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ConfirmationDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  action: "enable" | "disable" | null;
  onConfirm: () => void;
  loading: boolean;
}

export const ConfirmationDialog = ({
  isOpen,
  onOpenChange,
  action,
  onConfirm,
  loading,
}: ConfirmationDialogProps) => {
  const getMessage = () => {
    if (action === "enable") {
      return "Enabling a user will restore their ability to sign in and access the system.";
    }
    return "Disabling a user will remove their ability to get sign in. However, it will not remove any previous jobs they created.";
  };

  const getButtonText = () => {
    if (loading) return "...";
    return action === "enable" ? "Enable" : "Disable";
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[512px] p-6" showCloseButton={false}>
        <DialogHeader>
          <div className="flex justify-between items-start">
            <div>
              <DialogTitle className="text-[18px] font-semibold">
                Are you sure?
              </DialogTitle>
              <p className="text-[14px] font-normal mt-2 text-[#737373]">
                {getMessage()}
              </p>
            </div>
          </div>
        </DialogHeader>
        <div className="mt-6 flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="bg-white border border-gray-300 text-gray-700 w-20 h-9 rounded-md hover:bg-gray-50"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={loading}
            className="bg-black text-white w-20 h-9 rounded-md hover:bg-gray-800 disabled:opacity-50"
          >
            {getButtonText()}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
