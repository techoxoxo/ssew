"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { Machine } from "@/lib/machines";

export function MachinesSection() {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMachines = async () => {
      try {
        const response = await fetch("/api/admin/machines");
        const data = (await response.json()) as { machines?: Machine[] };
        setMachines(data.machines || []);
      } catch (error) {
        console.error("Failed to fetch machines:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMachines();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "40px 20px", color: "#8a4455" }}>
        Loading machines...
      </div>
    );
  }

  if (machines.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "40px 20px", color: "#8a4455" }}>
        No machines configured yet.
      </div>
    );
  }

  return (
    <div className="machine-gallery-grid machine-gallery-grid-flat">
      {machines.map((machine) => (
        <article key={machine._id} className="machine-gallery-card">
          <div className="machine-gallery-media">
            <Image
              src={machine.imageUrl}
              alt={machine.name}
              width={960}
              height={600}
              sizes="(max-width: 680px) 100vw, (max-width: 1000px) 50vw, 33vw"
              className="machine-gallery-img"
            />
          </div>
        </article>
      ))}
    </div>
  );
}
