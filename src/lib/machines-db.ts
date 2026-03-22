import { Db, ObjectId, Collection } from "mongodb";
import type { Machine } from "./machines";
import getMongoClientPromise from "@/lib/mongodb";

type MachineDoc = Omit<Machine, "_id"> & {
  _id?: ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
};

let cachedDb: Db | null = null;

async function connectDb(): Promise<Db> {
  if (cachedDb) return cachedDb;

  const mongoUri = process.env.MONGODB_URI;
  const mongoDb = process.env.MONGODB_DB;

  if (!mongoUri || !mongoDb) {
    throw new Error("Missing MongoDB environment variables");
  }

  const client = await getMongoClientPromise();
  cachedDb = client.db(mongoDb);
  return cachedDb;
}

function toMachine(doc: MachineDoc): Machine {
  const { _id, ...rest } = doc;
  return {
    ...rest,
    _id: _id?.toString(),
  };
}

async function getMachinesCollection(): Promise<Collection<MachineDoc>> {
  const db = await connectDb();
  return db.collection<MachineDoc>("machines");
}

export async function getAllMachines(): Promise<Machine[]> {
  const col = await getMachinesCollection();
  const machines = await col.find({}).sort({ order: 1 }).toArray();
  return machines.map(toMachine);
}

export async function getMachineById(id: string): Promise<Machine | null> {
  const col = await getMachinesCollection();
  const item = await col.findOne({ _id: new ObjectId(id) });
  return item ? toMachine(item) : null;
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
  updates: Partial<Omit<Machine, "_id">>,
): Promise<boolean> {
  const col = await getMachinesCollection();
  const safeUpdates: Partial<Omit<MachineDoc, "_id">> = { ...updates };
  const result = await col.updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        ...safeUpdates,
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
