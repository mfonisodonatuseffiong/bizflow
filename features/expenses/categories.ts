export const expenseCategories = [
  { value: "RENT", label: "Rent" },
  { value: "SALARIES", label: "Salaries" },
  { value: "UTILITIES", label: "Utilities" },
  { value: "TRANSPORT", label: "Transport" },
  { value: "SUPPLIES", label: "Supplies" },
  { value: "MARKETING", label: "Marketing" },
  { value: "OTHER", label: "Other" },
] as const;

export function expenseCategoryLabel(value: string) {
  return expenseCategories.find((c) => c.value === value)?.label ?? value;
}
