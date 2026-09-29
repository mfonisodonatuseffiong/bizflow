import { createHash, randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { googleAuthUrl } from "@/lib/google";

export const dynamic = "force-dynamic";

export async function GET() {
  const state = randomBytes(16).toString("base64url");
  const verifier = randomBytes(32).toString("base64url");
  const challenge = createHash("sha256").update(verifier).digest("base64url");

  let url: string;
  try {
    url = googleAuthUrl(state, challenge);
  } catch (error) {
    console.error("google start failed", error);
    redirect("/login?error=google_unavailable");
  }

  const jar = await cookies();
  const options = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/api/auth/google",
    maxAge: 600,
  };
  jar.set("g_state", state, options);
  jar.set("g_verifier", verifier, options);

  redirect(url);
}
