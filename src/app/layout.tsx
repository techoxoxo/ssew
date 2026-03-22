import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.ssew.in"),
  applicationName: "SSEW",
  title: {
    default: "Sunita Sharma Embroidery Works | Shawl Embroidery Services",
    template: "%s | SSEW",
  },
  description:
    "Premium shawl and scarf embroidery services with 6 industrial multi-head machines and bulk order capacity across India.",
  keywords: [
    "shawl embroidery",
    "scarf embroidery",
    "bulk embroidery services",
    "Amritsar embroidery",
    "industrial embroidery India",
    "pashmina embroidery",
    "multi-head embroidery machines",
    "custom embroidery services",
    "SSEW",
  ],
  authors: [{ name: "Sunita Sharma Embroidery Works" }],
  creator: "Sunita Sharma Embroidery Works",
  publisher: "Sunita Sharma Embroidery Works",
  category: "Textile Embroidery Services",
  formatDetection: {
    telephone: true,
    address: true,
    email: true,
  },
  alternates: {
    canonical: "/",
    languages: {
      "en-IN": "/",
      "hi-IN": "/",
      "x-default": "/",
    },
  },
  openGraph: {
    title: "Sunita Sharma Embroidery Works (SSEW)",
    description:
      "Industrial-grade multi-head embroidery on shawls, scarves, and premium fabrics for fabric traders across India.",
    url: "https://www.ssew.in",
    siteName: "Sunita Sharma Embroidery Works",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sunita Sharma Embroidery Works (SSEW)",
    description:
      "Bulk-ready embroidery services for shawls and scarves with consistent industrial output.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: "/icon.png",
    shortcut: "/icon.png",
    apple: "/apple-icon.png",
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Sunita Sharma Embroidery Works",
  alternateName: "SSEW",
  url: "https://www.ssew.in",
  logo: "https://www.ssew.in/Screenshot_4.png",
  email: "satish.ms411@gmail.com",
  telephone: "+91-9915184606",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Amritsar",
    addressRegion: "Punjab",
    addressCountry: "IN",
  },
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Sunita Sharma Embroidery Works",
  alternateName: "SSEW",
  url: "https://www.ssew.in",
  inLanguage: ["en-IN", "hi-IN"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        {children}
      </body>
    </html>
  );
}
