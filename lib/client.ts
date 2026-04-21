import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// This is the cn function we added before
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// ADD THIS NEW PART BELOW TO FIX THE CURRENT ERROR
export const hasEnvVars = 
  process.env.NEXT_PUBLIC_SUPABASE_URL && 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
