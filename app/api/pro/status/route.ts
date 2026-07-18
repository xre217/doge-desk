import { NextResponse } from "next/server";
import { isProSession } from "@/lib/pro";

export const runtime = "nodejs";

export async function GET() {
  const pro = await isProSession();
  return NextResponse.json({
    pro,
    price_usd_mo: 12,
    stripe_pro_url: process.env.NEXT_PUBLIC_STRIPE_PRO_URL || null,
    paypal_pro_url: process.env.NEXT_PUBLIC_PAYPAL_PRO_URL || null,
  });
}
