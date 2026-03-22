import { Db, ObjectId, Collection } from "mongodb";
import type { GalleryItem } from "./gallery";
import getMongoClientPromise from "@/lib/mongodb";

type GalleryDoc = Omit<GalleryItem, "_id"> & {
  _id?: ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
};

let cachedDb: Db | null = null;

async function connectDb(): Promise<Db> {
  if (cachedDb) return cachedDb;

  const mongoUri = process.env.MONGODB_URI;
  const mongoDb = process.env.MONGODB_DB || "SSEW";

  if (!mongoUri) {
    throw new Error("Missing MongoDB environment variable: MONGODB_URI");
  }

  const client = await getMongoClientPromise();
  cachedDb = client.db(mongoDb);
  return cachedDb;
}

function toGalleryItem(doc: GalleryDoc): GalleryItem {
  const { _id, ...rest } = doc;
  return {
    ...rest,
    _id: _id?.toString(),
  };
}

async function getGalleryCollection(): Promise<Collection<GalleryDoc>> {
  const db = await connectDb();
  return db.collection<GalleryDoc>("gallery");
}

export async function getAllGalleryItems(): Promise<GalleryItem[]> {
  const col = await getGalleryCollection();
  const items = await col.find({}).sort({ order: 1 }).toArray();
  return items.map(toGalleryItem);
}

export async function getGalleryItemById(id: string): Promise<GalleryItem | null> {
  const col = await getGalleryCollection();
  const item = await col.findOne({ _id: new ObjectId(id) });
  return item ? toGalleryItem(item) : null;
}

export async function createGalleryItem(item: Omit<GalleryItem, "_id">): Promise<string> {
  const col = await getGalleryCollection();
  const result = await col.insertOne({
    ...item,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  return result.insertedId.toString();
}

export async function updateGalleryItem(
  id: string,
  updates: Partial<Omit<GalleryItem, "_id">>,
): Promise<boolean> {
  const col = await getGalleryCollection();
  const safeUpdates: Partial<Omit<GalleryDoc, "_id">> = { ...updates };
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

export async function deleteGalleryItem(id: string): Promise<boolean> {
  const col = await getGalleryCollection();
  const result = await col.deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount > 0;
}

export async function reorderGalleryItems(items: Array<{ id: string; order: number }>): Promise<void> {
  const col = await getGalleryCollection();
  const updates = items.map((item) =>
    col.updateOne(
      { _id: new ObjectId(item.id) },
      { $set: { order: item.order, updatedAt: new Date() } },
    ),
  );
  await Promise.all(updates);
}
