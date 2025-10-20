"use client";

import { Fragment, useCallback } from "react";
import { Table } from "@tanstack/react-table";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";

import LeftCaretIcon from "public/assets/images/icon-caret-left.svg";
import RightCaretIcon from "public/assets/images/icon-caret-right.svg";
import { useUrlState } from "@/hooks/use-url-state";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
}

export function DataTablePagination<TData>({ table }: DataTablePaginationProps<TData>) {
  const { updateURL } = useUrlState();

  const handlePageChange = useCallback(
    (pageIndex: number) => {
      const newPage = pageIndex + 1;
      updateURL({ page: newPage > 1 ? String(newPage) : null });
    },
    [updateURL],
  );

  const handlePageSelection = useCallback(
    (pageIdx: number) => handlePageChange(pageIdx),
    [handlePageChange],
  );

  const handlePreviousPage = () => {
    if (table.getCanPreviousPage()) {
      const newPageIndex = table.getState().pagination.pageIndex - 1;
      handlePageChange(newPageIndex);
    }
  };

  const handleNextPage = () => {
    if (table.getCanNextPage()) {
      const newPageIndex = table.getState().pagination.pageIndex + 1;
      handlePageChange(newPageIndex);
    }
  };

  return (
    <section className="flex flex-col gap-1.5">
      <div className="text-muted-foreground flex justify-between text-center text-xs">
        <span>
          {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{" "}
          {Math.min(
            (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
            table.getFilteredRowModel().rows.length,
          )}{" "}
          of {table.getFilteredRowModel().rows.length} results
        </span>
        <span>
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </span>
      </div>
      <div className="flex items-center justify-between gap-3 md:gap-5">
        <Button
          variant="outline"
          className="min-h-8 min-w-8 gap-4 sm:min-h-10 sm:min-w-12 md:min-w-24"
          onClick={handlePreviousPage}
          disabled={!table.getCanPreviousPage()}
        >
          <span className="h-2.5 w-1.5 md:-ml-1.5">
            <LeftCaretIcon />
          </span>
          <span className="hidden md:inline-block">Prev</span>
        </Button>
        {/* Page numbers */}
        <RenderPageSelectionButtons
          pageCount={table.getPageCount()}
          pageIndex={table.getState().pagination.pageIndex}
          onPageSelection={handlePageSelection}
        />
        <Button
          variant="outline"
          className="min-h-8 min-w-8 gap-4 sm:min-h-10 sm:min-w-12 md:min-w-24"
          onClick={handleNextPage}
          disabled={!table.getCanNextPage()}
        >
          <span className="hidden md:inline-block">Next</span>
          <span className="h-2.5 w-1.5 md:-mr-1.5">
            <RightCaretIcon />
          </span>
        </Button>
      </div>
    </section>
  );
}

type Props = {
  pageCount: number;
  pageIndex: number;
  onPageSelection: (pageIdx: number) => void;
};

const RenderPageSelectionButtons = ({ pageCount, pageIndex, onPageSelection }: Props) => {
  const data = Array.from({ length: pageCount }, (_, i) => i + 1)
    // Filter pages to show only the first, last, and adjacent pages to the current page
    .filter((page) => page === 1 || page === pageCount || Math.abs(page - (pageIndex + 1)) <= 1)
    .map((page, index, array) => {
      // Show ellipsis if the previous page is not the one before the current page
      const showEllipsis = index > 0 && array[index - 1] !== page - 1;
      const isCurrentPage = pageIndex + 1 === page;
      // Generate hidden pages for ellipsis dropdown
      const getHiddenPages = () => {
        const hiddenPages = [];
        const prevPage = array[index - 1];
        for (let i = prevPage + 1; i < page; i++) hiddenPages.push(i);
        return hiddenPages;
      };
      return {
        page,
        showEllipsis,
        isCurrentPage,
        getHiddenPages,
      };
    });

  return (
    <div className="flex items-center gap-2">
      {data.map(({ page, showEllipsis, isCurrentPage, getHiddenPages }) => (
        <Fragment key={page}>
          {showEllipsis && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="text-muted-foreground hover:text-foreground size-8 p-0 sm:size-10"
                >
                  ...
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" className="flex min-w-fit gap-2">
                {getHiddenPages().map((hiddenPage) => (
                  <Button
                    asChild
                    key={hiddenPage}
                    variant="outline"
                    className="size-8 p-0 sm:size-10"
                  >
                    <DropdownMenuItem
                      onClick={() => onPageSelection(hiddenPage - 1)}
                      className="cursor-pointer justify-center"
                    >
                      {hiddenPage}
                    </DropdownMenuItem>
                  </Button>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
          <Button
            variant="outline"
            disabled={isCurrentPage}
            onClick={() => onPageSelection(page - 1)}
            className={`size-8 p-0 sm:size-10 ${isCurrentPage ? "bg-foreground text-primary-foreground focus:bg-foreground border-none disabled:opacity-100" : ""}`}
          >
            {page}
          </Button>
        </Fragment>
      ))}
    </div>
  );
};
