import type { NextConfig } from "next";

const envBaseUrl = process.env.NEXT_PUBLIC_R2_BASE_URL;
const envHostname = envBaseUrl
  ? (() => {
      try {
        return new URL(envBaseUrl).hostname;
      } catch {
        return undefined;
      }
    })()
  : undefined;

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.r2.dev",
      },
      {
        protocol: "https",
        hostname: "**.r2.cloudflarestorage.com",
      },
      ...(envHostname
        ? [
            {
              protocol: "https" as const,
              hostname: envHostname,
            },
          ]
        : []),
    ],
  },
};

export default nextConfig;
