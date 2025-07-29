"use client";
import { Button } from "@/components/ui/button";
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
  onNext: () => void;
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
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]" showCloseButton={false}>
        <DialogHeader>
          <div className="flex justify-between items-start">
            <div>
              <DialogTitle className="text-xl font-semibold">
                Job Info
              </DialogTitle>
              <p className="text-sm text-gray-600 mt-1">
                Add the job details here.
              </p>
            </div>
            <span className="text-sm text-gray-500">1/2</span>
          </div>
        </DialogHeader>
        <div className="space-y-4 mt-6">
          <div>
            <Label htmlFor="jobName">Job name</Label>
            <Input
              id="jobName"
              value={jobData.jobName || ""}
              onChange={(e) =>
                setJobData({ ...jobData, jobName: e.target.value })
              }
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="jobNumber">Job Number</Label>
            <Input
              id="jobNumber"
              value={jobData.jobNumber || ""}
              onChange={(e) =>
                setJobData({ ...jobData, jobNumber: e.target.value })
              }
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="jobLocation">Job Location</Label>
            <Input
              id="jobLocation"
              value={jobData.jobLocation || ""}
              onChange={(e) =>
                setJobData({ ...jobData, jobLocation: e.target.value })
              }
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="brand">Brand</Label>
            <Select
              value={jobData.brand || ""}
              onValueChange={(value) =>
                setJobData({ ...jobData, brand: value })
              }
            >
              <SelectTrigger className="mt-1">
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
            <Label htmlFor="manager">Manager</Label>
            <Select
              value={jobData.manager || ""}
              onValueChange={(value) =>
                setJobData({ ...jobData, manager: value })
              }
            >
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select manager" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="john-doe">John Doe</SelectItem>
                <SelectItem value="jane-smith">Jane Smith</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onNext} className="bg-black hover:bg-gray-800">
            Next: Client Info
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
