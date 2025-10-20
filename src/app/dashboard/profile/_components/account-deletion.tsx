"use client";

import { useState } from "react";
import { authClient } from "@/app/(auth)/_lib/auth.client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ActionButton } from "@/components/action.button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function AccountTab() {
  const [confirmText, setConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const hasError = confirmText !== "" && confirmText.toLowerCase() !== "delete";

  const handleUserDelete = async () => {
    if (hasError || !confirmText) return;

    try {
      setIsDeleting(true);
      await authClient.revokeOtherSessions();
      const { error, data } = await authClient.deleteUser();
      if (data?.success) {
        window.location.href = "/";
        return;
      }
      if (error) {
        console.error("Failed to delete account:", error);
      }
    } catch (err) {
      console.error("Failed to delete account:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card className="p-0">
      <CardHeader className="bg-muted rounded-md py-4">
        <CardTitle>Delete your account</CardTitle>
        <CardDescription>Permanently delete your account and all associated data.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <fieldset className="grid gap-1">
          <Label htmlFor="confirm" className="text-muted-foreground text-xs font-bold">
            Type DELETE to confirm
          </Label>
          <Input
            id="confirm"
            value={confirmText}
            placeholder="DELETE"
            className="border-border"
            aria-invalid={hasError}
            onChange={(e) => setConfirmText(e.target.value)}
          />
        </fieldset>
        <ActionButton
          shouldAlert
          variant="destructive"
          externalLoading={isDeleting}
          alertDescription="This action cannot be undone. All your data will be permanently deleted."
          performAction={handleUserDelete}
          disabled={!confirmText || hasError}
          className="min-h-12 min-w-36 place-self-start"
        >
          Delete account
        </ActionButton>
      </CardContent>
    </Card>
  );
}
