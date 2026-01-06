import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Highlight, themes } from "prism-react-renderer";
import DocsLayout from "@/components/docs/DocsLayout";
import PageViewCounter from "@/components/PageViewCounter";
import StoryLoveButton from "@/components/StoryLoveButton";
import StoryNavigation from "@/components/StoryNavigation";
import { 
  Trash2,
  Skull,
  Sparkles,
  CheckCircle2,
  XCircle,
  Zap,
  FileCode,
  Code,
  ArrowRight,
  Target,
  Flame,
  Scissors,
  Coffee,
  PartyPopper,
  TrendingDown,
  Clock,
  AlertTriangle,
  GitBranch,
  BarChart3
} from "lucide-react";

const PAGE_TITLE = "Killing Boilerplate: A Murder Mystery (The Victim Deserved It)";
const PAGE_DESCRIPTION = "How 4 annotations eliminated 2,400 lines of repetitive AI infrastructure code across 12 services.";

const codeTheme = {
  ...themes.nightOwl,
  plain: {
    ...themes.nightOwl.plain,
    backgroundColor: "hsl(var(--code-bg))",
  },
};

const CodeBlock = ({ code, language = "java", deleted = false }: { code: string; language?: string; deleted?: boolean }) => (
  <Highlight theme={codeTheme} code={code.trim()} language={language}>
    {({ style, tokens, getLineProps, getTokenProps }) => (
      <pre
        className={`overflow-x-auto rounded-lg border p-4 text-sm my-4 relative ${
          deleted 
            ? "border-red-500/30 bg-red-500/5 line-through opacity-70" 
            : "border-border/50"
        }`}
        style={deleted ? { ...style, backgroundColor: 'rgba(239, 68, 68, 0.05)' } : style}
      >
        {deleted && (
          <div className="absolute top-2 right-2 px-2 py-1 rounded bg-red-500/20 text-red-400 text-xs font-bold">
            DELETED
          </div>
        )}
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

// Crime Scene Animation
const CrimeScene = () => {
  const [stage, setStage] = useState(0);
  
  const stages = [
    { label: "Before", icon: FileCode, color: "text-red-400" },
    { label: "The Murder", icon: Skull, color: "text-amber-400" },
    { label: "After", icon: Sparkles, color: "text-green-400" },
  ];

  return (
    <div className="my-12 p-8 rounded-2xl bg-gradient-to-br from-red-500/5 to-amber-500/5 border border-border/50">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
          <Skull className="h-5 w-5 text-amber-400" />
          Crime Scene Investigation
        </h3>
        <div className="flex gap-2">
          {stages.map((s, i) => (
            <button
              key={i}
              onClick={() => setStage(i)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                stage === i
                  ? `bg-card border-2 ${s.color.replace('text-', 'border-')} shadow-lg`
                  : "bg-muted/30 border border-border/50 text-muted-foreground"
              }`}
            >
              <s.icon className={`h-4 w-4 inline mr-1 ${stage === i ? s.color : ''}`} />
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        {stage === 0 && (
          <motion.div
            key="before"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
          >
            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 mb-4">
              <p className="text-red-400 font-semibold">📁 ProductService.java - 187 lines</p>
              <p className="text-xs text-muted-foreground mt-1">The victim before the incident...</p>
            </div>
            <CodeBlock code={`@Service
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
        // Business logic: 3 lines
        Product saved = productRepository.save(product);
        
        // Infrastructure noise: 50+ lines...
        try {
            // Build searchable text manually
            StringBuilder searchableText = new StringBuilder();
            searchableText.append(product.getName()).append(" ");
            searchableText.append(product.getDescription()).append(" ");
            searchableText.append(product.getCategory());
            
            // PII scanning
            String cleanText = piiScanner.redact(searchableText.toString());
            
            // Generate embedding with retries
            float[] embedding = retryTemplate.execute(ctx -> {
                metrics.increment("embedding.attempt");
                return embeddingService.embed(cleanText);
            });
            
            // Build metadata manually
            Map<String, Object> metadata = new HashMap<>();
            metadata.put("price", product.getPrice());
            metadata.put("rating", product.getRating());
            metadata.put("inStock", product.getInStock());
            metadata.put("brand", product.getBrand());
            
            // Store in vector DB with retries
            retryTemplate.execute(ctx -> {
                vectorDb.upsert(
                    "product-" + saved.getId(),
                    embedding,
                    metadata
                );
                return null;
            });
            
            metrics.increment("product.indexed.success");
        } catch (Exception e) {
            metrics.increment("product.indexed.failure");
            log.error("Failed to index product", e);
            // But product is already saved... now what?
        }
        
        return saved;
    }
    
    // ... 100 more lines for update() and delete()
}`} />
          </motion.div>
        )}
        
        {stage === 1 && (
          <motion.div
            key="murder"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="text-center py-12"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.5, repeat: 3 }}
            >
              <Scissors className="h-24 w-24 text-amber-400 mx-auto mb-6" />
            </motion.div>
            <h4 className="text-3xl font-bold text-foreground mb-4">
              🔪 THE MURDER WEAPON: <span className="text-amber-400">4 Annotations</span>
            </h4>
            <div className="flex justify-center gap-4 flex-wrap">
              {["@AICapable", "@AISearchable", "@AIContext", "@AIProcess"].map((ann, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.2 }}
                  className="px-4 py-2 rounded-lg bg-amber-500/20 border border-amber-500/30 text-amber-400 font-mono font-bold"
                >
                  {ann}
                </motion.span>
              ))}
            </div>
            <p className="text-muted-foreground mt-6 max-w-lg mx-auto">
              184 lines of code had their life taken away in cold blood.
              <br />
              <span className="text-amber-400 font-semibold">The victim deserved it.</span>
            </p>
          </motion.div>
        )}
        
        {stage === 2 && (
          <motion.div
            key="after"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30 mb-4">
              <p className="text-green-400 font-semibold">📁 ProductService.java - 15 lines</p>
              <p className="text-xs text-muted-foreground mt-1">The beautiful aftermath...</p>
            </div>
            <CodeBlock code={`@Service
@RequiredArgsConstructor
public class ProductService {
    
    private final ProductRepository productRepository;
    // That's it. No more infrastructure clients.
    
    @AIProcess(entityType = "product", processType = "create")
    @Transactional
    public Product createProduct(Product product) {
        return productRepository.save(product);
        // Framework handles EVERYTHING else
    }
}`} />
            <div className="mt-6 p-4 rounded-lg bg-green-500/10 border border-green-500/30">
              <div className="flex items-center justify-center gap-8 text-sm">
                <div className="text-center">
                  <p className="text-red-400 font-bold line-through">187 lines</p>
                  <p className="text-xs text-muted-foreground">Before</p>
                </div>
                <ArrowRight className="h-5 w-5 text-green-400" />
                <div className="text-center">
                  <p className="text-green-400 font-bold">15 lines</p>
                  <p className="text-xs text-muted-foreground">After</p>
                </div>
                <div className="text-center">
                  <p className="text-primary font-bold text-xl">-92%</p>
                  <p className="text-xs text-muted-foreground">Reduction</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Kill Count
const KillCount = () => {
  const kills = [
    { name: "EmbeddingTextBuilder", lines: 45, reason: "@AISearchable handles it" },
    { name: "MetadataMapper", lines: 32, reason: "@AIContext handles it" },
    { name: "RetryConfiguration", lines: 28, reason: "Framework has smart retries" },
    { name: "PIIScannerIntegration", lines: 24, reason: "Automatic before embedding" },
    { name: "MetricsInstrumentation", lines: 35, reason: "Observable by default" },
    { name: "VectorDbSyncManager", lines: 56, reason: "@AIProcess lifecycle" },
  ];

  return (
    <div className="my-16">
      <h3 className="text-2xl font-bold text-foreground mb-6 text-center flex items-center justify-center gap-2">
        <Skull className="h-6 w-6 text-red-400" />
        The Kill List
      </h3>
      
      <div className="space-y-4">
        {kills.map((kill, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            viewport={{ once: true }}
            className="p-4 rounded-xl bg-red-500/5 border border-red-500/30 flex items-center justify-between"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                <Trash2 className="h-5 w-5 text-red-400" />
              </div>
              <div>
                <p className="font-mono font-bold text-foreground line-through opacity-70">
                  {kill.name}.java
                </p>
                <p className="text-xs text-green-400">{kill.reason}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold text-red-400">-{kill.lines}</p>
              <p className="text-xs text-muted-foreground">lines</p>
            </div>
          </motion.div>
        ))}
      </div>
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="mt-8 p-6 rounded-xl bg-gradient-to-r from-red-500/10 to-amber-500/10 border border-red-500/30 text-center"
      >
        <p className="text-3xl font-bold text-red-400">-220 lines</p>
        <p className="text-muted-foreground">eliminated per service</p>
        <p className="text-2xl font-bold text-amber-400 mt-2">-2,640 total</p>
        <p className="text-muted-foreground">across 12 services</p>
      </motion.div>
    </div>
  );
};

// Git Diff Visualization
const GitDiff = () => {
  return (
    <div className="my-16 p-8 rounded-2xl bg-card border border-border/50">
      <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
        <GitBranch className="h-5 w-5 text-primary" />
        The PR That Made Everyone Cry (Tears of Joy)
      </h3>
      
      <div className="p-4 rounded-lg bg-muted/30 border border-border/30 font-mono text-sm mb-6">
        <p className="text-muted-foreground">$ git diff --stat HEAD~1</p>
        <div className="mt-4 space-y-1">
          <p><span className="text-red-400">- ProductService.java</span> | <span className="text-red-400">172 deletions</span></p>
          <p><span className="text-red-400">- ArticleService.java</span> | <span className="text-red-400">168 deletions</span></p>
          <p><span className="text-red-400">- TicketService.java</span> | <span className="text-red-400">155 deletions</span></p>
          <p><span className="text-red-400">- EmbeddingTextBuilder.java</span> | <span className="text-red-400">45 deletions</span></p>
          <p><span className="text-red-400">- MetadataMapper.java</span> | <span className="text-red-400">32 deletions</span></p>
          <p><span className="text-red-400">- RetryConfig.java</span> | <span className="text-red-400">28 deletions</span></p>
          <p><span className="text-green-400">+ Product.java</span> | <span className="text-green-400">8 additions</span> (annotations)</p>
          <p><span className="text-green-400">+ Article.java</span> | <span className="text-green-400">10 additions</span> (annotations)</p>
        </div>
        <div className="mt-4 pt-4 border-t border-border/30">
          <p className="text-lg">
            <span className="text-green-400">+48</span> / <span className="text-red-400">-2,400</span> lines changed
          </p>
        </div>
      </div>
      
      <div className="grid md:grid-cols-3 gap-4">
        <div className="p-4 rounded-lg bg-red-500/5 border border-red-500/20 text-center">
          <p className="text-2xl font-bold text-red-400">2,400</p>
          <p className="text-xs text-muted-foreground">Lines Deleted</p>
        </div>
        <div className="p-4 rounded-lg bg-green-500/5 border border-green-500/20 text-center">
          <p className="text-2xl font-bold text-green-400">48</p>
          <p className="text-xs text-muted-foreground">Lines Added</p>
        </div>
        <div className="p-4 rounded-lg bg-primary/5 border border-primary/20 text-center">
          <p className="text-2xl font-bold text-primary">-98%</p>
          <p className="text-xs text-muted-foreground">Net Change</p>
        </div>
      </div>
    </div>
  );
};

// Benefits with Humor
const BenefitsSection = () => {
  const benefits = [
    { icon: Coffee, title: "More Coffee Breaks", desc: "Less code to write = more time for important things" },
    { icon: AlertTriangle, title: "Fewer 3AM Pages", desc: "No more 'embedding service timeout' alerts" },
    { icon: Clock, title: "Faster Reviews", desc: "PRs with 15 lines get approved faster than 200" },
    { icon: PartyPopper, title: "Happier Team", desc: "Nobody misses debugging retry logic" },
  ];

  return (
    <div className="my-16 grid md:grid-cols-2 gap-6">
      {benefits.map((b, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          viewport={{ once: true }}
          className="p-6 rounded-xl bg-card border border-border/50 hover:border-primary/30 transition-all"
        >
          <b.icon className="h-8 w-8 text-primary mb-4" />
          <h4 className="font-bold text-foreground mb-2">{b.title}</h4>
          <p className="text-sm text-muted-foreground">{b.desc}</p>
        </motion.div>
      ))}
    </div>
  );
};

// Before/After Side by Side
const BeforeAfterSideBySide = () => {
  return (
    <div className="my-16 grid md:grid-cols-2 gap-6">
      <div className="p-6 rounded-xl bg-red-500/5 border border-red-500/30">
        <h4 className="font-bold text-red-400 mb-4 flex items-center gap-2">
          <XCircle className="h-5 w-5" />
          Before: The Horror
        </h4>
        <CodeBlock deleted code={`// Every. Single. Service.
private final EmbeddingService embedding;
private final VectorDbClient vectorDb;
private final PIIScanner piiScanner;
private final MetricsService metrics;
private final RetryTemplate retryTemplate;

// 50+ lines of infrastructure noise
StringBuilder text = new StringBuilder();
text.append(entity.getName())...
String clean = piiScanner.redact(text);
float[] vec = retryTemplate.execute(...);
Map<String, Object> meta = new HashMap<>();
meta.put("field1", entity.getField1());
vectorDb.upsert(id, vec, meta);
metrics.increment("entity.indexed");`} />
        <p className="text-xs text-red-400 mt-4">
          Repeated in 12 services. 2,400 lines total. 
        </p>
      </div>
      
      <div className="p-6 rounded-xl bg-green-500/5 border border-green-500/30">
        <h4 className="font-bold text-green-400 mb-4 flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5" />
          After: The Dream
        </h4>
        <CodeBlock code={`// Entity tells framework WHAT
@Entity
@AICapable(entityType = "product")
public class Product {
    @AISearchable private String name;
    @AISearchable private String description;
    @AIContext private BigDecimal price;
}

// Service tells framework WHEN
@AIProcess(entityType = "product", processType = "create")
public Product create(Product p) {
    return repo.save(p);
}`} />
        <p className="text-xs text-green-400 mt-4">
          Framework handles embedding, PII, retry, metrics, sync. 
        </p>
      </div>
    </div>
  );
};

const AIAnnotationsKillingBoilerplateStory = () => {
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
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-amber-500/5" />
            <div className="relative">
              <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
                <span className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400">
                  <Skull className="h-4 w-4" />
                  A Murder Mystery
                </span>
                <div className="flex items-center gap-3">
                  <StoryLoveButton storySlug="ai-annotations-killing-boilerplate" />
                  <PageViewCounter />
                </div>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
                Killing Boilerplate{" "}
                <span className="text-gradient">(The Victim Deserved It)</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mb-8">
                How 4 annotations eliminated 2,400 lines of repetitive AI infrastructure code across 12 services. 
                <span className="text-amber-400"> No regrets.</span>
              </p>
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/30">
                  <TrendingDown className="h-4 w-4 text-red-400" />
                  -2,400 lines
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/30">
                  <Sparkles className="h-4 w-4 text-green-400" />
                  4 annotations
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30">
                  <Target className="h-4 w-4 text-amber-400" />
                  12 services
                </div>
              </div>
            </div>
          </section>

          {/* Crime Scene */}
          <CrimeScene />

          {/* Kill Count */}
          <KillCount />

          {/* Before/After Side by Side */}
          <BeforeAfterSideBySide />

          {/* Git Diff */}
          <GitDiff />

          {/* Benefits */}
          <BenefitsSection />

          {/* The Revelation */}
          <section className="mb-16 p-8 rounded-2xl bg-gradient-to-br from-red-500/10 to-amber-500/5 border border-amber-500/20 text-center">
            <Flame className="h-16 w-16 text-amber-400 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-foreground mb-4">The Confession</h3>
            <div className="max-w-2xl mx-auto space-y-4 text-muted-foreground">
              <p className="text-lg">
                "I killed 2,400 lines of code yesterday."
              </p>
              <p className="text-lg">
                "They were innocent? <span className="text-amber-400 font-semibold">No. They were boilerplate.</span>"
              </p>
              <p className="text-lg">
                "They had to die so our codebase could live."
              </p>
              <p className="text-lg">
                "I'd do it again."
              </p>
              <p className="text-sm text-foreground italic font-semibold pt-4 border-t border-border/30">
                — Every developer after discovering AI Annotations
              </p>
            </div>
          </section>

          {/* Story Navigation */}
          <StoryNavigation className="mt-12" />

          {/* Footer */}
          <footer className="border-t border-border/50 pt-12 mt-12 flex flex-col items-center gap-6">
            <div className="flex items-center gap-4">
              <StoryLoveButton storySlug="ai-annotations-killing-boilerplate" />
              <PageViewCounter />
            </div>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link 
                to="/docs/ai-annotations-semantic-search" 
                className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
              >
                <Zap className="h-4 w-4" />
                Semantic Search →
              </Link>
              <Link 
                to="/docs/ai-annotations-developer-guide" 
                className="inline-flex items-center gap-2 px-6 py-2 rounded-full border border-border bg-card text-foreground font-medium hover:bg-muted transition-colors"
              >
                Developer Guide
              </Link>
            </div>
            <p className="text-xs text-muted-foreground text-center max-w-md">
              Part of the AI Annotations Story Series — Killing Boilerplate
            </p>
          </footer>
        </motion.article>
      </div>
    </DocsLayout>
  );
};

export default AIAnnotationsKillingBoilerplateStory;
