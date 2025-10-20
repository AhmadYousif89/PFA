import type { Metadata } from "next";

import { getBillTransactionsWithPaymentStatus } from "../../shared-data/bills";
import { BillsSummary } from "./_components/bills.summary";
import { BillsTable } from "./_components/bills.table";

export const metadata: Metadata = {
  title: "Recurring Bills - Personal Finance App",
  description:
    "View and manage your recurring bills. Track payment status and stay on top of your finances.",
};

export default async function RecurringBillsPage() {
  const nowIso = new Date().toISOString();
  const billTransactions = await getBillTransactionsWithPaymentStatus(nowIso);

  return (
    <div className="flex flex-col gap-8">
      <header className="border-border/20 flex flex-col gap-1 border-b pb-2">
        <h1 className="text-xl font-bold">Recurring Bills</h1>
        <p className="text-muted-foreground text-xs font-medium md:text-sm">
          An insight into your recurring bills and their payment statuses.
        </p>
      </header>
      {/* Recurring Bills Table */}
      <section className="flex flex-col gap-6 xl:flex-row">
        <BillsSummary />
        <BillsTable data={billTransactions} />
      </section>
    </div>
  );
}
