import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  BookOpen,
  Brain,
  ChevronDown,
  ChevronRight,
  Database,
  GitPullRequest,
  Map,
  Menu,
  Play,
  Shield,
  Sparkles,
  TestTube,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import BrandLogo from "@/components/BrandLogo";
import { restoredRealApiStories, restoredUserStories } from "@/lib/storyNavigation";
import { cn } from "@/lib/utils";

interface DocSection {
  title: string;
  icon: React.ReactNode;
  items: {
    title: string;
    href: string;
    badge?: string;
  }[];
}

const storyBadge = (href: string) => {
  if (href.endsWith("_v3")) return "V3";
  if (href.endsWith("_v2") || href.includes("_v2")) return "V2";
  if (href.includes("/guides/")) return "Guide";
  return undefined;
};

const restoredStoryItems = restoredUserStories.map((story) => ({
  title: story.title,
  href: story.href,
  badge: storyBadge(story.href),
}));

const restoredRealApiStoryItems = restoredRealApiStories.map((story) => ({
  title: story.title,
  href: story.href,
}));

const docSections: DocSection[] = [
  {
    title: "Getting Started",
    icon: <Sparkles className="h-4 w-4" />,
    items: [
      { title: "Docs Home", href: "/docs" },
      { title: "Start Here", href: "/docs/getting-started" },
      { title: "LLM Start Here", href: "/docs/start-here" },
      { title: "Choose Your Path", href: "/docs/choose-your-path" },
      { title: "Installation", href: "/docs/installation" },
    ],
  },
  {
    title: "LLM Assistant Context",
    icon: <Brain className="h-4 w-4" />,
    items: [
      { title: "Opportunity Scanner", href: "/docs/llm-context/opportunity-scanner" },
      { title: "Context Pack Index", href: "/docs/llm-context" },
      { title: "Context Routing", href: "/docs/llm-context/routing" },
      { title: "Assistant Rules", href: "/docs/llm-context/rules" },
      { title: "Common Recipes", href: "/docs/llm-context/common-recipes" },
      { title: "Troubleshooting", href: "/docs/llm-context/troubleshooting" },
      { title: "Real App Reference", href: "/docs/llm-context/real-app-reference" },
    ],
  },
  {
    title: "Framework Stories",
    icon: <BookOpen className="h-4 w-4" />,
    items: [
      { title: "Story Library", href: "/docs/user-stories", badge: "40+" },
      { title: "Real App Story Library", href: "/docs/real-api-stories" },
      { title: "Orchestrator Story", href: "/docs/orchestrator_story_v2", badge: "Restored" },
      { title: "RAG Evidence Search", href: "/docs/rag_story_v3", badge: "V3" },
      { title: "Governed Actions", href: "/docs/governed_actions_story", badge: "Interactive" },
      { title: "Chat Session Memory", href: "/docs/chat_session_memory_story" },
      { title: "Behavior Signals", href: "/docs/behavior-signals-story" },
      { title: "Indexing And Sync", href: "/docs/indexing_story" },
      { title: "Access Policy", href: "/docs/access_policy_story" },
      { title: "Privacy And PII", href: "/docs/pii_detection_story_v1" },
      { title: "Provider Bridge", href: "/docs/openai_provider_story" },
      { title: "ONNX Embeddings", href: "/docs/onnx_provider_story" },
      { title: "Account Resolver Story", href: "/docs/account-resolver-story" },
      { title: "Tenant Guard Story", href: "/docs/tenant-guard-story" },
    ],
  },
  {
    title: "Classic Story Library",
    icon: <BookOpen className="h-4 w-4" />,
    items: restoredStoryItems,
  },
  {
    title: "Real API Stories",
    icon: <TestTube className="h-4 w-4" />,
    items: [
      { title: "Reviewed Real App Stories", href: "/docs/real-api-stories" },
      ...restoredRealApiStoryItems,
    ],
  },
  {
    title: "Architecture",
    icon: <BookOpen className="h-4 w-4" />,
    items: [
      { title: "Architecture Overview", href: "/docs/architecture" },
      { title: "Capability Map", href: "/docs/llm-context/capability-map" },
      { title: "Module Decision Tree", href: "/docs/llm-context/module-decision-tree" },
    ],
  },
  {
    title: "Modules",
    icon: <Database className="h-4 w-4" />,
    items: [
      { title: "Module Map", href: "/docs/modules" },
      { title: "First Semantic Search", href: "/docs/first-semantic-search" },
      { title: "First RAG Chat", href: "/docs/first-rag-chat" },
      { title: "First Governed Action", href: "/docs/first-governed-action" },
      { title: "Chat Session Memory", href: "/docs/chat-session-memory" },
      { title: "OpenAI Provider", href: "/docs/providers/openai" },
      { title: "ONNX Embeddings", href: "/docs/providers/onnx" },
      { title: "Lucene Vector Storage", href: "/docs/vector/lucene" },
    ],
  },
  {
    title: "Detailed Story Guides",
    icon: <Map className="h-4 w-4" />,
    items: [
      { title: "Orchestrator Full Guide", href: "/docs/guides/orchestrator" },
      { title: "Core Full Guide", href: "/docs/guides/core" },
      { title: "Intent Full Guide", href: "/docs/guides/intent" },
      { title: "Relationship Query Full Guide", href: "/docs/guides/query" },
      { title: "Indexing Full Guide", href: "/docs/guides/indexing" },
      { title: "Migration Full Guide", href: "/docs/guides/migration" },
      { title: "Storage Full Guide", href: "/docs/guides/storage" },
      { title: "RAG Full Guide", href: "/docs/guides/rag" },
      { title: "Behavior Full Guide", href: "/docs/guides/behavior" },
      { title: "Access Policy Full Guide", href: "/docs/guides/access_policy" },
      { title: "PII Detection Full Guide", href: "/docs/guides/pii_detection" },
      { title: "OpenAI Provider Full Guide", href: "/docs/guides/openai_provider" },
      { title: "ONNX Provider Full Guide", href: "/docs/guides/onnx_provider" },
      { title: "Audit Capabilities Full Guide", href: "/docs/guides/audit_capabilities" },
      { title: "Cleanup Capabilities Full Guide", href: "/docs/guides/cleanup_capabilities" },
      { title: "Retention Capabilities Full Guide", href: "/docs/guides/retention_capabilities" },
    ],
  },
  {
    title: "AI Annotation Stories",
    icon: <Sparkles className="h-4 w-4" />,
    items: [
      { title: "E-Commerce Semantic Search", href: "/docs/ai-annotations-ecommerce" },
      { title: "Enterprise Knowledge", href: "/docs/ai-annotations-enterprise-knowledge" },
      { title: "Developer Guide", href: "/docs/ai-annotations-developer-guide" },
      { title: "Architect Guide", href: "/docs/ai-annotations-architect" },
      { title: "Killing Boilerplate", href: "/docs/ai-annotations-killing-boilerplate" },
      { title: "Semantic Search Deep Dive", href: "/docs/ai-annotations-semantic-search" },
    ],
  },
  {
    title: "Security",
    icon: <Shield className="h-4 w-4" />,
    items: [
      { title: "Security Overview", href: "/docs/security" },
      { title: "Access Policy", href: "/docs/security/access-policy" },
      { title: "Production Checklist", href: "/docs/production-checklist" },
    ],
  },
  {
    title: "Live Demos",
    icon: <Play className="h-4 w-4" />,
    items: [
      { title: "Demo Guide", href: "/docs/live-demos" },
      { title: "Demo Index", href: "/demos" },
      { title: "Real Apps Map", href: "/docs/real-apps-map" },
    ],
  },
  {
    title: "Testing",
    icon: <TestTube className="h-4 w-4" />,
    items: [
      { title: "Testing And Verification", href: "/docs/testing-verification" },
      { title: "Production Checklist", href: "/docs/production-checklist" },
    ],
  },
  {
    title: "Contributing",
    icon: <GitPullRequest className="h-4 w-4" />,
    items: [
      { title: "Contributing Guide", href: "/docs/contributing" },
      { title: "Roadmap", href: "/docs/roadmap" },
    ],
  },
];

