"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import { BalanceInfo, UserCategory } from "@/app/(auth)/_lib/types";
import { authClient, onboardingClient, useSession } from "@/app/(auth)/_lib/auth.client";

import { HeroSection } from "./hero.section";
import { AuthChoiceSection } from "./auth.section";
import { FinancialInfoSection } from "./financial.section";
import { CategorySelectionSection } from "./category.section";

type Props = {
  hasStash: boolean;
  categoryStash: UserCategory[];
  balanceStash: { current: number; income: number };
};

type Section = "hero" | "auth" | "categories" | "financial";

export const SectionWrapper = ({ hasStash, categoryStash, balanceStash }: Props) => {
  const router = useRouter();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [currentSection, setCurrentSection] = useState<Section>("hero");
  const [selectedCategories, setSelectedCategories] = useState<UserCategory[]>([]);
  const { data: sessionData } = useSession();

  useEffect(() => {
    const scroller = wrapperRef.current?.closest("main") as HTMLElement | null;
    if (scroller) {
      scroller.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [currentSection]);

  const getFinancialInfo = (info: BalanceInfo) => {
    submitOnboardSetup(selectedCategories, info);
  };

  const submitOnboardSetup = async (categories: UserCategory[], info: BalanceInfo) => {
    const res = await onboardingClient.stash({
      categories,
      currentBalance: info.current,
      monthlyIncome: info.monthlyIncome,
    });

    if ("ok" in res && !res.ok) {
      console.error("Failed to stash onboarding data");
      return;
    }

    // If user is currently signed in and chose to restart onboarding,
    // revoke their account/session and continue as unauthenticated.
    if (sessionData?.user && sessionData.user.hasFinalized === false) {
      try {
        await authClient.deleteUser();
      } catch (e) {
        console.error("Failed to delete existing user while restarting onboarding:", e);
      }
    }
    router.push("/sign-up");
  };

  return (
    <div ref={wrapperRef} className="relative mt-8 grow md:my-16 xl:my-24">
      <HeroSection
        isVisible={currentSection === "hero"}
        onScrollToNext={() => setCurrentSection("auth")}
      />
      <AuthChoiceSection
        hasStash={hasStash}
        isVisible={currentSection === "auth"}
        onBack={() => setCurrentSection("hero")}
        onScrollToNext={() => setCurrentSection("categories")}
      />
      <CategorySelectionSection
        stashData={categoryStash}
        isVisible={currentSection === "categories"}
        onBack={() => setCurrentSection("auth")}
        onScrollToNext={() => setCurrentSection("financial")}
        onComplete={setSelectedCategories}
      />
      <FinancialInfoSection
        stashData={balanceStash}
        isVisible={currentSection === "financial"}
        onBack={() => setCurrentSection("categories")}
        onComplete={getFinancialInfo}
      />
    </div>
  );
};
