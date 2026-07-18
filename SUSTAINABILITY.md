# Desk — Sustainability board

**Product:** multi-rail prepaid invoices (PayPal · Stripe link · DOGE)  
**Repo:** https://github.com/xre217/doge-desk  
**Production:** https://doge-desk.vercel.app  
**Local:** http://127.0.0.1:3456  
**Doctrine:** zero ads / zero social campaigns · distribution = watermark + SEO  
**Last updated:** 2026-07-18

---

## Current rung: **3** (Pro PayPal link live; first self-test $ optional)

| Rung | State | Status | Date |
|------|--------|--------|------|
| 0 | Desk live on a public URL | **done** — https://doge-desk.vercel.app | 2026-07-18 |
| 1 | Create → share → pay page; fiat rails | **done** | 2026-07-18 |
| 2 | Free watermark; Pro unlock shell | **done** | 2026-07-18 |
| 3 | Pro checkout live (PayPal.me $12) | **done** — `NEXT_PUBLIC_PAYPAL_PRO_URL` | 2026-07-18 |
| 4 | Search Console + sitemap indexed | pending — submit GSC | — |
| 5 | First external free invoice | pending | — |
| 6 | First external Pro / paid | pending | — |
| 7 | Recurring Pro or free volume | pending | — |

---

## PayPal (wired)

| Use | URL |
|-----|-----|
| Default invoice rail | `https://paypal.me/trefong217` |
| Pro $12/mo checkout | `https://paypal.me/trefong217/12` |

Confirm this is **your** PayPal.me slug (PayPal → Settings → PayPal.me). If different, update Vercel env and redeploy.

Pro unlock after someone pays: use production `DESK_PRO_CODE` (Vercel → Project → Settings → Environment Variables). Hand the code to the buyer, or self-test unlock on `/pricing`.

---

## Live counters

| Signal | Value |
|--------|-------|
| GitHub | https://github.com/xre217/doge-desk |
| Prod smoke | PASS |
| Default DOGE | `DTRJECKXfxgnSzGbt7TYRikLPDocqvdmo5` |
| MRR | $0 until first Pro |

---

## Operator next

1. Confirm PayPal.me slug matches your account  
2. Create a real client invoice at `/pay/new` (PayPal prefilled)  
3. Google Search Console → property `doge-desk.vercel.app` → submit `/sitemap.xml`  
4. Optional: Stripe Payment Link for card Pro checkout  

---

## Non-goals

No social campaigns · no SAO/Tensei on this path · no custody  
