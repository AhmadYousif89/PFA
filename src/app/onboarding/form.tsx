"use client";

import { useState } from "react";

import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ActionButton } from "@/components/action.button";

import { initializeUserBalance } from "./actions";
import TrendingUpIcon from "public/assets/images/icon-chart.svg";
import { authClient } from "../(auth)/_lib/auth.client";
import { FormWithActionState } from "@/components/action-state.form";

type FieldKey = "currentBalance" | "monthlyIncome";
type FormState = Record<FieldKey, { value: string; error?: string }>;

export const FinancialProfileSetup = () => {
  const [form, setForm] = useState<FormState>({
    currentBalance: { value: "" },
    monthlyIncome: { value: "" },
  });
  const [isCanceling, setIsCanceling] = useState(false);

  const handleChange = (field: FieldKey) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [field]: { value: e.target.value, error: undefined },
    });
  };

  const deleteAccount = async () => {
    setIsCanceling(true);
    const res = await authClient.deleteUser();
    if (res.error) {
      console.error("Error deleting account:", res.error);
      setIsCanceling(false);
    } else {
      window.location.href = "/";
    }
  };

  return (
    <div className="flex w-full grow flex-col gap-8">
      <div className="flex flex-col items-start gap-2">
        <h1 className="text-foreground text-lg font-bold lg:text-xl">
          Let&apos;s set up your financial profile
        </h1>
        <p className="text-muted-foreground text-sm">
          Help us understand your financial baseline. This information will be used to provide
          personalized insights and recommendations.
        </p>
      </div>

      <FormWithActionState
        action={initializeUserBalance}
        initialState={{
          message: "",
          success: false,
          error: { current: undefined, income: undefined },
        }}
        className="flex flex-col gap-4"
      >
        {/* Current Balance Card */}
        <Card className="border-border/50 bg-card/75 hover:border-primary/30 rounded-xl border p-8 shadow-sm transition-colors">
          <div className="flex items-start gap-4">
            <span className="bg-primary/10 text-primary flex aspect-square size-12 items-center justify-center rounded-full text-lg">
              $
            </span>
            <div className="flex flex-col gap-2">
              <Label htmlFor="currentBalance" className="text-foreground text-lg font-semibold">
                Current Balance
              </Label>
              <p className="text-muted-foreground text-sm">
                Enter your total available balance across all accounts
              </p>
            </div>
          </div>
          <div className="relative">
            <span className="text-muted-foreground absolute top-1/2 left-4 -translate-y-1/2 font-medium">
              $
            </span>
            <Input
              required
              type="text"
              name="current"
              id="currentBalance"
              inputMode="decimal"
              placeholder="0.00"
              value={form.currentBalance.value}
              onChange={handleChange("currentBalance")}
              aria-invalid={!!form.currentBalance.error}
              className="pr-4 pl-10"
            />
          </div>
          {form.currentBalance.error && (
            <p className="text-destructive text-sm">{form.currentBalance.error}</p>
          )}
        </Card>
        {/* Monthly Income Card */}
        <Card className="border-border/50 bg-card/75 hover:border-primary/30 rounded-xl border p-8 shadow-sm transition-colors">
          <div className="flex items-start gap-4">
            <span className="bg-primary/10 text-primary flex aspect-square size-12 items-center justify-center rounded-full text-lg">
              <TrendingUpIcon className="fill-primary size-fit" />
            </span>
            <div className="flex flex-col gap-2">
              <Label htmlFor="monthlyIncome" className="text-foreground text-lg font-semibold">
                Monthly Income
              </Label>
              <p className="text-muted-foreground text-sm">
                Your typical monthly income after taxes
              </p>
            </div>
          </div>
          <div className="relative">
            <span className="text-muted-foreground absolute top-1/2 left-4 -translate-y-1/2 font-medium">
              $
            </span>
            <Input
              required
              type="text"
              name="income"
              id="monthlyIncome"
              inputMode="decimal"
              placeholder="0.00"
              value={form.monthlyIncome.value}
              onChange={handleChange("monthlyIncome")}
              aria-invalid={!!form.monthlyIncome.error}
              className="pr-4 pl-10"
            />
          </div>
          {form.monthlyIncome.error && (
            <p className="text-destructive text-sm">{form.monthlyIncome.error}</p>
          )}
        </Card>
        {/* Info Box */}
        <div className="bg-muted/75 border-primary/20 rounded-xl border p-6">
          <p className="text-muted-foreground text-xs leading-relaxed">
            <span className="text-orange font-semibold">Privacy Note:</span> Your financial
            information is encrypted and secure. We use this data solely to provide you with
            personalized experiences and insights.
          </p>
        </div>
        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-4 pt-4">
          <ActionButton
            shouldAlert
            variant="destructive"
            alertTitel="Cancel Account Setup"
            alertDescription="Are you sure you want to cancel the setup? Your progress will not be saved."
            performAction={deleteAccount}
            externalLoading={isCanceling}
            disabled={isCanceling}
            className="min-h-10"
          >
            Cancel
          </ActionButton>
          <ActionButton size="lg" type="submit" className="shadow-primary/25 min-w-40 shadow-lg">
            Complete Setup
          </ActionButton>
        </div>
      </FormWithActionState>
    </div>
  );
};
