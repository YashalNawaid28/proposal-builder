"use client";
import React, { useMemo, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import Image from "next/image";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
ModuleRegistry.registerModules([AllCommunityModule]);

const rowData = [
  {
    brandImage: "/images/daves-hot-chicken.png",
    brandName: "Dave's Hot Chicken",
    proposalLabel: "DHCP",
    signs: 10,
    services: 0,
    status: "Active",
    dateAdded: "Aug 1st, 2025",
  },
];

const StatusCell = () => (
  <span className="bg-green-100 text-green-700 px-3 py-1 rounded text-xs font-medium">
    Active
  </span>
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const BrandImageCell = (params: any) => (
  <div className="flex items-center justify-center h-full w-full">
    <Image
      src={params.value}
      alt="Brand Logo"
      width={40}
      height={40}
      className="rounded-full"
    />
  </div>
);

const BrandsPage = () => {
  const [tab, setTab] = useState("all");
  const columnDefs = useMemo<ColDef[]>(
    () => [
      {
        headerName: "",
        checkboxSelection: true,
        width: 40,
        pinned: "left" as const,
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        cellRenderer: (params: any) => (
          <span className="font-semibold">{params.value}</span>
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        valueFormatter: (p: any) => `${p.value} Signs`,
        flex: 1,
        cellClass: "ag-center-text",
      },
      {
        headerName: "Services",
        field: "services",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        valueFormatter: (p: any) => `${p.value} Services`,
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
          <AgGridReact
            rowData={rowData}
            columnDefs={columnDefs}
            domLayout="autoHeight"
            headerHeight={48}
            rowHeight={56}
            rowSelection="multiple"
            gridOptions={gridOptions}
          />
        </div>
      </div>
    </>
  );
};

export default BrandsPage;
