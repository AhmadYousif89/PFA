import { Metadata } from "next";

import { SignInForm } from "../_components/sign-in.form";

export const metadata: Metadata = {
  title: "Sign In - Personal Finance App",
  description: "Sign in to your account",
};

export default function SignInPage() {
  return (
    <>
      <h1 className="text-xl font-bold">Login</h1>
      <SignInForm />
    </>
  );
}
