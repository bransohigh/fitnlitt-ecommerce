import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format a price number for display — removes floating point artifacts.
 * e.g. 4799.9400000000005 → "4.799,94"
 */
export function formatPrice(price: number): string {
  return price.toLocaleString('tr-TR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
}
