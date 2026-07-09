import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { BookOpen, ChevronRight, ExternalLink } from "lucide-react";
import DocsLayout from "@/components/docs/DocsLayout";

// Featured User Stories (first 9) - matching Real API Stories style
const featuredUserStories = [
  {
    title: "The Orchestrator Story",
    description: "Your AI's Bodyguard, Traffic Cop, and Mind Reader",
    href: "/docs/orchestrator_story",
    emoji: "🛡️",
    metrics: "Security & routing",
    status: "available" as const,
  },
  {
    title: "The RAG Story",
    description: "Building intelligent search that actually understands",
    href: "/docs/rag_story",
    emoji: "🔍",
    metrics: "Semantic search",
    status: "available" as const,
  },
  {
    title: "The Behavior Story",
    description: "Analyze behavior signals with AI-backed user insights",
    href: "/docs/behavior_story",
    emoji: "📈",
    metrics: "Behavior insights",
    status: "available" as const,
  },
  {
    title: "The Indexing Story",
    description: "Keep AI evidence fresh with sync, async, and batch indexing",
    href: "/docs/indexing_story",
    emoji: "💾",
    metrics: "Async lifecycle",
    status: "available" as const,
  },
  {
    title: "PII Detection Story",
    description: "The data leak that never happened",
    href: "/docs/pii_detection",
    emoji: "🔒",
    metrics: "Privacy first",
    status: "available" as const,
  },
  {
    title: "The Storage Story",
    description: "Smart storage strategies for AI applications",
    href: "/docs/storage_story",
    emoji: "🗄️",
    metrics: "Optimized storage",
    status: "available" as const,
  },
  {
    title: "The Intent Extraction Story",
    description: "How AI understands what users want—cleanly and elegantly",
    href: "/docs/intent_story",
    emoji: "💬",
    metrics: "NLP powered",
    status: "available" as const,
  },
  {
    title: "The Migration Story",
    description: "Plan bulk indexing and reindexing for changing systems",
    href: "/docs/migration_story",
    emoji: "🔄",
    metrics: "Bulk indexing",
    status: "available" as const,
  },
  {
    title: "The Access Policy Story",
    description: "Building fail-closed security into every request",
    href: "/docs/access_policy_story",
    emoji: "🛡️",
    metrics: "Fail-closed security",
    status: "available" as const,
  },
];

// Featured Real API Stories (all 8)
const featuredRealAPIStories = [
  {
    title: "E-Commerce Product Discovery",
    description: "When shoppers speak, AI listens—natural language product search",
    href: "/docs/ecommerce-product-discovery-story",
    emoji: "🛍️",
    metrics: "Product retrieval",
    status: "available" as const,
  },
  {
    title: "Financial Fraud Detection",
    description: "Track suspicious money flows through relationship queries",
    href: "/docs/financial-fraud-detection-story",
    emoji: "🔒",
    metrics: "Graph signals",
    status: "available" as const,
  },
  {
    title: "Law Firm Document Management",
    description: "Find needles in legal haystacks—30 seconds instead of 3 hours",
    href: "/docs/law-firm-document-story",
    emoji: "⚖️",
    metrics: "Document search",
    status: "available" as const,
  },
  {
    title: "PII Detection Edge Spectrum",
    description: "Testing every privacy edge case—HIPAA & GDPR compliant",
    href: "/docs/pii-detection-edge-story",
    emoji: "🛡️",
    metrics: "Privacy edge cases",
    status: "available" as const,
  },
  {
    title: "Smart Suggestions",
    description: "AI-powered next-step predictions with confidence scores",
    href: "/docs/smart-suggestions-story",
    emoji: "✨",
    metrics: "Next-step hints",
    status: "available" as const,
  },
  {
    title: "ONNX Fallback Readiness",
    description: "Local embedding fallback when remote providers are unavailable",
    href: "/docs/onnx-fallback-story",
    emoji: "💾",
    metrics: "Local fallback",
    status: "available" as const,
  },
  {
    title: "Real AI Embedding Generation",
    description: "From product data to semantic search with real embedding evidence",
    href: "/docs/real-ai-embedding-story",
    emoji: "⚡",
    metrics: "Embedding proof",
    status: "available" as const,
  },
  {
    title: "Vector Lifecycle Management",
    description: "8-phase lifecycle: create, remove, clear, reseed with full audit",
    href: "/docs/vector-lifecycle-story",
    emoji: "🔄",
    metrics: "Lifecycle checks",
    status: "available" as const,
  },
];

