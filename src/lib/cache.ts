import { cache as reactCache } from "react";
import { unstable_cache as nextCache } from "next/cache";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function cache<T extends (...args: any[]) => any>(
  cb: T,
  keyParts?: string[],
  options?: {
    revalidate?: number | false; // in seconds, or false to disable
    tags?: string[];
  },
) {
  return nextCache<T>(reactCache(cb), keyParts, options);
}
