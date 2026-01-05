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
  Clock,
  DollarSign,
  Target,
  Activity,
  Sparkles,
  Heart,
  TrendingUp,
  TrendingDown,
  Play,
  Pause,
  RotateCcw,
  Code,
  Database,
  FileCode,
  BookOpen,
  Users,
  Search,
  Layers,
  Settings,
  BarChart3,
  AlertTriangle,
  Lightbulb,
  Rocket
} from "lucide-react";

const PAGE_TITLE = "Relationship Query V2: The Friday 4 PM Question That Changed Everything - AI Fabric Framework";
const PAGE_DESCRIPTION = "A CFO's journey from 3-day SQL waits to real-time answers—how natural language queries saved $500K and freed developers.";

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
      time: "Friday 6:30 PM",
      title: "The Frustration",
      icon: AlertTriangle,
      color: "text-red-400",
      bgColor: "bg-red-500/5",
      borderColor: "border-red-500/30",
      events: [
        { emoji: "⏰", text: "2.5 hours later: Query finally works", type: "warning" },
        { emoji: "😤", text: "Developer: 'Why can't they just ask in plain English?'", type: "critical" },
        { emoji: "💔", text: "Weekend plans: Cancelled", type: "critical" },
        { emoji: "📊", text: "Results: Delivered Monday 9 AM (3 days later)", type: "critical" }
      ]
    },
    {
      time: "Monday 9:00 AM",
      title: "The Realization",
      icon: Lightbulb,
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/5",
      borderColor: "border-yellow-500/30",
      events: [
        { emoji: "💡", text: "CFO: 'Can I ask questions myself next time?'", type: "positive" },
        { emoji: "🤔", text: "Developer: 'They don't know SQL...'", type: "warning" },
        { emoji: "💭", text: "Flashback: 'AI Fabric has Relationship Query...'", type: "positive" },
        { emoji: "🔍", text: "Research: Natural language to SQL!", type: "positive" }
      ]
    },
    {
      time: "Monday 2:00 PM",
      title: "The Discovery",
      icon: Rocket,
      color: "text-green-400",
      bgColor: "bg-green-500/5",
      borderColor: "border-green-500/30",
      events: [
        { emoji: "⚡", text: "Enable Relationship Query module", type: "intervention" },
        { emoji: "📝", text: "15 minutes: Add one endpoint", type: "intervention" },
        { emoji: "✅", text: "Framework handles everything automatically", type: "intervention" },
        { emoji: "🎉", text: "CFO can now ask questions directly!", type: "intervention" }
      ]
    },
    {
      time: "Friday 4:05 PM (Next Week)",
      title: "The Magic",
      icon: Zap,
      color: "text-purple-400",
      bgColor: "bg-purple-500/5",
      borderColor: "border-purple-500/30",
      events: [
        { emoji: "💬", text: "CFO types: 'Show product categories with highest return rate'", type: "positive" },
        { emoji: "⚡", text: "Results: 450ms (first time)", type: "positive" },
        { emoji: "🚀", text: "Results: 7ms (cached) - 64x faster!", type: "positive" },
        { emoji: "😊", text: "Developer: 'Weekend saved!'", type: "positive" }
      ]
    },
    {
      time: "3 Months Later",
      title: "The Impact",
      icon: TrendingUp,
      color: "text-green-400",
      bgColor: "bg-green-500/5",
      borderColor: "border-green-500/30",
      events: [
        { emoji: "💰", text: "Developer time saved: $500K/year", type: "positive" },
        { emoji: "⚡", text: "Query turnaround: 3 days → 30 seconds", type: "positive" },
        { emoji: "📊", text: "SQL code written: -90%", type: "positive" },
        { emoji: "🎯", text: "Business users: Self-serving data", type: "positive" }
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
        The Friday 4 PM Question: From 3 Days to 30 Seconds
      </h3>
      <p className="text-sm text-muted-foreground text-center mb-8">
        A journey that transformed how business users interact with data
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
          <p className="text-lg font-bold text-green-400 mb-2">Relationship Query Enabled: SQL Eliminated</p>
          <p className="text-sm text-muted-foreground">
            Business users ask questions in plain English. Framework generates SQL automatically. Developers freed.
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
        Before & After: The SQL Elimination
      </h3>
      
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Before */}
        <div className="p-6 rounded-xl border-2 border-red-500/30 bg-red-500/5">
          <div className="flex items-center gap-3 mb-4">
            <XCircle className="h-6 w-6 text-red-400" />
            <h4 className="font-bold text-foreground">Before: SQL Hell</h4>
          </div>
          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-muted/30 border border-border/30">
              <p className="text-xs font-semibold text-foreground mb-2">Problems:</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• 30+ lines of SQL for simple questions</li>
                <li>• 2-3 hours to write and test</li>
                <li>• 3-5 day turnaround time</li>
                <li>• Business users can't write SQL</li>
                <li>• Developers spend 60% time on queries</li>
                <li>• $750K/year developer cost</li>
              </ul>
            </div>
            <CodeBlock code={`// Developer writes this for CFO:
String jpql = """
    SELECT p.category.name as categoryName, 
           COUNT(r.id) as returnCount,
           COUNT(o.id) as orderCount,
           CAST(COUNT(r.id) AS DOUBLE) / COUNT(o.id) as returnRate
    FROM Product p
    LEFT JOIN p.orders o
    LEFT JOIN o.returns r
    WHERE o.status = 'COMPLETED'
      AND o.createdAt > :since
    GROUP BY p.category.name
    HAVING COUNT(o.id) > 10
    ORDER BY returnRate DESC
    """;

// Time: 2.5 hours
// Delivered: Monday 9 AM (3 days later)`} />
          </div>
        </div>
        
        {/* After */}
        <div className="p-6 rounded-xl border-2 border-green-500/30 bg-green-500/5">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle2 className="h-6 w-6 text-green-400" />
            <h4 className="font-bold text-foreground">After: Natural Language</h4>
          </div>
          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-muted/30 border border-border/30">
              <p className="text-xs font-semibold text-foreground mb-2">Benefits:</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• CFO asks in plain English</li>
                <li>• Framework generates SQL automatically</li>
                <li>• Results in 450ms (7ms cached)</li>
                <li>• Business users self-serve</li>
                <li>• Developers freed from query requests</li>
                <li>• $500K/year saved</li>
              </ul>
            </div>
            <CodeBlock code={`// CFO types in dashboard:
"Show product categories with highest return rate"

// Framework handles everything:
RAGResponse response = queryService.execute(
    "Show product categories with highest return rate",
    List.of("product", "order", "return"),
    QueryOptions.defaults()
);

// Time: 30 seconds
// Results: 450ms (first), 7ms (cached)
// SQL written: 0 lines`} />
          </div>
        </div>
      </div>
      
      <div className="mt-6 p-4 rounded-lg bg-primary/10 border border-primary/20 text-center">
        <p className="text-sm font-bold text-primary">
          Result: Query turnaround 3 days → 30 seconds. SQL code -90%. Developer time saved: $500K/year.
        </p>
      </div>
    </div>
  );
};

