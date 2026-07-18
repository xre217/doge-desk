export default function InstallPage() {
  return (
    <div className="card">
      <h1>CLI (DOGE power users)</h1>
      <p className="lead">
        Hosted <strong>Desk</strong> is the multi-rail product (PayPal, Stripe
        links, DOGE). The local <code>doge-pay</code> CLI remains free for
        DOGE-only quote · invoice · verify · watch.
      </p>
      <pre
        className="addr mono"
        style={{ whiteSpace: "pre-wrap", lineHeight: 1.5 }}
      >{`cd ~/doge-pay-kit
chmod +x bin/doge-pay
./bin/doge-pay config set-address DYourAddress
./bin/doge-pay doctor
./bin/doge-pay invoice --usd 80 --client @alice --job "work" --prepaid-pct 50 --paypage
# share invoices/pay-*.html
./bin/doge-pay verify --txid TXID --min PREPAID_DOGE`}</pre>
      <p className="muted">
        Most freelancers should use the hosted multi-rail flow instead.
      </p>
      <div className="row">
        <a className="btn" href="/pay/new">
          Create hosted invoice
        </a>
        <a className="btn secondary" href="/pricing">
          Pricing
        </a>
      </div>
    </div>
  );
}
