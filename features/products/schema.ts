import { z } from "zod";

export const productSchema = z.object({
  name: z.string().trim().min(2, "Enter a product name.").max(120),
  sku: z
    .string()
    .trim()
    .max(64)
    .transform((v) => (v === "" ? undefined : v))
    .optional(),
  price: z
    .string()
    .trim()
    .regex(/^\d{1,9}(\.\d{1,2})?$/, "Enter a valid price, for example 12.50.")
    .transform((v) => Math.round(Number(v) * 100)),
});

export type ProductInput = z.infer<typeof productSchema>;
