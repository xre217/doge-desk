export default function HomePage() {
  return (
    <div className="card">
      <div className="pill">Non-custodial · multi-rail · no ads</div>
      <h1 style={{ marginTop: "0.75rem" }}>Get paid before you start</h1>
      <p className="lead">
        <strong>Desk</strong> locks the amount at deal time, gives your client one
        clean pay page (PayPal, card link, or DOGE), and keeps you from starting
        work unpaid — without holding anyone&apos;s keys.
      </p>
      <ul className="lead" style={{ paddingLeft: "1.2rem" }}>
        <li>PayPal.me / PayPal links</li>
        <li>Stripe Payment Links (card → bank)</li>
        <li>Optional DOGE QR + on-chain verify</li>
        <li>Free tier: watermarked pay pages (your distribution)</li>
        <li>Pro: no watermark, same loop</li>
      </ul>
      <div className="row">
        <a className="btn" href="/pay/new">
          Create free invoice
        </a>
        <a className="btn secondary" href="/pricing">
          Pricing
        </a>
      </div>
      <p className="muted" style={{ marginTop: "1.25rem" }}>
        Zero advertising. Zero social campaigns. The product is the
        distribution — every free pay page can onboard the next freelancer.
      </p>
      <p className="muted">
        Not a bank. Not escrow. You get paid on rails you already control.
      </p>
    </div>
  );
}
