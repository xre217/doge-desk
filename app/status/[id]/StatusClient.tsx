"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";

type StatusPayload = {
  status: "open" | "paid";
  usd: number | null;
  rails: string[];
  doge_expected: number | null;
  address: string | null;
  payment: { txid: string; doge: number; confirmations: number } | null;
  fiat_note: string | null;
  checked_at: string;
};

function localKey(id: string) {
  return `desk-fiat-paid:${id}`;
}

export default function StatusClient() {
  const params = useParams();
  const search = useSearchParams();
  const id = decodeURIComponent(String(params.id || ""));
  const token = search.get("t") || "";

  const [data, setData] = useState<StatusPayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [fiatPaid, setFiatPaid] = useState(false);

  useEffect(() => {
    try {
      setFiatPaid(localStorage.getItem(localKey(id)) === "1");
    } catch {
      /* ignore */
    }
  }, [id]);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `/api/status/${encodeURIComponent(id)}?t=${encodeURIComponent(token)}`,
        { cache: "no-store" }
      );
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || `HTTP ${res.status}`);
      setData(json as StatusPayload);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
  }, [id, token]);

  useEffect(() => {
    refresh();
    const t = setInterval(refresh, 20000);
    return () => clearInterval(t);
  }, [refresh]);

  function markFiatPaid() {
    try {
      localStorage.setItem(localKey(id), "1");
      setFiatPaid(true);
    } catch {
      setError("Could not save mark-paid in this browser");
    }
  }

  function clearFiatPaid() {
    try {
      localStorage.removeItem(localKey(id));
      setFiatPaid(false);
    } catch {
      /* ignore */
    }
  }

  const chainPaid = data?.status === "paid";
  const effectivePaid = chainPaid || fiatPaid;

  return (
    <div className="card">
      <h1>Merchant status</h1>
      <p className="lead">
        Keep this link private. DOGE rails poll the public chain. Fiat rails:
        confirm in PayPal/Stripe, then mark paid here (this browser only).
        Start work only when status is <strong>paid</strong>.
      </p>

      {loading && !data ? <p className="muted">Checking…</p> : null}
      {error ? <p className="err">{error}</p> : null}

      {data && (
        <>
          <p>
            Status:{" "}
            <span className={`pill ${effectivePaid ? "paid" : ""}`}>
              {effectivePaid ? "paid" : "open"}
            </span>
            {fiatPaid && !chainPaid ? (
              <span className="muted"> (fiat marked locally)</span>
            ) : null}
          </p>
          <p className="muted">
            {data.usd != null ? `$${data.usd} USD · ` : ""}
            rails: {data.rails.join(", ") || "—"}
          </p>
          {data.doge_expected != null && data.address ? (
            <p className="muted">
              Expect ≥ {data.doge_expected} DOGE →{" "}
              <span className="mono">{data.address}</span>
            </p>
          ) : null}
          {data.payment ? (
            <div style={{ marginTop: "1rem" }}>
              <p className="ok">On-chain payment detected</p>
              <div className="addr mono">txid: {data.payment.txid}</div>
              <p className="muted">
                {data.payment.doge} DOGE · {data.payment.confirmations} conf
              </p>
            </div>
          ) : data.rails.includes("doge") ? (
            <p className="muted">No matching DOGE payment yet.</p>
          ) : null}
          {data.fiat_note ? <p className="muted">{data.fiat_note}</p> : null}
          <p className="muted">Checked {data.checked_at}</p>
        </>
      )}

      <div className="row">
        <button type="button" onClick={refresh} disabled={loading}>
          {loading ? "Checking…" : "Refresh now"}
        </button>
        {data?.rails.some((r) => r === "paypal" || r === "stripe") ? (
          fiatPaid ? (
            <button type="button" className="secondary" onClick={clearFiatPaid}>
              Clear fiat mark
            </button>
          ) : (
            <button type="button" onClick={markFiatPaid}>
              Mark fiat paid
            </button>
          )
        ) : null}
        <a className="btn secondary" href={`/p/${encodeURIComponent(id)}`}>
          Pay page
        </a>
      </div>
    </div>
  );
}
