"use client";

import { useState } from "react";
import { useAuth } from "../supabase-auth-provider";

interface SignConfigurationStepProps {
  jobId?: string;
  onComplete?: () => void;
}

export function SignConfigurationStep({
  jobId,
  onComplete,
}: SignConfigurationStepProps) {
  const [loading, setLoading] = useState(false);

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          Sign Configuration
        </h2>
        <p className="text-gray-600">Configure signs for this job</p>
      </div>

      <div className="space-y-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium text-gray-900 mb-2">Sign Details</h3>
          <p className="text-sm text-gray-600">
            Configure the signs and their specifications for this job.
          </p>
        </div>

        {/* Add your sign configuration form here */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sign Type
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Select sign type</option>
              <option value="channel-letter">Channel Letter</option>
              <option value="pylon">Pylon Sign</option>
              <option value="monument">Monument Sign</option>
              <option value="wall">Wall Sign</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dimensions
            </label>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Width"
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                placeholder="Height"
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Materials
            </label>
            <textarea
              placeholder="Describe materials and specifications"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3 mt-6">
        <button
          onClick={() => onComplete?.()}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Configuration"}
        </button>
      </div>
    </div>
  );
}
