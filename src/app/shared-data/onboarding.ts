import "server-only";
import { ObjectId } from "mongodb";
import connectToDatabase from "@/lib/db";
import { cookies, headers } from "next/headers";

import { ONBOARDING_COOKIE_NAME } from "../(auth)/_lib/auth.plugins";
import { OnboardingStashDoc, UserCategory } from "../(auth)/_lib/types";
import { seedBudgetsFromUserCategories, setUserCategories } from "@/app/shared-data/categories";

export type StashBody = {
  categories: UserCategory[];
  currentBalance: number;
  monthlyIncome: number;
};

/**
 * Store onboarding stash data in DB and return the stash ID
 * This ID is then stored in a cookie "onboardingId" for later retrieval
 * Returns null if error
 */
export async function setOnboardingStash(input: StashBody) {
  const categories = Array.isArray(input.categories) ? input.categories : [];
  const currentBalance = Number(input.currentBalance ?? 0);
  const monthlyIncome = Number(input.monthlyIncome ?? 0);

  const doc: OnboardingStashDoc = {
    _id: new ObjectId(),
    categories,
    currentBalance,
    monthlyIncome,
    createdAt: new Date(),
  };

  const { db } = await connectToDatabase();
  const res = await db.collection<OnboardingStashDoc>("onboarding").insertOne(doc);

  if (!res.acknowledged) return null;
  return doc._id.toString();
}

/**
 * Get onboarding stash data from DB using cookie "onboardingId"
 * Returns null if no cookie or no stash found (user may have skipped) or error
 */
export async function getOnboardingStash() {
  const cookieStore = await cookies();
  const onboardingId = cookieStore.get(ONBOARDING_COOKIE_NAME)?.value;

  if (!onboardingId) return null;

  try {
    const { db } = await connectToDatabase();
    const stash = await db
      .collection<OnboardingStashDoc>("onboarding")
      .findOne({ _id: new ObjectId(onboardingId) });

    if (!stash) return null;

    return {
      onboardingId,
      categories: stash.categories,
      current: stash.currentBalance,
      income: stash.monthlyIncome,
    };
  } catch (error) {
    console.error("Error fetching onboarding data:", error);
    return null;
  }
}

/**
 * Finalize onboarding process:
 * - This is called once user has completed onboarding steps and created account
 * - Retrieve onboarding stash from DB using cookie "onboardingId"
 * - Set user categories (from stash or defaults if user skipped)
 * - Seed budgets based on user categories
 * - Initialize user balance (from stash or zero/defaults)
 * - Cleanup stash document from DB
 */
export async function finalizeOnboarding() {
  const hdrs = await headers();
  // Lazy load auth to avoid circular dependency issues
  const [{ auth }] = await Promise.all([import("@/app/(auth)/_lib/auth")]);
  const session = await auth.api.getSession({ headers: hdrs });
  const userId = session?.user?.id ? new ObjectId(session.user.id) : null;

  if (!userId) return false;

  try {
    const stash = await getOnboardingStash();

    if (!stash) return false;

    if (stash.categories.length) {
      await setUserCategories(stash.categories);
      await seedBudgetsFromUserCategories();
    }

    // Initialize balance
    const current = Number(stash.current ?? 0);
    const income = Number(stash.income ?? 0);
    const expenses = 0; // Always start with zero expenses

    const { db } = await connectToDatabase();
    await db
      .collection("balances")
      .updateOne({ userId }, { $set: { userId, current, income, expenses } }, { upsert: true });

    await db.collection("onboarding").deleteOne({ _id: new ObjectId(stash.onboardingId) });

    await auth.api.updateUser({ body: { hasFinalized: true }, headers: hdrs });

    return true;
  } catch (error) {
    console.error("Error during onboarding finalization:", error);
    return false;
  }
}
