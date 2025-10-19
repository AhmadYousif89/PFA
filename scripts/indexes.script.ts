import { Db } from "mongodb";

export async function runIndexes(db: Db) {
  await createUserEmailIndex(db);
  await createBalanceIndexes(db);
  await createTransactionIndexes(db);
  await createCategoryIndexes(db);
  await createBudgetIndexes(db);
  await createPotIndexes(db);
  await createOnboardingIndexes(db);
}

async function createUserEmailIndex(db: Db) {
  try {
    const users = db.collection("users");
    if (!users) {
      console.error("Collection 'users' does not exist.");
      return;
    }
    const indexes = await users.indexes();
    const indexExists = indexes.some((index) => index.name === "user_email_idx");
    if (indexExists) {
      console.log("Index 'user_email_idx' already exists.");
      return;
    }

    await users.createIndex(
      { email: 1 },
      {
        name: "user_email_idx",
        unique: true,
        // strength:2 makes comparisons case-insensitive for letters
        collation: { locale: "en", strength: 2 },
        // protect against non-string/null values if any old docs exist
        partialFilterExpression: { email: { $type: "string" } },
      },
    );
    console.log("Ensured unique index on users.email");
  } catch (error) {
    console.error("Error creating index on users.email:", error);
  }
}

async function createTransactionIndexes(db: Db) {
  const transIdxNames = [
    "transactions_user_date_idx",
    "transactions_user_category_date_idx",
    "transactions_user_category_recurring_idx",
  ];

  try {
    const transactions = db.collection("transactions");
    if (!transactions) {
      console.error("Collection 'transactions' does not exist.");
      return;
    }
    const indexes = await transactions.indexes();
    const existingIdxNames = indexes.map((idx) => idx.name);
    const allExist = transIdxNames.every((name) => existingIdxNames.includes(name));
    if (allExist) {
      console.log("Transaction indexes already exist.");
      return;
    }
    // Create indexes if any are missing
    if (!existingIdxNames.includes("transactions_user_date_idx"))
      await transactions.createIndex(
        { userId: 1, date: -1 },
        { name: "transactions_user_date_idx" },
      );
    if (!existingIdxNames.includes("transactions_user_category_date_idx"))
      await transactions.createIndex(
        { userId: 1, category: 1, date: -1 },
        { name: "transactions_user_category_date_idx" },
      );
    if (!existingIdxNames.includes("transactions_user_category_recurring_idx"))
      await transactions.createIndex(
        { userId: 1, category: 1, recurring: 1 },
        { name: "transactions_user_category_recurring_idx" },
      );

    console.log(
      "Ensured indexes on transactions (userId, date), (userId, category, date), (userId, category, recurring)",
    );
  } catch (error) {
    console.error("Error creating indexes on transactions:", error);
  }
}

async function createCategoryIndexes(db: Db) {
  try {
    const categories = db.collection("categories");
    if (!categories) {
      console.error("Collection 'categories' does not exist.");
      return;
    }
    const indexes = await categories.indexes();
    const indexExists = indexes.some((index) => index.name === "categories_user_slug_idx");
    if (indexExists) {
      console.log("Index 'categories_user_slug_idx' already exists.");
      return;
    }
    await categories.createIndex(
      { userId: 1, slug: 1 },
      { name: "categories_user_slug_idx", unique: true },
    );
    console.log("Ensured unique index on categories (userId, slug)");
  } catch (error) {
    console.error("Error creating index on categories (userId, slug):", error);
  }
}

async function createBudgetIndexes(db: Db) {
  const budgetIdxNames = ["budgets_user_category_idx", "budgets_user_createdAt_idx"];

  try {
    const budgets = db.collection("budgets");
    if (!budgets) {
      console.error("Collection 'budgets' does not exist.");
      return;
    }

    const indexes = await budgets.indexes();
    const existingIdxNames = indexes.map((idx) => idx.name);
    const allExist = budgetIdxNames.every((name) => existingIdxNames.includes(name));

    if (allExist) {
      console.log("Budget indexes already exist.");
      return;
    }

    if (!existingIdxNames.includes("budgets_user_category_idx"))
      await budgets.createIndex(
        { userId: 1, category: 1 },
        { name: "budgets_user_category_idx", unique: true },
      );
    if (!existingIdxNames.includes("budgets_user_createdAt_idx"))
      await budgets.createIndex(
        { userId: 1, createdAt: -1 },
        { name: "budgets_user_createdAt_idx" },
      );

    console.log("Ensured indexes on budgets (userId, category) and (userId, createdAt)");
  } catch (error) {
    console.error("Error creating indexes on budgets:", error);
  }
}

async function createPotIndexes(db: Db) {
  try {
    const pots = db.collection("pots");
    if (!pots) {
      console.error("Collection 'pots' does not exist.");
      return;
    }
    const indexes = await pots.indexes();
    const indexExists = indexes.some((index) => index.name === "pots_user_createdAt_idx");
    if (indexExists) {
      console.log("Index 'pots_user_createdAt_idx' already exists.");
      return;
    }

    await pots.createIndex({ userId: 1, createdAt: -1 }, { name: "pots_user_createdAt_idx" });
    console.log("Ensured index on pots (userId, createdAt)");
  } catch (error) {
    console.error("Error creating index on pots (userId, createdAt):", error);
  }
}

async function createBalanceIndexes(db: Db) {
  try {
    const balances = db.collection("balances");
    if (!balances) {
      console.error("Collection 'balances' does not exist.");
      return;
    }
    const indexes = await balances.indexes();
    const indexExists = indexes.some((index) => index.name === "balances_user_idx");
    if (indexExists) {
      console.log("Index 'balances_user_idx' already exists.");
      return;
    }
    await balances.createIndex({ userId: 1 }, { name: "balances_user_idx", unique: true });
    console.log("Ensured unique index on balances.userId");
  } catch (error) {
    console.error("Error creating index on balances.userId:", error);
  }
}

async function createOnboardingIndexes(db: Db) {
  try {
    const onboarding = db.collection("onboarding");
    if (!onboarding) {
      console.error("Collection 'onboarding' does not exist.");
      return;
    }
    const indexes = await onboarding.indexes();
    const indexExists = indexes.some((index) => index.name === "onboarding_createdAt_idx");
    if (indexExists) {
      console.log("Index 'onboarding_createdAt_idx' already exists.");
      return;
    }

    await onboarding.createIndex(
      { createdAt: 1 },
      { name: "onboarding_createdAt_idx", expireAfterSeconds: 3600 }, // 1 hour TTL
    );
    console.log("Ensured index on onboarding.createdAt with TTL of 1 hour");
  } catch (error) {
    console.error("Error creating index on onboarding.createdAt:", error);
  }
}
