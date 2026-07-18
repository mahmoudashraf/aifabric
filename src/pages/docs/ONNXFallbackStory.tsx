import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  DollarSign,
  Lock,
  Zap,
  CheckCircle2,
  XCircle,
  Cloud,
  HardDrive,
  TrendingDown,
  Target,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Highlight, themes } from "prism-react-renderer";
import { useEffect, useState } from "react";
import DocsLayout from "@/components/docs/DocsLayout";
import PageViewCounter from "@/components/PageViewCounter";
import StoryLoveButton from "@/components/StoryLoveButton";
import StoryNavigation from "@/components/StoryNavigation";

const PAGE_TITLE = "ONNX Fallback Readiness - Local Embeddings And Provider Resilience";
const PAGE_DESCRIPTION =
  "Escape cloud embedding costs and privacy concerns. Learn how ONNX Runtime delivers local, private embeddings with zero API costs and 10x faster performance.";
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

const ONNXFallbackStory = () => {
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
                <HardDrive className="h-4 w-4" />
                Real API Story
              </span>
              <div className="flex items-center gap-3">
                <StoryLoveButton storySlug="onnx-fallback" />
                <PageViewCounter />
              </div>
            </div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl"
            >
              <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
                <span className="text-gradient">Local Embeddings</span> And Provider Resilience
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mb-8">
                The story of escaping $18K/year embedding costs and privacy concerns with local ONNX 
                Runtime—6-33x faster, completely private, zero cloud dependency.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2 text-sm text-accent">
                  <DollarSign className="h-4 w-4" />
                  $0 Cost
                </div>
                <div className="flex items-center gap-2 rounded-full bg-secondary/10 px-4 py-2 text-sm text-secondary">
                  <Zap className="h-4 w-4" />
                  15ms Latency
                </div>
                <div className="flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm text-primary">
                  <Lock className="h-4 w-4" />
                  Local Data Path
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
            <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-8 mb-12">
              <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-3">
                <Cloud className="h-6 w-6 text-destructive" />
                The $18,000 Annual Embedding Bill
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                You've built an AI-powered enterprise platform using OpenAI embeddings. Everything works 
                great—until the bills arrive:
              </p>
              <div className="grid gap-4 sm:grid-cols-2 mt-6">
                <div className="rounded-lg border border-destructive/30 bg-card p-4">
                  <p className="font-semibold text-destructive text-sm mb-1">Annual Cost</p>
                  <p className="text-3xl font-bold text-foreground">$18,000</p>
                  <p className="text-xs text-muted-foreground mt-1">For 10M documents</p>
                </div>
                <div className="rounded-lg border border-destructive/30 bg-card p-4">
                  <p className="font-semibold text-destructive text-sm mb-1">Latency</p>
                  <p className="text-3xl font-bold text-foreground">100-500ms</p>
                  <p className="text-xs text-muted-foreground mt-1">Per API call</p>
                </div>
              </div>
              <div className="mt-6 space-y-2 text-sm text-muted-foreground">
                <p>❌ Privacy concerns: Sending proprietary data to OpenAI</p>
                <p>❌ Vendor lock-in: Can't switch without rewriting</p>
	                <p>❌ Compliance review: regulated apps may require local processing and audit controls</p>
                <p>❌ Latency spikes: Cloud API calls add overhead</p>
              </div>
            </div>
          </motion.div>
        </section>

        {/* The Story */}
        <section className="px-6 py-8">
          <div className="max-w-4xl">
            {/* Act I */}
            <StoryAct number="Act I" title="The Hybrid Strategy" emoji="🔄">
              <p>
                Smart enterprises don't choose between cloud and local—they use both strategically:
              </p>

              <div className="grid gap-6 md:grid-cols-2 mt-6">
                <div className="rounded-xl border border-secondary/30 bg-secondary/5 p-6">
                  <h5 className="font-semibold text-secondary mb-3 flex items-center gap-2">
                    <Cloud className="h-5 w-5" />
                    PRIMARY: OpenAI (LLM)
                  </h5>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>✓ Intent extraction</li>
                    <li>✓ Response generation</li>
                    <li>✓ Smart suggestions</li>
                    <li className="text-foreground font-medium mt-3">Cost: $20-50/month</li>
                    <li className="text-xs text-muted-foreground">(Worth it for quality)</li>
                  </ul>
                </div>

                <div className="rounded-xl border border-accent/30 bg-accent/5 p-6">
                  <h5 className="font-semibold text-accent mb-3 flex items-center gap-2">
                    <HardDrive className="h-5 w-5" />
                    FALLBACK: ONNX (Embeddings)
                  </h5>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>✓ Semantic search</li>
                    <li>✓ Vector generation</li>
                    <li>✓ Similarity matching</li>
                    <li className="text-accent font-medium mt-3">Cost: $0/month</li>
                    <li className="text-xs text-muted-foreground">(Local inference)</li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 rounded-xl bg-gradient-primary p-6 text-center">
                <p className="text-xl font-bold text-primary-foreground mb-2">
                  HYBRID = Best of Both Worlds
                </p>
                <p className="text-primary-foreground/80">
                  Quality LLM for generation • Free embeddings for search • Zero vendor lock-in
                </p>
              </div>
            </StoryAct>

            {/* Act II */}
            <StoryAct number="Act II" title="ONNX Model Configuration" emoji="⚙️">
              <p>
                The AI Fabric Framework includes ONNX Runtime with the proven all-MiniLM-L6-v2 model:
              </p>

              <div className="rounded-xl border border-border/50 bg-card p-6 mt-4">
                <h5 className="font-semibold text-foreground mb-4">Model Specifications:</h5>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-lg border border-border/30 bg-card/50 p-3">
                    <p className="text-xs text-muted-foreground mb-1">Model</p>
                    <p className="text-sm font-medium text-foreground">all-MiniLM-L6-v2.onnx</p>
                  </div>
                  <div className="rounded-lg border border-border/30 bg-card/50 p-3">
                    <p className="text-xs text-muted-foreground mb-1">Size</p>
                    <p className="text-sm font-medium text-foreground">86 MB (bundled)</p>
                  </div>
                  <div className="rounded-lg border border-border/30 bg-card/50 p-3">
                    <p className="text-xs text-muted-foreground mb-1">Dimensions</p>
                    <p className="text-sm font-medium text-foreground">384</p>
                  </div>
                  <div className="rounded-lg border border-border/30 bg-card/50 p-3">
                    <p className="text-xs text-muted-foreground mb-1">Sequence Length</p>
                    <p className="text-sm font-medium text-foreground">512 tokens</p>
                  </div>
                </div>

                <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                  <p>✓ Production-proven (1B+ downloads)</p>
                  <p>✓ Fast inference (15ms on CPU)</p>
                  <p>✓ Good quality (comparable to cloud)</p>
                  <p>✓ Cross-platform (Linux, Windows, Mac)</p>
                  <p>✓ Offline-capable (no internet needed)</p>
                </div>
              </div>
            </StoryAct>

            {/* Act III */}
            <StoryAct number="Act III" title="The Performance Comparison" emoji="⚡">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-xl border border-secondary/30 bg-secondary/5 p-6">
                  <h5 className="font-semibold text-secondary mb-4">OpenAI text-embedding-3-small</h5>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-start gap-2">
                      <DollarSign className="h-4 w-4 text-secondary shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-foreground">Cost</strong>
                        <p className="text-muted-foreground">$0.02 per 1M tokens</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <Zap className="h-4 w-4 text-secondary shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-foreground">Latency</strong>
                        <p className="text-muted-foreground">100-500ms</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <Cloud className="h-4 w-4 text-secondary shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-foreground">Requirements</strong>
                        <p className="text-muted-foreground">API key, internet</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <Shield className="h-4 w-4 text-secondary shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-foreground">Privacy</strong>
                        <p className="text-muted-foreground">Data sent to OpenAI</p>
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="rounded-xl border border-accent/30 bg-accent/5 p-6">
                  <h5 className="font-semibold text-accent mb-4">ONNX all-MiniLM-L6-v2</h5>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-start gap-2">
                      <DollarSign className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-foreground">Cost</strong>
                        <p className="text-muted-foreground">$0 (local inference)</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <Zap className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-foreground">Latency</strong>
                        <p className="text-muted-foreground">15ms (6-33x faster)</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <HardDrive className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-foreground">Requirements</strong>
                        <p className="text-muted-foreground">Nothing (bundled)</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <Lock className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-foreground">Privacy</strong>
                        <p className="text-muted-foreground">100% on your servers</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </StoryAct>

            {/* Act IV */}
            <StoryAct number="Act IV" title="The Implementation" emoji="💻">
              <CodeBlock code={`// ONNX fallback is automatic - just configure
@Configuration
public class EmbeddingConfig {
    
    @Bean
    @Primary
    public EmbeddingProvider onnxEmbeddingProvider() {
        return ONNXEmbeddingProvider.builder()
            .modelPath("classpath:/models/embeddings/all-MiniLM-L6-v2.onnx")
            .tokenizerPath("classpath:/models/embeddings/tokenizer.json")
            .dimensions(384)
            .maxSequenceLength(512)
            .build();
    }
}

// Use it exactly like OpenAI
@Service
public class ProductIndexingService {
    
    @Autowired
    private EmbeddingProvider embeddingProvider;  // ← ONNX injected
    
    public void indexProduct(Product product) {
        // Generate embedding (local, <15ms, $0)
        float[] embedding = embeddingProvider.embed(
            product.getName() + " " + product.getDescription()
        );
        
        // Store in vector database
        vectorStore.save(product.getId(), embedding);
    }
}

// Results
// - 3 products indexed in 42ms total (14ms avg)
// - Cost: $0
// - Privacy: 100% on-premises
// - Quality: Comparable to cloud embeddings`} />

              <div className="grid gap-3 sm:grid-cols-2 mt-6">
                {[
                  "Zero configuration",
                  "Drop-in replacement",
                  "Automatic fallback",
                  "Cross-platform support",
                  "Offline capable",
                  "Production ready",
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
                <p className="text-3xl font-bold text-primary-foreground mb-2">
                  $18,000 → $0
                </p>
                <p className="text-primary-foreground/80">
                  Annual embedding costs eliminated • 100% privacy maintained • 6-33x faster
                </p>
              </div>

              <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
                {[
                  { value: "$0", label: "Annual Cost", icon: DollarSign },
                  { value: "15ms", label: "Avg Latency", icon: Zap },
                  { value: "100%", label: "Private", icon: Lock },
                  { value: "Local", label: "Fallback Mode", icon: Target }
                ].map((stat) => (
                  <div key={stat.label} className="rounded-lg border border-border/50 bg-card p-4 text-center">
                    <stat.icon className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <p className="text-2xl font-bold text-gradient">{stat.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
                  <h5 className="font-semibold text-destructive mb-2">Before (OpenAI Only)</h5>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• $18K/year embedding costs</li>
                    <li>• 100-500ms latency</li>
                    <li>• Privacy concerns</li>
                    <li>• Vendor lock-in</li>
                  </ul>
                </div>
                <div className="rounded-lg border border-accent/30 bg-accent/5 p-4">
                  <h5 className="font-semibold text-accent mb-2">After (ONNX Hybrid)</h5>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• $0/year embedding costs</li>
                    <li>• 15ms latency</li>
                    <li>• 100% on-premises</li>
                    <li>• No vendor lock-in</li>
                  </ul>
                </div>
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
                <TrendingDown className="h-6 w-6 text-primary" />
                Slash Your Embedding Costs to $0
              </h2>
              <p className="text-muted-foreground mb-8">
                AI Fabric Framework includes ONNX Runtime with production-proven models. 
                Zero configuration, drop-in replacement, 100% private.
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <Button variant="hero" size="lg" asChild>
                  <a href="https://github.com/Loom-AI-Labs/ai-fabric-framework" target="_blank" rel="noopener noreferrer">
                    ⭐ Star on GitHub
                  </a>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/docs/onnx_provider_story_v2">
                    Learn More →
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
                to="/docs/ecommerce-product-discovery-story"
                className="group rounded-xl border border-border/50 bg-card p-5 hover:border-primary/50 hover:shadow-lg transition-all"
              >
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
                  E-Commerce Product Discovery →
                </h3>
                <p className="text-sm text-muted-foreground">
                  Natural language product search
                </p>
              </Link>
              <Link 
                to="/docs/pii-detection-edge-story"
                className="group rounded-xl border border-border/50 bg-card p-5 hover:border-primary/50 hover:shadow-lg transition-all"
              >
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
                  PII Detection Edge Spectrum →
                </h3>
                <p className="text-sm text-muted-foreground">
                  Bulletproof privacy protection
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
            <StoryLoveButton storySlug="onnx-fallback" />
            <p className="text-sm text-muted-foreground text-center">
              Real API Integration Story • Part of AI Fabric Framework • See current guides for exact setup
            </p>
          </div>
        </footer>
      </div>
    </DocsLayout>
  );
};

export default ONNXFallbackStory;
