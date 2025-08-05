"use client";
import { useState, useEffect, Fragment, useRef, useMemo } from "react";
import {
  ChevronRight,
  Asterisk,
  Rows3,
  TextCursorInput,
  ImagePlus,
} from "lucide-react";
import type { BrandData } from "../brands/page";
import { IAccount, ISignDetail, ISignOption } from "@/lib/interfaces";
import { PageTabs } from "@/components/ui/page-tabs";
import { AgGridReact } from "ag-grid-react";
import {
  ColDef,
  ValueFormatterParams,
  ValueParserParams,
  GetRowIdParams,
  RowClassParams,
  ClientSideRowModelModule,
  NumberEditorModule,
  TextEditorModule,
  ValidationModule,
  ModuleRegistry,
} from "ag-grid-community";
import { CellSelectionModule } from "ag-grid-enterprise";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-quartz.css";
import { LicenseManager } from "ag-grid-enterprise";

ModuleRegistry.registerModules([
  NumberEditorModule,
  TextEditorModule,
  ClientSideRowModelModule,
  CellSelectionModule,
  ...(process.env.NODE_ENV !== "production" ? [ValidationModule] : []),
]);

LicenseManager.setLicenseKey(
  "[TRIAL]_this_{AG_Charts_and_AG_Grid}_Enterprise_key_{AG-090575}_is_granted_for_evaluation_only___Use_in_production_is_not_permitted___Please_report_misuse_to_legal@ag-grid.com___For_help_with_purchasing_a_production_key_please_contact_info@ag-grid.com___You_are_granted_a_{Single_Application}_Developer_License_for_one_application_only___All_Front-End_JavaScript_developers_working_on_the_application_would_need_to_be_licensed___This_key_will_deactivate_on_{14 August 2025}____[v3]_[0102]_MTc1NTEyNjAwMDAwMA==2bf724e243e12a2673a0da27840ab6db"
);

const formatCurrency = (value: string | number | undefined | null) => {
  if (value === null || value === undefined || isNaN(Number(value)))
    return "$0.00";
  const num =
    typeof value === "string"
      ? parseFloat(value.replace(/[^0-9.-]+/g, ""))
      : value;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(num);
};

const optionIcons: { [key: string]: React.ReactNode } = {
  default: <Asterisk size={30} />,
  "Sign Budget": <Asterisk size={25} />,
  "Install Budget": <Asterisk size={25} />,
  Raceway: <Rows3 size={25} />,
  "Raceway Size": <TextCursorInput size={25} />,
  Color: <Rows3 size={20} />,
  "Fabrication Type": <Rows3 size={20} />,
};

interface PricingDetail {
  id?: string;
  size: string;
  signPrice: number;
  installPrice: number;
  signBudget: number;
  installBudget: number;
  raceway: number;
  signBudgetMultiplier?: number;
  installBudgetMultiplier?: number;
}

