import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { TNavItem } from "./navigation";

type NavItemProps = { item: TNavItem; isMenuOpen: boolean };

export const NavItem = ({ item, isMenuOpen }: NavItemProps) => {
  const pathname = usePathname();
  const isOverviewRoute =
    (item.href === "/dashboard/overview" && pathname === "/dashboard") ||
    pathname === "/dashboard/overview";
  const isActive = item.href === "/dashboard/overview" ? isOverviewRoute : pathname === item.href;

  return (
    <li
      className={cn(
        "group relative flex size-full items-center justify-center rounded-t-md",
        "xl:h-14 xl:rounded-tl-none xl:rounded-br-md",
        "after:absolute after:bottom-0 after:h-1 after:w-full after:bg-transparent",
        "xl:after:left-0 xl:after:h-full xl:after:w-1",
        isActive && "bg-sidebar-primary after:bg-sidebar-accent",
      )}
    >
      <Link
        href={item.href}
        aria-selected={isActive}
        className={cn(
          "flex size-full items-center justify-center",
          "xl:justify-stretch xl:gap-4 xl:pl-8 @2xl/nav:flex-col @2xl/nav:gap-1",
        )}
      >
        <span
          className={cn(
            isActive
              ? "[&_path]:fill-sidebar-accent"
              : "group-hover:[&_path]:fill-sidebar-accent-foreground group-focus-within:[&_path]:fill-sidebar-accent-foreground",
          )}
        >
          {item.icon}
        </span>
        <span
          className={cn(
            "hidden text-xs font-bold whitespace-nowrap transition duration-300 xl:block xl:text-base @2xl/nav:block",
            isActive
              ? "text-sidebar-primary-foreground"
              : "text-sidebar-foreground group-hover:text-sidebar-accent-foreground group-focus-within:text-sidebar-accent-foreground",
            isMenuOpen ? "xl:visible xl:opacity-100" : "xl:invisible xl:opacity-0",
          )}
        >
          {item.title}
        </span>
      </Link>
    </li>
  );
};
