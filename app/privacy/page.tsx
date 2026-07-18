import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy",
  description: "Desk privacy — signed invoices, minimal data.",
};

export default function PrivacyPage() {
  return (
    <div className="card">
      <h1>Privacy</h1>
      <p className="lead">
        Free-tier invoices are self-contained in the signed URL payload. Desk
        does not require an account to create a watermarked pay page.
      </p>
      <ul className="lead" style={{ paddingLeft: "1.2rem" }}>
        <li>
          We do not store private keys. Do not paste seed phrases anywhere.
        </li>
        <li>
          Pro unlock uses an HTTP-only cookie on your browser after a valid
          code.
        </li>
        <li>
          Hosting (e.g. Vercel) may log standard request metadata. Payment
          processors process their own data under their policies.
        </li>
        <li>
          Merchant status &quot;mark fiat paid&quot; is stored in your browser
          localStorage only.
        </li>
      </ul>
      <a className="btn secondary" href="/">
        Home
      </a>
    </div>
  );
}
