"use client";
import { useState } from "react";
import { ServiceOption, ServiceData } from "./AddSignServiceSidebar";
import { Input } from "@/components/ui/input";
import {
  Clipboard,
  X,
  Package,
  Truck,
  Palette,
  Settings,
  ArrowLeft,
} from "lucide-react";

interface ServiceConfigurationStepProps {
  selectedService: ServiceOption;
  serviceData: ServiceData;
  setServiceData: (data: ServiceData) => void;
  onBack: () => void;
  onClose: () => void;
  onServiceAdded: () => void;
  jobId: string;
  pricingVersionId?: string;
}

const getServiceIcon = (iconName: string) => {
  switch (iconName) {
    case "clipboard":
      return <Clipboard className="w-8 h-8 text-white" />;
    case "x":
      return <X className="w-8 h-8 text-white" />;
    case "package":
      return <Package className="w-8 h-8 text-white" />;
    case "truck":
      return <Truck className="w-8 h-8 text-white" />;
    case "palette":
      return <Palette className="w-8 h-8 text-white" />;
    case "settings":
      return <Settings className="w-8 h-8 text-white" />;
    default:
      return <div className="w-8 h-8 bg-white rounded-sm"></div>;
  }
};

export const ServiceConfigurationStep = ({
  selectedService,
  serviceData,
  setServiceData,
  onBack,
  onClose,
  onServiceAdded,
  jobId,
  pricingVersionId,
}: ServiceConfigurationStepProps) => {
  const [loading, setLoading] = useState(false);

  const handlePriceChange = (value: string) => {
    // Only allow numbers and decimal points
    const cleanValue = value.replace(/[^0-9.]/g, "");
    setServiceData({ ...serviceData, price: cleanValue });
  };

  const handleAddService = async () => {
    if (!serviceData.price || parseFloat(serviceData.price) <= 0) {
      alert("Please enter a valid price");
      return;
    }

    setLoading(true);
    try {
      // Create the pricing line for the service
      const formData = new FormData();
      formData.append("pricing_version_id", pricingVersionId || "");
      formData.append("service_name", selectedService.name);
      formData.append("price", serviceData.price);
      formData.append("type", "service");

      const response = await fetch("/api/pricing-lines", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to add service");
      }

      onServiceAdded();
    } catch (error) {
      console.error("Error adding service:", error);
      alert("Failed to add service. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isAddButtonEnabled =
    serviceData.price && parseFloat(serviceData.price) > 0;

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-[#F2F2F2]">
        <button onClick={onBack} className="text-gray-500 hover:text-gray-700">
          <ArrowLeft className="size-5" />
        </button>
        <h2 className="text-[20px] font-bold">Add Service</h2>
        <button
          onClick={handleAddService}
          disabled={!isAddButtonEnabled || loading}
          className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors ${
            isAddButtonEnabled && !loading
              ? "bg-black text-white"
              : "bg-[#F9F9FB] text-[#A0A1A1] cursor-not-allowed"
          }`}
        >
          {loading ? "Adding..." : "Add"}
        </button>
      </div>

      {/* Service Item */}
      <div>
        <div className="flex items-center gap-3 p-4 rounded-lg">
          <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center">
            {getServiceIcon(selectedService.icon)}
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-[16px]">
              {selectedService.name}
            </h3>
          </div>
          <div className="flex items-center gap-1 justify-center border h-9 border-[#DEE1EA] rounded-sm">
            <p className="text-[#A0A1A1] text-sm px-2">$</p>
            <Input
              type="text"
              value={serviceData.price}
              onChange={(e) => handlePriceChange(e.target.value)}
              placeholder=""
              className="w-20 border-none shadow-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
