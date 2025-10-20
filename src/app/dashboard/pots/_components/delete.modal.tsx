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

import { Pot } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { deletePotAction } from "../_actions/delete";
import { ActionButton } from "@/components/action.button";

import CloseIcon from "public/assets/images/icon-close-modal.svg";
import { FormWithActionState } from "@/components/action-state.form";

type DeletePotModalProps = {
  pot: Pot;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const initialState = {
  success: false,
  message: "",
};

export const DeletePotModal = ({ pot, open, onOpenChange }: DeletePotModalProps) => {
  const closeDialogRef = useRef<HTMLButtonElement | null>(null);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:min-w-card md:p-8">
        <DialogHeader className="flex-row items-center justify-between overflow-hidden">
          <DialogTitle className="flex truncate text-lg font-bold md:text-xl">
            Delete ‘<span className="truncate">{pot.name}</span>’
          </DialogTitle>
          <Button variant="ghost" size="icon" className="rounded-full" asChild>
            <DialogClose ref={closeDialogRef}>
              <span className="sr-only">Close Modal</span>
              <CloseIcon className="size-fit" />
            </DialogClose>
          </Button>
        </DialogHeader>
        <DialogDescription>
          Are you sure you want to delete this pot? This action cannot be reversed, and all the data
          inside it will be removed forever.
        </DialogDescription>

        <FormWithActionState
          action={(state) => deletePotAction(state, pot.id)}
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
