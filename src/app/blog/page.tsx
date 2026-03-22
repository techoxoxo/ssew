import Link from "next/link";
import Image from "next/image";
import Script from "next/script";
import type { Metadata } from "next";
import { getPublishedBlogs } from "@/lib/blogs-db";
import styles from "./blog.module.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Read SSEW blog for embroidery trends, machine insights, bulk production tips, and fabric care guides.",
  keywords: [
    "embroidery blog",
    "shawl embroidery guide",
    "scarf embroidery tips",
    "industrial embroidery insights",
    "bulk embroidery production",
  ],
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "SSEW Blog | Embroidery Insights & Guides",
    description:
      "Read SSEW blog for embroidery trends, machine insights, bulk production tips, and fabric care guides.",
    url: "/blog",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SSEW Blog | Embroidery Insights & Guides",
    description:
      "Read SSEW blog for embroidery trends, machine insights, bulk production tips, and fabric care guides.",
  },
};

function formatDate(value: Date | null) {
  if (!value) return "Draft";
  return new Intl.DateTimeFormat("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(value));
}

export default async function BlogListPage() {
  const posts = await getPublishedBlogs(50);
  const blogListSchema = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "SSEW Blog",
    description:
      "Embroidery trends, machine insights, bulk production tips, and fabric care guides from SSEW.",
    url: "https://www.ssew.in/blog",
    blogPost: posts.map((post, index) => ({
      "@type": "BlogPosting",
      position: index + 1,
      headline: post.title,
      url: `https://www.ssew.in/blog/${post.slug}`,
      image: post.coverImageUrl,
      datePublished: post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined,
      keywords: post.tags,
    })),
  };

  return (
    <div className={`${styles.page} W embroidered-bg`}>
      <Script
        id="blog-list-json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogListSchema) }}
      />
      <nav className="nav">
        <div className="nav-logo">
          <div className="logo-ring">
            <Image
              src="/Screenshot_4.png"
              alt="SSEW logo"
              width={48}
              height={48}
              className="logo-img"
              priority
            />
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
        <section className={styles.hero}>
          <h1 className={styles.title}>SSEW Blog</h1>
          <p className={styles.subtitle}>
            Embroidery trends, production updates, and fabric care tips.
          </p>
        </section>

        {posts.length === 0 ? (
          <p className={styles.empty}>No posts published yet.</p>
        ) : (
          <div className={styles.grid}>
            {posts.map((post) => (
              <article key={post.slug} className={styles.card}>
                <div className={styles.coverWrap}>
                  <Image
                    src={post.coverImageUrl}
                    alt={post.title}
                    width={1200}
                    height={675}
                    sizes="(max-width: 900px) 100vw, 50vw"
                    className={styles.cover}
                  />
                </div>
                <div className={styles.cardBody}>
                  <p className={styles.date}>{formatDate(post.publishedAt)}</p>
                  <h2 className={styles.cardTitle}>{post.title}</h2>
                  <p className={styles.excerpt}>{post.excerpt}</p>
                  <Link href={`/blog/${post.slug}`} className={styles.readMore}>
                    Read more →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
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
