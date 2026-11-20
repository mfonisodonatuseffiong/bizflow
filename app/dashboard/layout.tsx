import { Toaster } from "sonner";
import { AuthBackground } from "@/features/auth/auth-background";
import { requireBusinessContext } from "@/features/auth/context";
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
  // Redirects to login or onboarding when needed, and honours the
  // business the user switched to.
  const { user, business, role, businesses } = await requireBusinessContext();
  const items = getNavItems(getBusinessCategory(business.type));

  return (
    <div className="relative isolate flex min-h-screen bg-pink-200 text-indigo-900">
      <AuthBackground />
      <Sidebar items={items} businessName={business.name} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header
          menu={<MobileNav items={items} businessName={business.name} />}
          businesses={businesses.map((b) => ({ id: b.id, name: b.name }))}
          activeBusinessId={business.id}
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