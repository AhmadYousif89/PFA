"use server";

import { SignUpSchema } from "../_lib/sign-up.schema";

export async function signUpFn(prevState: unknown, formData: FormData) {
  const data = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  };

  const result = SignUpSchema.safeParse(data);
  if (!result.success) {
    const msg = result.error.issues[0].message;
    const path = result.error.issues[0].path[0];
    return { success: false, error: { [path]: [msg] }, data: null };
  }

  return { success: true, data: result.data, error: null };
}