const PricingGrid = ({ rowData }: { rowData: ISignDetail[] }) => {
  console.log("PricingGrid received data:", rowData); // Debug log

  // Grid API reference - must be before any early returns
  const gridRef = useRef<AgGridReact>(null);
  const [localGridData, setLocalGridData] = useState<any[]>([]);

  // Convert ISignDetail[] to PricingDetail[] for AG Grid
  const convertedGridData = useMemo(() => {
    if (!rowData || rowData.length === 0) return [];
    
    return rowData.map((item) => {
      // Extract multipliers from the original data
      const signBudgetMultiplier = (item as any).signBudgetMultiplier || 0.55;
      const installBudgetMultiplier = (item as any).installBudgetMultiplier || 0.55;
      
      return {
        id: item.id, // Include the pricing ID for updates
        size: item.size,
        signPrice: parseFloat(item.signPrice.replace(/[^0-9.-]+/g, "")) || 0,
        installPrice: parseFloat(item.installPrice.replace(/[^0-9.-]+/g, "")) || 0,
        signBudget: parseFloat(item.signBudget.replace(/[^0-9.-]+/g, "")) || 0,
        installBudget:
          parseFloat(item.installBudget.replace(/[^0-9.-]+/g, "")) || 0,
        raceway: parseFloat(item.raceway.replace(/[^0-9.-]+/g, "")) || 0,
        signBudgetMultiplier,
        installBudgetMultiplier,
      };
    });
  }, [rowData]);

  // Update local grid data when convertedGridData changes
  useEffect(() => {
    if (convertedGridData.length === 0) {
      setLocalGridData([]);
      return;
    }
    
    // Sort the data by size in ascending order
    const sortedData = [...convertedGridData].sort((a, b) => {
      // Extract numeric part from size strings (e.g., "12″" -> 12)
      const aSize = parseInt(a.size.replace(/[^0-9]/g, '')) || 0;
      const bSize = parseInt(b.size.replace(/[^0-9]/g, '')) || 0;
      return aSize - bSize;
    });
    setLocalGridData(sortedData);
  }, [convertedGridData]);

  if (!rowData || rowData.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        No pricing data available
      </div>
    );
  }

  console.log("Converted grid data:", convertedGridData);

  // Column Definitions for AG-Grid
  const colDefs: ColDef[] = [
    {
      field: "size",
      headerName: "Size",
      width: 150,
      minWidth: 120,
      editable: false, // Make size column non-editable
      cellClass: "font-medium text-center",
      headerClass: "text-center",
    },
    {
      field: "signPrice",
      headerName: "Sign Price",
      flex: 1,
      minWidth: 120,
      valueFormatter: (p: ValueFormatterParams) => formatCurrency(p.value),
      valueParser: (p: ValueParserParams) =>
        Number(String(p.newValue).replace(/[^0-9.-]+/g, "")),
      cellClass: "text-center",
      headerClass: "text-center",
    },
    {
      field: "installPrice",
      headerName: "Install Price",
      flex: 1,
      minWidth: 120,
      valueFormatter: (p: ValueFormatterParams) => formatCurrency(p.value),
      valueParser: (p: ValueParserParams) =>
        Number(String(p.newValue).replace(/[^0-9.-]+/g, "")),
      cellClass: "text-center",
      headerClass: "text-center",
    },
    {
      field: "signBudget",
      headerName: "Sign Budget",
      flex: 1,
      minWidth: 120,
      valueFormatter: (p: ValueFormatterParams) => formatCurrency(p.value),
      editable: false, // Make it read-only
      cellClass: "text-center",
      headerClass: "text-center",
    },
    {
      field: "installBudget",
      headerName: "Install Budget",
      flex: 1,
      minWidth: 120,
      valueFormatter: (p: ValueFormatterParams) => formatCurrency(p.value),
      editable: false, // Make it read-only
      cellClass: "text-center",
      headerClass: "text-center",
    },
    {
      field: "raceway",
      headerName: "Raceway",
      flex: 1,
      minWidth: 120,
      valueFormatter: (p: ValueFormatterParams) => formatCurrency(p.value),
      valueParser: (p: ValueParserParams) =>
        Number(String(p.newValue).replace(/[^0-9.-]+/g, "")),
      cellClass: "text-center",
      headerClass: "text-center",
    },
  ];

  // FIX 1: The problematic `cellStyle` is removed.
  const defaultColDef: ColDef = {
    sortable: false,
    filter: false,
    resizable: true,
    suppressMovable: true,
    editable: true,
    cellClass: (params) => {
      return "ag-cell-custom";
    },
  };

  console.log('Grid data for editing:', localGridData); // Debug log

  return (
    <div className="ag-theme-quartz h-full w-full flex-1">
      <AgGridReact
        ref={gridRef}
        rowData={localGridData}
        columnDefs={colDefs}
        defaultColDef={defaultColDef}
        rowHeight={60}
        headerHeight={50}
        domLayout="autoHeight"
        getRowId={(params: GetRowIdParams) => params.data.size}
        enableRangeSelection={true}
        enableFillHandle={true}

        getRowClass={(params) => {
          return "ag-row-custom";
        }}
        onGridReady={(params) => {
          params.api.sizeColumnsToFit();
        }}
        onCellClicked={(event) => {
          console.log('Cell clicked:', event); // Debug log
        }}
        onRangeSelectionChanged={(event) => {
          // Force update of cell borders when selection changes
          setTimeout(() => {
            const selectedCells = document.querySelectorAll(
              ".ag-cell-range-selected"
            );
            selectedCells.forEach((cell) => {
              if (cell instanceof HTMLElement) {
                cell.style.borderRight = "1px solid #dee1ea";
                if (cell.classList.contains("ag-cell-last-column")) {
                  cell.style.borderRight = "2px solid #007bff";
                }
              }
            });
          }, 0);
        }}
        onCellValueChanged={(event) => {
          console.log('Cell value changed event:', event); // Debug log
          
          // Handle cell value changes and save to database
          const { data, colDef, newValue } = event;
          console.log('Data:', data, 'Field:', colDef.field, 'New Value:', newValue); // Debug log
          
          if (!data.id) {
            console.error('No pricing ID found for update');
            return;
          }

          const field = colDef.field;
          if (!field) {
            console.error('No field found in column definition');
            return;
          }

          // Map field names to database column names
          const fieldMapping: { [key: string]: string } = {
            signPrice: 'sign_price',
            installPrice: 'install_price',
            raceway: 'raceway'
          };

          const dbField = fieldMapping[field];
          if (!dbField) {
            console.error('Unknown field for update:', field);
            return;
          }

          console.log('Updating field:', field, 'to database field:', dbField, 'with value:', newValue); // Debug log

          // Prepare update data
          const updateData: any = { id: data.id };
          updateData[dbField] = newValue;

          // If price fields are updated, also update the calculated budgets
          if (field === 'signPrice' || field === 'installPrice') {
            const signBudgetMultiplier = data.signBudgetMultiplier || 0.55;
            const installBudgetMultiplier = data.installBudgetMultiplier || 0.55;
            
            if (field === 'signPrice') {
              const newSignBudget = newValue * signBudgetMultiplier;
              updateData.sign_budget = newSignBudget;
              console.log('Calculated new sign budget:', newSignBudget);
            }
            
            if (field === 'installPrice') {
              const newInstallBudget = newValue * installBudgetMultiplier;
              updateData.install_budget = newInstallBudget;
              console.log('Calculated new install budget:', newInstallBudget);
            }
          }

          console.log('Sending update data:', updateData); // Debug log

          // Save to database
          fetch('/api/sign-pricing/update', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(updateData),
          })
          .then(response => {
            console.log('Response status:', response.status); // Debug log
            if (!response.ok) {
              throw new Error('Failed to update pricing data');
            }
            return response.json();
          })
          .then(result => {
            console.log('Pricing data updated successfully:', result);
            
            // Update the local grid data to reflect the new values
            setLocalGridData(prevData => {
              return prevData.map(row => {
                if (row.size === data.size) {
                  const updatedRow = { ...row };
                  
                  if (field === 'signPrice') {
                    const newSignBudget = newValue * (data.signBudgetMultiplier || 0.55);
                    updatedRow.signBudget = newSignBudget;
                    console.log('Updated sign budget in grid:', newSignBudget);
                  }
                  
                  if (field === 'installPrice') {
                    const newInstallBudget = newValue * (data.installBudgetMultiplier || 0.55);
                    updatedRow.installBudget = newInstallBudget;
                    console.log('Updated install budget in grid:', newInstallBudget);
                  }
                  
                  return updatedRow;
                }
                return row;
              });
            });
          })
          .catch(error => {
            console.error('Error updating pricing data:', error);
            // Optionally revert the cell value or show an error message
          });
        }}
      />
    </div>
  );
};

