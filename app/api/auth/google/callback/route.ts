import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { NextRequest } from "next/server";
import { exchangeGoogleCode } from "@/lib/google";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/session";

export const dynamic = "force-dynamic";

async function signInWithGoogle(code: string, verifier: string): Promise<string> {
  const profile = await exchangeGoogleCode(code, verifier);
  if (!profile.email || !profile.emailVerified) return "/login?error=google_unverified";

  const linked = await prisma.account.findUnique({
    where: {
      provider_providerAccountId: {
        provider: "google",
        providerAccountId: profile.sub,
      },
    },
    select: { userId: true },
  });

  let userId = linked?.userId;

  if (!userId) {
    // An existing password account is never auto-linked: its email was
    // never verified, so linking would allow account pre-hijacking.
    const existing = await prisma.user.findUnique({
      where: { email: profile.email },
      select: { id: true },
    });
    if (existing) return "/login?error=google_email_exists";

    const user = await prisma.user.create({
      select: { id: true },
      data: {
        email: profile.email,
        name: profile.name ?? profile.email.split("@")[0],
        accounts: {
          create: { provider: "google", providerAccountId: profile.sub },
        },
      },
    });
    userId = user.id;
  }

  await createSession(userId);
  return "/dashboard";
}

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const code = params.get("code");
  const state = params.get("state");

  const jar = await cookies();
  const savedState = jar.get("g_state")?.value;
  const verifier = jar.get("g_verifier")?.value;
  for (const name of ["g_state", "g_verifier"]) {
    jar.set(name, "", { path: "/api/auth/google", maxAge: 0 });
  }

  if (params.get("error")) redirect("/login?error=google_cancelled");
  if (!code || !state || !savedState || !verifier || state !== savedState) {
    redirect("/login?error=google_failed");
  }

  let destination: string;
  try {
    destination = await signInWithGoogle(code, verifier);
  } catch (error) {
    console.error("google callback failed", error);
    destination = "/login?error=google_failed";
  }
  redirect(destination);
}
