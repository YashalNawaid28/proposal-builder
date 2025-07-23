"use client";
import React, { useMemo, useState } from "react";
import { AgGridReact } from "ag-grid-react";
import { ColDef } from "ag-grid-community";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { ModuleRegistry, AllCommunityModule } from "ag-grid-community";
import Image from "next/image";
ModuleRegistry.registerModules([AllCommunityModule]);

const optionsData = [
  {
    icon: "dropdown",
    name: "Color",
    placeholder: "{color}",
    type: "Dropdown",
    status: "Active",
    values: ["Red", "White"],
  },
  {
    icon: "input",
    name: "Raceway Size",
    placeholder: "{raceway_size}",
    type: "Input",
    status: "Active",
    values: ["N/A"],
  },
  {
    icon: "input",
    name: "Backer Panel Size (Line 1)",
    placeholder: "{backer_panel_size_line1}",
    type: "Input",
    status: "Active",
    values: ["N/A"],
  },
  {
    icon: "input",
    name: "Backer Panel Size (Line 2)",
    placeholder: "{backer_panel_size_line2}",
    type: "Input",
    status: "Active",
    values: ["N/A"],
  },
  {
    icon: "dropdown",
    name: "Fab Type",
    placeholder: "{fab_type}",
    type: "Dropdown",
    status: "Active",
    values: [
      "Face-Lit",
      "Halo-Lit +20%",
      "Trimless +75%",
      "Face + Halo-Lit",
      "Face + Halo-Lit (Duel LEDs) +20%",
    ],
  },
  {
    icon: "dropdown",
    name: "Fab Material",
    placeholder: "{fab_material}",
    type: "Dropdown",
    status: "Active",
    values: [
      "Plastic",
      "Pan-Formed Aluminum +60%",
      "Flex Face",
      "Routed Aluminum +50%",
      "Routed Push-Thru +75%",
      "Pan-Formed Aluminum Push-Thru +100%",
    ],
  },
  {
    icon: "dropdown",
    name: "Print Material",
    placeholder: "{print_material}",
    type: "Dropdown",
    status: "Active",
    values: [
      "Vinyl",
      "Digitally Printed Vinyl +68%",
      "Window Tint",
      "Window Tint Install",
      "Digitally Printed Wallpaper +170%",
      "Digitally Printed Wallpaper Install +50%",
    ],
  },
  {
    icon: "dropdown",
    name: "Mounting Surface",
    placeholder: "{mounting_surface}",
    type: "Dropdown",
    status: "Active",
    values: ["Glass", "Drywall", "Concrete +60%", "Brick +100%"],
  },
  {
    icon: "dropdown",
    name: "Panel Style",
    placeholder: "{panel_style}",
    type: "Dropdown",
    status: "Active",
    values: ["Single-Sided", "Double-Sided +100%"],
  },
  {
    icon: "dropdown",
    name: "Illumination",
    placeholder: "{illumination}",
    type: "Dropdown",
    status: "Active",
    values: ["Yes +5%", "No"],
  },
  {
    icon: "dropdown",
    name: "Backer Illumination",
    placeholder: "{backer_illumination}",
    type: "Dropdown",
    status: "Active",
    values: ["Yes", "No"],
  },
  {
    icon: "dropdown",
    name: "View",
    placeholder: "{panel_style}",
    type: "Dropdown",
    status: "Active",
    values: ["Single-Sided", "Double-Sided +50%"],
  },
  {
    icon: "dropdown",
    name: "Anti-Graffiti",
    placeholder: "{anti-graffiti}",
    type: "Dropdown",
    status: "Active",
    values: ["Yes +$4/SF", "No"],
  },
];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const StatusCell = (params: any) => (
  <span className="bg-green-100 text-green-700 px-3 py-1 rounded text-xs font-medium">
    {params.value}
  </span>
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ValuesCell = (params: any) => (
  <div className="flex flex-wrap justify-start">
    {" "}
    {/* increased gap for more spacing */}
    {params.value.map((val: string, idx: number) => (
      <span
        key={idx}
        className="bg-gray-100 px-2 py-1 rounded text-xs font-medium border border-gray-300 mx-1 my-1"
      >
        {val}
      </span>
    ))}
  </div>
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const IconCell = (params: any) =>
  params.data.iconUrl ? (
    <div className="flex items-center justify-center h-full w-full">
      <Image
        src={params.data.iconUrl}
        alt={params.data.name + " icon"}
        width={32}
        height={32}
        className="rounded"
      />
    </div>
  ) : (
    <div className="flex items-center justify-center h-full w-full text-xs text-gray-400">
      N/A
    </div>
  );

// Custom header style
const gridOptions = {
  suppressRowClickSelection: true,
  suppressCellSelection: true,
  headerHeight: 48,
  rowHeight: 56,
  getHeaderClass: () => "custom-ag-header",
};

const OptionsPage = () => {
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
          <AgGridReact
            rowData={optionsData}
            columnDefs={columnDefs}
            domLayout="autoHeight"
            headerHeight={48}
            // rowHeight={56} // REMOVE this line to allow dynamic row height
            rowSelection="multiple"
            gridOptions={gridOptions}
          />
        </div>
      </div>
    </>
  );
};

export default OptionsPage;
