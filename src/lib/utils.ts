import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatNumber(num: number | string): string {
  const number = typeof num === 'string' ? parseFloat(num) : num;
  if (isNaN(number)) return '0';

  if (number >= 1_000_000_000) {
    return `${(number / 1_000_000_000).toFixed(3)}B`;
  }
  if (number >= 1_000_000) {
    return `${(number / 1_000_000).toFixed(3)}M`;
  }
  if (number >= 1_000) {
    return `${(number / 1_000).toFixed(3)}K`;
  }
  return number.toLocaleString('en-US');
}

export const defaultImages = {
  profile: "https://api.dicebear.com/7.x/avataaars/svg?seed=1",
  idea: "https://images.unsplash.com/photo-1621504450181-5d356f61d307?q=80&w=800",
  // You can add more default images here
};

export function getProfileImage(image: string | null): string {
  return image || defaultImages.profile;
}

export function getIdeaImage(image: string | null): string {
  return image || defaultImages.idea;
}
