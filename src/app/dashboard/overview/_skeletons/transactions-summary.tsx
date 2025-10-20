import { Fragment } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { SummaryCardSkeleton } from "./summary-card";

export const TransactionsSummarySkeleton = () => {
  return (
    <SummaryCardSkeleton title="Transactions">
      <ul>
        {Array.from({ length: 5 }).map((_, idx) => (
          <Fragment key={idx}>
            <li key={idx} className="flex items-center justify-between py-4">
              <div className="flex items-center gap-4">
                <Skeleton className="size-8 rounded-full md:size-10" />
                <Skeleton className="h-4 w-32" />
              </div>
              {/* Amount & Date */}
              <div className="flex flex-col items-end gap-2">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-2 w-24" />
              </div>
            </li>
            {<Skeleton className="bg-muted-foreground/25 my-1.5 h-px w-full last:hidden" />}
          </Fragment>
        ))}
      </ul>
    </SummaryCardSkeleton>
  );
};
