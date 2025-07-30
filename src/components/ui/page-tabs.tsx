"use client";
interface PageTabsProps<T extends string> {
  tabs: T[];
  activeTab: T;
  onTabChange: (tab: T) => void;
  className?: string;
  variant?: "default" | "border-bottom";
}

export function PageTabs<T extends string>({
  tabs,
  activeTab,
  onTabChange,
  className = "",
  variant = "default",
}: Readonly<PageTabsProps<T>>) {
  if (variant === "border-bottom") {
    return (
      <div className={`ml-11 border-b border-[#EAEBEE] bg-white ${className}`}>
        <div className="flex space-x-6 text-[14px] h-11 text-[#60646C] font-semibold">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className={`pb-2 border-b-2 transition-colors ${
                activeTab === tab
                  ? "border-black text-black font-semibold"
                  : "border-transparent text-[#60646C] hover:text-gray-700"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>
    );
  }
  return (
    <div className={`flex ml-6 ${className}`}>
      {tabs.map((tab) => (
        <button
          key={tab}
          className={`rounded-t-[6px] text-[16px] h-10 px-4 cursor-pointer p-4 flex items-center justify-center ${
            activeTab === tab
              ? "text-white text-[16px] font-semibold bg-black shadow-[2px_0px_4px_0px_rgba(21,25,30,0.3)]"
              : "text-[14px] text-[#60646C]"
          }`}
          onClick={() => onTabChange(tab)}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}
