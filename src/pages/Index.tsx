import { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  Bot,
  CalendarCheck,
  CalendarDays,
  CheckCircle2,
  Clock,
  Code2,
  Database,
  EyeOff,
  Github,
  GitBranch,
  History,
  Layers3,
  LockKeyhole,
  MessageSquare,
  Play,
  RadioTower,
  Server,
  ShieldCheck,
  ShoppingCart,
  Sparkles,
  TrendingUp,
  Users,
  Workflow,
  Zap,
} from "lucide-react";

import Footer from "@/components/Footer";
import { AI_FABRIC_LOGO_LOCKUP_SRC } from "@/components/BrandLogo";
import ConsultationCtaBand from "@/components/ConsultationCtaBand";
import Navbar from "@/components/Navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { nextWebinar, webinarContactLinks } from "@/data/webinars";

const liveDemos = [
  {
    id: "shopping",
    title: "AI Shopping Experience",
    eyebrow: "Commerce RAG + actions",
    href: "/demos/ai-shopping-experience",
    image: "/images/home/ai-shopping-experience.jpg",
    summary: "Stage product, policy, review, coupon, and support evidence, then let AI Fabric answer and operate the cart.",
    proof: "RAG stages, chat memory, cart actions, checkout confirmation",
    accent: "border-blue-200 bg-blue-50 text-blue-700",
    icon: ShoppingCart,
  },
  {
    id: "resolver",
    title: "Account Resolver",
    eyebrow: "Policy-aware resolution",
    href: "/demos/ai-fabric-account-resolver",
    image: "/images/home/account-resolver.jpg",
    summary: "Read current account state, retrieve policies, explain blockers, and resolve payment, address, cancellation, or refund flows.",
    proof: "Resolver mode, profile read action, policy RAG, confirmations",
    accent: "border-rose-200 bg-rose-50 text-rose-700",
    icon: ShieldCheck,
  },
  {
    id: "behavior",
    title: "Behavior Signals",
    eyebrow: "Behavior analytics + agentic UI",
    href: "/demos/ai-fabric-behavior-signals",
    image: "/images/home/behavior-signals.jpg",
    summary: "Feed raw app events into AI Fabric, produce churn insight, and compose user-specific UI recommendations.",
    proof: "Behavior SPI, structured LLM output, persisted insights",
    accent: "border-emerald-200 bg-emerald-50 text-emerald-700",
    icon: TrendingUp,
  },
  {
    id: "tenant",
    title: "Tenant Guard",
    eyebrow: "Scoped retrieval + governed writes",
    href: "/demos/ai-fabric-tenant-guard",
    image: "/images/home/tenant-guard.jpg",
    summary: "Prove tenant metadata filters, role-aware evidence, natural-language write actions, and deletion cleanup.",
    proof: "Vector filters, boundary checks, LLM actions, tenant cleanup",
    accent: "border-violet-200 bg-violet-50 text-violet-700",
    icon: LockKeyhole,
  },
  {
    id: "privacy",
    title: "Privacy Shield",
    eyebrow: "Sensitive-info guard",
    href: "/demos/ai-fabric-privacy-shield",
    image: "/images/home/privacy-shield.jpg",
    summary: "Submit support text with emails, phones, or SSNs and watch AI Fabric return redacted records and safe search proof.",
    proof: "PII detection, redacted persistence, sanitized vector search",
    accent: "border-cyan-200 bg-cyan-50 text-cyan-700",
    icon: EyeOff,
  },
];

const capabilityGroups = [
  {
    title: "Answers grounded in your app",
    detail: "Index domain objects, policies, reviews, tickets, and docs into AI Fabric retrieval so answers cite real app evidence.",
    icon: Database,
    tone: "border-blue-100 bg-blue-50 text-blue-700",
  },
  {
    title: "Actions behind confirmation",
    detail: "Expose existing services as governed actions with parameter extraction, confirmation, access checks, and execution evidence.",
    icon: Workflow,
    tone: "border-amber-100 bg-amber-50 text-amber-700",
  },
  {
    title: "Behavior intelligence",
    detail: "Turn raw product events into sentiment, churn risk, trend, and UI composition signals without inventing another analytics stack.",
    icon: TrendingUp,
    tone: "border-emerald-100 bg-emerald-50 text-emerald-700",
  },
  {
    title: "Tenant-safe AI",
    detail: "Keep retrieval and writes scoped with metadata filters, app-side verification, role rules, and auditable failure modes.",
    icon: ShieldCheck,
    tone: "border-violet-100 bg-violet-50 text-violet-700",
  },
];

