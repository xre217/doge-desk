"use client";

import { useEffect, useState } from "react";

type CreateResult = {
  id: string;
  pay_url: string;
  invoice_url: string;
  status_url: string;
  doge: number | null;
  usd: number;
  price: number | null;
  address: string | null;
  paypal_url: string | null;
  stripe_url: string | null;
  watermark: boolean;
  pro: boolean;
  rails: string[];
};

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export default function NewPayPage() {
  const [usd, setUsd] = useState("80");
  const [paypalUrl, setPaypalUrl] = useState("");
  const [stripeUrl, setStripeUrl] = useState("");
  const [address, setAddress] = useState("");
  const [doge, setDoge] = useState("");
  const [label, setLabel] = useState("Prepaid work");
  const [note, setNote] = useState(
    "Pay this invoice to start work. Reply when paid."
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<CreateResult | null>(null);
  const [pro, setPro] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/pro/status")
      .then((r) => r.json())
      .then((d) => setPro(Boolean(d.pro)))
      .catch(() => {});
    fetch("/api/defaults")
      .then((r) => r.json())
      .then((d) => {
        if (d.paypal_url) setPaypalUrl(String(d.paypal_url));
        if (d.stripe_url) setStripeUrl(String(d.stripe_url));
        if (d.doge_address) setAddress(String(d.doge_address));
        if (d.label) setLabel(String(d.label));
      })
      .catch(() => {});
  }, []);

  async function onCopy(labelKey: string, text: string) {
    const ok = await copyText(text);
    if (ok) {
      setCopied(labelKey);
      setTimeout(() => setCopied(null), 1500);
    }
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const body: Record<string, unknown> = {
        usd: parseFloat(usd),
        label: label.trim() || "Prepaid work",
        note: note.trim(),
      };
      if (paypalUrl.trim()) body.paypal_url = paypalUrl.trim();
      if (stripeUrl.trim()) body.stripe_url = stripeUrl.trim();
      if (address.trim()) body.address = address.trim();
      if (doge.trim()) body.doge = parseInt(doge, 10);

      const res = await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
      setResult(data as CreateResult);
      setPro(Boolean((data as CreateResult).pro));
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card">
      <div className="pill">{pro ? "Pro · no watermark" : "Free · watermarked"}</div>
      <h1 style={{ marginTop: "0.6rem" }}>New prepaid invoice</h1>
      <p className="lead">
        Set the USD amount and at least one payment rail. Share the pay page.
        Start work only after you see payment.
      </p>

      <form onSubmit={onSubmit}>
        <label>USD amount (locked)</label>
        <input
          type="number"
          min="0.01"
          step="any"
          value={usd}
          onChange={(e) => setUsd(e.target.value)}
          required
        />

        <label>PayPal link (paypal.me/you or full PayPal URL)</label>
        <input
          className="mono"
          value={paypalUrl}
          onChange={(e) => setPaypalUrl(e.target.value)}
          placeholder="https://paypal.me/you/80"
          autoComplete="off"
          spellCheck={false}
        />

        <label>Stripe Payment Link (optional)</label>
        <input
          className="mono"
          value={stripeUrl}
          onChange={(e) => setStripeUrl(e.target.value)}
          placeholder="https://buy.stripe.com/…"
          autoComplete="off"
          spellCheck={false}
        />

        <label>DOGE receive address (optional)</label>
        <input
          className="mono"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="D… public only — never keys"
          autoComplete="off"
          spellCheck={false}
        />

        <label>Exact DOGE override (optional, only if DOGE rail)</label>
        <input
          type="number"
          min="1"
          step="1"
          value={doge}
          onChange={(e) => setDoge(e.target.value)}
          placeholder="leave empty to lock from USD"
        />

        <label>Label</label>
        <input value={label} onChange={(e) => setLabel(e.target.value)} />

        <label>Note for payer</label>
        <textarea value={note} onChange={(e) => setNote(e.target.value)} />

        <div className="row">
          <button type="submit" disabled={loading}>
            {loading ? "Locking…" : "Create pay page"}
          </button>
          {!pro ? (
            <a className="btn secondary" href="/pricing">
              Remove watermark (Pro)
            </a>
          ) : null}
        </div>
      </form>

      {error && <p className="err">{error}</p>}

      {result && (
        <div style={{ marginTop: "1.5rem" }}>
          <p className="ok">
            Locked <strong>${result.usd}</strong>
            {result.doge != null ? ` · ${result.doge} DOGE` : ""}
            {result.price != null ? ` @ $${result.price}/DOGE` : ""}
            {" · "}
            rails: {result.rails.join(", ")}
            {result.watermark ? " · watermark on" : " · clean Pro page"}
          </p>
          <label>Share with client (pay page)</label>
          <div className="addr mono">{result.pay_url}</div>
          <div className="row" style={{ marginTop: "0.5rem" }}>
            <button
              type="button"
              className="secondary"
              onClick={() => onCopy("pay", result.pay_url)}
            >
              {copied === "pay" ? "Copied" : "Copy pay link"}
            </button>
          </div>
          <label>Merchant status (keep private)</label>
          <div className="addr mono">{result.status_url}</div>
          <div className="row" style={{ marginTop: "0.5rem" }}>
            <button
              type="button"
              className="secondary"
              onClick={() => onCopy("status", result.status_url)}
            >
              {copied === "status" ? "Copied" : "Copy status link"}
            </button>
          </div>
          <div className="row">
            <a className="btn" href={result.pay_url}>
              Open pay page
            </a>
            <a className="btn secondary" href={result.status_url}>
              Open status
            </a>
            <a className="btn secondary" href={result.invoice_url}>
              Invoice view
            </a>
          </div>
          <p className="muted" style={{ marginTop: "0.75rem" }}>
            Bookmark the status link — it proves you created this invoice. For
            DOGE, status polls the chain. For PayPal/Stripe, confirm in those
            apps then mark paid on status.
          </p>
        </div>
      )}
    </div>
  );
}
