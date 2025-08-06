"use client";

import { useState } from "react";
import { Drawer } from "react-modern-drawer";
import "react-modern-drawer/dist/index.css";
import { X } from "lucide-react";
import { useAuth } from "../supabase-auth-provider";

interface EditPricingLineDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  pricingLineId?: string;
}

export function EditPricingLineDrawer({
  isOpen,
  onClose,
  pricingLineId,
}: EditPricingLineDrawerProps) {
  const [loading, setLoading] = useState(false);

  return (
    <Drawer
      open={isOpen}
      onClose={onClose}
      direction="right"
      className="!w-[600px]"
    >
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold">
            {pricingLineId ? "Edit Pricing Line" : "New Pricing Line"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          <p className="text-gray-600 mb-4">
            {pricingLineId
              ? "Edit the pricing line details below."
              : "Create a new pricing line by filling out the form below."}
          </p>

          {/* Add your form content here */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter pricing line name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="Enter description"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200">
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                // Handle save logic
                onClose();
              }}
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>
    </Drawer>
  );
}
