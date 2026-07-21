import { useState } from "react";
import {
  Check,
  Clock3,
  ExternalLink,
  Film,
  Languages,
  Play,
  Subtitles,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { useCourseVideoLanguage } from "../hooks/useCourseVideoLanguage";
import {
  courseTheoryVideos,
  courseVideoEmbedUrl,
  courseVideoPlaylists,
  resolveCourseVideoSource,
  type CourseVideoLanguage,
} from "../lib/courseVideoCatalog";

const languageOptions: Array<{ value: CourseVideoLanguage; label: string }> = [
  { value: "en", label: "English" },
  { value: "ar", label: "العربية" },
];

export const CourseVideoLibrary = () => {
  const [selectedVideoId, setSelectedVideoId] = useState(courseTheoryVideos[0].id);
  const { language, setLanguage } = useCourseVideoLanguage();
  const selectedVideo =
    courseTheoryVideos.find((video) => video.id === selectedVideoId) ?? courseTheoryVideos[0];
  const resolvedVideo = resolveCourseVideoSource(selectedVideo, language);

  return (
    <section className="border-b border-border py-10" aria-labelledby="course-theory-heading">
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase text-blue-700">
            <Film className="h-4 w-4" />
            Theoretical foundations
          </div>
          <h2 id="course-theory-heading" className="mt-2 text-2xl font-bold tracking-normal text-slate-950">
            Start with the architecture behind the labs
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
            Choose English or Arabic for the recordings. Lesson text, code, questions, and saved progress
            stay identical in both modes.
          </p>
        </div>

        <div className="shrink-0">
          <p className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase text-slate-500">
            <Languages className="h-4 w-4" />
            Video language
          </p>
          <div
            className="inline-flex rounded-md border border-slate-200 bg-slate-100 p-1"
            role="group"
            aria-label="Course video language"
          >
            {languageOptions.map((option) => {
              const selected = language === option.value;
              return (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => setLanguage(option.value)}
                  className={cn(
                    "min-w-24 rounded px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600",
                    selected
                      ? "bg-white text-blue-700 shadow-sm"
                      : "text-slate-600 hover:text-slate-950",
                  )}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-7 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="min-w-0">
          <div className="aspect-video w-full overflow-hidden rounded-md border border-slate-300 bg-slate-950 shadow-lg shadow-slate-950/10">
            <iframe
              key={`${selectedVideo.id}-${resolvedVideo.language}`}
              src={courseVideoEmbedUrl(resolvedVideo.source.videoId)}
              title={`${selectedVideo.title} course video in ${resolvedVideo.language === "ar" ? "Arabic" : "English"}`}
              className="h-full w-full"
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>

          <div className="mt-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
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
                View playlist
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          </div>

          {resolvedVideo.fallback && (
            <div className="mt-4 flex items-start gap-3 border-l-4 border-amber-400 bg-amber-50 px-4 py-3 text-sm leading-6 text-slate-700">
              <Subtitles className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" />
              <p>
                The Arabic recording for this topic is not available yet, so the English video is shown.
                The lesson content and course progress are unchanged.
              </p>
            </div>
          )}
        </div>

        <div className="divide-y divide-border border-y border-border bg-white" aria-label="Course theory videos">
          {courseTheoryVideos.map((video, index) => {
            const selected = video.id === selectedVideo.id;
            const resolved = resolveCourseVideoSource(video, language);

            return (
              <button
                key={video.id}
                type="button"
                aria-pressed={selected}
                onClick={() => setSelectedVideoId(video.id)}
                className={cn(
                  "group flex w-full items-start gap-4 px-4 py-5 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-blue-600",
                  selected ? "bg-blue-50" : "hover:bg-slate-50",
                )}
              >
                <span
                  className={cn(
                    "mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-md",
                    selected ? "bg-blue-700 text-white" : "bg-slate-100 text-slate-600 group-hover:text-blue-700",
                  )}
                >
                  {selected ? <Play className="h-4 w-4 fill-current" /> : <span className="font-mono text-xs font-bold">{String(index + 1).padStart(2, "0")}</span>}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-bold leading-5 text-slate-950">{video.title}</span>
                  <span className="mt-1 block text-xs leading-5 text-slate-500">{video.courseContext}</span>
                  <span className="mt-2 flex flex-wrap items-center gap-2 text-[11px] font-semibold text-slate-500">
                    <span>{resolved.source.durationLabel}</span>
                    {resolved.fallback ? (
                      <span className="text-amber-700">English fallback</span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-emerald-700">
                        <Check className="h-3 w-3" />
                        {language === "ar" ? "Arabic video" : "English video"}
                      </span>
                    )}
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
