import crypto from "crypto";
import { cookies } from "next/headers";
import { db } from "@/lib/db";

const COOKIE_NAME = "hg_admin_session";
const SECRET = process.env.NEXTAUTH_SECRET || "hg-journal-secret-dev-random-string-98234823";

/**
 * Hash password using PBKDF2 with salt
 */
export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("hex");
  return `${salt}:${hash}`;
}

/**
 * Verify password against stored salt:hash
 */
export function verifyPassword(password: string, storedHash: string): boolean {
  if (!storedHash || !storedHash.includes(":")) return false;
  const [salt, key] = storedHash.split(":");
  const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, "sha512").toString("hex");
  return crypto.timingSafeEqual(Buffer.from(key, "hex"), Buffer.from(hash, "hex"));
}

/**
 * Sign payload to create HMAC token
 */
export function signToken(payload: object): string {
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = crypto.createHmac("sha256", SECRET).update(data).digest("base64url");
  return `${data}.${signature}`;
}

/**
 * Verify and parse HMAC token
 */
export function verifyToken<T>(token: string): T | null {
  if (!token || !token.includes(".")) return null;
  const [data, signature] = token.split(".");
  const expectedSig = crypto.createHmac("sha256", SECRET).update(data).digest("base64url");

  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig))) {
    return null;
  }

  try {
    const jsonStr = Buffer.from(data, "base64url").toString("utf8");
    return JSON.parse(jsonStr) as T;
  } catch {
    return null;
  }
}

export interface AdminSession {
  id: string;
  email: string;
  name: string;
  role: string;
}

/**
 * Get current admin session from cookie
 */
export async function getAdminSession(): Promise<AdminSession | null> {
  const cookieStore = cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (!token) return null;

  const session = verifyToken<AdminSession>(token);
  if (!session || session.role !== "ADMIN") return null;

  return session;
}

/**
 * Set admin session cookie
 */
export async function setAdminSession(user: { id: string; email: string; name?: string | null; role: string }) {
  const payload: AdminSession = {
    id: user.id,
    email: user.email,
    name: user.name || "Glory",
    role: user.role,
  };
  const token = signToken(payload);

  const cookieStore = cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

/**
 * Clear admin session cookie
 */
export async function clearAdminSession() {
  const cookieStore = cookies();
  cookieStore.delete(COOKIE_NAME);
}
