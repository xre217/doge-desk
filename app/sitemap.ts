import type { MetadataRoute } from "next";

const BASE =
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "https://doge-desk.vercel.app");

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "/",
    "/pay/new",
    "/pricing",
    "/install",
    "/for/freelancers",
    "/for/discord-shops",
    "/paypal-invoice",
    "/require-payment-before-work",
    "/sustainability",
    "/terms",
    "/privacy",
  ];
  const now = new Date();
  return paths.map((p) => ({
    url: `${BASE.replace(/\/$/, "")}${p}`,
    lastModified: now,
    changeFrequency: p === "/" || p.startsWith("/for") ? "weekly" : "monthly",
    priority: p === "/" ? 1 : p === "/pay/new" ? 0.9 : 0.6,
  }));
}
