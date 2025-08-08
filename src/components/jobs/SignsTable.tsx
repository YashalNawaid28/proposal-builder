"use client";
import { Plus } from "lucide-react";
import { SignImageCell } from "./SignImageCell";

interface SignsTableProps {
  data: any[];
  onRowClick: (event: React.MouseEvent, line: any) => void;
  onEdit: (line: any) => void;
  onDelete: (line: any) => void;
  onAddSign?: () => void; // Add this prop
}

export const SignsTable = ({
  data,
  onRowClick,
  onEdit,
  onDelete,
  onAddSign,
}: SignsTableProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse border-gray-200">
        <thead className="bg-[#F9F9FB] font-semibold">
          <tr className="border-b border-[#DEE1EA] h-[50px] font-semibold text-[14px]">
            <th className="p-4 text-left text-[12px] font-semibold border-r border-[#DEE1EA]">
              Qty
            </th>
            <th className="p-4 text-left text-[12px] font-semibold border-r border-[#DEE1EA]">
              Sign
            </th>
            <th className="p-4 text-left text-[12px] font-semibold min-w-[200px] border-r border-[#DEE1EA] text-base">
              Description
            </th>
            <th className="p-4 text-center text-[12px] font-semibold border-r border-[#DEE1EA]">
              Sign Price
            </th>
            <th className="p-4 text-center text-[12px] font-semibold border-r border-[#DEE1EA]">
              Install Price
            </th>
            <th className="p-4 text-center text-[12px] font-semibold border-r border-[#DEE1EA]">
              Sign Budget
            </th>
            <th className="p-4 text-center text-[12px] font-semibold text-base">
              Install Budget
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {data.map((line: any, index: number) => (
            <tr
              key={line.id || index}
              className="hover:bg-gray-50 h-20 text-[14px] cursor-pointer"
              onClick={(e) => onRowClick(e, line)}
            >
              <td className="p-4 text-sm border-r border-[#DEE1EA]">
                {line.qty || 1}
              </td>
              <td className="border-r border-[#DEE1EA] flex items-center justify-center h-20">
                <div className="flex items-center justify-center">
                  <SignImageCell
                    src={line.signs?.sign_image || ""}
                    signName={line.signs?.sign_name || "Sign"}
                  />
                </div>
              </td>
              <td className="p-4 font-semibold border-r border-[#DEE1EA] text-[14px]">
                {line.description_resolved || "No description"}
              </td>
              <td className="p-4 border-r text-center border-[#DEE1EA] text-[14px]">
                ${line.list_price?.toFixed(2) || "0.00"}
              </td>
              <td className="p-4 border-r border-[#DEE1EA] text-center text-[14px]">
                ${line.list_install_price?.toFixed(2) || "0.00"}
              </td>
              <td className="p-4 border-r border-[#DEE1EA] text-center text-[14px]">
                ${line.cost_budget?.toFixed(2) || "0.00"}
              </td>
              <td className="p-4 text-center text-[14px]">
                ${line.cost_install_budget?.toFixed(2) || "0.00"}
              </td>
            </tr>
          ))}

          {/* Totals Row */}
          {data.length > 0 && (
            <tr>
              <td colSpan={2} className="p-4">
                <button
                  className="h-10 flex items-center justify-center px-4 gap-2 font-semibold text-[14px] hover:bg-gray-50"
                  onClick={onAddSign}
                >
                  <Plus className="size-4" />
                  Add Sign
                </button>
              </td>
              <td className="p-4">
                <p className="text-sm font-semibold text-right pr-10 w-full">
                  Totals:
                </p>
              </td>
              <td className="p-4 text-sm font-semibold text-center">
                $
                {data
                  .reduce(
                    (sum: number, line: any) => sum + (line.list_price || 0),
                    0
                  )
                  .toFixed(2)}
              </td>
              <td className="p-4 text-sm font-semibold text-center">
                $
                {data
                  .reduce(
                    (sum: number, line: any) =>
                      sum + (line.list_install_price || 0),
                    0
                  )
                  .toFixed(2)}
              </td>
              <td className="p-4 text-sm font-semibold text-center">
                $
                {data
                  .reduce(
                    (sum: number, line: any) => sum + (line.cost_budget || 0),
                    0
                  )
                  .toFixed(2)}
              </td>
              <td className="p-4 text-sm font-semibold text-center">
                $
                {data
                  .reduce(
                    (sum: number, line: any) =>
                      sum + (line.cost_install_budget || 0),
                    0
                  )
                  .toFixed(2)}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
