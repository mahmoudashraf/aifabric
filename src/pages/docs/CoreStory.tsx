import { useEffect, useState } from "react";
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
  ArrowDown,
  ChevronDown,
  Cpu,
  RefreshCw,
  Target,
  MessageSquare,
  Eye,
  Lock,
  TrendingUp,
  Layers,
  FileText,
  Server,
  Code2,
  Sparkles
} from "lucide-react";

const PAGE_TITLE = "AI Core: From 6 Months to 5 Minutes - AI Fabric Framework";
const PAGE_DESCRIPTION = "How one annotation replaces 6 months of AI infrastructure work—semantic search, RAG, embeddings, privacy, and more.";
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

// Timeline Estimate Visualization
const TimelineEstimate = () => {
  const [isAnimating, setIsAnimating] = useState(true);
  
  const phases = [
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
    <div className="my-8 p-6 rounded-xl bg-card border border-border/50">
      <h3 className="text-lg font-bold text-foreground mb-2 text-center">Traditional AI Infrastructure Timeline</h3>
      <p className="text-sm text-muted-foreground text-center mb-6">= 26 weeks = 6 MONTHS 😱</p>
      
      <div className="relative">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          {phases.map((phase, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: isAnimating ? i * 0.1 : 0 }}
              className={`${phase.color}/20 border border-${phase.color.replace('bg-', '')}/30 rounded-lg p-2 text-center`}
            >
              <div className="text-xs font-mono text-muted-foreground">Week {phase.weeks}</div>
              <div className="text-[10px] text-foreground mt-1">{phase.task}</div>
            </motion.div>
          ))}
        </div>
        
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="absolute -bottom-4 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-green-500 to-red-500 rounded-full origin-left"
        />
      </div>
    </div>
  );
};

// AI Core Solution - Magic Moment
const MagicMoment = () => (
  <div className="my-8 p-6 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 border-2 border-primary/30">
    <div className="text-center mb-6">
      <span className="text-6xl">✨</span>
      <h3 className="text-2xl font-bold text-foreground mt-2">With AI Fabric Core</h3>
      <p className="text-primary font-bold text-xl">= 5 MINUTES</p>
    </div>
    
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
    
    <div className="text-center mt-4">
      <span className="text-sm text-muted-foreground">One annotation. One dependency. Everything works.</span>
    </div>
  </div>
);

