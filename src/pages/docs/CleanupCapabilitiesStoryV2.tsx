import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Highlight, themes } from "prism-react-renderer";
import DocsLayout from "@/components/docs/DocsLayout";
import PageViewCounter from "@/components/PageViewCounter";
import StoryLoveButton from "@/components/StoryLoveButton";
import { 
  Brain,
  Zap,
  MessageSquare,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Settings,
  Code,
  Package,
  FileCode,
  BookOpen,
  Clock,
  DollarSign,
  Activity,
  Sparkles,
  Heart,
  Target,
  AlertTriangle,
  Database,
  Server,
  Cpu,
  Layers,
  RefreshCw,
  TrendingUp,
  Lock,
  Shield,
  Eye,
  Search,
  FileText,
  BarChart3,
  FileCheck,
  Users,
  Calendar,
  Trash2,
  Archive,
  HardDrive,
  TrendingDown,
  Play,
  Pause,
  RotateCcw,
  Rocket,
  Lightbulb,
  HardDriveIcon
} from "lucide-react";

const PAGE_TITLE = "Cleanup Capabilities V2: The 1TB Database That Shrunk to 300GB - AI Fabric Framework";
const PAGE_DESCRIPTION = "A DevOps engineer's journey from data bloat to database health—how automatic cleanup saved thousands and kept compliance.";

const codeTheme = {
  ...themes.nightOwl,
  plain: {
    ...themes.nightOwl.plain,
    backgroundColor: "hsl(var(--code-bg))",
  },
};

const CodeBlock = ({ code, language = "java" }: { code: string; language?: string }) => (
  <Highlight theme={codeTheme} code={code.trim()} language={language}>
    {({ style, tokens, getLineProps, getTokenProps }) => (
      <pre
        className="overflow-x-auto rounded-lg border border-border/50 p-4 text-sm my-4"
        style={style}
      >
        {tokens.map((line, i) => (
          <div key={i} {...getLineProps({ line })}>
            {line.map((token, key) => (
              <span key={key} {...getTokenProps({ token })} />
            ))}
          </div>
        ))}
      </pre>
    )}
  </Highlight>
);

