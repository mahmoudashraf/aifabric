import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  RefreshCw,
  Trash2,
  CheckCircle2,
  Database,
  Layers,
  Zap,
  ArrowRight,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Highlight, themes } from "prism-react-renderer";
import { useEffect, useState } from "react";
import DocsLayout from "@/components/docs/DocsLayout";
import PageViewCounter from "@/components/PageViewCounter";
import StoryLoveButton from "@/components/StoryLoveButton";
import StoryNavigation from "@/components/StoryNavigation";

const PAGE_TITLE = "Vector Lifecycle Management - From Creation to Cleanup";
const PAGE_DESCRIPTION =
  "Complete vector lifecycle automation with 8-phase testing. Learn how AI Fabric manages vectors from creation through removal, reseeding, and audit trail.";
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

const PhaseCard = ({ phase, title, status }: { phase: number; title: string; status: "complete" | "active" | "pending" }) => (
  <div className={`rounded-lg border p-4 ${
    status === "complete" ? "border-accent/30 bg-accent/10" :
    status === "active" ? "border-primary/30 bg-primary/10" :
    "border-border/30 bg-card"
  }`}>
    <div className="flex items-center gap-3">
      <span className={`flex h-8 w-8 items-center justify-center rounded-full font-bold text-sm ${
        status === "complete" ? "bg-accent/20 text-accent" :
        status === "active" ? "bg-primary/20 text-primary" :
        "bg-muted text-muted-foreground"
      }`}>
        {phase}
      </span>
      <div className="flex-1">
        <h5 className="font-semibold text-foreground text-sm">{title}</h5>
      </div>
      {status === "complete" && <CheckCircle2 className="h-5 w-5 text-accent" />}
    </div>
  </div>
);

