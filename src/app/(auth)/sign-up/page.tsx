import { Metadata } from "next";
import { cookies } from "next/headers";

import { Badge } from "@/components/ui/badge";
import { SignUpForm } from "../_components/sign-up.form";
import { ONBOARDING_COOKIE_NAME } from "../_lib/auth.plugins";

export const metadata: Metadata = {
  title: "Sign Up - Personal Finance App",
  description: "Create a new account",
};

export default async function SignUpPage() {
  const cookieStore = await cookies();
  const onboardingId = cookieStore.get(ONBOARDING_COOKIE_NAME)?.value;

  let onboardInfo = null;
  let onboardBadge = null;
  if (onboardingId) {
    onboardInfo = (
      <p className="text-muted-foreground text-sm font-medium text-pretty">
        We have stashed your onboarding settings you just need to complete the sign-up process and
        start managing your personal finances.
      </p>
    );
    onboardBadge = <Badge className="bg-primary rounded-full px-4 py-0.5">Onboarding</Badge>;
  }

  return (
    <>
      <div className="space-y-2">
        <h1 className="flex items-end gap-4 text-xl font-bold">
          Sign Up
          {onboardBadge}
        </h1>
        {onboardInfo}
      </div>
      <SignUpForm />
    </>
  );
}
