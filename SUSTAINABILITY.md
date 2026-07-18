# Desk — Sustainability board

**Product:** multi-rail prepaid invoices (PayPal · Stripe link · DOGE)  
**Repo:** https://github.com/xre217/doge-desk  
**Local:** http://127.0.0.1:3456  
**Public (tunnel, while process up):** https://bidding-read-investigation-whale.trycloudflare.com  
**Old Vercel (stale DOGE-only landing):** https://doge-desk.vercel.app — needs redeploy after `vercel login`  
**Doctrine:** zero ads / zero social campaigns · distribution = watermark + SEO  
**Last updated:** 2026-07-18

---

## Current rung: **2** (code + public tunnel live; permanent Vercel pending login)

| Rung | State | Status | Date |
|------|--------|--------|------|
| 0 | Desk live on a public URL | **done** (Cloudflare quick tunnel + GitHub) | 2026-07-18 |
| 1 | Create → share → pay page works; **fiat rails visible** | **done** | 2026-07-18 |
| 2 | Free watermark always on; Pro checkout/unlock exists | **done** | 2026-07-18 |
| 3 | Pro checkout **live** (real Stripe/PayPal + own test $) | pending — set Pro PayPal/Stripe URLs + unlock after $ | — |
| 4 | Search Console + sitemap; ≥1 page indexed | pending — permanent domain + GSC | — |
| 5 | First external free invoice | pending | — |
| 6 | First external Pro / paid | pending | — |
| 7 | Recurring Pro or free volume + watermark clicks | pending | — |

---

## Live counters

| Signal | Value |
|--------|-------|
| GitHub | https://github.com/xre217/doge-desk |
| Smoke | `scripts/smoke.sh` PASS local + tunnel |
| MRR | $0 |
| Test charge done | N |
| First real $ | N |
| Default DOGE prefill | `DTRJECKXfxgnSzGbt7TYRikLPDocqvdmo5` |

---

## Shipped

- [x] Multi-rail v2 (PayPal + Stripe link + optional DOGE)
- [x] Legacy v1 DOGE invoices still decode
- [x] Free watermark; Pro cookie omits watermark
- [x] Pricing + `DESK_PRO_CODE` unlock
- [x] SEO pages + sitemap/robots + terms/privacy
- [x] `/sustainability` board
- [x] Merchant status: chain poll + local mark fiat paid
- [x] Rate limit on create · form defaults API · copy links
- [x] `scripts/smoke.sh` · `scripts/go-live.sh`
- [x] Public GitHub repo
- [x] Public tunnel with working multi-rail loop

---

## Permanent host (one-time, when you care)

```bash
# on a machine with browser
cd ~/doge-desk
vercel login
vercel link   # attach to doge-desk project if it exists
vercel env add DOGE_DESK_SECRET production
vercel env add DESK_PRO_CODE production
# optional: NEXT_PUBLIC_PAYPAL_PRO_URL, NEXT_PUBLIC_DEFAULT_PAYPAL_URL, NEXT_PUBLIC_SITE_URL
vercel --prod
```

Or: Vercel dashboard → Import `xre217/doge-desk` → set env → Deploy.

Until then: `./scripts/go-live.sh` (local + tunnel).

---

## Non-goals

- No Reddit / X campaigns  
- No SAO/Tensei on this path  
- No custody/escrow  

---

Progress = irreversible capability. Tunnel URL dies when the process dies; code + GitHub do not.
