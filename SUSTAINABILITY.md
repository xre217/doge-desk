# Desk — Sustainability board

**Product:** multi-rail prepaid invoices (PayPal · Stripe link · DOGE)  
**Public URL:** https://doge-desk.vercel.app (local: http://127.0.0.1:3456)  
**Doctrine:** zero ads / zero social campaigns · distribution = watermark + SEO  
**Last updated:** 2026-07-18

---

## Current rung: **2** (in progress toward 3)

| Rung | State | Status | Date |
|------|--------|--------|------|
| 0 | Desk live on a public URL | done (prior deploy) | pre-existing |
| 1 | Create → share → pay page works; **fiat rails visible** | **done in code** | 2026-07-18 |
| 2 | Free watermark always on; Pro checkout/unlock exists | **done in code** | 2026-07-18 |
| 3 | Pro checkout **live** (real Stripe/PayPal + own test $) | pending — set env URLs + `DESK_PRO_CODE`, charge $1–12 | — |
| 4 | Search Console + sitemap; ≥1 page indexed | pending — sitemap/robots shipped; operator submits property | — |
| 5 | First external free invoice (not only you) | pending | — |
| 6 | First external Pro / paid | pending | — |
| 7 | Recurring Pro or free volume + watermark clicks | pending | — |

---

## Live counters (manual / Hermes)

| Signal | Value |
|--------|-------|
| Invoices created (all-time) | unknown (stateless free tier) |
| Pay-page views | unknown (add analytics later if needed) |
| Pro unlocks (this browser) | check `/pricing` |
| MRR | $0 |
| Test charge done | N |
| First real $ | N |
| Pages in sitemap | 11 |
| Search impressions | not connected |

---

## Shipped this pass

- [x] Multi-rail invoice payload v2 (PayPal + Stripe link + optional DOGE)
- [x] Legacy v1 DOGE invoices still decode
- [x] Free watermark on pay pages; Pro cookie omits watermark
- [x] Pricing + unlock code path (`DESK_PRO_CODE`)
- [x] SEO pages: freelancers, discord shops, paypal-invoice, require-payment-before-work
- [x] `/sitemap.xml`, `/robots.txt`, terms, privacy
- [x] `/sustainability` reads this file
- [x] Merchant status: chain poll for DOGE + local “mark fiat paid”
- [x] Local smoke: fiat create, watermark, pro unlock (wm off), multi-rail DOGE+PayPal, sitemap 200

## Verify locally

```bash
cd ~/doge-desk && npm run dev   # http://127.0.0.1:3456
# open /pay/new · /pricing · /sustainability
```

---

## Operator next (no deadline)

1. Set production env: `DOGE_DESK_SECRET`, `DESK_PRO_CODE`, `NEXT_PUBLIC_STRIPE_PRO_URL` and/or `NEXT_PUBLIC_PAYPAL_PRO_URL`, optional `NEXT_PUBLIC_SITE_URL`
2. Redeploy Vercel → complete rung 3 with a real self-test purchase
3. Google Search Console → property + sitemap → rung 4
4. Use free invoices for real clients → rung 5+

---

## Non-goals (this board)

- No Reddit / X / forhire campaigns  
- No SAO or Tensei on the income-critical path  
- No custody / escrow product  
- No vanity follower metrics  

---

## How to move the board

Ship a vertical slice → update **Current rung** and **Shipped** → redeploy.  
Progress = irreversible capability, not hours worked.
