"use client";

import { useCallback, useRef, useState } from "react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FormWithActionState } from "@/components/action-state.form";
import { ActionButton } from "@/components/action.button";

import { Pot } from "@/lib/types";
import { cn, formatCurrency } from "@/lib/utils";
import { PotTargetInput } from "./target.input";
import { withdrawalFromPotAction } from "../_actions/withdrawal";
import CloseIcon from "public/assets/images/icon-close-modal.svg";

type PotCardProps = {
  pot: Pot;
};

export const WithdrawMoneyModal = ({ pot }: PotCardProps) => {
  const closeDialogRef = useRef<HTMLButtonElement | null>(null);
  const [newAmount, setNewAmount] = useState(0);

  const actionWrapper = (prevState: unknown, formData: FormData) => {
    formData.append("pot-id", pot.id.toString());
    return withdrawalFromPotAction(prevState, formData);
  };

  const handleAmountChange = useCallback((value: string) => {
    const numericValue = parseFloat(value) || 0;
    const amount = numericValue < 0 ? 0 : numericValue;
    setNewAmount(amount);
  }, []);

  const target = pot.target;
  const newPotTotal = Math.max(pot.total - newAmount, 0);
  const limitRange = (v: number) => Math.min(Math.max(v, 0), 100);
  const newPercentage = target > 0 ? limitRange((newPotTotal / target) * 100) : 0;

  const insufficientFunds = newAmount > pot.total;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          className="hover:bg-background hover:border-border min-h-13.5 border border-transparent text-sm font-bold"
        >
          Withdraw
        </Button>
      </DialogTrigger>
      <DialogContent className="gap-5">
        <DialogHeader className="flex-row items-center justify-between gap-2 overflow-hidden">
          <DialogTitle
            title={"Withdraw from " + pot.name}
            className="flex items-center truncate text-lg font-bold md:text-xl"
          >
            Withdraw from ‘<span className="truncate">{pot.name}</span>’
          </DialogTitle>
          <Button type="button" variant="ghost" size="icon" className="rounded-full" asChild>
            <DialogClose ref={closeDialogRef}>
              <span className="sr-only">Close Modal</span>
              <CloseIcon className="size-fit" />
            </DialogClose>
          </Button>
        </DialogHeader>

        <DialogDescription>
          Withdraw money from your pot to use for your intended purpose. You can withdraw any amount
          you like, as long as it does not exceed the total saved.
        </DialogDescription>

        <section className="flex flex-col gap-4 overflow-hidden pb-1">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-sm">New Amount</span>
            <h3 className="max-w-[50dvw] overflow-x-auto text-xl font-bold">
              {formatCurrency(newPotTotal)}
            </h3>
          </div>
          <div className="flex flex-col gap-3">
            <div className={cn("bg-accent flex min-h-2 items-center overflow-hidden rounded-full")}>
              <div
                className={
                  "bg-accent-foreground h-full rounded-full transition-[width] duration-500"
                }
                style={{ width: `${newPercentage}%`, backgroundColor: pot.theme }}
              />
            </div>
            <div className="text-muted-foreground flex items-center justify-between text-xs">
              <span className="font-bold">{newPercentage.toFixed(2)}%</span>
              <span>Target of {formatCurrency(pot.target)}</span>
            </div>
          </div>
          {insufficientFunds && (
            <div className="bg-accent animate-slide-up -z-10 rounded-md p-3 shadow-xs">
              <p className="text-red text-xs font-medium">
                You cannot withdraw more than your current pot total amount of{" "}
                {formatCurrency(pot.total)}.
              </p>
            </div>
          )}
        </section>

        <FormWithActionState
          action={actionWrapper}
          closeDialogRef={closeDialogRef}
          initialState={{ success: false, message: "" }}
          className="gap-5"
        >
          <fieldset className="flex flex-col gap-1">
            <Label className="text-muted-foreground text-xs font-bold" htmlFor="withdrawal-input">
              Amount to Withdraw
            </Label>
            <PotTargetInput
              required
              id="withdrawal-input"
              name="withdrawal"
              defaultValue={newAmount ? newAmount : ""}
              onValueChange={handleAmountChange}
            />
          </fieldset>
          <ActionButton className="min-h-13.5">Confirm Withdrawal</ActionButton>
        </FormWithActionState>
      </DialogContent>
    </Dialog>
  );
};
