"use client";

import { useEffect, useState } from "react";

export default function PricingPage() {
  const [pro, setPro] = useState(false);
  const [stripeUrl, setStripeUrl] = useState<string | null>(null);
  const [paypalUrl, setPaypalUrl] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function refresh() {
    fetch("/api/pro/status")
      .then((r) => r.json())
      .then((d) => {
        setPro(Boolean(d.pro));
        setStripeUrl(d.stripe_pro_url);
        setPaypalUrl(d.paypal_pro_url);
      })
      .catch(() => {});
  }

  useEffect(() => {
    refresh();
  }, []);

  async function unlock(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErr(null);
    setMsg(null);
    try {
      const res = await fetch("/api/pro/unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
      setMsg(data.message || "Pro unlocked");
      setPro(true);
    } catch (e) {
      setErr(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card">
      <h1>Pricing</h1>
      <p className="lead">
        Free forever for watermarked invoices. Pro removes the watermark when
        you&apos;re ready — same product loop, cleaner client pages.
      </p>

      <div className="pricing-grid">
        <div className="pricing-tier">
          <div className="pill">Free</div>
          <div className="amount" style={{ fontSize: "1.75rem" }}>
            $0
          </div>
          <ul className="lead" style={{ paddingLeft: "1.1rem" }}>
            <li>Unlimited prepaid invoices</li>
            <li>PayPal · Stripe link · DOGE rails</li>
            <li>Merchant status link</li>
            <li>
              <strong>Powered by Desk</strong> watermark (your distribution)
            </li>
          </ul>
          <a className="btn" href="/pay/new">
            Create free invoice
          </a>
        </div>

        <div className="pricing-tier featured">
          <div className="pill">Pro</div>
          <div className="amount" style={{ fontSize: "1.75rem" }}>
            $12<span className="muted" style={{ fontSize: "1rem" }}>/mo</span>
          </div>
          <ul className="lead" style={{ paddingLeft: "1.1rem" }}>
            <li>Everything in Free</li>
            <li>
              <strong>No watermark</strong> on pay pages
            </li>
            <li>Same multi-rail lock · pay · verify loop</li>
          </ul>
          {pro ? (
            <p className="ok">Pro is active in this browser.</p>
          ) : (
            <div className="row">
              {stripeUrl ? (
                <a className="btn" href={stripeUrl} target="_blank" rel="noopener noreferrer">
                  Pay with card
                </a>
              ) : null}
              {paypalUrl ? (
                <a
                  className="btn secondary"
                  href={paypalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Pay with PayPal
                </a>
              ) : null}
              {!stripeUrl && !paypalUrl ? (
                <p className="muted">
                  Checkout links not configured yet. Operator sets{" "}
                  <code>NEXT_PUBLIC_STRIPE_PRO_URL</code> /{" "}
                  <code>NEXT_PUBLIC_PAYPAL_PRO_URL</code>, then issues unlock
                  codes via <code>DESK_PRO_CODE</code>.
                </p>
              ) : (
                <p className="muted">
                  After payment, enter the unlock code you receive (or that you
                  set for self-test).
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      {!pro ? (
        <form onSubmit={unlock} style={{ marginTop: "1.5rem" }}>
          <label>Pro unlock code</label>
          <input
            className="mono"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="paste code after payment"
            autoComplete="off"
          />
          <div className="row">
            <button type="submit" disabled={loading || !code.trim()}>
              {loading ? "Unlocking…" : "Unlock Pro on this browser"}
            </button>
          </div>
          {msg ? <p className="ok">{msg}</p> : null}
          {err ? <p className="err">{err}</p> : null}
        </form>
      ) : (
        <div className="row" style={{ marginTop: "1.25rem" }}>
          <a className="btn" href="/pay/new">
            Create clean Pro invoice
          </a>
        </div>
      )}

      <p className="muted" style={{ marginTop: "1.5rem" }}>
        Not a bank or escrow. Desk never holds client funds. Cancel anytime by
        clearing site cookies (Pro is browser-session based until full accounts
        ship).
      </p>
    </div>
  );
}
