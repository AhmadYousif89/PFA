"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import UserIcon from "public/assets/images/icon-user.svg";
import { useSession } from "@/app/(auth)/_lib/auth.client";
import { Skeleton } from "@/components/ui/skeleton";

export const ProfileHeader = () => {
  const { data, isPending } = useSession();

  return (
    <Card className="flex-row items-start justify-between gap-4 p-4 md:p-6">
      <div className="flex items-center gap-4">
        <div className="bg-primary flex size-10 items-center justify-center rounded-full">
          <UserIcon className="fill-primary-foreground size-6" />
        </div>
        {isPending ? (
          <div className="space-y-1.5">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-60" />
          </div>
        ) : (
          <div>
            <h2 className="text-lg font-bold">{data?.user.name || "User Profile"}</h2>
            <p className="text-muted-foreground text-sm">{data?.user.email}</p>
          </div>
        )}
      </div>
      {isPending ? (
        <Skeleton className="h-6 w-14" />
      ) : (
        <Badge
          title={`Your current plan is ${data?.user.tier}`}
          className="bg-accent text-muted-foreground cursor-default rounded-full"
        >
          {data?.user.tier}
        </Badge>
      )}
    </Card>
  );
};