const flowSteps = [
  {
    title: "Annotate app data",
    body: "Mark entities, searchable fields, and action handlers in your existing Spring Boot code.",
    icon: Code2,
  },
  {
    title: "Sync evidence",
    body: "AI Fabric indexes selected data into provider-backed vector storage with lifecycle metadata.",
    icon: GitBranch,
  },
  {
    title: "Ask or act",
    body: "Users ask natural-language questions; AI Fabric routes to RAG, suggestions, or governed actions.",
    icon: MessageSquare,
  },
  {
    title: "Verify outcomes",
    body: "The app returns citations, action results, confirmations, policy decisions, and request proof.",
    icon: CheckCircle2,
  },
];

const javaPieces = [
  {
    label: "Entity",
    code: `@Entity
@AICapable(entityType = "product")
public class Product {
  @AISearchable(weight = 1.0)
  private String description;
}`,
  },
  {
    label: "Action",
    code: `@AIAction("checkout_cart")
public CheckoutResult checkout(
  CheckoutCommand command,
  ActionContext context
) { ... }`,
  },
  {
    label: "Provider",
    code: `ai:
  llm:
    provider: openai
  vector:
    provider: lucene
  orchestration:
    mode: iterative`,
  },
];

function scrollToHashTarget() {
  const hash = window.location.hash?.replace("#", "");
  if (!hash) return;
  window.requestAnimationFrame(() => {
    document.getElementById(hash)?.scrollIntoView({ behavior: "smooth", block: "start" });
  });
}

