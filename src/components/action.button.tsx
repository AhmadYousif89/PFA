"use client";

import { useFormStatus } from "react-dom";

import { Spinner } from "./ui/spinner";
import { Button, buttonVariants } from "./ui/button";
import type { VariantProps } from "class-variance-authority";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";

export interface ButtonWithFormStateProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loadingText?: string;
  externalLoading?: boolean;
  shouldAlert?: boolean;
  alertTitel?: string;
  alertDescription?: string;
  performAction?: () => void;
}

export const ActionButton = ({
  children,
  disabled,
  loadingText = "Processing",
  shouldAlert = false,
  performAction,
  alertTitel = "Are you sure?",
  alertDescription = "This action cannot be undone.",
  externalLoading = false,
  variant,
  onClick,
  ...props
}: ButtonWithFormStateProps) => {
  const { pending } = useFormStatus();
  const isLoading = pending || externalLoading;
  const isDisabled = disabled || isLoading;

  const LoadingContent = () => (
    <>
      <Spinner className="fill-muted size-6" />
      <span className="text-sm">{loadingText}</span>
    </>
  );

  if (!shouldAlert) {
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (isDisabled) return;
      if (performAction) {
        e.preventDefault();
        // Intentionally ignoring the promise returned by performAction
        void performAction();
      } else if (onClick) {
        onClick(e);
      }
    };

    return (
      <Button
        type="submit"
        disabled={isDisabled}
        variant={variant}
        onClick={handleClick}
        {...props}
      >
        {isLoading ? <LoadingContent /> : children}
      </Button>
    );
  }

  return (
    <AlertDialog open={isLoading || undefined}>
      <AlertDialogTrigger asChild>
        <Button disabled={isDisabled} variant={variant} {...props}>
          {children}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{alertTitel}</AlertDialogTitle>
          <AlertDialogDescription>{alertDescription}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={isLoading}
            onClick={performAction}
            className={buttonVariants({ variant: "default" })}
          >
            {isLoading ? <LoadingContent /> : "Confirm"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
