import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthLayout } from "@/features/auth/auth-layout";
import { getCurrentUser } from "@/features/auth/current-user";
import LoginForm from "./login-form";

export const metadata: Metadata = {
  title: "Sign in | BizFlow",
  description: "Sign in to your BizFlow workspace.",
};

const NOTICES: Record<string, string> = {
  google_cancelled: "Google sign-in was cancelled.",
  google_failed: "Google sign-in failed. Please try again.",
  google_unverified: "Your Google email isn't verified, so we can't sign you in with it.",
  google_email_exists: "An account with this email already exists. Sign in with your password.",
  google_unavailable: "Google sign-in isn't available right now.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  if (await getCurrentUser()) redirect("/dashboard");
  const { error } = await searchParams;

  return (
    <AuthLayout>
      <LoginForm notice={error ? NOTICES[error] : undefined} />
    </AuthLayout>
  );
}
