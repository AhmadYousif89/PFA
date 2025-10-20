import "server-only";
import { ObjectId } from "mongodb";
import { headers } from "next/headers";

import connectToDatabase from "@/lib/db";
import { auth } from "../(auth)/_lib/auth";
import { getScopedUserId } from "@/app/shared-data/scope-userId";
import { Transaction, TransactionCategory, TransactionDocument } from "@/lib/types";

const _cachedTransactions = async (userId: ObjectId, limit = 0, category?: TransactionCategory) => {
  const { db } = await connectToDatabase();
  const transactions = await db
    .collection<TransactionDocument>("transactions")
    .find({
      userId,
      ...(category ? { category } : {}),
    })
    .sort({ date: -1 })
    .limit(limit)
    .toArray();

  if (!transactions || transactions.length === 0) {
    return [];
  }

  return transactions.map((transaction) => ({
    id: transaction._id.toString(),
    userId: transaction.userId?.toString(),
    name: transaction.name,
    date: transaction.date,
    amount: Number(transaction.amount),
    avatar: transaction.avatar,
    category: transaction.category,
    recurring: transaction.recurring,
  })) satisfies Transaction[];
};

/**
 * @param limit - The maximum number of transactions to return. If 0 or not provided, all transactions are returned.
 * @param category - Optional category to filter transactions by.
 * @returns A list of transactions for the current user, optionally filtered by category and limited to the specified number.
 */
export async function getTransactions({
  limit = 0,
  category,
}: { limit?: number; category?: TransactionCategory } = {}) {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = await getScopedUserId(session?.user.id);
  if (!userId) return [];

  return _cachedTransactions(userId, limit, category);
}

/**
 * @returns The total count of transactions for the current user
 */
export async function getTransactionsCount() {
  const transactions = await getTransactions();
  return transactions.length;
}
