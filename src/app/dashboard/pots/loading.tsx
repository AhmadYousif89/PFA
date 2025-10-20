import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingPots() {
  return (
    <div className="@container flex flex-col gap-8">
      <header className="flex items-center justify-between">
        <Skeleton className="h-9 w-32" />
        <Skeleton className="h-15 w-34" />
      </header>

      <div className="custom-grid">
        {Array.from({ length: 6 }).map((_, index) => (
          <Skeleton
            key={index}
            className="grid min-h-79.25 items-start gap-8 overflow-hidden py-5 lg:py-8"
          >
            <div className="flex justify-between px-5 md:px-6 lg:px-8">
              <div className="flex items-center gap-4">
                <Skeleton className="aspect-square size-5 rounded-full" />
                <Skeleton className="h-6 w-32" />
              </div>
              <Skeleton className="size-6 rounded-xs" />
            </div>

            <div className="flex flex-col gap-5 px-5 md:px-6 lg:px-8">
              <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-10 w-32" />
              </div>
              <div className="flex flex-col gap-2">
                <Skeleton className="h-2 w-full rounded" />
                <div className="flex items-center justify-between gap-4">
                  <Skeleton className="h-3 w-10" />
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4 px-5 md:px-6 lg:px-8">
              <Skeleton className="h-13.5 w-full" />
              <Skeleton className="h-13.5 w-full" />
            </div>
          </Skeleton>
        ))}
      </div>
    </div>
  );
}
