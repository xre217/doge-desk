import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pay pages for Discord & Telegram shops",
  description:
    "Share a clean prepaid pay page in Discord or Telegram. Lock amount, accept PayPal, card links, or DOGE.",
};

export default function DiscordShopsPage() {
  return (
    <div className="card">
      <div className="pill">Discord · Telegram</div>
      <h1 style={{ marginTop: "0.6rem" }}>
        One pay page for chat-native shops
      </h1>
      <p className="lead">
        Drop a single link in the ticket channel. Amount is locked. Payers use
        PayPal, card (Stripe Payment Link), or DOGE QR — without you pasting
        addresses every time.
      </p>
      <div className="row">
        <a className="btn" href="/pay/new">
          Create pay page
        </a>
        <a className="btn secondary" href="/pricing">
          Pricing
        </a>
      </div>
    </div>
  );
}
