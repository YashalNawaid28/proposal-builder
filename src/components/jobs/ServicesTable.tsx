"use client";
import { Plus } from "lucide-react";
import { SignImageCell } from "./SignImageCell";

interface ServicesTableProps {
  data: any[];
  onRowClick: (event: React.MouseEvent, line: any) => void;
  onEdit: (line: any) => void;
  onDelete: (line: any) => void;
  onAddService?: () => void; // Add this prop
}

export const ServicesTable = ({
  data,
  onRowClick,
  onEdit,
  onDelete,
  onAddService,
}: ServicesTableProps) => {
  // Calculate total price outside the JSX
  const totalPrice = data.reduce(
    (sum: number, line: any) => sum + (line.totalPrice || 0),
    0
  );

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse border-b border-gray-200">
        <thead className="bg-[#F9F9FB] font-semibold">
          <tr className="border-b border-[#DEE1EA] h-[50px] font-semibold text-[14px]">
            <th className="p-4 text-left text-[12px] font-semibold border-r border-[#DEE1EA]">
              Qty
            </th>
            <th className="p-4 text-left text-[12px] font-semibold border-r border-[#DEE1EA]">
              Service
            </th>
            <th className="p-4 text-left text-[12px] font-semibold min-w-[200px] border-r border-[#DEE1EA] text-base">
              Description
            </th>
            <th className="p-4 text-center text-[12px] font-semibold border-r border-[#DEE1EA]">
              Unit Price
            </th>
            <th className="p-4 text-center text-[12px] font-semibold text-base">
              Total Price
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
              <td className="p-4 text-sm border-r border-[#DEE1EA]">
                <div className="flex items-center justify-center">
                  <SignImageCell
                    src={line.serviceImage || ""}
                    signName={line.service || "Service"}
                  />
                </div>
              </td>
              <td className="p-4 font-semibold border-r border-[#DEE1EA] text-[14px]">
                {line.desc || "No description"}
              </td>
              <td className="p-4 border-r text-center border-[#DEE1EA] text-[14px]">
                ${line.unitPrice?.toFixed(2) || "0.00"}
              </td>
              <td className="p-4 text-center text-[14px]">
                ${line.totalPrice?.toFixed(2) || "0.00"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Total section below the table */}
      {data.length > 0 && (
        <div className="flex w-full justify-between items-center mt-2">
          <section className="p-4">
            <button
              className="h-10 flex items-center justify-center px-4 gap-2 font-semibold text-[14px] hover:bg-gray-50"
              onClick={onAddService}
            >
              <Plus className="size-4" />
              Add Service
            </button>
          </section>
          <section className="pr-12 text-sm font-semibold justify-end flex text-right">
            <p className="text-sm font-semibold text-right pr-10 w-full">
              Total:
            </p>
            ${totalPrice.toFixed(2)}
          </section>
        </div>
      )}
    </div>
  );
};
