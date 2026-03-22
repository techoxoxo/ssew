import Script from "next/script";
import type { Metadata } from "next";
import LandingPage from "@/components/landing-page";

export const metadata: Metadata = {
  title: "Shawl Embroidery Services in India",
  description:
    "SSEW offers industrial shawl and scarf embroidery services with bulk capacity, custom designs, and trade pricing.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Shawl Embroidery Services in India",
    description:
      "SSEW offers industrial shawl and scarf embroidery services with bulk capacity, custom designs, and trade pricing.",
    url: "/",
    type: "website",
    images: [
      {
        url: "/Screenshot_4.png",
        width: 512,
        height: 512,
        alt: "Sunita Sharma Embroidery Works logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Shawl Embroidery Services in India",
    description:
      "SSEW offers industrial shawl and scarf embroidery services with bulk capacity, custom designs, and trade pricing.",
    images: ["/Screenshot_4.png"],
  },
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: "Sunita Sharma Embroidery Works",
  alternateName: "SSEW",
  description:
    "Industrial-grade embroidery service for shawls, scarves, and premium fabrics.",
  telephone: "+91-9915184606",
  email: "satish.ms411@gmail.com",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Amritsar",
    addressRegion: "Punjab",
    addressCountry: "IN",
  },
  areaServed: ["Punjab", "India"],
  priceRange: "₹₹",
  serviceType: "Shawl and scarf embroidery services",
  contactPoint: [
    {
      "@type": "ContactPoint",
      telephone: "+91-9915184606",
      contactType: "customer service",
      areaServed: "IN",
      availableLanguage: ["en", "hi"],
    },
  ],
  url: "https://www.ssew.in",
  logo: "https://www.ssew.in/Screenshot_4.png",
};

export default function Home() {
  return (
    <>
      <Script
        id="local-business-json-ld"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      <LandingPage />
    </>
  );
}
