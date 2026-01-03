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
  Clock,
  DollarSign,
  Database,
  Code,
  Settings,
  Search,
  Layers,
  Shield,
  Eye,
  Users,
  FileCode,
  BookOpen,
  Play,
  Pause,
  RotateCcw,
  AlertTriangle,
  TrendingUp,
  Lightbulb,
  Rocket,
  Cpu,
  Filter,
  Gavel,
  Lock,
  Target
} from "lucide-react";

const PAGE_TITLE = "Relationship Query Intelligence V2: The Friday 4 PM Question That Changed Everything - AI Fabric Framework";
const PAGE_DESCRIPTION = "A CFO's journey from 3-day SQL waits to real-time answers—how natural language queries saved $500K and freed developers.";
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

const TheFridayQuestion = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const steps = [
    {
      time: "Friday 4:00 PM",
      title: "The Question",
      icon: MessageSquare,
      color: "text-blue-400",
      bgColor: "bg-blue-500/5",
      borderColor: "border-blue-500/30",
      events: [
        { emoji: "📧", text: "CFO: 'Which product categories have the highest return rate?'", type: "normal" },
        { emoji: "📅", text: "CFO: 'Need for Monday board meeting'", type: "normal" },
        { emoji: "😊", text: "Developer: 'Sure, I'll get that to you by Monday'", type: "positive" }
      ]
    },
    {
      time: "Friday 4:30 PM",
      title: "The SQL Nightmare",
      icon: Code,
      color: "text-orange-400",
      bgColor: "bg-orange-500/5",
      borderColor: "border-orange-500/30",
      events: [
        { emoji: "💻", text: "Opens IDE, starts writing SQL...", type: "warning" },
        { emoji: "😰", text: "30+ lines of JOINs, GROUP BY, HAVING...", type: "error" },
        { emoji: "🐛", text: "First attempt: Syntax error", type: "error" },
        { emoji: "🔍", text: "Second attempt: Wrong results", type: "error" }
      ]
    },
    {
      time: "Friday 6:00 PM",
      title: "The Realization",
      icon: AlertTriangle,
      color: "text-red-400",
      bgColor: "bg-red-500/5",
      borderColor: "border-red-500/30",
      events: [
        { emoji: "🤔", text: "Wait... is it customerOrders or orders?", type: "warning" },
        { emoji: "📚", text: "Checks documentation... outdated", type: "error" },
        { emoji: "🔍", text: "Searches codebase... 200+ files", type: "error" },
        { emoji: "😤", text: "2 hours wasted, still no answer", type: "critical" }
      ]
    },
    {
      time: "Monday 9:00 AM",
      title: "The Delivery",
      icon: CheckCircle2,
      color: "text-green-400",
      bgColor: "bg-green-500/5",
      borderColor: "border-green-500/30",
      events: [
        { emoji: "📊", text: "Finally delivers query results", type: "positive" },
        { emoji: "⏰", text: "CFO: 'This was for Friday's meeting...'", type: "warning" },
        { emoji: "💸", text: "Decision delayed = $50K opportunity cost", type: "critical" }
      ]
    },
    {
      time: "Monday 2:00 PM",
      title: "The Solution",
      icon: Lightbulb,
      color: "text-purple-400",
      bgColor: "bg-purple-500/5",
      borderColor: "border-purple-500/30",
      events: [
        { emoji: "💡", text: "Discovers: Relationship Query Intelligence", type: "positive" },
        { emoji: "✨", text: "One annotation, zero SQL knowledge needed", type: "positive" },
        { emoji: "🚀", text: "Natural language → Perfect query automatically", type: "positive" }
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
    <div className="my-12 p-8 rounded-2xl bg-gradient-to-br from-blue-500/5 to-purple-500/5 border border-border/50">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Clock className="h-5 w-5 text-primary" />
            The Friday 4 PM Question That Changed Everything
          </h3>
          <p className="text-sm text-muted-foreground mt-1">Watch how one question led to a complete transformation</p>
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
              <span className={`text-xs ${activeStep === i ? 'text-foreground' : ''}`}>{step.time}</span>
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
          <Lightbulb className="h-8 w-8 text-green-400 mx-auto mb-3" />
          <p className="text-lg font-bold text-green-400 mb-2">The Transformation Complete</p>
          <p className="text-sm text-muted-foreground">
            From 3-day SQL waits to real-time natural language queries. The CFO gets answers instantly. Developers build features.
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
          Before: The SQL Nightmare
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
          After: Natural Language Magic
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
              The Old Way: SQL Hell
            </h4>
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-muted/30">
                <p className="text-sm text-muted-foreground mb-2">CFO asks:</p>
                <p className="text-foreground font-medium">"Which product categories have the highest return rate?"</p>
              </div>
              <CodeBlock code={`-- Developer writes 30+ lines of SQL
SELECT 
    p.category,
    COUNT(DISTINCT o.id) as total_orders,
    COUNT(DISTINCT r.id) as returns,
    (COUNT(DISTINCT r.id) * 100.0 / COUNT(DISTINCT o.id)) as return_rate
FROM products p
JOIN order_items oi ON p.id = oi.product_id
JOIN orders o ON oi.order_id = o.id
LEFT JOIN returns r ON o.id = r.order_id
WHERE o.created_at >= DATE_SUB(NOW(), INTERVAL 1 YEAR)
GROUP BY p.category
HAVING return_rate > 5
ORDER BY return_rate DESC;

-- Wait, is it order_items or orderItems?
-- Is it product_id or productId?
-- 2 hours later... still debugging`} language="sql" />
              <div className="grid grid-cols-3 gap-3 mt-4">
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-center">
                  <div className="text-red-400 font-bold text-lg">2-3 hours</div>
                  <div className="text-xs text-muted-foreground">Per query</div>
                </div>
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-center">
                  <div className="text-red-400 font-bold text-lg">$150K/year</div>
                  <div className="text-xs text-muted-foreground">Developer time</div>
                </div>
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-center">
                  <div className="text-red-400 font-bold text-lg">3 days</div>
                  <div className="text-xs text-muted-foreground">Average wait time</div>
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
              The New Way: Natural Language
            </h4>
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-muted/30">
                <p className="text-sm text-muted-foreground mb-2">CFO asks:</p>
                <p className="text-foreground font-medium">"Which product categories have the highest return rate?"</p>
              </div>
              <CodeBlock code={`@Autowired
private ReliableRelationshipQueryService queryService;

// CFO asks in natural language
RAGResponse response = queryService.execute(
    "Which product categories have the highest return rate?"
);

// System automatically:
// 1. Discovers schema (Product, Order, Return entities)
// 2. LLM understands: category, return rate calculation
// 3. Generates perfect JPQL with JOINs
// 4. Executes query
// 5. Returns results

// Time: 5 seconds
// SQL knowledge required: ZERO`} />
              <div className="grid grid-cols-3 gap-3 mt-4">
                <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/30 text-center">
                  <div className="text-green-400 font-bold text-lg">5 seconds</div>
                  <div className="text-xs text-muted-foreground">Per query</div>
                </div>
                <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/30 text-center">
                  <div className="text-green-400 font-bold text-lg">$0</div>
                  <div className="text-xs text-muted-foreground">Developer time</div>
                </div>
                <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/30 text-center">
                  <div className="text-green-400 font-bold text-lg">Real-time</div>
                  <div className="text-xs text-muted-foreground">Instant answers</div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const TheMagicFlow = () => {
  const [activeStep, setActiveStep] = useState(0);
  
  const flowSteps = [
    {
      step: 1,
      title: "User Asks Question",
      icon: MessageSquare,
      color: "text-blue-400",
      description: "CFO types: 'Show VIP customers who ordered electronics in Q4'",
      code: `"Show VIP customers who ordered electronics in Q4"`
    },
    {
      step: 2,
      title: "Schema Discovery",
      icon: Database,
      color: "text-purple-400",
      description: "System automatically discovers all entities and relationships",
      code: `// At startup, system discovers:
// - Customer entity (tier field)
// - Order entity (createdAt field)
// - Product entity (category field)
// - Relationships: Customer.orders → Order
//                  Order.items → OrderItem
//                  OrderItem.product → Product`
    },
    {
      step: 3,
      title: "LLM Intent Extraction",
      icon: Brain,
      color: "text-orange-400",
      description: "LLM understands intent and generates query plan",
      code: `{
  "primaryEntity": "Customer",
  "filters": ["tier=VIP"],
  "relationships": ["customer→orders→products"],
  "additionalFilters": [
    "category=Electronics",
    "Q4 2024 date range"
  ],
  "confidence": 0.91
}`
    },
    {
      step: 4,
      title: "JPQL Generation",
      icon: Code,
      color: "text-green-400",
      description: "Framework generates JPQL automatically",
      code: `SELECT DISTINCT c FROM Customer c
  JOIN c.orders o
  JOIN o.items oi
  JOIN oi.product p
WHERE c.tier = 'VIP'
  AND p.category = 'Electronics'
  AND o.createdAt >= '2024-10-01'
  AND o.createdAt < '2025-01-01'`
    },
    {
      step: 5,
      title: "Execution & Results",
      icon: Zap,
      color: "text-cyan-400",
      description: "4-level fallback ensures results, returns instantly",
      code: `Results: [
  Customer(id=123, tier=VIP, ...),
  Customer(id=456, tier=VIP, ...)
]

Processing time: 450ms
Confidence: 0.91`
    }
  ];

  return (
    <div className="my-12">
      <h3 className="text-xl font-bold text-foreground mb-6 text-center">
        The Magic Flow: From Question to Answer
      </h3>
      <div className="flex flex-wrap justify-center items-center gap-3 mb-6">
        {flowSteps.map((step, i) => {
          const Icon = step.icon;
          const isActive = activeStep === i;
          return (
            <div key={i} className="flex items-center gap-2">
              <motion.div
                animate={{
                  scale: isActive ? 1.1 : 1,
                  opacity: isActive ? 1 : 0.6,
                }}
                onClick={() => setActiveStep(i)}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  isActive
                    ? `${step.color.replace('text-', 'border-')} bg-${step.color.split('-')[1]}-500/10 shadow-lg`
                    : 'border-border/50 bg-muted/30'
                }`}
                style={{ minWidth: '140px' }}
              >
                <div className={`p-2 rounded-full ${step.color.replace('text-', 'bg-')} ${!isActive ? 'opacity-50' : ''}`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <div className="text-center">
                  <div className={`text-xs font-semibold mb-1 ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                    Step {step.step}
                  </div>
                  <div className={`text-xs font-bold ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {step.title}
                  </div>
                </div>
              </motion.div>
              {i < flowSteps.length - 1 && (
                <ArrowRight className="h-4 w-4 text-muted-foreground hidden md:block" />
              )}
            </div>
          );
        })}
      </div>
      
      {flowSteps[activeStep] && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 rounded-xl border border-primary/30 bg-primary/5"
        >
          <div className="flex items-center gap-3 mb-3">
            {React.createElement(flowSteps[activeStep].icon, {
              className: `h-6 w-6 ${flowSteps[activeStep].color}`
            })}
            <div>
              <h4 className="font-bold text-foreground">{flowSteps[activeStep].title}</h4>
              <p className="text-sm text-muted-foreground">{flowSteps[activeStep].description}</p>
            </div>
          </div>
          <CodeBlock code={flowSteps[activeStep].code} />
        </motion.div>
      )}
    </div>
  );
};

const AccessControlLayers = () => {
  const layers = [
    {
      layer: 1,
      title: "Orchestrator Level",
      icon: Shield,
      color: "bg-blue-500",
      description: "Framework access control - blocks unauthorized users before any processing",
      code: `RAGOrchestrator.orchestrate()
  └─→ AIAccessControlService.checkAccess()
      └─→ EntityAccessPolicy.canUserAccessEntity()
          └─→ YOUR CODE: "Can user execute relationship queries?"
          
Result: ✅ GRANTED or ❌ DENIED`
    },
    {
      layer: 2,
      title: "Entity Type Filtering",
      icon: Filter,
      color: "bg-purple-500",
      description: "Filters entity types before query execution - saves LLM tokens",
      code: `RelationshipQueryActionHandler.executeAction()
  └─→ filterAllowedEntityTypes(userId, requestedTypes)
      └─→ For each entityType:
          - Check role-based access
          - Check permission-based access
          - Check tenant-based access
          - Check data classification
          
Filtered: [customer, order] (product denied)`
    },
    {
      layer: 3,
      title: "Schema Filtering",
      icon: Database,
      color: "bg-orange-500",
      description: "Only includes allowed entity types in schema - LLM never sees restricted schemas",
      code: `ReliableRelationshipQueryService.execute()
  └─→ RelationshipSchemaProvider.getSchemaDescription()
      └─→ Only includes allowed entity types
          (Denied entity types excluded from LLM prompt)
          
Result: LLM never sees product schema`
    },
    {
      layer: 4,
      title: "Result Filtering",
      icon: Eye,
      color: "bg-green-500",
      description: "Entity-level filtering - final safety net for row-level security",
      code: `After query execution:
  └─→ For each result document:
      EntityAccessPolicy.canUserAccessEntity(userId, document)
      └─→ YOUR CODE: "Can user access this specific customer?"
      
Result: Only accessible entities returned`
    }
  ];

  return (
    <div className="my-12">
      <h3 className="text-xl font-bold text-foreground mb-6 text-center">
        Defense in Depth: Four Layers of Security
      </h3>
      <div className="space-y-4">
        {layers.map((layer, i) => {
          const Icon = layer.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`p-6 rounded-xl border-2 border-${layer.color.split('-')[1]}-500/30 bg-${layer.color.split('-')[1]}-500/5`}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className={`p-3 rounded-lg ${layer.color}`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-muted-foreground">LAYER {layer.layer}</div>
                  <h4 className="text-lg font-bold text-foreground">{layer.title}</h4>
                  <p className="text-sm text-muted-foreground">{layer.description}</p>
                </div>
              </div>
              <CodeBlock code={layer.code} />
            </motion.div>
          );
        })}
      </div>
      <div className="mt-6 p-6 rounded-xl bg-green-500/10 border border-green-500/30 text-center">
        <Shield className="h-8 w-8 text-green-400 mx-auto mb-3" />
        <p className="text-lg font-bold text-green-400 mb-2">Defense in Depth: Multiple Layers of Security</p>
        <p className="text-sm text-muted-foreground">
          Four layers ensure no unauthorized access: Orchestrator → Entity Type → Schema → Result filtering.
        </p>
      </div>
    </div>
  );
};

const RealWorldImpact = () => {
  const scenarios = [
    {
      title: "CFO Analytics Dashboard",
      icon: TrendingUp,
      color: "bg-blue-500",
      before: "3-day wait for SQL queries, $150K/year developer time",
      after: "Real-time self-service queries, $0 developer time",
      impact: "$150K saved/year, decisions in real-time"
    },
    {
      title: "Business User Self-Service",
      icon: Users,
      color: "bg-green-500",
      before: "Submit ticket → Wait 3 days → Get results",
      after: "Ask question → Get instant answer",
      impact: "100% self-service for 80% of queries"
    },
    {
      title: "Developer Productivity",
      icon: Code,
      color: "bg-purple-500",
      before: "2-3 hours per complex query, trial-and-error",
      after: "5 minutes: Write natural language query",
      impact: "95% time savings, focus on features"
    }
  ];

  const [selectedScenario, setSelectedScenario] = useState(0);

  return (
    <div className="my-12">
      <h3 className="text-xl font-bold text-foreground mb-6 text-center">
        Real-World Impact: The Numbers Don't Lie
      </h3>
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        {scenarios.map((scenario, i) => {
          const Icon = scenario.icon;
          return (
            <button
              key={i}
              onClick={() => setSelectedScenario(i)}
              className={`p-4 rounded-xl border-2 transition-all text-left ${
                selectedScenario === i
                  ? `${scenario.color.replace('bg-', 'border-')} bg-${scenario.color.split('-')[1]}-500/10 shadow-lg`
                  : 'border-border/50 bg-muted/30 hover:border-border'
              }`}
            >
              <Icon className={`h-6 w-6 mb-2 ${scenario.color.replace('bg-', 'text-')}`} />
              <h4 className="font-bold text-foreground mb-2">{scenario.title}</h4>
            </button>
          );
        })}
      </div>
      
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedScenario}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="p-6 rounded-xl border border-primary/30 bg-primary/5"
        >
          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30">
              <h5 className="font-semibold text-red-400 mb-2">Before</h5>
              <p className="text-sm text-muted-foreground">{scenarios[selectedScenario].before}</p>
            </div>
            <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30">
              <h5 className="font-semibold text-green-400 mb-2">After</h5>
              <p className="text-sm text-muted-foreground">{scenarios[selectedScenario].after}</p>
            </div>
          </div>
          <div className="mt-4 p-4 rounded-lg bg-primary/20 border border-primary/30 text-center">
            <p className="text-primary font-bold">{scenarios[selectedScenario].impact}</p>
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
        What You Actually Implement
      </h3>
      
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-xl border border-primary/30 bg-primary/5">
          <div className="flex items-center gap-3 mb-4">
            <Code className="h-6 w-6 text-primary" />
            <h4 className="font-bold text-foreground">1. Annotate Entities</h4>
          </div>
          <CodeBlock code={`@Entity
@AICapable(entityType = "customer")
public class Customer {
    @Id private UUID id;
    private String tier;  // VIP, PREMIUM, etc.
    
    @OneToMany(mappedBy = "customer")
    private List<Order> orders;  // ← Discovered automatically
}

@Entity
@AICapable(entityType = "product")
public class Product {
    @Id private UUID id;
    private String category;
    
    @ManyToOne
    private Brand brand;  // ← Discovered automatically
}`} />
        </div>
        
        <div className="p-6 rounded-xl border border-secondary/30 bg-secondary/5">
          <div className="flex items-center gap-3 mb-4">
            <MessageSquare className="h-6 w-6 text-secondary" />
            <h4 className="font-bold text-foreground">2. Use the Service</h4>
          </div>
          <CodeBlock code={`@Autowired
private ReliableRelationshipQueryService queryService;

public List<Customer> findPremiumCustomers() {
    RAGResponse response = queryService.execute(
        "Find premium customers who ordered Nike products this month"
    );
    return convertToCustomers(response.getDocuments());
}

// That's it. System handles:
// - Schema discovery
// - LLM intent extraction
// - JPQL generation
// - Query execution
// - Access control
// - Caching`} />
        </div>
      </div>
      
      <div className="mt-6 p-6 rounded-xl bg-gradient-primary text-center">
        <p className="text-primary-foreground font-semibold text-lg">
          That's it. One annotation. One service call. Framework handles everything automatically.
        </p>
      </div>
    </div>
  );
};

const RelationshipQueryIntelligenceStoryV2 = () => {
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
                  <span className="text-2xl">🧠</span>
                  Relationship Query Intelligence V2 (Narrative)
                </span>
                <Link
                  to="/docs/relationship_query_intelligence_story"
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  View V1 →
                </Link>
              </div>
              <div className="flex items-center gap-3">
                <StoryLoveButton storySlug="relationship_query_intelligence_story_v2" />
                <PageViewCounter />
              </div>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl"
            >
              <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
                The Friday 4 PM Question That{" "}
                <span className="text-gradient">Changed Everything</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mb-8">
                A CFO's journey from 3-day SQL waits to real-time answers—how natural language queries saved $500K and freed developers.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2 text-sm text-accent">
                  <Clock className="h-4 w-4" />
                  3 Days → 5 Seconds
                </div>
                <div className="flex items-center gap-2 rounded-full bg-secondary/10 px-4 py-2 text-sm text-secondary">
                  <DollarSign className="h-4 w-4" />
                  $500K Saved
                </div>
                <div className="flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm text-primary">
                  <Brain className="h-4 w-4" />
                  Zero SQL Knowledge
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* The Friday Question */}
        <section className="px-6 py-12">
          <div className="max-w-4xl mx-auto">
            <TheFridayQuestion />
          </div>
        </section>

        {/* Before & After */}
        <section className="px-6 py-12 border-t border-border/50 bg-muted/30">
          <div className="max-w-4xl mx-auto">
            <BeforeAfterComparison />
          </div>
        </section>

        {/* The Magic Flow */}
        <section className="px-6 py-12">
          <div className="max-w-4xl mx-auto">
            <TheMagicFlow />
          </div>
        </section>

        {/* Access Control Layers */}
        <section className="px-6 py-12 border-t border-border/50 bg-muted/30">
          <div className="max-w-4xl mx-auto">
            <AccessControlLayers />
          </div>
        </section>

        {/* Real-World Impact */}
        <section className="px-6 py-12">
          <div className="max-w-4xl mx-auto">
            <RealWorldImpact />
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
                to="/docs/relationship_query_intelligence_story"
                className="flex items-center gap-2 text-sm text-primary hover:underline"
              >
                <BookOpen className="h-4 w-4" />
                Read V1 (Visual Version)
              </Link>
              <Link
                to="/docs/guides/relationship_query_intelligence"
                className="flex items-center gap-2 text-sm text-primary hover:underline"
              >
                <FileCode className="h-4 w-4" />
                Read Full Technical Guide
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <StoryLoveButton storySlug="relationship_query_intelligence_story_v2" />
              <PageViewCounter />
            </div>
          </div>
        </section>
      </div>
    </DocsLayout>
  );
};

export default RelationshipQueryIntelligenceStoryV2;

