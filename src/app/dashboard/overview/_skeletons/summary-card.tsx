import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export const SummaryCardSkeleton = ({
  title,
  children,
}: {
  title: "Pots" | "Transactions" | "Budgets" | "Bills";
  children: React.ReactNode;
}) => {
  const isTransactions = title === "Transactions";
  const isBills = title === "Bills";

  return (
    <Skeleton
      className={cn("flex flex-col py-6 md:py-8", isTransactions || isBills ? "gap-8" : "gap-5")}
    >
      <div className="flex items-center justify-between gap-1.5 px-5 md:px-8">
        <Skeleton className="h-6 w-32" />
        <Skeleton className="h-4 w-24" />
      </div>
      <div className="@container/skeleton px-5 md:px-8">{children}</div>
    </Skeleton>
  );
};
