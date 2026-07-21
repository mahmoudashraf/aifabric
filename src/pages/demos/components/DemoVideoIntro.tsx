import { useState } from "react";
import { ArrowRight, Clock3, ExternalLink, Languages, PlayCircle, X } from "lucide-react";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import {
  DEMO_VIDEO_PLAYLIST_URL,
  DemoVideoIntroConfig,
  demoVideoDismissalKey,
} from "./demoVideoCatalog";

interface DemoVideoIntroProps {
  config: DemoVideoIntroConfig;
  children: React.ReactNode;
}

const wasDismissed = (demoId: string) => {
  if (typeof window === "undefined") return false;

  try {
    return window.sessionStorage.getItem(demoVideoDismissalKey(demoId)) === "true";
  } catch {
    return false;
  }
};

export default function DemoVideoIntro({ config, children }: DemoVideoIntroProps) {
  const [dismissed, setDismissed] = useState(() => wasDismissed(config.id));
  const [selectedVideoId, setSelectedVideoId] = useState(config.videos[0]?.videoId ?? "");
  const selectedVideo = config.videos.find((video) => video.videoId === selectedVideoId) ?? config.videos[0];

  const openDemo = () => {
    try {
      window.sessionStorage.setItem(demoVideoDismissalKey(config.id), "true");
    } catch {
      // The live demo remains usable when browser storage is unavailable.
    }

    setDismissed(true);
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  if (dismissed || !selectedVideo) {
    return <>{children}</>;
  }

  const embedUrl = `https://www.youtube-nocookie.com/embed/${selectedVideo.videoId}?rel=0&modestbranding=1`;

  return (
    <div className="min-h-screen bg-white text-slate-950">
      <Navbar />

      <main className="pt-16">
        <section className="bg-slate-950 px-5 py-9 text-white sm:px-6 md:py-12">
          <div className="relative mx-auto max-w-6xl pr-12">
            <button
              type="button"
              onClick={openDemo}
              aria-label={`Skip the video and open ${config.demoName}`}
              className="absolute right-0 top-0 flex h-10 w-10 items-center justify-center rounded-md border border-white/20 text-slate-300 transition hover:border-white/40 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
            >
              <X className="h-5 w-5" />
            </button>

            <Badge className="border-cyan-300/30 bg-cyan-300/10 text-cyan-100" variant="outline">
              <PlayCircle className="mr-1 h-3.5 w-3.5" />
              Watch before trying the live app
            </Badge>
            <h1 className="mt-4 max-w-4xl text-3xl font-black leading-tight tracking-normal md:text-5xl">
              See {config.demoName} in action.
            </h1>
            <p className="mt-4 max-w-3xl text-base leading-7 text-slate-300 md:text-lg md:leading-8">
              {config.description}
            </p>
          </div>
        </section>

        <section className="px-5 py-8 sm:px-6 md:py-10">
          <div className="mx-auto max-w-6xl">
            <div className="mb-4 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div>
                <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
                  <span className="inline-flex items-center gap-1.5">
                    <Clock3 className="h-4 w-4 text-blue-700" />
                    {selectedVideo.durationLabel}
                  </span>
                  <span aria-hidden="true">|</span>
                  <span>Recorded walkthrough</span>
                </div>
                <h2 className="mt-2 text-xl font-bold text-slate-950 md:text-2xl">{selectedVideo.title}</h2>
              </div>

              {config.videos.length > 1 && (
                <div>
                  <p className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wide text-slate-500">
                    <Languages className="h-4 w-4" />
                    Video language
                  </p>
                  <div className="inline-flex rounded-md border border-slate-200 bg-slate-50 p-1" role="group" aria-label="Video language">
                    {config.videos.map((video) => {
                      const selected = video.videoId === selectedVideo.videoId;
                      return (
                        <button
                          key={video.videoId}
                          type="button"
                          aria-pressed={selected}
                          onClick={() => setSelectedVideoId(video.videoId)}
                          className={cn(
                            "min-w-24 rounded px-4 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600",
                            selected ? "bg-white text-blue-700 shadow-sm" : "text-slate-600 hover:text-slate-950"
                          )}
                        >
                          {video.languageLabel}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="aspect-video w-full overflow-hidden rounded-md border border-slate-300 bg-black shadow-xl shadow-slate-950/10">
              <iframe
                key={selectedVideo.videoId}
                src={embedUrl}
                title={selectedVideo.title}
                className="h-full w-full"
                loading="eager"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>

            <div className="mt-6 flex flex-col justify-between gap-4 border-t border-slate-200 pt-6 sm:flex-row sm:items-center">
              <p className="max-w-xl text-sm leading-6 text-slate-600">
                The next screen is the interactive live application. The video is optional and can be skipped at any time.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <Button variant="outline" onClick={openDemo} className="border-slate-300 bg-white">
                  Skip video
                </Button>
                <Button onClick={openDemo} className="bg-blue-700 text-white hover:bg-blue-800">
                  Open live demo
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>

            <a
              href={DEMO_VIDEO_PLAYLIST_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-blue-700 hover:text-blue-900"
            >
              View the complete demo video playlist
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
