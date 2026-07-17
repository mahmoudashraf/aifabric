import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Activity,
  ArrowRight,
  Bot,
  CheckCircle2,
  CreditCard,
  Database,
  EyeOff,
  Layers,
  Lock,
  MessageSquare,
  Search,
  Shield,
  ShieldCheck,
  ShoppingBag,
  Smile,
  Sparkles,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";

import Footer from "@/components/Footer";
import ConsultationCtaBand from "@/components/ConsultationCtaBand";
import Navbar from "@/components/Navbar";
import { Badge } from "@/components/ui/badge";
import { AI_SHOPPING_EXPERIENCE_ROUTE } from "./demos/AIFabricFramework/routes";

const demos = [
  {
    id: "ai-shopping-experience",
    title: "AI Shopping Experience",
    description:
      "Commerce demo with staged RAG evidence, product search, chat memory, cart actions, and checkout confirmation.",
    icon: ShoppingBag,
    features: [
      { icon: Search, label: "Semantic Search" },
      { icon: Bot, label: "RAG Chat" },
      { icon: ShoppingBag, label: "Cart Actions" },
      { icon: Zap, label: "Confirmation Flow" },
    ],
    stats: [
      { value: "5", label: "RAG stages" },
      { value: "Live", label: "Backend" },
      { value: "0.3.3", label: "AI Fabric" },
    ],
    aboutLink: `${AI_SHOPPING_EXPERIENCE_ROUTE}/about`,
    livePreview: {
      eyebrow: "Commerce RAG + actions",
      prompt: "Find high performance laptops, compare evidence, add one to cart, then checkout.",
      proof: "Stage data from no evidence to full product, policy, review, coupon, and support vectors.",
      runtime: "OpenAI + AI Fabric RAG + action orchestration",
    },
    accent: "border-blue-200 bg-blue-50 text-blue-700",
    link: AI_SHOPPING_EXPERIENCE_ROUTE,
  },
  {
    id: "ai-fabric-account-resolver",
    title: "AI Fabric Account Resolver",
    description:
      "Policy-guided account resolution with profile reads, payment/address updates, cancellation, refunds, and confirmations.",
    icon: CreditCard,
    features: [
      { icon: Shield, label: "Policy Retrieval" },
      { icon: MessageSquare, label: "Resolver Chat" },
      { icon: CreditCard, label: "Confirmed Actions" },
      { icon: Zap, label: "Chat Memory" },
    ],
    stats: [
      { value: "4", label: "Scenarios" },
      { value: "Live", label: "Backend" },
      { value: "0.3.3", label: "AI Fabric" },
    ],
    aboutLink: "/demos/ai-fabric-account-resolver/about",
    livePreview: {
      eyebrow: "Resolver mode",
      prompt: "Why can't I place an order? If payment is missing, help me resolve it safely.",
      proof: "AI reads profile data and policies, proposes confirmed actions, and executes only after approval.",
      runtime: "OpenAI + chat-session memory + policy RAG",
    },
    accent: "border-emerald-200 bg-emerald-50 text-emerald-700",
    link: "/demos/ai-fabric-account-resolver",
  },
  {
    id: "ai-fabric-behavior-signals",
    title: "AI Fabric Behavior Signals",
    description:
      "SaaS behavior studio with raw event ingestion, LLM behavior insight, evidence review, and agentic UI composition.",
    icon: Activity,
    features: [
      { icon: Activity, label: "Behavior Events" },
      { icon: Smile, label: "Sentiment" },
      { icon: TrendingUp, label: "Risk Insight" },
      { icon: Sparkles, label: "Agentic UI" },
    ],
    stats: [
      { value: "3", label: "Scenarios" },
      { value: "Live", label: "Backend" },
      { value: "0.3.3", label: "AI Fabric" },
    ],
    aboutLink: "/demos/ai-fabric-behavior-signals/about",
    livePreview: {
      eyebrow: "Behavior intelligence",
      prompt: "Record raw app events, run user behavior analysis, then preview an AI-chosen home page.",
      proof: "LLM returns churn/sentiment insight and component names for behavior-aware UI rendering.",
      runtime: "OpenAI + AI Fabric behavior + structured output",
    },
    accent: "border-amber-200 bg-amber-50 text-amber-800",
    link: "/demos/ai-fabric-behavior-signals",
  },
  {
    id: "ai-fabric-tenant-guard",
    title: "AI Fabric Tenant Guard",
    description:
      "Tenant isolation demo with scoped retrieval, role-aware catalog visibility, guarded actions, and delete evidence.",
    icon: Lock,
    features: [
      { icon: Shield, label: "Tenant Isolation" },
      { icon: Search, label: "Scoped Retrieval" },
      { icon: Users, label: "Role Visibility" },
      { icon: Lock, label: "Guarded Actions" },
    ],
    stats: [
      { value: "3", label: "Tenants" },
      { value: "Live", label: "Backend" },
      { value: "0.3.3", label: "AI Fabric" },
    ],
    aboutLink: "/demos/ai-fabric-tenant-guard/about",
    livePreview: {
      eyebrow: "Tenant boundary proof",
      prompt: "Search tenant-specific docs, compare role visibility, then try a guarded write.",
      proof: "Backend proves scoped retrieval, access policy checks, role catalog visibility, and tenant cleanup.",
      runtime: "AI Fabric access policy + scoped retrieval",
    },
    accent: "border-rose-200 bg-rose-50 text-rose-700",
    link: "/demos/ai-fabric-tenant-guard",
  },
  {
    id: "ai-fabric-privacy-shield",
    title: "AI Fabric Privacy Shield",
    description:
      "Privacy-first support intake that detects sensitive text, stores redacted records, searches safely, and withholds raw payloads.",
    icon: EyeOff,
    features: [
      { icon: ShieldCheck, label: "PII Detection" },
      { icon: EyeOff, label: "Redacted Storage" },
      { icon: Search, label: "Safe Search" },
      { icon: Database, label: "Evidence Proof" },
    ],
    stats: [
      { value: "3", label: "Samples" },
      { value: "Live", label: "Backend" },
      { value: "0.3.3", label: "AI Fabric" },
    ],
    aboutLink: "/demos/ai-fabric-privacy-shield/about",
    livePreview: {
      eyebrow: "Sensitive-info guard",
      prompt: "Submit support text with an email, phone, or SSN, then inspect redaction and safe search.",
      proof: "Backend returns redacted records, detection evidence, raw-storage policy, and session-scoped vector results.",
      runtime: "AI Fabric PII detection + Lucene safe indexing",
    },
    accent: "border-cyan-200 bg-cyan-50 text-cyan-700",
    link: "/demos/ai-fabric-privacy-shield",
  },
];

