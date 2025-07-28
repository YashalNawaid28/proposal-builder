import { UserSyncProvider } from "../../components/user-sync-provider";
import { CustomSidebar } from "@/components/custom-sidebar";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <UserSyncProvider>
      <div className="flex h-screen">
        <CustomSidebar />
        <div className="flex-1 overflow-auto">{children}</div>
      </div>
    </UserSyncProvider>
  );
}
