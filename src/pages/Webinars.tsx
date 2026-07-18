import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CalendarDays,
  CheckCircle2,
  Clock,
  History,
  Linkedin,
  MessageCircle,
  RadioTower,
  Sparkles,
  Users,
  Video,
} from "lucide-react";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { nextWebinar, previousWebinarArchive, webinarContactLinks } from "@/data/webinars";

const preparationItems = [
  "Bring one Spring Boot workflow you want to make AI-enabled.",
  "Think about the evidence your app owns: entities, policies, tickets, docs, events, or actions.",
  "Prepare one production concern: privacy, tenant isolation, testing, rollout, or observability.",
];

function scrollToHashTarget() {
  const hash = window.location.hash?.replace("#", "");
  if (!hash) return;
  window.requestAnimationFrame(() => {
    document.getElementById(hash)?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

const Webinars = () => {
  useEffect(() => {
    scrollToHashTarget();
    window.addEventListener("hashchange", scrollToHashTarget);
    return () => window.removeEventListener("hashchange", scrollToHashTarget);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <Navbar />

      <main className="pt-16">
        <section className="border-b border-slate-200 bg-white px-6 py-16 md:py-20">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="border-violet-200 bg-violet-50 px-3 py-1 text-violet-700" variant="outline">
                  <RadioTower className="mr-1 h-3.5 w-3.5" />
                  Live webinar
                </Badge>
                <Badge className="border-emerald-200 bg-emerald-50 px-3 py-1 text-emerald-700" variant="outline">
                  <CalendarDays className="mr-1 h-3.5 w-3.5" />
                  {nextWebinar.status}
                </Badge>
              </div>

              <h1 className="mt-6 max-w-4xl text-4xl font-black leading-tight tracking-normal text-slate-950 md:text-6xl md:leading-[1.02]">
                AI Fabric live webinars for Java teams.
              </h1>
              <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600 md:text-lg">
                Join practical sessions that show how AI Fabric works inside real Spring Boot applications: RAG,
                governed actions, chat memory, privacy controls, tenant boundaries, behavior intelligence, and
                release-ready testing.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button asChild size="lg" className="h-12 bg-slate-950 px-6 text-base hover:bg-slate-800">
                  <a href={webinarContactLinks.registration} target="_blank" rel="noopener noreferrer">
                    Register for webinar
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
                <Button asChild size="lg" variant="outline" className="h-12 border-slate-300 bg-white px-6 text-base">
                  <a href={webinarContactLinks.discord} target="_blank" rel="noopener noreferrer">
                    Join Discord community
                    <MessageCircle className="ml-2 h-4 w-4" />
                  </a>
                </Button>
                <Button asChild size="lg" variant="outline" className="h-12 border-slate-300 bg-white px-6 text-base">
                  <a href="#previous-webinars">
                    Previous webinars
                    <History className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>

            <article className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-2xl shadow-slate-900/10">
              <div className="border-b border-slate-200 bg-slate-950 p-6 text-white">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <Badge className="border-white/20 bg-white/10 text-white" variant="outline">
                    <Sparkles className="mr-1 h-3.5 w-3.5" />
                    Next live session
                  </Badge>
                  <span className="rounded-full bg-emerald-400 px-3 py-1 text-xs font-bold uppercase tracking-wide text-slate-950">
                    {nextWebinar.status}
                  </span>
                </div>
                <h2 className="mt-5 text-2xl font-black leading-tight tracking-normal md:text-3xl">
                  {nextWebinar.title}
                </h2>
                <p className="mt-4 text-sm leading-6 text-slate-300">{nextWebinar.summary}</p>
              </div>

              <div className="grid gap-4 p-6 sm:grid-cols-2">
                <div className="rounded-md border border-blue-100 bg-blue-50 p-4">
                  <div className="flex items-center gap-2 text-sm font-bold text-blue-800">
                    <CalendarDays className="h-4 w-4" />
                    Date
                  </div>
                  <p className="mt-2 text-lg font-black text-slate-950">{nextWebinar.dateLabel}</p>
                  <p className="mt-1 text-sm text-slate-600">{nextWebinar.timeLabel}</p>
                </div>
                <div className="rounded-md border border-violet-100 bg-violet-50 p-4">
                  <div className="flex items-center gap-2 text-sm font-bold text-violet-800">
                    <Clock className="h-4 w-4" />
                    Format
                  </div>
                  <p className="mt-2 text-lg font-black text-slate-950">{nextWebinar.duration}</p>
                  <p className="mt-1 text-sm text-slate-600">{nextWebinar.audience}</p>
                </div>
              </div>

              <div className="border-t border-slate-200 p-6">
                <p className="text-sm font-bold uppercase tracking-wide text-slate-500">What it covers</p>
                <div className="mt-4 grid gap-3">
                  {nextWebinar.topics.map((topic) => (
                    <div key={topic} className="flex gap-3 rounded-md border border-slate-200 bg-slate-50 p-3">
                      <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                      <p className="text-sm leading-6 text-slate-700">{topic}</p>
                    </div>
                  ))}
                </div>
                <Button asChild className="mt-6 w-full bg-blue-600 hover:bg-blue-700">
                  <a href={webinarContactLinks.registration} target="_blank" rel="noopener noreferrer">
                    Reserve your place
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>
            </article>
          </div>
        </section>

        <section className="px-6 py-14">
          <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-blue-700">Before the session</p>
              <h2 className="mt-2 text-3xl font-black tracking-normal text-slate-950 md:text-4xl">
                Come with one real workflow.
              </h2>
              <p className="mt-4 text-base leading-7 text-slate-600">
                These webinars are designed for applied engineering decisions. The best questions are concrete: which
                module should own retrieval, how an action should be confirmed, or how a demo becomes a release gate.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Button asChild className="bg-blue-600 hover:bg-blue-700">
                  <Link to="/docs">
                    Read the docs
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" className="border-slate-300 bg-white">
                  <a href={webinarContactLinks.linkedin} target="_blank" rel="noopener noreferrer">
                    Follow updates
                    <Linkedin className="ml-2 h-4 w-4" />
                  </a>
                </Button>
                <Button asChild variant="outline" className="border-violet-200 bg-violet-50 text-violet-700 hover:bg-violet-100 hover:text-violet-800">
                  <a href={webinarContactLinks.discord} target="_blank" rel="noopener noreferrer">
                    Join Discord
                    <MessageCircle className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>
            </div>

            <div className="grid gap-3">
              {preparationItems.map((item) => (
                <div key={item} className="flex gap-3 rounded-md border border-slate-200 bg-white p-5 shadow-sm">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-slate-950 text-white">
                    <Users className="h-5 w-5" />
                  </div>
                  <p className="text-sm leading-6 text-slate-700">{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="previous-webinars" className="border-t border-slate-200 bg-white px-6 py-16">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <Badge className="border-slate-200 bg-slate-50 text-slate-700" variant="outline">
                  <History className="mr-1 h-3.5 w-3.5" />
                  Archive
                </Badge>
                <h2 className="mt-4 text-3xl font-black tracking-normal text-slate-950 md:text-5xl">
                  {previousWebinarArchive.title}
                </h2>
                <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
                  {previousWebinarArchive.summary}
                </p>
              </div>
              <Button asChild variant="outline" className="w-fit border-slate-300 bg-white">
                <a href={webinarContactLinks.discord} target="_blank" rel="noopener noreferrer">
                  Discuss topics on Discord
                  <MessageCircle className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>

            <div className="mt-8 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-md bg-white text-slate-700 shadow-sm">
                <Video className="h-7 w-7" />
              </div>
              <h3 className="mt-5 text-xl font-black tracking-normal text-slate-950">
                Webinar archive is ready for recordings.
              </h3>
              <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-600">
                After each public session, this page will list the recording, slides, code references, and follow-up
                notes. Until then, use the next session card above or request a topic directly.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Webinars;
