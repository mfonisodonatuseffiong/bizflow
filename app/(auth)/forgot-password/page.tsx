import type { Metadata } from "next";
import { AuthLayout } from "@/features/auth/auth-layout";
import ForgotForm from "./forgot-form";

export const metadata: Metadata = { title: "Forgot password | BizFlow" };

export default function ForgotPasswordPage() {
  return (
    <AuthLayout>
      <ForgotForm />
    </AuthLayout>
  );
}