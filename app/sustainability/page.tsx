import type { Metadata } from "next";
import { readFile } from "fs/promises";
import path from "path";

export const metadata: Metadata = {
  title: "Sustainability progress",
  description:
    "Live rung tracker for Desk — capability toward a self-distributing prepaid invoice product. No vanity metrics.",
};

export const dynamic = "force-dynamic";

async function loadBoard(): Promise<string> {
  try {
    const p = path.join(process.cwd(), "SUSTAINABILITY.md");
    return await readFile(p, "utf8");
  } catch {
    return "# Sustainability board missing\n\nCreate SUSTAINABILITY.md in the repo root.";
  }
}

export default async function SustainabilityPage() {
  const md = await loadBoard();
  return (
    <div className="card">
      <div className="pill">Ops · real-time progress</div>
      <h1 style={{ marginTop: "0.6rem" }}>Sustainability board</h1>
      <p className="lead">
        Capability rungs, not hustle theater. Updated when the system changes.
      </p>
      <pre
        className="addr mono board"
        style={{ whiteSpace: "pre-wrap", lineHeight: 1.45, fontSize: "0.8rem" }}
      >
        {md}
      </pre>
      <div className="row">
        <a className="btn" href="/pay/new">
          Ship another invoice
        </a>
        <a className="btn secondary" href="/">
          Home
        </a>
      </div>
    </div>
  );
}
