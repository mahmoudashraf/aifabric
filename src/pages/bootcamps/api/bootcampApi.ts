import { courseSupabase, isCourseSupabaseConfigured } from "@/integrations/course-supabase/client";
import type { CourseJson } from "@/integrations/course-supabase/types";

import type {
  Bootcamp,
  BootcampEnrollment,
  BootcampRegistrationMode,
  BootcampStatus,
  BootcampTeachingLanguage,
  RedeemBootcampInvitationInput,
  RegisterBootcampInterestInput,
} from "../types";

const ensureConfigured = () => {
  if (!isCourseSupabaseConfigured) {
    throw new Error("Bootcamp registration is not configured in this environment.");
  }
};

const benefitsFromJson = (value: CourseJson): string[] =>
  Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];

const mapEnrollment = (row: {
  bootcamp_id: string;
  bootcamp_slug: string;
  contact_email: string;
  enrollment_id: string;
  joined_at: string;
  phone_e164: string;
  whatsapp_consent: boolean;
}): BootcampEnrollment => ({
  enrollmentId: row.enrollment_id,
  bootcampId: row.bootcamp_id,
  bootcampSlug: row.bootcamp_slug,
  contactEmail: row.contact_email,
  phoneE164: row.phone_e164,
  whatsappConsent: row.whatsapp_consent,
  joinedAt: row.joined_at,
});

export const listBootcamps = async (): Promise<Bootcamp[]> => {
  ensureConfigured();
  const { data, error } = await courseSupabase.rpc("list_bootcamps");
  if (error) throw error;

  return (data ?? []).map((row) => ({
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    cohortLabel: row.cohort_label,
    teachingLanguage: row.teaching_language as BootcampTeachingLanguage,
    status: row.status as BootcampStatus,
    registrationMode: row.registration_mode as BootcampRegistrationMode,
    benefits: benefitsFromJson(row.benefits),
    startsAt: row.starts_at,
    enrolled: row.enrolled,
  }));
};

export const getMyBootcampEnrollment = async (
  bootcampSlug: string,
): Promise<BootcampEnrollment | null> => {
  ensureConfigured();
  const { data, error } = await courseSupabase.rpc("get_my_bootcamp_enrollment", {
    p_bootcamp_slug: bootcampSlug,
  });
  if (error) throw error;
  return data?.[0] ? mapEnrollment(data[0]) : null;
};

export const redeemBootcampInvitation = async (
  input: RedeemBootcampInvitationInput,
): Promise<BootcampEnrollment> => {
  ensureConfigured();
  const { data, error } = await courseSupabase.rpc("redeem_bootcamp_invitation", {
    p_bootcamp_slug: input.bootcampSlug,
    p_invitation_code: input.invitationCode,
    p_phone: input.phone,
    p_whatsapp_consent: input.whatsappConsent,
  });
  if (error) throw error;
  if (!data?.[0]) throw new Error("Bootcamp enrollment did not return a confirmation.");
  return mapEnrollment(data[0]);
};

export const registerBootcampInterest = async (
  input: RegisterBootcampInterestInput,
): Promise<void> => {
  ensureConfigured();
  const { data, error } = await courseSupabase.rpc("register_bootcamp_interest", {
    p_bootcamp_slug: input.bootcampSlug,
    p_contact_email: input.contactEmail,
    p_phone: input.phone?.trim() || null,
    p_email_consent: input.emailConsent,
    p_whatsapp_consent: input.whatsappConsent,
    p_website: input.website?.trim() || null,
  });
  if (error) throw error;
  if (data !== true) throw new Error("Interest registration was not confirmed.");
};
