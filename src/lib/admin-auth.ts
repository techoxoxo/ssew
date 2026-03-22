import crypto from "crypto";
import { cookies } from "next/headers";

export const ADMIN_SESSION_COOKIE = "sseb_admin_session";
const DEFAULT_SESSION_HOURS = 12;

function requireEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function getSessionSecret() {
  return process.env.ADMIN_SESSION_SECRET || requireEnv("ADMIN_PASSWORD");
}

export function getAdminPassword() {
  return requireEnv("ADMIN_PASSWORD");
}

function base64UrlEncode(value: string) {
  return Buffer.from(value, "utf8").toString("base64url");
}

function base64UrlDecode(value: string) {
  return Buffer.from(value, "base64url").toString("utf8");
}

function sign(payload: string) {
  return crypto
    .createHmac("sha256", getSessionSecret())
    .update(payload)
    .digest("hex");
}

export function createAdminSessionToken(hours = DEFAULT_SESSION_HOURS) {
  const expiresAt = Date.now() + hours * 60 * 60 * 1000;
  const nonce = crypto.randomBytes(16).toString("hex");
  const payload = `${expiresAt}:${nonce}`;
  const encodedPayload = base64UrlEncode(payload);
  const signature = sign(encodedPayload);
  return `${encodedPayload}.${signature}`;
}

export function verifyAdminSessionToken(token: string) {
  const [encodedPayload, signature] = token.split(".");
  if (!encodedPayload || !signature) return false;

  const expectedSignature = sign(encodedPayload);
  const signatureBuffer = Buffer.from(signature, "utf8");
  const expectedBuffer = Buffer.from(expectedSignature, "utf8");
  if (signatureBuffer.length !== expectedBuffer.length) return false;

  if (!crypto.timingSafeEqual(signatureBuffer, expectedBuffer)) return false;

  const decoded = base64UrlDecode(encodedPayload);
  const [expiresAtRaw] = decoded.split(":");
  const expiresAt = Number(expiresAtRaw);

  if (!Number.isFinite(expiresAt)) return false;
  return Date.now() < expiresAt;
}

export async function isAdminAuthenticated() {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;
  if (!token) return false;
  return verifyAdminSessionToken(token);
}
