"use client";
import React, { useMemo, useState, useEffect } from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef, ICellRendererParams } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import Image from "next/image";
import { useUser } from "@stackframe/stack";
ModuleRegistry.registerModules([AllCommunityModule]);

// Define interfaces for our data structures
interface OptionData {
  id: string;
  sign_id: string;
  option_icon: string;
  option_name: string;
  placeholder: string;
  input_type: string;
  status: string;
  values: string[];
}

interface OptionRowData {
  id: string;
  iconUrl: string;
  name: string;
  placeholder: string;
  type: string;
  status: string;
  values: string[];
}

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

const ValuesCell = (params: ICellRendererParams) => (
  <div className="flex flex-wrap justify-start">
    {(params.value as string[]).map((val: string, idx: number) => (
      <span
        key={idx}
        className="bg-gray-100 px-2 py-1 rounded text-xs font-medium border border-gray-300 mx-1 my-1"
      >
        {val}
      </span>
    ))}
  </div>
);

const IconCell = (params: ICellRendererParams) => {
  const [imgError, setImgError] = useState(false);
  
  // If image failed to load, show initials based on option name
  if (imgError || !params.data.iconUrl) {
    const optionName = params.data.name || "Option";
    const initials = optionName.split(" ")
      .map((word : any) => word[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
      
    return (
      <div className="flex items-center justify-center h-full w-full">
        <div className="w-8 h-8 rounded bg-gray-200 flex items-center justify-center text-gray-600 text-xs font-medium">
          {initials}
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex items-center justify-center h-full w-full">
      <Image
        src={params.data.iconUrl}
        alt={params.data.name + " icon"}
        width={32}
        height={32}
        className="rounded"
        unoptimized={true} // Bypass domain verification
        onError={() => setImgError(true)}
      />
    </div>
  );
};

// Custom header style
const gridOptions = {
  suppressRowClickSelection: true,
  suppressCellSelection: true,
  headerHeight: 48,
  getHeaderClass: () => "custom-ag-header",
};

const OptionsPage = () => {
  const user = useUser();
  const [tab, setTab] = useState<"all" | "active" | "archived">("all");
  const [options, setOptions] = useState<OptionData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch options data when component mounts
  useEffect(() => {
    const fetchOptions = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/options", {
          headers: {
            "request.user.id": user?.id || "",
          },
        });
        
        if (!res.ok) {
          throw new Error("Failed to fetch options");
        }
        
        const data = await res.json();
        setOptions(data.data || []);
      } catch (error) {
        console.error("Error fetching options:", error);
        setError(error instanceof Error ? error.message : "An unknown error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchOptions();
  }, [user]);

  // Filter options based on selected tab
  const filteredOptions = useMemo(() => {
    if (tab === "all") return options;
    return options.filter((option) => 
      tab === "active" 
        ? option.status === "Active" 
        : option.status === "Archived"
    );
  }, [options, tab]);

  // Transform API data to match the table structure
  const rowData = useMemo(() => {
    return filteredOptions.map((option) => ({
      id: option.id,
      iconUrl: option.option_icon,
      name: option.option_name,
      placeholder: option.placeholder,
      type: option.input_type,
      status: option.status,
      values: option.values,
    }));
  }, [filteredOptions]);

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
        headerName: "Options Icon",
        field: "iconUrl",
        width: 60,
        suppressMenu: true,
        suppressMovable: true,
        resizable: false,
        flex: 0.5,
        cellRenderer: IconCell,
        cellClass: "ag-center-text",
      },
      {
        headerName: "Option Name",
        field: "name",
        flex: 1.5,
        cellClass: "ag-center-text font-semibold",
      },
      {
        headerName: "Placeholder",
        field: "placeholder",
        flex: 1.2,
        cellClass: "ag-center-text",
      },
      {
        headerName: "Type",
        field: "type",
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
        headerName: "Values",
        field: "values",
        cellRenderer: ValuesCell,
        flex: 2,
        cellClass: "ag-center-text",
        autoHeight: true, // allow this column to expand vertically
      },
    ],
    []
  );

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
        /* Force padding on all ag-cell elements */
        .ag-theme-alpine .ag-cell, .ag-theme-alpine .ag-header-cell {
          padding-left: 16px !important;
          padding-right: 16px !important;
        }
      `}</style>
      <div>
        <h1 className="text-2xl font-semibold mb-4 px-4 mt-4">Options</h1>
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
            <div className="p-4 text-center">Loading options...</div>
          ) : error ? (
            <div className="p-4 text-center text-red-500">Error: {error}</div>
          ) : (
            <AgGridReact
              rowData={rowData}
              columnDefs={columnDefs}
              domLayout="autoHeight"
              headerHeight={48}
              rowSelection="multiple"
              gridOptions={gridOptions}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default OptionsPage;