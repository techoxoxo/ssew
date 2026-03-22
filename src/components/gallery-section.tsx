"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { GalleryItem } from "@/lib/gallery";

export function GallerySection() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const response = await fetch("/api/admin/gallery");
        const data = (await response.json()) as { items?: GalleryItem[] };
        setItems(data.items || []);
      } catch (error) {
        console.error("Failed to fetch gallery:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "40px 20px", color: "#8a4455" }}>
        Loading gallery...
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "40px 20px", color: "#8a4455" }}>
        No gallery items yet.
      </div>
    );
  }

  return (
    <div className="gallery-grid gallery-grid-flat">
      {items.map((item) => (
        <article key={item._id} className="work-card">
          <div className="work-top">
            <div className="work-media">
              <Image
                src={item.imageUrl}
                alt={item.name}
                width={800}
                height={520}
                sizes="(max-width: 680px) 100vw, (max-width: 1000px) 50vw, 25vw"
                className="work-img"
              />
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
