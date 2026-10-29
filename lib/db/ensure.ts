import { db } from "@/lib/db";

const globalForDb = globalThis as unknown as {
  __bazardorMongoIndexes?: Promise<void>;
};

// MongoDB creates collections on first write. These indexes protect the same
// unique fields as the previous database and speed up auth lookups.
export function ensureDatabase(): Promise<void> {
  if (!process.env.MONGODB_URI?.trim()) {
    throw new Error("MONGODB_URI is missing. Add your MongoDB connection string to .env.local.");
  }

  if (!globalForDb.__bazardorMongoIndexes) {
    globalForDb.__bazardorMongoIndexes = Promise.all([
      db.collection("user").createIndex({ email: 1 }, { unique: true }),
      db.collection("session").createIndex({ token: 1 }, { unique: true }),
      db.collection("session").createIndex({ userId: 1 }),
      db.collection("account").createIndex({ userId: 1 }),
      db.collection("verification").createIndex({ identifier: 1 }),
    ]).then(() => undefined).catch((error) => {
      globalForDb.__bazardorMongoIndexes = undefined;
      throw error;
    });
  }

  return globalForDb.__bazardorMongoIndexes;
}
