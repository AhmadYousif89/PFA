import { formatCurrency } from "@/lib/utils";
import { getBillsSummary } from "@/app/shared-data/bills";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";

import BillIcon from "public/assets/images/icon-nav-recurring-bills.svg";

type Props = {
  nowIso: string;
  count: number;
};

export const BillsSummary = async ({ nowIso, count }: Props) => {
  if (count === 0) {
    return (
      <Empty className="p-0">
        <EmptyHeader>
          <BillIcon className="size-fit" />
          <EmptyTitle>No Bills Yet</EmptyTitle>
          <EmptyDescription>
            Recurring bills are driven by your transactions. Marking transactions as recurring bills
            will help you manage your upcoming expenses.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  const bills = await getBillsSummary(nowIso);

  return (
    <ul className="space-y-3">
      {bills.map((bill) => (
        <li
          key={bill.id}
          style={{ borderColor: bill.theme }}
          className="bg-accent flex items-center justify-between rounded-md border-l-4 px-4 py-5 text-sm"
        >
          <h3 className="text-muted-foreground">{bill.name}</h3>
          <p className="font-bold">{formatCurrency(bill.amount)}</p>
        </li>
      ))}
    </ul>
  );
};
