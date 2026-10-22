import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(50),
  icon: z.string().trim().optional(),
  description: z.string().trim().max(200).optional().or(z.literal("")),
  isActive: z.coerce.boolean().optional(),
});

export const updateCategorySchema = createCategorySchema.partial();
