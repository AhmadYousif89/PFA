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
import { depositToPotAction } from "../_actions/deposit";
import CloseIcon from "public/assets/images/icon-close-modal.svg";

type PotCardProps = {
  pot: Pot;
};

export const DepositPotModal = ({ pot }: PotCardProps) => {
  const closeDialogRef = useRef<HTMLButtonElement | null>(null);
  const [newAmount, setNewAmount] = useState(0);

  const actionWrapper = (prevState: unknown, formData: FormData) => {
    formData.append("pot-id", pot.id.toString());
    return depositToPotAction(prevState, formData);
  };

  const handleAmountChange = useCallback((value: string) => {
    const numericValue = parseFloat(value) || 0;
    const amount = numericValue < 0 ? 0 : numericValue;
    setNewAmount(amount);
  }, []);

  const newPotTotal = pot.total + newAmount;
  // If the new total exceeds the target, update the effective target
  const effectiveTarget = Math.max(pot.target, newPotTotal);
  const remainingPercentage =
    effectiveTarget && pot.total ? Math.min((pot.total / effectiveTarget) * 100, 100) : 0;
  const addedTotalPercentage =
    effectiveTarget && newAmount ? Math.min((newAmount / effectiveTarget) * 100, 100) : 0;
  const exceedsTarget = newPotTotal > pot.target;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          className="hover:bg-background hover:border-border min-h-13.5 border border-transparent text-sm font-bold"
        >
          + Add Money
        </Button>
      </DialogTrigger>
      <DialogContent className="gap-5">
        <DialogHeader className="flex-row items-center justify-between gap-2 overflow-hidden">
          <DialogTitle
            title={"Add Money to " + pot.name}
            className="flex items-center truncate text-lg font-bold md:text-xl"
          >
            Add Money to ‘<span className="truncate">{pot.name}</span>’
          </DialogTitle>
          <Button type="button" variant="ghost" size="icon" className="rounded-full" asChild>
            <DialogClose ref={closeDialogRef}>
              <span className="sr-only">Close Modal</span>
              <CloseIcon className="size-fit" />
            </DialogClose>
          </Button>
        </DialogHeader>

        <DialogDescription>
          Add money to your pot to help you reach your savings goals. You can add any amount you
          like.
        </DialogDescription>

        <section className="flex flex-col gap-4 overflow-hidden pb-1">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground text-sm">New Amount</span>
            <h3 className="max-w-[50dvw] overflow-x-auto text-xl font-bold">
              {formatCurrency(newPotTotal)}
            </h3>
          </div>
          <div className="flex flex-col gap-3">
            <div
              className={cn(
                "bg-accent flex min-h-2 items-center overflow-hidden rounded-full rounded-r-none",
                Math.round(remainingPercentage) > 0 ? "gap-1" : "gap-0",
              )}
            >
              <div
                className="bg-accent-foreground h-full"
                style={{ width: `${remainingPercentage}%` }}
              />
              <div
                className={cn(
                  "h-full rounded-full transition-[width] duration-500",
                  Math.round(remainingPercentage) > 0 ? "rounded-l-none" : "rounded-full",
                )}
                style={{
                  width: `${addedTotalPercentage}%`,
                  backgroundColor: pot.theme,
                }}
              />
            </div>
            <div className="text-muted-foreground flex items-center justify-between text-xs">
              <span className="font-bold">
                {(addedTotalPercentage + remainingPercentage).toFixed(2)}%
              </span>
              <span>Target of {formatCurrency(pot.target)}</span>
            </div>
          </div>
          {exceedsTarget && (
            <div className="bg-accent animate-slide-up -z-10 rounded-md p-3 shadow-xs">
              <p className="text-muted-foreground text-xs font-medium">
                Adding this amount will exceed your current target and it will be updated
                automatically to be{" "}
                <span className="text-green font-bold">{formatCurrency(effectiveTarget)}</span>.
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
            <Label className="text-muted-foreground text-xs font-bold" htmlFor="deposit-input">
              Amount to Add
            </Label>
            <PotTargetInput
              required
              id="deposit-input"
              name="deposit"
              defaultValue={newAmount ? newAmount : ""}
              onValueChange={handleAmountChange}
            />
          </fieldset>
          <ActionButton type="submit" className="min-h-13.5">
            Confirm Deposit
          </ActionButton>
        </FormWithActionState>
      </DialogContent>
    </Dialog>
  );
};
