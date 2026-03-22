import { MongoClient, Db, ObjectId } from "mongodb";
import type { GalleryItem } from "./gallery";

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

async function getGalleryCollection() {
  const db = await connectDb();
  return db.collection("gallery");
}

export async function getAllGalleryItems(): Promise<GalleryItem[]> {
  const col = await getGalleryCollection();
  return col.find({}).sort({ order: 1 }).toArray() as Promise<GalleryItem[]>;
}

export async function getGalleryItemById(id: string): Promise<GalleryItem | null> {
  const col = await getGalleryCollection();
  const item = await col.findOne({ _id: new ObjectId(id) });
  return item as GalleryItem | null;
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
  updates: Partial<GalleryItem>,
): Promise<boolean> {
  const col = await getGalleryCollection();
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
