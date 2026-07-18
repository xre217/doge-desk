import { NextRequest, NextResponse } from "next/server";
import { verifyProUnlockCode } from "@/lib/crypto";
import { proCookieOptions } from "@/lib/pro";

export const runtime = "nodejs";

/**
 * Unlock Pro for this browser via DESK_PRO_CODE.
 * After a real Stripe/PayPal Pro payment, you hand the buyer the code
 * (or wire webhooks later). Self-test: set DESK_PRO_CODE in env.
 */
export async function POST(req: NextRequest) {
  let body: { code?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid JSON" }, { status: 400 });
  }

  if (!verifyProUnlockCode(body.code)) {
    return NextResponse.json(
      { error: "invalid unlock code" },
      { status: 401 }
    );
  }

  const opt = proCookieOptions();
  const res = NextResponse.json({
    ok: true,
    pro: true,
    message: "Pro unlocked on this browser. New invoices omit watermark.",
  });
  res.cookies.set(opt.name, opt.value, {
    httpOnly: opt.httpOnly,
    sameSite: opt.sameSite,
    secure: opt.secure,
    path: opt.path,
    maxAge: opt.maxAge,
  });
  return res;
}

export async function GET() {
  const hasCode = Boolean((process.env.DESK_PRO_CODE || "").trim());
  const stripe = process.env.NEXT_PUBLIC_STRIPE_PRO_URL || null;
  const paypal = process.env.NEXT_PUBLIC_PAYPAL_PRO_URL || null;
  return NextResponse.json({
    unlock_configured: hasCode,
    stripe_pro_url: stripe,
    paypal_pro_url: paypal,
    price_usd_mo: 12,
  });
}
