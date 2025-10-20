import { Fragment } from "react";

import { Budget } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import { getBudgets, getSpendingByCategoryMap } from "@/app/shared-data/budget";

import { Separator } from "@/components/ui/separator";
import { BudgetChart } from "@/components/budget.chart";
import { Card, CardContent } from "@/components/ui/card";

export const SpendingChartSummary = async () => {
  const [budgets, spendingMap] = await Promise.all([getBudgets(), getSpendingByCategoryMap()]);
  const totalBudgetSpent = Object.values(spendingMap).reduce((sum, v) => sum + v, 0);
  const totalBudgetLimit = budgets.reduce((sum, b) => sum + b.maximum, 0);

  if (budgets.length === 0) {
    return (
      <Card className="p-5 md:p-8">
        <h2 className="text-lg font-bold">Spending Summary</h2>
        <p className="text-muted-foreground text-sm">You have not set any budget yet</p>
      </Card>
    );
  }

  return (
    <Card className="gap-8 md:flex-row md:p-8 lg:@xl:flex-col">
      <BudgetChart budgets={budgets} total={totalBudgetSpent} maximum={totalBudgetLimit} />

      <CardContent className="flex min-w-[296px] flex-col justify-center gap-6 md:self-start md:px-0 lg:w-full">
        <h2 className="text-lg font-bold">Spending Summary</h2>
        <ul className="flex flex-col">
          {budgets.map((budget) => (
            <Fragment key={budget.category}>
              <SpendingItem budget={budget} spent={spendingMap[budget.category] ?? 0} />
              <Separator className="bg-muted my-4 last:hidden" />
            </Fragment>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

const SpendingItem = ({ budget, spent }: { budget: Budget; spent: number }) => {
  const { category, maximum, theme } = budget;
  const remaining = maximum - spent;

  return (
    <li className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <span className="h-5.5 min-w-1 rounded" style={{ backgroundColor: theme }} />
        <span className="text-muted-foreground text-sm capitalize">{category}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className={`text-base font-bold ${remaining < 0 ? "text-destructive" : ""}`}>
          {formatCurrency(spent)}
        </span>
        <span className="text-muted-foreground text-xs">of {formatCurrency(maximum)}</span>
      </div>
    </li>
  );
};
