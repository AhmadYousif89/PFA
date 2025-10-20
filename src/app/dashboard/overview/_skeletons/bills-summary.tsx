import { Skeleton } from "@/components/ui/skeleton";
import { SummaryCardSkeleton } from "./summary-card";

export const BillsSummarySkeleton = () => {
  return (
    <SummaryCardSkeleton title="Bills">
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton
            key={i}
            className="border-muted-foreground/25 flex items-center justify-between rounded-md border-l-4 px-4 py-5"
          >
            <Skeleton className="h-6 w-24" />
            <Skeleton className="h-6 w-16" />
          </Skeleton>
        ))}
      </div>
    </SummaryCardSkeleton>
  );
};
