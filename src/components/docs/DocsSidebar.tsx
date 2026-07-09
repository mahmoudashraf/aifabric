import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  BookOpen, 
  ChevronDown, 
  ChevronRight, 
  Menu, 
  X,
  Sparkles,
  Shield,
  Database,
  Brain,
  Zap,
  BarChart3,
  RefreshCw,
  MessageSquare,
  Cpu,
  FileText,
  TestTube
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
      { title: "Introduction", href: "/docs" },
      { title: "Getting Started Index", href: "/docs/getting-started", badge: "New" },
      { title: "LLM Start Here", href: "/docs/start-here", badge: "New" },
      { title: "Choose Your Path", href: "/docs/choose-your-path", badge: "New" },
      { title: "Installation", href: "/docs/installation", badge: "New" },
      { title: "First Semantic Search", href: "/docs/first-semantic-search", badge: "New" },
      { title: "First RAG Chat", href: "/docs/first-rag-chat", badge: "New" },
      { title: "First Governed Action", href: "/docs/first-governed-action", badge: "New" },
      { title: "Chat Session Memory", href: "/docs/chat-session-memory", badge: "New" },
      { title: "OpenAI Provider", href: "/docs/providers/openai", badge: "New" },
      { title: "ONNX Embeddings", href: "/docs/providers/onnx", badge: "New" },
      { title: "Lucene Vector Storage", href: "/docs/vector/lucene", badge: "New" },
      { title: "Security Access Policy", href: "/docs/security/access-policy", badge: "New" },
      { title: "Testing & Verification", href: "/docs/testing-verification", badge: "New" },
      { title: "Real Apps Map", href: "/docs/real-apps-map", badge: "New" },
      { title: "Production Checklist", href: "/docs/production-checklist", badge: "New" },
      { title: "Visual Quick Start", href: "/docs/quickstart" },
    ],
  },
  {
    title: "LLM Assistant Context",
    icon: <Cpu className="h-4 w-4" />,
    items: [
      { title: "Context Pack Index", href: "/docs/llm-context", badge: "New" },
      { title: "Context Routing", href: "/docs/llm-context/routing", badge: "New" },
      { title: "Assistant Rules", href: "/docs/llm-context/rules", badge: "New" },
      { title: "Capability Map", href: "/docs/llm-context/capability-map", badge: "New" },
      { title: "Module Decision Tree", href: "/docs/llm-context/module-decision-tree", badge: "New" },
      { title: "Common Task Recipes", href: "/docs/llm-context/common-recipes", badge: "New" },
      { title: "Troubleshooting", href: "/docs/llm-context/troubleshooting", badge: "New" },
      { title: "Real App Reference", href: "/docs/llm-context/real-app-reference", badge: "New" },
    ],
  },
  {
    title: "User Stories",
    icon: <BookOpen className="h-4 w-4" />,
    items: [
      { title: "The Orchestrator Story", href: "/docs/orchestrator_story" },
      { title: "Orchestrator Story V2 (Narrative)", href: "/docs/orchestrator_story_v2", badge: "New" },
      { title: "PII Detection Story", href: "/docs/pii_detection", badge: "New" },
      { title: "The Indexing Story", href: "/docs/indexing_story" },
      { title: "Indexing Story V2 (Narrative)", href: "/docs/indexing_story_v2", badge: "New" },
      { title: "Custom Storage Indexing", href: "/docs/custom_storage_indexing", badge: "New" },
      { title: "The Migration Story", href: "/docs/migration_story" },
      { title: "Migration Story V2 (Narrative)", href: "/docs/migration_story_v2", badge: "New" },
      { title: "The Storage Story", href: "/docs/storage_story" },
      { title: "Storage Story V2 (Narrative)", href: "/docs/storage_story_v2", badge: "New" },
      { title: "The Intent Extraction Story", href: "/docs/intent_story" },
      { title: "Intent Story V2 (Narrative)", href: "/docs/intent_story_v2", badge: "New" },
      { title: "The RAG Story", href: "/docs/rag_story" },
      { title: "RAG Story V2 (Narrative)", href: "/docs/rag_story_v2", badge: "New" },
      { title: "RAG Story V3 (Realistic)", href: "/docs/rag_story_v3", badge: "New" },
      { title: "The Behavior Story", href: "/docs/behavior_story" },
      { title: "Behavior Story V2 (Narrative)", href: "/docs/behavior_story_v2", badge: "New" },
      { title: "The Access Policy Story", href: "/docs/access_policy_story", badge: "New" },
      { title: "Access Policy Story V2 (Narrative)", href: "/docs/access_policy_story_v2", badge: "New" },
      { title: "Access Control Mechanics Story", href: "/docs/access_control_mechanics_story", badge: "New" },
      { title: "Access Control Mechanics V2 (Narrative)", href: "/docs/access_control_mechanics_v2", badge: "New" },
      { title: "PII Detection Story V1", href: "/docs/pii_detection_story_v1", badge: "New" },
      { title: "PII Detection Story V2 (Narrative)", href: "/docs/pii_detection_story_v2", badge: "New" },
      { title: "Relationship Query Story V2 (Narrative)", href: "/docs/relationship_query_story_v2", badge: "New" },
      { title: "Relationship Query Intelligence Story", href: "/docs/relationship_query_intelligence_story", badge: "New" },
      { title: "Relationship Query Intelligence V2 (Narrative)", href: "/docs/relationship_query_intelligence_v2", badge: "New" },
      { title: "OpenAI Provider Story", href: "/docs/openai_provider_story", badge: "New" },
      { title: "OpenAI Provider Story V2 (Narrative)", href: "/docs/openai_provider_story_v2", badge: "New" },
      { title: "ONNX Provider Story", href: "/docs/onnx_provider_story", badge: "New" },
      { title: "ONNX Provider Story V2 (Narrative)", href: "/docs/onnx_provider_story_v2", badge: "New" },
      { title: "Audit Capabilities Story", href: "/docs/audit_capabilities_story", badge: "New" },
      { title: "Audit Capabilities Story V2 (Narrative)", href: "/docs/audit_capabilities_story_v2", badge: "New" },
      { title: "Cleanup Capabilities Story", href: "/docs/cleanup_capabilities_story", badge: "New" },
      { title: "Cleanup Capabilities Story V2 (Narrative)", href: "/docs/cleanup_capabilities_story_v2", badge: "New" },
      { title: "Retention Capabilities Story", href: "/docs/retention_capabilities_story", badge: "New" },
      { title: "Retention Capabilities Story V2 (Narrative)", href: "/docs/retention_capabilities_story_v2", badge: "New" },
      { title: "The Security Story", href: "/docs/security-story", badge: "Soon" },
    ],
  },
  {
    title: "Real API Stories",
    icon: <TestTube className="h-4 w-4" />,
    items: [
      { title: "All Real API Stories", href: "/docs/real-api-stories", badge: "New" },
      { title: "E-Commerce Product Discovery", href: "/docs/ecommerce-product-discovery-story" },
      { title: "Financial Fraud Detection", href: "/docs/financial-fraud-detection-story" },
      { title: "Law Firm Document Management", href: "/docs/law-firm-document-story" },
      { title: "PII Detection Edge Spectrum", href: "/docs/pii-detection-edge-story" },
      { title: "Smart Suggestions", href: "/docs/smart-suggestions-story" },
      { title: "ONNX Fallback Readiness", href: "/docs/onnx-fallback-story" },
      { title: "Real AI Embedding Generation", href: "/docs/real-ai-embedding-story" },
      { title: "Vector Lifecycle Management", href: "/docs/vector-lifecycle-story" },
    ],
  },
  {
    title: "AI Annotations Stories",
    icon: <Sparkles className="h-4 w-4" />,
    items: [
      { title: "Overview", href: "/docs/ai-annotations-stories", badge: "Soon" },
      { title: "E-Commerce Semantic Search", href: "/docs/ai-annotations-ecommerce", badge: "New" },
      { title: "Enterprise Knowledge", href: "/docs/ai-annotations-enterprise-knowledge", badge: "New" },
      { title: "Developer's Guide", href: "/docs/ai-annotations-developer-guide", badge: "New" },
      { title: "Architect's Guide", href: "/docs/ai-annotations-architect", badge: "New" },
      { title: "Killing Boilerplate", href: "/docs/ai-annotations-killing-boilerplate", badge: "New" },
      { title: "Semantic Search Deep Dive", href: "/docs/ai-annotations-semantic-search", badge: "New" },
    ],
  },
  {
    title: "Detailed Guides",
    icon: <FileText className="h-4 w-4" />,
    items: [
      { title: "AI Core - Full Guide", href: "/docs/guides/core", badge: "New" },
      { title: "Intent Extraction - Full Guide", href: "/docs/guides/intent", badge: "New" },
      { title: "Relationship Query - Full Guide", href: "/docs/guides/query", badge: "New" },
      { title: "Relationship Query Intelligence - Full Guide", href: "/docs/guides/relationship_query_intelligence", badge: "New" },
      { title: "Orchestrator - Full Guide", href: "/docs/guides/orchestrator" },
      { title: "Indexing - Full Guide", href: "/docs/guides/indexing" },
      { title: "Migration - Full Guide", href: "/docs/guides/migration" },
      { title: "Storage - Full Guide", href: "/docs/guides/storage" },
      { title: "RAG + ONNX - Full Guide", href: "/docs/guides/rag" },
      { title: "Behavior - Full Guide", href: "/docs/guides/behavior" },
      { title: "Access Policy - Full Guide", href: "/docs/guides/access_policy", badge: "New" },
      { title: "Access Control Mechanics - Full Guide", href: "/docs/guides/access_control_mechanics", badge: "New" },
      { title: "PII Detection - Full Guide", href: "/docs/guides/pii_detection", badge: "New" },
      { title: "OpenAI Provider - Full Guide", href: "/docs/guides/openai_provider", badge: "New" },
      { title: "ONNX Provider - Full Guide", href: "/docs/guides/onnx_provider", badge: "New" },
      { title: "Audit Capabilities - Full Guide", href: "/docs/guides/audit_capabilities", badge: "New" },
      { title: "Cleanup Capabilities - Full Guide", href: "/docs/guides/cleanup_capabilities", badge: "New" },
      { title: "Retention Capabilities - Full Guide", href: "/docs/guides/retention_capabilities", badge: "New" },
    ],
  },
  {
    title: "Core Modules",
    icon: <Database className="h-4 w-4" />,
    items: [
      { title: "AI Core", href: "/docs/modules/core" },
      { title: "AI Core V2 (Narrative)", href: "/docs/core_story_v2", badge: "New" },
      { title: "Orchestrator", href: "/docs/modules/orchestrator", badge: "Soon" },
      { title: "Web Module", href: "/docs/modules/web", badge: "Soon" },
    ],
  },
  {
    title: "Advanced Features",
    icon: <Brain className="h-4 w-4" />,
    items: [
      { title: "Relationship Query", href: "/docs/features/query", badge: "New" },
      { title: "Behavior Analytics", href: "/docs/features/behavior", badge: "Soon" },
      { title: "ONNX Provider", href: "/docs/features/onnx", badge: "Soon" },
    ],
  },
  {
    title: "Security & Compliance",
    icon: <Shield className="h-4 w-4" />,
    items: [
      { title: "PII Detection", href: "/docs/security/pii", badge: "Soon" },
      { title: "Access Control", href: "/docs/security/access", badge: "Soon" },
      { title: "Compliance Gates", href: "/docs/security/compliance", badge: "Soon" },
    ],
  },
];

