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
  Wifi,
  WifiOff,
  TrendingDown,
  BarChart3,
  Play,
  Pause,
  RotateCcw,
  Rocket,
  Lightbulb,
  Search
} from "lucide-react";

const PAGE_TITLE = "ONNX Provider V2: The $12,000 Bill That Never Came - AI Fabric Framework";
const PAGE_DESCRIPTION = "A developer's journey from paying forever for embeddings to generating them locally for free—how ONNX saved thousands and kept data private.";
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

const CompleteEmbeddingFlow = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const steps = [
    {
      number: 1,
      title: "User Text",
      icon: MessageSquare,
      color: "bg-blue-500",
      description: "Input: \"Machine learning is transforming the world\"\nReady for processing"
    },
    {
      number: 2,
      title: "Tokenization",
      icon: Code,
      color: "bg-purple-500",
      description: "tokenizeText()\nHuggingFace Tokenizer or WordPiece\nAdd [CLS] and [SEP] tokens\nPad/truncate to 512 tokens\nResult: inputIds, attentionMask"
    },
    {
      number: 3,
      title: "Create ONNX Tensors",
      icon: Database,
      color: "bg-orange-500",
      description: "OnnxTensor.createTensor()\nShape: [1, 512]\ninputIdsTensor, attentionMaskTensor\ntokenTypeIdsTensor\nReady for inference"
    },
    {
      number: 4,
      title: "ONNX Inference",
      icon: Cpu,
      color: "bg-green-500",
      description: "ortSession.run()\nModel: all-MiniLM-L6-v2 (86MB)\n6 transformer layers\n384 hidden dimensions\nOutput: [1, 512, 384] token embeddings"
    },
    {
      number: 5,
      title: "Mean Pooling",
      icon: Layers,
      color: "bg-red-500",
      description: "meanPoolEmbeddings()\nAverage token embeddings\nRespect attention mask\nResult: [384] sentence embedding\nNormalized vector"
    },
    {
      number: 6,
      title: "Return Embedding",
      icon: CheckCircle2,
      color: "bg-teal-500",
      description: "AIEmbeddingResponse\n384 dimensions\nModel: onnx:all-MiniLM-L6-v2\nProcessing time: 15ms CPU / 3ms GPU\n$0 cost, 100% private"
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
        Complete Embedding Generation Flow: From Text to Vector in 15ms
      </h3>
      <p className="text-sm text-muted-foreground text-center mb-6">
        Watch how your text becomes a 384-dimensional embedding—locally, privately, and for free
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

const TheCostJourney = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const steps = [
    {
      time: "Month 1",
      title: "The First Bill",
      icon: DollarSign,
      color: "text-blue-400",
      bgColor: "bg-blue-500/5",
      borderColor: "border-blue-500/30",
      events: [
        { emoji: "💳", text: "CFO: 'We need embeddings for semantic search'", type: "normal" },
        { emoji: "😊", text: "Developer: 'I'll use OpenAI API'", type: "positive" },
        { emoji: "📊", text: "First month: 1M embeddings, $100 bill", type: "warning" },
        { emoji: "☕", text: "Team: 'That's reasonable'", type: "info" }
      ]
    },
    {
      time: "Month 3",
      title: "The Growing Cost",
      icon: TrendingUp,
      color: "text-orange-400",
      bgColor: "bg-orange-500/5",
      borderColor: "border-orange-500/30",
      events: [
        { emoji: "📈", text: "Usage grows: 3M embeddings/month", type: "warning" },
        { emoji: "💰", text: "Bill: $300/month", type: "warning" },
        { emoji: "😅", text: "CFO: 'This is getting expensive'", type: "warning" },
        { emoji: "💭", text: "Developer: 'Maybe we can optimize...'", type: "warning" }
      ]
    },
    {
      time: "Month 6",
      title: "The Shock",
      icon: AlertTriangle,
      color: "text-red-400",
      bgColor: "bg-red-500/5",
      borderColor: "border-red-500/30",
      events: [
        { emoji: "📧", text: "CFO: 'Why is our embedding bill $1,000 this month?'", type: "critical" },
        { emoji: "😰", text: "Developer: 'We're doing 10M embeddings now...'", type: "critical" },
        { emoji: "💔", text: "Annual projection: $12,000/year", type: "critical" },
        { emoji: "🔍", text: "Research: 'Can we generate embeddings locally?'", type: "positive" }
      ]
    },
    {
      time: "Month 7",
      title: "The Discovery",
      icon: Lightbulb,
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/5",
      borderColor: "border-yellow-500/30",
      events: [
        { emoji: "💡", text: "Discovers: ONNX Runtime for local inference", type: "positive" },
        { emoji: "🔍", text: "Finds: AI Fabric has ONNX provider", type: "positive" },
        { emoji: "📦", text: "Adds dependency: One line in pom.xml", type: "positive" },
        { emoji: "⚡", text: "Framework handles everything automatically", type: "positive" }
      ]
    },
    {
      time: "Month 7 (Week 2)",
      title: "The Migration",
      icon: Rocket,
      color: "text-green-400",
      bgColor: "bg-green-500/5",
      borderColor: "border-green-500/30",
      events: [
        { emoji: "⚙️", text: "Changes config: embedding-provider: onnx", type: "intervention" },
        { emoji: "✅", text: "Tests: Same interface, same results", type: "intervention" },
        { emoji: "🚀", text: "Deploys: Zero downtime migration", type: "intervention" },
        { emoji: "📊", text: "Performance: 10x faster (15ms vs 150ms)", type: "intervention" }
      ]
    },
    {
      time: "Month 8",
      title: "The Savings",
      icon: TrendingDown,
      color: "text-green-400",
      bgColor: "bg-green-500/5",
      borderColor: "border-green-500/30",
      events: [
        { emoji: "💰", text: "Bill: $0 (was $1,000)", type: "positive" },
        { emoji: "⚡", text: "Speed: 10x faster (15ms vs 150ms)", type: "positive" },
        { emoji: "🔒", text: "Privacy: 100% private (data never leaves)", type: "positive" },
        { emoji: "🌍", text: "Offline: Works without internet", type: "positive" }
      ]
    },
    {
      time: "Year 1",
      title: "The Impact",
      icon: CheckCircle2,
      color: "text-green-400",
      bgColor: "bg-green-500/5",
      borderColor: "border-green-500/30",
      events: [
        { emoji: "💰", text: "Total savings: $12,000/year", type: "positive" },
        { emoji: "⚡", text: "Performance: 10x faster consistently", type: "positive" },
        { emoji: "🔒", text: "Privacy: GDPR-compliant by default", type: "positive" },
        { emoji: "🎯", text: "Production: Zero issues, 100% uptime", type: "positive" }
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
        The $12,000 Bill That Never Came
      </h3>
      <p className="text-sm text-muted-foreground text-center mb-8">
        A journey from paying forever to generating locally for free
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
                  {step.time}
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
          <p className="text-lg font-bold text-green-400 mb-2">ONNX Provider Enabled: $12,000 Saved</p>
          <p className="text-sm text-muted-foreground">
            Zero cost. 10x faster. 100% private. Works offline. Production-ready.
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
        Before & After: From $12K/Year to $0 Forever
      </h3>
      
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Before */}
        <div className="p-6 rounded-xl border-2 border-red-500/30 bg-red-500/5">
          <div className="flex items-center gap-3 mb-4">
            <XCircle className="h-6 w-6 text-red-400" />
            <h4 className="font-bold text-foreground">Before: Cloud API</h4>
          </div>
          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-muted/30 border border-border/30">
              <p className="text-xs font-semibold text-foreground mb-2">Problems:</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• $1,000/month ($12,000/year)</li>
                <li>• Data sent to third party</li>
                <li>• Internet required</li>
                <li>• 100-500ms latency</li>
                <li>• Rate limits & throttling</li>
                <li>• Usage tracking by vendor</li>
                <li>• Vendor lock-in</li>
                <li>• Monthly bills forever</li>
              </ul>
            </div>
            <CodeBlock code={`// Cloud API Integration
@Autowired
private RestTemplate restTemplate;

public List<Double> generateEmbedding(String text) {
    // Build request
    Map<String, Object> request = new HashMap<>();
    request.put("input", text);
    request.put("model", "text-embedding-ada-002");
    
    // Call API (100-500ms, $0.0001 cost)
    ResponseEntity<Map> response = restTemplate.postForEntity(
        "https://api.openai.com/v1/embeddings",
        new HttpEntity<>(request, headers),
        Map.class
    );
    
    // Parse response
    // ...
    
    // Cost: $0.0001 per embedding
    // Latency: 100-500ms
    // Privacy: Data sent to OpenAI
    // Internet: Required
}`} />
          </div>
        </div>
        
        {/* After */}
        <div className="p-6 rounded-xl border-2 border-green-500/30 bg-green-500/5">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle2 className="h-6 w-6 text-green-400" />
            <h4 className="font-bold text-foreground">After: ONNX Local</h4>
          </div>
          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-muted/30 border border-border/30">
              <p className="text-xs font-semibold text-foreground mb-2">Benefits:</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• $0/month ($0/year) - Forever free</li>
                <li>• 100% private (data never leaves)</li>
                <li>• Works offline</li>
                <li>• 10-50ms latency (10x faster)</li>
                <li>• No rate limits</li>
                <li>• No usage tracking</li>
                <li>• No vendor lock-in</li>
                <li>• No monthly bills</li>
              </ul>
            </div>
            <CodeBlock code={`// ONNX Local Integration
@Autowired
private EmbeddingProvider embeddingProvider;

public List<Double> generateEmbedding(String text) {
    // Generate embedding (15ms CPU, 3ms GPU, $0 cost)
    AIEmbeddingResponse response = embeddingProvider.generateEmbedding(
        AIEmbeddingRequest.builder()
            .text(text)
            .build()
    );
    
    return response.getEmbedding();
    
    // Cost: $0 per embedding
    // Latency: 15ms (CPU) or 3ms (GPU)
    // Privacy: 100% private
    // Internet: Not required
}

// Same interface. Zero configuration. Production-ready.`} />
          </div>
        </div>
      </div>
      
      <div className="mt-6 p-4 rounded-lg bg-primary/10 border border-primary/20 text-center">
        <p className="text-sm font-bold text-primary">
          Result: $12,000/year → $0/year. 100-500ms → 15ms. Cloud → Local. Forever free.
        </p>
      </div>
    </div>
  );
};

const PrivacyComparison = () => {
  return (
    <div className="my-16">
      <h3 className="text-2xl font-bold text-foreground mb-8 text-center">
        Privacy & Compliance: Your Data Stays Yours
      </h3>
      
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-xl border border-red-500/30 bg-red-500/5">
          <div className="flex items-center gap-3 mb-4">
            <Wifi className="h-6 w-6 text-red-400" />
            <h4 className="font-bold text-foreground">Cloud API: Data Leaves</h4>
          </div>
          <CodeBlock code={`// ❌ Cloud API: Your data goes here...
POST https://api.openai.com/v1/embeddings
{
  "input": "CONFIDENTIAL: Patient record 12345..."
}

// Data sent to:
// - OpenAI servers (third party)
// - Over internet (potential interception)
// - Stored in logs (compliance risk)
// - Used for analytics (privacy concern)

// GDPR: Requires data processing agreements
// HIPAA: May violate patient privacy
// SOC2: External dependency risk`} language="java" />
        </div>
        
        <div className="p-6 rounded-xl border border-green-500/30 bg-green-500/5">
          <div className="flex items-center gap-3 mb-4">
            <Lock className="h-6 w-6 text-green-400" />
            <h4 className="font-bold text-foreground">ONNX: Data Stays</h4>
          </div>
          <CodeBlock code={`// ✅ ONNX: Your data stays here
embeddingProvider.generateEmbedding(request);

// Processed on:
// - Your server (100% private)
// - Never touches internet (offline capable)
// - No third-party access (zero risk)
// - No usage tracking (complete privacy)

// GDPR: Compliant by default
// HIPAA: Fully compliant (no external access)
// SOC2: No external dependencies
// Air-gapped: Works offline`} language="java" />
        </div>
      </div>
      
      <div className="mt-6 grid md:grid-cols-4 gap-4">
        <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30 text-center">
          <CheckCircle2 className="h-6 w-6 text-green-400 mx-auto mb-2" />
          <p className="text-sm font-semibold text-foreground">GDPR Compliant</p>
          <p className="text-xs text-muted-foreground">By default</p>
        </div>
        <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30 text-center">
          <CheckCircle2 className="h-6 w-6 text-green-400 mx-auto mb-2" />
          <p className="text-sm font-semibold text-foreground">HIPAA Compliant</p>
          <p className="text-xs text-muted-foreground">No external access</p>
        </div>
        <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30 text-center">
          <CheckCircle2 className="h-6 w-6 text-green-400 mx-auto mb-2" />
          <p className="text-sm font-semibold text-foreground">SOC2 Friendly</p>
          <p className="text-xs text-muted-foreground">No external deps</p>
        </div>
        <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30 text-center">
          <CheckCircle2 className="h-6 w-6 text-green-400 mx-auto mb-2" />
          <p className="text-sm font-semibold text-foreground">Offline Capable</p>
          <p className="text-xs text-muted-foreground">Air-gapped ready</p>
        </div>
      </div>
    </div>
  );
};

const TheThreeSteps = () => {
  const [activeStep, setActiveStep] = useState(0);
  
  const steps = [
    {
      step: 1,
      title: "Add Dependency",
      icon: Package,
      color: "text-blue-400",
      borderColor: "border-blue-500/30",
      bgColor: "bg-blue-500/5",
      description: "One line in pom.xml",
      code: `<dependency>
    <groupId>com.ai.fabric</groupId>
    <artifactId>ai-infrastructure-onnx-starter</artifactId>
    <version>1.0.0</version>
</dependency>`,
      time: "30 seconds"
    },
    {
      step: 2,
      title: "Use (Zero Config)",
      icon: Code,
      color: "text-green-400",
      borderColor: "border-green-500/30",
      bgColor: "bg-green-500/5",
      description: "Same interface, zero configuration",
      code: `@Autowired
private EmbeddingProvider embeddingProvider;

// Generate embedding (15ms, $0)
AIEmbeddingResponse response = embeddingProvider.generateEmbedding(
    AIEmbeddingRequest.builder()
        .text("Machine learning is amazing")
        .build()
);

// Model included. Tokenizer included. Auto-configured.`,
      time: "2 minutes"
    },
    {
      step: 3,
      title: "Done",
      icon: CheckCircle2,
      color: "text-purple-400",
      borderColor: "border-purple-500/30",
      bgColor: "bg-purple-500/5",
      description: "That's it. Production-ready.",
      code: `// No API keys needed
// No configuration needed
// No credit card needed
// No internet needed

// Result:
// - Zero cost
// - 100% private
// - 10x faster
// - Works offline
// - Production-ready`,
      time: "0 minutes"
    }
  ];

  return (
    <div className="my-16">
      <h3 className="text-2xl font-bold text-foreground mb-8 text-center">
        The 2 Steps: From Cloud to Local
      </h3>
      <p className="text-sm text-muted-foreground text-center mb-8">
        Two simple steps. Total time: 2.5 minutes. Forever free.
      </p>
      
      <div className="grid grid-cols-3 gap-2 mb-6">
        {steps.map((step, i) => {
          const Icon = step.icon;
          return (
            <button
              key={i}
              onClick={() => setActiveStep(i)}
              className={`p-3 rounded-lg border-2 transition-all ${
                activeStep === i
                  ? `${step.borderColor} ${step.bgColor} shadow-lg`
                  : "border-border/30 bg-muted/30 hover:border-border"
              }`}
            >
              <Icon className={`h-5 w-5 mx-auto mb-1 ${activeStep === i ? step.color : 'text-muted-foreground'}`} />
              <p className={`text-xs font-semibold text-center ${activeStep === i ? 'text-foreground' : 'text-muted-foreground'}`}>
                Step {step.step}
              </p>
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
          className={`p-6 rounded-xl border ${steps[activeStep].borderColor} ${steps[activeStep].bgColor}`}
        >
          <div className="flex items-center gap-3 mb-4">
            {React.createElement(steps[activeStep].icon, {
              className: `h-6 w-6 ${steps[activeStep].color}`
            })}
            <div>
              <h4 className="font-bold text-foreground">
                Step {steps[activeStep].step}: {steps[activeStep].title}
              </h4>
              <p className="text-xs text-muted-foreground">{steps[activeStep].description}</p>
            </div>
            <div className="ml-auto">
              <span className="text-xs font-semibold text-primary">{steps[activeStep].time}</span>
            </div>
          </div>
          <CodeBlock code={steps[activeStep].code} />
        </motion.div>
      </AnimatePresence>
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
            <Package className="h-6 w-6 text-primary" />
            <h4 className="font-bold text-foreground">1. Add Dependency</h4>
          </div>
          <CodeBlock code={`<dependency>
    <groupId>com.ai.fabric</groupId>
    <artifactId>ai-infrastructure-onnx-starter</artifactId>
    <version>1.0.0</version>
</dependency>`} language="xml" />
        </div>
        
        <div className="p-6 rounded-xl border border-secondary/30 bg-secondary/5">
          <div className="flex items-center gap-3 mb-4">
            <Code className="h-6 w-6 text-secondary" />
            <h4 className="font-bold text-foreground">2. Use (Same Interface)</h4>
          </div>
          <CodeBlock code={`@Autowired
private EmbeddingProvider embeddingProvider;

public List<Double> generateEmbedding(String text) {
    AIEmbeddingResponse response = embeddingProvider.generateEmbedding(
        AIEmbeddingRequest.builder()
            .text(text)
            .build()
    );
    return response.getEmbedding();
}

// No API keys
// No configuration
// No credit card
// No internet
// Model included
// Tokenizer included
// Auto-configured`} />
        </div>
      </div>
      
      <div className="mt-6 p-6 rounded-xl bg-gradient-primary text-center">
        <p className="text-primary-foreground font-semibold text-lg">
          That's it. Two steps. Zero cost. 100% private. 10x faster. Works offline. Production-ready.
        </p>
      </div>
    </div>
  );
};

const ONNXProviderStoryV2 = () => {
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
                  ONNX Provider V2 (Narrative)
                </span>
                <Link 
                  to="/docs/onnx_provider_story"
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  View V1 →
                </Link>
              </div>
              <div className="flex items-center gap-3">
                <StoryLoveButton storySlug="onnx_provider_story_v2" />
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
                <span className="text-gradient">$12,000 Bill</span>{" "}
                That Never Came
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mb-8">
                A developer's journey from paying forever for embeddings to generating them locally for free—how ONNX 
                saved thousands and kept data private.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2 text-sm text-accent">
                  <DollarSign className="h-4 w-4" />
                  $12K → $0
                </div>
                <div className="flex items-center gap-2 rounded-full bg-secondary/10 px-4 py-2 text-sm text-secondary">
                  <Zap className="h-4 w-4" />
                  10x Faster
                </div>
                <div className="flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm text-primary">
                  <Lock className="h-4 w-4" />
                  100% Private
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* The Cost Journey Timeline */}
        <section className="px-6 py-12">
          <div className="max-w-4xl mx-auto">
            <TheCostJourney />
          </div>
        </section>

        {/* Complete Embedding Flow */}
        <section className="px-6 py-12 border-t border-border/50 bg-muted/30">
          <div className="max-w-4xl mx-auto">
            <CompleteEmbeddingFlow />
          </div>
        </section>

        {/* Before & After */}
        <section className="px-6 py-12">
          <div className="max-w-4xl mx-auto">
            <BeforeAfterComparison />
          </div>
        </section>

        {/* Privacy Comparison */}
        <section className="px-6 py-12">
          <div className="max-w-4xl mx-auto">
            <PrivacyComparison />
          </div>
        </section>

        {/* The 2 Steps */}
        <section className="px-6 py-12 border-t border-border/50 bg-muted/30">
          <div className="max-w-4xl mx-auto">
            <TheThreeSteps />
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
                to="/docs/onnx_provider_story"
                className="flex items-center gap-2 text-sm text-primary hover:underline"
              >
                <BookOpen className="h-4 w-4" />
                Read V1 (Visual Version)
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
              <StoryLoveButton storySlug="onnx_provider_story_v2" />
              <PageViewCounter />
            </div>
          </div>
        </section>
      </div>
    </DocsLayout>
  );
};

export default ONNXProviderStoryV2;

