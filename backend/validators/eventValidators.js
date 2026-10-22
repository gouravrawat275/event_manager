import { z } from "zod";

export const createEventSchema = z.object({
  title: z.string().trim().min(3).max(120),
  description: z.string().trim().min(10),
  shortDescription: z.string().trim().max(200).optional().or(z.literal("")),
  category: z.string().min(1, "Category is required"),
  venue: z.string().trim().min(2),
  city: z.string().trim().min(2),
  address: z.string().trim().optional().or(z.literal("")),
  date: z.coerce.date(),
  time: z.string().min(1),
  organizerName: z.string().trim().min(2),
  organizerEmail: z.string().email().optional().or(z.literal("")),
  organizerPhone: z.string().optional().or(z.literal("")),
  seats: z.coerce.number().int().min(1),
  price: z.coerce.number().min(0),
  status: z.enum(["draft", "published", "cancelled", "completed"]).optional(),
});

export const updateEventSchema = createEventSchema.partial();
