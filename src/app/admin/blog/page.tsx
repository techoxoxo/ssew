"use client";

import Image from "next/image";
import { FormEvent, useEffect, useState } from "react";
import styles from "./admin.module.css";

type StatusState = { type: "idle" | "ok" | "error"; message: string };
type TabName = "publish" | "enquiries" | "blogs" | "gallery" | "machines";

type GalleryItem = {
  _id?: string;
  name: string;
  hindiName: string;
  description: string;
  imageUrl: string;
  label?: string;
  order: number;
};

type Machine = {
  _id?: string;
  name: string;
  hindiName: string;
  heads: number;
  quantity: number;
  imageUrl: string;
  specifications: string[];
  order: number;
};

type EnquiryRow = {
  name: string;
  businessName: string;
  phone: string;
  fabricType: string;
  designStyle: string;
  quantityRequired: string;
  createdAt?: string;
};

type BlogRow = {
  title: string;
  slug: string;
  excerpt: string;
  coverImageUrl: string;
  tags: string[];
  published: boolean;
  publishedAt: string | null;
};

export default function AdminBlogPage() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [tab, setTab] = useState<TabName>("publish");

  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState("");
  const [published, setPublished] = useState(true);
  const [file, setFile] = useState<File | null>(null);

  const [status, setStatus] = useState<StatusState>({ type: "idle", message: "" });
  const [loading, setLoading] = useState(false);
  const [enquiries, setEnquiries] = useState<EnquiryRow[]>([]);
  const [blogs, setBlogs] = useState<BlogRow[]>([]);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([]);
  const [galleryName, setGalleryName] = useState("");
  const [galleryHindi, setGalleryHindi] = useState("");
  const [galleryDesc, setGalleryDesc] = useState("");
  const [galleryLabel, setGalleryLabel] = useState("");
  const [galleryFile, setGalleryFile] = useState<File | null>(null);

  const [machines, setMachines] = useState<Machine[]>([]);
  const [machineName, setMachineName] = useState("");
  const [machineHindi, setMachineHindi] = useState("");
  const [machineHeads, setMachineHeads] = useState("20");
  const [machineQuantity, setMachineQuantity] = useState("1");
  const [machineSpecs, setMachineSpecs] = useState("");
  const [machineFile, setMachineFile] = useState<File | null>(null);

  const checkSession = async () => {
    const response = await fetch("/api/admin/session");
    const data = (await response.json()) as { authenticated?: boolean };
    setIsAuthenticated(Boolean(data.authenticated));
    return Boolean(data.authenticated);
  };

  const fetchEnquiries = async () => {
    const response = await fetch("/api/admin/enquiries");
    if (!response.ok) return;
    const data = (await response.json()) as { enquiries?: EnquiryRow[] };
    setEnquiries(data.enquiries || []);
  };

  const fetchBlogs = async () => {
    const response = await fetch("/api/admin/blogs");
    if (!response.ok) return;
    const data = (await response.json()) as { posts?: BlogRow[] };
    setBlogs(data.posts || []);
  };

  const fetchGalleryItems = async () => {
    const response = await fetch("/api/admin/gallery");
    if (!response.ok) return;
    const data = (await response.json()) as { items?: GalleryItem[] };
    setGalleryItems(data.items || []);
  };

  const fetchMachines = async () => {
    const response = await fetch("/api/admin/machines");
    if (!response.ok) return;
    const data = (await response.json()) as { machines?: Machine[] };
    setMachines(data.machines || []);
  };

  useEffect(() => {
    void checkSession().then((authenticated) => {
      if (authenticated) {
        void fetchEnquiries();
        void fetchBlogs();
        void fetchGalleryItems();
        void fetchMachines();
      }
    });
  }, []);

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus({ type: "idle", message: "" });

    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    const data = (await response.json()) as { message?: string };
    if (!response.ok) {
      setStatus({ type: "error", message: data.message || "Login failed." });
      return;
    }

    setPassword("");
    setIsAuthenticated(true);
    setStatus({ type: "ok", message: "Login successful." });
    await fetchEnquiries();
    await fetchBlogs();
    await fetchGalleryItems();
    await fetchMachines();
  };

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    setIsAuthenticated(false);
    setStatus({ type: "idle", message: "" });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus({ type: "idle", message: "" });

    if (!file) {
      setStatus({ type: "error", message: "Select a cover image." });
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const uploadResponse = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      });

      const uploadData = (await uploadResponse.json()) as {
        message?: string;
        url?: string;
      };

      if (!uploadResponse.ok || !uploadData.url) {
        throw new Error(uploadData.message || "Failed to upload image.");
      }

      const createResponse = await fetch("/api/blogs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          excerpt,
          content,
          coverImageUrl: uploadData.url,
          tags: tags
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean),
          published,
        }),
      });

      const createData = (await createResponse.json()) as { message?: string };
      if (!createResponse.ok) {
        throw new Error(createData.message || "Failed to create blog post.");
      }

      setStatus({ type: "ok", message: "Blog published successfully." });
      setTitle("");
      setExcerpt("");
      setContent("");
      setTags("");
      setFile(null);
      await fetchBlogs();
    } catch (error) {
      setStatus({
        type: "error",
        message: error instanceof Error ? error.message : "Something went wrong.",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (value?: string | null) => {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "-";
    return new Intl.DateTimeFormat("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  if (!isAuthenticated) {
    return (
      <main className={styles.page}>
        <div className={styles.container}>
          <section className={`${styles.card} ${styles.panel}`}>
            <h1 className={styles.title}>Admin Login</h1>
            <p className={styles.subtitle}>
              Enter your admin password to manage blog posts and view enquiries.
            </p>
            <form className={styles.row} onSubmit={handleLogin}>
              <div>
                <label className={styles.label} htmlFor="password">
                  Password
                </label>
                <input
                  className={styles.input}
                  id="password"
                  type="password"
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
              </div>
              <button className={`${styles.btn} ${styles.primary}`} type="submit">
                Login
              </button>
            </form>
            {status.message ? (
              <p className={status.type === "error" ? styles.messageErr : styles.messageOk}>
                {status.message}
              </p>
            ) : null}
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <section className={styles.card}>
          <header className={styles.header}>
            <div>
              <h1 className={styles.title}>SSEW Admin Dashboard</h1>
              <p className={styles.subtitle}>Manage blogs and monitor enquiries in one place.</p>
            </div>
            <button className={`${styles.btn} ${styles.ghost}`} onClick={handleLogout}>
              Logout
            </button>
          </header>
          <div className={styles.tabBar}>
            <button
              className={`${styles.tab} ${tab === "publish" ? styles.tabActive : ""}`}
              onClick={() => setTab("publish")}
            >
              Publish Blog
            </button>
            <button
              className={`${styles.tab} ${tab === "enquiries" ? styles.tabActive : ""}`}
              onClick={() => {
                setTab("enquiries");
                void fetchEnquiries();
              }}
            >
              Enquiries ({enquiries.length})
            </button>
            <button
              className={`${styles.tab} ${tab === "blogs" ? styles.tabActive : ""}`}
              onClick={() => {
                setTab("blogs");
                void fetchBlogs();
              }}
            >
              Blog Posts ({blogs.length})
            </button>
            <button
              className={`${styles.tab} ${tab === "gallery" ? styles.tabActive : ""}`}
              onClick={() => {
                setTab("gallery");
                void fetchGalleryItems();
              }}
            >
              Gallery ({galleryItems.length})
            </button>
            <button
              className={`${styles.tab} ${tab === "machines" ? styles.tabActive : ""}`}
              onClick={() => {
                setTab("machines");
                void fetchMachines();
              }}
            >
              Machines ({machines.length})
            </button>
          </div>
        </section>

        {tab === "publish" ? (
          <section className={`${styles.card} ${styles.panel}`}>
            <form className={styles.row} onSubmit={handleSubmit}>
              <div className={`${styles.row} ${styles.twoCol}`}>
                <div>
                  <label className={styles.label}>Title</label>
                  <input
                    className={styles.input}
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className={styles.label}>Tags (comma separated)</label>
                  <input
                    className={styles.input}
                    value={tags}
                    onChange={(event) => setTags(event.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className={styles.label}>Short Excerpt</label>
                <input
                  className={styles.input}
                  value={excerpt}
                  onChange={(event) => setExcerpt(event.target.value)}
                  required
                />
              </div>

              <div>
                <label className={styles.label}>Blog Content</label>
                <textarea
                  className={styles.textarea}
                  value={content}
                  onChange={(event) => setContent(event.target.value)}
                  required
                />
              </div>

              <div className={`${styles.row} ${styles.twoCol}`}>
                <div>
                  <label className={styles.label}>Cover Image</label>
                  <input
                    className={styles.file}
                    type="file"
                    accept="image/*"
                    onChange={(event) => setFile(event.target.files?.[0] || null)}
                    required
                  />
                </div>
                <label className={styles.label} style={{ marginTop: 28 }}>
                  <input
                    type="checkbox"
                    checked={published}
                    onChange={(event) => setPublished(event.target.checked)}
                    style={{ marginRight: 8 }}
                  />
                  Publish immediately
                </label>
              </div>

              <button className={`${styles.btn} ${styles.primary}`} type="submit" disabled={loading}>
                {loading ? "Publishing..." : "Upload & Publish"}
              </button>
            </form>
            {status.message ? (
              <p className={status.type === "error" ? styles.messageErr : styles.messageOk}>
                {status.message}
              </p>
            ) : null}
          </section>
        ) : null}

        {tab === "enquiries" ? (
          <section className={`${styles.card} ${styles.panel}`}>
            {enquiries.length === 0 ? (
              <p className={styles.empty}>No enquiries found yet.</p>
            ) : (
              <div className={styles.list}>
                {enquiries.map((entry, index) => (
                  <article className={styles.item} key={`${entry.phone}-${index}`}>
                    <h3 className={styles.itemTitle}>{entry.name}</h3>
                    <p className={styles.meta}>
                      {entry.businessName} · {entry.phone} · {formatDate(entry.createdAt)}
                    </p>
                    <p className={styles.meta}>
                      Fabric: {entry.fabricType} | Design: {entry.designStyle} | Qty: {entry.quantityRequired}
                    </p>
                  </article>
                ))}
              </div>
            )}
          </section>
        ) : null}

        {tab === "blogs" ? (
          <section className={`${styles.card} ${styles.panel}`}>
            {blogs.length === 0 ? (
              <p className={styles.empty}>No blog posts available.</p>
            ) : (
              <div className={styles.list}>
                {blogs.map((post) => (
                  <article className={styles.item} key={post.slug}>
                    <h3 className={styles.itemTitle}>{post.title}</h3>
                    <p className={styles.meta}>
                      /blog/{post.slug} · {post.published ? "Published" : "Draft"} · {formatDate(post.publishedAt)}
                    </p>
                    <p className={styles.meta}>{post.excerpt}</p>
                    {post.tags?.map((tag) => (
                      <span className={styles.badge} key={`${post.slug}-${tag}`}>
                        {tag}
                      </span>
                    ))}
                  </article>
                ))}
              </div>
            )}
          </section>
        ) : null}

        {tab === "gallery" ? (
          <section className={`${styles.card} ${styles.panel}`}>
            <form
              className={styles.row}
              onSubmit={async (event) => {
                event.preventDefault();
                setStatus({ type: "idle", message: "" });
                setLoading(true);

                if (!galleryFile) {
                  setStatus({ type: "error", message: "Please upload an image." });
                  setLoading(false);
                  return;
                }

                const formData = new FormData();
                formData.append("file", galleryFile);

                const uploadRes = await fetch("/api/upload-image", {
                  method: "POST",
                  body: formData,
                });

                const uploadData = (await uploadRes.json()) as { url?: string; message?: string };
                if (!uploadRes.ok) {
                  setStatus({
                    type: "error",
                    message: uploadData.message || "Image upload failed.",
                  });
                  setLoading(false);
                  return;
                }

                const imageUrl = uploadData.url || "";
                const order = galleryItems.length + 1;

                const createRes = await fetch("/api/admin/gallery", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    name: galleryName,
                    hindiName: galleryHindi,
                    description: galleryDesc,
                    imageUrl,
                    label: galleryLabel || undefined,
                    order,
                  }),
                });

                if (!createRes.ok) {
                  const errData = (await createRes.json()) as { message?: string };
                  setStatus({
                    type: "error",
                    message: errData.message || "Failed to create gallery item.",
                  });
                  setLoading(false);
                  return;
                }

                setStatus({
                  type: "ok",
                  message: "Gallery item added successfully!",
                });
                setGalleryName("");
                setGalleryHindi("");
                setGalleryDesc("");
                setGalleryLabel("");
                setGalleryFile(null);
                await fetchGalleryItems();
                setLoading(false);
              }}
            >
              <h3 className={styles.subTitle}>Add New Gallery Item</h3>

              <div className={`${styles.row} ${styles.twoCol}`}>
                <div>
                  <label className={styles.label}>Design Name</label>
                  <input
                    className={styles.input}
                    value={galleryName}
                    onChange={(event) => setGalleryName(event.target.value)}
                    placeholder="e.g. Jaal Work"
                    required
                  />
                </div>
                <div>
                  <label className={styles.label}>Hindi Name</label>
                  <input
                    className={styles.input}
                    value={galleryHindi}
                    onChange={(event) => setGalleryHindi(event.target.value)}
                    placeholder="e.g. जाल"
                    required
                  />
                </div>
              </div>

              <div>
                <label className={styles.label}>Description</label>
                <textarea
                  className={styles.textarea}
                  value={galleryDesc}
                  onChange={(event) => setGalleryDesc(event.target.value)}
                  placeholder="Describe this embroidery style..."
                  required
                />
              </div>

              <div className={`${styles.row} ${styles.twoCol}`}>
                <div>
                  <label className={styles.label}>Design Image</label>
                  <input
                    className={styles.input}
                    type="file"
                    accept="image/*"
                    onChange={(event) =>
                      setGalleryFile(event.target.files?.[0] || null)
                    }
                    required
                  />
                </div>
                <div>
                  <label className={styles.label}>Label (Optional)</label>
                  <input
                    className={styles.input}
                    value={galleryLabel}
                    onChange={(event) => setGalleryLabel(event.target.value)}
                    placeholder="e.g. POPULAR, TRENDING"
                  />
                </div>
              </div>

              <button
                className={`${styles.btn} ${styles.primary}`}
                type="submit"
                disabled={loading}
              >
                {loading ? "Adding..." : "Add to Gallery"}
              </button>

              {status.message ? (
                <p
                  className={
                    status.type === "error" ? styles.messageErr : styles.messageOk
                  }
                >
                  {status.message}
                </p>
              ) : null}
            </form>

            <hr className={styles.divider} />

            {galleryItems.length === 0 ? (
              <p className={styles.empty}>No gallery items yet.</p>
            ) : (
              <div className={styles.list}>
                {galleryItems.map((item) => (
                  <article className={styles.item} key={item._id}>
                    <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        width={60}
                        height={60}
                        style={{
                          width: "60px",
                          height: "60px",
                          objectFit: "cover",
                          borderRadius: "6px",
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <h3 className={styles.itemTitle}>
                          {item.name} {item.label ? `(${item.label})` : ""}
                        </h3>
                        <p className={styles.meta}>{item.hindiName}</p>
                        <p className={styles.meta}>{item.description}</p>
                        <button
                          className={`${styles.btn} ${styles.danger}`}
                          onClick={async () => {
                            if (!item._id) return;
                            const res = await fetch(`/api/admin/gallery/${item._id}`, {
                              method: "DELETE",
                            });
                            if (res.ok) {
                              await fetchGalleryItems();
                            }
                          }}
                          style={{ marginTop: "8px" }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        ) : null}

        {tab === "machines" ? (
          <section className={`${styles.card} ${styles.panel}`}>
            <form
              className={styles.row}
              onSubmit={async (event) => {
                event.preventDefault();
                setStatus({ type: "idle", message: "" });
                setLoading(true);

                if (!machineFile) {
                  setStatus({ type: "error", message: "Please upload a machine image." });
                  setLoading(false);
                  return;
                }

                const heads = Number(machineHeads);
                const quantity = Number(machineQuantity);
                if (!Number.isFinite(heads) || heads <= 0) {
                  setStatus({ type: "error", message: "Heads must be a valid number greater than 0." });
                  setLoading(false);
                  return;
                }
                if (!Number.isFinite(quantity) || quantity <= 0) {
                  setStatus({ type: "error", message: "Quantity must be a valid number greater than 0." });
                  setLoading(false);
                  return;
                }

                const formData = new FormData();
                formData.append("file", machineFile);

                const uploadRes = await fetch("/api/upload-image", {
                  method: "POST",
                  body: formData,
                });

                const uploadData = (await uploadRes.json()) as { url?: string; message?: string };
                if (!uploadRes.ok || !uploadData.url) {
                  setStatus({
                    type: "error",
                    message: uploadData.message || "Machine image upload failed.",
                  });
                  setLoading(false);
                  return;
                }

                const specifications = machineSpecs
                  .split(/\r?\n|,/) 
                  .map((item) => item.trim())
                  .filter(Boolean);

                const createRes = await fetch("/api/admin/machines", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    name: machineName,
                    hindiName: machineHindi,
                    heads,
                    quantity,
                    imageUrl: uploadData.url,
                    specifications,
                    order: machines.length + 1,
                  }),
                });

                if (!createRes.ok) {
                  const errData = (await createRes.json()) as { message?: string };
                  setStatus({
                    type: "error",
                    message: errData.message || "Failed to create machine.",
                  });
                  setLoading(false);
                  return;
                }

                setStatus({
                  type: "ok",
                  message: "Machine added successfully!",
                });
                setMachineName("");
                setMachineHindi("");
                setMachineHeads("20");
                setMachineQuantity("1");
                setMachineSpecs("");
                setMachineFile(null);
                await fetchMachines();
                setLoading(false);
              }}
            >
              <h3 className={styles.subTitle}>Add New Machine</h3>

              <div className={`${styles.row} ${styles.twoCol}`}>
                <div>
                  <label className={styles.label}>Machine Name</label>
                  <input
                    className={styles.input}
                    value={machineName}
                    onChange={(event) => setMachineName(event.target.value)}
                    placeholder="e.g. TAJIMA TFMX-C1501"
                    required
                  />
                </div>
                <div>
                  <label className={styles.label}>Hindi Name</label>
                  <input
                    className={styles.input}
                    value={machineHindi}
                    onChange={(event) => setMachineHindi(event.target.value)}
                    placeholder="e.g. तजिमा"
                    required
                  />
                </div>
              </div>

              <div className={`${styles.row} ${styles.twoCol}`}>
                <div>
                  <label className={styles.label}>Heads</label>
                  <input
                    className={styles.input}
                    type="number"
                    min={1}
                    value={machineHeads}
                    onChange={(event) => setMachineHeads(event.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className={styles.label}>Quantity</label>
                  <input
                    className={styles.input}
                    type="number"
                    min={1}
                    value={machineQuantity}
                    onChange={(event) => setMachineQuantity(event.target.value)}
                    required
                  />
                </div>
              </div>

              <div>
                <label className={styles.label}>Specifications (comma or new-line separated)</label>
                <textarea
                  className={styles.textarea}
                  value={machineSpecs}
                  onChange={(event) => setMachineSpecs(event.target.value)}
                  placeholder="e.g. 15 Needles\n1200 Stitches Per Minute"
                />
              </div>

              <div>
                <label className={styles.label}>Machine Image</label>
                <input
                  className={styles.input}
                  type="file"
                  accept="image/*"
                  onChange={(event) => setMachineFile(event.target.files?.[0] || null)}
                  required
                />
              </div>

              <button className={`${styles.btn} ${styles.primary}`} type="submit" disabled={loading}>
                {loading ? "Adding..." : "Add Machine"}
              </button>

              {status.message ? (
                <p className={status.type === "error" ? styles.messageErr : styles.messageOk}>
                  {status.message}
                </p>
              ) : null}
            </form>

            <hr className={styles.divider} />

            {machines.length === 0 ? (
              <p className={styles.empty}>No machines yet.</p>
            ) : (
              <div className={styles.list}>
                {machines.map((machine) => (
                  <article className={styles.item} key={machine._id}>
                    <div style={{ display: "flex", gap: "12px", alignItems: "flex-start" }}>
                      <Image
                        src={machine.imageUrl}
                        alt={machine.name}
                        width={60}
                        height={60}
                        style={{
                          width: "60px",
                          height: "60px",
                          objectFit: "cover",
                          borderRadius: "6px",
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <h3 className={styles.itemTitle}>{machine.name}</h3>
                        <p className={styles.meta}>
                          {machine.hindiName} · {machine.heads} Heads · Qty {machine.quantity}
                        </p>
                        {machine.specifications.map((spec, index) => (
                          <p className={styles.meta} key={`${machine._id || machine.name}-spec-${index}`}>
                            • {spec}
                          </p>
                        ))}
                        <button
                          className={`${styles.btn} ${styles.danger}`}
                          onClick={async () => {
                            if (!machine._id) return;
                            const res = await fetch(`/api/admin/machines/${machine._id}`, {
                              method: "DELETE",
                            });
                            if (res.ok) {
                              await fetchMachines();
                            }
                          }}
                          style={{ marginTop: "8px" }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        ) : null}
      </div>
    </main>
  );
}
