import type { Session, User } from "@supabase/supabase-js";
import { createContext } from "react";

export interface CourseAuthValue {
  configured: boolean;
  githubAvailable: boolean;
  configurationIssue: string | null;
  authenticationIssue: string | null;
  loading: boolean;
  session: Session | null;
  user: User | null;
  displayName: string | null;
  avatarUrl: string | null;
  signInWithGitHub: () => Promise<void>;
  signOut: () => Promise<void>;
}

export const CourseAuthContext = createContext<CourseAuthValue | null>(null);
