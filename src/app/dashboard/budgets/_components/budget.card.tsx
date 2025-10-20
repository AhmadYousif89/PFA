import Link from "next/link";
import Image from "next/image";
import { Fragment } from "react";

import CollapseIcon from "public/assets/images/icon-collapse.svg";
import CaretRightIcon from "public/assets/images/icon-caret-right.svg";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CardAction, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AccordionItem, AccordionContent, AccordionTrigger } from "@/components/ui/accordion";

import { BudgetDropdownMenu } from "./budget.menu";
import { UserCategory } from "@/app/(auth)/_lib/types";
import { cn, formatCurrency, formatDate } from "@/lib/utils";
import { Budget, ThemeColor, Transaction } from "@/lib/types";

type BudgetCardProps = {
  budget: Budget;
  selectedThemes: ThemeColor[];
  selectedCategories: string[];
  availableCategories: UserCategory[];
  categoryTransactions: Transaction[];
};

export const BudgetCard = async ({
  budget,
  selectedThemes,
  selectedCategories,
  categoryTransactions,
  availableCategories,
}: BudgetCardProps) => {
  const transactions = categoryTransactions;
  const categoryInfo = availableCategories.find((cat) => cat.slug === budget.category);
  const categoryLabel = categoryInfo?.label ?? budget.category;
  const budgetSpent = transactions.reduce(
    (total, transaction) => total + Math.abs(transaction.amount),
    0,
  );
  const budgetRemaining = budget.maximum - budgetSpent;
  const remainingPercentage = budgetRemaining < 0 ? 100 : (budgetSpent / budget.maximum) * 100;

  return (
    <AccordionItem
      value={`card-${budget.id}`}
      className="bg-card rounded-12 relative grid gap-5 overflow-hidden border-none py-6 md:py-8"
    >
      {/* Budget Header */}
      <CardHeader className="rounded-t-12 z-30 flex items-center justify-between md:px-8">
        <CardTitle className="flex items-center gap-4 truncate" title={categoryLabel}>
          <span
            aria-hidden
            style={{ backgroundColor: budget.theme }}
            className="aspect-square size-4 rounded-full"
          />
          <h2 className="truncate text-lg font-bold">{categoryLabel}</h2>
        </CardTitle>
        <CardAction className="flex items-center self-center">
          <BudgetDropdownMenu
            budget={budget}
            selectedThemes={selectedThemes}
            selectedCategories={selectedCategories}
            availableCategories={availableCategories}
          />
        </CardAction>
      </CardHeader>
      <AccordionTrigger
        style={{ "--color-bt": budget.theme } as React.CSSProperties}
        className={cn(
          "absolute bottom-0 z-10 flex w-full cursor-pointer items-center justify-center",
          "focus-visible:ring-(--color-bt) focus-visible:ring-offset-0 [&[data-state=open]>svg]:rotate-180",
          "hover:bg-(--color-bt)/10 focus:bg-(--color-bt)/10 focus-visible:bg-(--color-bt)/10 active:bg-(--color-bt)/20",
        )}
      >
        <CollapseIcon className="fill-secondary -mb-1 size-6" aria-hidden />
        <span className="sr-only">Toggle Budget Details</span>
      </AccordionTrigger>
      <AccordionContent className="z-20 flex flex-col gap-5 p-0">
        {/* Budget Overview */}
        <CardContent className="flex flex-col gap-4 md:px-8">
          <span className="text-muted-foreground text-sm">
            Maximum of {formatCurrency(budget.maximum, { maximumFractionDigits: 2 })}
          </span>
          <div className="bg-accent relative overflow-hidden rounded-xs p-1">
            <div
              style={
                {
                  backgroundColor: budget.theme,
                  "--to-width": `${remainingPercentage}%`,
                  width: `${remainingPercentage}%`,
                } as React.CSSProperties
              }
              className="animate-expand-left h-2 min-h-6 w-0 origin-left rounded-xs will-change-transform"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-4">
              <span className="h-full w-1 rounded" style={{ backgroundColor: budget.theme }} />
              <div className="grid gap-1">
                <span className="text-muted-foreground text-xs">Spent</span>
                <span className="text-sm font-bold">
                  {formatCurrency(budgetSpent, { maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="bg-accent h-full w-1 rounded" />
              <div className="grid gap-1">
                <span className="text-muted-foreground text-xs">Remaining</span>
                <span
                  className={cn("text-sm font-bold", budgetRemaining < 0 && "text-destructive")}
                >
                  {formatCurrency(budgetRemaining, { maximumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
        {/* Latest Spendings */}
        <CardContent className="md:px-8">
          <section className="bg-accent rounded-12 flex flex-col gap-5 p-5">
            <div className="flex basis-full items-center justify-between">
              <h3 className="text-base font-bold">Latest Spending</h3>
              <Button variant="link" size="auto" asChild className="group rounded">
                <Link
                  href={`/dashboard/transactions?category=${budget.category}`}
                  className="flex items-center gap-4"
                >
                  <span className="group-hover:text-foreground text-sm">See All</span>
                  <span className="h-3 w-2">
                    <CaretRightIcon className="group-hover:*:fill-foreground" />
                  </span>
                </Link>
              </Button>
            </div>

            <ul>
              {transactions.map((transaction) => (
                <Fragment key={transaction.id}>
                  <li className="flex min-h-10 items-center justify-between">
                    <div className="flex items-center gap-2 sm:gap-4">
                      <Image
                        src={transaction.avatar}
                        alt={transaction.name}
                        className="size-6 rounded-full md:size-8"
                        width={130}
                        height={130}
                      />
                      <span className="text-xs font-bold">{transaction.name}</span>
                    </div>
                    <div className="grid items-end gap-1 text-right">
                      <span className="text-xs font-bold">
                        {formatCurrency(transaction.amount, {
                          maximumFractionDigits: 2,
                          signDisplay: "exceptZero",
                        })}
                      </span>
                      <span className="text-muted-foreground text-xs">
                        {formatDate(transaction.date)}
                      </span>
                    </div>
                  </li>
                  <Separator className="bg-muted-foreground/15 my-3 last:hidden" />
                </Fragment>
              ))}
            </ul>
          </section>
        </CardContent>
      </AccordionContent>
    </AccordionItem>
  );
};
