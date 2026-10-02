import { z } from "zod";

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .transform((v) => (v === "" ? null : v));

export const customerSchema = z.object({
  name: z.string().trim().min(2, "Enter the customer's name.").max(120),
  phone: z
    .string()
    .trim()
    .max(32)
    .regex(/^[+\d\s()-]*$/, "Phone can only contain digits, spaces, + ( ) and -.")
    .transform((v) => (v === "" ? null : v)),
  email: z
    .string()
    .trim()
    .max(200)
    .regex(/^([^\s@]+@[^\s@]+\.[^\s@]+)?$/, "Enter a valid email address.")
    .transform((v) => (v === "" ? null : v.toLowerCase())),
  address: optionalText(200),
});