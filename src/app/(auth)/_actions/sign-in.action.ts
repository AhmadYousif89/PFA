"use server";

import { FormState } from "../_lib/types";
import { SignInSchema } from "../_lib/sign-in.schema";

export async function signInFn(prevState: FormState, formData: FormData) {
  const data = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const result = SignInSchema.safeParse(data);
  if (!result.success) {
    const msg = result.error.issues[0].message;
    const path = result.error.issues[0].path[0];
    return { error: { [path]: [msg] } };
  }

  return { success: true, data: result.data, error: null };
}
