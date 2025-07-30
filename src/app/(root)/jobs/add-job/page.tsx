"use client";
import { useState } from "react";
import { ArrowLeft, Plus, ChevronDown, MapPinPlus, User } from "lucide-react";
import { JobInfoDialog } from "@/components/jobs/JobInfoDialog";
import { ClientInfoDialog } from "@/components/jobs/ClientInfoDialog";
import { AddSignServiceSidebar } from "@/components/jobs/AddSignServiceSidebar";
import Link from "next/link";
import { PageTabs } from "@/components/ui/page-tabs";

export default function AddJobPage() {
  const [jobInfoOpen, setJobInfoOpen] = useState(true);
  const [clientInfoOpen, setClientInfoOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState("All");
  const [addSignSidebarOpen, setAddSignSidebarOpen] = useState(false);
  const [jobData, setJobData] = useState<{
    jobName?: string;
    jobNumber?: string;
    jobLocation?: string;
    brand?: string;
    manager?: string;
    creator?: string;
    pm?: string;
  }>({});
  const [clientData, setClientData] = useState<{
    clientName?: string;
    clientLocation?: string;
    clientContact?: string;
    clientPhone?: string;
  }>({});

  const handleJobInfoSave = (data: any) => {
    setJobData(data);
    setJobInfoOpen(false);
    setClientInfoOpen(true);
  };

  const handleClientInfoSave = (data: any) => {
    setClientData(data);
    setClientInfoOpen(false);
  };

  const hasJobData =
    Object.keys(jobData).length > 0 &&
    (jobData.brand ||
      jobData.jobLocation ||
      jobData.jobName ||
      jobData.jobNumber);
  const hasClientData =
    Object.keys(clientData).length > 0 &&
    (clientData.clientName ||
      clientData.clientLocation ||
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
                Dave&apos;s Hot Chicken - Coasteal Way (14039R)
              </h1>
              <div className="text-sm text-[#60646C] flex items-center gap-2">
                <span className="font-semibold">Last Updated:</span>
                Jun 13th, 10:07 am
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
                    You&apos;ll use this section to add all the signs needed for
                    this proposal.
                  </p>
                  <button
                    onClick={() => setAddSignSidebarOpen(true)}
                    className="bg-[#F9F9FB] h-10 flex items-center justify-center px-4 gap-2 border border-[#E0E0E0] rounded-md font-semibold text-[14px]"
                  >
                    Add Sign/Service
                  </button>
                </div>
              </div>
            </div>
            {/* Right Sidebar */}
            <div className="w-[360px] flex flex-col h-full border-l border-[#EAEBEE]">
              {/* Job Info Section */}
              <section className="h-full w-full flex justify-center items-center border-b border-[#EAEBEE]">
                {hasJobData ? (
                  <div className="space-y-3">
                    <h2 className="text-lg font-semibold text-gray-900">
                      Job Info
                    </h2>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Brand</p>
                      <p className="text-gray-900">
                        {jobData.brand || "Dave's Hot Chicken"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        Location
                      </p>
                      <p className="text-gray-900">
                        {jobData.jobLocation ||
                          "100 Coastal Way, Chesapeake, VA 23320, USA"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        Created
                      </p>
                      <p className="text-gray-900">Jul 13th, 2025</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        Creator
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
                        <span className="text-gray-900">
                          {jobData.creator || "John Doe"}
                        </span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">PM</p>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
                        <span className="text-gray-900">
                          {jobData.pm || "Jane Smith"}
                        </span>
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
              <section className="h-full w-full flex justify-center items-center">
                <div className="flex items-center justify-between"></div>
                {hasClientData ? (
                  <div className="space-y-3">
                    <h2 className="text-lg font-semibold text-gray-900">
                      Client Info
                    </h2>
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        Client
                      </p>
                      <p className="text-gray-900">
                        {clientData.clientName || "WKS Restaurant Group"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        Location
                      </p>
                      <p className="text-gray-900">
                        {clientData.clientLocation ||
                          "5856 Corporation Ave. ste 200 Cypress, CA 90630"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">
                        Contact
                      </p>
                      <p className="text-gray-900">
                        {clientData.clientContact || "Becca Meussner"}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">Phone</p>
                      <p className="text-gray-900">
                        {clientData.clientPhone || "310.318.3100"}
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
