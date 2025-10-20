"use client";

import Image from "next/image";
import { ColumnDef } from "@tanstack/react-table";

import { TransactionWithPaymentStatus } from "@/lib/types";
import { cn, formatCurrency, formatOrdinal } from "@/lib/utils";

import BillDueIcon from "public/assets/images/icon-bill-due.svg";
import BillPaidIcon from "public/assets/images/icon-bill-paid.svg";

const transactionDay = (date: string) => {
  const d = new Date(date);
  return Number.isNaN(d.getTime()) ? undefined : d.getDate();
};

export const columns: ColumnDef<TransactionWithPaymentStatus>[] = [
  {
    accessorKey: "name",
    header: "Bill Title",
    size: 300,
    minSize: 200,
    cell: ({ row }) => {
      const data = row.original;
      const day = data.dueDay ?? transactionDay(data.date);
      return (
        <div className="max-md:space-y-2">
          <div className="flex items-center gap-4">
            <Image
              src={data.avatar}
              alt={`Avatar of ${data.name}`}
              className="size-8 rounded-full"
              width={130}
              height={130}
            />
            <h3 className="text-sm font-bold">{data.name}</h3>
          </div>
          <RenderDateCell data={data} day={day} showIfMobile />
        </div>
      );
    },
  },
  {
    accessorKey: "category",
    header: "Category",
    meta: { className: "hidden" },
    cell: () => null,
  },
  {
    accessorKey: "date",
    header: "Due Date",
    size: 200,
    minSize: 150,
    meta: { className: "hidden md:table-cell" },
    cell: ({ row }) => {
      const data = row.original;
      const day = data.dueDay ?? transactionDay(data.date);
      return <RenderDateCell data={data} day={day} />;
    },
  },
  {
    accessorKey: "amount",
    header: "Amount",
    size: 150,
    minSize: 100,
    meta: { className: "font-bold align-bottom md:align-middle " },
    sortingFn: (rowA, rowB, columnId) => {
      const a = Math.abs(Number(rowA.getValue(columnId) ?? 0));
      const b = Math.abs(Number(rowB.getValue(columnId) ?? 0));
      return a === b ? 0 : a > b ? 1 : -1;
    },
    cell: ({ row }) => {
      const data = row.original;
      const amount = Number(data.amount);
      return (
        <span
          className={cn(data.paid ? "text-green" : data.overdue || data.dueSoon ? "text-red" : "")}
        >
          {formatCurrency(amount, { minimumFractionDigits: 2, signDisplay: "never" })}
        </span>
      );
    },
  },
];

type RenderDateCellProps = {
  data: TransactionWithPaymentStatus;
  day?: number;
  showIfMobile?: boolean;
};

function RenderDateCell({ data, day, showIfMobile = false }: RenderDateCellProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 text-xs",
        data.paid
          ? "text-green"
          : data.overdue || data.dueSoon
            ? "text-red"
            : "text-muted-foreground",
        showIfMobile && "md:hidden",
      )}
    >
      {`Monthly${day ? ` - ${formatOrdinal(day)}` : " - "}`}
      {data.paid ? (
        <BillPaidIcon />
      ) : data.overdue || data.dueSoon ? (
        <BillDueIcon className="*:fill-red" />
      ) : null}
    </div>
  );
}
