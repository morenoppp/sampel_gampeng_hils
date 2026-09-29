import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { generateTripPlan } from "./trip-planner.server";

const tripSchema = z.object({
  destination: z.string().trim().min(2).max(100),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine((date) => !Number.isNaN(Date.parse(date))),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine((date) => !Number.isNaN(Date.parse(date))),
  preferences: z.string().trim().min(3).max(500),
}).refine(({ startDate, endDate }) => endDate >= startDate, "Tanggal selesai harus setelah tanggal mulai.")
  .refine(({ startDate }) => startDate >= new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Jakarta" }), "Tanggal berangkat tidak boleh di masa lalu.")
  .refine(({ startDate, endDate }) => (Date.parse(endDate) - Date.parse(startDate)) / 86400000 <= 13, "Maksimal 14 hari perjalanan.");

export const createTripPlan = createServerFn({ method: "POST" })
  .inputValidator((data) => tripSchema.parse(data))
  .handler(async ({ data }) => generateTripPlan(data));