import { redirect } from "next/navigation";
import { Toaster } from "sonner";
import { AuthBackground } from "@/features/auth/auth-background";
import { requireUser } from "@/features/auth/current-user";
import { getBusinessCategory } from "@/features/business/config";
import { getNavItems } from "@/features/dashboard/nav";
import { Sidebar } from "@/features/dashboard/sidebar";
import { Header } from "@/features/dashboard/header";
import { MobileNav } from "@/features/dashboard/mobile-nav";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireUser();
  const membership = user.memberships[0];
  if (!membership) redirect("/onboarding");

  const { business, role } = membership;
  const items = getNavItems(getBusinessCategory(business.type));

  return (
    <div className="relative isolate flex min-h-screen bg-pink-200 text-indigo-900">
      <AuthBackground />
      <Sidebar items={items} businessName={business.name} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header
          menu={<MobileNav items={items} businessName={business.name} />}
          businessName={business.name}
          role={role}
          userName={user.name}
          userEmail={user.email}
        />
        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
      <Toaster position="top-right" theme="light" richColors />
    </div>
  );
}