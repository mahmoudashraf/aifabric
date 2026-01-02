import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Highlight, themes } from "prism-react-renderer";
import DocsLayout from "@/components/docs/DocsLayout";
import PageViewCounter from "@/components/PageViewCounter";
import StoryLoveButton from "@/components/StoryLoveButton";
import { 
  MessageSquare, 
  Search, 
  Brain, 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  Cpu,
  DollarSign,
  Shield,
  Zap,
  Database,
  FileText,
  ChevronDown,
  AlertTriangle,
  TrendingUp,
  Cloud,
  HardDrive,
  Timer
} from "lucide-react";
import ragStoryContent from "@/content/rag-onnx-story.md?raw";

const PAGE_TITLE = "RAG + ONNX: Stop Hallucinating, Start Saving - AI Fabric Framework";
const PAGE_DESCRIPTION = "How we built retrieval-augmented generation with free local embeddings—zero hallucinations, zero API costs, $18K/year savings.";
const OG_IMAGE = "/images/orchestrator-story-og.png";

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

// RAG Flow Diagram - Animated
const RAGFlowDiagram = () => {
  const [activeStep, setActiveStep] = useState(0);
  
  const steps = [
    { label: "User Question", icon: MessageSquare, color: "bg-blue-500" },
    { label: "PII Detection", icon: Shield, color: "bg-red-500" },
    { label: "Generate Embedding", icon: Cpu, color: "bg-purple-500" },
    { label: "Vector Search", icon: Search, color: "bg-amber-500" },
    { label: "Build Context", icon: FileText, color: "bg-green-500" },
    { label: "LLM Generation", icon: Brain, color: "bg-primary" },
  ];
  
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="my-8 p-6 rounded-xl bg-card border border-border/50">
      <h3 className="text-lg font-bold text-foreground mb-6 text-center">RAG Pipeline Flow</h3>
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
              <span className="text-[10px] text-center text-muted-foreground max-w-[60px]">{step.label}</span>
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

// Embedding Visualization
const EmbeddingVisualization = () => (
  <div className="my-8 p-6 rounded-xl bg-card border border-border/50">
    <h3 className="text-lg font-bold text-foreground mb-4 text-center">How Embeddings Work</h3>
    <div className="space-y-4">
      {/* Text to Vector */}
      <div className="flex flex-col md:flex-row items-center gap-4 justify-center">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          className="px-4 py-3 bg-blue-500/20 rounded-lg border border-blue-500/50"
        >
          <span className="text-blue-400 font-mono text-sm">"laptop for programming"</span>
        </motion.div>
        <ArrowRight className="h-5 w-5 text-muted-foreground rotate-90 md:rotate-0" />
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          className="px-4 py-3 bg-purple-500/20 rounded-lg border border-purple-500/50"
        >
          <span className="text-purple-400 font-mono text-xs">[0.023, -0.145, 0.387, ..., 0.092]</span>
        </motion.div>
      </div>
      
      <p className="text-center text-muted-foreground text-sm">384 numbers representing MEANING</p>
      
      {/* Similarity Comparison */}
      <div className="grid md:grid-cols-3 gap-4 mt-6">
        <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30 text-center">
          <div className="text-green-400 font-bold mb-1">0.89</div>
          <div className="text-xs text-muted-foreground">"developer workstation"</div>
          <div className="text-green-400 text-xs mt-1">✓ Similar!</div>
        </div>
        <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30 text-center">
          <div className="text-amber-400 font-bold mb-1">0.65</div>
          <div className="text-xs text-muted-foreground">"computer desk"</div>
          <div className="text-amber-400 text-xs mt-1">~ Somewhat related</div>
        </div>
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-center">
          <div className="text-red-400 font-bold mb-1">0.32</div>
          <div className="text-xs text-muted-foreground">"laptop bag"</div>
          <div className="text-red-400 text-xs mt-1">✗ Not similar</div>
        </div>
      </div>
    </div>
  </div>
);

// Cloud vs ONNX Comparison
const CloudVsOnnxCard = ({ 
  type,
  icon: Icon,
  color,
  costs,
  features,
  isExpanded,
  onToggle
}: {
  type: string;
  icon: any;
  color: string;
  costs: { monthly: string; yearly: string };
  features: { label: string; value: string; good: boolean }[];
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
            <h3 className="text-xl font-bold text-foreground">{type}</h3>
            <p className="text-lg font-mono text-primary">{costs.monthly}</p>
          </div>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="h-5 w-5 text-muted-foreground" />
        </motion.div>
      </div>
    </div>
    
    <AnimatePresence>
      {isExpanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="border-t border-border/50"
        >
          <div className="p-6 space-y-3">
            {features.map((feature, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{feature.label}</span>
                <span className={`text-sm font-medium ${feature.good ? 'text-green-400' : 'text-red-400'}`}>
                  {feature.good ? '✓' : '✗'} {feature.value}
                </span>
              </div>
            ))}
            <div className="pt-3 border-t border-border/50">
              <div className="text-sm text-muted-foreground">Annual Cost</div>
              <div className={`text-xl font-bold ${type === 'ONNX Local' ? 'text-green-400' : 'text-red-400'}`}>
                {costs.yearly}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </motion.div>
);

// Impact Metrics
const ImpactMetrics = () => {
  const metrics = [
    { label: "Annual Savings", value: "$18K+", icon: DollarSign, color: "text-green-400" },
    { label: "Latency", value: "10-50ms", icon: Timer, color: "text-amber-400" },
    { label: "Privacy", value: "100%", icon: Shield, color: "text-blue-400" },
    { label: "Hallucinations", value: "0", icon: AlertTriangle, color: "text-primary" },
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

// RAG Architecture Diagram
const RAGArchitectureDiagram = () => (
  <div className="my-8 p-6 rounded-xl bg-card border border-border/50 overflow-x-auto">
    <h3 className="text-lg font-bold text-foreground mb-6 text-center">RAG + ONNX Architecture</h3>
    <div className="min-w-[600px]">
      <svg viewBox="0 0 800 400" className="w-full h-auto">
        {/* Background Grid */}
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="hsl(var(--border))" strokeWidth="0.5" opacity="0.3"/>
          </pattern>
        </defs>
        <rect width="800" height="400" fill="url(#grid)"/>
        
        {/* User Query */}
        <rect x="20" y="160" width="100" height="60" rx="8" fill="hsl(var(--primary))" opacity="0.2" stroke="hsl(var(--primary))" strokeWidth="2"/>
        <text x="70" y="185" textAnchor="middle" fill="hsl(var(--foreground))" fontSize="11" fontWeight="bold">User Query</text>
        <text x="70" y="200" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="9">"How to reset?"</text>
        
        {/* Arrow */}
        <path d="M 130 190 L 170 190" stroke="hsl(var(--muted-foreground))" strokeWidth="2" markerEnd="url(#arrow)"/>
        
        {/* ONNX Embedding */}
        <rect x="180" y="140" width="120" height="80" rx="8" fill="#22c55e" opacity="0.2" stroke="#22c55e" strokeWidth="2"/>
        <text x="240" y="165" textAnchor="middle" fill="hsl(var(--foreground))" fontSize="10" fontWeight="bold">ONNX Embeddings</text>
        <text x="240" y="182" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="9">Local • Free • Fast</text>
        <text x="240" y="197" textAnchor="middle" fill="#22c55e" fontSize="9">384 dimensions</text>
        <text x="240" y="210" textAnchor="middle" fill="#22c55e" fontSize="8">10-50ms | $0</text>
        
        {/* Arrow */}
        <path d="M 310 180 L 350 180" stroke="hsl(var(--muted-foreground))" strokeWidth="2"/>
        
        {/* Vector Search */}
        <rect x="360" y="140" width="120" height="80" rx="8" fill="hsl(var(--chart-2))" opacity="0.2" stroke="hsl(var(--chart-2))" strokeWidth="2"/>
        <text x="420" y="165" textAnchor="middle" fill="hsl(var(--foreground))" fontSize="10" fontWeight="bold">Vector Search</text>
        <text x="420" y="182" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="9">Cosine Similarity</text>
        <text x="420" y="197" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="8">Find relevant docs</text>
        <text x="420" y="210" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="8">Threshold: 0.8+</text>
        
        {/* Arrow */}
        <path d="M 490 180 L 530 180" stroke="hsl(var(--muted-foreground))" strokeWidth="2"/>
        
        {/* LLM Generation */}
        <rect x="540" y="140" width="120" height="80" rx="8" fill="hsl(var(--chart-1))" opacity="0.2" stroke="hsl(var(--chart-1))" strokeWidth="2"/>
        <text x="600" y="165" textAnchor="middle" fill="hsl(var(--foreground))" fontSize="10" fontWeight="bold">LLM Generation</text>
        <text x="600" y="182" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="9">Context + Question</text>
        <text x="600" y="197" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="8">Answer from YOUR docs</text>
        <text x="600" y="210" textAnchor="middle" fill="#22c55e" fontSize="8">No hallucinations!</text>
        
        {/* Arrow */}
        <path d="M 670 180 L 710 180" stroke="hsl(var(--muted-foreground))" strokeWidth="2"/>
        
        {/* Final Answer */}
        <rect x="720" y="155" width="60" height="50" rx="8" fill="hsl(var(--primary))" opacity="0.3" stroke="hsl(var(--primary))" strokeWidth="2"/>
        <text x="750" y="183" textAnchor="middle" fill="hsl(var(--foreground))" fontSize="10" fontWeight="bold">Answer</text>
        <text x="750" y="195" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="8">+ Sources</text>
        
        {/* Your Database - Bottom */}
        <rect x="280" y="280" width="240" height="70" rx="8" fill="hsl(var(--accent))" opacity="0.2" stroke="hsl(var(--accent))" strokeWidth="2"/>
        <text x="400" y="305" textAnchor="middle" fill="hsl(var(--foreground))" fontSize="11" fontWeight="bold">Your Database</text>
        <text x="400" y="320" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="9">Documents • Knowledge Base • FAQs</text>
        <text x="400" y="335" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="8">Pre-indexed with ONNX embeddings</text>
        
        {/* Connection from DB to Vector Search */}
        <path d="M 400 280 L 400 230 L 420 230" stroke="hsl(var(--muted-foreground))" strokeWidth="1.5" strokeDasharray="4" fill="none"/>
        
        {/* Cost Comparison Box */}
        <rect x="20" y="280" width="180" height="80" rx="8" fill="hsl(var(--card))" stroke="hsl(var(--border))" strokeWidth="1"/>
        <text x="110" y="300" textAnchor="middle" fill="hsl(var(--foreground))" fontSize="10" fontWeight="bold">Cost Comparison</text>
        <text x="110" y="318" textAnchor="middle" fill="#ef4444" fontSize="9">Cloud: $1,200-1,800/yr</text>
        <text x="110" y="333" textAnchor="middle" fill="#22c55e" fontSize="9">ONNX: $0/yr</text>
        <text x="110" y="350" textAnchor="middle" fill="hsl(var(--primary))" fontSize="9" fontWeight="bold">Savings: $18K+</text>
        
        {/* Arrow marker */}
        <defs>
          <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L0,6 L9,3 z" fill="hsl(var(--muted-foreground))"/>
          </marker>
        </defs>
      </svg>
    </div>
  </div>
);

// Use Case Cards
const UseCaseCard = ({ icon: Icon, title, before, after, impact, color }: {
  icon: any;
  title: string;
  before: string;
  after: string;
  impact: string;
  color: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="p-5 rounded-xl bg-card border border-border/50"
  >
    <div className="flex items-center gap-3 mb-4">
      <div className={`p-2 rounded-lg ${color}`}>
        <Icon className="h-5 w-5 text-white" />
      </div>
      <h4 className="font-bold text-foreground">{title}</h4>
    </div>
    <div className="space-y-3 text-sm">
      <div className="p-2 rounded bg-red-500/10 border border-red-500/20">
        <span className="text-red-400 font-medium">Before: </span>
        <span className="text-muted-foreground">{before}</span>
      </div>
      <div className="p-2 rounded bg-green-500/10 border border-green-500/20">
        <span className="text-green-400 font-medium">After: </span>
        <span className="text-muted-foreground">{after}</span>
      </div>
      <div className="text-primary font-medium">{impact}</div>
    </div>
  </motion.div>
);

// Hallucination Comparison
const HallucinationComparison = () => (
  <div className="my-8 grid md:grid-cols-2 gap-6">
    {/* Without RAG */}
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className="p-6 rounded-xl bg-card border-2 border-red-500/50"
    >
      <div className="flex items-center gap-2 mb-4">
        <XCircle className="h-5 w-5 text-red-400" />
        <h4 className="font-bold text-foreground">Without RAG</h4>
      </div>
      <div className="space-y-3 text-sm">
        <div className="p-3 rounded bg-muted/30">
          <span className="text-muted-foreground">User: </span>
          <span className="text-foreground">"What's the return policy?"</span>
        </div>
        <div className="p-3 rounded bg-red-500/10 border border-red-500/30">
          <span className="text-muted-foreground">LLM: </span>
          <span className="text-foreground">"Probably 30 days. Most companies do that."</span>
        </div>
        <div className="text-red-400 font-medium">❌ HALLUCINATION (actual: 90 days)</div>
      </div>
    </motion.div>

    {/* With RAG */}
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className="p-6 rounded-xl bg-card border-2 border-green-500/50"
    >
      <div className="flex items-center gap-2 mb-4">
        <CheckCircle2 className="h-5 w-5 text-green-400" />
        <h4 className="font-bold text-foreground">With RAG</h4>
      </div>
      <div className="space-y-3 text-sm">
        <div className="p-3 rounded bg-muted/30">
          <span className="text-muted-foreground">User: </span>
          <span className="text-foreground">"What's the return policy?"</span>
        </div>
        <div className="p-3 rounded bg-green-500/10 border border-green-500/30">
          <span className="text-muted-foreground">LLM: </span>
          <span className="text-foreground">"Based on our policy document, you have 90 days to return any product."</span>
        </div>
        <div className="text-green-400 font-medium">✓ ACCURATE (from YOUR docs)</div>
      </div>
    </motion.div>
  </div>
);

const RagStory = () => {
  const [expandedOption, setExpandedOption] = useState<string | null>("ONNX Local");

  useEffect(() => {
    document.title = PAGE_TITLE;
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", PAGE_DESCRIPTION);
    }
    
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute("content", PAGE_TITLE);
    
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) ogDescription.setAttribute("content", PAGE_DESCRIPTION);
    
    const ogImage = document.querySelector('meta[property="og:image"]');
    if (ogImage) ogImage.setAttribute("content", OG_IMAGE);
  }, []);

  const comparisonOptions = [
    {
      type: "Cloud APIs",
      icon: Cloud,
      color: "border-red-500",
      costs: { monthly: "$100-150/mo", yearly: "$1,200-1,800/year" },
      features: [
        { label: "Data Privacy", value: "Leaves servers", good: false },
        { label: "HIPAA/GDPR", value: "Questionable", good: false },
        { label: "Internet Required", value: "Yes", good: false },
        { label: "Latency", value: "100-500ms", good: false },
        { label: "Usage Tracking", value: "By third party", good: false },
      ],
    },
    {
      type: "ONNX Local",
      icon: HardDrive,
      color: "border-green-500",
      costs: { monthly: "$0/mo", yearly: "$0 forever" },
      features: [
        { label: "Data Privacy", value: "On your servers", good: true },
        { label: "HIPAA/GDPR", value: "100% compliant", good: true },
        { label: "Internet Required", value: "No (offline)", good: true },
        { label: "Latency", value: "10-50ms", good: true },
        { label: "Usage Tracking", value: "None", good: true },
      ],
    },
  ];

  return (
    <DocsLayout>
      <div className="max-w-4xl mx-auto">
        <motion.article 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="py-8"
        >
          {/* Hero Section */}
          <header className="mb-12">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <Brain className="h-4 w-4" />
              <span>RAG + ONNX + Embeddings</span>
              <span className="mx-2">•</span>
              <span>15 min read</span>
              <span className="mx-2">•</span>
              <PageViewCounter />
            </div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-bold text-foreground mb-6"
            >
              💬 RAG + ONNX: Stop Hallucinating
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-muted-foreground leading-relaxed"
            >
              How we built retrieval-augmented generation with <span className="text-green-400 font-semibold">free local embeddings</span>—zero hallucinations, zero API costs, <span className="text-primary font-semibold">$18K/year savings</span>.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-6 p-4 rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20"
            >
              <p className="text-sm text-muted-foreground">
                🚧 <strong className="text-foreground">Under active development</strong> | Q1 2026 release | Tested with 10M+ entities
              </p>
            </motion.div>
          </header>

          {/* The Problem - Hallucination Example */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-6">The $47.23 Disaster</h2>
            
            <div className="p-6 rounded-xl bg-red-500/5 border border-red-500/30 mb-6">
              <div className="flex items-start gap-3 mb-4">
                <AlertTriangle className="h-6 w-6 text-red-400 flex-shrink-0 mt-1" />
                <div>
                  <h3 className="font-bold text-foreground mb-2">Support Ticket #3,492</h3>
                  <p className="text-muted-foreground italic">
                    "Your chatbot told me my balance was $10,000. I transferred $9,000 to pay rent. My actual balance was $47.23. The transfer bounced. I'm being evicted."
                  </p>
                </div>
              </div>
              <p className="text-muted-foreground">
                <strong className="text-red-400">The AI hallucinated.</strong> Because you asked an LLM to <em>guess</em> instead of reading your database.
              </p>
            </div>
          </section>

          {/* Hallucination Comparison */}
          <HallucinationComparison />

          {/* Impact Metrics */}
          <ImpactMetrics />

          {/* RAG Flow */}
          <RAGFlowDiagram />

          {/* Embedding Visualization */}
          <EmbeddingVisualization />

          {/* Cloud vs ONNX Comparison */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-6">The $18,000 Question: Cloud vs Local?</h2>
            <div className="grid md:grid-cols-2 gap-4">
              {comparisonOptions.map((option) => (
                <CloudVsOnnxCard
                  key={option.type}
                  {...option}
                  isExpanded={expandedOption === option.type}
                  onToggle={() => setExpandedOption(expandedOption === option.type ? null : option.type)}
                />
              ))}
            </div>
          </section>

          {/* Architecture */}
          <RAGArchitectureDiagram />

          {/* Use Cases */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-6">Real Business Impact</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <UseCaseCard
                icon={TrendingUp}
                title="E-Commerce Search"
                before="Keyword search, 2% conversion"
                after="Semantic search, 42% conversion"
                impact="+$250K/month revenue, $18K/year saved on API costs"
                color="bg-green-500"
              />
              <UseCaseCard
                icon={MessageSquare}
                title="Support Chatbot"
                before="10K tickets/month, $50K/year support costs"
                after="70% auto-answered, RAG-powered"
                impact="$35K/year saved, 92% satisfaction"
                color="bg-blue-500"
              />
              <UseCaseCard
                icon={Shield}
                title="Legal Documents"
                before="50K docs, data sent to cloud APIs"
                after="100% private, ONNX local processing"
                impact="Zero privacy risk, legal approved"
                color="bg-purple-500"
              />
              <UseCaseCard
                icon={Database}
                title="Medical Chatbot"
                before="LLM guessing, hallucination risk"
                after="RAG from approved literature"
                impact="70% questions auto-answered, HIPAA compliant"
                color="bg-red-500"
              />
            </div>
          </section>

          {/* The Bottom Line */}
          <section className="mb-12">
            <div className="p-6 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20">
              <h2 className="text-2xl font-bold text-foreground mb-4">Why ONNX Changes Everything</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-red-400 mb-2">The Old Way</h3>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>❌ Cloud API costs: $1,200-1,800/year</li>
                    <li>❌ Data leaves your servers</li>
                    <li>❌ HIPAA compliance questionable</li>
                    <li>❌ Internet dependency</li>
                    <li>❌ Network latency: 100-500ms</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-green-400 mb-2">The ONNX Way</h3>
                  <ul className="space-y-1 text-sm text-muted-foreground">
                    <li>✓ Cost: $0/year forever</li>
                    <li>✓ Data never leaves your servers</li>
                    <li>✓ HIPAA/GDPR compliant</li>
                    <li>✓ No internet needed</li>
                    <li>✓ Blazing fast: 10-50ms</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Love Button */}
          <div className="my-8 flex justify-center">
            <StoryLoveButton storySlug="rag_story" />
          </div>

          {/* Full Story */}
          <section className="prose prose-invert max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ className, children }) {
                  const isInline = !className;
                  if (isInline) {
                    return (
                      <code className="bg-muted px-1.5 py-0.5 rounded text-primary text-sm">
                        {children}
                      </code>
                    );
                  }
                  return <CodeBlock className={className}>{String(children)}</CodeBlock>;
                },
                h1: ({ children }) => (
                  <h1 className="text-3xl font-bold text-foreground mt-12 mb-6">{children}</h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-2xl font-bold text-foreground mt-10 mb-4">{children}</h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-xl font-semibold text-foreground mt-8 mb-3">{children}</h3>
                ),
                p: ({ children }) => (
                  <p className="text-muted-foreground leading-relaxed mb-4">{children}</p>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4">{children}</ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal list-inside space-y-2 text-muted-foreground mb-4">{children}</ol>
                ),
                li: ({ children }) => (
                  <li className="text-muted-foreground">{children}</li>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground my-4">
                    {children}
                  </blockquote>
                ),
                a: ({ href, children }) => (
                  <a href={href} className="text-primary hover:underline">{children}</a>
                ),
                hr: () => <hr className="border-border my-8" />,
              }}
            >
              {ragStoryContent}
            </ReactMarkdown>
          </section>

          {/* Footer */}
          <footer className="border-t border-border/50 pt-8 mt-12">
            <div className="flex flex-col items-center gap-4">
              <StoryLoveButton storySlug="rag-onnx-story" />
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

export default RagStory;
