import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Highlight, themes } from "prism-react-renderer";
import DocsLayout from "@/components/docs/DocsLayout";
import PageViewCounter from "@/components/PageViewCounter";
import StoryLoveButton from "@/components/StoryLoveButton";
import StoryNavigation from "@/components/StoryNavigation";
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
  Timer,
  Gavel,
  Plug
} from "lucide-react";

const PAGE_TITLE = "Retention Capabilities V2: The Audit That Almost Failed - AI Fabric Framework";
const PAGE_DESCRIPTION = "A compliance officer's journey from retention violations to compliance gold—how pluggable retention policies saved the company from massive fines.";

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

const TheRetentionJourney = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const steps = [
    {
      time: "Monday 9:00 AM",
      title: "The Audit Notice",
      icon: FileCheck,
      color: "text-blue-400",
      bgColor: "bg-blue-500/5",
      borderColor: "border-blue-500/30",
      events: [
        { emoji: "📧", text: "Email: 'GDPR audit scheduled for next month'", type: "normal" },
        { emoji: "😊", text: "Compliance Officer: 'We're compliant, we got this'", type: "positive" },
        { emoji: "☕", text: "Team: 'Let's prepare the documentation'", type: "info" }
      ]
    },
    {
      time: "Monday 2:00 PM",
      title: "The Discovery",
      icon: AlertTriangle,
      color: "text-orange-400",
      bgColor: "bg-orange-500/5",
      borderColor: "border-orange-500/30",
      events: [
        { emoji: "🔍", text: "Auditor: 'Show me your data retention policies'", type: "warning" },
        { emoji: "😅", text: "Team: 'We... don't have retention policies?'", type: "warning" },
        { emoji: "📁", text: "Found: No retention enforcement, no lifecycle management", type: "error" },
        { emoji: "❌", text: "Auditor: 'This is a GDPR violation'", type: "critical" }
      ]
    },
    {
      time: "Tuesday 10:00 AM",
      title: "The Panic",
      icon: AlertTriangle,
      color: "text-red-400",
      bgColor: "bg-red-500/5",
      borderColor: "border-red-500/30",
      events: [
        { emoji: "😰", text: "CFO: 'What's the fine for GDPR violation?'", type: "critical" },
        { emoji: "💰", text: "Research: '€20M or 4% of annual revenue'", type: "critical" },
        { emoji: "💔", text: "Compliance Officer: 'We need retention policies NOW'", type: "critical" },
        { emoji: "⏰", text: "Timeline: 3 weeks to implement", type: "critical" }
      ]
    },
    {
      time: "Tuesday 2:00 PM",
      title: "The Research",
      icon: Search,
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/5",
      borderColor: "border-yellow-500/30",
      events: [
        { emoji: "🔍", text: "Developer: 'We need to build retention policies from scratch'", type: "warning" },
        { emoji: "📖", text: "Research: 'GDPR: 1 year, HIPAA: 6 years, custom rules...'", type: "warning" },
        { emoji: "💭", text: "Flashback: 'AI Fabric has retention capabilities...'", type: "positive" },
        { emoji: "💡", text: "Discovers: Pluggable retention policy system (SPI)", type: "positive" }
      ]
    },
    {
      time: "Wednesday 9:00 AM",
      title: "The Solution",
      icon: Rocket,
      color: "text-green-400",
      bgColor: "bg-green-500/5",
      borderColor: "border-green-500/30",
      events: [
        { emoji: "⚙️", text: "Implement RetentionPolicyProvider interface", type: "intervention" },
        { emoji: "✅", text: "Tests: Retention policies enforced automatically", type: "intervention" },
        { emoji: "🔒", text: "GDPR: 1 year retention for user data", type: "intervention" },
        { emoji: "📊", text: "HIPAA: 6 years retention for PHI", type: "intervention" }
      ]
    },
    {
      time: "Next Month",
      title: "The Audit",
      icon: FileCheck,
      color: "text-green-400",
      bgColor: "bg-green-500/5",
      borderColor: "border-green-500/30",
      events: [
        { emoji: "📋", text: "Auditor: 'Show me your data retention policies'", type: "positive" },
        { emoji: "✅", text: "Team: 'Here are our retention policies with automatic enforcement'", type: "positive" },
        { emoji: "📊", text: "Auditor: 'GDPR compliance looks good'", type: "positive" },
        { emoji: "🎉", text: "Result: Passed audit. €0 fine.", type: "positive" }
      ]
    },
    {
      time: "6 Months Later",
      title: "The Impact",
      icon: TrendingUp,
      color: "text-green-400",
      bgColor: "bg-green-500/5",
      borderColor: "border-green-500/30",
      events: [
        { emoji: "💰", text: "Fines avoided: €20M or 4% of revenue", type: "positive" },
        { emoji: "🔒", text: "Compliance: GDPR, HIPAA maintained", type: "positive" },
        { emoji: "⚡", text: "Implementation: Pluggable, automatic enforcement", type: "positive" },
        { emoji: "🎯", text: "Result: Data lifecycle managed automatically", type: "positive" }
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
        The Audit That Almost Failed
      </h3>
      <p className="text-sm text-muted-foreground text-center mb-8">
        A compliance officer's journey from retention violations to compliance gold
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
          <p className="text-lg font-bold text-green-400 mb-2">Retention Capabilities Enabled: Compliance Gold</p>
          <p className="text-sm text-muted-foreground">
            Pluggable retention. Automatic enforcement. Compliance-ready. Zero code in cleanup. Passed audits.
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
        Before & After: From Violations to Compliance Gold
      </h3>
      
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Before */}
        <div className="p-6 rounded-xl border-2 border-red-500/30 bg-red-500/5">
          <div className="flex items-center gap-3 mb-4">
            <XCircle className="h-6 w-6 text-red-400" />
            <h4 className="font-bold text-foreground">Before: No Retention Policies</h4>
          </div>
          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-muted/30 border border-border/30">
              <p className="text-xs font-semibold text-foreground mb-2">Problems:</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• No data lifecycle management</li>
                <li>• No retention period enforcement</li>
                <li>• No automatic cleanup</li>
                <li>• No compliance with regulations</li>
                <li>• Failed audits → Fines → Lost trust</li>
                <li>• GDPR: €20M or 4% of revenue</li>
                <li>• HIPAA: $50K-$1.5M per incident</li>
              </ul>
            </div>
            <CodeBlock code={`// No retention policies
// No data lifecycle management
// No retention period enforcement
// No automatic cleanup

// Result:
// - Failed GDPR audit
// - Fine: €20M or 4% of revenue
// - No compliance evidence
// - Lost enterprise customers`} />
          </div>
        </div>
        
        {/* After */}
        <div className="p-6 rounded-xl border-2 border-green-500/30 bg-green-500/5">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle2 className="h-6 w-6 text-green-400" />
            <h4 className="font-bold text-foreground">After: Pluggable Retention Policies</h4>
          </div>
          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-muted/30 border border-border/30">
              <p className="text-xs font-semibold text-foreground mb-2">Benefits:</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Data lifecycle managed automatically</li>
                <li>• Retention periods enforced</li>
                <li>• Automatic cleanup (scheduled)</li>
                <li>• Compliance with regulations</li>
                <li>• Passed audits → €0 fines → Trust restored</li>
                <li>• GDPR: 1 year retention (compliant)</li>
                <li>• HIPAA: 6 years retention (compliant)</li>
              </ul>
            </div>
            <CodeBlock code={`// Pluggable retention policies
@Component
public class GDPRRetentionPolicyProvider 
    implements RetentionPolicyProvider {
    
    @Override
    public int getRetentionDays(String classification, 
                                String entityType) {
        // GDPR: 1 year for user data
        if ("CONFIDENTIAL".equals(classification) && 
            "user".equals(entityType)) {
            return 365;  // 1 year
        }
        return 180;  // Default
    }
    
    @Override
    public boolean shouldDelete(AISearchableEntity entity) {
        // Check retention period
        // Check legal hold
        return true;
    }
    
    @Override
    public boolean executeDelete(AISearchableEntity entity) {
        // Archive to cold storage
        // Notify user
        // Log for audit
        return true;
    }
}

// Result:
// - Passed GDPR audit
// - Fine: €0
// - Compliance evidence
// - Enterprise customers retained`} />
          </div>
        </div>
      </div>
      
      <div className="mt-6 p-4 rounded-lg bg-primary/10 border border-primary/20 text-center">
        <p className="text-sm font-bold text-primary">
          Result: Failed audit → Passed audit. €20M fine → €0 fine. No compliance → Compliance gold.
        </p>
      </div>
    </div>
  );
};

