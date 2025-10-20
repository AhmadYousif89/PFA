"use client";

import { Transaction } from "@/lib/types";

import { columns } from "./transactions.columns";
import { Card } from "@/components/ui/card";
import { DataTable } from "@/components/data.table";
import { useDataTable } from "@/hooks/use-data-table";
import { DataTableToolbar } from "@/components/data.table.toolbar";
import { DataTablePagination } from "@/components/data.table.pagination";

type TransactionTableProps = {
  transactions: Transaction[];
};

export const TransactionTable = ({ transactions }: TransactionTableProps) => {
  const table = useDataTable(transactions, columns);

  return (
    <Card
      data-slot="transaction-table"
      className="h-full grow gap-6 px-5 md:p-8 xl:max-h-[calc(100dvh-8.5rem)]"
    >
      <DataTableToolbar />
      <DataTable columns={columns} table={table} />
      <DataTablePagination table={table} />
    </Card>
  );
};
