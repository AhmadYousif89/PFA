"use client";

import Link from "next/link";
import { useCallback, useRef, useState } from "react";

import { cn } from "@/lib/utils";
import { NavControlsDrawer } from "./navigation.drawer";

import LogoSmall from "public/assets/images/logo-small.svg";
import LogoLarge from "public/assets/images/logo-large.svg";
import OverviewIcon from "public/assets/images/icon-nav-overview.svg";
import TransactionsIcon from "public/assets/images/icon-nav-transactions.svg";
import BudgetsIcon from "public/assets/images/icon-nav-budgets.svg";
import PotsIcon from "public/assets/images/icon-nav-pots.svg";
import BillsIcon from "public/assets/images/icon-nav-recurring-bills.svg";

import { NavItem } from "./navigation.item";
import { NavControlsMenu } from "./navigation.menu";
import { NavigationControls } from "./navigation.controls";
import { useSession } from "@/app/(auth)/_lib/auth.client";

export type TNavItem = (typeof NAV_ITEMS)[number];
const NAV_ITEMS = [
  {
    key: "overview",
    title: "Overview",
    href: "/dashboard/overview",
    icon: <OverviewIcon />,
  },
  {
    key: "transactions",
    title: "Transactions",
    href: "/dashboard/transactions",
    icon: <TransactionsIcon />,
  },
  {
    key: "budgets",
    title: "Budgets",
    href: "/dashboard/budgets",
    icon: <BudgetsIcon />,
  },
  {
    key: "pots",
    title: "Pots",
    href: "/dashboard/pots",
    icon: <PotsIcon />,
  },
  {
    key: "bills",
    title: "Recurring bills",
    href: "/dashboard/bills",
    icon: <BillsIcon />,
  },
];

export const NavigationMenu = () => {
  const [isMenuOpen, setMenuState] = useState(true);
  const [toggleView, setToggleView] = useState(true);
  const navRef = useRef<HTMLDivElement | null>(null);
  const session = useSession();

  const handleToggleView = useCallback(() => {
    setToggleView((s) => {
      const newState = !s;
      document.body.style.setProperty("--site-max-w", newState ? "1440px" : "100vw");
      return newState;
    });
  }, []);

  const handleToggleMenu = useCallback(() => {
    setMenuState((s) => !s);
  }, []);

  return (
    <>
      <div className="relative isolate z-[100] touch-none xl:-order-1">
        {/* Nav controls for mobile users */}
        <NavControlsDrawer session={session} />
        {/* Nav Container */}
        <div
          ref={navRef}
          className={cn(
            "bg-sidebar ring-background/5 @container/nav flex h-full flex-col overflow-hidden",
            "transition-[width,height] transition-discrete duration-300 ease-in-out will-change-[width,height]",
            isMenuOpen ? "xl:w-75" : "xl:w-22",
          )}
        >
          <nav
            aria-label="Main navigation"
            className={cn(
              "relative mt-auto flex h-13.5 flex-col items-center justify-center rounded-t-md px-4 pt-2 sm:h-18.5",
              "xl:h-full xl:rounded-tl-none xl:rounded-br-md xl:p-0 @2xl/nav:px-10",
            )}
          >
            <span className="hidden w-full py-10 pr-6 xl:mb-6 xl:block">
              <Link href="/" className="flex pl-8">
                {isMenuOpen ? <LogoLarge /> : <LogoSmall />}
              </Link>
            </span>
            {/* Main Nav Links */}
            <ul
              className={cn(
                "flex size-full",
                "xl:flex-col xl:gap-1 @2xl/nav:justify-between @2xl/nav:gap-4",
                "xl:transition-[padding-right] xl:duration-300 xl:ease-in-out xl:will-change-[padding]",
                isMenuOpen ? "xl:pr-6" : "xl:pr-2",
              )}
            >
              {NAV_ITEMS.map((item) => (
                <NavItem key={item.key} item={item} isMenuOpen={isMenuOpen} />
              ))}
            </ul>
            {/*  */}
            <NavigationControls
              isMenuOpen={isMenuOpen}
              toggleView={toggleView}
              onToggleView={handleToggleView}
              onToggleMenu={handleToggleMenu}
            />
            {/* Nav Controls for descktop users */}
            <NavControlsMenu session={session} />
          </nav>
        </div>
      </div>
    </>
  );
};
