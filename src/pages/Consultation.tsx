import { useEffect, useRef } from "react";
import { ArrowRight, CalendarCheck, CheckCircle2, Clock, Code2, Linkedin, Mail, MessageCircle, ShieldCheck, Sparkles } from "lucide-react";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const CALENDLY_URL = "https://calendly.com/engmahmoudalgamal/30min";
const LINKEDIN_URL = "https://www.linkedin.com/in/engmahmoudalgammal/";
const WHATSAPP_URL = "https://wa.me/message/O3RF2KNXTHQDF1";
const EMAIL_URL = "mailto:engmahmoudalgamal@gmail.com?subject=AI%20Fabric%20architecture%20discussion";

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

    const existingScript = document.querySelector<HTMLScriptElement>('script[src="https://assets.calendly.com/assets/external/widget.js"]');
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

const discussionTopics = [
  "Choosing the right AI Fabric modules for a Java/Spring Boot app",
  "RAG, semantic retrieval, vector stores, and provider setup",
  "Governed actions, confirmations, privacy, and tenant boundaries",
  "Shaping a practical proof of concept from an existing application",
];

const contactOptions = [
  {
    label: "WhatsApp",
    detail: "Fastest path for quick fit questions and scheduling follow-up.",
    href: WHATSAPP_URL,
    icon: MessageCircle,
  },
  {
    label: "LinkedIn",
    detail: "Best for context, introductions, and follow-up notes.",
    href: LINKEDIN_URL,
    icon: Linkedin,
  },
  {
    label: "Email",
    detail: "Use email when you want to share architecture notes or repo links.",
    href: EMAIL_URL,
    icon: Mail,
  },
];

const Consultation = () => {
  const calendlyRef = useCalendlyInlineWidget();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <Navbar />

      <main className="pt-16">
        <section className="relative overflow-hidden border-b border-slate-200 bg-white px-6 py-16 md:py-20">
          <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="border-blue-200 bg-blue-50 px-3 py-1 text-blue-700" variant="outline">
                  <Sparkles className="mr-1 h-3.5 w-3.5" />
                  Free initial discussion
                </Badge>
                <Badge className="border-slate-200 bg-slate-50 px-3 py-1 text-slate-700" variant="outline">
                  <Clock className="mr-1 h-3.5 w-3.5" />
                  30 minutes
                </Badge>
              </div>

              <h1 className="mt-6 max-w-4xl text-4xl font-black leading-tight tracking-normal text-slate-950 md:text-6xl md:leading-[1.02]">
                Free AI Fabric architecture discussion.
              </h1>
              <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600 md:text-lg">
                Building an AI-enabled Java application and considering AI Fabric? Book a focused session with
                Mahmoud Elgammal to review your use case, choose the right framework modules, and shape a practical
                proof of concept.
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {discussionTopics.map((topic) => (
                  <div key={topic} className="flex gap-3 rounded-md border border-slate-200 bg-slate-50 p-4">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
                    <p className="text-sm leading-6 text-slate-700">{topic}</p>
                  </div>
                ))}
              </div>

              <div className="mt-8 rounded-md border border-amber-200 bg-amber-50 p-4">
                <div className="flex gap-3">
                  <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />
                  <p className="text-sm leading-6 text-amber-900">
                    This is a free initial architecture discussion for teams evaluating AI Fabric. It is scoped to
                    guidance, fit assessment, and proof-of-concept planning.
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-2xl shadow-slate-900/10">
              <div className="mb-3 flex items-center justify-between gap-3 rounded-md border border-slate-100 bg-slate-50 px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-slate-950 text-white">
                    <CalendarCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-950">Book a session</p>
                    <p className="text-sm text-slate-600">Calendly scheduling, 30 minutes</p>
                  </div>
                </div>
                <Button asChild variant="outline" className="hidden border-slate-300 bg-white sm:inline-flex">
                  <a href={CALENDLY_URL} target="_blank" rel="noopener noreferrer">
                    Open Calendly
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>
              <div
                ref={calendlyRef}
                className="min-h-[700px] overflow-hidden rounded-md border border-slate-100 bg-white"
                aria-label="Calendly booking widget for AI Fabric architecture discussion"
              />
            </div>
          </div>
        </section>

        <section className="px-6 py-14">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
              <div>
                <p className="text-sm font-bold uppercase tracking-wide text-blue-700">Prefer async?</p>
                <h2 className="mt-2 text-3xl font-black tracking-normal text-slate-950 md:text-4xl">
                  Send the context first.
                </h2>
                <p className="mt-4 text-base leading-7 text-slate-600">
                  If your use case needs a little setup, share the application shape, AI capability you want, and any
                  public repo or diagram before the session.
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
                      className="group rounded-md border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-lg"
                    >
                      <div className="flex h-11 w-11 items-center justify-center rounded-md bg-blue-50 text-blue-700">
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="mt-4 text-lg font-bold text-slate-950">{option.label}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-600">{option.detail}</p>
                      <p className="mt-4 inline-flex items-center text-sm font-semibold text-blue-700">
                        Contact Mahmoud
                        <ArrowRight className="ml-2 h-4 w-4 transition group-hover:translate-x-1" />
                      </p>
                    </a>
                  );
                })}
              </div>
            </div>

            <div className="mt-5 rounded-md border border-emerald-200 bg-emerald-50 p-5">
              <div className="flex gap-3">
                <MessageCircle className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" />
                <p className="text-sm leading-6 text-emerald-950">
                  For quick questions, WhatsApp is available as a direct contact path. For structured architecture
                  review, book the Calendly session so there is enough time to discuss the application flow.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-slate-200 bg-white px-6 py-14">
          <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1fr_0.7fr] lg:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-emerald-700">Useful preparation</p>
              <h2 className="mt-2 text-3xl font-black tracking-normal text-slate-950 md:text-4xl">
                Bring one real workflow.
              </h2>
              <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
                The best session starts with one concrete user journey: search, answer, resolve, protect, analyze, or
                act. AI Fabric is easiest to evaluate against a real application boundary.
              </p>
            </div>
            <div className="grid gap-3">
              {[
                ["Application shape", "Spring Boot version, key domain objects, and current persistence model."],
                ["AI target", "RAG, governed actions, privacy, tenant safety, behavior, or provider strategy."],
                ["Proof goal", "The smallest demo that would prove the framework fits your app."],
              ].map(([title, body]) => (
                <div key={title} className="rounded-md border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-start gap-3">
                    <Code2 className="mt-0.5 h-5 w-5 shrink-0 text-slate-500" />
                    <div>
                      <p className="font-bold text-slate-950">{title}</p>
                      <p className="mt-1 text-sm leading-6 text-slate-600">{body}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Consultation;
