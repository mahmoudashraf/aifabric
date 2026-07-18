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
  CreditCard,
  Fingerprint,
  Mail,
  Phone,
  FileText,
  Play,
  Pause,
  RotateCcw,
  TrendingUp,
  TrendingDown,
  Activity,
  Sparkles,
  Heart,
  Target
} from "lucide-react";

const PAGE_TITLE = "PII Detection V2: The GDPR Audit That Saved Everything - AI Fabric Framework";
const PAGE_DESCRIPTION = "A developer's journey from privacy panic to GDPR compliance—how automatic PII detection prevented a €20M fine.";

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

const TheGDPRAudit = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const steps = [
    {
      time: "Monday 10:00 AM",
      title: "The Audit Notice",
      icon: FileText,
      color: "text-blue-400",
      bgColor: "bg-blue-500/5",
      borderColor: "border-blue-500/30",
      events: [
        { emoji: "📧", text: "Email: 'GDPR compliance audit scheduled for next week'", type: "info" },
        { emoji: "😊", text: "Team: 'We're compliant, right? We handle data carefully'", type: "positive" },
        { emoji: "☕", text: "Coffee in hand, ready to prepare documentation", type: "info" }
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
        { emoji: "🔍", text: "Auditor: 'Show me how you handle PII in chat logs'", type: "warning" },
        { emoji: "😅", text: "Team: 'We... send it to OpenAI?'", type: "warning" },
        { emoji: "📋", text: "Found: Customer emails, SSNs, credit cards in OpenAI logs", type: "error" },
        { emoji: "❌", text: "No PII detection or redaction", type: "error" }
      ]
    },
    {
      time: "Monday 4:00 PM",
      title: "The Horror",
      icon: XCircle,
      color: "text-red-400",
      bgColor: "bg-red-500/5",
      borderColor: "border-red-500/30",
      events: [
        { emoji: "😱", text: "Auditor: 'This is a GDPR violation'", type: "critical" },
        { emoji: "💰", text: "Potential fine: €20M or 4% of revenue", type: "critical" },
        { emoji: "⚖️", text: "Legal team notified immediately", type: "critical" },
        { emoji: "📉", text: "Compliance score: 2/10", type: "critical" }
      ]
    },
    {
      time: "Monday 5:00 PM",
      title: "The Panic",
      icon: AlertTriangle,
      color: "text-red-600",
      bgColor: "bg-red-600/5",
      borderColor: "border-red-600/50",
      events: [
        { emoji: "🚨", text: "CEO: 'Fix this. Now. Before the audit.'", type: "critical" },
        { emoji: "⏰", text: "Deadline: 5 days", type: "critical" },
        { emoji: "😰", text: "Team: 'How do we redact PII from 50K chat logs?'", type: "critical" },
        { emoji: "💭", text: "Flashback: 'We thought OpenAI handled privacy...'", type: "critical" }
      ]
    },
    {
      time: "Tuesday 9:00 AM",
      title: "The Solution",
      icon: Brain,
      color: "text-blue-400",
      bgColor: "bg-blue-500/5",
      borderColor: "border-blue-500/30",
      events: [
        { emoji: "💡", text: "Remember: AI Fabric has PII Detection module", type: "positive" },
        { emoji: "🔒", text: "Automatic detection & redaction before LLM", type: "positive" },
        { emoji: "✅", text: "Privacy controls enabled before the LLM path", type: "positive" },
        { emoji: "📋", text: "Audit trail with encryption support", type: "positive" }
      ]
    },
    {
      time: "Tuesday 2:00 PM",
      title: "The Implementation",
      icon: Code,
      color: "text-green-400",
      bgColor: "bg-green-500/5",
      borderColor: "border-green-500/30",
      events: [
        { emoji: "⚡", text: "15 minutes: Enable PII detection in config", type: "intervention" },
        { emoji: "🔧", text: "30 minutes: Add custom patterns for our data", type: "intervention" },
        { emoji: "✅", text: "Framework handles everything automatically", type: "intervention" },
        { emoji: "📊", text: "Compliance score: 9/10", type: "intervention" }
      ]
    },
    {
      time: "Friday 10:00 AM",
      title: "The Victory",
      icon: CheckCircle2,
      color: "text-green-400",
      bgColor: "bg-green-500/5",
      borderColor: "border-green-500/30",
      events: [
        { emoji: "🎉", text: "Auditor: 'This is exactly what we needed'", type: "positive" },
        { emoji: "✅", text: "GDPR Compliance: PASSED", type: "positive" },
        { emoji: "😴", text: "Team: 'We can finally sleep'", type: "positive" },
        { emoji: "🔒", text: "Privacy: automatic detection with app-owned compliance policy", type: "positive" }
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
        The GDPR Audit Timeline: From Panic to Compliance
      </h3>
      <p className="text-sm text-muted-foreground text-center mb-8">
        A 5-day journey that saved €20M and changed how we think about privacy
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
                <span className={`text-xs ${activeStep === i ? 'text-foreground' : ''}`}>{step.time.split(' ')[0]}</span>
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
          <Shield className="h-8 w-8 text-green-400 mx-auto mb-3" />
          <p className="text-lg font-bold text-green-400 mb-2">PII Detection Enabled: Privacy Protected</p>
          <p className="text-sm text-muted-foreground">
            Configured PII patterns are detected and redacted before reaching LLMs. Your app still owns compliance obligations.
          </p>
        </motion.div>
      )}
    </div>
  );
};

