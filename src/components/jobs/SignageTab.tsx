"use client";
import { useState, useEffect } from "react";
import { SignOption } from "./AddSignServiceSidebar";

interface SignageTabProps {
  onSignSelect: (sign: SignOption) => void;
}

interface SignData {
  id: string;
  sign_name: string;
  sign_description: string;
  sign_image?: string;
  status: string;
}

export const SignageTab = ({ onSignSelect }: SignageTabProps) => {
  const [signs, setSigns] = useState<SignOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSigns = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch("/api/signs/get-all");
        
        if (!response.ok) {
          throw new Error(`Failed to fetch signs: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (!result.data) {
          throw new Error("No data received from API");
        }

        // Transform the API data to match SignOption interface
        const transformedSigns: SignOption[] = result.data.map((sign: SignData) => ({
          id: sign.id,
          name: sign.sign_name,
          image: sign.sign_image || "/images/dave1.png", // fallback image
          description: sign.sign_description,
        }));

        setSigns(transformedSigns);
      } catch (err) {
        console.error("Error fetching signs:", err);
        setError(err instanceof Error ? err.message : "Failed to fetch signs");
      } finally {
        setLoading(false);
      }
    };

    fetchSigns();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-4">
        {[...Array(6)].map((_, index) => (
          <div
            key={index}
            className="animate-pulse cursor-pointer flex flex-col justify-between group w-full border-b border-r border-[#DEE1EA] p-5 h-[240px]"
          >
            <div className="bg-gray-200 flex-1 rounded-[8px] mb-2"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-40">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  if (signs.length === 0) {
    return (
      <div className="flex items-center justify-center h-40">
        <p className="text-gray-500">No signs available</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2">
      {signs.map((option) => (
        <button
          key={option.id}
          onClick={() => onSignSelect(option)}
          className="cursor-pointer flex flex-col justify-between group w-full border-b border-r border-[#DEE1EA] p-5 h-[240px]"
        >
          <div className="bg-[#F3F4F8] flex-1 rounded-[8px] mb-2">
            <div className="rounded flex h-full items-center justify-center overflow-hidden">
              <img
                src={option.image}
                alt={option.name}
                className="object-cover"
              />
            </div>
          </div>
          <p className="text-[16px] font-semibold text-center">{option.name}</p>
        </button>
      ))}
    </div>
  );
};
