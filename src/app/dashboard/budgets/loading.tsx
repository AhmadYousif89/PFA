import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

export default function LoadingBudgets() {
  return (
    <div className="flex flex-col gap-8">
      {/* Header Skeleton */}
      <header className="flex items-center justify-between">
        <Skeleton className="h-9 w-32" /> {/* "Budgets" title */}
        <Skeleton className="h-14 w-40" /> {/* Create New Budget button */}
      </header>

      <section className="@container flex flex-col gap-6 lg:flex-row">
        {/* Spending Summary Skeleton */}
        <div className="basis-[41.312%] lg:self-start">
          <Skeleton className="flex flex-col gap-13 px-5 py-6 md:flex-row md:p-8 lg:@xl:flex-col">
            {/* Chart Skeleton */}
            <div className="flex w-full items-center justify-center">
              <Skeleton className="size-60 rounded-full" />
            </div>

            <div className="flex w-full min-w-[296px] grow flex-col justify-center gap-6 self-start md:px-0">
              <Skeleton className="h-6 w-36" /> {/* "Spending Summary" title */}
              <ul className="flex flex-col">
                {/* Spending Items Skeleton */}
                {Array.from({ length: 4 }).map((_, index) => (
                  <div key={index}>
                    <li className="flex items-center justify-between">
                      {/* Side indicator and Category name */}
                      <div className="flex items-center gap-4">
                        <Skeleton className="h-5.5 w-1 rounded" />
                        <Skeleton className="h-4 w-20" />
                      </div>
                      {/* Amount */}
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-5 w-16" />
                        <Skeleton className="h-3 w-12" />
                      </div>
                    </li>
                    {index < 3 && <Skeleton className="bg-muted-foreground/20 my-4 h-px w-full" />}
                  </div>
                ))}
              </ul>
            </div>
          </Skeleton>
        </div>

        {/* Budget Cards Skeleton */}
        <div className="basis-[58.687%] overflow-y-scroll lg:max-h-[1050px] xl:max-h-[1120px]">
          <div className="flex flex-col gap-6">
            {Array.from({ length: 3 }).map((_, index) => (
              <BudgetCardSkeleton key={index} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export function BudgetCardSkeleton() {
  return (
    <Skeleton className="rounded-12 relative grid gap-5 overflow-hidden p-6 md:p-8">
      {/* Budget Header Skeleton */}
      <div className="rounded-t-12 z-30 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Skeleton className="aspect-square size-6 rounded-full" /> {/* Side indicator */}
          <Skeleton className="h-6 w-36" /> {/* Category name */}
        </div>
        <Skeleton className="size-6" /> {/* Actions button */}
      </div>

      {/* Budget Content Skeleton */}
      <div className="z-20 flex flex-col gap-5 p-0">
        {/* Budget Overview Skeleton */}
        <div className="flex flex-col gap-5">
          <Skeleton className="h-6 w-32" /> {/* "Maximum of" text */}
          <div className="bg-muted/10 relative overflow-hidden rounded-xs p-1">
            <Skeleton className="h-6 w-full rounded-xs" />
            {/* Progress bar skeleton */}
          </div>
          {/* Spent/Remaining skeleton */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-4">
              <Skeleton className="h-full w-1 rounded" />
              <div className="grid gap-2">
                <Skeleton className="h-3 w-12" /> {/* "Spent" label */}
                <Skeleton className="h-4 w-16" /> {/* Amount */}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Skeleton className="h-full w-1 rounded" />
              <div className="grid gap-1">
                <Skeleton className="h-3 w-16" /> {/* "Remaining" label */}
                <Skeleton className="h-4 w-16" /> {/* Amount */}
              </div>
            </div>
          </div>
        </div>

        {/* Latest Spendings Skeleton */}
        <div className="rounded-12 bg-muted-foreground/10 flex flex-col gap-5 p-5">
          <div className="flex basis-full items-center justify-between">
            <Skeleton className="h-5 w-28" /> {/* "Latest Spending" title */}
            <Skeleton className="h-4 w-16" /> {/* "See All" link */}
          </div>
          <ul>
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index}>
                <li className="flex min-h-10 items-center justify-between">
                  <div className="flex items-center gap-2 sm:gap-4">
                    <Skeleton className="size-6 rounded-full md:size-8" /> {/* Avatar */}
                    <Skeleton className="h-3 w-24" /> {/* Transaction name */}
                  </div>
                  <div className="grid items-end gap-2 text-right">
                    <Skeleton className="h-3 w-16" /> {/* Amount */}
                    <Skeleton className="h-3 w-12" /> {/* Date */}
                  </div>
                </li>
                {index < 2 && <Separator className="bg-muted-foreground/15 my-3" />}
              </div>
            ))}
          </ul>
        </div>
      </div>
    </Skeleton>
  );
}
