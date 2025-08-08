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
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/components/supabase-auth-provider";

interface SignConfigurationStepProps {
  selectedSign: SignOption | null;
  signData: SignData;
  setSignData: (data: SignData) => void;
  onBack: () => void;
  onClose: () => void;
  onSignAdded?: () => void; // Callback when sign is successfully added
  jobId: string;
  pricingVersionId?: string; // Current pricing version ID to add signs to
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
  onSignAdded,
  jobId,
  pricingVersionId,
}: SignConfigurationStepProps) => {
  const { user, userData, primaryUserId } = useAuth();
  const [isEditingPrices, setIsEditingPrices] = useState(false);
  const [editablePrices, setEditablePrices] = useState({
    signPrice: "0.00",
    installPrice: "0.00",
    signBudget: "0.00",
    installBudget: "0.00",
  });
  const [currentPricing, setCurrentPricing] = useState<SignPricing | null>(
    null
  );
  const [loadingPricing, setLoadingPricing] = useState(false);
  const [availableSizes, setAvailableSizes] = useState<string[]>([]);
  const [loadingSizes, setLoadingSizes] = useState(false);
  const [dynamicOptions, setDynamicOptions] = useState<{
    [key: string]: OptionValue[];
  }>({});
  const [loadingOptions, setLoadingOptions] = useState(false);
  const [formFields, setFormFields] = useState<
    Array<{
      key: string;
      label: string;
      type: string;
      placeholder: string;
    }>
  >([]);
  const [modifiedSignPrice, setModifiedSignPrice] = useState<string>("0.00");
  const [modifiedSignBudget, setModifiedSignBudget] = useState<string>("0.00");
  const [modifiedInstallBudget, setModifiedInstallBudget] =
    useState<string>("0.00");
  const [savedPrices, setSavedPrices] = useState<{
    signPrice: string;
    signBudget: string;
    installPrice: string;
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
          const sizes = result.data.map((size: string) =>
            size.replace('"', "")
          );
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
  }, [selectedSign?.id, setSignData, signData]);

  // Fetch sign data when selected sign changes
  useEffect(() => {
    const fetchSignData = async () => {
      if (!selectedSign?.id) {
        setSelectedSignData(null);
        return;
      }

      try {
        const response = await fetch(
          `/api/signs/get-by-id?sign_id=${selectedSign.id}`
        );
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

  // Parse sign description and generate form fields
  useEffect(() => {
    if (!selectedSignData?.sign_description) {
      setFormFields([]);
      return;
    }

    const description = selectedSignData.sign_description;
    console.log("SignConfigurationStep - Parsing description:", description);
    const placeholders = description.match(/\{([^}]+)\}/g) || [];
    console.log("SignConfigurationStep - Found placeholders:", placeholders);

    const fields: Array<{
      key: string;
      label: string;
      type: "select" | "size-input";
      placeholder: string;
    }> = [];

    placeholders.forEach((placeholder: string) => {
      const key = placeholder
        .replace(/[{}]/g, "")
        .toLowerCase()
        .replace(/\s+/g, "");

      console.log(`SignConfigurationStep - Processing placeholder: "${placeholder}" -> key: "${key}"`);

      // Skip Size field as it's handled separately
      if (key === "size") {
        console.log(`SignConfigurationStep - Skipping size field: "${placeholder}"`);
        return;
      }

      // Skip Behind-The-Wall Option fields only
      if (
        key.includes("behind") ||
        key.includes("wall") ||
        key.includes("behindthewall")
      ) {
        return;
      }

      // Map placeholder to field configuration
      let label = placeholder.replace(/[{}]/g, "");
      let type: "select" | "size-input" = "select";

      if (key.includes("size")) {
        if (key.includes("raceway")) {
          label = "Raceway Size";
          type = "size-input";
        } else if (key.includes("backer")) {
          label = "Backer Size";
          type = "select"; // We'll handle this in rendering logic
        } else if (key === "size") {
          // Skip main size field as it's handled separately
          return;
        } else {
          // Skip any other size-related fields that aren't raceway or backer
          return;
        }
      } else if (key.includes("color")) {
        label = "Color";
      } else if (key.includes("fab") || key.includes("fabrication")) {
        label = "Fab Type";
      } else if (key.includes("raceway")) {
        label = "Raceway";
      } else if (key.includes("backer")) {
        if (key.includes("size") || key.includes("backersize")) {
          label = "Backer Size";
          type = "select"; // We'll handle this in rendering logic
        } else if (key.includes("illumination")) {
          label = "Backer Illumination";
        } else {
          label = "Backer Panel";
        }
      } else if (key.includes("print") || key.includes("material")) {
        label = "Print Material";
      } else if (key.includes("mounting") || key.includes("surface")) {
        label = "Mounting Surface";
      } else if (key.includes("anti") || key.includes("graffiti")) {
        label = "Anti-Graffiti";
      } else {
        label = placeholder.replace(/[{}]/g, "");
      }

      fields.push({
        key,
        label,
        type,
        placeholder: label,
      });
    });

    console.log("SignConfigurationStep - Generated fields:", fields);
    console.log("SignConfigurationStep - Fields with 'Size' label:", fields.filter(f => f.label === "Size"));
    setFormFields(fields);
  }, [selectedSignData]);

  // Fetch options for dynamic fields
  useEffect(() => {
    const fetchOptions = async () => {
      if (!selectedSignData?.sign_description) return;

      try {
        setLoadingOptions(true);
        const newOptions: { [key: string]: OptionValue[] } = {};

        const description = selectedSignData.sign_description;
        const placeholders = description.match(/\{([^}]+)\}/g) || [];

        for (const placeholder of placeholders) {
          const key = placeholder
            .replace(/[{}]/g, "")
            .toLowerCase()
            .replace(/\s+/g, "");
          console.log(
            `Processing placeholder: "${placeholder}" -> key: "${key}"`
          );

          // Skip Size field as it's handled separately with sign_pricing data
          if (key === "size") {
            continue;
          }

          // Skip Behind-The-Wall Option fields only
          if (
            key.includes("behind") ||
            key.includes("wall") ||
            key.includes("behindthewall")
          ) {
            continue;
          }

          // Map placeholder to option name
          let optionName = "";
          if (key.includes("color")) {
            optionName = "Color";
          } else if (key.includes("fab") || key.includes("fabrication")) {
            optionName = "Fab Type";
          } else if (key.includes("raceway") && !key.includes("size")) {
            optionName = "Raceway";
          } else if (key.includes("backer")) {
            if (key.includes("size")) {
              // Skip fetching options for Backer Size(s) as it's a text input
              continue;
            } else if (key.includes("illumination")) {
              optionName = "Backer Illumination";
            } else {
              optionName = "Backer Panel Size";
            }
          } else if (key.includes("print") || key.includes("material")) {
            optionName = "Print Material";
          } else if (key.includes("mounting") || key.includes("surface")) {
            optionName = "Mounting Surface";
          } else if (key.includes("anti") || key.includes("graffiti")) {
            optionName = "Anti-Graffiti";
          }

          if (optionName) {
            try {
              console.log(`Fetching options for: ${optionName} (key: ${key})`);
              const response = await fetch(
                `/api/options/get-by-name?option_name=${encodeURIComponent(
                  optionName
                )}`
              );
              if (response.ok) {
                const data = await response.json();
                console.log(`Option data for ${optionName}:`, data);
                if (data.data) {
                  const valuesResponse = await fetch(
                    `/api/option-values/get-by-optionId?option_id=${data.data.id}`
                  );
                  if (valuesResponse.ok) {
                    const valuesData = await valuesResponse.json();
                    console.log(`Option values for ${optionName}:`, valuesData);
                    newOptions[key] = valuesData.data || [];
                    console.log(
                      `Stored options for key "${key}":`,
                      newOptions[key]
                    );
                  } else {
                    console.error(
                      `Failed to fetch values for ${optionName}:`,
                      valuesResponse.status
                    );
                  }
                } else {
                  console.log(`No option data found for ${optionName}`);
                }
              } else {
                console.error(
                  `Failed to fetch option ${optionName}:`,
                  response.status
                );
              }
            } catch (error) {
              console.error(`Error fetching options for ${optionName}:`, error);
            }
          }
        }

        setDynamicOptions(newOptions);
      } catch (error) {
        console.error("Error fetching options:", error);
      } finally {
        setLoadingOptions(false);
      }
    };

    fetchOptions();
  }, [selectedSignData]);

  // Fetch pricing data when sign or size changes
  useEffect(() => {
    const fetchPricing = async () => {
      if (
        !selectedSign?.id ||
        !signData.size ||
        signData.size === "loading" ||
        signData.size === "no-sizes"
      ) {
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
          console.log(
            "Component Debug - Sign budget multiplier:",
            pricing.sign_budget_multiplier
          );
          console.log(
            "Component Debug - Install budget multiplier:",
            pricing.install_budget_multiplier
          );
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
      installPrice: editablePrices.installPrice,
      installBudget: editablePrices.installBudget,
    });
    setIsEditingPrices(false);
  };

  const handleResetPrices = () => {
    // Clear saved prices and revert to original calculated values
    setSavedPrices(null);
    console.log("Prices reset to original calculated values");
  };

  const handleAddSign = async () => {
    console.log("handleAddSign - Function called");
    console.log("handleAddSign - selectedSign:", selectedSign);
    console.log("handleAddSign - userData:", userData);
    console.log("handleAddSign - primaryUserId:", primaryUserId);
    console.log("handleAddSign - jobId:", jobId);
    console.log("handleAddSign - signData:", signData);
    
    try {
      // Use the jobId passed as prop
      console.log("Component Debug - jobId:", jobId);

      // Validate quantity
      const quantity = parseInt(signData.qty) || 1;
      if (quantity < 1) {
        throw new Error("Quantity must be at least 1");
      }

      // Get current user ID
      if (!primaryUserId) {
        throw new Error("User not authenticated");
      }
      const userId = primaryUserId;

      let targetPricingVersionId: string;

      // If we have a pricing version ID, use it; otherwise create a new one
      if (pricingVersionId) {
        console.log("Component Debug - Using existing pricing version:", pricingVersionId);
        targetPricingVersionId = pricingVersionId;
      } else {
        console.log("Component Debug - Creating new pricing version");
        // Create pricing version
        const pricingVersionBody = {
          job_id: jobId,
          creator_id: userId,
        };
        console.log("Component Debug - Pricing version request body:", pricingVersionBody);
        
        const pricingVersionResponse = await fetch("/api/pricing-versions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(pricingVersionBody),
        });

        if (!pricingVersionResponse.ok) {
          throw new Error("Failed to create pricing version");
        }

        const pricingVersionData = await pricingVersionResponse.json();
        targetPricingVersionId = pricingVersionData.data.id;
      }

      // Get the current prices (saved or calculated)
      const currentSignPrice = savedPrices?.signPrice || modifiedSignPrice;
      const currentSignBudget = savedPrices?.signBudget || modifiedSignBudget;
      const currentInstallPrice = editablePrices.installPrice;
      const currentInstallBudget =
        savedPrices?.installBudget || modifiedInstallBudget;

      // Create pricing line
      const descriptionResolved = generateDescriptionResolved();
      
      const pricingLineBody = {
        pricing_version_id: targetPricingVersionId,
        sign_id: selectedSign?.id,
        description_resolved: descriptionResolved,
        qty: quantity, // Use validated quantity
        list_price: parseFloat(currentSignPrice),
        cost_budget: parseFloat(currentSignBudget),
        list_install_price: parseFloat(currentInstallPrice),
        cost_install_budget: parseFloat(currentInstallBudget),
      };
      
      console.log("Component Debug - Pricing line request body:", pricingLineBody);

      const pricingLineResponse = await fetch("/api/pricing-lines", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(pricingLineBody),
      });

      if (!pricingLineResponse.ok) {
        throw new Error("Failed to create pricing line");
      }

      console.log("Sign added successfully!");
      // Call onSignAdded callback if provided, otherwise just close
      if (onSignAdded) {
        onSignAdded();
      } else {
        onClose();
      }
    } catch (error) {
      console.error("Error adding sign:", error);
      // Show error message to user
      alert(`Error adding sign: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  // Helper function to generate description_resolved based on sign_description template
  const generateDescriptionResolved = () => {
    if (!selectedSign || !selectedSignData) return "";

    let description = selectedSignData.sign_description || "";

    // Replace all placeholders with actual values
    const placeholders = description.match(/\{([^}]+)\}/g) || [];

    placeholders.forEach((placeholder: string) => {
      const key = placeholder
        .replace(/[{}]/g, "")
        .toLowerCase()
        .replace(/\s+/g, "");
      
      // Handle both "Size" and "Letter Size" placeholders
      let value = signData[key];
      if (!value && (key === "size" || key === "lettersize")) {
        // If the key is "size" or "lettersize", use the size value from signData
        value = signData.size;
      }

      if (value) {
        if (key.includes("raceway") && !key.includes("size")) {
          // Handle raceway with size
          let racewayValue = value;

          // Add raceway size in parentheses if raceway size inputs are provided
          if (
            signData.racewaySize &&
            signData.racewaySize.height &&
            signData.racewaySize.width
          ) {
            const heightFeet = signData.racewaySize.height.feet || "0";
            const heightInches = signData.racewaySize.height.inches || "0";
            const widthFeet = signData.racewaySize.width.feet || "0";
            const widthInches = signData.racewaySize.width.inches || "0";

            const racewaySizeValue = `${heightFeet}'-${heightInches}"x ${widthFeet}'-${widthInches}"`;
            racewayValue = `${value} (${racewaySizeValue})`;
          }

          description = description.replace(placeholder, racewayValue);
        } else {
          description = description.replace(placeholder, value);
        }
      } else {
        // Remove placeholder if no value is selected
        description = description.replace(placeholder, "");
      }
    });

    // Clean up any extra spaces that might result from empty replacements
    description = description.replace(/\s+/g, " ").trim();

    return description;
  };

  // Helper function to calculate modified sign price and budgets based on selected options
  const calculateModifiedValues = useCallback(() => {
    if (!currentPricing)
      return { signPrice: "0.00", signBudget: "0.00", installBudget: "0.00" };

    const baseSignPrice = currentPricing.sign_price;
    const baseInstallPrice = currentPricing.install_price;
    let signPriceModifier = 0;
    let installPriceModifier = 0;

    // Calculate modifiers from selected options
    Object.keys(dynamicOptions).forEach((key) => {
      const value = signData[key];
      const options = dynamicOptions[key];

      if (value && options) {
        const selectedOption = options.find(
          (opt: OptionValue) => opt.display_label === value
        );
        if (selectedOption && selectedOption.price_modifier_value) {
          // Special case: Mounting Surface affects Install Price instead of Sign Price
          if (key.includes("mounting") || key.includes("surface")) {
            if (selectedOption.price_modifier_type === "Percentage") {
              installPriceModifier +=
                (baseInstallPrice * selectedOption.price_modifier_value) / 100;
            } else {
              installPriceModifier += selectedOption.price_modifier_value;
            }
          } else {
            // All other options affect Sign Price
            if (selectedOption.price_modifier_type === "Percentage") {
              signPriceModifier +=
                (baseSignPrice * selectedOption.price_modifier_value) / 100;
            } else {
              signPriceModifier += selectedOption.price_modifier_value;
            }
          }
        }
      }
    });

    // Add raceway value from pricing data if raceway is selected
    // Check for any raceway-related field in signData
    const racewayField = Object.keys(signData).find(
      (key) => key.includes("raceway") && !key.includes("size") && signData[key]
    );
    if (racewayField && currentPricing.raceway) {
      console.log(
        "Component Debug - Raceway selected, adding raceway value:",
        currentPricing.raceway
      );
      signPriceModifier += currentPricing.raceway;
    }

    const finalSignPrice = baseSignPrice + signPriceModifier;
    const finalInstallPrice = baseInstallPrice + installPriceModifier;

    // Calculate modified budgets using multipliers from sign data
    const signBudgetMultiplier = selectedSignData?.sign_budget_multiplier || 0;
    const installBudgetMultiplier =
      selectedSignData?.install_budget_multiplier || 0;

    console.log("Component Debug - Budget calculation:", {
      finalSignPrice,
      finalInstallPrice,
      signPriceModifier,
      installPriceModifier,
      signBudgetMultiplier,
      installBudgetMultiplier,
      selectedSignData,
    });

    // Sign Budget = Sign Price × Sign Budget Multiplier
    const modifiedSignBudget = finalSignPrice * signBudgetMultiplier;
    // Install Budget = Install Price × Install Budget Multiplier
    const modifiedInstallBudget = finalInstallPrice * installBudgetMultiplier;

    return {
      signPrice: finalSignPrice.toFixed(2),
      signBudget: modifiedSignBudget.toFixed(2),
      installBudget: modifiedInstallBudget.toFixed(2),
    };
  }, [currentPricing, signData, dynamicOptions, selectedSignData]);

  // Update modified values when options or pricing changes
  useEffect(() => {
    const modifiedValues = calculateModifiedValues();
    setModifiedSignPrice(modifiedValues.signPrice);
    setModifiedSignBudget(modifiedValues.signBudget);
    setModifiedInstallBudget(modifiedValues.installBudget);
  }, [
    currentPricing,
    signData,
    dynamicOptions,
    selectedSignData,
    calculateModifiedValues,
  ]);

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
          value={signData.qty || ""}
          onChange={(e) => setSignData({ ...signData, qty: e.target.value })}
        />
      </section>
      {/* Form */}
      <section className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-5">
          {/* Size field - always present */}
          <div className="flex items-center justify-between">
            <Label className="text-[14px] font-[500] text-[#60646C]">
              Size
            </Label>
            <Select
              value={signData?.size || ""}
              onValueChange={handleSizeChange}
            >
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
                  <SelectItem value="loading" disabled>
                    Loading...
                  </SelectItem>
                ) : availableSizes?.length > 0 ? (
                  availableSizes?.map((size) => (
                    <SelectItem key={size} value={size}>
                      {size}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-sizes" disabled>
                    No sizes available
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Dynamic fields based on sign description */}
          {formFields.map((field) => (
            <div key={field.key} className="flex items-center justify-between">
              <Label className="text-[14px] font-[500] text-[#60646C]">
                {field.label}
              </Label>
              {field.key.includes("backer") && field.key.includes("size") ? (
                <Input
                  value={signData[field.key] || ""}
                  onChange={(e) =>
                    setSignData({ ...signData, [field.key]: e.target.value })
                  }
                  className="h-9 w-auto min-w-[120px] border-[#DEE1EA] focus:border-[#DEE1EA] focus:ring-0"
                  placeholder="Enter size"
                />
              ) : field.type === "select" ? (
                <Select
                  value={signData[field.key] || ""}
                  onValueChange={(value) => {
                    setSignData({ ...signData, [field.key]: value });
                  }}
                >
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
                      <SelectItem value="loading" disabled>
                        Loading...
                      </SelectItem>
                    ) : dynamicOptions[field.key]?.length > 0 ? (
                      dynamicOptions[field.key].map((option: OptionValue) => (
                        <SelectItem
                          key={option.id}
                          value={option.display_label}
                        >
                          {option.display_label}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value={`no-${field.key}`} disabled>
                        No options available (key: {field.key}, options:{" "}
                        {JSON.stringify(dynamicOptions[field.key])})
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
              ) : field.type === "size-input" ? (
                <div className="flex gap-2">
                  <div className="w-12">
                    <Input
                      value={signData.racewaySize?.height?.feet || ""}
                      onChange={(e) =>
                        setSignData({
                          ...signData,
                          racewaySize: {
                            ...signData.racewaySize,
                            height: {
                              ...signData.racewaySize?.height,
                              feet: e.target.value,
                            },
                          },
                        })
                      }
                      className="h-9 border-[#DEE1EA] focus:border-[#DEE1EA] focus:ring-0 text-center"
                      placeholder=""
                    />
                  </div>
                  <div className="flex items-center text-[12px] text-[#60646C]">
                    ft
                  </div>
                  <div className="w-12">
                    <Input
                      value={signData.racewaySize?.height?.inches || ""}
                      onChange={(e) =>
                        setSignData({
                          ...signData,
                          racewaySize: {
                            ...signData.racewaySize,
                            height: {
                              ...signData.racewaySize?.height,
                              inches: e.target.value,
                            },
                          },
                        })
                      }
                      className="h-9 border-[#DEE1EA] focus:border-[#DEE1EA] focus:ring-0 text-center"
                      placeholder=""
                    />
                  </div>
                  <div className="flex items-center text-[12px] text-[#60646C]">
                    in
                  </div>
                  <div className="flex items-center text-[12px] text-[#60646C]">
                    x
                  </div>
                  <div className="w-12">
                    <Input
                      value={signData.racewaySize?.width?.feet || ""}
                      onChange={(e) =>
                        setSignData({
                          ...signData,
                          racewaySize: {
                            ...signData.racewaySize,
                            width: {
                              ...signData.racewaySize?.width,
                              feet: e.target.value,
                            },
                          },
                        })
                      }
                      className="h-9 border-[#DEE1EA] focus:border-[#DEE1EA] focus:ring-0 text-center"
                      placeholder=""
                    />
                  </div>
                  <div className="flex items-center text-[12px] text-[#60646C]">
                    ft
                  </div>
                  <div className="w-12">
                    <Input
                      value={signData.racewaySize?.width?.inches || ""}
                      onChange={(e) =>
                        setSignData({
                          ...signData,
                          racewaySize: {
                            ...signData.racewaySize,
                            width: {
                              ...signData.racewaySize?.width,
                              inches: e.target.value,
                            },
                          },
                        })
                      }
                      className="h-9 border-[#DEE1EA] focus:border-[#DEE1EA] focus:ring-0 text-center"
                      placeholder=""
                    />
                  </div>
                  <div className="flex items-center text-[12px] text-[#60646C]">
                    in
                  </div>
                </div>
              ) : (
                // Default input for any other field types
                <Input
                  value={signData[field.key] || ""}
                  onChange={(e) =>
                    setSignData({ ...signData, [field.key]: e.target.value })
                  }
                  className="h-9 w-auto min-w-[120px] border-[#DEE1EA] focus:border-[#DEE1EA] focus:ring-0"
                  placeholder={`Enter ${field.label.toLowerCase()}`}
                />
              )}
            </div>
          ))}



          {/* Always show Raceway Size if there's a raceway field */}
          {formFields.some(
            (field) =>
              field.key.includes("raceway") && !field.key.includes("size")
          ) && (
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
                        value={signData.racewaySize?.height?.feet || ""}
                        onChange={(e) =>
                          setSignData({
                            ...signData,
                            racewaySize: {
                              ...signData.racewaySize,
                              height: {
                                ...signData.racewaySize?.height,
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
                        value={signData.racewaySize?.height?.inches || ""}
                        onChange={(e) =>
                          setSignData({
                            ...signData,
                            racewaySize: {
                              ...signData.racewaySize,
                              height: {
                                ...signData.racewaySize?.height,
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
                        value={signData.racewaySize?.width?.feet || ""}
                        onChange={(e) =>
                          setSignData({
                            ...signData,
                            racewaySize: {
                              ...signData.racewaySize,
                              width: {
                                ...signData.racewaySize?.width,
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
                        value={signData.racewaySize?.width?.inches || ""}
                        onChange={(e) =>
                          setSignData({
                            ...signData,
                            racewaySize: {
                              ...signData.racewaySize,
                              width: {
                                ...signData.racewaySize?.width,
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
          )}
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
                ${savedPrices?.installPrice || editablePrices.installPrice}
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
            onClick={(e) => {
              console.log("Add Sign button clicked");
              console.log("isEditingPrices:", isEditingPrices);
              console.log("Button disabled state:", !selectedSign || !primaryUserId || !jobId);
              console.log("selectedSign:", selectedSign);
              console.log("primaryUserId:", primaryUserId);
              console.log("jobId:", jobId);
              if (isEditingPrices) {
                handleSavePrices();
              } else {
                handleAddSign();
              }
            }}
            className="flex-1 py-2 px-3 text-black disabled:text-[#464C53] bg-white disabled:bg-[#1018280D] h-10 flex items-center justify-center text-[14px] rounded-sm font-semibold"
            disabled={!selectedSign || !primaryUserId || !jobId}
          >
            {isEditingPrices ? "Save Pricing" : "Add Sign"}
          </button>
        </div>
      </section>
    </div>
  );
};
