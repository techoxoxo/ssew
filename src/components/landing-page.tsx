"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState } from "react";
import { HeroCarousel } from "./hero-carousel";
import { GallerySection } from "./gallery-section";
import { MachinesSection } from "./machines-section";

type EnquiryPayload = {
  name: string;
  businessName: string;
  phone: string;
  fabricType: string;
  designStyle: string;
  quantityRequired: string;
};

const initialForm: EnquiryPayload = {
  name: "",
  businessName: "",
  phone: "",
  fabricType: "",
  designStyle: "",
  quantityRequired: "",
};

export default function LandingPage() {
  const [formData, setFormData] = useState<EnquiryPayload>(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string>("");
  const [isError, setIsError] = useState(false);

  const whatsappLink = useMemo(() => {
    const text = encodeURIComponent(
      "Hello SSEW, I want to discuss shawl embroidery bulk requirement.",
    );
    return `https://wa.me/919915184606?text=${text}`;
  }, []);

  const updateField = (field: keyof EnquiryPayload, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage("");
    setIsError(false);

    try {
      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = (await response.json()) as { message?: string };

      if (!response.ok) {
        throw new Error(data.message || "Unable to submit enquiry.");
      }

      setMessage("Thank you! Your enquiry has been submitted successfully.");
      setFormData(initialForm);
    } catch (error) {
      setIsError(true);
      setMessage(
        error instanceof Error ? error.message : "Something went wrong.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="W embroidered-bg">
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
          <a href="#home">Home</a>
          <a href="#services">Services</a>
          <a href="#our-work">Our Work</a>
          <a href="#machines">Machines</a>
          <Link href="/blog">Blog</Link>
          <a href="#contact">Contact</a>
        </div>
        <a className="nav-cta" href="#contact">
          📞 Get Quote
        </a>
      </nav>

      <div className="hero" id="home">
        <div className="hero-left">
          <div className="hero-welcome">स्वागत है</div>
          <h1 className="hero-h1">
            Master Embroidery,
            <br />
            Woven Into
            <br />
            Every Thread
          </h1>
          <p className="hero-p">
            Industrial-grade multi-head embroidery on shawls, scarves & premium
            fabrics — precision craftsmanship trusted by fabric traders across
            India.
          </p>
          <div className="hero-btns">
            <a className="btn-p" href="#services">
              Explore Services
            </a>
            <a className="btn-o" href="#contact">
              Request Bulk Quote
            </a>
          </div>
          <div className="hero-chips">
            <span className="chip-badge">✦ 10+ Years</span>
            <span className="chip-badge">✦ 6 Machines, 107 Heads</span>
            <span className="chip-badge">✦ Bulk Orders Welcome</span>
          </div>
        </div>
        <div className="hero-right">
          <HeroCarousel />
        </div>
      </div>

      <div className="orn">◆ ──────────── ◆ ──────────── ◆</div>

      <div className="svc-sec" id="services">
        <div className="sh">
          <div className="sh-eyebrow">What We Offer</div>
          <div className="sh-title">Our Embroidery Services</div>
          <div className="sh-hindi">हमारी सेवाएं</div>
          <div className="thread-line">✶ ❋ ✶ ❋ ✶</div>
        </div>
        <div className="svc-grid">
          <div className="svc-card">
            <div className="svc-ico">🧣</div>
            <div className="svc-t">Shawl Embroidery</div>
            <div className="svc-d">
              Hand-finished & machine-precision embroidery on pashmina, wool &
              silk shawls with custom motifs and bulk-ready output.
            </div>
            <div className="chips">
              <span className="chip">Bulk Orders</span>
              <span className="chip">Custom Design</span>
              <span className="chip">Fast Turnaround</span>
            </div>
          </div>
          <div className="svc-card">
            <div className="svc-ico">🧤</div>
            <div className="svc-t">Scarf Embroidery</div>
            <div className="svc-d">
              Delicate border work, floral motifs & monogram embroidery on
              scarves of all fabric types with fine thread quality.
            </div>
            <div className="chips">
              <span className="chip">All Fabrics</span>
              <span className="chip">Fine Threadwork</span>
              <span className="chip">Trade Pricing</span>
            </div>
          </div>
          <div className="svc-card">
            <div className="svc-ico">⚙️</div>
            <div className="svc-t">Multi-Head Machine Work</div>
            <div className="svc-d">
              6 high-speed computerized machines with up to 20 heads each —
              built for large volume, consistent quality orders.
            </div>
            <div className="chips">
              <span className="chip">Industrial Scale</span>
              <span className="chip">Precision</span>
              <span className="chip">Low Lead Time</span>
            </div>
          </div>
        </div>
      </div>

      <div className="bulk">
        📦 Bulk orders from 500 pieces welcome — Contact us for exclusive trade
        pricing
      </div>

      <div className="gallery-sec" id="our-work">
        <div className="sh">
          <div className="sh-eyebrow">Our Craftsmanship</div>
          <div className="sh-title">Embroidery Styles We Make</div>
          <div className="sh-hindi">धागों में बुनी कहानियाँ</div>
          <div className="thread-line">❖ ✶ ❖ ✶ ❖</div>
        </div>
        <GallerySection />
      </div>

      <div className="machine-sec" id="machines">
        <div className="sh">
          <div className="sh-eyebrow">Our Equipment</div>
          <div className="sh-title">Industrial Embroidery Machines</div>
          <div className="sh-hindi">हमारी मशीनें</div>
          <div className="thread-line">✦ ✢ ✦ ✢ ✦</div>
        </div>
        <MachinesSection />
      </div>

      <div className="why-sec">
        <div className="sh">
          <div className="sh-eyebrow">Why Choose Us</div>
          <div className="sh-title">Fabric Traders Trust SSEW</div>
          <div className="sh-hindi">क्यों चुनें हमें?</div>
          <div className="thread-line">✶ ❁ ✶ ❁ ✶</div>
        </div>
        <div className="why-grid">
          <div className="why-item">
            <div className="why-ico">📦</div>
            <div className="why-t">Bulk Ready</div>
            <div className="why-d">
              500 to 50,000 pieces delivered on time every time
            </div>
          </div>
          <div className="why-item">
            <div className="why-ico">💰</div>
            <div className="why-t">Trade Pricing</div>
            <div className="why-d">
              Special rates for wholesalers, traders & exporters
            </div>
          </div>
          <div className="why-item">
            <div className="why-ico">✅</div>
            <div className="why-t">Quality Assured</div>
            <div className="why-d">
              Every piece inspected before packing & dispatch
            </div>
          </div>
          {/* <div className="why-item">
            <div className="why-ico">🚚</div>
            <div className="why-t">Fast Dispatch</div>
            <div className="why-d">
              Pan-India shipping with express delivery slots
            </div>
          </div> */}
        </div>
      </div>

      <div className="stats">
        <div className="stat">
          <div className="stat-n">10+</div>
          <div className="stat-l">Years in Business</div>
        </div>
        <div className="stat">
          <div className="stat-n">6</div>
          <div className="stat-l">Machines</div>
        </div>
        <div className="stat">
          <div className="stat-n">107</div>
          <div className="stat-l">Total Heads</div>
        </div>
        <div className="stat">
          <div className="stat-n">5lac+</div>
          <div className="stat-l">Pieces Delivered</div>
        </div>
      </div>

      <div className="contact-sec" id="contact">
        <div className="contact-l">
          <span className="contact-hi">बात करें हमसे</span>
          <div className="thread-line thread-left">✢ ✦ ✢ ✦ ✢</div>
          <div className="crow">
            <div className="cico">📞</div>
            <span className="ctext">+919915184606, +917973446434</span>
          </div>
          <div className="crow">
            <div className="cico">💬</div>
            <span className="ctext">WhatsApp Available</span>
          </div>
          <div className="crow">
            <div className="cico">✉️</div>
            <span className="ctext">satish.ms411@gmail.com</span>
          </div>
          <div className="crow">
            <div className="cico">📍</div>
            <span className="ctext">Amritsar, Punjab (Near Apex Hospital)</span>
          </div>
          <div className="crow">
            <div className="cico">🕐</div>
            <span className="ctext">Mon–Sat, 9AM–7PM</span>
          </div>
          <a className="wa-btn" href={whatsappLink} target="_blank" rel="noreferrer">
            💬 Chat on WhatsApp
          </a>
          <div className="map-card">
            <div className="map-title">Find Us on Map</div>
            <iframe
              className="map-frame"
              title="SSEW Location Near Apex Hospital Amritsar"
              src="https://www.google.com/maps?q=Apex+Hospital+Amritsar&output=embed"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <a
              className="map-link"
              href="https://www.google.com/maps/search/?api=1&query=Apex+Hospital+Amritsar"
              target="_blank"
              rel="noreferrer"
            >
              Open in Google Maps ↗
            </a>
          </div>
        </div>
        <div className="contact-r">
          <div
            style={{
              fontFamily: "Playfair Display, serif",
              fontSize: "20px",
              color: "#6B1A2B",
              fontWeight: 700,
              marginBottom: "18px",
            }}
          >
            Request a Quote
          </div>
          <form className="f-sec" onSubmit={handleSubmit}>
            <div className="f-row">
              <div>
                <label htmlFor="name">Your Name</label>
                <input
                  id="name"
                  placeholder="Full name"
                  value={formData.name}
                  onChange={(event) => updateField("name", event.target.value)}
                />
              </div>
              <div>
                <label htmlFor="businessName">Business Name</label>
                <input
                  id="businessName"
                  placeholder="Firm / Shop name"
                  value={formData.businessName}
                  onChange={(event) =>
                    updateField("businessName", event.target.value)
                  }
                />
              </div>
            </div>
            <div className="f-row">
              <div>
                <label htmlFor="phone">Phone / WhatsApp</label>
                <input
                  id="phone"
                  placeholder="+91 XXXXX XXXXX"
                  value={formData.phone}
                  onChange={(event) => updateField("phone", event.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="fabricType">Fabric Type</label>
                <select
                  id="fabricType"
                  value={formData.fabricType}
                  onChange={(event) =>
                    updateField("fabricType", event.target.value)
                  }
                >
                  <option value="" disabled>
                    Select fabric
                  </option>
                  <option>Pashmina</option>
                  <option>Silk</option>
                  <option>Wool</option>
                  <option>Chiffon</option>
                  <option>Net</option>
                </select>
              </div>
            </div>
            <div className="f-row">
              <div>
                <label htmlFor="designStyle">Design Style</label>
                <select
                  id="designStyle"
                  value={formData.designStyle}
                  onChange={(event) =>
                    updateField("designStyle", event.target.value)
                  }
                >
                  <option value="" disabled>
                    Select style
                  </option>
                  <option>Jaal Work</option>
                  <option>Jaam Work</option>
                  <option>Four Side Kunj</option>
                  <option>Buta / Boota</option>
                  <option>Paisley / Keri</option>
                  <option>Full Cover</option>
                  <option>Custom Design</option>
                </select>
              </div>
              <div>
                <label htmlFor="quantityRequired">Quantity Required</label>
                <input
                  id="quantityRequired"
                  placeholder="e.g. 500 pieces"
                  value={formData.quantityRequired}
                  onChange={(event) =>
                    updateField("quantityRequired", event.target.value)
                  }
                />
              </div>
            </div>
            <button className="f-sub" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Sending..." : "Send Enquiry →"}
            </button>
            <p className="f-hint">हम 24 घंटे में जवाब देते हैं</p>
            {message ? (
              <p className={`f-msg ${isError ? "err" : "ok"}`}>{message}</p>
            ) : null}
          </form>
        </div>
      </div>

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
            <a href="#home">Home</a>
            <a href="#services">Services</a>
            <a href="#our-work">Our Work</a>
            <a href="#machines">Machines</a>
            <Link href="/blog">Blog</Link>
            <a href="#contact">Contact</a>
          </div>
          <div className="ft-col">
            <h4>Design Styles</h4>
            <a href="#our-work">Jaal Work</a>
            <a href="#our-work">Jaam Work</a>
            <a href="#our-work">Four Side Kunj</a>
            <a href="#our-work">Buta / Boota</a>
            <a href="#our-work">Full Cover Work</a>
          </div>
          <div className="ft-col">
            <h4>Contact</h4>
            <a href="#contact">📞 +91 9915184606</a>
            <a href="#contact">💬 WhatsApp</a>
            <a href="mailto:satish.ms411@gmail.com">✉️ satish.ms411@gmail.com</a>
            <a href="#contact">📍 Amritsar, Near Apex Hospital</a>
          </div>
        </div>
        <div className="footer-bar">
          © 2026 Sunita Sharma Embroidery Works (SSEW) · Made with 🧵 in India
        </div>
      </div>
    </div>
  );
}
