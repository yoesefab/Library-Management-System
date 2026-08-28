import { z } from "zod";
export const productSchema = z.object({
  sku: z
    .string()
    .trim()
    .min(1, "Le SKU est requis.")
    .max(80)
    .regex(
      /^[A-Za-z0-9._-]+$/,
      "Utilisez uniquement lettres, chiffres, point, tiret ou soulignement.",
    ),
  isbn: z
    .string()
    .trim()
    .max(20)
    .regex(
      /^[0-9Xx-]*$/,
      "L’ISBN contient uniquement des chiffres, X et des tirets.",
    )
    .optional(),
  title: z.string().trim().min(1, "Le titre est requis.").max(300),
  description: z.string().max(4000).optional(),
  language: z
    .string()
    .regex(/^[A-Za-z]{2,3}$/, "Choisissez une langue valide."),
  sellingPrice: z.coerce.number().min(0, "Le prix ne peut pas être négatif."),
  purchaseCost: z.coerce.number().min(0).nullable().optional(),
  minimumStockThreshold: z.coerce.number().int().min(0),
  supplierLeadTimeDays: z.coerce.number().int().min(0).nullable().optional(),
  categoryId: z.coerce.number().int().positive().nullable().optional(),
  publisherId: z.coerce.number().int().positive().nullable().optional(),
  supplierId: z.coerce.number().int().positive().nullable().optional(),
  authorIds: z.array(z.number().int().positive()),
});
export type ProductFormValues = z.infer<typeof productSchema>;
