"use server";

import argon2 from "argon2";
import { randomBytes } from "node:crypto";
import { redirect } from "next/navigation";
import { after } from "next/server";
import { clearPendingInvite, postLoginPath } from "@/lib/pending-invite";
import { prisma } from "@/lib/prisma";
import { createSession, destroySession } from "@/lib/session";
import { getSignInMeta, sendSignInAlert } from "@/lib/sign-in-alert";

export type LoginState = { status: "idle" | "error"; message?: string };

const GENERIC_ERROR = "Incorrect email or password.";

// Verified against when the email doesn't exist (or has no password), so
// response time doesn't reveal which emails are registered. It is built
// from a random value, so no typed password can ever match it.
let dummyHash: Promise<string> | undefined;
const getDummyHash = () =>
  (dummyHash ??= argon2.hash(randomBytes(32).toString("hex")));

export async function loginAction(
  _previous: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password || password.length > 128) {
    return { status: "error", message: GENERIC_ERROR };
  }

  let signedIn: { id: string; name: string | null } | null = null;
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, name: true, passwordHash: true },
    });
    const hash = user?.passwordHash ?? null;
    // Always run a verify so timing doesn't reveal whether the email exists.
    const valid = await argon2.verify(hash ?? (await getDummyHash()), password);
    // Accept only when the account really has a password hash.
    if (user && hash && valid) signedIn = { id: user.id, name: user.name };
  } catch (error) {
    console.error("loginAction failed", error);
    return { status: "error", message: "Something went wrong. Please try again." };
  }

  if (!signedIn) return { status: "error", message: GENERIC_ERROR };

  await createSession(signedIn.id);

  // Email the user about this sign-in. Runs after the response is sent,
  // so it never slows down or blocks the login.
  const meta = await getSignInMeta();
  const name = signedIn.name;
  after(() => sendSignInAlert({ email, name }, "password", meta));

  // Back to the invitation if one is pending, otherwise the dashboard.
  redirect(await postLoginPath());
}

export async function logoutAction() {
  await destroySession();
  await clearPendingInvite();
  redirect("/login");
}