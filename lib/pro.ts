import { cookies } from "next/headers";
import { proSessionToken, verifyProSession } from "./crypto";

export const PRO_COOKIE = "desk_pro";

export async function isProSession(): Promise<boolean> {
  const jar = await cookies();
  return verifyProSession(jar.get(PRO_COOKIE)?.value);
}

export function proCookieOptions() {
  return {
    name: PRO_COOKIE,
    value: proSessionToken(),
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
  };
}
