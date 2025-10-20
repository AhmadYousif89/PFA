import { useState } from "react";

import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Section } from "@/components/ui/section";
import { Spinner } from "@/components/ui/spinner";

import TrendingUpIcon from "public/assets/images/icon-chart.svg";

type Props = {
  stashData: {
    current: number | undefined;
    income: number | undefined;
  };
  isVisible: boolean;
  onBack: () => void;
  onComplete: (info: { current: number; monthlyIncome: number }) => void;
  onScrollToNext?: () => void;
};
type FieldKey = "currentBalance" | "monthlyIncome";
type FormState = Record<FieldKey, { value: string; error?: string }>;

export const FinancialInfoSection = ({ isVisible, onBack, onComplete, stashData }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState<FormState>({
    currentBalance: { value: String(stashData.current || "") },
    monthlyIncome: { value: String(stashData.income || "") },
  });

  const validateAndSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isLoading) return;
    setIsLoading(true);
    const balance = Number.parseFloat(form.currentBalance.value);
    const income = Number.parseFloat(form.monthlyIncome.value);

    let hasError = false;
    const next: FormState = {
      ...form,
      currentBalance: { ...form.currentBalance, error: undefined },
      monthlyIncome: { ...form.monthlyIncome, error: undefined },
    };

    if (!form.currentBalance.value || isNaN(balance)) {
      next.currentBalance.error = "Please enter a valid amount";
      hasError = true;
    }

    if (!form.monthlyIncome.value || isNaN(income)) {
      next.monthlyIncome.error = "Please enter a valid amount";
      hasError = true;
    }

    if (hasError) {
      setForm(next);
      setIsLoading(false);
      return;
    }

    onComplete({
      current: balance,
      monthlyIncome: income,
    });
  };

  const formatCurrency = (value: string) => {
    // Remove non-numeric characters except decimal point
    const cleaned = value.replace(/[^\d.]/g, "");
    // Ensure only one decimal point
    const parts = cleaned.split(".");
    if (parts.length > 2) {
      return parts[0] + "." + parts.slice(1).join("");
    }
    return cleaned;
  };

  const handleChange = (key: FieldKey) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCurrency(e.target.value);
    setForm((prev) => ({
      ...prev,
      [key]: { ...prev[key], value: formatted, error: undefined },
    }));
  };

  return (
    <Section
      id="financial-info"
      data-section="financial"
      title="Financial Overview"
      description="Help us understand your financial baseline. This information will be used to provide personalized insights and recommendations."
      onBack={onBack}
      className={cn(
        isVisible
          ? "visible translate-y-0 opacity-100 delay-500"
          : "pointer-events-none invisible -translate-y-24 opacity-0 delay-0",
      )}
    >
      <form className="space-y-8" onSubmit={validateAndSubmit}>
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
              id="currentBalance"
              type="text"
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
              id="monthlyIncome"
              type="text"
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
        <div className="flex justify-end gap-4 pt-4">
          <Button
            type="button"
            variant="outline"
            size="lg"
            onClick={onBack}
            className="bg-transparent px-8"
          >
            Back
          </Button>
          <Button
            size="lg"
            type="submit"
            disabled={isLoading}
            className="shadow-primary/25 min-w-40 shadow-lg"
          >
            {isLoading ? (
              <span className="text-primary-foreground flex items-center gap-2">
                <Spinner className="fill-primary-foreground size-6" />
                Proccessing
              </span>
            ) : (
              <span>Complete Setup</span>
            )}
          </Button>
        </div>
      </form>
    </Section>
  );
};
