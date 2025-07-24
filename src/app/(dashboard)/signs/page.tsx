"use client";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { ModuleRegistry, ClientSideRowModelModule } from "ag-grid-community";
import {
  MasterDetailModule,
  ColumnsToolPanelModule,
  ColumnMenuModule,
  ContextMenuModule,
} from "ag-grid-enterprise";
import { DetailCellRenderer } from "@/components/ui/detailCellRenderer";
import { IAccount } from "@/lib/interfaces";
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
    name: "Nora Thomas",
    account: "177000",
    calls: 24,
    minutes: 25.65,
    callDetails: [
      {
        callId: "177000-001",
        direction: "Inbound",
        duration: 36,
        subject: "Follow-up call",
        date: "2025-07-23T00:00:00.000Z",
        status: "In Progress",
      },
      // ... more call details
    ],
  },
  // ... more accounts
];

const gridOptions = {
  masterDetail: true,
  detailCellRenderer: DetailCellRenderer,
  detailRowHeight: 300,
  detailRowAutoHeight: false,
  detailCellRendererParams: {
    suppressCount: true,
    template: '<div class="ag-details-row ag-details-grid"></div>',
  },
  columnDefs: [
    {
      field: "name",
      cellRenderer: "agGroupCellRenderer",
      minWidth: 200,
      flex: 1,
    },
    { field: "account", minWidth: 150, flex: 1 },
    { field: "calls", minWidth: 100, width: 120, type: "numericColumn" },
    {
      field: "minutes",
      valueFormatter: (params) => `${params.value}m`,
      minWidth: 120,
      width: 150,
      type: "numericColumn",
    },
  ],
  defaultColDef: {
    sortable: true,
    filter: true,
    resizable: true,
  },
  embedFullWidthRows: true,
  suppressColumnVirtualisation: true,
  animateRows: true,
  rowSelection: "single",
  onFirstDataRendered: (params) => {
    params.api.sizeColumnsToFit();
    params.api.forEachNode((node) => node.setExpanded(node.id === "1"));
  },
  onRowClicked: (event) => {
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
          />
        </div>
      </div>
    </>
  );
};

export default SignsPage;
