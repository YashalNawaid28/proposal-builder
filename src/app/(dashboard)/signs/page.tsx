"use client";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { ModuleRegistry, ClientSideRowModelModule, ColDef, ICellRendererParams, FirstDataRenderedEvent, RowClickedEvent } from "ag-grid-community";
import {
  MasterDetailModule,
  ColumnsToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
} from "ag-grid-enterprise";
import { DetailCellRenderer } from "@/components/ui/detailCellRenderer";
import { IAccount, ISignOption, ISignDetail } from "@/lib/interfaces";
import Image from "next/image";
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
      { size: '12"', signPrice: "$3,520.00", installPrice: "$1,970.00", signBudget: "$1,936.00", installBudget: "$1,083.00", raceway: "$600.00" },
      { size: '13"', signPrice: "$3,520.00", installPrice: "$1,970.00", signBudget: "$1,936.00", installBudget: "$1,083.00", raceway: "$600.00" },
      // ... more rows as needed
    ],
  },
  // ... more accounts
];

const columnDefs: ColDef<IAccount>[] = [
  {
    headerName: "Sign Image",
    field: "signImage",
    cellRenderer: (params: ICellRendererParams<IAccount, string>) => (
      <div className="flex items-center justify-center h-full w-full">
        <Image src={params.value ?? ""} alt="Sign Image" width={40} height={40} className="rounded" />
      </div>
    ),
    width: 80,
    suppressMovable: true,
    resizable: false,
    cellClass: "ag-center-text",
  },
  {
    headerName: "Sign Name",
    field: "signName",
    cellRenderer: (params: ICellRendererParams<IAccount, string>) => <span className="font-semibold">{params.value ?? ""}</span>,
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
    cellRenderer: (params: ICellRendererParams<IAccount, string>) => (
      <span className="bg-green-100 text-green-700 px-3 py-1 rounded text-xs font-medium">{params.value ?? ""}</span>
    ),
    flex: 1,
    cellClass: "ag-center-text",
  },
  {
    headerName: "Date Added",
    field: "dateAdded",
    flex: 1,
    cellClass: "ag-center-text",
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
    filter: true,
    resizable: true,
  },
  embedFullWidthRows: true,
  suppressColumnVirtualisation: true,
  animateRows: true,
  onFirstDataRendered: (params: FirstDataRenderedEvent<IAccount>) => {
    params.api.sizeColumnsToFit();
    params.api.forEachNode((node) => node.setExpanded(node.id === "1"));
  },
  onRowClicked: (event: RowClickedEvent<IAccount>) => {
    if (event.node.master) {
      event.node.setExpanded(!event.node.expanded);
    }
  },
  getRowStyle: () => ({ backgroundColor: "#F9F9FB" }),
  getRowClass: () => "custom-row-background",
};

const SignsPage = () => {
  return (
    <>
      <style>{`
        .ag-header, .ag-header-cell {
          background-color: #F9F9FB !important;
          color: #495057 !important;
          border-right: 1px solid #e0e4e7 !important;
        }
        .ag-header {
          border-bottom: 1px solid #e0e4e7 !important;
        }
        .ag-header-cell-label {
          color: #495057 !important;
        }
        .ag-row, .ag-row-even, .ag-row-odd {
          background-color: #F9F9FB !important;
        }
        .ag-row:hover {
          background-color: #f0f0f5 !important;
        }
        .ag-cell {
          background-color: #F9F9FB !important;
        }
        .detail-cell-renderer {
          width: 100% !important;
          box-sizing: border-box !important;
          margin: 0 !important;
          padding: 0 !important;
          background-color: #F9F9FB !important;
        }
        .detail-grid-container {
          width: 100% !important;
          margin: 0 !important;
          padding: 0 !important;
          background-color: #F9F9FB !important;
        }
        .ag-details-row {
          padding: 0 !important;
          margin: 0 !important;
          background-color: #F9F9FB !important;
        }
        .ag-details-grid {
          width: 100% !important;
          margin: 0 !important;
          padding: 0 !important;
          background-color: #F9F9FB !important;
        }
        .ag-cell-wrapper.ag-row-group-indent-0 {
          padding-left: 0 !important;
        }
        .detail-grid-container .ag-root-wrapper,
        .detail-grid-container .ag-root {
          width: 100% !important;
          background-color: #F9F9FB !important;
        }
        .detail-grid-container .ag-header {
          background-color: #F9F9FB !important;
          color: #495057 !important;
          font-weight: 600 !important;
          border-bottom: 1px solid #e0e4e7 !important;
        }
        .detail-grid-container .ag-header-cell {
          background-color: #F9F9FB !important;
          border-right: 1px solid #e0e4e7 !important;
        }
        .detail-grid-container .ag-header-cell-label {
          color: #495057 !important;
        }
        .detail-grid-container .ag-row-even,
        .detail-grid-container .ag-row-odd,
        .detail-grid-container .ag-row {
          background-color: #F9F9FB !important;
        }
        .detail-grid-container .ag-cell {
          background-color: #F9F9FB !important;
        }
        .detail-grid-container .ag-row:hover {
          background-color: #f0f0f5 !important;
          transition: background-color 0.2s ease;
        }
        .detail-grid-container .ag-paging-panel {
          border-top: 1px solid #e0e4e7 !important;
          background-color: #F9F9FB !important;
          padding: 8px 12px !important;
        }
        .detail-grid-container .ag-root-wrapper-body,
        .detail-grid-container .ag-body-viewport {
          background-color: #F9F9FB !important;
        }
        .detail-grid-container .ag-body-viewport::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .detail-grid-container .ag-body-viewport::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }
        .detail-grid-container .ag-body-viewport::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 4px;
        }
        .detail-grid-container .ag-body-viewport::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
        }
        @media (max-width: 768px) {
          .detail-cell-renderer {
            padding: 10px;
          }
          .detail-grid-container {
            height: 250px;
          }
        }
        .ag-details-row {
          padding: 0 !important;
        }
        .ag-details-row .ag-details-grid {
          width: 100% !important;
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
