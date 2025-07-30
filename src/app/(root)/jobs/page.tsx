"use client";
import { useEffect, useState, useMemo } from "react";
import {
  ListFilter,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { PageTabs } from "@/components/ui/page-tabs";
import { useUser } from "@stackframe/stack";

export interface JobData {
  id: string;
  brand_id: string;
  client_id: string | null;
  contact_id: string | null;
  site_street: string;
  site_city: string;
  site_state: string;
  site_postcode: string;
  site_country: string;
  status: string;
  proposal_no: string | null;
  proposal_seq: number | null;
  creator_id: string | null;
  pm_id: string | null;
  created_at: string;
  updated_at: string;
  current_pricing_version_id: string | null;
  job_name: string;
  job_no: string;
  manager_id: string;
}

// Simplified row data structure for the table
interface RowData {
  id: string;
  jobName: string;
  status: string;
  proposalNo: string;
  date: string;
  creator: string;
  totalPrice: string;
  location: string;
  jobNo: string;
}

// StatusCell component that handles different statuses
const StatusCell = ({ status }: { status: string }) => {
  return (
    <span className="bg-[#15191E1A] h-[24px] font-semibold px-3 py-1 rounded text-[14px]">
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

// Format date function
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export default function JobsPage() {
  const [tab, setTab] = useState<"All" | "Drafts" | "Sent" | "Signed">("All");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [jobs, setJobs] = useState<JobData[]>([]);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const router = useRouter();

  const user = useUser();

  const handleNewJob = () => {
    router.push("/jobs/add-job");
  };

  useEffect(() => {
    const fetchJobs = async () => {
      if (!user) return; // Don't fetch if user is not available
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/jobs", {
          headers: { "request.user.id": user.id },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch jobs");
        }

        const data = await res.json();
        setJobs(data.data || []);
      } catch (error) {
        console.error("Error fetching jobs:", error);
        setError(
          error instanceof Error ? error.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [user]);

  // Filter jobs based on the selected tab
  const filteredJobs = useMemo(() => {
    if (tab === "All") return jobs;
    return jobs.filter((job) => job.status === tab.toLowerCase());
  }, [jobs, tab]);

  // Transform API data to match the table structure
  const rowData: RowData[] = useMemo(() => {
    return filteredJobs.map((job) => ({
      id: job.id,
      jobName: job.job_name,
      status: job.status,
      proposalNo: job.proposal_no || "N/A",
      date: formatDate(job.created_at),
      creator: job.creator_id || "N/A",
      totalPrice: "$0.00", // Placeholder - you may need to calculate this from pricing data
      location: `${job.site_city}, ${job.site_state}`,
      jobNo: job.job_no,
    }));
  }, [filteredJobs]);

  // --- Selection Handlers ---
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedRows(rowData.map((row) => row.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleRowSelect = (id: string) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const isAllSelected =
    rowData.length > 0 && selectedRows.length === rowData.length;

  const renderTable = () => {
    if (loading) {
      return <div className="p-4 text-center">Loading jobs...</div>;
    }
    if (error) {
      return <div className="p-4 text-center text-red-500">Error: {error}</div>;
    }
    if (rowData.length === 0) {
      return null; // Return null to show empty state
    }

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead className="bg-[#F9F9FB]">
            <tr className="border-b border-[#DEE1EA] h-[50px] text-[12px] font-semibold">
              <th className="w-16 border-r border-[#DEE1EA]">
                <div className="flex items-center justify-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 border-[#DEE1EA] text-gray-400"
                    onChange={handleSelectAll}
                    checked={isAllSelected}
                  />
                </div>
              </th>
              <th className="p-4 text-left text-[12px] font-semibold border-r border-[#DEE1EA]">
                Job Name
              </th>
              <th className="p-4 text-center text-[12px] font-semibold border-r border-[#DEE1EA]">
                Status
              </th>
              <th className="p-4 text-center text-[12px] font-semibold border-r border-[#DEE1EA]">
                Proposal No.
              </th>
              <th className="p-4 text-center text-[12px] font-semibold border-r border-[#DEE1EA]">
                Date
              </th>
              <th className="p-4 text-center text-[12px] font-semibold border-r border-[#DEE1EA]">
                Creator
              </th>
              <th className="p-4 text-center text-[12px] font-semibold">
                Total Price
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#DEE1EA]">
            {rowData.map((row) => (
              <tr
                key={row.id}
                className="hover:bg-gray-50 h-20 border-b border-[#DEE1EA] text-[14px]"
              >
                <td className="p-4 text-center border-r border-[#DEE1EA]">
                  <div className="flex items-center justify-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 border-[#DEE1EA] text-gray-400"
                      checked={selectedRows.includes(row.id)}
                      onChange={() => handleRowSelect(row.id)}
                    />
                  </div>
                </td>
                <td className="p-4 font-semibold border-r border-[#DEE1EA] text-[14px]">
                  <div>
                    <div className="text-[14px] font-semibold">
                      {row.jobName}
                    </div>
                    <div className="text-[14px] text-[#60646C] flex font-[400] items-center gap-2">
                      {row.location}
                      <div className="w-2 h-2 bg-[#60646C] rounded-full"></div>
                      {row.jobNo}
                    </div>
                  </div>
                </td>
                <td className="p-4 border-r border-[#DEE1EA] text-center">
                  <StatusCell status={row.status} />
                </td>
                <td className="p-4 border-r text-center border-[#DEE1EA] text-[14px]">
                  {row.proposalNo}
                </td>
                <td className="p-4 border-r border-[#DEE1EA] text-center text-[14px]">
                  {row.date}
                </td>
                <td className="p-4 border-r border-[#DEE1EA] text-center text-[14px]">
                  {row.creator}
                </td>
                <td className="p-4 text-center text-[14px]">
                  {row.totalPrice}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const tabs = ["All", "Drafts", "Sent", "Signed"];

  return (
    <div className="bg-white h-screen flex flex-col">
      {/* Header */}
      <section className="px-4 py-5 flex items-center gap-4 justify-between">
        <h1 className="text-2xl font-semibold ml-2">Jobs</h1>
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2 text-[14px] cursor-pointer">
            <ListFilter className="w-4 h-4" />
            <span>Filter</span>
          </div>
          <div className="flex items-center gap-2 text-[14px] cursor-pointer">
            <ArrowUpDown className="w-4 h-4" />
            <span>Sort</span>
          </div>
          <button
            onClick={handleNewJob}
            className="bg-black text-white px-4 text-[14px] flex items-center justify-center font-semibold py-2 rounded-md h-10"
          >
            New Job
          </button>
        </div>
      </section>
      <div className="border-b border-[#EAEBEE]">
        <PageTabs
          tabs={tabs}
          activeTab={tab}
          onTabChange={(tab) =>
            setTab(tab as "All" | "Drafts" | "Sent" | "Signed")
          }
        />
      </div>

      {/* Table or Empty State */}
      {rowData.length > 0 ? (
        <div className="flex-1">
          <div>{renderTable()}</div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
          <div className="text-center max-w-md">
            <h2 className="text-2xl font-semibold mb-2">
              Create your first job.
            </h2>
            <p className="text-[14px] text-[#60646C] mb-6">
              You&apos;ll use this section create jobs for any brand we service.
              Brand specific jobs can also be created under their tab in the
              menu.
            </p>
            <div className="flex items-center justify-center">
              <button
                onClick={handleNewJob}
                className="border border-[#DEE1EA] px-6 py-3 flex items-center justify-center h-10 text-black text-[14px] rounded-md bg-[#F9F9FB] font-medium"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pagination Section */}
      {rowData.length > 0 && (
        <div className="flex items-center justify-between px-6 h-16 text-[12px] font-medium py-4 border-t border-[#DEE1EA] bg-white">
          <div>Showing 1-25 of 321 Jobs</div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-gray-100 rounded">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span>1 of 13</span>
              <button className="p-2 hover:bg-gray-100 rounded">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span>25 Jobs per page</span>
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
      )}
    </div>
  );
}