const TheThreeMethods = () => {
  const [activeMethod, setActiveMethod] = useState(0);
  
  const methods = [
    {
      name: "getRetentionDays()",
      icon: Timer,
      color: "text-blue-400",
      borderColor: "border-blue-500/30",
      bgColor: "bg-blue-500/5",
      description: "Determine retention period based on classification and entity type",
      code: `@Override
public int getRetentionDays(String classification, 
                            String entityType) {
    // GDPR: 1 year for user data
    if ("CONFIDENTIAL".equals(classification) && 
        "user".equals(entityType)) {
        return 365;  // 1 year
    }
    
    // HIPAA: 6 years for PHI
    if ("PHI".equals(classification)) {
        return 2190;  // 6 years
    }
    
    // Default: 90 days
    return 90;
}

// Return values:
// > 0: Retain for N days
// 0: Delete immediately
// -1: Never delete`,
      impact: "Defines how long data should be retained"
    },
    {
      name: "shouldDelete()",
      icon: Gavel,
      color: "text-purple-400",
      borderColor: "border-purple-500/30",
      bgColor: "bg-purple-500/5",
      description: "Determine if entity should be deleted based on custom logic",
      code: `@Override
public boolean shouldDelete(AISearchableEntity entity) {
    int retentionDays = getRetentionDays(
        extractClassification(entity), 
        entity.getEntityType()
    );
    
    // Never delete if retention is -1
    if (retentionDays == -1) {
        return false;
    }
    
    // Check if entity is older than retention period
    LocalDateTime cutoff = 
        LocalDateTime.now().minusDays(retentionDays);
    boolean olderThanRetention = 
        entity.getCreatedAt().isBefore(cutoff);
    
    // Additional custom logic
    if (olderThanRetention) {
        // Check if entity is under legal hold
        if (isUnderLegalHold(entity)) {
            return false;  // Don't delete
        }
        
        // Check if entity is part of active investigation
        if (isPartOfInvestigation(entity)) {
            return false;  // Don't delete
        }
    }
    
    return olderThanRetention;
}

// Returns:
// true: Entity should be deleted
// false: Entity should not be deleted`,
      impact: "Custom deletion logic with legal hold and investigation support"
    },
    {
      name: "executeDelete()",
      icon: Code,
      color: "text-green-400",
      borderColor: "border-green-500/30",
      bgColor: "bg-green-500/5",
      description: "Execute custom cleanup logic before deletion",
      code: `@Override
public boolean executeDelete(AISearchableEntity entity) {
    try {
        // Archive to cold storage before deletion
        archiveToColdStorage(entity);
        
        // Notify stakeholders
        notifyStakeholders(entity, 
            "Entity scheduled for deletion");
        
        // Log deletion event
        logDeletionEvent(entity);
        
        // Return true to allow deletion
        return true;
    } catch (Exception ex) {
        log.error("Failed to execute custom cleanup", ex);
        // Return false to prevent deletion if cleanup fails
        return false;
    }
}

// Returns:
// true: Deletion may proceed
// false: Deletion blocked (cleanup failed)`,
      impact: "Custom cleanup logic before deletion (archive, notify, log)"
    }
  ];

  return (
    <div className="my-16">
      <h3 className="text-2xl font-bold text-foreground mb-8 text-center">
        The 3 Methods: Your Retention Rules
      </h3>
      <p className="text-sm text-muted-foreground text-center mb-8">
        Three methods. Your rules. Automatic enforcement.
      </p>
      
      <div className="grid grid-cols-3 gap-2 mb-6">
        {methods.map((method, i) => {
          const Icon = method.icon;
          return (
            <button
              key={i}
              onClick={() => setActiveMethod(i)}
              className={`p-3 rounded-lg border-2 transition-all ${
                activeMethod === i
                  ? `${method.borderColor} ${method.bgColor} shadow-lg`
                  : "border-border/30 bg-muted/30 hover:border-border"
              }`}
            >
              <Icon className={`h-5 w-5 mx-auto mb-1 ${activeMethod === i ? method.color : 'text-muted-foreground'}`} />
              <p className={`text-xs font-semibold text-center ${activeMethod === i ? 'text-foreground' : 'text-muted-foreground'}`}>
                {i + 1}
              </p>
            </button>
          );
        })}
      </div>
      
      <AnimatePresence mode="wait">
        <motion.div
          key={activeMethod}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`p-6 rounded-xl border ${methods[activeMethod].borderColor} ${methods[activeMethod].bgColor}`}
        >
          <div className="flex items-center gap-3 mb-4">
            {React.createElement(methods[activeMethod].icon, {
              className: `h-6 w-6 ${methods[activeMethod].color}`
            })}
            <div>
              <h4 className="font-bold text-foreground">
                {methods[activeMethod].name}
              </h4>
              <p className="text-xs text-muted-foreground">{methods[activeMethod].description}</p>
            </div>
          </div>
          <CodeBlock code={methods[activeMethod].code} />
          <div className="mt-4 p-3 rounded-lg bg-muted/30 border border-border/30">
            <p className="text-xs font-semibold text-foreground mb-1">Impact:</p>
            <p className="text-sm text-muted-foreground">{methods[activeMethod].impact}</p>
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
            <Plug className="h-6 w-6 text-primary" />
            <h4 className="font-bold text-foreground">1. Implement Interface</h4>
          </div>
          <CodeBlock code={`// Just implement RetentionPolicyProvider
@Component
public class MyRetentionPolicyProvider 
    implements RetentionPolicyProvider {
    
    @Override
    public int getRetentionDays(String classification, 
                                String entityType) {
        // Your retention rules
        return 365;  // Example: 1 year
    }
    
    @Override
    public boolean shouldDelete(AISearchableEntity entity) {
        // Your deletion logic
        return true;
    }
    
    @Override
    public boolean executeDelete(AISearchableEntity entity) {
        // Your cleanup logic
        return true;
    }
}

// That's it! Framework enforces automatically.`} />
        </div>
        
        <div className="p-6 rounded-xl border border-secondary/30 bg-secondary/5">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle2 className="h-6 w-6 text-secondary" />
            <h4 className="font-bold text-foreground">2. Done (Zero Code in Cleanup)</h4>
          </div>
          <CodeBlock code={`// Framework handles everything:
// - Scheduled cleanup (cron-based)
// - Automatic retention enforcement
// - Calls your methods automatically
// - Applies cleanup strategies

// No code required in cleanup
// No manual intervention
// No monitoring needed

// Result:
// - Retention policies enforced
// - Data lifecycle managed
// - Compliance maintained
// - Automatic cleanup`} />
        </div>
      </div>
      
      <div className="mt-6 p-6 rounded-xl bg-gradient-primary text-center">
        <p className="text-primary-foreground font-semibold text-lg">
          That's it. One interface. Three methods. Your rules. Automatic enforcement. Compliance-ready.
        </p>
      </div>
    </div>
  );
};

