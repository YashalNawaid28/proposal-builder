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
import { useState, useEffect } from "react";

interface SignConfigurationStepProps {
  selectedSign: SignOption | null;
  signData: SignData;
  setSignData: (data: SignData) => void;
  onBack: () => void;
  onClose: () => void;
}

interface SignPricing {
  id: string;
  sign_id: string;
  size: string;
  sign_price: number;
  install_price: number;
  sign_budget: number;
  install_budget: number;
  raceway: number;
  sign_budget_multiplier: number;
  install_budget_multiplier: number;
}

interface OptionValue {
  id: string;
  option_id: string;
  display_label: string;
  price_modifier_type: string;
  price_modifier_value: number;
  created_at: string;
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
    signPrice: "0.00",
    installPrice: "0.00",
    signBudget: "0.00",
    installBudget: "0.00",
  });
  const [currentPricing, setCurrentPricing] = useState<SignPricing | null>(null);
  const [loadingPricing, setLoadingPricing] = useState(false);
  const [availableSizes, setAvailableSizes] = useState<string[]>([]);
  const [loadingSizes, setLoadingSizes] = useState(false);
  const [colorOptions, setColorOptions] = useState<OptionValue[]>([]);
  const [fabTypeOptions, setFabTypeOptions] = useState<OptionValue[]>([]);
  const [racewayOptions, setRacewayOptions] = useState<OptionValue[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(false);
  const [modifiedSignPrice, setModifiedSignPrice] = useState<string>("0.00");
  const [modifiedSignBudget, setModifiedSignBudget] = useState<string>("0.00");
  const [modifiedInstallBudget, setModifiedInstallBudget] = useState<string>("0.00");
  const [savedPrices, setSavedPrices] = useState<{
    signPrice: string;
    signBudget: string;
    installBudget: string;
  } | null>(null);
  const [selectedSignData, setSelectedSignData] = useState<any>(null);

  // Fetch available sizes when sign changes
  useEffect(() => {
    const fetchSizes = async () => {
      if (!selectedSign?.id) {
        setAvailableSizes([]);
        return;
      }

      try {
        setLoadingSizes(true);
        const response = await fetch(
          `/api/sign-pricing/get-sizes-by-signId?sign_id=${selectedSign.id}`
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch sizes: ${response.status}`);
        }

        const result = await response.json();
        
        if (result.data && result.data.length > 0) {
          // Extract just the numbers from sizes like "12"", "18"", etc.
          const sizes = result.data.map((size: string) => size.replace('"', ''));
          setAvailableSizes(sizes);
          
          // Set the first available size as default if no size is selected
          if (!signData.size && sizes.length > 0) {
            setSignData({ ...signData, size: sizes[0] });
          }
        } else {
          setAvailableSizes([]);
        }
      } catch (error) {
        console.error("Error fetching sizes:", error);
        setAvailableSizes([]);
      } finally {
        setLoadingSizes(false);
      }
    };

    fetchSizes();
  }, [selectedSign?.id]);

  // Fetch sign data when selected sign changes
  useEffect(() => {
    const fetchSignData = async () => {
      if (!selectedSign?.id) {
        setSelectedSignData(null);
        return;
      }

      try {
        const response = await fetch(`/api/signs/get-by-id?sign_id=${selectedSign.id}`);
        if (response.ok) {
          const result = await response.json();
          setSelectedSignData(result.data);
        }
      } catch (error) {
        console.error("Error fetching sign data:", error);
      }
    };

    fetchSignData();
  }, [selectedSign?.id]);

  // Fetch options for Color, Fab Type, and Raceway
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        setLoadingOptions(true);
        
        // Fetch Color options
        const colorResponse = await fetch("/api/options/get-by-name?option_name=Color");
        if (colorResponse.ok) {
          const colorData = await colorResponse.json();
          if (colorData.data) {
            const colorValuesResponse = await fetch(`/api/option-values/get-by-optionId?option_id=${colorData.data.id}`);
            if (colorValuesResponse.ok) {
              const colorValuesData = await colorValuesResponse.json();
              setColorOptions(colorValuesData.data || []);
            }
          }
        }

        // Fetch Fab Type options
        const fabTypeResponse = await fetch("/api/options/get-by-name?option_name=Fab Type");
        if (fabTypeResponse.ok) {
          const fabTypeData = await fabTypeResponse.json();
          if (fabTypeData.data) {
            const fabTypeValuesResponse = await fetch(`/api/option-values/get-by-optionId?option_id=${fabTypeData.data.id}`);
            if (fabTypeValuesResponse.ok) {
              const fabTypeValuesData = await fabTypeValuesResponse.json();
              setFabTypeOptions(fabTypeValuesData.data || []);
            }
          }
        }

        // Fetch Raceway options
        const racewayResponse = await fetch("/api/options/get-by-name?option_name=Raceway");
        if (racewayResponse.ok) {
          const racewayData = await racewayResponse.json();
          if (racewayData.data) {
            const racewayValuesResponse = await fetch(`/api/option-values/get-by-optionId?option_id=${racewayData.data.id}`);
            if (racewayValuesResponse.ok) {
              const racewayValuesData = await racewayValuesResponse.json();
              setRacewayOptions(racewayValuesData.data || []);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching options:", error);
      } finally {
        setLoadingOptions(false);
      }
    };

    fetchOptions();
  }, []);

  // Fetch pricing data when sign or size changes
  useEffect(() => {
    const fetchPricing = async () => {
      if (!selectedSign?.id || !signData.size || signData.size === "loading" || signData.size === "no-sizes") {
        setCurrentPricing(null);
        setEditablePrices({
          signPrice: "0.00",
          installPrice: "0.00",
          signBudget: "0.00",
          installBudget: "0.00",
        });
        return;
      }

      try {
        setLoadingPricing(true);
        const url = `/api/sign-pricing/get-by-signId?sign_id=${selectedSign.id}&size=${signData.size}`;
        console.log("Component Debug - selectedSign.id:", selectedSign.id);
        console.log("Component Debug - signData.size:", signData.size);
        console.log("Component Debug - Fetching URL:", url);
        
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(`Failed to fetch pricing: ${response.status}`);
        }

        const result = await response.json();
        console.log("Component Debug - API Response:", result);
        
        if (result.data && result.data.length > 0) {
          const pricing = result.data[0];
          console.log("Component Debug - Pricing data received:", pricing);
          console.log("Component Debug - Sign budget multiplier:", pricing.sign_budget_multiplier);
          console.log("Component Debug - Install budget multiplier:", pricing.install_budget_multiplier);
          setCurrentPricing(pricing);
          setEditablePrices({
            signPrice: pricing.sign_price.toFixed(2),
            installPrice: pricing.install_price.toFixed(2),
            signBudget: pricing.sign_budget.toFixed(2),
            installBudget: pricing.install_budget.toFixed(2),
          });
        } else {
          setCurrentPricing(null);
          setEditablePrices({
            signPrice: "0.00",
            installPrice: "0.00",
            signBudget: "0.00",
            installBudget: "0.00",
          });
        }
      } catch (error) {
        console.error("Error fetching pricing:", error);
        setCurrentPricing(null);
        setEditablePrices({
          signPrice: "0.00",
          installPrice: "0.00",
          signBudget: "0.00",
          installBudget: "0.00",
        });
      } finally {
        setLoadingPricing(false);
      }
    };

    fetchPricing();
  }, [selectedSign?.id, signData.size]);

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
    // Set the editable prices to the current calculated values
    setEditablePrices({
      signPrice: modifiedSignPrice,
      installPrice: editablePrices.installPrice, // Keep install price as is since it's not modified
      signBudget: modifiedSignBudget,
      installBudget: modifiedInstallBudget,
    });
    setIsEditingPrices(true);
  };

  const handleSavePrices = () => {
    // Save the edited prices only in the form state
    console.log("Saving prices in form:", editablePrices);
    setSavedPrices({
      signPrice: editablePrices.signPrice,
      signBudget: editablePrices.signBudget,
      installBudget: editablePrices.installBudget,
    });
    setIsEditingPrices(false);
  };

  const handleResetPrices = () => {
    // Clear saved prices and revert to original calculated values
    setSavedPrices(null);
    console.log("Prices reset to original calculated values");
  };

  // Helper function to calculate modified sign price and budgets based on selected options
  const calculateModifiedValues = () => {
    if (!currentPricing) return { signPrice: "0.00", signBudget: "0.00", installBudget: "0.00" };
    
    let baseSignPrice = currentPricing.sign_price;
    let totalModifier = 0;
    
    // Calculate modifiers from selected options
    const selectedOptions = [
      { value: signData.color, options: colorOptions },
      { value: signData.fabType, options: fabTypeOptions },
      { value: signData.raceway, options: racewayOptions }
    ];
    
    selectedOptions.forEach(({ value, options }) => {
      if (value) {
        const selectedOption = options.find(opt => opt.display_label === value);
        if (selectedOption && selectedOption.price_modifier_value) {
          if (selectedOption.price_modifier_type === 'Percentage') {
            totalModifier += (baseSignPrice * selectedOption.price_modifier_value) / 100;
          } else {
            totalModifier += selectedOption.price_modifier_value;
          }
        }
      }
    });
    
    // Add raceway value from pricing data if raceway is selected
    if (signData.raceway && currentPricing.raceway) {
      totalModifier += currentPricing.raceway;
    }
    
    const finalSignPrice = baseSignPrice + totalModifier;
    
    // Calculate modified budgets using multipliers from sign data
    const signBudgetMultiplier = selectedSignData?.sign_budget_multiplier || 0;
    const installBudgetMultiplier = selectedSignData?.install_budget_multiplier || 0;
    
    console.log("Component Debug - Budget calculation:", {
      finalSignPrice,
      signBudgetMultiplier,
      installPrice: currentPricing?.install_price,
      installBudgetMultiplier,
      selectedSignData
    });
    
    // Sign Budget = Sign Price × Sign Budget Multiplier
    const modifiedSignBudget = finalSignPrice * signBudgetMultiplier;
    // Install Budget = Install Price × Install Budget Multiplier
    const modifiedInstallBudget = currentPricing.install_price * installBudgetMultiplier;
    
    return {
      signPrice: finalSignPrice.toFixed(2),
      signBudget: modifiedSignBudget.toFixed(2),
      installBudget: modifiedInstallBudget.toFixed(2)
    };
  };

  // Update modified values when options or pricing changes
  useEffect(() => {
    const modifiedValues = calculateModifiedValues();
    setModifiedSignPrice(modifiedValues.signPrice);
    setModifiedSignBudget(modifiedValues.signBudget);
    setModifiedInstallBudget(modifiedValues.installBudget);
  }, [currentPricing, signData.color, signData.fabType, signData.raceway, colorOptions, fabTypeOptions, racewayOptions, selectedSignData]);

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
          {selectedSign && <img src={selectedSign?.image} alt="" />}
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
            <Select value={signData?.size || ""} onValueChange={handleSizeChange}>
              <SelectTrigger className="h-9 w-auto min-w-[80px] border-[#DEE1EA] focus:border-[#DEE1EA] focus:ring-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent
                className="z-[9999]"
                position="popper"
                side="bottom"
                align="end"
              >
                {loadingSizes ? (
                  <SelectItem value="loading" disabled>Loading...</SelectItem>
                ) : availableSizes?.length > 0 ? (
                  availableSizes?.map((size) => (
                    <SelectItem key={size} value={size}>
                      {size}″
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-sizes" disabled>No sizes available</SelectItem>
                )}
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
                {loadingOptions ? (
                  <SelectItem value="loading" disabled>Loading...</SelectItem>
                ) : colorOptions.length > 0 ? (
                  colorOptions.map((option) => (
                    <SelectItem key={option.id} value={option.display_label}>
                      {option.display_label}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-colors" disabled>No colors available</SelectItem>
                )}
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
                {loadingOptions ? (
                  <SelectItem value="loading" disabled>Loading...</SelectItem>
                ) : fabTypeOptions.length > 0 ? (
                  fabTypeOptions.map((option) => (
                    <SelectItem key={option.id} value={option.display_label}>
                      {option.display_label}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-fab-types" disabled>No fab types available</SelectItem>
                )}
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
                {loadingOptions ? (
                  <SelectItem value="loading" disabled>Loading...</SelectItem>
                ) : racewayOptions.length > 0 ? (
                  racewayOptions.map((option) => (
                    <SelectItem key={option.id} value={option.display_label}>
                      {option.display_label}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-raceway" disabled>No raceway options available</SelectItem>
                )}
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
        {loadingPricing && (
          <div className="text-center text-gray-300 mb-4">
            Loading pricing...
          </div>
        )}
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
                ${savedPrices?.signPrice || modifiedSignPrice}
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
                ${savedPrices?.signBudget || modifiedSignBudget}
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
                ${savedPrices?.installBudget || modifiedInstallBudget}
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
          {savedPrices && !isEditingPrices && (
            <button
              onClick={handleResetPrices}
              className="w-20 py-2 px-3 border border-white h-10 flex items-center justify-center text-white text-[14px] rounded-sm bg-transparent font-semibold"
            >
              Reset
            </button>
          )}
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
