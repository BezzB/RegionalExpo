import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a number or string as currency with proper comma separators
 * @param value - The number or string to format
 * @param currency - The currency code (e.g., 'USD', 'KES')
 * @returns Formatted currency string with commas
 */
export const formatCurrency = (value: string | number, currency: string): string => {
  // Convert string to number if needed
  const numericValue = typeof value === 'string' ? parseFloat(value.replace(/,/g, '')) : value;
  
  // Format the number with commas
  const formattedValue = numericValue.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2
  });

  return `${currency} ${formattedValue}`;
}; 