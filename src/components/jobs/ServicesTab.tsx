"use client";
import { ServiceOption } from "./AddSignServiceSidebar";
import { Clipboard, X, Package, Truck, Palette, Settings } from "lucide-react";

interface ServicesTabProps {
  onServiceSelect: (service: ServiceOption) => void;
}

// Define the services data with proper icons
const servicesData: ServiceOption[] = [
  {
    id: "site-survey",
    name: "Site Survey",
    icon: "clipboard",
    description: "On-site survey and assessment",
  },
  {
    id: "sign-removal",
    name: "Sign Removal",
    icon: "x",
    description: "Removal of existing signs",
  },
  {
    id: "shipping-exterior",
    name: "Shipping & Crating (Exterior)",
    icon: "package",
    description: "Shipping and crating for exterior signs",
  },
  {
    id: "shipping-interior",
    name: "Shipping & Crating (Interior)",
    icon: "package",
    description: "Shipping and crating for interior signs",
  },
  {
    id: "delivery",
    name: "Delivery",
    icon: "truck",
    description: "Delivery service",
  },
  {
    id: "design",
    name: "Design",
    icon: "palette",
    description: "Design services",
  },
  {
    id: "engineering",
    name: "Engineering",
    icon: "settings",
    description: "Engineering services",
  },
];

const getServiceIcon = (iconName: string) => {
  switch (iconName) {
    case "clipboard":
      return <Clipboard className="w-6 h-6 text-[#C22932]" />;
    case "x":
      return <X className="w-6 h-6 text-[#C22932]" />;
    case "package":
      return <Package className="w-6 h-6 text-[#C22932]" />;
    case "truck":
      return <Truck className="w-6 h-6 text-[#C22932]" />;
    case "palette":
      return <Palette className="w-6 h-6 text-[#C22932]" />;
    case "settings":
      return <Settings className="w-6 h-6 text-[#C22932]" />;
    default:
      return <div className="w-6 h-6 bg-white rounded-sm"></div>;
  }
};

export const ServicesTab = ({ onServiceSelect }: ServicesTabProps) => {
  return (
    <div className="">
      {servicesData.map((service) => (
        <div
          key={service.id}
          className="flex items-center justify-between py-5 px-4 border-b border-[#F2F2F2] hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#F3F4F8] rounded-lg flex items-center justify-center">
              {getServiceIcon(service.icon)}
            </div>
            <h3 className="font-semibold text-[16px]">{service.name}</h3>
          </div>
          <button
            onClick={() => onServiceSelect(service)}
            className="px-4 py-2 bg-white border border-[#F2F2F2] rounded-sm text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Add
          </button>
        </div>
      ))}
    </div>
  );
};
