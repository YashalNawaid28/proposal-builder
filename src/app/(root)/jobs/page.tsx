"use client";
import { useEffect, useState, useMemo } from "react";
import { ListFilter, ArrowUpDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { PageTabs } from "@/components/ui/page-tabs";
import { Pagination } from "@/components/ui/pagination";
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
  creator: {
    id: string;
    display_name: string;
    avatar_url: string;
    job_title: string;
  } | null;
  project_manager: {
    id: string;
    display_name: string;
    avatar_url: string;
    job_title: string;
  } | null;
  client: {
    id: string;
    legal_name: string;
  } | null;
  created_at: string;
  updated_at: string;
  current_pricing_version_id: string | null;
  job_name: string;
  job_no: string;
}

// Simplified row data structure for the table
interface RowData {
  id: string;
  jobName: string;
  proposalNo: string;
  date: string;
  creator: {
    id: string;
    display_name: string;
    avatar_url: string;
    job_title: string;
  } | null;
  manager: {
    id: string;
    display_name: string;
    avatar_url: string;
    job_title: string;
  } | null;
  clientName: string;
  jobNo: string;
}

// Format date function
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

// Get initials from name
const getInitials = (name: string): string => {
  return name
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

export default function JobsPage() {
  const [tab, setTab] = useState<"All" | "Drafts" | "Sent" | "Signed">("All");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [jobs, setJobs] = useState<JobData[]>([]);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage, setItemsPerPage] = useState<number>(20);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);
  const router = useRouter();

  const user = useUser();

  const handleNewJob = () => {
    router.push("/jobs/job-info");
  };

  const handleJobClick = (jobId: string) => {
    router.push(`/jobs/job-info?id=${jobId}`);
  };

  useEffect(() => {
    const fetchJobs = async () => {
      if (!user) return;
      setLoading(true);
      setError(null);
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000);

        const res = await fetch(
          `/api/jobs?page=${currentPage}&limit=${itemsPerPage}`,
          {
            headers: { "request.user.id": user.id },
            signal: controller.signal,
          }
        );

        clearTimeout(timeoutId);

        if (!res.ok) {
          throw new Error("Failed to fetch jobs");
        }

        const data = await res.json();
        setJobs(data.data || []);
        setTotalItems(data.pagination?.total || 0);
        setTotalPages(data.pagination?.totalPages || 0);
      } catch (error) {
        console.error("Error fetching jobs:", error);
        if (error instanceof Error && error.name === "AbortError") {
          setError("Request timed out. Please try again.");
        } else {
          setError(
            error instanceof Error ? error.message : "An unknown error occurred"
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [user, currentPage, itemsPerPage]);

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
      proposalNo: job.proposal_no || "N/A",
      date: formatDate(job.created_at),
      creator: job.creator,
      manager: job.project_manager,
      clientName: job.client?.legal_name || "N/A",
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

  // Pagination handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSelectedRows([]); // Clear selection when changing pages
  };

  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setItemsPerPage(newItemsPerPage);
    setCurrentPage(1); // Reset to first page when changing items per page
    setSelectedRows([]); // Clear selection
  };

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
                Proposal No.
              </th>
              <th className="p-4 text-center text-[12px] font-semibold border-r border-[#DEE1EA]">
                Date
              </th>
              <th className="p-4 text-center text-[12px] font-semibold border-r border-[#DEE1EA]">
                Creator
              </th>
              <th className="p-4 text-center text-[12px] font-semibold">
                Manager
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#DEE1EA]">
            {rowData.map((row) => (
              <tr
                key={row.id}
                className="hover:bg-gray-50 h-20 border-b border-[#DEE1EA] text-[14px] cursor-pointer"
                onClick={() => handleJobClick(row.id)}
              >
                <td className="p-4 text-center border-r border-[#DEE1EA]">
                  <div className="flex items-center justify-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 border-[#DEE1EA] text-gray-400"
                      checked={selectedRows.includes(row.id)}
                      onChange={() => handleRowSelect(row.id)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                </td>
                <td className="p-4 font-semibold border-r border-[#DEE1EA] text-[14px]">
                  <div>
                    <div className="text-[14px] font-semibold">
                      {row.jobName}
                    </div>
                    <div className="text-[14px] text-[#60646C] flex font-[400] items-center gap-2">
                      {row.clientName}
                      <div className="w-2 h-2 bg-[#DEE1EA] rounded-full"></div>
                      {row.jobNo}
                    </div>
                  </div>
                </td>
                <td className="p-4 border-r text-center border-[#DEE1EA] text-[14px]">
                  {row.proposalNo}
                </td>
                <td className="p-4 border-r border-[#DEE1EA] text-center text-[14px]">
                  {row.date}
                </td>
                <td className="p-4 border-r border-[#DEE1EA] text-center text-[14px]">
                  <UserInfo user={row.creator} />
                </td>
                <td className="p-4 text-center text-[14px]">
                  <UserInfo user={row.manager} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  // User info component
  const UserInfo = ({
    user,
  }: {
    user: {
      id: string;
      display_name: string;
      avatar_url: string;
      job_title: string;
    } | null;
  }) => {
    if (!user) return <div className="text-center text-gray-400">N/A</div>;

    return (
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0">
          {user.avatar_url ? (
            <img
              src={user.avatar_url}
              alt={user.display_name}
              className="w-8 h-8 rounded-full object-cover"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600">
              {getInitials(user.display_name)}
            </div>
          )}
        </div>
        <div className="flex flex-col">
          <div className="font-medium text-sm">{user.display_name}</div>
          {user.job_title && (
            <div className="text-xs text-gray-500">{user.job_title}</div>
          )}
        </div>
      </div>
    );
  };

  const tabs = ["All"];

  return (
    <div className="bg-white h-screen flex flex-col">
      {/* Header */}
      <section className="px-4 py-5 flex items-center gap-4 justify-between">
        <h1 className="text-2xl font-semibold ml-2">Jobs</h1>
        <div className="flex items-center gap-5">
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
      {rowData.length > 0 && totalPages > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
        />
      )}
    </div>
  );
}
