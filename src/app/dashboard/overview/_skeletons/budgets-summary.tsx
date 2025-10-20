import { Skeleton } from "@/components/ui/skeleton";
import { SummaryCardSkeleton } from "./summary-card";

export const BudgetsSummarySkeleton = () => {
  return (
    <SummaryCardSkeleton title="Budgets">
      <div className="flex min-h-72.5 flex-col gap-4 @[22rem]/card-content:flex-row">
        {/* Chart area skeleton */}
        <div className="grid grow items-center justify-center self-center">
          <Skeleton className="col-end-1 row-end-1 size-60 rounded-full" />
          {/* Center text skeleton */}
          <div className="col-end-1 row-end-1 flex flex-col items-center gap-1 place-self-center">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>

        {/* Legend skeleton */}
        <ul className="grid grid-cols-2 gap-4 @[22rem]/card-content:grid-cols-1">
          {Array.from({ length: 4 }).map((_, i) => (
            <li key={i} className="flex items-center gap-4">
              <Skeleton className="h-11 min-w-1" />
              <div className="flex flex-col gap-1">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-4 w-16" />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </SummaryCardSkeleton>
  );
};
