"use client";

import { Card } from "@/components/ui/card";
import { DataTable } from "@/components/data.table";
import { DataTableToolbar } from "@/components/data.table.toolbar";

import { columns } from "./bills.columns";
import { TransactionWithPaymentStatus } from "@/lib/types";
import { useDataTable } from "@/hooks/use-data-table";

type BillsTableProps = {
  data: TransactionWithPaymentStatus[];
};

export const BillsTable = ({ data }: BillsTableProps) => {
  const table = useDataTable(data, columns);

  return (
    <Card className="grow px-5 md:p-8 xl:min-h-[742px] xl:basis-[67.314%]">
      <DataTableToolbar hideCategoryFilter />
      <DataTable table={table} columns={columns} />
    </Card>
  );
};
