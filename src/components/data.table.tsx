"use client";

import { Fragment } from "react";
import { ColumnDef, flexRender, Table as TableType } from "@tanstack/react-table";

import {
  TableHeader,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  Table,
} from "@/components/ui/table";
import { Separator } from "./ui/separator";

import { Transaction } from "@/lib/types";
import { cn } from "@/lib/utils";

interface DataTableProps<TData, TValue> {
  table: TableType<Transaction>;
  columns: ColumnDef<TData, TValue>[];
}

export function DataTable<TData, TValue>({ table, columns }: DataTableProps<TData, TValue>) {
  const tableHeaderGroups = table.getHeaderGroups();
  const tableRows = table.getRowModel().rows;

  return (
    <Table>
      <TableHeader className="border-muted bg-accent sticky top-0 z-10 hidden border-b md:table-header-group">
        {tableHeaderGroups.map((headerGroup) => (
          <TableRow key={headerGroup.id}>
            {headerGroup.headers.map((header) => {
              return (
                <TableHead
                  key={header.id}
                  style={{ width: header.getSize() }}
                  className={cn(header.column.columnDef.meta?.className)}
                >
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </TableHead>
              );
            })}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {/* Spacer row for gap between header and body */}
        <TableRow className="pointer-events-none hidden hover:bg-transparent md:table-row">
          <TableCell colSpan={columns.length} className="h-6 p-0"></TableCell>
        </TableRow>
        {/* Main table rows */}
        {tableRows.length ? (
          tableRows.map((row) => (
            <Fragment key={row.id}>
              <TableRow data-state={row.getIsSelected() && "selected"}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    style={{ width: cell.column.getSize() }}
                    className={cn(cell.column.columnDef.meta?.className)}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
              {/* Separator row for gap between rows */}
              <TableRow className="pointer-events-none last:hidden hover:bg-transparent data-[state=selected]:bg-transparent">
                <TableCell colSpan={columns.length} className="p-0">
                  <Separator className="bg-muted my-4" />
                </TableCell>
              </TableRow>
            </Fragment>
          ))
        ) : (
          <TableRow>
            <TableCell className="text-destructive !text-left text-sm font-bold">
              No transactions found.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
