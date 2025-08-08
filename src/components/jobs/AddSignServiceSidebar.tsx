"use client";
import { useState, useEffect } from "react";
import { X } from "lucide-react";
import Drawer from "react-modern-drawer";
import "react-modern-drawer/dist/index.css";
import { SignageTab } from "./SignageTab";
import { ServicesTab } from "./ServicesTab";
import { SignConfigurationStep } from "./SignConfigurationStep";
import { ServiceConfigurationStep } from "./ServiceConfigurationStep";

// Sign/Service Data Types
export interface SignOption {
  id: string;
  name: string;
  image: string;
  description: string;
}

export interface ServiceOption {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface SignData {
  [key: string]: any;
  racewaySize?: {
    height?: {
      feet?: string;
      inches?: string;
    };
    width?: {
      feet?: string;
      inches?: string;
    };
  };
}

export interface ServiceData {
  price: string;
}

interface AddSignServiceSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  jobId: string;
  pricingVersionId?: string; // Add this prop
  onSignAdded?: () => void; // Callback when a sign is successfully added
  initialTab?: "signage" | "services"; // Add this prop to control which tab opens initially
  brandId?: string; // Add brandId prop to filter services by brand
}

export const AddSignServiceSidebar = ({
  isOpen,
  onClose,
  jobId,
  pricingVersionId,
  onSignAdded,
  initialTab = "signage",
  brandId,
}: AddSignServiceSidebarProps) => {
  const [activeTab, setActiveTab] = useState<"signage" | "services">(initialTab);
  const [step, setStep] = useState<1 | 2>(1);
  const [selectedSign, setSelectedSign] = useState<SignOption | null>(null);
  const [selectedService, setSelectedService] = useState<ServiceOption | null>(
    null
  );
  const [signData, setSignData] = useState<SignData>({});
  const [serviceData, setServiceData] = useState<ServiceData>({ price: "" });

  // Update activeTab when initialTab prop changes
  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const handleSignSelect = (sign: SignOption) => {
    setSelectedSign(sign);
    setStep(2);
  };

  const handleServiceSelect = (service: ServiceOption) => {
    setSelectedService(service);
    setStep(2);
  };

  const handleBack = () => {
    if (step === 2) {
      setStep(1);
      setSelectedSign(null);
      setSelectedService(null);
    }
  };

  const handleClose = () => {
    setStep(1);
    setSelectedSign(null);
    setSelectedService(null);
    setSignData({});
    setServiceData({ price: "" });
    onClose();
  };

  const handleSignAdded = () => {
    setStep(1);
    setSelectedSign(null);
    setSignData({});

    // Call the onSignAdded callback
    if (onSignAdded) {
      onSignAdded();
    }

    onClose();
  };

  const handleServiceAdded = () => {
    setStep(1);
    setSelectedService(null);
    setServiceData({ price: "" });

    // Call the onSignAdded callback (reusing the same callback for services)
    if (onSignAdded) {
      onSignAdded();
    }

    onClose();
  };

  const renderStep1 = () => (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[#F2F2F2]">
        <h2 className="text-[20px] font-bold">Add New</h2>
        <button
          onClick={handleClose}
          className="text-gray-500 hover:text-gray-700"
        >
          <X className="size-5" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-[#F2F2F2]">
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
          <div className="flex items-center justify-center gap-2">
            <span>Services</span>
            <span
              className={`text-xs rounded-full px-2 py-1 ${
                activeTab === "services"
                  ? "bg-white text-black"
                  : "bg-black text-white"
              }`}
            >
              16
            </span>
          </div>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === "signage" && (
          <SignageTab onSignSelect={handleSignSelect} />
        )}
        {activeTab === "services" && (
          <ServicesTab onServiceSelect={handleServiceSelect} brandId={brandId} />
        )}
      </div>
    </div>
  );

  const renderStep2 = () => {
    if (selectedSign) {
      return (
        <SignConfigurationStep
          selectedSign={selectedSign}
          signData={signData}
          setSignData={setSignData}
          onBack={handleBack}
          onClose={handleClose}
          onSignAdded={handleSignAdded}
          jobId={jobId}
          pricingVersionId={pricingVersionId}
        />
      );
    }

    if (selectedService) {
      return (
        <ServiceConfigurationStep
          selectedService={selectedService}
          serviceData={serviceData}
          setServiceData={setServiceData}
          onBack={handleBack}
          onClose={handleClose}
          onServiceAdded={handleServiceAdded}
          jobId={jobId}
          pricingVersionId={pricingVersionId}
        />
      );
    }

    return null;
  };

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
