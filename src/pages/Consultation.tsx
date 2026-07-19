import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowDown,
  ArrowRight,
  CalendarCheck,
  CheckCircle2,
  Clock,
  Code2,
  Compass,
  Database,
  Linkedin,
  Mail,
  MessageCircle,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
  Workflow,
} from "lucide-react";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const CALENDLY_URL = "https://calendly.com/engmahmoudalgamal/30min";
const LINKEDIN_URL = "https://www.linkedin.com/in/engmahmoudalgammal/";
const WHATSAPP_URL = "https://wa.me/message/O3RF2KNXTHQDF1";
const EMAIL_URL = "mailto:engmahmoudalgamal@gmail.com?subject=AI%20Fabric%20architecture%20discussion";
const PORTRAIT_URL = "/images/people/mahmoud-elgammal-consultation.jpg";

declare global {
  interface Window {
    Calendly?: {
      initInlineWidget?: (options: {
        url: string;
        parentElement: HTMLElement;
        prefill?: Record<string, unknown>;
        utm?: Record<string, unknown>;
      }) => void;
    };
  }
}

function useCalendlyInlineWidget() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let cancelled = false;

    const initWidget = () => {
      if (cancelled || !containerRef.current || !window.Calendly?.initInlineWidget) {
        return;
      }

      containerRef.current.innerHTML = "";
      window.Calendly.initInlineWidget({
        url: CALENDLY_URL,
        parentElement: containerRef.current,
      });
    };

    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[src="https://assets.calendly.com/assets/external/widget.js"]',
    );
    if (existingScript) {
      if (window.Calendly?.initInlineWidget) {
        initWidget();
      } else {
        existingScript.addEventListener("load", initWidget, { once: true });
      }
      return () => {
        cancelled = true;
        existingScript.removeEventListener("load", initWidget);
      };
    }

    const script = document.createElement("script");
    script.src = "https://assets.calendly.com/assets/external/widget.js";
    script.async = true;
    script.addEventListener("load", initWidget, { once: true });
    document.body.appendChild(script);

    return () => {
      cancelled = true;
      script.removeEventListener("load", initWidget);
    };
  }, []);

  return containerRef;
}

const discussionFocuses = [
  {
    id: "starting-point",
    label: "Find the starting point",
    shortLabel: "Start",
    icon: Compass,
    heading: "Turn one application workflow into a credible first proof.",
    description:
      "We will identify where AI Fabric creates useful leverage without forcing AI into parts of your application that already work well.",
    outcomes: [
      "A recommended first capability and module set",
      "A small proof-of-concept boundary",
      "The main implementation risks to validate early",
    ],
    preparation: ["Your Spring Boot version", "One user workflow", "The outcome you want to improve"],
  },
  {
    id: "rag",
    label: "Design trustworthy RAG",
    shortLabel: "RAG",
    icon: Search,
    heading: "Ground answers in evidence your application can own and inspect.",
    description:
      "We will map your source data, retrieval boundaries, provider choice, and the evidence users need to trust generated answers.",
    outcomes: [
      "A source-to-index data flow",
      "A retrieval and metadata-filtering approach",
      "A practical quality and lifecycle test plan",
    ],
    preparation: ["A sample source document", "Expected search questions", "Your preferred vector provider, if any"],
  },
  {
    id: "actions",
    label: "Govern AI actions",
    shortLabel: "Actions",
    icon: ShieldCheck,
    heading: "Let AI propose useful work while your application keeps authority.",
    description:
      "We will separate read operations from writes, define confirmation boundaries, and keep action execution inside your domain services.",
    outcomes: [
      "A candidate action catalog",
      "Confirmation and access-control boundaries",
      "A safe request-to-execution flow",
    ],
    preparation: ["One domain operation", "Required user context", "The writes that must require confirmation"],
  },
  {
    id: "production",
    label: "Review production readiness",
    shortLabel: "Production",
    icon: Workflow,
    heading: "Pressure-test the path from a working demo to a releasable service.",
    description:
      "We will review privacy, tenancy, memory, provider failure behavior, observability, and the tests needed around your chosen workflow.",
    outcomes: [
      "A focused production risk map",
      "Recommended framework boundaries and providers",
      "A release-oriented verification checklist",
    ],
    preparation: ["A current architecture sketch", "Security constraints", "The failure modes that matter most"],
  },
] as const;

