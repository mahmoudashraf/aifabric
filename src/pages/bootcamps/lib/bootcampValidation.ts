import { z } from "zod";

export const normalizeInternationalPhone = (value: string) =>
  value.trim().replace(/[\s().-]/g, "");

const internationalPhone = z
  .string()
  .transform(normalizeInternationalPhone)
  .refine((value) => /^\+[1-9][0-9]{7,14}$/.test(value), {
    message: "Use international format, for example +447700900123.",
  });

export const bootcampEnrollmentSchema = z.object({
  invitationCode: z.string().trim().min(4, "Enter your invitation code.").max(128),
  phone: internationalPhone,
  whatsappConsent: z.literal(true, {
    errorMap: () => ({ message: "WhatsApp communication consent is required." }),
  }),
});

export const bootcampInterestSchema = z
  .object({
    contactEmail: z.string().trim().email("Enter a valid email address.").max(255),
    phone: z.string().trim().max(32),
    emailConsent: z.literal(true, {
      errorMap: () => ({ message: "Email communication consent is required." }),
    }),
    whatsappConsent: z.boolean(),
    website: z.string().max(255),
  })
  .superRefine((value, context) => {
    if (!value.phone) return;

    if (!/^\+[1-9][0-9]{7,14}$/.test(normalizeInternationalPhone(value.phone))) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["phone"],
        message: "Use international format, for example +447700900123.",
      });
    }
    if (!value.whatsappConsent) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["whatsappConsent"],
        message: "Enable WhatsApp consent or remove the phone number.",
      });
    }
  });

export const firstValidationMessage = (error: z.ZodError) =>
  error.issues[0]?.message ?? "Review the form and try again.";
