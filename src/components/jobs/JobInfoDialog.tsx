"use client";
import { useEffect, useState, useCallback } from "react";
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
import { useAuth } from "@/components/supabase-auth-provider";
import { toast } from "sonner";
import { generateProposalNumber } from "@/lib/utils";

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
  isEditing?: boolean; // Add flag to determine if editing existing job
  jobId?: string; // Add jobId for update operations
  onUpdateSuccess?: () => void; // Callback to refresh job data after update
}

export const JobInfoDialog = ({
  isOpen,
  onClose,
  onNext,
  jobData,
  setJobData,
  isEditing = false,
  jobId,
  onUpdateSuccess,
}: JobInfoDialogProps) => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedBrandName, setSelectedBrandName] = useState<string | null>("");
  const [brandNameCache, setBrandNameCache] = useState<
    Record<string, string | null>
  >({});
  const { user } = useAuth();

  const fetchBrands = useCallback(async () => {
    try {
      const response = await fetch("/api/brands");
      const result = await response.json();
      if (result.data) {
        setBrands(result.data);
      }
    } catch (error) {
      console.error("Error fetching brands:", error);
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      const response = await fetch("/api/users");
      const result = await response.json();
      if (result.data) {
        setUsers(result.data);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }, []);

  const fetchBrandName = useCallback(async (brandId: string) => {
    if (!brandId) {
      setSelectedBrandName("");
      return;
    }

    // Check if brand name is already cached
    if (brandNameCache[brandId] !== undefined) {
      setSelectedBrandName(brandNameCache[brandId]);
      return;
    }

    try {
      const response = await fetch(`/api/brands/get-by-id?brand_id=${brandId}`);
      if (response.ok) {
        const result = await response.json();
        const brandName = result.data?.brand_name || null;

        // Cache the result
        setBrandNameCache((prev) => ({ ...prev, [brandId]: brandName }));
        setSelectedBrandName(brandName);
      } else {
        setSelectedBrandName(null);
        setBrandNameCache((prev) => ({ ...prev, [brandId]: null }));
      }
    } catch (error) {
      console.error("Error fetching brand name:", error);
      setSelectedBrandName(null);
      setBrandNameCache((prev) => ({ ...prev, [brandId]: null }));
    }
  }, [brandNameCache]);

  useEffect(() => {
    if (isOpen) {
      fetchBrands();
      fetchUsers();
      // Fetch brand name if editing and brand is already selected
      if (isEditing && jobData.brandId) {
        fetchBrandName(jobData.brandId);
      }
    }
  }, [
    isOpen,
    isEditing,
    jobData.brandId,
    fetchBrands,
    fetchUsers,
    fetchBrandName,
  ]);

  // Function to format job location from individual address fields
  const formatJobLocation = (jobData: any) => {
    if (
      jobData.site_street ||
      jobData.site_city ||
      jobData.site_state ||
      jobData.site_postcode
    ) {
      const parts = [
        jobData.site_street,
        jobData.site_city,
        jobData.site_state,
        jobData.site_postcode,
      ].filter(Boolean);
      return parts.join(", ");
    }
    return "";
  };

  // Function to parse address into components
  const parseAddress = (address: string) => {
    // Simple address parsing - you might want to use a more sophisticated library
    const parts = address.split(",").map((part) => part.trim());

    // Default structure: Street, City, State Postcode, Country
    let siteStreet = "";
    let siteCity = "";
    let siteState = "";
    let sitePostcode = "";
    let siteCountry = "";

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
      siteCountry,
    };
  };

  const handleSave = async () => {
    if (!user) {
      console.error("User not available");
      return;
    }

    setLoading(true);
    try {
      // Parse the address into components
      const addressComponents = parseAddress(jobData.jobLocation || "");

      // Fetch brand name for proposal number generation
      let brandName = "";
      if (jobData.brandId) {
        // Check cache first
        if (brandNameCache[jobData.brandId] !== undefined) {
          brandName = brandNameCache[jobData.brandId] || "";
        } else {
          try {
            const brandResponse = await fetch(
              `/api/brands/get-by-id?brand_id=${jobData.brandId}`
            );
            if (brandResponse.ok) {
              const brandResult = await brandResponse.json();
              brandName = brandResult.data?.brand_name || "";
              // Cache the result
              setBrandNameCache((prev) => ({
                ...prev,
                [jobData.brandId]: brandName,
              }));
            } else {
              brandName = "";
              setBrandNameCache((prev) => ({
                ...prev,
                [jobData.brandId]: null,
              }));
            }
          } catch (error) {
            console.error("Error fetching brand name:", error);
            brandName = "";
            setBrandNameCache((prev) => ({ ...prev, [jobData.brandId]: null }));
          }
        }
      }

      if (isEditing && jobId) {
        // Update existing job
        const updateData = {
          job_name: jobData.jobName || "",
          job_no: jobData.jobNumber || "",
          proposal_no: generateProposalNumber(brandName),
          site_street: addressComponents.siteStreet,
          site_city: addressComponents.siteCity,
          site_state: addressComponents.siteState,
          site_postcode: addressComponents.sitePostcode,
          site_country: addressComponents.siteCountry,
          brand_id: jobData.brandId || "",
          pm_id: jobData.managerId || "",
        };

        const response = await fetch(`/api/jobs/${jobId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "request.user.id": user.id,
          },
          body: JSON.stringify(updateData),
        });

        if (response.ok) {
          const result = await response.json();
          console.log("Job updated successfully:", result);
          toast.success("Job updated successfully!");
          onUpdateSuccess?.(); // Refresh job data
          onClose(); // Close dialog after successful update
        } else {
          console.error("Error updating job:", await response.text());
          toast.error("Failed to update job. Please try again.");
        }
      } else {
        // For new jobs, just pass the data to the next step without creating the job yet
        onNext({ ...jobData });
      }
    } catch (error) {
      console.error("Error saving job:", error);
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
              value={jobData.jobName || jobData.job_name || ""}
              onChange={(e) =>
                setJobData({ ...jobData, jobName: e.target.value })
              }
              className="mt-1 w-full border-[#DEE1EA] focus:border-[#DEE1EA] focus:ring-0"
            />
            {!isEditing && selectedBrandName && (
              <div className="text-xs text-gray-500 mt-1">
                Proposal No: {generateProposalNumber(selectedBrandName)}
              </div>
            )}
          </div>
          <div>
            <Label htmlFor="jobNumber" className="text-sm font-medium">
              Job Number
            </Label>
            <Input
              id="jobNumber"
              value={jobData.jobNumber || jobData.job_no || ""}
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
              value={jobData.jobLocation || formatJobLocation(jobData) || ""}
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
              value={jobData.brandId || jobData.brand_id || ""}
              onValueChange={(value) => {
                setJobData({ ...jobData, brandId: value });
                fetchBrandName(value);
              }}
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
              value={jobData.managerId || jobData.pm_id || ""}
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
            {loading ? "Saving..." : isEditing ? "Update" : "Next: Client Info"}
          </button>
        </section>
      </DialogContent>
    </Dialog>
  );
};
