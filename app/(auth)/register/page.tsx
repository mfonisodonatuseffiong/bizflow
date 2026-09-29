import type { Metadata } from "next";
import { AuthLayout } from "@/features/auth/auth-layout";
import RegisterForm from "./register-form";

export const metadata: Metadata = {
  title: "Create your account | BizFlow",
  description: "Start managing your business with BizFlow.",
};

export default function RegisterPage() {
  return (
    <AuthLayout>
      <RegisterForm />
    </AuthLayout>
  );
}
