"use client";
import React, { useMemo, useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef, ICellRendererParams } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import Image from "next/image";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import { useUser } from "@stackframe/stack";
ModuleRegistry.registerModules([AllCommunityModule]);

// Define interfaces for our data structures
interface BrandData {
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

// StatusCell component that handles different statuses
const StatusCell = (params: ICellRendererParams) => {
  const status = params.value as string;
  let bgColor = "bg-green-100";
  let textColor = "text-green-700";

  if (status === "Draft") {
    bgColor = "bg-yellow-100";
    textColor = "text-yellow-700";
  } else if (status === "Archived") {
    bgColor = "bg-gray-100";
    textColor = "text-gray-700";
  }

  return (
    <span className={`${bgColor} ${textColor} px-3 py-1 rounded text-xs font-medium`}>
      {status}
    </span>
  );
};

// Brand image cell renderer
const BrandImageCell = (params: ICellRendererParams) => {
  const [imgError, setImgError] = useState(false);
  
  // Return a simple colored div with initials if image fails to load
  if (imgError) {
    const brandName = params.data?.brandName || "Brand";
    const initials = brandName.split(" ")
      .map((word: string) => word[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
      
    return (
      <div className="flex items-center justify-center h-full w-full">
        <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 text-sm font-medium">
          {initials}
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex items-center justify-center h-full w-full">
      <Image
        src={params.value as string}
        alt="Brand Logo"
        width={40}
        height={40}
        className="rounded-full"
        unoptimized={true} // Bypass domain verification
        onError={() => setImgError(true)}
      />
    </div>
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
  const [tab, setTab] = useState<"all" | "active" | "archived">("all");
  const [brands, setBrands] = useState<BrandData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch brands data when component mounts
  useEffect(() => {
    const fetchBrands = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/brands", {
          headers: {
            "request.user.id": user?.id || "",
          },
        });
        
        if (!res.ok) {
          throw new Error("Failed to fetch brands");
        }
        
        const data = await res.json();
        setBrands(data.data || []);
      } catch (error) {
        console.error("Error fetching brands:", error);
        setError(error instanceof Error ? error.message : "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchBrands();
  }, [user]);

  // Filter brands based on selected tab
  const filteredBrands = useMemo(() => {
    if (tab === "all") return brands;
    return brands.filter((brand) => 
      tab === "active" 
        ? brand.status === "Active" 
        : brand.status === "Archived"
    );
  }, [brands, tab]);

  // Transform API data to match the table structure
  const rowData = useMemo(() => {
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

  const columnDefs = useMemo<ColDef[]>(
    () => [
      {
        headerName: "",
        checkboxSelection: true,
        width: 40,
        pinned: "left",
        headerCheckboxSelection: true,
        suppressMenu: true,
        suppressMovable: true,
        suppressSizeToFit: true,
        resizable: false,
        cellClass: "ag-center-text",
      },
      {
        headerName: "Brand Image",
        field: "brandImage",
        cellRenderer: BrandImageCell,
        flex: 1,
        suppressMenu: true,
        suppressMovable: true,
        resizable: false,
        cellClass: "ag-center-text",
      },
      {
        headerName: "Brand Name",
        field: "brandName",
        cellRenderer: (params: ICellRendererParams) => (
          <span className="font-semibold">{params.value as string}</span>
        ),
        flex: 1,
        cellClass: "ag-center-text",
      },
      {
        headerName: "Proposal Label",
        field: "proposalLabel",
        flex: 1,
        cellClass: "ag-center-text",
      },
      {
        headerName: "Signs",
        field: "signs",
        valueFormatter: (p: { value: number }) => `${p.value} Signs`,
        flex: 1,
        cellClass: "ag-center-text",
      },
      {
        headerName: "Services",
        field: "services",
        valueFormatter: (p: { value: number }) => `${p.value} Services`,
        flex: 1,
        cellClass: "ag-center-text",
      },
      {
        headerName: "Status",
        field: "status",
        cellRenderer: StatusCell,
        flex: 1,
        cellClass: "ag-center-text",
      },
      {
        headerName: "Date Added",
        field: "dateAdded",
        flex: 1,
        cellClass: "ag-center-text",
      },
    ],
    []
  );

  // Custom header style
  const gridOptions = {
    suppressRowClickSelection: true,
    suppressCellSelection: true,
    headerHeight: 48,
    rowHeight: 56,
    getHeaderClass: () => "custom-ag-header",
  };

  return (
    <>
      <style>{`
        .custom-ag-header, .ag-header, .ag-header-cell, .ag-header-row {
          background-color: #f3f4f6 !important; /* Tailwind bg-gray-100 */
          color: #111827 !important;
          font-weight: 600;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
        }
        .ag-header-cell:not(:last-child), .ag-cell:not(:last-child) {
          border-right: 1px solid #d1d5db !important; /* Tailwind border-gray-300 */
        }
        .ag-row-selected, .ag-row-hover {
          background: white !important;
        }
        .ag-center-text {
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          text-align: center !important;
          height: 100%;
        }
        .ag-header-cell-label {
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          width: 100%;
          height: 100%;
          text-align: center !important;
        }
        /* Center checkboxes in header and data cells for the first column */
        .ag-header-cell[col-id=""] .ag-header-cell-label,
        .ag-cell[col-id=""] {
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          height: 100%;
          width: 100%;
        }
        .ag-icon-center {
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          width: 100% !important;
          height: 100% !important;
        }
        .ag-theme-alpine .ag-cell, .ag-theme-alpine .ag-header-cell {
          padding-left: 16px !important;
          padding-right: 16px !important;
        }
        /* Add 12px left margin to the header checkbox wrapper for visual centering */
        .ag-header-select-all .ag-checkbox-input-wrapper {
          margin-left: 12px !important;
        }
      `}</style>
      <div>
        <h1 className="text-2xl font-semibold mb-4 px-4 mt-4">Brands</h1>
        <div className="flex gap-2 px-4">
          <button
            className={`px-4 py-2 font-semibold transition-colors duration-150 ${
              tab === "all"
                ? "bg-black text-white rounded-t-md"
                : "bg-transparent text-black"
            }`}
            style={
              tab === "all" ? {} : { borderBottom: "none", borderRadius: 0 }
            }
            onClick={() => setTab("all")}
          >
            All
          </button>
          <button
            className={`px-4 py-2 font-semibold transition-colors duration-150 ${
              tab === "active"
                ? "bg-black text-white rounded-t-md"
                : "bg-transparent text-black"
            }`}
            style={
              tab === "active" ? {} : { borderBottom: "none", borderRadius: 0 }
            }
            onClick={() => setTab("active")}
          >
            Active
          </button>
          <button
            className={`px-4 py-2 font-semibold transition-colors duration-150 ${
              tab === "archived"
                ? "bg-black text-white rounded-t-md"
                : "bg-transparent text-black"
            }`}
            style={
              tab === "archived"
                ? {}
                : { borderBottom: "none", borderRadius: 0 }
            }
            onClick={() => setTab("archived")}
          >
            Archived
          </button>
        </div>
        <div
          className="ag-theme-alpine"
          style={{ width: "100%", background: "white" }}
        >
          {loading ? (
            <div className="p-4 text-center">Loading brands...</div>
          ) : error ? (
            <div className="p-4 text-center text-red-500">Error: {error}</div>
          ) : (
            <AgGridReact
              rowData={rowData}
              columnDefs={columnDefs}
              domLayout="autoHeight"
              headerHeight={48}
              rowHeight={56}
              rowSelection="multiple"
              gridOptions={gridOptions}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default BrandsPage;