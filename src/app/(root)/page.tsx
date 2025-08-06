"use client";
import { useAuth } from "../../components/supabase-auth-provider";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from 'next/link';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.push("/jobs");
      } else {
        router.push("/auth/sign-in");
      }
    }
  }, [user, loading, router]);

  // Show loading state while checking authentication
  return (
    <main>
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
      <Link href="/api-tester">Go to API Tester</Link>
    </main>
  );
}
