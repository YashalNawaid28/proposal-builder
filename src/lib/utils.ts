import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getSiteUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  return "http://localhost:3000";
}

export function generateProposalNumber(brandName: string): string {
  if (!brandName || brandName.trim() === "") {
    return "BRANDP-001";
  }
  const words = brandName.trim().split(/\s+/);
  const initials = words.map((word) => word.charAt(0).toUpperCase()).join("");
  if (initials === "") {
    const firstThree = brandName.substring(0, 3).toUpperCase();
    return `${firstThree}P-001`;
  }
  let proposalPrefix = initials;
  if (proposalPrefix.length < 3) {
    proposalPrefix = proposalPrefix + "P".repeat(3 - proposalPrefix.length);
  }
  return `${proposalPrefix}P-001`;
}
