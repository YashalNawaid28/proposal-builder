"use client";
import { useState, useEffect } from "react";
import { ServiceOption } from "./AddSignServiceSidebar";
import { Clipboard, X, Package, Truck, Palette, Settings, Image } from "lucide-react";

interface ServicesTabProps {
  onServiceSelect: (service: ServiceOption) => void;
  brandId?: string; // Add brandId prop to filter services by brand
}

// Database service interface
interface DatabaseService {
  id: string;
  brand_id: string;
  service_image: string | null;
  service_name: string;
  service_description: string | null;
}

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

export const ServicesTab = ({ onServiceSelect, brandId }: ServicesTabProps) => {
  const [services, setServices] = useState<ServiceOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        setError(null);

        const url = brandId 
          ? `/api/services?brand_id=${encodeURIComponent(brandId)}`
          : '/api/services';
        
        const response = await fetch(url);
        
        if (!response.ok) {
          throw new Error('Failed to fetch services');
        }

        const result = await response.json();
        
        if (!result.data) {
          throw new Error('Invalid response format');
        }

        // Transform database services to ServiceOption format
        const transformedServices: ServiceOption[] = result.data.map((service: DatabaseService) => ({
          id: service.id,
          name: service.service_name,
          icon: service.service_image || "default", // Use service_image or default icon
          description: service.service_description || "",
        }));

        setServices(transformedServices);
      } catch (err) {
        console.error('Error fetching services:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch services');
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [brandId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
        <span className="ml-2 text-sm text-gray-600">Loading services...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <p className="text-red-500 text-sm mb-2">Error loading services</p>
          <p className="text-gray-600 text-xs">{error}</p>
        </div>
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="text-center">
          <p className="text-gray-500 text-sm">No services available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="">
      {services.map((service) => (
        <div
          key={service.id}
          className="flex items-center justify-between py-5 px-4 border-b border-[#F2F2F2] hover:bg-gray-50 transition-colors"
        >
                      <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#F3F4F8] rounded-lg flex items-center justify-center">
                {service.icon && service.icon !== "default" && service.icon.startsWith("http") ? (
                  <img 
                    src={service.icon} 
                    alt={service.name}
                    className="w-6 h-6 object-contain"
                  />
                ) : (
                  getServiceIcon(service.icon)
                )}
              </div>
            <div className="flex flex-col">
              <h3 className="font-semibold text-[16px]">{service.name}</h3>
              {service.description && (
                <p className="text-sm text-gray-500 mt-1">{service.description}</p>
              )}
            </div>
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
