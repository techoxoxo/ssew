import { NextResponse } from "next/server";
import { parseTags, sanitizeText, slugify, type BlogPost } from "@/lib/blog";
import { getBlogCollection, getPublishedBlogs } from "@/lib/blogs-db";
import { isAdminAuthenticated } from "@/lib/admin-auth";

type CreateBlogBody = {
  title?: unknown;
  excerpt?: unknown;
  content?: unknown;
  coverImageUrl?: unknown;
  tags?: unknown;
  published?: unknown;
};

async function createUniqueSlug(baseSlug: string) {
  const collection = await getBlogCollection();
  let slug = baseSlug;
  let suffix = 2;

  while (await collection.findOne({ slug }, { projection: { _id: 1 } })) {
    slug = `${baseSlug}-${suffix}`;
    suffix += 1;
  }

  return slug;
}

export async function GET() {
  try {
    const posts = await getPublishedBlogs();
    return NextResponse.json({ posts }, { status: 200 });
  } catch {
    return NextResponse.json({ message: "Failed to fetch blogs." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const authenticated = await isAdminAuthenticated();
    if (!authenticated) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = (await request.json()) as CreateBlogBody;

    const title = typeof body.title === "string" ? sanitizeText(body.title) : "";
    const excerpt = typeof body.excerpt === "string" ? sanitizeText(body.excerpt) : "";
    const content = typeof body.content === "string" ? body.content.trim() : "";
    const coverImageUrl =
      typeof body.coverImageUrl === "string" ? sanitizeText(body.coverImageUrl) : "";
    const tags = parseTags(body.tags);
    const published = typeof body.published === "boolean" ? body.published : true;

    if (!title || !excerpt || !content || !coverImageUrl) {
      return NextResponse.json(
        { message: "Title, excerpt, content, and cover image are required." },
        { status: 400 },
      );
    }

    const baseSlug = slugify(title);
    if (!baseSlug) {
      return NextResponse.json({ message: "Invalid blog title." }, { status: 400 });
    }

    const slug = await createUniqueSlug(baseSlug);
    const now = new Date();

    const post: BlogPost = {
      title,
      slug,
      excerpt,
      content,
      coverImageUrl,
      tags,
      createdAt: now,
      updatedAt: now,
      published,
      publishedAt: published ? now : null,
    };

    const collection = await getBlogCollection();
    await collection.insertOne(post);

    return NextResponse.json({ post }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Failed to create blog." },
      { status: 500 },
    );
  }
}
