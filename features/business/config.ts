export type BusinessCategory = "RETAIL" | "SERVICE";

export const businessTypes = [
  { value: "supermarket", label: "Supermarket", category: "RETAIL" },
  { value: "mini_mart", label: "Mini-mart", category: "RETAIL" },
  { value: "provision_store", label: "Provision store", category: "RETAIL" },
  { value: "electronics", label: "Electronics shop", category: "RETAIL" },
  { value: "fashion", label: "Fashion store", category: "RETAIL" },
  { value: "general_merchandise", label: "General merchandise", category: "RETAIL" },
  { value: "mechanic", label: "Mechanic / auto repair", category: "SERVICE" },
  { value: "electrician", label: "Electrician", category: "SERVICE" },
  { value: "plumber", label: "Plumber", category: "SERVICE" },
  { value: "cleaning", label: "Cleaning service", category: "SERVICE" },
  { value: "ac_technician", label: "AC technician", category: "SERVICE" },
  { value: "tailor", label: "Tailor", category: "SERVICE" },
  { value: "salon_barber", label: "Salon / barber", category: "SERVICE" },
  { value: "photographer", label: "Photographer", category: "SERVICE" },
  { value: "repair", label: "Repair business", category: "SERVICE" },
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