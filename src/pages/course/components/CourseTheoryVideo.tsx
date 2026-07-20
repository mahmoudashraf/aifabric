import { BookText, CheckCircle2, Clock3, ExternalLink, Film, LockKeyhole } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

import { useCourseAuth } from "../hooks/useCourseAuth";
import type { LessonProgress, RenderedCourseLesson } from "../types";

const embedUrl = (url: string) => {
  const youtube = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([\w-]{11})/);
  if (youtube) return `https://www.youtube-nocookie.com/embed/${youtube[1]}`;
  return url;
};

interface CourseTheoryVideoProps {
  lesson: RenderedCourseLesson;
  progress?: LessonProgress;
  onMarkWatched: () => Promise<unknown>;
  saving: boolean;
}

export const CourseTheoryVideo = ({ lesson, progress, onMarkWatched, saving }: CourseTheoryVideoProps) => {
  const auth = useCourseAuth();
  const [transcriptOpen, setTranscriptOpen] = useState(false);
  const available = lesson.video.status === "published" && Boolean(lesson.video.publicUrl);
  const sourcePackUrl = lesson.sourceUrl.replace(/lesson\.md$/, "notebooklm/source-manifest.yml");

  return (
    <section id="theory" className="scroll-mt-32 border-y border-border bg-white py-8" aria-labelledby="theory-heading">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase text-blue-700">
            <Film className="h-4 w-4" />
            Theory first
          </div>
          <h2 id="theory-heading" className="mt-2 text-2xl font-bold tracking-normal text-slate-950">
            {lesson.video.title}
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            Trace the architecture and ownership boundaries before touching the implementation.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline"><Clock3 className="mr-1 h-3.5 w-3.5" />{lesson.video.targetDurationMinutes} min target</Badge>
          <Badge className={available ? "bg-emerald-600" : "bg-amber-500 text-slate-950 hover:bg-amber-500"}>
            {available ? "Published" : "Script ready"}
          </Badge>
        </div>
      </div>

      <div className="aspect-video w-full overflow-hidden rounded-md border border-slate-200 bg-slate-950">
        {available && lesson.video.publicUrl ? (
          <iframe
            src={embedUrl(lesson.video.publicUrl)}
            title={lesson.video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="h-full w-full"
          />
        ) : (
          <div className="flex h-full flex-col items-center justify-center px-6 text-center text-white">
            <span className="flex h-14 w-14 items-center justify-center rounded-full border border-slate-600 bg-slate-900">
              <LockKeyhole className="h-6 w-6 text-amber-400" />
            </span>
            <h3 className="mt-5 text-lg font-bold tracking-normal">Recording not published yet</h3>
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-300">
              The NotebookLM source pack is script-ready. This preview exposes the reviewed theory brief
              without claiming a video has been recorded or approved.
            </p>
          </div>
        )}
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <Collapsible open={transcriptOpen} onOpenChange={setTranscriptOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="outline" size="sm">
                <BookText className="h-4 w-4" />
                {transcriptOpen ? "Hide theory script" : "Read theory script"}
              </Button>
            </CollapsibleTrigger>
          </Collapsible>
          <Button variant="outline" size="sm" asChild>
            <a href={sourcePackUrl} target="_blank" rel="noopener noreferrer">
              Source pack
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        </div>
        {available && (
          <Button
            size="sm"
            disabled={saving || Boolean(progress?.videoCompletedAt) || (!auth.user && !auth.githubAvailable)}
            title={!auth.user ? auth.configurationIssue ?? undefined : undefined}
            onClick={() => {
              if (!auth.user) {
                void auth.signInWithGitHub().catch((error) =>
                  toast.error(error instanceof Error ? error.message : "GitHub sign-in failed"),
                );
                return;
              }
              void onMarkWatched().then(() => toast.success("Theory completion saved")).catch((error) =>
                toast.error(error instanceof Error ? error.message : "Could not save theory progress"),
              );
            }}
          >
            <CheckCircle2 className="h-4 w-4" />
            {progress?.videoCompletedAt ? "Theory watched" : auth.user ? "Mark theory watched" : "Sign in to mark watched"}
          </Button>
        )}
      </div>

      <Collapsible open={transcriptOpen} onOpenChange={setTranscriptOpen}>
        <CollapsibleContent>
          <div className="mt-5 border-l-4 border-blue-500 bg-blue-50 px-5 py-4">
            <p className="whitespace-pre-line text-sm leading-6 text-slate-700">{lesson.video.transcript}</p>
          </div>
        </CollapsibleContent>
      </Collapsible>
    </section>
  );
};
