import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Highlight, themes } from "prism-react-renderer";
import DocsLayout from "@/components/docs/DocsLayout";
import PageViewCounter from "@/components/PageViewCounter";
import StoryLoveButton from "@/components/StoryLoveButton";
import StoryNavigation from "@/components/StoryNavigation";
import { 
  Zap,
  Clock,
  CheckCircle2,
  XCircle,
  Brain,
  DollarSign,
  Search,
  Shield,
  Database,
  ArrowRight,
  ChevronDown,
  Cpu,
  RefreshCw,
  Target,
  MessageSquare,
  Eye,
  Layers,
  FileText,
  Server,
  Code2,
  Sparkles,
  Calendar,
  TrendingUp,
  AlertTriangle,
  Play,
  Pause,
  RotateCcw,
  Code,
  Rocket
} from "lucide-react";

const PAGE_TITLE = "AI Core V2: The Sprint That Changed Everything - AI Fabric Framework";
const PAGE_DESCRIPTION = "A developer's journey from a 6-month nightmare to a 5-minute solution—how one annotation replaced an entire infrastructure project.";

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

const TheSprintMeeting = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const steps = [
    {
      time: "Monday 9:00 AM",
      title: "The Sprint Planning",
      icon: Calendar,
      color: "text-blue-400",
      bgColor: "bg-blue-500/5",
      borderColor: "border-blue-500/30",
      events: [
        { emoji: "📅", text: "Sprint planning meeting starts", type: "normal" },
        { emoji: "💼", text: "PM: 'We need AI search. Competitors have it.'", type: "normal" },
        { emoji: "😰", text: "Engineer: 'That's 6 months of work...'", type: "warning" }
      ]
    },
    {
      time: "Monday 9:15 AM",
      title: "The Demand",
      icon: AlertTriangle,
      color: "text-amber-400",
      bgColor: "bg-amber-500/5",
      borderColor: "border-amber-500/30",
      events: [
        { emoji: "⏰", text: "PM: 'We need it in 2 weeks.'", type: "warning" },
        { emoji: "😱", text: "Engineer: 'That's impossible!'", type: "error" },
        { emoji: "📊", text: "Timeline: 26 weeks minimum", type: "error" }
      ]
    },
    {
      time: "Monday 9:30 AM",
      title: "The Breakdown",
      icon: Code,
      color: "text-red-400",
      bgColor: "bg-red-500/5",
      borderColor: "border-red-500/30",
      events: [
        { emoji: "🔍", text: "Week 1-2: Research LLM providers", type: "normal" },
        { emoji: "⚙️", text: "Week 3-4: Build embedding pipeline", type: "normal" },
        { emoji: "🗄️", text: "Week 5-6: Set up vector database", type: "normal" },
        { emoji: "📝", text: "Week 7-8: Write search logic", type: "normal" },
        { emoji: "⏳", text: "...and 18 more weeks", type: "error" }
      ]
    },
    {
      time: "Monday 10:00 AM",
      title: "The Discovery",
      icon: Sparkles,
      color: "text-green-400",
      bgColor: "bg-green-500/5",
      borderColor: "border-green-500/30",
      events: [
        { emoji: "💡", text: "Engineer discovers AI Fabric Core", type: "positive" },
        { emoji: "📖", text: "Reads: 'One annotation. 5 minutes.'", type: "positive" },
        { emoji: "🤔", text: "Engineer: 'This can't be real...'", type: "normal" }
      ]
    },
    {
      time: "Monday 10:05 AM",
      title: "The Test",
      icon: Rocket,
      color: "text-purple-400",
      bgColor: "bg-purple-500/5",
      borderColor: "border-purple-500/30",
      events: [
        { emoji: "💻", text: "Adds @AICapable annotation", type: "positive" },
        { emoji: "⚡", text: "Runs the app...", type: "positive" },
        { emoji: "✨", text: "It just works. Everything works.", type: "positive" }
      ]
    },
    {
      time: "Monday 10:10 AM",
      title: "The Victory",
      icon: CheckCircle2,
      color: "text-green-600",
      bgColor: "bg-green-600/5",
      borderColor: "border-green-600/50",
      events: [
        { emoji: "🎉", text: "5 minutes. Done. Shipped.", type: "positive" },
        { emoji: "📈", text: "Semantic search: Working", type: "positive" },
        { emoji: "🔒", text: "PII detection: Built-in", type: "positive" },
        { emoji: "💰", text: "PM: 'You're a wizard.'", type: "positive" }
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
            <Calendar className="h-5 w-5 text-primary" />
            The Sprint That Changed Everything
          </h3>
          <p className="text-sm text-muted-foreground mt-1">From 6 months to 5 minutes—watch the transformation</p>
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
          <CheckCircle2 className="h-8 w-8 text-green-400 mx-auto mb-3" />
          <p className="text-lg font-bold text-green-400 mb-2">From 6 Months to 5 Minutes</p>
          <p className="text-sm text-muted-foreground">
            One annotation. Zero infrastructure code. Everything works.
          </p>
        </motion.div>
      )}
    </div>
  );
};

