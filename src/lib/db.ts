import { MongoClient } from "mongodb";
import { ENVSchema } from "./load-env";

declare global {
  var __mongo:
    | { client: MongoClient | null; promise: Promise<MongoClient> | null; initialized: boolean }
    | undefined;
}

const uri = ENVSchema.MONGODB_URI;
const dbName = ENVSchema.MONGODB_NAME;

if (!uri) throw new Error("Please define the MONGODB_URI environment variable");
if (!dbName) throw new Error("Please define the MONGODB_DB environment variable");

const cached = (global.__mongo ??= { client: null, promise: null, initialized: false });

export async function getMongoClient(): Promise<MongoClient> {
  if (cached.client) return cached.client;

  if (!cached.promise) {
    console.log("Creating MongoDB client...");
    const client = new MongoClient(uri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 30000,
      connectTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      retryWrites: true,
      retryReads: true,
      w: "majority",
    });

    cached.promise = client.connect().then(async (c) => {
      if (!cached.initialized) {
        const db = c.db(dbName);
        await db.command({ ping: 1 });
        // await runIndexes(db);
        cached.initialized = true;
        console.log("MongoDB connected and initialized");
      }
      return c;
    });
  }

  cached.client = await cached.promise;
  return cached.client;
}

async function connectToDatabase() {
  const client = await getMongoClient();
  return { db: client.db(dbName), client };
}

export default connectToDatabase;