// Featured Core Modules (all 4)
const featuredCoreModules = [
  {
    title: "AI Core",
    description: "Core annotations, orchestration, providers, actions, and policy hooks",
    href: "/docs/modules/core",
    emoji: "🧠",
    metrics: "Core starter",
    status: "available" as const,
  },
  {
    title: "AI Core V2 (Narrative)",
    description: "The sprint that changed everything",
    href: "/docs/core_story_v2",
    emoji: "📖",
    metrics: "Success story",
    status: "available" as const,
  },
  {
    title: "Orchestrator",
    description: "Request handling, security, and routing",
    href: "/docs/modules/orchestrator",
    emoji: "🛡️",
    metrics: "Security first",
    status: "coming-soon" as const,
  },
  {
    title: "Web Module",
    description: "59 REST endpoints, zero code",
    href: "/docs/modules/web",
    emoji: "🌐",
    metrics: "59 endpoints",
    status: "coming-soon" as const,
  },
];

// Featured AI Annotations Stories (all 7)
const featuredAIAnnotationsStories = [
  {
    title: "Overview",
    description: "The complete guide to declarative AI with annotations",
    href: "/docs/ai-annotations-stories",
    emoji: "📚",
    metrics: "Start here",
    status: "coming-soon" as const,
  },
  {
    title: "E-Commerce Semantic Search",
    description: "When natural language finds domain-specific products",
    href: "/docs/ai-annotations-ecommerce",
    emoji: "🛒",
    metrics: "Semantic match",
    status: "available" as const,
  },
  {
    title: "Enterprise Knowledge",
    description: "When related enterprise terms retrieve the right knowledge",
    href: "/docs/ai-annotations-enterprise-knowledge",
    emoji: "📖",
    metrics: "Knowledge search",
    status: "available" as const,
  },
  {
    title: "Developer's Guide",
    description: "Master AI annotations in 15 minutes—code examples & patterns",
    href: "/docs/ai-annotations-developer-guide",
    emoji: "👨‍💻",
    metrics: "15 min read",
    status: "available" as const,
  },
  {
    title: "Architect's Guide",
    description: "Why declarative AI wins—scalability, debt, and architectural decisions",
    href: "/docs/ai-annotations-architect",
    emoji: "🏗️",
    metrics: "Architecture",
    status: "available" as const,
  },
  {
    title: "Killing Boilerplate",
    description: "How 4 annotations eliminated 2,400 lines across 12 services",
    href: "/docs/ai-annotations-killing-boilerplate",
    emoji: "🗡️",
    metrics: "-2,400 lines",
    status: "available" as const,
  },
  {
    title: "Semantic Search Deep Dive",
    description: "When 'running shoes' finds 'athletic footwear'—meaning vs strings",
    href: "/docs/ai-annotations-semantic-search",
    emoji: "🔍",
    metrics: "Deep dive",
    status: "available" as const,
  },
];

// Featured Advanced Features (all 3)
const featuredAdvancedFeatures = [
  {
    title: "Behavior Analytics",
    description: "Churn prediction, sentiment analysis",
    href: "/docs/features/behavior",
    emoji: "📊",
    metrics: "AI insights",
    status: "coming-soon" as const,
  },
  {
    title: "Relationship Query",
    description: "Natural language to SQL",
    href: "/docs/features/query",
    emoji: "🔍",
    metrics: "NL to SQL",
    status: "coming-soon" as const,
  },
  {
    title: "ONNX Provider",
    description: "Free local embeddings ($0 API costs)",
    href: "/docs/features/onnx",
    emoji: "💻",
    metrics: "$0 cost",
    status: "coming-soon" as const,
  },
];

