"use client";
import { useState } from "react";
import { X } from "lucide-react";
import Drawer from "react-modern-drawer";
import "react-modern-drawer/dist/index.css";
import { SignageTab } from "./SignageTab";
import { ServicesTab } from "./ServicesTab";
import { SignConfigurationStep } from "./SignConfigurationStep";

// Sign/Service Data Types
export interface SignOption {
  id: string;
  name: string;
  image: string;
  description: string;
}

export interface SignData {
  size: string;
  color: string;
  fabType: string;
  raceway: string;
  racewaySize: {
    height: {
      feet: string;
      inches: string;
    };
    width: {
      feet: string;
      inches: string;
    };
  };
}

// Add Sign/Service Sidebar Component
interface AddSignServiceSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  jobId: string;
}

export const AddSignServiceSidebar = ({
  isOpen,
  onClose,
  jobId,
}: AddSignServiceSidebarProps) => {
  const [activeTab, setActiveTab] = useState<"signage" | "services">("signage");
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedSign, setSelectedSign] = useState<SignOption | null>(null);
  const [signData, setSignData] = useState<SignData>({
    size: "",
    color: "",
    fabType: "",
    raceway: "",
    racewaySize: {
      height: { feet: "", inches: "" },
      width: { feet: "", inches: "" },
    },
  });

  const handleSignSelect = (sign: SignOption) => {
    setSelectedSign(sign);
    setStep(2);
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
      setSelectedSign(null);
    }
  };

  const handleClose = () => {
    setStep(1);
    setSelectedSign(null);
    setSignData({
      size: "",
      color: "",
      fabType: "",
      raceway: "",
      racewaySize: {
        height: { feet: "", inches: "" },
        width: { feet: "", inches: "" },
      },
    });
    onClose();
  };

  const renderStep1 = () => (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[#DEE1EA]">
        <h2 className="text-[20px] font-bold">Add New</h2>
        <button
          onClick={handleClose}
          className="text-gray-500 hover:text-gray-700"
        >
          <X className="size-5" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#DEE1EA]">
        <button
          onClick={() => setActiveTab("signage")}
          className={`flex-1 h-[60px] px-4 text-[14px] border-b-2 transition-colors ${
            activeTab === "signage"
              ? "border-black text-white bg-black font-semibold"
              : "border-transparent text-[#60646C] bg-white font-normal"
          }`}
        >
          <div className="flex items-center justify-center gap-2">
            <span>Signage</span>
            <span
              className={`text-xs rounded-full px-2 py-1 ${
                activeTab === "signage"
                  ? "bg-white text-black"
                  : "bg-black text-white"
              }`}
            >
              9
            </span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab("services")}
          className={`flex-1 h-[60px] px-4 text-[14px] border-b-2 transition-colors ${
            activeTab === "services"
              ? "border-black text-white bg-black font-semibold"
              : "border-transparent text-[#60646C] bg-white font-normal"
          }`}
        >
          Services
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === "signage" && (
          <SignageTab onSignSelect={handleSignSelect} />
        )}
        {activeTab === "services" && <ServicesTab />}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <SignConfigurationStep
      selectedSign={selectedSign}
      signData={signData}
      setSignData={setSignData}
      onBack={handleBack}
      onClose={handleClose}
      jobId={jobId}
    />
  );

  return (
    <Drawer
      open={isOpen}
      onClose={handleClose}
      direction="right"
      size={560}
      duration={300}
      overlayOpacity={0.5}
      overlayColor="#000"
      enableOverlay={true}
      zIndex={1000}
      className="!w-[560px]"
    >
      {step === 1 ? renderStep1() : renderStep2()}
    </Drawer>
  );
};
