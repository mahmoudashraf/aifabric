import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Highlight, themes } from "prism-react-renderer";
import DocsLayout from "@/components/docs/DocsLayout";
import PageViewCounter from "@/components/PageViewCounter";
import StoryLoveButton from "@/components/StoryLoveButton";
import StoryNavigation from "@/components/StoryNavigation";
import { 
  Shield,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Eye,
  Lock,
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
  Key,
  Search,
  MessageSquare,
  CreditCard,
  FileText,
  Ban,
  Fingerprint,
  ShoppingCart,
  Code
} from "lucide-react";

const PAGE_TITLE = "PII Detection: The Data Leak That Never Happened - AI Fabric Framework";
const PAGE_DESCRIPTION = "A developer's journey from HIPAA nightmare to peaceful sleep—how PII detection prevents data leaks before they happen.";

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

const TheHIPAAIncident = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const steps = [
    {
      time: "Monday 2:00 PM",
      title: "The Patient Query",
      icon: MessageSquare,
      color: "text-blue-400",
      bgColor: "bg-blue-500/5",
      borderColor: "border-blue-500/30",
      events: [
        { emoji: "💬", text: "Patient: 'My SSN is 123-45-6789. Can you check my records?'", type: "normal" },
        { emoji: "🤖", text: "Chatbot: 'Let me look that up for you...'", type: "normal" }
      ]
    },
    {
      time: "Monday 2:01 PM",
      title: "The Leak",
      icon: AlertTriangle,
      color: "text-red-400",
      bgColor: "bg-red-500/5",
      borderColor: "border-red-500/30",
      events: [
        { emoji: "❌", text: "No PII detection in place", type: "error" },
        { emoji: "📤", text: "Full SSN sent to OpenAI API", type: "critical" },
        { emoji: "💾", text: "SSN stored in OpenAI logs (permanent)", type: "critical" },
        { emoji: "⚖️", text: "HIPAA violation detected", type: "critical" }
      ]
    },
    {
      time: "Monday 2:30 PM",
      title: "The Discovery",
      icon: Eye,
      color: "text-orange-400",
      bgColor: "bg-orange-500/5",
      borderColor: "border-orange-500/30",
      events: [
        { emoji: "🔍", text: "Security audit finds PII in API logs", type: "warning" },
        { emoji: "😱", text: "Legal team notified immediately", type: "critical" },
        { emoji: "💰", text: "Potential fine: $1.5M+ (HIPAA)", type: "critical" }
      ]
    },
    {
      time: "Monday 3:00 PM",
      title: "The Panic",
      icon: XCircle,
      color: "text-red-600",
      bgColor: "bg-red-600/5",
      borderColor: "border-red-600/50",
      events: [
        { emoji: "📧", text: "Incident report filed", type: "critical" },
        { emoji: "⚖️", text: "Legal: 'This is a HIPAA breach'", type: "critical" },
        { emoji: "💔", text: "Reputation at risk. Trust destroyed.", type: "critical" }
      ]
    },
    {
      time: "Monday 4:00 PM",
      title: "The Solution",
      icon: Sparkles,
      color: "text-green-400",
      bgColor: "bg-green-500/5",
      borderColor: "border-green-500/30",
      events: [
        { emoji: "💡", text: "Developer discovers Orchestrator PII Detection", type: "positive" },
        { emoji: "🔒", text: "Automatic detection and redaction", type: "positive" },
        { emoji: "✅", text: "PII never leaves your servers", type: "positive" }
      ]
    },
    {
      time: "Monday 5:00 PM",
      title: "The Fix",
      icon: CheckCircle2,
      color: "text-green-600",
      bgColor: "bg-green-600/5",
      borderColor: "border-green-600/50",
      events: [
        { emoji: "⚡", text: "PII Detection enabled in Orchestrator", type: "positive" },
        { emoji: "🛡️", text: "All PII automatically redacted", type: "positive" },
        { emoji: "😴", text: "Developer sleeps peacefully", type: "positive" },
        { emoji: "✅", text: "Zero PII leaks in 6 months", type: "positive" }
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
      default: return "text-muted-foreground";
    }
  };

  return (
    <div className="my-12 p-8 rounded-2xl bg-gradient-to-br from-red-500/5 to-green-500/5 border border-border/50">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            The HIPAA Incident: When PII Leaked
          </h3>
          <p className="text-sm text-muted-foreground mt-1">Watch how one SSN leak led to discovering PII detection</p>
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
      
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {steps.map((step, i) => (
          <button
            key={i}
            onClick={() => { setActiveStep(i); setIsPlaying(false); }}
            className={`flex-shrink-0 px-3 py-2 rounded-lg font-semibold transition-all ${
              activeStep === i
                ? `${step.bgColor} ${step.borderColor} border-2 shadow-lg`
                : "bg-muted/30 border border-border/50 text-muted-foreground hover:border-border"
            }`}
          >
            <div className="flex items-center gap-2">
              {React.createElement(step.icon, {
                className: `h-4 w-4 ${activeStep === i ? step.color : 'text-muted-foreground'}`
              })}
              <span className={`text-xs ${activeStep === i ? 'text-foreground' : ''}`}>
                {step.time.split(' ')[1]}
              </span>
            </div>
          </button>
        ))}
      </div>
      
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
          <CheckCircle2 className="h-8 w-8 text-green-400 mx-auto mb-3" />
          <p className="text-lg font-bold text-green-400 mb-2">PII Detection: The Solution</p>
          <p className="text-sm text-muted-foreground">
            Automatic detection. Automatic redaction. PII never leaves your servers.
          </p>
        </motion.div>
      )}
    </div>
  );
};

