import { Fragment } from "react";
import { Skeleton } from "@/components/ui/skeleton";

export const TransactionTableSkeleton = () => {
  return (
    <Skeleton className="flex grow flex-col gap-6 p-5 md:p-8">
      {/* Table Toolbar */}
      <div className="flex items-center justify-between gap-6">
        {/* Search Input */}
        <div className="max-w-xs grow">
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
        {/* Sort and Filter Controls */}
        <div className="flex items-center gap-6 md:min-w-109.5">
          <div className="ml-auto flex items-center gap-2">
            <Skeleton className="hidden h-4 w-12 md:block" /> {/* "Sort By" label */}
            <Skeleton className="size-5 md:h-11.25 md:w-28.25" /> {/* Sort dropdown */}
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="hidden h-4 w-16 md:block" /> {/* "Category" label */}
            <Skeleton className="size-5 md:h-11.25 md:w-44.25" /> {/* Category dropdown */}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 space-y-4">
        {/* Table Header (hidden on mobile) */}
        <div className="md:bg-secondary/20 hidden md:grid md:py-3">
          <div className="flex items-center justify-between gap-4">
            <Skeleton className="h-4 w-32" /> {/* Recipient/Sender */}
            <Skeleton className="h-4 w-24" /> {/* Category */}
            <Skeleton className="h-4 w-20" /> {/* Date */}
            <Skeleton className="h-4 w-20" /> {/* Amount */}
          </div>
        </div>
        {/* Table Rows */}
        {Array.from({ length: 10 }).map((_, i) => (
          <Fragment key={i}>
            <div className="flex h-10 items-center justify-between">
              {/* Mobile layout - single column */}
              <div className="flex w-full items-center justify-between md:hidden">
                <div className="space-y-1">
                  <Skeleton className="h-4 w-32" /> {/* Recipient name */}
                  <Skeleton className="h-3 w-20" /> {/* Category */}
                </div>
                <div className="space-y-1 text-right">
                  <Skeleton className="ml-auto h-4 w-16" /> {/* Amount */}
                  <Skeleton className="ml-auto h-3 w-12" /> {/* Date */}
                </div>
              </div>
              {/* Desktop layout - multiple columns */}
              <div className="hidden md:flex md:w-full md:items-center md:justify-between md:gap-4">
                <Skeleton className="h-4 w-32" /> {/* Recipient/Sender */}
                <Skeleton className="h-4 w-24" /> {/* Category */}
                <Skeleton className="h-4 w-20" /> {/* Date */}
                <Skeleton className="h-4 w-20" /> {/* Amount */}
              </div>
            </div>
            {/* Separator */}
            <Skeleton className="my-4 h-px w-full last:hidden" />
          </Fragment>
        ))}
      </div>

      {/* Table Pagination */}
      <div className="space-y-1.5">
        {/* Results info */}
        <div className="flex justify-between">
          <Skeleton className="h-3 w-30" />
          <Skeleton className="h-3 w-30" />
        </div>
        {/* Pagination controls */}
        <div className="flex items-center justify-between gap-3 md:gap-5">
          <Skeleton className="size-8 sm:h-10 sm:w-12 md:w-24" /> {/* Prev button */}
          {/* Page numbers */}
          <div className="flex items-center gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className={`${i >= 3 ? "max-sm:hidden" : ""} size-8 sm:size-10`} />
            ))}
          </div>
          <Skeleton className="size-8 sm:h-10 sm:w-12 md:w-24" /> {/* Next button */}
        </div>
      </div>
    </Skeleton>
  );
};
