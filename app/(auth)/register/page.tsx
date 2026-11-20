import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthLayout } from "@/features/auth/auth-layout";
import { getCurrentUser } from "@/features/auth/current-user";
import { hashInviteToken } from "@/lib/invite-token";
import { getPendingInviteToken, postLoginPath } from "@/lib/pending-invite";
import { prisma } from "@/lib/prisma";
import RegisterForm from "./register-form";

export const metadata: Metadata = {
  title: "Create your account | BizFlow",
  description: "Start managing your business with BizFlow.",
};

// Kept outside the component so the render stays pure.
function isUsable(invite: { acceptedAt: Date | null; expiresAt: Date }) {
  return !invite.acceptedAt && invite.expiresAt.getTime() > Date.now();
}

async function findPendingInvite() {
  const token = await getPendingInviteToken();
  if (!token) return null;

  const found = await prisma.invitation.findUnique({
    where: { tokenHash: hashInviteToken(token) },
    select: {
      email: true,
      acceptedAt: true,
      expiresAt: true,
      business: { select: { name: true } },
    },
  });
  if (!found || !isUsable(found)) return null;
  return { email: found.email, businessName: found.business.name };
}

export default async function RegisterPage() {
  if (await getCurrentUser()) redirect(await postLoginPath());

  const invite = await findPendingInvite();

  return (
    <AuthLayout>
      <RegisterForm invite={invite} />
    </AuthLayout>
  );
}