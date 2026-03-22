import { NextResponse } from "next/server";
import getMongoClientPromise from "@/lib/mongodb";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export async function GET() {
  try {
    const authenticated = await isAdminAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const client = await getMongoClientPromise();
    const db = client.db(process.env.MONGODB_DB || "ssew");

    const enquiries = await db
      .collection("enquiries")
      .find({}, { projection: { _id: 0 } })
      .sort({ createdAt: -1 })
      .limit(200)
      .toArray();

    return NextResponse.json({ enquiries }, { status: 200 });
  } catch {
    return NextResponse.json(
      { message: "Failed to fetch enquiries." },
      { status: 500 },
    );
  }
}
