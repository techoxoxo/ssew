import Link from "next/link";
import Image from "next/image";
import Script from "next/script";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublishedBlogBySlug, getPublishedBlogSlugs } from "@/lib/blogs-db";
import styles from "../blog.module.css";

type Params = { slug: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedBlogBySlug(slug);

  if (!post) {
    return { title: "Blog not found" };
  }

  return {
    title: post.title,
    description: post.excerpt,
    keywords: post.tags,
    alternates: {
      canonical: `/blog/${slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url: `/blog/${slug}`,
      type: "article",
      images: post.coverImageUrl
        ? [
            {
              url: post.coverImageUrl,
              alt: post.title,
            },
          ]
        : undefined,
      publishedTime: post.publishedAt
        ? new Date(post.publishedAt).toISOString()
        : undefined,
      authors: ["SSEW"],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: post.coverImageUrl ? [post.coverImageUrl] : undefined,
    },
  };
}

export async function generateStaticParams() {
  const slugs = await getPublishedBlogSlugs(500);
  return slugs.map((slug) => ({ slug }));
}

function dateLabel(value: Date | null) {
  if (!value) return "Draft";
  return new Intl.DateTimeFormat("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(value));
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const post = await getPublishedBlogBySlug(slug);

  if (!post) notFound();

  const blogPostingSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: post.coverImageUrl,
    datePublished: post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined,
    dateModified: post.updatedAt ? new Date(post.updatedAt).toISOString() : undefined,
    author: {
      "@type": "Organization",
      name: "Sunita Sharma Embroidery Works",
    },
    publisher: {
      "@type": "Organization",
      name: "Sunita Sharma Embroidery Works",
    },
    mainEntityOfPage: `https://www.ssew.in/blog/${post.slug}`,
    keywords: post.tags,
    articleBody: post.content,
  };

  return (
    <div className={`${styles.page} W embroidered-bg`}>
      <Script
        id="blog-posting-json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogPostingSchema) }}
      />
      <nav className="nav">
        <div className="nav-logo">
          <div className="logo-ring">
            <span>SS</span>
          </div>
          <div>
            <div className="brand-name">Sunita Sharma Embroidery Works</div>
            <div className="brand-tag">कढ़ाई में कला, धागे में जान · SSEW</div>
          </div>
        </div>
        <div className="nav-links">
          <Link href="/#home">Home</Link>
          <Link href="/#services">Services</Link>
          <Link href="/#our-work">Our Work</Link>
          <Link href="/#machines">Machines</Link>
          <Link href="/blog">Blog</Link>
          <Link href="/#contact">Contact</Link>
        </div>
        <Link className="nav-cta" href="/#contact">
          📞 Get Quote
        </Link>
      </nav>

      <main className={styles.main}>
        <article className={styles.article}>
          <Link href="/blog" className={styles.back}>← Back to blog</Link>
          <h1 className={styles.detailTitle}>{post.title}</h1>
          <p className={styles.detailDate}>{dateLabel(post.publishedAt)}</p>
          <div className={styles.detailCoverWrap}>
            <Image
              src={post.coverImageUrl}
              alt={post.title}
              width={1200}
              height={700}
              sizes="(max-width: 768px) 100vw, 1120px"
              priority
              className={styles.detailCover}
            />
          </div>
          <article className={styles.content}>{post.content}</article>
        </article>
      </main>

      <div className="footer">
        <div className="footer-grid">
          <div className="ft-brand">
            <h3>Sunita Sharma Embroidery Works</h3>
            <div className="ft-brand-tag">कढ़ाई में कला</div>
            <p>
              Premium embroidery services for shawls, scarves & fabrics. 6
              industrial machines, 107 heads — built for traders across India.
            </p>
          </div>
          <div className="ft-col">
            <h4>Navigation</h4>
            <Link href="/#home">Home</Link>
            <Link href="/#services">Services</Link>
            <Link href="/#our-work">Our Work</Link>
            <Link href="/#machines">Machines</Link>
            <Link href="/blog">Blog</Link>
            <Link href="/#contact">Contact</Link>
          </div>
          <div className="ft-col">
            <h4>Design Styles</h4>
            <Link href="/#our-work">Jaal Work</Link>
            <Link href="/#our-work">Jaam Work</Link>
            <Link href="/#our-work">Four Side Kunj</Link>
            <Link href="/#our-work">Buta / Boota</Link>
            <Link href="/#our-work">Full Cover Work</Link>
          </div>
          <div className="ft-col">
            <h4>Contact</h4>
            <Link href="/#contact">📞 +91 9915184606</Link>
            <Link href="/#contact">💬 WhatsApp</Link>
            <Link href="mailto:satish.ms411@gmail.com">✉️ satish.ms411@gmail.com</Link>
            <Link href="/#contact">📍 Amritsar, Near Apex Hospital</Link>
          </div>
        </div>
        <div className="footer-bar">
          © 2026 Sunita Sharma Embroidery Works (SSEW) · Made with 🧵 in India
        </div>
      </div>
    </div>
  );
}
