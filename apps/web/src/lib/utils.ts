import { clsx, type ClassValue } from "clsx";

/** Class name joiner used across the landing and site chrome. */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}
