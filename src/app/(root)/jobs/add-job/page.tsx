"use client";
import { useState } from "react";
import { ArrowLeft, Plus, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { JobInfoDialog } from "@/components/jobs/JobInfoDialog";
import { ClientInfoDialog } from "@/components/jobs/ClientInfoDialog";
import Link from "next/link";

export default function AddJobPage() {
  const [jobInfoOpen, setJobInfoOpen] = useState(false);
  const [clientInfoOpen, setClientInfoOpen] = useState(false);
  const [selectedTab, setSelectedTab] = useState("All");
  const [jobData, setJobData] = useState<{
    jobName?: string;
    jobNumber?: string;
    jobLocation?: string;
    brand?: string;
    manager?: string;
  }>({});
  const [clientData, setClientData] = useState<{
    clientName?: string;
    clientLocation?: string;
    clientContact?: string;
    clientPhone?: string;
  }>({});

  const handleJobInfoSave = () => {
    setJobInfoOpen(false);
  };

  const handleClientInfoSave = () => {
    setClientInfoOpen(false);
  };

  const hasJobData = Object.keys(jobData).length > 0;
  const hasClientData = Object.keys(clientData).length > 0;

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="py-5 px-4">
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
      <div className="flex">
        {/* Main Content */}
        <div className="flex-1">
          {/* Tabs */}
          <div className="ml-10 border-b border-[#EAEBEE]">
            <div className="flex space-x-6 text-[14px] h-11 text-[#60646C] font-semibold">
              <button
                onClick={() => setSelectedTab("All")}
                className={`pb-2 border-b-2 transition-colors ${
                  selectedTab === "All"
                    ? "border-black text-black font-semibold"
                    : "border-transparent text-[#60646C] hover:text-gray-700"
                }`}
              >
                All
              </button>
              <button
                onClick={() => setSelectedTab("Budget")}
                className={`pb-2 border-b-2 transition-colors ${
                  selectedTab === "Budget"
                    ? "border-black text-black font-semibold"
                    : "border-transparent text-[#60646C] hover:text-gray-700"
                }`}
              >
                Budget
              </button>
              <button
                onClick={() => setSelectedTab("Pricing")}
                className={`pb-2 border-b-2 transition-colors ${
                  selectedTab === "Pricing"
                    ? "border-black text-black font-semibold"
                    : "border-transparent text-[#60646C] hover:text-gray-700"
                }`}
              >
                Pricing
              </button>
            </div>
          </div>
          <section className="flex">
            {/* Table */}
            <div className="border-l flex-1 border-r border-b border-[#EAEBEE] overflow-hidden">
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
                <tbody>
                  {/* Empty State */}
                  <tr className="border-b border-[#EAEBEE]">
                    <td colSpan={7} className="p-12">
                      <div className="flex flex-col items-center justify-center text-center">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          Add your first sign.
                        </h3>
                        <p className="text-gray-500 mb-6 max-w-md">
                          You&apos;ll use this section to add all the signs
                          needed for this proposal.
                        </p>
                        <Button className="bg-black hover:bg-gray-800">
                          <Plus className="w-4 h-4 mr-2" />
                          Add Sign/Service
                        </Button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            {/* Right Sidebar */}
            <div className="w-[360px]border-l border-gray-200 p-6 space-y-6">
              {/* Job Info Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Job Info
                  </h2>
                  <button
                    onClick={() => setJobInfoOpen(true)}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Edit
                  </button>
                </div>
                {hasJobData ? (
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-gray-700">Brand</p>
                      <p className="text-gray-900">
                        {jobData.brand || "Dave&apos;s Hot Chicken"}
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
                        <span className="text-gray-900">John Doe</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700">PM</p>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
                        <span className="text-gray-900">Jane Smith</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                    <p className="text-sm text-gray-500">
                      No job information added yet.
                    </p>
                    <button
                      onClick={() => setJobInfoOpen(true)}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium mt-2"
                    >
                      Add Job Info
                    </button>
                  </div>
                )}
              </div>

              {/* Client Info Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Client Info
                  </h2>
                  <button
                    onClick={() => setClientInfoOpen(true)}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Edit
                  </button>
                </div>
                {hasClientData ? (
                  <div className="space-y-3">
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
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-center">
                    <p className="text-sm text-gray-500">
                      No client information added yet.
                    </p>
                    <button
                      onClick={() => setClientInfoOpen(true)}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium mt-2"
                    >
                      Add Client Info
                    </button>
                  </div>
                )}
              </div>
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
    </div>
  );
}
