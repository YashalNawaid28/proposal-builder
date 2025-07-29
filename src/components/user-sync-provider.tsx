"use client";
import { useUserSync } from "../hooks/useUserSync";

interface UserSyncProviderProps {
  children: React.ReactNode;
}

export function UserSyncProvider({
  children,
}: Readonly<UserSyncProviderProps>) {
  useUserSync();
  return <>{children}</>;
}
