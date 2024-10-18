import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { createNoise2D } from 'simplex-noise';

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

export function applyNoiseToGradient(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  noiseLevel: number
): ImageData {
  const imageData = ctx.getImageData(0, 0, width, height);
  const noise2D = createNoise2D();
  
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      const i = (y * width + x) * 4;
      const noiseValue = noise2D(x / 10, y / 10) * (noiseLevel / 100);
      imageData.data[i] = Math.max(0, Math.min(255, imageData.data[i] + noiseValue * 255));
      imageData.data[i+1] = Math.max(0, Math.min(255, imageData.data[i+1] + noiseValue * 255));
      imageData.data[i+2] = Math.max(0, Math.min(255, imageData.data[i+2] + noiseValue * 255));
    }
  }
  
  return imageData;
}
