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
  Play,
  Pause,
  RotateCcw,
  Rocket,
  Lightbulb,
  Gavel
} from "lucide-react";

const PAGE_TITLE = "Audit Capabilities V2: The Audit That Saved Everything - AI Fabric Framework";
const PAGE_DESCRIPTION = "A compliance officer's journey from failed audits to compliance gold—how automatic audit logging saved the company from massive fines.";
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

const CompleteAuditFlow = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const steps = [
    {
      number: 1,
      title: "User Query",
      icon: MessageSquare,
      color: "bg-blue-500",
      description: "User sends query:\n'Show me my billing history'"
    },
    {
      number: 2,
      title: "Orchestration",
      icon: Brain,
      color: "bg-purple-500",
      description: "RAGOrchestrator.orchestrate()\nSecurity, access, PII, compliance checks"
    },
    {
      number: 3,
      title: "Query Sanitization",
      icon: Shield,
      color: "bg-green-500",
      description: "sanitizeQuery()\nDetect & redact PII\nResult: 'Show me my [REDACTED]'"
    },
    {
      number: 4,
      title: "Query Encryption",
      icon: Lock,
      color: "bg-orange-500",
      description: "determineEncryptedPayload()\nAES-256-GCM encryption\nAccess-controlled"
    },
    {
      number: 5,
      title: "Intent Serialization",
      icon: Code,
      color: "bg-red-500",
      description: "serializeIntents()\nJSON serialization\nResult: '{\"intents\":[...]}'"
    },
    {
      number: 6,
      title: "Result Serialization",
      icon: FileText,
      color: "bg-teal-500",
      description: "serializeResult()\nJSON serialization\nResult: '{\"response\":\"...\"}'"
    },
    {
      number: 7,
      title: "PII Detection",
      icon: Eye,
      color: "bg-indigo-500",
      description: "hasSensitiveData()\nresolveSensitiveTypes()\nResult: 'EMAIL,PHONE,SSN'"
    },
    {
      number: 8,
      title: "Build Audit Log",
      icon: Database,
      color: "bg-pink-500",
      description: "IntentHistory.builder()\nAll data assembled\nReady for persistence"
    },
    {
      number: 9,
      title: "Database Persistence",
      icon: CheckCircle2,
      color: "bg-green-600",
      description: "IntentHistoryRepository.save()\nIndexed by user_id, created_at\nAutomatic expiry"
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
    <div className="my-16">
      <h3 className="text-2xl font-bold text-foreground mb-8 text-center">
        Complete Audit Flow: From Query to Compliance Gold
      </h3>
      <p className="text-sm text-muted-foreground text-center mb-6">
        Watch how every interaction is automatically logged with privacy protection
      </p>
      
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
              Play Flow
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
      
      <div className="relative">
        <div className="flex flex-wrap justify-center items-center gap-3 md:gap-4">
          {steps.map((step, i) => {
            const Icon = step.icon;
            const isActive = activeStep >= i;
            return (
              <div key={i} className="flex items-center gap-2 md:gap-3">
                <motion.div
                  animate={{
                    scale: activeStep === i ? 1.1 : 1,
                    opacity: isActive ? 1 : 0.4,
                  }}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all cursor-pointer ${
                    activeStep === i
                      ? `${step.color} border-${step.color.split('-')[1]}-600 shadow-lg`
                      : 'bg-muted/30 border-border/50'
                  }`}
                  onClick={() => {
                    setActiveStep(i);
                    setIsPlaying(false);
                  }}
                  style={{ minWidth: '120px' }}
                >
                  <div className={`p-2 rounded-full ${step.color} ${!isActive ? 'opacity-50' : ''}`}>
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                  <div className="text-center">
                    <div className={`text-xs font-semibold mb-1 ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {step.number}
                    </div>
                    <div className={`text-xs font-bold ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {step.title}
                    </div>
                  </div>
                </motion.div>
                {i < steps.length - 1 && (
                  <motion.div
                    animate={{ opacity: activeStep > i ? 1 : 0.3 }}
                    className="hidden md:block"
                  >
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>
        
        {steps[activeStep] && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 p-6 rounded-xl border border-primary/30 bg-primary/5"
          >
            <div className="flex items-center gap-3 mb-3">
              {React.createElement(steps[activeStep].icon, {
                className: `h-6 w-6 text-primary`
              })}
              <div>
                <h4 className="font-bold text-foreground">STEP {steps[activeStep].number}: {steps[activeStep].title}</h4>
                <p className="text-sm text-muted-foreground whitespace-pre-line">{steps[activeStep].description}</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

const TheAuditJourney = () => {
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
        { emoji: "📧", text: "Email: 'HIPAA audit scheduled for next month'", type: "normal" },
        { emoji: "😊", text: "Compliance Officer: 'We got this, we're compliant'", type: "positive" },
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
        { emoji: "🔍", text: "Auditor: 'Show me your audit logs for patient queries'", type: "warning" },
        { emoji: "😅", text: "Team: 'We... don't have audit logs?'", type: "warning" },
        { emoji: "📁", text: "Found: No audit trail, no compliance evidence", type: "error" },
        { emoji: "❌", text: "Auditor: 'This is a HIPAA violation'", type: "critical" }
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
        { emoji: "😰", text: "CFO: 'What's the fine for HIPAA violation?'", type: "critical" },
        { emoji: "💰", text: "Research: '$50,000-$1.5M per incident'", type: "critical" },
        { emoji: "💔", text: "Compliance Officer: 'We need audit logging NOW'", type: "critical" },
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
        { emoji: "🔍", text: "Developer: 'We need to build audit logging from scratch'", type: "warning" },
        { emoji: "📖", text: "Research: 'PII redaction, encryption, retention policies...'", type: "warning" },
        { emoji: "💭", text: "Flashback: 'AI Fabric has audit capabilities...'", type: "positive" },
        { emoji: "💡", text: "Discovers: Automatic audit logging built-in", type: "positive" }
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
        { emoji: "⚙️", text: "Enable audit logging: enabled: true", type: "intervention" },
        { emoji: "✅", text: "Tests: Audit logs automatically created", type: "intervention" },
        { emoji: "🔒", text: "PII redaction: Automatic", type: "intervention" },
        { emoji: "📊", text: "Compliance reports: Generated automatically", type: "intervention" }
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
        { emoji: "📋", text: "Auditor: 'Show me audit logs for patient queries'", type: "positive" },
        { emoji: "✅", text: "Team: 'Here are the logs with PII redacted'", type: "positive" },
        { emoji: "📊", text: "Auditor: 'Compliance reports look good'", type: "positive" },
        { emoji: "🎉", text: "Result: Passed audit. $0 fine.", type: "positive" }
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
        { emoji: "💰", text: "Fines avoided: $50,000-$1.5M", type: "positive" },
        { emoji: "🔒", text: "Privacy: 100% protected (PII redacted)", type: "positive" },
        { emoji: "📊", text: "Compliance: GDPR, HIPAA, SOC2 ready", type: "positive" },
        { emoji: "⚡", text: "Implementation: Zero code, automatic", type: "positive" }
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
        The Audit That Saved Everything
      </h3>
      <p className="text-sm text-muted-foreground text-center mb-8">
        A compliance officer's journey from failed audits to compliance gold
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
          <p className="text-lg font-bold text-green-400 mb-2">Audit Capabilities Enabled: Compliance Gold</p>
          <p className="text-sm text-muted-foreground">
            Zero code. Automatic logging. Privacy-protected. Compliance-ready. Passed audits.
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
        Before & After: From Failed Audit to Compliance Gold
      </h3>
      
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Before */}
        <div className="p-6 rounded-xl border-2 border-red-500/30 bg-red-500/5">
          <div className="flex items-center gap-3 mb-4">
            <XCircle className="h-6 w-6 text-red-400" />
            <h4 className="font-bold text-foreground">Before: No Audit Logging</h4>
          </div>
          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-muted/30 border border-border/30">
              <p className="text-xs font-semibold text-foreground mb-2">Problems:</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• No record of user interactions</li>
                <li>• No compliance evidence</li>
                <li>• No security incident tracking</li>
                <li>• No anomaly detection</li>
                <li>• No data retention compliance</li>
                <li>• Failed audits → Fines → Lost trust</li>
                <li>• HIPAA: $50K-$1.5M per incident</li>
                <li>• GDPR: €20M or 4% of revenue</li>
              </ul>
            </div>
            <CodeBlock code={`// No audit logging
@RestController
public class PatientQueryController {
    
    @PostMapping("/query")
    public ResponseEntity<?> query(@RequestBody QueryRequest request) {
        // Process query
        // No audit trail
        // No compliance evidence
        // No PII protection
        
        return ResponseEntity.ok(result);
    }
}

// Result: Failed audit. $50,000+ fine.`} />
          </div>
        </div>
        
        {/* After */}
        <div className="p-6 rounded-xl border-2 border-green-500/30 bg-green-500/5">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle2 className="h-6 w-6 text-green-400" />
            <h4 className="font-bold text-foreground">After: Automatic Audit Logging</h4>
          </div>
          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-muted/30 border border-border/30">
              <p className="text-xs font-semibold text-foreground mb-2">Benefits:</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Complete audit trail (every interaction)</li>
                <li>• Compliance evidence (GDPR, HIPAA, SOC2)</li>
                <li>• Security incident tracking</li>
                <li>• Anomaly detection</li>
                <li>• Data retention compliance</li>
                <li>• Passed audits → $0 fines → Trust restored</li>
                <li>• PII redacted automatically</li>
                <li>• Compliance reports generated</li>
              </ul>
            </div>
            <CodeBlock code={`// Automatic audit logging - zero code
@RestController
public class PatientQueryController {
    
    @Autowired
    private RAGOrchestrator orchestrator;
    
    @PostMapping("/query")
    public ResponseEntity<?> query(@RequestBody QueryRequest request,
                                   HttpServletRequest httpRequest) {
        // Orchestration automatically creates audit log
        OrchestrationResult result = orchestrator.orchestrate(
            request.getQuery(),
            OrchestrationContext.builder()
                .userId(getCurrentUser().getId())
                .sessionId(httpRequest.getSession().getId())
                .ipAddress(httpRequest.getRemoteAddr())
                .build()
        );
        
        // Audit log automatically created:
        // - User ID, session ID, IP address
        // - Query (redacted + encrypted)
        // - Intent extracted
        // - Result returned
        // - PII detected (types)
        // - Compliance status
        
        return ResponseEntity.ok(result);
    }
}

// Result: Passed audit. $0 fine.`} />
          </div>
        </div>
      </div>
      
      <div className="mt-6 p-4 rounded-lg bg-primary/10 border border-primary/20 text-center">
        <p className="text-sm font-bold text-primary">
          Result: Failed audit → Passed audit. $50K+ fine → $0 fine. No compliance → Compliance gold.
        </p>
      </div>
    </div>
  );
};

const PrivacyProtection = () => {
  return (
    <div className="my-16">
      <h3 className="text-2xl font-bold text-foreground mb-8 text-center">
        Privacy Protection: PII Redaction & Encryption
      </h3>
      
      <div className="grid lg:grid-cols-3 gap-4 mb-6">
        <div className="p-6 rounded-xl border border-red-500/30 bg-red-500/5">
          <h4 className="font-bold text-foreground mb-3 flex items-center gap-2">
            <XCircle className="h-5 w-5 text-red-400" />
            Original Query
          </h4>
          <CodeBlock code={`"Show me billing for john.doe@example.com"`} language="text" />
          <p className="text-xs text-muted-foreground mt-2">Contains PII: EMAIL</p>
        </div>
        
        <div className="p-6 rounded-xl border border-green-500/30 bg-green-500/5">
          <h4 className="font-bold text-foreground mb-3 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-400" />
            Redacted Query
          </h4>
          <CodeBlock code={`"Show me billing for [REDACTED]"`} language="text" />
          <p className="text-xs text-muted-foreground mt-2">PII removed, types tracked</p>
        </div>
        
        <div className="p-6 rounded-xl border border-blue-500/30 bg-blue-500/5">
          <h4 className="font-bold text-foreground mb-3 flex items-center gap-2">
            <Lock className="h-5 w-5 text-blue-400" />
            Encrypted Query
          </h4>
          <CodeBlock code={`"encrypted_base64_string"`} language="text" />
          <p className="text-xs text-muted-foreground mt-2">Access-controlled, AES-256-GCM</p>
        </div>
      </div>
      
      <div className="p-6 rounded-xl border border-primary/30 bg-primary/5">
        <h4 className="font-bold text-foreground mb-4 flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          Privacy Features
        </h4>
        <div className="grid md:grid-cols-4 gap-4">
          <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/30 text-center">
            <CheckCircle2 className="h-5 w-5 text-green-400 mx-auto mb-2" />
            <p className="text-xs font-semibold text-foreground">PII Redacted</p>
            <p className="text-xs text-muted-foreground">Automatic</p>
          </div>
          <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/30 text-center">
            <CheckCircle2 className="h-5 w-5 text-green-400 mx-auto mb-2" />
            <p className="text-xs font-semibold text-foreground">Query Encrypted</p>
            <p className="text-xs text-muted-foreground">Optional</p>
          </div>
          <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/30 text-center">
            <CheckCircle2 className="h-5 w-5 text-green-400 mx-auto mb-2" />
            <p className="text-xs font-semibold text-foreground">Types Tracked</p>
            <p className="text-xs text-muted-foreground">Not content</p>
          </div>
          <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/30 text-center">
            <CheckCircle2 className="h-5 w-5 text-green-400 mx-auto mb-2" />
            <p className="text-xs font-semibold text-foreground">Access Controlled</p>
            <p className="text-xs text-muted-foreground">Secure</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const ComplianceReports = () => {
  return (
    <div className="my-16">
      <h3 className="text-2xl font-bold text-foreground mb-8 text-center">
        Compliance Reports: GDPR, HIPAA, SOC2 Ready
      </h3>
      
      <div className="grid md:grid-cols-3 gap-6">
        <div className="p-6 rounded-xl border border-blue-500/30 bg-blue-500/5">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="h-6 w-6 text-blue-400" />
            <h4 className="font-bold text-foreground">GDPR</h4>
          </div>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-accent" />
              Data processing logs
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-accent" />
              Consent tracking
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-accent" />
              Right to access
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-accent" />
              Right to deletion
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-accent" />
              Data portability
            </li>
          </ul>
        </div>
        
        <div className="p-6 rounded-xl border border-red-500/30 bg-red-500/5">
          <div className="flex items-center gap-3 mb-4">
            <FileCheck className="h-6 w-6 text-red-400" />
            <h4 className="font-bold text-foreground">HIPAA</h4>
          </div>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-accent" />
              PHI protection logs
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-accent" />
              Access tracking
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-accent" />
              Audit trail
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-accent" />
              Incident reporting
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-accent" />
              Compliance reports
            </li>
          </ul>
        </div>
        
        <div className="p-6 rounded-xl border border-green-500/30 bg-green-500/5">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="h-6 w-6 text-green-400" />
            <h4 className="font-bold text-foreground">SOC2</h4>
          </div>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-accent" />
              Access control logs
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-accent" />
              Security incidents
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-accent" />
              Audit trails
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-accent" />
              Compliance evidence
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-accent" />
              Anomaly detection
            </li>
          </ul>
        </div>
      </div>
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
  intent-history:
    enabled: true                    # Enable audit logging
    retention-days: 90               # 90 days retention
    store-encrypted-query: true     # Encrypt original queries
    cleanup-cron: "0 0 * * * *"     # Hourly cleanup
  
  pii-detection:
    audit-logging-enabled: true      # Log PII detections`} language="yaml" />
        </div>
        
        <div className="p-6 rounded-xl border border-secondary/30 bg-secondary/5">
          <div className="flex items-center gap-3 mb-4">
            <Code className="h-6 w-6 text-secondary" />
            <h4 className="font-bold text-foreground">2. Use (Zero Code)</h4>
          </div>
          <CodeBlock code={`@RestController
public class QueryController {
    
    @Autowired
    private RAGOrchestrator orchestrator;
    
    @PostMapping("/query")
    public ResponseEntity<?> query(@RequestBody QueryRequest request,
                                   HttpServletRequest httpRequest) {
        // Orchestration automatically creates audit log
        OrchestrationResult result = orchestrator.orchestrate(
            request.getQuery(),
            OrchestrationContext.builder()
                .userId(getCurrentUser().getId())
                .sessionId(httpRequest.getSession().getId())
                .ipAddress(httpRequest.getRemoteAddr())
                .build()
        );
        
        return ResponseEntity.ok(result);
    }
}

// Audit log automatically created:
// - User ID, session ID, IP address
// - Query (redacted + encrypted)
// - Intent extracted
// - Result returned
// - PII detected (types)
// - Compliance status`} />
        </div>
      </div>
      
      <div className="mt-6 p-6 rounded-xl bg-gradient-primary text-center">
        <p className="text-primary-foreground font-semibold text-lg">
          That's it. Zero code. Automatic logging. Privacy-protected. Compliance-ready. Production-tested.
        </p>
      </div>
    </div>
  );
};

const AuditCapabilitiesStoryV2 = () => {
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
                  <span className="text-2xl">🔍</span>
                  Audit Capabilities V2 (Narrative)
                </span>
                <Link 
                  to="/docs/audit_capabilities_story"
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  View V1 →
                </Link>
              </div>
              <div className="flex items-center gap-3">
                <StoryLoveButton storySlug="audit_capabilities_story_v2" />
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
                <span className="text-gradient">Audit That Saved Everything</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mb-8">
                A compliance officer's journey from failed audits to compliance gold—how automatic audit logging 
                saved the company from massive fines.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2 text-sm text-accent">
                  <Gavel className="h-4 w-4" />
                  $50K+ Fines Avoided
                </div>
                <div className="flex items-center gap-2 rounded-full bg-secondary/10 px-4 py-2 text-sm text-secondary">
                  <Shield className="h-4 w-4" />
                  Passed Audits
                </div>
                <div className="flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm text-primary">
                  <Zap className="h-4 w-4" />
                  Zero Code
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* The Audit Journey Timeline */}
        <section className="px-6 py-12">
          <div className="max-w-4xl mx-auto">
            <TheAuditJourney />
          </div>
        </section>

        {/* Complete Audit Flow */}
        <section className="px-6 py-12 border-t border-border/50 bg-muted/30">
          <div className="max-w-4xl mx-auto">
            <CompleteAuditFlow />
          </div>
        </section>

        {/* Before & After */}
        <section className="px-6 py-12">
          <div className="max-w-4xl mx-auto">
            <BeforeAfterComparison />
          </div>
        </section>

        {/* Privacy Protection */}
        <section className="px-6 py-12">
          <div className="max-w-4xl mx-auto">
            <PrivacyProtection />
          </div>
        </section>

        {/* Compliance Reports */}
        <section className="px-6 py-12 border-t border-border/50 bg-muted/30">
          <div className="max-w-4xl mx-auto">
            <ComplianceReports />
          </div>
        </section>

        {/* What You Implement */}
        <section className="px-6 py-12">
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
                to="/docs/audit_capabilities_story"
                className="flex items-center gap-2 text-sm text-primary hover:underline"
              >
                <BookOpen className="h-4 w-4" />
                Read V1 (Visual Version)
              </Link>
              <Link
                to="/docs/guides/audit_capabilities"
                className="flex items-center gap-2 text-sm text-primary hover:underline"
              >
                <FileCode className="h-4 w-4" />
                Read Full Technical Guide
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <StoryLoveButton storySlug="audit_capabilities_story_v2" />
              <PageViewCounter />
            </div>
          </div>
        </section>
      </div>
    </DocsLayout>
  );
};

export default AuditCapabilitiesStoryV2;

