import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  BookOpen,
  Brain,
  ChevronDown,
  ChevronRight,
  Code2,
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
    new Set(["Getting Started", "Architecture", "Modules"])
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
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-primary">
            <Code2 className="h-5 w-5 text-primary-foreground" />
          </div>
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
