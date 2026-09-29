"use server";

import argon2 from "argon2";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createSession, destroySession } from "@/lib/session";

export type LoginState = { status: "idle" | "error"; message?: string };

const GENERIC_ERROR = "Incorrect email or password.";

// Verified against when the email doesn't exist, so response time
// doesn't reveal which emails are registered.
let dummyHash: Promise<string> | undefined;
const getDummyHash = () => (dummyHash ??= argon2.hash("bizflow-dummy-password"));

export async function loginAction(
  _previous: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password || password.length > 128) {
    return { status: "error", message: GENERIC_ERROR };
  }

  let userId: string | null = null;
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, passwordHash: true },
    });
    const valid = await argon2.verify(
      user?.passwordHash ?? (await getDummyHash()),
      password,
    );
    if (user && valid) userId = user.id;
  } catch (error) {
    console.error("loginAction failed", error);
    return { status: "error", message: "Something went wrong. Please try again." };
  }

  if (!userId) return { status: "error", message: GENERIC_ERROR };

  await createSession(userId);
  redirect("/dashboard");
}

export async function logoutAction() {
  await destroySession();
  redirect("/login");
}
