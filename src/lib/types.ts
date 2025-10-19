import { ObjectId } from "mongodb";
import { sortBy, CATEGORIES, themeColors, filterCategories, CATEGORY_SLUGS } from "./config";

interface DBDoc {
  _id?: string | ObjectId;
}
interface BaseId {
  id: string;
}

type DocType<T> = T & DBDoc;
type BaseType<T> = T & BaseId;

type BalanceT = {
  userId?: string | ObjectId;
  current: number;
  income: number;
  expenses: number;
};

type PotT = {
  userId?: string | ObjectId;
  name: string;
  target: number;
  total: number;
  theme: ThemeColor;
};

type BillT = {
  userId?: string | ObjectId;
  name: "Paid Bills" | "Total Upcoming" | "Due Soon";
  amount: number;
  theme: ThemeColor;
};

type BudgetT = {
  userId?: string | ObjectId;
  category: TransactionCategory;
  maximum: number;
  theme: ThemeColor;
};

type TransactionT = {
  userId?: string | ObjectId;
  avatar: string;
  name: string;
  category: TransactionCategory;
  date: string;
  amount: number;
  recurring: boolean;
};

type SortByOrder = "asc" | "desc";
type SortByKey = "date" | "name" | "amount";

export type Balance = BaseType<BalanceT>;
export type BalanceDocument = DocType<BalanceT>;
export type Pot = BaseType<PotT>;
export type PotDocument = DocType<PotT>;
export type Bill = BaseType<BillT>;
export type BillDocument = DocType<BillT>;
export type Budget = BaseType<BudgetT>;
export type BudgetDocument = DocType<BudgetT>;
export type Transaction = BaseType<TransactionT>;
export type TransactionDocument = DocType<TransactionT>;

export type CategoryLabel = (typeof CATEGORIES)[number];
export type CategorySlug = (typeof CATEGORY_SLUGS)[number];
export type SortFormat = `${SortByKey}:${SortByOrder}`;
export type ThemeColorKey = keyof typeof themeColors;
export type ThemeColor = (typeof themeColors)[ThemeColorKey];
export type TransactionSortKey = (typeof sortBy)[number];
export type TransactionCategoryFilter = (typeof filterCategories)[number];
export type TransactionCategory = Exclude<TransactionCategoryFilter, "all-transactions">;
export type TransactionWithPaymentStatus = Transaction & {
  paid?: boolean;
  dueSoon?: boolean;
  overdue?: boolean;
  dueDay?: number;
};
// Type guard to narrow out "all-transactions"
export function isTransactionCategory(cat: string): cat is TransactionCategory {
  return cat !== "all-transactions";
}
