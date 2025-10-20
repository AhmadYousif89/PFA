import { BudgetCard } from "./budget.card";
import { Accordion } from "@/components/ui/accordion";
import { getBudgets, getBudgetTransactionsMap } from "@/app/shared-data/budget";
import {
  getEffectiveUserCategories,
  addSkippedOnboardingCategories,
} from "@/app/shared-data/categories";

export const Budgets = async () => {
  const budgets = await getBudgets();
  const userCategories = await getEffectiveUserCategories();
  const transactionsMap = await getBudgetTransactionsMap({ limit: 3 });

  const selectedThemes = budgets.map((b) => b.theme);
  const selectedCategories = budgets.map((b) => b.category);
  const defaultOpenItems = budgets.map((budget) => `card-${budget.id}`);

  const allCategories = addSkippedOnboardingCategories(userCategories);

  return (
    <Accordion type="multiple" defaultValue={defaultOpenItems} className="flex flex-col gap-6">
      {budgets.map((budget) => (
        <BudgetCard
          key={budget.id}
          budget={budget}
          selectedThemes={selectedThemes}
          selectedCategories={selectedCategories}
          availableCategories={allCategories}
          categoryTransactions={transactionsMap[budget.category] ?? []}
        />
      ))}
    </Accordion>
  );
};
