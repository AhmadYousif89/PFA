"use client";

import Image from "next/image";
import { ColumnDef } from "@tanstack/react-table";

import { Transaction, TransactionCategory } from "@/lib/types";
import { formatCurrency, formatDate } from "@/lib/utils";
import { getCategoryLabel } from "@/lib/config";

export const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "name",
    header: "Recipient / Sender",
    size: 300,
    minSize: 200,
    cell: ({ row }) => {
      const data = row.original;
      return (
        <div className="flex items-center gap-3 md:gap-4">
          <Image
            src={data.avatar}
            alt={`Avatar of ${data.name}`}
            className="size-8 rounded-full md:size-10"
            width={130}
            height={130}
          />
          <div className="flex flex-col gap-1 text-left">
            <h3 className="text-sm font-bold">{data.name}</h3>
            <span className="text-muted-foreground text-xs md:hidden">
              {getCategoryLabel(data.category)}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "category",
    header: "Category",
    size: 150,
    minSize: 100,
    meta: { className: "hidden md:table-cell" },
    cell: ({ row }) => (
      <span className="text-muted-foreground text-xs">
        {getCategoryLabel(row.getValue("category") as TransactionCategory)}
      </span>
    ),
  },
  {
    accessorKey: "date",
    header: "Transaction Date",
    size: 150,
    minSize: 100,
    meta: { className: "hidden md:table-cell" },
    cell: ({ row }) => (
      <span className="text-muted-foreground text-xs">{formatDate(row.getValue("date"))}</span>
    ),
  },
  {
    accessorKey: "amount",
    header: "Amount",
    size: 150,
    minSize: 100,
    cell: ({ row }) => {
      const amount = Number(row.getValue("amount"));
      return (
        <div className="flex flex-col items-end gap-1 text-right">
          <span className={`font-bold ${amount < 0 ? "text-foreground" : "text-primary"}`}>
            {formatCurrency(amount, {
              minimumFractionDigits: 2,
              signDisplay: "exceptZero",
            })}
          </span>
          <span className="text-muted-foreground text-xs md:hidden">
            {formatDate(row.getValue("date"))}
          </span>
        </div>
      );
    },
  },
];
