import { CategoryLabel, CategorySlug } from "@/lib/types";
import { ObjectId } from "mongodb";

export type FieldErrors = Record<string, string[]>;

export type FormState = { success: boolean; error: FieldErrors | null | string };

export type FieldProps =
  | {
      label: string;
      type: string;
      name: string;
      hint: string;
    }
  | ({
      label: string;
      type: string;
      name: string;
    } & { hint?: never });

export type DBColUser = {
  _id: string | ObjectId;
  name: string;
  email: string;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type BalanceInfo = { current: number; monthlyIncome: number };

export type OnboardingStashDoc = {
  _id: ObjectId;
  categories: UserCategory[];
  currentBalance: number;
  monthlyIncome: number;
  createdAt: Date;
};

export type UserCategory = {
  slug: CategorySlug; // canonical key, e.g. "groceries"
  label: CategoryLabel; // display, e.g. "Groceries"
  theme?: string;
  order?: number;
};

export type UserCategoryDocument = {
  _id: ObjectId;
  userId: ObjectId;
  slug: CategorySlug;
  label: CategoryLabel;
  theme?: string;
  order?: number;
  createdAt: Date;
  updatedAt: Date;
};
