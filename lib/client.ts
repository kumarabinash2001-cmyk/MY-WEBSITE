import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// Keeps your existing utility function
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// FIXES THE CURRENT BUILD ERROR
export const hasEnvVars = 
  process.env.NEXT_PUBLIC_SUPABASE_URL && 
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
