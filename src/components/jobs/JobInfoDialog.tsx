"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface JobInfoDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onNext: (data: any) => void;
  jobData: any;
  setJobData: (data: any) => void;
}

export const JobInfoDialog = ({
  isOpen,
  onClose,
  onNext,
  jobData,
  setJobData,
}: JobInfoDialogProps) => {
  const handleSave = () => {
    onNext(jobData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[370px]" showCloseButton={false}>
        <DialogHeader>
          <div className="flex justify-between items-start">
            <div>
              <DialogTitle className="text-[16px] font-semibold">
                Job Info
              </DialogTitle>
              <p className="text-[14px] text-[#667085]">
                Add the job details here.
              </p>
            </div>
            <span className="text-sm text-[#667085]">1/2</span>
          </div>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          <div>
            <Label htmlFor="jobName" className="text-sm font-medium">
              Job name
            </Label>
            <Input
              id="jobName"
              value={jobData.jobName || ""}
              onChange={(e) =>
                setJobData({ ...jobData, jobName: e.target.value })
              }
              className="mt-1 w-full border-[#DEE1EA] focus:border-[#DEE1EA] focus:ring-0"
            />
          </div>
          <div>
            <Label htmlFor="jobNumber" className="text-sm font-medium">
              Job Number
            </Label>
            <Input
              id="jobNumber"
              value={jobData.jobNumber || ""}
              onChange={(e) =>
                setJobData({ ...jobData, jobNumber: e.target.value })
              }
              className="mt-1 w-full border-[#DEE1EA] focus:border-[#DEE1EA] focus:ring-0"
            />
          </div>
          <div>
            <Label htmlFor="jobLocation" className="text-sm font-medium">
              Job Location
            </Label>
            <Input
              id="jobLocation"
              value={jobData.jobLocation || ""}
              onChange={(e) =>
                setJobData({ ...jobData, jobLocation: e.target.value })
              }
              className="mt-1 w-full border-[#DEE1EA] focus:border-[#DEE1EA] focus:ring-0"
            />
          </div>
          <div>
            <Label htmlFor="brand" className="text-sm font-medium">
              Brand
            </Label>
            <Select
              value={jobData.brand || ""}
              onValueChange={(value) =>
                setJobData({ ...jobData, brand: value })
              }
            >
              <SelectTrigger className="mt-1 w-full border-[#DEE1EA] focus:border-[#DEE1EA] focus:ring-0">
                <SelectValue placeholder="Select brand" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daves-hot-chicken">
                  Dave&apos;s Hot Chicken
                </SelectItem>
                <SelectItem value="other-brand">Other Brand</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="manager" className="text-sm font-medium">
              Manager
            </Label>
            <Select
              value={jobData.manager || ""}
              onValueChange={(value) =>
                setJobData({ ...jobData, manager: value })
              }
            >
              <SelectTrigger className="mt-1 w-full border-[#DEE1EA] focus:border-[#DEE1EA] focus:ring-0">
                <SelectValue placeholder="Select manager" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="john-doe">John Doe</SelectItem>
                <SelectItem value="jane-smith">Jane Smith</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <section className="flex items-center text-[14px] mt-2 gap-2 font-semibold">
          <button
            onClick={onClose}
            className="bg-[#F9F9FB] h-10 w-full flex items-center justify-center px-3 gap-2 border border-[#E0E0E0] rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="h-10 bg-black w-full flex items-center text-white justify-center px-3 gap-2 rounded-md"
          >
            Next: Client Info
          </button>
        </section>
      </DialogContent>
    </Dialog>
  );
};
