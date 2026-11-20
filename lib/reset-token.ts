import { createHash, randomBytes } from "node:crypto";

export const RESET_TTL_MS = 60 * 60 * 1000; // 1 hour
const TOKEN = /^[A-Za-z0-9_-]{43}$/;

export const isValidResetToken = (token: string) => TOKEN.test(token);

export function hashResetToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

// Only the hash is stored. The token itself exists only in the email.
export function newResetToken() {
  const token = randomBytes(32).toString("base64url");
  return { token, tokenHash: hashResetToken(token) };
}