import { AlertCircle, LogIn, LogOut, UserRound } from "lucide-react";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";

import { useCourseAuth } from "../hooks/useCourseAuth";

const initials = (value: string | null) => {
  if (!value) return "AI";
  return value
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
};

export const CourseAuthButton = ({ compact = false }: { compact?: boolean }) => {
  const auth = useCourseAuth();

  if (auth.loading) return <Skeleton className="h-9 w-32 rounded-md" />;

  if (!auth.user) {
    return (
      <Button
        variant="outline"
        size="sm"
        disabled={!auth.githubAvailable}
        title={
          auth.authenticationIssue ??
          (auth.githubAvailable ? "Save progress across devices" : auth.configurationIssue ?? undefined)
        }
        onClick={() => {
          void auth.signInWithGitHub().catch((error) =>
            toast.error(error instanceof Error ? error.message : "GitHub sign-in failed"),
          );
        }}
      >
        {auth.authenticationIssue ? <AlertCircle className="h-4 w-4" /> : <LogIn className="h-4 w-4" />}
        {auth.authenticationIssue
          ? compact
            ? "Retry sign-in"
            : "Retry GitHub sign-in"
          : compact
            ? "Sign in"
            : "Sign in to save"}
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="max-w-48 justify-start px-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={auth.avatarUrl ?? undefined} alt="" />
            <AvatarFallback className="text-[10px]">{initials(auth.displayName)}</AvatarFallback>
          </Avatar>
          <span className="truncate">{auth.displayName ?? auth.user.email ?? "Learner"}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>
          <span className="block truncate">{auth.displayName ?? "Course learner"}</span>
          <span className="block truncate text-xs font-normal text-muted-foreground">{auth.user.email}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <a href="/course/progress">
            <UserRound className="mr-2 h-4 w-4" />
            My progress
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            void auth.signOut().catch((error) =>
              toast.error(error instanceof Error ? error.message : "Sign out failed"),
            );
          }}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
