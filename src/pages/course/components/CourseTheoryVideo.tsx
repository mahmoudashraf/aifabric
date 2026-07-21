import {
  BookText,
  Check,
  CheckCircle2,
  Clock3,
  ExternalLink,
  Film,
  Languages,
  LockKeyhole,
  Play,
  Subtitles,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

import { useCourseAuth } from "../hooks/useCourseAuth";
import { useCourseVideoLanguage } from "../hooks/useCourseVideoLanguage";
import {
  courseTheoryVideos,
  courseVideoEmbedUrl,
  courseVideoPlaylists,
  resolveCourseVideoSource,
  type CourseVideoLanguage,
} from "../lib/courseVideoCatalog";
import type { LessonProgress, RenderedCourseLesson } from "../types";

interface CourseTheoryVideoProps {
  lesson: RenderedCourseLesson;
  progress?: LessonProgress;
  onMarkWatched: () => Promise<unknown>;
  saving: boolean;
}

interface MarkTheoryWatchedProps {
  available: boolean;
  progress?: LessonProgress;
  onMarkWatched: () => Promise<unknown>;
  saving: boolean;
  multiple?: boolean;
}

const MarkTheoryWatched = ({
  available,
  progress,
  onMarkWatched,
  saving,
  multiple = false,
}: MarkTheoryWatchedProps) => {
  const auth = useCourseAuth();
  if (!available) return null;

  return (
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
        void onMarkWatched()
          .then(() => toast.success("Theory completion saved"))
          .catch((error) =>
            toast.error(error instanceof Error ? error.message : "Could not save theory progress"),
          );
      }}
    >
      <CheckCircle2 className="h-4 w-4" />
      {progress?.videoCompletedAt
        ? "Theory watched"
        : auth.user
          ? `Mark theory ${multiple ? "set " : ""}watched`
          : "Sign in to mark watched"}
    </Button>
  );
};

const languageOptions: Array<{ value: CourseVideoLanguage; label: string }> = [
  { value: "en", label: "English" },
  { value: "ar", label: "العربية" },
];

