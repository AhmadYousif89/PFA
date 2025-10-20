import Form from "next/form";
import Link from "next/link";
import {
  use,
  useRef,
  useState,
  createContext,
  useActionState,
  type ReactNode,
  useEffect,
} from "react";

import { cn } from "@/lib/utils";
import { FormState } from "../_lib/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ActionButton } from "@/components/action.button";

import ShowPassIcon from "public/assets/images/icon-show-password.svg";
import HidePassIcon from "public/assets/images/icon-hide-password.svg";

type TAuthFormContext = {
  isPending: boolean;
  state: FormState;
  formDataRef: React.RefObject<Record<string, string>>;
};

const AuthFormContext = createContext<TAuthFormContext | null>(null);

const useAuthForm = () => {
  const ctx = use(AuthFormContext);
  if (!ctx) {
    throw new Error("AuthForm compound components must be used within AuthForm");
  }
  return ctx;
};

type AuthFormProps = {
  children: ReactNode;
  onSuccess?: () => void;
  action: (state: Awaited<FormState>, data: FormData) => FormState | Promise<FormState>;
};

function AuthForm({ children, action, onSuccess }: AuthFormProps) {
  const calledRef = useRef(false);
  const formDataRef = useRef<Record<string, string>>({});

  const wrappedAction = async (state: FormState, data: FormData) => {
    formDataRef.current = Object.fromEntries(data.entries()) as Record<string, string>;
    return await action(state, data);
  };

  const [state, actionFn, isPending] = useActionState(wrappedAction, {
    success: false,
    error: null,
  });

  useEffect(() => {
    if (!calledRef.current && !isPending && state?.success === true) {
      calledRef.current = true;
      onSuccess?.();
    }
  }, [state, isPending, onSuccess]);

  return (
    <AuthFormContext.Provider value={{ state, isPending, formDataRef }}>
      <Form action={actionFn} className="flex flex-col gap-4">
        {children}
      </Form>
      {state.error && (
        <div className="bg-yellow/50 text-red flex items-center justify-center rounded p-1 text-sm font-semibold">
          {typeof state.error === "string" ? (
            <p className="transition-all transition-discrete duration-3000 ease-in-out">
              {state.error}
            </p>
          ) : (
            <ul>
              {Object.values(state.error).map((err: string[], i) => (
                <li key={i} className="flex list-none gap-2">
                  {err}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </AuthFormContext.Provider>
  );
}

type FieldProps = { label: string; hint?: string } & React.ComponentProps<"input">;

function Field({ label, type, ...props }: FieldProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const { state, isPending, formDataRef } = useAuthForm();
  const [togglePass, setTogglePass] = useState<"show" | "hide">("hide");

  const isNameField = type === "text" && props.name === "name";
  const isEmailField = type === "email" && props.name === "email";
  const isPasswordField = type === "password" && props.name === "password";

  const fieldHasError = () => {
    if (state.error && typeof state.error !== "string") {
      if (isNameField && "name" in state.error) return true;
      if (isEmailField && "email" in state.error) return true;
      if (isPasswordField && "password" in state.error) return true;
    }
    return false;
  };

  useEffect(() => {
    if (props.autoFocus) {
      const id = requestAnimationFrame(() => {
        inputRef.current?.focus({ preventScroll: true });
      });
      return () => cancelAnimationFrame(id);
    }
  }, [props.autoFocus]);

  return (
    <fieldset className="grid gap-1">
      <Label htmlFor={props.name} className="text-muted-foreground text-xs font-bold">
        {label}
      </Label>
      <div className="grid">
        <Input
          required
          autoFocus={props.autoFocus}
          ref={inputRef}
          id={props.name}
          disabled={isPending}
          aria-invalid={fieldHasError()}
          aria-describedby={fieldHasError() ? `${props.name}-error` : undefined}
          defaultValue={formDataRef.current[props.name || ""] || ""}
          className="border-border col-end-1 row-end-1"
          type={isPasswordField && togglePass === "show" ? "text" : type}
          {...props}
        />
        {isPasswordField && (
          <Button
            type="button"
            variant="ghost"
            onClick={() => setTogglePass(togglePass === "hide" ? "show" : "hide")}
            className="col-end-1 row-end-1 mr-1 h-9 w-10 self-center justify-self-end rounded p-0"
          >
            {togglePass === "hide" ? (
              <ShowPassIcon className="size-fit" />
            ) : (
              <HidePassIcon className="size-fit" />
            )}
          </Button>
        )}
      </div>
      {props.hint && <span className="text-muted-foreground text-right text-xs">{props.hint}</span>}
    </fieldset>
  );
}

function SubmitButton({ children, isSubmitting }: { children: ReactNode; isSubmitting?: boolean }) {
  const { isPending } = useAuthForm();
  const submitting = isSubmitting || isPending;

  return (
    <ActionButton type="submit" className="my-4 min-h-13.25 font-bold" disabled={submitting}>
      {children}
    </ActionButton>
  );
}

type LinkProps = {
  href: string;
  msg: string;
  children: ReactNode;
};

function AuthFormLink({ href, children, msg }: LinkProps) {
  const { isPending } = useAuthForm();

  return (
    <div className="flex items-center justify-center gap-2">
      <span className="text-muted-foreground text-sm">{msg}</span>
      <Button
        asChild
        variant="ghost"
        disabled={isPending}
        className="h-auto rounded p-0 hover:bg-transparent"
      >
        <Link
          href={href}
          className={cn(
            "text-foreground p-px text-sm font-bold underline decoration-2 underline-offset-4 outline-none",
            "hover:text-primary",
            "focus-visible:ring-ring/50 focus:text-primary focus-visible:ring-2",
          )}
        >
          {children}
        </Link>
      </Button>
    </div>
  );
}

AuthForm.Field = Field;
AuthForm.SubmitButton = SubmitButton;
AuthForm.Link = AuthFormLink;

export { AuthForm };
