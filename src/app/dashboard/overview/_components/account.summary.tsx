import { Card } from "@/components/ui/card";
import { cn, formatCurrency } from "@/lib/utils";
import { getBalance, getTotalExpenses, getAverageMonthlyIncome } from "@/app/shared-data/balance";

export const AccountSummary = async () => {
  const balance = await getBalance();
  const totalExpenses = await getTotalExpenses();
  const avgMonthlyIncome = await getAverageMonthlyIncome();

  const accountInfo = [
    {
      label: "current balance",
      value: balance.current,
      type: "balance" as const,
    },
    {
      label: "avg monthly income",
      value: avgMonthlyIncome,
      type: "income" as const,
    },
    {
      label: "total expenses",
      value: totalExpenses,
      type: "expense" as const,
    },
  ];

  return (
    <>
      {accountInfo.map(({ label, value, type }) => {
        const isCurrent = type === "balance";
        const isExpense = type === "expense";
        const isIncome = type === "income";

        return (
          <Card
            key={label}
            data-slot="overview-info-card"
            className={cn("basis-full gap-3 p-5 md:p-6", isCurrent ? "bg-card-foreground" : "")}
          >
            <p
              className={cn(
                "text-sm capitalize",
                isCurrent ? "text-card" : "text-muted-foreground",
              )}
            >
              {label}
            </p>
            <h2
              className={cn(
                "text-xl font-bold",
                isCurrent ? "text-card" : "text-foreground",
                isExpense ? "text-red" : "",
                isIncome ? "text-green" : "",
              )}
            >
              {formatCurrency(value, { maximumFractionDigits: 2 })}
            </h2>
          </Card>
        );
      })}
    </>
  );
};
