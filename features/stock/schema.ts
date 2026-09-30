import { z } from "zod";

export const restockSchema = z.object({
  productId: z.string().trim().min(1, "Choose a product."),
  quantity: z
    .string()
    .trim()
    .regex(/^\d{1,7}$/, "Enter a whole number, for example 24.")
    .transform(Number)
    .refine((n) => n > 0, "Quantity must be at least 1."),
  note: z
    .string()
    .trim()
    .max(200, "Keep the note under 200 characters.")
    .transform((v) => (v === "" ? undefined : v))
    .optional(),
});

export type RestockInput = z.infer<typeof restockSchema>;
