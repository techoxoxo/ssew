import { NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { getBlogCollection } from "@/lib/blogs-db";

export async function GET() {
  try {
    const authenticated = await isAdminAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const collection = await getBlogCollection();
    const posts = await collection
      .find(
        {},
        {
          projection: {
            _id: 0,
            title: 1,
            slug: 1,
            excerpt: 1,
            coverImageUrl: 1,
            tags: 1,
            createdAt: 1,
            publishedAt: 1,
            published: 1,
          },
        },
      )
      .sort({ createdAt: -1 })
      .limit(200)
      .toArray();

    return NextResponse.json({ posts }, { status: 200 });
  } catch {
    return NextResponse.json({ message: "Failed to fetch blogs." }, { status: 500 });
  }
}