const SidebarSection = ({
  section,
  isExpanded,
  onToggle,
}: {
  section: DocSection;
  isExpanded: boolean;
  onToggle: () => void;
}) => {
  const location = useLocation();

  return (
    <div className="mb-2">
      <button
        onClick={onToggle}
        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-muted/50"
      >
        <span className="text-primary">{section.icon}</span>
        <span className="flex-1 text-left">{section.title}</span>
        {isExpanded ? (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        )}
      </button>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="ml-4 mt-1 space-y-1 border-l border-border pl-4">
              {section.items.map((item) => {
                const isActive = location.pathname === item.href;

                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={cn(
                      "flex items-center gap-2 rounded-md px-3 py-1.5 text-sm transition-colors",
                      isActive
                        ? "bg-primary/10 font-medium text-primary"
                        : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                    )}
                  >
                    <span className="flex-1">{item.title}</span>
                    {item.badge && (
                      <span className="rounded-full bg-accent/20 px-2 py-0.5 text-[10px] font-medium text-accent">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const DocsSidebar = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(["Getting Started", "LLM Assistant Context", "Framework Stories", "Classic Story Library", "Architecture", "Modules"])
  );

  const toggleSection = (title: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(title)) {
        next.delete(title);
      } else {
        next.add(title);
      }
      return next;
    });
  };

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="border-b border-border p-6">
        <Link to="/docs" className="flex items-center gap-2">
          <BrandLogo showText={false} />
          <div>
            <h2 className="font-bold text-foreground">AI Fabric Docs</h2>
            <p className="text-xs text-muted-foreground">Release 0.3.3</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 overflow-y-auto p-4">
        {docSections.map((section) => (
          <SidebarSection
            key={section.title}
            section={section}
            isExpanded={expandedSections.has(section.title)}
            onToggle={() => toggleSection(section.title)}
          />
        ))}
      </nav>

      <div className="border-t border-border p-4">
        <Link
          to="/docs/roadmap"
          className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <Map className="h-4 w-4" />
          Public roadmap
        </Link>
      </div>
    </div>
  );

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="fixed left-4 top-24 z-50 md:hidden"
        onClick={() => setIsMobileOpen(true)}
      >
        <Menu className="h-4 w-4" />
      </Button>

      <aside className="fixed left-0 top-16 z-40 hidden h-[calc(100vh-4rem)] w-72 border-r border-border bg-background/95 backdrop-blur md:block">
        {sidebar}
      </aside>

      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm md:hidden"
              onClick={() => setIsMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed left-0 top-0 z-50 h-full w-80 border-r border-border bg-background md:hidden"
            >
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-4 z-10"
                onClick={() => setIsMobileOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
              {sidebar}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default DocsSidebar;
