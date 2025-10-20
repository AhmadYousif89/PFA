import { Metadata } from "next";

import { HomeHeader } from "./_components/header";
import { SectionWrapper } from "./_components/sections-wrapper";
import { getOnboardingStash } from "../shared-data/onboarding";

export const metadata: Metadata = {
  title: "Home - Personal Finance App",
  description:
    "Welcome to the Personal Finance App. Manage your expenses, set budgets, and achieve your financial goals with ease.",
};

export default async function Home() {
  const stash = await getOnboardingStash();

  return (
    <>
      <HomeHeader stashId={stash?.onboardingId} />
      <main className="max-w-site site:px-0 relative isolate mx-auto flex w-full grow flex-col gap-8 overflow-y-auto overscroll-none px-4 md:px-8">
        {/* Decorative Elements */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="bg-primary/10 absolute -top-40 -right-40 size-[400px] rounded-full blur-3xl"
            style={{
              maskImage: "radial-gradient(circle, #000 0%, transparent 100%)",
              WebkitMaskImage: "radial-gradient(circle, #000 0%, transparent 100%)",
            }}
          />
        </div>
        {/* Grid Background */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div
            className="absolute inset-0 bg-[linear-gradient(to_right,#277C7815_1px,transparent_1px),linear-gradient(to_bottom,#277C7815_1px,transparent_1px)] bg-[size:30px_30px]"
            style={{
              maskImage: "radial-gradient(ellipse 100% 50% at 50% 0%, #000 80%, transparent 200%)",
              WebkitMaskImage:
                "radial-gradient(ellipse 100% 50% at 50% 0%, #000 80%, transparent 200%)",
            }}
          />
        </div>
        {/* Sections */}
        <SectionWrapper
          hasStash={!!stash}
          categoryStash={stash?.categories ?? []}
          balanceStash={{ current: stash?.current ?? 0, income: stash?.income ?? 0 }}
        />
      </main>
    </>
  );
}
