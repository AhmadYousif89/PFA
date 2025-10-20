"use client";

import Image from "next/image";
import { Fragment, useRef, useState } from "react";

import { createTransactionAction } from "../actions/create";
import { budgetCategories, getCategoryLabel } from "@/lib/config";
import { useBlockOutsideInteractionOnTouch } from "@/hooks/use-block-outside-interaction";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectValue,
  SelectItem,
  SelectSeparator,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormWithActionState } from "@/components/action-state.form";
import { ActionButton } from "@/components/action.button";
import { Checkbox } from "@/components/ui/checkbox";
import { TransactionNameInput } from "./name.input";
import { TransactionAmountInput } from "./amount.input";

import PlusIcon from "public/assets/images/icon-plus.svg";
import BillIcon from "public/assets/images/icon-bill-due.svg";
import CloseIcon from "public/assets/images/icon-close-modal.svg";

const initialState = {
  success: false,
  message: "",
};

type Props = { avatars: string[] };

export const TransactionCreationModal = ({ avatars }: Props) => {
  const closeDialogRef = useRef<HTMLButtonElement | null>(null);
  const { onTouchEnd, onInteractOutside } = useBlockOutsideInteractionOnTouch();
  const [selectedCategory, setSelectedCategory] = useState(budgetCategories[0]);

  const today = new Date().toISOString().split("T")[0];
  const isBillsCategory = selectedCategory === "bills";

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="h-12 max-sm:w-16 max-sm:gap-1 max-sm:p-0 sm:h-14">
          <PlusIcon className="fill-primary-foreground" />
          <span>
            Add <span className="hidden sm:inline-flex">Transaction</span>
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent onInteractOutside={onInteractOutside} className="sm:max-w-card">
        <DialogHeader className="flex-row items-center justify-between">
          <DialogTitle className="text-lg font-bold md:text-xl">Add New Transaction</DialogTitle>
          <Button variant="ghost" size="icon" className="rounded-full" asChild>
            <DialogClose ref={closeDialogRef}>
              <span className="sr-only">Close Modal</span>
              <CloseIcon className="size-fit" />
            </DialogClose>
          </Button>
        </DialogHeader>
        <DialogDescription>
          Fill in the details below to add a new transaction to your account.
        </DialogDescription>

        <FormWithActionState
          action={createTransactionAction}
          initialState={initialState}
          closeDialogRef={closeDialogRef}
        >
          <div className="flex items-center gap-4">
            <fieldset className="flex flex-col gap-1">
              <Label
                htmlFor="transaction-avatar"
                className="text-muted-foreground text-xs font-bold"
              >
                Avatar
              </Label>
              <Select name="avatar" defaultValue={avatars[0]}>
                <SelectTrigger
                  showIcon={false}
                  id="transaction-avatar"
                  className="aspect-square min-h-11.5 w-16 justify-center gap-4"
                >
                  <SelectValue placeholder="Select Avatar" />
                </SelectTrigger>
                <SelectContent
                  onTouchEnd={onTouchEnd}
                  ViewportclassNames="p-1"
                  className="w-16.5 min-w-auto p-0"
                >
                  {avatars.map((avatar) => (
                    <Fragment key={avatar}>
                      <SelectItem
                        showItemIndicator={false}
                        value={avatar}
                        className="cursor-pointer justify-center"
                      >
                        <Image
                          src={`/assets/images/avatars/${avatar}`}
                          alt={avatar}
                          width={32}
                          height={32}
                          className="rounded-full"
                        />
                      </SelectItem>
                      <SelectSeparator className="last:hidden" />
                    </Fragment>
                  ))}
                </SelectContent>
              </Select>
            </fieldset>
            <fieldset className="flex basis-full flex-col gap-1">
              <Label htmlFor="transaction-name" className="text-muted-foreground text-xs font-bold">
                Transaction Name
              </Label>
              <TransactionNameInput />
            </fieldset>
          </div>

          <fieldset className="flex flex-col gap-1">
            <Label
              htmlFor="transaction-category"
              className="text-muted-foreground text-xs font-bold"
            >
              Category
            </Label>
            <Select
              required
              name="category"
              defaultValue={budgetCategories[0]}
              onValueChange={(v) => setSelectedCategory(v as (typeof budgetCategories)[number])}
            >
              <SelectTrigger
                id="transaction-category"
                className="min-h-11.5 w-full gap-4 px-5 py-3"
              >
                <SelectValue placeholder="Select Category" />
              </SelectTrigger>
              <SelectContent onTouchEnd={onTouchEnd}>
                {budgetCategories.map((category) => (
                  <Fragment key={category}>
                    <SelectItem value={category}>
                      <span>{getCategoryLabel(category)}</span>
                    </SelectItem>
                    <SelectSeparator className="last:hidden" />
                  </Fragment>
                ))}
              </SelectContent>
            </Select>
          </fieldset>

          <fieldset className="flex flex-col gap-1">
            <Label htmlFor="transaction-amount" className="text-muted-foreground text-xs font-bold">
              Amount
            </Label>
            <TransactionAmountInput />
          </fieldset>

          <fieldset className="flex flex-col gap-1">
            <Label htmlFor="transaction-date" className="text-muted-foreground text-xs font-bold">
              Date
            </Label>
            <Input
              required
              id="transaction-date"
              name="date"
              type="date"
              defaultValue={today}
              className="border-border min-h-11.5"
            />
          </fieldset>

          <fieldset className="mt-2 flex flex-wrap justify-between gap-x-3 gap-y-1">
            <div className="flex items-center gap-3">
              <Checkbox
                id="recurring"
                name="recurring"
                className="cursor-pointer"
                disabled={!isBillsCategory}
              />
              <Label
                htmlFor="recurring"
                className={`cursor-pointer text-sm font-medium ${!isBillsCategory ? "text-muted-foreground" : ""}`}
              >
                Recurring Transaction
              </Label>
            </div>
            {!isBillsCategory && (
              <p className="text-orange flex items-center gap-1 text-xs font-medium">
                <BillIcon className="*:fill-orange size-fit" /> Only bills can be marked as
                recurring transactions
              </p>
            )}
          </fieldset>

          <ActionButton type="submit" className="mt-2 min-h-13">
            Add Transaction
          </ActionButton>
        </FormWithActionState>
      </DialogContent>
    </Dialog>
  );
};
