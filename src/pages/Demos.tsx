import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, CreditCard, MessageSquare, TrendingUp, Shield, Zap, HelpCircle, Search, Bot, FileText, Upload, ShoppingBag, Users, Heart, Smile, Activity, Code, Calendar, ListTodo, Lock, CheckCircle2, Database, Layers, ShieldCheck, EyeOff } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { AI_SHOPPING_EXPERIENCE_ROUTE } from "./demos/AIFabricFramework/routes";

const demos = [
  {
    id: "ai-shopping-experience",
    title: "AI Shopping Experience",
    description: "Live AI Fabric commerce demo with product management, semantic search, conversational shopping, cart actions, and orchestrated chat experiences.",
    icon: ShoppingBag,
    status: "featured" as const,
    features: [
      { icon: Search, label: "Semantic Search" },
      { icon: Bot, label: "Conversational AI" },
      { icon: ShoppingBag, label: "Product Management" },
      { icon: Zap, label: "Live Orchestration" },
    ],
    stats: [
      { value: "13", label: "REST Endpoints" },
      { value: "99.9%", label: "API Uptime" },
      { value: "<100ms", label: "Response Time" },
    ],
    aboutLink: `${AI_SHOPPING_EXPERIENCE_ROUTE}/about`,
    livePreview: {
      eyebrow: "Commerce RAG + actions",
      prompt: "Find high performance laptops, compare evidence, add one to cart, then checkout.",
      proof: "Stage data from no evidence to full RAG with product, policy, review, coupon, and support vectors.",
      runtime: "OpenAI + AI Fabric RAG + action orchestration",
    },
    accent: "border-blue-200 bg-blue-50 text-blue-700",
    link: AI_SHOPPING_EXPERIENCE_ROUTE,
  },
  {
    id: "ai-fabric-account-resolver",
    title: "AI Fabric Account Resolver",
    description: "Live policy-guided account resolution with readiness checks, confirmed payment/address actions, refunds, and natural-language orchestration.",
    icon: CreditCard,
    status: "featured" as const,
    features: [
      { icon: Shield, label: "Policy Resolution" },
      { icon: MessageSquare, label: "Resolver Chat" },
      { icon: CreditCard, label: "Confirmed Actions" },
      { icon: Zap, label: "Live Orchestration" },
    ],
    stats: [
      { value: "4", label: "Live Scenarios" },
      { value: "5+", label: "AI Actions" },
      { value: "Real", label: "Backend API" },
    ],
    aboutLink: "/demos/ai-fabric-account-resolver/about",
    livePreview: {
      eyebrow: "Resolver mode",
      prompt: "Why can’t I place an order? If payment is missing, help me resolve it safely.",
      proof: "AI reads profile data and policies, proposes confirmed actions, and executes only after approval.",
      runtime: "OpenAI + chat-session memory + policy RAG",
    },
    accent: "border-emerald-200 bg-emerald-50 text-emerald-700",
    link: "/demos/ai-fabric-account-resolver",
  },
  {
    id: "smart-faq-assistant",
    title: "Smart FAQ Assistant",
    description: "AI-powered FAQ system with semantic search, RAG-based answers, and intelligent query understanding.",
    icon: HelpCircle,
    status: "new" as const,
    features: [
      { icon: Search, label: "Semantic Search" },
      { icon: Bot, label: "RAG Generation" },
      { icon: MessageSquare, label: "Hybrid Search" },
      { icon: FileText, label: "Query Expansion" },
    ],
    stats: [
      { value: "40-60%", label: "Fewer Tickets" },
      { value: "2-3 weeks", label: "Implementation" },
      { value: "8", label: "Endpoints" },
    ],
    link: "/demos/smart-faq-assistant",
  },
  {
    id: "document-intelligence-hub",
    title: "Document Intelligence Hub",
    description: "AI-powered document processing with PII detection, semantic search, and RAG-based Q&A across all your documents.",
    icon: FileText,
    status: "new" as const,
    features: [
      { icon: Shield, label: "PII Detection" },
      { icon: Bot, label: "RAG Q&A" },
      { icon: Search, label: "Semantic Search" },
      { icon: Upload, label: "Async Processing" },
    ],
    stats: [
      { value: "50-70%", label: "Time Savings" },
      { value: "3-4 weeks", label: "Implementation" },
      { value: "12", label: "Endpoints" },
    ],
    link: "/demos/document-intelligence-hub",
  },
  {
    id: "product-discovery-engine",
    title: "Product Discovery Engine",
    description: "AI-powered e-commerce search with natural language queries, personalized recommendations, and behavior-based trending detection.",
    icon: ShoppingBag,
    status: "new" as const,
    features: [
      { icon: Search, label: "Semantic Search" },
      { icon: Users, label: "Behavior Tracking" },
      { icon: TrendingUp, label: "Recommendations" },
      { icon: Heart, label: "Query Understanding" },
    ],
    stats: [
      { value: "30-50%", label: "Conversion Lift" },
      { value: "2-3 weeks", label: "Implementation" },
      { value: "10", label: "Endpoints" },
    ],
    link: "/demos/product-discovery-engine",
  },
  {
    id: "ai-fabric-behavior-signals",
    title: "AI Fabric Behavior Signals",
    description: "Live SaaS retention studio with behavior event ingestion, churn/sentiment insight, evidence review, and confirmation-gated retention actions.",
    icon: Activity,
    status: "featured" as const,
    features: [
      { icon: Activity, label: "Behavior Analytics" },
      { icon: Smile, label: "6-Level Sentiment" },
      { icon: TrendingUp, label: "Trend Detection" },
      { icon: Sparkles, label: "Agentic Home Preview" },
    ],
    stats: [
      { value: "3", label: "Real Scenarios" },
      { value: "17+", label: "Behavior Events" },
      { value: "Live", label: "Backend API" },
    ],
    aboutLink: "/demos/ai-fabric-behavior-signals/about",
    livePreview: {
      eyebrow: "Behavior intelligence",
      prompt: "Inject raw app events, run analysis, then preview an AI-chosen home page for that user.",
      proof: "LLM returns churn/sentiment insight and component names for agentic UI rendering.",
      runtime: "OpenAI + AI Fabric behavior + agentic UI plan",
    },
    accent: "border-amber-200 bg-amber-50 text-amber-800",
    link: "/demos/ai-fabric-behavior-signals",
  },
  {
    id: "ai-fabric-tenant-guard",
    title: "AI Fabric Tenant Guard",
    description: "Live tenant isolation demo with scoped retrieval, role-aware catalog visibility, guarded actions, and tenant deletion evidence.",
    icon: Lock,
    status: "featured" as const,
    features: [
      { icon: Shield, label: "Tenant Isolation" },
      { icon: Search, label: "Scoped Retrieval" },
      { icon: Users, label: "Role-Aware Catalog" },
      { icon: Lock, label: "Guarded Actions" },
    ],
    stats: [
      { value: "3", label: "Tenant Contexts" },
      { value: "6", label: "Knowledge Docs" },
      { value: "Live", label: "Backend API" },
    ],
    aboutLink: "/demos/ai-fabric-tenant-guard/about",
    livePreview: {
      eyebrow: "Tenant boundary proof",
      prompt: "Search VPN docs as tenant A, compare tenant B, then try a cross-tenant write.",
      proof: "Backend proves scoped retrieval, guarded actions, role catalog visibility, and tenant delete evidence.",
      runtime: "AI Fabric access policy + scoped retrieval",
    },
    accent: "border-rose-200 bg-rose-50 text-rose-700",
    link: "/demos/ai-fabric-tenant-guard",
  },
  {
    id: "ai-fabric-privacy-shield",
    title: "AI Fabric Privacy Shield",
    description: "Privacy-first support intake that detects sensitive user text, stores redacted records, searches a safe index, and proves raw payloads are withheld.",
    icon: EyeOff,
    status: "featured" as const,
    features: [
      { icon: ShieldCheck, label: "PII Detection" },
      { icon: EyeOff, label: "Redacted Storage" },
      { icon: Search, label: "Safe Search" },
      { icon: Database, label: "Governance Evidence" },
    ],
    stats: [
      { value: "3", label: "Sensitive Samples" },
      { value: "0", label: "LLM Keys Needed" },
      { value: "Safe", label: "Index Proof" },
    ],
    aboutLink: "/demos/ai-fabric-privacy-shield/about",
    livePreview: {
      eyebrow: "Privacy gate",
      prompt: "Submit support text with an email, phone, or SSN, then search using sensitive text and inspect the sanitized query.",
      proof: "Backend returns redacted records, detection evidence, original-evidence policy, and session-scoped vector results.",
      runtime: "AI Fabric PII detection + Lucene safe indexing",
    },
    accent: "border-cyan-200 bg-cyan-50 text-cyan-700",
    link: "/demos/ai-fabric-privacy-shield",
  },
  {
    id: "code-documentation-search",
    title: "Code Documentation Search",
    description: "AI-powered semantic search across your codebase with RAG-based answers and code understanding.",
    icon: Code,
    status: "new" as const,
    features: [
      { icon: Search, label: "Semantic Search" },
      { icon: Bot, label: "RAG Answers" },
      { icon: FileText, label: "Code Understanding" },
      { icon: Zap, label: "Multi-Language" },
    ],
    stats: [
      { value: "10x", label: "Faster Search" },
      { value: "2 weeks", label: "Implementation" },
      { value: "7", label: "Endpoints" },
    ],
    link: "/demos/code-documentation-search",
  },
  {
    id: "meeting-notes-analyzer",
    title: "Meeting Notes Analyzer",
    description: "AI-powered meeting analysis with semantic search, action item extraction, and auto-summarization.",
    icon: Calendar,
    status: "new" as const,
    features: [
      { icon: Search, label: "Semantic Search" },
      { icon: Bot, label: "RAG Q&A" },
      { icon: ListTodo, label: "Action Extraction" },
      { icon: Sparkles, label: "Auto-Summary" },
    ],
    stats: [
      { value: "80%", label: "Time Saved" },
      { value: "2-3 weeks", label: "Implementation" },
      { value: "8", label: "Endpoints" },
    ],
    link: "/demos/meeting-notes-analyzer",
  },
];

