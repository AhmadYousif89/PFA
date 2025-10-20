"use client";
import { Fragment, useRef } from "react";

import { PotNameInput } from "./name.input";
import { PotTargetInput } from "./target.input";
import { editPotAction } from "../_actions/update";

import { themeColors } from "@/lib/config";
import { Pot, ThemeColor } from "@/lib/types";
import { cn, getThemeKey } from "@/lib/utils";
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
  DialogDescription,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { FormWithActionState } from "@/components/action-state.form";
import { ActionButton } from "@/components/action.button";

import CloseIcon from "public/assets/images/icon-close-modal.svg";

type EditPotProps = {
  pot: Pot;
  selectedThemes: ThemeColor[];
  onOpenChange: (open: boolean) => void;
  open: boolean;
};

const initialState = {
  success: false,
  message: "",
};

export const EditPotModal = ({ pot, open, onOpenChange, selectedThemes }: EditPotProps) => {
  const { onTouchEnd, onInteractOutside } = useBlockOutsideInteractionOnTouch();
  const closeDialogRef = useRef<HTMLButtonElement | null>(null);
  const actualThemeColor = getThemeKey(pot.theme);

  const updateActionWrapper = (prevState: unknown, formData: FormData) => {
    formData.set("pot-id", pot.id);
    return editPotAction(prevState, formData);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onInteractOutside={onInteractOutside} className="sm:min-w-card md:p-8">
        <DialogHeader className="flex-row items-center justify-between">
          <DialogTitle className="text-lg font-bold md:text-xl">Edit Pot</DialogTitle>
          <Button variant="ghost" size="icon" className="rounded-full" asChild>
            <DialogClose ref={closeDialogRef}>
              <span className="sr-only">Close Modal</span>
              <CloseIcon className="size-fit" />
            </DialogClose>
          </Button>
        </DialogHeader>
        <DialogDescription>
          As your pots change, feel free to update your spending limits.
        </DialogDescription>

        <FormWithActionState
          action={updateActionWrapper}
          initialState={initialState}
          closeDialogRef={closeDialogRef}
        >
          <fieldset className="flex flex-col gap-1">
            <Label htmlFor="edit-pot-name" className="text-muted-foreground text-xs font-bold">
              Pot Name
            </Label>
            <PotNameInput name="name" id="edit-pot-name" defaultValue={pot.name} />
          </fieldset>

          <fieldset className="flex flex-col gap-1">
            <Label htmlFor="edit-pot-target" className="text-muted-foreground text-xs font-bold">
              Target
            </Label>
            <PotTargetInput name="target" id="edit-pot-target" defaultValue={pot.target} required />
          </fieldset>

          <fieldset className="flex flex-col gap-1">
            <Label htmlFor="edit-pot-theme" className="text-muted-foreground text-xs font-bold">
              Theme
            </Label>
            <Select name="theme" defaultValue={actualThemeColor}>
              <SelectTrigger
                id="edit-pot-theme"
                className="min-h-11.5 w-full gap-4 px-5 py-3 [&_small]:hidden"
              >
                <SelectValue placeholder="Choose Color" defaultValue={actualThemeColor} />
              </SelectTrigger>
              <SelectContent onTouchEnd={onTouchEnd}>
                {Object.entries(themeColors).map(([key, value]) => {
                  if (selectedThemes.includes(value)) {
                    return (
                      <Fragment key={key}>
                        <SelectItem
                          disabled
                          value={key}
                          className={cn(pot.theme === value && "bg-accent")}
                        >
                          <span
                            className="size-4 rounded-full"
                            style={{ backgroundColor: value }}
                          />
                          <span>{key}</span>
                          <small
                            className={cn(
                              "absolute right-2 text-xs",
                              pot.theme === value ? "bg-accent" : "bg-transparent",
                            )}
                          >
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

          <ActionButton type="submit" className="mt-1 min-h-13 w-full">
            Save Changes
          </ActionButton>
        </FormWithActionState>
      </DialogContent>
    </Dialog>
  );
};
