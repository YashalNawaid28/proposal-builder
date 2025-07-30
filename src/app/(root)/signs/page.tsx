"use client";
import { useState, useEffect, Fragment } from "react";
import {
  ChevronRight,
  Droplet,
  LayoutTemplate,
  Scan,
  Type,
  ImagePlus,
} from "lucide-react";
import type { BrandData } from "../brands/page";
import { IAccount } from "@/lib/interfaces";
import Image from "next/image";
import { PageTabs } from "@/components/ui/page-tabs";

// Helper to format currency
const formatCurrency = (value: string | number | undefined | null) => {
  if (value === null || value === undefined) return "$0.00";
  const num =
    typeof value === "string"
      ? parseFloat(value.replace(/[^0-9.-]+/g, ""))
      : value;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(num);
};

// A map for dynamic icons in the "Sign Options" section
const optionIcons: { [key: string]: React.ReactNode } = {
  default: <Scan size={20} />,
  Raceway: <LayoutTemplate size={20} />,
  Color: <Droplet size={20} />,
  Fabrication: <Type size={20} />,
};

// Helper function to get column width class
const getColumnWidth = (index: number): string => {
  if (index === 0) return "w-[77px]";
  if (index === 1) return "w-24";
  if (index === 2) return "w-24";
  if (index === 3) return "w-24";
  if (index === 4) return "w-24";
  return "w-[77px]";
};