const implementationGuides = [
  {
    title: "Start Here",
    description: "The human-first map for adopting AI Fabric in a Spring Boot app.",
    href: "/docs/getting-started",
    storyTitle: "User Stories",
    storyHref: "/docs/user-stories",
  },
  {
    title: "Choose Your Path",
    description: "Pick search, RAG, actions, memory, behavior, or tenant-safe retrieval.",
    href: "/docs/choose-your-path",
    storyTitle: "Real API Stories",
    storyHref: "/docs/real-api-stories",
  },
  {
    title: "First Semantic Search",
    description: "Index app data and retrieve it by meaning.",
    href: "/docs/first-semantic-search",
    storyTitle: "Semantic Search Deep Dive",
    storyHref: "/docs/ai-annotations-semantic-search",
  },
  {
    title: "First RAG Chat",
    description: "Answer from retrieved evidence and show what was used.",
    href: "/docs/first-rag-chat",
    storyTitle: "The RAG Story",
    storyHref: "/docs/rag_story",
  },
  {
    title: "First Governed Action",
    description: "Expose app actions with confirmation and server-owned handlers.",
    href: "/docs/first-governed-action",
    storyTitle: "Intent Extraction Story",
    storyHref: "/docs/intent_story",
  },
  {
    title: "Chat Session Memory",
    description: "Let the backend own follow-up turns, pending actions, and targets.",
    href: "/docs/chat-session-memory",
    storyTitle: "Smart Suggestions",
    storyHref: "/docs/smart-suggestions-story",
  },
  {
    title: "Providers",
    description: "Configure OpenAI through Spring AI or local ONNX embeddings.",
    href: "/docs/providers/openai",
    storyTitle: "OpenAI Provider Story",
    storyHref: "/docs/openai_provider_story",
  },
  {
    title: "Security Access Policy",
    description: "Keep tenant/user retrieval and actions fail-closed.",
    href: "/docs/security/access-policy",
    storyTitle: "Access Policy Story",
    storyHref: "/docs/access_policy_story",
  },
  {
    title: "Testing And Release",
    description: "Know what to run locally, in CI, and with real provider keys.",
    href: "/docs/testing-verification",
    storyTitle: "Real API Stories",
    storyHref: "/docs/real-api-stories",
  },
  {
    title: "Production Checklist",
    description: "A release-readiness checklist for AI Fabric apps.",
    href: "/docs/production-checklist",
    storyTitle: "Audit Capabilities Story",
    storyHref: "/docs/audit_capabilities_story",
  },
];