const TheTimelineComparison = () => {
  const [selectedView, setSelectedView] = useState<"before" | "after">("before");
  
  const beforePhases = [
    { weeks: "1-2", task: "Research LLM providers", color: "bg-blue-500" },
    { weeks: "3-4", task: "Embedding pipeline", color: "bg-purple-500" },
    { weeks: "5-6", task: "Vector database", color: "bg-indigo-500" },
    { weeks: "7-8", task: "Search logic", color: "bg-cyan-500" },
    { weeks: "9-10", task: "Async processing", color: "bg-teal-500" },
    { weeks: "11-12", task: "Caching layer", color: "bg-green-500" },
    { weeks: "13-14", task: "Retry logic", color: "bg-yellow-500" },
    { weeks: "15-16", task: "PII detection", color: "bg-orange-500" },
    { weeks: "17-20", task: "Testing at scale", color: "bg-red-500" },
    { weeks: "21-26", task: "Production hardening", color: "bg-pink-500" },
  ];
  
  return (
    <div className="my-16">
      <div className="flex gap-4 mb-8 justify-center">
        <button
          onClick={() => setSelectedView("before")}
          className={`px-6 py-3 rounded-lg font-semibold transition-all ${
            selectedView === "before"
              ? "bg-red-500/10 border-2 border-red-500/50 text-red-400"
              : "bg-muted/30 border border-border/50 text-muted-foreground hover:border-border"
          }`}
        >
          <XCircle className="h-5 w-5 inline mr-2" />
          Traditional Way (26 Weeks)
        </button>
        <button
          onClick={() => setSelectedView("after")}
          className={`px-6 py-3 rounded-lg font-semibold transition-all ${
            selectedView === "after"
              ? "bg-green-500/10 border-2 border-green-500/50 text-green-400"
              : "bg-muted/30 border border-border/50 text-muted-foreground hover:border-border"
          }`}
        >
          <CheckCircle2 className="h-5 w-5 inline mr-2" />
          AI Fabric Way (5 Minutes)
        </button>
      </div>
      
      <AnimatePresence mode="wait">
        {selectedView === "before" ? (
          <motion.div
            key="before"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="p-8 rounded-2xl bg-red-500/5 border-2 border-red-500/30"
          >
            <h3 className="text-xl font-bold text-foreground mb-6 text-center">
              The 6-Month Nightmare
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {beforePhases.map((phase, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className={`${phase.color}/20 border border-${phase.color.replace('bg-', '')}/30 rounded-lg p-3 text-center`}
                >
                  <div className="text-xs font-mono text-muted-foreground">Week {phase.weeks}</div>
                  <div className="text-[10px] text-foreground mt-1">{phase.task}</div>
                </motion.div>
              ))}
            </div>
            <div className="mt-6 text-center">
              <p className="text-2xl font-bold text-red-400">26 Weeks = 6 Months</p>
              <p className="text-sm text-muted-foreground mt-2">Thousands of lines of code. Multiple services. Complex infrastructure.</p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="after"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="p-8 rounded-2xl bg-green-500/5 border-2 border-green-500/30"
          >
            <h3 className="text-xl font-bold text-foreground mb-6 text-center">
              The 5-Minute Solution
            </h3>
            <div className="max-w-2xl mx-auto">
              <CodeBlock code={`@Entity
@AICapable(
    entityType = "product",
    autoEmbedding = true,
    indexable = true
)
public class Product {
    @Id private UUID id;
    private String name;
    private String description;
}

// Done. Ship it. 🚀`} />
              <div className="mt-6 text-center">
                <p className="text-2xl font-bold text-green-400">5 Minutes</p>
                <p className="text-sm text-muted-foreground mt-2">One annotation. Zero infrastructure code. Everything works.</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const TheFourServices = () => {
  const [expanded, setExpanded] = useState<number | null>(0);
  
  const services = [
    {
      name: "AICoreService",
      desc: "LLM Integration",
      icon: Brain,
      color: "border-purple-500/50 bg-purple-500/10",
      iconColor: "text-purple-400",
      code: `@Autowired
private AICoreService coreService;

// Simple text generation
String description = coreService.generateText(
    "Write a product description for organic coffee"
);

// With full control
AIGenerationResponse response = coreService.generateContent(
    AIGenerationRequest.builder()
        .prompt("Summarize this article")
        .systemPrompt("You are a technical writer")
        .temperature(0.3)
        .maxTokens(500)
        .build()
);`,
      supports: ["OpenAI", "Anthropic", "Azure", "Cohere"]
    },
    {
      name: "AIEmbeddingService",
      desc: "Vector Generation",
      icon: Cpu,
      color: "border-blue-500/50 bg-blue-500/10",
      iconColor: "text-blue-400",
      code: `@Autowired
private AIEmbeddingService embeddingService;

// Single embedding
AIEmbeddingResponse response = embeddingService.generateEmbedding(
    AIEmbeddingRequest.builder()
        .text("Machine learning in production")
        .build()
);

List<Double> vector = response.getEmbedding();  
// [0.023, -0.145, 0.387, ..., 0.092]  // 384 dims

// Batch (10x faster)
List<AIEmbeddingResponse> batch = 
    embeddingService.generateEmbeddings(texts, "document");`,
      supports: ["ONNX (free)", "OpenAI", "Cohere", "Azure"]
    },
    {
      name: "AISearchService",
      desc: "Semantic Search",
      icon: Search,
      color: "border-green-500/50 bg-green-500/10",
      iconColor: "text-green-400",
      code: `@Autowired
private AISearchService searchService;

// Search by meaning
AISearchResponse results = searchService.search(
    embedding.getEmbedding(),
    AISearchRequest.builder()
        .entityType("product")
        .limit(10)
        .threshold(0.7)  // 70%+ similarity
        .build()
);

// Results ranked by similarity
// MacBook Pro M3: 94% match
// ThinkPad X1 Carbon: 91% match
// Dell XPS Developer: 89% match`,
      supports: ["Lucene", "Milvus", "Qdrant", "Pinecone"]
    },
    {
      name: "RAGService",
      desc: "No Hallucinations",
      icon: MessageSquare,
      color: "border-amber-500/50 bg-amber-500/10",
      iconColor: "text-amber-400",
      code: `@Autowired
private RAGService ragService;

// Ask question, get answer from YOUR data
RAGResponse response = ragService.performRag(
    RAGRequest.builder()
        .query("How do I reset my password?")
        .entityType("help-article")
        .limit(3)
        .threshold(0.8)
        .build()
);

System.out.println("Answer: " + response.getResponse());
System.out.println("Sources: " + response.getDocuments());
System.out.println("Confidence: " + response.getConfidenceScore());`,
      supports: ["Facts from YOUR docs", "Source citations", "Confidence scores"]
    },
  ];

  return (
    <div className="my-16">
      <h3 className="text-2xl font-bold text-foreground mb-8 text-center">The 4 Core Services</h3>
      <p className="text-muted-foreground text-center mb-8">
        Everything you need. One annotation activates them all.
      </p>
      <div className="space-y-3">
        {services.map((service, i) => (
          <motion.div
            key={i}
            layout
            className={`rounded-xl border-2 ${service.color} overflow-hidden cursor-pointer`}
            onClick={() => setExpanded(expanded === i ? null : i)}
          >
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <service.icon className={`h-6 w-6 ${service.iconColor}`} />
                <div>
                  <span className="font-bold text-foreground">{service.name}</span>
                  <span className="text-muted-foreground ml-2 text-sm">— {service.desc}</span>
                </div>
              </div>
              <motion.div
                animate={{ rotate: expanded === i ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="h-5 w-5 text-muted-foreground" />
              </motion.div>
            </div>
            
            <AnimatePresence>
              {expanded === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-t border-border/50"
                >
                  <div className="p-4">
                    <CodeBlock code={service.code} />
                    <div className="flex flex-wrap gap-2 mt-4">
                      {service.supports.map((s, j) => (
                        <span key={j} className="px-2 py-1 rounded-full bg-muted/50 text-xs text-muted-foreground">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const BeforeAfterSearch = () => {
  return (
    <div className="my-16 grid lg:grid-cols-2 gap-8">
      {/* Before */}
      <div className="p-8 rounded-2xl bg-red-500/5 border-2 border-red-500/30">
        <div className="flex items-center gap-3 mb-6">
          <XCircle className="h-8 w-8 text-red-400" />
          <h4 className="text-xl font-bold text-foreground">Keyword Search (Before)</h4>
        </div>
        
        <div className="space-y-4 text-sm">
          <div className="p-3 rounded bg-muted/30">
            <p className="text-muted-foreground mb-1">User searches:</p>
            <p className="text-foreground font-mono">"laptop for programming"</p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <span className="text-red-400">✗</span> Laptop Stand
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <span className="text-red-400">✗</span> Laptop Bag
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <span className="text-red-400">✗</span> Laptop Cooling Pad
            </div>
          </div>
          
          <div className="mt-4 p-4 rounded-lg bg-red-500/10 border border-red-500/30">
            <p className="text-red-400 font-semibold mb-1">Misses:</p>
            <p className="text-muted-foreground text-xs">MacBook Pro, ThinkPad, Dell XPS</p>
            <p className="text-red-400 text-xs mt-2">68% bounce rate • $4M lost/year</p>
          </div>
        </div>
      </div>
      
      {/* After */}
      <div className="p-8 rounded-2xl bg-green-500/5 border-2 border-green-500/30">
        <div className="flex items-center gap-3 mb-6">
          <CheckCircle2 className="h-8 w-8 text-green-400" />
          <h4 className="text-xl font-bold text-foreground">Semantic Search (After)</h4>
        </div>
        
        <div className="space-y-4 text-sm">
          <div className="p-3 rounded bg-muted/30">
            <p className="text-muted-foreground mb-1">User searches:</p>
            <p className="text-foreground font-mono">"laptop for programming"</p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-foreground">
              <span className="flex items-center gap-2">
                <span className="text-green-400">✓</span> MacBook Pro M3
              </span>
              <span className="text-green-400 font-semibold">94%</span>
            </div>
            <div className="flex items-center justify-between text-foreground">
              <span className="flex items-center gap-2">
                <span className="text-green-400">✓</span> ThinkPad X1 Carbon
              </span>
              <span className="text-green-400 font-semibold">91%</span>
            </div>
            <div className="flex items-center justify-between text-foreground">
              <span className="flex items-center gap-2">
                <span className="text-green-400">✓</span> Dell XPS Developer
              </span>
              <span className="text-green-400 font-semibold">89%</span>
            </div>
          </div>
          
          <div className="mt-4 p-4 rounded-lg bg-green-500/10 border border-green-500/30">
            <p className="text-green-400 font-semibold mb-1">42% conversion rate (+40pp!)</p>
            <p className="text-muted-foreground text-xs">$6M additional revenue/year</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const TheSevenSuperpowers = () => {
  const powers = [
    { icon: Code2, title: "Annotation-Driven", desc: "No boilerplate—just @AICapable", color: "text-purple-400", bgColor: "bg-purple-500/10" },
    { icon: Layers, title: "Provider Abstraction", desc: "Swap OpenAI↔ONNX↔Cohere instantly", color: "text-blue-400", bgColor: "bg-blue-500/10" },
    { icon: RefreshCw, title: "Auto-Indexing", desc: "Spring AOP handles everything", color: "text-green-400", bgColor: "bg-green-500/10" },
    { icon: Shield, title: "Built-In Privacy", desc: "PII detection, GDPR ready", color: "text-red-400", bgColor: "bg-red-500/10" },
    { icon: Zap, title: "Intelligent Caching", desc: "56x speedup, sub-10ms", color: "text-amber-400", bgColor: "bg-amber-500/10" },
    { icon: Target, title: "Resilient", desc: "Retry + fallback providers", color: "text-cyan-400", bgColor: "bg-cyan-500/10" },
    { icon: Eye, title: "Observable", desc: "Health checks & metrics", color: "text-pink-400", bgColor: "bg-pink-500/10" },
  ];

  return (
    <div className="my-16">
      <h3 className="text-2xl font-bold text-foreground mb-8 text-center">The 7 Superpowers</h3>
      <p className="text-muted-foreground text-center mb-8">
        One annotation unlocks all of these. No configuration. No setup. Just works.
      </p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {powers.map((power, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.03 }}
            className={`p-5 rounded-xl border border-border/50 ${power.bgColor} hover:border-primary/30 transition-all`}
          >
            <power.icon className={`h-6 w-6 mb-3 ${power.color}`} />
            <div className="text-sm font-semibold text-foreground mb-1">{power.title}</div>
            <div className="text-xs text-muted-foreground">{power.desc}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const ImpactMetrics = () => {
  const metrics = [
    { value: "6→5", unit: "months→min", label: "Development Time", icon: Clock, color: "text-blue-400" },
    { value: "$6M", unit: "/year", label: "Revenue Impact", icon: DollarSign, color: "text-green-400" },
    { value: "56x", unit: "faster", label: "Cached Response", icon: Zap, color: "text-amber-400" },
    { value: "10M+", unit: "entities", label: "Battle-tested", icon: Database, color: "text-primary" },
  ];

  return (
    <div className="my-16">
      <h3 className="text-2xl font-bold text-foreground mb-8 text-center">The Numbers Don't Lie</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {metrics.map((metric, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            viewport={{ once: true }}
            className="p-6 rounded-xl bg-card border border-border/50 text-center"
          >
            <metric.icon className={`h-8 w-8 mx-auto mb-3 ${metric.color}`} />
            <div className={`text-3xl font-bold ${metric.color} mb-1`}>{metric.value}</div>
            <div className="text-xs text-muted-foreground mb-1">{metric.unit}</div>
            <div className="text-xs text-muted-foreground">{metric.label}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const CoreStoryV2 = () => {
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
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-green-500/5" />
            <div className="relative">
              <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                    <Brain className="h-4 w-4" />
                    AI Core V2
                  </span>
                  <Link 
                    to="/docs/core_story"
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    ← View V1
                  </Link>
                </div>
                <div className="flex items-center gap-3">
                  <StoryLoveButton storySlug="ai-core-story-v2" />
                  <PageViewCounter />
                </div>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
                The Sprint That{" "}
                <span className="text-gradient">Changed Everything</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mb-8">
                This is a story about impossible deadlines, 6-month projects, and one annotation that changed everything. How a developer went from "That's impossible" to "Done. Shipped." in 5 minutes.
              </p>
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 border border-border/50">
                  <Clock className="h-4 w-4 text-blue-400" />
                  6 Months → 5 Minutes
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 border border-border/50">
                  <DollarSign className="h-4 w-4 text-green-400" />
                  $6M Revenue Impact
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 border border-border/50">
                  <Code2 className="h-4 w-4 text-purple-400" />
                  One Annotation
                </div>
              </div>
            </div>
          </section>

          {/* The Sprint Meeting */}
          <TheSprintMeeting />

          {/* Timeline Comparison */}
          <TheTimelineComparison />

          {/* Impact Metrics */}
          <ImpactMetrics />

          {/* Before/After Search */}
          <BeforeAfterSearch />

          {/* The 4 Services */}
          <TheFourServices />

          {/* The 7 Superpowers */}
          <TheSevenSuperpowers />

          {/* The Revelation */}
          <section className="mb-16 p-8 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/5 border border-primary/20 text-center">
            <Brain className="h-16 w-16 text-primary mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-foreground mb-4">The Revelation</h3>
            <div className="max-w-2xl mx-auto space-y-4 text-muted-foreground">
              <p className="text-lg">
                "I thought AI infrastructure was a 6-month project. That you needed teams. That you needed to build everything from scratch."
              </p>
              <p className="text-lg">
                "I was wrong. <span className="text-primary font-semibold">One annotation. @AICapable. That's it.</span>"
              </p>
              <p className="text-lg">
                "Semantic search? Working. RAG? Working. Embeddings? Working. PII detection? Built-in. Caching? Automatic."
              </p>
              <p className="text-lg">
                "The PM said 'You're a wizard.' I said 'No, I just used AI Fabric Core.'"
              </p>
              <p className="text-lg">
                "<span className="text-primary font-semibold">From 6 months to 5 minutes. From impossible to shipped.</span>"
              </p>
              <p className="text-sm text-foreground italic font-semibold pt-4 border-t border-border/30">
                — Developer, after shipping AI search in 5 minutes
              </p>
            </div>
          </section>

          {/* Bottom Line */}
          <section className="mb-16 p-8 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/5 border-2 border-primary/30">
            <h3 className="text-2xl font-bold text-foreground mb-6 text-center">The Bottom Line</h3>
            <div className="text-center space-y-6">
              <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30">
                  <p className="text-sm text-muted-foreground mb-1">Traditional Way</p>
                  <p className="text-xl font-bold text-red-400">26 Weeks</p>
                </div>
                <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30">
                  <p className="text-sm text-muted-foreground mb-1">AI Fabric Way</p>
                  <p className="text-xl font-bold text-green-400">5 Minutes</p>
                </div>
              </div>
              <div className="flex flex-wrap justify-center gap-2 mt-6">
                {["Semantic Search", "Vector Embeddings", "RAG", "Privacy", "Caching", "Provider Swap"].map((feature, i) => (
                  <span key={i} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
                    ✓ {feature}
                  </span>
                ))}
              </div>
              <p className="text-foreground font-semibold mt-6">
                From 6 months to 5 minutes. From complex to simple. From infrastructure to features.
              </p>
            </div>
          </section>

          {/* Story Navigation */}


          <StoryNavigation className="mt-12" />



          {/* Footer */}
          <footer className="border-t border-border/50 pt-12 mt-12 flex flex-col items-center gap-6">
            <div className="flex items-center gap-4">
              <StoryLoveButton storySlug="ai-core-story-v2" />
              <PageViewCounter />
            </div>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link 
                to="/docs/guides/core" 
                className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
              >
                <FileText className="h-4 w-4" />
                Read Technical Guide
              </Link>
              <Link 
                to="/docs/core_story" 
                className="inline-flex items-center gap-2 px-6 py-2 rounded-full border border-border bg-card text-foreground font-medium hover:bg-muted transition-colors"
              >
                View V1 (Technical)
              </Link>
            </div>
            <p className="text-xs text-muted-foreground text-center max-w-md">
              Part of the AI Fabric Framework series — where one annotation replaces 6 months of work
            </p>
          </footer>
        </motion.article>
      </div>
    </DocsLayout>
  );
};

export default CoreStoryV2;

