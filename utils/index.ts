import { type ClassValue, clsx } from "clsx";
import moment from "moment";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  return moment(date).format("DD MMMM YYYY");
}

export function convertEpochTimestamp(date: string): number {
  const currentDate = new Date(date);

  return currentDate.getTime();
}

export function convertEpochTimestampToReadable(epoch: number): string {
  return moment(epoch).format("DD MMMM YYYY");
}

export function changeToNormalText(
  text: string,
  type: "snakeCase" | "camelCase" | "trainCase"
): string {
  switch (type) {
    case "snakeCase":
      return text.replace(/_/g, " ");
    case "camelCase":
      return text.replace(/([A-Z])/g, " $1").trim();
    case "trainCase":
      return text.replace(/-/g, " ").trim();
    default:
      return text;
  }
}
