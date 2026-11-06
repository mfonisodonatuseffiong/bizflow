import { redirect } from "next/navigation";
import { AuthLayout } from "@/features/auth/auth-layout";
import { requireUser } from "@/features/auth/current-user";
import OnboardingForm from "./onboarding-form";

export const metadata = { title: "Set up your business | BizFlow" };

export default async function OnboardingPage({
  searchParams,
}: {
  searchParams: Promise<{ new?: string }>;
}) {
  const user = await requireUser();
  const { new: isNew } = await searchParams;

  // Users who already have a business only get here via "Create another business".
  if (user.memberships.length > 0 && isNew !== "1") redirect("/dashboard");

  return (
    <AuthLayout>
      <OnboardingForm name={user.name} />
    </AuthLayout>
  );
}