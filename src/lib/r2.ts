import { S3Client } from "@aws-sdk/client-s3";

let r2Client: S3Client | null = null;

function requireEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

export function getR2Client() {
  if (r2Client) return r2Client;

  const accountId = requireEnv("R2_ACCOUNT_ID");
  const accessKeyId = requireEnv("R2_ACCESS_KEY_ID");
  const secretAccessKey = requireEnv("R2_SECRET_ACCESS_KEY");

  r2Client = new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  });

  return r2Client;
}

export function getR2Bucket() {
  return requireEnv("R2_BUCKET");
}

export function getR2PublicUrl(key: string) {
  const base = requireEnv("R2_PUBLIC_BASE_URL").replace(/\/$/, "");
  return `${base}/${key}`;
}

export function assertAdminToken(token: string | null) {
  const configured = process.env.BLOG_ADMIN_TOKEN;
  if (!configured) {
    throw new Error("Missing BLOG_ADMIN_TOKEN environment variable");
  }
  return token === configured;
}
