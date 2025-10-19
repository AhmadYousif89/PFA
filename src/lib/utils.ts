import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { themeColors } from "./config";
import { ThemeColor } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatOrdinal(n: number) {
  const rem10 = n % 10;
  const rem100 = n % 100;
  if (rem10 === 1 && rem100 !== 11) return `${n}st`;
  if (rem10 === 2 && rem100 !== 12) return `${n}nd`;
  if (rem10 === 3 && rem100 !== 13) return `${n}rd`;
  return `${n}th`;
}

export function formatCurrency(amount: number, options: Intl.NumberFormatOptions = {}) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    ...options,
  }).format(amount);
}

export function formatDate(
  date: Date | string,
  locales: Intl.LocalesArgument = "en-GB",
  options: Intl.DateTimeFormatOptions = {},
) {
  return new Intl.DateTimeFormat(locales, {
    day: "numeric",
    month: "short",
    year: "numeric",
    ...options,
  }).format(new Date(date));
}

export function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function getObjectKeys<T extends Record<string, unknown>>(obj: T) {
  return Object.keys(obj) as (keyof T)[];
}

export function getThemeKey(theme: ThemeColor) {
  const keys = getObjectKeys(themeColors);
  const target = keys.find((key) => themeColors[key] === theme);
  return target ?? "General";
}

export type Slugify<T extends string> = T extends `${infer A} ${infer B}`
  ? `${Lowercase<A>}-${Slugify<B>}`
  : Lowercase<T>;

// Overload: literal types preserve a slugified literal; general string -> string
export function slugify<T extends string>(label: T): Slugify<T>;
export function slugify(label: string): string;
export function slugify(label: string) {
  return label
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