const SidebarSection = ({ section, isExpanded, onToggle }: { 
  section: DocSection; 
  isExpanded: boolean;
  onToggle: () => void;
}) => {
  const location = useLocation();
  
  return (
    <div className="mb-2">
      <button
        onClick={onToggle}
        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-foreground hover:bg-muted/50 transition-colors"
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
                const isDisabled = item.badge === "Soon";
                
                return (
                  <Link
                    key={item.href}
                    to={isDisabled ? "#" : item.href}
                    onClick={(e) => isDisabled && e.preventDefault()}
                    className={cn(
                      "flex items-center gap-2 rounded-md px-3 py-1.5 text-sm transition-colors",
                      isActive 
                        ? "bg-primary/10 text-primary font-medium" 
                        : isDisabled
                        ? "text-muted-foreground/50 cursor-not-allowed"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    )}
                  >
                    <span className="flex-1">{item.title}</span>
                    {item.badge && (
                      <span className={cn(
                        "rounded-full px-2 py-0.5 text-[10px] font-medium",
                        item.badge === "New" 
                          ? "bg-accent/20 text-accent"
                          : "bg-muted text-muted-foreground"
                      )}>
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
  const [expandedSections, setExpandedSections] = useState<string[]>(
    docSections.map(s => s.title) // All expanded by default
  );

  const toggleSection = (title: string) => {
    setExpandedSections(prev => 
      prev.includes(title) 
        ? prev.filter(t => t !== title)
        : [...prev, title]
    );
  };

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-border p-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary">
          <BookOpen className="h-4 w-4 text-primary-foreground" />
        </div>
        <div>
          <h2 className="font-semibold text-foreground">Documentation</h2>
          <p className="text-xs text-muted-foreground">AI Fabric Framework</p>
        </div>
      </div>
      
      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4">
        {docSections.map((section) => (
          <SidebarSection
            key={section.title}
            section={section}
            isExpanded={expandedSections.includes(section.title)}
            onToggle={() => toggleSection(section.title)}
          />
        ))}
      </nav>
      
      {/* Footer */}
      <div className="border-t border-border p-4">
        <Link 
          to="/" 
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <Zap className="h-4 w-4" />
          <span>Back to AI Fabric</span>
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Toggle */}
      <Button
        variant="outline"
        size="icon"
        className="fixed bottom-4 left-4 z-50 rounded-full shadow-lg md:hidden"
        onClick={() => setIsMobileOpen(true)}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm md:hidden"
            onClick={() => setIsMobileOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed left-0 top-0 z-50 h-full w-72 border-r border-border bg-background shadow-xl md:hidden"
          >
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2"
              onClick={() => setIsMobileOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
            <SidebarContent />
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 md:left-0 md:border-r md:border-border md:bg-background">
        <SidebarContent />
      </aside>
    </>
  );
};

export default DocsSidebar;