const SignsPage = () => {
  const [tab, setTab] = useState("Dave's Hot Chicken");
  const [brands, setBrands] = useState<string[]>(["Dave's Hot Chicken"]);
  const [signData, setSignData] = useState<IAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [toggleStates, setToggleStates] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [editableValues, setEditableValues] = useState<{
    [key: string]: string;
  }>({});

  const getToggleState = (
    signName: string,
    optionLabel: string,
    defaultChecked: boolean
  ) => {
    const key = `${signName}-${optionLabel}`;
    return toggleStates[key] ?? defaultChecked;
  };

  useEffect(() => {
    const fetchSigns = async () => {
      try {
        setLoading(true);
        setError(null);

        // Add timeout for fetch request
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout

        const response = await fetch("/api/signs", {
          signal: controller.signal,
        });

        clearTimeout(timeoutId);
        if (!response.ok) {
          throw new Error(`API request failed with status: ${response.status}`);
        }
        const responseData = await response.json();
        if (!responseData.data || !Array.isArray(responseData.data)) {
          throw new Error("Invalid API response format");
        }
        const brandNames = responseData.data.map(
          (brand: BrandData) => brand.brand_name
        );
        if (brandNames.length > 0) {
          setBrands(brandNames);
          if (!brandNames.includes(tab)) {
            setTab(brandNames[0]);
          }
        }
        const selectedBrand = responseData.data.find(
          (brand: BrandData) => brand.brand_name === tab
        );
        if (!selectedBrand?.signs) {
          setSignData([]);
          return;
        }
        type SignRaw = {
          id: string;
          sign_image?: string;
          sign_name?: string;
          sign_description?: string;
          status?: string;
          created_at: string;
          sign_budget_multiplier?: number;
          install_budget_multiplier?: number;
          sign_pricing?: {
            size?: string;
            sign_price?: number;
            install_price?: number;
            sign_budget?: number;
            install_budget?: number;
            raceway?: number;
          }[];
          options?: { option_name?: string; input_type?: string }[];
        };
        const transformedData = (selectedBrand.signs as SignRaw[]).map(
          (sign) => {
            const createdDate = new Date(sign.created_at);
            const day = createdDate.getDate();
            const suffix =
              ["th", "st", "nd", "rd"][((day % 100) - 20) % 10] ||
              ["th", "st", "nd", "rd"][day % 10] ||
              "th";
            const formattedDate = `${createdDate.toLocaleDateString("en-US", {
              month: "short",
            })} ${day}${suffix}, ${createdDate.getFullYear()}`;

            // Get multipliers from sign data (default to 0.55 if not available)
            const signBudgetMultiplier = sign.sign_budget_multiplier || 0.55;
            const installBudgetMultiplier = sign.install_budget_multiplier || 0.55;

            // Use pricing data that's already included in the sign object
            const details = (sign.sign_pricing || []).map((pricing: any) => {
              // Calculate budgets based on multipliers
              const calculatedSignBudget = (pricing.sign_price || 0) * signBudgetMultiplier;
              const calculatedInstallBudget = (pricing.install_price || 0) * installBudgetMultiplier;
              
              return {
                id: pricing.id, // Include the pricing ID for updates
                size: pricing.size || "",
                signPrice: pricing.sign_price || 0,
                installPrice: pricing.install_price || 0,
                signBudget: calculatedSignBudget,
                installBudget: calculatedInstallBudget,
                raceway: pricing.raceway || 0,
                signBudgetMultiplier, // Include multipliers for future calculations
                installBudgetMultiplier,
              };
            });

            const signDetails: ISignDetail[] = details.map((d) => ({
              id: d.id, // Include the pricing ID
              size: d.size,
              signPrice: formatCurrency(d.signPrice),
              installPrice: formatCurrency(d.installPrice),
              signBudget: formatCurrency(d.signBudget),
              installBudget: formatCurrency(d.installBudget),
              raceway: formatCurrency(d.raceway),
              signBudgetMultiplier: d.signBudgetMultiplier,
              installBudgetMultiplier: d.installBudgetMultiplier,
            }));

            const signOptions: ISignOption[] = [
              {
                label: "Sign Budget",
                type: "Multiplier",
                value: "0.55",
                checked: true,
              },
              {
                label: "Install Budget",
                type: "Calculation",
                value: "0.55",
                checked: true,
              },
              { label: "Raceway", type: "Dropdown", checked: true },
              { label: "Raceway Size", type: "User Input", checked: true },
              { label: "Color", type: "Dropdown", checked: true },
              { label: "Fabrication Type", type: "Dropdown", checked: true },
            ];

            return {
              signId: sign.id, // Include the sign ID for multiplier updates
              signImage: sign.sign_image || "",
              signName: sign.sign_name || "Unnamed Sign",
              signDescription: sign.sign_description || "",
              status: (sign.status as "Active" | "Inactive") || "Active",
              dateAdded: formattedDate,
              signOptions: signOptions,
              details: signDetails,
            };
          }
        );
        setSignData(transformedData);
        setExpandedRow(null);
        setError(null);
      } catch (err) {
        console.error("Error fetching signs:", err);
        if (err instanceof Error && err.name === "AbortError") {
          setError("Request timed out. Please try again.");
        } else {
          setError("Failed to load sign data. Please try again later.");
        }
        setSignData([]);
      } finally {
        setLoading(false);
      }
    };
    fetchSigns();
  }, [tab]);

  const handleRowToggle = (signName: string) => {
    setExpandedRow(expandedRow === signName ? null : signName);
  };

  const handleOptionToggle = (optionKey: string) => {
    setToggleStates((prev) => ({ ...prev, [optionKey]: !prev[optionKey] }));
  };

  const handleValueChange = (
    signName: string,
    optionLabel: string,
    newValue: string
  ) => {
    const key = `${signName}-${optionLabel}`;
    setEditableValues((prev) => ({ ...prev, [key]: newValue }));
  };

  const handleMultiplierSave = async (
    signName: string,
    optionLabel: string,
    newValue: string
  ) => {
    // Handle multiplier updates only when Enter is pressed
    if (optionLabel === "Sign Budget" || optionLabel === "Install Budget") {
      const sign = signData.find(s => s.signName === signName);
      if (!sign?.signId) {
        console.error('Sign ID not found for multiplier update');
        return;
      }

      try {
        const multiplierValue = parseFloat(newValue) || 0.55;
        const updateData: any = { sign_id: sign.signId };

        if (optionLabel === "Sign Budget") {
          updateData.sign_budget_multiplier = multiplierValue;
        } else if (optionLabel === "Install Budget") {
          updateData.install_budget_multiplier = multiplierValue;
        }

        // Update the sign multipliers in the database
        const response = await fetch('/api/signs/update-multipliers', {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updateData),
        });

        if (!response.ok) {
          throw new Error('Failed to update multipliers');
        }

        console.log('Multipliers updated successfully');

        // Update all pricing data for this sign with new multipliers
        const updatedSignData = signData.map(s => {
          if (s.signName === signName) {
            const updatedDetails = s.details.map(detail => {
              const signPrice = parseFloat(detail.signPrice.replace(/[^0-9.-]+/g, "")) || 0;
              const installPrice = parseFloat(detail.installPrice.replace(/[^0-9.-]+/g, "")) || 0;
              
              let newSignBudget = parseFloat(detail.signBudget.replace(/[^0-9.-]+/g, "")) || 0;
              let newInstallBudget = parseFloat(detail.installBudget.replace(/[^0-9.-]+/g, "")) || 0;

              if (optionLabel === "Sign Budget") {
                newSignBudget = signPrice * multiplierValue;
              } else if (optionLabel === "Install Budget") {
                newInstallBudget = installPrice * multiplierValue;
              }

              return {
                ...detail,
                signBudget: formatCurrency(newSignBudget),
                installBudget: formatCurrency(newInstallBudget),
              };
            });

            return {
              ...s,
              details: updatedDetails,
            };
          }
          return s;
        });

        setSignData(updatedSignData);

        // Update all pricing records in the database
        const updatedSign = updatedSignData.find(s => s.signName === signName);
        if (updatedSign) {
          for (const detail of updatedSign.details) {
            if (detail.id) {
              const pricingUpdateData: any = { id: detail.id };
              
              if (optionLabel === "Sign Budget") {
                const newSignBudget = parseFloat(detail.signBudget.replace(/[^0-9.-]+/g, "")) || 0;
                pricingUpdateData.sign_budget = newSignBudget;
              } else if (optionLabel === "Install Budget") {
                const newInstallBudget = parseFloat(detail.installBudget.replace(/[^0-9.-]+/g, "")) || 0;
                pricingUpdateData.install_budget = newInstallBudget;
              }

              await fetch('/api/sign-pricing/update', {
                method: 'PUT',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(pricingUpdateData),
              });
            }
          }
        }

      } catch (error) {
        console.error('Error updating multipliers:', error);
      }
    }
  };

  return (
    <div className="bg-white">
      <h1 className="text-2xl font-bold p-5">Signs</h1>
      <PageTabs tabs={brands} activeTab={tab} onTabChange={setTab} />
      <div className="border border-[#DEE1EA] overflow-hidden">
        {(() => {
          if (loading)
            return <div className="p-8 text-center">Loading sign data...</div>;
          if (error)
            return <div className="p-8 text-center text-red-500">{error}</div>;
          return (
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead className="bg-[#F9F9FB] text-xs font-semibold">
                  <tr className="border-b border-[#DEE1EA] h-[50px]">
                    <th className="w-16 border-r border-[#DEE1EA]">
                      <input
                        type="checkbox"
                        className="h-4 w-4 mt-1 border-[#DEE1EA]"
                      />
                    </th>
                    <th className="p-4 text-left font-semibold w-52 border-r border-[#DEE1EA] text-xs">
                      Sign Image
                    </th>
                    <th className="p-4 text-left font-semibold min-w-[200px] border-r border-[#DEE1EA] text-xs">
                      Sign Name
                    </th>
                    <th className="p-4 text-left font-semibold min-w-[350px] border-r border-[#DEE1EA] text-xs">
                      Sign Description
                    </th>
                    <th className="p-4 text-center font-semibold w-64 border-r border-[#DEE1EA] text-xs">
                      Status
                    </th>
                    <th className="p-4 text-center font-semibold w-64 text-xs">
                      Date Added
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {signData.map((sign) => (
                    <Fragment key={sign.signName}>
                      {/* Main Row */}
                      <tr className="hover:bg-gray-50 h-20">
                        <td className="p-4 text-center border-r border-[#DEE1EA]">
                          <button
                            onClick={() => handleRowToggle(sign.signName)}
                          >
                            <ChevronRight
                              size={20}
                              className={`transition-transform duration-200 ${
                                expandedRow === sign.signName
                                  ? "rotate-90"
                                  : "rotate-0"
                              }`}
                            />
                          </button>
                        </td>
                        <td className="border-r border-[#DEE1EA] flex items-center justify-center h-20">
                          {sign.signImage &&
                          sign.signImage !== "" &&
                          sign.signImage !== "/daves-hot-chicken-logo.png" ? (
                            <img
                              src={sign.signImage}
                              alt=""
                              className="object-contain w-[80%] h-[80%] max-h-16 max-w-[120px] mx-auto"
                            />
                          ) : (
                            <ImagePlus size={40} className="text-[#60646C]" />
                          )}
                        </td>
                        <td className="p-4 font-semibold border-r border-[#DEE1EA] text-[14px]">
                          {sign.signName}
                        </td>
                        <td className="p-4 border-r border-[#DEE1EA] text-[12px]">
                          {sign.signDescription}
                        </td>
                        <td className="p-4 border-r border-[#DEE1EA] text-center">
                          <span className="bg-[#17B26A1A] text-[#17B26A] h-[24px] font-semibold px-3 py-1 rounded text-[14px]">
                            {sign.status}
                          </span>
                        </td>
                        <td className="p-4 text-center text-[14px]">
                          {sign.dateAdded}
                        </td>
                      </tr>

                      {/* Expanded Detail Row */}
                      {expandedRow === sign.signName && (
                        <tr className="bg-white">
                          <td colSpan={7} className="p-0">
                            <div className="flex bg-[#F9F9FB]">
                              {/* Left Side: AG-Grid Pricing Table */}
                              <div className="flex-1 border-r border-[#DEE1EA] min-w-0 w-full">
                                <PricingGrid rowData={sign.details} />
                              </div>

                              {/* Right Side: Sign Options (Unchanged) */}
                              <div className="w-[320px] flex-shrink-0">
                                <table className="min-w-full text-sm border-collapse">
                                  <thead>
                                    <tr className="border-b text-[13px] border-[#DEE1EA] h-[45px]">
                                      <th className="p-4 text-left font-semibold text-black text-[13px]">
                                        Sign Options
                                      </th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {sign.signOptions.map((option, index) => (
                                      <tr
                                        key={index}
                                        className="h-[106px] text-[14px] border-b border-[#DEE1EA]"
                                      >
                                        <td className="p-4 font-medium">
                                          <div className="flex gap-2 items-center">
                                            <section>
                                              {optionIcons[option.label] ||
                                                optionIcons.default}
                                            </section>
                                            <section className="flex-1 ml-3 text-left">
                                              <p className="font-semibold text-[16px]">
                                                {option.label}
                                              </p>
                                              <p className="text-[14px] font-[400]">
                                                {option.type}
                                              </p>
                                            </section>
                                            <section className="flex items-center justify-center gap-2">
                                              {option.value ? (
                                                option.label ===
                                                  "Sign Budget" ||
                                                option.label ===
                                                  "Install Budget" ? (
                                                  <input
                                                    type="text"
                                                    value={
                                                      editableValues[
                                                        `${sign.signName}-${option.label}`
                                                      ] || option.value
                                                    }
                                                    onChange={(e) =>
                                                      handleValueChange(
                                                        sign.signName,
                                                        option.label,
                                                        e.target.value
                                                      )
                                                    }
                                                    onKeyDown={(e) => {
                                                      if (e.key === 'Enter') {
                                                        const currentValue = editableValues[
                                                          `${sign.signName}-${option.label}`
                                                        ] || option.value || '';
                                                        handleMultiplierSave(
                                                          sign.signName,
                                                          option.label,
                                                          currentValue
                                                        );
                                                      }
                                                    }}
                                                    className="bg-[#F9F9FB] h-10 flex items-center justify-center px-3 gap-2 border border-[#E0E0E0] rounded-md text-center text-[14px] w-14"
                                                    placeholder={option.value}
                                                  />
                                                ) : (
                                                  <button className="bg-[#F9F9FB] h-10 flex items-center justify-center px-3 gap-2 border border-[#E0E0E0] rounded-md">
                                                    {option.value}
                                                  </button>
                                                )
                                              ) : (
                                                <button className="relative w-9 h-5 rounded-full transition-colors duration-200 bg-[#17B26A]">
                                                  <div className="absolute top-[2px] size-4 bg-white rounded-full transition-transform duration-200 translate-x-[18px]" />
                                                </button>
                                              )}
                                            </section>
                                          </div>
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })()}
      </div>
    </div>
  );
};

export default SignsPage;
