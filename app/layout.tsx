import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Desk — Prepaid invoices for freelancers",
    template: "%s · Desk",
  },
  description:
    "Lock the price, send a pay page (PayPal, card, or DOGE), start work only after payment. Non-custodial. No ads required — every pay page can bring the next merchant.",
  openGraph: {
    title: "Desk — Prepaid invoices for freelancers",
    description:
      "Lock price · share pay page · get paid before you work. PayPal, Stripe links, optional DOGE.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <main>
          <nav className="nav">
            <a href="/">Desk</a>
            <a href="/pay/new">New invoice</a>
            <a href="/pricing">Pricing</a>
            <a href="/for/freelancers">For freelancers</a>
            <a href="/install">CLI</a>
            <a href="/sustainability">Progress</a>
          </nav>
          {children}
          <footer className="site-footer">
            <a href="/terms">Terms</a>
            <a href="/privacy">Privacy</a>
            <a href="/pricing">Pro $12/mo</a>
            <span className="muted">Not a bank · not escrow</span>
          </footer>
        </main>
      </body>
    </html>
  );
}
