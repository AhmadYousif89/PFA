import { Skeleton } from "@/components/ui/skeleton";

export const BillsSummarySkeleton = () => {
  return (
    <div
      className="flex flex-col gap-3 *:basis-full sm:flex-row sm:gap-6 xl:basis-[32.3%] xl:flex-col xl:self-start"
      aria-busy
    >
      {/* Total Bills */}
      <Skeleton className="flex min-h-28 flex-col items-center gap-5 p-5 max-sm:flex-row sm:items-start md:gap-8 md:p-6">
        <Skeleton className="size-10" />
        <div className="flex flex-col gap-2.75">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-40" />
        </div>
      </Skeleton>

      {/* Summary Card */}
      <Skeleton className="flex min-h-51 flex-col gap-5 p-5">
        <Skeleton className="h-6 w-28" />
        <ul className="mt-2">
          <li className="flex items-center justify-between">
            <Skeleton className="h-4 w-28" />
            <div className="flex items-center space-x-2 font-bold">
              <Skeleton className="h-4 w-6" />
              <Skeleton className="h-4 w-24" />
            </div>
          </li>
          <Skeleton className="my-4 h-px w-full" />
          <li className="flex items-center justify-between">
            <Skeleton className="h-4 w-28" />
            <div className="flex items-center space-x-2 font-bold">
              <Skeleton className="h-4 w-6" />
              <Skeleton className="h-4 w-24" />
            </div>
          </li>
          <Skeleton className="my-4 h-px w-full" />
          <li className="flex items-center justify-between">
            <Skeleton className="h-4 w-28" />
            <div className="flex items-center space-x-2 font-bold">
              <Skeleton className="h-4 w-6" />
              <Skeleton className="h-4 w-24" />
            </div>
          </li>
        </ul>
      </Skeleton>
    </div>
  );
};
