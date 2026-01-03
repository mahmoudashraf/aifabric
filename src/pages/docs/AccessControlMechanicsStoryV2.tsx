import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Highlight, themes } from "prism-react-renderer";
import DocsLayout from "@/components/docs/DocsLayout";
import PageViewCounter from "@/components/PageViewCounter";
import StoryLoveButton from "@/components/StoryLoveButton";
import { 
  Shield,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Lock,
  Eye,
  Brain,
  Zap,
  Users,
  Database,
  FileCode,
  Code,
  Key,
  Search,
  MessageSquare,
  Settings,
  BookOpen,
  ArrowRight,
  Ban,
  Clock,
  DollarSign,
  Play,
  Pause,
  RotateCcw,
  Layers,
  Filter,
  Gavel,
  Target,
  Activity,
  TrendingUp,
  Lightbulb,
  Rocket,
  Cpu,
  FileCheck,
  Plug,
  Heart
} from "lucide-react";

const PAGE_TITLE = "Access Control Mechanics V2: The Security Audit That Saved Everything - AI Fabric Framework";
const PAGE_DESCRIPTION = "A CISO's journey from single-point-of-failure security to defense-in-depth—how four layers of access control prevented a data breach.";
const OG_IMAGE = "/assets/story-preview.png";

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

const TheSecurityAudit = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const steps = [
    {
      time: "Monday 9:00 AM",
      title: "The Audit Request",
      icon: FileCheck,
      color: "text-blue-400",
      bgColor: "bg-blue-500/5",
      borderColor: "border-blue-500/30",
      events: [
        { emoji: "📧", text: "CISO: 'We need a security audit for SOC 2 compliance'", type: "normal" },
        { emoji: "📅", text: "Audit scheduled for next week", type: "normal" },
        { emoji: "😊", text: "Developer: 'No problem, we have access control'", type: "positive" }
      ]
    },
    {
      time: "Monday 2:00 PM",
      title: "The Discovery",
      icon: Eye,
      color: "text-orange-400",
      bgColor: "bg-orange-500/5",
      borderColor: "border-orange-500/30",
      events: [
        { emoji: "🔍", text: "Auditor: 'Show me your access control implementation'", type: "warning" },
        { emoji: "💻", text: "Developer: 'Here's our controller with @PreAuthorize'", type: "warning" },
        { emoji: "❌", text: "Auditor: 'What if someone bypasses this check?'", type: "error" },
        { emoji: "😰", text: "Developer: 'Umm... they'd have full access'", type: "critical" }
      ]
    },
    {
      time: "Monday 4:00 PM",
      title: "The Red Flags",
      icon: AlertTriangle,
      color: "text-red-400",
      bgColor: "bg-red-500/5",
      borderColor: "border-red-500/30",
      events: [
        { emoji: "🚩", text: "Single point of failure identified", type: "critical" },
        { emoji: "🚩", text: "No defense in depth", type: "critical" },
        { emoji: "🚩", text: "No audit trail for access decisions", type: "critical" },
        { emoji: "🚩", text: "No row-level security", type: "critical" },
        { emoji: "📋", text: "Auditor: 'This will fail SOC 2'", type: "critical" }
      ]
    },
    {
      time: "Tuesday 10:00 AM",
      title: "The Panic",
      icon: AlertTriangle,
      color: "text-red-600",
      bgColor: "bg-red-600/5",
      borderColor: "border-red-600/50",
      events: [
        { emoji: "😱", text: "CISO: 'We need this fixed by Friday'", type: "critical" },
        { emoji: "⏰", text: "3 days to implement proper access control", type: "critical" },
        { emoji: "💸", text: "SOC 2 failure = $2M in lost deals", type: "critical" },
        { emoji: "😤", text: "Developer: 'How do we do this in 3 days?'", type: "critical" }
      ]
    },
    {
      time: "Tuesday 2:00 PM",
      title: "The Solution",
      icon: Lightbulb,
      color: "text-purple-400",
      bgColor: "bg-purple-500/5",
      borderColor: "border-purple-500/30",
      events: [
        { emoji: "💡", text: "Discovers: AI Fabric Access Control Mechanics", type: "positive" },
        { emoji: "✨", text: "Four layers of defense built-in", type: "positive" },
        { emoji: "🛡️", text: "Fail-closed security by default", type: "positive" },
        { emoji: "📊", text: "Complete audit trail included", type: "positive" }
      ]
    },
    {
      time: "Wednesday 5:00 PM",
      title: "The Implementation",
      icon: Code,
      color: "text-green-400",
      bgColor: "bg-green-500/5",
      borderColor: "border-green-500/30",
      events: [
        { emoji: "⚡", text: "Implemented EntityAccessPolicy in 2 hours", type: "intervention" },
        { emoji: "✅", text: "Four layers automatically enforced", type: "intervention" },
        { emoji: "📝", text: "Audit logging working out of the box", type: "intervention" },
        { emoji: "🎉", text: "Ready for audit", type: "intervention" }
      ]
    },
    {
      time: "Friday 3:00 PM",
      title: "The Audit Pass",
      icon: CheckCircle2,
      color: "text-lime-400",
      bgColor: "bg-lime-500/5",
      borderColor: "border-lime-500/30",
      events: [
        { emoji: "✅", text: "Auditor: 'Defense in depth: Excellent'", type: "positive" },
        { emoji: "✅", text: "Auditor: 'Fail-closed security: Perfect'", type: "positive" },
        { emoji: "✅", text: "Auditor: 'Audit trail: Comprehensive'", type: "positive" },
        { emoji: "🎊", text: "SOC 2 compliance: PASSED", type: "positive" }
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
    switch(type) {
      case "critical": return "text-red-400 font-semibold";
      case "error": return "text-red-400";
      case "warning": return "text-amber-400";
      case "positive": return "text-green-400";
      case "intervention": return "text-blue-400";
      default: return "text-muted-foreground";
    }
  };

  return (
    <div className="my-12 p-8 rounded-2xl bg-gradient-to-br from-blue-500/5 to-purple-500/5 border border-border/50">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
            <FileCheck className="h-5 w-5 text-primary" />
            The Security Audit That Saved Everything
          </h3>
          <p className="text-sm text-muted-foreground mt-1">Watch how one audit led to a complete security transformation</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            disabled={activeStep >= steps.length - 1}
            className="p-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </button>
          <button
            onClick={() => { setActiveStep(0); setIsPlaying(false); }}
            className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      {/* Timeline Navigation */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {steps.map((step, i) => (
          <button
            key={i}
            onClick={() => { setActiveStep(i); setIsPlaying(false); }}
            className={`flex-shrink-0 px-4 py-2 rounded-lg font-semibold transition-all ${
              activeStep === i
                ? `${step.bgColor} ${step.borderColor} border-2 shadow-lg`
                : "bg-muted/30 border border-border/50 text-muted-foreground hover:border-border"
            }`}
          >
            <div className="flex items-center gap-2">
              {React.createElement(step.icon, {
                className: `h-4 w-4 ${activeStep === i ? step.color : 'text-muted-foreground'}`
              })}
              <span className={`text-xs ${activeStep === i ? 'text-foreground' : ''}`}>{step.time.split(' ')[1]}</span>
            </div>
          </button>
        ))}
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
              <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-muted/30">
                <span className="text-2xl">{event.emoji}</span>
                <span className={`text-sm flex-1 ${getEventColor(event.type)}`}>{event.text}</span>
              </div>
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
          <CheckCircle2 className="h-8 w-8 text-green-400 mx-auto mb-3" />
          <p className="text-lg font-bold text-green-400 mb-2">Security Transformation Complete</p>
          <p className="text-sm text-muted-foreground">
            From single-point-of-failure to defense-in-depth. SOC 2 compliance achieved. $2M in deals saved.
          </p>
        </motion.div>
      )}
    </div>
  );
};

