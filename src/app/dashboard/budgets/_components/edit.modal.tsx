"use client";
import { Fragment, useRef } from "react";

import { editBudgetAction } from "../_actions/update";
import { MaxSpendingInput } from "./spending.input";
import CloseIcon from "public/assets/images/icon-close-modal.svg";

import { themeColors } from "@/lib/config";
import { cn, getThemeKey } from "@/lib/utils";
import { Budget, ThemeColor } from "@/lib/types";
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
import { UserCategory } from "@/app/(auth)/_lib/types";

type EditBudgetProps = {
  budget: Budget;
  selectedThemes: ThemeColor[];
  selectedCategories: string[];
  availableCategories: UserCategory[];
  onOpenChange: (open: boolean) => void;
  open: boolean;
};

const initialState = {
  success: false,
  message: "",
};

export const EditBudgetModal = ({
  budget,
  open,
  onOpenChange,
  selectedThemes,
  selectedCategories,
  availableCategories,
}: EditBudgetProps) => {
  const { onTouchEnd, onInteractOutside } = useBlockOutsideInteractionOnTouch();
  const closeDialogRef = useRef<HTMLButtonElement | null>(null);
  const actualThemeColor = getThemeKey(budget.theme);

  const updateActionWrapper = (prevState: unknown, formData: FormData) => {
    formData.set("budget-id", budget.id);
    return editBudgetAction(prevState, formData);
  };

  const slug = budget.category;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent onInteractOutside={onInteractOutside} className="sm:min-w-card md:p-8">
        <DialogHeader className="flex-row items-center justify-between">
          <DialogTitle className="text-lg font-bold md:text-xl">Edit Budget</DialogTitle>
          <Button variant="ghost" size="icon" className="rounded-full" asChild>
            <DialogClose ref={closeDialogRef}>
              <span className="sr-only">Close Modal</span>
              <CloseIcon className="size-fit" />
            </DialogClose>
          </Button>
        </DialogHeader>
        <DialogDescription>
          As your budgets change, feel free to update your spending limits.
        </DialogDescription>

        <FormWithActionState
          action={updateActionWrapper}
          initialState={initialState}
          closeDialogRef={closeDialogRef}
        >
          <fieldset className="flex flex-col gap-1">
            <Label
              htmlFor="edit-budget-category"
              className="text-muted-foreground text-xs font-bold"
            >
              Budget Category
            </Label>
            <Select name="category" defaultValue={slug}>
              <SelectTrigger
                id="edit-budget-category"
                className="min-h-11.5 w-full gap-4 px-5 py-3 [&_small]:hidden"
              >
                <SelectValue placeholder="Select Category" defaultValue={slug} />
              </SelectTrigger>
              <SelectContent onTouchEnd={onTouchEnd}>
                {availableCategories.map((category) => {
                  const slug = category.slug;
                  const isUsed = selectedCategories.includes(slug);

                  if (isUsed) {
                    return (
                      <Fragment key={slug}>
                        <SelectItem
                          disabled
                          value={slug}
                          className={cn(budget.category === slug && "bg-accent")}
                        >
                          <span>{category.label}</span>
                          <small
                            className={cn(
                              "absolute right-2 text-xs",
                              budget.category === slug ? "bg-accent" : "bg-transparent",
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
                    <Fragment key={slug}>
                      <SelectItem value={slug}>
                        <span>{category.label}</span>
                      </SelectItem>
                      <SelectSeparator className="last:hidden" />
                    </Fragment>
                  );
                })}
              </SelectContent>
            </Select>
          </fieldset>

          <fieldset className="flex flex-col gap-1">
            <Label htmlFor="edit-max-spend" className="text-muted-foreground text-xs font-bold">
              Maximum Spend
            </Label>
            <MaxSpendingInput id="edit-max-spend" defaultValue={budget.maximum} name="maximum" />
          </fieldset>

          <fieldset className="flex flex-col gap-1">
            <Label htmlFor="edit-budget-theme" className="text-muted-foreground text-xs font-bold">
              Theme
            </Label>
            <Select name="theme" defaultValue={actualThemeColor}>
              <SelectTrigger
                id="edit-budget-theme"
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
                          className={cn(budget.theme === value && "bg-accent")}
                        >
                          <span
                            className="size-4 rounded-full"
                            style={{ backgroundColor: value }}
                          />
                          <span>{key}</span>
                          <small
                            className={cn(
                              "absolute right-2 text-xs",
                              budget.theme === value ? "bg-accent" : "bg-transparent",
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
