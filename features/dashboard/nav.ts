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
  { label: "Customers", href: "/dashboard/customers", icon: "customers", soon: true },
  { label: "Payments", href: "/dashboard/payments", icon: "payments", soon: true },
  { label: "Expenses", href: "/dashboard/expenses", icon: "expenses", soon: true },
  { label: "Reports", href: "/dashboard/reports", icon: "reports", soon: true },
  { label: "Settings", href: "/dashboard/settings", icon: "settings", soon: true },
];

const retailCore: NavItem[] = [
  { label: "Products", href: "/dashboard/products", icon: "products" },
  { label: "Inventory", href: "/dashboard/inventory", icon: "inventory", soon: true },
  { label: "Sales", href: "/dashboard/sales", icon: "sales", soon: true },
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
