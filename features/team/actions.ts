"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { isOwner, requireBusinessContext } from "@/features/auth/context";
import { requireUser } from "@/features/auth/current-user";
import { setActiveBusinessCookie } from "@/lib/active-business";
import { inviteLink, sendInviteEmail } from "@/lib/invite-email";
import { hashInviteToken, INVITE_TTL_MS, newInviteToken } from "@/lib/invite-token";
import { clearPendingInvite, isValidToken, setPendingInvite } from "@/lib/pending-invite";
import { prisma } from "@/lib/prisma";

export type InviteState = {
  status: "idle" | "error" | "success";
  message?: string;
  link?: string; // only set when the email could not be sent
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const INVITE_ROLES = ["MANAGER", "STAFF"] as const;
type InviteRole = (typeof INVITE_ROLES)[number];
const isInviteRole = (v: string): v is InviteRole =>
  (INVITE_ROLES as readonly string[]).includes(v);

const MAX_PENDING = 50;
const fail = (message: string): InviteState => ({ status: "error", message });

export async function inviteMemberAction(
  _previous: InviteState,
  formData: FormData,
): Promise<InviteState> {
  const { user, business, role } = await requireBusinessContext();
  if (!isOwner(role)) return fail("Only the owner can invite people.");

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const inviteRole = String(formData.get("role") ?? "");
  if (!EMAIL_PATTERN.test(email) || email.length > 254) {
    return fail("Enter a valid email address.");
  }
  if (!isInviteRole(inviteRole)) return fail("Select a role.");
  if (email === user.email.toLowerCase()) return fail("That is your own email address.");

  const member = await prisma.businessMembership.findFirst({
    where: {
      businessId: business.id,
      user: { email: { equals: email, mode: "insensitive" } },
    },
    select: { id: true },
  });
  if (member) return fail("That person is already on your team.");

  const recent = await prisma.invitation.findFirst({
    where: {
      businessId: business.id,
      email,
      createdAt: { gt: new Date(Date.now() - 60_000) },
    },
    select: { id: true },
  });
  if (recent) return fail("An invitation was just sent. Wait a minute before resending.");

  const pending = await prisma.invitation.count({
    where: { businessId: business.id, acceptedAt: null, expiresAt: { gt: new Date() } },
  });
  if (pending >= MAX_PENDING) return fail("Too many pending invitations. Revoke some first.");

  const { token, tokenHash } = newInviteToken();
  try {
    // A new invite replaces any older pending one for the same email.
    await prisma.$transaction([
      prisma.invitation.deleteMany({
        where: { businessId: business.id, email, acceptedAt: null },
      }),
      prisma.invitation.create({
        data: {
          businessId: business.id,
          email,
          role: inviteRole,
          tokenHash,
          invitedById: user.id,
          expiresAt: new Date(Date.now() + INVITE_TTL_MS),
        },
      }),
    ]);
  } catch (error) {
    console.error("inviteMemberAction failed", error);
    return fail("Something went wrong. Please try again.");
  }

  revalidatePath("/dashboard/settings");

  const link = inviteLink(token);
  const sent = await sendInviteEmail({
    to: email,
    businessName: business.name,
    inviterName: user.name,
    role: inviteRole,
    link,
  });

  if (sent) return { status: "success", message: `Invitation sent to ${email}.` };
  return {
    status: "success",
    message: "The email could not be sent. Share this link with them yourself:",
    link,
  };
}

export async function revokeInviteAction(formData: FormData): Promise<void> {
  const { business, role } = await requireBusinessContext();
  if (!isOwner(role)) return;
  const id = String(formData.get("inviteId") ?? "");
  await prisma.invitation.deleteMany({
    where: { id, businessId: business.id, acceptedAt: null },
  });
  revalidatePath("/dashboard/settings");
}

export async function changeRoleAction(formData: FormData): Promise<void> {
  const { business, role } = await requireBusinessContext();
  if (!isOwner(role)) return;
  const membershipId = String(formData.get("membershipId") ?? "");
  const newRole = String(formData.get("role") ?? "");
  if (!isInviteRole(newRole)) return;
  // Owners are never changed here.
  await prisma.businessMembership.updateMany({
    where: { id: membershipId, businessId: business.id, role: { not: "OWNER" } },
    data: { role: newRole },
  });
  revalidatePath("/dashboard/settings");
}

export async function removeMemberAction(formData: FormData): Promise<void> {
  const { business, role } = await requireBusinessContext();
  if (!isOwner(role)) return;
  const membershipId = String(formData.get("membershipId") ?? "");
  // Owners can't be removed, so a business always keeps its owner.
  await prisma.businessMembership.deleteMany({
    where: { id: membershipId, businessId: business.id, role: { not: "OWNER" } },
  });
  revalidatePath("/dashboard/settings");
}

// Logged-out visitor chose "Sign in" or "Create account" on the invite page.
export async function startInviteAction(formData: FormData): Promise<void> {
  const token = String(formData.get("token") ?? "");
  if (!isValidToken(token)) redirect("/login");
  await setPendingInvite(token);
  redirect(formData.get("to") === "register" ? "/register" : "/login");
}

export async function acceptInviteAction(formData: FormData): Promise<void> {
  const user = await requireUser();
  const token = String(formData.get("token") ?? "");
  if (!isValidToken(token)) redirect("/dashboard");

  const businessId = await prisma.$transaction(async (tx) => {
    const invite = await tx.invitation.findUnique({
      where: { tokenHash: hashInviteToken(token) },
    });
    if (!invite || invite.acceptedAt || invite.expiresAt.getTime() < Date.now()) return null;
    if (invite.email !== user.email.toLowerCase()) return null;

    // Single use: only one request can flip acceptedAt from null.
    const claimed = await tx.invitation.updateMany({
      where: { id: invite.id, acceptedAt: null },
      data: { acceptedAt: new Date() },
    });
    if (claimed.count === 0) return null;

    await tx.businessMembership.upsert({
      where: { userId_businessId: { userId: user.id, businessId: invite.businessId } },
      update: {},
      create: { userId: user.id, businessId: invite.businessId, role: invite.role },
    });
    return invite.businessId;
  });

  // On any failure, the invite page re-renders the correct reason.
  if (!businessId) redirect(`/invite/${token}`);

  await clearPendingInvite();
  await setActiveBusinessCookie(businessId);
  redirect("/dashboard");
}