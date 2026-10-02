import type { BusinessCategory } from "@/features/business/config";

export type NavIcon =
  | "dashboard"
  | "customers"
  | "products"
  | "inventory"
  | "sales"
  | "services"
  | "jobs"
  | "invoices"
  | "payments"
  | "expenses"
  | "reports"
  | "settings";

export type NavItem = {
  label: string;
  href: string;
  icon: NavIcon;
  soon?: boolean;
};

const dashboard: NavItem = { label: "Dashboard", href: "/dashboard", icon: "dashboard" };

const shared: NavItem[] = [
  { label: "Customers", href: "/dashboard/customers", icon: "customers" },
  { label: "Payments", href: "/dashboard/payments", icon: "payments" },
  { label: "Expenses", href: "/dashboard/expenses", icon: "expenses" },
  { label: "Reports", href: "/dashboard/reports", icon: "reports" },
  { label: "Settings", href: "/dashboard/settings", icon: "settings" },
];

const retailCore: NavItem[] = [
  { label: "Products", href: "/dashboard/products", icon: "products" },
  { label: "Inventory", href: "/dashboard/inventory", icon: "inventory" },
  { label: "Sales", href: "/dashboard/sales", icon: "sales" },
];

const serviceCore: NavItem[] = [
  { label: "Services", href: "/dashboard/services", icon: "services", soon: true },
  { label: "Jobs", href: "/dashboard/jobs", icon: "jobs", soon: true },
  { label: "Invoices", href: "/dashboard/invoices", icon: "invoices", soon: true },
];

export function getNavItems(category: BusinessCategory): NavItem[] {
  const core = category === "RETAIL" ? retailCore : serviceCore;
  const [customers, ...rest] = shared;
  return [dashboard, ...core, customers, ...rest];
}