const PIIDetectionFlow = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const steps = [
    {
      step: 1,
      name: "User Input",
      icon: MessageSquare,
      color: "text-blue-400",
      input: "My credit card is 4532-1234-5678-9010",
      output: "Raw query received"
    },
    {
      step: 2,
      name: "PII Detection",
      icon: Eye,
      color: "text-purple-400",
      input: "Scan for PII patterns",
      output: "Credit card detected: 4532-1234-5678-9010"
    },
    {
      step: 3,
      name: "Redaction",
      icon: Shield,
      color: "text-red-400",
      input: "Detected PII",
      output: "Redacted: My credit card is [REDACTED_CC]"
    },
    {
      step: 4,
      name: "Safe Processing",
      icon: Brain,
      color: "text-green-400",
      input: "Redacted query",
      output: "Sent to LLM (no PII)"
    },
    {
      step: 5,
      name: "Audit Log",
      icon: FileText,
      color: "text-amber-400",
      input: "PII detection event",
      output: "Logged: PII detected and redacted"
    }
  ];

  useEffect(() => {
    if (isPlaying && activeStep < steps.length - 1) {
      const timer = setTimeout(() => {
        setActiveStep(prev => prev + 1);
      }, 2000);
      return () => clearTimeout(timer);
    } else if (activeStep >= steps.length - 1) {
      setIsPlaying(false);
    }
  }, [isPlaying, activeStep, steps.length]);

  return (
    <div className="my-16 p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 border border-border/50">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-2xl font-bold text-foreground">The PII Detection Flow</h3>
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
      
      <div className="space-y-4">
        {steps.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ 
              opacity: activeStep >= i ? 1 : 0.3,
              x: 0
            }}
            className={`p-4 rounded-lg border-2 transition-all ${
              activeStep === i
                ? "border-primary bg-primary/10 shadow-lg scale-105"
                : activeStep > i
                ? "border-green-500/30 bg-green-500/5"
                : "border-border/30 bg-muted/30"
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                {React.createElement(step.icon, {
                  className: `h-6 w-6 ${step.color}`
                })}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono text-muted-foreground">Step {step.step}</span>
                  <span className="font-bold text-foreground">{step.name}</span>
                  {activeStep > i && <CheckCircle2 className="h-4 w-4 text-green-400" />}
                  {activeStep === i && <Activity className="h-4 w-4 text-primary animate-pulse" />}
                </div>
                <div className="grid md:grid-cols-2 gap-3 text-sm">
                  <div className="p-2 rounded bg-muted/30">
                    <span className="text-muted-foreground">Input: </span>
                    <span className="text-foreground font-mono text-xs">{step.input}</span>
                  </div>
                  <div className="p-2 rounded bg-primary/10">
                    <span className="text-primary">Output: </span>
                    <span className="text-foreground font-mono text-xs">{step.output}</span>
                  </div>
                </div>
              </div>
              {i < steps.length - 1 && (
                <ArrowRight className="h-5 w-5 text-muted-foreground hidden md:block" />
              )}
            </div>
          </motion.div>
        ))}
      </div>
      
      {activeStep >= steps.length - 1 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-6 p-4 rounded-lg bg-green-500/10 border border-green-500/30 text-center"
        >
          <p className="text-sm font-bold text-green-400">Result: PII Protected, Query Processed Safely</p>
          <p className="text-xs text-muted-foreground mt-1">Original PII never leaves your servers. Only redacted version sent to LLM.</p>
        </motion.div>
      )}
    </div>
  );
};

const PIITypes = () => {
  const [selectedType, setSelectedType] = useState(0);
  
  const piiTypes = [
    {
      name: "Credit Cards",
      icon: CreditCard,
      color: "text-red-400",
      borderColor: "border-red-500/30",
      bgColor: "bg-red-500/5",
      pattern: "\\d{4}[\\s-]?\\d{4}[\\s-]?\\d{4}[\\s-]?\\d{4}",
      example: "4532-1234-5678-9010",
      redacted: "[REDACTED_CC]",
      regulations: ["PCI-DSS", "GDPR"]
    },
    {
      name: "Social Security Numbers",
      icon: Fingerprint,
      color: "text-orange-400",
      borderColor: "border-orange-500/30",
      bgColor: "bg-orange-500/5",
      pattern: "\\d{3}-\\d{2}-\\d{4}",
      example: "123-45-6789",
      redacted: "[REDACTED_SSN]",
      regulations: ["HIPAA", "GDPR"]
    },
    {
      name: "Email Addresses",
      icon: MessageSquare,
      color: "text-blue-400",
      borderColor: "border-blue-500/30",
      bgColor: "bg-blue-500/5",
      pattern: "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}",
      example: "john.doe@example.com",
      redacted: "[REDACTED_EMAIL]",
      regulations: ["GDPR", "CCPA"]
    },
    {
      name: "Phone Numbers",
      icon: MessageSquare,
      color: "text-green-400",
      borderColor: "border-green-500/30",
      bgColor: "bg-green-500/5",
      pattern: "\\(?\\d{3}\\)?[-.\\s]?\\d{3}[-.\\s]?\\d{4}",
      example: "(555) 123-4567",
      redacted: "[REDACTED_PHONE]",
      regulations: ["GDPR", "TCPA"]
    },
    {
      name: "IP Addresses",
      icon: Database,
      color: "text-purple-400",
      borderColor: "border-purple-500/30",
      bgColor: "bg-purple-500/5",
      pattern: "\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}\\.\\d{1,3}",
      example: "192.168.1.1",
      redacted: "[REDACTED_IP]",
      regulations: ["GDPR"]
    },
    {
      name: "Custom Patterns",
      icon: Code,
      color: "text-amber-400",
      borderColor: "border-amber-500/30",
      bgColor: "bg-amber-500/5",
      pattern: "Your regex pattern",
      example: "Custom format",
      redacted: "[REDACTED_CUSTOM]",
      regulations: ["Your compliance"]
    }
  ];

  return (
    <div className="my-16">
      <h3 className="text-2xl font-bold text-foreground mb-8 text-center">
        PII Types Detected Automatically
      </h3>
      <p className="text-muted-foreground text-center mb-8">
        Built-in detection for common PII types. Add custom patterns for your needs.
      </p>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-8">
        {piiTypes.map((type, i) => (
          <button
            key={i}
            onClick={() => setSelectedType(i)}
            className={`p-4 rounded-lg border-2 transition-all ${
              selectedType === i
                ? `${type.borderColor} ${type.bgColor} shadow-lg scale-105`
                : "border-border/30 bg-muted/30 hover:border-border"
            }`}
          >
            {React.createElement(type.icon, {
              className: `h-6 w-6 mx-auto mb-2 ${selectedType === i ? type.color : 'text-muted-foreground'}`
            })}
            <p className={`text-sm font-semibold text-center ${selectedType === i ? 'text-foreground' : 'text-muted-foreground'}`}>
              {type.name}
            </p>
          </button>
        ))}
      </div>
      
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedType}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`p-6 rounded-xl border ${piiTypes[selectedType].borderColor} ${piiTypes[selectedType].bgColor}`}
        >
          <div className="flex items-center gap-3 mb-4">
            {React.createElement(piiTypes[selectedType].icon, {
              className: `h-8 w-8 ${piiTypes[selectedType].color}`
            })}
            <div>
              <h4 className="text-lg font-bold text-foreground">{piiTypes[selectedType].name}</h4>
              <p className="text-sm text-muted-foreground">Automatically detected and redacted</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-muted/30">
              <p className="text-xs text-muted-foreground mb-1">Pattern:</p>
              <code className="text-sm text-foreground font-mono">{piiTypes[selectedType].pattern}</code>
            </div>
            
            <div className="grid md:grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                <p className="text-xs text-red-400 font-medium mb-1">Before:</p>
                <p className="text-sm text-foreground font-mono">{piiTypes[selectedType].example}</p>
              </div>
              <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                <p className="text-xs text-green-400 font-medium mb-1">After:</p>
                <p className="text-sm text-foreground font-mono">{piiTypes[selectedType].redacted}</p>
              </div>
            </div>
            
            <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
              <p className="text-xs text-primary font-medium mb-1">Compliance:</p>
              <div className="flex flex-wrap gap-2">
                {piiTypes[selectedType].regulations.map((reg, j) => (
                  <span key={j} className="px-2 py-1 rounded bg-primary/20 text-primary text-xs">
                    {reg}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const BeforeAfterComparison = () => {
  return (
    <div className="my-16 grid lg:grid-cols-2 gap-8">
      {/* Without PII Detection */}
      <div className="p-8 rounded-2xl bg-red-500/5 border-2 border-red-500/30">
        <div className="flex items-center gap-3 mb-6">
          <XCircle className="h-8 w-8 text-red-400" />
          <h4 className="text-xl font-bold text-foreground">Without PII Detection</h4>
        </div>
        
        <div className="space-y-4 text-sm">
          <div className="p-3 rounded bg-muted/30">
            <p className="text-muted-foreground mb-1">User query:</p>
            <p className="text-foreground font-mono">"My SSN is 123-45-6789"</p>
          </div>
          
          <div className="p-3 rounded bg-red-500/10 border border-red-500/30">
            <p className="text-muted-foreground mb-1">Sent to LLM:</p>
            <p className="text-foreground font-mono">"My SSN is 123-45-6789"</p>
            <p className="text-red-400 text-xs mt-2">❌ Full SSN exposed</p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <span className="text-red-400">✗</span> Stored in LLM provider logs
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <span className="text-red-400">✗</span> HIPAA violation
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <span className="text-red-400">✗</span> Potential $1.5M+ fine
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <span className="text-red-400">✗</span> Reputation damage
            </div>
          </div>
          
          <div className="mt-4 p-4 rounded-lg bg-red-500/10 border border-red-500/20">
            <p className="text-sm text-red-400 font-bold">Result: Data Leak, Compliance Violation</p>
            <p className="text-xs text-muted-foreground mt-1">PII leaves your servers. Fines. Lawsuits. Trust destroyed.</p>
          </div>
        </div>
      </div>
      
      {/* With PII Detection */}
      <div className="p-8 rounded-2xl bg-green-500/5 border-2 border-green-500/30">
        <div className="flex items-center gap-3 mb-6">
          <CheckCircle2 className="h-8 w-8 text-green-400" />
          <h4 className="text-xl font-bold text-foreground">With PII Detection</h4>
        </div>
        
        <div className="space-y-4 text-sm">
          <div className="p-3 rounded bg-muted/30">
            <p className="text-muted-foreground mb-1">User query:</p>
            <p className="text-foreground font-mono">"My SSN is 123-45-6789"</p>
          </div>
          
          <div className="p-3 rounded bg-green-500/10 border border-green-500/30">
            <p className="text-muted-foreground mb-1">Sent to LLM:</p>
            <p className="text-foreground font-mono">"My SSN is [REDACTED_SSN]"</p>
            <p className="text-green-400 text-xs mt-2">✓ SSN redacted automatically</p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-foreground">
              <span className="text-green-400">✓</span> PII never leaves your servers
            </div>
            <div className="flex items-center gap-2 text-foreground">
              <span className="text-green-400">✓</span> Sensitive data redacted
            </div>
            <div className="flex items-center gap-2 text-foreground">
              <span className="text-green-400">✓</span> Zero fines
            </div>
            <div className="flex items-center gap-2 text-foreground">
              <span className="text-green-400">✓</span> Trust maintained
            </div>
          </div>
          
          <div className="mt-4 p-4 rounded-lg bg-green-500/10 border border-green-500/20">
            <p className="text-sm text-green-400 font-bold">Result: PII Protected, Compliance Maintained</p>
            <p className="text-xs text-muted-foreground mt-1">PII stays on your servers. Redacted version sent to LLM. Safe and compliant.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const RealWorldScenarios = () => {
  const scenarios = [
    {
      title: "Healthcare Platform",
      icon: Users,
      color: "bg-blue-500",
      problem: "Patient includes SSN in query",
      solution: "SSN automatically redacted before LLM",
      impact: "Sensitive health data redacted before AI handling"
    },
    {
      title: "FinTech Platform",
      icon: CreditCard,
      color: "bg-green-500",
      problem: "User mentions credit card number",
      solution: "Credit card redacted automatically",
      impact: "Payment data masked before AI handling"
    },
    {
      title: "E-Commerce Platform",
      icon: ShoppingCart,
      color: "bg-purple-500",
      problem: "Customer includes email in support query",
      solution: "Email redacted, query processed safely",
      impact: "GDPR compliant, customer trust maintained"
    },
    {
      title: "SaaS Platform",
      icon: Database,
      color: "bg-amber-500",
      problem: "User includes phone number in chat",
      solution: "Phone number redacted automatically",
      impact: "TCPA compliant, zero violations"
    }
  ];

  return (
    <div className="my-16">
      <h3 className="text-2xl font-bold text-foreground mb-8 text-center">
        Real-World Scenarios
      </h3>
      <div className="grid md:grid-cols-2 gap-6">
        {scenarios.map((scenario, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            viewport={{ once: true }}
            className="p-6 rounded-xl bg-card border border-border/50"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2 rounded-lg ${scenario.color}`}>
                <scenario.icon className="h-5 w-5 text-white" />
              </div>
              <h4 className="font-bold text-foreground">{scenario.title}</h4>
            </div>
            <div className="space-y-3 text-sm">
              <div className="p-2 rounded bg-red-500/10 border border-red-500/20">
                <span className="text-red-400 font-medium">Problem: </span>
                <span className="text-muted-foreground">{scenario.problem}</span>
              </div>
              <div className="p-2 rounded bg-blue-500/10 border border-blue-500/20">
                <span className="text-blue-400 font-medium">Solution: </span>
                <span className="text-muted-foreground">{scenario.solution}</span>
              </div>
              <div className="p-2 rounded bg-green-500/10 border border-green-500/20">
                <span className="text-green-400 font-medium">Impact: </span>
                <span className="text-foreground font-semibold">{scenario.impact}</span>
              </div>
            </div>
          </motion.div>
        ))}
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
        Configure PII detection once, then verify redaction across your AI entry points.
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
              <h4 className="font-bold text-foreground">Enable PII Detection</h4>
              <p className="text-xs text-muted-foreground">One line in application.yml</p>
            </div>
          </div>
          
          <CodeBlock code={`# application.yml
ai-infrastructure:
  orchestrator:
    pii-detection:
      enabled: true
      handling: MASK  # MASK, REMOVE, or ENCRYPT
      
# That's it! PII detection now active.
# All queries automatically scanned and redacted.`} language="yaml" />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="p-6 rounded-xl bg-card border border-border/50"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
              <Shield className="h-5 w-5 text-green-400" />
            </div>
            <div>
              <h4 className="font-bold text-foreground">Automatic Protection</h4>
              <p className="text-xs text-muted-foreground">Works automatically in Orchestrator</p>
            </div>
          </div>
          
          <CodeBlock code={`@Autowired
private AIOrchestrator orchestrator;

@PostMapping("/api/chat")
public String chat(@RequestBody String query) {
    // Orchestrator automatically:
    // 1. Detects PII in query
    // 2. Redacts PII (e.g., "123-45-6789" → "[REDACTED_SSN]")
    // 3. Processes redacted query
    // 4. Returns response
    
    AIOrchestrationResponse response = orchestrator.orchestrate(
        AIOrchestrationRequest.builder()
            .query(query)  // May contain PII
            .build()
    );
    
    // Original PII never left your servers
    // Only redacted version sent to LLM
    return response.getResponse();
}

// What happens automatically:
// Query: "My SSN is 123-45-6789"
//   ↓
// PII Detection: SSN found
//   ↓
// Redaction: "My SSN is [REDACTED_SSN]"
//   ↓
// Sent to LLM: Redacted version only
//   ↓
// Response: Generated from safe query`} />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="p-6 rounded-xl bg-card border border-border/50"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <Code className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <h4 className="font-bold text-foreground">Custom PII Patterns (Optional)</h4>
              <p className="text-xs text-muted-foreground">Add your own detection patterns</p>
            </div>
          </div>
          
          <CodeBlock code={`# application.yml
ai-infrastructure:
  orchestrator:
    pii-detection:
      enabled: true
      handling: MASK
      custom-patterns:
        - name: "Employee ID"
          pattern: "EMP-\\d{6}"
          replacement: "[REDACTED_EMP_ID]"
        - name: "Customer Code"
          pattern: "CUST-[A-Z0-9]{8}"
          replacement: "[REDACTED_CUST_CODE]"

# Custom patterns detected and redacted automatically`} language="yaml" />
        </motion.div>
      </div>
    </div>
  );
};

