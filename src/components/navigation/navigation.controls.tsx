import { memo } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import MinimizeIcon from "public/assets/images/icon-minimize-menu.svg";
import NarrowLayoutIcon from "public/assets/images/icon-narrow-layout.svg";
import WideLayoutIcon from "public/assets/images/icon-wide-layout.svg";

interface NavigationControlsProps {
  isMenuOpen: boolean;
  toggleView: boolean;
  onToggleView: () => void;
  onToggleMenu: () => void;
}

export const NavigationControls = memo(
  ({ isMenuOpen, toggleView, onToggleView, onToggleMenu }: NavigationControlsProps) => {
    return (
      <ul className="border-border/20 hidden w-full gap-4 border-t py-8 xl:grid">
        <li className="relative grid px-5">
          <Button
            variant="outline"
            className={cn(
              "text-sidebar-foreground h-12 justify-start gap-3 overflow-hidden bg-transparent px-3",
              "hover:bg-muted/10 hover:text-sidebar-accent-foreground",
              "focus-visible:bg-muted/10 focus:bg-muted/20",
            )}
            onClick={onToggleView}
          >
            {toggleView ? (
              <NarrowLayoutIcon className="size-6" />
            ) : (
              <WideLayoutIcon className="size-6" />
            )}
            <span
              className={cn(
                "whitespace-nowrap transition duration-300",
                isMenuOpen ? "xl:opacity-100" : "xl:opacity-0",
              )}
            >
              Toggle View
            </span>
          </Button>
        </li>
        <li className="relative grid px-5">
          <Button
            variant="outline"
            aria-expanded={isMenuOpen}
            aria-controls="navigation-menu"
            aria-label="Minimize navigation menu"
            className={cn(
              "text-sidebar-foreground h-12 justify-start gap-4 overflow-hidden bg-transparent px-3",
              "hover:bg-muted/10 hover:text-sidebar-accent-foreground",
              "focus-visible:bg-muted/10 focus:bg-muted/20",
            )}
            onClick={onToggleMenu}
          >
            <MinimizeIcon
              className={cn(
                "group-hover:[&_path]:fill-sidebar-accent-foreground ml-0.5 size-fit transition-transform duration-300",
                isMenuOpen ? "" : "rotate-180",
              )}
            />
            <span
              className={cn(
                "whitespace-nowrap transition duration-300",
                isMenuOpen ? "xl:opacity-100" : "xl:opacity-0",
              )}
            >
              Minimize Menu
            </span>
          </Button>
        </li>
      </ul>
    );
  },
);

NavigationControls.displayName = "NavigationControls";