const SignsPage = () => {
  const [tab, setTab] = useState("Dave's Hot Chicken");
  const [brands, setBrands] = useState<string[]>(["Dave's Hot Chicken"]);
  const [signData, setSignData] = useState<IAccount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);

  useEffect(() => {
    const fetchSigns = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/signs");

        if (!response.ok) {
          throw new Error(`API request failed with status: ${response.status}`);
        }
        const responseData = await response.json();

        if (!responseData.data || !Array.isArray(responseData.data)) {
          throw new Error("Invalid API response format");
        }

        const brandNames = responseData.data.map(
          (brand: BrandData) => brand.brand_name
        );
        if (brandNames.length > 0) {
          setBrands(brandNames);
          if (!brandNames.includes(tab)) {
            setTab(brandNames[0]);
          }
        }

        const selectedBrand = responseData.data.find(
          (brand: BrandData) => brand.brand_name === tab
        );

        if (!selectedBrand?.signs) {
          setSignData([]);
          return;
        }

        type SignPricing = {
          size?: string;
          sign_price?: number;
          install_price?: number;
          sign_budget?: number;
          install_budget?: number;
          raceway?: number;
        };
        type SignOptionRaw = {
          option_name?: string;
          input_type?: string;
        };
        type SignRaw = {
          sign_image?: string;
          sign_name?: string;
          sign_description?: string;
          status?: string;
          created_at: string;
          sign_pricing?: SignPricing[];
          options?: SignOptionRaw[];
        };

        const transformedData = (selectedBrand.signs as SignRaw[]).map(
          (sign) => {
            const createdDate = new Date(sign.created_at);
            const day = createdDate.getDate();
            const suffix =
              ["th", "st", "nd", "rd"][((day % 100) - 20) % 10] ||
              ["th", "st", "nd", "rd"][day % 10] ||
              "th";
            const formattedDate = `${createdDate.toLocaleDateString("en-US", {
              month: "short",
            })} ${day}${suffix}, ${createdDate.getFullYear()}`;

            const details =
              sign.sign_pricing && Array.isArray(sign.sign_pricing)
                ? sign.sign_pricing.map((pricing) => ({
                    size: pricing.size || "",
                    signPrice: formatCurrency(pricing.sign_price),
                    installPrice: formatCurrency(pricing.install_price),
                    signBudget: formatCurrency(pricing.sign_budget),
                    installBudget: formatCurrency(pricing.install_budget),
                    raceway: formatCurrency(pricing.raceway),
                  }))
                : [];

            const signOptions =
              sign.options && Array.isArray(sign.options)
                ? sign.options.map((option) => ({
                    label: option.option_name || "",
                    type:
                      (option.input_type as "Dropdown" | "User Input") ||
                      "Dropdown",
                    checked: true,
                  }))
                : [];

            return {
              signImage: sign.sign_image || "",
              signName: sign.sign_name || "Unnamed Sign",
              signDescription: sign.sign_description || "",
              status: (sign.status as "Active" | "Inactive") || "Active",
              dateAdded: formattedDate,
              signOptions: signOptions,
              details: details,
            };
          }
        );

        setSignData(transformedData);
        setExpandedRow(null);
        setError(null);
      } catch (err) {
        console.error("Error fetching signs:", err);
        setError("Failed to load sign data. Please try again later.");
        setSignData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSigns();
  }, [tab]);

  const handleRowToggle = (signName: string) => {
    setExpandedRow(expandedRow === signName ? null : signName);
  };

  return (
    <div className="bg-white">
      <h1 className="text-2xl font-bold p-5">Signs</h1>
      <PageTabs tabs={brands} activeTab={tab} onTabChange={setTab} />
      <div className="border border-[#DEE1EA] rounded-lg overflow-hidden">
        {(() => {
          if (loading) {
            return <div className="p-8 text-center">Loading sign data...</div>;
          }
          if (error) {
            return <div className="p-8 text-center text-red-500">{error}</div>;
          }
          return (
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead className="bg-[#F9F9FB] text-xs font-semibold">
                  <tr className="border-b border-[#DEE1EA] h-[50px]">
                    <th className="w-12 border-r border-[#DEE1EA]">
                      <input
                        type="checkbox"
                        className="h-4 w-4 mt-1 border-[#DEE1EA]"
                      />
                    </th>
                    <th className="p-4 text-left font-semibold w-52 border-r border-[#DEE1EA] text-xs">
                      Sign Image
                    </th>
                    <th className="p-4 text-left font-semibold min-w-[200px] border-r border-[#DEE1EA] text-xs">
                      Sign Name
                    </th>
                    <th className="p-4 text-left font-semibold min-w-[350px] border-r border-[#DEE1EA] text-xs">
                      Sign Description
                    </th>
                    <th className="p-4 text-center font-semibold w-64 border-r border-[#DEE1EA] text-xs">
                      Status
                    </th>
                    <th className="p-4 text-center font-semibold w-64 text-xs">
                      Date Added
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {signData.map((sign) => (
                    <Fragment key={sign.signName}>
                      {/* Main Row */}
                      <tr className="hover:bg-gray-50 h-20">
                        <td className="p-4 text-center border-r border-[#DEE1EA]">
                          <button
                            onClick={() => handleRowToggle(sign.signName)}
                          >
                            <ChevronRight
                              size={20}
                              className={`transition-transform duration-200 ${
                                expandedRow === sign.signName
                                  ? "rotate-90"
                                  : "rotate-0"
                              }`}
                            />
                          </button>
                        </td>
                        <td className=" border-r border-[#DEE1EA] flex items-center justify-center h-20">
                          {sign.signImage &&
                          sign.signImage !== "" &&
                          sign.signImage !== "/daves-hot-chicken-logo.png" ? (
                            <img
                              src={sign.signImage}
                              alt=""
                              className="object-contain"
                            />
                          ) : (
                            <ImagePlus size={40} className="text-[#60646C]" />
                          )}
                        </td>
                        <td className="p-4 font-semibold border-r border-[#DEE1EA] text-[14px]">
                          {sign.signName}
                        </td>
                        <td className="p-4 border-r border-[#DEE1EA] text-[12px]">
                          {sign.signDescription}
                        </td>
                        <td className="p-4 border-r border-[#DEE1EA] text-center">
                          <span className="bg-[#17B26A1A] text-[#17B26A] h-[24px] font-semibold px-3 py-1 rounded text-[14px]">
                            {sign.status}
                          </span>
                        </td>
                        <td className="p-4 text-center text-[14px]">
                          {sign.dateAdded}
                        </td>
                      </tr>
                      {/* Expanded Detail Row */}
                      {expandedRow === sign.signName && (
                        <tr className="bg-white">
                          <td colSpan={7} className="p-0">
                            <div className="flex bg-[#F9F9FB]">
                              {/* Left Side: Pricing Table */}
                              <div className="flex-1 border-r border-[#DEE1EA] min-w-0">
                                <table className="min-w-full text-sm border-collapse">
                                  <thead>
                                    <tr className="border-b text-[13px] border-[#DEE1EA] h-[45px]">
                                      {[
                                        "Size",
                                        "Sign Price",
                                        "Install Price",
                                        "Sign Budget",
                                        "Install Budget",
                                        "Raceway",
                                      ].map((header, index) => (
                                        <th
                                          key={header}
                                          className={`p-4 text-center font-semibold text-black text-[13px] ${
                                            index < 5
                                              ? "border-r border-[#DEE1EA]"
                                              : ""
                                          } ${getColumnWidth(index)}`}
                                        >
                                          {header}
                                        </th>
                                      ))}
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-gray-200">
                                    {sign.details.map((detail, index) => (
                                      <tr
                                        key={index}
                                        className={`h-[45px] text-[14px] ${
                                          index === sign.details.length - 1
                                            ? "border-b border-[#DEE1EA]"
                                            : ""
                                        }`}
                                      >
                                        <td className="p-4 font-medium border-r border-[#DEE1EA] text-center">
                                          {detail.size}
                                        </td>
                                        <td className="p-4 border-r border-[#DEE1EA] text-center w-24">
                                          {detail.signPrice}
                                        </td>
                                        <td className="p-4 border-r border-[#DEE1EA] text-center w-24">
                                          {detail.installPrice}
                                        </td>
                                        <td className="p-4 border-r border-[#DEE1EA] text-center w-24">
                                          {detail.signBudget}
                                        </td>
                                        <td className="p-4 border-r border-[#DEE1EA] text-center w-24">
                                          {detail.installBudget}
                                        </td>
                                        <td className="p-4 text-center w-20">
                                          {detail.raceway}
                                        </td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                              {/* Right Side: Sign Options */}
                              <div className="w-[320px] flex-shrink-0">
                                <h3 className="font-semibold pl-6 text-[13px] my-4">
                                  Sign Options
                                </h3>
                                <div className="space-y-3 p-6 w-full">
                                  {sign.signOptions.map((option, index) => (
                                    <div
                                      key={index}
                                      className="flex items-center justify-between p-2"
                                    >
                                      <div className="flex items-center gap-3 min-w-0 flex-1">
                                        {optionIcons[
                                          option.label.split(" ")[0]
                                        ] || optionIcons.default}
                                        <div className="-space-y-0.5 min-w-0 flex-1">
                                          <div className="font-semibold text-[16px] truncate">
                                            {option.label}
                                          </div>
                                          <div className="text-[14px] truncate">
                                            {option.type}
                                          </div>
                                        </div>
                                      </div>
                                      {option.checked && (
                                        <Image
                                          src="/images/Tick.svg"
                                          alt=""
                                          width={30}
                                          height={30}
                                        />
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          );
        })()}
      </div>
    </div>
  );
};

export default SignsPage;
