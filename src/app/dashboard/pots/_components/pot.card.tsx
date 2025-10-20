import { Pot, ThemeColor } from "@/lib/types";
import { formatCurrency } from "@/lib/utils";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { WithdrawMoneyModal } from "./withdrawal.modal";
import { DepositPotModal } from "./deposit.modal";
import { PotDropdownMenu } from "./pot.menu";

type PotCardProps = {
  pot: Pot;
  selectedThemes: ThemeColor[];
};

export const PotCard = ({ pot, selectedThemes }: PotCardProps) => {
  const remainingPercentage =
    pot.total && pot.target ? Math.min((pot.total / pot.target) * 100, 100).toFixed(2) : 0;

  return (
    <Card className="relative grid min-h-79.25 gap-8 overflow-hidden lg:py-8">
      <CardHeader className="rounded-t-12 flex items-center justify-between md:px-6 lg:px-8">
        <CardTitle className="flex items-center gap-4 truncate" title={pot.name}>
          <span
            aria-hidden
            style={{ backgroundColor: pot.theme }}
            className="aspect-square size-4 rounded-full"
          />
          <h2 className="truncate text-lg font-bold">{pot.name}</h2>
        </CardTitle>
        <CardAction className="flex items-center self-center">
          <PotDropdownMenu pot={pot} selectedThemes={selectedThemes} />
        </CardAction>
      </CardHeader>

      <CardContent className="flex flex-col gap-5 md:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-sm">Total Saved</span>
          <span className="text-xl font-bold">
            {formatCurrency(pot.total, { maximumFractionDigits: 2 })}
          </span>
        </div>
        <div className="flex flex-col gap-2">
          <div className="bg-accent relative overflow-hidden rounded">
            <div
              style={
                {
                  backgroundColor: pot.theme,
                  "--to-width": `${remainingPercentage}%`,
                  width: `${remainingPercentage}%`,
                } as React.CSSProperties
              }
              className="animate-expand-left h-2 origin-left rounded"
            />
          </div>
          <div className="text-muted-foreground flex items-center justify-between gap-4">
            <span className="text-xs font-bold">{remainingPercentage}%</span>
            <span className="text-xs">
              Target of {formatCurrency(pot.target, { maximumFractionDigits: 3 })}
            </span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between gap-4 *:shrink *:basis-1/2 md:px-6 lg:px-8">
        <DepositPotModal pot={pot} />
        <WithdrawMoneyModal pot={pot} />
      </CardFooter>
    </Card>
  );
};
