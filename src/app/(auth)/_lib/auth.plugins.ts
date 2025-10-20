import "server-only";

import { BetterAuthPlugin } from "better-auth";
import { createAuthEndpoint } from "better-auth/api";

import { finalizeOnboarding, setOnboardingStash, StashBody } from "@/app/shared-data/onboarding";

export const ONBOARDING_COOKIE_NAME = "onboardingId";
export type TOnboardingPlugin = ReturnType<typeof onBoardingPlugin>;
// Plugin to handle user onboarding steps
export const onBoardingPlugin = () => {
  return {
    id: "onboarding",
    options: { headers: true, cookies: true },
    endpoints: {
      // POST /api/auth/onboarding/stash
      stash: createAuthEndpoint("/onboarding/stash", { method: "POST" }, async (ctx) => {
        let payload: StashBody | null = null;

        try {
          payload = (await ctx.body) as StashBody;
        } catch {
          return ctx.json({ ok: false, error: "Invalid JSON body" }, { status: 400 });
        }

        if (!payload || typeof payload !== "object") {
          console.log("Invalid stash payload:", payload);
          return ctx.json({ ok: false, error: "Invalid stash payload" }, { status: 400 });
        }

        const id = await setOnboardingStash(payload);
        if (!id) {
          return ctx.json({ ok: false, error: "Failed to stash onboarding data" }, { status: 500 });
        }

        ctx.setCookie(ONBOARDING_COOKIE_NAME, id, {
          path: "/",
          httpOnly: true,
          sameSite: "lax",
          secure: process.env.NODE_ENV === "production",
          maxAge: 60 * 60, // 1 hour same as the doc TTL in db
        });

        return ctx.json({ ok: true, id });
      }),

      // POST /api/auth/onboarding/finalize
      finalize: createAuthEndpoint("/onboarding/finalize", { method: "POST" }, async (ctx) => {
        // Skip if there's NO onboarding cookie
        const onboardingId = ctx.getCookie(ONBOARDING_COOKIE_NAME);
        if (!onboardingId) {
          console.log("No onboarding in progress, skipping finalize");
          return ctx.json({ ok: true, skipped: "No onboarding in progress" }, { status: 200 });
        }
        // Finalize onboarding process
        const result = await finalizeOnboarding();
        if (!result) {
          return ctx.json({ ok: false, error: "Finalizing onboarding failed" }, { status: 500 });
        }

        ctx.setCookie(ONBOARDING_COOKIE_NAME, "", {
          path: "/",
          maxAge: 0,
          httpOnly: true,
          sameSite: "lax",
        });

        return ctx.json({ ok: true, error: null });
      }),
    },
  } satisfies BetterAuthPlugin;
};

export type TDemoCookiePlugin = ReturnType<typeof demoCookiePlugin>;
// Plugin to handle demo cookie logic
export const demoCookiePlugin = () => {
  return {
    id: "demo-cookie",
    endpoints: {
      // GET /api/auth/demo-cookie
      checkDemoCookie: createAuthEndpoint("/demo-cookie", { method: "GET" }, async (ctx) => {
        const demoCookie = ctx.getCookie("demo");
        return !!demoCookie;
      }),
    },
  };
};