const TheFourFallbacks = () => {
  const [activeFallback, setActiveFallback] = useState(0);
  
  const fallbacks = [
    {
      level: 1,
      name: "JPA Traversal",
      icon: Database,
      color: "text-green-400",
      borderColor: "border-green-500/30",
      bgColor: "bg-green-500/5",
      description: "Primary method - executes JPQL with proper JOINs",
      successRate: "85%",
      speed: "150-300ms",
      code: `// Level 1: JPA Traversal
SELECT DISTINCT c FROM Customer c
  JOIN c.orders o
WHERE c.tier = 'premium'
  AND o.createdAt > :lastMonth

// ✅ SUCCESS (85% of queries)
// Fast, accurate, the happy path`
    },
    {
      level: 2,
      name: "Metadata Traversal",
      icon: Layers,
      color: "text-blue-400",
      borderColor: "border-blue-500/30",
      bgColor: "bg-blue-500/5",
      description: "Fallback #1 - uses entity metadata when JPA incomplete",
      successRate: "10%",
      speed: "300-600ms",
      code: `// Level 2: Metadata Traversal
// JPA traversal failed (missing relationship?)
// Use entity metadata instead
// Navigate via reflection

// ✅ SUCCESS (10% of queries)
// Works even with incomplete JPA mappings`
    },
    {
      level: 3,
      name: "Vector Search",
      icon: Search,
      color: "text-purple-400",
      borderColor: "border-purple-500/30",
      bgColor: "bg-purple-500/5",
      description: "Fallback #2 - semantic similarity search",
      successRate: "4%",
      speed: "400-800ms",
      code: `// Level 3: Vector Search
// Metadata traversal failed
// Generate embedding for query
// Search vector database
// Return semantically similar entities

// ✅ SUCCESS (4% of queries)
// Semantic match, not exact but relevant`
    },
    {
      level: 4,
      name: "Simple Repository",
      icon: Users,
      color: "text-gray-400",
      borderColor: "border-gray-500/30",
      bgColor: "bg-gray-500/5",
      description: "Fallback #3 - last resort, returns all entities of type",
      successRate: "1%",
      speed: "50-200ms",
      code: `// Level 4: Simple Repository
// Everything else failed
// Fall back to repository.findAll()
// Return all entities of type (limited)

// ✅ SUCCESS (1% of queries)
// Always returns something useful
// Philosophy: Something > Nothing`
    }
  ];

  return (
    <div className="my-16">
      <h3 className="text-2xl font-bold text-foreground mb-8 text-center">
        The 4-Level Fallback Chain: Always Gets Results
      </h3>
      <p className="text-sm text-muted-foreground text-center mb-8">
        If one method fails, try the next. 99.5% success rate. Always returns something useful.
      </p>
      
      <div className="grid grid-cols-4 gap-2 mb-6">
        {fallbacks.map((fallback, i) => {
          const Icon = fallback.icon;
          return (
            <button
              key={i}
              onClick={() => setActiveFallback(i)}
              className={`p-3 rounded-lg border-2 transition-all ${
                activeFallback === i
                  ? `${fallback.borderColor} ${fallback.bgColor} shadow-lg`
                  : "border-border/30 bg-muted/30 hover:border-border"
              }`}
            >
              <Icon className={`h-5 w-5 mx-auto mb-1 ${activeFallback === i ? fallback.color : 'text-muted-foreground'}`} />
              <p className={`text-xs font-semibold text-center ${activeFallback === i ? 'text-foreground' : 'text-muted-foreground'}`}>
                Level {fallback.level}
              </p>
            </button>
          );
        })}
      </div>
      
      <AnimatePresence mode="wait">
        <motion.div
          key={activeFallback}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`p-6 rounded-xl border ${fallbacks[activeFallback].borderColor} ${fallbacks[activeFallback].bgColor}`}
        >
          <div className="flex items-center gap-3 mb-4">
            {React.createElement(fallbacks[activeFallback].icon, {
              className: `h-6 w-6 ${fallbacks[activeFallback].color}`
            })}
            <div>
              <h4 className="font-bold text-foreground">
                Level {fallbacks[activeFallback].level}: {fallbacks[activeFallback].name}
              </h4>
              <p className="text-xs text-muted-foreground">{fallbacks[activeFallback].description}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="p-3 rounded-lg bg-muted/30 border border-border/30">
              <p className="text-xs font-semibold text-muted-foreground mb-1">Success Rate:</p>
              <p className="text-lg font-bold text-foreground">{fallbacks[activeFallback].successRate}</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/30 border border-border/30">
              <p className="text-xs font-semibold text-muted-foreground mb-1">Speed:</p>
              <p className="text-lg font-bold text-foreground">{fallbacks[activeFallback].speed}</p>
            </div>
          </div>
          
          <CodeBlock code={fallbacks[activeFallback].code} />
        </motion.div>
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
      title: "LLM Query Planner",
      icon: Brain,
      color: "text-purple-400",
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
      step: 3,
      title: "JPQL Generator",
      icon: Code,
      color: "text-green-400",
      description: "Framework generates JPQL automatically",
      code: `SELECT DISTINCT c FROM Customer c
  JOIN c.orders o
  JOIN o.items oi
  JOIN oi.product p
  JOIN p.category cat
WHERE c.tier = 'VIP'
  AND cat.name = 'Electronics'
  AND o.createdAt >= '2024-10-01'
  AND o.createdAt < '2025-01-01'`
    },
    {
      step: 4,
      title: "Execution",
      icon: Zap,
      color: "text-orange-400",
      description: "4-level fallback chain ensures results",
      code: `Try 1: JPA Traversal ✅ (85%)
Try 2: Metadata Traversal (if #1 fails)
Try 3: Vector Search (if #2 fails)
Try 4: Simple Repository (if #3 fails)

Result: Always gets something useful!`
    },
    {
      step: 5,
      title: "Caching",
      icon: Sparkles,
      color: "text-cyan-400",
      description: "3-level cache for 64x speedup",
      code: `Level 1: Plan Cache (LLM plans)
Level 2: Embedding Cache (vector queries)
Level 3: Result Cache (final results)

First query: 450ms
Cached query: 7ms ← 64x faster!`
    },
    {
      step: 6,
      title: "Results",
      icon: CheckCircle2,
      color: "text-green-400",
      description: "Results delivered in milliseconds",
      code: `[
  {id: "customer-123", name: "John Doe", tier: "VIP"},
  {id: "customer-456", name: "Jane Smith", tier: "VIP"},
  {id: "customer-789", name: "Bob Johnson", tier: "VIP"}
]

Processing time: 450ms (first) / 7ms (cached)`
    }
  ];

  return (
    <div className="my-16">
      <h3 className="text-2xl font-bold text-foreground mb-8 text-center">
        The Magic Flow: From Question to Answer
      </h3>
      <p className="text-sm text-muted-foreground text-center mb-8">
        See how a simple question becomes database results in milliseconds
      </p>
      
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 justify-center">
        {flowSteps.map((step, i) => {
          const Icon = step.icon;
          return (
            <button
              key={i}
              onClick={() => setActiveStep(i)}
              className={`flex-shrink-0 px-3 py-2 rounded-lg font-semibold transition-all ${
                activeStep === i
                  ? `${step.color.replace('text-', 'bg-').replace('-400', '-500/5')} border-2 shadow-lg`
                  : "bg-muted/30 border border-border/50 text-muted-foreground hover:border-border"
              }`}
            >
              <div className="flex items-center gap-2">
                <Icon className={`h-4 w-4 ${activeStep === i ? step.color : 'text-muted-foreground'}`} />
                <span className={`text-xs ${activeStep === i ? 'text-foreground' : ''}`}>
                  {step.step}
                </span>
              </div>
            </button>
          );
        })}
      </div>
      
      <AnimatePresence mode="wait">
        <motion.div
          key={activeStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="p-6 rounded-xl border border-border/50 bg-card"
        >
          <div className="flex items-center gap-3 mb-4">
            {React.createElement(flowSteps[activeStep].icon, {
              className: `h-6 w-6 ${flowSteps[activeStep].color}`
            })}
            <div>
              <h4 className="font-bold text-foreground">
                Step {flowSteps[activeStep].step}: {flowSteps[activeStep].title}
              </h4>
              <p className="text-xs text-muted-foreground">{flowSteps[activeStep].description}</p>
            </div>
          </div>
          <CodeBlock code={flowSteps[activeStep].code} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const RealWorldImpact = () => {
  const scenarios = [
    {
      title: "FinTech Platform",
      icon: DollarSign,
      color: "text-green-400",
      borderColor: "border-green-500/30",
      bgColor: "bg-green-500/5",
      before: {
        queries: "500 queries/month",
        turnaround: "3-5 days",
        cost: "$2.7M/year developer time"
      },
      after: {
        queries: "350 self-served/month",
        turnaround: "30 seconds",
        cost: "$1.89M saved/year"
      },
      impact: "$450K net savings"
    },
    {
      title: "SaaS Platform",
      icon: Users,
      color: "text-blue-400",
      borderColor: "border-blue-500/30",
      bgColor: "bg-blue-500/5",
      before: {
        queries: "Product manager requests daily",
        turnaround: "1-3 days",
        cost: "Developer time: 2 hours/query"
      },
      after: {
        queries: "20 questions/day self-served",
        turnaround: "Real-time (450ms)",
        cost: "Developer requests: -90%"
      },
      impact: "Feature velocity: +150%"
    },
    {
      title: "E-Commerce",
      icon: BarChart3,
      color: "text-purple-400",
      borderColor: "border-purple-500/30",
      bgColor: "bg-purple-500/5",
      before: {
        queries: "Executive dashboard: 25 views",
        turnaround: "6 weeks development",
        cost: "SQL code: 500+ lines"
      },
      after: {
        queries: "25 views, zero SQL",
        turnaround: "1 week development",
        cost: "SQL code: 0 lines"
      },
      impact: "Development time: -83%"
    }
  ];

  const [selectedScenario, setSelectedScenario] = useState(0);

  return (
    <div className="my-16">
      <h3 className="text-2xl font-bold text-foreground mb-8 text-center">
        Real-World Impact: Three Companies, One Solution
      </h3>
      
      <div className="grid grid-cols-3 gap-2 mb-6">
        {scenarios.map((scenario, i) => {
          const Icon = scenario.icon;
          return (
            <button
              key={i}
              onClick={() => setSelectedScenario(i)}
              className={`p-3 rounded-lg border-2 transition-all ${
                selectedScenario === i
                  ? `${scenario.borderColor} ${scenario.bgColor} shadow-lg`
                  : "border-border/30 bg-muted/30 hover:border-border"
              }`}
            >
              <Icon className={`h-5 w-5 mx-auto mb-1 ${selectedScenario === i ? scenario.color : 'text-muted-foreground'}`} />
              <p className={`text-xs font-semibold text-center ${selectedScenario === i ? 'text-foreground' : 'text-muted-foreground'}`}>
                {scenario.title}
              </p>
            </button>
          );
        })}
      </div>
      
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Before */}
        <div className={`p-6 rounded-xl border-2 ${scenarios[selectedScenario].borderColor} bg-red-500/5`}>
          <div className="flex items-center gap-3 mb-4">
            <XCircle className="h-6 w-6 text-red-400" />
            <h4 className="font-bold text-foreground">Before</h4>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-1">Queries:</p>
              <p className="text-sm text-foreground">{scenarios[selectedScenario].before.queries}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-1">Turnaround:</p>
              <p className="text-sm text-foreground">{scenarios[selectedScenario].before.turnaround}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-1">Cost:</p>
              <p className="text-sm text-foreground">{scenarios[selectedScenario].before.cost}</p>
            </div>
          </div>
        </div>
        
        {/* After */}
        <div className={`p-6 rounded-xl border-2 ${scenarios[selectedScenario].borderColor} bg-green-500/5`}>
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle2 className="h-6 w-6 text-green-400" />
            <h4 className="font-bold text-foreground">After</h4>
          </div>
          <div className="space-y-3">
            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-1">Queries:</p>
              <p className="text-sm text-foreground">{scenarios[selectedScenario].after.queries}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-1">Turnaround:</p>
              <p className="text-sm text-foreground">{scenarios[selectedScenario].after.turnaround}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-1">Cost:</p>
              <p className="text-sm text-foreground">{scenarios[selectedScenario].after.cost}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6 p-4 rounded-lg bg-primary/10 border border-primary/20 text-center">
        <p className="text-sm font-bold text-primary">Impact: {scenarios[selectedScenario].impact}</p>
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
      
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-xl border border-primary/30 bg-primary/5">
          <div className="flex items-center gap-3 mb-4">
            <Code className="h-6 w-6 text-primary" />
            <h4 className="font-bold text-foreground">The Endpoint</h4>
          </div>
          <CodeBlock code={`@RestController
public class AnalyticsController {
    
    @Autowired
    private ReliableRelationshipQueryService queryService;
    
    @GetMapping("/api/analytics/query")
    public Results query(@RequestParam String question) {
        RAGResponse response = queryService.execute(
            question,  // Natural language!
            List.of("customer", "order", "product"),
            QueryOptions.defaults()
        );
        
        return toResults(response);
    }
}`} />
        </div>
        
        <div className="p-6 rounded-xl border border-secondary/30 bg-secondary/5">
          <div className="flex items-center gap-3 mb-4">
            <Settings className="h-6 w-6 text-secondary" />
            <h4 className="font-bold text-foreground">Configuration (Optional)</h4>
          </div>
          <CodeBlock code={`# application.yml
ai:
  infrastructure:
    relationship:
      enabled: true
      
      # Fallback chain
      fallback-to-metadata: true
      fallback-to-vector-search: true
      fallback-to-simple-search: true
      
      # Performance
      enable-query-caching: true
      default-query-mode: STANDALONE
      default-return-mode: IDS
      
      # Caching
      cache:
        plan:
          ttl-seconds: 3600    # 1 hour
        result:
          ttl-seconds: 1800    # 30 min`} />
        </div>
      </div>
      
      <div className="mt-6 p-6 rounded-xl bg-gradient-primary text-center">
        <p className="text-primary-foreground font-semibold text-lg">
          That's it. One endpoint. Framework handles SQL generation, execution, caching, and fallbacks.
        </p>
      </div>
    </div>
  );
};

const RelationshipQueryStoryV2 = () => {
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
                  <span className="text-2xl">🗣️</span>
                  Relationship Query V2 (Narrative)
                </span>
                <Link 
                  to="/docs/features/query"
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  View V1 →
                </Link>
              </div>
              <div className="flex items-center gap-3">
                <StoryLoveButton storySlug="relationship_query_story_v2" />
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
                A CFO's journey from 3-day SQL waits to real-time answers—how natural language queries 
                saved $500K and freed developers forever.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2 text-sm text-accent">
                  <Zap className="h-4 w-4" />
                  3 Days → 30 Seconds
                </div>
                <div className="flex items-center gap-2 rounded-full bg-secondary/10 px-4 py-2 text-sm text-secondary">
                  <DollarSign className="h-4 w-4" />
                  $500K Saved
                </div>
                <div className="flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm text-primary">
                  <Code className="h-4 w-4" />
                  -90% SQL Code
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* The Friday Question Timeline */}
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

        {/* The 4-Level Fallback Chain */}
        <section className="px-6 py-12">
          <div className="max-w-4xl mx-auto">
            <TheFourFallbacks />
          </div>
        </section>

        {/* The Magic Flow */}
        <section className="px-6 py-12 border-t border-border/50 bg-muted/30">
          <div className="max-w-4xl mx-auto">
            <TheMagicFlow />
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

        {/* Story Navigation */}


        <StoryNavigation className="mt-12" />



        {/* Footer */}
        <section className="px-6 py-8 border-t border-border/50">
          <div className="max-w-4xl mx-auto flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <Link
                to="/docs/features/query"
                className="flex items-center gap-2 text-sm text-primary hover:underline"
              >
                <BookOpen className="h-4 w-4" />
                Read V1 (Visual Version)
              </Link>
              <Link
                to="/docs/guides/query"
                className="flex items-center gap-2 text-sm text-primary hover:underline"
              >
                <FileCode className="h-4 w-4" />
                Read Full Technical Guide
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <StoryLoveButton storySlug="relationship_query_story_v2" />
              <PageViewCounter />
            </div>
          </div>
        </section>
      </div>
    </DocsLayout>
  );
};

export default RelationshipQueryStoryV2;

