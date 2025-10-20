import { Skeleton } from "@/components/ui/skeleton";
import { TransactionTableSkeleton } from "./_skeletons/table-skeleton";

export default function LoadingTransactions() {
  return (
    <div className="flex grow flex-col gap-8">
      <Skeleton className="h-8 w-40" />
      <TransactionTableSkeleton />
    </div>
  );
}
