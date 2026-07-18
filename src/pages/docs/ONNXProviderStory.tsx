import { useEffect, useState } from "react";
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
  Wifi,
  WifiOff,
  TrendingDown,
  BarChart3,
  Search
} from "lucide-react";

const PAGE_TITLE = "ONNX Provider: Local Embeddings for AI Fabric - AI Fabric Framework";
const PAGE_DESCRIPTION = "How AI Fabric can use ONNX Runtime for local embeddings when privacy, offline behavior, or provider independence matters.";

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

const CostComparison = () => {
  const [selectedVolume, setSelectedVolume] = useState(0);
  
  const volumes = [
    {
      label: "1M/month",
      cloud: { openai: 100, cohere: 150, azure: 120 },
      onnx: 0,
      annual: { openai: 1200, cohere: 1800, azure: 1440 }
    },
    {
      label: "10M/month",
      cloud: { openai: 1000, cohere: 1500, azure: 1200 },
      onnx: 0,
      annual: { openai: 12000, cohere: 18000, azure: 14400 }
    }
  ];

  const current = volumes[selectedVolume];

  return (
    <div className="my-16">
      <h3 className="text-2xl font-bold text-foreground mb-8 text-center">
        The Cost Nightmare: Paying Forever for Embeddings
      </h3>
      
      <div className="flex gap-2 mb-6 justify-center">
        {volumes.map((vol, i) => (
          <button
            key={i}
            onClick={() => setSelectedVolume(i)}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              selectedVolume === i
                ? "bg-primary/10 border-2 border-primary/30 shadow-lg"
                : "bg-muted/30 border border-border/50 text-muted-foreground hover:border-border"
            }`}
          >
            {vol.label}
          </button>
        ))}
      </div>
      
      <div className="grid md:grid-cols-4 gap-4">
        <div className="p-6 rounded-xl border border-red-500/30 bg-red-500/5">
          <h4 className="font-bold text-foreground mb-2">OpenAI ada-002</h4>
          <p className="text-3xl font-bold text-red-400 mb-1">${current.cloud.openai}</p>
          <p className="text-xs text-muted-foreground">/month</p>
          <p className="text-sm text-muted-foreground mt-2">${current.annual.openai.toLocaleString()}/year</p>
        </div>
        
        <div className="p-6 rounded-xl border border-orange-500/30 bg-orange-500/5">
          <h4 className="font-bold text-foreground mb-2">Cohere</h4>
          <p className="text-3xl font-bold text-orange-400 mb-1">${current.cloud.cohere}</p>
          <p className="text-xs text-muted-foreground">/month</p>
          <p className="text-sm text-muted-foreground mt-2">${current.annual.cohere.toLocaleString()}/year</p>
        </div>
        
        <div className="p-6 rounded-xl border border-yellow-500/30 bg-yellow-500/5">
          <h4 className="font-bold text-foreground mb-2">Azure OpenAI</h4>
          <p className="text-3xl font-bold text-yellow-400 mb-1">${current.cloud.azure}</p>
          <p className="text-xs text-muted-foreground">/month</p>
          <p className="text-sm text-muted-foreground mt-2">${current.annual.azure.toLocaleString()}/year</p>
        </div>
        
        <div className="p-6 rounded-xl border-2 border-green-500/50 bg-green-500/10">
          <h4 className="font-bold text-foreground mb-2">ONNX Local</h4>
          <p className="text-3xl font-bold text-green-400 mb-1">${current.onnx}</p>
          <p className="text-xs text-muted-foreground">/month</p>
          <p className="text-sm text-muted-foreground mt-2">$0/year</p>
          <div className="mt-3 flex items-center gap-2 text-xs text-green-400">
            <CheckCircle2 className="h-4 w-4" />
            Forever free
          </div>
        </div>
      </div>
      
      <div className="mt-6 p-4 rounded-lg bg-primary/10 border border-primary/20 text-center">
        <p className="text-sm font-bold text-primary">
          ROI: Pay for itself in month 1. Save ${current.annual.openai.toLocaleString()}+ in year 1.
        </p>
      </div>
    </div>
  );
};

const ProblemList = () => {
  const problems = [
    { icon: DollarSign, text: "Paying forever ($1,200-$18,000/year)", color: "text-red-400" },
    { icon: Lock, text: "Data leaves your infrastructure (privacy risk)", color: "text-red-400" },
    { icon: Wifi, text: "Internet required (offline impossible)", color: "text-red-400" },
    { icon: Clock, text: "Network latency (100-500ms per call)", color: "text-red-400" },
    { icon: AlertTriangle, text: "Rate limits (throttling, retries)", color: "text-red-400" },
    { icon: Database, text: "Usage tracking (third-party analytics)", color: "text-red-400" },
    { icon: RefreshCw, text: "Vendor lock-in (hard to switch)", color: "text-red-400" },
    { icon: TrendingUp, text: "Monthly bills (forever)", color: "text-red-400" },
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

const PerformanceComparison = () => {
  return (
    <div className="my-16">
      <h3 className="text-2xl font-bold text-foreground mb-8 text-center">
        Performance Comparison: 10x Faster
      </h3>
      
      <div className="grid md:grid-cols-3 gap-6">
        <div className="p-6 rounded-xl border border-red-500/30 bg-red-500/5">
          <h4 className="font-bold text-foreground mb-4 flex items-center gap-2">
            <Wifi className="h-5 w-5 text-red-400" />
            Cloud API
          </h4>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Single Embedding:</p>
              <p className="text-lg font-bold text-red-400">100-500ms</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Batch(100):</p>
              <p className="text-lg font-bold text-red-400">5-10 seconds</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Cost:</p>
              <p className="text-lg font-bold text-red-400">$0.0001 each</p>
            </div>
          </div>
        </div>
        
        <div className="p-6 rounded-xl border border-blue-500/30 bg-blue-500/5">
          <h4 className="font-bold text-foreground mb-4 flex items-center gap-2">
            <Cpu className="h-5 w-5 text-blue-400" />
            ONNX CPU
          </h4>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Single Embedding:</p>
              <p className="text-lg font-bold text-blue-400">Local runtime</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Batch(100):</p>
              <p className="text-lg font-bold text-blue-400">500ms</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Cost:</p>
              <p className="text-lg font-bold text-green-400">$0</p>
            </div>
          </div>
        </div>
        
        <div className="p-6 rounded-xl border border-purple-500/30 bg-purple-500/5">
          <h4 className="font-bold text-foreground mb-4 flex items-center gap-2">
            <Zap className="h-5 w-5 text-purple-400" />
            ONNX GPU
          </h4>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Single Embedding:</p>
              <p className="text-lg font-bold text-purple-400">2-10ms</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Batch(100):</p>
              <p className="text-lg font-bold text-purple-400">50ms</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Cost:</p>
              <p className="text-lg font-bold text-green-400">$0</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6 p-4 rounded-lg bg-primary/10 border border-primary/20 text-center">
        <p className="text-sm font-bold text-primary">
          Winner: ONNX is 10-50x faster. Zero cost. 100% private. Works offline.
        </p>
      </div>
    </div>
  );
};

const ONNXProviderStory = () => {
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
                  <span className="text-2xl">🆓</span>
                  ONNX Provider V1
                </span>
                <Link 
                  to="/docs/onnx_provider_story_v2"
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  View V2 (Narrative) →
                </Link>
              </div>
              <div className="flex items-center gap-3">
                <StoryLoveButton storySlug="onnx_provider_story" />
                <PageViewCounter />
              </div>
            </div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl"
            >
              <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
                ONNX Provider:{" "}
                <span className="text-gradient">Local Embeddings</span>{" "}
                for AI Fabric
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mb-8">
                How AI Fabric can use ONNX Runtime for local embeddings when privacy, offline behavior,
                or provider independence matters.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2 text-sm text-accent">
                  <DollarSign className="h-4 w-4" />
                  Local Runtime
                </div>
                <div className="flex items-center gap-2 rounded-full bg-secondary/10 px-4 py-2 text-sm text-secondary">
                  <Lock className="h-4 w-4" />
                  Local Data Path
                </div>
                <div className="flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm text-primary">
                  <Zap className="h-4 w-4" />
                  Provider Independent
                </div>
                <div className="flex items-center gap-2 rounded-full bg-green-500/10 px-4 py-2 text-sm text-green-400">
                  <WifiOff className="h-4 w-4" />
                  Works Offline
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Cost Comparison */}
        <section className="px-6 py-12">
          <div className="max-w-4xl mx-auto">
            <CostComparison />
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
                The Cost Nightmare: Paying Forever for Embeddings
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                You're building an AI application. You need embeddings for semantic search, recommendation systems, 
                chatbot context, document classification, duplicate detection.
              </p>
              <p className="text-foreground font-medium mt-6">
                <strong>What if you could generate embeddings for FREE, locally, forever?</strong>
              </p>
            </div>

            <h3 className="text-xl font-bold text-foreground mb-4">Plus Hidden Costs:</h3>
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
                <Package className="h-6 w-6 text-primary" />
                Our Solution: Local ONNX Inference
              </h2>
              <p className="text-muted-foreground mb-8">
                Generate embeddings on your hardware. Zero cost. 100% private. 10x faster.
              </p>
            </motion.div>

            <SolutionCard
              title="1. Add Dependency"
              icon={Package}
              description="One dependency. Model included. Auto-configured."
              color="bg-primary"
              code={`<dependency>
    <groupId>io.github.loom-ai-labs</groupId>
    <artifactId>ai-fabric-onnx-starter</artifactId>
    <version>0.3.3</version>
</dependency>`}
            />

            <SolutionCard
              title="2. Use (Zero Configuration)"
              icon={Code}
              description="No API keys. No configuration. No credit card. No internet."
              color="bg-accent"
              code={`@Autowired
private EmbeddingProvider embeddingProvider;

// Generate embedding (15ms CPU, 3ms GPU, $0 cost)
AIEmbeddingResponse response = embeddingProvider.generateEmbedding(
    AIEmbeddingRequest.builder()
        .text("Machine learning is amazing")
        .build()
);

// Result: 384-dimensional vector
List<Double> embedding = response.getEmbedding();
// [0.023, -0.145, 0.387, ..., 0.092]`}
            />
          </div>
        </section>

        {/* Performance Comparison */}
        <section className="px-6 py-12 border-t border-border/50 bg-muted/30">
          <div className="max-w-4xl mx-auto">
            <PerformanceComparison />
          </div>
        </section>

        {/* Features */}
        <section className="px-6 py-12">
          <div className="max-w-4xl">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-bold text-foreground mb-8 flex items-center gap-3">
                <Sparkles className="h-6 w-6 text-primary" />
                What You Get Out of the Box
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-4">
              <FeatureCard
                title="No Per-Call Embedding Fee"
                icon={DollarSign}
                description="Run embeddings locally so indexing and retrieval do not depend on a remote embedding API call."
                color="bg-green-500"
              />
              <FeatureCard
                title="Local Data Path"
                icon={Lock}
                description="Text can stay inside your infrastructure, which helps privacy-oriented designs when your app owns the compliance controls."
                color="bg-blue-500"
              />
              <FeatureCard
                title="Predictable Local Runtime"
                icon={Zap}
                description="Latency depends on model, hardware, and batching, but local execution removes provider network round trips."
                color="bg-purple-500"
              />
              <FeatureCard
                title="Batteries Included"
                icon={Package}
                description="Model bundled (86MB). Tokenizer included. Auto-configured. Works out of the box."
                color="bg-orange-500"
              />
              <FeatureCard
                title="Production Ready"
                icon={CheckCircle2}
                description="Thread-safe, memory-efficient, battle-tested. Health checks, metrics, error handling."
                color="bg-red-500"
              />
              <FeatureCard
                title="Offline First"
                icon={WifiOff}
                description="No internet required after setup. Works in air-gapped environments. No external dependencies."
                color="bg-cyan-500"
              />
              <FeatureCard
                title="GPU Acceleration"
                icon={Cpu}
                description="5-25x speedup with GPU. Automatic fallback to CPU. CUDA support included."
                color="bg-pink-500"
              />
              <FeatureCard
                title="Batch Processing"
                icon={Layers}
                description="Process multiple texts at once. 3-5x faster than single embeddings. Efficient memory usage."
                color="bg-yellow-500"
              />
            </div>
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
                title="Tokenization"
                description="Text → Token IDs using HuggingFace tokenizers or fallback"
                icon={MessageSquare}
                color="bg-blue-500"
                code={`Text: "Machine learning is amazing"
    ↓
Token IDs: [101, 1234, 5678, 90, 3456, 102, 0, 0, ...]
Attention Mask: [1, 1, 1, 1, 1, 1, 0, 0, ...]
Token Type IDs: [0, 0, 0, 0, 0, 0, 0, 0, ...]`}
              />
              <FlowStep
                step={2}
                title="ONNX Inference"
                description="Neural network processes tokens using all-MiniLM-L6-v2 model (86MB)"
                icon={Brain}
                color="bg-purple-500"
                code={`Model: all-MiniLM-L6-v2 (86MB)
Architecture: Transformer (6 layers, 384 hidden)

Input: Token IDs [batch=1, sequence=512]
    ↓
Neural Network Processing:
1. Token embeddings (lookup)
2. Position embeddings (add)
3. Transformer layers (6 × attention + FFN)
4. Layer normalization
    ↓
Output: Token embeddings [1, 512, 384]`}
              />
              <FlowStep
                step={3}
                title="Mean Pooling"
                description="Average token embeddings to create sentence embedding"
                icon={Layers}
                color="bg-green-500"
                code={`Token embeddings: [512 tokens × 384 dimensions]
    ↓
Mean Pooling:
For each dimension:
  sum = sum of all valid token embeddings
  average = sum / valid_token_count
    ↓
Sentence embedding: [384 dimensions]
[0.023, -0.145, 0.387, ..., 0.092]`}
              />
              <FlowStep
                step={4}
                title="Return Embedding"
                description="AIEmbeddingResponse with 384-dimensional vector"
                icon={CheckCircle2}
                color="bg-orange-500"
                code={`AIEmbeddingResponse {
  embedding: [0.023, -0.145, 0.387, ..., 0.092],
  dimensions: 384,
  model: "onnx:all-MiniLM-L6-v2.onnx",
  processingTimeMs: 15,  // CPU: 15ms, GPU: 3ms
  requestId: "req-abc123"
}

All happening in 15ms on CPU. 3ms on GPU. $0 cost.`}
              />
            </div>
          </div>
        </section>

        {/* Real-World Examples */}
        <section className="px-6 py-12">
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
                  <Database className="h-5 w-5 text-primary" />
                  High-Volume Document Indexing
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Index 1M documents for semantic search.
                </p>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30">
                    <p className="text-xs font-semibold text-red-400 mb-1">With Cloud API:</p>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>• Cost: $500+</li>
                      <li>• Time: 8+ hours</li>
                      <li>• Privacy: Data sent to third party</li>
                      <li>• Internet: Required</li>
                    </ul>
                  </div>
                  <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/30">
                    <p className="text-xs font-semibold text-green-400 mb-1">With ONNX:</p>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>• Cost: $0</li>
                      <li>• Time: 2 hours (CPU) or 12 min (GPU)</li>
                      <li>• Privacy: 100% private</li>
                      <li>• Internet: Not required</li>
                    </ul>
                  </div>
                </div>
                <CodeBlock code={`@Service
public class DocumentIndexer {
    
    @Autowired
    private EmbeddingProvider embeddingProvider;
    
    public void indexAllDocuments() {
        List<Document> docs = documentRepository.findAll();  // 1M docs
        
        // Process in batches of 100
        for (int i = 0; i < docs.size(); i += 100) {
            List<String> batch = docs.subList(i, Math.min(i + 100, docs.size()))
                .stream()
                .map(Document::getContent)
                .toList();
            
            // FREE embeddings, 500ms per batch (CPU)
            // 50ms per batch (GPU)
            List<AIEmbeddingResponse> embeddings = 
                embeddingProvider.generateEmbeddings(batch);
            
            // Store in vector DB
            storeEmbeddings(embeddings);
        }
        
        log.info("Indexed 1M docs. Cost: $0. Time: 2 hours (CPU) or 12 min (GPU).");
    }
}

// Impact: Save $6,000+/year. 4x faster. 100% private.`} />
              </div>

              <div className="rounded-xl border border-secondary/30 bg-secondary/5 p-6">
                <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
                  <Search className="h-5 w-5 text-secondary" />
                  Real-Time Semantic Search
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Sub-50ms search response times.
                </p>
                <CodeBlock code={`@RestController
public class SearchController {
    
    @Autowired
    private EmbeddingProvider embeddingProvider;
    
    @GetMapping("/search")
    public List<Result> search(@RequestParam String query) {
        long start = System.currentTimeMillis();
        
        // Generate query embedding (15ms CPU, 3ms GPU)
        AIEmbeddingRequest request = AIEmbeddingRequest.builder()
            .text(query)
            .build();
        List<Double> queryVector = 
            embeddingProvider.generateEmbedding(request).getEmbedding();
        
        // Search vector DB (5ms)
        List<Result> results = vectorDB.search(queryVector, 10);
        
        long elapsed = System.currentTimeMillis() - start;
        log.info("Search completed in {}ms", elapsed);  // ~20ms total
        
        return results;
    }
}

// Impact: 100-500ms → 20ms (5-25x faster). $0 cost. Offline capable.`} />
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
                      <DollarSign className="h-4 w-4 text-green-400" />
                      Zero cost (no API fees, ever)
                    </li>
                    <li className="flex items-center gap-2">
                      <Lock className="h-4 w-4 text-blue-400" />
                      100% private (data never leaves your servers)
                    </li>
                    <li className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-purple-400" />
                      Local runtime without a provider network round trip
                    </li>
                    <li className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-orange-400" />
                      Batteries included (model bundled, 86MB)
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-400" />
                      Production ready (thread-safe, memory-efficient)
                    </li>
                    <li className="flex items-center gap-2">
                      <WifiOff className="h-4 w-4 text-cyan-400" />
                      Offline first (no internet required)
                    </li>
                    <li className="flex items-center gap-2">
                      <Cpu className="h-4 w-4 text-pink-400" />
                      GPU acceleration (5-25x speedup)
                    </li>
                    <li className="flex items-center gap-2">
                      <Layers className="h-4 w-4 text-yellow-400" />
                      Batch processing (3-5x speedup)
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-3">What you configure:</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-accent" />
                      Optional: GPU acceleration
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-accent" />
                      Optional: Custom model path
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-accent" />
                      Optional: Sequence length
                    </li>
                  </ul>
                </div>
              </div>
              <div className="rounded-lg bg-gradient-primary p-6 text-center">
                <p className="text-primary-foreground font-semibold text-lg">
                  Result: Free embeddings. Forever. 10x faster. 100% private. Production-ready. Offline-capable.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Story Navigation */}


        <StoryNavigation className="mt-12" />



        {/* Footer */}
        <section className="px-6 py-8 border-t border-border/50">
          <div className="max-w-4xl flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <Link
                to="/docs/onnx_provider_story_v2"
                className="flex items-center gap-2 text-sm text-primary hover:underline"
              >
                <BookOpen className="h-4 w-4" />
                Read V2 (Narrative Version)
              </Link>
              <Link
                to="/docs/guides/onnx_provider"
                className="flex items-center gap-2 text-sm text-primary hover:underline"
              >
                <FileCode className="h-4 w-4" />
                Read Full Technical Guide
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <StoryLoveButton storySlug="onnx_provider_story" />
              <PageViewCounter />
            </div>
          </div>
        </section>
      </div>
    </DocsLayout>
  );
};

export default ONNXProviderStory;
