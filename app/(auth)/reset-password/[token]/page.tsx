import type { Metadata } from "next";
import Link from "next/link";
import { AuthLayout } from "@/features/auth/auth-layout";
import { AuthCard, headingClass, linkClass } from "@/features/auth/auth-card";
import { prisma } from "@/lib/prisma";
import { hashResetToken, isValidResetToken } from "@/lib/reset-token";
import ResetForm from "./reset-form";

export const metadata: Metadata = {
  title: "Choose a new password | BizFlow",
  // Keeps the secret link from leaking to other sites through the Referer header.
  referrer: "no-referrer",
  robots: { index: false },
};

// Outside the component so the render stays pure.
function isUsable(reset: { usedAt: Date | null; expiresAt: Date }) {
  return !reset.usedAt && reset.expiresAt.getTime() > Date.now();
}

export default async function ResetPasswordPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  const reset = isValidResetToken(token)
    ? await prisma.passwordReset.findUnique({
        where: { tokenHash: hashResetToken(token) },
        select: { usedAt: true, expiresAt: true },
      })
    : null;

  if (!reset || !isUsable(reset)) {
    return (
      <AuthLayout>
        <AuthCard>
          <h1 className={headingClass}>Link expired</h1>
          <p className="mt-2 text-sm text-indigo-800/80">
            This reset link is invalid, expired, or was already used.
          </p>
          <p className="mt-5 text-sm">
            <Link href="/forgot-password" className={linkClass}>
              Request a new link
            </Link>
          </p>
        </AuthCard>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <ResetForm token={token} />
    </AuthLayout>
  );
}