import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Require payment before work",
  description:
    "A simple prepaid workflow for freelancers: lock price, share pay page, verify payment, then start. PayPal, card, or DOGE.",
};

export default function RequirePaymentPage() {
  return (
    <div className="card">
      <h1>Require payment before work</h1>
      <p className="lead">
        The rule is simple: <strong>no work until money lands</strong>. Desk is
        the page you send so that rule is obvious to the client and easy for you
        to enforce.
      </p>
      <h2>Playbook</h2>
      <ol className="lead" style={{ paddingLeft: "1.2rem" }}>
        <li>Agree on scope and USD price</li>
        <li>
          Create a Desk invoice with 50–100% prepaid (your policy)
        </li>
        <li>Share only the public pay page</li>
        <li>Keep the status URL private</li>
        <li>Start when status is paid (chain or fiat confirm)</li>
      </ol>
      <p className="muted">
        Desk is not escrow and does not mediate disputes. It is a lock · pay ·
        verify workflow on rails you control.
      </p>
      <div className="row">
        <a className="btn" href="/pay/new">
          Create prepaid invoice
        </a>
        <a className="btn secondary" href="/for/freelancers">
          For freelancers
        </a>
      </div>
    </div>
  );
}
