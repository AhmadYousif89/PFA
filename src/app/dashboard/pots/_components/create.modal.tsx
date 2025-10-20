"use client";

import { Fragment, useRef } from "react";

import { useBlockOutsideInteractionOnTouch } from "@/hooks/use-block-outside-interaction";

import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectValue,
  SelectItem,
  SelectSeparator,
} from "@/components/ui/select";
import {
  Dialog,
  DialogTrigger,
  DialogDescription,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ActionButton } from "@/components/action.button";
import { FormWithActionState } from "@/components/action-state.form";

import { ThemeColor } from "@/lib/types";
import { themeColors } from "@/lib/config";
import { PotNameInput } from "./name.input";
import { PotTargetInput } from "./target.input";
import { createPotAction } from "../_actions/create";

import PlusIcon from "public/assets/images/icon-plus.svg";
import CloseIcon from "public/assets/images/icon-close-modal.svg";

const initialState = {
  success: false,
  message: "",
};

type CreateNewPotProps = {
  selectedThemes: ThemeColor[];
};

export const PotCreationModal = ({ selectedThemes }: CreateNewPotProps) => {
  const closeDialogRef = useRef<HTMLButtonElement | null>(null);
  const { onTouchEnd, onInteractOutside } = useBlockOutsideInteractionOnTouch();

  const firstAvailableTheme = Object.keys(themeColors).find(
    (theme) => !selectedThemes.includes(themeColors[theme as keyof typeof themeColors]),
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="h-12 max-sm:w-16 max-sm:gap-1 max-sm:p-0 sm:h-14">
          <PlusIcon className="fill-primary-foreground" />
          <span>
            Add <span className="hidden sm:inline-flex">New Pot</span>
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent onInteractOutside={onInteractOutside} className="sm:min-w-card md:p-8">
        <DialogHeader className="flex-row items-center justify-between">
          <DialogTitle className="text-lg font-bold md:text-xl">Add New Pot</DialogTitle>
          <Button variant="ghost" size="icon" className="rounded-full" asChild>
            <DialogClose ref={closeDialogRef}>
              <span className="sr-only">Close Modal</span>
              <CloseIcon className="size-fit" />
            </DialogClose>
          </Button>
        </DialogHeader>
        <DialogDescription>
          Create a pot to set savings targets. These can help keep you on track as you save for
          special purchases.
        </DialogDescription>

        <FormWithActionState
          action={createPotAction}
          initialState={initialState}
          closeDialogRef={closeDialogRef}
        >
          <fieldset className="flex flex-col gap-1">
            <Label htmlFor="pot-name" className="text-muted-foreground text-xs font-bold">
              Pot Name
            </Label>
            <PotNameInput required id="pot-name" name="name" placeholder="e.g. Rainy Days" />
          </fieldset>

          <fieldset className="flex flex-col gap-1">
            <Label htmlFor="pot-target" className="text-muted-foreground text-xs font-bold">
              Target
            </Label>
            <PotTargetInput required id="pot-target" name="target" />
          </fieldset>

          <fieldset className="flex flex-col gap-1">
            <Label htmlFor="budget-theme" className="text-muted-foreground text-xs font-bold">
              Theme
            </Label>
            <Select required name="theme" defaultValue={firstAvailableTheme}>
              <SelectTrigger
                id="budget-theme"
                className="min-h-11.5 w-full gap-4 px-5 py-3 [&_small]:hidden"
              >
                <SelectValue placeholder="Choose Color" defaultValue={firstAvailableTheme} />
              </SelectTrigger>
              <SelectContent onTouchEnd={onTouchEnd}>
                {Object.entries(themeColors).map(([key, value]) => {
                  if (selectedThemes.includes(value)) {
                    return (
                      <Fragment key={key}>
                        <SelectItem value={key} disabled>
                          <span
                            className="size-4 rounded-full"
                            style={{ backgroundColor: value }}
                          />
                          <span>{key}</span>
                          <small className="bg-popover absolute right-2 text-xs">
                            Already used
                          </small>
                        </SelectItem>
                        <SelectSeparator className="last:hidden" />
                      </Fragment>
                    );
                  }
                  return (
                    <Fragment key={key}>
                      <SelectItem value={key}>
                        <span className="size-4 rounded-full" style={{ backgroundColor: value }} />
                        <span>{key}</span>
                      </SelectItem>
                      <SelectSeparator className="last:hidden" />
                    </Fragment>
                  );
                })}
              </SelectContent>
            </Select>
          </fieldset>

          <ActionButton type="submit" className="mt-1 min-h-13">
            Add Pot
          </ActionButton>
        </FormWithActionState>
      </DialogContent>
    </Dialog>
  );
};
