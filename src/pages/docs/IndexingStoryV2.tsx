import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Highlight, themes } from "prism-react-renderer";
import DocsLayout from "@/components/docs/DocsLayout";
import PageViewCounter from "@/components/PageViewCounter";
import StoryLoveButton from "@/components/StoryLoveButton";
import { 
  Clock,
  Zap,
  Database,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Timer,
  Layers,
  RefreshCw,
  Shield,
  DollarSign,
  TrendingUp,
  ArrowRight,
  Play,
  Pause,
  FileCode,
  Rocket,
  Flame,
  TrendingDown,
  Activity,
  Calendar,
  Users,
  ShoppingCart
} from "lucide-react";

const PAGE_TITLE = "Indexing Strategy V2: The Black Friday That Almost Broke Us - AI Fabric Framework";
const PAGE_DESCRIPTION = "Sarah's story: How 5,000 products and the wrong indexing strategy cost $2.1M in 2 minutes.";

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

const BlackFridayTimeline = () => {
  const [activeMinute, setActiveMinute] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const timeline = [
    {
      time: "11:58 PM",
      minute: 0,
      title: "Two Minutes Until Black Friday",
      status: "normal",
      icon: Calendar,
      color: "text-blue-400",
      bgColor: "bg-blue-500/5",
      borderColor: "border-blue-500/30",
      events: [
        { emoji: "📦", text: "Marketing uploads 5,000 doorbuster products", type: "action" },
        { emoji: "⚡", text: "SYNC indexing starts: 450ms per product", type: "warning" },
        { emoji: "⏱️", text: "Estimated time: 37.5 minutes", type: "warning" }
      ],
      metrics: { productsQueued: 5000, productsIndexed: 0, revenue: 0, status: "Starting..." }
    },
    {
      time: "12:00 AM",
      minute: 2,
      title: "Black Friday Starts",
      status: "critical",
      icon: AlertTriangle,
      color: "text-red-400",
      bgColor: "bg-red-500/5",
      borderColor: "border-red-500/30",
      events: [
        { emoji: "🚨", text: "Upload times out after 2 minutes", type: "critical" },
        { emoji: "❌", text: "Only 266 products indexed (5.3%)", type: "critical" },
        { emoji: "😱", text: "Customers see ZERO doorbusters", type: "critical" },
        { emoji: "💸", text: "Revenue: $0 (should be $500K/hour)", type: "critical" }
      ],
      metrics: { productsQueued: 4734, productsIndexed: 266, revenue: 0, status: "DISASTER" }
    },
    {
      time: "12:05 AM",
      minute: 7,
      title: "The Panic Sets In",
      status: "critical",
      icon: Flame,
      color: "text-red-600",
      bgColor: "bg-red-600/5",
      borderColor: "border-red-600/50",
      events: [
        { emoji: "📞", text: "CEO calls: 'Where are the products?!'", type: "critical" },
        { emoji: "🔥", text: "Database CPU at 95%", type: "critical" },
        { emoji: "⏳", text: "Still 4,734 products queued", type: "critical" },
        { emoji: "💔", text: "Customers leaving, competitors winning", type: "critical" }
      ],
      metrics: { productsQueued: 4734, productsIndexed: 266, revenue: 0, status: "MELTDOWN" }
    },
    {
      time: "12:30 AM",
      minute: 32,
      title: "The Aftermath",
      status: "disaster",
      icon: TrendingDown,
      color: "text-red-700",
      bgColor: "bg-red-700/5",
      borderColor: "border-red-700/50",
      events: [
        { emoji: "📊", text: "Total indexed: 4,266 (85%)", type: "warning" },
        { emoji: "💰", text: "Lost revenue: $2.1M", type: "critical" },
        { emoji: "😢", text: "Black Friday ruined", type: "critical" },
        { emoji: "📧", text: "5,000+ angry customer emails", type: "critical" }
      ],
      metrics: { productsQueued: 734, productsIndexed: 4266, revenue: -2100000, status: "FAILED" }
    }
  ];

  useEffect(() => {
    if (isPlaying && activeMinute < timeline.length - 1) {
      const timer = setTimeout(() => {
        setActiveMinute(prev => prev + 1);
      }, 3000);
      return () => clearTimeout(timer);
    } else if (activeMinute >= timeline.length - 1) {
      setIsPlaying(false);
    }
  }, [isPlaying, activeMinute, timeline.length]);

  const current = timeline[activeMinute];

  return (
    <div className="my-12 p-8 rounded-2xl bg-gradient-to-br from-red-500/5 to-amber-500/5 border border-border/50">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Flame className="h-5 w-5 text-red-400" />
            Black Friday: The 32-Minute Disaster
          </h3>
          <p className="text-sm text-muted-foreground mt-1">Watch Sarah's nightmare unfold in real-time</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            disabled={activeMinute >= timeline.length - 1}
            className="p-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </button>
          <button
            onClick={() => { setActiveMinute(0); setIsPlaying(false); }}
            className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
          >
            ↻
          </button>
        </div>
      </div>
      
      {/* Timeline Navigation */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {timeline.map((event, i) => (
          <button
            key={i}
            onClick={() => { setActiveMinute(i); setIsPlaying(false); }}
            className={`flex-shrink-0 px-4 py-2 rounded-lg font-semibold transition-all ${
              activeMinute === i
                ? `${event.bgColor} ${event.borderColor} border-2 shadow-lg`
                : "bg-muted/30 border border-border/50 text-muted-foreground hover:border-border"
            }`}
          >
            <div className="flex items-center gap-2">
              {React.createElement(event.icon, {
                className: `h-4 w-4 ${activeMinute === i ? event.color : 'text-muted-foreground'}`
              })}
              <span className={`text-sm ${activeMinute === i ? 'text-foreground' : ''}`}>{event.time}</span>
            </div>
          </button>
        ))}
      </div>
      
      {/* Metrics Dashboard */}
      <div className="mb-6 p-4 rounded-lg bg-card/50 border border-border/30">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-xs text-muted-foreground mb-1">Products Queued</div>
            <div className="text-2xl font-bold text-amber-400">{current.metrics.productsQueued.toLocaleString()}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground mb-1">Products Indexed</div>
            <div className="text-2xl font-bold text-green-400">{current.metrics.productsIndexed.toLocaleString()}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground mb-1">Revenue Impact</div>
            <div className={`text-2xl font-bold ${current.metrics.revenue < 0 ? 'text-red-400' : 'text-green-400'}`}>
              ${Math.abs(current.metrics.revenue).toLocaleString()}
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground mb-1">Status</div>
            <div className={`text-lg font-bold ${current.metrics.status === 'DISASTER' || current.metrics.status === 'MELTDOWN' || current.metrics.status === 'FAILED' ? 'text-red-400' : 'text-amber-400'}`}>
              {current.metrics.status}
            </div>
          </div>
        </div>
      </div>
      
      {/* Current Event */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeMinute}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`p-6 rounded-xl border ${current.borderColor} ${current.bgColor}`}
        >
          <div className="flex items-center gap-3 mb-4">
            {React.createElement(current.icon, {
              className: `h-6 w-6 ${current.color}`
            })}
            <div>
              <h4 className="text-lg font-bold text-foreground">{current.title}</h4>
              <p className="text-xs text-muted-foreground">{current.time}</p>
            </div>
          </div>
          
          <div className="space-y-2 mb-4">
            {current.events.map((event, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-2 text-sm"
              >
                <span className="text-xl">{event.emoji}</span>
                <span className={event.type === "critical" ? "text-red-400 font-semibold" : event.type === "warning" ? "text-amber-400" : "text-muted-foreground"}>
                  {event.text}
                </span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
      
      {activeMinute >= timeline.length - 1 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-6 p-6 rounded-xl bg-red-500/10 border border-red-500/30 text-center"
        >
          <XCircle className="h-8 w-8 text-red-400 mx-auto mb-3" />
          <p className="text-lg font-bold text-red-400 mb-2">Total Loss: $2.1M in 32 Minutes</p>
          <p className="text-sm text-muted-foreground">
            All because of one wrong choice: SYNC indexing instead of ASYNC.
          </p>
        </motion.div>
      )}
    </div>
  );
};

const TheFourStrategies = () => {
  const [selectedStrategy, setSelectedStrategy] = useState(1); // Start with ASYNC
  
  const strategies = [
    {
      name: "AUTO",
      icon: RefreshCw,
      color: "text-muted-foreground",
      borderColor: "border-muted/30",
      bgColor: "bg-muted/5",
      description: "Inherit from parent configuration",
      useCase: "DRY configuration",
      timing: "Depends on parent"
    },
    {
      name: "SYNC",
      icon: AlertTriangle,
      color: "text-red-400",
      borderColor: "border-red-500/30",
      bgColor: "bg-red-500/5",
      description: "Block until indexing completes",
      useCase: "GDPR deletes, fraud detection",
      timing: "+450ms per request",
      warning: "⚠️ Sarah's mistake - caused Black Friday disaster"
    },
    {
      name: "ASYNC",
      icon: Zap,
      color: "text-green-400",
      borderColor: "border-green-500/30",
      bgColor: "bg-green-500/5",
      description: "Queue and return immediately",
      useCase: "95% of entities (products, users, articles)",
      timing: "+10ms per request, indexed in 1-5 seconds",
      recommended: true
    },
    {
      name: "BATCH",
      icon: Layers,
      color: "text-blue-400",
      borderColor: "border-blue-500/30",
      bgColor: "bg-blue-500/5",
      description: "Process in scheduled batches",
      useCase: "Analytics events, logs (high volume)",
      timing: "+10ms per request, indexed in 15-60 seconds",
      efficiency: "99% cost reduction for bulk operations"
    }
  ];

  return (
    <div className="my-16">
      <h3 className="text-2xl font-bold text-foreground mb-8 text-center">
        The 4 Indexing Strategies: Sarah's Lesson
      </h3>
      <p className="text-sm text-muted-foreground text-center mb-8">
        Four ways to index. One wrong choice cost $2.1M. Here's how to pick the right one.
      </p>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
        {strategies.map((strategy, i) => (
          <button
            key={i}
            onClick={() => setSelectedStrategy(i)}
            className={`p-4 rounded-lg border-2 transition-all ${
              selectedStrategy === i
                ? `${strategy.borderColor} ${strategy.bgColor} shadow-lg scale-105`
                : "border-border/30 bg-muted/30 hover:border-border"
            }`}
          >
            {React.createElement(strategy.icon, {
              className: `h-6 w-6 mx-auto mb-2 ${selectedStrategy === i ? strategy.color : 'text-muted-foreground'}`
            })}
            <p className={`text-sm font-semibold text-center ${selectedStrategy === i ? 'text-foreground' : 'text-muted-foreground'}`}>
              {strategy.name}
            </p>
            {strategy.recommended && (
              <span className="text-[10px] text-green-400 mt-1 block">✓ Recommended</span>
            )}
            {strategy.warning && (
              <span className="text-[10px] text-red-400 mt-1 block">⚠️ Avoid for bulk</span>
            )}
          </button>
        ))}
      </div>
      
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedStrategy}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`p-6 rounded-xl border ${strategies[selectedStrategy].borderColor} ${strategies[selectedStrategy].bgColor}`}
        >
          <div className="flex items-center gap-3 mb-4">
            {React.createElement(strategies[selectedStrategy].icon, {
              className: `h-8 w-8 ${strategies[selectedStrategy].color}`
            })}
            <div>
              <h4 className="text-lg font-bold text-foreground">{strategies[selectedStrategy].name}</h4>
              <p className="text-xs text-muted-foreground">{strategies[selectedStrategy].description}</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-muted/30 border border-border/30">
              <p className="text-xs font-semibold text-foreground mb-1">Use Case:</p>
              <p className="text-sm text-muted-foreground">{strategies[selectedStrategy].useCase}</p>
            </div>
            
            <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
              <p className="text-xs font-semibold text-primary mb-1">Performance:</p>
              <p className="text-sm text-foreground">{strategies[selectedStrategy].timing}</p>
            </div>
            
            {strategies[selectedStrategy].warning && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                <p className="text-xs font-semibold text-red-400 mb-1">⚠️ Warning:</p>
                <p className="text-sm text-muted-foreground">{strategies[selectedStrategy].warning}</p>
              </div>
            )}
            
            {strategies[selectedStrategy].efficiency && (
              <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                <p className="text-xs font-semibold text-green-400 mb-1">💡 Efficiency:</p>
                <p className="text-sm text-muted-foreground">{strategies[selectedStrategy].efficiency}</p>
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const BeforeAfterComparison = () => {
  return (
    <div className="my-16 grid lg:grid-cols-2 gap-8">
      {/* Before: SYNC */}
      <div className="p-8 rounded-2xl bg-red-500/5 border-2 border-red-500/30">
        <div className="flex items-center gap-3 mb-6">
          <XCircle className="h-8 w-8 text-red-400" />
          <h4 className="text-xl font-bold text-foreground">Sarah's Original Code (SYNC)</h4>
        </div>
        
        <CodeBlock code={`@PostMapping("/products")
public Product createProduct(@RequestBody Product product) {
    Product saved = repo.save(product);
    
    // Generate embedding (calls OpenAI)
    embeddingService.embed(saved);  // ← 200ms
    
    // Store in vector database
    vectorDB.store(saved);  // ← 150ms
    
    // Index for search
    searchService.index(saved);  // ← 100ms
    
    return saved;  // Total: +450ms PER PRODUCT
}`} />
        
        <div className="mt-6 space-y-3">
          <div className="flex items-start gap-3">
            <Clock className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-foreground text-sm">5,000 products × 450ms</p>
              <p className="text-xs text-muted-foreground">= 37.5 minutes (times out at 2 min)</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <DollarSign className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-foreground text-sm">Revenue Lost</p>
              <p className="text-xs text-muted-foreground">$2.1M in 32 minutes</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <Users className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-foreground text-sm">Customer Impact</p>
              <p className="text-xs text-muted-foreground">Zero doorbusters visible</p>
            </div>
          </div>
        </div>
        
        <div className="mt-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20">
          <p className="text-sm text-red-400 font-bold">Result: Black Friday Disaster</p>
          <p className="text-xs text-muted-foreground mt-1">SYNC indexing blocked every request</p>
        </div>
      </div>
      
      {/* After: ASYNC */}
      <div className="p-8 rounded-2xl bg-green-500/5 border-2 border-green-500/30">
        <div className="flex items-center gap-3 mb-6">
          <CheckCircle2 className="h-8 w-8 text-green-400" />
          <h4 className="text-xl font-bold text-foreground">Sarah's Fixed Code (ASYNC)</h4>
        </div>
        
        <CodeBlock code={`@Entity
@AICapable(
    entityType = "product",
    indexingStrategy = ASYNC  // ← Changed from SYNC
)
public class Product {
    @Id private UUID id;
    private String name;
    private String description;
}

// HTTP request returns in +10ms
// Indexing happens in background (1-5 seconds)`} />
        
        <div className="mt-6 space-y-3">
          <div className="flex items-start gap-3">
            <Zap className="h-5 w-5 text-green-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-foreground text-sm">5,000 products × 10ms</p>
              <p className="text-xs text-muted-foreground">= 50 seconds (all uploaded)</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <DollarSign className="h-5 w-5 text-green-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-foreground text-sm">Revenue Saved</p>
              <p className="text-xs text-muted-foreground">$2.1M retained</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <ShoppingCart className="h-5 w-5 text-green-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-foreground text-sm">Customer Impact</p>
              <p className="text-xs text-muted-foreground">All doorbusters visible in 2 minutes</p>
            </div>
          </div>
        </div>
        
        <div className="mt-6 p-4 rounded-lg bg-green-500/10 border border-green-500/20">
          <p className="text-sm text-green-400 font-bold">Result: Black Friday Success</p>
          <p className="text-xs text-muted-foreground mt-1">ASYNC indexing = fast responses, background processing</p>
        </div>
      </div>
    </div>
  );
};

const DecisionTree = () => {
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  
  const paths = [
    {
      question: "Is this compliance/legal?",
      yes: { strategy: "SYNC", reason: "GDPR deletes must be immediate", color: "text-red-400" },
      no: {
        question: "Is it user-facing?",
        yes: { strategy: "ASYNC", reason: "Fast response, indexed in seconds", color: "text-green-400" },
        no: {
          question: "Is it high-volume?",
          yes: { strategy: "BATCH", reason: "Efficient bulk processing", color: "text-blue-400" },
          no: { strategy: "ASYNC", reason: "Default for most cases", color: "text-green-400" }
        }
      }
    }
  ];

  return (
    <div className="my-16 p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 border border-border/50">
      <h3 className="text-2xl font-bold text-foreground mb-8 text-center">
        The Decision Tree: How Sarah Should Have Chosen
      </h3>
      
      <div className="max-w-2xl mx-auto">
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-card border border-border/50">
            <p className="font-semibold text-foreground mb-2">1. Is this compliance/legal?</p>
            <div className="flex gap-4">
              <button
                onClick={() => setSelectedPath("sync")}
                className={`flex-1 p-3 rounded-lg border-2 transition-all ${
                  selectedPath === "sync"
                    ? "border-red-500/50 bg-red-500/10"
                    : "border-border/30 bg-muted/30 hover:border-border"
                }`}
              >
                <p className="font-bold text-sm mb-1">YES → SYNC</p>
                <p className="text-xs text-muted-foreground">GDPR deletes, fraud detection</p>
              </button>
              <button
                onClick={() => setSelectedPath("async")}
                className={`flex-1 p-3 rounded-lg border-2 transition-all ${
                  selectedPath === "async"
                    ? "border-green-500/50 bg-green-500/10"
                    : "border-border/30 bg-muted/30 hover:border-border"
                }`}
              >
                <p className="font-bold text-sm mb-1">NO → Continue...</p>
                <p className="text-xs text-muted-foreground">Go to next question</p>
              </button>
            </div>
          </div>
          
          {selectedPath === "async" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-lg bg-card border border-border/50"
            >
              <p className="font-semibold text-foreground mb-2">2. Is it user-facing?</p>
              <div className="flex gap-4">
                <button
                  onClick={() => setSelectedPath("async-final")}
                  className={`flex-1 p-3 rounded-lg border-2 transition-all ${
                    selectedPath === "async-final"
                      ? "border-green-500/50 bg-green-500/10"
                      : "border-border/30 bg-muted/30 hover:border-border"
                  }`}
                >
                  <p className="font-bold text-sm mb-1">YES → ASYNC</p>
                  <p className="text-xs text-muted-foreground">Products, users, articles (95% of cases)</p>
                </button>
                <button
                  onClick={() => setSelectedPath("batch")}
                  className={`flex-1 p-3 rounded-lg border-2 transition-all ${
                    selectedPath === "batch"
                      ? "border-blue-500/50 bg-blue-500/10"
                      : "border-border/30 bg-muted/30 hover:border-border"
                  }`}
                >
                  <p className="font-bold text-sm mb-1">NO → Continue...</p>
                  <p className="text-xs text-muted-foreground">Go to next question</p>
                </button>
              </div>
            </motion.div>
          )}
          
          {selectedPath === "batch" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-lg bg-card border border-border/50"
            >
              <p className="font-semibold text-foreground mb-2">3. Is it high-volume?</p>
              <div className="flex gap-4">
                <button
                  onClick={() => setSelectedPath("batch-final")}
                  className={`flex-1 p-3 rounded-lg border-2 transition-all ${
                    selectedPath === "batch-final"
                      ? "border-blue-500/50 bg-blue-500/10"
                      : "border-border/30 bg-muted/30 hover:border-border"
                  }`}
                >
                  <p className="font-bold text-sm mb-1">YES → BATCH</p>
                  <p className="text-xs text-muted-foreground">Analytics events, logs</p>
                </button>
                <button
                  onClick={() => setSelectedPath("async-default")}
                  className={`flex-1 p-3 rounded-lg border-2 transition-all ${
                    selectedPath === "async-default"
                      ? "border-green-500/50 bg-green-500/10"
                      : "border-border/30 bg-muted/30 hover:border-border"
                  }`}
                >
                  <p className="font-bold text-sm mb-1">NO → ASYNC</p>
                  <p className="text-xs text-muted-foreground">Default choice</p>
                </button>
              </div>
            </motion.div>
          )}
          
          {selectedPath && (selectedPath.includes("final") || selectedPath.includes("default") || selectedPath === "sync") && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-6 rounded-xl bg-primary/10 border-2 border-primary/30 text-center"
            >
              <CheckCircle2 className="h-12 w-12 text-primary mx-auto mb-4" />
              <p className="text-xl font-bold text-foreground mb-2">
                {selectedPath === "sync" && "SYNC Strategy"}
                {selectedPath === "async-final" && "ASYNC Strategy"}
                {selectedPath === "async-default" && "ASYNC Strategy"}
                {selectedPath === "batch-final" && "BATCH Strategy"}
              </p>
              <p className="text-sm text-muted-foreground">
                {selectedPath === "sync" && "Perfect for compliance-critical operations"}
                {selectedPath === "async-final" && "Perfect for user-facing content like products"}
                {selectedPath === "async-default" && "The recommended default for most cases"}
                {selectedPath === "batch-final" && "Perfect for high-volume background data"}
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

const IndexingStoryV2 = () => {
  useEffect(() => {
    document.title = PAGE_TITLE;
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
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-amber-500/5" />
            <div className="relative">
              <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400">
                    <Flame className="h-4 w-4" />
                    Indexing Strategy V2
                  </span>
                  <Link 
                    to="/docs/indexing_story"
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    ← View V1
                  </Link>
                </div>
                <div className="flex items-center gap-3">
                  <StoryLoveButton storySlug="indexing-story-v2" />
                  <PageViewCounter />
                </div>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
                The Black Friday That{" "}
                <span className="text-gradient">Almost Broke Us</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mb-8">
                This is Sarah's story. How 5,000 products and one wrong indexing strategy cost $2.1M in 32 minutes.
              </p>
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 border border-border/50">
                  <DollarSign className="h-4 w-4 text-red-400" />
                  $2.1M Lost
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 border border-border/50">
                  <Clock className="h-4 w-4 text-amber-400" />
                  32 Minutes
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 border border-border/50">
                  <ShoppingCart className="h-4 w-4 text-blue-400" />
                  5,000 Products
                </div>
              </div>
            </div>
          </section>

          {/* Black Friday Timeline */}
          <BlackFridayTimeline />

          {/* The Four Strategies */}
          <TheFourStrategies />

          {/* Before/After Comparison */}
          <BeforeAfterComparison />

          {/* Decision Tree */}
          <DecisionTree />

          {/* The Revelation */}
          <section className="mb-16 p-8 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/5 border border-primary/20 text-center">
            <Rocket className="h-16 w-16 text-primary mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-foreground mb-4">The Lesson</h3>
            <div className="max-w-2xl mx-auto space-y-4 text-muted-foreground">
              <p className="text-lg">
                "I thought SYNC was safer. I thought immediate indexing was better."
              </p>
              <p className="text-lg">
                "I was wrong. <span className="text-primary font-semibold">450ms per product × 5,000 = 37.5 minutes.</span>"
              </p>
              <p className="text-lg">
                "Black Friday started. Customers saw nothing. We lost $2.1M."
              </p>
              <p className="text-lg">
                "<span className="text-primary font-semibold">One annotation change: SYNC → ASYNC.</span>"
              </p>
              <p className="text-lg">
                "Next Black Friday: 50 seconds to upload. All products visible in 2 minutes. $2.1M saved."
              </p>
              <p className="text-sm text-foreground italic font-semibold pt-4 border-t border-border/30">
                — Sarah, E-Commerce Engineer, after fixing the indexing strategy
              </p>
            </div>
          </section>

          {/* Bottom Line */}
          <section className="mb-16 p-8 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/5 border-2 border-primary/30">
            <h3 className="text-2xl font-bold text-foreground mb-6 text-center">The Numbers Don't Lie</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { value: "$2.1M", label: "Lost (SYNC)", icon: TrendingDown, color: "text-red-400" },
                { value: "$2.1M", label: "Saved (ASYNC)", icon: TrendingUp, color: "text-green-400" },
                { value: "37.5m", label: "Before (SYNC)", icon: Clock, color: "text-red-400" },
                { value: "50s", label: "After (ASYNC)", icon: Zap, color: "text-green-400" }
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <stat.icon className={`h-8 w-8 ${stat.color} mx-auto mb-2`} />
                  <div className={`text-3xl font-bold ${stat.color} mb-1`}>{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </div>
            <p className="mt-8 text-center text-foreground font-medium italic">
              "The right indexing strategy isn't about code. It's about understanding your use case."
            </p>
          </section>

          {/* Footer */}
          <footer className="border-t border-border/50 pt-12 mt-12 flex flex-col items-center gap-6">
            <div className="flex items-center gap-4">
              <StoryLoveButton storySlug="indexing-story-v2" />
              <PageViewCounter />
            </div>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link 
                to="/docs/guides/indexing" 
                className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
              >
                <FileCode className="h-4 w-4" />
                Read Technical Guide
              </Link>
              <Link 
                to="/docs/indexing_story" 
                className="inline-flex items-center gap-2 px-6 py-2 rounded-full border border-border bg-card text-foreground font-medium hover:bg-muted transition-colors"
              >
                View V1 (Technical)
              </Link>
            </div>
            <p className="text-xs text-muted-foreground text-center max-w-md">
              Part of the AI Fabric Framework series — where milliseconds matter
            </p>
          </footer>
        </motion.article>
      </div>
    </DocsLayout>
  );
};

export default IndexingStoryV2;

