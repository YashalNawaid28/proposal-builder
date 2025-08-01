"use client";
import { useState, useEffect, Fragment, useRef } from "react";
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
  size: string;
  signPrice: number;
  installPrice: number;
  signBudget: number;
  installBudget: number;
  raceway: number;
}

const PricingGrid = ({ rowData }: { rowData: ISignDetail[] }) => {
  console.log("PricingGrid received data:", rowData); // Debug log

  // Grid API reference - must be before any early returns
  const gridRef = useRef<AgGridReact>(null);

  if (!rowData || rowData.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500">
        No pricing data available
      </div>
    );
  }

  // Convert ISignDetail[] to PricingDetail[] for AG Grid
  const gridData = rowData.map((item) => ({
    size: item.size,
    signPrice: parseFloat(item.signPrice.replace(/[^0-9.-]+/g, "")) || 0,
    installPrice: parseFloat(item.installPrice.replace(/[^0-9.-]+/g, "")) || 0,
    signBudget: parseFloat(item.signBudget.replace(/[^0-9.-]+/g, "")) || 0,
    installBudget:
      parseFloat(item.installBudget.replace(/[^0-9.-]+/g, "")) || 0,
    raceway: parseFloat(item.raceway.replace(/[^0-9.-]+/g, "")) || 0,
  }));

  console.log("Converted grid data:", gridData);

  // Column Definitions for AG-Grid
  const colDefs: ColDef[] = [
    {
      field: "size",
      headerName: "Size",
      width: 150,
      cellClass: "font-medium text-center border-r border-[#DEE1EA]",
      headerClass: "text-center",
    },
    {
      field: "signPrice",
      headerName: "Sign Price",
      flex: 1,
      minWidth: 120,
      editable: true,
      valueFormatter: (p: ValueFormatterParams) => formatCurrency(p.value),
      valueParser: (p: ValueParserParams) =>
        Number(String(p.newValue).replace(/[^0-9.-]+/g, "")),
      cellClass: "text-center border-r border-[#DEE1EA]",
      headerClass: "text-center",
    },
    {
      field: "installPrice",
      headerName: "Install Price",
      flex: 1,
      minWidth: 120,
      editable: true,
      valueFormatter: (p: ValueFormatterParams) => formatCurrency(p.value),
      valueParser: (p: ValueParserParams) =>
        Number(String(p.newValue).replace(/[^0-9.-]+/g, "")),
      cellClass: "text-center border-r border-[#DEE1EA]",
      headerClass: "text-center",
    },
    {
      field: "signBudget",
      headerName: "Sign Budget",
      flex: 1,
      minWidth: 120,
      editable: true,
      valueFormatter: (p: ValueFormatterParams) => formatCurrency(p.value),
      valueParser: (p: ValueParserParams) =>
        Number(String(p.newValue).replace(/[^0-9.-]+/g, "")),
      cellClass: "text-center border-r border-[#DEE1EA]",
      headerClass: "text-center",
    },
    {
      field: "installBudget",
      headerName: "Install Budget",
      flex: 1,
      minWidth: 120,
      editable: true,
      valueFormatter: (p: ValueFormatterParams) => formatCurrency(p.value),
      valueParser: (p: ValueParserParams) =>
        Number(String(p.newValue).replace(/[^0-9.-]+/g, "")),
      cellClass: "text-center border-r border-[#DEE1EA]",
      headerClass: "text-center",
    },
    {
      field: "raceway",
      headerName: "Raceway",
      flex: 1,
      minWidth: 120,
      editable: true,
      valueFormatter: (p: ValueFormatterParams) => formatCurrency(p.value),
      valueParser: (p: ValueParserParams) =>
        Number(String(p.newValue).replace(/[^0-9.-]+/g, "")),
      cellClass: "text-center",
      headerClass: "text-center",
    },
  ];

  // Default column definitions
  const defaultColDef: ColDef = {
    sortable: false,
    filter: false,
    resizable: true,
    suppressMovable: true,
    editable: true,
    cellDataType: false,
    cellStyle: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
  };

  return (
    <div className="ag-theme-quartz bg-red-300 w-full h-full flex-1">
      <AgGridReact
        ref={gridRef}
        rowData={gridData}
        columnDefs={colDefs}
        defaultColDef={defaultColDef}
        rowHeight={60}
        headerHeight={50}
        domLayout="normal"
        suppressCellFocus={false}
        getRowId={(params: GetRowIdParams) => params.data.size}
        cellSelection={{
          handle: { mode: "fill" },
        }}
        onGridReady={(params) => {
          setTimeout(() => {
            params.api.sizeColumnsToFit();
          }, 100);
        }}
        rowClassRules={{
          "border-b border-[#DEE1EA]": (params: RowClassParams) => {
            return params.rowIndex === params.api.getLastDisplayedRowIndex();
          },
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
        const response = await fetch("/api/signs");
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
        const transformedData = await Promise.all(
          (selectedBrand.signs as SignRaw[]).map(async (sign) => {
            const createdDate = new Date(sign.created_at);
            const day = createdDate.getDate();
            const suffix =
              ["th", "st", "nd", "rd"][((day % 100) - 20) % 10] ||
              ["th", "st", "nd", "rd"][day % 10] ||
              "th";
            const formattedDate = `${createdDate.toLocaleDateString("en-US", {
              month: "short",
            })} ${day}${suffix}, ${createdDate.getFullYear()}`;
            let details: any[] = [];
            try {
              const pricingResponse = await fetch(
                `/api/sign-pricing/get-by-signId?sign_id=${sign.id}`
              );
              if (pricingResponse.ok) {
                const pricingData = await pricingResponse.json();
                console.log(
                  `Raw pricing data for sign ${sign.id}:`,
                  pricingData
                );
                if (pricingData.data && Array.isArray(pricingData.data)) {
                  details = pricingData.data.map((pricing: any) => ({
                    size: pricing.size || "",
                    signPrice: pricing.sign_price || 0,
                    installPrice: pricing.install_price || 0,
                    signBudget: pricing.sign_budget || 0,
                    installBudget: pricing.install_budget || 0,
                    raceway: pricing.raceway || 0,
                  }));
                }
              }
            } catch (error) {
              console.error(
                `Error fetching pricing for sign ${sign.id}:`,
                error
              );
            }

            const signDetails: ISignDetail[] = details.map((d) => ({
              size: d.size,
              signPrice: formatCurrency(d.signPrice),
              installPrice: formatCurrency(d.installPrice),
              signBudget: formatCurrency(d.signBudget),
              installBudget: formatCurrency(d.installBudget),
              raceway: formatCurrency(d.raceway),
            }));
            if (signDetails.length === 0) {
              console.log(
                `No pricing data found for sign ${sign.id}, using empty array`
              );
            }

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
              { label: "Raceway Size", type: "User Input", checked: false },
              { label: "Color", type: "Dropdown", checked: false },
              { label: "Fabrication Type", type: "Dropdown", checked: false },
            ];

            return {
              signImage: sign.sign_image || "",
              signName: sign.sign_name || "Unnamed Sign",
              signDescription: sign.sign_description || "",
              status: (sign.status as "Active" | "Inactive") || "Active",
              dateAdded: formattedDate,
              signOptions: signOptions,
              details: signDetails,
            };
          })
        );
        setSignData(transformedData);
        setExpandedRow(null);
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
  }, [tab]);

  const handleRowToggle = (signName: string) => {
    setExpandedRow(expandedRow === signName ? null : signName);
  };

  const handleOptionToggle = (optionKey: string) => {
    setToggleStates((prev) => ({ ...prev, [optionKey]: !prev[optionKey] }));
  };

  return (
    <div className="bg-white">
      <h1 className="text-2xl font-bold p-5">Signs</h1>
      <PageTabs tabs={brands} activeTab={tab} onTabChange={setTab} />
      <div className="border border-[#DEE1EA] rounded-lg overflow-hidden">
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
                    <th className="w-12 border-r border-[#DEE1EA]">
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
                              className="object-contain"
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
                                                <button className="bg-[#F9F9FB] h-10 flex items-center justify-center px-3 gap-2 border border-[#E0E0E0] rounded-md">
                                                  {option.value}
                                                </button>
                                              ) : (
                                                <button
                                                  className={`relative w-12 h-6 rounded-full transition-colors duration-200 cursor-pointer ${
                                                    getToggleState(
                                                      sign.signName,
                                                      option.label,
                                                      option.checked
                                                    )
                                                      ? "bg-green-500"
                                                      : "bg-gray-300"
                                                  }`}
                                                  onClick={() =>
                                                    handleOptionToggle(
                                                      `${sign.signName}-${option.label}`
                                                    )
                                                  }
                                                >
                                                  <div
                                                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
                                                      getToggleState(
                                                        sign.signName,
                                                        option.label,
                                                        option.checked
                                                      )
                                                        ? "translate-x-7"
                                                        : "translate-x-1"
                                                    }`}
                                                  />
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
