import { MongoClient, ServerApiVersion } from "mongodb";

const options = {
  maxPoolSize: 10,
  minPoolSize: 0,
  serverSelectionTimeoutMS: 10000,
  connectTimeoutMS: 10000,
  socketTimeoutMS: 20000,
  family: 4,
  tls: true,
  retryWrites: true,
  serverApi: {
    version: ServerApiVersion.v1,
    strict: false,
    deprecationErrors: false,
  },
};

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

export default function getMongoClientPromise(): Promise<MongoClient> {
  const uri = process.env.MONGODB_URI?.trim().replace(/^"|"$/g, "");

  if (!uri) {
    throw new Error("Please define MONGODB_URI in your environment variables.");
  }

  if (!global._mongoClientPromise) {
    const client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect().catch((error) => {
      global._mongoClientPromise = undefined;
      throw error;
    });
  }

  return global._mongoClientPromise;
}
