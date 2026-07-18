import { createHmac, timingSafeEqual } from "crypto";
import type { InvoicePayload } from "./types";

function secret(): string {
  return (
    process.env.DOGE_DESK_SECRET ||
    process.env.DESK_SECRET ||
    process.env.DOGE_PAY_SECRET ||
    "dev-only-change-me-doge-desk"
  );
}

export function b64urlEncode(buf: Buffer | string): string {
  const b = Buffer.isBuffer(buf) ? buf : Buffer.from(buf, "utf8");
  return b
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

export function b64urlDecode(s: string): Buffer {
  const pad = s.length % 4 === 0 ? "" : "=".repeat(4 - (s.length % 4));
  const b64 = s.replace(/-/g, "+").replace(/_/g, "/") + pad;
  return Buffer.from(b64, "base64");
}

function hmac(data: string): string {
  return createHmac("sha256", secret()).update(data).digest("hex").slice(0, 24);
}

/** Public invoice id: payload.sig */
export function encodeInvoice(payload: InvoicePayload): string {
  const body = b64urlEncode(JSON.stringify(payload));
  const sig = hmac(body);
  return `${body}.${sig}`;
}

function isValidPayload(data: InvoicePayload): boolean {
  if (data.v === 1) {
    return Boolean(data.address && data.doge > 0);
  }
  if (data.v === 2) {
    if (!(data.usd > 0)) return false;
    const hasPaypal = Boolean(data.paypal_url);
    const hasStripe = Boolean(data.stripe_url);
    const hasDoge = Boolean(data.doge_address && data.doge_amount && data.doge_amount > 0);
    return hasPaypal || hasStripe || hasDoge;
  }
  return false;
}

export function decodeInvoice(id: string): InvoicePayload | null {
  const parts = id.split(".");
  if (parts.length !== 2) return null;
  const [body, sig] = parts;
  if (!body || !sig) return null;
  const expected = hmac(body);
  try {
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  } catch {
    return null;
  }
  try {
    const json = b64urlDecode(body).toString("utf8");
    const data = JSON.parse(json) as InvoicePayload;
    if (!isValidPayload(data)) return null;
    return data;
  } catch {
    return null;
  }
}

/** Merchant-only token bound to invoice id */
export function merchantToken(id: string): string {
  return hmac(`merchant:${id}`);
}

export function verifyMerchantToken(
  id: string,
  token: string | null | undefined
): boolean {
  if (!token) return false;
  const expected = merchantToken(id);
  try {
    const a = Buffer.from(token);
    const b = Buffer.from(expected);
    return a.length === b.length && timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

/** Pro session cookie value */
export function proSessionToken(): string {
  return hmac("desk-pro-session-v1");
}

export function verifyProSession(token: string | null | undefined): boolean {
  if (!token) return false;
  const expected = proSessionToken();
  try {
    const a = Buffer.from(token);
    const b = Buffer.from(expected);
    return a.length === b.length && timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export function verifyProUnlockCode(code: string | null | undefined): boolean {
  const expected = (process.env.DESK_PRO_CODE || "").trim();
  if (!expected || !code) return false;
  try {
    const a = Buffer.from(code.trim());
    const b = Buffer.from(expected);
    return a.length === b.length && timingSafeEqual(a, b);
  } catch {
    return false;
  }
}
