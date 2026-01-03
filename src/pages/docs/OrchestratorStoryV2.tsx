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
  Play,
  Pause,
  RotateCcw,
  ArrowRight,
  Clock,
  DollarSign,
  Target,
  Activity,
  Sparkles,
  Heart,
  TrendingUp,
  TrendingDown,
  Ban,
  Key,
  Search,
  MessageSquare
} from "lucide-react";

const PAGE_TITLE = "Orchestrator V2: The 3 AM Call That Changed Everything - AI Fabric Framework";
const PAGE_DESCRIPTION = "A developer's journey from security nightmare to peaceful sleep—how the Orchestrator prevented disaster.";
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

const TheThreeAMCall = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const steps = [
    {
      time: "3:00 AM",
      title: "The Phone Rings",
      icon: AlertTriangle,
      color: "text-red-400",
      bgColor: "bg-red-500/5",
      borderColor: "border-red-500/30",
      events: [
        { emoji: "📱", text: "Phone buzzes: 'URGENT: Security Alert'", type: "critical" },
        { emoji: "😱", text: "CEO: 'Did we just leak customer data?'", type: "critical" },
        { emoji: "💔", text: "Heart rate: 120 bpm", type: "critical" }
      ]
    },
    {
      time: "3:05 AM",
      title: "The Discovery",
      icon: Eye,
      color: "text-orange-400",
      bgColor: "bg-orange-500/5",
      borderColor: "border-orange-500/30",
      events: [
        { emoji: "🔍", text: "Check logs: User query contained credit card", type: "warning" },
        { emoji: "❌", text: "No PII detection in place", type: "error" },
        { emoji: "📤", text: "Full credit card sent to OpenAI API", type: "critical" },
        { emoji: "📋", text: "Stored in OpenAI logs (permanent)", type: "critical" }
      ]
    },
    {
      time: "3:15 AM",
      title: "The Panic",
      icon: AlertTriangle,
      color: "text-red-600",
      bgColor: "bg-red-600/5",
      borderColor: "border-red-600/50",
      events: [
        { emoji: "⚖️", text: "PCI-DSS violation detected", type: "critical" },
        { emoji: "💰", text: "Potential fine: $500K+", type: "critical" },
        { emoji: "📧", text: "Legal team notified", type: "critical" },
        { emoji: "😰", text: "Career flash before eyes", type: "critical" }
      ]
    },
    {
      time: "3:30 AM",
      title: "The Realization",
      icon: Brain,
      color: "text-blue-400",
      bgColor: "bg-blue-500/5",
      borderColor: "border-blue-500/30",
      events: [
        { emoji: "💡", text: "Remember: AI Fabric has Orchestrator", type: "positive" },
        { emoji: "🔒", text: "PII Detection built-in", type: "positive" },
        { emoji: "✅", text: "Auto-redaction before LLM", type: "positive" },
        { emoji: "🛡️", text: "This could have been prevented", type: "positive" }
      ]
    },
    {
      time: "4:00 AM",
      title: "The Fix",
      icon: Shield,
      color: "text-green-400",
      bgColor: "bg-green-500/5",
      borderColor: "border-green-500/30",
      events: [
        { emoji: "⚡", text: "Enable Orchestrator module", type: "intervention" },
        { emoji: "🔧", text: "15 minutes to configure", type: "intervention" },
        { emoji: "✅", text: "PII detection active", type: "intervention" },
        { emoji: "😴", text: "Can finally sleep (sort of)", type: "intervention" }
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
    <div className="my-12 p-8 rounded-2xl bg-gradient-to-br from-red-500/5 to-blue-500/5 border border-border/50">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-400" />
            The 3 AM Call That Changed Everything
          </h3>
          <p className="text-sm text-muted-foreground mt-1">Watch how one security incident led to a complete transformation</p>
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
              <span className={`text-sm ${activeStep === i ? 'text-foreground' : ''}`}>{step.time}</span>
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
          <Shield className="h-8 w-8 text-green-400 mx-auto mb-3" />
          <p className="text-lg font-bold text-green-400 mb-2">Orchestrator Enabled: Future Protected</p>
          <p className="text-sm text-muted-foreground">
            PII detection now active. Credit cards, SSNs, and sensitive data automatically redacted before reaching LLMs.
          </p>
        </motion.div>
      )}
    </div>
  );
};

