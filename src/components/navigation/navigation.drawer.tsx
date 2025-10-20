import Link from "next/link";
import { useRef, useState } from "react";

import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { SessionClient, signOut } from "@/app/(auth)/_lib/auth.client";

import ChevronIcon from "public/assets/images/icon-caret-down.svg";
import LogoutIcon from "public/assets/images/icon-logout.svg";
import ProfileIcon from "public/assets/images/icon-user.svg";

export const NavControlsDrawer = ({ session }: { session: SessionClient }) => {
  const isDragging = useRef(false);
  const dragStartY = useRef<number | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  if (!session.data) return null;

  const handleDragStart = (clientY: number) => {
    dragStartY.current = clientY;
    isDragging.current = true;
  };

  const handleDragMove = (clientY: number) => {
    if (!isDragging.current || dragStartY.current === null) return;

    const deltaY = dragStartY.current - clientY;
    const threshold = 20; // pixels to drag before toggling

    if (deltaY > threshold && !isExpanded) {
      setIsExpanded(true);
      isDragging.current = false;
    } else if (deltaY < -threshold && isExpanded) {
      setIsExpanded(false);
      isDragging.current = false;
    }
  };

  const handleDragEnd = () => {
    dragStartY.current = null;
    isDragging.current = false;
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          "bg-sidebar/25 fixed inset-0 transition-opacity duration-300",
          isExpanded
            ? "pointer-events-auto -z-30 touch-none opacity-100"
            : "pointer-events-none opacity-0",
        )}
        aria-hidden={isExpanded ? "false" : "true"}
        onClick={() => setIsExpanded(false)}
      />

      <button
        className={cn(
          "py-xp border-muted-foreground/25 absolute -top-5 right-0 left-0 -z-10 flex h-5 cursor-pointer items-center justify-center rounded-b-none transition-colors duration-300 outline-none xl:hidden",
          "hover:bg-blue/15 focus-visible:ring-blue/15 focus:bg-beige/25 focus-visible:ring",
        )}
        onClick={() => setIsExpanded((s) => !s)}
        onPointerDown={(e) => {
          e.currentTarget.setPointerCapture(e.pointerId);
          handleDragStart(e.clientY);
        }}
        onPointerMove={(e) => handleDragMove(e.clientY)}
        onPointerUp={(e) => {
          e.currentTarget.releasePointerCapture(e.pointerId);
          handleDragEnd();
        }}
        onPointerCancel={handleDragEnd}
        aria-expanded={isExpanded ? "true" : "false"}
      >
        <ChevronIcon
          className={cn(
            "*:fill-primary size-fit rotate-180 animate-pulse transition-transform duration-300 ease-in-out",
          )}
        />
      </button>
      <nav
        aria-label="User controls"
        className={cn(
          "max-w-card bg-sidebar @container absolute right-0 bottom-0 left-0 z-50 mx-auto h-full xl:hidden",
          "flex flex-col gap-4 rounded-t-md px-4 pt-2 *:grow sm:px-10",
          "border-muted-foreground border-b",
          "-z-10 transition-all duration-300 ease-in-out",
          isExpanded
            ? "visible -translate-y-full opacity-100"
            : "pointer-events-none invisible translate-y-0 opacity-0",
        )}
      >
        <ul className="flex justify-between gap-4">
          <li className="border-muted border-b-2">
            <Button
              asChild
              variant="ghost"
              className="text-muted hover:bg-muted/15 hover:text-muted bg-muted/10 focus-visible:text-muted focus-visible:bg-muted/10 size-full rounded-b-none"
              onClick={() => setIsExpanded(false)}
            >
              <Link href="/dashboard/profile">
                <ProfileIcon className="fill-muted size-5" />
                <span>Profile</span>
              </Link>
            </Button>
          </li>
          <li className="border-muted border-b-2">
            <Button
              asChild
              variant="destructive"
              className="size-full rounded-b-none"
              onClick={signOut}
            >
              <Link href="/">
                <LogoutIcon className="fill-muted size-5" />
                <span>Logout</span>
              </Link>
            </Button>
          </li>
        </ul>
      </nav>
    </>
  );
};
