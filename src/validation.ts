import { z } from "zod";

export const medicationRequestSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  enrolleeID: z.string().min(3, "Enrollee ID is required"),
  scheme: z.string().min(2, "Scheme/Plan is required"),
  phone: z.string().regex(/^[0-9]{10,15}$/, "Enter a valid phone number"),
  address: z.string().min(5, "Address is required"),
  diagnosis: z.string().optional(),
  medications: z.string().optional(),
  requestSource: z.enum(["contactCenter", "telemedicine"]),
  file: z.custom<FileList>().optional(),
});

export type MedicationRequestFormData = z.infer<typeof medicationRequestSchema>;
