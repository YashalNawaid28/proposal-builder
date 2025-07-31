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
import { useState } from "react";

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
  const [isEditingPrices, setIsEditingPrices] = useState(false);
  const [editablePrices, setEditablePrices] = useState({
    signPrice: "3520.00",
    installPrice: "1970.00",
    signBudget: "1936.00",
    installBudget: "1083.00",
  });

  const handleSizeChange = (value: string) => {
    setSignData({ ...signData, size: value });
  };
  const handleColorChange = (value: string) => {
    setSignData({ ...signData, color: value });
  };
  const handleFabTypeChange = (value: string) => {
    setSignData({ ...signData, fabType: value });
  };
  const handleRacewayChange = (value: string) => {
    setSignData({ ...signData, raceway: value });
  };

  const handleEditPrices = () => {
    setIsEditingPrices(true);
  };

  const handleSavePrices = () => {
    setIsEditingPrices(false);
    // Here you could save the prices to your backend
    console.log("Saving prices:", editablePrices);
  };

  const handlePriceChange = (
    field: keyof typeof editablePrices,
    value: string
  ) => {
    setEditablePrices((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header with blue bar */}
      <section className="flex items-center justify-between p-4 border-b border-[#DEE1EA] bg-white">
        <button onClick={onBack}>
          <ArrowLeft className="size-5" />
        </button>
        <h2 className="text-[20px] font-bold">Add New</h2>
        <button onClick={onClose}>
          <X className="size-5" />
        </button>
      </section>
      {/* Sign Preview */}
      <section className="p-4 flex items-center">
        <div className="h-20 w-[130px] p-3 bg-[#F3F4F8] rounded-lg flex items-center justify-center">
          {selectedSign && <img src={selectedSign.image} alt="" />}
        </div>
        <span className="text-[14px] ml-3 font-medium">
          {selectedSign?.name}
        </span>

        <Input
          className="h-9 border-[#E0E0E0] w-12 ml-auto focus:border-[#E0E0E0] focus:ring-0 text-center"
          placeholder="Qty"
        />
      </section>
      {/* Form */}
      <section className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <Label className="text-[14px] font-[500] text-[#60646C]">
              Size
            </Label>
            <Select value={signData.size} onValueChange={handleSizeChange}>
              <SelectTrigger className="h-9 w-auto min-w-[80px] border-[#DEE1EA] focus:border-[#DEE1EA] focus:ring-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent
                className="z-[9999]"
                position="popper"
                side="bottom"
                align="end"
              >
                <SelectItem value="12">12</SelectItem>
                <SelectItem value="18">18</SelectItem>
                <SelectItem value="24">24</SelectItem>
                <SelectItem value="36">36</SelectItem>
                <SelectItem value="48">48</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-[14px] font-[500] text-[#60646C]">
              Color
            </Label>
            <Select value={signData.color} onValueChange={handleColorChange}>
              <SelectTrigger className="h-9 w-auto min-w-[80px] border-[#DEE1EA] focus:border-[#DEE1EA] focus:ring-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent
                className="z-[9999]"
                position="popper"
                side="bottom"
                align="end"
              >
                <SelectItem value="Red">Red</SelectItem>
                <SelectItem value="Blue">Blue</SelectItem>
                <SelectItem value="Green">Green</SelectItem>
                <SelectItem value="Yellow">Yellow</SelectItem>
                <SelectItem value="White">White</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-[14px] font-[500] text-[#60646C]">
              Fab Type
            </Label>
            <Select
              value={signData.fabType}
              onValueChange={handleFabTypeChange}
            >
              <SelectTrigger className="h-9 w-auto min-w-[100px] border-[#DEE1EA] focus:border-[#DEE1EA] focus:ring-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent
                className="z-[9999]"
                position="popper"
                side="bottom"
                align="end"
              >
                <SelectItem value="Halo-Lit">Halo-Lit</SelectItem>
                <SelectItem value="Channel-Lit">Channel-Lit</SelectItem>
                <SelectItem value="Back-Lit">Back-Lit</SelectItem>
                <SelectItem value="Front-Lit">Front-Lit</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-[14px] font-[500] text-[#60646C]">
              Raceway
            </Label>
            <Select
              value={signData.raceway}
              onValueChange={handleRacewayChange}
            >
              <SelectTrigger className="h-9 w-auto min-w-[140px] border-[#DEE1EA] focus:border-[#DEE1EA] focus:ring-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent
                className="z-[9999]"
                position="popper"
                side="bottom"
                align="end"
              >
                <SelectItem value="Raceway-Mounted">Raceway-Mounted</SelectItem>
                <SelectItem value="Direct-Mounted">Direct-Mounted</SelectItem>
                <SelectItem value="Pole-Mounted">Pole-Mounted</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between">
            <Label className="text-[14px] font-[500] text-[#60646C]">
              Raceway Size
            </Label>
            <div className="flex items-center">
              <section className="flex flex-col gap-2 items-center justify-between">
                <Label className="text-[14px] font-[400] text-[#60646C]">
                  Height
                </Label>
                <div className="flex items-center gap-1">
                  <div className="w-12">
                    <Input
                      value={signData.racewaySize.height.feet}
                      onChange={(e) =>
                        setSignData({
                          ...signData,
                          racewaySize: {
                            ...signData.racewaySize,
                            height: {
                              ...signData.racewaySize.height,
                              feet: e.target.value,
                            },
                          },
                        })
                      }
                      className="h-9 border-[#DEE1EA] focus:border-[#DEE1EA] focus:ring-0 text-center"
                      placeholder=""
                    />
                  </div>
                  <span className="text-gray-500">-</span>
                  <div className="w-12">
                    <Input
                      value={signData.racewaySize.height.inches}
                      onChange={(e) =>
                        setSignData({
                          ...signData,
                          racewaySize: {
                            ...signData.racewaySize,
                            height: {
                              ...signData.racewaySize.height,
                              inches: e.target.value,
                            },
                          },
                        })
                      }
                      className="h-9 border-[#DEE1EA] focus:border-[#DEE1EA] focus:ring-0 text-center"
                      placeholder=""
                    />
                  </div>
                </div>
              </section>
              <span className="text-gray-500 mx-2 mt-6">×</span>
              <section className="flex flex-col gap-2 items-center justify-between">
                <Label className="text-[14px] font-[400] text-[#60646C]">
                  Width
                </Label>
                <div className="flex items-center gap-1">
                  <div className="w-12">
                    <Input
                      value={signData.racewaySize.width.feet}
                      onChange={(e) =>
                        setSignData({
                          ...signData,
                          racewaySize: {
                            ...signData.racewaySize,
                            width: {
                              ...signData.racewaySize.width,
                              feet: e.target.value,
                            },
                          },
                        })
                      }
                      className="h-9 border-[#DEE1EA] focus:border-[#DEE1EA] focus:ring-0 text-center"
                      placeholder=""
                    />
                  </div>
                  <span className="text-gray-500">-</span>
                  <div className="w-12">
                    <Input
                      value={signData.racewaySize.width.inches}
                      onChange={(e) =>
                        setSignData({
                          ...signData,
                          racewaySize: {
                            ...signData.racewaySize,
                            width: {
                              ...signData.racewaySize.width,
                              inches: e.target.value,
                            },
                          },
                        })
                      }
                      className="h-9 border-[#DEE1EA] focus:border-[#DEE1EA] focus:ring-0 text-center"
                      placeholder=""
                    />
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </section>
      {/* Footer */}
      <section className="p-4 bg-black text-white">
        <div className="space-y-4 mb-4">
          <div className="flex justify-between items-center">
            <span className="text-[14px] font-[500]">Sign Price</span>
            {isEditingPrices ? (
              <div className="flex items-center">
                <span className="text-[16px] font-[800] mr-1">$</span>
                <Input
                  value={editablePrices.signPrice}
                  onChange={(e) =>
                    handlePriceChange("signPrice", e.target.value)
                  }
                  className="h-8 w-20 border-[#DEE1EA] bg-transparent text-white text-[16px] font-[800] focus:border-[#DEE1EA] focus:ring-0 text-center"
                />
              </div>
            ) : (
              <span className="text-[16px] font-[800]">
                ${editablePrices.signPrice}
              </span>
            )}
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[14px] font-[500]">Install Price</span>
            {isEditingPrices ? (
              <div className="flex items-center">
                <span className="text-[16px] font-[800] mr-1">$</span>
                <Input
                  value={editablePrices.installPrice}
                  onChange={(e) =>
                    handlePriceChange("installPrice", e.target.value)
                  }
                  className="h-8 w-20 border-[#DEE1EA] bg-transparent text-white text-[16px] font-[800] focus:border-[#DEE1EA] focus:ring-0 text-center"
                />
              </div>
            ) : (
              <span className="text-[16px] font-[800]">
                ${editablePrices.installPrice}
              </span>
            )}
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[14px] font-[500]">Sign Budget</span>
            {isEditingPrices ? (
              <div className="flex items-center">
                <span className="text-[16px] font-[800] mr-1">$</span>
                <Input
                  value={editablePrices.signBudget}
                  onChange={(e) =>
                    handlePriceChange("signBudget", e.target.value)
                  }
                  className="h-8 w-20 border-[#DEE1EA] bg-transparent text-white text-[16px] font-[800] focus:border-[#DEE1EA] focus:ring-0 text-center"
                />
              </div>
            ) : (
              <span className="text-[16px] font-[800]">
                ${editablePrices.signBudget}
              </span>
            )}
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[14px] font-[500]">Install Budget</span>
            {isEditingPrices ? (
              <div className="flex items-center">
                <span className="text-[16px] font-[800] mr-1">$</span>
                <Input
                  value={editablePrices.installBudget}
                  onChange={(e) =>
                    handlePriceChange("installBudget", e.target.value)
                  }
                  className="h-8 w-20 border-[#DEE1EA] bg-transparent text-white text-[16px] font-[800] focus:border-[#DEE1EA] focus:ring-0 text-center"
                />
              </div>
            ) : (
              <span className="text-[16px] font-[800]">
                ${editablePrices.installBudget}
              </span>
            )}
          </div>
        </div>
        <div className="flex gap-3">
          <button
            onClick={isEditingPrices ? handleSavePrices : handleEditPrices}
            className="w-28 py-2 px-3 border border-white h-10 flex items-center justify-center text-white text-[14px] rounded-sm bg-transparent font-semibold"
          >
            Edit Prices
          </button>
          <button
            onClick={isEditingPrices ? handleSavePrices : undefined}
            className="flex-1 py-2 px-3 text-black disabled:text-[#464C53] bg-white disabled:bg-[#1018280D] h-10 flex items-center justify-center text-[14px] rounded-sm font-semibold"
          >
            {isEditingPrices ? "Save Pricing" : "Add Sign"}
          </button>
        </div>
      </section>
    </div>
  );
};
