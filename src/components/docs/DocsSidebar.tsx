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
  FileText
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
      { title: "Quick Start", href: "/docs/quickstart", badge: "Soon" },
      { title: "Installation", href: "/docs/installation", badge: "Soon" },
    ],
  },
  {
    title: "User Stories",
    icon: <BookOpen className="h-4 w-4" />,
    items: [
      { title: "The Orchestrator Story", href: "/docs/orchestrator-story" },
      { title: "The RAG Story", href: "/docs/rag-story", badge: "Soon" },
      { title: "The Security Story", href: "/docs/security-story", badge: "Soon" },
    ],
  },
  {
    title: "Detailed User Guides",
    icon: <FileText className="h-4 w-4" />,
    items: [
      { title: "Orchestrator - Full Guide", href: "/docs/guides/orchestrator", badge: "New" },
    ],
  },
  {
    title: "Core Modules",
    icon: <Database className="h-4 w-4" />,
    items: [
      { title: "AI Core", href: "/docs/modules/core", badge: "Soon" },
      { title: "Orchestrator", href: "/docs/modules/orchestrator", badge: "Soon" },
      { title: "Web Module", href: "/docs/modules/web", badge: "Soon" },
    ],
  },
  {
    title: "Advanced Features",
    icon: <Brain className="h-4 w-4" />,
    items: [
      { title: "Behavior Analytics", href: "/docs/features/behavior", badge: "Soon" },
      { title: "Relationship Query", href: "/docs/features/query", badge: "Soon" },
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
