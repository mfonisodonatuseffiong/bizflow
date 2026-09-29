import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthLayout } from "@/features/auth/auth-layout";
import { getCurrentUser } from "@/features/auth/current-user";
import LoginForm from "./login-form";

export const metadata: Metadata = {
  title: "Sign in | BizFlow",
  description: "Sign in to your BizFlow workspace.",
};

export default async function LoginPage() {
  if (await getCurrentUser()) redirect("/dashboard");

  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
}
