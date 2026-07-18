import type { InvoicePayload, NormalizedInvoice } from "./types";

export function normalizeInvoice(inv: InvoicePayload): NormalizedInvoice {
  if (inv.v === 1) {
    return {
      version: 1,
      usd: inv.usd,
      label: inv.label,
      note: inv.note,
      created_at: inv.created_at,
      watermark: inv.watermark !== false,
      paypal_url: null,
      stripe_url: null,
      doge: {
        address: inv.address,
        amount: inv.doge,
        price: inv.price,
      },
      rails: ["doge"],
    };
  }

  const rails: NormalizedInvoice["rails"] = [];
  if (inv.paypal_url) rails.push("paypal");
  if (inv.stripe_url) rails.push("stripe");
  const doge =
    inv.doge_address && inv.doge_amount != null && inv.doge_amount > 0
      ? {
          address: inv.doge_address,
          amount: inv.doge_amount,
          price: inv.doge_price ?? 0,
        }
      : null;
  if (doge) rails.push("doge");

  return {
    version: 2,
    usd: inv.usd,
    label: inv.label,
    note: inv.note,
    created_at: inv.created_at,
    watermark: inv.watermark !== false,
    paypal_url: inv.paypal_url || null,
    stripe_url: inv.stripe_url || null,
    doge,
    rails,
  };
}

const PAYPAL_OK =
  /^https:\/\/(www\.)?(paypal\.me|paypal\.com|www\.paypal\.com)\//i;
const STRIPE_OK =
  /^https:\/\/(buy\.stripe\.com|checkout\.stripe\.com|invoice\.stripe\.com)\//i;

export function sanitizePaypalUrl(raw: string | undefined): string | null {
  const u = (raw || "").trim();
  if (!u) return null;
  if (!PAYPAL_OK.test(u)) {
    // allow paypal.me/user without scheme
    if (/^paypal\.me\//i.test(u)) return `https://${u}`;
    if (/^https:\/\/paypal\.me\//i.test(u)) return u;
    return null;
  }
  return u;
}

export function sanitizeStripeUrl(raw: string | undefined): string | null {
  const u = (raw || "").trim();
  if (!u) return null;
  if (!STRIPE_OK.test(u)) return null;
  return u;
}

export function formatUsd(n: number | null): string {
  if (n == null || Number.isNaN(n)) return "—";
  return `$${n.toLocaleString(undefined, {
    minimumFractionDigits: n % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  })}`;
}
