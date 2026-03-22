import { MongoClient, Db, ObjectId } from "mongodb";
import type { Machine } from "./machines";

let cachedDb: Db | null = null;

async function connectDb(): Promise<Db> {
  if (cachedDb) return cachedDb;

  const mongoUri = process.env.MONGODB_URI;
  const mongoDb = process.env.MONGODB_DB;

  if (!mongoUri || !mongoDb) {
    throw new Error("Missing MongoDB environment variables");
  }

  const client = new MongoClient(mongoUri);
  await client.connect();
  cachedDb = client.db(mongoDb);
  return cachedDb;
}

async function getMachinesCollection() {
  const db = await connectDb();
  return db.collection("machines");
}

export async function getAllMachines(): Promise<Machine[]> {
  const col = await getMachinesCollection();
  return col.find({}).sort({ order: 1 }).toArray() as Promise<Machine[]>;
}

export async function getMachineById(id: string): Promise<Machine | null> {
  const col = await getMachinesCollection();
  const item = await col.findOne({ _id: new ObjectId(id) });
  return item as Machine | null;
}

export async function createMachine(machine: Omit<Machine, "_id">): Promise<string> {
  const col = await getMachinesCollection();
  const result = await col.insertOne({
    ...machine,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  return result.insertedId.toString();
}

export async function updateMachine(
  id: string,
  updates: Partial<Machine>,
): Promise<boolean> {
  const col = await getMachinesCollection();
  const result = await col.updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        ...updates,
        updatedAt: new Date(),
      },
    },
  );
  return result.modifiedCount > 0;
}

export async function deleteMachine(id: string): Promise<boolean> {
  const col = await getMachinesCollection();
  const result = await col.deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount > 0;
}
