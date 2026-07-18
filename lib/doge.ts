const COINBASE_SPOT = "https://api.coinbase.com/v2/prices/DOGE-USD/spot";
const BLOCKCYPHER_ADDR = "https://api.blockcypher.com/v1/doge/main/addrs/{address}";
const BLOCKCYPHER_TX = "https://api.blockcypher.com/v1/doge/main/txs/{txid}";
const KOINU = 100_000_000;

export function lookalikeDogeAddress(addr: string): boolean {
  const a = addr.trim();
  if (!a || a.startsWith("YOUR_")) return false;
  if (!["D", "A", "9"].includes(a[0])) return false;
  return a.length >= 25 && a.length <= 40;
}

export async function spotPrice(): Promise<number> {
  const res = await fetch(COINBASE_SPOT, {
    headers: { "User-Agent": "doge-desk/0.1 (+non-custodial)" },
    next: { revalidate: 30 },
  });
  if (!res.ok) throw new Error(`Coinbase spot HTTP ${res.status}`);
  const data = (await res.json()) as { data?: { amount?: string } };
  const p = parseFloat(data?.data?.amount || "");
  if (!(p > 0)) throw new Error("invalid DOGE price");
  return p;
}

export function usdToDoge(usd: number, price: number): number {
  if (usd <= 0 || price <= 0) throw new Error("usd and price must be > 0");
  return Math.ceil(usd / price);
}

export type TxVerifyResult = {
  txid: string;
  doge_received: number;
  confirmations: number;
  amount_ok: boolean;
  conf_ok: boolean;
  ok: boolean;
  reasons: string[];
};

export async function verifyTx(opts: {
  txid: string;
  address: string;
  minDoge: number;
  confirmations?: number;
}): Promise<TxVerifyResult> {
  const needConf = opts.confirmations ?? 1;
  const minKoinu = Math.ceil(opts.minDoge * KOINU);
  const res = await fetch(BLOCKCYPHER_TX.replace("{txid}", opts.txid), {
    headers: { "User-Agent": "doge-desk/0.1 (+non-custodial)" },
    cache: "no-store",
  });
  if (!res.ok) {
    return {
      txid: opts.txid,
      doge_received: 0,
      confirmations: 0,
      amount_ok: false,
      conf_ok: false,
      ok: false,
      reasons: [`TX_FETCH_FAILED — HTTP ${res.status}`],
    };
  }
  const tx = (await res.json()) as {
    confirmations?: number;
    outputs?: { addresses?: string[]; value?: number }[];
  };
  const conf = Number(tx.confirmations || 0);
  let total = 0;
  for (const out of tx.outputs || []) {
    if ((out.addresses || []).includes(opts.address)) {
      total += Number(out.value || 0);
    }
  }
  const doge = total / KOINU;
  const amount_ok = total >= minKoinu;
  const conf_ok = conf >= needConf;
  const reasons: string[] = [];
  if (total === 0) {
    reasons.push(`WRONG_ADDRESS — no output pays ${opts.address}`);
  } else if (!amount_ok) {
    reasons.push(
      `UNDERPAY — got ${doge} DOGE, need ≥ ${opts.minDoge} DOGE`
    );
  }
  if (!conf_ok) {
    reasons.push(
      `UNCONFIRMED — ${conf} confirmation(s), need ≥ ${needConf}`
    );
  }
  return {
    txid: opts.txid,
    doge_received: doge,
    confirmations: conf,
    amount_ok,
    conf_ok,
    ok: amount_ok && conf_ok,
    reasons,
  };
}

export async function recentReceives(
  address: string,
  minDoge: number,
  lookbackSec = 86400
): Promise<{ txid: string; doge: number; confirmations: number } | null> {
  const minKoinu = Math.ceil(minDoge * KOINU);
  const url =
    BLOCKCYPHER_ADDR.replace("{address}", address) + "?limit=30";
  const res = await fetch(url, {
    headers: { "User-Agent": "doge-desk/0.1 (+non-custodial)" },
    cache: "no-store",
  });
  if (!res.ok) return null;
  const data = (await res.json()) as {
    txrefs?: {
      tx_hash?: string;
      value?: number;
      confirmations?: number;
      tx_input_n?: number;
      confirmed?: string;
      received?: string;
    }[];
  };
  const since = Date.now() / 1000 - lookbackSec;
  for (const ref of data.txrefs || []) {
    if (Number(ref.tx_input_n ?? 0) !== -1) continue;
    const value = Number(ref.value || 0);
    if (value < minKoinu) continue;
    const conf = Number(ref.confirmations || 0);
    if (conf < 1) continue;
    const stamp = ref.confirmed || ref.received;
    if (stamp) {
      const ts = Date.parse(stamp) / 1000;
      if (!Number.isNaN(ts) && ts < since - 60) continue;
    }
    return {
      txid: ref.tx_hash || "",
      doge: value / KOINU,
      confirmations: conf,
    };
  }
  return null;
}

export function explorerAddress(address: string): string {
  return `https://blockchair.com/dogecoin/address/${address}`;
}

export function explorerTx(txid: string): string {
  return `https://blockchair.com/dogecoin/transaction/${txid}`;
}
