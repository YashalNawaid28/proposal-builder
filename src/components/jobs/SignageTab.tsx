"use client";
import { SignOption } from "./AddSignServiceSidebar";

interface SignageTabProps {
  onSignSelect: (sign: SignOption) => void;
}

export const SignageTab = ({ onSignSelect }: SignageTabProps) => {
  const signageOptions: SignOption[] = [
    {
      id: "1",
      name: "Channel Letters",
      image: "/images/dave1.png",
      description: "Single line channel letters",
    },
    {
      id: "2",
      name: "2-Line Channel Letters",
      image: "/images/dave2.png",
      description: "Two line channel letters",
    },
    {
      id: "3",
      name: "Channel Letters on a Backer Panel",
      image: "/images/dave3.png",
      description: "Channel letters mounted on backer panel",
    },
    {
      id: "4",
      name: "2-Line Channel Letters on Backer Panels",
      image: "/images/dave4.png",
      description: "Two line channel letters on backer panel",
    },
    {
      id: "5",
      name: "Circular Logo",
      image: "/images/dave5.png",
      description: "Circular logo design",
    },
    {
      id: "6",
      name: "Blade Sign",
      image: "/images/dave6.png",
      description: "Projecting blade sign",
    },
  ];

  return (
    <div className="grid grid-cols-2">
      {signageOptions.map((option) => (
        <button
          key={option.id}
          onClick={() => onSignSelect(option)}
          className="cursor-pointer flex flex-col justify-between group w-full border-b border-r border-[#DEE1EA] p-5 h-[240px]"
        >
          <div className="bg-[#F3F4F8] flex-1 rounded-[8px] mb-2">
            <div className="rounded flex h-full items-center justify-center overflow-hidden">
              <img
                src={option.image}
                alt={option.name}
                className="object-cover"
              />
            </div>
          </div>
          <p className="text-[16px] font-semibold text-center">{option.name}</p>
        </button>
      ))}
    </div>
  );
};
