import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Highlight, themes } from "prism-react-renderer";
import DocsLayout from "@/components/docs/DocsLayout";
import PageViewCounter from "@/components/PageViewCounter";
import StoryLoveButton from "@/components/StoryLoveButton";
import { 
  Clock, 
  Zap, 
  Database, 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  Timer,
  Layers,
  RefreshCw,
  Shield,
  DollarSign,
  TrendingUp,
  ChevronDown
} from "lucide-react";
import indexingStoryContent from "@/content/indexing-strategies-story.md?raw";

const PAGE_TITLE = "The Indexing Dilemma - AI Fabric Framework";
const PAGE_DESCRIPTION = "When milliseconds cost millions: How we built a queue system that handles 500,000 entities/day without blocking a single HTTP request.";
const OG_IMAGE = "/assets/story-preview.png";

const codeTheme = {
  ...themes.nightOwl,
  plain: {
    ...themes.nightOwl.plain,
    backgroundColor: "hsl(var(--code-bg))",
  },
};

const CodeBlock = ({ children, className }: { children: string; className?: string }) => {
  const match = /language-(\w+)/.exec(className || "");
  const language = match ? match[1] : "text";

  return (
    <Highlight theme={codeTheme} code={children.trim()} language={language}>
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
};

// Interactive Strategy Card Component
const StrategyCard = ({ 
  strategy, 
  icon: Icon, 
  color, 
  timing, 
  description, 
  pros, 
  cons, 
  useCases,
  isExpanded,
  onToggle
}: {
  strategy: string;
  icon: any;
  color: string;
  timing: string;
  description: string;
  pros: string[];
  cons: string[];
  useCases: string[];
  isExpanded: boolean;
  onToggle: () => void;
}) => (
  <motion.div 
    layout
    className={`rounded-xl border-2 ${color} bg-card overflow-hidden cursor-pointer`}
    onClick={onToggle}
    whileHover={{ scale: 1.01 }}
  >
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-lg bg-gradient-to-br ${color.replace('border-', 'from-')}/20 to-transparent`}>
            <Icon className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground">{strategy}</h3>
            <p className="text-sm text-muted-foreground">{timing}</p>
          </div>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="h-5 w-5 text-muted-foreground" />
        </motion.div>
      </div>
      <p className="mt-3 text-muted-foreground">{description}</p>
    </div>
    
    <AnimatePresence>
      {isExpanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="border-t border-border/50"
        >
          <div className="p-6 grid md:grid-cols-3 gap-4">
            <div>
              <h4 className="font-semibold text-green-400 flex items-center gap-2 mb-2">
                <CheckCircle2 className="h-4 w-4" /> Pros
              </h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                {pros.map((pro, i) => <li key={i}>• {pro}</li>)}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-red-400 flex items-center gap-2 mb-2">
                <XCircle className="h-4 w-4" /> Cons
              </h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                {cons.map((con, i) => <li key={i}>• {con}</li>)}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-primary flex items-center gap-2 mb-2">
                <Zap className="h-4 w-4" /> Use Cases
              </h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                {useCases.map((uc, i) => <li key={i}>• {uc}</li>)}
              </ul>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </motion.div>
);

// Data Flow Diagram Component
const DataFlowDiagram = () => {
  const [activeStep, setActiveStep] = useState(0);
  
  const steps = [
    { label: "User Saves Entity", icon: Database, color: "bg-blue-500" },
    { label: "AICapable Aspect", icon: Zap, color: "bg-purple-500" },
    { label: "Strategy Resolver", icon: RefreshCw, color: "bg-amber-500" },
    { label: "Coordinator", icon: Layers, color: "bg-green-500" },
    { label: "Queue/Execute", icon: Timer, color: "bg-primary" },
  ];
  
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="my-8 p-6 rounded-xl bg-card border border-border/50">
      <h3 className="text-lg font-bold text-foreground mb-6 text-center">Indexing Pipeline Flow</h3>
      <div className="flex flex-wrap justify-center items-center gap-2 md:gap-4">
        {steps.map((step, i) => (
          <div key={i} className="flex items-center gap-2 md:gap-4">
            <motion.div
              animate={{
                scale: activeStep === i ? 1.1 : 1,
                opacity: activeStep >= i ? 1 : 0.4,
              }}
              className={`flex flex-col items-center gap-2 p-3 rounded-lg ${activeStep === i ? 'bg-primary/20' : 'bg-muted/30'}`}
            >
              <div className={`p-2 rounded-full ${step.color}`}>
                <step.icon className="h-4 w-4 text-white" />
              </div>
              <span className="text-xs text-center text-muted-foreground max-w-[80px]">{step.label}</span>
            </motion.div>
            {i < steps.length - 1 && (
              <motion.div
                animate={{ opacity: activeStep > i ? 1 : 0.3 }}
              >
                <ArrowRight className="h-4 w-4 text-muted-foreground hidden md:block" />
              </motion.div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Strategy Comparison Table
const StrategyComparison = () => (
  <div className="my-8 overflow-x-auto">
    <table className="w-full border border-border/50 rounded-lg overflow-hidden">
      <thead className="bg-muted/50">
        <tr>
          <th className="px-4 py-3 text-left font-semibold text-foreground">Strategy</th>
          <th className="px-4 py-3 text-left font-semibold text-foreground">Response Time</th>
          <th className="px-4 py-3 text-left font-semibold text-foreground">Searchable In</th>
          <th className="px-4 py-3 text-left font-semibold text-foreground">Best For</th>
        </tr>
      </thead>
      <tbody>
        <tr className="border-t border-border/50">
          <td className="px-4 py-3 font-medium text-red-400">SYNC</td>
          <td className="px-4 py-3 text-muted-foreground">+50-500ms</td>
          <td className="px-4 py-3 text-muted-foreground">Immediately</td>
          <td className="px-4 py-3 text-muted-foreground">Compliance, GDPR</td>
        </tr>
        <tr className="border-t border-border/50 bg-primary/5">
          <td className="px-4 py-3 font-medium text-green-400">ASYNC ⭐</td>
          <td className="px-4 py-3 text-muted-foreground">+5-10ms</td>
          <td className="px-4 py-3 text-muted-foreground">1-5 seconds</td>
          <td className="px-4 py-3 text-muted-foreground">95% of entities</td>
        </tr>
        <tr className="border-t border-border/50">
          <td className="px-4 py-3 font-medium text-amber-400">BATCH</td>
          <td className="px-4 py-3 text-muted-foreground">+5-10ms</td>
          <td className="px-4 py-3 text-muted-foreground">15-60 seconds</td>
          <td className="px-4 py-3 text-muted-foreground">Analytics, logs</td>
        </tr>
      </tbody>
    </table>
  </div>
);

// Impact Metrics Component
const ImpactMetrics = () => {
  const metrics = [
    { label: "Revenue Saved", value: "$2.1M", icon: DollarSign, color: "text-green-400" },
    { label: "Cost Reduction", value: "99%", icon: TrendingUp, color: "text-primary" },
    { label: "GDPR Compliance", value: "100%", icon: Shield, color: "text-blue-400" },
    { label: "Entities/Day", value: "500K+", icon: Database, color: "text-amber-400" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-8">
      {metrics.map((metric, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          viewport={{ once: true }}
          className="p-4 rounded-xl bg-card border border-border/50 text-center"
        >
          <metric.icon className={`h-6 w-6 mx-auto mb-2 ${metric.color}`} />
          <div className={`text-2xl font-bold ${metric.color}`}>{metric.value}</div>
          <div className="text-xs text-muted-foreground">{metric.label}</div>
        </motion.div>
      ))}
    </div>
  );
};

// Decision Tree Component
const DecisionTree = () => (
  <div className="my-8 p-6 rounded-xl bg-card border border-border/50">
    <h3 className="text-lg font-bold text-foreground mb-6 text-center">Strategy Decision Tree</h3>
    <div className="flex flex-col items-center gap-4">
      {/* Root Question */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        className="px-6 py-3 rounded-lg bg-primary/20 border border-primary/50 text-center"
      >
        <span className="text-foreground font-medium">Is this compliance/legal?</span>
      </motion.div>
      
      <div className="flex gap-8 md:gap-16">
        {/* YES Branch */}
        <div className="flex flex-col items-center gap-2">
          <span className="text-green-400 font-semibold text-sm">YES</span>
          <div className="w-px h-4 bg-green-400"></div>
          <div className="px-4 py-2 rounded-lg bg-red-500/20 border border-red-500/50">
            <span className="text-red-400 font-bold">SYNC</span>
          </div>
        </div>
        
        {/* NO Branch */}
        <div className="flex flex-col items-center gap-2">
          <span className="text-red-400 font-semibold text-sm">NO</span>
          <div className="w-px h-4 bg-red-400"></div>
          <div className="px-4 py-2 rounded-lg bg-muted/50 border border-border/50 text-center">
            <span className="text-muted-foreground text-sm">User-facing?</span>
          </div>
          
          <div className="flex gap-6">
            <div className="flex flex-col items-center gap-2">
              <span className="text-green-400 text-xs">YES</span>
              <div className="w-px h-3 bg-green-400"></div>
              <div className="px-3 py-1.5 rounded-lg bg-green-500/20 border border-green-500/50">
                <span className="text-green-400 font-bold text-sm">ASYNC</span>
              </div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="text-red-400 text-xs">NO</span>
              <div className="w-px h-3 bg-red-400"></div>
              <div className="px-3 py-1.5 rounded-lg bg-amber-500/20 border border-amber-500/50">
                <span className="text-amber-400 font-bold text-sm">BATCH</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Architecture Diagram
const ArchitectureDiagram = () => (
  <div className="my-8 p-6 rounded-xl bg-card border border-border/50 overflow-x-auto">
    <h3 className="text-lg font-bold text-foreground mb-6 text-center">System Architecture</h3>
    <div className="min-w-[600px]">
      <svg viewBox="0 0 800 400" className="w-full h-auto">
        {/* Background Grid */}
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="hsl(var(--border))" strokeWidth="0.5" opacity="0.3"/>
          </pattern>
        </defs>
        <rect width="800" height="400" fill="url(#grid)"/>
        
        {/* HTTP Request Box */}
        <rect x="20" y="160" width="100" height="60" rx="8" fill="hsl(var(--primary))" opacity="0.2" stroke="hsl(var(--primary))" strokeWidth="2"/>
        <text x="70" y="195" textAnchor="middle" fill="hsl(var(--foreground))" fontSize="12" fontWeight="bold">HTTP Request</text>
        
        {/* Arrow */}
        <path d="M 130 190 L 170 190" stroke="hsl(var(--muted-foreground))" strokeWidth="2" markerEnd="url(#arrow)"/>
        
        {/* Repository Box */}
        <rect x="180" y="160" width="100" height="60" rx="8" fill="hsl(var(--accent))" opacity="0.2" stroke="hsl(var(--accent))" strokeWidth="2"/>
        <text x="230" y="190" textAnchor="middle" fill="hsl(var(--foreground))" fontSize="11" fontWeight="bold">repo.save()</text>
        <text x="230" y="205" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="10">Entity</text>
        
        {/* Arrow */}
        <path d="M 290 190 L 330 190" stroke="hsl(var(--muted-foreground))" strokeWidth="2"/>
        
        {/* Coordinator Box */}
        <rect x="340" y="140" width="120" height="100" rx="8" fill="hsl(var(--chart-1))" opacity="0.2" stroke="hsl(var(--chart-1))" strokeWidth="2"/>
        <text x="400" y="170" textAnchor="middle" fill="hsl(var(--foreground))" fontSize="11" fontWeight="bold">IndexingCoordinator</text>
        <text x="400" y="190" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="10">SYNC → executeNow()</text>
        <text x="400" y="205" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="10">ASYNC → enqueue()</text>
        <text x="400" y="220" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="10">BATCH → enqueue()</text>
        
        {/* SYNC Path - Up */}
        <path d="M 400 140 L 400 80 L 550 80" stroke="#ef4444" strokeWidth="2" fill="none"/>
        <rect x="560" y="55" width="100" height="50" rx="8" fill="#ef4444" opacity="0.2" stroke="#ef4444" strokeWidth="2"/>
        <text x="610" y="75" textAnchor="middle" fill="hsl(var(--foreground))" fontSize="10" fontWeight="bold">SYNC</text>
        <text x="610" y="90" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="9">+450ms blocks</text>
        
        {/* Queue Path - Right */}
        <path d="M 460 190 L 560 190" stroke="hsl(var(--muted-foreground))" strokeWidth="2"/>
        <rect x="560" y="160" width="100" height="60" rx="8" fill="hsl(var(--chart-2))" opacity="0.2" stroke="hsl(var(--chart-2))" strokeWidth="2"/>
        <text x="610" y="185" textAnchor="middle" fill="hsl(var(--foreground))" fontSize="10" fontWeight="bold">Queue Table</text>
        <text x="610" y="200" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="9">ai_indexing_queue</text>
        
        {/* ASYNC Worker - Down Left */}
        <path d="M 580 220 L 580 290 L 520 290" stroke="#22c55e" strokeWidth="2" fill="none"/>
        <rect x="430" y="265" width="90" height="50" rx="8" fill="#22c55e" opacity="0.2" stroke="#22c55e" strokeWidth="2"/>
        <text x="475" y="285" textAnchor="middle" fill="hsl(var(--foreground))" fontSize="10" fontWeight="bold">AsyncWorker</text>
        <text x="475" y="300" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="9">every 1s, batch 10</text>
        
        {/* BATCH Worker - Down Right */}
        <path d="M 640 220 L 640 290 L 700 290" stroke="#f59e0b" strokeWidth="2" fill="none"/>
        <rect x="700" y="265" width="90" height="50" rx="8" fill="#f59e0b" opacity="0.2" stroke="#f59e0b" strokeWidth="2"/>
        <text x="745" y="285" textAnchor="middle" fill="hsl(var(--foreground))" fontSize="10" fontWeight="bold">BatchWorker</text>
        <text x="745" y="300" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="9">every 15s, batch 100</text>
        
        {/* All paths converge to Processor */}
        <path d="M 610 115 L 610 360 L 400 360" stroke="hsl(var(--muted-foreground))" strokeWidth="1" strokeDasharray="4" fill="none"/>
        <path d="M 475 315 L 475 360 L 400 360" stroke="hsl(var(--muted-foreground))" strokeWidth="1" strokeDasharray="4" fill="none"/>
        <path d="M 745 315 L 745 360 L 400 360" stroke="hsl(var(--muted-foreground))" strokeWidth="1" strokeDasharray="4" fill="none"/>
        
        {/* Final Box */}
        <rect x="300" y="340" width="200" height="45" rx="8" fill="hsl(var(--primary))" opacity="0.3" stroke="hsl(var(--primary))" strokeWidth="2"/>
        <text x="400" y="365" textAnchor="middle" fill="hsl(var(--foreground))" fontSize="11" fontWeight="bold">Entity Searchable ✓</text>
        
        {/* Arrow marker definition */}
        <defs>
          <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L0,6 L9,3 z" fill="hsl(var(--muted-foreground))"/>
          </marker>
        </defs>
      </svg>
    </div>
  </div>
);

// Retry Timeline Component
const RetryTimeline = () => {
  const attempts = [
    { attempt: 1, delay: "Immediate", status: "fail" },
    { attempt: 2, delay: "+2s", status: "fail" },
    { attempt: 3, delay: "+4s", status: "fail" },
    { attempt: 4, delay: "+8s", status: "fail" },
    { attempt: 5, delay: "+16s", status: "fail" },
    { attempt: 6, delay: "Dead Letter", status: "dead" },
  ];

  return (
    <div className="my-8 p-6 rounded-xl bg-card border border-border/50">
      <h3 className="text-lg font-bold text-foreground mb-6 text-center">Exponential Backoff Retry System</h3>
      <div className="flex flex-wrap justify-center items-center gap-3">
        {attempts.map((a, i) => (
          <div key={i} className="flex items-center gap-2">
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className={`flex flex-col items-center p-3 rounded-lg ${
                a.status === "dead" 
                  ? "bg-red-500/20 border border-red-500/50" 
                  : "bg-amber-500/20 border border-amber-500/50"
              }`}
            >
              <span className="text-xs text-muted-foreground">Attempt {a.attempt}</span>
              <span className={`text-sm font-bold ${a.status === "dead" ? "text-red-400" : "text-amber-400"}`}>
                {a.delay}
              </span>
            </motion.div>
            {i < attempts.length - 1 && (
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const IndexingStrategiesStory = () => {
  const [expandedStrategy, setExpandedStrategy] = useState<string | null>("ASYNC");

  useEffect(() => {
    document.title = PAGE_TITLE;

    const absoluteOgImage = `${window.location.origin}${OG_IMAGE}`;

    const updateMeta = (selector: string, attribute: string, value: string) => {
      let element = document.querySelector(selector) as HTMLMetaElement | null;
      if (!element) {
        element = document.createElement("meta");
        if (selector.includes("property=")) {
          element.setAttribute("property", selector.match(/property="([^"]+)"/)?.[1] || "");
        } else if (selector.includes("name=")) {
          element.setAttribute("name", selector.match(/name="([^"]+)"/)?.[1] || "");
        }
        document.head.appendChild(element);
      }
      element.setAttribute(attribute, value);
    };

    updateMeta('meta[name="description"]', "content", PAGE_DESCRIPTION);
    updateMeta('meta[property="og:title"]', "content", PAGE_TITLE);
    updateMeta('meta[property="og:description"]', "content", PAGE_DESCRIPTION);
    updateMeta('meta[property="og:image"]', "content", absoluteOgImage);
  }, []);

  const strategies = [
    {
      strategy: "SYNC",
      icon: AlertTriangle,
      color: "border-red-500/50",
      timing: "+50-500ms response",
      description: "Run indexing synchronously in the same transaction. Use for compliance-critical paths.",
      pros: ["Immediate consistency", "Entity searchable instantly", "Simple error handling"],
      cons: ["Slow response times", "Failures block requests", "Doesn't scale"],
      useCases: ["GDPR deletes", "Fraud detection", "Critical deletions"],
    },
    {
      strategy: "ASYNC",
      icon: Zap,
      color: "border-green-500/50",
      timing: "+5-10ms response ⭐ Recommended",
      description: "Enqueue for near-real-time processing. Default for most CRUD flows.",
      pros: ["Fast responses (+5-10ms)", "Built-in retry", "Scales to high throughput"],
      cons: ["Small delay (1-5s)", "Eventual consistency"],
      useCases: ["Products, users, articles", "Standard CRUD", "95% of entities"],
    },
    {
      strategy: "BATCH",
      icon: Layers,
      color: "border-amber-500/50",
      timing: "+5-10ms, indexed in 15-60s",
      description: "Scheduled batch processing. Ideal for high-volume data with eventual consistency.",
      pros: ["Extremely efficient", "Minimizes API costs", "Perfect for high-volume"],
      cons: ["Longer delay (15-60s)", "Not for user-facing"],
      useCases: ["Analytics events", "Log entries", "Background enrichment"],
    },
  ];

  return (
    <DocsLayout>
      <div className="min-h-screen">
        {/* Hero Header */}
        <section className="border-b border-border/50 px-6 py-8 bg-gradient-to-br from-primary/5 via-transparent to-accent/5">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-400">
                  ⚡ Performance Guide V1
                </span>
                <Link 
                  to="/docs/indexing_story_v2"
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  View V2 (Narrative) →
                </Link>
              </div>
              <h1 className="text-2xl md:text-4xl font-bold text-foreground">
                The Indexing Dilemma
              </h1>
              <p className="text-lg text-muted-foreground mt-2">
                When Milliseconds Cost Millions
              </p>
            </div>
            <div className="flex items-center gap-3">
              <StoryLoveButton storySlug="indexing_strategies" />
              <PageViewCounter />
            </div>
          </div>
        </section>

        {/* Impact Metrics */}
        <section className="px-6 py-8">
          <ImpactMetrics />
        </section>

        {/* The Question */}
        <section className="px-6 pb-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="p-6 rounded-xl bg-gradient-to-br from-primary/10 via-card to-accent/10 border border-border/50"
          >
            <h2 className="text-xl font-bold text-foreground mb-4">The $2M Question</h2>
            <p className="text-muted-foreground mb-4">You just saved a product. Should it be searchable:</p>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30">
                <span className="font-bold text-red-400">A)</span> Right now <span className="text-red-400">(+500ms)</span>
              </div>
              <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30">
                <span className="font-bold text-green-400">B)</span> In 2 seconds <span className="text-green-400">(+5ms)</span>
              </div>
              <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30">
                <span className="font-bold text-amber-400">C)</span> In 15 seconds <span className="text-amber-400">(+5ms)</span>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Data Flow Diagram */}
        <section className="px-6 pb-8">
          <DataFlowDiagram />
        </section>

        {/* Strategy Cards */}
        <section className="px-6 pb-8">
          <h2 className="text-2xl font-bold text-foreground mb-6">The 4 Indexing Strategies</h2>
          <div className="space-y-4">
            {strategies.map((s) => (
              <StrategyCard
                key={s.strategy}
                {...s}
                isExpanded={expandedStrategy === s.strategy}
                onToggle={() => setExpandedStrategy(expandedStrategy === s.strategy ? null : s.strategy)}
              />
            ))}
          </div>
        </section>

        {/* Comparison Table */}
        <section className="px-6 pb-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">Quick Comparison</h2>
          <StrategyComparison />
        </section>

        {/* Architecture Diagram */}
        <section className="px-6 pb-8">
          <ArchitectureDiagram />
        </section>

        {/* Decision Tree */}
        <section className="px-6 pb-8">
          <DecisionTree />
        </section>

        {/* Retry Timeline */}
        <section className="px-6 pb-8">
          <RetryTimeline />
        </section>

        {/* Full Markdown Content */}
        <motion.article 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="prose prose-invert max-w-none px-6 py-8 border-t border-border/50"
        >
          <h2 className="text-2xl font-bold text-foreground mb-6">Full Technical Guide</h2>
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ children }) => (
                <h1 className="text-3xl font-bold text-foreground mt-8 mb-4 first:mt-0">{children}</h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-2xl font-bold text-foreground mt-8 mb-4 border-b border-border/50 pb-2">{children}</h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">{children}</h3>
              ),
              p: ({ children }) => (
                <p className="text-muted-foreground leading-relaxed mb-4">{children}</p>
              ),
              ul: ({ children }) => (
                <ul className="list-disc list-inside space-y-2 mb-4 text-muted-foreground">{children}</ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal list-inside space-y-2 mb-4 text-muted-foreground">{children}</ol>
              ),
              li: ({ children }) => (
                <li className="text-muted-foreground">{children}</li>
              ),
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-primary pl-4 italic text-foreground my-4">
                  {children}
                </blockquote>
              ),
              code: ({ className, children, ...props }) => {
                const isInline = !className;
                if (isInline) {
                  return (
                    <code className="rounded bg-muted px-1.5 py-0.5 text-sm font-mono text-primary" {...props}>
                      {children}
                    </code>
                  );
                }
                return <CodeBlock className={className}>{String(children)}</CodeBlock>;
              },
              pre: ({ children }) => <>{children}</>,
              hr: () => <hr className="border-border/50 my-8" />,
              a: ({ href, children }) => (
                <a href={href} className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                  {children}
                </a>
              ),
              strong: ({ children }) => (
                <strong className="font-semibold text-foreground">{children}</strong>
              ),
            }}
          >
            {indexingStoryContent}
          </ReactMarkdown>

          {/* Footer */}
          <footer className="border-t border-border/50 pt-8 mt-12">
            <div className="flex flex-col items-center gap-4">
              <StoryLoveButton storySlug="indexing-story" />
              <p className="text-sm text-muted-foreground text-center">
                Part of the AI Fabric Framework series — under active development for Q1 2026
              </p>
            </div>
          </footer>
        </motion.article>
      </div>
    </DocsLayout>
  );
};

export default IndexingStrategiesStory;
