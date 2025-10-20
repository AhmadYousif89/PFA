import { useCallback, useEffect, useMemo, useState } from "react";

import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  type ColumnFiltersState,
  type SortingState,
  type ColumnDef,
  type Row,
} from "@tanstack/react-table";

import { useUrlState } from "./use-url-state";
import { formatCurrency, formatDate } from "@/lib/utils";

export function useDataTable<TData, TValue>(data: TData[], columns: ColumnDef<TData, TValue>[]) {
  const { getParam } = useUrlState();

  const currentQuery = getParam("query", "");
  const currentSort = getParam("sort");
  const currentCategory = getParam("category", "all-transactions");
  const page = getParam("page") ? Number(getParam("page")) : 1;

  const [sorting, setSorting] = useState<SortingState>(() => {
    if (currentSort && currentSort.includes(":")) {
      const [sort, order] = currentSort.split(":");
      return [{ id: sort, desc: order === "desc" }];
    }
    return [];
  });
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(() => {
    if (currentCategory && currentCategory !== "all-transactions") {
      return [{ id: "category", value: currentCategory }];
    }
    return [];
  });
  const [globalFilter, setGlobalFilter] = useState(currentQuery);

  const pageSize = 10;
  const totalPages = Math.max(1, Math.ceil(data.length / pageSize));
  const sanitizedPage = page < 1 ? 1 : page > totalPages ? totalPages : page;

  const pagination = useMemo(() => ({ pageIndex: sanitizedPage - 1, pageSize }), [sanitizedPage]);

  const globalFilterFn = useCallback((row: Row<TData>, _columnId: string, value: string) => {
    const searchValue = value.toLowerCase() || "";
    if (!searchValue) return true;

    // Search in name
    const name = row.getValue("name")?.toString().toLowerCase() || "";
    if (name.includes(searchValue)) return true;

    // Search in formatted amount (and raw)
    const amountRaw = row.getValue("amount");
    const amount = Number(amountRaw);
    if (Number.isFinite(amount)) {
      const formattedAmount = formatCurrency(amount, {
        minimumFractionDigits: 2,
        signDisplay: "exceptZero",
      }).toLowerCase();
      const rawAmount = amount.toString();
      if (formattedAmount.includes(searchValue) || rawAmount.includes(searchValue)) return true;
    }

    // Search by category
    const category = row.getValue("category")?.toString().toLowerCase() || "";
    if (category.includes(searchValue)) return true;

    // Search by date (safe parsing)
    const dateRaw = row.getValue("date") as unknown;
    const dateObj = dateRaw instanceof Date ? dateRaw : new Date(dateRaw as string);
    if (!Number.isNaN(dateObj.getTime())) {
      const formattedDate = formatDate(dateObj).toLowerCase();
      if (formattedDate.includes(searchValue)) return true;
    }

    return false;
  }, []);

  // Sync URL state with table state
  useEffect(() => {
    const urlQuery = getParam("query", "");
    setGlobalFilter((prev) => (prev !== urlQuery ? urlQuery : prev));
  }, [getParam]);

  useEffect(() => {
    const urlSort = getParam("sort");
    if (urlSort && urlSort.includes(":")) {
      const [sort, order] = urlSort.split(":");
      const desired = [{ id: sort, desc: order === "desc" }];
      setSorting((prev) => {
        const same =
          prev.length === 1 && prev[0].id === desired[0].id && prev[0].desc === desired[0].desc;
        return same ? prev : desired;
      });
    } else {
      setSorting((prev) => (prev.length ? [] : prev));
    }
  }, [getParam]);

  useEffect(() => {
    const urlCategory = getParam("category", "all-transactions");
    const currentCategoryFilter = columnFilters.find((filter) => filter.id === "category");

    if (urlCategory === "all-transactions") {
      if (currentCategoryFilter) {
        setColumnFilters((prev) => prev.filter((filter) => filter.id !== "category"));
      }
    } else {
      if (!currentCategoryFilter || currentCategoryFilter.value !== urlCategory) {
        setColumnFilters((prev) => [
          ...prev.filter((filter) => filter.id !== "category"),
          { id: "category", value: urlCategory },
        ]);
      }
    }
  }, [getParam, columnFilters]);

  const table = useReactTable({
    data,
    columns,
    globalFilterFn,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: { pagination, sorting, columnFilters, globalFilter },
  });

  return table;
}
