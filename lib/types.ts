/** Legacy DOGE-only signed payload */
export type InvoicePayloadV1 = {
  v: 1;
  address: string;
  doge: number;
  usd: number | null;
  price: number;
  label: string;
  note: string;
  created_at: string;
  watermark: boolean;
};

/** Multi-rail prepaid invoice (PayPal / Stripe link / DOGE) */
export type InvoicePayloadV2 = {
  v: 2;
  usd: number;
  label: string;
  note: string;
  created_at: string;
  /** Free tier always true; Pro may set false */
  watermark: boolean;
  paypal_url?: string;
  stripe_url?: string;
  doge_address?: string;
  doge_amount?: number;
  doge_price?: number;
};

export type InvoicePayload = InvoicePayloadV1 | InvoicePayloadV2;

export type CreateInvoiceInput = {
  usd?: number;
  doge?: number;
  label?: string;
  note?: string;
  /** DOGE receive address (optional if fiat rails present) */
  address?: string;
  paypal_url?: string;
  stripe_url?: string;
};

/** Unified view for UI + status */
export type NormalizedInvoice = {
  version: 1 | 2;
  usd: number | null;
  label: string;
  note: string;
  created_at: string;
  watermark: boolean;
  paypal_url: string | null;
  stripe_url: string | null;
  doge: { address: string; amount: number; price: number } | null;
  rails: ("paypal" | "stripe" | "doge")[];
};
