"use client";
import { useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function SetUserRole() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const role = searchParams.get("role");
    const email = searchParams.get("email");

    if (role && email) {
      // Save role and email in localStorage
      localStorage.setItem("userRole", role);
      localStorage.setItem("userEmail", email);
      console.log("User role saved to localStorage:", role);
    }

    // Redirect to jobs page
    router.replace("/jobs");
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
        <p className="text-gray-600">Setting up your session...</p>
      </div>
    </div>
  );
} 