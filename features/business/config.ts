export type BusinessCategory = "RETAIL" | "SERVICE";

export const businessTypes = [
  { value: "SUPERMARKET", label: "Supermarket", category: "RETAIL" },
  { value: "MINI_MART", label: "Mini-mart", category: "RETAIL" },
  { value: "PROVISION_STORE", label: "Provision store", category: "RETAIL" },
  { value: "ELECTRONICS", label: "Electronics shop", category: "RETAIL" },
  { value: "FASHION", label: "Fashion store", category: "RETAIL" },
  { value: "GENERAL_MERCHANDISE", label: "General merchandise", category: "RETAIL" },
  { value: "MECHANIC", label: "Mechanic / auto repair", category: "SERVICE" },
  { value: "ELECTRICIAN", label: "Electrician", category: "SERVICE" },
  { value: "PLUMBER", label: "Plumber", category: "SERVICE" },
  { value: "CLEANER", label: "Cleaning service", category: "SERVICE" },
  { value: "AC_TECHNICIAN", label: "AC technician", category: "SERVICE" },
  { value: "TAILOR", label: "Tailor", category: "SERVICE" },
  { value: "SALON_BARBER", label: "Salon / barber", category: "SERVICE" },
  { value: "PHOTOGRAPHER", label: "Photographer", category: "SERVICE" },
  { value: "REPAIR", label: "Repair business", category: "SERVICE" },
] as const satisfies readonly {
  value: string;
  label: string;
  category: BusinessCategory;
}[];

export type BusinessTypeValue = (typeof businessTypes)[number]["value"];

export const countries = [
  { code: "NG", name: "Nigeria", currency: "NGN", timezone: "Africa/Lagos" },
  { code: "GH", name: "Ghana", currency: "GHS", timezone: "Africa/Accra" },
  { code: "KE", name: "Kenya", currency: "KES", timezone: "Africa/Nairobi" },
  { code: "ZA", name: "South Africa", currency: "ZAR", timezone: "Africa/Johannesburg" },
  { code: "GB", name: "United Kingdom", currency: "GBP", timezone: "Europe/London" },
  { code: "US", name: "United States", currency: "USD", timezone: "America/New_York" },
] as const;

export function getBusinessCategory(type: BusinessTypeValue): BusinessCategory {
  return businessTypes.find((t) => t.value === type)!.category;
}
