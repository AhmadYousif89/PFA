"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BaseModal } from "./base.modal";
import { Spinner } from "../ui/spinner";

type Props = { isOpen: boolean };

export function DemoSessionExpiredModal({ isOpen }: Props) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) setIsLoading(false);
  }, [isOpen]);

  return (
    <BaseModal isOpen={isOpen}>
      <DialogContent
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        className="gap-8"
      >
        <DialogHeader>
          <DialogTitle className="text-lg">Demo Session Expired</DialogTitle>
          <DialogDescription>
            Your demo session has expired. Please sign up to enjoy full experience or start a new
            demo session.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex-row gap-4 max-sm:*:grow sm:justify-end">
          <Button
            variant="outline"
            className="h-12 w-32"
            onClick={() => {
              setIsLoading(true);
              router.replace("/demo/dashboard");
            }}
          >
            {isLoading ? (
              <Spinner className="fill-muted-foreground size-6" />
            ) : (
              <span>Refresh Demo</span>
            )}
          </Button>
          <Button asChild className="h-12 w-32">
            <Link href="/sign-up">Sign Up</Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </BaseModal>
  );
}
