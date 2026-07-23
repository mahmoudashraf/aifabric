import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  Boxes,
  Brain,
  CheckCircle2,
  FileText,
  GitPullRequest,
  GraduationCap,
  Map,
  Play,
  Shield,
  Sparkles,
  TestTube,
} from "lucide-react";

import DocsLayout from "@/components/docs/DocsLayout";

const primarySections = [
  {
    title: "Structured Course",
    description: "Follow a version-pinned path from semantic search through governed actions, memory, security, and release evidence.",
    href: "/course",
    icon: GraduationCap,
    tone: "border-emerald-200 bg-emerald-50 text-emerald-700",
  },
  {
    title: "Getting Started",
    description: "Install AI Fabric 0.3.3, choose the smallest useful module set, and add your first AI-enabled application capability.",
    href: "/docs/getting-started",
    icon: Sparkles,
    tone: "border-blue-200 bg-blue-50 text-blue-700",
  },
  {
    title: "LLM Assistant Context",
    description: "Give coding assistants the opportunity scanner, rules, recipes, and evidence map before they edit code.",
    href: "/docs/llm-context/opportunity-scanner",
    icon: Brain,
    tone: "border-fuchsia-200 bg-fuchsia-50 text-fuchsia-700",
  },
  {
    title: "Framework Stories",
    description: "Read reviewed narrative companions for RAG, actions, chat memory, privacy, tenant guard, and real app demos.",
    href: "/docs/user-stories",
    icon: FileText,
    tone: "border-orange-200 bg-orange-50 text-orange-700",
  },
  {
    title: "Architecture",
    description: "Understand request flow, providers, vector stores, access policy, chat memory, and app ownership.",
    href: "/docs/architecture",
    icon: BookOpen,
    tone: "border-slate-200 bg-slate-50 text-slate-700",
  },
  {
    title: "Modules",
    description: "Map RAG, actions, PII, behavior, chat-session, providers, and vector stores to concrete dependencies.",
    href: "/docs/modules",
    icon: Boxes,
    tone: "border-violet-200 bg-violet-50 text-violet-700",
  },
  {
    title: "Security",
    description: "Build tenant/user-safe retrieval and guarded actions with fail-closed application policies.",
    href: "/docs/security",
    icon: Shield,
    tone: "border-emerald-200 bg-emerald-50 text-emerald-700",
  },
  {
    title: "Live Demos",
    description: "Explore the five deployed real apps and inspect their backend architecture pages.",
    href: "/docs/live-demos",
    icon: Play,
    tone: "border-amber-200 bg-amber-50 text-amber-800",
  },
  {
    title: "Testing",
    description: "Run focused module tests, CI-equivalent checks, real provider suites, and release gates.",
    href: "/docs/testing-verification",
    icon: TestTube,
    tone: "border-cyan-200 bg-cyan-50 text-cyan-700",
  },
  {
    title: "Contributing",
    description: "Find safe first tasks, expected test discipline, and the contribution path.",
    href: "/docs/contributing",
    icon: GitPullRequest,
    tone: "border-rose-200 bg-rose-50 text-rose-700",
  },
  {
    title: "Roadmap",
    description: "See what matters next: adoption quality, demo reliability, security clarity, and provider coverage.",
    href: "/docs/roadmap",
    icon: Map,
    tone: "border-indigo-200 bg-indigo-50 text-indigo-700",
  },
];

const releaseFacts = [
  { value: "0.3.3", label: "Current release" },
  { value: "Java 21", label: "Runtime target" },
  { value: "Apache 2.0", label: "License" },
  { value: "5", label: "Live real-app demos" },
];

const quickLinks = [
  { title: "Opportunity scanner", href: "/docs/llm-context/opportunity-scanner" },
  { title: "LLM assistant context", href: "/docs/llm-context" },
  { title: "Reviewed user stories", href: "/docs/user-stories" },
  { title: "Reviewed real app stories", href: "/docs/real-api-stories" },
  { title: "Installation", href: "/docs/installation" },
  { title: "First semantic search", href: "/docs/first-semantic-search" },
  { title: "First RAG chat", href: "/docs/first-rag-chat" },
  { title: "First governed action", href: "/docs/first-governed-action" },
  { title: "Production checklist", href: "/docs/production-checklist" },
];

const Documentation = () => {
  return (
    <DocsLayout>
      <div className="min-h-screen">
        <section className="border-b border-border/50 px-6 py-14">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-5xl"
          >
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
              <FileText className="h-3.5 w-3.5" />
              AI Fabric 0.3.3 documentation
            </span>
            <h1 className="max-w-4xl text-4xl font-black leading-tight tracking-normal text-foreground md:text-6xl">
              Build AI-enabled Java apps with evidence, actions, and guardrails.
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-muted-foreground">
              These are the current public docs for the framework, live real-app demos, testing path,
              contributor funnel, and reviewed framework stories. Older draft story pages are only
              restored when they can point to release-backed material.
            </p>
          </motion.div>
        </section>

        <section className="border-b border-border/50 px-6 py-8">
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {releaseFacts.map((fact) => (
              <div key={fact.label} className="rounded-lg border border-border/60 bg-card p-4">
                <p className="text-2xl font-black text-foreground">{fact.value}</p>
                <p className="mt-1 text-sm text-muted-foreground">{fact.label}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="px-6 py-10">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-foreground">Documentation Sections</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
              Start with the section that matches your job. Each page points to the framework source,
              examples, or deployed demo that backs the explanation.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {primarySections.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
              >
                <Link to={section.href} className="group block h-full">
                  <div className="flex h-full flex-col rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:border-primary/40 hover:shadow-md">
                    <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-lg border ${section.tone}`}>
                      <section.icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground transition-colors group-hover:text-primary">
                      {section.title}
                    </h3>
                    <p className="mt-2 flex-1 text-sm leading-6 text-muted-foreground">{section.description}</p>
                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-primary">
                      Open section
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="border-t border-border/50 px-6 py-10">
          <div className="mb-6 flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold text-foreground">Fast Paths</h2>
          </div>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3 text-sm font-medium text-foreground transition-colors hover:border-primary/40 hover:text-primary"
              >
                {link.title}
                <ArrowRight className="h-4 w-4" />
              </Link>
            ))}
          </div>
        </section>
      </div>
    </DocsLayout>
  );
};

export default Documentation;
