import { z } from "zod";

export const createBookingSchema = z.object({
  eventId: z.string().min(1, "Event is required"),
  ticketCount: z.coerce.number().int().min(1).max(10),
  attendeeName: z.string().trim().min(2),
  attendeeEmail: z.string().email(),
  attendeePhone: z.string().trim().optional().default(""),
});

export const cancelBookingSchema = z.object({
  cancelReason: z.string().trim().max(300).optional(),
});
