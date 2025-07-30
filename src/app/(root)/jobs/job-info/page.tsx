"use client";
import { useState, useEffect } from "react";
import { ArrowLeft, Plus, ChevronDown, MapPinPlus, User } from "lucide-react";
import { JobInfoDialog } from "@/components/jobs/JobInfoDialog";
import { ClientInfoDialog } from "@/components/jobs/ClientInfoDialog";
import { AddSignServiceSidebar } from "@/components/jobs/AddSignServiceSidebar";
import Link from "next/link";
import { PageTabs } from "@/components/ui/page-tabs";
import { useSearchParams } from "next/navigation";
import { useUser } from "@stackframe/stack";

export default function AddJobPage() {
  const searchParams = useSearchParams();
  const user = useUser();
  const jobId = searchParams.get("id");

  const [jobInfoOpen, setJobInfoOpen] = useState(!jobId); // Don't show dialog if editing existing job
  const [clientInfoOpen, setClientInfoOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState("All");
  const [addSignSidebarOpen, setAddSignSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(!!jobId);
  const [jobData, setJobData] = useState<{
    jobName?: string;
    jobNumber?: string;
    jobLocation?: string;
    brand?: string;
    brandName?: string; // Add brand name field
    manager?: string;
    creator?: string;
    creatorName?: string; // Add creator name field
    creatorAvatar?: string | null; // Add creator avatar field
    pm?: string;
    pmName?: string; // Add PM name field
    pmAvatar?: string | null; // Add PM avatar field
  }>({});
  const [clientData, setClientData] = useState<{
    clientName?: string;
    clientLocation?: string;
    clientContact?: string;
    clientPhone?: string;
  }>({});

  // Function to generate initials from display name
  const getInitials = (displayName: string) => {
    return displayName
      .split(' ')
      .map(name => name.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Function to fetch brand name by ID
  const fetchBrandName = async (brandId: string) => {
    try {
      const response = await fetch('/api/brands');
      const result = await response.json();
      if (result.data) {
        const brand = result.data.find((b: any) => b.id === brandId);
        return brand ? brand.brand_name : 'Unknown Brand';
      }
    } catch (error) {
      console.error('Error fetching brand:', error);
    }
    return 'Unknown Brand';
  };

  // Function to fetch user name by ID
  const fetchUserName = async (userId: string) => {
    try {
      const response = await fetch(`/api/users/${userId}`);
      if (response.ok) {
        const user = await response.json();
        return {
          displayName: user.display_name || 'Unknown User',
          avatarUrl: user.avatar_url || null
        };
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    }
    return {
      displayName: 'Unknown User',
      avatarUrl: null
    };
  };

  // Function to fetch client data by ID
  const fetchClientData = async (clientId: string) => {
    try {
      const response = await fetch(`/api/clients/${clientId}`);
      if (response.ok) {
        const client = await response.json();
        return {
          clientName: client.legal_name,
          clientLocation: `${client.street || ''}, ${client.city || ''}, ${client.state || ''} ${client.postcode || ''}`.trim().replace(/^,\s*/, ''),
          clientContact: client.client_contact || client.legal_name,
          clientPhone: client.phone || '',
        };
      }
    } catch (error) {
      console.error('Error fetching client:', error);
    }
    return null; // Return null when no client is found
  };

  const handleJobInfoSave = async (data: any) => {
    setJobData(data);

    // If editing an existing job, save the changes
    if (jobId) {
      try {
        const res = await fetch(`/api/jobs/${jobId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            job_name: data.jobName,
            job_no: data.jobNumber,
            // Add other fields as needed
          }),
        });

        if (!res.ok) {
          throw new Error("Failed to update job");
        }
      } catch (error) {
        console.error("Error updating job:", error);
      }
    }

    setJobInfoOpen(false);
    setClientInfoOpen(true);
  };

  const handleClientInfoSave = async (data: any) => {
    setClientData(data);

    // If editing an existing job, save the client changes
    if (jobId) {
      try {
        const res = await fetch(`/api/jobs/${jobId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            // Add client-related fields as needed
            // This might need to be updated based on your database schema
          }),
        });

        if (!res.ok) {
          throw new Error("Failed to update job client info");
        }
      } catch (error) {
        console.error("Error updating job client info:", error);
      }
    }

    setClientInfoOpen(false);
  };

  // Load existing job data when jobId is provided
  useEffect(() => {
    const loadJobData = async () => {
      if (!jobId || !user) return;

      try {
        const res = await fetch(`/api/jobs/${jobId}`, {
          headers: { "request.user.id": user.id },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch job data");
        }

        const job = await res.json();

        // Fetch brand name if brand_id exists
        let brandName = 'Unknown Brand';
        if (job.brand_id) {
          brandName = await fetchBrandName(job.brand_id);
        }

        // Fetch creator name and avatar if creator_id exists
        let creatorData = { displayName: 'Unknown User', avatarUrl: null };
        if (job.creator_id) {
          creatorData = await fetchUserName(job.creator_id);
        }

        // Fetch PM name and avatar if pm_id exists
        let pmData = { displayName: 'Unknown PM', avatarUrl: null };
        if (job.pm_id) {
          pmData = await fetchUserName(job.pm_id);
        }

        // Fetch client data if client_id exists
        let clientData = {
          clientName: 'Unknown Client',
          clientLocation: 'Unknown Location',
          clientContact: 'Unknown Contact',
          clientPhone: 'Unknown Phone',
        };
        if (job.client_id) {
          const fetchedClientData = await fetchClientData(job.client_id);
          if (fetchedClientData) {
            clientData = fetchedClientData;
          }
        }

        // Populate job data with existing values
        setJobData({
          jobName: job.job_name,
          jobNumber: job.job_no,
          jobLocation: `${job.site_street}, ${job.site_city}, ${job.site_state} ${job.site_postcode}`,
          brand: job.brand_id, // Keep the ID for reference
          brandName: brandName, // Add the brand name
          manager: job.manager_id,
          creator: job.creator_id, // Keep the ID for reference
          creatorName: creatorData.displayName, // Add the creator name
          creatorAvatar: creatorData.avatarUrl, // Add the creator avatar
          pm: job.pm_id,
          pmName: pmData.displayName, // Add the PM name
          pmAvatar: pmData.avatarUrl, // Add the PM avatar
        });

        // Set the actual client data
        setClientData(clientData);
      } catch (error) {
        console.error("Error loading job data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadJobData();
  }, [jobId, user]);

  const hasJobData =
    Object.keys(jobData).length > 0 &&
    (jobData.brand ||
      jobData.jobLocation ||
      jobData.jobName ||
      jobData.jobNumber);
  const hasClientData =
    Object.keys(clientData).length > 0 &&
    clientData.clientName &&
    clientData.clientName !== 'Unknown Client' &&
    (clientData.clientLocation ||
      clientData.clientContact ||
      clientData.clientPhone);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="py-5 px-4 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex gap-3">
            <Link href="/jobs">
              <ArrowLeft className="size-4 mt-1" />
            </Link>
            <section>
              <h1 className="text-[16px] font-semibold">
                {loading
                  ? "Loading..."
                  : jobId
                  ? `${jobData.jobName || "Job"} - ${jobData.jobNumber || ""}`
                  : "Create New Job"}
              </h1>
              <div className="text-sm text-[#60646C] flex items-center gap-2">
                <span className="font-semibold">Last Updated:</span>
                {loading ? "Loading..." : "Jun 13th, 10:07 am"}
                <div className="size-2 bg-gray-300 rounded-full" />
                <span className="font-semibold">Version:</span> 1.0
              </div>
            </section>
          </div>
          <section className="flex items-center text-[16px] text-[#60646C] gap-2 font-semibold">
            <button className="bg-[#F9F9FB] h-10 flex items-center justify-center px-3 gap-2 border border-[#E0E0E0] rounded-md">
              <Plus className="size-4" />
              New Version
            </button>
            <button className="h-10 bg-black flex items-center text-white justify-center px-3 gap-2 rounded-md">
              Download
              <ChevronDown className="size-4" />
            </button>
          </section>
        </div>
      </div>
      <div className="flex flex-1">
        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          {/* Tabs */}
          <PageTabs
            tabs={["All", "Budget", "Pricing"]}
            activeTab={selectedTab}
            onTabChange={setSelectedTab}
            variant="border-bottom"
          />
          <section className="flex flex-1">
            {/* Table */}
            <div className="border-l flex-1 overflow-hidden flex flex-col">
              {loading ? (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading job data...</p>
                  </div>
                </div>
              ) : (
                <>
                  <table className="w-full">
                    <thead className="bg-[#F9F9FB]">
                      <tr className="border-b border-[#EAEBEE]">
                        <th className="text-left p-4 text-xs font-semibold w-16">
                          Qty
                        </th>
                        <th className="text-left p-4 text-xs font-semibold w-32">
                          Sign
                        </th>
                        <th className="text-left p-4 text-xs font-semibold w-96">
                          Description
                        </th>
                        <th className="text-left p-4 text-xs font-semibold w-32">
                          Sign Price
                        </th>
                        <th className="text-left p-4 text-xs font-semibold w-32">
                          Install Price
                        </th>
                        <th className="text-left p-4 text-xs font-semibold w-32">
                          Sign Budget
                        </th>
                        <th className="text-left p-4 text-xs font-semibold w-32">
                          Install Budget
                        </th>
                      </tr>
                    </thead>
                  </table>
                  <div className="flex-1 flex items-center justify-center">
                    <div className="flex flex-col items-center justify-center text-center">
                      <h3 className="text-2xl font-semibold mb-2">
                        Add your first sign.
                      </h3>
                      <p className="text-[#0D1216B2] text-[14px] mb-6 max-w-md">
                        You&apos;ll use this section to add all the signs needed
                        for this proposal.
                      </p>
                      <button
                        onClick={() => setAddSignSidebarOpen(true)}
                        className="bg-[#F9F9FB] h-10 flex items-center justify-center px-4 gap-2 border border-[#E0E0E0] rounded-md font-semibold text-[14px]"
                      >
                        Add Sign/Service
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
            {/* Right Sidebar */}
            <div className="w-[360px] flex flex-col h-full border-l border-[#EAEBEE]">
              {/* Job Info Section */}
              <section className={`h-full w-full flex p-[16px] border-b border-[#EAEBEE] ${hasJobData ? 'justify-start items-start' : 'justify-center items-center'}`}>
                {hasJobData ? (
                  <div className="flex flex-col gap-[24px] w-full">
                    <h2 className="text-[18px] font-[600] text-[#15191E]">
                      Job Info
                    </h2>
                    <div className="text-[14px] text-[#60646C] font-[500] flex justify-between">
                      <p >Brand</p>
                      <p className="font-[400]">
                        {jobData?.brandName || 'Unknown Brand'}
                      </p>
                    </div>
                    <div className="text-[14px] text-[#60646C] font-[500] flex justify-between items-start">
                      <p>Location</p>
                      <p className="font-[400] text-right max-w-[200px] leading-[18px]">
                        {jobData.jobLocation ||
                          "100 Coastal Way, Chesapeake, VA 23320, USA"}
                      </p>
                    </div>
                    <div className="text-[14px] text-[#60646C] font-[500] flex justify-between">
                      <p>
                        Created
                      </p>
                      <p className="font-[400]">Jul 13th, 2025</p>
                    </div>
                    <div className="text-[14px] text-[#60646C] font-[500] flex justify-between">
                      <p>
                        Creator
                      </p>
                      <div className="flex items-center gap-2">
                        {jobData.creatorAvatar ? (
                          <img 
                            src={jobData.creatorAvatar} 
                            alt={jobData.creatorName || "Creator"} 
                            className="w-6 h-6 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-xs font-medium text-gray-700">
                            {jobData.creatorName ? getInitials(jobData.creatorName) : "U"}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-[14px] text-[#60646C] font-[500] flex justify-between">
                      <p>PM</p>
                      <div className="flex items-center gap-2">
                        {jobData.pmAvatar ? (
                          <img 
                            src={jobData.pmAvatar} 
                            alt={jobData.pmName || "PM"} 
                            className="w-6 h-6 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-xs font-medium text-gray-700">
                            {jobData.pmName ? getInitials(jobData.pmName) : "P"}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center space-y-3">
                    <span className="bg-[#F9F9FB] size-10 flex items-center justify-center gap-2 border border-[#E0E0E0] rounded-md">
                      <MapPinPlus className="size-7" />
                    </span>
                    <button
                      onClick={() => setJobInfoOpen(true)}
                      className="text-[16px] font-medium underline underline-offset-2"
                    >
                      Add Your Job Info
                    </button>
                  </div>
                )}
              </section>
              {/* Client Info Section */}
              <section className={`h-full w-full flex p-[16px] ${hasClientData ? 'justify-start items-start' : 'justify-center items-center'}`}>
                {hasClientData ? (
                  <div className="flex flex-col gap-[24px] w-full">
                    <h2 className="text-[18px] font-[600] text-[#15191E]">
                      Client Info
                    </h2>
                    <div className="text-[14px] text-[#60646C] font-[500] flex justify-between">
                      <p>Client</p>
                      <p className="font-[400]">
                        {clientData.clientName || "Unknown Client"}
                      </p>
                    </div>
                    <div className="text-[14px] text-[#60646C] font-[500] flex justify-between items-start">
                      <p>Location</p>
                      <p className="font-[400] text-right max-w-[200px] leading-[18px]">
                        {clientData.clientLocation || "Unknown Location"}
                      </p>
                    </div>
                    <div className="text-[14px] text-[#60646C] font-[500] flex justify-between">
                      <p>Contact</p>
                      <p className="font-[400]">
                        {clientData.clientContact || "Unknown Contact"}
                      </p>
                    </div>
                    <div className="text-[14px] text-[#60646C] font-[500] flex justify-between">
                      <p>Phone</p>
                      <p className="font-[400]">
                        {clientData.clientPhone || "Unknown Phone"}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center space-y-3">
                    <span className="bg-[#F9F9FB] size-10 flex items-center justify-center gap-2 border border-[#E0E0E0] rounded-md">
                      <User className="size-7" />
                    </span>
                    <button
                      onClick={() => setClientInfoOpen(true)}
                      className="text-[16px] font-medium underline underline-offset-2"
                    >
                      Add Client
                    </button>
                  </div>
                )}
              </section>
            </div>
          </section>
        </div>
      </div>
      {/* Dialogs */}
      <JobInfoDialog
        isOpen={jobInfoOpen}
        onClose={() => setJobInfoOpen(false)}
        onNext={handleJobInfoSave}
        jobData={jobData}
        setJobData={setJobData}
      />
      <ClientInfoDialog
        isOpen={clientInfoOpen}
        onClose={() => setClientInfoOpen(false)}
        onComplete={handleClientInfoSave}
        clientData={clientData}
        setClientData={setClientData}
      />
      <AddSignServiceSidebar
        isOpen={addSignSidebarOpen}
        onClose={() => setAddSignSidebarOpen(false)}
      />
    </div>
  );
}
