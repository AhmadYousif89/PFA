"use client";

import { useRouter } from "next/navigation";

import { AuthForm } from "./auth-compound-form";
import { FIELDS } from "../_lib/sign-up.schema";
import { signUpFn } from "../_actions/sign-up.action";
import { onboardingClient, signUpWithEmail } from "../_lib/auth.client";

export const SignUpForm = () => {
  const router = useRouter();

  const handleSignUp = async (prevState: unknown, form: FormData) => {
    try {
      const res = await signUpFn(null, form);
      if (!res.data) {
        return { success: false, error: res.error ?? "Invalid form submission" };
      }

      await signUpWithEmail({
        name: res.data.name,
        email: res.data.email,
        password: res.data.password,
      });

      const finalizeRes = await onboardingClient.finalize();

      if ("ok" in finalizeRes && finalizeRes.ok) {
        router.push("/dashboard");
        return { success: true, error: null };
      }

      return { success: false, error: "Finalizing onboarding failed" };
    } catch (error) {
      console.error("SignUp: Error during sign-in or finalize:", error);
      return { success: false, error: "Unexpected error during sign up" };
    }
  };

  return (
    <AuthForm action={handleSignUp}>
      {FIELDS.map(({ label, type, name, hint }, i) => (
        <AuthForm.Field
          key={name}
          label={label}
          type={type}
          name={name}
          hint={hint}
          autoFocus={i === 0}
        />
      ))}
      <AuthForm.SubmitButton>Create Account</AuthForm.SubmitButton>
      <AuthForm.Link href="/sign-in" msg="Already have an account?">
        Login
      </AuthForm.Link>
    </AuthForm>
  );
};
