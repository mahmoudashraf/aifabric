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
  Timer,
  Gavel,
  Plug,
  Play,
  Pause,
  RotateCcw
} from "lucide-react";

const PAGE_TITLE = "Retention Capabilities: Pluggable Data Retention Policy System - AI Fabric Framework";
const PAGE_DESCRIPTION = "How we built a pluggable retention policy system that enforces GDPR, HIPAA, and custom retention rules—all while letting you define your own data lifecycle policies using the Service Provider Interface (SPI) pattern.";
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

const ComplianceFines = () => {
  const [selectedRegulation, setSelectedRegulation] = useState(0);
  
  const regulations = [
    {
      name: "GDPR",
      icon: Shield,
      color: "text-blue-400",
      borderColor: "border-blue-500/30",
      bgColor: "bg-blue-500/5",
      fine: "€20M or 4% of revenue",
      requirement: "1 year retention (right to deletion)",
      description: "EU General Data Protection Regulation"
    },
    {
      name: "HIPAA",
      icon: FileCheck,
      color: "text-red-400",
      borderColor: "border-red-500/30",
      bgColor: "bg-red-500/5",
      fine: "$50K-$1.5M per incident",
      requirement: "6 years minimum retention",
      description: "Health Insurance Portability and Accountability Act"
    }
  ];

  const current = regulations[selectedRegulation];

  return (
    <div className="my-16">
      <h3 className="text-2xl font-bold text-foreground mb-8 text-center">
        The Data Retention Nightmare: Violations Cost Millions
      </h3>
      
      <div className="flex gap-2 mb-6 justify-center">
        {regulations.map((reg, i) => {
          const Icon = reg.icon;
          return (
            <button
              key={i}
              onClick={() => setSelectedRegulation(i)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                selectedRegulation === i
                  ? `${reg.bgColor} ${reg.borderColor} border-2 shadow-lg`
                  : "bg-muted/30 border border-border/50 text-muted-foreground hover:border-border"
              }`}
            >
              <Icon className={`h-4 w-4 ${selectedRegulation === i ? reg.color : 'text-muted-foreground'}`} />
              {reg.name}
            </button>
          );
        })}
      </div>
      
      <div className={`p-6 rounded-xl border-2 ${current.borderColor} ${current.bgColor}`}>
        <div className="flex items-center gap-3 mb-4">
          {React.createElement(current.icon, {
            className: `h-6 w-6 ${current.color}`
          })}
          <div>
            <h4 className="font-bold text-foreground">{current.name}</h4>
            <p className="text-xs text-muted-foreground">{current.description}</p>
          </div>
        </div>
        <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/30 mb-4">
          <p className="text-xs font-semibold text-destructive mb-1">Penalty for Non-Compliance:</p>
          <p className="text-2xl font-bold text-destructive">{current.fine}</p>
        </div>
        <div className="p-4 rounded-lg bg-primary/10 border border-primary/30">
          <p className="text-xs font-semibold text-primary mb-1">Retention Requirement:</p>
          <p className="text-lg font-bold text-primary">{current.requirement}</p>
        </div>
        <div className="mt-4 p-3 rounded-lg bg-muted/30 border border-border/30">
          <p className="text-xs font-semibold text-foreground mb-2">Without Retention Policies:</p>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• No data lifecycle management</li>
            <li>• No retention period enforcement</li>
            <li>• No automatic cleanup</li>
            <li>• No compliance with regulations</li>
            <li>• Failed audits → Fines → Lost trust</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

const ProblemList = () => {
  const problems = [
    { icon: XCircle, text: "No data lifecycle management", color: "text-red-400" },
    { icon: XCircle, text: "No retention period enforcement", color: "text-red-400" },
    { icon: XCircle, text: "No automatic cleanup", color: "text-red-400" },
    { icon: XCircle, text: "No compliance with regulations", color: "text-red-400" },
    { icon: XCircle, text: "Failed audits → Fines → Lost trust", color: "text-red-400" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 my-6">
      {problems.map((problem, i) => {
        const Icon = problem.icon;
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            viewport={{ once: true }}
            className="flex items-center gap-3 p-4 rounded-lg bg-destructive/5 border border-destructive/30"
          >
            <Icon className={`h-5 w-5 ${problem.color}`} />
            <span className="text-sm text-muted-foreground">{problem.text}</span>
          </motion.div>
        );
      })}
    </div>
  );
};

const SolutionCard = ({ title, icon: Icon, description, code, color }: { 
  title: string; 
  icon: any; 
  description: string; 
  code: string;
  color: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="rounded-xl border border-border/50 bg-card p-6"
  >
    <div className="flex items-center gap-3 mb-4">
      <div className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
      <div>
        <h3 className="font-bold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
    <CodeBlock code={code} />
  </motion.div>
);

const FeatureCard = ({ title, icon: Icon, description, color }: {
  title: string;
  icon: any;
  description: string;
  color: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="rounded-lg border border-border/50 bg-card p-5"
  >
    <div className="flex items-center gap-3 mb-3">
      <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center`}>
        <Icon className="h-5 w-5 text-white" />
      </div>
      <h4 className="font-bold text-foreground">{title}</h4>
    </div>
    <p className="text-sm text-muted-foreground">{description}</p>
  </motion.div>
);

const CompleteRetentionFlow = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const steps = [
    {
      number: 1,
      title: "Scheduled Cleanup",
      icon: Clock,
      color: "bg-blue-500",
      description: "@Scheduled(cron = \"0 30 3 * * *\")\nDaily 3:30 AM\nAutomatic trigger"
    },
    {
      number: 2,
      title: "For Each Entity Type",
      icon: Database,
      color: "bg-purple-500",
      description: "Iterate over config\nGet retention days\nCalculate cutoff date\nFind entities older than retention"
    },
    {
      number: 3,
      title: "Check Provider",
      icon: Plug,
      color: "bg-orange-500",
      description: "if (retentionPolicyProvider != null)\nGet retention days\nCheck shouldDelete()\nExecute executeDelete()"
    },
    {
      number: 4,
      title: "Get Retention Days",
      icon: Calendar,
      color: "bg-green-500",
      description: "getRetentionDays(classification, entityType)\nGDPR: 365 days\nHIPAA: 2190 days\nDefault: 180 days"
    },
    {
      number: 5,
      title: "Should Delete?",
      icon: AlertTriangle,
      color: "bg-red-500",
      description: "shouldDelete(entity)\nCheck if never delete (-1)\nCheck if older than retention\nLegal hold? Investigation?"
    },
    {
      number: 6,
      title: "Execute Delete",
      icon: Trash2,
      color: "bg-teal-500",
      description: "executeDelete(entity)\nArchive to cold storage\nNotify stakeholders\nLog deletion event\nReturn true to proceed"
    },
    {
      number: 7,
      title: "Apply Strategy",
      icon: Settings,
      color: "bg-indigo-500",
      description: "Apply cleanup strategy\nSOFT_DELETE, ARCHIVE\nHARD_DELETE\nCompliance maintained"
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
        Complete Retention Flow: From Schedule to Compliance
      </h3>
      <p className="text-sm text-muted-foreground text-center mb-6">
        Watch how retention policies are automatically enforced with custom logic support
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

const GDPRvsHIPAAComparison = () => {
  return (
    <div className="my-16">
      <h3 className="text-2xl font-bold text-foreground mb-8 text-center">
        GDPR vs HIPAA Retention Comparison
      </h3>
      
      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        <div className="p-6 rounded-xl border border-blue-500/30 bg-blue-500/5">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="h-6 w-6 text-blue-400" />
            <h4 className="font-bold text-foreground">GDPR Retention Policy</h4>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left p-2 font-semibold text-foreground">Entity Type</th>
                  <th className="text-left p-2 font-semibold text-foreground">Classification</th>
                  <th className="text-left p-2 font-semibold text-foreground">Retention</th>
                  <th className="text-left p-2 font-semibold text-foreground">Strategy</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/30">
                  <td className="p-2 text-muted-foreground">user</td>
                  <td className="p-2 text-muted-foreground">CONFIDENTIAL</td>
                  <td className="p-2 text-muted-foreground">365 days</td>
                  <td className="p-2 text-muted-foreground">ARCHIVE</td>
                </tr>
                <tr className="border-b border-border/30">
                  <td className="p-2 text-muted-foreground">analytics</td>
                  <td className="p-2 text-muted-foreground">INTERNAL</td>
                  <td className="p-2 text-muted-foreground">90 days</td>
                  <td className="p-2 text-muted-foreground">HARD_DELETE</td>
                </tr>
                <tr className="border-b border-border/30">
                  <td className="p-2 text-muted-foreground">temporary</td>
                  <td className="p-2 text-muted-foreground">PUBLIC</td>
                  <td className="p-2 text-muted-foreground">30 days</td>
                  <td className="p-2 text-muted-foreground">HARD_DELETE</td>
                </tr>
                <tr>
                  <td className="p-2 text-muted-foreground">default</td>
                  <td className="p-2 text-muted-foreground">-</td>
                  <td className="p-2 text-muted-foreground">180 days</td>
                  <td className="p-2 text-muted-foreground">SOFT_DELETE</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-4 p-3 rounded-lg bg-green-500/10 border border-green-500/30">
            <p className="text-xs font-semibold text-foreground mb-2">Key Features:</p>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>✅ Right to deletion supported</li>
              <li>✅ 1 year retention for user data</li>
              <li>✅ Archive strategy (recoverable)</li>
              <li>✅ Automatic cleanup</li>
            </ul>
          </div>
        </div>
        
        <div className="p-6 rounded-xl border border-red-500/30 bg-red-500/5">
          <div className="flex items-center gap-3 mb-4">
            <FileCheck className="h-6 w-6 text-red-400" />
            <h4 className="font-bold text-foreground">HIPAA Retention Policy</h4>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left p-2 font-semibold text-foreground">Entity Type</th>
                  <th className="text-left p-2 font-semibold text-foreground">Classification</th>
                  <th className="text-left p-2 font-semibold text-foreground">Retention</th>
                  <th className="text-left p-2 font-semibold text-foreground">Strategy</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border/30">
                  <td className="p-2 text-muted-foreground">patient-record</td>
                  <td className="p-2 text-muted-foreground">PHI</td>
                  <td className="p-2 text-muted-foreground">2555 days</td>
                  <td className="p-2 text-muted-foreground">ARCHIVE</td>
                </tr>
                <tr className="border-b border-border/30">
                  <td className="p-2 text-muted-foreground">appointment</td>
                  <td className="p-2 text-muted-foreground">PHI</td>
                  <td className="p-2 text-muted-foreground">2190 days</td>
                  <td className="p-2 text-muted-foreground">ARCHIVE</td>
                </tr>
                <tr className="border-b border-border/30">
                  <td className="p-2 text-muted-foreground">prescription</td>
                  <td className="p-2 text-muted-foreground">PHI</td>
                  <td className="p-2 text-muted-foreground">2190 days</td>
                  <td className="p-2 text-muted-foreground">ARCHIVE</td>
                </tr>
                <tr>
                  <td className="p-2 text-muted-foreground">default</td>
                  <td className="p-2 text-muted-foreground">PHI</td>
                  <td className="p-2 text-muted-foreground">2190 days</td>
                  <td className="p-2 text-muted-foreground">ARCHIVE</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-4 p-3 rounded-lg bg-green-500/10 border border-green-500/30">
            <p className="text-xs font-semibold text-foreground mb-2">Key Features:</p>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>✅ 6 years minimum (HIPAA requirement)</li>
              <li>✅ 7 years for patient records</li>
              <li>✅ Archive strategy (compliance)</li>
              <li>✅ Legal hold support</li>
              <li>✅ Investigation support</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

const SPIPattern = () => {
  return (
    <div className="my-16">
      <h3 className="text-2xl font-bold text-foreground mb-8 text-center">
        SPI Pattern: You Define Your Rules
      </h3>
      
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-xl border border-primary/30 bg-primary/5">
          <h4 className="font-bold text-foreground mb-4 flex items-center gap-2">
            <Plug className="h-5 w-5 text-primary" />
            Framework Defines Interface
          </h4>
          <CodeBlock code={`// Framework provides the interface
public interface RetentionPolicyProvider {
    
    /**
     * Determine how long data should be retained.
     * @param classification data classification (PUBLIC, INTERNAL, CONFIDENTIAL, PHI)
     * @param entityType logical entity type
     * @return number of days to retain 
     *         (0 = delete immediately, -1 = never delete, >0 = retain for N days)
     */
    int getRetentionDays(String classification, String entityType);
    
    /**
     * Decide if the entity should be deleted.
     * @param entity entity metadata under evaluation
     * @return true when the entity should be deleted
     */
    boolean shouldDelete(AISearchableEntity entity);
    
    /**
     * Execute custom cleanup before deletion.
     * @param entity entity that is about to be deleted
     * @return true when deletion may proceed
     */
    boolean executeDelete(AISearchableEntity entity);
}`} />
        </div>
        
        <div className="p-6 rounded-xl border border-secondary/30 bg-secondary/5">
          <h4 className="font-bold text-foreground mb-4 flex items-center gap-2">
            <Code className="h-5 w-5 text-secondary" />
            You Implement Your Rules
          </h4>
          <CodeBlock code={`// You implement your retention logic
@Component
public class MyRetentionPolicyProvider 
    implements RetentionPolicyProvider {
    
    @Override
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
    
    @Override
    public boolean shouldDelete(AISearchableEntity entity) {
        // Your custom logic
        return true;
    }
    
    @Override
    public boolean executeDelete(AISearchableEntity entity) {
        // Your custom cleanup logic
        return true;
    }
}`} />
        </div>
      </div>
      
      <div className="mt-6 p-6 rounded-xl bg-gradient-primary text-center">
        <p className="text-primary-foreground font-semibold text-lg">
          Framework calls your implementation. Zero coupling. Your rules. Automatic enforcement.
        </p>
      </div>
    </div>
  );
};

const FlowStep = ({ step, title, description, code, icon: Icon, color }: {
  step: number;
  title: string;
  description: string;
  code?: string;
  icon: any;
  color: string;
}) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    className="relative pl-8 pb-8 border-l-2 border-border/50 last:border-l-0"
  >
    <div className={`absolute left-0 top-0 w-6 h-6 rounded-full ${color} flex items-center justify-center -translate-x-[13px]`}>
      <Icon className="h-4 w-4 text-white" />
    </div>
    <div className="mb-2">
      <span className="text-xs font-semibold text-primary">STEP {step}</span>
      <h4 className="text-lg font-bold text-foreground mt-1">{title}</h4>
      <p className="text-sm text-muted-foreground mt-1">{description}</p>
    </div>
    {code && <CodeBlock code={code} />}
  </motion.div>
);

const RetentionCapabilitiesStory = () => {
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
                  <span className="text-2xl">⏰</span>
                  Retention Capabilities V1
                </span>
                <Link 
                  to="/docs/retention_capabilities_story_v2"
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  View V2 (Narrative) →
                </Link>
              </div>
              <div className="flex items-center gap-3">
                <StoryLoveButton storySlug="retention_capabilities_story" />
                <PageViewCounter />
              </div>
            </div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl"
            >
              <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
                Retention Capabilities:{" "}
                <span className="text-gradient">Pluggable Data Retention</span>{" "}
                Policy System
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mb-8">
                How we built a pluggable retention policy system that enforces GDPR, HIPAA, and custom retention rules—all 
                while letting you define your own data lifecycle policies using the Service Provider Interface (SPI) pattern.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2 text-sm text-accent">
                  <Plug className="h-4 w-4" />
                  SPI Pattern
                </div>
                <div className="flex items-center gap-2 rounded-full bg-secondary/10 px-4 py-2 text-sm text-secondary">
                  <Shield className="h-4 w-4" />
                  GDPR/HIPAA Ready
                </div>
                <div className="flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm text-primary">
                  <Zap className="h-4 w-4" />
                  Automatic Enforcement
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Compliance Fines */}
        <section className="px-6 py-12">
          <div className="max-w-4xl mx-auto">
            <ComplianceFines />
          </div>
        </section>

        {/* The Problem */}
        <section className="px-6 py-12 border-t border-border/50 bg-muted/30">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl"
          >
            <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-8 mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-3">
                <AlertTriangle className="h-6 w-6 text-destructive" />
                The Data Retention Nightmare: Violations Cost Millions
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                You're building an AI application. Regulators ask:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-6">
                <li>"How long do you retain user data?"</li>
                <li>"Can you prove GDPR compliance (right to deletion)?"</li>
                <li>"Do you meet HIPAA retention requirements (6 years minimum)?"</li>
              </ul>
              <p className="text-foreground font-medium mt-6">
                <strong>What if you could enforce retention rules automatically, support right to deletion, and keep your database compliant?</strong>
              </p>
            </div>

            <h3 className="text-xl font-bold text-foreground mb-4">Without Retention Policies:</h3>
            <ProblemList />
          </motion.div>
        </section>

        {/* The Solution */}
        <section className="px-6 py-12">
          <div className="max-w-4xl">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-3">
                <Timer className="h-6 w-6 text-primary" />
                Our Solution: Pluggable Retention Policy System (SPI)
              </h2>
              <p className="text-muted-foreground mb-8">
                Define retention rules. Enforce data lifecycle. Automatic cleanup. Customizable.
              </p>
            </motion.div>

            <SolutionCard
              title="Pluggable Retention Policy Provider"
              icon={Plug}
              description="Implement RetentionPolicyProvider interface. Define your rules. Framework enforces automatically."
              color="bg-primary"
              code={`// Implement your retention rules
@Component
public class MyRetentionPolicyProvider 
    implements RetentionPolicyProvider {
    
    @Override
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
    
    @Override
    public boolean shouldDelete(AISearchableEntity entity) {
        // Check if entity is older than retention period
        int retentionDays = getRetentionDays(
            extractClassification(entity), 
            entity.getEntityType()
        );
        
        LocalDateTime cutoff = LocalDateTime.now()
            .minusDays(retentionDays);
        
        return entity.getCreatedAt().isBefore(cutoff);
    }
    
    @Override
    public boolean executeDelete(AISearchableEntity entity) {
        // Custom cleanup logic before deletion
        // e.g., archive to cold storage, notify stakeholders
        return true;  // Allow deletion
    }
}

// That's it! Framework enforces automatically.`}
            />
          </div>
        </section>

        {/* SPI Pattern */}
        <section className="px-6 py-12 border-t border-border/50 bg-muted/30">
          <div className="max-w-4xl mx-auto">
            <SPIPattern />
          </div>
        </section>

        {/* Features */}
        <section className="px-6 py-12 border-t border-border/50 bg-muted/30">
          <div className="max-w-4xl">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-bold text-foreground mb-8 flex items-center gap-3">
                <Sparkles className="h-6 w-6 text-primary" />
                What You Get
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-4">
              <FeatureCard
                title="Pluggable Retention"
                icon={Plug}
                description="Implement RetentionPolicyProvider interface. Define your retention rules. Framework enforces automatically."
                color="bg-blue-500"
              />
              <FeatureCard
                title="Compliance Ready"
                icon={Shield}
                description="GDPR, HIPAA retention support. Right to deletion. Legal hold support. Investigation support."
                color="bg-green-500"
              />
              <FeatureCard
                title="Automatic Cleanup"
                icon={Trash2}
                description="Scheduled cleanup (cron-based). Automatic retention enforcement. Zero code in cleanup."
                color="bg-purple-500"
              />
              <FeatureCard
                title="Per-Entity-Type Retention"
                icon={Database}
                description="Customizable retention per entity type. Multiple classifications (PUBLIC, INTERNAL, CONFIDENTIAL, PHI)."
                color="bg-orange-500"
              />
              <FeatureCard
                title="Custom Cleanup Logic"
                icon={Code}
                description="executeDelete hook for custom cleanup. Archive to cold storage. Notify stakeholders. Audit logging."
                color="bg-red-500"
              />
              <FeatureCard
                title="Legal Hold Support"
                icon={Gavel}
                description="shouldDelete hook for legal hold checks. Investigation support. Custom deletion logic."
                color="bg-yellow-500"
              />
            </div>
          </div>
        </section>

        {/* Complete Retention Flow */}
        <section className="px-6 py-12 border-t border-border/50 bg-muted/30">
          <div className="max-w-4xl mx-auto">
            <CompleteRetentionFlow />
          </div>
        </section>

        {/* GDPR vs HIPAA Comparison */}
        <section className="px-6 py-12">
          <div className="max-w-4xl mx-auto">
            <GDPRvsHIPAAComparison />
          </div>
        </section>

        {/* The Complete Flow */}
        <section className="px-6 py-12 border-t border-border/50 bg-muted/30">
          <div className="max-w-4xl">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-bold text-foreground mb-8 flex items-center gap-3">
                <ArrowRight className="h-6 w-6 text-primary" />
                The Complete Technical Flow
              </h2>
            </motion.div>

            <div className="space-y-6">
              <FlowStep
                step={1}
                title="Scheduled Cleanup Trigger"
                description="Daily at 3:30 AM - Retention policy cleanup runs automatically"
                icon={Clock}
                color="bg-blue-500"
                code={`@Scheduled(cron = "0 30 3 * * *")
@Transactional
public void cleanupByRetentionPolicy() {
    // For each entity type in configuration
    for (Map.Entry<String, Integer> entry : 
         properties.getRetentionDays().entrySet()) {
        String entityType = entry.getKey();
        int retentionDays = entry.getValue();
        
        // Calculate cutoff date
        LocalDateTime cutoff = 
            LocalDateTime.now(clock).minusDays(retentionDays);
        
        // Find entities older than retention
        List<AISearchableEntity> entities = 
            storageStrategy.findByEntityType(entityType);
        
        // Apply retention policy
        for (AISearchableEntity entity : entities) {
            if (shouldCleanup(entity.getCreatedAt(), cutoff)) {
                applyPolicy(entityType, entity);
            }
        }
    }
}`}
              />
              <FlowStep
                step={2}
                title="Apply Retention Policy"
                description="Check retention policy provider. Execute custom cleanup. Apply cleanup strategy."
                icon={Timer}
                color="bg-purple-500"
                code={`private void applyPolicy(String entityType, 
                              AISearchableEntity entity) {
    // Get cleanup strategy
    CleanupStrategy strategy = 
        policyProvider.getStrategy(entityType);
    
    // Check retention policy provider (if available)
    if (retentionPolicyProvider != null) {
        // Check if should delete
        if (!retentionPolicyProvider.shouldDelete(entity)) {
            return;  // Don't delete (e.g., legal hold)
        }
        
        // Execute custom cleanup
        if (!retentionPolicyProvider.executeDelete(entity)) {
            return;  // Don't delete if cleanup fails
        }
    }
    
    // Apply cleanup strategy
    switch (strategy) {
        case SOFT_DELETE -> softDelete(entity);
        case ARCHIVE -> archiveEntity(entity);
        case HARD_DELETE, CASCADE -> deleteEntity(entity);
    }
}`}
              />
            </div>
          </div>
        </section>

        {/* Real-World Examples */}
        <section className="px-6 py-12 border-t border-border/50 bg-muted/30">
          <div className="max-w-4xl">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-bold text-foreground mb-8 flex items-center gap-3">
                <Target className="h-6 w-6 text-primary" />
                Real-World Examples
              </h2>
            </motion.div>

            <div className="space-y-6">
              <div className="rounded-xl border border-primary/30 bg-primary/5 p-6">
                <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  GDPR Compliance Provider
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  GDPR-compliant data retention (1 year for user data, right to deletion).
                </p>
                <CodeBlock code={`@Component
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
        
        // GDPR: 90 days for analytics
        if ("analytics".equals(entityType)) {
            return 90;  // 3 months
        }
        
        // Default: 180 days
        return 180;
    }
    
    @Override
    public boolean shouldDelete(AISearchableEntity entity) {
        int retentionDays = getRetentionDays(
            extractClassification(entity), 
            entity.getEntityType()
        );
        
        // Check if user requested deletion (GDPR right to deletion)
        if (isDeletionRequested(entity)) {
            return true;  // Delete immediately if requested
        }
        
        LocalDateTime cutoff = 
            LocalDateTime.now().minusDays(retentionDays);
        return entity.getCreatedAt().isBefore(cutoff);
    }
    
    @Override
    public boolean executeDelete(AISearchableEntity entity) {
        // Archive to cold storage before deletion
        archiveToColdStorage(entity);
        
        // Notify user of deletion (GDPR requirement)
        notifyUser(entity, "Your data has been deleted");
        
        // Log deletion for audit (GDPR requirement)
        logDeletionForAudit(entity, "GDPR_RIGHT_TO_DELETION");
        
        return true;  // Allow deletion
    }
}

// Impact:
// - GDPR-compliant retention (1 year)
// - Right to deletion supported
// - Automatic cleanup
// - Passed GDPR audit`} />
              </div>

              <div className="rounded-xl border border-secondary/30 bg-secondary/5 p-6">
                <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
                  <FileCheck className="h-5 w-5 text-secondary" />
                  HIPAA Compliance Provider
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  HIPAA-compliant data retention (6 years minimum for PHI).
                </p>
                <CodeBlock code={`@Component
public class HIPAARetentionPolicyProvider 
    implements RetentionPolicyProvider {
    
    @Override
    public int getRetentionDays(String classification, 
                                String entityType) {
        // HIPAA: 6 years minimum for PHI
        if ("PHI".equals(classification)) {
            return 2190;  // 6 years
        }
        
        // HIPAA: 7 years for patient records
        if ("patient-record".equals(entityType)) {
            return 2555;  // 7 years
        }
        
        // Default: 6 years (HIPAA minimum)
        return 2190;
    }
    
    @Override
    public boolean shouldDelete(AISearchableEntity entity) {
        int retentionDays = getRetentionDays(
            extractClassification(entity), 
            entity.getEntityType()
        );
        
        LocalDateTime cutoff = 
            LocalDateTime.now().minusDays(retentionDays);
        boolean olderThanRetention = 
            entity.getCreatedAt().isBefore(cutoff);
        
        // Check if entity is under legal hold
        if (isUnderLegalHold(entity)) {
            return false;  // Don't delete if under legal hold
        }
        
        // Check if entity is part of active investigation
        if (isPartOfInvestigation(entity)) {
            return false;  // Don't delete if part of investigation
        }
        
        return olderThanRetention;
    }
    
    @Override
    public boolean executeDelete(AISearchableEntity entity) {
        // Archive to compliant storage before deletion
        archiveToCompliantStorage(entity);
        
        // Notify compliance officer (HIPAA requirement)
        notifyComplianceOfficer(entity, "PHI scheduled for deletion");
        
        // Log deletion for audit (HIPAA requirement)
        logDeletionForAudit(entity, "HIPAA_RETENTION_EXPIRED");
        
        return true;  // Allow deletion
    }
}

// Impact:
// - HIPAA-compliant retention (6 years minimum)
// - PHI protection
// - Legal hold support
// - Passed HIPAA audit`} />
              </div>
            </div>
          </div>
        </section>

        {/* The Bottom Line */}
        <section className="px-6 py-12 border-t border-border/50 bg-muted/30">
          <div className="max-w-4xl">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-2xl border border-primary/30 bg-primary/5 p-8"
            >
              <h2 className="text-2xl font-bold text-foreground mb-6">
                The Bottom Line
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="font-semibold text-foreground mb-3">What you get:</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <Plug className="h-4 w-4 text-primary" />
                      Pluggable retention (implement your rules)
                    </li>
                    <li className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-accent" />
                      Compliance-ready (GDPR, HIPAA retention)
                    </li>
                    <li className="flex items-center gap-2">
                      <Trash2 className="h-4 w-4 text-secondary" />
                      Automatic cleanup (scheduled enforcement)
                    </li>
                    <li className="flex items-center gap-2">
                      <Database className="h-4 w-4 text-primary" />
                      Per-entity-type retention (customizable)
                    </li>
                    <li className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-accent" />
                      Zero code in cleanup (automatic enforcement)
                    </li>
                    <li className="flex items-center gap-2">
                      <Code className="h-4 w-4 text-secondary" />
                      Customizable rules (your retention logic)
                    </li>
                    <li className="flex items-center gap-2">
                      <Gavel className="h-4 w-4 text-primary" />
                      Legal hold support (shouldDelete hook)
                    </li>
                    <li className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-accent" />
                      Audit logging (executeDelete hook)
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-3">What you implement:</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-accent" />
                      Required: RetentionPolicyProvider interface
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-accent" />
                      Optional: Custom retention rules
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-accent" />
                      Optional: Custom cleanup logic
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-accent" />
                      Optional: Legal hold support
                    </li>
                  </ul>
                </div>
              </div>
              <div className="rounded-lg bg-gradient-primary p-6 text-center">
                <p className="text-primary-foreground font-semibold text-lg">
                  Result: Pluggable retention. Compliance-ready. Automatic enforcement. Zero code in cleanup. Production-tested.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <section className="px-6 py-8 border-t border-border/50">
          <div className="max-w-4xl flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <Link
                to="/docs/retention_capabilities_story_v2"
                className="flex items-center gap-2 text-sm text-primary hover:underline"
              >
                <BookOpen className="h-4 w-4" />
                Read V2 (Narrative Version)
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
              <StoryLoveButton storySlug="retention_capabilities_story" />
              <PageViewCounter />
            </div>
          </div>
        </section>
      </div>
    </DocsLayout>
  );
};

export default RetentionCapabilitiesStory;

