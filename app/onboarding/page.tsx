import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AuthLayout } from "@/features/auth/auth-layout";
import { linkClass } from "@/features/auth/auth-card";
import { requireUser } from "@/features/auth/current-user";
import { logoutAction } from "@/features/auth/login";
import { getPendingInviteToken } from "@/lib/pending-invite";
import OnboardingForm from "./onboarding-form";

export const metadata: Metadata = { title: "Set up your business | BizFlow" };

export default async function OnboardingPage({
  searchParams,
}: {
  searchParams: Promise<{ new?: string }>;
}) {
  const user = await requireUser();
  const { new: isNew } = await searchParams;
  const hasBusiness = user.memberships.length > 0;

  // Users who already have a business only get here via "Create another business".
  if (hasBusiness && isNew !== "1") redirect("/dashboard");

  const inviteToken = hasBusiness ? null : await getPendingInviteToken();

  return (
    <AuthLayout>
      <div className="w-full max-w-md">
        <OnboardingForm name={user.name} />

        <div className="mt-4 text-center text-sm text-indigo-800/80">
          {hasBusiness ? (
            <Link href="/dashboard" className={linkClass}>
              Cancel and go back to my dashboard
            </Link>
          ) : (
            <>
              <p className="text-xs text-indigo-800/70">
                Not ready? Your account is saved. Sign in any time to finish
                setting up your business.
              </p>
              <div className="mt-3 flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
                {inviteToken ? (
                  <Link href={`/invite/${inviteToken}`} className={linkClass}>
                    Back to your invitation
                  </Link>
                ) : null}
                <form action={logoutAction}>
                  <button type="submit" className={linkClass}>
                    Cancel and sign out
                  </button>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
    </AuthLayout>
  );
}