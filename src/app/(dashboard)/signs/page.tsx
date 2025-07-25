"use client";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import {
  ModuleRegistry,
  ClientSideRowModelModule,
  ColDef,
  ICellRendererParams,
  FirstDataRenderedEvent,
} from "ag-grid-community";
import {
  MasterDetailModule,
  ColumnsToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
} from "ag-grid-enterprise";
import { DetailCellRenderer } from "@/components/ui/detailCellRenderer";
import { IAccount } from "@/lib/interfaces";
import { ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";
import type { BrandData } from "../brands/page";

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  MasterDetailModule,
  ColumnsToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
]);

const columnDefs: ColDef<IAccount>[] = [
  {
    headerName: "",
    width: 50,
    suppressMovable: true,
    resizable: false,
    sortable: false,
    headerClass: "ag-center-text",
    cellStyle: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    suppressHeaderMenuButton: true,
    suppressHeaderFilterButton: true,
    menuTabs: [],
    cellRenderer: (params: ICellRendererParams<IAccount, unknown>) => {
      const isExpanded = params.node.expanded;
      return (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <button
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
            }}
            onClick={(e) => {
              e.stopPropagation();
              params.node.setExpanded(!params.node.expanded);
            }}
            aria-label={isExpanded ? "Collapse details" : "Expand details"}
          >
            <span
              style={{
                display: "inline-block",
                transition: "transform 0.2s",
                transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)",
              }}
            >
              <ChevronRight size={20} />
            </span>
          </button>
        </div>
      );
    },
  },
  {
    headerName: "Sign Image",
    field: "signImage",
    cellRenderer: (params: ICellRendererParams<IAccount, string>) => (
      <div
        style={{
          width: "100%",
          height: "100%",
          padding: "0.5rem",
          wordBreak: "break-word",
          whiteSpace: "pre-line",
          fontSize: "14px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img
          src={params.value ?? "/daves-hot-chicken-logo.png"}
          alt="Sign Image"
          style={{
            width: "50px",
            height: "50px",
            borderRadius: "4px",
          }}
        />
      </div>
    ),
    width: 150,
    suppressMovable: true,
    resizable: false,
    headerClass: "ag-header-left-align",
    cellStyle: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    suppressHeaderMenuButton: true,
    suppressHeaderFilterButton: true,
    menuTabs: [],
  },
  {
    headerName: "Sign Name",
    field: "signName",
    cellRenderer: (params: ICellRendererParams<IAccount, string>) => (
      <div
        style={{
          width: "100%",
          height: "100%",
          padding: "0.5rem",
          wordBreak: "break-word",
          whiteSpace: "pre-line",
          fontSize: "14px",
          display: "flex",
          alignItems: "center",
          justifyContent: "start",
        }}
      >
        <span className="font-semibold">{params.value ?? ""}</span>
      </div>
    ),
    flex: 1,
    headerClass: "ag-header-left-align",
    cellStyle: {
      display: "flex",
      alignItems: "center",
      justifyContent: "start",
    },
    suppressHeaderMenuButton: true,
    suppressHeaderFilterButton: true,
    menuTabs: [],
  },
  {
    headerName: "Sign Description",
    field: "signDescription",
    flex: 3,
    cellClass: "ag-sign-description-cell ag-center-text",
    headerClass: "ag-header-left-align",
    suppressHeaderMenuButton: true,
    suppressHeaderFilterButton: true,
    menuTabs: [],
    cellRenderer: (params: ICellRendererParams<IAccount, string>) => (
      <div
        style={{
          width: "100%",
          height: "100%",
          padding: "0.5rem",
          wordBreak: "break-word",
          whiteSpace: "pre-line",
          fontSize: "14px",
          display: "flex",
          alignItems: "center",
          justifyContent: "start",
        }}
      >
        {params.value ?? ""}
      </div>
    ),
  },
  {
    headerName: "Status",
    field: "status",
    cellRenderer: (params: ICellRendererParams<IAccount, string>) => (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "14px",
        }}
      >
        <span className="bg-green-50 font-semibold text-green-600 px-3 py-1 rounded text-[14px]">
          {params.value ?? ""}
        </span>
      </div>
    ),
    flex: 0.75,
    headerClass: "ag-center-text",
    cellStyle: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    suppressHeaderMenuButton: true,
    suppressHeaderFilterButton: true,
    menuTabs: [],
  },
  {
    headerName: "Date Added",
    field: "dateAdded",
    flex: 0.75,
    headerClass: "ag-center-text",
    cellStyle: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    suppressHeaderMenuButton: true,
    suppressHeaderFilterButton: true,
    menuTabs: [],
    cellRenderer: (params: ICellRendererParams<IAccount, string>) => (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "14px",
        }}
      >
        {params.value ?? ""}
      </div>
    ),
  },
];

