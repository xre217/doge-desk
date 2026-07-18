#!/usr/bin/env bash
set -euo pipefail
BASE="${1:-http://127.0.0.1:3456}"

echo "== Desk smoke against $BASE =="

code=$(curl -sS -o /dev/null -w '%{http_code}' "$BASE/")
test "$code" = "200" && echo "OK home" || { echo "FAIL home $code"; exit 1; }

RES=$(curl -sS -X POST "$BASE/api/invoices" \
  -H 'Content-Type: application/json' \
  -d '{"usd":25,"paypal_url":"https://paypal.me/smoke/25","label":"smoke"}')
echo "$RES" | grep -q '"watermark":true' && echo "OK free watermark" || { echo "FAIL watermark"; echo "$RES"; exit 1; }
PAY=$(echo "$RES" | python3 -c 'import sys,json; print(json.load(sys.stdin)["pay_url"])')
HTML=$(curl -sS "$PAY")
echo "$HTML" | grep -q 'Pay with PayPal' && echo "OK pay page rail" || { echo "FAIL rail"; exit 1; }
echo "$HTML" | grep -q 'Powered by' && echo "OK powered-by" || { echo "FAIL powered-by"; exit 1; }

curl -sS -o /dev/null -w 'OK sitemap %{http_code}\n' "$BASE/sitemap.xml" | grep -q 200
curl -sS -o /dev/null -w 'OK freelancers %{http_code}\n' "$BASE/for/freelancers" | grep -q 200

echo "ALL SMOKE PASSED"
