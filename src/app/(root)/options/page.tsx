"use client";
import { useMemo, useState, useEffect, useRef } from "react";
import { useUser } from "@stackframe/stack";
import { PageTabs } from "@/components/ui/page-tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

// Define interfaces for our data structures
export interface OptionData {
  id: string;
  sign_id: string;
  option_icon: string;
  option_name: string;
  placeholder: string;
  input_type: string;
  status: string;
}

export interface OptionValue {
  id: string;
  option_id: string;
  display_label: string;
  price_modifier_type: string;
  price_modifier_value: number;
  created_at: string;
}

// Simplified row data structure for the table
interface RowData {
  id: string;
  iconUrl: string;
  name: string;
  placeholder: string;
  type: string;
  status: string;
  values: OptionValue[];
}

// Edit Option Value Dialog Component
interface EditOptionValueDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (valueName: string, addPrice: string) => void;
  initialValue: string;
}

const EditOptionValueDialog = ({
  isOpen,
  onClose,
  onUpdate,
  initialValue,
}: EditOptionValueDialogProps) => {
  const [valueName, setValueName] = useState(initialValue);
  const [addPrice, setAddPrice] = useState("");
  const valueNameRef = useRef<HTMLInputElement>(null);

  // Reset form when dialog opens
  useEffect(() => {
    if (isOpen) {
      setValueName(initialValue);
      setAddPrice("");
      // Prevent auto-focus and text selection
      setTimeout(() => {
        if (valueNameRef.current) {
          valueNameRef.current.blur();
        }
      }, 0);
    }
  }, [isOpen, initialValue]);

  const handleUpdate = () => {
    onUpdate(valueName, addPrice);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[370px]" showCloseButton={false}>
        <DialogHeader>
          <div className="flex justify-between items-start">
            <DialogTitle className="text-[16px] font-semibold">
              Edit Option Value
            </DialogTitle>
          </div>
        </DialogHeader>
        <div className="space-y-4 mt-1">
          <div>
            <Label htmlFor="valueName" className="text-sm font-medium">
              Value name
            </Label>
            <Input
              ref={valueNameRef}
              id="valueName"
              value={valueName}
              onChange={(e) => setValueName(e.target.value)}
              className="mt-1 w-full border-[#DEE1EA] focus:border-[#DEE1EA] focus:ring-0"
              autoFocus={false}
            />
          </div>
          <div>
            <Label htmlFor="addPrice" className="text-sm font-medium">
              Add Price
            </Label>
            <Input
              id="addPrice"
              value={addPrice}
              onChange={(e) => setAddPrice(e.target.value)}
              className="mt-1 w-full border-[#DEE1EA] focus:border-[#DEE1EA] focus:ring-0"
            />
          </div>
        </div>
        <section className="flex items-center text-[14px] mt-2 gap-2 font-semibold">
          <button
            onClick={onClose}
            className="bg-[#F9F9FB] h-10 w-full flex items-center justify-center px-3 gap-2 border border-[#E0E0E0] rounded-md"
          >
            Cancel
          </button>
          <button
            onClick={handleUpdate}
            className="h-10 bg-black w-full flex items-center text-white justify-center px-3 gap-2 rounded-md"
          >
            Update
          </button>
        </section>
      </DialogContent>
    </Dialog>
  );
};

// StatusCell component that handles different statuses
const StatusCell = ({ status }: { status: string }) => {
  let bgColor = "bg-[#17B26A1A]";
  let textColor = "text-[#17B26A]";

  if (status === "Draft") {
    bgColor = "bg-yellow-100";
    textColor = "text-yellow-700";
  } else if (status === "Archived") {
    bgColor = "bg-gray-100";
    textColor = "text-gray-700";
  }

  return (
    <span
      className={`${bgColor} ${textColor} h-[24px] font-semibold px-3 py-1 rounded text-[14px]`}
    >
      {status}
    </span>
  );
};