const ComplianceImpact = () => {
  const regulations = [
    {
      name: "HIPAA",
      icon: Shield,
      color: "text-blue-400",
      fine: "$1.5M+",
      protection: "SSN, DOB, Medical Records",
      result: "Zero violations with PII detection"
    },
    {
      name: "GDPR",
      icon: Lock,
      color: "text-green-400",
      fine: "€20M or 4% revenue",
      protection: "Email, Phone, IP Address",
      result: "Sensitive fields automatically redacted according to app policy"
    },
    {
      name: "PCI-DSS",
      icon: CreditCard,
      color: "text-purple-400",
      fine: "$500K+",
      protection: "Credit Card Numbers",
      result: "Zero card data leaks"
    },
    {
      name: "CCPA",
      icon: Eye,
      color: "text-amber-400",
      fine: "$7,500 per violation",
      protection: "Personal Information",
      result: "Automatic protection built-in"
    }
  ];

  return (
    <div className="my-16">
      <h3 className="text-2xl font-bold text-foreground mb-8 text-center">
        Compliance Impact
      </h3>
      <div className="grid md:grid-cols-2 gap-6">
        {regulations.map((reg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            viewport={{ once: true }}
            className="p-6 rounded-xl bg-card border border-border/50"
          >
            <div className="flex items-center gap-3 mb-4">
              <reg.icon className={`h-8 w-8 ${reg.color}`} />
              <div>
                <h4 className="font-bold text-foreground">{reg.name}</h4>
                <p className="text-xs text-muted-foreground">Potential fine: {reg.fine}</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="p-2 rounded bg-muted/30">
                <p className="text-xs text-muted-foreground mb-1">Protects:</p>
                <p className="text-foreground">{reg.protection}</p>
              </div>
              <div className="p-2 rounded bg-green-500/10 border border-green-500/20">
                <p className="text-xs text-green-400 font-medium">{reg.result}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const PIIDetectionStory = () => {
  useEffect(() => {
    document.title = PAGE_TITLE;
  }, []);

  return (
    <DocsLayout>
      <div className="max-w-4xl mx-auto">
        {/* Top Navigation */}
        <StoryNavigation variant="compact" className="pt-6" />

        <motion.article 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="py-8"
        >
          {/* Hero */}
          <section className="relative overflow-hidden border-b border-border/50 pb-12 mb-12">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-green-500/5" />
            <div className="relative">
              <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                    <Shield className="h-4 w-4" />
                    PII Detection
                  </span>
                  <Link 
                    to="/docs/orchestrator_story"
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    ← View Orchestrator Story
                  </Link>
                </div>
                <div className="flex items-center gap-3">
                  <StoryLoveButton storySlug="pii-detection-story" />
                  <PageViewCounter />
                </div>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
                The Data Leak That{" "}
                <span className="text-gradient">Never Happened</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mb-8">
	                A developer's journey from sensitive-data panic to safer AI requests. PII detection helps redact risky input before retrieval, logging, or LLM calls.
              </p>
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 border border-border/50">
                  <Shield className="h-4 w-4 text-green-400" />
                  Sensitive-Data Controls
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 border border-border/50">
                  <Lock className="h-4 w-4 text-blue-400" />
                  Privacy-Aware Flow
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 border border-border/50">
                  <Eye className="h-4 w-4 text-purple-400" />
                  Automatic Detection
                </div>
              </div>
            </div>
          </section>

          {/* The HIPAA Incident */}
          <TheHIPAAIncident />

          {/* PII Detection Flow */}
          <PIIDetectionFlow />

          {/* PII Types */}
          <PIITypes />

          {/* Before/After Comparison */}
          <BeforeAfterComparison />

          {/* Real-World Scenarios */}
          <RealWorldScenarios />

          {/* Compliance Impact */}
          <ComplianceImpact />

          {/* What You Implement */}
          <WhatYouImplement />

          {/* The Revelation */}
          <section className="mb-16 p-8 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/5 border border-primary/20 text-center">
            <Shield className="h-16 w-16 text-primary mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-foreground mb-4">The Revelation</h3>
            <div className="max-w-2xl mx-auto space-y-4 text-muted-foreground">
              <p className="text-lg">
                "I thought PII detection was complex. That I'd need to build custom regex patterns. That I'd need to maintain detection logic."
              </p>
              <p className="text-lg">
                "I was wrong. <span className="text-primary font-semibold">One config line. Automatic detection. Automatic redaction.</span>"
              </p>
              <p className="text-lg">
                "SSN? Detected. Credit card? Detected. Email? Detected. All automatically. All before the query reaches the LLM."
              </p>
              <p className="text-lg">
                "The HIPAA incident? Never happened. Because PII never left our servers. Only redacted versions sent to LLMs."
              </p>
              <p className="text-lg">
                "<span className="text-primary font-semibold">One config line. Zero PII leaks. $1.5M+ in fines avoided.</span>"
              </p>
              <p className="text-sm text-foreground italic font-semibold pt-4 border-t border-border/30">
                — Developer, after enabling PII detection in the Orchestrator
              </p>
            </div>
          </section>

          {/* Bottom Line */}
          <section className="mb-16 p-8 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/5 border-2 border-primary/30">
            <h3 className="text-2xl font-bold text-foreground mb-6 text-center">The Bottom Line</h3>
            <div className="text-center space-y-6">
              <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30">
                  <p className="text-sm text-muted-foreground mb-1">Without PII Detection</p>
                  <p className="text-xl font-bold text-red-400">$1.5M+ Fines</p>
                </div>
                <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30">
                  <p className="text-sm text-muted-foreground mb-1">With PII Detection</p>
                  <p className="text-xl font-bold text-green-400">Zero Leaks</p>
                </div>
              </div>
              <div className="flex flex-wrap justify-center gap-2 mt-6">
                {["HIPAA", "GDPR", "PCI-DSS", "CCPA", "TCPA"].map((reg, i) => (
                  <span key={i} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
                    ✓ {reg} Compliant
                  </span>
                ))}
              </div>
              <p className="text-foreground font-semibold mt-6">
                One config line. Automatic detection. Automatic redaction. PII never leaves your servers.
              </p>
            </div>
          </section>

          {/* Story Navigation */}


          <StoryNavigation className="mt-12" />



          {/* Footer */}
          <footer className="border-t border-border/50 pt-12 mt-12 flex flex-col items-center gap-6">
            <div className="flex items-center gap-4">
              <StoryLoveButton storySlug="pii-detection-story" />
              <PageViewCounter />
            </div>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link 
                to="/docs/orchestrator_story" 
                className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
              >
                <FileCode className="h-4 w-4" />
                View Orchestrator Story
              </Link>
              <Link 
                to="/docs/orchestrator_story_v2" 
                className="inline-flex items-center gap-2 px-6 py-2 rounded-full border border-border bg-card text-foreground font-medium hover:bg-muted transition-colors"
              >
                View Orchestrator V2
              </Link>
            </div>
            <p className="text-xs text-muted-foreground text-center max-w-md">
              Part of the AI Fabric Framework series — where PII detection prevents disasters before they happen
            </p>
          </footer>
        </motion.article>
      </div>
    </DocsLayout>
  );
};

export default PIIDetectionStory;
