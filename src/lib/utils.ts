import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Function to generate proposal number based on brand name
export function generateProposalNumber(brandName: string): string {
  if (!brandName || brandName.trim() === '') {
    return 'BRANDP-001'; // Default fallback with P before dash
  }

  // Extract initials from brand name (first letter of each word)
  const words = brandName.trim().split(/\s+/);
  const initials = words.map(word => word.charAt(0).toUpperCase()).join('');
  
  // If no initials (empty string), use first 3 letters of brand name
  if (initials === '') {
    const firstThree = brandName.substring(0, 3).toUpperCase();
    return `${firstThree}P-001`;
  }
  
  // If initials are less than 3 characters, pad with 'P' for "Proposal"
  let proposalPrefix = initials;
  if (proposalPrefix.length < 3) {
    proposalPrefix = proposalPrefix + 'P'.repeat(3 - proposalPrefix.length);
  }
  
  // For now, we'll use 001 as the sequence number with P before the dash
  // In a real implementation, you might want to query the database for the next available number
  return `${proposalPrefix}P-001`;
}
