import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI?.trim();
const databaseName = process.env.MONGODB_DB?.trim() || "bazardor";

// Create the client without connecting during a build. ensureDatabase checks
// that the real URI is configured before any authentication request uses it.
const globalForDb = globalThis as unknown as {
  __bazardorMongoClient?: MongoClient;
};

export const mongoClient =
  globalForDb.__bazardorMongoClient ??
  new MongoClient(uri || "mongodb://127.0.0.1:27017");

if (process.env.NODE_ENV !== "production") {
  globalForDb.__bazardorMongoClient = mongoClient;
}

export const db = mongoClient.db(databaseName);
