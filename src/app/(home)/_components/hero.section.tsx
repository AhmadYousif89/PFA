import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/ui/section";

import ChartIcon from "public/assets/images/icon-chart.svg";
import ShieldIcon from "public/assets/images/icon-shield.svg";
import SparklesIcon from "public/assets/images/icon-sparkles.svg";
import SavingsIcon from "public/assets/images/icon-savings.svg";

type Props = {
  isVisible: boolean;
  onScrollToNext: () => void;
};

export const HeroSection = ({ isVisible, onScrollToNext }: Props) => {
  return (
    <Section
      id="hero-section"
      data-section="hero"
      className={cn(
        isVisible
          ? "visible translate-y-0 touch-none opacity-100 delay-500"
          : "pointer-events-none invisible -translate-y-24 opacity-0 delay-0",
      )}
    >
      {/* Badge */}
      <div className="border-primary/25 bg-card/75 text-muted-foreground max-w-card mx-auto flex items-center justify-center gap-2 rounded-full border px-4 py-2 text-xs font-semibold shadow-sm md:mb-6 md:text-sm">
        <SparklesIcon className="fill-primary size-4" />
        <span>Smart financial management made simple</span>
      </div>

      <header className="grid place-items-center gap-8 text-center md:gap-10">
        <h1 className="max-w-card text-foreground text-xl leading-tight font-bold tracking-tight text-balance md:text-[48px] lg:text-[60px]">
          <span>Take Control of Your</span>
          <br />
          <span className="text-primary font-extrabold tracking-wide">Financial Life</span>
        </h1>
        <p className="text-muted-foreground max-w-3xl text-base leading-relaxed text-pretty md:text-lg">
          Track expenses, manage budgets, and achieve your financial goals with our intelligent
          personal finance platform. Get started in minutes with customizable categories tailored to
          your lifestyle.
        </p>
      </header>

      <Button
        size="lg"
        onClick={onScrollToNext}
        className="bg-primary hover:bg-foreground hover:text-background text-md shadow-primary/25 hover:shadow-primary/35 h-14 self-center px-8 font-semibold shadow-xl transition-all duration-200 md:mt-6"
      >
        Get Started
      </Button>

      <div className="*:border-muted max-w-card mx-auto my-6 flex flex-wrap items-center justify-center gap-4 *:max-w-[230px] *:grow *:border">
        <div className="bg-card flex items-center justify-center gap-2 rounded-full px-4 py-1.5 shadow-lg">
          <ChartIcon className="fill-primary size-5" />
          <span className="text-muted-foreground text-sm">Track your expenses</span>
        </div>
        <div className="bg-card g flex items-center justify-center gap-2 rounded-full px-4 py-1.5 shadow-lg">
          <ShieldIcon className="fill-primary size-5" />
          <span className="text-muted-foreground text-sm">Secure and private data</span>
        </div>
        <div className="bg-card flex items-center justify-center gap-2 rounded-full px-4 py-1.5 shadow-lg">
          <SavingsIcon className="fill-primary size-5" />
          <span className="text-muted-foreground text-sm">Customizable budgets</span>
        </div>
      </div>
    </Section>
  );
};
