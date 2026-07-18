import { NextResponse } from "next/server";

export const runtime = "nodejs";

/** Merchant prefills for create form (public-safe values only). */
export async function GET() {
  return NextResponse.json({
    paypal_url: process.env.NEXT_PUBLIC_DEFAULT_PAYPAL_URL || null,
    stripe_url: process.env.NEXT_PUBLIC_DEFAULT_STRIPE_URL || null,
    doge_address: process.env.NEXT_PUBLIC_DEFAULT_DOGE_ADDRESS || null,
    label: process.env.NEXT_PUBLIC_DEFAULT_LABEL || "Prepaid work",
  });
}
