import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import DocsLayout from "@/components/docs/DocsLayout";
import StoryPreviewImage from "@/components/StoryPreviewImage";
import { 
  Shield, 
  Lock, 
  Search, 
  TrendingUp, 
  Database, 
  HardDrive, 
  MessageSquare, 
  ArrowRight,
  ExternalLink,
  BookOpen,
  Book
} from "lucide-react";

const PAGE_TITLE = "User Stories - AI Fabric Framework";
const PAGE_DESCRIPTION = "Learn through real-world scenarios and use cases. Pair these narrative stories with the current AI Fabric implementation guides.";

// Import more icons as needed
import { 
  Brain, 
  FileText, 
  Zap, 
  Settings, 
  Cpu, 
  FileCheck, 
  RefreshCw,
  Sparkles
} from "lucide-react";

const stories = [
  {
    id: "orchestrator-story",
    title: "The Orchestrator Story",
    description: "Your AI's Bodyguard, Traffic Cop, and Mind Reader",
    href: "/docs/orchestrator_story",
    icon: Shield,
    color: "bg-blue-500",
    category: "Security",
  },
  {
    id: "orchestrator-story-v2",
    title: "Orchestrator Story V2 (Narrative)",
    description: "The 3 AM call that changed everything—security and trust",
    href: "/docs/orchestrator_story_v2",
    icon: Shield,
    color: "bg-blue-500",
    category: "Security",
  },
  {
    id: "pii-detection",
    title: "PII Detection Story",
    description: "The data leak that never happened",
    href: "/docs/pii_detection",
    icon: Lock,
    color: "bg-red-500",
    category: "Privacy",
  },
  {
    id: "rag-story",
    title: "The RAG Story",
    description: "Building intelligent search that actually understands",
    href: "/docs/rag_story",
    icon: Search,
    color: "bg-purple-500",
    category: "Search",
  },
  {
    id: "rag-story-v2",
    title: "RAG Story V2 (Narrative)",
    description: "The $47.23 that almost cost everything",
    href: "/docs/rag_story_v2",
    icon: Search,
    color: "bg-purple-500",
    category: "Search",
  },
  {
    id: "rag-story-v3",
    title: "RAG Story V3 (Realistic)",
    description: "The support ticket that changed everything",
    href: "/docs/rag_story_v3",
    icon: Search,
    color: "bg-purple-500",
    category: "Search",
  },
  {
    id: "behavior-story",
    title: "The Behavior Story",
    description: "Analyze behavior signals with AI-backed user insights",
    href: "/docs/behavior_story",
    icon: TrendingUp,
    color: "bg-green-500",
    category: "Analytics",
  },
  {
    id: "behavior-story-v2",
    title: "Behavior Story V2 (Narrative)",
    description: "The customer we almost lost—Jessica's journey",
    href: "/docs/behavior_story_v2",
    icon: TrendingUp,
    color: "bg-green-500",
    category: "Analytics",
  },
  {
    id: "indexing-story",
    title: "The Indexing Story",
    description: "Keep AI evidence fresh with sync, async, and batch indexing",
    href: "/docs/indexing_story",
    icon: Database,
    color: "bg-cyan-500",
    category: "Performance",
  },
  {
    id: "indexing-story-v2",
    title: "Indexing Story V2 (Narrative)",
    description: "The Black Friday that almost broke us—Sarah's story",
    href: "/docs/indexing_story_v2",
    icon: Database,
    color: "bg-cyan-500",
    category: "Performance",
  },
  {
    id: "custom-storage-indexing",
    title: "Custom Storage Indexing",
    description: "When your database isn't SQL",
    href: "/docs/custom_storage_indexing",
    icon: HardDrive,
    color: "bg-indigo-500",
    category: "Storage",
  },
  {
    id: "storage-story",
    title: "The Storage Story",
    description: "Smart storage strategies for AI applications",
    href: "/docs/storage_story",
    icon: HardDrive,
    color: "bg-indigo-500",
    category: "Storage",
  },
  {
    id: "storage-story-v2",
    title: "Storage Story V2 (Narrative)",
    description: "The table that grew too big—a growth story",
    href: "/docs/storage_story_v2",
    icon: HardDrive,
    color: "bg-indigo-500",
    category: "Storage",
  },
  {
    id: "intent-story",
    title: "The Intent Extraction Story",
    description: "How AI understands what users want—cleanly and elegantly",
    href: "/docs/intent_story",
    icon: MessageSquare,
    color: "bg-pink-500",
    category: "NLP",
  },
  {
    id: "intent-story-v2",
    title: "Intent Story V2 (Narrative)",
    description: "A storytelling approach to understanding intent extraction",
    href: "/docs/intent_story_v2",
    icon: MessageSquare,
    color: "bg-pink-500",
    category: "NLP",
  },
  {
    id: "migration-story",
    title: "The Migration Story",
    description: "Plan bulk indexing and reindexing for changing systems",
    href: "/docs/migration_story",
    icon: RefreshCw,
    color: "bg-orange-500",
    category: "Operations",
  },
  {
    id: "migration-story-v2",
    title: "Migration Story V2 (Narrative)",
    description: "The weekend that never was—a migration tale",
    href: "/docs/migration_story_v2",
    icon: RefreshCw,
    color: "bg-orange-500",
    category: "Operations",
  },
  {
    id: "access-policy-story",
    title: "The Access Policy Story",
    description: "Building fail-closed security into every request",
    href: "/docs/access_policy_story",
    icon: Shield,
    color: "bg-red-500",
    category: "Security",
  },
  {
    id: "access-policy-story-v2",
    title: "Access Policy Story V2 (Narrative)",
    description: "The security audit that changed everything",
    href: "/docs/access_policy_story_v2",
    icon: Shield,
    color: "bg-red-500",
    category: "Security",
  },
  {
    id: "pii-detection-story-v1",
    title: "PII Detection Story V1",
    description: "Building privacy into every request",
    href: "/docs/pii_detection_story_v1",
    icon: Lock,
    color: "bg-red-500",
    category: "Privacy",
  },
  {
    id: "pii-detection-story-v2",
    title: "PII Detection Story V2 (Narrative)",
    description: "The GDPR audit that saved everything",
    href: "/docs/pii_detection_story_v2",
    icon: Lock,
    color: "bg-red-500",
    category: "Privacy",
  },
  {
    id: "relationship-query-story-v2",
    title: "Relationship Query Story V2 (Narrative)",
    description: "The Friday 4 PM question that changed everything",
    href: "/docs/relationship_query_story_v2",
    icon: Brain,
    color: "bg-violet-500",
    category: "Query",
  },
  {
    id: "openai-provider-story",
    title: "OpenAI Provider Story",
    description: "Production-ready integration in one dependency",
    href: "/docs/openai_provider_story",
    icon: Zap,
    color: "bg-yellow-500",
    category: "Provider",
  },
  {
    id: "openai-provider-story-v2",
    title: "OpenAI Provider Story V2 (Narrative)",
    description: "The integration that took 5 minutes",
    href: "/docs/openai_provider_story_v2",
    icon: Zap,
    color: "bg-yellow-500",
    category: "Provider",
  },
  {
    id: "onnx-provider-story",
    title: "ONNX Provider Story",
    description: "Local embeddings that cost $0 and beat cloud APIs",
    href: "/docs/onnx_provider_story",
    icon: Cpu,
    color: "bg-cyan-500",
    category: "Provider",
  },
  {
    id: "onnx-provider-story-v2",
    title: "ONNX Provider Story V2 (Narrative)",
    description: "The $12,000 bill that never came",
    href: "/docs/onnx_provider_story_v2",
    icon: Cpu,
    color: "bg-cyan-500",
    category: "Provider",
  },
  {
    id: "audit-capabilities-story",
    title: "Audit Capabilities Story",
    description: "Complete audit trail for AI systems",
    href: "/docs/audit_capabilities_story",
    icon: FileCheck,
    color: "bg-emerald-500",
    category: "Compliance",
  },
  {
    id: "audit-capabilities-story-v2",
    title: "Audit Capabilities Story V2 (Narrative)",
    description: "The audit that saved everything",
    href: "/docs/audit_capabilities_story_v2",
    icon: FileCheck,
    color: "bg-emerald-500",
    category: "Compliance",
  },
  {
    id: "cleanup-capabilities-story",
    title: "Cleanup Capabilities Story",
    description: "Automatic data cleanup for AI systems",
    href: "/docs/cleanup_capabilities_story",
    icon: Sparkles,
    color: "bg-teal-500",
    category: "Operations",
  },
  {
    id: "cleanup-capabilities-story-v2",
    title: "Cleanup Capabilities Story V2 (Narrative)",
    description: "The 1TB database that shrunk to 300GB",
    href: "/docs/cleanup_capabilities_story_v2",
    icon: Sparkles,
    color: "bg-teal-500",
    category: "Operations",
  },
  {
    id: "retention-capabilities-story",
    title: "Retention Capabilities Story",
    description: "Pluggable data retention policy system",
    href: "/docs/retention_capabilities_story",
    icon: FileText,
    color: "bg-slate-500",
    category: "Compliance",
  },
  {
    id: "retention-capabilities-story-v2",
    title: "Retention Capabilities Story V2 (Narrative)",
    description: "The audit that almost failed",
    href: "/docs/retention_capabilities_story_v2",
    icon: FileText,
    color: "bg-slate-500",
    category: "Compliance",
  },
];

