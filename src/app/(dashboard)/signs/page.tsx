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
  RowClickedEvent,
} from "ag-grid-community";
import {
  MasterDetailModule,
  ColumnsToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
} from "ag-grid-enterprise";
import { DetailCellRenderer } from "@/components/ui/detailCellRenderer";
import { IAccount } from "@/lib/interfaces";
import Image from "next/image";
import { ChevronRight } from "lucide-react";
import "ag-grid-enterprise";

ModuleRegistry.registerModules([
  ClientSideRowModelModule,
  MasterDetailModule,
  ColumnsToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
]);

// Sample data for master/detail
const accountData: IAccount[] = [
  {
    signImage: "/daves-hot-chicken-logo.png",
    signName: "Channel Letters",
    signDescription:
      "(Letter Size) (Raceway-Mounted Option) (Color) (Fabrication Type) Channel Letters (w/ Behind-The-Wall Option)",
    status: "Active",
    dateAdded: "Aug 1st, 2025",
    signOptions: [
      { label: "Raceway", type: "Dropdown", checked: true },
      { label: "Raceway Size", type: "User Input", checked: true },
      { label: "Color", type: "Dropdown", checked: true },
      { label: "Fabrication Type", type: "Dropdown", checked: true },
    ],
    details: [
      {
        size: '12"',
        signPrice: "$3,520.00",
        installPrice: "$1,970.00",
        signBudget: "$1,936.00",
        installBudget: "$1,083.00",
        raceway: "$600.00",
      },
      {
        size: '13"',
        signPrice: "$3,520.00",
        installPrice: "$1,970.00",
        signBudget: "$1,936.00",
        installBudget: "$1,083.00",
        raceway: "$600.00",
      },
      // ... more rows as needed
    ],
  },
  // ... more accounts
];

const columnDefs: ColDef<IAccount>[] = [
  {
    headerName: '',
    width: 50,
    suppressMovable: true,
    resizable: false,
    sortable: false,
    cellClass: 'ag-center-text',
    suppressHeaderMenuButton: true,
    suppressHeaderFilterButton: true,
    menuTabs: [],
    cellRenderer: (params: ICellRendererParams<IAccount, unknown>) => {
      const isExpanded = params.node.expanded;
      return (
        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <button
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            onClick={e => {
              e.stopPropagation();
              params.node.setExpanded(!params.node.expanded);
            }}
            aria-label={isExpanded ? 'Collapse details' : 'Expand details'}
          >
            <span style={{ display: 'inline-block', transition: 'transform 0.2s', transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)' }}>
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
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Image
            src={params.value ?? ""}
            alt="Sign Image"
            width={40}
            height={40}
            className="rounded"
          />
        </div>
      </div>
    ),
    width: 150,
    suppressMovable: true,
    resizable: false,
    cellClass: "ag-center-text",
    suppressHeaderMenuButton: true,
    suppressHeaderFilterButton: true,
    menuTabs: [],
  },
  {
    headerName: "Sign Name",
    field: "signName",
    cellRenderer: (params: ICellRendererParams<IAccount, string>) => (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span className="font-semibold">{params.value ?? ""}</span>
      </div>
    ),
    flex: 1,
    cellClass: "ag-center-text",
    suppressHeaderMenuButton: true,
    suppressHeaderFilterButton: true,
    menuTabs: [],
  },
  {
    headerName: "Sign Description",
    field: "signDescription",
    flex: 3,
    cellClass: "ag-sign-description-cell ag-center-text",
    suppressHeaderMenuButton: true,
    suppressHeaderFilterButton: true,
    menuTabs: [],
    cellRenderer: (params: ICellRendererParams<IAccount, string>) => (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {params.value ?? ""}
      </div>
    ),
  },
  {
    headerName: "Status",
    field: "status",
    cellRenderer: (params: ICellRendererParams<IAccount, string>) => (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span className="bg-green-100 text-green-700 px-3 py-1 rounded text-xs font-medium">
          {params.value ?? ""}
        </span>
      </div>
    ),
    flex: 1,
    cellClass: "ag-center-text",
    suppressHeaderMenuButton: true,
    suppressHeaderFilterButton: true,
    menuTabs: [],
  },
  {
    headerName: "Date Added",
    field: "dateAdded",
    flex: 1,
    cellClass: "ag-center-text",
    suppressHeaderMenuButton: true,
    suppressHeaderFilterButton: true,
    menuTabs: [],
    cellRenderer: (params: ICellRendererParams<IAccount, string>) => (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {params.value ?? ""}
      </div>
    ),
  },
];

const gridOptions = {
  masterDetail: true,
  detailCellRenderer: DetailCellRenderer,
  detailRowHeight: 450, // Increased to fit grid and options block
  detailRowAutoHeight: false,
  detailCellRendererParams: {
    suppressCount: true,
    template: '<div class="ag-details-row ag-details-grid"></div>',
  },
  columnDefs,
  defaultColDef: {
    sortable: true,
    resizable: true,
    // no filter, no suppressMenu
  },
  embedFullWidthRows: true,
  suppressColumnVirtualisation: true,
  animateRows: true,
  onFirstDataRendered: (params: FirstDataRenderedEvent<IAccount>) => {
    params.api.sizeColumnsToFit();
    params.api.forEachNode((node) => node.setExpanded(node.id === "1"));
  },
  onRowClicked: () => {
    // Do nothing
  },
  getRowStyle: () => ({ backgroundColor: "#F9F9FB" }),
  getRowClass: () => "custom-row-background",
};

const SignsPage = () => {
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
        <div
          className="ag-theme-alpine"
          style={{ width: "100%", background: "white" }}
        >
          <AgGridReact
            rowData={accountData}
            gridOptions={gridOptions}
            domLayout="autoHeight"
            headerHeight={48}
            rowHeight={56}
            rowSelection="single"
          />
        </div>
      </div>
    </>
  );
};

export default SignsPage;
