import React, { useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import {
  GridApi,
  GridOptions,
  ColDef,
  ICellRendererParams,
} from "ag-grid-community";
import { ISignDetail, IAccount, ISignOption } from "@/lib/interfaces";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

export const DetailCellRenderer = (
  props: ICellRendererParams<IAccount, unknown>
) => {
  const gridRef = useRef<GridApi<ISignDetail> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Columns for the detail grid (excluding Sign Options)
  const detailColumnDefs: ColDef<ISignDetail>[] = [
    {
      field: "size",
      headerName: "Size",
      width: 100,
      suppressHeaderMenuButton: true,
      suppressHeaderFilterButton: true,
      menuTabs: [],
    },
    {
      field: "signPrice",
      headerName: "Sign Price",
      width: 130,
      suppressHeaderMenuButton: true,
      suppressHeaderFilterButton: true,
      menuTabs: [],
    },
    {
      field: "installPrice",
      headerName: "Install Price",
      width: 130,
      suppressHeaderMenuButton: true,
      suppressHeaderFilterButton: true,
      menuTabs: [],
    },
    {
      field: "signBudget",
      headerName: "Sign Budget",
      width: 130,
      suppressHeaderMenuButton: true,
      suppressHeaderFilterButton: true,
      menuTabs: [],
    },
    {
      field: "installBudget",
      headerName: "Install Budget",
      width: 130,
      suppressHeaderMenuButton: true,
      suppressHeaderFilterButton: true,
      menuTabs: [],
    },
    {
      field: "raceway",
      headerName: "Raceway",
      width: 110,
      suppressHeaderMenuButton: true,
      suppressHeaderFilterButton: true,
      menuTabs: [],
    },
    {
      headerName: "Sign Options",
      cellRenderer: () => (
        <div className="flex flex-col gap-1">
          {(props.data?.signOptions ?? []).map(
            (opt: ISignOption, idx: number) => (
              <div key={idx} className="flex items-center gap-2">
                <span>{opt.label}</span>
                <span className="text-xs text-gray-400">{opt.type}</span>
                {opt.checked && (
                  <span className="text-green-500">&#10003;</span>
                )}
              </div>
            )
          )}
        </div>
      ),
      flex: 2,
      cellClass: "ag-center-text",
      suppressHeaderMenuButton: true,
      suppressHeaderFilterButton: true,
      menuTabs: [],
    },
  ];

  // Render the sign options as a separate block below the grid
  const renderSignOptionsBlock = () => (
    <div className="flex flex-col gap-1 p-4 border-t border-gray-200 bg-[#F9F9FB]">
      <div className="font-semibold mb-2">Sign Options</div>
      <div className="flex flex-col gap-1">
        {(props.data?.signOptions ?? []).map(
          (opt: ISignOption, idx: number) => (
            <div key={idx} className="flex items-center gap-2">
              <span>{opt.label}</span>
              <span className="text-xs text-gray-400">{opt.type}</span>
              {opt.checked && <span className="text-green-500">&#10003;</span>}
            </div>
          )
        )}
      </div>
    </div>
  );

  const detailGridOptions: GridOptions<ISignDetail> = {
    columnDefs: detailColumnDefs,
    rowData: props.data?.details ?? [],
    defaultColDef: {
      sortable: true,
      resizable: true,
    },
    suppressHorizontalScroll: false,
    suppressColumnVirtualisation: true,
    headerHeight: 40,
    rowHeight: 35,
    animateRows: true,
    enableRangeSelection: true,
    pagination: false,
    onGridReady: (params) => {
      gridRef.current = params.api;
      params.api.sizeColumnsToFit();
    },
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
      <div
        className="detail-cell-renderer"
        style={{
          width: "100%",
          height: "100%",
          margin: 0,
          padding: 0,
          background: "#F9F9FB",
          boxSizing: "border-box",
        }}
      >
        <div
          className="detail-grid-container ag-theme-alpine"
          ref={containerRef}
          style={{
            width: "100%",
            height: "100%",
            margin: 0,
            padding: 0,
            background: "#F9F9FB",
            boxSizing: "border-box",
          }}
        >
          <AgGridReact<ISignDetail> {...detailGridOptions} />
          {renderSignOptionsBlock()}
        </div>
      </div>
    </>
  );
};
