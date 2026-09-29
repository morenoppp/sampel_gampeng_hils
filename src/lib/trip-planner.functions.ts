import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { generateTripPlan } from "./trip-planner.server";

const tripSchema = z.object({
  destination: z.string().trim().min(2).max(100),
  startDate: z.iso.date(),
  endDate: z.iso.date(),
  preferences: z.string().trim().min(3).max(500),
}).refine(({ startDate, endDate }) => endDate >= startDate, "Tanggal selesai harus setelah tanggal mulai.")
  .refine(({ startDate, endDate }) => (Date.parse(endDate) - Date.parse(startDate)) / 86400000 <= 13, "Maksimal 14 hari perjalanan.");

export const createTripPlan = createServerFn({ method: "POST" })
  .inputValidator((data) => tripSchema.parse(data))
  .handler(async ({ data }) => generateTripPlan(data));