export type BlogPost = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImageUrl: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  publishedAt: Date | null;
  published: boolean;
};

export function sanitizeText(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

export function slugify(value: string) {
  return sanitizeText(value)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export function parseTags(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((tag) => (typeof tag === "string" ? sanitizeText(tag) : ""))
    .filter(Boolean)
    .slice(0, 10);
}
