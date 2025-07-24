import React, { useEffect, useRef } from "react";
import { AgGridReact } from "ag-grid-react";
import { GridApi, GridOptions, ColDef, ICellRendererParams } from "ag-grid-community";
import { ICallDetail, IAccount } from "@/lib/interfaces";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

export const DetailCellRenderer = (props: ICellRendererParams<IAccount, any>) => {
  const gridRef = useRef<GridApi<ICallDetail> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const detailColumnDefs: ColDef<ICallDetail>[] = [
    { field: "callId", headerName: "Call ID", width: 100, pinned: "left" },
    {
      field: "direction",
      headerName: "Direction",
      width: 120,
      cellStyle: params =>
        params.value === "Outbound"
          ? { color: "#28a745", fontWeight: "bold" }
          : { color: "#dc3545", fontWeight: "bold" },
    },
    {
      field: "duration",
      headerName: "Duration",
      width: 100,
      valueFormatter: params => `${params.value}m`,
    },
    { field: "subject", headerName: "Subject", flex: 1, minWidth: 200 },
    {
      field: "date",
      headerName: "Date",
      width: 120,
      valueFormatter: params => new Date(params.value).toLocaleDateString(),
    },
    {
      field: "status",
      headerName: "Status",
      width: 100,
      cellStyle: params => {
        const statusColors: Record<string, string> = {
          Completed: "#28a745",
          Missed: "#dc3545",
          "In Progress": "#ffc107",
        };
        return {
          color: statusColors[params.value] || "#6c757d",
          fontWeight: "bold",
        };
      },
    },
  ];

  const detailGridOptions: GridOptions<ICallDetail> = {
    columnDefs: detailColumnDefs,
    rowData: props.data.callDetails || [],
    defaultColDef: {
      sortable: true,
      filter: true,
      resizable: true,
    },
    suppressHorizontalScroll: false,
    suppressColumnVirtualisation: true,
    headerHeight: 40,
    rowHeight: 35,
    animateRows: true,
    enableRangeSelection: true,
    pagination: true,
    paginationPageSize: 10,
    paginationPageSizeSelector: [5, 10, 20],
    onGridReady: params => {
      gridRef.current = params.api;
      params.api.sizeColumnsToFit();
    },
  };

  useEffect(() => {
    if (gridRef.current) {
      gridRef.current.setGridOption("rowData", props.data.callDetails || []);
    }
  }, [props.data.callDetails]);

  return (
    <div
      className="detail-cell-renderer"
      style={{ width: "100%", height: "100%", margin: 0, padding: 0, background: "#F9F9FB", boxSizing: "border-box" }}
    >
      <div
        className="detail-grid-container ag-theme-alpine"
        ref={containerRef}
        style={{ width: "100%", height: "100%", margin: 0, padding: 0, background: "#F9F9FB", boxSizing: "border-box" }}
      >
        <AgGridReact<ICallDetail> {...detailGridOptions} />
      </div>
    </div>
  );
}; 