const UserStories = () => {
  useEffect(() => {
    document.title = PAGE_TITLE;

    const updateMeta = (selector: string, attribute: string, value: string) => {
      let element = document.querySelector(selector) as HTMLMetaElement | null;
      if (!element) {
        element = document.createElement("meta");
        if (selector.includes("property=")) {
          element.setAttribute(
            "property",
            selector.match(/property="([^"]+)"/)?.[1] || ""
          );
        } else if (selector.includes("name=")) {
          element.setAttribute(
            "name",
            selector.match(/name="([^"]+)"/)?.[1] || ""
          );
        }
        document.head.appendChild(element);
      }
      element.setAttribute(attribute, value);
    };

    const updateCanonical = (href: string) => {
      let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement("link");
        link.setAttribute("rel", "canonical");
        document.head.appendChild(link);
      }
      link.setAttribute("href", href);
    };

    updateMeta('meta[name="description"]', "content", PAGE_DESCRIPTION);
    updateMeta('meta[property="og:title"]', "content", PAGE_TITLE);
    updateMeta('meta[property="og:description"]', "content", PAGE_DESCRIPTION);
    updateMeta('meta[property="og:image"]', "content", `${window.location.origin}/assets/story-preview.png`);
    updateMeta('meta[property="og:type"]', "content", "website");
    updateMeta('meta[property="og:url"]', "content", window.location.href);

    updateMeta('meta[name="twitter:title"]', "content", PAGE_TITLE);
    updateMeta('meta[name="twitter:description"]', "content", PAGE_DESCRIPTION);
    updateMeta('meta[name="twitter:image"]', "content", `${window.location.origin}/assets/story-preview.png`);
    updateMeta('meta[name="twitter:card"]', "content", "summary_large_image");

    updateCanonical(window.location.href);
  }, []);

  return (
    <DocsLayout>
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative overflow-hidden border-b border-border/50 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
          <div className="absolute inset-0 bg-gradient-glow opacity-30" />
          <div className="relative px-6 py-16">
            <div className="mx-auto max-w-6xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <div className="mb-4 flex items-center justify-center gap-2">
                  <Book className="h-6 w-6 text-primary" />
                  <span className="text-sm font-medium uppercase tracking-wider text-primary">
                    Real-World Scenarios
                  </span>
                </div>
                <h1 className="mb-4 text-4xl font-bold text-foreground sm:text-5xl lg:text-6xl">
                  📖 User Stories
                </h1>
                <p className="mx-auto max-w-3xl text-lg text-muted-foreground sm:text-xl">
                  Learn through real-world scenarios and use cases. See how AI Fabric Framework 
                  solves real problems in production environments.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Stories Grid */}
        <section className="px-6 py-16">
          <div className="mx-auto max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-12 text-center"
            >
              <h2 className="mb-4 text-3xl font-bold text-foreground">
                Explore User Stories
              </h2>
              <p className="mx-auto max-w-2xl text-muted-foreground">
                Each story demonstrates a real-world use case with practical examples, 
                code snippets, and measurable results.
              </p>
            </motion.div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {stories.map((story, index) => {
                const Icon = story.icon;
                return (
                  <motion.div
                    key={story.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                  >
                    <Link
                      to={story.href}
                      className="group block h-full overflow-hidden rounded-2xl border border-border/50 bg-card transition-all hover:border-primary/50 hover:shadow-xl"
                    >
                      {/* Preview Image */}
                      <div className="relative aspect-video w-full overflow-hidden">
                        <StoryPreviewImage
                          icon={story.icon}
                          title={story.title}
                          description={story.description}
                          stats="Available"
                          category={story.category}
                          color={story.color}
                          className="transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <h3 className="mb-2 text-xl font-bold text-foreground transition-colors group-hover:text-primary">
                          {story.title}
                        </h3>
                        <p className="mb-4 text-sm text-muted-foreground line-clamp-2">
                          {story.description}
                        </p>
                        
                        {/* CTA */}
                        <div className="flex items-center gap-2 text-sm font-medium text-primary group-hover:gap-3 transition-all">
                          <span>Read Story</span>
                          <ArrowRight className="h-4 w-4" />
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="border-t border-border/50 bg-muted/30 px-6 py-16">
          <div className="mx-auto max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <h2 className="mb-4 text-3xl font-bold text-foreground">
                Ready to Build Your Own Story?
              </h2>
              <p className="mb-8 text-lg text-muted-foreground">
                Start integrating AI Fabric Framework into your application today. 
                These stories show you exactly how.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link
                  to="/docs/quickstart"
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-lg"
                >
                  Get Started
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/docs"
                  className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-6 py-3 font-semibold text-foreground transition-all hover:border-primary/50 hover:bg-primary/5"
                >
                  View Documentation
                  <ExternalLink className="h-4 w-4" />
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </DocsLayout>
  );
};

export default UserStories;
