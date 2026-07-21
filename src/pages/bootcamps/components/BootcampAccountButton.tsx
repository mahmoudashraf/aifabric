import { AlertCircle, BookOpenCheck, LogIn, LogOut, UsersRound } from "lucide-react";
import { Link } from "react-router-dom";
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
import { useCourseAuth } from "@/pages/course/hooks/useCourseAuth";

const initials = (name: string | null) =>
  name
    ? name
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join("")
    : "AI";

export const BootcampAccountButton = () => {
  const auth = useCourseAuth();

  if (auth.loading) return <Skeleton className="h-9 w-28 rounded-md" />;

  if (!auth.user) {
    return (
      <Button
        size="sm"
        variant="outline"
        disabled={!auth.githubAvailable}
        title={auth.authenticationIssue ?? auth.configurationIssue ?? undefined}
        onClick={() => {
          void auth.signInWithGitHub().catch((error) =>
            toast.error(error instanceof Error ? error.message : "GitHub sign-in failed"),
          );
        }}
      >
        {auth.authenticationIssue ? <AlertCircle className="h-4 w-4" /> : <LogIn className="h-4 w-4" />}
        {auth.authenticationIssue ? "Retry sign-in" : "Sign in"}
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="max-w-52 justify-start px-2">
          <Avatar className="h-6 w-6">
            <AvatarImage src={auth.avatarUrl ?? undefined} alt="" />
            <AvatarFallback className="text-[10px]">{initials(auth.displayName)}</AvatarFallback>
          </Avatar>
          <span className="truncate">{auth.displayName ?? auth.user.email ?? "Participant"}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>
          <span className="block truncate">{auth.displayName ?? "Bootcamp participant"}</span>
          <span className="block truncate text-xs font-normal text-muted-foreground">{auth.user.email}</span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/bootcamps">
            <UsersRound className="mr-2 h-4 w-4" />
            Bootcamps
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/course/progress">
            <BookOpenCheck className="mr-2 h-4 w-4" />
            Course progress
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
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
