"use client";

import { AuthForm } from "./auth-compound-form";
import { FIELDS } from "../_lib/sign-in.schema";
import { signInFn } from "../_actions/sign-in.action";
import { useRouter } from "next/navigation";
import { FormState } from "../_lib/types";
import { signInWithEmail } from "../_lib/auth.client";

export const SignInForm = () => {
  const router = useRouter();

  const handleSignIn = async (prevState: FormState, form: FormData) => {
    try {
      const res = await signInFn(prevState, form);
      if (res.error) {
        return { success: false, error: res.error ?? "Invalid form submission" };
      }

      const authRes = await signInWithEmail({
        email: res.data.email,
        password: res.data.password,
      });

      if (authRes.error) {
        return { success: false, error: authRes.error.message || "Authentication failed" };
      }

      router.push("/dashboard");
      return { success: true, error: null };
    } catch (error) {
      console.error("SignIn: Error during sign-in:", error);
      return { success: false, error: "Unexpected error during sign in" };
    }
  };

  return (
    <AuthForm action={handleSignIn}>
      {FIELDS.map(({ label, type, name }, i) => (
        <AuthForm.Field key={name} label={label} type={type} name={name} autoFocus={i === 0} />
      ))}
      <AuthForm.SubmitButton>Login</AuthForm.SubmitButton>
      <AuthForm.Link href="/sign-up" msg="Don't have an account?">
        Sign Up
      </AuthForm.Link>
    </AuthForm>
  );
};