const TheDataBloatJourney = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const steps = [
    {
      time: "Month 1",
      title: "The Beginning",
      icon: Database,
      color: "text-blue-400",
      bgColor: "bg-blue-500/5",
      borderColor: "border-blue-500/30",
      events: [
        { emoji: "🚀", text: "Launch: AI application goes live", type: "positive" },
        { emoji: "📊", text: "Database size: 10GB", type: "normal" },
        { emoji: "⚡", text: "Search performance: 500ms", type: "positive" },
        { emoji: "💰", text: "Cost: $100/month", type: "normal" }
      ]
    },
    {
      time: "Month 3",
      title: "The Growth",
      icon: TrendingUp,
      color: "text-orange-400",
      bgColor: "bg-orange-500/5",
      borderColor: "border-orange-500/30",
      events: [
        { emoji: "📈", text: "Database size: 200GB", type: "warning" },
        { emoji: "🐌", text: "Search performance: 1.5s", type: "warning" },
        { emoji: "💰", text: "Cost: $300/month", type: "warning" },
        { emoji: "😅", text: "Team: 'Still manageable'", type: "info" }
      ]
    },
    {
      time: "Month 6",
      title: "The Problem",
      icon: AlertTriangle,
      color: "text-red-400",
      bgColor: "bg-red-500/5",
      borderColor: "border-red-500/30",
      events: [
        { emoji: "📊", text: "Database size: 500GB", type: "error" },
        { emoji: "🐌", text: "Search performance: 2s", type: "error" },
        { emoji: "💰", text: "Cost: $500/month", type: "error" },
        { emoji: "🔍", text: "Found: 50,000 orphaned vectors", type: "critical" }
      ]
    },
    {
      time: "Month 9",
      title: "The Crisis",
      icon: AlertTriangle,
      color: "text-red-600",
      bgColor: "bg-red-600/5",
      borderColor: "border-red-600/50",
      events: [
        { emoji: "📊", text: "Database size: 800GB", type: "critical" },
        { emoji: "🐌", text: "Search performance: 4s", type: "critical" },
        { emoji: "💰", text: "Cost: $800/month", type: "critical" },
        { emoji: "😰", text: "CFO: 'Why is our database cost so high?'", type: "critical" },
        { emoji: "🔍", text: "Found: 150,000 orphaned vectors", type: "critical" }
      ]
    },
    {
      time: "Month 12",
      title: "The Breaking Point",
      icon: XCircle,
      color: "text-red-700",
      bgColor: "bg-red-700/5",
      borderColor: "border-red-700/50",
      events: [
        { emoji: "📊", text: "Database size: 1TB", type: "critical" },
        { emoji: "🐌", text: "Search performance: 5s", type: "critical" },
        { emoji: "💰", text: "Cost: $1,000/month", type: "critical" },
        { emoji: "💔", text: "DevOps: 'We need cleanup NOW'", type: "critical" },
        { emoji: "💡", text: "Research: 'AI Fabric has cleanup capabilities...'", type: "positive" }
      ]
    },
    {
      time: "Month 12 (Week 2)",
      title: "The Solution",
      icon: Rocket,
      color: "text-green-400",
      bgColor: "bg-green-500/5",
      borderColor: "border-green-500/30",
      events: [
        { emoji: "⚙️", text: "Enable cleanup: enabled: true", type: "intervention" },
        { emoji: "📅", text: "Configure retention policies", type: "intervention" },
        { emoji: "✅", text: "Tests: Cleanup works automatically", type: "intervention" },
        { emoji: "🚀", text: "Deploy: Zero downtime", type: "intervention" }
      ]
    },
    {
      time: "Month 13",
      title: "The Results",
      icon: TrendingDown,
      color: "text-green-400",
      bgColor: "bg-green-500/5",
      borderColor: "border-green-500/30",
      events: [
        { emoji: "📊", text: "Database size: 1TB → 300GB", type: "positive" },
        { emoji: "⚡", text: "Search performance: 5s → 700ms", type: "positive" },
        { emoji: "💰", text: "Cost: $1,000 → $300/month", type: "positive" },
        { emoji: "🧹", text: "Orphaned vectors: 200,000 → 0", type: "positive" }
      ]
    },
    {
      time: "6 Months Later",
      title: "The Impact",
      icon: CheckCircle2,
      color: "text-green-400",
      bgColor: "bg-green-500/5",
      borderColor: "border-green-500/30",
      events: [
        { emoji: "💰", text: "Total savings: $4,200/year", type: "positive" },
        { emoji: "⚡", text: "Performance: Consistently fast", type: "positive" },
        { emoji: "🔒", text: "Compliance: GDPR, HIPAA maintained", type: "positive" },
        { emoji: "🎯", text: "Database: Healthy and controlled", type: "positive" }
      ]
    }
  ];

  useEffect(() => {
    if (isPlaying && activeStep < steps.length - 1) {
      const timer = setTimeout(() => {
        setActiveStep(prev => prev + 1);
      }, 3000);
      return () => clearTimeout(timer);
    } else if (activeStep >= steps.length - 1) {
      setIsPlaying(false);
    }
  }, [isPlaying, activeStep, steps.length]);

  const getEventColor = (type: string) => {
    switch (type) {
      case "critical": return "text-red-400";
      case "error": return "text-orange-400";
      case "warning": return "text-yellow-400";
      case "positive": return "text-green-400";
      case "intervention": return "text-blue-400";
      default: return "text-muted-foreground";
    }
  };

  return (
    <div className="my-16">
      <h3 className="text-2xl font-bold text-foreground mb-8 text-center">
        The 1TB Database That Shrunk to 300GB
      </h3>
      <p className="text-sm text-muted-foreground text-center mb-8">
        A DevOps engineer's journey from data bloat to database health
      </p>
      
      {/* Controls */}
      <div className="flex items-center justify-center gap-3 mb-6">
        <button
          onClick={() => {
            setIsPlaying(!isPlaying);
            if (activeStep >= steps.length - 1) {
              setActiveStep(0);
              setIsPlaying(true);
            }
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 transition-colors"
        >
          {isPlaying ? (
            <>
              <Pause className="h-4 w-4" />
              Pause
            </>
          ) : (
            <>
              <Play className="h-4 w-4" />
              Play Timeline
            </>
          )}
        </button>
        <button
          onClick={() => {
            setActiveStep(0);
            setIsPlaying(false);
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted border border-border/50 text-muted-foreground hover:text-foreground transition-colors"
        >
          <RotateCcw className="h-4 w-4" />
          Reset
        </button>
      </div>
      
      {/* Step Navigation */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 justify-center">
        {steps.map((step, i) => {
          const Icon = step.icon;
          return (
            <button
              key={i}
              onClick={() => {
                setActiveStep(i);
                setIsPlaying(false);
              }}
              className={`flex-shrink-0 px-3 py-2 rounded-lg font-semibold transition-all ${
                activeStep === i
                  ? `${step.bgColor} ${step.borderColor} border-2 shadow-lg`
                  : "bg-muted/30 border border-border/50 text-muted-foreground hover:border-border"
              }`}
            >
              <div className="flex items-center gap-2">
                <Icon className={`h-4 w-4 ${activeStep === i ? step.color : 'text-muted-foreground'}`} />
                <span className={`text-xs ${activeStep === i ? 'text-foreground' : ''}`}>
                  {step.time.split(' ')[0]}
                </span>
              </div>
            </button>
          );
        })}
      </div>
      
      {/* Current Step */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`p-6 rounded-xl border ${steps[activeStep].borderColor} ${steps[activeStep].bgColor}`}
        >
          <div className="flex items-center gap-3 mb-4">
            {React.createElement(steps[activeStep].icon, {
              className: `h-6 w-6 ${steps[activeStep].color}`
            })}
            <div>
              <h4 className="text-lg font-bold text-foreground">{steps[activeStep].title}</h4>
              <p className="text-xs text-muted-foreground">{steps[activeStep].time}</p>
            </div>
          </div>
          
          <div className="space-y-2">
            {steps[activeStep].events.map((event, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-2 text-sm"
              >
                <span className="text-xl">{event.emoji}</span>
                <span className={getEventColor(event.type)}>{event.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
      
      {activeStep >= steps.length - 1 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-6 p-6 rounded-xl bg-green-500/10 border border-green-500/30 text-center"
        >
          <Rocket className="h-8 w-8 text-green-400 mx-auto mb-3" />
          <p className="text-lg font-bold text-green-400 mb-2">Cleanup Capabilities Enabled: Database Healthy</p>
          <p className="text-sm text-muted-foreground">
            Zero code. Automatic cleanup. Retention policies enforced. Database healthy. Compliance maintained.
          </p>
        </motion.div>
      )}
    </div>
  );
};

const BeforeAfterComparison = () => {
  return (
    <div className="my-16">
      <h3 className="text-2xl font-bold text-foreground mb-8 text-center">
        Before & After: From 1TB to 300GB
      </h3>
      
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Before */}
        <div className="p-6 rounded-xl border-2 border-red-500/30 bg-red-500/5">
          <div className="flex items-center gap-3 mb-4">
            <XCircle className="h-6 w-6 text-red-400" />
            <h4 className="font-bold text-foreground">Before: No Cleanup</h4>
          </div>
          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-muted/30 border border-border/30">
              <p className="text-xs font-semibold text-foreground mb-2">Problems:</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Orphaned vectors accumulate</li>
                <li>• Old data never deleted</li>
                <li>• Vector database grows unbounded</li>
                <li>• Costs increase ($1,000/month)</li>
                <li>• Slow searches (5s)</li>
                <li>• Compliance violations</li>
                <li>• 200,000 orphaned vectors</li>
                <li>• Database size: 1TB</li>
              </ul>
            </div>
            <CodeBlock code={`// No cleanup
// Orphaned vectors accumulate
// Old data never deleted
// Vector database grows unbounded

// Result:
// - Database size: 1TB
// - Cost: $1,000/month
// - Search performance: 5s
// - Orphaned vectors: 200,000
// - Compliance: Violations`} />
          </div>
        </div>
        
        {/* After */}
        <div className="p-6 rounded-xl border-2 border-green-500/30 bg-green-500/5">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle2 className="h-6 w-6 text-green-400" />
            <h4 className="font-bold text-foreground">After: Automatic Cleanup</h4>
          </div>
          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-muted/30 border border-border/30">
              <p className="text-xs font-semibold text-foreground mb-2">Benefits:</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Orphaned vectors automatically removed</li>
                <li>• Old data cleaned up by retention policy</li>
                <li>• Vector database size controlled</li>
                <li>• Costs reduced ($300/month)</li>
                <li>• Fast searches (700ms)</li>
                <li>• Compliance maintained</li>
                <li>• 0 orphaned vectors</li>
                <li>• Database size: 300GB</li>
              </ul>
            </div>
            <CodeBlock code={`// Automatic cleanup enabled
ai:
  cleanup:
    enabled: true
    retention-days:
      order: 2555      # 7 years
      user: 365        # 1 year
      default: 180     # 6 months
    strategies:
      order: ARCHIVE
      user: ARCHIVE

// Result:
// - Database size: 300GB
// - Cost: $300/month
// - Search performance: 700ms
// - Orphaned vectors: 0
// - Compliance: Maintained`} language="yaml" />
          </div>
        </div>
      </div>
      
      <div className="mt-6 p-4 rounded-lg bg-primary/10 border border-primary/20 text-center">
        <p className="text-sm font-bold text-primary">
          Result: 1TB → 300GB. $1,000 → $300/month. 5s → 700ms. 200K orphaned → 0. Compliance maintained.
        </p>
      </div>
    </div>
  );
};

const TheThreeCleanups = () => {
  const [activeCleanup, setActiveCleanup] = useState(0);
  
  const cleanups = [
    {
      step: 1,
      title: "Orphaned Entities",
      icon: Trash2,
      color: "text-blue-400",
      borderColor: "border-blue-500/30",
      bgColor: "bg-blue-500/5",
      schedule: "Sunday 4 AM",
      description: "Removes entities with vector IDs but no actual vector",
      code: `@Scheduled(cron = "0 0 4 * * SUN")
public void cleanupOrphanedEntities() {
    // Find entities with vector IDs
    List<AISearchableEntity> entities = 
        storageStrategy.findByVectorIdIsNotNull();
    
    // Check if vector exists
    for (AISearchableEntity entity : entities) {
        if (!vectorExists(entity)) {
            deleteEntity(entity);  // Orphaned → delete
        }
    }
}

// Result: Orphaned entities removed`,
      impact: "Removes orphaned metadata and stale vectors"
    },
    {
      step: 2,
      title: "No-Vector Entities",
      icon: XCircle,
      color: "text-purple-400",
      borderColor: "border-purple-500/30",
      bgColor: "bg-purple-500/5",
      schedule: "Sunday 5 AM",
      description: "Removes entities without vector IDs (failed indexing)",
      code: `@Scheduled(cron = "0 0 5 * * SUN")
public void cleanupEntitiesWithoutVectors() {
    // Find entities without vector IDs
    List<AISearchableEntity> entities = 
        storageStrategy.findByVectorIdIsNull();
    
    // Check retention period (default: 24 hours)
    Duration retention = properties.getNoVectorEntities().getRetention();
    LocalDateTime cutoff = LocalDateTime.now().minus(retention);
    
    // Delete if older than retention
    for (AISearchableEntity entity : entities) {
        if (shouldCleanup(entity.getCreatedAt(), cutoff)) {
            deleteEntity(entity);
        }
    }
}

// Result: Stale entities removed`,
      impact: "Removes failed indexing attempts and stale metadata"
    },
    {
      step: 3,
      title: "Retention Policy",
      icon: Calendar,
      color: "text-green-400",
      borderColor: "border-green-500/30",
      bgColor: "bg-green-500/5",
      schedule: "Daily 3:30 AM",
      description: "Enforces retention policies per entity type",
      code: `@Scheduled(cron = "0 30 3 * * *")
public void cleanupByRetentionPolicy() {
    // For each entity type
    for (Map.Entry<String, Integer> entry : 
         properties.getRetentionDays().entrySet()) {
        String entityType = entry.getKey();
        int retentionDays = entry.getValue();
        LocalDateTime cutoff = 
            LocalDateTime.now().minusDays(retentionDays);
        
        // Find entities older than retention
        List<AISearchableEntity> entities = 
            storageStrategy.findByEntityType(entityType);
        
        // Apply cleanup strategy
        for (AISearchableEntity entity : entities) {
            if (shouldCleanup(entity.getCreatedAt(), cutoff)) {
                applyPolicy(entityType, entity);
                // SOFT_DELETE, ARCHIVE, HARD_DELETE, or CASCADE
            }
        }
    }
}

// Result: Retention policies enforced`,
      impact: "Enforces compliance and keeps database healthy"
    }
  ];

  return (
    <div className="my-16">
      <h3 className="text-2xl font-bold text-foreground mb-8 text-center">
        The 3 Cleanup Types: Set It and Forget It
      </h3>
      <p className="text-sm text-muted-foreground text-center mb-8">
        Three automatic cleanup processes. Zero code. Database stays healthy.
      </p>
      
      <div className="grid grid-cols-3 gap-2 mb-6">
        {cleanups.map((cleanup, i) => {
          const Icon = cleanup.icon;
          return (
            <button
              key={i}
              onClick={() => setActiveCleanup(i)}
              className={`p-3 rounded-lg border-2 transition-all ${
                activeCleanup === i
                  ? `${cleanup.borderColor} ${cleanup.bgColor} shadow-lg`
                  : "border-border/30 bg-muted/30 hover:border-border"
              }`}
            >
              <Icon className={`h-5 w-5 mx-auto mb-1 ${activeCleanup === i ? cleanup.color : 'text-muted-foreground'}`} />
              <p className={`text-xs font-semibold text-center ${activeCleanup === i ? 'text-foreground' : 'text-muted-foreground'}`}>
                {cleanup.step}
              </p>
            </button>
          );
        })}
      </div>
      
      <AnimatePresence mode="wait">
        <motion.div
          key={activeCleanup}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`p-6 rounded-xl border ${cleanups[activeCleanup].borderColor} ${cleanups[activeCleanup].bgColor}`}
        >
          <div className="flex items-center gap-3 mb-4">
            {React.createElement(cleanups[activeCleanup].icon, {
              className: `h-6 w-6 ${cleanups[activeCleanup].color}`
            })}
            <div>
              <h4 className="font-bold text-foreground">
                {cleanups[activeCleanup].title}
              </h4>
              <p className="text-xs text-muted-foreground">{cleanups[activeCleanup].description}</p>
            </div>
            <div className="ml-auto">
              <span className="text-xs font-semibold text-primary">{cleanups[activeCleanup].schedule}</span>
            </div>
          </div>
          <CodeBlock code={cleanups[activeCleanup].code} />
          <div className="mt-4 p-3 rounded-lg bg-muted/30 border border-border/30">
            <p className="text-xs font-semibold text-foreground mb-1">Impact:</p>
            <p className="text-sm text-muted-foreground">{cleanups[activeCleanup].impact}</p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const WhatYouImplement = () => {
  return (
    <div className="my-16">
      <h3 className="text-2xl font-bold text-foreground mb-8 text-center">
        What You Actually Do
      </h3>
      
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-xl border border-primary/30 bg-primary/5">
          <div className="flex items-center gap-3 mb-4">
            <Settings className="h-6 w-6 text-primary" />
            <h4 className="font-bold text-foreground">1. Configure (Optional)</h4>
          </div>
          <CodeBlock code={`# application.yml
ai:
  cleanup:
    enabled: true                    # Enable cleanup
    
    # Retention policies (days)
    retention-days:
      order: 2555      # 7 years (compliance)
      user: 365        # 1 year
      product: 180     # 6 months
      default: 180     # Default
    
    # Cleanup strategies
    strategies:
      order: ARCHIVE      # Archive orders
      user: ARCHIVE       # Archive users
      product: SOFT_DELETE # Soft delete products
    
    # Schedule
    orphaned-entities:
      enabled: true
      cron: "0 0 4 * * SUN"  # Sunday 4 AM
    
    no-vector-entities:
      enabled: true
      cron: "0 0 5 * * SUN"  # Sunday 5 AM
      retention: PT24H       # 24 hours
    
    retention-cron: "0 30 3 * * *"  # Daily 3:30 AM`} language="yaml" />
        </div>
        
        <div className="p-6 rounded-xl border border-secondary/30 bg-secondary/5">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle2 className="h-6 w-6 text-secondary" />
            <h4 className="font-bold text-foreground">2. Done (Zero Code)</h4>
          </div>
          <CodeBlock code={`// That's it!
// Cleanup runs automatically:
// - Orphaned entities: Sunday 4 AM
// - No-vector entities: Sunday 5 AM
// - Retention policy: Daily 3:30 AM

// No code required
// No manual intervention
// No monitoring needed

// Result:
// - Orphaned vectors removed
// - Retention policies enforced
// - Database stays healthy
// - Compliance maintained
// - Costs controlled`} />
        </div>
      </div>
      
      <div className="mt-6 p-6 rounded-xl bg-gradient-primary text-center">
        <p className="text-primary-foreground font-semibold text-lg">
          That's it. One configuration. Zero code. Automatic cleanup. Database healthy. Compliance maintained.
        </p>
      </div>
    </div>
  );
};

const CleanupCapabilitiesStoryV2 = () => {
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
    updateMeta('meta[property="og:type"]', "content", "article");
    updateMeta('meta[property="og:url"]', "content", window.location.href);

    updateMeta('meta[name="twitter:title"]', "content", PAGE_TITLE);
    updateMeta('meta[name="twitter:description"]', "content", PAGE_DESCRIPTION);
    updateMeta('meta[name="twitter:card"]', "content", "summary_large_image");

    updateCanonical(window.location.href);
  }, []);

  return (
    <DocsLayout>
      <div className="min-h-screen">
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-border/50">
          <div className="absolute inset-0 bg-gradient-glow opacity-50" />
          <div className="px-6 py-16 relative">
            <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                  <span className="text-2xl">🧹</span>
                  Cleanup Capabilities V2 (Narrative)
                </span>
                <Link 
                  to="/docs/cleanup_capabilities_story"
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  View V1 →
                </Link>
              </div>
              <div className="flex items-center gap-3">
                <StoryLoveButton storySlug="cleanup_capabilities_story_v2" />
                <PageViewCounter />
              </div>
            </div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl"
            >
              <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
                The{" "}
                <span className="text-gradient">1TB Database</span>{" "}
                That Shrunk to 300GB
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mb-8">
                A DevOps engineer's journey from data bloat to database health—how automatic cleanup 
                saved thousands and kept compliance.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2 text-sm text-accent">
                  <TrendingDown className="h-4 w-4" />
                  1TB → 300GB
                </div>
                <div className="flex items-center gap-2 rounded-full bg-secondary/10 px-4 py-2 text-sm text-secondary">
                  <DollarSign className="h-4 w-4" />
                  $700 Saved/Month
                </div>
                <div className="flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm text-primary">
                  <Zap className="h-4 w-4" />
                  Zero Code
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* The Data Bloat Journey Timeline */}
        <section className="px-6 py-12">
          <div className="max-w-4xl mx-auto">
            <TheDataBloatJourney />
          </div>
        </section>

        {/* Before & After */}
        <section className="px-6 py-12 border-t border-border/50 bg-muted/30">
          <div className="max-w-4xl mx-auto">
            <BeforeAfterComparison />
          </div>
        </section>

        {/* The 3 Cleanup Types */}
        <section className="px-6 py-12">
          <div className="max-w-4xl mx-auto">
            <TheThreeCleanups />
          </div>
        </section>

        {/* What You Implement */}
        <section className="px-6 py-12 border-t border-border/50 bg-muted/30">
          <div className="max-w-4xl mx-auto">
            <WhatYouImplement />
          </div>
        </section>

        {/* Footer */}
        <section className="px-6 py-8 border-t border-border/50">
          <div className="max-w-4xl mx-auto flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <Link
                to="/docs/cleanup_capabilities_story"
                className="flex items-center gap-2 text-sm text-primary hover:underline"
              >
                <BookOpen className="h-4 w-4" />
                Read V1 (Visual Version)
              </Link>
              <Link
                to="/docs/guides/cleanup_capabilities"
                className="flex items-center gap-2 text-sm text-primary hover:underline"
              >
                <FileCode className="h-4 w-4" />
                Read Full Technical Guide
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <StoryLoveButton storySlug="cleanup_capabilities_story_v2" />
              <PageViewCounter />
            </div>
          </div>
        </section>
      </div>
    </DocsLayout>
  );
};

export default CleanupCapabilitiesStoryV2;