const RetentionCapabilitiesStoryV2 = () => {
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
                  <span className="text-2xl">⏰</span>
                  Retention Capabilities V2 (Narrative)
                </span>
                <Link 
                  to="/docs/retention_capabilities_story"
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  View V1 →
                </Link>
              </div>
              <div className="flex items-center gap-3">
                <StoryLoveButton storySlug="retention_capabilities_story_v2" />
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
                <span className="text-gradient">Audit That Almost Failed</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mb-8">
                A compliance officer's journey from retention violations to compliance gold—how pluggable retention 
                policies saved the company from massive fines.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2 text-sm text-accent">
                  <Gavel className="h-4 w-4" />
                  €20M+ Fines Avoided
                </div>
                <div className="flex items-center gap-2 rounded-full bg-secondary/10 px-4 py-2 text-sm text-secondary">
                  <Shield className="h-4 w-4" />
                  Passed Audits
                </div>
                <div className="flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm text-primary">
                  <Zap className="h-4 w-4" />
                  Zero Code in Cleanup
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* The Retention Journey Timeline */}
        <section className="px-6 py-12">
          <div className="max-w-4xl mx-auto">
            <TheRetentionJourney />
          </div>
        </section>

        {/* Before & After */}
        <section className="px-6 py-12 border-t border-border/50 bg-muted/30">
          <div className="max-w-4xl mx-auto">
            <BeforeAfterComparison />
          </div>
        </section>

        {/* The 3 Methods */}
        <section className="px-6 py-12">
          <div className="max-w-4xl mx-auto">
            <TheThreeMethods />
          </div>
        </section>

        {/* What You Implement */}
        <section className="px-6 py-12 border-t border-border/50 bg-muted/30">
          <div className="max-w-4xl mx-auto">
            <WhatYouImplement />
          </div>
        </section>

        {/* Story Navigation */}


        <StoryNavigation className="mt-12" />



        {/* Footer */}
        <section className="px-6 py-8 border-t border-border/50">
          <div className="max-w-4xl mx-auto flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <Link
                to="/docs/retention_capabilities_story"
                className="flex items-center gap-2 text-sm text-primary hover:underline"
              >
                <BookOpen className="h-4 w-4" />
                Read V1 (Visual Version)
              </Link>
              <Link
                to="/docs/guides/retention_capabilities"
                className="flex items-center gap-2 text-sm text-primary hover:underline"
              >
                <FileCode className="h-4 w-4" />
                Read Full Technical Guide
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <StoryLoveButton storySlug="retention_capabilities_story_v2" />
              <PageViewCounter />
            </div>
          </div>
        </section>
      </div>
    </DocsLayout>
  );
};

export default RetentionCapabilitiesStoryV2;

