export type BootcampStatus = "active" | "coming_soon" | "closed";
export type BootcampRegistrationMode = "invitation" | "interest";
export type BootcampTeachingLanguage = "ar" | "en";

export interface Bootcamp {
  id: string;
  slug: string;
  title: string;
  description: string;
  cohortLabel: string;
  teachingLanguage: BootcampTeachingLanguage;
  status: BootcampStatus;
  registrationMode: BootcampRegistrationMode;
  benefits: string[];
  startsAt: string | null;
  enrolled: boolean;
}

export interface BootcampEnrollment {
  enrollmentId: string;
  bootcampId: string;
  bootcampSlug: string;
  contactEmail: string;
  phoneE164: string;
  whatsappConsent: boolean;
  joinedAt: string;
}

export interface RedeemBootcampInvitationInput {
  bootcampSlug: string;
  invitationCode: string;
  phone: string;
  whatsappConsent: boolean;
}

export interface RegisterBootcampInterestInput {
  bootcampSlug: string;
  contactEmail: string;
  phone?: string;
  emailConsent: boolean;
  whatsappConsent: boolean;
  website?: string;
}
