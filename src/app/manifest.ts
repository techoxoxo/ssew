import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Sunita Sharma Embroidery Works",
    short_name: "SSEW",
    description:
      "Industrial shawl and scarf embroidery services with multi-head machine capacity for bulk orders.",
    start_url: "/",
    display: "standalone",
    background_color: "#faf3e0",
    theme_color: "#6b1a2b",
    lang: "en-IN",
    icons: [
      {
        src: "/icon.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
