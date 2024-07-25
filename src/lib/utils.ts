import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatDate, formatDistanceToNowStrict } from "date-fns";
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatRelativeDate = (from: Date) => {
  const cureentDate = new Date();
  if (cureentDate.getTime() - from.getTime() < 24 * 60 * 60 * 1000) {
    return formatDistanceToNowStrict(from, { addSuffix: true });
  } else {
    if (cureentDate.getFullYear() === from.getFullYear()) {
      return formatDate(from, "d MMM");
    } else {
      return formatDate(from, "d MMM yyyy");
    }
  }
};

export const formatNumber = (number: number): string => {
  return Intl.NumberFormat("en-US", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(number);
};

export const slugify = (input: string): string => {
  return input
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^a-z0-9-]/g, "");
};
