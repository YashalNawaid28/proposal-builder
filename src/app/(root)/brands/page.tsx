"use client";
import { useMemo, useState, useEffect } from "react";
import { useUser } from "@stackframe/stack";
import { PageTabs } from "@/components/ui/page-tabs";

// Define interfaces for our data structures
export interface BrandData {
  id: string;
  user_id: string;
  brand_image: string;
  brand_name: string;
  proposal_label: string;
  signs_count: number;
  services_number: number;
  status: string;
  created_at: string;
}

// Simplified row data structure for the table
interface RowData {
  id: string;
  brandImage: string;
  brandName: string;
  proposalLabel: string;
  signs: number;
  services: number;
  status: string;
  dateAdded: string;
}

// StatusCell component that handles different statuses
const StatusCell = ({ status }: { status: string }) => {
  let bgColor = "bg-[#17B26A1A]";
  let textColor = "text-[#17B26A]";

  if (status === "Draft") {
    bgColor = "bg-yellow-100";
    textColor = "text-yellow-700";
  } else if (status === "Archived") {
    bgColor = "bg-gray-100";
    textColor = "text-gray-700";
  }

  return (
    <span
      className={`${bgColor} ${textColor} h-[24px] font-semibold px-3 py-1 rounded text-[14px]`}
    >
      {status}
    </span>
  );
};

// Brand image cell renderer
const BrandImageCell = ({
  src,
  brandName,
}: {
  src: string;
  brandName: string;
}) => {
  const [imgError, setImgError] = useState(false);

  // Return a simple colored div with initials if image fails to load
  if (imgError || !src) {
    const initials = brandName
      .split(" ")
      .map((word: string) => word[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);

    return (
      <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-200 text-gray-600 text-sm font-medium">
        {initials}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={`${brandName} Logo`}
      className="object-contain"
      onError={() => setImgError(true)}
    />
  );
};

// Format date function
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const BrandsPage = () => {
  const user = useUser();
  const [tab, setTab] = useState<"All" | "Active" | "Archived">("All");
  const [brands, setBrands] = useState<BrandData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  // Fetch brands data when component mounts or user changes
  useEffect(() => {
    const fetchBrands = async () => {
      if (!user) return; // Don't fetch if user is not available
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/brands", {
          headers: { "request.user.id": user.id },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch brands");
        }

        const data = await res.json();
        setBrands(data.data || []);
      } catch (error) {
        console.error("Error fetching brands:", error);
        setError(
          error instanceof Error ? error.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, [user]);

  // Filter brands based on the selected tab
  const filteredBrands = useMemo(() => {
    if (tab === "All") return brands;
    return brands.filter((brand) =>
      tab === "Active"
        ? brand.status === "Active" || brand.status === "Draft" // Assuming 'Active' tab includes 'Drafts'
        : brand.status === "Archived"
    );
  }, [brands, tab]);

  // Transform API data to match the table structure
  const rowData: RowData[] = useMemo(() => {
    return filteredBrands.map((brand) => ({
      id: brand.id,
      brandImage: brand.brand_image,
      brandName: brand.brand_name,
      proposalLabel: brand.proposal_label,
      signs: brand.signs_count,
      services: brand.services_number,
      status: brand.status,
      dateAdded: formatDate(brand.created_at),
    }));
  }, [filteredBrands]);

  // --- Selection Handlers ---
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedRows(rowData.map((row) => row.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleRowSelect = (id: string) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  const isAllSelected =
    rowData.length > 0 && selectedRows.length === rowData.length;

  const renderTable = () => {
    if (loading) {
      return <div className="p-4 text-center">Loading brands...</div>;
    }
    if (error) {
      return <div className="p-4 text-center text-red-500">Error: {error}</div>;
    }
    if (rowData.length === 0) {
      return <div className="p-4 text-center">No brands found.</div>;
    }

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead className="bg-[#F9F9FB] font-semibold">
            <tr className="border-b border-[#DEE1EA] h-[50px] font-semibold text-[14px]">
              <th className="w-16 border-r border-[#DEE1EA]">
                <div className="flex items-center justify-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 border-[#DEE1EA] text-gray-400"
                    onChange={handleSelectAll}
                    checked={isAllSelected}
                  />
                </div>
              </th>
              <th className="p-4 text-left text-[12px] font-semibold border-r border-[#DEE1EA]">
                Brand Image
              </th>
              <th className="p-4 text-left text-[12px] font-semibold min-w-[200px] border-r border-[#DEE1EA] text-base">
                Brand Name
              </th>
              <th className="p-4 text-center text-[12px] font-semibold border-r border-[#DEE1EA]">
                Proposal No. Prefix
              </th>
              <th className="p-4 text-center text-[12px] font-semibold border-r border-[#DEE1EA]">
                Signs
              </th>
              <th className="p-4 text-center text-[12px] font-semibold border-r border-[#DEE1EA]">
                Services
              </th>
              <th className="p-4 text-center text-[12px] font-semibold border-r border-[#DEE1EA]">
                Status
              </th>
              <th className="p-4 text-center text-[12px] font-semibold text-base">
                Date Added
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {rowData.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50 h-20 text-[14px]">
                <td className="p-4 text-center border-r border-[#DEE1EA]">
                  <div className="flex items-center justify-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 border-[#DEE1EA] text-gray-400"
                      checked={selectedRows.includes(row.id)}
                      onChange={() => handleRowSelect(row.id)}
                    />
                  </div>
                </td>
                <td className="border-r border-[#DEE1EA] flex items-center justify-center h-20">
                  <div className="flex items-center justify-center">
                    <BrandImageCell
                      src={row.brandImage}
                      brandName={row.brandName}
                    />
                  </div>
                </td>
                <td className="p-4 font-semibold border-r border-[#DEE1EA] text-[14px]">
                  {row.brandName}
                </td>
                <td className="p-4 border-r text-center border-[#DEE1EA] text-[14px]">
                  {row.proposalLabel}
                </td>
                <td className="p-4 border-r border-[#DEE1EA] text-center text-[14px]">
                  {`${row.signs} Signs`}
                </td>
                <td className="p-4 border-r border-[#DEE1EA] text-center text-[14px]">
                  {`${row.services} Services`}
                </td>
                <td className="p-4 border-r border-[#DEE1EA] text-center">
                  <StatusCell status={row.status} />
                </td>
                <td className="p-4 text-center text-[14px]">{row.dateAdded}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const tabs = ["All", "Active", "Archived"];

  return (
    <div className="bg-white">
      <h1 className="text-2xl font-semibold p-5">Brands</h1>
      <PageTabs
        tabs={tabs}
        activeTab={tab}
        onTabChange={(tab) => setTab(tab as "All" | "Active" | "Archived")}
      />
      <div className="border border-[#DEE1EA] rounded-lg overflow-hidden">
        <div>{renderTable()}</div>
      </div>
    </div>
  );
};

export default BrandsPage;
