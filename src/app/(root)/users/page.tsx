"use client";
import { useMemo, useState, useEffect } from "react";
import { PageTabs } from "@/components/ui/page-tabs";

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
  const safeStatus = status || "Active";
  let bgColor = "bg-[#17B26A1A]";
  let textColor = "text-[#17B26A]";

  if (safeStatus === "Disabled" || safeStatus === "Inactive") {
    bgColor = "bg-gray-100";
    textColor = "text-gray-700";
  }

  return (
    <span
      className={`${bgColor} ${textColor} h-[24px] font-semibold px-3 py-1 rounded text-[14px]`}
    >
      {safeStatus}
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

  // Always show initials if no image URL or if image failed to load
  if (!src || src.trim() === "" || imgError) {
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
    <span className="font-semibold text-[14px]">
      {userName || "Unknown User"}
    </span>
    <span className="text-[12px] text-gray-500">
      {email || "No email provided"}
    </span>
  </div>
);

const UsersPage = () => {
  const [tab, setTab] = useState<"all" | "active" | "disabled">("all");
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/users");

        if (!response.ok) {
          throw new Error("Failed to fetch users");
        }

        const result = await response.json();

        if (result.error) {
          throw new Error(result.error);
        }

        // Transform the data to match our UserData interface with safe fallbacks
        const transformedUsers: UserData[] = (result.data || []).map(
          (user: any) => ({
            id:
              user?.id || `user-${Math.random().toString(36).substring(2, 11)}`,
            user_image:
              user?.user_image || user?.avatar_url || user?.profile_image || "",
            user_name:
              user?.user_name ||
              user?.full_name ||
              user?.name ||
              user?.display_name ||
              "Unknown User",
            email: user?.email || user?.email_address || "",
            job_title:
              user?.job_title || user?.title || user?.position || "Employee",
            status: user?.status || "Active",
            role: user?.role || user?.user_role || "Employee",
            jobs: typeof user?.jobs === "number" ? user.jobs : 0,
            date_added:
              user?.date_added ||
              (user?.created_at
                ? new Date(user.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })
                : "Unknown"),
          })
        );

        setUsers(transformedUsers);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error("Error fetching users:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Filter users based on the selected tab
  const filteredUsers = useMemo(() => {
    if (tab === "all") return users;
    return users.filter((user) =>
      tab === "active" ? user.status === "Active" : user.status === "Disabled"
    );
  }, [users, tab]);

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
    if (loading) {
      return (
        <div className="p-4 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading users...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="p-4 text-center">
          <p className="text-red-600">Error: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retry
          </button>
        </div>
      );
    }

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
                  {row.jobTitle || "Employee"}
                </td>
                <td className="p-4 text-center border-r border-[#DEE1EA]">
                  <StatusCell status={row.status} />
                </td>
                <td className="p-4 text-center border-r border-[#DEE1EA] text-[14px]">
                  {row.role || "Employee"}
                </td>
                <td className="p-4 text-center border-r border-[#DEE1EA] text-[14px]">
                  {row.jobs || 0} Jobs
                </td>
                <td className="p-4 text-center text-[14px]">
                  {row.dateAdded || "Unknown"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const tabs = ["all", "active", "disabled"];

  return (
    <div className="bg-white">
      <div className="flex justify-between items-center p-5">
        <h1 className="text-2xl font-semibold">Users</h1>
        <button className="bg-black text-white px-4 py-2 rounded-lg font-medium">
          New Users
        </button>
      </div>
      <PageTabs
        tabs={tabs}
        activeTab={tab}
        onTabChange={(tab) => setTab(tab as "all" | "active" | "disabled")}
      />
      <div className="border border-[#DEE1EA] overflow-hidden">
        <div>{renderTable()}</div>
      </div>
    </div>
  );
};

export default UsersPage;
