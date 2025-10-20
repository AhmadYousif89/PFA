import { Skeleton } from "@/components/ui/skeleton";

export const AccountSummarySkeleton = () => {
  return (
    <>
      {Array.from({ length: 3 }).map((_, i) => (
        <Skeleton key={i} className="flex basis-full flex-col gap-3 p-5 @2xl/overview:p-6">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-9 w-44" />
        </Skeleton>
      ))}
    </>
  );
};
