import "server-only";
import { ObjectId } from "mongodb";
import { headers } from "next/headers";
import connectToDatabase from "@/lib/db";

import {
  Budget,
  BudgetDocument,
  isTransactionCategory,
  Transaction,
  TransactionCategory,
  TransactionDocument,
} from "@/lib/types";
import { auth } from "../(auth)/_lib/auth";
import { getScopedUserId } from "@/app/shared-data/scope-userId";

const _cachedBudgets = async (userId: string | ObjectId) => {
  const { db } = await connectToDatabase();
  const budgets = await db
    .collection<BudgetDocument>("budgets")
    .find({ userId })
    .sort({ createdAt: -1 })
    .toArray();

  if (!budgets || budgets.length === 0) {
    return [];
  }

  return budgets.map((budget) => ({
    id: budget._id.toString(),
    userId: budget.userId?.toString(),
    category: budget.category,
    maximum: Number(budget.maximum),
    theme: budget.theme,
  })) satisfies Budget[];
};

const _cachedBudgetTransactionsMap = async (userId: string | ObjectId) => {
  const categories = await getBudgetCategories(userId);
  if (categories.length === 0) return {} as Record<TransactionCategory, Transaction[]>;

  const { db } = await connectToDatabase();
  const txs = await db
    .collection<TransactionDocument>("transactions")
    .find({ userId, category: { $in: categories } })
    .sort({ date: -1 })
    .toArray();

  if (!txs || txs.length === 0) {
    return {} as Record<TransactionCategory, Transaction[]>;
  }

  const mappedTxs = txs.map((t) => ({
    id: t._id.toString(),
    userId: t.userId?.toString(),
    name: t.name,
    date: t.date,
    amount: Number(t.amount),
    avatar: t.avatar,
    category: t.category,
    recurring: t.recurring,
  })) satisfies Transaction[];

  const grouped: Record<TransactionCategory, Transaction[]> = Object.create(null);
  for (const t of mappedTxs) {
    const key = t.category;
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(t);
  }

  return grouped;
};

const _cachedSpendingsByCategoryMap = async (userId: string | ObjectId) => {
  const categories = await getBudgetCategories(userId);
  if (categories.length === 0) return {} as Record<TransactionCategory, number>;

  const { db } = await connectToDatabase();
  const results = await db
    .collection<TransactionDocument>("transactions")
    .aggregate<{ _id: TransactionCategory; total: number }>([
      { $match: { userId, category: { $in: categories }, amount: { $lt: 0 } } },
      { $group: { _id: "$category", total: { $sum: { $abs: "$amount" } } } },
    ])
    .toArray();

  const map: Record<TransactionCategory, number> = Object.create(null);
  for (const cat of categories) map[cat] = 0;
  for (const r of results) map[r._id] = Number(r.total) || 0;
  return map;
};

/**
 * @param userId - The user ID to get budget categories for
 * @returns The list of budget categories for the given user ID
 */
async function getBudgetCategories(userId: string | ObjectId) {
  const budgets = await _cachedBudgets(userId);
  return budgets.map((budget) => budget.category).filter(isTransactionCategory);
}

/**
 * @returns All budgets for the current user
 */
export async function getBudgets() {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = await getScopedUserId(session?.user.id);
  if (!userId) return [];
  return _cachedBudgets(userId);
}

/**
 * @returns The total number of budgets for the current user
 */
export async function getBudgetsCount() {
  const budgets = await getBudgets();
  return budgets.length;
}

/**
 * @param limit - The maximum number of transactions to return per category. If 0 or not provided, all transactions are returned.
 * @returns A map of budget categories to their associated transactions, limited to the specified number of transactions per category.
 */
export async function getBudgetTransactionsMap({ limit = 0 }: { limit?: number }) {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = await getScopedUserId(session?.user.id);
  if (!userId) return {} as Record<TransactionCategory, Transaction[]>;

  const result = await _cachedBudgetTransactionsMap(userId);
  if (limit <= 0) return result; // no limit, return all

  const limited: Record<TransactionCategory, Transaction[]> = Object.create(null);
  for (const key of Object.keys(result) as TransactionCategory[]) {
    limited[key] = result[key].slice(0, limit);
  }
  return limited;
}

/**
 * @returns A map of spending amounts by category for the current user
 */
export async function getSpendingByCategoryMap() {
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = await getScopedUserId(session?.user.id);
  if (!userId) return {} as Record<TransactionCategory, number>;
  return _cachedSpendingsByCategoryMap(userId);
}
