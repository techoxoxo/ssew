import getMongoClientPromise from "@/lib/mongodb";
import type { BlogPost } from "@/lib/blog";

export type BlogListItem = Pick<
  BlogPost,
  "title" | "slug" | "excerpt" | "coverImageUrl" | "publishedAt" | "tags"
>;

export async function getBlogCollection() {
  const client = await getMongoClientPromise();
  const db = client.db(process.env.MONGODB_DB || "ssew");
  return db.collection<BlogPost>("blogs");
}

export async function getPublishedBlogs(limit = 20): Promise<BlogListItem[]> {
  const collection = await getBlogCollection();
  return collection
    .find(
      { published: true },
      {
        projection: {
          _id: 0,
          title: 1,
          slug: 1,
          excerpt: 1,
          coverImageUrl: 1,
          publishedAt: 1,
          tags: 1,
        },
      },
    )
    .sort({ publishedAt: -1, createdAt: -1 })
    .limit(limit)
    .toArray();
}

export async function getPublishedBlogBySlug(slug: string) {
  const collection = await getBlogCollection();
  return collection.findOne(
    { slug, published: true },
    { projection: { _id: 0 } },
  );
}

export async function getPublishedBlogSlugs(limit = 500): Promise<string[]> {
  const collection = await getBlogCollection();
  const posts = await collection
    .find(
      { published: true },
      {
        projection: {
          _id: 0,
          slug: 1,
        },
      },
    )
    .sort({ publishedAt: -1, createdAt: -1 })
    .limit(limit)
    .toArray();

  return posts.map((post) => post.slug).filter(Boolean);
}
