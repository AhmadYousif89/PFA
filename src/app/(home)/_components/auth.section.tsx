import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Section } from "@/components/ui/section";
import { Button } from "@/components/ui/button";

import LockIcon from "public/assets/images/icon-lock.svg";
import UserIcon from "public/assets/images/icon-user.svg";
import LogInIcon from "public/assets/images/icon-login.svg";
import SparklesIcon from "public/assets/images/icon-sparkles.svg";
import { ActionButton } from "@/components/action.button";
import { authClient, useSession } from "@/app/(auth)/_lib/auth.client";

type Props = {
  hasStash: boolean;
  isVisible: boolean;
  onBack: () => void;
  onScrollToNext: () => void;
};

export const AuthChoiceSection = ({ hasStash, isVisible, onBack, onScrollToNext }: Props) => {
  const router = useRouter();
  const { data: session } = useSession();
  const [isDemoLoading, setIsDemoLoading] = useState(false);

  const showRestartAlert = Boolean(session && session?.user.hasFinalized === false);

  const deleteUser = async () => {
    try {
      await authClient.deleteUser();
    } catch (e) {
      console.error("Failed to delete user before entering demo:", e);
    }
  };

  return (
    <Section
      id="auth-choice"
      data-section="auth"
      title="How would you like to proceed?"
      description="Choose to explore the app with pre-configured data or sign up to start tracking your real finances."
      onBack={onBack}
      className={cn(
        isVisible
          ? "visible translate-y-0 opacity-100 delay-500"
          : "pointer-events-none invisible -translate-y-24 opacity-0 delay-0",
      )}
    >
      <div className="grid gap-6 md:grid-cols-2">
        {/* Guest Mode Card */}
        <Card className="hover:border-primary/50 border-border/50 bg-card/70 hover:bg-card group relative justify-between gap-6 border-2 px-8 py-6 transition-all duration-300 hover:shadow-xl max-md:order-1">
          <div className="bg-accent text-accent-foreground flex size-12 items-center justify-center rounded-md">
            <UserIcon className="size-8" />
          </div>

          <div className="space-y-3">
            <h3 className="text-foreground text-lg font-bold">Try Demo Mode</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Explore the full app with pre-populated demo data. Perfect for testing features before
              committing.
            </p>
          </div>

          <div className="space-y-2">
            <div className="text-muted-foreground flex items-center gap-2 text-sm">
              <SparklesIcon className="fill-primary size-5" />
              <span>Instant access</span>
            </div>
            <div className="text-muted-foreground flex items-center gap-2 text-sm">
              <SparklesIcon className="fill-primary size-5" />
              <span>No account required</span>
            </div>
            <div className="text-muted-foreground flex items-center gap-2 text-sm">
              <SparklesIcon className="fill-primary size-5" />
              <span>Pre-configured dashboard</span>
            </div>
          </div>

          <ActionButton
            shouldAlert={showRestartAlert || hasStash}
            alertTitel="Incomplete Onboarding"
            alertDescription="Continuing will discard your current onboarding progress. Are you sure you want to proceed?"
            variant="outline"
            className="*:fill-muted-foreground mt-4 h-12 text-base"
            externalLoading={isDemoLoading}
            performAction={async () => {
              setIsDemoLoading(true);
              if (showRestartAlert) {
                await deleteUser();
              }
              router.push("/demo/dashboard");
            }}
          >
            Start Demo
          </ActionButton>
        </Card>

        {/* Sign Up Card */}
        <Card className="border-primary bg-muted/70 hover:bg-muted group relative justify-between gap-6 border-2 px-8 py-6 transition-all duration-300 hover:shadow-xl">
          <div className="flex items-center justify-between">
            <div className="bg-primary text-primary-foreground flex size-12 items-center justify-center rounded-md">
              <LogInIcon className="size-8" />
            </div>
            {hasStash && (
              <Button asChild>
                <Link href="/sign-up">Complete onboarding</Link>
              </Button>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <h3 className="text-foreground text-lg font-bold">Sign Up</h3>
              <span className="bg-primary text-primary-foreground inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium">
                Recommended
              </span>
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Create an account to save your data, customize categories, and unlock all features.
            </p>
          </div>

          <div className="space-y-2">
            <div className="text-muted-foreground flex items-center gap-2 text-sm">
              <LockIcon className="fill-primary size-5" />
              <span>Secure data storage</span>
            </div>
            <div className="text-muted-foreground flex items-center gap-2 text-sm">
              <LockIcon className="fill-primary size-5" />
              <span>Custom dashboard</span>
            </div>
            <div className="text-muted-foreground flex items-center gap-2 text-sm">
              <LockIcon className="fill-primary size-5" />
              <span>Multi-device sync</span>
            </div>
          </div>

          <ActionButton
            shouldAlert={showRestartAlert}
            alertTitel="Incomplete Onboarding"
            alertDescription="Continuing will discard your current onboarding progress. Are you sure you want to proceed?"
            className="mt-4 h-12 text-base"
            performAction={onScrollToNext}
          >
            {hasStash ? "Adjust settings" : "Join Now"}
          </ActionButton>
        </Card>
      </div>

      <div className="pb-12 text-center">
        <p className="text-muted-foreground space-x-1 text-sm">
          <span>Already have an account?</span>
          <Button asChild variant="link" size="auto" className="rounded p-0">
            <Link href="/sign-in" className="text-primary font-medium hover:underline">
              Sign in here
            </Link>
          </Button>
        </p>
      </div>
    </Section>
  );
};
