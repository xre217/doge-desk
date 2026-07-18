# Desk (hosted)

Hosted surface for **multi-rail prepaid invoices**.  
CLI companion: `~/doge-pay-kit` (DOGE power users).

## One-liner

Lock the price at deal time, send a pay page (PayPal / card link / DOGE), start work only after payment — without holding keys.

## Thesis

Solve prepaid freelance payment so completely that the product needs **zero advertising and social campaigns**.

Growth = **product-native distribution**: every free pay page is shared with a payer; watermark + peer install does the rest. SEO pages compound passively.

## Rails

| Rail | How |
|------|-----|
| PayPal | Merchant pastes `paypal.me` or PayPal URL onto the invoice |
| Stripe | Merchant pastes a Stripe Payment Link |
| DOGE | Optional receive address; amount locked via spot price; status polls chain |

## Surfaces

| Route | Job |
|-------|-----|
| `/` | Pitch |
| `/pay/new` | Create locked multi-rail invoice |
| `/p/[id]` | Public pay page (+ free watermark) |
| `/i/[id]` | Invoice summary |
| `/status/[id]?t=…` | Merchant status (token) |
| `/pricing` | Free vs Pro + unlock |
| `/for/*`, SEO pages | Passive discovery |
| `/sustainability` | Ops rung board |
| `/install` | CLI notes |

## Storage model

Invoices are **self-contained signed payloads** in the URL id — no database for free tier.  
Secret: `DOGE_DESK_SECRET` (HMAC). Pro: browser cookie after `DESK_PRO_CODE` unlock.

## Pro

- **$12/mo** positioning (checkout URLs via env)
- Unlocks **no watermark** on newly created invoices
- Full Stripe Customer Portal / accounts can come later

## Non-goals

- Ads, social spam, content calendars as strategy  
- Private keys, seed phrases, custodial wallets  
- Becoming a licensed money transmitter / escrow  

## Feature test

Every change must answer **yes** to: *Does this deepen lock → pay → verify before work?*  
If it only invents a marketing need, cut it.

## Pairing

- Kit: `~/doge-pay-kit`  
- Board: `SUSTAINABILITY.md`  
- Live: https://doge-desk.vercel.app  
