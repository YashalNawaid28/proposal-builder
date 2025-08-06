"use client";

import { useAuth } from "../../../components/supabase-auth-provider";

export default function BrandsPage() {
  const { user } = useAuth();

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Brands</h1>
        <p className="text-gray-600">Manage your brands</p>
      </div>
      {/* Add your brands content here */}
    </div>
  );
}
