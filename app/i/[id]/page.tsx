import { decodeInvoice } from "@/lib/crypto";
import { explorerAddress } from "@/lib/doge";
import { formatUsd, normalizeInvoice } from "@/lib/invoice";

export default async function InvoiceViewPage({
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
        <h1>Invoice not found</h1>
        <p className="lead">Invalid or tampered invoice id.</p>
      </div>
    );
  }

  const n = normalizeInvoice(inv);

  return (
    <div className="card">
      <h1>Invoice</h1>
      <p className="lead">{n.label}</p>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <tbody>
          <tr>
            <td className="muted">Amount</td>
            <td>
              <strong>{formatUsd(n.usd)}</strong>
            </td>
          </tr>
          <tr>
            <td className="muted">Rails</td>
            <td>{n.rails.join(", ") || "—"}</td>
          </tr>
          {n.doge ? (
            <>
              <tr>
                <td className="muted">DOGE</td>
                <td>{n.doge.amount} DOGE</td>
              </tr>
              <tr>
                <td className="muted">Spot at lock</td>
                <td>${n.doge.price}/DOGE</td>
              </tr>
            </>
          ) : null}
          <tr>
            <td className="muted">Created</td>
            <td>{n.created_at}</td>
          </tr>
        </tbody>
      </table>

      {n.paypal_url ? (
        <>
          <label>PayPal</label>
          <div className="addr mono">{n.paypal_url}</div>
        </>
      ) : null}
      {n.stripe_url ? (
        <>
          <label>Stripe</label>
          <div className="addr mono">{n.stripe_url}</div>
        </>
      ) : null}
      {n.doge ? (
        <>
          <label>DOGE address</label>
          <div className="addr mono">{n.doge.address}</div>
        </>
      ) : null}

      <div className="row">
        <a className="btn" href={`/p/${id}`}>
          Open pay page
        </a>
        {n.doge ? (
          <a
            className="btn secondary"
            href={explorerAddress(n.doge.address)}
            target="_blank"
            rel="noopener noreferrer"
          >
            Explorer
          </a>
        ) : null}
      </div>
      {n.note ? (
        <p className="muted" style={{ marginTop: "1rem" }}>
          {n.note}
        </p>
      ) : null}
      {n.watermark ? (
        <div className="brand-footer">
          Powered by <a href="/">Desk</a>
        </div>
      ) : null}
    </div>
  );
}
