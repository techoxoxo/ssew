import { NextResponse } from "next/server";
import { getPublishedBlogBySlug } from "@/lib/blogs-db";

export async function GET(
  _request: Request,
  context: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await context.params;
    const post = await getPublishedBlogBySlug(slug);

    if (!post) {
      return NextResponse.json({ message: "Blog not found." }, { status: 404 });
    }

    return NextResponse.json({ post }, { status: 200 });
  } catch {
    return NextResponse.json({ message: "Failed to fetch blog." }, { status: 500 });
  }
}
