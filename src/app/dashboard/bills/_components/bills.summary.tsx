import { Fragment } from "react";

import { Card } from "@/components/ui/card";
import { cn, formatCurrency } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import {
  getBillsSummary,
  getDueBillsCount,
  getPaidBillsCount,
  getUpcomingBillsCount,
} from "@/app/shared-data/bills";

import BillIcon from "public/assets/images/icon-recurring-bills.svg";

export const BillsSummary = async () => {
  const summary = await getBillsSummary();

  const billsTotal = summary.reduce((total, bill) => total + bill.amount, 0);

  const paidBillsCount = await getPaidBillsCount();
  const upcomingBillsCount = await getUpcomingBillsCount();
  const dueSoonBillsCount = await getDueBillsCount();

  return (
    <div className="flex flex-col gap-3 *:basis-full sm:flex-row sm:gap-6 xl:basis-[32.3%] xl:flex-col xl:self-start">
      {/* Total Bills */}
      <Card className="text-background bg-foreground items-center px-5 max-sm:flex-row sm:items-start md:gap-8 md:px-6">
        <BillIcon />
        <div className="flex flex-col gap-2.75">
          <h2 className="text-sm">Total Bills</h2>
          <span className="text-xl font-bold">
            {formatCurrency(billsTotal, { maximumFractionDigits: 2 })}
          </span>
        </div>
      </Card>
      {/* Summary Card */}
      <Card className="p-5">
        <h3 className="text-base leading-5 font-bold">Summary</h3>
        {summary.length ? (
          <ul className="text-xs leading-3.75">
            {summary.map((bill) => (
              <Fragment key={bill.id}>
                <li
                  style={{ borderColor: bill.theme }}
                  className="flex items-center justify-between"
                >
                  <span
                    className={cn(
                      bill.name === "Due Soon" ? "text-destructive" : "text-muted-foreground",
                    )}
                  >
                    {bill.name}
                  </span>
                  <div className="space-x-1 font-bold">
                    <span className={cn(bill.name === "Due Soon" ? "text-destructive" : "")}>
                      {bill.name === "Paid Bills"
                        ? paidBillsCount
                        : bill.name === "Total Upcoming"
                          ? upcomingBillsCount
                          : dueSoonBillsCount}
                    </span>
                    <span className={cn(bill.name === "Due Soon" ? "text-destructive" : "")}>
                      ({formatCurrency(bill.amount, { maximumFractionDigits: 2 })})
                    </span>
                  </div>
                </li>
                <Separator className="bg-muted my-4 last:hidden" />
              </Fragment>
            ))}
          </ul>
        ) : (
          <p className="text-muted-foreground text-sm">No recurring bills found.</p>
        )}
      </Card>
    </div>
  );
};
