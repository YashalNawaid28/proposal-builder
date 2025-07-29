"use client";
import { useState, useEffect } from "react";
import { ArrowLeft, Plus, Download, MapPin, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { JobInfoDialog } from "./components/JobInfoDialog";
import { ClientInfoDialog } from "./components/ClientInfoDialog";

export default function AddJobPage() {
  const [currentStep, setCurrentStep] = useState<
    "jobInfo" | "clientInfo" | null
  >(null);
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

  // Automatically open the Job Info dialog when the page loads
  useEffect(() => {
    setCurrentStep("jobInfo");
  }, []);

  const handleNewJob = () => {
    setCurrentStep("jobInfo");
  };

  const handleJobInfoNext = () => {
    setCurrentStep("clientInfo");
  };

  const handleClientInfoComplete = () => {
    // Handle job creation
    console.log("Job created:", { jobData, clientData });
    setCurrentStep(null);
    // Redirect or show success message
  };

  const hasJobData = Object.keys(jobData).length > 0;
  const hasClientData = Object.keys(clientData).length > 0;

  return (
    <div className="bg-white min-h-screen">
      {/* Header */}
      <div className="border-b border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="text-gray-500">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">New Job</h1>
              <p className="text-sm text-gray-500">Create a new job order</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="text-gray-700 border-gray-300">
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              onClick={handleNewJob}
            >
              <Plus className="w-4 h-4 mr-2" />
              New Job
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex">
        {/* Left Sidebar */}
        <div className="w-64 border-r border-gray-200 p-6 space-y-6">
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-gray-900">Job Details</h2>
            <ul className="space-y-1">
              <li>
                <a
                  href="#"
                  className="block px-3 py-2 rounded-md text-blue-600 bg-blue-50 font-medium"
                >
                  All
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Budget
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Pricing
                </a>
              </li>
            </ul>
          </div>
          <div className="space-y-2">
            <h2 className="text-lg font-semibold text-gray-900">Sections</h2>
            <ul className="space-y-1">
              <li>
                <a
                  href="#"
                  className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Signs
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Attachments
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-50"
                >
                  Notes
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-6">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">Signs</h2>
                <Button
                  variant="outline"
                  className="text-gray-700 border-gray-300"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Sign
                </Button>
              </div>
            </div>
            <div className="p-6">
              {/* Empty State for Signs */}
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Plus className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Add your first sign.
                </h3>
                <p className="text-gray-500 max-w-md">
                  You haven&apos;t added any signs to this job yet. Click
                  &quot;Add Sign&quot; to get started.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-80 border-l border-gray-200 p-6 space-y-6">
          {/* Job Info Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Job Info</h2>
            {hasJobData ? (
              <>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <p className="text-sm font-medium text-gray-700">Job Name</p>
                  <p className="text-gray-900">
                    {jobData.jobName || "New Job Order"}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <p className="text-sm font-medium text-gray-700">
                    Job Number
                  </p>
                  <p className="text-gray-900">
                    {jobData.jobNumber || "#JOB-001"}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <p className="text-sm font-medium text-gray-700">
                    Job Location
                  </p>
                  <p className="text-gray-900">
                    {jobData.jobLocation || "123 Main St, Anytown, USA"}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <p className="text-sm font-medium text-gray-700">Brand</p>
                  <p className="text-gray-900">
                    {jobData.brand || "Dave&apos;s Hot Chicken"}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <p className="text-sm font-medium text-gray-700">Manager</p>
                  <p className="text-gray-900">
                    {jobData.manager || "John Doe"}
                  </p>
                </div>
                <Button
                  variant="outline"
                  className="w-full text-gray-700 border-gray-300"
                  onClick={() => setCurrentStep("jobInfo")}
                >
                  Edit Job Info
                </Button>
              </>
            ) : (
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 text-center">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-gray-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 underline">
                  Add Your Job Info
                </h3>
                <Button
                  variant="outline"
                  className="w-full text-gray-700 border-gray-300 mt-4"
                  onClick={() => setCurrentStep("jobInfo")}
                >
                  Add Job Info
                </Button>
              </div>
            )}
          </div>

          {/* Client Info Section */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Client Info</h2>
            {hasClientData ? (
              <>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <p className="text-sm font-medium text-gray-700">
                    Client Name
                  </p>
                  <p className="text-gray-900">
                    {clientData.clientName || "Acme Corp"}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <p className="text-sm font-medium text-gray-700">
                    Client Location
                  </p>
                  <p className="text-gray-900">
                    {clientData.clientLocation || "456 Oak Ave, Anytown, USA"}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <p className="text-sm font-medium text-gray-700">
                    Contact Person
                  </p>
                  <p className="text-gray-900">
                    {clientData.clientContact || "Jane Smith"}
                  </p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <p className="text-sm font-medium text-gray-700">
                    Phone Number
                  </p>
                  <p className="text-gray-900">
                    {clientData.clientPhone || "(555) 123-4567"}
                  </p>
                </div>
                <Button
                  variant="outline"
                  className="w-full text-gray-700 border-gray-300"
                  onClick={() => setCurrentStep("clientInfo")}
                >
                  Edit Client Info
                </Button>
              </>
            ) : (
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 text-center">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <User className="w-8 h-8 text-gray-500" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2 underline">
                  Add Client
                </h3>
                <Button
                  variant="outline"
                  className="w-full text-gray-700 border-gray-300 mt-4"
                  onClick={() => setCurrentStep("clientInfo")}
                >
                  Add Client
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dialogs */}
      <JobInfoDialog
        isOpen={currentStep === "jobInfo"}
        onClose={() => setCurrentStep(null)}
        onNext={handleJobInfoNext}
        jobData={jobData}
        setJobData={setJobData}
      />

      <ClientInfoDialog
        isOpen={currentStep === "clientInfo"}
        onClose={() => setCurrentStep(null)}
        onComplete={handleClientInfoComplete}
        clientData={clientData}
        setClientData={setClientData}
        onAddNewClient={() => {}}
      />
    </div>
  );
}
