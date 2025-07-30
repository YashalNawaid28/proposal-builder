"use client";
import { useEffect, useState } from "react";
import { ListFilter, ArrowUpDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { PageTabs } from "@/components/ui/page-tabs";
import { useUser } from "@stackframe/stack";

export interface JobData {
  id: string;
  brand_id: string;
  contact_id: string;
  site_street: string;
  site_city: string;
  site_state: string;
  site_postcode: string;
  site_country: string;
  status: string;
  proposal_no: number;
  proposal_seq: number;
  creator_id: string;
  pm_id: string;
  job_name: string[];
  job_no: number;
  current_pricing_version_id: string;
}

export default function JobsPage() {
  const [tab, setTab] = useState<"all" | "drafts" | "sent" | "signed">("all");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [jobs, setJobs] = useState<JobData[]>([]);
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
        const res = await fetch("/api/jobs?page=1&limit=10", {
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

  const tabs = ["all", "drafts", "sent", "signed"];

  return (
    <div className="bg-white">
      {/* Header */}

      <section className="px-4 py-5 flex items-center gap-4 justify-between text-[#60646C]">
        <h1 className="text-2xl font-semibold">Jobs</h1>
        <div className="flex items-center gap-4">
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
      <div className="border-b border-[#EAEBEE] px-7">
        <PageTabs
          tabs={tabs}
          activeTab={tab}
          onTabChange={(tab) =>
            setTab(tab as "all" | "drafts" | "sent" | "signed")
          }
        />
      </div>

      {/* Empty State */}
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
        <div className="text-center max-w-md">
          <h2 className="text-2xl font-semibold mb-2">
            Create your first job.
          </h2>
          <p className="text-[14px] text-[#60646C] mb-6">
            You&apos;ll use this section create jobs for any brand we service.
            Brand specific jobs can also be created under their tab in the menu.
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
    </div>
  );
}
