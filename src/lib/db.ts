import mongoose from "mongoose";
import { MongoClient } from "mongodb";

// Extend global to include mongoose cache
declare global {
  // eslint-disable-next-line no-var
  var mongoose: {
    conn: mongoose.Connection | null;
    promise: Promise<mongoose.Mongoose> | null;
  } | undefined;
}

const MONGODB_URI = process.env.MONGODB_URI || "";
const DB_NAME = process.env.DB_NAME || "games_2025";

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env.local");
}

async function connectToDb(): Promise<mongoose.Connection> {
  if (global.mongoose?.conn) {
    // console.log("Using existing mongoose connection");
    return global.mongoose.conn;
  }

  if (!global.mongoose) {
    global.mongoose = { conn: null, promise: null };
  }

  if (!global.mongoose.promise) {
    const opts = {
      bufferCommands: false,
      dbName: DB_NAME,
    };

    global.mongoose.promise = mongoose.connect(MONGODB_URI, opts);
  }

  try {
    const mongooseInstance = await global.mongoose.promise;
    global.mongoose.conn = mongooseInstance.connection;
    console.log("Db connected:", mongooseInstance.connection.name);

    // Optional: Log collections for debugging
    if (mongooseInstance && mongooseInstance.connection.db) {
      const collections = await mongooseInstance.connection.db.listCollections().toArray();
      if (collections.length === 0) {
        console.log("No collections found in", mongooseInstance.connection.name);
      } else {
        console.log("Found", collections.length, "collections in", mongooseInstance.connection.name, "database:");
        collections.forEach((col) => console.log(col.name));
      }
    }

    return global.mongoose.conn;
  } catch (e) {
    global.mongoose.promise = null;
    throw e;
  }
}

export async function getMongoClient(): Promise<MongoClient> {
  const connection = await connectToDb();
  if (!connection.db) {
    throw new Error("Mongoose connection is not established");
  }

  // Extract MongoClient from Mongoose connection
  const mongoClient = (connection.getClient() as unknown) as MongoClient;
  if (!mongoClient) {
    throw new Error("Unable to extract MongoClient from Mongoose connection");
  }

  // Verify client is connected
  try {
    await mongoClient.db(DB_NAME).command({ ping: 1 });
    // console.log("MongoClient ping successful");
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`MongoClient is not connected: ${errorMessage}`);
  }

  return mongoClient;
}

export default connectToDb;