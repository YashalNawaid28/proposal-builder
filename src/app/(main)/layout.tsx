import { UserSyncProvider } from "../../components/user-sync-provider";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserSyncProvider>
      {children}
    </UserSyncProvider>
  );
} 