import { Suspense } from "react";

import { SummaryCard } from "./_components/summary.card";
import { AccountSummary } from "./_components/account.summary";
import { AccountSummarySkeleton } from "./_skeletons/account-summary";
import { PotsSummary } from "./_components/pots.summary";
import { PotsSummarySkeleton } from "./_skeletons/pots-summary";
import { BillsSummary } from "./_components/bills.summary";
import { BillsSummarySkeleton } from "./_skeletons/bills-summary";
import { BudgetsSummary } from "./_components/budget.summary";
import { BudgetsSummarySkeleton } from "./_skeletons/budgets-summary";
import { TransactionsSummary } from "./_components/transactions.summary";
import { TransactionsSummarySkeleton } from "./_skeletons/transactions-summary";

import { auth } from "@/app/(auth)/_lib/auth";
import { getPotsCount } from "@/app/shared-data/pots";
import { getBudgetsCount } from "@/app/shared-data/budget";
import { getRecurringBillsCount } from "@/app/shared-data/bills";
import { getTransactionsCount } from "@/app/shared-data/transactions";
import { headers } from "next/headers";

export default async function OverviewPage() {
  const isDemo = await auth.api.checkDemoCookie({ headers: await headers() });
  const nowIso = new Date().toISOString();

  const [potsCount, txCount, budgetsCount, billsCount] = await Promise.all([
    getPotsCount(),
    getTransactionsCount(),
    getBudgetsCount(),
    getRecurringBillsCount(),
  ]);

  return (
    <div className="@container/overview grid gap-8">
      <header className="border-border/20 flex flex-col gap-1 border-b pb-2">
        <h1 className="text-xl font-bold">Overview</h1>
        <p className="text-muted-foreground text-xs font-medium md:text-sm">
          A quick look at your accounts, pots, budgets, bills, and recent transactions.
        </p>
      </header>
      {/* Account Summary Cards */}
      <section className="flex flex-col justify-between gap-3 md:flex-row md:gap-6">
        <Suspense fallback={<AccountSummarySkeleton />}>
          <AccountSummary />
        </Suspense>
      </section>
      {/* Overview Summary Cards */}
      <div className="flex flex-col gap-6 lg:flex-row">
        <section className="flex basis-[58.687%] flex-col gap-4">
          <Suspense fallback={<PotsSummarySkeleton />}>
            <SummaryCard
              isDemo={isDemo}
              count={potsCount}
              title="Pots"
              href="/pots"
              className="min-h-[218px]"
            >
              <PotsSummary />
            </SummaryCard>
          </Suspense>

          <Suspense fallback={<TransactionsSummarySkeleton />}>
            <SummaryCard
              isDemo={isDemo}
              count={txCount}
              title="Transactions"
              href="/transactions"
              className="min-h-[519px]"
            >
              <TransactionsSummary />
            </SummaryCard>
          </Suspense>
        </section>
        <section className="flex basis-[41.312%] flex-col gap-4">
          <Suspense fallback={<BudgetsSummarySkeleton />}>
            <SummaryCard
              isDemo={isDemo}
              count={budgetsCount}
              title="Budgets"
              href="/budgets"
              className="min-h-[410px]"
            >
              <BudgetsSummary />
            </SummaryCard>
          </Suspense>
          <Suspense fallback={<BillsSummarySkeleton />}>
            <SummaryCard
              isDemo={isDemo}
              count={billsCount}
              title="Recurring Bills"
              href="/bills"
              className="min-h-[327px]"
            >
              <BillsSummary nowIso={nowIso} count={billsCount} />
            </SummaryCard>
          </Suspense>
        </section>
      </div>
    </div>
  );
}
