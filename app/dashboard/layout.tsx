import { redirect } from "next/navigation";
import { requireUser } from "@/features/auth/current-user";
import { getBusinessCategory } from "@/features/business/config";
import { getNavItems } from "@/features/dashboard/nav";
import { Sidebar } from "@/features/dashboard/sidebar";
import { Header } from "@/features/dashboard/header";

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
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar items={items} businessName={business.name} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header
          businessName={business.name}
          role={role}
          userName={user.name}
          userEmail={user.email}
        />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
