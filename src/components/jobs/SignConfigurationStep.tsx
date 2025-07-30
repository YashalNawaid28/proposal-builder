"use client";
import { ArrowLeft, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SignOption, SignData } from "./AddSignServiceSidebar";

interface SignConfigurationStepProps {
  selectedSign: SignOption | null;
  signData: SignData;
  setSignData: (data: SignData) => void;
  onBack: () => void;
  onClose: () => void;
}

export const SignConfigurationStep = ({
  selectedSign,
  signData,
  setSignData,
  onBack,
  onClose,
}: SignConfigurationStepProps) => {
  return (
    <div className="h-full flex flex-col">
      {/* Header with blue bar */}
      <div className="bg-blue-600 h-1"></div>
      <div className="flex items-center justify-between p-4 border-b border-[#DEE1EA] bg-white">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="size-5" />
          </button>
          <h2 className="text-[20px] font-bold">Add New</h2>
        </div>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X className="size-5" />
        </button>
      </div>

             {/* Sign Preview */}
       <div className="p-4 border-b border-[#DEE1EA] bg-white">
         <div className="bg-white border border-[#E0E0E0] rounded-lg p-3 mb-3">
           <div className="h-16 bg-gray-100 rounded flex items-center justify-center overflow-hidden">
             {selectedSign && (
               <img
                 src={selectedSign.image}
                 alt={selectedSign.name}
                 className="w-full h-full object-contain"
               />
             )}
           </div>
         </div>
         <div className="flex items-center justify-between">
           <span className="text-[14px] font-medium">{selectedSign?.name}</span>
           <button className="bg-[#F9F9FB] px-3 py-1 rounded text-xs font-medium border border-[#E0E0E0]">
             Qty
           </button>
         </div>
       </div>

      {/* Form */}
      <div className="flex-1 p-4 overflow-y-auto bg-white">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label className="text-[14px] font-medium">Size</Label>
            <Select
              value={signData.size}
              onValueChange={(value) =>
                setSignData({ ...signData, size: value })
              }
            >
              <SelectTrigger className="w-48 border-[#DEE1EA] focus:border-[#DEE1EA] focus:ring-0">
                <SelectValue placeholder="" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="small">Small</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="large">Large</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <Label className="text-[14px] font-medium">Color</Label>
            <Select
              value={signData.color}
              onValueChange={(value) =>
                setSignData({ ...signData, color: value })
              }
            >
              <SelectTrigger className="w-48 border-[#DEE1EA] focus:border-[#DEE1EA] focus:ring-0">
                <SelectValue placeholder="" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="red">Red</SelectItem>
                <SelectItem value="blue">Blue</SelectItem>
                <SelectItem value="green">Green</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <Label className="text-[14px] font-medium">Fab Type</Label>
            <Select
              value={signData.fabType}
              onValueChange={(value) =>
                setSignData({ ...signData, fabType: value })
              }
            >
              <SelectTrigger className="w-48 border-[#DEE1EA] focus:border-[#DEE1EA] focus:ring-0">
                <SelectValue placeholder="" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="aluminum">Aluminum</SelectItem>
                <SelectItem value="steel">Steel</SelectItem>
                <SelectItem value="plastic">Plastic</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center justify-between">
            <Label className="text-[14px] font-medium">Raceway</Label>
            <Select
              value={signData.raceway}
              onValueChange={(value) =>
                setSignData({ ...signData, raceway: value })
              }
            >
              <SelectTrigger className="w-48 border-[#DEE1EA] focus:border-[#DEE1EA] focus:ring-0">
                <SelectValue placeholder="" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="standard">Standard</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-[14px] font-medium">Raceway Size</Label>
            <div className="flex items-center gap-2 mt-1 justify-end">
              <div className="w-16">
                <Input
                  value={signData.racewaySize.height.value}
                  onChange={(e) =>
                    setSignData({
                      ...signData,
                      racewaySize: {
                        ...signData.racewaySize,
                        height: {
                          ...signData.racewaySize.height,
                          value: e.target.value,
                        },
                      },
                    })
                  }
                  className="border-[#DEE1EA] focus:border-[#DEE1EA] focus:ring-0 text-center"
                  placeholder=""
                />
              </div>
              <span className="text-[12px] text-gray-500">ft</span>
              <span className="text-gray-500">-</span>
              <div className="w-16">
                <Input
                  value={signData.racewaySize.height.value}
                  onChange={(e) =>
                    setSignData({
                      ...signData,
                      racewaySize: {
                        ...signData.racewaySize,
                        height: {
                          ...signData.racewaySize.height,
                          value: e.target.value,
                        },
                      },
                    })
                  }
                  className="border-[#DEE1EA] focus:border-[#DEE1EA] focus:ring-0 text-center"
                  placeholder=""
                />
              </div>
              <span className="text-[12px] text-gray-500">in</span>
              <span className="text-gray-500 mx-2">x</span>
              <div className="w-16">
                <Input
                  value={signData.racewaySize.width.value}
                  onChange={(e) =>
                    setSignData({
                      ...signData,
                      racewaySize: {
                        ...signData.racewaySize,
                        width: {
                          ...signData.racewaySize.width,
                          value: e.target.value,
                        },
                      },
                    })
                  }
                  className="border-[#DEE1EA] focus:border-[#DEE1EA] focus:ring-0 text-center"
                  placeholder=""
                />
              </div>
              <span className="text-[12px] text-gray-500">ft</span>
              <span className="text-gray-500">-</span>
              <div className="w-16">
                <Input
                  value={signData.racewaySize.width.value}
                  onChange={(e) =>
                    setSignData({
                      ...signData,
                      racewaySize: {
                        ...signData.racewaySize,
                        width: {
                          ...signData.racewaySize.width,
                          value: e.target.value,
                        },
                      },
                    })
                  }
                  className="border-[#DEE1EA] focus:border-[#DEE1EA] focus:ring-0 text-center"
                  placeholder=""
                />
              </div>
              <span className="text-[12px] text-gray-500">in</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 bg-[#2C2C2C] text-white">
        <div className="space-y-2 mb-4">
          <div className="flex justify-between">
            <span className="text-[14px] text-gray-300">Sign Price</span>
            <span className="text-[14px] font-medium">$3520.00</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[14px] text-gray-300">Install Price</span>
            <span className="text-[14px] font-medium">$1970.00</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[14px] text-gray-300">Sign Budget</span>
            <span className="text-[14px] font-medium">$1936.00</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[14px] text-gray-300">Install Budget</span>
            <span className="text-[14px] font-medium">$1083.00</span>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="flex-1 py-2 px-3 border border-white text-white text-[14px] font-medium rounded bg-transparent hover:bg-white hover:text-black transition-colors">
            Edit Prices
          </button>
          <button className="flex-1 py-2 px-3 bg-[#4A4A4A] text-gray-300 text-[14px] font-medium rounded">
            Add Sign
          </button>
        </div>
      </div>
    </div>
  );
};
