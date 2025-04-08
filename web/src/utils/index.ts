import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function vhToPx(vh: number): number {
  if (typeof window === "undefined") {
    throw new Error("This function can only be used in a browser environment.");
  }
  const viewportHeight = window.innerHeight;
  return (vh / 100) * viewportHeight;
}

export * from './post'