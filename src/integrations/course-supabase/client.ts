import { createClient } from "@supabase/supabase-js";

import type { CourseDatabase } from "./types";

const COURSE_SUPABASE_URL = import.meta.env.VITE_COURSE_SUPABASE_URL;
const COURSE_SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_COURSE_SUPABASE_PUBLISHABLE_KEY;

export const isCourseSupabaseConfigured = Boolean(
  COURSE_SUPABASE_URL && COURSE_SUPABASE_PUBLISHABLE_KEY,
);

export const courseSupabase = createClient<CourseDatabase>(
  COURSE_SUPABASE_URL || "https://course-configuration-required.supabase.co",
  COURSE_SUPABASE_PUBLISHABLE_KEY || "course-configuration-required",
  {
    auth: {
      storage: localStorage,
      storageKey: "ai-fabric-course-auth",
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  },
);

export const getCourseGitHubProviderStatus = async () => {
  if (!isCourseSupabaseConfigured) return false;

  const response = await fetch(`${COURSE_SUPABASE_URL}/auth/v1/settings`, {
    headers: { apikey: COURSE_SUPABASE_PUBLISHABLE_KEY },
  });
  if (!response.ok) throw new Error("Course authentication settings could not be verified");

  const settings = (await response.json()) as { external?: { github?: boolean } };
  return settings.external?.github === true;
};