const TheThreeModes = () => {
  const [activeMode, setActiveMode] = useState(0);
  
  const modes = [
    {
      name: "REDACT",
      icon: Shield,
      color: "text-green-400",
      borderColor: "border-green-500/30",
      bgColor: "bg-green-500/5",
      description: "Production mode - detects and redacts PII",
      example: {
        input: "My SSN is 123-45-6789, email is john@example.com",
        output: "My SSN is ***-**-****, email is ***@***.***",
        explanation: "PII detected and replaced with masked values. Safe for LLM."
      },
      useCase: "Production environments, GDPR compliance, HIPAA compliance"
    },
    {
      name: "DETECT_ONLY",
      icon: Eye,
      color: "text-blue-400",
      borderColor: "border-blue-500/30",
      bgColor: "bg-blue-500/5",
      description: "Logging mode - detects but doesn't redact",
      example: {
        input: "My SSN is 123-45-6789, email is john@example.com",
        output: "My SSN is 123-45-6789, email is john@example.com",
        explanation: "PII detected and logged, but original text unchanged. Useful for audits."
      },
      useCase: "Development, testing, compliance audits, monitoring"
    },
    {
      name: "PASS_THROUGH",
      icon: Ban,
      color: "text-gray-400",
      borderColor: "border-gray-500/30",
      bgColor: "bg-gray-500/5",
      description: "Disabled - no detection or redaction",
      example: {
        input: "My SSN is 123-45-6789, email is john@example.com",
        output: "My SSN is 123-45-6789, email is john@example.com",
        explanation: "No detection performed. Original text passed through unchanged."
      },
      useCase: "Internal systems, non-sensitive data, performance-critical paths"
    }
  ];

  return (
    <div className="my-16">
      <h3 className="text-2xl font-bold text-foreground mb-8 text-center">
        The 3 Detection Modes: Choose Your Privacy Level
      </h3>
      <p className="text-sm text-muted-foreground text-center mb-8">
        Three modes for different use cases. Switch anytime with configuration.
      </p>
      
      <div className="grid grid-cols-3 gap-2 mb-6">
        {modes.map((mode, i) => {
          const Icon = mode.icon;
          return (
            <button
              key={i}
              onClick={() => setActiveMode(i)}
              className={`p-3 rounded-lg border-2 transition-all ${
                activeMode === i
                  ? `${mode.borderColor} ${mode.bgColor} shadow-lg`
                  : "border-border/30 bg-muted/30 hover:border-border"
              }`}
            >
              <Icon className={`h-5 w-5 mx-auto mb-1 ${activeMode === i ? mode.color : 'text-muted-foreground'}`} />
              <p className={`text-xs font-semibold text-center ${activeMode === i ? 'text-foreground' : 'text-muted-foreground'}`}>
                {mode.name}
              </p>
            </button>
          );
        })}
      </div>
      
      <AnimatePresence mode="wait">
        <motion.div
          key={activeMode}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`p-6 rounded-xl border ${modes[activeMode].borderColor} ${modes[activeMode].bgColor}`}
        >
          <div className="flex items-center gap-3 mb-4">
            {React.createElement(modes[activeMode].icon, {
              className: `h-6 w-6 ${modes[activeMode].color}`
            })}
            <div>
              <h4 className="font-bold text-foreground">{modes[activeMode].name} Mode</h4>
              <p className="text-xs text-muted-foreground">{modes[activeMode].description}</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-muted/30 border border-border/30">
              <p className="text-xs font-semibold text-foreground mb-1">Input:</p>
              <p className="text-sm text-muted-foreground font-mono">{modes[activeMode].example.input}</p>
            </div>
            <ArrowRight className="h-4 w-4 text-primary mx-auto" />
            <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
              <p className="text-xs font-semibold text-primary mb-1">Output:</p>
              <p className="text-sm text-foreground font-mono">{modes[activeMode].example.output}</p>
            </div>
            <div className="p-3 rounded-lg bg-secondary/5 border border-secondary/20">
              <p className="text-xs font-semibold text-secondary mb-1">Explanation:</p>
              <p className="text-sm text-muted-foreground">{modes[activeMode].example.explanation}</p>
            </div>
            <div className="p-2 rounded-lg bg-muted/30 text-center">
              <p className="text-xs font-semibold text-muted-foreground">Use Case:</p>
              <p className="text-xs text-foreground mt-1">{modes[activeMode].useCase}</p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const BeforeAfterComparison = () => {
  return (
    <div className="my-16">
      <h3 className="text-2xl font-bold text-foreground mb-8 text-center">
        Before & After: The Privacy Transformation
      </h3>
      
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Before */}
        <div className="p-6 rounded-xl border-2 border-red-500/30 bg-red-500/5">
          <div className="flex items-center gap-3 mb-4">
            <XCircle className="h-6 w-6 text-red-400" />
            <h4 className="font-bold text-foreground">Before: PII Everywhere</h4>
          </div>
          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-muted/30 border border-border/30">
              <p className="text-xs font-semibold text-foreground mb-2">Problems:</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• SSN sent to OpenAI API</li>
                <li>• Credit cards stored in logs</li>
                <li>• Email addresses in vector embeddings</li>
                <li>• No PII detection or redaction</li>
                <li>• GDPR violation risk</li>
                <li>• HIPAA violation risk</li>
              </ul>
            </div>
            <CodeBlock code={`User: "My SSN is 123-45-6789, email is john@example.com"

// Sent directly to OpenAI
orchestrator.orchestrate(query, context);

// Result: PII in OpenAI logs (permanent)
// Result: GDPR violation
// Result: Potential €20M fine`} />
          </div>
        </div>
        
        {/* After */}
        <div className="p-6 rounded-xl border-2 border-green-500/30 bg-green-500/5">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle2 className="h-6 w-6 text-green-400" />
            <h4 className="font-bold text-foreground">After: Automatic Protection</h4>
          </div>
          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-muted/30 border border-border/30">
              <p className="text-xs font-semibold text-foreground mb-2">Benefits:</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• PII automatically detected</li>
                <li>• Redacted before reaching LLM</li>
                <li>• Original encrypted for audit</li>
                <li>• Privacy controls before LLM calls</li>
                <li>• HIPAA-ready</li>
                <li>• Minimal integration code after configuration</li>
              </ul>
            </div>
            <CodeBlock code={`User: "My SSN is 123-45-6789, email is john@example.com"

// Framework detects & redacts automatically
PIIDetectionResult result = piiDetectionService
    .detectAndProcess(query);

// Safe query sent to OpenAI
orchestrator.orchestrate(result.getProcessedQuery(), context);

// Result: "My SSN is ***-**-****, email is ***@***.***"
// Result: GDPR-compliant
// Result: No fines`} />
          </div>
        </div>
      </div>
      
      <div className="mt-6 p-4 rounded-lg bg-primary/10 border border-primary/20 text-center">
        <p className="text-sm font-bold text-primary">
          Result: Compliance score 2/10 → 9/10. GDPR: PASSED. Team: Happy. €20M saved.
        </p>
      </div>
    </div>
  );
};

