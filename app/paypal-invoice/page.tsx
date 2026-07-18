import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "PayPal freelance invoice (prepaid)",
  description:
    "Create a prepaid PayPal invoice page for freelancers. Lock USD, share one link, start work after payment.",
};

export default function PaypalInvoicePage() {
  return (
    <div className="card">
      <div className="pill">PayPal rail</div>
      <h1 style={{ marginTop: "0.6rem" }}>PayPal invoice for freelancers</h1>
      <p className="lead">
        Paste your <code>paypal.me</code> or PayPal payment URL, lock the USD
        amount, and send clients a single Desk pay page instead of a bare link
        in chat.
      </p>
      <ul className="lead" style={{ paddingLeft: "1.2rem" }}>
        <li>Amount locked at create time</li>
        <li>Optional Stripe + DOGE on the same page</li>
        <li>Merchant-only status bookmark</li>
        <li>Free with watermark · Pro without</li>
      </ul>
      <div className="row">
        <a className="btn" href="/pay/new">
          Create PayPal pay page
        </a>
        <a className="btn secondary" href="/require-payment-before-work">
          Payment-before-work guide
        </a>
      </div>
    </div>
  );
}