const CourseTheoryCollection = ({
  lesson,
  progress,
  onMarkWatched,
  saving,
}: CourseTheoryVideoProps) => {
  const assignedVideos = lesson.theoryVideoIds
    .map((videoId) => courseTheoryVideos.find((video) => video.id === videoId))
    .filter((video): video is (typeof courseTheoryVideos)[number] => Boolean(video));
  const firstAssignedVideoId = lesson.theoryVideoIds[0] ?? "";
  const [selectedVideoId, setSelectedVideoId] = useState(firstAssignedVideoId);
  const { language, setLanguage } = useCourseVideoLanguage();

  useEffect(() => {
    setSelectedVideoId(firstAssignedVideoId);
  }, [firstAssignedVideoId, lesson.id]);

  const selectedVideo =
    assignedVideos.find((video) => video.id === selectedVideoId) ?? assignedVideos[0];
  if (!selectedVideo) return null;

  const resolvedVideo = resolveCourseVideoSource(selectedVideo, language);
  const allAssigned = assignedVideos.length === lesson.theoryVideoIds.length;

  return (
    <section id="theory" className="scroll-mt-32 border-y border-border bg-white py-8" aria-labelledby="theory-heading">
      <div className="mb-6 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase text-blue-700">
            <Film className="h-4 w-4" />
            Theory first
          </div>
          <h2 id="theory-heading" className="mt-2 text-2xl font-bold tracking-normal text-slate-950">
            Understand the architecture before the exercise
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            Watch the {assignedVideos.length} assigned recordings in order. Only the recording changes
            with language; lesson text, code, questions, and progress stay the same.
          </p>
        </div>
        <div className="shrink-0">
          <p className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase text-slate-500">
            <Languages className="h-4 w-4" />
            Video language
          </p>
          <div className="inline-flex rounded-md border border-slate-200 bg-slate-100 p-1" role="group" aria-label="Lesson video language">
            {languageOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                aria-pressed={language === option.value}
                onClick={() => setLanguage(option.value)}
                className={cn(
                  "min-w-24 rounded px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600",
                  language === option.value
                    ? "bg-white text-blue-700 shadow-sm"
                    : "text-slate-600 hover:text-slate-950",
                )}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_330px]">
        <div className="min-w-0">
          <div className="aspect-video w-full overflow-hidden rounded-md border border-slate-300 bg-slate-950">
            <iframe
              key={`${selectedVideo.id}-${resolvedVideo.language}`}
              src={courseVideoEmbedUrl(resolvedVideo.source.videoId)}
              title={`${selectedVideo.title} lesson video in ${resolvedVideo.language === "ar" ? "Arabic" : "English"}`}
              className="h-full w-full"
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>

          <div className="mt-4 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="outline">{selectedVideo.courseContext}</Badge>
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-500">
                  <Clock3 className="h-3.5 w-3.5" />
                  {resolvedVideo.source.durationLabel}
                </span>
              </div>
              <h3 className="mt-3 text-xl font-bold tracking-normal text-slate-950">{selectedVideo.title}</h3>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">{selectedVideo.description}</p>
            </div>
            <Button variant="outline" size="sm" className="shrink-0" asChild>
              <a href={courseVideoPlaylists[language]} target="_blank" rel="noopener noreferrer">
                Playlist
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          </div>

          {resolvedVideo.fallback && (
            <div className="mt-4 flex items-start gap-3 border-l-4 border-amber-400 bg-amber-50 px-4 py-3 text-sm leading-6 text-slate-700">
              <Subtitles className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" />
              <p>
                The Arabic recording for this topic is not available yet, so the English video is shown.
                The lesson content and saved progress are unchanged.
              </p>
            </div>
          )}

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-5">
            <p className="text-xs leading-5 text-slate-500">
              Complete all assigned recordings before marking this lesson's theory set as watched.
            </p>
            <MarkTheoryWatched
              available={allAssigned}
              progress={progress}
              onMarkWatched={onMarkWatched}
              saving={saving}
              multiple={assignedVideos.length > 1}
            />
          </div>
        </div>

        <div className="divide-y divide-border border-y border-border" aria-label="Assigned theory videos">
          {assignedVideos.map((video, index) => {
            const selected = video.id === selectedVideo.id;
            const resolved = resolveCourseVideoSource(video, language);
            return (
              <button
                key={video.id}
                type="button"
                aria-pressed={selected}
                onClick={() => setSelectedVideoId(video.id)}
                className={cn(
                  "group flex w-full items-start gap-3 px-4 py-5 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600",
                  selected ? "bg-blue-50" : "hover:bg-slate-50",
                )}
              >
                <span className={cn(
                  "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-md",
                  selected ? "bg-blue-700 text-white" : "bg-slate-100 text-slate-600 group-hover:text-blue-700",
                )}>
                  {selected ? <Play className="h-4 w-4 fill-current" /> : <span className="font-mono text-xs font-bold">{String(index + 1).padStart(2, "0")}</span>}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-bold leading-5 text-slate-950">{video.title}</span>
                  <span className="mt-1 block text-xs leading-5 text-slate-500">{resolved.source.durationLabel}</span>
                  <span className={cn(
                    "mt-2 inline-flex items-center gap-1 text-[11px] font-semibold",
                    resolved.fallback ? "text-amber-700" : "text-emerald-700",
                  )}>
                    {resolved.fallback ? "English fallback" : <><Check className="h-3 w-3" />{language === "ar" ? "Arabic video" : "English video"}</>}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

const LegacyCourseTheoryVideo = ({
  lesson,
  progress,
  onMarkWatched,
  saving,
}: CourseTheoryVideoProps) => {
  const [transcriptOpen, setTranscriptOpen] = useState(false);
  const video = lesson.video;
  if (!video) return null;

  const available = video.status === "published" && Boolean(video.publicUrl);
  const sourcePackUrl = lesson.sourceUrl.replace(/lesson\.md$/, "notebooklm/source-manifest.yml");
  const embedUrl = (url: string) => {
    const youtube = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/))([\w-]{11})/);
    if (youtube) return `https://www.youtube-nocookie.com/embed/${youtube[1]}`;
    return url;
  };

  return (
    <section id="theory" className="scroll-mt-32 border-y border-border bg-white py-8" aria-labelledby="theory-heading">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase text-blue-700"><Film className="h-4 w-4" />Theory first</div>
          <h2 id="theory-heading" className="mt-2 text-2xl font-bold tracking-normal text-slate-950">{video.title}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">Trace the architecture and ownership boundaries before touching the implementation.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline"><Clock3 className="mr-1 h-3.5 w-3.5" />{video.targetDurationMinutes} min target</Badge>
          <Badge className={available ? "bg-emerald-600" : "bg-amber-500 text-slate-950 hover:bg-amber-500"}>{available ? "Published" : "Script ready"}</Badge>
        </div>
      </div>

      <div className="aspect-video w-full overflow-hidden rounded-md border border-slate-200 bg-slate-950">
        {available && video.publicUrl ? (
          <iframe src={embedUrl(video.publicUrl)} title={video.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="h-full w-full" />
        ) : (
          <div className="flex h-full flex-col items-center justify-center px-6 text-center text-white">
            <span className="flex h-14 w-14 items-center justify-center rounded-full border border-slate-600 bg-slate-900"><LockKeyhole className="h-6 w-6 text-amber-400" /></span>
            <h3 className="mt-5 text-lg font-bold tracking-normal">Recording not published yet</h3>
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-300">The NotebookLM source pack is script-ready. This preview exposes the reviewed theory brief without claiming a video has been recorded or approved.</p>
          </div>
        )}
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          <Collapsible open={transcriptOpen} onOpenChange={setTranscriptOpen}>
            <CollapsibleTrigger asChild><Button variant="outline" size="sm"><BookText className="h-4 w-4" />{transcriptOpen ? "Hide theory script" : "Read theory script"}</Button></CollapsibleTrigger>
          </Collapsible>
          <Button variant="outline" size="sm" asChild><a href={sourcePackUrl} target="_blank" rel="noopener noreferrer">Source pack<ExternalLink className="h-4 w-4" /></a></Button>
        </div>
        <MarkTheoryWatched available={available} progress={progress} onMarkWatched={onMarkWatched} saving={saving} />
      </div>

      <Collapsible open={transcriptOpen} onOpenChange={setTranscriptOpen}>
        <CollapsibleContent><div className="mt-5 border-l-4 border-blue-500 bg-blue-50 px-5 py-4"><p className="whitespace-pre-line text-sm leading-6 text-slate-700">{video.transcript}</p></div></CollapsibleContent>
      </Collapsible>
    </section>
  );
};

export const CourseTheoryVideo = (props: CourseTheoryVideoProps) =>
  props.lesson.theoryVideoIds.length > 0
    ? <CourseTheoryCollection {...props} />
    : <LegacyCourseTheoryVideo {...props} />;
