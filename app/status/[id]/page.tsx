import { Suspense } from "react";
import StatusClient from "./StatusClient";

export default function StatusPage() {
  return (
    <Suspense
      fallback={
        <div className="card">
          <h1>Merchant status</h1>
          <p className="muted">Loading…</p>
        </div>
      }
    >
      <StatusClient />
    </Suspense>
  );
}
