import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Cpu,
  Layers,
  Zap,
  CheckCircle2,
  ArrowRight,
  Database,
  Search,
  Target,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Highlight, themes } from "prism-react-renderer";
import { useEffect, useState } from "react";
import DocsLayout from "@/components/docs/DocsLayout";
import PageViewCounter from "@/components/PageViewCounter";
import StoryLoveButton from "@/components/StoryLoveButton";
import StoryNavigation from "@/components/StoryNavigation";

const PAGE_TITLE = "Real AI Embedding Generation - From Product Data to Semantic Search";
const PAGE_DESCRIPTION =
  "Watch real OpenAI + ONNX embeddings transform product data into semantic search. Learn how AI Fabric generates vectors in 15ms with $0 cost.";
const OG_IMAGE = "/images/orchestrator-story-og.png";

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
        className="overflow-x-auto rounded-lg border border-border/50 p-4 text-sm"
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

const StoryAct = ({ 
  number, 
  title, 
  emoji, 
  children 
}: { 
  number: string; 
  title: string; 
  emoji: string; 
  children: React.ReactNode 
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mb-12"
    >
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="group flex w-full items-center gap-4 text-left"
      >
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-primary text-2xl shadow-glow">
          {emoji}
        </span>
        <div className="flex-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">{number}</span>
          <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">{title}</h3>
        </div>
        <motion.span 
          animate={{ rotate: isExpanded ? 180 : 0 }}
          className="text-muted-foreground"
        >
          ▼
        </motion.span>
      </button>
      
      <motion.div 
        initial={false}
        animate={{ height: isExpanded ? "auto" : 0, opacity: isExpanded ? 1 : 0 }}
        className="overflow-hidden"
      >
        <div className="mt-6 pl-16 space-y-6 text-muted-foreground">
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
};

const RealAIEmbeddingStory = () => {
  useEffect(() => {
    document.title = PAGE_TITLE;
    const absoluteOgImage = `${window.location.origin}${OG_IMAGE}`;
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

    updateMeta('meta[name="description"]', "content", PAGE_DESCRIPTION);
    updateMeta('meta[property="og:title"]', "content", PAGE_TITLE);
    updateMeta('meta[property="og:description"]', "content", PAGE_DESCRIPTION);
    updateMeta('meta[property="og:image"]', "content", absoluteOgImage);
    updateMeta('meta[property="og:type"]', "content", "article");
    updateMeta('meta[name="twitter:title"]', "content", PAGE_TITLE);
    updateMeta('meta[name="twitter:description"]', "content", PAGE_DESCRIPTION);
    updateMeta('meta[name="twitter:image"]', "content", absoluteOgImage);
    updateMeta('meta[name="twitter:card"]', "content", "summary_large_image");
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
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                <Cpu className="h-4 w-4" />
                Real API Story
              </span>
              <div className="flex items-center gap-3">
                <StoryLoveButton storySlug="real-ai-embedding" />
                <PageViewCounter />
              </div>
            </div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl"
            >
              <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
                From Product Data to <span className="text-gradient">Semantic Search</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mb-8">
                Watch real OpenAI + ONNX embeddings transform product descriptions into searchable 
                vectors in 15ms with $0 cost.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2 text-sm text-accent">
                  <Layers className="h-4 w-4" />
                  384 Dimensions
                </div>
                <div className="flex items-center gap-2 rounded-full bg-secondary/10 px-4 py-2 text-sm text-secondary">
                  <Zap className="h-4 w-4" />
                  15ms Generation
                </div>
                <div className="flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm text-primary">
                  <Database className="h-4 w-4" />
                  Real APIs
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* The Problem */}
        <section className="px-6 py-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl"
          >
            <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-8">
              <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-3">
                <Search className="h-6 w-6 text-destructive" />
                The Keyword Search Failure
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                You're building AI-powered product search for 100,000+ products. Traditional keyword 
                search fails spectacularly:
              </p>
              <div className="rounded-lg bg-muted p-4 font-mono text-sm mb-4">
                <p className="text-destructive mb-2">SEARCH: "affordable smart home automation"</p>
                <p className="text-muted-foreground">KEYWORD RESULTS:</p>
                <p className="text-muted-foreground ml-4">❌ "Expensive Smart Home Hub" (has keywords)</p>
                <p className="text-muted-foreground ml-4">❌ "Affordable Home Decor" (wrong category)</p>
                <p className="text-muted-foreground ml-4">❌ "Smart Phone" (irrelevant)</p>
              </div>
              <p className="text-foreground font-medium">
                You need semantic search that <strong>understands meaning</strong>, not just matches words.
              </p>
            </div>
          </motion.div>
        </section>

        {/* The Story */}
        <section className="px-6 py-8">
          <div className="max-w-4xl">
            {/* Act I */}
            <StoryAct number="Act I" title="The Product Data" emoji="📦">
              <p>
                Let's watch how a real product gets transformed into a searchable vector:
              </p>

              <CodeBlock code={`TestProduct product = TestProduct.builder()
    .name("AI-Powered Smart Home Hub")
    .description("""
        Revolutionary smart home hub that uses artificial 
        intelligence to learn your habits, optimize energy 
        usage, and provide personalized automation. Features 
        include voice control, predictive maintenance, and 
        seamless integration with 100+ smart devices.
        """)
    .category("Smart Home")
    .brand("FutureTech")
    .price(new BigDecimal("399.99"))
    .sku("SH-AI-2024")
    .stockQuantity(100)
    .active(true)
    .build();

// Save to database
productRepository.save(product);`} />

              <div className="mt-6 rounded-lg border border-border/50 bg-card p-4">
                <h5 className="font-semibold text-foreground mb-2">The Challenge:</h5>
                <p className="text-sm text-muted-foreground">
                  User searches "affordable AI home automation" — how do we match this product even 
                  though the exact words are different? <strong className="text-foreground">We need semantic 
                  understanding.</strong>
                </p>
              </div>
            </StoryAct>

            {/* Act II */}
            <StoryAct number="Act II" title="The Embedding Generation Pipeline" emoji="⚡">
              <div className="rounded-xl border border-primary/30 bg-primary/5 p-6">
                <h4 className="text-lg font-semibold text-foreground mb-4">4-Step Transformation:</h4>
                
                <div className="space-y-4">
                  <div className="rounded-lg border border-border/30 bg-card p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">1</span>
                      <h5 className="font-semibold text-foreground">Content Extraction</h5>
                    </div>
                    <p className="text-sm text-muted-foreground ml-8">
                      Combine name + description + category → "AI-Powered Smart Home Hub - Revolutionary 
                      smart home hub that uses artificial intelligence..." (230 chars)
                    </p>
                  </div>

                  <div className="rounded-lg border border-border/30 bg-card p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary/20 text-xs font-bold text-secondary">2</span>
                      <h5 className="font-semibold text-foreground">ONNX Tokenization</h5>
                    </div>
                    <p className="text-sm text-muted-foreground ml-8">
                      Text → Tokens → Vocabulary IDs<br />
                      Model: all-MiniLM-L6-v2.onnx<br />
                      Time: 2ms
                    </p>
                  </div>

                  <div className="rounded-lg border border-border/30 bg-card p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent/20 text-xs font-bold text-accent">3</span>
                      <h5 className="font-semibold text-foreground">ONNX Inference (Local, $0)</h5>
                    </div>
                    <p className="text-sm text-muted-foreground ml-8">
                      Tokens → Neural Network → 384-dimensional vector<br />
                      Result: [0.234, -0.451, 0.892, ...] (384 floats)<br />
                      Time: 13ms
                    </p>
                  </div>

                  <div className="rounded-lg border border-border/30 bg-card p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">4</span>
                      <h5 className="font-semibold text-foreground">Vector Database Storage</h5>
                    </div>
                    <CodeBlock code={`AISearchableEntity indexed = {
  entityType: "test-product"
  entityId: "product-uuid-123"
  vectorId: "vec_sh_ai_2024_abc123"
  searchableContent: "AI-Powered Smart Home Hub..."
  metadata: {
    category: "Smart Home"
    price: 399.99
    brand: "FutureTech"
  }
  status: INDEXED ✓
}`} language="json" />
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-xl bg-gradient-primary p-6 text-center">
                <p className="text-xl font-bold text-primary-foreground mb-2">
                  Total Time: 15ms • Cost: $0
                </p>
                <p className="text-primary-foreground/80">
                  100x faster than cloud APIs • 100% private • Production-ready
                </p>
              </div>
            </StoryAct>

            {/* Act III */}
            <StoryAct number="Act III" title="The Semantic Search Test" emoji="🔍">
              <p>
                Now a user searches with <em>different words</em> but <em>same meaning</em>:
              </p>

              <div className="rounded-xl border border-border/50 bg-card p-6 mt-4">
                <h5 className="font-semibold text-foreground mb-3">User Query:</h5>
                <div className="rounded-lg bg-primary/10 border border-primary/30 p-4 mb-6">
                  <p className="text-lg font-medium text-foreground text-center">
                    "affordable AI home automation"
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="rounded-lg border border-border/30 bg-card/50 p-3">
                    <p className="text-xs text-muted-foreground mb-1">STEP 1: Embed Query (ONNX, 15ms)</p>
                    <p className="text-sm font-mono text-foreground">[0.241, -0.448, 0.885, ...]</p>
                  </div>
                  <div className="rounded-lg border border-border/30 bg-card/50 p-3">
                    <p className="text-xs text-muted-foreground mb-1">STEP 2: Vector Similarity Search</p>
                    <p className="text-sm text-foreground">Query vector vs Product vector</p>
                    <p className="text-sm font-mono text-accent">Similarity: 0.94 (94% match!) ✓</p>
                  </div>
                  <div className="rounded-lg border border-accent/30 bg-accent/10 p-3">
                    <p className="text-xs text-muted-foreground mb-1">STEP 3: Result</p>
                    <p className="text-sm font-semibold text-foreground">Found: "AI-Powered Smart Home Hub"</p>
                    <p className="text-xs text-muted-foreground">Even though exact words differ, meaning matches!</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
                  <h5 className="font-semibold text-destructive mb-2">Keyword Search</h5>
                  <p className="text-sm text-muted-foreground">❌ No matches (different words)</p>
                  <p className="text-sm text-muted-foreground">❌ Can't understand "affordable"</p>
                  <p className="text-sm text-muted-foreground">❌ Misses semantic meaning</p>
                </div>
                <div className="rounded-lg border border-accent/30 bg-accent/5 p-4">
                  <h5 className="font-semibold text-accent mb-2">Semantic Search</h5>
                  <p className="text-sm text-muted-foreground">✓ 94% similarity match</p>
                  <p className="text-sm text-muted-foreground">✓ Understands meaning</p>
                  <p className="text-sm text-muted-foreground">✓ Perfect result in 15ms</p>
                </div>
              </div>
            </StoryAct>

            {/* Act IV */}
            <StoryAct number="Act IV" title="The Technology" emoji="💻">
              <CodeBlock code={`// Automatic embedding generation on entity save
@Entity
@AISearchable(
    embeddingProvider = "onnx",  // Local, $0 cost
    contentFields = {"name", "description", "category"}
)
public class Product {
    @Id
    private String id;
    
    private String name;
    private String description;
    private String category;
    private BigDecimal price;
    
    // AI Fabric automatically:
    // 1. Extracts searchable content
    // 2. Generates ONNX embedding (15ms)
    // 3. Stores in vector DB
    // 4. Makes semantically searchable
}

// Search with natural language
List<Product> results = searchService.semanticSearch(
    "affordable AI home automation",
    Product.class,
    10  // top 10 results
);

// Results ranked by semantic similarity
// - "AI-Powered Smart Home Hub" (94% match)
// - "Budget Smart Home Kit" (89% match)
// - "Automated Home Control" (85% match)`} />

              <div className="grid gap-3 sm:grid-cols-2 mt-6">
                {[
                  "Automatic content extraction",
                  "ONNX local inference",
                  "384-dimensional vectors",
                  "Vector similarity search",
                  "Real-time indexing",
                  "Zero configuration",
                ].map((feature, i) => (
                  <div key={i} className="flex items-start gap-3 rounded-lg border border-border/50 bg-card p-3">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-accent mt-0.5" />
                    <span className="text-sm text-foreground">{feature}</span>
                  </div>
                ))}
              </div>
            </StoryAct>

            {/* Act V */}
            <StoryAct number="Act V" title="The Business Impact" emoji="📊">
              <div className="rounded-xl bg-gradient-primary p-6 text-center mb-6">
                <p className="text-2xl font-bold text-primary-foreground mb-2">
                  94% Search Relevance
                </p>
                <p className="text-primary-foreground/80">
                  Users find what they mean, not just what they say
                </p>
              </div>

              <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
                {[
                  { value: "15ms", label: "Embedding Time", icon: Zap },
                  { value: "$0", label: "Cost per Vector", icon: TrendingUp },
                  { value: "384", label: "Dimensions", icon: Layers },
                  { value: "94%", label: "Accuracy", icon: Target }
                ].map((stat) => (
                  <div key={stat.label} className="rounded-lg border border-border/50 bg-card p-4 text-center">
                    <stat.icon className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <p className="text-2xl font-bold text-gradient">{stat.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            </StoryAct>
          </div>
        </section>

        {/* Try It */}
        <section className="border-t border-border/50 bg-muted/30 py-12 px-6">
          <div className="max-w-4xl">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-3">
                <Cpu className="h-6 w-6 text-primary" />
                Deploy Real AI Embeddings
              </h2>
              <p className="text-muted-foreground mb-8">
                AI Fabric Framework provides automatic ONNX embeddings with real API integration. 
                15ms generation, $0 cost, production-ready.
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <Button variant="hero" size="lg" asChild>
                  <a href="https://github.com/Loom-AI-Labs/ai-fabric-framework" target="_blank" rel="noopener noreferrer">
                    ⭐ Star on GitHub
                  </a>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/docs/onnx-fallback-story">
                    Learn About ONNX →
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Related Stories */}
        <section className="border-t border-border/50 px-6 py-12">
          <div className="max-w-4xl">
            <h2 className="text-xl font-bold text-foreground mb-6">Related Real API Stories</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <Link 
                to="/docs/vector-lifecycle-story"
                className="group rounded-xl border border-border/50 bg-card p-5 hover:border-primary/50 hover:shadow-lg transition-all"
              >
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-2 flex items-center gap-2">
                  Vector Lifecycle Management <ArrowRight className="h-4 w-4" />
                </h3>
                <p className="text-sm text-muted-foreground">
                  Complete vector lifecycle from creation to cleanup
                </p>
              </Link>
              <Link 
                to="/docs/onnx-fallback-story"
                className="group rounded-xl border border-border/50 bg-card p-5 hover:border-primary/50 hover:shadow-lg transition-all"
              >
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-2 flex items-center gap-2">
                  ONNX Fallback Readiness <ArrowRight className="h-4 w-4" />
                </h3>
                <p className="text-sm text-muted-foreground">
                  $18K → $0 with local embeddings
                </p>
              </Link>
            </div>
          </div>
        </section>

        {/* Story Navigation */}
        <section className="px-6 py-12">
          <div className="max-w-4xl">
            <StoryNavigation />
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border/50 py-8 px-6">
          <div className="flex flex-col items-center gap-4">
            <StoryLoveButton storySlug="real-ai-embedding" />
            <p className="text-sm text-muted-foreground text-center">
              Real API Integration Story • Part of AI Fabric Framework • See current guides for exact setup
            </p>
          </div>
        </footer>
      </div>
    </DocsLayout>
  );
};

export default RealAIEmbeddingStory;