const docCategories = [
  {
    title: "User Stories",
    description: "Learn through real-world scenarios and use cases",
    icon: "📖",
    items: [
      {
        title: "The Orchestrator Story",
        description: "Your AI's Bodyguard, Traffic Cop, and Mind Reader",
        href: "/docs/orchestrator_story",
        status: "available",
      },
      {
        title: "Orchestrator Story V2 (Narrative)",
        description: "The 3 AM call that changed everything—security and trust",
        href: "/docs/orchestrator_story_v2",
        status: "available",
      },
      {
        title: "PII Detection Story",
        description: "The data leak that never happened",
        href: "/docs/pii_detection",
        status: "available",
      },
      {
        title: "The RAG Story",
        description: "Building intelligent search that actually understands",
        href: "/docs/rag_story",
        status: "available",
      },
      {
        title: "RAG Story V2 (Narrative)",
        description: "The $47.23 that almost cost everything",
        href: "/docs/rag_story_v2",
        status: "available",
      },
      {
        title: "RAG Story V3 (Realistic)",
        description: "The support ticket that changed everything",
        href: "/docs/rag_story_v3",
        status: "available",
      },
      {
        title: "The Behavior Story",
        description: "Predict churn with 87% accuracy using AI patterns",
        href: "/docs/behavior_story",
        status: "available",
      },
      {
        title: "Behavior Story V2 (Narrative)",
        description: "The customer we almost lost—Jessica's journey",
        href: "/docs/behavior_story_v2",
        status: "available",
      },
      {
        title: "The Indexing Story",
        description: "Index 2000 entities per second efficiently",
        href: "/docs/indexing_story",
        status: "available",
      },
      {
        title: "Indexing Story V2 (Narrative)",
        description: "The Black Friday that almost broke us—Sarah's story",
        href: "/docs/indexing_story_v2",
        status: "available",
      },
      {
        title: "Custom Storage Indexing",
        description: "When your database isn't SQL",
        href: "/docs/custom_storage_indexing",
        status: "available",
      },
      {
        title: "The Storage Story",
        description: "Smart storage strategies for AI applications",
        href: "/docs/storage_story",
        status: "available",
      },
      {
        title: "Storage Story V2 (Narrative)",
        description: "The table that grew too big—a growth story",
        href: "/docs/storage_story_v2",
        status: "available",
      },
      {
        title: "The Intent Extraction Story",
        description: "How AI understands what users want—cleanly and elegantly",
        href: "/docs/intent_story",
        status: "available",
      },
      {
        title: "Intent Story V2 (Narrative)",
        description: "A storytelling approach to understanding intent extraction",
        href: "/docs/intent_story_v2",
        status: "available",
      },
      {
        title: "The Migration Story",
        description: "Zero-downtime migrations for enterprise systems",
        href: "/docs/migration_story",
        status: "available",
      },
      {
        title: "Migration Story V2 (Narrative)",
        description: "The weekend that never was—a migration tale",
        href: "/docs/migration_story_v2",
        status: "available",
      },
      {
        title: "The Access Policy Story",
        description: "Building fail-closed security into every request",
        href: "/docs/access_policy_story",
        status: "available",
      },
      {
        title: "Access Policy Story V2 (Narrative)",
        description: "The security audit that changed everything",
        href: "/docs/access_policy_story_v2",
        status: "available",
      },
      {
        title: "PII Detection Story V1",
        description: "Building privacy into every request",
        href: "/docs/pii_detection_story_v1",
        status: "available",
      },
      {
        title: "PII Detection Story V2 (Narrative)",
        description: "The GDPR audit that saved everything",
        href: "/docs/pii_detection_story_v2",
        status: "available",
      },
      {
        title: "Relationship Query Story V2 (Narrative)",
        description: "The Friday 4 PM question that changed everything",
        href: "/docs/relationship_query_story_v2",
        status: "available",
      },
      {
        title: "OpenAI Provider Story",
        description: "Production-ready integration in one dependency",
        href: "/docs/openai_provider_story",
        status: "available",
      },
      {
        title: "OpenAI Provider Story V2 (Narrative)",
        description: "The integration that took 5 minutes",
        href: "/docs/openai_provider_story_v2",
        status: "available",
      },
      {
        title: "ONNX Provider Story",
        description: "Local embeddings that cost $0 and beat cloud APIs",
        href: "/docs/onnx_provider_story",
        status: "available",
      },
      {
        title: "ONNX Provider Story V2 (Narrative)",
        description: "The $12,000 bill that never came",
        href: "/docs/onnx_provider_story_v2",
        status: "available",
      },
      {
        title: "Audit Capabilities Story",
        description: "Complete audit trail for AI systems",
        href: "/docs/audit_capabilities_story",
        status: "available",
      },
      {
        title: "Audit Capabilities Story V2 (Narrative)",
        description: "The audit that saved everything",
        href: "/docs/audit_capabilities_story_v2",
        status: "available",
      },
      {
        title: "Cleanup Capabilities Story",
        description: "Automatic data cleanup for AI systems",
        href: "/docs/cleanup_capabilities_story",
        status: "available",
      },
      {
        title: "Cleanup Capabilities Story V2 (Narrative)",
        description: "The 1TB database that shrunk to 300GB",
        href: "/docs/cleanup_capabilities_story_v2",
        status: "available",
      },
      {
        title: "Retention Capabilities Story",
        description: "Pluggable data retention policy system",
        href: "/docs/retention_capabilities_story",
        status: "available",
      },
      {
        title: "Retention Capabilities Story V2 (Narrative)",
        description: "The audit that almost failed",
        href: "/docs/retention_capabilities_story_v2",
        status: "available",
      },
    ],
  },
  {
    title: "Real API Stories",
    description: "Production integration tests told as stories",
    icon: "🧪",
    items: [
      {
        title: "E-Commerce Product Discovery",
        description: "When shoppers speak, AI listens—natural language product search",
        href: "/docs/ecommerce-product-discovery-story",
        status: "available",
      },
      {
        title: "Financial Fraud Detection",
        description: "Track suspicious money flows through relationship queries",
        href: "/docs/financial-fraud-detection-story",
        status: "available",
      },
      {
        title: "Law Firm Document Management",
        description: "Find needles in legal haystacks—30 seconds instead of 3 hours",
        href: "/docs/law-firm-document-story",
        status: "available",
      },
      {
        title: "PII Detection Edge Spectrum",
        description: "Testing every privacy edge case—HIPAA & GDPR compliant",
        href: "/docs/pii-detection-edge-story",
        status: "available",
      },
      {
        title: "Smart Suggestions",
        description: "AI-powered next-step predictions with confidence scores",
        href: "/docs/smart-suggestions-story",
        status: "available",
      },
      {
        title: "ONNX Fallback Readiness",
        description: "$0 embeddings, 100% private, zero downtime",
        href: "/docs/onnx-fallback-story",
        status: "available",
      },
      {
        title: "Real AI Embedding Generation",
        description: "From product data to semantic search in 15ms with $0 cost",
        href: "/docs/real-ai-embedding-story",
        status: "available",
      },
      {
        title: "Vector Lifecycle Management",
        description: "8-phase lifecycle: create, remove, clear, reseed with full audit",
        href: "/docs/vector-lifecycle-story",
        status: "available",
      },
    ],
  },
  {
    title: "AI Annotations Stories",
    description: "Declarative AI patterns and real-world implementations",
    icon: "✨",
    items: [
      {
        title: "Overview",
        description: "The complete guide to declarative AI with annotations",
        href: "/docs/ai-annotations-stories",
        status: "coming-soon",
      },
      {
        title: "E-Commerce Semantic Search",
        description: "When 'comfy chair' finds your ergonomic collection—34% conversion boost",
        href: "/docs/ai-annotations-ecommerce",
        status: "available",
      },
      {
        title: "Enterprise Knowledge Management",
        description: "When 'password reset' finally finds 'account recovery'—60% fewer tickets",
        href: "/docs/ai-annotations-enterprise-knowledge",
        status: "available",
      },
      {
        title: "Developer's Guide",
        description: "Master AI annotations in 15 minutes—code examples & patterns",
        href: "/docs/ai-annotations-developer-guide",
        status: "available",
      },
      {
        title: "Architect's Guide",
        description: "Why declarative AI wins—scalability, debt, and architectural decisions",
        href: "/docs/ai-annotations-architect",
        status: "available",
      },
      {
        title: "Killing Boilerplate",
        description: "How 4 annotations eliminated 2,400 lines across 12 services",
        href: "/docs/ai-annotations-killing-boilerplate",
        status: "available",
      },
      {
        title: "Semantic Search Deep Dive",
        description: "When 'running shoes' finds 'athletic footwear'—meaning vs strings",
        href: "/docs/ai-annotations-semantic-search",
        status: "available",
      },
    ],
  },
  {
    title: "Core Modules",
    description: "Deep dive into framework components",
    icon: "🧩",
    items: [
      {
        title: "AI Core",
        description: "From 6 months to 5 minutes—one annotation for everything AI",
        href: "/docs/modules/core",
        status: "available",
      },
      {
        title: "AI Core V2 (Narrative)",
        description: "The sprint that changed everything",
        href: "/docs/core_story_v2",
        status: "available",
      },
      {
        title: "Orchestrator",
        description: "Request handling, security, and routing",
        href: "/docs/modules/orchestrator",
        status: "coming-soon",
      },
      {
        title: "Web Module",
        description: "59 REST endpoints, zero code",
        href: "/docs/modules/web",
        status: "coming-soon",
      },
    ],
  },
  {
    title: "Advanced Features",
    description: "Unlock the full power of AI Fabric",
    icon: "🚀",
    items: [
      {
        title: "Behavior Analytics",
        description: "Churn prediction, sentiment analysis",
        href: "/docs/features/behavior",
        status: "coming-soon",
      },
      {
        title: "Relationship Query",
        description: "Natural language to SQL",
        href: "/docs/features/query",
        status: "coming-soon",
      },
      {
        title: "ONNX Provider",
        description: "Free local embeddings ($0 API costs)",
        href: "/docs/features/onnx",
        status: "coming-soon",
      },
    ],
  },
];

