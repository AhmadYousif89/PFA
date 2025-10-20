import "server-only";
import { ObjectId } from "mongodb";
import { headers } from "next/headers";

import { slugify } from "@/lib/utils";
import connectToDatabase from "@/lib/db";
import { BudgetDocument } from "@/lib/types";
import { checkDemoRequest } from "@/app/shared-data/scope-userId";
import { budgetCategories, getCategoryLabel } from "@/lib/config";
import { UserCategory, UserCategoryDocument } from "../(auth)/_lib/types";

/**
 * Set user categories in DB for the logged-in user
 * @param categories User categories to set (will upsert)
 * @returns void
 */
export async function setUserCategories(categories: UserCategory[]) {
  const [{ auth }] = await Promise.all([import("@/app/(auth)/_lib/auth")]);
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user.id ? new ObjectId(session.user.id) : null;
  if (!userId) return;

  const now = new Date();
  const { db } = await connectToDatabase();

  await Promise.all(
    categories.map((c, idx) =>
      db.collection<UserCategoryDocument>("categories").updateOne(
        { userId, slug: c.slug || slugify(c.label) },
        {
          $set: {
            userId,
            slug: c.slug || slugify(c.label),
            label: c.label,
            theme: c.theme,
            order: typeof c.order === "number" ? c.order : idx,
            updatedAt: now,
          },
          $setOnInsert: { createdAt: now },
        },
        { upsert: true }, // will create if not exists
      ),
    ),
  );
}

/**
 * Get user categories from DB for the logged-in user
 * @returns User categories for the logged-in user, or empty array if none or not logged in
 */
export async function getUserCategories(): Promise<UserCategory[]> {
  const [{ auth }] = await Promise.all([import("@/app/(auth)/_lib/auth")]);
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user.id ? new ObjectId(session.user.id) : null;
  if (!userId) return [];

  const { db } = await connectToDatabase();
  const docs = await db
    .collection<UserCategoryDocument>("categories")
    .find({ userId })
    .sort({ order: 1, label: 1 })
    .toArray();

  return docs.map(({ slug, label, theme, order }) => ({ slug, label, theme, order }));
}

/**
 * Get effective user categories, falling back to defaults if none set or demo user
 * @returns User categories if set, otherwise default categories
 */
export async function getEffectiveUserCategories(): Promise<UserCategory[]> {
  const isDemo = await checkDemoRequest();

  const defaultCategories = budgetCategories.map((slug, idx) => ({
    slug,
    label: getCategoryLabel(slug),
    order: idx,
  }));

  if (isDemo) return defaultCategories;

  const userCategories = await getUserCategories();
  // If user has no categories (skipped onboarding), return defaults without seeding
  if (userCategories.length === 0) return defaultCategories;
  return userCategories;
}

export async function seedBudgetsFromUserCategories(defaultMaximum = 100) {
  // Lazy load auth to avoid circular dependency issues
  const [{ auth }] = await Promise.all([import("@/app/(auth)/_lib/auth")]);
  const session = await auth.api.getSession({ headers: await headers() });
  const userId = session?.user.id ? new ObjectId(session.user.id) : null;
  if (!userId) return;

  const userCategories = await getUserCategories();
  if (userCategories.length === 0) return;

  try {
    const { db } = await connectToDatabase();
    const existing = await db
      .collection<BudgetDocument>("budgets")
      .find({ userId })
      .project({ category: 1 })
      .toArray();

    const now = new Date();
    const existingMap = new Map(existing.map((b) => [b.category, b.theme]));
    const toInsert = userCategories
      .filter((c) => !existingMap.has(c.slug))
      .map((c) => ({
        _id: new ObjectId(),
        userId,
        category: c.slug, // slug used by transactions too
        maximum: defaultMaximum,
        theme: c.theme,
        createdAt: now,
        updatedAt: now,
      }));

    if (toInsert.length > 0) {
      await db.collection("budgets").insertMany(toInsert);
    }
  } catch (error) {
    console.error("Error seeding budgets from user categories:", error);
    return;
  }
}

/**
 * Populate skipped categories on the onboarding setup with the rest of the default budget categories
 * @param userCategories User categories from DB
 * @returns All user categories, including any missing defaults appended to the end
 */
export function addSkippedOnboardingCategories(userCategories: UserCategory[]): UserCategory[] {
  const userCategorySlugs = new Set(userCategories.map((c) => c.slug));
  const allCategories = [...userCategories];

  if (userCategories.length < budgetCategories.length) {
    const missingCategories = budgetCategories
      .filter((slug) => !userCategorySlugs.has(slug))
      .map((slug, idx) => ({
        slug,
        label: getCategoryLabel(slug),
        order: userCategories.length + idx,
      }));
    return [...userCategories, ...missingCategories];
  }

  return allCategories;
}
