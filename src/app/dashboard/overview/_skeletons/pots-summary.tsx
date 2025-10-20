import { Skeleton } from "@/components/ui/skeleton";
import { SummaryCardSkeleton } from "./summary-card";

export const PotsSummarySkeleton = () => {
  return (
    <SummaryCardSkeleton title="Pots">
      <div className="flex flex-col gap-5 @lg/skeleton:flex-row">
        {/* Main summary card skeleton */}
        <Skeleton className="flex min-h-27.5 flex-col justify-center p-5 @lg/skeleton:basis-61.75">
          <div className="flex items-center gap-4">
            <Skeleton className="size-10" />
            <div className="flex flex-col gap-2.75">
              <Skeleton className="h-4 w-26" />
              <Skeleton className="h-9 w-32" />
            </div>
          </div>
        </Skeleton>

        {/* Pots grid skeleton */}
        <ul className="grid grow grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <li key={i} className="flex items-center gap-4">
              <Skeleton className="h-11 w-1" />
              <div className="flex flex-col gap-1">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-5 w-16" />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </SummaryCardSkeleton>
  );
};
