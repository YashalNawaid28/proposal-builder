"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isUserAdmin } from "@/lib/admin-utils";

interface AdminGuardProps {
  children: React.ReactNode;
}

export function AdminGuard({ children }: AdminGuardProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAdminAccess = () => {
      const isAdmin = isUserAdmin();
      
      if (!isAdmin) {
        console.log("Non-admin user trying to access admin page, redirecting to /jobs");
        router.replace("/jobs");
        return;
      }
      
      setIsLoading(false);
    };

    checkAdminAccess();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking permissions...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
} 