import { NextRequest, NextResponse } from "next/server";
import { decodeInvoice, verifyMerchantToken } from "@/lib/crypto";
import { recentReceives } from "@/lib/doge";
import { normalizeInvoice } from "@/lib/invoice";

export const runtime = "nodejs";

export async function GET(
  req: NextRequest,
  ctx: { params: Promise<{ id: string }> }
) {
  const { id: rawId } = await ctx.params;
  const id = decodeURIComponent(rawId);
  const token = req.nextUrl.searchParams.get("t");

  if (!verifyMerchantToken(id, token)) {
    return NextResponse.json(
      { error: "unauthorized — merchant token required" },
      { status: 401 }
    );
  }

  const inv = decodeInvoice(id);
  if (!inv) {
    return NextResponse.json({ error: "invalid invoice id" }, { status: 404 });
  }

  const n = normalizeInvoice(inv);
  let dogePayment: {
    txid: string;
    doge: number;
    confirmations: number;
  } | null = null;

  if (n.doge) {
    dogePayment = await recentReceives(n.doge.address, n.doge.amount);
  }

  const status = dogePayment ? "paid" : "open";

  return NextResponse.json({
    status,
    usd: n.usd,
    rails: n.rails,
    doge_expected: n.doge?.amount ?? null,
    address: n.doge?.address ?? null,
    payment: dogePayment,
    fiat_note:
      n.rails.some((r) => r === "paypal" || r === "stripe") && !dogePayment
        ? "Fiat rails: check PayPal/Stripe yourself, then mark paid in this browser (local)."
        : null,
    checked_at: new Date().toISOString(),
  });
}
