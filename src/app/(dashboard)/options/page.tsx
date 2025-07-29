"use client";
import React, { useMemo, useState, useEffect } from "react";
import Image from "next/image";
import { useUser } from "@stackframe/stack";

// Define interfaces for our data structures
export interface OptionData {
  id: string;
  sign_id: string;
  option_icon: string;
  option_name: string;
  placeholder: string;
  input_type: string;
  status: string;
  values: string[];
}

// Simplified row data structure for the table
interface RowData {
  id: string;
  iconUrl: string;
  name: string;
  placeholder: string;
  type: string;
  status: string;
  values: string[];
}

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

// Values cell renderer
const ValuesCell = ({ values }: { values: string[] }) => (
  <div className="flex flex-wrap justify-start gap-1">
    {values.map((val: string, idx: number) => (
      <span
        key={idx}
        className="bg-gray-100 px-2 py-1 rounded text-xs font-medium border border-gray-300"
      >
        {val}
      </span>
    ))}
  </div>
);

const OptionsPage = () => {
  const user = useUser();
  const [tab, setTab] = useState<"all" | "active" | "archived">("all");
  const [options, setOptions] = useState<OptionData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

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
        setOptions(data.data || []);
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
      placeholder: option.placeholder,
      type: option.input_type,
      status: option.status,
      values: option.values,
    }));
  }, [filteredOptions]);

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
                  {row.placeholder}
                </td>
                <td className="p-4 border-r border-[#DEE1EA] text-center text-[14px] w-32 align-middle">
                  {row.type}
                </td>
                <td className="p-4 border-r border-[#DEE1EA] text-center w-32 align-middle">
                  <StatusCell status={row.status} />
                </td>
                <td className="p-4 text-center text-[14px] flex-1 align-middle">
                  <ValuesCell values={row.values} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="bg-white">
      <h1 className="text-2xl font-semibold p-5">Options</h1>
      <div className="flex ml-6">
        {(["all", "active", "archived"] as const).map((tabName) => (
          <button
            key={tabName}
            className={`rounded-t-md text-[16px] h-10 px-4 cursor-pointer py-2 ${
              tab === tabName
                ? "text-white text-[16px] font-semibold bg-black"
                : "text-[14px] text-[#60646C]"
            }`}
            onClick={() => setTab(tabName)}
          >
            {tabName.charAt(0).toUpperCase() + tabName.slice(1)}
          </button>
        ))}
      </div>
      <div className="border border-[#DEE1EA] overflow-hidden">
        <div>{renderTable()}</div>
      </div>
    </div>
  );
};

export default OptionsPage;