function DemoPreviewWall() {
  const previewOrder = [liveDemos[0], liveDemos[1], liveDemos[3], liveDemos[2], liveDemos[4]];

  return (
    <div className="mx-auto mt-10 max-w-6xl">
      <div className="mb-3 flex flex-col gap-2 text-left sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="border-emerald-200 bg-emerald-50 px-3 py-1 text-emerald-700" variant="outline">
              <span className="mr-1.5 h-2 w-2 rounded-full bg-emerald-500" />
              Live deployed demos
            </Badge>
            <Badge className="border-slate-200 bg-white px-3 py-1 text-slate-700" variant="outline">
              <Server className="mr-1 h-3.5 w-3.5" />
              Spring Boot backends
            </Badge>
          </div>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            Open any app below to test AI Fabric running against a real deployed backend.
          </p>
        </div>
        <Link
          to="/demos"
          className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700 underline underline-offset-4"
        >
          View all live demos
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid gap-3 lg:grid-cols-[1.25fr_0.9fr]">
        <Link
          to={previewOrder[0].href}
          className="group relative min-h-[320px] overflow-hidden rounded-md border border-slate-200 bg-slate-100 shadow-2xl shadow-slate-900/10"
        >
          <img
            src={previewOrder[0].image}
            alt={`${previewOrder[0].title} live demo screenshot`}
            className="h-full min-h-[320px] w-full object-cover object-top transition duration-500 group-hover:scale-[1.02]"
          />
          <div className="absolute left-4 top-4 flex flex-wrap gap-2">
            <Badge className="border-white/80 bg-white/90 text-slate-900" variant="outline">
              Featured live demo
            </Badge>
            <Badge className={previewOrder[0].accent} variant="outline">
              {previewOrder[0].eyebrow}
            </Badge>
          </div>
          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/80 via-slate-950/35 to-transparent p-4 pt-16 text-left text-white">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-white/75">Running on deployed AI Fabric backend</p>
                <h3 className="mt-1 text-xl font-black tracking-normal">{previewOrder[0].title}</h3>
              </div>
              <span className="inline-flex w-fit items-center gap-2 rounded-md bg-white px-3 py-2 text-sm font-bold text-slate-950 shadow-lg">
                Try live demo
                <ArrowRight className="h-4 w-4" />
              </span>
            </div>
          </div>
        </Link>

        <div className="grid gap-3">
          {previewOrder.slice(1).map((demo) => (
            <Link
              key={demo.id}
              to={demo.href}
              className="group grid min-h-[102px] grid-cols-[128px_1fr] overflow-hidden rounded-md border border-slate-200 bg-white shadow-lg shadow-slate-900/5 transition hover:-translate-y-0.5 hover:border-slate-300"
            >
              <img
                src={demo.image}
                alt={`${demo.title} live demo screenshot`}
                className="h-full w-full object-cover object-top transition duration-500 group-hover:scale-[1.04]"
              />
              <div className="p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className={demo.accent} variant="outline">
                    {demo.eyebrow}
                  </Badge>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    live
                  </span>
                </div>
                <h3 className="mt-2 text-base font-bold text-slate-950">{demo.title}</h3>
                <p className="mt-1 line-clamp-2 text-sm leading-5 text-slate-600">{demo.summary}</p>
                <span className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-blue-700">
                  Try live demo
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function DemoCard({ demo }: { demo: (typeof liveDemos)[number] }) {
  const Icon = demo.icon;

  return (
    <article className="overflow-hidden rounded-md border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-900/10">
      <Link to={demo.href} className="block">
        <img src={demo.image} alt={`${demo.title} screenshot`} className="aspect-[16/10] w-full object-cover object-top" />
      </Link>
      <div className="p-5">
        <div className="flex items-center justify-between gap-3">
          <Badge className={demo.accent} variant="outline">
            <Icon className="mr-1 h-3.5 w-3.5" />
            {demo.eyebrow}
          </Badge>
          <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-700">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            live
          </span>
        </div>
        <h3 className="mt-4 text-xl font-bold tracking-normal text-slate-950">{demo.title}</h3>
        <p className="mt-2 min-h-[72px] text-sm leading-6 text-slate-600">{demo.summary}</p>
        <div className="mt-4 rounded-md border border-slate-100 bg-slate-50 p-3 text-sm leading-6 text-slate-700">
          {demo.proof}
        </div>
        <Button asChild className="mt-4 w-full bg-slate-950 hover:bg-slate-800">
          <Link to={demo.href}>
            Open demo
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </article>
  );
}

function WebinarHomeSection() {
  return (
    <section id="webinars" className="border-y border-slate-200 bg-slate-950 px-6 py-14 text-white">
      <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge className="border-white/20 bg-white/10 px-3 py-1 text-white" variant="outline">
              <RadioTower className="mr-1 h-3.5 w-3.5" />
              Next live webinar
            </Badge>
            <Badge className="border-emerald-300/40 bg-emerald-300/10 px-3 py-1 text-emerald-200" variant="outline">
              <CalendarDays className="mr-1 h-3.5 w-3.5" />
              {nextWebinar.status}
            </Badge>
          </div>

          <h2 className="mt-5 text-3xl font-black leading-tight tracking-normal md:text-5xl">
            Learn how AI Fabric enables a real Spring Boot application.
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300">
            The next live session shows how AI Fabric adds retrieval, governed actions, confirmations, memory,
            privacy, and release gates to an existing Java application.
          </p>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="h-12 bg-white px-6 text-slate-950 hover:bg-slate-100">
              <a href={webinarContactLinks.registration} target="_blank" rel="noopener noreferrer">
                Register for webinar
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
            <Button asChild size="lg" variant="outline" className="h-12 border-white/20 bg-transparent px-6 text-white hover:bg-white/10">
              <Link to="/webinars#previous-webinars">
                Previous webinars
                <History className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>

        <article className="overflow-hidden rounded-lg border border-white/10 bg-white text-slate-950 shadow-2xl shadow-black/20">
          <div className="grid gap-0 md:grid-cols-[0.95fr_1.05fr]">
            <div className="bg-blue-50 p-6">
              <p className="text-sm font-bold uppercase tracking-wide text-blue-700">Date preview</p>
              <p className="mt-3 text-3xl font-black leading-tight tracking-normal text-slate-950">
                {nextWebinar.dateLabel}
              </p>
              <p className="mt-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
                <Clock className="h-4 w-4 text-blue-700" />
                {nextWebinar.timeLabel}
              </p>
              <p className="mt-2 text-sm leading-6 text-slate-600">{nextWebinar.duration}</p>
            </div>

            <div className="p-6">
              <Badge className="border-violet-200 bg-violet-50 text-violet-700" variant="outline">
                {nextWebinar.audience}
              </Badge>
              <h3 className="mt-4 text-2xl font-black leading-tight tracking-normal text-slate-950">
                {nextWebinar.title}
              </h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">{nextWebinar.summary}</p>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <Button asChild className="bg-blue-600 hover:bg-blue-700">
                  <a href={webinarContactLinks.registration} target="_blank" rel="noopener noreferrer">
                    Register for webinar
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
                <Button asChild variant="outline" className="border-slate-300 bg-white">
                  <a href={webinarContactLinks.discord} target="_blank" rel="noopener noreferrer">
                    Join Discord
                    <MessageSquare className="ml-2 h-4 w-4" />
                  </a>
                </Button>
                <Button asChild variant="outline" className="border-slate-300 bg-white">
                  <Link to="/webinars">Details</Link>
                </Button>
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}

const Index = () => {
  useEffect(() => {
    scrollToHashTarget();
    window.addEventListener("hashchange", scrollToHashTarget);
    return () => window.removeEventListener("hashchange", scrollToHashTarget);
  }, []);

  return (
    <div className="min-h-screen bg-white text-slate-950">
      <Navbar />

      <main>
        <section className="relative overflow-hidden bg-[#f8fafc] px-6 pb-12 pt-24 md:pt-28">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-5xl text-center">
              <img
                src={AI_FABRIC_LOGO_LOCKUP_SRC}
                alt="AI Fabric"
                className="mx-auto mb-5 h-20 w-auto max-w-[260px] object-contain mix-blend-multiply sm:h-24 sm:max-w-[320px]"
              />
              <div className="flex flex-wrap items-center justify-center gap-2">
                <Badge className="border-emerald-200 bg-emerald-50 px-3 py-1 text-emerald-700" variant="outline">
                  <Sparkles className="mr-1 h-3.5 w-3.5" />
                  Five live AI Fabric apps
                </Badge>
                <Badge className="border-slate-200 bg-white px-3 py-1 text-slate-700" variant="outline">
                  Java-first
                </Badge>
                <Badge className="border-blue-200 bg-blue-50 px-3 py-1 text-blue-700" variant="outline">
                  Spring Boot
                </Badge>
              </div>

              <h1 className="mt-5 text-4xl font-black leading-[1.02] tracking-normal text-slate-950 sm:text-5xl md:mt-6 md:text-6xl md:leading-[1.02]">
                Build AI-enabled applications in Spring Boot with AI Fabric.
              </h1>
              <p className="mx-auto mt-5 max-w-3xl text-base leading-7 text-slate-600 md:mt-6 md:text-xl md:leading-8">
                AI Fabric is an AI enablement framework for Java teams. Add RAG, governed actions, confirmations,
                behavior analysis, tenant-safe retrieval, chat memory, and provider-backed orchestration to existing
                applications while your Spring Boot code remains in control.
              </p>

              <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row md:mt-8">
                <Button asChild size="lg" className="h-12 bg-slate-950 px-6 text-base hover:bg-slate-800">
                  <Link to="/demos">
                    Explore live demos
                    <Play className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="h-12 border-slate-300 bg-white px-6 text-base">
                  <a href="https://github.com/Loom-AI-Labs/ai-fabric-framework" target="_blank" rel="noopener noreferrer">
                    <Github className="mr-2 h-4 w-4" />
                    View framework
                  </a>
                </Button>
                <Button asChild size="lg" variant="outline" className="h-12 border-blue-200 bg-blue-50 px-6 text-base text-blue-700 hover:bg-blue-100 hover:text-blue-800">
                  <Link to="/consultation">
                    <CalendarCheck className="mr-2 h-4 w-4" />
                    Maintainer session
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="h-12 border-violet-200 bg-violet-50 px-6 text-base text-violet-700 hover:bg-violet-100 hover:text-violet-800">
                  <a href={webinarContactLinks.discord} target="_blank" rel="noopener noreferrer">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Join Discord
                  </a>
                </Button>
              </div>

              <div className="mx-auto mt-6 grid max-w-3xl grid-cols-3 gap-2 text-left md:mt-8">
                {[
                  ["5", "deployed AI apps"],
                  ["0.3.3", "current release"],
                  ["OpenAI", "live provider demos"],
                ].map(([value, label]) => (
                  <div key={label} className="rounded-md border border-slate-200 bg-white px-3 py-3 shadow-sm md:px-4">
                    <p className="text-xl font-black text-slate-950 md:text-2xl">{value}</p>
                    <p className="mt-1 text-xs leading-4 text-slate-600 md:text-sm md:leading-5">{label}</p>
                  </div>
                ))}
              </div>
              <p className="mx-auto mt-5 max-w-2xl text-sm leading-6 text-slate-600">
                Created and maintained by{" "}
                <a
                  href="https://www.linkedin.com/in/engmahmoudalgammal/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-slate-950 underline underline-offset-4"
                >
                  Mahmoud Elgammal
                </a>
                .{" "}
                <a
                  href={webinarContactLinks.registration}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-blue-700 underline underline-offset-4"
                >
                  Next webinar: {nextWebinar.shortDateLabel}
                </a>
                .{" "}
                <a
                  href={webinarContactLinks.discord}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-violet-700 underline underline-offset-4"
                >
                  Join the AI Fabric Discord
                </a>
                . Source:{" "}
                <a
                  href="https://github.com/Loom-AI-Labs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-slate-950 underline underline-offset-4"
                >
                  Loom AI Labs GitHub organization
                </a>
                .
              </p>
            </div>

            <DemoPreviewWall />
          </div>
        </section>

        <WebinarHomeSection />

        <section id="live-demos" className="border-y border-slate-200 bg-white px-6 py-16">
          <div className="mx-auto max-w-7xl">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-sm font-bold uppercase tracking-wide text-blue-700">Live proof</p>
                <h2 className="mt-2 text-3xl font-black tracking-normal text-slate-950 md:text-5xl">
                  Start with working AI apps, not promises.
                </h2>
              </div>
              <p className="max-w-2xl text-base leading-7 text-slate-600">
                Each demo has a deployed Spring Boot backend that uses AI Fabric to enable a different application capability.
              </p>
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-5">
              {liveDemos.map((demo) => (
                <DemoCard key={demo.id} demo={demo} />
              ))}
            </div>
          </div>
        </section>

        <ConsultationCtaBand
          className="bg-white py-12"
          title="Exploring AI Fabric for your application?"
          body="Join a free AI Fabric open-source maintainer session to discuss a public or properly redacted Java/Spring Boot workflow and find relevant documentation, demos, modules, and experiments."
        />

        <section id="features" className="bg-slate-950 px-6 py-16 text-white">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
              <div>
                <Badge className="border-white/20 bg-white/10 text-white" variant="outline">
                  <Bot className="mr-1 h-3.5 w-3.5" />
                  AI enablement capabilities
                </Badge>
                <h2 className="mt-5 text-3xl font-black tracking-normal md:text-5xl">
                  The application enablement layer between your Java code and AI providers.
                </h2>
                <p className="mt-5 text-base leading-8 text-slate-300">
                  AI Fabric is not another chatbot skin. It is the application-side AI enablement framework for
                  grounding, routing, protecting, and executing AI capabilities inside Java systems.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                {capabilityGroups.map((capability) => {
                  const Icon = capability.icon;
                  return (
                    <article key={capability.title} className="rounded-md border border-white/10 bg-white/[0.04] p-5">
                      <div className={`inline-flex h-10 w-10 items-center justify-center rounded-md border ${capability.tone}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <h3 className="mt-4 text-lg font-bold text-white">{capability.title}</h3>
                      <p className="mt-2 text-sm leading-6 text-slate-300">{capability.detail}</p>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="bg-[#f8fafc] px-6 py-16">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-3xl text-center">
              <p className="text-sm font-bold uppercase tracking-wide text-emerald-700">Request flow</p>
              <h2 className="mt-2 text-3xl font-black tracking-normal text-slate-950 md:text-5xl">
                Existing code stays in charge.
              </h2>
              <p className="mt-4 text-base leading-7 text-slate-600">
                AI Fabric coordinates the AI parts, but your Spring Boot app owns the data, actions, policies, and final result.
              </p>
            </div>

            <div className="mt-10 grid gap-3 md:grid-cols-4">
              {flowSteps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <article key={step.title} className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex h-10 w-10 items-center justify-center rounded-md bg-slate-950 text-white">
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="text-sm font-black text-slate-300">0{index + 1}</span>
                    </div>
                    <h3 className="mt-5 text-lg font-bold text-slate-950">{step.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{step.body}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section id="modules" className="bg-white px-6 py-16">
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
              <div>
                <Badge className="border-slate-200 bg-slate-50 text-slate-700" variant="outline">
                  <Layers3 className="mr-1 h-3.5 w-3.5" />
                  Java enablement model
                </Badge>
                <h2 className="mt-5 text-3xl font-black tracking-normal text-slate-950 md:text-5xl">
                  A framework developers can actually adopt.
                </h2>
                <p className="mt-5 text-base leading-8 text-slate-600">
                  Use annotations, Spring services, provider configuration, and explicit policies. AI Fabric handles
                  the repetitive orchestration work while your domain model remains recognizable.
                </p>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {[
                    ["Core", "intent, actions, chat session, structured output"],
                    ["RAG", "retrieval, prompt grounding, citations"],
                    ["Indexing", "entity sync, vector lifecycle, metadata"],
                    ["Behavior", "raw events to persisted user insights"],
                  ].map(([name, detail]) => (
                    <div key={name} className="rounded-md border border-slate-200 bg-slate-50 p-4">
                      <p className="font-bold text-slate-950">{name}</p>
                      <p className="mt-1 text-sm leading-6 text-slate-600">{detail}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-3">
                {javaPieces.map((piece) => (
                  <article key={piece.label} className="overflow-hidden rounded-md border border-slate-200 bg-slate-950">
                    <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                      <span className="text-sm font-semibold text-white">{piece.label}</span>
                      <Server className="h-4 w-4 text-slate-400" />
                    </div>
                    <pre className="overflow-x-auto p-4 text-sm leading-6 text-slate-100">
                      <code>{piece.code}</code>
                    </pre>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="register" className="bg-slate-950 px-6 py-16 text-white">
          <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_0.8fr] lg:items-center">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-emerald-300">Ready path</p>
              <h2 className="mt-2 text-3xl font-black tracking-normal md:text-5xl">
                Pick a demo. Then inspect the backend that powers it.
              </h2>
              <p className="mt-4 max-w-3xl text-base leading-8 text-slate-300">
                The fastest way to understand AI Fabric is to run the live apps, open the about pages, and trace the
                Spring Boot request flow from UI to AI Fabric modules.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              <Button asChild size="lg" className="h-12 bg-white text-slate-950 hover:bg-slate-100">
                <Link to="/demos">
                  <Play className="mr-2 h-4 w-4" />
                  Open live demos
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 border-white/20 bg-transparent text-white hover:bg-white/10">
                <Link to="/docs">
                  <BookOpen className="mr-2 h-4 w-4" />
                  Read developer docs
                </Link>
              </Button>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
};

export default Index;