const Demos = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        <section className="container mx-auto px-4 py-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto max-w-4xl text-center"
          >
            <Badge variant="secondary" className="mb-4">
              <Sparkles className="mr-1 h-3 w-3" />
              Five deployed AI Fabric apps
            </Badge>
            <h1 className="mb-4 text-4xl font-bold tracking-normal md:text-5xl">
              Real demos backed by real Spring Boot apps
            </h1>
            <p className="mx-auto max-w-3xl text-lg leading-8 text-muted-foreground">
              Each demo uses a deployed backend from the framework repository and shows a different AI Fabric
              capability: RAG, actions, memory, behavior analysis, tenant isolation, or PII protection.
            </p>
          </motion.div>
        </section>

        <section className="container mx-auto px-4 pb-10">
          <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-primary">
                <CheckCircle2 className="h-4 w-4" />
                Deployed end-to-end demos
              </div>
              <h2 className="text-2xl font-bold tracking-normal">Choose a live AI Fabric journey</h2>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
                Each card previews the user scenario, the framework capability being exercised, and the proof you
                should see in the running app.
              </p>
            </div>
            <Badge variant="outline" className="w-fit gap-1 border-emerald-200 bg-emerald-50 text-emerald-700">
              <Database className="h-3.5 w-3.5" />
              5 live backends
            </Badge>
          </div>

          <div className="grid gap-5 xl:grid-cols-2">
            {demos.map((demo, index) => (
              <motion.div
                key={demo.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08 }}
              >
                <div className="group relative h-full overflow-hidden rounded-xl border border-border bg-card p-5 shadow-card transition-all duration-300 hover:border-primary/40 hover:shadow-lg">
                  <div className="flex flex-col gap-5 lg:flex-row">
                    <div className="min-w-0 flex-1">
                      <div className="mb-4 flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4">
                          <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border ${demo.accent}`}>
                            <demo.icon className="h-6 w-6" />
                          </div>
                          <div className="min-w-0">
                            <div className="mb-2 flex flex-wrap items-center gap-2">
                              <Badge variant="outline" className={demo.accent}>
                                <Sparkles className="mr-1 h-3 w-3" />
                                Live app
                              </Badge>
                              <Badge variant="secondary">{demo.livePreview.eyebrow}</Badge>
                            </div>
                            <h3 className="text-xl font-bold tracking-normal text-foreground transition-colors group-hover:text-primary">
                              {demo.title}
                            </h3>
                          </div>
                        </div>
                      </div>

                      <p className="text-sm leading-6 text-muted-foreground">{demo.description}</p>

                      <div className="mt-5 rounded-lg border border-border/70 bg-muted/20 p-4">
                        <div className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
                          <MessageSquare className="h-3.5 w-3.5" />
                          Try this scenario
                        </div>
                        <p className="text-sm font-medium leading-6 text-foreground">{demo.livePreview.prompt}</p>
                        <div className="mt-4 grid gap-3 md:grid-cols-2">
                          <div className="rounded-md border border-border/70 bg-background p-3">
                            <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase text-muted-foreground">
                              <ShieldCheck className="h-3.5 w-3.5" />
                              Proof to watch
                            </div>
                            <p className="text-xs leading-5 text-muted-foreground">{demo.livePreview.proof}</p>
                          </div>
                          <div className="rounded-md border border-border/70 bg-background p-3">
                            <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase text-muted-foreground">
                              <Layers className="h-3.5 w-3.5" />
                              Runtime path
                            </div>
                            <p className="text-xs leading-5 text-muted-foreground">{demo.livePreview.runtime}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex shrink-0 flex-col justify-between gap-4 rounded-lg border border-border/70 bg-background p-4 lg:w-[260px]">
                      <div className="grid gap-2">
                        {demo.features.map((feature) => (
                          <div key={feature.label} className="flex items-center gap-2 rounded-md bg-muted/40 px-3 py-2">
                            <feature.icon className="h-4 w-4 text-primary" />
                            <span className="text-sm text-foreground">{feature.label}</span>
                          </div>
                        ))}
                      </div>

                      <div className="grid grid-cols-3 gap-2 border-t border-border/70 pt-4">
                        {demo.stats.map((stat) => (
                          <div key={stat.label} className="rounded-md bg-muted/30 p-2 text-center">
                            <div className="text-lg font-bold text-foreground">{stat.value}</div>
                            <div className="text-[11px] leading-4 text-muted-foreground">{stat.label}</div>
                          </div>
                        ))}
                      </div>

                      <div className="grid gap-2">
                        <Link
                          to={demo.link}
                          className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                        >
                          Open live demo
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                        <Link
                          to={demo.aboutLink}
                          className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-border bg-background px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                        >
                          About this demo
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      <ConsultationCtaBand
        compact
        className="bg-background py-10"
        title="Not sure which demo maps to your use case?"
        body="Book a free AI Fabric architecture discussion and map your Java/Spring Boot workflow to the right framework modules and proof-of-concept path."
      />

      <Footer />
    </div>
  );
};

export default Demos;