// Option icon cell renderer
const OptionIconCell = ({
  src,
  optionName,
}: {
  src: string;
  optionName: string;
}) => {
  const [imgError, setImgError] = useState(false);

  // Return a simple colored div with initials if image fails to load
  if (imgError || !src) {
    const initials = optionName
      .split(" ")
      .map((word: string) => word[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);

    return (
      <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-200 text-gray-600 text-sm font-medium">
        {initials}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={`${optionName} Icon`}
      className="object-contain"
      onError={() => setImgError(true)}
    />
  );
};

// Values cell renderer with clickable values
const ValuesCell = ({
  values,
  onValueClick,
}: {
  values: { display_label: string; price_modifier_value?: number; price_modifier_type?: string }[];
  onValueClick: (value: string) => void;
}) => (
  <div className="flex flex-wrap justify-start gap-1">
    {values && values.length > 0 ? (
      values.map((val, idx: number) => {
        const displayText = val.price_modifier_value !== undefined && val.price_modifier_value !== null
          ? `${val.display_label} | +${val.price_modifier_value}${val.price_modifier_type === 'Percentage' ? '%' : ''}`
          : val.display_label;
        
        return (
          <button
            key={idx}
            className="bg-[#F9F9FB] px-2 py-1 rounded text-xs font-medium border border-[#E0E0E0] cursor-pointer hover:bg-gray-200 transition-colors"
            onClick={() => onValueClick(displayText)}
          >
            {displayText}
          </button>
        );
      })
    ) : (
      <span className="text-gray-500 text-xs">N/A</span>
    )}
  </div>
);

const OptionsPage = () => {
  const user = useUser();
  const [tab, setTab] = useState<"all" | "active" | "archived">("all");
  const [options, setOptions] = useState<OptionData[]>([]);
  const [optionValues, setOptionValues] = useState<{ [optionId: string]: OptionValue[] }>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");

  // Fetch options data when component mounts or user changes
  useEffect(() => {
    const fetchOptions = async () => {
      if (!user) return; // Don't fetch if user is not available
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/options", {
          headers: { "request.user.id": user.id },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch options");
        }

        const data = await res.json();
        const optionsData = data.data || [];
        setOptions(optionsData);

        // Fetch option values for each option
        const valuesData: { [optionId: string]: OptionValue[] } = {};
        for (const option of optionsData) {
          try {
            const valuesRes = await fetch(`/api/option-values/get-by-optionId?option_id=${option.id}`);
            if (valuesRes.ok) {
              const valuesDataRes = await valuesRes.json();
              valuesData[option.id] = valuesDataRes.data || [];
            }
          } catch (error) {
            console.error(`Error fetching values for option ${option.id}:`, error);
            valuesData[option.id] = [];
          }
        }
        setOptionValues(valuesData);
      } catch (error) {
        console.error("Error fetching options:", error);
        setError(
          error instanceof Error ? error.message : "An unknown error occurred"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOptions();
  }, [user]);

  // Filter options based on the selected tab
  const filteredOptions = useMemo(() => {
    if (tab === "all") return options;
    return options.filter((option) =>
      tab === "active"
        ? option.status === "Active" || option.status === "Draft"
        : option.status === "Archived"
    );
  }, [options, tab]);

  // Transform API data to match the table structure
  const rowData: RowData[] = useMemo(() => {
    return filteredOptions.map((option) => ({
      id: option.id,
      iconUrl: option.option_icon,
      name: option.option_name,
      placeholder: option?.placeholder,
      type: option.input_type,
      status: option.status,
      values: optionValues[option.id] || [],
    }));
  }, [filteredOptions, optionValues]);

  // --- Selection Handlers ---
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedRows(rowData.map((row) => row.id));
    } else {
      setSelectedRows([]);
    }
  };

  const handleRowSelect = (id: string) => {
    setSelectedRows((prev) =>
      prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
    );
  };

  // Handle value click to open edit dialog
  const handleValueClick = (value: string) => {
    setSelectedValue(value);
    setEditDialogOpen(true);
  };

  // Handle dialog update
  const handleUpdateValue = (valueName: string, addPrice: string) => {
    console.log("Updated value:", { valueName, addPrice });
  };

  const isAllSelected =
    rowData.length > 0 && selectedRows.length === rowData.length;

  const renderTable = () => {
    if (loading) {
      return <div className="p-4 text-center">Loading options...</div>;
    }
    if (error) {
      return <div className="p-4 text-center text-red-500">Error: {error}</div>;
    }
    if (rowData.length === 0) {
      return <div className="p-4 text-center">No options found.</div>;
    }
    return (
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead className="bg-[#F9F9FB] font-semibold">
            <tr className="border-b border-[#DEE1EA] h-[50px] font-semibold text-[14px]">
              <th className="w-16 border-r border-[#DEE1EA]">
                <div className="flex items-center justify-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 border-[#DEE1EA] text-gray-400"
                    onChange={handleSelectAll}
                    checked={isAllSelected}
                  />
                </div>
              </th>
              <th className="p-4 text-center text-[12px] font-semibold border-r border-[#DEE1EA] w-32">
                Options Icon
              </th>
              <th className="p-4 text-center text-[12px] font-semibold border-r border-[#DEE1EA] text-base w-48">
                Option Name
              </th>
              <th className="p-4 text-center text-[12px] font-semibold border-r border-[#DEE1EA] w-56">
                Placeholder
              </th>
              <th className="p-4 text-center text-[12px] font-semibold border-r border-[#DEE1EA] w-32">
                Type
              </th>
              <th className="p-4 text-center text-[12px] font-semibold border-r border-[#DEE1EA] w-32">
                Status
              </th>
              <th className="p-4 text-center text-[12px] font-semibold text-base flex-1">
                Values
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {rowData.map((row) => (
              <tr
                key={row.id}
                className="hover:bg-gray-50 min-h-10 h-full text-[14px]"
              >
                <td className="p-4 text-center border-r border-[#DEE1EA] align-middle">
                  <div className="flex items-center justify-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 border-[#DEE1EA] text-gray-400"
                      checked={selectedRows.includes(row.id)}
                      onChange={() => handleRowSelect(row.id)}
                    />
                  </div>
                </td>
                <td className="border-r border-[#DEE1EA] align-middle w-32">
                  <div className="flex items-center justify-center h-full">
                    <OptionIconCell src={row.iconUrl} optionName={row.name} />
                  </div>
                </td>
                <td className="p-4 font-semibold border-r border-[#DEE1EA] text-[14px] w-48 text-center align-middle">
                  {row.name}
                </td>
                <td className="p-4 border-r text-center border-[#DEE1EA] text-[14px] w-56 align-middle">
                  {row?.placeholder}
                </td>
                <td className="p-4 border-r border-[#DEE1EA] text-center text-[14px] w-32 align-middle">
                  {row.type}
                </td>
                <td className="p-4 border-r border-[#DEE1EA] text-center w-32 align-middle">
                  <StatusCell status={row.status} />
                </td>
                <td className="p-4 text-center text-[14px] flex-1 align-middle">
                  <ValuesCell
                    values={row.values}
                    onValueClick={handleValueClick}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const tabs = ["all", "active", "archived"];

  return (
    <div className="bg-white">
      <h1 className="text-2xl font-semibold p-5">Options</h1>
      <PageTabs
        tabs={tabs}
        activeTab={tab}
        onTabChange={(tab) => setTab(tab as "all" | "active" | "archived")}
      />
      <div className="border border-[#DEE1EA] overflow-hidden">
        <div>{renderTable()}</div>
      </div>

      <EditOptionValueDialog
        isOpen={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        onUpdate={handleUpdateValue}
        initialValue={selectedValue}
      />
    </div>
  );
};

export default OptionsPage;
