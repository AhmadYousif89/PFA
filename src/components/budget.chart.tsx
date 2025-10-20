"use client";

import { PieChart, Pie, Cell } from "recharts";

import { Budget } from "@/lib/types";
import { chartConfig } from "@/lib/config";
import { ChartContainer, ChartTooltip } from "./ui/chart";
import { formatCurrency } from "@/lib/utils";

type BudgetChartProps = {
  budgets: Budget[];
  total: number;
  maximum: number;
};

export const BudgetChart = ({ budgets, total, maximum }: BudgetChartProps) => {
  return (
    <div className="isolate grid max-h-[280px] grow items-center justify-center">
      {/* Center text */}
      <div className="z-20 col-end-1 row-end-1 flex flex-col items-center gap-2 place-self-center">
        <span className={`text-xl font-bold ${total > maximum ? "text-destructive" : ""}`}>
          {formatCurrency(total, { maximumFractionDigits: 0 })}
        </span>
        <p className="text-muted-foreground text-xs">of {formatCurrency(maximum)} limit</p>
      </div>
      {/* Inner ring */}
      <span className="bg-background/25 z-10 col-end-1 row-end-1 size-47 place-self-center rounded-full" />
      {/* Chart */}
      <ChartContainer
        config={chartConfig}
        className="col-end-1 row-end-1 aspect-square min-h-60 max-w-61.75"
      >
        <PieChart className="relative h-full w-full">
          <Pie
            data={budgets}
            cx="50%"
            cy="50%"
            dataKey="maximum"
            innerRadius={80}
            outerRadius={120}
            startAngle={90}
            endAngle={-450}
            animationBegin={100}
            animationDuration={1500}
          >
            {budgets.map((entry, index) => (
              <Cell key={`outer-cell-${index}`} fill={entry.theme} />
            ))}
          </Pie>
          <ChartTooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const { category, maximum, theme } = payload[0].payload;
                return (
                  <div
                    style={{ backgroundColor: theme }}
                    className="bg-popover text-card border-muted rounded-full border px-4 py-2 font-bold capitalize shadow"
                  >
                    <p>{`${category}: $${maximum}`}</p>
                  </div>
                );
              }
              return null;
            }}
          />
        </PieChart>
      </ChartContainer>
    </div>
  );
};
