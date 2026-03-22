# SSEW Website (Next.js)

Production-ready landing website for Sunita Sharma Embroidery Works (SSEW) with:

- Exact custom landing-page UI
- Enquiry form implementation
- Next.js API route for form submissions
- MongoDB storage for enquiries
- Blog system (public blog pages + admin publishing page)
- Cloudflare R2 image storage for blog cover images
- SEO metadata + JSON-LD + robots + sitemap

## Tech Stack

- Next.js 16 (App Router, TypeScript)
- React 19
- MongoDB Node driver
- CSS (custom styles from provided UI)

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create local environment file:

```bash
cp .env.example .env.local
```

On Windows PowerShell use:

```powershell
Copy-Item .env.example .env.local
```

3. Update `.env.local` with real values:

- `MONGODB_URI`
- `MONGODB_DB`
- `NEXT_PUBLIC_SITE_URL`
- `R2_ACCOUNT_ID`
- `R2_ACCESS_KEY_ID`
- `R2_SECRET_ACCESS_KEY`
- `R2_BUCKET`
- `R2_PUBLIC_BASE_URL`
- `ADMIN_PASSWORD`
- `ADMIN_SESSION_SECRET`

4. Run development server:

```bash
npm run dev
```

Open `http://localhost:3000`.

## API

### `POST /api/enquiries`

Stores enquiry data in MongoDB collection `enquiries`.

Required fields:

- `name`
- `businessName`
- `phone`
- `fabricType`
- `designStyle`
- `quantityRequired`

### `GET /api/blogs`

Returns published blog posts.

### `POST /api/blogs`

Creates a blog post (requires authenticated admin session cookie).

### `POST /api/upload-image`

Uploads an image to Cloudflare R2 and returns a public URL (requires authenticated admin session cookie).

### `POST /api/admin/login`

Logs in admin using `ADMIN_PASSWORD` and sets an HTTP-only session cookie.

### `POST /api/admin/logout`

Clears admin session cookie.

### `GET /api/admin/enquiries`

Returns latest website enquiries for the admin dashboard.

### `GET /api/admin/blogs`

Returns all blog posts (including drafts) for admin dashboard.

## Blog System

- Public blog list: `/blog`
- Public blog detail: `/blog/[slug]`
- Admin publish page: `/admin/blog`

Admin flow:

1. Open `/admin/blog`
2. Login with `ADMIN_PASSWORD`
3. Use tabs for Publish Blog, Enquiries, and Blog Posts
4. Submit to upload image to R2 and publish post

## Production

```bash
npm run build
npm start
```

## Notes

- Replace placeholder contact details in the UI with actual business details.
- Keep MongoDB credentials in environment variables only.
