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
import { useState, useEffect } from "react";
import { useUser } from "@stackframe/stack";
import Drawer from "react-modern-drawer";
import "react-modern-drawer/dist/index.css";

interface EditPricingLineDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  pricingLine: any; // The pricing line data to edit
  onSave?: (updatedData: any) => void; // Callback when data is saved
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

interface SignData {
  [key: string]: any;
}

export const EditPricingLineDrawer = ({
  isOpen,
  onClose,
  pricingLine,
  onSave,
}: EditPricingLineDrawerProps) => {
  const user = useUser();
  
  // Check if data is provided in props, otherwise use dummy data
  const hasDataFromProps = pricingLine && Object.keys(pricingLine).length > 0;
  
  // Dummy data if no props provided
  const dummyData = {
    id: "dummy-sign-id",
    name: "Dummy Sign",
    image: "/images/dave1.png",
    sign_description: "{Size} {Color} {Fab Type} {Raceway} {Backer Panel} {Print Material} {Mounting Surface} {Anti-Graffiti}",
    sign_budget_multiplier: 0.8,
    install_budget_multiplier: 0.6,
  };

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
  const [dynamicOptions, setDynamicOptions] = useState<{ [key: string]: OptionValue[] }>({});
  const [loadingOptions, setLoadingOptions] = useState(false);
  const [formFields, setFormFields] = useState<Array<{
    key: string;
    label: string;
    type: string;
    placeholder: string;
  }>>([]);
  const [modifiedSignPrice, setModifiedSignPrice] = useState<string>("0.00");
  const [modifiedSignBudget, setModifiedSignBudget] = useState<string>("0.00");
  const [modifiedInstallBudget, setModifiedInstallBudget] = useState<string>("0.00");
  const [savedPrices, setSavedPrices] = useState<{
    signPrice: string;
    signBudget: string;
    installPrice: string;
    installBudget: string;
  } | null>(null);
  const [selectedSignData, setSelectedSignData] = useState<any>(null);
  const [signData, setSignData] = useState<SignData>({});

  // Initialize with data from props or dummy data
  useEffect(() => {
    console.log("EditPricingLineDrawer - Pricing line data:", pricingLine);
    console.log("EditPricingLineDrawer - hasDataFromProps:", hasDataFromProps);
    if (hasDataFromProps && pricingLine) {
      // Fetch sign data when we have a pricing line with sign_id
      const fetchSignData = async () => {
        if (!pricingLine?.sign_id) return;
        
        try {
          const response = await fetch(`/api/signs/get-by-id?sign_id=${pricingLine.sign_id}`);
          if (response.ok) {
            const result = await response.json();
            console.log("EditPricingLineDrawer - Sign data fetched:", result.data);
            setSelectedSignData(result.data);
            
            // Parse the description_resolved to extract current values
            const description = pricingLine.description_resolved || "";
            console.log("EditPricingLineDrawer - Parsing description:", description);
            console.log("EditPricingLineDrawer - Raw pricing line data:", pricingLine);
            console.log("EditPricingLineDrawer - Description type:", typeof description);
            console.log("EditPricingLineDrawer - Description length:", description.length);
            console.log("EditPricingLineDrawer - Description split by spaces:", description.split(/\s+/));
            console.log("EditPricingLineDrawer - Description split by commas:", description.split(/,\s*/));
            const currentValues: SignData = {};
            
            // Extract size from description if available
            const sizeMatch = description.match(/(\d+)"?/);
            if (sizeMatch) {
              // Remove the inch sign to match the available sizes format
              const sizeValue = sizeMatch[1];
              currentValues.size = sizeValue;
              console.log("EditPricingLineDrawer - Extracted size:", sizeValue);
            } else {
              console.log("EditPricingLineDrawer - No size found in description");
            }
            
            // Extract raceway size if available
            const racewaySizeMatch = description.match(/\((\d+)'-(\d+)"x\s*(\d+)'-(\d+)"\)/);
            if (racewaySizeMatch) {
              currentValues.racewaySize = {
                height: {
                  feet: racewaySizeMatch[1],
                  inches: racewaySizeMatch[2]
                },
                width: {
                  feet: racewaySizeMatch[3],
                  inches: racewaySizeMatch[4]
                }
              };
              console.log("EditPricingLineDrawer - Extracted raceway size:", currentValues.racewaySize);
            }
            
            // Simple, direct parsing based on the actual description format
            console.log("EditPricingLineDrawer - Parsing description directly:", description);
            
            // Extract values directly from the description
            const words = description.split(/\s+/);
            console.log("EditPricingLineDrawer - Words in description:", words);
            
            // Extract size (already done above, but let's make sure it's stored)
            if (currentValues.size) {
              console.log("EditPricingLineDrawer - Size already extracted:", currentValues.size);
            }
            
            // Extract raceway - use the key that matches form fields
            if (description.includes('Raceway-Mounted')) {
              currentValues['raceway-mountedoption'] = 'Raceway-Mounted';
              console.log("EditPricingLineDrawer - Extracted raceway: Raceway-Mounted");
            }
            
            // Extract color
            const colors = ['Red', 'Blue', 'Green', 'Yellow', 'White', 'Black', 'Orange', 'Purple', 'Pink', 'Brown', 'Gray', 'Grey'];
            for (const color of colors) {
              if (description.includes(color)) {
                currentValues.color = color;
                console.log("EditPricingLineDrawer - Extracted color:", color);
                break;
              }
            }
            
            // Extract fabrication type - use the key that matches form fields
            if (description.includes('Face + Halo Lit (Duel LEDs)')) {
              currentValues.fabricationtype = 'Face + Halo Lit (Duel LEDs)';
              console.log("EditPricingLineDrawer - Extracted fab type: Face + Halo Lit (Duel LEDs)");
            } else if (description.includes('Face + Halo Lit')) {
              currentValues.fabricationtype = 'Face + Halo Lit';
              console.log("EditPricingLineDrawer - Extracted fab type: Face + Halo Lit");
            } else if (description.includes('Halo-Lit')) {
              currentValues.fabricationtype = 'Halo-Lit';
              console.log("EditPricingLineDrawer - Extracted fab type: Halo-Lit");
            } else if (description.includes('Face-Lit')) {
              currentValues.fabricationtype = 'Face-Lit';
              console.log("EditPricingLineDrawer - Extracted fab type: Face-Lit");
            } else if (description.includes('Trimless')) {
              currentValues.fabricationtype = 'Trimless';
              console.log("EditPricingLineDrawer - Extracted fab type: Trimless");
            }
            
            // Extract raceway size (already done above, but let's make sure it's stored)
            if (currentValues.racewaySize) {
              console.log("EditPricingLineDrawer - Raceway size already extracted:", currentValues.racewaySize);
            }
            
            console.log("EditPricingLineDrawer - Final extracted values:", currentValues);
            
            // Check what values we actually extracted
            console.log("EditPricingLineDrawer - Extracted size:", currentValues.size);
            console.log("EditPricingLineDrawer - Extracted color:", currentValues.color);
            console.log("EditPricingLineDrawer - Extracted raceway:", currentValues['raceway-mountedoption']);
            console.log("EditPricingLineDrawer - Extracted fabtype:", currentValues.fabricationtype);
            
            // Set the signData with the extracted values
            console.log("EditPricingLineDrawer - Setting signData with:", currentValues);
            setSignData(currentValues);
            
            // Also log the current signData state for debugging
            console.log("EditPricingLineDrawer - Current signData state after setSignData:", signData);
          }
        } catch (error) {
          console.error("Error fetching sign data:", error);
        }
      };
      
      fetchSignData();
    } else {
      // Use dummy data
      setSelectedSignData(dummyData);
      setSignData({
        size: "12",
        color: "Red",
        fabtype: "Aluminum",
        raceway: "Standard",
        backerpanel: "Yes",
        printmaterial: "Vinyl",
        mountingsurface: "Wall",
        antigraffiti: "No",
      });
    }
  }, [pricingLine, hasDataFromProps]);

  // Fetch available sizes when sign changes
  useEffect(() => {
    const fetchSizes = async () => {
      if (!selectedSignData?.id) {
        setAvailableSizes([]);
        return;
      }

      try {
        setLoadingSizes(true);
        const response = await fetch(
          `/api/sign-pricing/get-sizes-by-signId?sign_id=${selectedSignData.id}`
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch sizes: ${response.status}`);
        }

        const result = await response.json();
        
        if (result.data && result.data.length > 0) {
          // Extract just the numbers from sizes like "12"", "18"", etc.
          const sizes = result.data.map((size: string) => size.replace('"', ''));
          console.log("EditPricingLineDrawer - Available sizes:", sizes);
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
  }, [selectedSignData?.id, setSignData, signData]);

  // Parse sign description and generate form fields
  useEffect(() => {
    if (!selectedSignData?.sign_description) {
      setFormFields([]);
      return;
    }

    const description = selectedSignData.sign_description;
    console.log("EditPricingLineDrawer - Parsing description:", description);
    const placeholders = description.match(/\{([^}]+)\}/g) || [];
    console.log("EditPricingLineDrawer - Found placeholders:", placeholders);
    
    const fields: Array<{
      key: string;
      label: string;
      type: 'select' | 'size-input';
      placeholder: string;
    }> = [];

    placeholders.forEach((placeholder: string) => {
      const key = placeholder.replace(/[{}]/g, '').toLowerCase().replace(/\s+/g, '');
      
      // Skip Size field as it's handled separately
      if (key === 'size') {
        return;
      }
      
      // Skip Behind-The-Wall Option fields only
      if (key.includes('behind') || key.includes('wall') || key.includes('behindthewall')) {
        return;
      }
      
      // Map placeholder to field configuration
      let label = placeholder.replace(/[{}]/g, '');
      let type: 'select' | 'size-input' = 'select';
      
      if (key.includes('size')) {
        if (key.includes('raceway')) {
          label = 'Raceway Size';
          type = 'size-input';
        } else if (key.includes('backer')) {
          label = 'Backer Size';
          type = 'select';
        } else {
          label = 'Size';
          type = 'select';
        }
      } else if (key.includes('color')) {
        label = 'Color';
      } else if (key.includes('fab') || key.includes('fabrication')) {
        label = 'Fab Type';
      } else if (key.includes('raceway')) {
        label = 'Raceway';
      } else if (key.includes('backer')) {
        if (key.includes('size') || key.includes('backersize')) {
          label = 'Backer Size';
          type = 'select';
        } else if (key.includes('illumination')) {
          label = 'Backer Illumination';
        } else {
          label = 'Backer Panel';
        }
      } else if (key.includes('print') || key.includes('material')) {
        label = 'Print Material';
      } else if (key.includes('mounting') || key.includes('surface')) {
        label = 'Mounting Surface';
      } else if (key.includes('anti') || key.includes('graffiti')) {
        label = 'Anti-Graffiti';
      } else {
        label = placeholder.replace(/[{}]/g, '');
      }
      
      fields.push({
        key,
        label,
        type,
        placeholder: label
      });
    });

    console.log("EditPricingLineDrawer - Generated fields:", fields);
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
          const key = placeholder.replace(/[{}]/g, '').toLowerCase().replace(/\s+/g, '');
          console.log(`Processing placeholder: "${placeholder}" -> key: "${key}"`);
          
          // Skip Size field as it's handled separately with sign_pricing data
          if (key === 'size') {
            continue;
          }
          
          // Skip Behind-The-Wall Option fields only
          if (key.includes('behind') || key.includes('wall') || key.includes('behindthewall')) {
            continue;
          }
          
          // Map placeholder to option name
          let optionName = '';
          if (key.includes('color')) {
            optionName = 'Color';
          } else if (key.includes('fab') || key.includes('fabrication')) {
            optionName = 'Fab Type';
          } else if (key.includes('raceway') && !key.includes('size')) {
            optionName = 'Raceway';
          } else if (key.includes('backer')) {
            if (key.includes('size')) {
              continue;
            } else if (key.includes('illumination')) {
              optionName = 'Backer Illumination';
            } else {
              optionName = 'Backer Panel Size';
            }
          } else if (key.includes('print') || key.includes('material')) {
            optionName = 'Print Material';
          } else if (key.includes('mounting') || key.includes('surface')) {
            optionName = 'Mounting Surface';
          } else if (key.includes('anti') || key.includes('graffiti')) {
            optionName = 'Anti-Graffiti';
          }
          
          if (optionName) {
            try {
              console.log(`Fetching options for: ${optionName} (key: ${key})`);
              const response = await fetch(`/api/options/get-by-name?option_name=${encodeURIComponent(optionName)}`);
              if (response.ok) {
                const data = await response.json();
                console.log(`Option data for ${optionName}:`, data);
                if (data.data) {
                  const valuesResponse = await fetch(`/api/option-values/get-by-optionId?option_id=${data.data.id}`);
                  if (valuesResponse.ok) {
                    const valuesData = await valuesResponse.json();
                    console.log(`Option values for ${optionName}:`, valuesData);
                    newOptions[key] = valuesData.data || [];
                    console.log(`Stored options for key "${key}":`, newOptions[key]);
                  } else {
                    console.error(`Failed to fetch values for ${optionName}:`, valuesResponse.status);
                  }
                } else {
                  console.log(`No option data found for ${optionName}`);
                }
              } else {
                console.error(`Failed to fetch option ${optionName}:`, response.status);
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

  // Set pricing data from the existing pricing line
  useEffect(() => {
    console.log("EditPricingLineDrawer - Pricing useEffect triggered");
    console.log("EditPricingLineDrawer - hasDataFromProps:", hasDataFromProps);
    console.log("EditPricingLineDrawer - pricingLine:", pricingLine);
    
    if (hasDataFromProps && pricingLine) {
      // Use the existing pricing data from the pricing line
      const pricing = {
        id: pricingLine.id,
        sign_id: pricingLine.sign_id,
        size: signData.size || "12",
        sign_price: pricingLine.list_price || 0,
        install_price: pricingLine.list_install_price || 0,
        sign_budget: pricingLine.cost_budget || 0,
        install_budget: pricingLine.cost_install_budget || 0,
        raceway: 0,
        sign_budget_multiplier: selectedSignData?.sign_budget_multiplier || 0.8,
        install_budget_multiplier: selectedSignData?.install_budget_multiplier || 0.6,
      };
      
      console.log("EditPricingLineDrawer - Using existing pricing data:", pricing);
      console.log("EditPricingLineDrawer - Pricing line values:", {
        list_price: pricingLine.list_price,
        list_install_price: pricingLine.list_install_price,
        cost_budget: pricingLine.cost_budget,
        cost_install_budget: pricingLine.cost_install_budget
      });
      
      setCurrentPricing(pricing);
      setEditablePrices({
        signPrice: pricing.sign_price.toFixed(2),
        installPrice: pricing.install_price.toFixed(2),
        signBudget: pricing.sign_budget.toFixed(2),
        installBudget: pricing.install_budget.toFixed(2),
      });
      
      // Also set the modified values to match the current pricing
      setModifiedSignPrice(pricing.sign_price.toFixed(2));
      setModifiedSignBudget(pricing.sign_budget.toFixed(2));
      setModifiedInstallBudget(pricing.install_budget.toFixed(2));
    }
  }, [hasDataFromProps, pricingLine, signData.size, selectedSignData]);

  // Debug useEffect to log signData changes
  useEffect(() => {
    console.log("EditPricingLineDrawer - signData updated:", signData);
  }, [signData]);

  const handleSizeChange = (value: string) => {
    setSignData({ ...signData, size: value });
  };

  const handleEditPrices = () => {
    setEditablePrices({
      signPrice: modifiedSignPrice,
      installPrice: editablePrices.installPrice,
      signBudget: modifiedSignBudget,
      installBudget: modifiedInstallBudget,
    });
    setIsEditingPrices(true);
  };

  const handleSavePrices = () => {
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
    setSavedPrices(null);
    console.log("Prices reset to original calculated values");
  };

  const handleSave = async () => {
    if (onSave && pricingLine) {
      const updatedData = {
        ...pricingLine,
        list_price: parseFloat(savedPrices?.signPrice || modifiedSignPrice),
        list_install_price: parseFloat(savedPrices?.installPrice || editablePrices.installPrice),
        cost_budget: parseFloat(savedPrices?.signBudget || modifiedSignBudget),
        cost_install_budget: parseFloat(savedPrices?.installBudget || modifiedInstallBudget),
        description_resolved: generateDescriptionResolved(),
        qty: pricingLine.qty || 1,
      };
      
      console.log("EditPricingLineDrawer - Saving updated data:", updatedData);
      
      // Update the pricing line in the database
      try {
        const response = await fetch(`/api/pricing-lines/${pricingLine.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedData),
        });
        
        if (response.ok) {
          console.log("EditPricingLineDrawer - Successfully updated pricing line");
          onSave(updatedData);
        } else {
          console.error("Failed to update pricing line:", response.status);
        }
      } catch (error) {
        console.error("Error updating pricing line:", error);
      }
    }
    onClose();
  };

  const handleClose = () => {
    setSavedPrices(null);
    setIsEditingPrices(false);
    onClose();
  };

  // Helper function to generate description_resolved based on sign_description template
  const generateDescriptionResolved = () => {
    if (!selectedSignData) return "";
    
    let description = selectedSignData.sign_description || "";
    
    // Replace all placeholders with actual values
    const placeholders = description.match(/\{([^}]+)\}/g) || [];
    
    placeholders.forEach((placeholder: string) => {
      const key = placeholder.replace(/[{}]/g, '').toLowerCase().replace(/\s+/g, '');
      const value = signData[key];
      
      if (value) {
        if (key.includes('raceway') && !key.includes('size')) {
          let racewayValue = value;
          
          if (signData.racewaySize && signData.racewaySize.height && signData.racewaySize.width) {
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
        description = description.replace(placeholder, "");
      }
    });
    
    description = description.replace(/\s+/g, " ").trim();
    
    return description;
  };

  // Helper function to calculate modified sign price and budgets based on selected options
  const calculateModifiedValues = () => {
    if (!currentPricing) return { signPrice: "0.00", signBudget: "0.00", installBudget: "0.00" };
    
    const baseSignPrice = currentPricing.sign_price;
    const baseInstallPrice = currentPricing.install_price;
    let signPriceModifier = 0;
    let installPriceModifier = 0;
    
    // Calculate modifiers from selected options
    Object.keys(dynamicOptions).forEach((key) => {
      const value = signData[key];
      const options = dynamicOptions[key];
      
      if (value && options) {
        const selectedOption = options.find((opt: OptionValue) => opt.display_label === value);
        if (selectedOption && selectedOption.price_modifier_value) {
          if (key.includes('mounting') || key.includes('surface')) {
            if (selectedOption.price_modifier_type === 'Percentage') {
              installPriceModifier += (baseInstallPrice * selectedOption.price_modifier_value) / 100;
            } else {
              installPriceModifier += selectedOption.price_modifier_value;
            }
          } else {
            if (selectedOption.price_modifier_type === 'Percentage') {
              signPriceModifier += (baseSignPrice * selectedOption.price_modifier_value) / 100;
            } else {
              signPriceModifier += selectedOption.price_modifier_value;
            }
          }
        }
      }
    });
    
    const racewayField = Object.keys(signData).find(key => 
      key.includes('raceway') && !key.includes('size') && signData[key]
    );
    if (racewayField && currentPricing.raceway) {
      console.log("EditPricingLineDrawer - Raceway selected, adding raceway value:", currentPricing.raceway);
      signPriceModifier += currentPricing.raceway;
    }
    
    const finalSignPrice = baseSignPrice + signPriceModifier;
    const finalInstallPrice = baseInstallPrice + installPriceModifier;
    
    const signBudgetMultiplier = selectedSignData?.sign_budget_multiplier || 0;
    const installBudgetMultiplier = selectedSignData?.install_budget_multiplier || 0;
    
    console.log("EditPricingLineDrawer - Budget calculation:", {
      finalSignPrice,
      finalInstallPrice,
      signPriceModifier,
      installPriceModifier,
      signBudgetMultiplier,
      installBudgetMultiplier,
      selectedSignData
    });
    
    const modifiedSignBudget = finalSignPrice * signBudgetMultiplier;
    const modifiedInstallBudget = finalInstallPrice * installBudgetMultiplier;
    
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
  }, [currentPricing, signData, dynamicOptions, selectedSignData]);

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
    <Drawer
      open={isOpen}
      onClose={handleClose}
      direction="right"
      size={560}
      duration={300}
      overlayOpacity={0.5}
      overlayColor="#000"
      enableOverlay={true}
      zIndex={1000}
      className="!w-[560px]"
    >
      <div className="h-full flex flex-col">
        {/* Header with blue bar */}
        <section className="flex items-center justify-between p-4 border-b border-[#DEE1EA] bg-white">
          <button onClick={handleClose}>
            <ArrowLeft className="size-5" />
          </button>
          <h2 className="text-[20px] font-bold">Edit Sign Configuration</h2>
          <button onClick={handleClose}>
            <X className="size-5" />
          </button>
        </section>
      {/* Sign Preview */}
      <section className="p-4 flex items-center">
        <div className="h-20 w-[130px] p-3 bg-[#F3F4F8] rounded-lg flex items-center justify-center">
          {selectedSignData?.sign_image ? (
            <img src={selectedSignData.sign_image} alt="" />
          ) : (
            <img src="/images/dave1.png" alt="" />
          )}
        </div>
        <span className="text-[14px] ml-3 font-medium">
          {selectedSignData?.sign_name || "Edit Sign"}
        </span>

        <Input
          className="h-9 border-[#E0E0E0] w-12 ml-auto focus:border-[#E0E0E0] focus:ring-0 text-center"
          placeholder="Qty"
          defaultValue={pricingLine?.qty?.toString() || "1"}
          onChange={(e) => {
            // Update the pricing line qty
            if (pricingLine) {
              pricingLine.qty = parseInt(e.target.value) || 1;
            }
          }}
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
                      {size}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="no-sizes" disabled>No sizes available</SelectItem>
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
                              {field.key.includes('backer') && field.key.includes('size') ? (
                  <Input
                    value={signData[field.key] || ""}
                    onChange={(e) =>
                      setSignData({ ...signData, [field.key]: e.target.value })
                    }
                    className="h-9 w-auto min-w-[120px] border-[#DEE1EA] focus:border-[#DEE1EA] focus:ring-0"
                    placeholder="Enter size"
                  />
                ) : field.type === 'select' ? (
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
                        <SelectItem value="loading" disabled>Loading...</SelectItem>
                      ) : dynamicOptions[field.key]?.length > 0 ? (
                        dynamicOptions[field.key].map((option: OptionValue) => (
                          <SelectItem key={option.id} value={option.display_label}>
                            {option.display_label}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value={`no-${field.key}`} disabled>
                          No options available
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                ) : field.type === 'size-input' ? (
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
          {formFields.some(field => field.key.includes('raceway') && !field.key.includes('size')) && (
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
            onClick={isEditingPrices ? handleSavePrices : handleSave}
            className="flex-1 py-2 px-3 text-black disabled:text-[#464C53] bg-white disabled:bg-[#1018280D] h-10 flex items-center justify-center text-[14px] rounded-sm font-semibold"
          >
            {isEditingPrices ? "Save Pricing" : "Save Changes"}
          </button>
        </div>
      </section>
      </div>
    </Drawer>
  );
}; 