const PatternShowcase = () => {
  const patterns = [
    {
      name: "SSN",
      icon: Fingerprint,
      color: "text-red-400",
      borderColor: "border-red-500/30",
      bgColor: "bg-red-500/5",
      example: "123-45-6789",
      redacted: "***-**-****",
      description: "Social Security Number - matches various formats"
    },
    {
      name: "Email",
      icon: Mail,
      color: "text-blue-400",
      borderColor: "border-blue-500/30",
      bgColor: "bg-blue-500/5",
      example: "john@example.com",
      redacted: "***@***.***",
      description: "Email addresses - handles all standard formats"
    },
    {
      name: "Phone",
      icon: Phone,
      color: "text-green-400",
      borderColor: "border-green-500/30",
      bgColor: "bg-green-500/5",
      example: "(555) 123-4567",
      redacted: "***-***-****",
      description: "Phone numbers - international formats supported"
    },
    {
      name: "Credit Card",
      icon: CreditCard,
      color: "text-purple-400",
      borderColor: "border-purple-500/30",
      bgColor: "bg-purple-500/5",
      example: "4532-1234-5678-9010",
      redacted: "****-****-****-****",
      description: "Credit card numbers - redaction pattern for payment-data safety"
    }
  ];

  const [selectedPattern, setSelectedPattern] = useState(0);

  return (
    <div className="my-16">
      <h3 className="text-2xl font-bold text-foreground mb-8 text-center">
        Built-in Detection Patterns: Ready to Use
      </h3>
      <p className="text-sm text-muted-foreground text-center mb-8">
        Five built-in patterns. Add unlimited custom patterns.
      </p>
      
      <div className="grid grid-cols-4 gap-2 mb-6">
        {patterns.map((pattern, i) => {
          const Icon = pattern.icon;
          return (
            <button
              key={i}
              onClick={() => setSelectedPattern(i)}
              className={`p-3 rounded-lg border-2 transition-all ${
                selectedPattern === i
                  ? `${pattern.borderColor} ${pattern.bgColor} shadow-lg`
                  : "border-border/30 bg-muted/30 hover:border-border"
              }`}
            >
              <Icon className={`h-5 w-5 mx-auto mb-1 ${selectedPattern === i ? pattern.color : 'text-muted-foreground'}`} />
              <p className={`text-xs font-semibold text-center ${selectedPattern === i ? 'text-foreground' : 'text-muted-foreground'}`}>
                {pattern.name}
              </p>
            </button>
          );
        })}
      </div>
      
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedPattern}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`p-6 rounded-xl border ${patterns[selectedPattern].borderColor} ${patterns[selectedPattern].bgColor}`}
        >
          <div className="flex items-center gap-3 mb-4">
            {React.createElement(patterns[selectedPattern].icon, {
              className: `h-6 w-6 ${patterns[selectedPattern].color}`
            })}
            <div>
              <h4 className="font-bold text-foreground">{patterns[selectedPattern].name} Detection</h4>
              <p className="text-xs text-muted-foreground">{patterns[selectedPattern].description}</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-muted/30 border border-border/30">
              <p className="text-xs font-semibold text-foreground mb-1">Example Input:</p>
              <p className="text-sm text-muted-foreground font-mono">{patterns[selectedPattern].example}</p>
            </div>
            <ArrowRight className="h-4 w-4 text-primary mx-auto" />
            <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
              <p className="text-xs font-semibold text-primary mb-1">Redacted Output:</p>
              <p className="text-sm text-foreground font-mono">{patterns[selectedPattern].redacted}</p>
            </div>
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
        What You Actually Configure
      </h3>
      
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-xl border border-primary/30 bg-primary/5">
          <div className="flex items-center gap-3 mb-4">
            <Settings className="h-6 w-6 text-primary" />
            <h4 className="font-bold text-foreground">Configuration</h4>
          </div>
          <CodeBlock code={`# application.yml
ai:
  pii-detection:
    enabled: true
    mode: REDACT                    # REDACT, DETECT_ONLY, PASS_THROUGH
    detection-direction: INPUT_OUTPUT
    store-encrypted-original: true
    encryption-secret: \${PII_ENCRYPTION_KEY}
    audit-logging-enabled: true
    
    patterns:
      SSN:
        enabled: true
        replacement: "***-**-****"
      EMAIL:
        enabled: true
        replacement: "***@***.***"
      # Add custom patterns
      PASSPORT:
        enabled: true
        field-name: passport_number
        regex: "\\b[A-Z]{1,2}\\d{6,9}\\b"
        replacement: "****PASSPORT****"`} />
        </div>
        
        <div className="p-6 rounded-xl border border-secondary/30 bg-secondary/5">
          <div className="flex items-center gap-3 mb-4">
            <Zap className="h-6 w-6 text-secondary" />
            <h4 className="font-bold text-foreground">Automatic Integration</h4>
          </div>
          <CodeBlock code={`// No code changes needed!
// Framework handles everything automatically

// In RAGOrchestrator:
PIIDetectionResult result = piiDetectionService
    .detectAndProcess(query);

// Safe query sent to LLM
String safeQuery = result.getProcessedQuery();
MultiIntentResponse intents = intentQueryExtractor
    .extract(safeQuery, context);

// PII never reaches LLM
// Original encrypted for audit (if configured)`} />
        </div>
      </div>
      
      <div className="mt-6 p-6 rounded-xl bg-gradient-primary text-center">
        <p className="text-primary-foreground font-semibold text-lg">
          Configure once, then verify with tests. The framework helps protect AI paths, while compliance remains application-owned.
        </p>
      </div>
    </div>
  );
};