const Documentation = () => {
  return (
    <DocsLayout>
      <div className="min-h-screen">
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-border/50">
          <div className="absolute inset-0 bg-gradient-glow opacity-50" />
          <div className="px-6 py-16 relative">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl"
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-medium text-primary mb-6">
                <BookOpen className="h-4 w-4" />
                AI Fabric Framework
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                Documentation
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl">
                Learn how to build AI-enabled Spring Boot applications with AI Fabric. 
                From quick starts to advanced patterns, we've got you covered.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Human implementation path */}
        <section className="border-b border-border/50 px-6 py-12">
          <div className="max-w-6xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8"
            >
              <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                <BookOpen className="h-4 w-4" />
                New implementation path
              </span>
              <h2 className="text-2xl font-bold text-foreground md:text-3xl">
                Build AI Fabric Apps
              </h2>
              <p className="mt-3 max-w-3xl text-muted-foreground">
                Start with the canonical framework guides, then use the related stories when you
                want a more human explanation of the same capability.
              </p>
            </motion.div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {implementationGuides.map((guide, index) => (
                <motion.div
                  key={guide.href}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04 }}
                  className="rounded-lg border border-border/60 bg-card p-5 transition-all hover:border-primary/40 hover:shadow-lg"
                >
                  <Link to={guide.href} className="group block">
                    <div className="mb-3 flex items-start justify-between gap-3">
                      <h3 className="font-semibold text-foreground transition-colors group-hover:text-primary">
                        {guide.title}
                      </h3>
                      <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                    </div>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {guide.description}
                    </p>
                  </Link>
                  <div className="mt-4 border-t border-border/50 pt-3">
                    <Link
                      to={guide.storyHref}
                      className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                    >
                      Related story: {guide.storyTitle}
                      <ExternalLink className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-6 rounded-lg border border-primary/25 bg-primary/5 p-5">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="font-semibold text-foreground">Working with a coding assistant?</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Use the LLM context pack to give an assistant the rules, module map, recipes,
                    and troubleshooting path before it edits code.
                  </p>
                </div>
                <Link
                  to="/docs/llm-context"
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  Open LLM Context
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="px-6 py-12">
          <div className="max-w-5xl space-y-12">
            {docCategories.map((category, categoryIndex) => (
              <motion.div 
                key={category.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: categoryIndex * 0.1 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-2xl">{category.icon}</span>
                  <div className="flex-1">
                    {category.title === "Real API Stories" ? (
                      <Link
                        to="/docs/real-api-stories"
                        className="group flex items-center gap-2 hover:gap-3 transition-all"
                      >
                        <h2 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                          {category.title}
                        </h2>
                        <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                      </Link>
                    ) : category.title === "User Stories" ? (
                      <Link
                        to="/docs/user-stories"
                        className="group flex items-center gap-2 hover:gap-3 transition-all"
                      >
                        <h2 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                          {category.title}
                        </h2>
                        <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                      </Link>
                    ) : category.title === "Core Modules" ? (
                      <Link
                        to="/docs/core-modules"
                        className="group flex items-center gap-2 hover:gap-3 transition-all"
                      >
                        <h2 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                          {category.title}
                        </h2>
                        <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                      </Link>
                    ) : (
                      <h2 className="text-xl font-bold text-foreground">{category.title}</h2>
                    )}
                    <p className="text-sm text-muted-foreground">{category.description}</p>
                  </div>
                </div>
                
                {category.title === "User Stories" ? (
                  <div className="rounded-2xl border border-primary/30 bg-primary/5 p-8">
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {featuredUserStories.map((story) => (
                        <Link
                          key={story.href}
                          to={story.href}
                          className="group rounded-lg border border-border bg-card p-5 transition-all hover:border-primary/50 hover:shadow-lg"
                        >
                          <h4 className="mb-2 font-semibold text-foreground group-hover:text-primary transition-colors">
                            {story.emoji} {story.title}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {story.description} • {story.metrics}
                          </p>
                        </Link>
                      ))}
                    </div>
                    <div className="mt-6 text-center">
                      <Link
                        to="/docs/user-stories"
                        className="inline-flex items-center gap-2 text-primary hover:underline"
                      >
                        View all {category.items.length - featuredUserStories.length} more stories
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                ) : category.title === "Real API Stories" ? (
                  <div className="rounded-2xl border border-primary/30 bg-primary/5 p-8">
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {featuredRealAPIStories.map((story) => (
                        <Link
                          key={story.href}
                          to={story.href}
                          className="group rounded-lg border border-border bg-card p-5 transition-all hover:border-primary/50 hover:shadow-lg"
                        >
                          <h4 className="mb-2 font-semibold text-foreground group-hover:text-primary transition-colors">
                            {story.emoji} {story.title}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {story.description} • {story.metrics}
                          </p>
                        </Link>
                      ))}
                    </div>
                    <div className="mt-6 text-center">
                      <Link
                        to="/docs/real-api-stories"
                        className="inline-flex items-center gap-2 text-primary hover:underline"
                      >
                        View all Real API Stories
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                ) : category.title === "AI Annotations Stories" ? (
                  <div className="rounded-2xl border border-primary/30 bg-primary/5 p-8">
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {featuredAIAnnotationsStories.map((story) => (
                        <Link
                          key={story.href}
                          to={story.status === "available" ? story.href : "#"}
                          onClick={(e) => story.status !== "available" && e.preventDefault()}
                          className={`group rounded-lg border border-border bg-card p-5 transition-all ${
                            story.status === "available"
                              ? "hover:border-primary/50 hover:shadow-lg cursor-pointer"
                              : "opacity-60 cursor-not-allowed"
                          }`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                              {story.emoji} {story.title}
                            </h4>
                            {story.status === "coming-soon" && (
                              <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                                Soon
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {story.description} • {story.metrics}
                          </p>
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : category.title === "Core Modules" ? (
                  <div className="rounded-2xl border border-primary/30 bg-primary/5 p-8">
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {featuredCoreModules.map((module) => (
                        <Link
                          key={module.href}
                          to={module.status === "available" ? module.href : "#"}
                          onClick={(e) => module.status !== "available" && e.preventDefault()}
                          className={`group rounded-lg border border-border bg-card p-5 transition-all ${
                            module.status === "available"
                              ? "hover:border-primary/50 hover:shadow-lg cursor-pointer"
                              : "opacity-60 cursor-not-allowed"
                          }`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                              {module.emoji} {module.title}
                            </h4>
                            {module.status === "coming-soon" && (
                              <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                                Soon
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {module.description} • {module.metrics}
                          </p>
                        </Link>
                      ))}
                    </div>
                    <div className="mt-6 text-center">
                      <Link
                        to="/docs/core-modules"
                        className="inline-flex items-center gap-2 text-primary hover:underline"
                      >
                        View all Core Modules
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                ) : category.title === "Advanced Features" ? (
                  <div className="rounded-2xl border border-primary/30 bg-primary/5 p-8">
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      {featuredAdvancedFeatures.map((feature) => (
                        <Link
                          key={feature.href}
                          to={"#"}
                          onClick={(e) => e.preventDefault()}
                          className={`group rounded-lg border border-border bg-card p-5 transition-all opacity-60 cursor-not-allowed`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                              {feature.emoji} {feature.title}
                            </h4>
                            {feature.status === "coming-soon" && (
                              <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                                Soon
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {feature.description} • {feature.metrics}
                          </p>
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {category.items.map((item) => (
                      <Link
                        key={item.href}
                        to={item.status === "available" ? item.href : "#"}
                        onClick={(e) => item.status !== "available" && e.preventDefault()}
                        className={`group relative rounded-xl border p-5 transition-all ${
                          item.status === "available"
                            ? "border-border/50 bg-card hover:border-primary/50 hover:shadow-lg cursor-pointer"
                            : "border-border/30 bg-muted/30 cursor-not-allowed opacity-60"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                            {item.title}
                          </h3>
                          {item.status === "available" ? (
                            <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                          ) : (
                            <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                              Soon
                            </span>
                          )}
                        </div>
                        <p className="mt-2 text-sm text-muted-foreground">
                          {item.description}
                        </p>
                      </Link>
                    ))}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </section>

        {/* Quick Stats */}
        <section className="border-t border-border/50 bg-muted/30 px-6 py-12">
          <div className="max-w-5xl">
            <h2 className="text-xl font-bold text-foreground mb-6">Current Release Facts</h2>
            <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
              {[
                { value: "0.3.2", label: "Latest Release" },
                { value: "Java 21", label: "Runtime Target" },
                { value: "Boot 4.1.x", label: "Spring Baseline" },
                { value: "4", label: "Live Framework Demos" },
              ].map((stat) => (
                <div key={stat.label} className="rounded-lg border border-border/50 bg-card p-4 text-center">
                  <p className="text-2xl font-bold text-gradient">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </DocsLayout>
  );
};

export default Documentation;
