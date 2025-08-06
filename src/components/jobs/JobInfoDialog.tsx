"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "../supabase-auth-provider";

interface JobInfoDialogProps {
  isOpen: boolean;
  onClose: () => void;
  jobId?: string | null;
}

export function JobInfoDialog({ isOpen, onClose, jobId }: JobInfoDialogProps) {
  const [loading, setLoading] = useState(false);
  const [jobData, setJobData] = useState<any>(null);

  useEffect(() => {
    if (isOpen && jobId) {
      // Fetch job data
      fetchJobData();
    }
  }, [isOpen, jobId]);

  const fetchJobData = async () => {
    if (!jobId) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/jobs/${jobId}`);
      if (response.ok) {
        const data = await response.json();
        setJobData(data);
      }
    } catch (error) {
      console.error("Error fetching job data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {jobId ? "Edit Job" : "New Job"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-2 text-gray-600">Loading job data...</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="jobName">Job Name</Label>
                  <Input
                    id="jobName"
                    defaultValue={jobData?.job_name || ""}
                    placeholder="Enter job name"
                  />
                </div>
                <div>
                  <Label htmlFor="jobNumber">Job Number</Label>
                  <Input
                    id="jobNumber"
                    defaultValue={jobData?.job_no || ""}
                    placeholder="Enter job number"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  defaultValue={jobData?.description || ""}
                  placeholder="Enter job description"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="siteStreet">Site Street</Label>
                  <Input
                    id="siteStreet"
                    defaultValue={jobData?.site_street || ""}
                    placeholder="Enter street address"
                  />
                </div>
                <div>
                  <Label htmlFor="siteCity">Site City</Label>
                  <Input
                    id="siteCity"
                    defaultValue={jobData?.site_city || ""}
                    placeholder="Enter city"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="siteState">Site State</Label>
                  <Input
                    id="siteState"
                    defaultValue={jobData?.site_state || ""}
                    placeholder="Enter state"
                  />
                </div>
                <div>
                  <Label htmlFor="sitePostcode">Site Postcode</Label>
                  <Input
                    id="sitePostcode"
                    defaultValue={jobData?.site_postcode || ""}
                    placeholder="Enter postcode"
                  />
                </div>
              </div>
            </>
          )}
        </div>

        <div className="flex justify-end space-x-3 pt-6">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              // Handle save logic
              onClose();
            }}
          >
            Save Job
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
