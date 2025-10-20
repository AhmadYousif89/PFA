import Link from "next/link";

import { formatCurrency } from "@/lib/utils";
import { calcTotalPots, getPots } from "@/app/shared-data/pots";

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";
import { Button } from "@/components/ui/button";

import PotIcon from "public/assets/images/icon-pot.svg";
import PotNavIcon from "public/assets/images/icon-nav-pots.svg";

export const PotsSummary = async () => {
  const pots = await getPots({ limit: 4 });
  const total = calcTotalPots(pots);

  if (pots.length === 0) {
    return (
      <Empty className="p-0">
        <EmptyHeader>
          <PotNavIcon className="size-fit" />
          <EmptyTitle>No Pots Yet</EmptyTitle>
          <EmptyDescription>
            Create pots to set money aside for specific goals or expenses.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button asChild>
            <Link href="/dashboard/pots">Manage Pots</Link>
          </Button>
        </EmptyContent>
      </Empty>
    );
  }

  const totalFormated = formatCurrency(total, { minimumFractionDigits: 0 });

  return (
    <div className="flex flex-col gap-5 @lg/card-content:flex-row">
      <div className="bg-accent rounded-12 flex flex-col justify-center px-4 py-5 @lg/card-content:basis-61.75">
        <div className="flex items-center gap-4">
          <div className="flex size-10 items-center justify-center">
            <PotIcon />
          </div>
          <div className="flex max-w-60 flex-col gap-2.75 truncate">
            <h3 className="text-muted-foreground text-left text-sm">Total Saved</h3>
            <span className="truncate text-xl font-bold" title={totalFormated}>
              {totalFormated}
            </span>
          </div>
        </div>
      </div>
      <ul className="grid grow grid-cols-2 place-content-start gap-4">
        {pots.map((pot) => (
          <li key={pot.name} className="flex items-center gap-4">
            <span
              style={{ backgroundColor: pot.theme }}
              className="aspect-square h-full w-1 rounded"
            />
            <div className="flex flex-col gap-1 overflow-hidden">
              <span className="text-muted-foreground truncate text-xs">{pot.name}</span>
              <span className="text-base font-bold">
                {formatCurrency(pot.total, { minimumFractionDigits: 0 })}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
