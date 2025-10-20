import Link from "next/link";
import { SessionClient, signOut } from "@/app/(auth)/_lib/auth.client";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Spinner } from "../ui/spinner";
import { Skeleton } from "../ui/skeleton";

import LogoutIcon from "public/assets/images/icon-logout.svg";
import ProfileIcon from "public/assets/images/icon-user.svg";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const Wrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="border-border/20 relative row-end-1 hidden w-full border-t px-5 py-8 *:col-end-1 *:row-end-1 xl:grid">
      {children}
    </div>
  );
};

export const NavControlsMenu = ({ session: { data, isPending } }: { session: SessionClient }) => {
  const pathname = usePathname();

  if (isPending)
    return (
      <Wrapper>
        <Skeleton className="h-12 rounded-md border" />
        <Spinner className="fill-muted-foreground size-7 place-self-center" />
      </Wrapper>
    );

  if (!data)
    return (
      <Wrapper>
        <Button
          asChild
          className="group text-muted border-border hover:border-primary h-12 w-full max-w-[260px] justify-start gap-4 overflow-hidden border px-3 text-base font-semibold"
        >
          <Link href="/sign-up">
            <ProfileIcon className="fill-muted size-6" />
            Create Account
          </Link>
        </Button>
      </Wrapper>
    );

  return (
    <Wrapper>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="hover:bg-muted/10 focus-visible:bg-muted/10 focus:bg-muted/20 h-12 justify-start gap-4 overflow-hidden bg-transparent px-3"
          >
            <svg
              className="border-muted fill-muted size-6 rounded-full border p-0.5"
              xmlns="http://www.w3.org/2000/svg"
              height="24px"
              viewBox="0 -960 960 960"
              width="24px"
            >
              <path d="M480-120 300-300l58-58 122 122 122-122 58 58-180 180ZM358-598l-58-58 180-180 180 180-58 58-122-122-122 122Z" />
            </svg>
            <div className="flex flex-col">
              <span className="text-primary-foreground hover:text-muted-foreground mr-auto max-w-32 truncate">
                {data.user.name}
              </span>
              <span className="text-primary-foreground hover:text-muted-foreground mr-auto max-w-40 truncate text-xs font-semibold">
                {data.user.email}
              </span>
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="flex w-(--radix-dropdown-menu-trigger-width) min-w-3xs flex-col p-2"
          align="start"
        >
          <DropdownMenuItem
            asChild
            className={cn(
              "focus:bg-accent focus:border-muted border border-transparent px-3 py-3 text-sm font-medium",
              pathname === "/dashboard/profile" && "bg-accent border-muted-foreground/50 shadow",
            )}
          >
            <Link href="/dashboard/profile">
              <ProfileIcon className="fill-foreground size-5" />
              Manage Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="my-2 opacity-15" />
          <DropdownMenuItem
            onClick={signOut}
            className="focus:bg-red/90 bg-red focus:text-primary-foreground text-primary-foreground group px-3 py-2 text-sm"
          >
            <LogoutIcon className="fill-primary-foreground size-5" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </Wrapper>
  );
};
