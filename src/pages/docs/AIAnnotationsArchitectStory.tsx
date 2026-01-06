import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Highlight, themes } from "prism-react-renderer";
import DocsLayout from "@/components/docs/DocsLayout";
import PageViewCounter from "@/components/PageViewCounter";
import StoryLoveButton from "@/components/StoryLoveButton";
import StoryNavigation from "@/components/StoryNavigation";
import { 
  Building2,
  GitBranch,
  CheckCircle2,
  XCircle,
  Zap,
  Shield,
  Eye,
  BarChart3,
  Users,
  Scale,
  Puzzle,
  Target,
  ArrowRight,
  Layers,
  Box,
  Database,
  Cloud,
  Settings,
  RefreshCw
} from "lucide-react";

const PAGE_TITLE = "The Architect's Guide: Why Declarative AI Wins (Every Time)";
const PAGE_DESCRIPTION = "Imperative vs Declarative AI—technical debt, scalability, and the architectural decision that changes everything.";

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

// Architecture Comparison
const ArchitectureComparison = () => {
  const [mode, setMode] = useState<"imperative" | "declarative">("imperative");

  return (
    <div className="my-12">
      <div className="flex gap-2 mb-6 justify-center">
        <button
          onClick={() => setMode("imperative")}
          className={`px-6 py-3 rounded-xl font-semibold transition-all ${
            mode === "imperative"
              ? "bg-red-500/20 border-2 border-red-500/50 text-red-400"
              : "bg-muted/30 border border-border/50 text-muted-foreground"
          }`}
        >
          <XCircle className="h-4 w-4 inline mr-2" />
          Imperative (The Old Way)
        </button>
        <button
          onClick={() => setMode("declarative")}
          className={`px-6 py-3 rounded-xl font-semibold transition-all ${
            mode === "declarative"
              ? "bg-green-500/20 border-2 border-green-500/50 text-green-400"
              : "bg-muted/30 border border-border/50 text-muted-foreground"
          }`}
        >
          <CheckCircle2 className="h-4 w-4 inline mr-2" />
          Declarative (The New Way)
        </button>
      </div>

      <AnimatePresence mode="wait">
        {mode === "imperative" ? (
          <motion.div
            key="imperative"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <div className="p-6 rounded-xl bg-red-500/5 border border-red-500/30 mb-4">
              <h4 className="font-bold text-red-400 mb-2">You Write ALL The Infrastructure</h4>
              <p className="text-sm text-muted-foreground">
                Every service knows about embeddings, vector DBs, retries, PII handling...
              </p>
            </div>
            <CodeBlock code={`// ProductService.java - The IMPERATIVE nightmare
@Service
@RequiredArgsConstructor
public class ProductService {
    
    private final ProductRepository productRepository;
    private final EmbeddingService embeddingService;
    private final VectorDbClient vectorDb;
    private final PIIScanner piiScanner;
    private final MetricsService metrics;
    private final RetryTemplate retryTemplate;
    
    @Transactional
    public Product createProduct(Product product) {
        // 1. Business logic (what we actually want to do)
        Product saved = productRepository.save(product);
        
        // 2-7: AI infrastructure code we don't want to write...
        
        // 2. Build searchable text (fragile, manual)
        String searchableText = product.getName() + " " + 
                                product.getDescription() + " " + 
                                product.getCategory();
        
        // 3. PII scanning (hope you didn't forget)
        searchableText = piiScanner.redact(searchableText);
        
        // 4. Generate embedding (retry logic needed)
        float[] embedding = retryTemplate.execute(ctx -> 
            embeddingService.embed(searchableText)
        );
        
        // 5. Build metadata (manual, error-prone)
        Map<String, Object> metadata = new HashMap<>();
        metadata.put("price", product.getPrice());
        metadata.put("rating", product.getRating());
        metadata.put("inStock", product.getInStock());
        
        // 6. Store in vector DB (more retry logic)
        retryTemplate.execute(ctx -> {
            vectorDb.upsert(
                "product-" + saved.getId(),
                embedding,
                metadata
            );
            return null;
        });
        
        // 7. Metrics (easily forgotten)
        metrics.increment("product.indexed");
        
        return saved;
    }
    
    // Now imagine update() and delete()...
    // Same 50 lines. Copy-pasted. Maintained separately.
}`} />
            <div className="mt-4 p-4 rounded-lg bg-red-500/10 border border-red-500/20">
              <p className="text-sm text-red-400 font-semibold">
                Problems: 50+ lines per method • Copy-paste across services • Easy to forget PII • No consistency guarantee
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="declarative"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="p-6 rounded-xl bg-green-500/5 border border-green-500/30 mb-4">
              <h4 className="font-bold text-green-400 mb-2">You Declare WHAT, Framework Handles HOW</h4>
              <p className="text-sm text-muted-foreground">
                Annotations describe intent. Framework handles all AI infrastructure.
              </p>
            </div>
            <CodeBlock code={`// ProductService.java - The DECLARATIVE dream
@Service
@RequiredArgsConstructor
public class ProductService {
    
    private final ProductRepository productRepository;
    // That's it. No embedding, vector DB, PII, retry, metrics clients.
    
    @AIProcess(entityType = "product", processType = "create")
    @Transactional
    public Product createProduct(Product product) {
        return productRepository.save(product);
        // Done. Framework handles EVERYTHING else.
    }
    
    @AIProcess(entityType = "product", processType = "update")
    @Transactional
    public Product updateProduct(Product product) {
        return productRepository.save(product);
        // Same simplicity for updates
    }
    
    @AIProcess(entityType = "product", processType = "delete", 
               generateEmbedding = false)
    @Transactional
    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
        // Framework cleans up vector DB automatically
    }
}

// Entity tells framework WHAT to process
@Entity
@AICapable(entityType = "product")
public class Product {
    @AISearchable private String name;        // In embedding
    @AISearchable private String description; // In embedding
    @AIContext private BigDecimal price;      // In metadata
    @AIContext private Boolean inStock;       // In metadata
    private String sku;                       // Internal only
}`} />
            <div className="mt-4 p-4 rounded-lg bg-green-500/10 border border-green-500/20">
              <p className="text-sm text-green-400 font-semibold">
                Benefits: 5 lines per method • Consistency guaranteed • PII handled automatically • Observable by default
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Benefits Grid
const BenefitsGrid = () => {
  const [activeBenefit, setActiveBenefit] = useState(0);
  
  const benefits = [
    {
      icon: Layers,
      title: "Separation of Concerns",
      color: "text-blue-400",
      borderColor: "border-blue-500/30",
      bgColor: "bg-blue-500/5",
      description: "Business logic stays clean. AI infrastructure is invisible.",
      details: [
        "Services focus on WHAT they do",
        "Framework handles HOW AI works",
        "No embedding code in business services",
        "No vector DB coupling",
      ]
    },
    {
      icon: Scale,
      title: "Consistency at Scale",
      color: "text-green-400",
      borderColor: "border-green-500/30",
      bgColor: "bg-green-500/5",
      description: "100 entities, 100 developers, same behavior.",
      details: [
        "Same retry policy everywhere",
        "Same PII handling everywhere",
        "Same metrics everywhere",
        "No copy-paste drift",
      ]
    },
    {
      icon: Puzzle,
      title: "Pluggable Providers",
      color: "text-purple-400",
      borderColor: "border-purple-500/30",
      bgColor: "bg-purple-500/5",
      description: "Swap OpenAI for ONNX? Change one config.",
      details: [
        "Switch embedding providers without code change",
        "Change vector DBs via configuration",
        "A/B test different models",
        "Fallback chains built-in",
      ]
    },
    {
      icon: Eye,
      title: "Observable by Default",
      color: "text-amber-400",
      borderColor: "border-amber-500/30",
      bgColor: "bg-amber-500/5",
      description: "Metrics, traces, logs—automatically.",
      details: [
        "Embedding latency tracked",
        "Vector DB operations traced",
        "Retry attempts logged",
        "Cost attribution built-in",
      ]
    },
    {
      icon: Shield,
      title: "Security Baked In",
      color: "text-red-400",
      borderColor: "border-red-500/30",
      bgColor: "bg-red-500/5",
      description: "PII detection isn't optional—it's automatic.",
      details: [
        "PII scanned before embedding",
        "Sensitive fields never leak",
        "Audit trail for compliance",
        "Can't accidentally skip",
      ]
    },
    {
      icon: RefreshCw,
      title: "Migration Ready",
      color: "text-cyan-400",
      borderColor: "border-cyan-500/30",
      bgColor: "bg-cyan-500/5",
      description: "Future-proof architecture.",
      details: [
        "New AI capabilities = new annotations",
        "Provider changes don't touch services",
        "Schema evolution handled",
        "Backward compatible",
      ]
    },
  ];

  return (
    <div className="my-16">
      <h3 className="text-2xl font-bold text-foreground mb-8 text-center">
        Why Architects Choose Declarative
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
        {benefits.map((b, i) => (
          <button
            key={i}
            onClick={() => setActiveBenefit(i)}
            className={`p-4 rounded-xl border-2 transition-all text-left ${
              activeBenefit === i
                ? `${b.borderColor} ${b.bgColor} shadow-lg`
                : "border-border/30 bg-muted/30 hover:border-border"
            }`}
          >
            <b.icon className={`h-6 w-6 mb-2 ${activeBenefit === i ? b.color : 'text-muted-foreground'}`} />
            <p className={`text-sm font-semibold ${activeBenefit === i ? 'text-foreground' : 'text-muted-foreground'}`}>
              {b.title}
            </p>
          </button>
        ))}
      </div>
      
      <AnimatePresence mode="wait">
        <motion.div
          key={activeBenefit}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`p-6 rounded-xl border ${benefits[activeBenefit].borderColor} ${benefits[activeBenefit].bgColor}`}
        >
          <div className="flex items-center gap-3 mb-4">
            {React.createElement(benefits[activeBenefit].icon, {
              className: `h-8 w-8 ${benefits[activeBenefit].color}`
            })}
            <div>
              <h4 className="text-xl font-bold text-foreground">{benefits[activeBenefit].title}</h4>
              <p className="text-sm text-muted-foreground">{benefits[activeBenefit].description}</p>
            </div>
          </div>
          <ul className="grid md:grid-cols-2 gap-2">
            {benefits[activeBenefit].details.map((detail, i) => (
              <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className={`h-4 w-4 ${benefits[activeBenefit].color} shrink-0`} />
                {detail}
              </li>
            ))}
          </ul>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

// Metrics Comparison
const MetricsComparison = () => {
  const metrics = [
    { label: "Lines of code per entity", imperative: "150-200", declarative: "15-20", improvement: "-90%" },
    { label: "Time to add new entity", imperative: "4-6 hours", declarative: "15 minutes", improvement: "-96%" },
    { label: "Onboarding time", imperative: "2-3 weeks", declarative: "2-3 days", improvement: "-85%" },
    { label: "Consistency bugs", imperative: "5-10/month", declarative: "~0", improvement: "-100%" },
    { label: "Provider swap time", imperative: "2-4 weeks", declarative: "1 config change", improvement: "-99%" },
  ];

  return (
    <div className="my-16 p-8 rounded-2xl bg-card border border-border/50">
      <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
        <BarChart3 className="h-5 w-5 text-primary" />
        The Numbers Don't Lie
      </h3>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border/50">
              <th className="text-left py-3 text-muted-foreground font-medium">Metric</th>
              <th className="text-center py-3 text-red-400 font-medium">Imperative</th>
              <th className="text-center py-3 text-green-400 font-medium">Declarative</th>
              <th className="text-right py-3 text-primary font-medium">Impact</th>
            </tr>
          </thead>
          <tbody>
            {metrics.map((m, i) => (
              <motion.tr
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                viewport={{ once: true }}
                className="border-b border-border/30"
              >
                <td className="py-4 text-foreground">{m.label}</td>
                <td className="py-4 text-center text-red-400 font-mono">{m.imperative}</td>
                <td className="py-4 text-center text-green-400 font-mono">{m.declarative}</td>
                <td className="py-4 text-right">
                  <span className="px-2 py-1 rounded-full bg-primary/10 text-primary text-sm font-bold">
                    {m.improvement}
                  </span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ADR Example
const ADRExample = () => {
  return (
    <div className="my-16 p-8 rounded-2xl bg-muted/30 border border-border/50">
      <h3 className="text-xl font-bold text-foreground mb-4">
        📝 ADR-2024-003: AI Integration Architecture
      </h3>
      <div className="space-y-6 text-sm">
        <div>
          <h4 className="font-semibold text-foreground mb-2">Status</h4>
          <p className="text-green-400">ACCEPTED</p>
        </div>
        <div>
          <h4 className="font-semibold text-foreground mb-2">Context</h4>
          <p className="text-muted-foreground">
            We need to add semantic search capabilities to 50+ entities across 12 services. 
            Two approaches considered: imperative (manual integration) vs declarative (annotations).
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-foreground mb-2">Decision</h4>
          <p className="text-muted-foreground">
            Adopt <span className="text-primary font-semibold">declarative AI annotations</span> using the AI Fabric Framework.
          </p>
        </div>
        <div>
          <h4 className="font-semibold text-foreground mb-2">Consequences</h4>
          <ul className="space-y-1 text-muted-foreground">
            <li>✓ Estimated 90% reduction in AI integration code</li>
            <li>✓ Consistent behavior across all services</li>
            <li>✓ Built-in PII protection and observability</li>
            <li>✓ Provider-agnostic (can swap embeddings/vector DBs)</li>
            <li>→ Requires team training on annotation patterns (1-2 days)</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

// Architecture Diagram
const ArchitectureDiagram = () => {
  return (
    <div className="my-16">
      <h3 className="text-2xl font-bold text-foreground mb-6 text-center">
        System Architecture
      </h3>
      <div className="p-6 rounded-xl bg-card border border-border/50 overflow-x-auto">
        <pre className="text-xs font-mono text-muted-foreground whitespace-pre">
{`
┌─────────────────────────────────────────────────────────────────────┐
│                        YOUR APPLICATION                              │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐     │
│  │  ProductService │  │  ArticleService │  │  TicketService  │     │
│  │ @AIProcess      │  │ @AIProcess      │  │ @AIProcess      │     │
│  └────────┬────────┘  └────────┬────────┘  └────────┬────────┘     │
│           │                    │                    │               │
│           └────────────────────┼────────────────────┘               │
│                                │                                     │
│                                ▼                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    AI FABRIC FRAMEWORK                       │   │
│  │  ┌───────────────────────────────────────────────────────┐  │   │
│  │  │ ✓ @AISearchable → Embedding Text Builder              │  │   │
│  │  │ ✓ @AIContext    → Metadata Mapper                     │  │   │
│  │  │ ✓ @AIProcess    → Lifecycle Interceptor               │  │   │
│  │  │ ✓ Auto PII      → Redaction Before Embedding          │  │   │
│  │  │ ✓ Auto Retry    → Exponential Backoff                 │  │   │
│  │  │ ✓ Auto Metrics  → Latency, Counts, Costs              │  │   │
│  │  └───────────────────────────────────────────────────────┘  │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                │                                     │
└────────────────────────────────┼─────────────────────────────────────┘
                                 │
         ┌───────────────────────┼───────────────────────┐
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐
│   OpenAI API    │   │    Qdrant       │   │   Prometheus    │
│  (Embeddings)   │   │  (Vector DB)    │   │   (Metrics)     │
└─────────────────┘   └─────────────────┘   └─────────────────┘

         ↓                       ↓                       ↓
   Pluggable!              Pluggable!              Observable!
`}
        </pre>
      </div>
    </div>
  );
};

const AIAnnotationsArchitectStory = () => {
  useEffect(() => {
    document.title = PAGE_TITLE;
  }, []);

  return (
    <DocsLayout>
      <div className="max-w-4xl mx-auto">
        <StoryNavigation variant="compact" className="pt-6" />

        <motion.article 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="py-8"
        >
          {/* Hero */}
          <section className="relative overflow-hidden border-b border-border/50 pb-12 mb-12">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-primary/5" />
            <div className="relative">
              <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
                <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                  <Building2 className="h-4 w-4" />
                  Architect's Guide
                </span>
                <div className="flex items-center gap-3">
                  <StoryLoveButton storySlug="ai-annotations-architect" />
                  <PageViewCounter />
                </div>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
                Why Declarative AI{" "}
                <span className="text-gradient">Wins Every Time</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mb-8">
                Technical debt, scalability, consistency—the architectural decision that changes everything for your AI integration.
              </p>
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 border border-border/50">
                  <Scale className="h-4 w-4 text-green-400" />
                  -90% Code
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 border border-border/50">
                  <Puzzle className="h-4 w-4 text-blue-400" />
                  Pluggable
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 border border-border/50">
                  <Eye className="h-4 w-4 text-amber-400" />
                  Observable
                </div>
              </div>
            </div>
          </section>

          {/* The Question */}
          <section className="mb-12 p-8 rounded-2xl bg-primary/5 border border-primary/20">
            <h2 className="text-xl font-bold text-foreground mb-4">
              The Question Every Tech Lead Asks
            </h2>
            <p className="text-muted-foreground text-lg italic mb-4">
              "Should we build AI infrastructure ourselves, or use something declarative?"
            </p>
            <p className="text-muted-foreground">
              Let me show you both approaches. Then you decide.
            </p>
          </section>

          {/* Architecture Comparison */}
          <ArchitectureComparison />

          {/* Benefits Grid */}
          <BenefitsGrid />

          {/* Architecture Diagram */}
          <ArchitectureDiagram />

          {/* Metrics */}
          <MetricsComparison />

          {/* ADR Example */}
          <ADRExample />

          {/* The Revelation */}
          <section className="mb-16 p-8 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/5 border border-primary/20 text-center">
            <Building2 className="h-16 w-16 text-primary mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-foreground mb-4">The Architect's Insight</h3>
            <div className="max-w-2xl mx-auto space-y-4 text-muted-foreground">
              <p className="text-lg">
                "I've seen teams spend 6 months building AI infrastructure."
              </p>
              <p className="text-lg">
                "Then spend another 6 months maintaining it."
              </p>
              <p className="text-lg">
                "<span className="text-primary font-semibold">Now I see teams do the same thing in a weekend with annotations.</span>"
              </p>
              <p className="text-lg">
                "Same capabilities. 1/10th the code. Zero maintenance burden."
              </p>
            </div>
          </section>

          {/* Story Navigation */}
          <StoryNavigation className="mt-12" />

          {/* Footer */}
          <footer className="border-t border-border/50 pt-12 mt-12 flex flex-col items-center gap-6">
            <div className="flex items-center gap-4">
              <StoryLoveButton storySlug="ai-annotations-architect" />
              <PageViewCounter />
            </div>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link 
                to="/docs/ai-annotations-killing-boilerplate" 
                className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
              >
                <Zap className="h-4 w-4" />
                Killing Boilerplate →
              </Link>
              <Link 
                to="/docs/ai-annotations-semantic-search" 
                className="inline-flex items-center gap-2 px-6 py-2 rounded-full border border-border bg-card text-foreground font-medium hover:bg-muted transition-colors"
              >
                Semantic Search
              </Link>
            </div>
            <p className="text-xs text-muted-foreground text-center max-w-md">
              Part of the AI Annotations Story Series — Architect's Guide
            </p>
          </footer>
        </motion.article>
      </div>
    </DocsLayout>
  );
};

export default AIAnnotationsArchitectStory;
