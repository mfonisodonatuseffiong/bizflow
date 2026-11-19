import type { Metadata } from "next";
import { AuthLayout } from "@/features/auth/auth-layout";
import { getCurrentUser } from "@/features/auth/current-user";
import { acceptInviteAction, startInviteAction } from "@/features/team/actions";
import { btnShine, primaryBtn, smallBtn } from "@/features/ui/glass";
import { hashInviteToken } from "@/lib/invite-token";
import { isValidToken } from "@/lib/pending-invite";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = { title: "Invitation | BizFlow" };

// Kept outside the component so the render stays pure.
function isUsable(invite: { acceptedAt: Date | null; expiresAt: Date }) {
  return !invite.acceptedAt && invite.expiresAt.getTime() > Date.now();
}

function maskEmail(email: string) {
  const [local, domain] = email.split("@");
  return `${local.charAt(0)}***@${domain}`;
}

const card = "text-indigo-900";

export default async function InvitePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  const invite = isValidToken(token)
    ? await prisma.invitation.findUnique({
        where: { tokenHash: hashInviteToken(token) },
        select: {
          email: true,
          role: true,
          acceptedAt: true,
          expiresAt: true,
          business: { select: { name: true } },
        },
      })
    : null;

  if (!invite || !isUsable(invite)) {
    return (
      <AuthLayout>
        <div className={card}>
          <h1 className="text-xl font-semibold">This invitation is no longer valid</h1>
          <p className="mt-2 text-sm text-indigo-800/70">
            It may have expired, been used already, or been cancelled. Ask the
            business owner to send a new one.
          </p>
        </div>
      </AuthLayout>
    );
  }

  const user = await getCurrentUser();
  const roleLabel = invite.role.toLowerCase();

  const heading = (
    <>
      <h1 className="text-xl font-semibold">Join {invite.business.name}</h1>
      <p className="mt-2 text-sm text-indigo-800/70">
        You have been invited as a <b>{roleLabel}</b>. This invitation was sent
        to {maskEmail(invite.email)}.
      </p>
    </>
  );

  if (!user) {
    return (
      <AuthLayout>
        <div className={card}>
          {heading}
          <p className="mt-4 text-sm">Use that email address to continue.</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <form action={startInviteAction}>
              <input type="hidden" name="token" value={token} />
              <input type="hidden" name="to" value="login" />
              <button type="submit" className={`${primaryBtn} px-5 py-2.5`}>
                <span className={btnShine} />
                <span className="relative">Sign in</span>
              </button>
            </form>
            <form action={startInviteAction}>
              <input type="hidden" name="token" value={token} />
              <input type="hidden" name="to" value="register" />
              <button type="submit" className={smallBtn}>
                Create account
              </button>
            </form>
          </div>
        </div>
      </AuthLayout>
    );
  }

  if (user.email.toLowerCase() !== invite.email) {
    return (
      <AuthLayout>
        <div className={card}>
          {heading}
          <p className="mt-4 text-sm font-medium text-red-700">
            You are signed in as {user.email}, which is not the invited address.
            Sign out, then sign in with {maskEmail(invite.email)}.
          </p>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout>
      <div className={card}>
        {heading}
        <form action={acceptInviteAction} className="mt-5">
          <input type="hidden" name="token" value={token} />
          <button type="submit" className={`${primaryBtn} px-5 py-2.5`}>
            <span className={btnShine} />
            <span className="relative">Accept invitation</span>
          </button>
        </form>
      </div>
    </AuthLayout>
  );
}