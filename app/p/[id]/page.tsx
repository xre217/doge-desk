import { decodeInvoice } from "@/lib/crypto";
import { explorerAddress } from "@/lib/doge";
import { formatUsd, normalizeInvoice } from "@/lib/invoice";

export default async function PublicPayPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: raw } = await params;
  const id = decodeURIComponent(raw);
  const inv = decodeInvoice(id);

  if (!inv) {
    return (
      <div className="card">
        <h1>Invalid pay link</h1>
        <p className="lead">
          This link is missing or was tampered with. Ask the merchant for a new
          pay page.
        </p>
        <a className="btn" href="/pay/new">
          Create a new one
        </a>
      </div>
    );
  }

  const n = normalizeInvoice(inv);
  const dogeUri =
    n.doge != null
      ? `dogecoin:${n.doge.address}?amount=${n.doge.amount}`
      : null;
  const qr = dogeUri
    ? `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(dogeUri)}`
    : null;

  return (
    <div className="card">
      <div className="pill">Amount locked · pay to start work</div>
      <h1 style={{ marginTop: "0.6rem" }}>{n.label}</h1>
      {n.note ? <p className="lead">{n.note}</p> : null}
      <div className="amount">{formatUsd(n.usd)}</div>
      <p className="muted">
        Locked {n.created_at}
        {n.doge ? ` · also ${n.doge.amount} DOGE @ $${n.doge.price}/DOGE` : ""}
      </p>

      <div className="row" style={{ marginTop: "1.25rem" }}>
        {n.paypal_url ? (
          <a className="btn" href={n.paypal_url} target="_blank" rel="noopener noreferrer">
            Pay with PayPal
          </a>
        ) : null}
        {n.stripe_url ? (
          <a className="btn" href={n.stripe_url} target="_blank" rel="noopener noreferrer">
            Pay with card
          </a>
        ) : null}
      </div>

      {n.doge && qr ? (
        <>
          <label style={{ marginTop: "1.25rem" }}>Or pay with DOGE</label>
          <div className="qr-wrap">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qr} width={200} height={200} alt="Dogecoin payment QR" />
          </div>
          <div className="amount" style={{ fontSize: "1.4rem" }}>
            {n.doge.amount} DOGE
          </div>
          <label>Send exactly this amount to</label>
          <div className="addr mono">{n.doge.address}</div>
          <div className="row">
            <a
              className="btn secondary"
              href={explorerAddress(n.doge.address)}
              target="_blank"
              rel="noopener noreferrer"
            >
              Explorer
            </a>
          </div>
        </>
      ) : null}

      {!n.paypal_url && !n.stripe_url && !n.doge ? (
        <p className="err">No payment methods on this invoice.</p>
      ) : null}

      <div className="row">
        <a className="btn secondary" href={`/i/${id}`}>
          Invoice summary
        </a>
      </div>

      <p className="muted" style={{ marginTop: "1rem" }}>
        This page never holds keys or card numbers. You pay on PayPal, Stripe, or
        the DOGE network directly. Tell the merchant when done (or send TXID for
        DOGE).
      </p>

      {n.watermark && (
        <div className="brand-footer">
          Powered by <a href="/">Desk</a> — lock · pay · work after payment.{" "}
          <a href="/pay/new">Create your own free invoice</a>
        </div>
      )}
    </div>
  );
}
