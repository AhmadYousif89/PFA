import type { Metadata } from "next";
import { headers } from "next/headers";

import { auth } from "@/app/(auth)/_lib/auth";
import { getAvatars } from "@/lib/get-avatars";
import { getTransactions } from "../../shared-data/transactions";
import { TransactionTable } from "./_components/transactions.table";
import { TransactionCreationModal } from "./_components/create.modal";

export const metadata: Metadata = {
  title: "Transactions - Personal Finance App",
  description: "View and manage your transactions with ease using our personal finance app.",
};

export default async function TransactionsPage() {
  const [session, transactions, avatars] = await Promise.all([
    auth.api.getSession({ headers: await headers() }),
    getTransactions(),
    getAvatars(),
  ]);

  return (
    <div className="flex grow flex-col gap-8">
      <header className="border-border/20 flex items-start justify-between gap-2 border-b pb-2">
        <div className="flex flex-col gap-1">
          <h1 className="text-xl font-bold">Transactions</h1>
          <p className="text-muted-foreground text-xs font-medium md:text-sm">
            View and manage your transactions with ease.
          </p>
        </div>
        {session && <TransactionCreationModal avatars={avatars} />}
      </header>
      <TransactionTable transactions={transactions} />
    </div>
  );
}
