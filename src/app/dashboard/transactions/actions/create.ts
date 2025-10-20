"use server";

import { z } from "zod";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

import connectToDatabase from "@/lib/db";
import { auth } from "@/app/(auth)/_lib/auth";
import { isTransactionCategory } from "@/lib/types";
import { getScopedUserId } from "@/app/shared-data/scope-userId";

const transactionSchema = z.object({
  name: z.string().min(1, "Transaction name is required"),
  category: z.string().refine(isTransactionCategory, "Invalid category"),
  date: z
    .string()
    .min(1, "Date is required")
    .transform((val) => new Date(val).toISOString()),
  amount: z.number().refine((val) => !isNaN(val), "A valid amount is required"),
  recurring: z.boolean().default(false),
  avatar: z.string(),
});

export async function createTransactionAction(prevState: unknown, formData: FormData) {
  const rawData = {
    name: formData.get("name"),
    category: formData.get("category"),
    amount: parseFloat(formData.get("amount") as string),
    date: formData.get("date"),
    recurring: formData.get("recurring") === "on",
    avatar: `/assets/images/avatars/${formData.get("avatar")}`,
  };

  console.log("Raw form data:", rawData);
  try {
    const { success, data, error } = transactionSchema.safeParse(rawData);
    if (!success) {
      throw new Error(error.issues.map((err) => err.message).join(", ") || "Validation failed");
    }
    console.log("Validated data:", data);
    const session = await auth.api.getSession({ headers: await headers() });
    const userId = await getScopedUserId(session?.user.id);
    if (!userId) throw new Error("Unauthorized");

    const { db } = await connectToDatabase();
    const res = await db.collection("transactions").insertOne({
      userId,
      ...data,
      createdAt: new Date(),
    });

    if (!res.acknowledged) {
      throw new Error("Failed to create transaction");
    }

    revalidatePath("/dashboard");
    return { success: true, message: "Transaction created successfully" };
  } catch (error) {
    console.log("Error creating transaction:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}
