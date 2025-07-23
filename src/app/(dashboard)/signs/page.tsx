"use client";
import React, { useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import Image from "next/image";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import { IconChevronRight } from "@tabler/icons-react";
import { ICellRendererParams } from "ag-grid-community";
ModuleRegistry.registerModules([AllCommunityModule]);

const signData = [
  {
    signName: "Channel Letters",
    size: '12"',
    signPrice: "$3,520.00",
    installPrice: "$1,970.00",
    signBudget: "$1,936.00",
    installBudget: "$1,083.00",
    raceway: "$600.00",
    status: "Active",
    dateAdded: "Aug 1st, 2025",
    signOptions: "Raceway, Raceway Size, Color, Fabrication Type",
  },
  {
    signName: "Channel Letters",
    size: '13"',
    signPrice: "$3,520.00",
    installPrice: "$1,970.00",
    signBudget: "$1,936.00",
    installBudget: "$1,083.00",
    raceway: "$600.00",
    status: "Active",
    dateAdded: "Aug 1st, 2025",
    signOptions: "Raceway, Raceway Size, Color, Fabrication Type",
  },
  // ...add more rows as needed
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const StatusCell = (params: any) => (
  <span className="bg-green-100 text-green-700 px-3 py-1 rounded text-xs font-medium">
    {params.value}
  </span>
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SignImageCell = (params: any) => (
  <div className="flex items-center justify-center h-full w-full">
    <Image
      src={params.value}
      alt="Sign Image"
      width={40}
      height={40}
      className="rounded"
    />
  </div>
);

const SignsPage = () => {
  const [tab, setTab] = useState("all");
  const [expandedRow, setExpandedRow] = useState<number | null>(null);
  const [columnDefs, setColumnDefs] = useState<ColDef[]>([
    {
      headerName: "",
      field: "dropdown",
      width: 40,
      pinned: "left" as const,
      suppressMovable: true,
      suppressSizeToFit: true,
      resizable: false,
      cellClass: "ag-center-text",
      cellRenderer: (params: ICellRendererParams) => (
        <button
          type="button"
          className="flex items-center justify-center w-4 focus:outline-none"
          onClick={() =>
            setExpandedRow(
              params.node.rowIndex === expandedRow ? null : params.node.rowIndex
            )
          }
        >
          <IconChevronRight
            className={`transition-transform duration-200 ${
              params.node.rowIndex === expandedRow ? "rotate-90" : ""
            }`}
            size={30}
          />
        </button>
      ),
    },
    {
      headerName: "Sign Image",
      field: "signImage",
      cellRenderer: SignImageCell,
      flex: 1,
      suppressMovable: true,
      resizable: false,
      cellClass: "ag-center-text",
    },
    {
      headerName: "Sign Name",
      field: "signName",
      cellRenderer: (params: ICellRendererParams) => (
        <span className="font-semibold">{params.value}</span>
      ),
      flex: 1,
      cellClass: "ag-center-text",
    },
    {
      headerName: "Sign Description",
      field: "signDescription",
      flex: 3,
      cellClass: "ag-sign-description-cell ag-center-text",
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
  ]);

  // Grouped table columnDefs
  const groupedColumnDefs: ColDef[] = [
    { field: "signName", rowGroup: true, hide: true },
    { field: "size" },
    { field: "signPrice" },
    { field: "installPrice" },
    { field: "signBudget" },
    { field: "installBudget" },
    { field: "raceway" },
    { field: "status" },
    { field: "dateAdded" },
    { field: "signOptions" },
  ];

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
        .ag-sign-description-cell {
          white-space: pre-line !important;
          word-break: break-word !important;
          padding: 0.75rem 1.5rem !important; /* slightly more horizontal padding */
          text-align: left !important;
          justify-content: flex-start !important;
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
        /* Force padding on all ag-cell elements */
        .ag-theme-alpine .ag-cell, .ag-theme-alpine .ag-header-cell {
          padding-left: 16px !important;
          padding-right: 16px !important;
        }
      `}</style>
      <div>
        <h1 className="text-2xl font-semibold mb-4 px-4 mt-4">Signs</h1>
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
            Dave&apos;s Hot Chicken
          </button>
        </div>
        <div
          className="ag-theme-alpine"
          style={{ width: "100%", background: "white" }}
        >
          <AgGridReact
            rowData={signData}
            columnDefs={columnDefs}
            domLayout="autoHeight"
            headerHeight={48}
            rowHeight={56}
            rowSelection="multiple"
            gridOptions={gridOptions}
          />
        </div>
        {/* Render grouped table below the expanded row */}
        {expandedRow !== null && (
          <div
            className="ag-theme-alpine mt-4"
            style={{ width: "100%", background: "white" }}
          >
            <AgGridReact
              rowData={signData}
              columnDefs={groupedColumnDefs}
              domLayout="autoHeight"
              headerHeight={48}
              rowHeight={56}
              groupDisplayType="multipleColumns"
              gridOptions={gridOptions}
            />
          </div>
        )}
      </div>
    </>
  );
};

export default SignsPage;