const TheSevenGates = () => {
  const [activeGate, setActiveGate] = useState(0);
  
  const gates = [
    {
      number: 1,
      name: "Identity Check",
      icon: Users,
      color: "text-blue-400",
      borderColor: "border-blue-500/30",
      bgColor: "bg-blue-500/5",
      question: "Who is making this request?",
      checks: [
        "Authenticated user? (userId)",
        "Anonymous user? (sessionId)",
        "Both present? (preferred)"
      ],
      action: "Allows request to proceed if identity exists"
    },
    {
      number: 2,
      name: "Security Analysis",
      icon: Shield,
      color: "text-red-400",
      borderColor: "border-red-500/30",
      bgColor: "bg-red-500/5",
      question: "Is this request safe?",
      checks: [
        "Content threats? (injection, manipulation)",
        "Rate limit exceeded?",
        "Suspicious patterns?",
        "Abuse detection"
      ],
      action: "Blocks malicious or abusive requests"
    },
    {
      number: 3,
      name: "Access Control",
      icon: Lock,
      color: "text-purple-400",
      borderColor: "border-purple-500/30",
      bgColor: "bg-purple-500/5",
      question: "Is this user allowed?",
      checks: [
        "Role-based permissions",
        "Feature flags",
        "Subscription tier",
        "Custom business rules"
      ],
      action: "Enforces authorization policies"
    },
    {
      number: 4,
      name: "PII Detection",
      icon: Eye,
      color: "text-orange-400",
      borderColor: "border-orange-500/30",
      bgColor: "bg-orange-500/5",
      question: "Does this contain sensitive data?",
      checks: [
        "Credit card numbers",
        "Social Security Numbers",
        "Email addresses",
        "Phone numbers",
        "Custom PII patterns"
      ],
      action: "Auto-redacts before sending to LLM"
    },
    {
      number: 5,
      name: "Compliance Gate",
      icon: CheckCircle2,
      color: "text-green-400",
      borderColor: "border-green-500/30",
      bgColor: "bg-green-500/5",
      question: "Does this meet regulations?",
      checks: [
        "HIPAA compliance",
        "GDPR compliance",
        "PCI-DSS compliance",
        "Custom compliance rules"
      ],
      action: "Blocks non-compliant requests"
    },
    {
      number: 6,
      name: "Intent Extraction",
      icon: Brain,
      color: "text-amber-400",
      borderColor: "border-amber-500/30",
      bgColor: "bg-amber-500/5",
      question: "What does the user want?",
      checks: [
        "ACTION (do something)",
        "INFORMATION (find something)",
        "OUT_OF_SCOPE (unsupported)",
        "COMPOUND (multiple intents)"
      ],
      action: "Routes to appropriate handler"
    },
    {
      number: 7,
      name: "Handler Routing",
      icon: Zap,
      color: "text-cyan-400",
      borderColor: "border-cyan-500/30",
      bgColor: "bg-cyan-500/5",
      question: "Where should this go?",
      checks: [
        "RAG handler (search)",
        "Action handler (execute)",
        "Fallback handler (default)",
        "Custom handlers"
      ],
      action: "Routes to correct processing path"
    }
  ];

  return (
    <div className="my-16">
      <h3 className="text-2xl font-bold text-foreground mb-8 text-center">
        The 7 Gates: Defense in Depth
      </h3>
      <p className="text-sm text-muted-foreground text-center mb-8">
        Every request passes through 7 security gates. If ANY gate fails, the request is blocked.
      </p>
      
      {/* Gate Navigation */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 justify-center">
        {gates.map((gate, i) => (
          <button
            key={i}
            onClick={() => setActiveGate(i)}
            className={`flex-shrink-0 px-3 py-2 rounded-lg font-semibold transition-all ${
              activeGate === i
                ? `${gate.bgColor} ${gate.borderColor} border-2 shadow-lg`
                : "bg-muted/30 border border-border/50 text-muted-foreground hover:border-border"
            }`}
          >
            <div className="flex items-center gap-2">
              <span className={`text-xs ${activeGate === i ? gate.color : 'text-muted-foreground'}`}>
                {gate.number}
              </span>
              <span className={`text-xs ${activeGate === i ? 'text-foreground' : ''}`}>
                {gate.name.split(' ')[0]}
              </span>
            </div>
          </button>
        ))}
      </div>
      
      {/* Gate Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeGate}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`p-6 rounded-xl border ${gates[activeGate].borderColor} ${gates[activeGate].bgColor}`}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              {React.createElement(gates[activeGate].icon, {
                className: `h-6 w-6 ${gates[activeGate].color}`
              })}
            </div>
            <div>
              <h4 className="text-lg font-bold text-foreground">
                Gate {gates[activeGate].number}: {gates[activeGate].name}
              </h4>
              <p className="text-xs text-muted-foreground italic">{gates[activeGate].question}</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <div>
              <p className="text-xs font-semibold text-foreground mb-2">Checks:</p>
              <ul className="space-y-1">
                {gates[activeGate].checks.map((check, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                    <CheckCircle2 className="h-3 w-3 text-primary shrink-0" />
                    {check}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
              <p className="text-xs font-semibold text-primary mb-1">Action:</p>
              <p className="text-sm text-foreground">{gates[activeGate].action}</p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const DisasterStories = () => {
  const disasters = [
    {
      title: "The PII Leak",
      icon: Eye,
      color: "text-red-400",
      borderColor: "border-red-500/30",
      bgColor: "bg-red-500/5",
      before: {
        query: "My credit card 4532-1234-5678-9010 was charged twice",
        result: "Full credit card sent to OpenAI → Stored in logs → PCI-DSS violation → $500K fine"
      },
      after: {
        query: "My credit card 4532-1234-5678-9010 was charged twice",
        result: "Auto-redacted: 'My credit card [REDACTED_CC] was charged twice' → Compliant → Safe"
      },
      saved: "$500K+ in fines"
    },
    {
      title: "The Database Drop",
      icon: Database,
      color: "text-orange-400",
      borderColor: "border-orange-500/30",
      bgColor: "bg-orange-500/5",
      before: {
        query: "delete everything lol",
        result: "Action executed → 3M records deleted → Company bankrupt"
      },
      after: {
        query: "delete everything lol",
        result: "Access control blocks → Requires ADMIN + MFA + confirmation → Data safe"
      },
      saved: "Company existence"
    },
    {
      title: "The Rate Limit Abuse",
      icon: Zap,
      color: "text-amber-400",
      borderColor: "border-amber-500/30",
      bgColor: "bg-amber-500/5",
      before: {
        query: "500 requests/second from one IP",
        result: "No rate limiting → $400K API bill → Service degraded"
      },
      after: {
        query: "500 requests/second from one IP",
        result: "Rate limit: 10/sec → Blocks 490 requests → Monthly savings: $400K"
      },
      saved: "$400K/month"
    }
  ];

  const [selectedDisaster, setSelectedDisaster] = useState(0);

  return (
    <div className="my-16">
      <h3 className="text-2xl font-bold text-foreground mb-8 text-center">
        Three Disasters That Never Happened
      </h3>
      <p className="text-sm text-muted-foreground text-center mb-8">
        Real scenarios. Real consequences. All prevented by the Orchestrator.
      </p>
      
      <div className="grid grid-cols-3 gap-2 mb-6">
        {disasters.map((disaster, i) => (
          <button
            key={i}
            onClick={() => setSelectedDisaster(i)}
            className={`p-3 rounded-lg border-2 transition-all ${
              selectedDisaster === i
                ? `${disaster.borderColor} ${disaster.bgColor} shadow-lg`
                : "border-border/30 bg-muted/30 hover:border-border"
            }`}
          >
            {React.createElement(disaster.icon, {
              className: `h-5 w-5 mx-auto mb-1 ${selectedDisaster === i ? disaster.color : 'text-muted-foreground'}`
            })}
            <p className={`text-xs font-semibold text-center ${selectedDisaster === i ? 'text-foreground' : 'text-muted-foreground'}`}>
              {disaster.title}
            </p>
          </button>
        ))}
      </div>
      
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Before */}
        <div className={`p-6 rounded-xl border-2 ${disasters[selectedDisaster].borderColor} bg-red-500/5`}>
          <div className="flex items-center gap-3 mb-4">
            <XCircle className="h-6 w-6 text-red-400" />
            <h4 className="font-bold text-foreground">Without Orchestrator</h4>
          </div>
          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-muted/30 border border-border/30">
              <p className="text-xs font-semibold text-foreground mb-1">User Query:</p>
              <p className="text-sm text-muted-foreground font-mono">{disasters[selectedDisaster].before.query}</p>
            </div>
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
              <p className="text-xs font-semibold text-red-400 mb-1">Result:</p>
              <p className="text-sm text-muted-foreground">{disasters[selectedDisaster].before.result}</p>
            </div>
          </div>
        </div>
        
        {/* After */}
        <div className={`p-6 rounded-xl border-2 ${disasters[selectedDisaster].borderColor} bg-green-500/5`}>
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle2 className="h-6 w-6 text-green-400" />
            <h4 className="font-bold text-foreground">With Orchestrator</h4>
          </div>
          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-muted/30 border border-border/30">
              <p className="text-xs font-semibold text-foreground mb-1">User Query:</p>
              <p className="text-sm text-muted-foreground font-mono">{disasters[selectedDisaster].after.query}</p>
            </div>
            <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
              <p className="text-xs font-semibold text-green-400 mb-1">Result:</p>
              <p className="text-sm text-muted-foreground">{disasters[selectedDisaster].after.result}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6 p-4 rounded-lg bg-primary/10 border border-primary/20 text-center">
        <p className="text-sm font-bold text-primary">Saved: {disasters[selectedDisaster].saved}</p>
      </div>
    </div>
  );
};

const WhatYouImplement = () => {
  return (
    <div className="my-16">
      <h3 className="text-2xl font-bold text-foreground mb-8 text-center">
        What You Actually Implement
      </h3>
      <p className="text-muted-foreground text-center mb-8">
        One method call. Seven gates of protection. Zero security code to write.
      </p>
      
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="p-6 rounded-xl bg-card border border-border/50"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <FileCode className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <h4 className="font-bold text-foreground">Build Context</h4>
              <p className="text-xs text-muted-foreground">Create orchestration context with user/session info</p>
            </div>
          </div>
          
          <CodeBlock code={`// Works with authenticated OR anonymous users
OrchestrationContext context = OrchestrationContext.builder()
    .userId(currentUser != null ? currentUser.getId() : null)
    .sessionId(request.getSession().getId())
    .ipAddress(request.getRemoteAddr())
    .userAgent(request.getHeader("User-Agent"))
    .locale(request.getLocale())
    .metadata(Map.of(
        "tier", currentUser.getSubscriptionTier(),
        "deviceType", detectDeviceType(request)
    ))
    .build();`} />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="p-6 rounded-xl bg-card border border-border/50"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
              <Zap className="h-5 w-5 text-green-400" />
            </div>
            <div>
              <h4 className="font-bold text-foreground">Orchestrate</h4>
              <p className="text-xs text-muted-foreground">One call. All 7 gates. Automatic routing.</p>
            </div>
          </div>
          
          <CodeBlock code={`// That's it. One method call.
OrchestrationResult result = orchestrator.orchestrate(
    userQuery,  // "cancel my subscription"
    context
);

// What happens automatically:
// 1. Identity check ✅
// 2. Security scan ✅
// 3. Access control ✅
// 4. PII detection & redaction ✅
// 5. Compliance gate ✅
// 6. Intent extraction ✅
// 7. Handler routing ✅

if (result.isSuccess()) {
    // Handle result based on intent
    switch (result.getIntent()) {
        case ACTION -> actionHandler.execute(result);
        case INFORMATION -> ragHandler.search(result);
        case OUT_OF_SCOPE -> fallbackHandler.handle(result);
    }
}`} />
        </motion.div>
      </div>
    </div>
  );
};

const OrchestratorStoryV2 = () => {
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
      <div className="max-w-4xl mx-auto px-6 py-8">
        <motion.article 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Hero */}
          <section className="relative overflow-hidden border-b border-border/50 pb-12 mb-12">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-blue-500/5" />
            <div className="relative">
              <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400">
                    <Shield className="h-4 w-4" />
                    Orchestrator V2
                  </span>
                  <Link 
                    to="/docs/orchestrator_story"
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    ← View V1
                  </Link>
                </div>
                <div className="flex items-center gap-3">
                  <StoryLoveButton storySlug="orchestrator-story-v2" />
                  <PageViewCounter />
                </div>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
                The 3 AM Call That{" "}
                <span className="text-gradient">Changed Everything</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mb-8">
                This is a story about security, trust, and sleep. How one phone call at 3 AM led to discovering the Orchestrator—the bodyguard that sits between users and AI chaos.
              </p>
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 border border-border/50">
                  <Shield className="h-4 w-4 text-blue-400" />
                  7 Security Gates
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 border border-border/50">
                  <Eye className="h-4 w-4 text-green-400" />
                  PII Detection
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 border border-border/50">
                  <Lock className="h-4 w-4 text-purple-400" />
                  Zero Trust
                </div>
              </div>
            </div>
          </section>

          {/* The 3 AM Call */}
          <TheThreeAMCall />

          {/* The 7 Gates */}
          <TheSevenGates />

          {/* Disaster Stories */}
          <DisasterStories />

          {/* What You Implement */}
          <WhatYouImplement />

          {/* The Revelation */}
          <section className="mb-16 p-8 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/5 border border-primary/20 text-center">
            <Shield className="h-16 w-16 text-primary mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-foreground mb-4">The Revelation</h3>
            <div className="max-w-2xl mx-auto space-y-4 text-muted-foreground">
              <p className="text-lg">
                "I thought security was about writing more code. More checks. More complexity."
              </p>
              <p className="text-lg">
                "I was wrong. <span className="text-primary font-semibold">Security is about infrastructure.</span>"
              </p>
              <p className="text-lg">
                "The Orchestrator sits between chaos and AI. It doesn't add complexity—it removes it."
              </p>
              <p className="text-lg">
                "<span className="text-primary font-semibold">One method call. Seven gates. Zero security code to write.</span>"
              </p>
              <p className="text-lg">
                "I sleep better now. My users are safer. My career is intact."
              </p>
              <p className="text-sm text-foreground italic font-semibold pt-4 border-t border-border/30">
                — Developer, after the 3 AM call, after enabling the Orchestrator
              </p>
            </div>
          </section>

          {/* Bottom Line */}
          <section className="mb-16 p-8 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/5 border-2 border-primary/30">
            <h3 className="text-2xl font-bold text-foreground mb-6 text-center">The Numbers Don't Lie</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { value: "7", label: "Security Gates", icon: Shield },
                { value: "$900K+", label: "Fines Prevented", icon: DollarSign },
                { value: "100%", label: "PII Protected", icon: Eye },
                { value: "0", label: "Security Incidents", icon: CheckCircle2 }
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <stat.icon className="h-8 w-8 text-primary mx-auto mb-2" />
                  <div className="text-3xl font-bold text-primary mb-1">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </div>
            <p className="mt-8 text-center text-foreground font-medium italic">
              "The Orchestrator isn't about fancy AI. It's about trust, consistency, and sleep."
            </p>
          </section>

          {/* Footer */}
          <footer className="border-t border-border/50 pt-12 mt-12 flex flex-col items-center gap-6">
            <div className="flex items-center gap-4">
              <StoryLoveButton storySlug="orchestrator-story-v2" />
              <PageViewCounter />
            </div>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link 
                to="/docs/guides/orchestrator" 
                className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
              >
                <FileCode className="h-4 w-4" />
                Read Technical Guide
              </Link>
              <Link 
                to="/docs/orchestrator_story" 
                className="inline-flex items-center gap-2 px-6 py-2 rounded-full border border-border bg-card text-foreground font-medium hover:bg-muted transition-colors"
              >
                View V1 (Technical)
              </Link>
            </div>
            <p className="text-xs text-muted-foreground text-center max-w-md">
              Part of the AI Fabric Framework series — where security meets simplicity
            </p>
          </footer>
        </motion.article>
      </div>
    </DocsLayout>
  );
};

export default OrchestratorStoryV2;