const BeforeAfterComparison = () => {
  const [activeTab, setActiveTab] = useState<"before" | "after">("before");
  
  return (
    <div className="my-12">
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab("before")}
          className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all ${
            activeTab === "before"
              ? "bg-red-500/20 border-2 border-red-500/50 text-red-400"
              : "bg-muted/30 border border-border/50 text-muted-foreground hover:border-border"
          }`}
        >
          <XCircle className="h-4 w-4 inline mr-2" />
          Before: Single Point of Failure
        </button>
        <button
          onClick={() => setActiveTab("after")}
          className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all ${
            activeTab === "after"
              ? "bg-green-500/20 border-2 border-green-500/50 text-green-400"
              : "bg-muted/30 border border-border/50 text-muted-foreground hover:border-border"
          }`}
        >
          <CheckCircle2 className="h-4 w-4 inline mr-2" />
          After: Defense in Depth
        </button>
      </div>
      
      <AnimatePresence mode="wait">
        {activeTab === "before" ? (
          <motion.div
            key="before"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="p-6 rounded-xl border-2 border-red-500/50 bg-red-500/5"
          >
            <h4 className="font-bold text-foreground mb-4 flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-400" />
              The Old Way: One Check, One Failure Point
            </h4>
            <div className="space-y-4">
              <CodeBlock code={`@PostMapping("/api/query")
@PreAuthorize("hasPermission('query')")
public Result query(@RequestBody String query) {
    // Single access check at entry point
    // If this fails, user gets full access
    // No additional layers of protection
    
    return service.execute(query);
}

Problems:
❌ Single point of failure
❌ If check is bypassed, entire system compromised
❌ No defense in depth
❌ No audit trail
❌ No row-level security`} />
              <div className="grid grid-cols-3 gap-3 mt-4">
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-center">
                  <div className="text-red-400 font-bold text-lg">1 Layer</div>
                  <div className="text-xs text-muted-foreground">Single check</div>
                </div>
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-center">
                  <div className="text-red-400 font-bold text-lg">❌ SOC 2</div>
                  <div className="text-xs text-muted-foreground">Will fail</div>
                </div>
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-center">
                  <div className="text-red-400 font-bold text-lg">High Risk</div>
                  <div className="text-xs text-muted-foreground">Data breach risk</div>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="after"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="p-6 rounded-xl border-2 border-green-500/50 bg-green-500/5"
          >
            <h4 className="font-bold text-foreground mb-4 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-400" />
              The New Way: Four Layers of Defense
            </h4>
            <div className="space-y-4">
              <CodeBlock code={`// Layer 1: Orchestrator Level
RAGOrchestrator.orchestrate()
  └─→ EntityAccessPolicy.canUserAccessEntity()
      └─→ YOUR CODE: "Can user use RAG?"

// Layer 2: Action Handler Level
ActionHandler.validateActionAllowed(userId)
  └─→ YOUR CODE: "Can user execute this action?"

// Layer 3: Entity Type Level
filterAllowedEntityTypes(userId, requestedTypes)
  └─→ YOUR CODE: "Which entity types can user query?"

// Layer 4: Result Level
For each result: EntityAccessPolicy.canUserAccessEntity()
  └─→ YOUR CODE: "Can user access this specific entity?"

Benefits:
✅ Defense in depth (4 layers)
✅ Fail-closed security
✅ Complete audit trail
✅ Row-level security
✅ SOC 2 compliant`} />
              <div className="grid grid-cols-3 gap-3 mt-4">
                <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/30 text-center">
                  <div className="text-green-400 font-bold text-lg">4 Layers</div>
                  <div className="text-xs text-muted-foreground">Defense in depth</div>
                </div>
                <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/30 text-center">
                  <div className="text-green-400 font-bold text-lg">✅ SOC 2</div>
                  <div className="text-xs text-muted-foreground">Compliant</div>
                </div>
                <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/30 text-center">
                  <div className="text-green-400 font-bold text-lg">Low Risk</div>
                  <div className="text-xs text-muted-foreground">Secure by default</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const TheFourLayers = () => {
  const layers = [
    {
      layer: 1,
      title: "Orchestrator Level",
      icon: Shield,
      color: "bg-blue-500",
      story: "The Gatekeeper",
      description: "First line of defense - blocks unauthorized users before any processing begins",
      code: `RAGOrchestrator.orchestrate()
  └─→ AIAccessControlService.checkAccess()
      └─→ EntityAccessPolicy.canUserAccessEntity()
          └─→ YOUR CODE: "Can user use RAG orchestrator?"
          
Result: ✅ GRANTED or ❌ DENIED (fail-closed)`
    },
    {
      layer: 2,
      title: "Action Handler Level",
      icon: Target,
      color: "bg-purple-500",
      story: "The Validator",
      description: "Action-specific check - validates user can execute this specific action",
      code: `ActionHandler.validateActionAllowed(userId)
  └─→ YOUR CODE: "Can user execute relationship_query?"
  
ActionHandler.executeAction()
  └─→ Additional filtering (e.g., entity types)
  
Result: ✅ Action allowed or ❌ Action denied`
    },
    {
      layer: 3,
      title: "Entity Type Level",
      icon: Filter,
      color: "bg-orange-500",
      story: "The Filter",
      description: "Filters entity types before query planning - saves LLM tokens and prevents unauthorized schema exposure",
      code: `filterAllowedEntityTypes(userId, requestedTypes)
  └─→ For each entityType:
      - Check role-based access
      - Check permission-based access
      - Check tenant-based access
      - Check data classification
      
Filtered: [customer, order] (product denied)
Only allowed schemas sent to LLM`
    },
    {
      layer: 4,
      title: "Result Level",
      icon: Eye,
      color: "bg-green-500",
      story: "The Guardian",
      description: "Final defense-in-depth check on individual results - row-level security",
      code: `After query execution:
  └─→ For each result document:
      EntityAccessPolicy.canUserAccessEntity(userId, doc)
      └─→ YOUR CODE: "Can user access this specific entity?"
      
Result: Only accessible entities returned
Final safety net for row-level security`
    }
  ];

  const [selectedLayer, setSelectedLayer] = useState(0);

  return (
    <div className="my-16">
      <h3 className="text-2xl font-bold text-foreground mb-8 text-center">
        The Four Layers: Your Security Team
      </h3>
      <p className="text-sm text-muted-foreground text-center mb-6">
        Each layer plays a specific role in protecting your data
      </p>
      
      <div className="grid grid-cols-4 gap-3 mb-6">
        {layers.map((layer, i) => {
          const Icon = layer.icon;
          return (
            <button
              key={i}
              onClick={() => setSelectedLayer(i)}
              className={`p-4 rounded-xl border-2 transition-all ${
                selectedLayer === i
                  ? `${layer.color.replace('bg-', 'border-')} bg-${layer.color.split('-')[1]}-500/10 shadow-lg`
                  : "border-border/30 bg-muted/30 hover:border-border"
              }`}
            >
              <div className="text-center">
                <Icon className={`h-6 w-6 mx-auto mb-2 ${selectedLayer === i ? layer.color.replace('bg-', 'text-') : 'text-muted-foreground'}`} />
                <div className={`text-xs font-semibold mb-1 ${selectedLayer === i ? 'text-foreground' : 'text-muted-foreground'}`}>
                  LAYER {layer.layer}
                </div>
                <div className={`text-sm font-bold ${selectedLayer === i ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {layer.story}
                </div>
              </div>
            </button>
          );
        })}
      </div>
      
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedLayer}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`p-6 rounded-xl border-2 border-${layers[selectedLayer].color.split('-')[1]}-500/30 bg-${layers[selectedLayer].color.split('-')[1]}-500/5`}
        >
          <div className="flex items-center gap-3 mb-4">
            {React.createElement(layers[selectedLayer].icon, {
              className: `h-6 w-6 ${layers[selectedLayer].color.replace('bg-', 'text-')}`
            })}
            <div>
              <h4 className="font-bold text-foreground">LAYER {layers[selectedLayer].layer}: {layers[selectedLayer].title}</h4>
              <p className="text-sm text-muted-foreground">{layers[selectedLayer].story}</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-4">{layers[selectedLayer].description}</p>
          <CodeBlock code={layers[selectedLayer].code} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const WhatYouImplement = () => {
  return (
    <div className="my-16">
      <h3 className="text-2xl font-bold text-foreground mb-8 text-center">
        What You Actually Implement
      </h3>
      
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-xl border border-primary/30 bg-primary/5">
          <div className="flex items-center gap-3 mb-4">
            <Code className="h-6 w-6 text-primary" />
            <h4 className="font-bold text-foreground">1. Implement EntityAccessPolicy</h4>
          </div>
          <CodeBlock code={`@Component
public class MyEntityAccessPolicy implements EntityAccessPolicy {
    
    @Autowired
    private PermissionService permissionService;
    
    @Override
    public boolean canUserAccessEntity(String userId, Map<String, Object> entity) {
        String resourceId = (String) entity.get("resourceId");
        String operationType = (String) entity.get("operationType");
        
        // YOUR business logic
        if ("rag:intent".equals(resourceId)) {
            return permissionService.hasPermission(userId, "rag:query");
        }
        
        // Handle other resources...
        return false;  // Default: deny (fail-closed)
    }
    
    @Override
    public void logAccessDenied(String userId, Map<String, Object> entity, String reason) {
        // YOUR audit logging
        auditService.logDenial(userId, entity, reason);
    }
}`} />
        </div>
        
        <div className="p-6 rounded-xl border border-secondary/30 bg-secondary/5">
          <div className="flex items-center gap-3 mb-4">
            <Settings className="h-6 w-6 text-secondary" />
            <h4 className="font-bold text-foreground">2. Framework Enforces Everywhere</h4>
          </div>
          <CodeBlock code={`// Framework automatically:
// ✅ Calls your policy at Layer 1 (Orchestrator)
// ✅ Calls your policy at Layer 4 (Results)
// ✅ Enforces fail-closed security
// ✅ Logs all access decisions
// ✅ Provides complete audit trail
// ✅ Handles exceptions (fail-closed)

// You just implement the interface.
// Framework handles the rest.

// No configuration needed!
// No circular dependencies!
// No boilerplate code!`} />
        </div>
      </div>
      
      <div className="mt-6 p-6 rounded-xl bg-gradient-primary text-center">
        <p className="text-primary-foreground font-semibold text-lg">
          One interface. Four layers of enforcement. Complete security.
        </p>
      </div>
    </div>
  );
};

const AccessControlMechanicsStoryV2 = () => {
  useEffect(() => {
    document.title = PAGE_TITLE;

    const absoluteOgImage = `${window.location.origin}${OG_IMAGE}`;

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
    updateMeta('meta[property="og:image"]', "content", absoluteOgImage);
    updateMeta('meta[property="og:type"]', "content", "article");
    updateMeta('meta[property="og:url"]', "content", window.location.href);

    updateMeta('meta[name="twitter:title"]', "content", PAGE_TITLE);
    updateMeta('meta[name="twitter:description"]', "content", PAGE_DESCRIPTION);
    updateMeta('meta[name="twitter:image"]', "content", absoluteOgImage);
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
                  <span className="text-2xl">🛡️</span>
                  Access Control Mechanics V2 (Narrative)
                </span>
                <Link
                  to="/docs/access_control_mechanics_story"
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  View V1 →
                </Link>
              </div>
              <div className="flex items-center gap-3">
                <StoryLoveButton storySlug="access_control_mechanics_story_v2" />
                <PageViewCounter />
              </div>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl"
            >
              <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
                The Security Audit That{" "}
                <span className="text-gradient">Saved Everything</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mb-8">
                A CISO's journey from single-point-of-failure security to defense-in-depth—how four layers of access control prevented a data breach and saved $2M in deals.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2 text-sm text-accent">
                  <Shield className="h-4 w-4" />
                  4 Layers of Defense
                </div>
                <div className="flex items-center gap-2 rounded-full bg-secondary/10 px-4 py-2 text-sm text-secondary">
                  <CheckCircle2 className="h-4 w-4" />
                  SOC 2 Compliant
                </div>
                <div className="flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm text-primary">
                  <Ban className="h-4 w-4" />
                  Fail-Closed Security
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* The Security Audit */}
        <section className="px-6 py-12">
          <div className="max-w-4xl mx-auto">
            <TheSecurityAudit />
          </div>
        </section>

        {/* Before & After */}
        <section className="px-6 py-12 border-t border-border/50 bg-muted/30">
          <div className="max-w-4xl mx-auto">
            <BeforeAfterComparison />
          </div>
        </section>

        {/* The Four Layers */}
        <section className="px-6 py-12">
          <div className="max-w-4xl mx-auto">
            <TheFourLayers />
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
                to="/docs/access_control_mechanics_story"
                className="flex items-center gap-2 text-sm text-primary hover:underline"
              >
                <BookOpen className="h-4 w-4" />
                Read V1 (Visual Version)
              </Link>
              <Link
                to="/docs/guides/access_control_mechanics"
                className="flex items-center gap-2 text-sm text-primary hover:underline"
              >
                <FileCode className="h-4 w-4" />
                Read Full Technical Guide
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <StoryLoveButton storySlug="access_control_mechanics_story_v2" />
              <PageViewCounter />
            </div>
          </div>
        </section>
      </div>
    </DocsLayout>
  );
};

export default AccessControlMechanicsStoryV2;

