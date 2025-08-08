"use client";
import { useState } from "react";

interface SignImageCellProps {
  src: string;
  signName: string;
}

export const SignImageCell = ({ src, signName }: SignImageCellProps) => {
  const [imgError, setImgError] = useState(false);

  // Return a simple colored div with initials if image fails to load
  if (imgError || !src) {
    const initials = signName
      .split(" ")
      .map((word: string) => word[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);

    return (
      <div className="flex items-center justify-center h-10 w-10 rounded-full bg-gray-200 text-gray-600 text-sm font-medium">
        {initials}
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={`${signName} Sign`}
      className="object-contain w-[80%] h-[80%] max-h-16 max-w-[120px] mx-auto"
      onError={() => setImgError(true)}
    />
  );
};
