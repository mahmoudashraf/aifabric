import type { Session, User } from "@supabase/supabase-js";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import { toast } from "sonner";

import {
  courseSupabase,
  getCourseGitHubProviderStatus,
  isCourseSupabaseConfigured,
} from "@/integrations/course-supabase/client";

import { CourseAuthContext, type CourseAuthValue } from "./courseAuthState";
import { getCourseAuthCallbackIssue, getCourseAuthCleanUrl } from "../lib/courseAuthUrl";

const metadataString = (user: User | null, ...keys: string[]) => {
  for (const key of keys) {
    const value = user?.user_metadata?.[key];
    if (typeof value === "string" && value.trim()) return value;
  }
  return null;
};

export const CourseAuthProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(isCourseSupabaseConfigured);
  const [githubAvailable, setGitHubAvailable] = useState(false);
  const [configurationIssue, setConfigurationIssue] = useState<string | null>(null);
  const [authenticationIssue, setAuthenticationIssue] = useState<string | null>(null);

  useEffect(() => {
    if (!isCourseSupabaseConfigured) {
      setLoading(false);
      setConfigurationIssue("Course authentication is not configured in this environment.");
      return;
    }

    let active = true;
    const callbackIssue = getCourseAuthCallbackIssue(window.location.href);
    void Promise.all([courseSupabase.auth.getSession(), getCourseGitHubProviderStatus()])
      .then(([{ data, error }, providerAvailable]) => {
        if (!active) return;
        if (error) throw error;
        setSession(data.session);
        if (data.session) {
          setAuthenticationIssue(null);
        } else if (callbackIssue) {
          setAuthenticationIssue(callbackIssue);
          toast.error(callbackIssue);
        }
        setGitHubAvailable(providerAvailable);
        setConfigurationIssue(
          providerAvailable ? null : "GitHub sign-in is not enabled in the course Supabase project.",
        );
      })
      .catch((error: unknown) => {
        if (!active) return;
        setConfigurationIssue(
          error instanceof Error ? error.message : "Course authentication could not be initialized.",
        );
      })
      .finally(() => {
        if (active) {
          if (callbackIssue) {
            window.history.replaceState(null, "", getCourseAuthCleanUrl(window.location.href));
          }
          setLoading(false);
        }
      });

    const { data } = courseSupabase.auth.onAuthStateChange((event, nextSession) => {
      setSession(nextSession);
      if (event === "SIGNED_IN") setAuthenticationIssue(null);
      setLoading(false);
    });

    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<CourseAuthValue>(() => {
    const user = session?.user ?? null;
    return {
      configured: isCourseSupabaseConfigured,
      githubAvailable,
      configurationIssue,
      authenticationIssue,
      loading,
      session,
      user,
      displayName: metadataString(user, "full_name", "name", "user_name", "preferred_username"),
      avatarUrl: metadataString(user, "avatar_url", "picture"),
      signInWithGitHub: async () => {
        if (!isCourseSupabaseConfigured) throw new Error("Course authentication is not configured");
        if (!githubAvailable) throw new Error("GitHub sign-in is not enabled for the course project");
        setAuthenticationIssue(null);
        const redirectTo = getCourseAuthCleanUrl(window.location.href);
        const { error } = await courseSupabase.auth.signInWithOAuth({
          provider: "github",
          options: { redirectTo },
        });
        if (error) throw error;
      },
      signOut: async () => {
        if (!isCourseSupabaseConfigured) return;
        const { error } = await courseSupabase.auth.signOut();
        if (error) throw error;
        queryClient.removeQueries({ queryKey: ["course-progress"] });
      },
    };
  }, [authenticationIssue, configurationIssue, githubAvailable, loading, queryClient, session]);

  return <CourseAuthContext.Provider value={value}>{children}</CourseAuthContext.Provider>;
};
