import { Skeleton } from "@/components/ui/skeleton";
import { BillsSummarySkeleton } from "./_skeletons/bill-summary";
import { BillsTableSkeleton } from "./_skeletons/bills-table";

export default function LoadingBills() {
  return (
    <div className="flex flex-col gap-8">
      <Skeleton className="h-10 w-52 rounded-md" />

      <div className="flex flex-col gap-6 xl:flex-row">
        <BillsSummarySkeleton />
        <BillsTableSkeleton />
      </div>
    </div>
  );
}
