"use client";
import React, { useMemo, useState } from "react";

// Define interfaces for our data structures
export interface UserData {
  id: string;
  user_image: string;
  user_name: string;
  email: string;
  job_title: string;
  status: string;
  role: string;
  jobs: number;
  date_added: string;
}

// Simplified row data structure for the table
interface RowData {
  id: string;
  userImage: string;
  userName: string;
  email: string;
  jobTitle: string;
  status: string;
  role: string;
  jobs: number;
  dateAdded: string;
}

// StatusCell component that handles different statuses
const StatusCell = ({ status }: { status: string }) => {
  let bgColor = "bg-[#17B26A1A]";
  let textColor = "text-[#17B26A]";

  if (status === "Disabled") {
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

// User image cell renderer
const UserImageCell = ({
  src,
  userName,
}: {
  src: string;
  userName: string;
}) => {
  const [imgError, setImgError] = useState(false);

  // Return a simple colored div with initials if image fails to load
  if (imgError || !src) {
    const initials = userName
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
      alt={`${userName} Profile`}
      className="h-10 w-10 rounded-full object-cover"
      onError={() => setImgError(true)}
    />
  );
};

// User name cell renderer
const UserNameCell = ({
  userName,
  email,
}: {
  userName: string;
  email: string;
}) => (
  <div className="flex flex-col items-start">
    <span className="font-semibold text-[14px]">{userName}</span>
    <span className="text-[12px] text-gray-500">{email}</span>
  </div>
);

const UsersPage = () => {
  const [tab, setTab] = useState<"all" | "active" | "disabled">("all");
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  // Dummy data for users
  const dummyUsers: UserData[] = [
    {
      id: "1",
      user_image:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=40&h=40&fit=crop&crop=face",
      user_name: "Jeannette Diaz",
      email: "Jeannette@visiblegraphics.com",
      job_title: "Office Supervisor",
      status: "Active",
      role: "Employee",
      jobs: 0,
      date_added: "Aug 1st, 2025",
    },
    {
      id: "2",
      user_image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face",
      user_name: "Mary Del Rio",
      email: "Mary@visiblegraphics.com",
      job_title: "Project Coordinator",
      status: "Active",
      role: "Employee",
      jobs: 0,
      date_added: "Aug 1st, 2025",
    },
    {
      id: "3",
      user_image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
      user_name: "John Smith",
      email: "john@visiblegraphics.com",
      job_title: "Design Manager",
      status: "Active",
      role: "Manager",
      jobs: 5,
      date_added: "Jul 15th, 2025",
    },
    {
      id: "4",
      user_image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
      user_name: "David Wilson",
      email: "david@visiblegraphics.com",
      job_title: "Senior Designer",
      status: "Disabled",
      role: "Employee",
      jobs: 2,
      date_added: "Jun 20th, 2025",
    },
  ];

  // Filter users based on the selected tab
  const filteredUsers = useMemo(() => {
    if (tab === "all") return dummyUsers;
    return dummyUsers.filter((user) =>
      tab === "active" ? user.status === "Active" : user.status === "Disabled"
    );
  }, [tab]);

  // Transform API data to match the table structure
  const rowData: RowData[] = useMemo(() => {
    return filteredUsers.map((user) => ({
      id: user.id,
      userImage: user.user_image,
      userName: user.user_name,
      email: user.email,
      jobTitle: user.job_title,
      status: user.status,
      role: user.role,
      jobs: user.jobs,
      dateAdded: user.date_added,
    }));
  }, [filteredUsers]);

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
    if (rowData.length === 0) {
      return <div className="p-4 text-center">No users found.</div>;
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
              <th className="p-4 text-center text-[12px] font-semibold border-r border-[#DEE1EA]">
                User Image
              </th>
              <th className="p-4 text-center text-[12px] font-semibold border-r border-[#DEE1EA] text-base min-w-[200px]">
                User Name
              </th>
              <th className="p-4 text-center text-[12px] font-semibold border-r border-[#DEE1EA]">
                Job Title
              </th>
              <th className="p-4 text-center text-[12px] font-semibold border-r border-[#DEE1EA]">
                Status
              </th>
              <th className="p-4 text-center text-[12px] font-semibold border-r border-[#DEE1EA]">
                Role
              </th>
              <th className="p-4 text-center text-[12px] font-semibold border-r border-[#DEE1EA]">
                Jobs
              </th>
              <th className="p-4 text-center text-[12px] font-semibold text-base">
                Date Added
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {rowData.map((row) => (
              <tr key={row.id} className="hover:bg-gray-50 h-20 text-[14px]">
                <td className="p-4 text-center border-r border-[#DEE1EA] w-16">
                  <div className="flex items-center justify-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 border-[#DEE1EA] text-gray-400"
                      checked={selectedRows.includes(row.id)}
                      onChange={() => handleRowSelect(row.id)}
                    />
                  </div>
                </td>
                <td className="p-4 text-center border-r border-[#DEE1EA]">
                  <div className="flex items-center justify-center">
                    <UserImageCell
                      src={row.userImage}
                      userName={row.userName}
                    />
                  </div>
                </td>
                <td className="p-4 text-center border-r border-[#DEE1EA] text-[14px] min-w-[200px]">
                  <UserNameCell userName={row.userName} email={row.email} />
                </td>
                <td className="p-4 text-center border-r border-[#DEE1EA] text-[14px]">
                  {row.jobTitle}
                </td>
                <td className="p-4 text-center border-r border-[#DEE1EA]">
                  <StatusCell status={row.status} />
                </td>
                <td className="p-4 text-center border-r border-[#DEE1EA] text-[14px]">
                  {row.role}
                </td>
                <td className="p-4 text-center border-r border-[#DEE1EA] text-[14px]">
                  {row.jobs} Jobs
                </td>
                <td className="p-4 text-center text-[14px]">{row.dateAdded}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="bg-white">
      <div className="flex justify-between items-center p-5">
        <h1 className="text-2xl font-semibold">Users</h1>
        <button className="bg-black text-white px-4 py-2 rounded-lg font-medium">
          New Users
        </button>
      </div>
      <div className="flex ml-6">
        {(["all", "active", "disabled"] as const).map((tabName) => (
          <button
            key={tabName}
            className={`rounded-t-lg px-4 cursor-pointer py-2 ${
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

export default UsersPage;
