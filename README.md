# Desk (hosted)

Self-serve **prepaid invoices** for freelancers: lock USD → share pay page (PayPal / Stripe Payment Link / optional DOGE) → start work after payment.

Doctrine: [PRODUCT.md](PRODUCT.md) · Progress: [SUSTAINABILITY.md](SUSTAINABILITY.md) · CLI: `~/doge-pay-kit`.

## Dev

```bash
cd ~/doge-desk
npm install
cp .env.example .env.local   # set DOGE_DESK_SECRET, optional DESK_PRO_CODE
npm run dev                  # http://127.0.0.1:3456
```

## Deploy (Vercel)

1. Link project to this directory  
2. Set env: `DOGE_DESK_SECRET`, `DESK_PRO_CODE`, optional Pro checkout URLs  
3. Deploy  

Existing brand URL: https://doge-desk.vercel.app  

## Routes

| Path | Purpose |
|------|---------|
| `/` | Landing |
| `/pay/new` | Create locked multi-rail invoice |
| `/p/[id]` | Public pay page + free watermark |
| `/i/[id]` | Invoice view |
| `/status/[id]?t=` | Merchant status (token) |
| `/pricing` | Free vs Pro + unlock |
| `/for/freelancers` | SEO |
| `/sustainability` | Ops board |
| `POST /api/invoices` | Create signed invoice |
| `GET /api/status/[id]?t=` | Chain poll (DOGE) + status |
| `POST /api/pro/unlock` | Pro cookie via code |

## Safety

Never accepts private keys. Signed ids only. Free tier watermarked unless Pro session.
