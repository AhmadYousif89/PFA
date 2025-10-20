import { Fragment, useRef, useState, useTransition } from "react";

import { cn } from "@/lib/utils";
import { useUrlState } from "@/hooks/use-url-state";
import { SortFormat, TransactionSortKey } from "@/lib/types";

import SearchIcon from "public/assets/images/icon-search.svg";
import SortIcon from "public/assets/images/icon-sort-mobile.svg";
import FilterIcon from "public/assets/images/icon-filter-mobile.svg";
import CaretDownIcon from "public/assets/images/icon-caret-down.svg";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { filterCategories, getCategoryLabel, sortBy, sortMap } from "@/lib/config";
import { Spinner } from "./ui/spinner";

type Props = {
  hideCategoryFilter?: boolean;
};

export const DataTableToolbar = ({ hideCategoryFilter = false }: Props) => {
  const { getParam, updateURL } = useUrlState();
  const timeoutRef = useRef<NodeJS.Timeout>(undefined);
  const [isPending, startTransition] = useTransition();

  const searchQuery = getParam("query", "");
  const [search, setSearch] = useState(searchQuery);
  const sortParam = getParam("sort");
  const categoryQuery = getParam("category", "all-transactions");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearch(query);
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      if ((query && query.trim() !== "") || searchQuery !== "")
        startTransition(() => {
          updateURL({ query: query.trim(), page: null });
        });
    }, 300);
  };

  const handleSortChange = (sortKey: TransactionSortKey) => {
    let sort = null;
    if (sortKey in sortMap) {
      sort = sortMap[sortKey];
    }
    if (sort !== sortParam) {
      updateURL({ sort, page: null });
    }
  };

  const handleCategoryChange = (category: (typeof filterCategories)[number]) => {
    updateURL({
      category: category === "all-transactions" ? null : category,
      page: null,
    });
  };

  const reverseSortMap = Object.entries(sortMap).reduce(
    (acc, [key, value]) => {
      if (value) acc[value] = key as TransactionSortKey;
      return acc;
    },
    {} as Record<SortFormat, TransactionSortKey>,
  );

  const currentSort =
    sortParam && sortParam in reverseSortMap ? reverseSortMap[sortParam] : "Latest";

  return (
    <header className="flex items-center justify-between gap-6">
      {/* Search Bar */}
      <form
        onSubmit={(e) => e.preventDefault()}
        className="border-border grid max-w-sm grow basis-full place-items-center rounded-md border"
      >
        <Label
          htmlFor="search-table"
          className="bg-card z-10 col-end-1 row-end-1 mr-px grid size-10 place-items-center justify-self-end rounded-md"
        >
          {isPending ? (
            <Spinner className="fill-foreground size-4" />
          ) : (
            <SearchIcon className="size-4" />
          )}
        </Label>
        <Input
          name="search"
          type="search"
          id="search-table"
          className="col-end-1 row-end-1"
          placeholder="Search transaction"
          onChange={handleSearchChange}
          value={search}
        />
      </form>
      <div className="flex min-w-fit items-center gap-6">
        {/* Sort Menu */}
        <div className="ml-auto flex items-center gap-2">
          <span className="text-muted-foreground hidden text-sm md:inline-block">Sort By</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className={cn(
                  "group size-5 rounded-none",
                  "md:data-[state=open]:bg-accent/50 md:h-11.25 md:min-w-28.25 md:gap-4 md:rounded-md md:border",
                )}
              >
                <span className="text-input group-hover:text-accent-foreground group-data-[state=open]:text-accent-foreground hidden md:inline-block">
                  {currentSort}
                </span>
                <span className="grid w-8 place-items-center md:size-4">
                  <SortIcon className="md:hidden" />
                  <CaretDownIcon
                    className={cn(
                      "hidden h-2 w-3 *:size-0 md:grid",
                      "[&_path]:fill-input group-hover:[&_path]:fill-accent-foreground group-data-[state=open]:[&_path]:fill-accent-foreground",
                      "transition-transform group-data-[state=open]:rotate-180",
                    )}
                  />
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="min-w-28.25 px-5 py-3" sideOffset={16} align="end">
              <DropdownMenuLabel className="md:hidden">Sort By</DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-muted my-1.5 md:hidden" />
              {sortBy.map((item) => (
                <Fragment key={item}>
                  <DropdownMenuItem
                    className={`text-sm ${currentSort === item ? "bg-accent/50 font-bold" : ""}`}
                    onClick={() => handleSortChange(item)}
                  >
                    {item}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-muted my-1.5 last:hidden" />
                </Fragment>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        {/* Category Filter */}
        {hideCategoryFilter ? null : (
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground hidden text-sm md:inline-block">Category</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className={cn(
                    "group size-5 rounded-none",
                    "md:data-[state=open]:bg-accent/50 md:h-11.25 md:min-w-44.25 md:gap-4 md:rounded-md md:border",
                  )}
                >
                  <span className="text-input group-hover:text-accent-foreground group-data-[state=open]:text-accent-foreground hidden md:inline-block">
                    {getCategoryLabel(categoryQuery)}
                  </span>
                  <span className="grid w-8 place-items-center md:size-4">
                    <FilterIcon className="md:hidden" />
                    <CaretDownIcon
                      className={cn(
                        "hidden h-2 w-3 *:size-0 md:grid",
                        "[&_path]:fill-input group-hover:[&_path]:fill-accent-foreground group-data-[state=open]:[&_path]:fill-accent-foreground",
                        "transition-transform group-data-[state=open]:rotate-180",
                      )}
                    />
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="max-h-75 min-w-44.25 px-5 py-3 lg:min-w-48"
                sideOffset={16}
                align="end"
              >
                <DropdownMenuLabel className="md:hidden">Category</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-muted my-1.5 md:hidden" />
                {filterCategories.map((slug) => (
                  <Fragment key={slug}>
                    <DropdownMenuItem
                      onClick={() => handleCategoryChange(slug)}
                      className={`text-sm ${categoryQuery === slug ? "bg-accent/50 font-bold" : ""}`}
                    >
                      {getCategoryLabel(slug)}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-muted my-1.5 last:hidden" />
                  </Fragment>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
    </header>
  );
};
