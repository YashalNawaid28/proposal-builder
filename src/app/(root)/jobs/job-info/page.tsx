"use client";
import { useState, useEffect, useCallback } from "react";
import { ArrowLeft, Plus, ChevronDown, MapPinPlus, User } from "lucide-react";
import { JobInfoDialog } from "@/components/jobs/JobInfoDialog";
import { ClientInfoDialog } from "@/components/jobs/ClientInfoDialog";
import { AddSignServiceSidebar } from "@/components/jobs/AddSignServiceSidebar";
import Link from "next/link";
import { PageTabs } from "@/components/ui/page-tabs";
import { useSearchParams } from "next/navigation";
import { useUser } from "@stackframe/stack";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { generateProposalHTML } from "@/lib/generate-proposal-html";
import { generatePricingSheetHTML } from "@/lib/generate-pricing-sheet-html";

export default function AddJobPage() {
  const searchParams = useSearchParams();
  const user = useUser();
  const jobId = searchParams.get("id");
  console.log("Job Info Page Debug - jobId from URL:", jobId);

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
    createdDate?: string; // Add created date field
  }>({});
  const [clientData, setClientData] = useState<{
    clientName?: string;
    clientLocation?: string;
    clientContact?: string;
    clientPhone?: string;
  }>({});
  const [pricingData, setPricingData] = useState<{
    versions: any[];
    lines: any[];
  }>({ versions: [], lines: [] });
  const [loadingPricing, setLoadingPricing] = useState(false);
  const [versions, setVersions] = useState<any[]>([]);
  const [selectedVersion, setSelectedVersion] = useState<any>(null);
  const [loadingVersions, setLoadingVersions] = useState(false);

  // Function to generate initials from display name
  const getInitials = (displayName: string) => {
    return displayName
      .split(" ")
      .map((name) => name.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Function to format date like "Jul 13th, 2025"
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const month = date.toLocaleDateString("en-US", { month: "short" });
    const day = date.getDate();
    const year = date.getFullYear();

    // Add ordinal suffix to day
    const getOrdinalSuffix = (day: number) => {
      if (day > 3 && day < 21) return "th";
      switch (day % 10) {
        case 1:
          return "st";
        case 2:
          return "nd";
        case 3:
          return "rd";
        default:
          return "th";
      }
    };

    return `${month} ${day}${getOrdinalSuffix(day)}, ${year}`;
  };

  // Function to fetch brand name by ID
  const fetchBrandName = async (brandId: string) => {
    try {
      const response = await fetch("/api/brands");
      const result = await response.json();
      if (result.data) {
        const brand = result.data.find((b: any) => b.id === brandId);
        return brand ? brand.brand_name : "Unknown Brand";
      }
    } catch (error) {
      console.error("Error fetching brand:", error);
    }
    return "Unknown Brand";
  };

  // Function to fetch user name by ID
  const fetchUserName = async (userId: string) => {
    try {
      const response = await fetch(`/api/users/${userId}`);
      if (response.ok) {
        const user = await response.json();
        return {
          displayName: user.display_name || "Unknown User",
          avatarUrl: user.avatar_url || null,
        };
      }
    } catch (error) {
      console.error("Error fetching user:", error);
    }
    return {
      displayName: "Unknown User",
      avatarUrl: null,
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
          clientLocation: `${client.street || ""}, ${client.city || ""}, ${
            client.state || ""
          } ${client.postcode || ""}`
            .trim()
            .replace(/^,\s*/, ""),
          clientContact: client.client_contact || client.legal_name,
          clientPhone: client.phone || "",
        };
      }
    } catch (error) {
      console.error("Error fetching client:", error);
    }
    return null; // Return null when no client is found
  };

  // Function to fetch pricing versions for a job
  const fetchPricingVersions = async (jobId: string) => {
    try {
      const response = await fetch(`/api/pricing-versions?job_id=${jobId}`);
      if (response.ok) {
        const result = await response.json();
        return result.data || [];
      }
    } catch (error) {
      console.error("Error fetching pricing versions:", error);
    }
    return [];
  };

  // Function to fetch pricing lines for a pricing version
  const fetchPricingLines = async (pricingVersionId: string) => {
    try {
      const response = await fetch(
        `/api/pricing-lines?pricing_version_id=${pricingVersionId}`
      );
      if (response.ok) {
        const result = await response.json();
        return result.data || [];
      }
    } catch (error) {
      console.error("Error fetching pricing lines:", error);
    }
    return [];
  };

  // Function to fetch versions for a job
  const fetchVersions = useCallback(async (jobId: string) => {
    try {
      setLoadingVersions(true);
      const versions = await fetchPricingVersions(jobId);
      setVersions(versions);

      // Set the latest version as selected (highest version_no, then highest revision_no)
      if (versions.length > 0) {
        const latestVersion = versions.sort((a: any, b: any) => {
          if (a.version_no !== b.version_no) {
            return b.version_no - a.version_no;
          }
          return b.revision_no - a.revision_no;
        })[0];
        setSelectedVersion(latestVersion);
      }
    } catch (error) {
      console.error("Error fetching versions:", error);
    } finally {
      setLoadingVersions(false);
    }
  }, []);

  // Function to create new version
  const createNewVersion = async () => {
    if (!jobId || !user) return;

    try {
      // Find the latest version to determine new version/revision numbers
      const latestVersion = versions.sort((a: any, b: any) => {
        if (a.version_no !== b.version_no) {
          return b.version_no - a.version_no;
        }
        return b.revision_no - a.revision_no;
      })[0];

      let newVersionNo = 1;
      let newRevisionNo = 0;

      if (latestVersion) {
        if (latestVersion.revision_no < 9) {
          newVersionNo = latestVersion.version_no;
          newRevisionNo = latestVersion.revision_no + 1;
        } else {
          newVersionNo = latestVersion.version_no + 1;
          newRevisionNo = 0;
        }
      } else {
        // If no versions exist yet, start with 1.0
        newVersionNo = 1;
        newRevisionNo = 0;
      }

      const response = await fetch("/api/pricing-versions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          job_id: jobId,
          version_no: newVersionNo,
          revision_no: newRevisionNo,
          creator_id: user.id,
        }),
      });

      if (response.ok) {
        const newVersion = await response.json();
        console.log("Created new version:", newVersion);

        // Copy pricing lines from the latest version to the new version
        if (latestVersion) {
          const existingLines = await fetchPricingLines(latestVersion.id);
          console.log("Copying pricing lines:", existingLines.length);

          // Create new pricing lines for the new version
          for (const line of existingLines) {
            const lineResponse = await fetch("/api/pricing-lines", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                pricing_version_id: newVersion.data.id,
                sign_id: line.sign_id,
                description_resolved: line.description_resolved,
                qty: line.qty,
                list_price: line.list_price,
                cost_budget: line.cost_budget,
                list_install_price: line.list_install_price,
                cost_install_budget: line.cost_install_budget,
              }),
            });

            if (!lineResponse.ok) {
              console.error("Failed to copy pricing line:", line.id);
            }
          }
        }

        // Refresh versions
        await fetchVersions(jobId);

        // Set the new version as selected
        setSelectedVersion(newVersion.data);
      }
    } catch (error) {
      console.error("Error creating new version:", error);
    }
  };

  // Function to fetch all pricing data for a job
  const fetchPricingData = useCallback(
    async (jobId: string, versionId?: string) => {
      console.log(
        "Job Info Page - fetchPricingData called for jobId:",
        jobId,
        "versionId:",
        versionId
      );
      try {
        setLoadingPricing(true);

        // If versionId is provided, fetch data for that specific version
        if (versionId) {
          const lines = await fetchPricingLines(versionId);
          setPricingData({
            versions: [],
            lines: lines,
          });
        } else {
          // Fetch pricing versions
          const versions = await fetchPricingVersions(jobId);
          console.log("Job Info Page - Fetched versions:", versions.length);

          // Fetch pricing lines for each version
          const allLines = [];
          for (const version of versions) {
            const lines = await fetchPricingLines(version.id);
            allLines.push(...lines);
          }
          console.log("Job Info Page - Fetched total lines:", allLines.length);

          setPricingData({
            versions,
            lines: allLines,
          });
        }
      } catch (error) {
        console.error("Error fetching pricing data:", error);
      } finally {
        setLoadingPricing(false);
      }
    },
    []
  );

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
        let brandName = "Unknown Brand";
        if (job.brand_id) {
          brandName = await fetchBrandName(job.brand_id);
        }

        // Fetch creator name and avatar if creator_id exists
        let creatorData = { displayName: "Unknown User", avatarUrl: null };
        if (job.creator_id) {
          creatorData = await fetchUserName(job.creator_id);
        }

        // Fetch PM name and avatar if pm_id exists
        let pmData = { displayName: "Unknown PM", avatarUrl: null };
        if (job.pm_id) {
          pmData = await fetchUserName(job.pm_id);
        }

        // Fetch client data if client_id exists
        let clientData = {
          clientName: "Unknown Client",
          clientLocation: "Unknown Location",
          clientContact: "Unknown Contact",
          clientPhone: "Unknown Phone",
        };
        if (job.client_id) {
          const fetchedClientData = await fetchClientData(job.client_id);
          if (fetchedClientData) {
            clientData = fetchedClientData;
          }
        }

        // Format the created_at date
        const createdAt = new Date(job.created_at);
        const formattedDate = formatDate(job.created_at);

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
          createdDate: formattedDate, // Add the created date
        });

        // Set the actual client data
        setClientData(clientData);

        // Fetch versions for this job
        console.log("Job Info Page - Fetching versions for jobId:", jobId);
        await fetchVersions(jobId);

        // Note: Pricing data will be fetched when selectedVersion is set
        // This prevents showing data from all versions initially
      } catch (error) {
        console.error("Error loading job data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadJobData();
  }, [jobId, user, fetchPricingData]);

  // Fetch pricing data when selected version changes
  useEffect(() => {
    if (selectedVersion && jobId) {
      fetchPricingData(jobId, selectedVersion.id);
    }
  }, [selectedVersion, jobId, fetchPricingData]);

  // Function to download proposal PDF
  const downloadProposal = async () => {
    if (!selectedVersion || !pricingData.lines.length) {
      alert("No pricing data available for download");
      return;
    }

    try {
      const htmlContent = generateProposalHTML(
        jobData,
        clientData,
        pricingData,
        { version_no: selectedVersion.version_no, revision_no: selectedVersion.revision_no }
      );

      const response = await fetch("/api/generate-proposal-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          htmlContent,
          fileName: `proposal-${jobData.jobNumber || 'job'}-v${selectedVersion.version_no}.${selectedVersion.revision_no}`,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate PDF");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `proposal-${jobData.jobNumber || 'job'}-v${selectedVersion.version_no}.${selectedVersion.revision_no}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading proposal:", error);
      alert("Failed to download proposal");
    }
  };

  // Function to download pricing sheet
  const downloadPricingSheet = async () => {
    if (!selectedVersion || !pricingData.lines.length) {
      alert("No pricing data available for download");
      return;
    }

    try {
      const htmlContent = generatePricingSheetHTML(
        jobData,
        clientData,
        pricingData,
        { version_no: selectedVersion.version_no, revision_no: selectedVersion.revision_no }
      );

      const response = await fetch("/api/generate-pricing-sheet-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          htmlContent,
          fileName: `pricing-sheet-${jobData.jobNumber || 'job'}-v${selectedVersion.version_no}.${selectedVersion.revision_no}`,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate PDF");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `pricing-sheet-${jobData.jobNumber || 'job'}-v${selectedVersion.version_no}.${selectedVersion.revision_no}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error downloading pricing sheet:", error);
      alert("Failed to download pricing sheet");
    }
  };

  const hasJobData =
    Object.keys(jobData).length > 0 &&
    (jobData.brand ||
      jobData.jobLocation ||
      jobData.jobName ||
      jobData.jobNumber);
  const hasClientData =
    Object.keys(clientData).length > 0 &&
    clientData.clientName &&
    clientData.clientName !== "Unknown Client" &&
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
                <span className="font-semibold">Version:</span>
                {loadingVersions ? (
                  "Loading..."
                ) : selectedVersion ? (
                  versions.length > 1 ? (
                    <Select
                      value={selectedVersion.id}
                      onValueChange={(value) => {
                        const version = versions.find((v) => v.id === value);
                        setSelectedVersion(version);
                      }}
                    >
                      <SelectTrigger className="bg-transparent text-[#60646C] text-sm border-none focus:ring-0 focus:outline-none shadow-none cursor-pointer h-auto p-0 w-auto">
                        <SelectValue
                          placeholder={`${selectedVersion.version_no}.${selectedVersion.revision_no}`}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {versions.map((version) => (
                          <SelectItem key={version.id} value={version.id}>
                            {version.version_no}.{version.revision_no}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    `${selectedVersion.version_no}.${selectedVersion.revision_no}`
                  )
                ) : (
                  "No versions"
                )}
              </div>
            </section>
          </div>
          <section className="flex items-center text-[16px] text-[#60646C] gap-2 font-semibold">
            <button
              onClick={createNewVersion}
              className="bg-[#F9F9FB] h-10 flex items-center justify-center px-3 gap-2 border border-[#E0E0E0] rounded-md hover:bg-gray-100"
            >
              <Plus className="size-4" />
              New Version
            </button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="h-10 bg-black flex items-center text-white justify-center px-3 gap-2 rounded-md hover:bg-gray-800">
                  Download
                  <ChevronDown className="size-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={downloadProposal}>
                  Download Proposal
                </DropdownMenuItem>
                <DropdownMenuItem onClick={downloadPricingSheet}>
                  Download Pricing Sheet
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
                        <th className="text-center p-4 text-xs font-semibold w-32">
                          Sign Price
                        </th>
                        <th className="text-center p-4 text-xs font-semibold w-32">
                          Install Price
                        </th>
                        <th className="text-center p-4 text-xs font-semibold w-32">
                          Sign Budget
                        </th>
                        <th className="text-center p-4 text-xs font-semibold w-32">
                          Install Budget
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {loadingPricing ? (
                        <tr>
                          <td colSpan={7} className="text-center py-8">
                            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 mx-auto mb-2"></div>
                            <p className="text-gray-600 text-sm">
                              Loading pricing data...
                            </p>
                          </td>
                        </tr>
                      ) : pricingData.lines.length > 0 ? (
                        pricingData.lines.map((line: any, index: number) => (
                          <tr
                            key={line.id}
                            className="border-b border-[#EAEBEE] hover:bg-gray-50"
                          >
                            <td className="p-4 text-sm">{line.qty || 1}</td>
                            <td>
                              <div className="flex items-center gap-3">
                                <div className=" rounded-lg flex items-center justify-center px-[8px]">
                                  {line.signs?.sign_image ? (
                                    <img
                                      src={line.signs.sign_image}
                                      alt={line.signs?.sign_name || "Sign"}
                                    />
                                  ) : (
                                    <div className="text-gray-400 text-xs text-center">
                                      No Image
                                    </div>
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="p-4 text-sm">
                              {line.description_resolved || "No description"}
                            </td>
                            <td className="p-4 text-sm font-medium text-center">
                              ${line.list_price?.toFixed(2) || "0.00"}
                            </td>
                            <td className="p-4 text-sm font-medium text-center">
                              ${line.list_install_price?.toFixed(2) || "0.00"}
                            </td>
                            <td className="p-4 text-sm font-medium text-center">
                              ${line.cost_budget?.toFixed(2) || "0.00"}
                            </td>
                            <td className="p-4 text-sm font-medium text-center">
                              ${line.cost_install_budget?.toFixed(2) || "0.00"}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={7} className="text-center py-8">
                            <div className="flex flex-col items-center justify-center text-center">
                              <h3 className="text-2xl font-semibold mb-2">
                                Add your first sign.
                              </h3>
                              <p className="text-[#0D1216B2] text-[14px] mb-6 max-w-md">
                                You&apos;ll use this section to add all the
                                signs needed for this proposal.
                              </p>
                              <button
                                onClick={() => setAddSignSidebarOpen(true)}
                                className="bg-[#F9F9FB] h-10 flex items-center justify-center px-4 gap-2 border border-[#E0E0E0] rounded-md font-semibold text-[14px]"
                              >
                                Add Sign/Service
                              </button>
                            </div>
                          </td>
                        </tr>
                      )}
                      {/* Totals Row */}
                      {pricingData.lines.length > 0 && (
                        <tr>
                          <td colSpan={2} className="p-4">
                            <button
                              onClick={() => setAddSignSidebarOpen(true)}
                              className="h-10 flex items-center justify-center px-4 gap-2 font-semibold text-[14px] hover:bg-gray-50"
                            >
                              <Plus className="size-4" />
                              Add Sign
                            </button>
                          </td>
                          <td className="p-4">
                            <p className="text-sm font-semibold text-right pr-10 w-full">
                              Totals:
                            </p>
                          </td>
                          <td className="p-4 text-sm font-semibold text-center">
                            $
                            {pricingData.lines
                              .reduce(
                                (sum: number, line: any) =>
                                  sum + (line.list_price || 0),
                                0
                              )
                              .toFixed(2)}
                          </td>
                          <td className="p-4 text-sm font-semibold text-center">
                            $
                            {pricingData.lines
                              .reduce(
                                (sum: number, line: any) =>
                                  sum + (line.list_install_price || 0),
                                0
                              )
                              .toFixed(2)}
                          </td>
                          <td className="p-4 text-sm font-semibold text-center">
                            $
                            {pricingData.lines
                              .reduce(
                                (sum: number, line: any) =>
                                  sum + (line.cost_budget || 0),
                                0
                              )
                              .toFixed(2)}
                          </td>
                          <td className="p-4 text-sm font-semibold text-center">
                            $
                            {pricingData.lines
                              .reduce(
                                (sum: number, line: any) =>
                                  sum + (line.cost_install_budget || 0),
                                0
                              )
                              .toFixed(2)}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </>
              )}
            </div>
            {/* Right Sidebar */}
            <div className="w-[360px] flex flex-col h-full border-l border-[#EAEBEE]">
              {/* Job Info Section */}
              <section
                className={`h-full w-full flex p-[16px] border-b border-[#EAEBEE] ${
                  hasJobData
                    ? "justify-start items-start"
                    : "justify-center items-center"
                }`}
              >
                {hasJobData ? (
                  <div className="flex flex-col gap-[24px] w-full">
                    <div className="flex items-center justify-between gap-2">
                      <h2 className="text-[18px] font-[600] text-[#15191E]">
                        Job Info
                      </h2>
                      <button
                        onClick={() => setJobInfoOpen(true)}
                        className="text-[14px] font-[500] underline underline-offset-2 hover:text-[#15191E]"
                      >
                        Edit
                      </button>
                    </div>
                    <div className="text-[14px] text-[#60646C] font-[500] flex justify-between">
                      <p>Brand</p>
                      <p className="font-[400]">
                        {jobData?.brandName || "Unknown Brand"}
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
                      <p>Created</p>
                      <p className="font-[400]">
                        {jobData.createdDate || "Loading..."}
                      </p>
                    </div>
                    <div className="text-[14px] text-[#60646C] font-[500] flex justify-between">
                      <p>Creator</p>
                      <div className="flex items-center gap-2">
                        {jobData.creatorAvatar ? (
                          <img
                            src={jobData.creatorAvatar}
                            alt={jobData.creatorName || "Creator"}
                            className="w-6 h-6 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-xs font-medium text-gray-700">
                            {jobData.creatorName
                              ? getInitials(jobData.creatorName)
                              : "U"}
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
              <section
                className={`h-full w-full flex p-[16px] ${
                  hasClientData
                    ? "justify-start items-start"
                    : "justify-center items-center"
                }`}
              >
                {hasClientData ? (
                  <div className="flex flex-col gap-[24px] w-full">
                    <div className="flex items-center justify-between gap-2">
                      <h2 className="text-[18px] font-[600] text-[#15191E]">
                        Client Info
                      </h2>
                      <button
                        onClick={() => setClientInfoOpen(true)}
                        className="text-[14px] font-[500] underline underline-offset-2 hover:text-[#15191E]"
                      >
                        Edit
                      </button>
                    </div>
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
        onClose={() => {
          setAddSignSidebarOpen(false);
          // Refresh pricing data when sidebar closes (in case a new sign was added)
          if (jobId && selectedVersion) {
            fetchPricingData(jobId, selectedVersion.id);
          }
        }}
        jobId={jobId || ""}
      />
    </div>
  );
}
