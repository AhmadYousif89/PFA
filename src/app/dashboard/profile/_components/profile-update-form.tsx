"use client";

import { useState } from "react";
import { User } from "better-auth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ActionButton } from "@/components/action.button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { authClient } from "@/app/(auth)/_lib/auth.client";
import { useRouter } from "next/navigation";

type FormState = {
  name: string;
  loading: boolean;
  error: string | null; // field/global error
  success: string | null; // success message
};

export function ProfileTab({ user }: { user: User }) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>({
    name: user.name ?? "",
    loading: false,
    error: null,
    success: null,
  });

  const validateName = (value: string) => {
    const v = value.trim();
    if (v.length === 0) return "Name cannot be empty";
    if (v.length > 30) return "Name is too long";
    return null;
  };

  const handleChange = (value: string) => {
    setForm((prev) => {
      const nextError = prev.error ? validateName(value) : prev.error;
      return {
        ...prev,
        name: value,
        error: nextError,
        success: null,
      };
    });
  };

  const handleBlur = () => {
    setForm((prev) => ({
      ...prev,
      error: validateName(prev.name),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setForm((prev) => ({ ...prev, error: null, success: null }));

    const trimmed = form.name.trim();
    const err = validateName(trimmed);
    if (err) {
      setForm((prev) => ({ ...prev, error: err }));
      return;
    }

    if ((user.name ?? "") === trimmed) {
      setForm((prev) => ({ ...prev, success: "No changes made" }));
      return;
    }

    try {
      setForm((prev) => ({ ...prev, loading: true }));
      await authClient.updateUser({ name: trimmed });
      setForm((prev) => ({
        ...prev,
        loading: false,
        success: "Name updated successfully",
        error: null,
        name: trimmed,
      }));
      router.refresh();
    } catch (err) {
      setForm((prev) => ({
        ...prev,
        loading: false,
        error: (err as Error)?.message || "Failed to update name",
      }));
    }
  };

  return (
    <Card className="p-0">
      <CardHeader className="bg-muted rounded-md py-4">
        <CardTitle>Update profile information</CardTitle>
        <CardDescription>Change your name associated with your account.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <fieldset className="grid gap-2">
            <Label htmlFor="name" className="text-muted-foreground text-xs font-bold">
              Name
            </Label>
            <Input
              id="name"
              name="name"
              autoComplete="name"
              aria-invalid={!!form.error}
              aria-describedby={form.error ? "name-error" : undefined}
              placeholder="Enter your name"
              className="border-border"
              value={form.name}
              onBlur={handleBlur}
              onChange={(e) => handleChange(e.target.value)}
            />
            {form.error && (
              <p id="name-error" className="text-destructive mt-1 text-xs font-medium">
                {form.error}
              </p>
            )}
          </fieldset>

          <fieldset className="grid gap-2">
            <Label htmlFor="email" className="text-muted-foreground text-xs font-bold">
              Email
            </Label>
            <Input id="email" value={user.email ?? ""} disabled />
          </fieldset>

          <CardFooter className="mt-4 gap-4 px-0">
            <ActionButton
              type="submit"
              disabled={form.loading || !!form.error}
              externalLoading={form.loading}
              className="min-h-12 min-w-36 place-self-start"
            >
              Save changes
            </ActionButton>

            {form.success && (
              <p className="text-primary-foreground bg-primary rounded-md px-4 py-2 text-sm font-semibold">
                {form.success}
              </p>
            )}
          </CardFooter>
        </form>
      </CardContent>
    </Card>
  );
}