const deployedDemoIds = new Set([
  "ai-shopping-experience",
  "ai-fabric-account-resolver",
  "ai-fabric-behavior-signals",
  "ai-fabric-tenant-guard",
  "ai-fabric-privacy-shield",
]);

const deployedDemos = demos.filter((demo) => deployedDemoIds.has(demo.id));
const patternDemos = demos.filter((demo) => !deployedDemoIds.has(demo.id));

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
              <Sparkles className="h-3 w-3 mr-1" />
              Live AI Fabric Demos
            </Badge>
            <h1 className="mb-4 text-4xl font-bold tracking-normal md:text-5xl">
              Real apps first, framework patterns next
            </h1>
            <p className="mx-auto max-w-3xl text-lg leading-8 text-muted-foreground">
              Start with the five deployed AI Fabric apps that run against live backends, then browse smaller pattern demos for specific framework ideas.
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
                Each card previews the actual user scenario, the framework capability being exercised, and the proof you should see in the running app.
              </p>
            </div>
            <Badge variant="outline" className="w-fit gap-1 border-emerald-200 bg-emerald-50 text-emerald-700">
              <Database className="h-3.5 w-3.5" />
              5 live backends
            </Badge>
          </div>

          <div className="grid gap-5 xl:grid-cols-2">
            {deployedDemos.map((demo, index) => (
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
                              <Badge variant="secondary">{demo.livePreview?.eyebrow}</Badge>
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
                        <p className="text-sm font-medium leading-6 text-foreground">{demo.livePreview?.prompt}</p>
                        <div className="mt-4 grid gap-3 md:grid-cols-2">
                          <div className="rounded-md border border-border/70 bg-background p-3">
                            <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase text-muted-foreground">
                              <ShieldCheck className="h-3.5 w-3.5" />
                              Proof to watch
                            </div>
                            <p className="text-xs leading-5 text-muted-foreground">{demo.livePreview?.proof}</p>
                          </div>
                          <div className="rounded-md border border-border/70 bg-background p-3">
                            <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase text-muted-foreground">
                              <Layers className="h-3.5 w-3.5" />
                              Runtime path
                            </div>
                            <p className="text-xs leading-5 text-muted-foreground">{demo.livePreview?.runtime}</p>
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
                        {demo.aboutLink ? (
                          <Link
                            to={demo.aboutLink}
                            className="inline-flex h-10 items-center justify-center gap-2 rounded-md border border-border bg-background px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted"
                          >
                            About this demo
                          </Link>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="container mx-auto px-4 py-10">
          <div className="mb-5 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                <Code className="h-4 w-4" />
                Pattern library
              </div>
              <h2 className="text-2xl font-bold tracking-normal">More AI application patterns</h2>
              <p className="mt-1 max-w-2xl text-sm leading-6 text-muted-foreground">
                Smaller demos and concept previews for search, FAQ, document, meeting, and product-discovery workflows.
              </p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {patternDemos.map((demo, index) => (
              <motion.div
                key={demo.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12 + index * 0.05 }}
              >
                <Link to={demo.link} className="group block h-full">
                  <div className="flex h-full flex-col rounded-lg border border-border bg-card p-5 shadow-sm transition-all hover:border-primary/30 hover:shadow-md">
                    <div className="mb-4 flex items-start justify-between gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-lg border border-border bg-muted/40 text-primary">
                        <demo.icon className="h-5 w-5" />
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {demo.status === "featured" ? "Featured" : "Pattern"}
                      </Badge>
                    </div>
                    <h3 className="text-lg font-bold tracking-normal transition-colors group-hover:text-primary">{demo.title}</h3>
                    <p className="mt-2 flex-1 text-sm leading-6 text-muted-foreground">{demo.description}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {demo.features.slice(0, 3).map((feature) => (
                        <span key={feature.label} className="inline-flex items-center gap-1 rounded-md bg-muted/50 px-2 py-1 text-xs text-muted-foreground">
                          <feature.icon className="h-3 w-3" />
                          {feature.label}
                        </span>
                      ))}
                    </div>
                    <div className="mt-5 flex items-center gap-2 text-sm font-medium text-primary">
                      Explore pattern
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Demos;
