import { Skeleton } from "@/components/ui/skeleton";
import { Fragment } from "react";

export const BillsTableSkeleton = () => {
  return (
    <Skeleton className="flex grow flex-col gap-6 p-5 md:p-8">
      {/* Table Toolbar */}
      <div className="flex items-center justify-between gap-6">
        {/* Search Input */}
        <div className="max-w-xs grow">
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
        {/* Sort and Filter Controls */}
        <div className="flex items-center gap-2">
          <Skeleton className="hidden h-4 w-12 md:block" /> {/* label */}
          <Skeleton className="size-5 md:h-11.25 md:w-28.25" /> {/* Dropdown */}
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 space-y-4">
        {/* Table Header (hidden on mobile) */}
        <div className="md:bg-secondary/20 hidden md:grid md:py-3">
          <div className="flex items-center justify-between gap-4">
            <Skeleton className="h-4 w-32" /> {/* Bill */}
            <Skeleton className="h-4 w-20" /> {/* Date */}
            <Skeleton className="h-4 w-20" /> {/* Amount */}
          </div>
        </div>
        {/* Table Rows */}
        {Array.from({ length: 8 }).map((_, i) => (
          <Fragment key={i}>
            <div className="flex h-10 items-center justify-between">
              {/* Mobile layout - single column */}
              <div className="flex w-full items-center justify-between md:hidden">
                <div className="space-y-1">
                  <Skeleton className="h-4 w-32" /> {/* Bill name */}
                  <Skeleton className="h-3 w-20" /> {/* Date */}
                </div>
                <Skeleton className="h-4 w-16" /> {/* Amount */}
              </div>
              {/* Desktop layout - multiple columns */}
              <div className="hidden md:flex md:w-full md:items-center md:justify-between md:gap-4">
                <Skeleton className="h-4 w-32" /> {/* Bill */}
                <Skeleton className="h-4 w-20" /> {/* Date */}
                <Skeleton className="h-4 w-20" /> {/* Amount */}
              </div>
            </div>
            {/* Separator */}
            <Skeleton className="my-4 h-px w-full last:hidden" />
          </Fragment>
        ))}
      </div>
    </Skeleton>
  );
};
