"use server";

import argon2 from "argon2";
import { redirect } from "next/navigation";
import { after } from "next/server";
import { prisma } from "@/lib/prisma";
import { resetLink, sendPasswordResetEmail } from "@/lib/reset-email";
import {
  hashResetToken,
  isValidResetToken,
  newResetToken,
  RESET_TTL_MS,
} from "@/lib/reset-token";

export type ForgotState = { status: "idle" | "done" | "error"; message?: string };
export type ResetState = { status: "idle" | "error"; message?: string };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_PER_HOUR = 3;

export async function requestResetAction(
  _previous: ForgotState,
  formData: FormData,
): Promise<ForgotState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  if (!EMAIL_PATTERN.test(email) || email.length > 254) {
    return { status: "error", message: "Enter a valid email address." };
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, name: true },
    });

    if (user) {
      const recent = await prisma.passwordReset.count({
        where: { userId: user.id, createdAt: { gt: new Date(Date.now() - 60 * 60 * 1000) } },
      });

      if (recent < MAX_PER_HOUR) {
        const { token, tokenHash } = newResetToken();
        // Older unused links stop working. They are marked used, not deleted,
        // so they still count toward the hourly limit.
        await prisma.$transaction([
          prisma.passwordReset.updateMany({
            where: { userId: user.id, usedAt: null },
            data: { usedAt: new Date() },
          }),
          prisma.passwordReset.create({
            data: {
              userId: user.id,
              tokenHash,
              expiresAt: new Date(Date.now() + RESET_TTL_MS),
            },
          }),
        ]);

        // Sent after the response, so timing doesn't reveal whether the
        // email has an account.
        after(() =>
          sendPasswordResetEmail({ to: email, name: user.name, link: resetLink(token) }),
        );
      }
    }
  } catch (error) {
    console.error("requestResetAction failed", error);
    return { status: "error", message: "Something went wrong. Please try again." };
  }

  // Same answer whether or not the account exists.
  return {
    status: "done",
    message: "If an account exists for that email, a reset link is on its way.",
  };
}

export async function resetPasswordAction(
  _previous: ResetState,
  formData: FormData,
): Promise<ResetState> {
  const fail = (message: string): ResetState => ({ status: "error", message });

  const token = String(formData.get("token") ?? "");
  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  if (!isValidResetToken(token)) return fail("This reset link is not valid.");
  if (password.length < 8) return fail("Use a password of at least 8 characters.");
  if (password.length > 128) return fail("That password is too long.");
  if (password !== confirm) return fail("The two passwords don't match.");

  let userId: string | null;
  try {
    const passwordHash = await argon2.hash(password);

    userId = await prisma.$transaction(
      async (tx) => {
        const reset = await tx.passwordReset.findUnique({
          where: { tokenHash: hashResetToken(token) },
        });
        if (!reset || reset.usedAt || reset.expiresAt.getTime() < Date.now()) return null;

        // Single use: only one request can flip usedAt from null.
        const claimed = await tx.passwordReset.updateMany({
          where: { id: reset.id, usedAt: null },
          data: { usedAt: new Date() },
        });
        if (claimed.count === 0) return null;

        // New password, and every existing session stops working.
        await tx.user.update({
          where: { id: reset.userId },
          data: { passwordHash, sessionVersion: { increment: 1 } },
        });
        // Any other outstanding links die too.
        await tx.passwordReset.updateMany({
          where: { userId: reset.userId, usedAt: null },
          data: { usedAt: new Date() },
        });
        return reset.userId;
      },
      { maxWait: 15_000, timeout: 30_000 },
    );
  } catch (error) {
    console.error("resetPasswordAction failed", error);
    return fail("Something went wrong. Please try again.");
  }

  if (!userId) {
    return fail("This reset link has expired or was already used. Request a new one.");
  }

  redirect("/login?reset=1");
}