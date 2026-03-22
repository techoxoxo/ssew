"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import styles from "./hero-carousel.module.css";

type CarouselSlide = {
  id: number;
  title: string;
  subtitle: string;
  color: string;
  fallback: string;
};

const slides: CarouselSlide[] = [
  {
    id: 1,
    title: "Shawl Embroidery",
    subtitle: "Pashmina · Wool · Silk",
    color: "#8a4455",
    fallback: "Threadwork",
  },
  {
    id: 2,
    title: "Scarf Embroidery",
    subtitle: "Floral · Border · Monogram",
    color: "#C9A84C",
    fallback: "Border Art",
  },
  {
    id: 3,
    title: "Multi-Head Work",
    subtitle: "6 Machines · 107 Heads",
    color: "#6B5A47",
    fallback: "Production",
  },
  {
    id: 4,
    title: "Custom Designs",
    subtitle: "Trade Pricing · Fast Turnaround",
    color: "#A67C52",
    fallback: "Custom Work",
  },
];

type GalleryResponse = { items?: Array<{ imageUrl?: string }> };
type MachinesResponse = { machines?: Array<{ imageUrl?: string }> };

export function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [slideImages, setSlideImages] = useState<Array<string | null>>([
    null,
    null,
    null,
    null,
  ]);

  useEffect(() => {
    const loadSlideImages = async () => {
      try {
        const [galleryRes, machinesRes] = await Promise.all([
          fetch("/api/admin/gallery"),
          fetch("/api/admin/machines"),
        ]);

        const galleryData = galleryRes.ok
          ? ((await galleryRes.json()) as GalleryResponse)
          : { items: [] };
        const machinesData = machinesRes.ok
          ? ((await machinesRes.json()) as MachinesResponse)
          : { machines: [] };

        const galleryImages = (galleryData.items || [])
          .map((item) => item.imageUrl || "")
          .filter(Boolean);
        const machineImages = (machinesData.machines || [])
          .map((item) => item.imageUrl || "")
          .filter(Boolean);

        setSlideImages([
          galleryImages[0] || machineImages[0] || null,
          galleryImages[1] || machineImages[1] || galleryImages[0] || null,
          machineImages[0] || galleryImages[2] || null,
          galleryImages[2] || machineImages[1] || galleryImages[0] || null,
        ]);
      } catch {
        setSlideImages([null, null, null, null]);
      }
    };

    void loadSlideImages();
  }, []);

  useEffect(() => {
    if (!isAutoPlay) return;

    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [isAutoPlay]);

  const handleNext = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
    setIsAutoPlay(false);
  };

  const handlePrev = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
    setIsAutoPlay(false);
  };

  const goToSlide = (index: number) => {
    setCurrent(index);
    setIsAutoPlay(false);
  };

  const slide = slides[current];
  const slideImage = slideImages[current];

  return (
    <div className={styles.carousel}>
      {/* Main Slide Display */}
      <div className={styles.slideContainer}>
        <div
          className={styles.slide}
          style={{
            backgroundColor: `${slide.color}20`,
            borderColor: slide.color,
          }}
        >
          <div className={styles.mediaWrap}>
            {slideImage ? (
              <Image
                src={slideImage}
                alt={slide.title}
                fill
                sizes="(max-width: 1000px) 100vw, 45vw"
                className={styles.mediaImage}
                priority={current === 0}
              />
            ) : (
              <div className={styles.mediaFallback}>{slide.fallback}</div>
            )}
          </div>
          <div className={styles.slideContent}>
            <h2 className={styles.title}>{slide.title}</h2>
            <p className={styles.subtitle}>{slide.subtitle}</p>
            <div
              className={styles.accentLine}
              style={{ backgroundColor: slide.color }}
            />
          </div>
        </div>
      </div>

      {/* Dot Navigation */}
      <div className={styles.dots}>
        {slides.map((_, idx) => (
          <button
            key={idx}
            className={`${styles.dot} ${idx === current ? styles.active : ""}`}
            onClick={() => goToSlide(idx)}
            style={{
              backgroundColor: idx === current ? slides[current].color : "#ddd",
            }}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>

      {/* Arrow Controls */}
      <button
        className={`${styles.control} ${styles.prev}`}
        onClick={handlePrev}
        aria-label="Previous slide"
      >
        ←
      </button>
      <button
        className={`${styles.control} ${styles.next}`}
        onClick={handleNext}
        aria-label="Next slide"
      >
        →
      </button>

      {/* Slide Counter */}
      <div className={styles.counter}>
        {String(current + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
      </div>

      {/* Autoplay Toggle */}
      <button
        className={styles.playToggle}
        onClick={() => setIsAutoPlay(!isAutoPlay)}
        title={isAutoPlay ? "Pause autoplay" : "Resume autoplay"}
      >
        {isAutoPlay ? "⏸" : "▶"}
      </button>
    </div>
  );
}
