import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Function to generate proposal number based on job name
export function generateProposalNumber(jobName: string): string {
  if (!jobName || jobName.trim() === '') {
    return 'JOB-001'; // Default fallback
  }

  // Extract initials from job name (first letter of each word)
  const words = jobName.trim().split(/\s+/);
  const initials = words.map(word => word.charAt(0).toUpperCase()).join('');
  
  // If no initials (empty string), use first 3 letters of job name
  if (initials === '') {
    const firstThree = jobName.substring(0, 3).toUpperCase();
    return `${firstThree}-001`;
  }
  
  // If initials are less than 3 characters, pad with first letter
  let proposalPrefix = initials;
  if (proposalPrefix.length < 3) {
    proposalPrefix = proposalPrefix + proposalPrefix.charAt(0).repeat(3 - proposalPrefix.length);
  }
  
  // For now, we'll use 001 as the sequence number
  // In a real implementation, you might want to query the database for the next available number
  return `${proposalPrefix}-001`;
}
