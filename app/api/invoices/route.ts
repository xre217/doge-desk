import { NextRequest, NextResponse } from "next/server";
import { encodeInvoice, merchantToken } from "@/lib/crypto";
import { lookalikeDogeAddress, spotPrice, usdToDoge } from "@/lib/doge";
import {
  sanitizePaypalUrl,
  sanitizeStripeUrl,
} from "@/lib/invoice";
import { isProSession } from "@/lib/pro";
import { rateLimit } from "@/lib/rate-limit";
import type { InvoicePayloadV2 } from "@/lib/types";

export const runtime = "nodejs";

/** Prefer env / reverse-proxy headers so pay links work behind tunnels & Vercel. */
function publicOrigin(req: NextRequest): string {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (configured) return configured;

  const xfHost = req.headers.get("x-forwarded-host");
  const xfProto = req.headers.get("x-forwarded-proto") || "https";
  if (xfHost) return `${xfProto.split(",")[0].trim()}://${xfHost.split(",")[0].trim()}`;

  const host = req.headers.get("host");
  if (host && !host.startsWith("localhost") && !host.startsWith("127.0.0.1")) {
    const proto = xfProto.split(",")[0].trim() || "https";
    return `${proto}://${host}`;
  }

  return req.nextUrl.origin;
}

export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";
  const limited = rateLimit(`inv:${ip}`, 40, 60_000);
  if (!limited.ok) {
    return NextResponse.json(
      { error: "rate limited — try again shortly" },
      {
        status: 429,
        headers: { "Retry-After": String(limited.retryAfterSec) },
      }
    );
  }

  let body: {
    address?: string;
    usd?: number;
    doge?: number;
    label?: string;
    note?: string;
    paypal_url?: string;
    stripe_url?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid JSON body" }, { status: 400 });
  }

  const paypal_url = sanitizePaypalUrl(body.paypal_url) || undefined;
  const stripe_url = sanitizeStripeUrl(body.stripe_url) || undefined;
  const address = (body.address || "").trim();
  const hasDogeAddr = Boolean(address);

  if (hasDogeAddr && !lookalikeDogeAddress(address)) {
    return NextResponse.json(
      {
        error:
          "invalid Dogecoin receive address (expect classic D… address, public only)",
      },
      { status: 400 }
    );
  }

  if (!paypal_url && !stripe_url && !hasDogeAddr) {
    return NextResponse.json(
      {
        error:
          "add at least one payment rail: PayPal link, Stripe payment link, or DOGE address",
      },
      { status: 400 }
    );
  }

  let usd: number | null =
    body.usd != null && Number(body.usd) > 0 ? Number(body.usd) : null;
  let doge_amount: number | undefined;
  let doge_price: number | undefined;

  if (hasDogeAddr) {
    let price: number;
    try {
      price = await spotPrice();
    } catch (e) {
      return NextResponse.json(
        {
          error: `DOGE quote failed: ${e instanceof Error ? e.message : String(e)}`,
        },
        { status: 502 }
      );
    }
    doge_price = price;

    if (body.doge != null && Number(body.doge) > 0) {
      doge_amount = Math.ceil(Number(body.doge));
      if (usd == null) {
        usd = Math.round(doge_amount * price * 100) / 100;
      }
    } else if (usd != null) {
      doge_amount = usdToDoge(usd, price);
    } else {
      return NextResponse.json(
        { error: "provide usd or doge amount when using DOGE rail" },
        { status: 400 }
      );
    }
  }

  if (usd == null || !(usd > 0)) {
    return NextResponse.json(
      { error: "provide usd > 0 (required for multi-rail invoices)" },
      { status: 400 }
    );
  }

  // Free tier always watermarked. Pro session may omit watermark.
  const pro = await isProSession();
  const watermark = !pro;

  const payload: InvoicePayloadV2 = {
    v: 2,
    usd,
    label: (body.label || "Prepaid invoice").slice(0, 120),
    note: (body.note || "").slice(0, 500),
    created_at: new Date().toISOString(),
    watermark,
    paypal_url,
    stripe_url,
    doge_address: hasDogeAddr ? address : undefined,
    doge_amount,
    doge_price,
  };

  const id = encodeInvoice(payload);
  const token = merchantToken(id);
  const origin = publicOrigin(req);

  return NextResponse.json({
    id,
    usd,
    doge: doge_amount ?? null,
    price: doge_price ?? null,
    address: hasDogeAddr ? address : null,
    paypal_url: paypal_url ?? null,
    stripe_url: stripe_url ?? null,
    watermark,
    pro,
    rails: [
      ...(paypal_url ? ["paypal"] : []),
      ...(stripe_url ? ["stripe"] : []),
      ...(hasDogeAddr ? ["doge"] : []),
    ],
    pay_url: `${origin}/p/${id}`,
    invoice_url: `${origin}/i/${id}`,
    status_url: `${origin}/status/${id}?t=${token}`,
    merchant_token: token,
    created_at: payload.created_at,
  });
}
