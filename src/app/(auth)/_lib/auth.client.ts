import { auth } from "./auth";
import { createAuthClient } from "better-auth/react";
import { inferAdditionalFields } from "better-auth/client/plugins";
import { demoCookieClientPlugin, onboardingClientPlugin } from "./auth.plugins.client";
import { StashBody } from "@/app/shared-data/onboarding";
import { SignUpData } from "./sign-up.schema";
import { SignInData } from "./sign-in.schema";

export const authClient = createAuthClient({
  baseURL: typeof window !== "undefined" ? window.location.origin : undefined,
  fetchOptions: {
    credentials: "include", // ensure cookies are sent for hooks like useSession
  },
  plugins: [inferAdditionalFields<typeof auth>(), demoCookieClientPlugin, onboardingClientPlugin],
});

export const useSession = () => authClient.useSession();
export type SessionClient = ReturnType<typeof useSession>;
export const getSession = async () => await authClient.getSession();
export const signUpWithEmail = (data: SignUpData) => authClient.signUp.email(data);
export const signInWithEmail = (data: SignInData) => authClient.signIn.email(data);
export const signOut = () =>
  authClient.signOut({
    fetchOptions: {
      onSuccess: () => {
        window.location.href = "/"; // Redirect to home on sign out
      },
    },
  });

export const onboardingClient = {
  stash: async (d: StashBody) => await authClient.stash(d),
  finalize: async () => await authClient.finalize(),
};

export const checkDemoCookieClient = async () => {
  return await authClient.checkDemoCookie();
};
