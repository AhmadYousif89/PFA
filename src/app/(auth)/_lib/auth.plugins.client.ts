import { BetterFetchOption } from "better-auth/react";
import { BetterAuthClientPlugin } from "better-auth";
import { StashBody } from "@/app/shared-data/onboarding";
import type { TDemoCookiePlugin, TOnboardingPlugin } from "./auth.plugins";

const ONBOARDING_ID = "onboarding";

export const onboardingClientPlugin = {
  id: ONBOARDING_ID,
  $InferServerPlugin: {} as TOnboardingPlugin,
  getActions: ($fetch) => {
    return {
      stash: async (stash: StashBody, fetchOptions?: BetterFetchOption) => {
        if (
          !stash ||
          typeof stash !== "object" ||
          !Array.isArray(stash.categories) ||
          typeof stash.currentBalance !== "number" ||
          typeof stash.monthlyIncome !== "number"
        ) {
          return { message: "Invalid stash data", status: 400 };
        }

        const { data, error } = await $fetch<StashBody>("/onboarding/stash", {
          method: "POST",
          body: JSON.stringify({
            categories: stash.categories,
            currentBalance: stash.currentBalance,
            monthlyIncome: stash.monthlyIncome,
          }),
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          ...fetchOptions,
        });
        if (error) {
          return {
            message: error.message || "API:Error stashing onboarding data",
            status: error.status,
          };
        }

        return data;
      },
      finalize: async (_: void, fetchOptions?: BetterFetchOption) => {
        const { data, error } = await $fetch<{ ok: boolean }>("/onboarding/finalize", {
          method: "POST",
          credentials: "include",
          ...fetchOptions,
        });

        if (error) {
          return {
            message: error.message || "Error finalizing onboarding",
            status: error.status,
          };
        }

        return data;
      },
    };
  },
} satisfies BetterAuthClientPlugin;

export const demoCookieClientPlugin = {
  id: "demo-cookie",
  $InferServerPlugin: {} as TDemoCookiePlugin,
  getActions: ($fetch) => {
    return {
      checkDemoCookie: async (_: void, fetchOptions?: BetterFetchOption) => {
        const { data, error } = await $fetch("/demo-cookie", {
          method: "GET",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          ...fetchOptions,
        });
        if (error) return false;
        return !!data;
      },
    };
  },
} satisfies BetterAuthClientPlugin;
