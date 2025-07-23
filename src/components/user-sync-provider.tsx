"use client";

import { useUserSync } from "../hooks/useUserSync";

interface UserSyncProviderProps {
  children: React.ReactNode;
}

export function UserSyncProvider({ children }: UserSyncProviderProps) {
  // This will automatically sync the user when they are authenticated
  useUserSync();

  return <>{children}</>;
} 