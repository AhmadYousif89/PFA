"use client";
import { useRef } from "react";

import {
  Dialog,
  DialogDescription,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";

import { Budget } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { deleteBudgetAction } from "../_actions/delete";
import { ActionButton } from "@/components/action.button";

import CloseIcon from "public/assets/images/icon-close-modal.svg";
import { FormWithActionState } from "@/components/action-state.form";
import { getCategoryLabel } from "@/lib/config";

type DeleteBudgetModalProps = {
  budget: Budget;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const initialState = {
  success: false,
  message: "",
};

export const DeleteBudgetModal = ({ budget, open, onOpenChange }: DeleteBudgetModalProps) => {
  const closeDialogRef = useRef<HTMLButtonElement | null>(null);

  const categoryLabel = getCategoryLabel(budget.category);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:min-w-card md:p-8">
        <DialogHeader className="flex-row items-center justify-between">
          <DialogTitle className="text-lg font-bold md:text-xl">
            Delete ‘{categoryLabel}’
          </DialogTitle>
          <Button variant="ghost" size="icon" className="rounded-full" asChild>
            <DialogClose ref={closeDialogRef}>
              <span className="sr-only">Close Modal</span>
              <CloseIcon className="size-fit" />
            </DialogClose>
          </Button>
        </DialogHeader>
        <DialogDescription>
          Are you sure you want to delete this budget? This action cannot be reversed, and all the
          data inside it will be removed forever.
        </DialogDescription>

        <FormWithActionState
          action={(state) => deleteBudgetAction(state, budget.id)}
          initialState={initialState}
          closeDialogRef={closeDialogRef}
        >
          <ActionButton type="submit" variant="destructive" className="min-h-13 text-sm font-bold">
            Yes, Confirm Deletion
          </ActionButton>
          <Button
            asChild
            size="auto"
            type="button"
            variant="ghost"
            className="text-muted-foreground p-2"
          >
            <DialogClose>No, I want to go back</DialogClose>
          </Button>
        </FormWithActionState>
      </DialogContent>
    </Dialog>
  );
};
