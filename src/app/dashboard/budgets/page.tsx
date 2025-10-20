import type { Metadata } from "next";

import { Budgets } from "./_components/budgets";
import { getBudgets } from "@/app/shared-data/budget";
import { ScrollArea } from "@/components/ui/scroll-area";
import { BudgetCreationModal } from "./_components/create.modal";
import { SpendingChartSummary } from "./_components/spending-chart.card";
import {
  Empty,
  EmptyTitle,
  EmptyHeader,
  EmptyContent,
  EmptyDescription,
} from "@/components/ui/empty";

import BudgetIcon from "public/assets/images/icon-nav-budgets.svg";
import {
  getEffectiveUserCategories,
  addSkippedOnboardingCategories,
} from "@/app/shared-data/categories";

export const metadata: Metadata = {
  title: "Budgets - Personal Finance App",
  description: "Create and manage your budgets effectively.",
};

export default async function BudgetsPage() {
  const budgets = await getBudgets();
  const userCategories = await getEffectiveUserCategories();

  const budgetCount = budgets.length;
  const selectedThemes = budgets.map((b) => b.theme);
  const selectedCategories = budgets.map((b) => b.category);

  const allCategories = addSkippedOnboardingCategories(userCategories);

  return (
    <div className="flex grow flex-col gap-8">
      <header className="border-border/20 flex items-start justify-between gap-2 border-b pb-2">
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-bold">Budgets</h1>
          <p className="text-muted-foreground text-xs font-medium md:text-sm">
            Manage your budgets and track your spending.
          </p>
        </div>
        {budgetCount < 1 ? null : (
          <BudgetCreationModal
            selectedThemes={selectedThemes}
            selectedCategories={selectedCategories}
            availableCategories={allCategories}
          />
        )}
      </header>
      <section className="@container grid h-full gap-6 lg:grid-cols-[41.312%_58.687%]">
        {budgetCount < 1 ? (
          <Empty className="bg-card/90 col-span-full place-self-center p-10 shadow-lg">
            <EmptyHeader>
              <BudgetIcon className="mb-6 size-fit scale-200" />
              <EmptyTitle className="lg:text-lg">You budgets are looking a bit empty</EmptyTitle>
              <EmptyDescription className="lg:text-base">
                Start managing your finances by creating your first budget.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <BudgetCreationModal
                selectedThemes={[]}
                selectedCategories={[]}
                availableCategories={allCategories}
              />
            </EmptyContent>
          </Empty>
        ) : (
          <>
            <div className="grid lg:self-start">
              <SpendingChartSummary />
            </div>
            <ScrollArea className="xl:h-(--scroll-max-h)">
              <Budgets />
            </ScrollArea>
          </>
        )}
      </section>
    </div>
  );
}