const SignsPage = () => {
  const [tab, setTab] = useState("Dave's Hot Chicken");
  const [brands, setBrands] = useState<string[]>(["Dave's Hot Chicken"]);
  const [signData, setSignData] = useState<IAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSigns = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/signs");

        if (!response.ok) {
          throw new Error(`API request failed with status: ${response.status}`);
        }

        const responseData = await response.json();

        // Check if data property exists in the response
        if (!responseData.data || !Array.isArray(responseData.data)) {
          throw new Error("Invalid API response format");
        }

        // Extract only brand names from the data
        const brandNames = responseData.data.map(
          (brand: BrandData) => brand.brand_name
        );
        if (brandNames.length > 0) {
          setBrands(brandNames);
          // Keep current tab if it exists in the new data, otherwise switch to first brand
          if (!brandNames.includes(tab)) {
            setTab(brandNames[0]);
          }
        }

        // Find the selected brand
        const selectedBrand = responseData.data.find(
          (brand: BrandData) => brand.brand_name === tab
        );

        if (!selectedBrand || !selectedBrand.signs) {
          setSignData([]);
          return;
        }

        // Define types for sign and pricing if not already imported
        type SignPricing = {
          size?: string;
          sign_price?: number;
          install_price?: number;
          sign_budget?: number;
          install_budget?: number;
          raceway?: number;
        };
        type SignOptionRaw = {
          option_name?: string;
          input_type?: string;
        };
        type SignRaw = {
          sign_image?: string;
          sign_name?: string;
          sign_description?: string;
          status?: string;
          created_at: string;
          sign_pricing?: SignPricing[];
          options?: SignOptionRaw[];
        };

        // Transform API data to match the expected format
        const transformedData = (selectedBrand.signs as SignRaw[]).map(
          (sign) => {
            // Format date to match expected format (e.g., "Aug 1st, 2025")
            const createdDate = new Date(sign.created_at);
            const formattedDate = createdDate.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            });

            // Transform sign_pricing to match the expected details format
            const details =
              sign.sign_pricing && Array.isArray(sign.sign_pricing)
                ? sign.sign_pricing.map((pricing) => ({
                    size: pricing.size || "",
                    signPrice: pricing.sign_price
                      ? `$${pricing.sign_price.toLocaleString()}`
                      : "$0.00",
                    installPrice: pricing.install_price
                      ? `$${pricing.install_price.toLocaleString()}`
                      : "$0.00",
                    signBudget: pricing.sign_budget
                      ? `$${pricing.sign_budget.toLocaleString()}`
                      : "$0.00",
                    installBudget: pricing.install_budget
                      ? `$${pricing.install_budget.toLocaleString()}`
                      : "$0.00",
                    raceway: pricing.raceway
                      ? `$${pricing.raceway.toLocaleString()}`
                      : "$0.00",
                  }))
                : [];

            // Extract just the option_name and input_type from each option
            const signOptions =
              sign.options && Array.isArray(sign.options)
                ? sign.options.map((option) => ({
                    label: option.option_name || "",
                    type:
                      (option.input_type as "Dropdown" | "User Input") ||
                      "Dropdown",
                    checked: true, // Assuming all options are checked by default
                  }))
                : [];

            return {
              signImage: sign.sign_image || "/daves-hot-chicken-logo.png",
              signName: sign.sign_name || "Unnamed Sign",
              signDescription: sign.sign_description || "",
              status: (sign.status as "Active" | "Inactive") || "Active",
              dateAdded: formattedDate,
              signOptions: signOptions,
              details: details,
            };
          }
        );

        setSignData(transformedData);
        setError(null);
      } catch (err) {
        console.error("Error fetching signs:", err);
        setError("Failed to load sign data. Please try again later.");
        setSignData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSigns();
  }, [tab]); // Refetch data when tab changes

  const gridOptions = {
    masterDetail: true,
    detailCellRenderer: DetailCellRenderer,
    detailRowHeight: 450,
    detailRowAutoHeight: false,
    detailCellRendererParams: {
      suppressCount: true,
      template: '<div class="ag-details-row ag-details-grid"></div>',
    },
    columnDefs,
    defaultColDef: {
      sortable: true,
      resizable: false, // Disable resizing
      suppressMovable: true, // Disable reordering
    },
    embedFullWidthRows: true,
    suppressColumnVirtualisation: true,
    animateRows: true,
    onFirstDataRendered: (params: FirstDataRenderedEvent<IAccount>) => {
      // params.api.sizeColumnsToFit(); // Removed to disable auto column width adjustment
      if (params.api.getDisplayedRowCount() > 0) {
        params.api.getDisplayedRowAtIndex(0)?.setExpanded(true);
      }
    },
    onRowClicked: () => {},
    getRowStyle: () => ({ backgroundColor: "#F9F9FB" }),
    getRowClass: () => "custom-row-background",
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
        .ag-theme-alpine .ag-center-text {
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          text-align: center !important;
          width: 100%;
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
        <h1 className="text-2xl font-semibold mb-4 px-4 mt-4">Signs</h1>
        <div className="flex gap-2 px-4">
          {brands.map((brand) => (
            <button
              key={brand}
              className={`px-4 py-2 font-semibold transition-colors duration-150 ${
                tab === brand
                  ? "bg-black text-white rounded-t-md"
                  : "bg-transparent text-black"
              }`}
              style={
                tab === brand ? {} : { borderBottom: "none", borderRadius: 0 }
              }
              onClick={() => setTab(brand)}
            >
              {brand}
            </button>
          ))}
        </div>
        <div
          className="ag-theme-alpine"
          style={{ width: "100%", background: "white" }}
        >
          {loading ? (
            <div className="flex justify-center items-center p-8">
              <div className="animate-pulse">Loading sign data...</div>
            </div>
          ) : error ? (
            <div className="text-red-500 p-8 text-center">{error}</div>
          ) : (
            <AgGridReact
              rowData={signData}
              gridOptions={gridOptions}
              domLayout="autoHeight"
              headerHeight={48}
              rowHeight={56}
              rowSelection="single"
            />
          )}
        </div>
      </div>
    </>
  );
};

export default SignsPage;
