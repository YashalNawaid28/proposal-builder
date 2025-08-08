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

/**
 * Get the primary user ID from either the auth user or user metadata
 * This ensures we always use the custom table ID as the primary identifier
 */
export function getPrimaryUserId(authUser: any, userData: any): string | null {
  // First try to get the ID from our custom table data
  if (userData?.id) {
    return userData.id;
  }
  
  // If no custom table data, try to get it from auth user metadata
  if (authUser?.user_metadata?.user_id) {
    return authUser.user_metadata.user_id;
  }
  
  // Fallback to auth user ID if nothing else is available
  if (authUser?.id) {
    return authUser.id;
  }
  
  return null;
}

/**
 * Check if a user has valid authentication with proper ID consistency
 */
export function isUserAuthenticated(authUser: any, userData: any): boolean {
  const primaryUserId = getPrimaryUserId(authUser, userData);
  return !!primaryUserId && !!authUser && !!userData;
}

/**
 * Get user email from the most reliable source
 */
export function getUserEmail(authUser: any, userData: any): string | null {
  // Prefer email from our custom table
  if (userData?.email) {
    return userData.email;
  }
  
  // Fallback to auth user email
  if (authUser?.email) {
    return authUser.email;
  }
  
  return null;
}
