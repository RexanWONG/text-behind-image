import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateHash(input: string): string {
  // Generate a random number
  const randomNum = Math.random();

  // Combine the input string with the random number
  const combinedString = input + randomNum.toString();

  // Simple hash function
  let hash = 0;
  for (let i = 0; i < combinedString.length; i++) {
    const char = combinedString.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }

  // Convert the hash to a string of hexadecimal characters
  const hexHash = Math.abs(hash).toString(16);

  // Ensure the hash is at least 8 characters long
  const paddedHash = hexHash.padStart(8, '0');

  // Take the first 8 characters
  return paddedHash.slice(0, 8);
}
