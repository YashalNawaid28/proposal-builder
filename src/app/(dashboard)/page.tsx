"use client";
import { useUser } from "@stackframe/stack";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const user = useUser();
  const router = useRouter();
  console.log(user);

  useEffect(() => {
    if (user?.id) {
      router.push("/dashboard");
    } else {
      router.push("/handler/sign-in");
    }
  }, [user]);

  // Show loading state while checking authentication
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  );
}
