import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms",
  description: "Desk terms of use — not a bank, not escrow.",
};

export default function TermsPage() {
  return (
    <div className="card">
      <h1>Terms</h1>
      <p className="lead">
        Desk provides software to create prepaid invoice / pay pages. You are
        responsible for your own tax, consumer, and payment-rail compliance.
      </p>
      <ul className="lead" style={{ paddingLeft: "1.2rem" }}>
        <li>
          Desk is <strong>not a bank</strong>, money transmitter, or escrow.
        </li>
        <li>Desk never holds client funds or private keys.</li>
        <li>
          Payments occur on third-party rails (PayPal, Stripe, blockchain).
          Their terms apply.
        </li>
        <li>
          Free pay pages may include a watermark linking to Desk. Pro removes
          it.
        </li>
        <li>
          Software is provided as-is without warranty of fitness for a
          particular purpose.
        </li>
      </ul>
      <a className="btn secondary" href="/">
        Home
      </a>
    </div>
  );
}
