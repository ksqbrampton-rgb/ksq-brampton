/**
 * Field-level encryption for sensitive PII (PIPEDA / NDPR).
 *
 * AES-256-GCM via Node's built-in crypto — no dependency. Ciphertext is stored
 * as "iv:authTag:data" (base64 parts). Email also gets a deterministic blind
 * index (HMAC-SHA256) so it can stay unique and be looked up without exposing
 * the plaintext.
 *
 * Key: FIELD_ENCRYPTION_KEY — 32 bytes as 64 hex chars.
 */

import crypto from "crypto";

const ALGO = "aes-256-gcm";

function getKey(): Buffer {
  const hex = process.env.FIELD_ENCRYPTION_KEY;
  if (!hex || hex.length !== 64) {
    throw new Error("FIELD_ENCRYPTION_KEY must be set to 32 bytes (64 hex chars).");
  }
  return Buffer.from(hex, "hex");
}

/** Does a stored value have our ciphertext shape (iv:tag:data)? */
function looksEncrypted(v: string): boolean {
  return v.split(":").length === 3;
}

export function encrypt(plain: string): string {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv(ALGO, getKey(), iv);
  const enc = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `${iv.toString("base64")}:${tag.toString("base64")}:${enc.toString("base64")}`;
}

export function decrypt(payload: string): string {
  const [ivB64, tagB64, dataB64] = payload.split(":");
  if (!ivB64 || !tagB64 || dataB64 === undefined) {
    throw new Error("Malformed ciphertext.");
  }
  const decipher = crypto.createDecipheriv(ALGO, getKey(), Buffer.from(ivB64, "base64"));
  decipher.setAuthTag(Buffer.from(tagB64, "base64"));
  const dec = Buffer.concat([decipher.update(Buffer.from(dataB64, "base64")), decipher.final()]);
  return dec.toString("utf8");
}

export function encryptNullable(v: string | null | undefined): string | null {
  if (v == null || v === "") return null;
  return encrypt(v);
}

/**
 * Decrypt a stored value. Plaintext (legacy / non-ciphertext) is passed through
 * untouched, and a decrypt failure degrades to returning the raw value (logged)
 * rather than throwing — so one bad row never takes down an admin list.
 */
export function decryptNullable(v: string | null | undefined): string | null {
  if (v == null) return null;
  if (!looksEncrypted(v)) return v;
  try {
    return decrypt(v);
  } catch (err) {
    console.error("[encryption] decrypt failed:", err);
    return v;
  }
}

/** Deterministic blind index for email — used for uniqueness + lookup. */
export function emailHash(email: string): string {
  const normalized = email.trim().toLowerCase();
  return crypto.createHmac("sha256", getKey()).update(normalized).digest("hex");
}

// ── helpers to decrypt nested objects at the API boundary ──

/** Return a copy of a guest with email/phone decrypted. */
export function withDecryptedGuest<G extends { email: string; phone: string | null }>(guest: G): G {
  return {
    ...guest,
    email: decryptNullable(guest.email) ?? guest.email,
    phone: decryptNullable(guest.phone),
  };
}

/** Return a copy of an application with ninNumber decrypted. */
export function withDecryptedNin<A extends { ninNumber: string | null }>(app: A): A {
  return { ...app, ninNumber: decryptNullable(app.ninNumber) };
}
