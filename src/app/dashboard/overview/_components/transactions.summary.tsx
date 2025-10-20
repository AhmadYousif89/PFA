import Link from "next/link";
import Image from "next/image";
import { Fragment } from "react";

import { formatCurrency, formatDate } from "@/lib/utils";
import { getTransactions } from "@/app/shared-data/transactions";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";

import TransactionIcon from "public/assets/images/icon-nav-transactions.svg";

export const TransactionsSummary = async () => {
  const transactions = await getTransactions({ limit: 5 });

  if (transactions.length === 0) {
    return (
      <Empty className="p-0">
        <EmptyHeader>
          <TransactionIcon className="size-fit" />
          <EmptyTitle>No Transactions Yet</EmptyTitle>
          <EmptyDescription>
            Add transactions to track your spending and manage your finances effectively.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button asChild>
            <Link href="/dashboard/transactions">Manage Transactions</Link>
          </Button>
        </EmptyContent>
      </Empty>
    );
  }

  return (
    <ul>
      {transactions.map((transaction, idx) => (
        <Fragment key={`transaction-${idx}`}>
          <li className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Image
                src={transaction.avatar}
                alt={`${transaction.name}'s profile image`}
                className="size-8 rounded-full md:size-10"
                width={130}
                height={130}
              />
              <h3 className="text-sm font-bold">{transaction.name}</h3>
            </div>
            <div className="flex flex-col items-end gap-2">
              <span
                className={`text-sm font-bold ${transaction.amount > 0 ? "text-primary" : "text-foreground"}`}
              >
                {formatCurrency(transaction.amount, {
                  maximumFractionDigits: 2,
                  signDisplay: "exceptZero",
                })}
              </span>
              <span className="text-muted-foreground text-xs">{formatDate(transaction.date)}</span>
            </div>
          </li>
          <Separator className="bg-muted my-5 last:hidden" />
        </Fragment>
      ))}
    </ul>
  );
};
