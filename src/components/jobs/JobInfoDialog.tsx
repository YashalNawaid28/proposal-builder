"use client";
import { useEffect, useState } from "react";
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
import { useUser } from "@stackframe/stack";

interface Brand {
  id: string;
  brand_name: string;
  user_id: string;
  brand_image?: string;
  proposal_label?: string;
  signs_count?: number;
  services_number?: number;
  status?: string;
  created_at?: string;
}

interface User {
  id: string;
  display_name: string;
  email?: string | null;
  avatar_url?: string | null;
  last_active_at?: string;
  created_at?: string;
  updated_at?: string;
  status?: string;
  role?: string | null;
  jobs_count?: number;
  job_title?: string | null;
}

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
  const [brands, setBrands] = useState<Brand[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const user = useUser();

  useEffect(() => {
    if (isOpen) {
      fetchBrands();
      fetchUsers();
    }
  }, [isOpen]);

  const fetchBrands = async () => {
    try {
      const response = await fetch('/api/brands');
      const result = await response.json();
      if (result.data) {
        setBrands(result.data);
      }
    } catch (error) {
      console.error('Error fetching brands:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/users');
      const result = await response.json();
      if (result.data) {
        setUsers(result.data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  // Function to parse address into components
  const parseAddress = (address: string) => {
    // Simple address parsing - you might want to use a more sophisticated library
    const parts = address.split(',').map(part => part.trim());
    
    // Default structure: Street, City, State Postcode, Country
    let siteStreet = '';
    let siteCity = '';
    let siteState = '';
    let sitePostcode = '';
    let siteCountry = '';

    if (parts.length >= 1) siteStreet = parts[0];
    if (parts.length >= 2) siteCity = parts[1];
    if (parts.length >= 3) {
      // Handle state and postcode together
      const statePostcode = parts[2];
      const statePostcodeMatch = statePostcode.match(/^(.+?)\s+(\d{4,5})$/);
      if (statePostcodeMatch) {
        siteState = statePostcodeMatch[1];
        sitePostcode = statePostcodeMatch[2];
      } else {
        siteState = statePostcode;
      }
    }
    if (parts.length >= 4) siteCountry = parts[3];

    return {
      siteStreet,
      siteCity,
      siteState,
      sitePostcode,
      siteCountry
    };
  };

  const handleSave = async () => {
    if (!user) {
      console.error('User not available');
      return;
    }

    setLoading(true);
    try {
      // Parse the address into components
      const addressComponents = parseAddress(jobData.jobLocation || "");

      const formData = new FormData();
      formData.append('job_name', jobData.jobName || '');
      formData.append('job_number', jobData.jobNumber || '');
      formData.append('site_street', addressComponents.siteStreet);
      formData.append('site_city', addressComponents.siteCity);
      formData.append('site_state', addressComponents.siteState);
      formData.append('site_postcode', addressComponents.sitePostcode);
      formData.append('site_country', addressComponents.siteCountry);
      formData.append('brand_id', jobData.brandId || '');
      formData.append('manager_id', jobData.managerId || '');

      const response = await fetch('/api/jobs/add-job-info', {
        method: 'POST',
        headers: { "request.user.id": user.id },
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        onNext({ ...jobData, jobId: result.data?.[0]?.id });
      } else {
        console.error('Error saving job:', await response.text());
      }
    } catch (error) {
      console.error('Error saving job:', error);
    } finally {
      setLoading(false);
    }
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
              placeholder="Street, City, State Postcode, Country"
              className="mt-1 w-full border-[#DEE1EA] focus:border-[#DEE1EA] focus:ring-0"
            />
          </div>
          <div>
            <Label htmlFor="brand" className="text-sm font-medium">
              Brand
            </Label>
            <Select
              value={jobData.brandId || ""}
              onValueChange={(value) =>
                setJobData({ ...jobData, brandId: value })
              }
            >
              <SelectTrigger className="mt-1 w-full border-[#DEE1EA] focus:border-[#DEE1EA] focus:ring-0">
                <SelectValue placeholder="Select brand" />
              </SelectTrigger>
              <SelectContent>
                {brands.map((brand) => (
                  <SelectItem key={brand.id} value={brand.id}>
                    {brand.brand_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="manager" className="text-sm font-medium">
              Manager
            </Label>
            <Select
              value={jobData.managerId || ""}
              onValueChange={(value) =>
                setJobData({ ...jobData, managerId: value })
              }
            >
              <SelectTrigger className="mt-1 w-full border-[#DEE1EA] focus:border-[#DEE1EA] focus:ring-0">
                <SelectValue placeholder="Select manager" />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.id} value={user.id}>
                    {user.display_name}
                  </SelectItem>
                ))}
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
            disabled={loading}
            className="h-10 bg-black w-full flex items-center text-white justify-center px-3 gap-2 rounded-md disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Next: Client Info'}
          </button>
        </section>
      </DialogContent>
    </Dialog>
  );
};
