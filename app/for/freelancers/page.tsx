import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Prepaid invoices for freelancers",
  description:
    "Stop starting work unpaid. Lock the price, send a PayPal or card pay page, begin only after payment. Free watermarked invoices.",
};

export default function ForFreelancersPage() {
  return (
    <div className="card">
      <div className="pill">For freelancers</div>
      <h1 style={{ marginTop: "0.6rem" }}>
        Require payment before you start work
      </h1>
      <p className="lead">
        Clients ghost. Scope creeps. PayPal.me links get lost in chat.{" "}
        <strong>Desk</strong> gives you one shareable pay page with the amount
        locked at agreement time — PayPal, Stripe Payment Link, or DOGE.
      </p>
      <h2>How it works</h2>
      <ol className="lead" style={{ paddingLeft: "1.2rem" }}>
        <li>Create an invoice with USD + your payment links</li>
        <li>Share the pay page URL</li>
        <li>Client pays on rails you already use</li>
        <li>Confirm on merchant status → then start work</li>
      </ol>
      <h2>Why free has a watermark</h2>
      <p className="lead">
        Every free page says &quot;Powered by Desk&quot; with a create link. That
        is the growth engine — no ads, no social spam. Pro removes it when you
        want cleaner client pages.
      </p>
      <div className="row">
        <a className="btn" href="/pay/new">
          Create free invoice
        </a>
        <a className="btn secondary" href="/pricing">
          See Pro
        </a>
      </div>
    </div>
  );
}
