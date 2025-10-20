"use client";

import Link from "next/link";
import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BaseModal } from "./base.modal";

type Props = { isOpen: boolean };

export function SessionExpiredModal({ isOpen }: Props) {
  return (
    <BaseModal isOpen={isOpen}>
      <DialogContent
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
        className="gap-8"
      >
        <DialogHeader>
          <DialogTitle className="text-lg">Session Expired</DialogTitle>
          <DialogDescription>
            Your session has expired due to inactivity. Please sign in again to continue.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button asChild className="h-12">
            <Link href="/sign-in">Sign In</Link>
          </Button>
        </DialogFooter>
      </DialogContent>
    </BaseModal>
  );
}