const PIIDetectionStoryV2 = () => {
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
        {/* Top Navigation */}
        <StoryNavigation variant="compact" className="px-6 pt-6" />

        {/* Hero */}
        <section className="relative overflow-hidden border-b border-border/50">
          <div className="absolute inset-0 bg-gradient-glow opacity-50" />
          <div className="px-6 py-16 relative">
            <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                  <span className="text-2xl">🔒</span>
                  PII Detection V2 (Narrative)
                </span>
                <Link 
                  to="/docs/pii_detection_story_v1"
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  View V1 →
                </Link>
              </div>
              <div className="flex items-center gap-3">
                <StoryLoveButton storySlug="pii_detection_story_v2" />
                <PageViewCounter />
              </div>
            </div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl"
            >
              <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
                The Privacy Audit That{" "}
                <span className="text-gradient">Saved Everything</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mb-8">
	                A developer's journey from privacy panic to AI input controls: how PII detection
	                gave the team evidence to fix unsafe AI paths quickly.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2 text-sm text-accent">
                  <Shield className="h-4 w-4" />
                  Privacy Controls
                </div>
                <div className="flex items-center gap-2 rounded-full bg-secondary/10 px-4 py-2 text-sm text-secondary">
                  <Lock className="h-4 w-4" />
                  Automatic
                </div>
                <div className="flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm text-primary">
                  <Zap className="h-4 w-4" />
                  5 Days
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* The GDPR Audit Timeline */}
        <section className="px-6 py-12">
          <div className="max-w-4xl mx-auto">
            <TheGDPRAudit />
          </div>
        </section>

        {/* Before & After */}
        <section className="px-6 py-12 border-t border-border/50 bg-muted/30">
          <div className="max-w-4xl mx-auto">
            <BeforeAfterComparison />
          </div>
        </section>

        {/* The 3 Detection Modes */}
        <section className="px-6 py-12">
          <div className="max-w-4xl mx-auto">
            <TheThreeModes />
          </div>
        </section>

        {/* Pattern Showcase */}
        <section className="px-6 py-12 border-t border-border/50 bg-muted/30">
          <div className="max-w-4xl mx-auto">
            <PatternShowcase />
          </div>
        </section>

        {/* What You Implement */}
        <section className="px-6 py-12">
          <div className="max-w-4xl mx-auto">
            <WhatYouImplement />
          </div>
        </section>

        {/* Story Navigation */}
        <section className="px-6 py-12">
          <div className="max-w-4xl mx-auto">
            <StoryNavigation />
          </div>
        </section>

        {/* Footer */}
        <section className="px-6 py-8 border-t border-border/50">
          <div className="max-w-4xl mx-auto flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <Link
                to="/docs/pii_detection_story_v1"
                className="flex items-center gap-2 text-sm text-primary hover:underline"
              >
                <BookOpen className="h-4 w-4" />
                Read V1 (Visual Version)
              </Link>
              <Link
                to="/docs/pii_detection_full"
                className="flex items-center gap-2 text-sm text-primary hover:underline"
              >
                <FileCode className="h-4 w-4" />
                Read Full Technical Guide
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <StoryLoveButton storySlug="pii_detection_story_v2" />
              <PageViewCounter />
            </div>
          </div>
        </section>
      </div>
    </DocsLayout>
  );
};

export default PIIDetectionStoryV2;