const VectorLifecycleStory = () => {
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
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-border/50">
          <div className="absolute inset-0 bg-gradient-glow opacity-50" />
          <div className="px-6 py-16 relative">
            <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                <RefreshCw className="h-4 w-4" />
                Real API Story
              </span>
              <div className="flex items-center gap-3">
                <StoryLoveButton storySlug="vector-lifecycle" />
                <PageViewCounter />
              </div>
            </div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl"
            >
              <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
                From Creation to <span className="text-gradient">Complete Cleanup</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mb-8">
                8-phase vector lifecycle automation: create, index, search, update, remove, clear, 
                reseed, and audit—all with zero downtime.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2 text-sm text-accent">
                  <Layers className="h-4 w-4" />
                  8 Phases
                </div>
                <div className="flex items-center gap-2 rounded-full bg-secondary/10 px-4 py-2 text-sm text-secondary">
                  <Database className="h-4 w-4" />
                  Full Lifecycle
                </div>
                <div className="flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm text-primary">
                  <FileText className="h-4 w-4" />
                  Audit Trail
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* The Story */}
        <section className="px-6 py-8">
          <div className="max-w-4xl">
            {/* Act I */}
            <StoryAct number="Act I" title="The 8-Phase Lifecycle" emoji="🔄">
              <p>
                AI Fabric Framework provides complete vector lifecycle management tested through 8 comprehensive phases:
              </p>

              <div className="grid gap-3 sm:grid-cols-2 mt-6">
                <PhaseCard phase={1} title="CREATE - Generate embeddings" status="complete" />
                <PhaseCard phase={2} title="INDEX - Store in vector DB" status="complete" />
                <PhaseCard phase={3} title="SEARCH - Query and retrieve" status="complete" />
                <PhaseCard phase={4} title="UPDATE - Modify and re-embed" status="complete" />
                <PhaseCard phase={5} title="REMOVE - Delete specific vector" status="complete" />
                <PhaseCard phase={6} title="CLEAR - Wipe entire index" status="complete" />
                <PhaseCard phase={7} title="RESEED - Rebuild from scratch" status="complete" />
                <PhaseCard phase={8} title="AUDIT - Track all operations" status="complete" />
              </div>

              <div className="mt-6 rounded-lg border border-accent/30 bg-accent/5 p-4">
                <p className="text-foreground">
                  <strong>The Promise:</strong> Automated lifecycle management with zero downtime, complete 
                  audit trails, and GDPR/HIPAA compliant deletion.
                </p>
              </div>
            </StoryAct>

            {/* Act II */}
            <StoryAct number="Act II" title="Phase 5: Remove Vector Action" emoji="🗑️">
              <p>
                When a product is discontinued or data must be deleted for compliance:
              </p>

              <div className="rounded-xl border border-border/50 bg-card p-6 mt-4">
                <h5 className="font-semibold text-foreground mb-3">User Action:</h5>
                <div className="rounded-lg bg-primary/10 border border-primary/30 p-4 mb-4">
                  <p className="text-sm font-medium text-foreground">
                    "Execute remove_vector action with entityType='test-product' and entityId='product-1-id'"
                  </p>
                </div>

                <div className="space-y-3">
                  <div className="rounded-lg border border-border/30 bg-card/50 p-3">
                    <p className="text-xs text-muted-foreground mb-1">STEP 1: Intent Extraction</p>
                    <p className="text-sm text-foreground">Action: remove_vector detected</p>
                  </div>
                  <div className="rounded-lg border border-border/30 bg-card/50 p-3">
                    <p className="text-xs text-muted-foreground mb-1">STEP 2: Find Vector</p>
                    <p className="text-sm text-foreground">Found: vectorId="vec_001" for product-1</p>
                  </div>
                  <div className="rounded-lg border border-border/30 bg-card/50 p-3">
                    <p className="text-xs text-muted-foreground mb-1">STEP 3: Delete from Vector DB</p>
                    <p className="text-sm text-accent">✓ Vector removed successfully</p>
                  </div>
                  <div className="rounded-lg border border-border/30 bg-card/50 p-3">
                    <p className="text-xs text-muted-foreground mb-1">STEP 4: Clean up Metadata</p>
                    <p className="text-sm text-accent">✓ AISearchableEntity deleted</p>
                  </div>
                  <div className="rounded-lg border border-border/30 bg-card/50 p-3">
                    <p className="text-xs text-muted-foreground mb-1">STEP 5: Audit Log</p>
                    <p className="text-sm text-accent">✓ Deletion recorded in intent history</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-lg border border-accent/30 bg-accent/5 p-4">
                <p className="text-sm text-foreground">
                  <strong>Result:</strong> Vector completely removed • Product no longer searchable • 
                  Full audit trail maintained • GDPR/HIPAA compliant
                </p>
              </div>
            </StoryAct>

            {/* Act III */}
            <StoryAct number="Act III" title="Phase 6: Clear Vector Index" emoji="💥">
              <p>
                When you need to wipe and rebuild the entire vector database:
              </p>

              <CodeBlock code={`// User action: "clear_vector_index for test-product"
IntentExtractionResult intent = orchestrator.extractIntent(
    "Execute clear_vector_index action for test-product",
    userId
);

// Framework executes:
// 1. Find all vectors for entity type
List<AISearchableEntity> entities = 
    searchableEntityRepository.findByEntityType("test-product");
// Found: 2 vectors (product-1, product-2)

// 2. Delete all vectors from vector DB
for (AISearchableEntity entity : entities) {
    vectorService.removeVector(entity.getVectorId());
    searchableEntityRepository.delete(entity);
}

// 3. Audit the operation
intentHistoryService.recordAction(
    "clear_vector_index",
    "test-product",
    "2 vectors removed"
);

// Result:
// ✓ All test-product vectors deleted
// ✓ Vector DB cleaned
// ✓ Ready for reseed
// ✓ Operation logged`} />

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg border border-border/50 bg-card p-4">
                  <h5 className="font-semibold text-foreground mb-2">Before Clear:</h5>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• 2 products indexed</li>
                    <li>• 2 vectors in DB</li>
                    <li>• Search returns results</li>
                  </ul>
                </div>
                <div className="rounded-lg border border-accent/30 bg-accent/5 p-4">
                  <h5 className="font-semibold text-accent mb-2">After Clear:</h5>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• 0 products indexed</li>
                    <li>• 0 vectors in DB</li>
                    <li>• Search returns empty</li>
                    <li className="text-accent">• Ready for reseed!</li>
                  </ul>
                </div>
              </div>
            </StoryAct>

            {/* Act IV */}
            <StoryAct number="Act IV" title="Phase 7: Automatic Reseeding" emoji="🌱">
              <p>
                After clearing, the framework automatically reindexes existing entities:
              </p>

              <div className="rounded-xl border border-primary/30 bg-primary/5 p-6 mt-4">
                <h4 className="text-lg font-semibold text-foreground mb-4">Reseed Operation:</h4>
                
                <CodeBlock code={`// Trigger reseed (can be automatic or manual)
reseedService.reseedEntityType("test-product");

// Framework executes:
// 1. Find all entities in database
List<Product> products = productRepository.findAll();
// Found: 2 products (still in DB, vectors were deleted)

// 2. Generate fresh embeddings
for (Product product : products) {
    // Extract content
    String content = extractSearchableContent(product);
    
    // Generate embedding (ONNX, 15ms)
    float[] embedding = onnxProvider.embed(content);
    
    // Store new vector
    String vectorId = vectorService.storeVector(embedding);
    
    // Create searchable entity
    AISearchableEntity entity = new AISearchableEntity();
    entity.setEntityType("test-product");
    entity.setEntityId(product.getId());
    entity.setVectorId(vectorId);
    entity.setSearchableContent(content);
    searchableEntityRepository.save(entity);
}

// Result:
// ✓ 2 products re-indexed
// ✓ 2 fresh vectors created
// ✓ Search works again
// ✓ Zero downtime (phased operation)`} />
              </div>

              <div className="mt-6 rounded-xl bg-gradient-primary p-6 text-center">
                <p className="text-xl font-bold text-primary-foreground mb-2">
                  Reseed Complete: 2 Vectors Regenerated
                </p>
                <p className="text-primary-foreground/80">
                  30ms total time • Zero downtime • Full audit trail
                </p>
              </div>
            </StoryAct>

            {/* Act V */}
            <StoryAct number="Act V" title="Phase 8: Complete Audit Trail" emoji="📋">
              <p>
                Every lifecycle operation is tracked in intent history:
              </p>

              <div className="space-y-3 mt-6">
                {[
                  { action: "create_product", result: "Product 1 created, vector generated", time: "10:00:00" },
                  { action: "create_product", result: "Product 2 created, vector generated", time: "10:00:02" },
                  { action: "semantic_search", result: "Query: analytics, Found: 1 result", time: "10:01:15" },
                  { action: "remove_vector", result: "Product 1 vector deleted", time: "10:05:30" },
                  { action: "clear_vector_index", result: "2 vectors removed", time: "10:10:00" },
                  { action: "reseed_complete", result: "2 vectors regenerated", time: "10:10:30" },
                ].map((log, i) => (
                  <div key={i} className="rounded-lg border border-border/50 bg-card p-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-mono text-xs text-muted-foreground">{log.time}</span>
                      <span className="font-semibold text-primary">{log.action}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{log.result}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {[
                  "Complete operation history",
                  "GDPR/HIPAA compliance",
                  "Deletion audit trail",
                  "Reseed tracking",
                ].map((feature, i) => (
                  <div key={i} className="flex items-start gap-3 rounded-lg border border-border/50 bg-card p-3">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-accent mt-0.5" />
                    <span className="text-sm text-foreground">{feature}</span>
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
                <Zap className="h-6 w-6 text-primary" />
                Deploy Complete Vector Lifecycle
              </h2>
              <p className="text-muted-foreground mb-8">
                AI Fabric Framework provides 8-phase lifecycle automation with full audit trails. 
                Zero downtime, GDPR/HIPAA compliant, production-ready.
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <Button variant="hero" size="lg" asChild>
                  <a href="https://github.com/mahmoudashraf/AI-Fabric-Framework" target="_blank" rel="noopener noreferrer">
                    ⭐ Star on GitHub
                  </a>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/docs/real-ai-embedding-story">
                    Learn About Embeddings →
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
                to="/docs/real-ai-embedding-story"
                className="group rounded-xl border border-border/50 bg-card p-5 hover:border-primary/50 hover:shadow-lg transition-all"
              >
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-2 flex items-center gap-2">
                  Real AI Embedding Generation <ArrowRight className="h-4 w-4" />
                </h3>
                <p className="text-sm text-muted-foreground">
                  From product data to semantic search
                </p>
              </Link>
              <Link 
                to="/docs/ecommerce-product-discovery-story"
                className="group rounded-xl border border-border/50 bg-card p-5 hover:border-primary/50 hover:shadow-lg transition-all"
              >
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-2 flex items-center gap-2">
                  E-Commerce Product Discovery <ArrowRight className="h-4 w-4" />
                </h3>
                <p className="text-sm text-muted-foreground">
                  Natural language product search
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
            <StoryLoveButton storySlug="vector-lifecycle" />
            <p className="text-sm text-muted-foreground text-center">
              Real API Integration Story • Part of AI Fabric Framework • MIT License • Production-Ready
            </p>
          </div>
        </footer>
      </div>
    </DocsLayout>
  );
};

export default VectorLifecycleStory;