// What You Get Grid
const WhatYouGet = () => {
  const features = [
    { icon: Search, label: "Semantic Search", desc: "Find by meaning", color: "text-blue-400" },
    { icon: Cpu, label: "Vector Embeddings", desc: "Auto-generated", color: "text-purple-400" },
    { icon: RefreshCw, label: "Async Indexing", desc: "Non-blocking", color: "text-green-400" },
    { icon: MessageSquare, label: "RAG Capabilities", desc: "No hallucinations", color: "text-amber-400" },
    { icon: Eye, label: "PII Detection", desc: "Privacy built-in", color: "text-red-400" },
    { icon: Zap, label: "56x Caching", desc: "Sub-10ms", color: "text-cyan-400" },
    { icon: Shield, label: "Retry Logic", desc: "Resilient", color: "text-orange-400" },
    { icon: Layers, label: "Provider Swap", desc: "Zero lock-in", color: "text-pink-400" },
  ];

  return (
    <div className="my-8">
      <h3 className="text-xl font-bold text-foreground mb-6 text-center">What One Annotation Gives You</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {features.map((feature, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            viewport={{ once: true }}
            className="p-4 rounded-lg bg-card border border-border/50 text-center hover:border-primary/50 transition-colors"
          >
            <feature.icon className={`h-6 w-6 mx-auto mb-2 ${feature.color}`} />
            <div className="text-sm font-semibold text-foreground">{feature.label}</div>
            <div className="text-xs text-muted-foreground">{feature.desc}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// 4 Core Services
const CoreServices = () => {
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
    <div className="my-8">
      <h3 className="text-xl font-bold text-foreground mb-6 text-center">The 4 Core Services</h3>
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

// Data Flow Diagram
const DataFlowDiagram = () => {
  const [activeStep, setActiveStep] = useState(0);
  
  const steps = [
    { label: "repo.save(entity)", icon: Database, color: "bg-blue-500" },
    { label: "AOP Intercept", icon: Zap, color: "bg-purple-500" },
    { label: "Strategy Resolve", icon: Target, color: "bg-amber-500" },
    { label: "Generate Embedding", icon: Cpu, color: "bg-green-500" },
    { label: "Store Vector", icon: Layers, color: "bg-cyan-500" },
    { label: "Searchable ✓", icon: CheckCircle2, color: "bg-primary" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="my-8 p-6 rounded-xl bg-card border border-border/50">
      <h3 className="text-lg font-bold text-foreground mb-2 text-center">Auto-Indexing Magic</h3>
      <p className="text-sm text-muted-foreground text-center mb-6">You write ZERO indexing code. Framework handles everything.</p>
      
      <div className="flex flex-wrap justify-center items-center gap-2 md:gap-3">
        {steps.map((step, i) => (
          <div key={i} className="flex items-center gap-2 md:gap-3">
            <motion.div
              animate={{
                scale: activeStep === i ? 1.15 : 1,
                opacity: activeStep >= i ? 1 : 0.4,
              }}
              className={`flex flex-col items-center gap-2 p-3 rounded-lg ${activeStep === i ? 'bg-primary/20 ring-2 ring-primary/50' : 'bg-muted/30'}`}
            >
              <div className={`p-2 rounded-full ${step.color}`}>
                <step.icon className="h-4 w-4 text-white" />
              </div>
              <span className="text-[10px] text-center text-muted-foreground max-w-[70px]">{step.label}</span>
            </motion.div>
            {i < steps.length - 1 && (
              <motion.div animate={{ opacity: activeStep > i ? 1 : 0.3 }}>
                <ArrowRight className="h-3 w-3 text-muted-foreground hidden md:block" />
              </motion.div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Before/After Search Comparison
const SearchComparison = () => (
  <div className="my-8 grid md:grid-cols-2 gap-6">
    {/* Before */}
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className="p-6 rounded-xl bg-card border-2 border-red-500/50"
    >
      <div className="flex items-center gap-2 mb-4">
        <XCircle className="h-5 w-5 text-red-400" />
        <h4 className="font-bold text-foreground">Keyword Search</h4>
      </div>
      <div className="bg-muted/30 rounded-lg p-3 mb-4">
        <code className="text-sm text-muted-foreground">Search: "laptop for programming"</code>
      </div>
      <ul className="space-y-2 text-sm">
        <li className="flex items-center gap-2 text-muted-foreground">
          <span className="text-red-400">✗</span> Laptop Stand
        </li>
        <li className="flex items-center gap-2 text-muted-foreground">
          <span className="text-red-400">✗</span> Laptop Bag
        </li>
        <li className="flex items-center gap-2 text-muted-foreground">
          <span className="text-red-400">✗</span> Laptop Cooling Pad
        </li>
      </ul>
      <div className="mt-4 p-3 rounded bg-red-500/10 border border-red-500/30">
        <div className="text-red-400 text-sm font-semibold">Misses: MacBook Pro, ThinkPad, Dell XPS</div>
        <div className="text-xs text-muted-foreground mt-1">68% bounce rate • $4M lost/year</div>
      </div>
    </motion.div>

    {/* After */}
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className="p-6 rounded-xl bg-card border-2 border-green-500/50"
    >
      <div className="flex items-center gap-2 mb-4">
        <CheckCircle2 className="h-5 w-5 text-green-400" />
        <h4 className="font-bold text-foreground">Semantic Search</h4>
      </div>
      <div className="bg-muted/30 rounded-lg p-3 mb-4">
        <code className="text-sm text-muted-foreground">Search: "laptop for programming"</code>
      </div>
      <ul className="space-y-2 text-sm">
        <li className="flex items-center gap-2 text-foreground">
          <span className="text-green-400">✓</span> MacBook Pro M3 <span className="text-green-400 ml-auto">94%</span>
        </li>
        <li className="flex items-center gap-2 text-foreground">
          <span className="text-green-400">✓</span> ThinkPad X1 Carbon <span className="text-green-400 ml-auto">91%</span>
        </li>
        <li className="flex items-center gap-2 text-foreground">
          <span className="text-green-400">✓</span> Dell XPS Developer <span className="text-green-400 ml-auto">89%</span>
        </li>
      </ul>
      <div className="mt-4 p-3 rounded bg-green-500/10 border border-green-500/30">
        <div className="text-green-400 text-sm font-semibold">42% conversion rate (+40pp!)</div>
        <div className="text-xs text-muted-foreground mt-1">$6M additional revenue/year</div>
      </div>
    </motion.div>
  </div>
);

// Impact Metrics
const ImpactMetrics = () => {
  const metrics = [
    { value: "Core", unit: "module", label: "Foundation", icon: Clock, color: "text-blue-400" },
    { value: "RAG", unit: "+ actions", label: "App Patterns", icon: DollarSign, color: "text-green-400" },
    { value: "Cache", unit: "ready", label: "Shared Names", icon: Zap, color: "text-amber-400" },
    { value: "Java", unit: "21", label: "Runtime Target", icon: Database, color: "text-primary" },
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
          <div className="text-xs text-muted-foreground">{metric.unit}</div>
          <div className="text-xs text-muted-foreground mt-1">{metric.label}</div>
        </motion.div>
      ))}
    </div>
  );
};

// Provider Swap Demo
const ProviderSwap = () => (
  <div className="my-8">
    <h3 className="text-xl font-bold text-foreground mb-6 text-center">Zero Lock-In: Swap Providers in One Line</h3>
    <div className="grid md:grid-cols-2 gap-6">
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="p-5 rounded-xl bg-card border border-green-500/30"
      >
        <div className="flex items-center gap-2 mb-3">
          <div className="p-2 rounded-full bg-green-500/20">
            <Server className="h-4 w-4 text-green-400" />
          </div>
          <span className="font-bold text-foreground">Today: Free Local ONNX</span>
        </div>
        <CodeBlock code={`ai:
  providers:
    embedding-provider: onnx`} language="yaml" />
        <div className="mt-3 space-y-1 text-sm">
          <div className="text-green-400">✓ Cost: $0/month</div>
          <div className="text-green-400">✓ Privacy: 100% local</div>
          <div className="text-green-400">✓ Speed: 10-50ms</div>
        </div>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="p-5 rounded-xl bg-card border border-blue-500/30"
      >
        <div className="flex items-center gap-2 mb-3">
          <div className="p-2 rounded-full bg-blue-500/20">
            <Sparkles className="h-4 w-4 text-blue-400" />
          </div>
          <span className="font-bold text-foreground">Tomorrow: OpenAI</span>
        </div>
        <CodeBlock code={`ai:
  providers:
    embedding-provider: openai
    openai-api-key: \${KEY}`} language="yaml" />
        <div className="mt-3 space-y-1 text-sm">
          <div className="text-blue-400">→ Quality: 1536 dims</div>
          <div className="text-muted-foreground">→ Cost: ~$100/month</div>
          <div className="text-muted-foreground">→ Speed: 100-500ms</div>
        </div>
      </motion.div>
    </div>
    <p className="text-center text-muted-foreground text-sm mt-4">One config line changed. Zero code changed. That's abstraction.</p>
  </div>
);

// 7 Superpowers
const Superpowers = () => {
  const powers = [
    { icon: Code2, title: "Annotation-Driven", desc: "No boilerplate—just @AICapable", color: "text-purple-400" },
    { icon: Layers, title: "Provider Abstraction", desc: "Swap OpenAI↔ONNX↔Cohere instantly", color: "text-blue-400" },
    { icon: RefreshCw, title: "Auto-Indexing", desc: "Spring AOP handles everything", color: "text-green-400" },
    { icon: Shield, title: "Built-In Privacy", desc: "PII detection, GDPR ready", color: "text-red-400" },
    { icon: Zap, title: "Intelligent Caching", desc: "56x speedup, sub-10ms", color: "text-amber-400" },
    { icon: Target, title: "Resilient", desc: "Retry + fallback providers", color: "text-cyan-400" },
    { icon: Eye, title: "Observable", desc: "Health checks & metrics", color: "text-pink-400" },
  ];

  return (
    <div className="my-8">
      <h3 className="text-xl font-bold text-foreground mb-6 text-center">The 7 Superpowers</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {powers.map((power, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.03 }}
            className="p-4 rounded-lg bg-card border border-border/50 hover:border-primary/30 transition-all"
          >
            <power.icon className={`h-5 w-5 mb-2 ${power.color}`} />
            <div className="text-sm font-semibold text-foreground">{power.title}</div>
            <div className="text-xs text-muted-foreground">{power.desc}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// Real Business Cases
const BusinessCases = () => {
  const cases = [
    {
      title: "E-Commerce Search",
      icon: Search,
      color: "bg-blue-500",
      problem: "50K products, keyword search, 68% bounce",
      solution: "@AICapable on Product entity",
      impact: "+40% conversion = $6M/year",
      time: "30 minutes"
    },
    {
      title: "Support Chatbot",
      icon: MessageSquare,
      color: "bg-green-500",
      problem: "10K tickets/month, $500K support costs",
      solution: "RAG from help articles",
      impact: "70% automation = $350K saved",
      time: "2 days"
    },
    {
      title: "Knowledge Base",
      icon: FileText,
      color: "bg-purple-500",
      problem: "Slow answers, duplicate articles",
      solution: "Semantic similarity detection",
      impact: "60% faster, 40% fewer duplicates",
      time: "1 day"
    },
  ];

  return (
    <div className="my-8">
      <h3 className="text-xl font-bold text-foreground mb-6 text-center">Real Business Impact</h3>
      <div className="grid md:grid-cols-3 gap-4">
        {cases.map((c, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            viewport={{ once: true }}
            className="p-5 rounded-xl bg-card border border-border/50"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2 rounded-lg ${c.color}`}>
                <c.icon className="h-5 w-5 text-white" />
              </div>
              <h4 className="font-bold text-foreground">{c.title}</h4>
            </div>
            <div className="space-y-2 text-sm">
              <div className="p-2 rounded bg-red-500/10 border border-red-500/20">
                <span className="text-red-400 font-medium">Problem: </span>
                <span className="text-muted-foreground">{c.problem}</span>
              </div>
              <div className="p-2 rounded bg-blue-500/10 border border-blue-500/20">
                <span className="text-blue-400 font-medium">Solution: </span>
                <span className="text-muted-foreground">{c.solution}</span>
              </div>
              <div className="p-2 rounded bg-green-500/10 border border-green-500/20">
                <span className="text-green-400 font-medium">Impact: </span>
                <span className="text-foreground font-semibold">{c.impact}</span>
              </div>
            </div>
            <div className="mt-3 text-xs text-muted-foreground text-center">
              Implementation: <span className="text-primary">{c.time}</span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const CoreStory = () => {
  useEffect(() => {
    document.title = PAGE_TITLE;
    
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

    const absoluteOgImage = `${window.location.origin}${OG_IMAGE}`;
    updateMeta('meta[name="description"]', "content", PAGE_DESCRIPTION);
    updateMeta('meta[property="og:title"]', "content", PAGE_TITLE);
    updateMeta('meta[property="og:description"]', "content", PAGE_DESCRIPTION);
    updateMeta('meta[property="og:image"]', "content", absoluteOgImage);
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
          <section className="relative overflow-hidden border-b border-border/50 mb-12">
            <div className="absolute inset-0 bg-gradient-glow opacity-50" />
            <div className="py-12 relative">
              <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                    <span className="text-2xl">🎯</span>
                    AI Core V1
                  </span>
                  <Link 
                    to="/docs/core_story_v2"
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    View V2 (Narrative) →
                  </Link>
                </div>
                <div className="flex items-center gap-3">
                  <StoryLoveButton storySlug="ai-core-story" />
                  <PageViewCounter />
                </div>
              </div>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl"
              >
                <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
                  AI Core:{" "}
                  <span className="text-gradient">From 6 Months to 5 Minutes</span>
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl mb-8">
                  How one annotation replaces 6 months of AI infrastructure work—semantic search, RAG, embeddings, privacy, and more. The foundation module that powers everything.
                </p>
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2 text-sm text-accent">
                    <Brain className="h-4 w-4" />
                    One Annotation
                  </div>
                  <div className="flex items-center gap-2 rounded-full bg-secondary/10 px-4 py-2 text-sm text-secondary">
                    <Database className="h-4 w-4" />
                    Annotated Entities
                  </div>
                  <div className="flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm text-primary">
                    <Zap className="h-4 w-4" />
                    Zero Boilerplate
                  </div>
                </div>
              </motion.div>
            </div>
          </section>

          {/* The Problem */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-2">The 6-Month Nightmare</h2>
            <p className="text-muted-foreground mb-6">Sprint planning. Product manager drops the bomb:</p>
            
            <blockquote className="border-l-4 border-destructive pl-6 py-4 bg-destructive/5 rounded-r-lg mb-6">
              <p className="text-lg text-foreground italic">
                "We need AI search. Users can't find products. Competitors have it. We don't."
              </p>
            </blockquote>

            <TimelineEstimate />
            
            <div className="text-center my-8">
              <p className="text-muted-foreground">Product manager: "We need it in 2 weeks."</p>
              <p className="text-foreground font-semibold">Engineer: "That's impossible."</p>
            </div>
          </section>

          {/* The Solution */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-6 text-center">Enter AI Fabric Core</h2>
            <MagicMoment />
          </section>

          {/* Impact Metrics */}
          <ImpactMetrics />

          {/* What You Get */}
          <WhatYouGet />

          {/* Search Comparison */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-6 text-center">The Search That Changed Everything</h2>
            <SearchComparison />
          </section>

          {/* 4 Core Services */}
          <CoreServices />

          {/* Data Flow */}
          <DataFlowDiagram />

          {/* Provider Swap */}
          <ProviderSwap />

          {/* 7 Superpowers */}
          <Superpowers />

          {/* Business Cases */}
          <BusinessCases />

          {/* Bottom Line */}
          <section className="my-12 p-8 rounded-2xl bg-gradient-to-br from-primary/10 via-accent/5 to-secondary/10 border border-primary/20">
            <h2 className="text-2xl font-bold text-foreground mb-6 text-center">The Bottom Line</h2>
            <div className="text-center space-y-4">
              <p className="text-lg text-muted-foreground">
                <span className="line-through">AI infrastructure = 6 months of work</span>
              </p>
              <p className="text-2xl font-bold text-primary">
                AI Fabric Core = 5 minutes
              </p>
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
          <footer className="border-t border-border/50 pt-8 mt-12">
            <div className="flex flex-col items-center gap-4">
              <StoryLoveButton storySlug="ai-core-story" />
              <p className="text-sm text-muted-foreground text-center">
                Part of the AI Fabric Framework series. See current guides for exact setup and release checks.
              </p>
            </div>
          </footer>
        </motion.article>
      </div>
    </DocsLayout>
  );
};

export default CoreStory;