const sessionSteps = [
  {
    icon: Target,
    step: "01",
    title: "Frame the workflow",
    body: "Start with the user journey, the current Java application boundary, and the result worth proving.",
  },
  {
    icon: Database,
    step: "02",
    title: "Map the AI shape",
    body: "Choose the useful AI Fabric capabilities, data flow, provider boundaries, and governance controls.",
  },
  {
    icon: Code2,
    step: "03",
    title: "Define the next build",
    body: "Leave with a focused proof, the first implementation steps, and the risks that deserve tests.",
  },
];

const contactOptions = [
  {
    label: "WhatsApp",
    detail: "Quick fit questions",
    href: WHATSAPP_URL,
    icon: MessageCircle,
    accent: "text-emerald-700 bg-emerald-50 border-emerald-200",
  },
  {
    label: "LinkedIn",
    detail: "Professional context",
    href: LINKEDIN_URL,
    icon: Linkedin,
    accent: "text-blue-700 bg-blue-50 border-blue-200",
  },
  {
    label: "Email",
    detail: "Repos and diagrams",
    href: EMAIL_URL,
    icon: Mail,
    accent: "text-slate-700 bg-slate-50 border-slate-200",
  },
];

const Consultation = () => {
  const calendlyRef = useCalendlyInlineWidget();
  const [selectedFocusId, setSelectedFocusId] = useState<(typeof discussionFocuses)[number]["id"]>("starting-point");
  const selectedFocus = discussionFocuses.find((focus) => focus.id === selectedFocusId) ?? discussionFocuses[0];

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="min-h-screen bg-white text-slate-950">
      <Navbar />

      <main className="pt-16">
        <section className="border-b border-slate-200 bg-white px-5 pb-14 pt-12 sm:px-6 md:pb-20 md:pt-16">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="border-emerald-200 bg-emerald-50 px-3 py-1 text-emerald-800" variant="outline">
                <Sparkles className="mr-1 h-3.5 w-3.5" />
                Free initial discussion
              </Badge>
              <Badge className="border-slate-200 bg-slate-50 px-3 py-1 text-slate-700" variant="outline">
                <Clock className="mr-1 h-3.5 w-3.5" />
                Focused 30-minute session
              </Badge>
            </div>

            <h1 className="mt-6 max-w-5xl text-4xl font-black leading-tight tracking-normal text-slate-950 md:text-6xl md:leading-[1.04]">
              Bring one Java workflow. Leave with a practical AI path.
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600 md:text-xl md:leading-9">
              A working architecture discussion for teams evaluating AI Fabric. We will connect your Spring Boot
              application to the right retrieval, action, memory, privacy, or provider capabilities and define what to
              prove first.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" className="bg-slate-950 text-white hover:bg-slate-800" onClick={() => scrollTo("book-session")}>
                <CalendarCheck className="mr-2 h-5 w-5" />
                Find a time
              </Button>
              <Button size="lg" variant="outline" className="border-slate-300 bg-white" onClick={() => scrollTo("choose-focus")}>
                Choose a discussion focus
                <ArrowDown className="ml-2 h-5 w-5" />
              </Button>
            </div>

            <div className="mt-10 flex flex-col justify-between gap-6 border-y border-slate-200 py-5 sm:flex-row sm:items-center">
              <div className="flex items-center gap-4">
                <img
                  src={PORTRAIT_URL}
                  alt="Mahmoud Elgammal"
                  className="h-20 w-20 shrink-0 rounded-full border border-slate-200 object-cover shadow-sm"
                  width={80}
                  height={80}
                />
                <div>
                  <p className="text-lg font-bold text-slate-950">Mahmoud Elgammal</p>
                  <p className="mt-0.5 text-sm leading-6 text-slate-600">Creator and maintainer of AI Fabric</p>
                  <a
                    href={LINKEDIN_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-flex items-center text-sm font-semibold text-blue-700 hover:text-blue-900"
                  >
                    <Linkedin className="mr-1.5 h-4 w-4" />
                    View LinkedIn profile
                  </a>
                </div>
              </div>
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-slate-600">
                <span className="inline-flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Java and Spring Boot
                </span>
                <span className="inline-flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Architecture, not a sales call
                </span>
                <span className="inline-flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" /> One useful next step
                </span>
              </div>
            </div>
          </div>
        </section>

        <section id="choose-focus" className="scroll-mt-20 border-b border-slate-200 bg-slate-50 px-5 py-14 sm:px-6 md:py-20">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-3xl">
              <p className="text-sm font-bold uppercase tracking-wide text-blue-700">Choose your conversation</p>
              <h2 className="mt-2 text-3xl font-black tracking-normal text-slate-950 md:text-5xl">What should we work through?</h2>
              <p className="mt-4 text-base leading-8 text-slate-600">
                Select the closest goal. The session stays grounded in your application, not a generic framework tour.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-4" role="group" aria-label="Discussion focus">
              {discussionFocuses.map((focus) => {
                const Icon = focus.icon;
                const selected = focus.id === selectedFocusId;
                return (
                  <button
                    key={focus.id}
                    type="button"
                    aria-pressed={selected}
                    onClick={() => setSelectedFocusId(focus.id)}
                    className={`min-h-28 rounded-md border p-4 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 ${
                      selected
                        ? "border-blue-600 bg-blue-600 text-white shadow-lg shadow-blue-900/10"
                        : "border-slate-200 bg-white text-slate-700 hover:border-blue-300 hover:text-slate-950"
                    }`}
                  >
                    <Icon className={`h-5 w-5 ${selected ? "text-white" : "text-blue-700"}`} />
                    <span className="mt-5 block text-sm font-bold leading-5 sm:text-base">{focus.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="mt-6 min-h-[380px] border-y border-slate-300 bg-white px-5 py-8 sm:px-8 md:min-h-[330px] md:py-10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedFocus.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.18 }}
                  className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:gap-14"
                >
                  <div>
                    <Badge className="border-blue-200 bg-blue-50 text-blue-700" variant="outline">
                      {selectedFocus.shortLabel} discussion
                    </Badge>
                    <h3 className="mt-4 max-w-3xl text-2xl font-black leading-tight text-slate-950 md:text-3xl">
                      {selectedFocus.heading}
                    </h3>
                    <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">{selectedFocus.description}</p>
                    <Button className="mt-6 bg-slate-950 text-white hover:bg-slate-800" onClick={() => scrollTo("book-session")}>
                      Book this discussion
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1">
                    <div>
                      <p className="text-sm font-bold uppercase tracking-wide text-emerald-700">You will leave with</p>
                      <ul className="mt-3 space-y-2.5">
                        {selectedFocus.outcomes.map((outcome) => (
                          <li key={outcome} className="flex gap-2.5 text-sm leading-6 text-slate-700">
                            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                            {outcome}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-sm font-bold uppercase tracking-wide text-amber-700">Useful to bring</p>
                      <ul className="mt-3 space-y-2.5">
                        {selectedFocus.preparation.map((item) => (
                          <li key={item} className="flex gap-2.5 text-sm leading-6 text-slate-700">
                            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-500" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </section>

        <section className="border-b border-slate-200 bg-white px-5 py-14 sm:px-6 md:py-20">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-8 lg:grid-cols-[0.72fr_1.28fr] lg:items-start">
              <div>
                <p className="text-sm font-bold uppercase tracking-wide text-emerald-700">A working session</p>
                <h2 className="mt-2 text-3xl font-black tracking-normal text-slate-950 md:text-4xl">Thirty minutes, three useful moves.</h2>
                <p className="mt-4 text-base leading-8 text-slate-600">
                  No long framework presentation. We use your workflow to make the discussion concrete from the first few minutes.
                </p>
              </div>

              <ol className="grid gap-0 border-y border-slate-200 md:grid-cols-3">
                {sessionSteps.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <li key={item.step} className={`py-6 md:px-6 ${index > 0 ? "border-t border-slate-200 md:border-l md:border-t-0" : ""}`}>
                      <div className="flex items-center justify-between">
                        <Icon className="h-5 w-5 text-blue-700" />
                        <span className="text-sm font-black text-slate-300">{item.step}</span>
                      </div>
                      <h3 className="mt-6 text-lg font-bold text-slate-950">{item.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{item.body}</p>
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>
        </section>

        <section id="book-session" className="scroll-mt-20 bg-slate-50 px-5 py-14 sm:px-6 md:py-20">
          <div className="mx-auto max-w-6xl">
            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
              <div className="max-w-3xl">
                <p className="text-sm font-bold uppercase tracking-wide text-blue-700">Book the discussion</p>
                <h2 className="mt-2 text-3xl font-black tracking-normal text-slate-950 md:text-5xl">Choose a time that works.</h2>
                <p className="mt-4 text-base leading-8 text-slate-600">
                  The initial 30-minute discussion is free. Pick a slot below or open Calendly in a separate window.
                </p>
              </div>
              <Button asChild variant="outline" className="w-fit border-slate-300 bg-white">
                <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer">
                  Open Calendly
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>

            <div className="mt-8 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl shadow-slate-900/5">
              <div className="flex items-center gap-3 border-b border-slate-200 bg-white px-5 py-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-slate-950 text-white">
                  <CalendarCheck className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-bold text-slate-950">AI Fabric architecture discussion</p>
                  <p className="text-sm text-slate-600">30 minutes with Mahmoud Elgammal</p>
                </div>
              </div>
              <div
                ref={calendlyRef}
                className="h-[820px] bg-white sm:h-[760px] lg:h-[720px]"
                aria-label="Calendly booking widget for AI Fabric architecture discussion"
              >
                <div className="flex h-full items-center justify-center px-6 text-center">
                  <div>
                    <CalendarCheck className="mx-auto h-8 w-8 text-blue-700" />
                    <p className="mt-3 font-semibold text-slate-950">Loading available times</p>
                    <p className="mt-1 text-sm text-slate-600">The booking calendar will appear here.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-slate-200 bg-white px-5 py-12 sm:px-6">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
              <div className="max-w-2xl">
                <p className="text-sm font-bold uppercase tracking-wide text-slate-500">Prefer to send context first?</p>
                <h2 className="mt-2 text-2xl font-black text-slate-950 md:text-3xl">Start asynchronously.</h2>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  Share a short workflow description, a public repository, or an architecture diagram before booking.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                {contactOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <a
                      key={option.label}
                      href={option.href}
                      target={option.href.startsWith("http") ? "_blank" : undefined}
                      rel={option.href.startsWith("http") ? "noopener noreferrer" : undefined}
                      className="group flex min-w-48 items-center gap-3 rounded-md border border-slate-200 bg-white p-3.5 transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
                    >
                      <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-md border ${option.accent}`}>
                        <Icon className="h-5 w-5" />
                      </span>
                      <span>
                        <span className="block text-sm font-bold text-slate-950">{option.label}</span>
                        <span className="block text-xs text-slate-500">{option.detail}</span>
                      </span>
                      <ArrowRight className="ml-auto h-4 w-4 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-slate-700" />
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Consultation;
