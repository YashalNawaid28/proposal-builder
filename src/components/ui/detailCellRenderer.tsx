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
  const detailColumnDefs: ColDef<ISignDetail>[] = [
    {
      field: "size",
      headerName: "Size",
      flex: 2,
      cellClass: "ag-center-text",
      suppressHeaderMenuButton: true,
      suppressHeaderFilterButton: true,
      menuTabs: [],
      cellRenderer: (params: ICellRendererParams<ISignDetail, string>) => (
        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {params.value ?? ""}
        </div>
      ),
    },
    {
      field: "signPrice",
      headerName: "Sign Price",
      flex: 1,
      cellClass: "ag-center-text",
      suppressHeaderMenuButton: true,
      suppressHeaderFilterButton: true,
      menuTabs: [],
      cellRenderer: (params: ICellRendererParams<ISignDetail, string>) => (
        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {params.value ?? ""}
        </div>
      ),
    },
    {
      field: "installPrice",
      headerName: "Install Price",
      flex: 1,
      cellClass: "ag-center-text",
      suppressHeaderMenuButton: true,
      suppressHeaderFilterButton: true,
      menuTabs: [],
      cellRenderer: (params: ICellRendererParams<ISignDetail, string>) => (
        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {params.value ?? ""}
        </div>
      ),
    },
    {
      field: "signBudget",
      headerName: "Sign Budget",
      flex: 1,
      cellClass: "ag-center-text",
      suppressHeaderMenuButton: true,
      suppressHeaderFilterButton: true,
      menuTabs: [],
      cellRenderer: (params: ICellRendererParams<ISignDetail, string>) => (
        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {params.value ?? ""}
        </div>
      ),
    },
    {
      field: "installBudget",
      headerName: "Install Budget",
      flex: 1,
      cellClass: "ag-center-text",
      suppressHeaderMenuButton: true,
      suppressHeaderFilterButton: true,
      menuTabs: [],
      cellRenderer: (params: ICellRendererParams<ISignDetail, string>) => (
        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {params.value ?? ""}
        </div>
      ),
    },
    {
      field: "raceway",
      headerName: "Raceway",
      flex: 1,
      cellClass: "ag-center-text",
      suppressHeaderMenuButton: true,
      suppressHeaderFilterButton: true,
      menuTabs: [],
      cellRenderer: (params: ICellRendererParams<ISignDetail, string>) => (
        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {params.value ?? ""}
        </div>
      ),
    },
  ];

  // Helper to pick icon based on type
  const getOptionIcon = (type: string) => {
    if (type === "Dropdown")
      return <span style={{ fontSize: 20, marginRight: 8 }}>📄</span>;
    if (type === "User Input")
      return <span style={{ fontSize: 20, marginRight: 8 }}>🔡</span>;
    return <span style={{ fontSize: 20, marginRight: 8 }}>📄</span>;
  };

  // Columns for the Sign Options custom grid
  const signOptionsColumnDefs: ColDef<ISignOption>[] = [
    {
      field: "label",
      headerName: "Sign Options",
      flex: 1,
      minWidth: 180,
      cellRenderer: (params: ICellRendererParams<ISignOption, string>) => (
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {getOptionIcon(params.data?.type || "")}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontWeight: 600 }}>{params.data?.label}</span>
            <span style={{ fontSize: 12, color: "#6B7280" }}>
              {params.data?.type}
            </span>
          </div>
        </div>
      ),
      cellClass: "ag-center-text",
      suppressHeaderMenuButton: true,
      suppressHeaderFilterButton: true,
      menuTabs: [],
    },
    {
      field: "checked",
      headerName: "",
      width: 40,
      cellRenderer: (params: ICellRendererParams<ISignOption, boolean>) =>
        params.value ? (
          <span style={{ color: "#22c55e", fontWeight: 700, fontSize: 22 }}>
            &#10003;
          </span>
        ) : null,
      cellClass: "ag-center-text",
      suppressHeaderMenuButton: true,
      suppressHeaderFilterButton: true,
      menuTabs: [],
    },
  ];

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
      <div
        className="detail-cell-renderer"
        style={{
          width: "100%",
          height: "100%",
          margin: 0,
          padding: 0,
          background: "#f3f4f6", // Tailwind bg-gray-100
          boxSizing: "border-box",
        }}
      >
        <div
          className="detail-grid-row flex flex-row gap-4 bg-gray-100"
          style={{ width: "100%", height: "100%" }}
        >
          <div style={{ flex: 3, minWidth: 0 }}>
            <div
              className="ag-theme-alpine bg-gray-100"
              style={{ width: "100%", height: "100%", background: "#f3f4f6" }}
            >
              <AgGridReact<ISignDetail>
                {...detailGridOptions}
                getRowStyle={() => ({ background: '#f3f4f6' })}
              />
            </div>
          </div>
          <div className="flex-1 min-w-[220px] max-w-[350px] bg-gray-100">
            <h1 className="text-md font-semibold my-3">Sign Options</h1>
            <div className="w-full pr-4 pl-4 flex flex-col gap-4">
              {(props.data?.signOptions ?? []).map((opt, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <span className="text-xl mr-2">
                    {getOptionIcon(opt.type)}
                  </span>
                  <div className="flex flex-col gap-2">
                    <span className="font-semibold">{opt.label}</span>
                    <span className="">{opt.type}</span>
                  </div>
                  {opt.checked && (
                    <span className="text-white bg-green-500 rounded-full w-8 h-8 flex items-center justify-center font-bold text-2xl ml-auto">
                      &#10003;
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
