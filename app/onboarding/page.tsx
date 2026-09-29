import { redirect } from "next/navigation";
import { AuthLayout } from "@/features/auth/auth-layout";
import { requireUser } from "@/features/auth/current-user";
import OnboardingForm from "./onboarding-form";

export const metadata = { title: "Set up your business | BizFlow" };

export default async function OnboardingPage() {
  const user = await requireUser();
  if (user.memberships.length > 0) redirect("/dashboard");

  return (
    <AuthLayout>
      <OnboardingForm name={user.name} />
    </AuthLayout>
  );
}
