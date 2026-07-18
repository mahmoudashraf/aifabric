import { useState } from "react";
import { motion } from "framer-motion";
import { Highlight, themes } from "prism-react-renderer";
import { 
  Rocket, 
  Clock, 
  DollarSign, 
  Zap, 
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Copy,
  Check,
  Sparkles,
  Shield,
  Database,
  Brain,
  Settings,
  Code2,
  Play,
  Terminal,
  ArrowRight,
  Package,
  FileCode,
  Layers,
  Search,
  TrendingUp,
  MessageSquare,
  Globe
} from "lucide-react";
import DocsLayout from "@/components/docs/DocsLayout";
import PageViewCounter from "@/components/PageViewCounter";
import StoryLoveButton from "@/components/StoryLoveButton";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";

const codeTheme = {
  ...themes.nightOwl,
  plain: {
    ...themes.nightOwl.plain,
    backgroundColor: "hsl(var(--code-bg))",
  },
};

const CopyableCodeBlock = ({ code, language = "java", filename }: { code: string; language?: string; filename?: string }) => {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(code.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group">
      {filename && (
        <div className="flex items-center gap-2 px-4 py-2 bg-muted/50 border-b border-border/30 rounded-t-lg">
          <FileCode className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground font-mono">{filename}</span>
        </div>
      )}
      <Highlight theme={codeTheme} code={code.trim()} language={language}>
        {({ style, tokens, getLineProps, getTokenProps }) => (
          <pre 
            className={`overflow-x-auto p-4 text-sm ${filename ? 'rounded-b-lg' : 'rounded-lg'} border border-border/50`}
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
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 p-2 rounded-md bg-muted/50 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-muted"
      >
        {copied ? (
          <Check className="h-4 w-4 text-green-400" />
        ) : (
          <Copy className="h-4 w-4 text-muted-foreground" />
        )}
      </button>
    </div>
  );
};

const PathCard = ({ 
  path, 
  title, 
  subtitle,
  features, 
  cost, 
  time, 
  recommended = false,
  onClick
}: { 
  path: number;
  title: string;
  subtitle: string;
  features: string[];
  cost: string;
  time: string;
  recommended?: boolean;
  onClick: () => void;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay: path * 0.1 }}
    className={`relative rounded-xl border p-6 cursor-pointer transition-all hover:scale-[1.02] ${
      recommended 
        ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10' 
        : 'border-border/50 bg-card/50 hover:border-primary/30'
    }`}
    onClick={onClick}
  >
    {recommended && (
      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
        <span className="rounded-full bg-primary px-3 py-1 text-xs font-medium text-primary-foreground">
          ⭐ Recommended
        </span>
      </div>
    )}
    
    <div className="flex items-center gap-3 mb-4">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent text-primary-foreground font-bold">
        {path}
      </div>
      <div>
        <h3 className="font-semibold text-foreground">{title}</h3>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </div>
    </div>
    
    <ul className="space-y-2 mb-4">
      {features.map((feature, i) => (
        <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
          <CheckCircle2 className="h-4 w-4 text-green-400 shrink-0" />
          {feature}
        </li>
      ))}
    </ul>
    
    <div className="flex items-center justify-between pt-4 border-t border-border/50">
      <div className="flex items-center gap-1 text-sm">
        <DollarSign className="h-4 w-4 text-green-400" />
        <span className="text-green-400 font-medium">{cost}</span>
      </div>
      <div className="flex items-center gap-1 text-sm text-muted-foreground">
        <Clock className="h-4 w-4" />
        {time}
      </div>
    </div>
  </motion.div>
);

const StepCard = ({ 
  step, 
  title, 
  time,
  children,
  icon
}: { 
  step: number;
  title: string;
  time: string;
  children: React.ReactNode;
  icon: React.ReactNode;
}) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ delay: step * 0.1 }}
    className="relative"
  >
    <div className="flex gap-4">
      {/* Timeline */}
      <div className="flex flex-col items-center">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-primary-foreground font-bold text-lg">
          {step}
        </div>
        <div className="w-0.5 flex-1 bg-gradient-to-b from-primary/50 to-transparent mt-2" />
      </div>
      
      {/* Content */}
      <div className="flex-1 pb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
            {icon}
          </div>
          <h3 className="font-semibold text-foreground text-lg">{title}</h3>
          <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
            {time}
          </span>
        </div>
        <div className="rounded-xl border border-border/50 bg-card/50 p-4">
          {children}
        </div>
      </div>
    </div>
  </motion.div>
);

const QuickStart = () => {
  const [selectedPath, setSelectedPath] = useState(1);

  return (
    <DocsLayout>
      <div className="min-h-screen">
        {/* Header */}
        <section className="border-b border-border/50 px-6 py-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary mb-3">
                🚀 Getting Started
              </span>
              <h1 className="text-2xl md:text-4xl font-bold bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent">
                From Zero to AI in 15 Minutes
              </h1>
              <p className="text-muted-foreground mt-2 max-w-2xl">
                The practical guide to installing AI Fabric Framework and running your first semantic search
              </p>
            </div>
            <div className="flex items-center gap-3">
              <StoryLoveButton storySlug="quickstart" />
              <PageViewCounter />
            </div>
          </div>
        </section>

        {/* The 15-Minute Miracle */}
        <section className="px-6 py-12 border-b border-border/50">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-2xl font-bold text-foreground mb-6">The 15-Minute Miracle</h2>
            
            <div className="flex flex-col md:flex-row items-center justify-center gap-6 md:gap-12">
              <div className="text-center">
                <div className="text-4xl font-bold text-muted-foreground mb-2">10:00 AM</div>
                <p className="text-sm text-muted-foreground">Spring Boot app<br/>with no AI capabilities</p>
              </div>
              
              <div className="flex items-center gap-2">
                <ArrowRight className="h-8 w-8 text-primary hidden md:block" />
                <ArrowRight className="h-8 w-8 text-primary rotate-90 md:hidden" />
              </div>
              
              <div className="text-center">
                <div className="text-4xl font-bold text-primary mb-2">10:15 AM</div>
                <p className="text-sm text-primary">Semantic search working<br/>Embeddings generating<br/>Entities indexed</p>
              </div>
            </div>
            
            <p className="mt-8 text-lg text-muted-foreground">
              <span className="text-foreground font-medium">What happened in between?</span> You followed this guide.
            </p>
          </motion.div>
        </section>

        {/* Choose Your Path */}
        <section className="px-6 py-12 border-b border-border/50 bg-gradient-to-b from-muted/20 to-background">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-5xl mx-auto"
          >
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">Choose Your Path</h2>
              <p className="text-muted-foreground">Select the setup that matches your needs</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <PathCard
                path={1}
                title="Minimal"
                subtitle="Free Everything"
                features={[
                  "Semantic search",
                  "Vector embeddings",
                  "RAG capabilities",
                  "Privacy & security built-in"
                ]}
                cost="$0"
                time="10 minutes"
                recommended
                onClick={() => setSelectedPath(1)}
              />
              <PathCard
                path={2}
                title="Full Stack"
                subtitle="All Modules"
                features={[
                  "Everything in Path 1",
                  "Behavior analytics",
                  "Data migration",
                  "Natural language queries",
                  "59 REST endpoints"
                ]}
                cost="$0 (ONNX + Lucene)"
                time="15 minutes"
                onClick={() => setSelectedPath(2)}
              />
              <PathCard
                path={3}
                title="Enterprise"
                subtitle="Cloud Scale"
                features={[
                  "Everything in Path 2",
                  "Cloud providers",
                  "Production vector DBs",
                  "Enterprise features"
                ]}
                cost="Variable"
                time="20 minutes"
                onClick={() => setSelectedPath(3)}
              />
            </div>
          </motion.div>
        </section>

        {/* Path 1: Step by Step Guide */}
        <section className="px-6 py-12 border-b border-border/50">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <div className="text-center mb-10">
              <span className="inline-flex items-center gap-2 rounded-full bg-primary/20 px-4 py-2 text-sm text-primary mb-4">
                <Sparkles className="h-4 w-4" />
                Path 1: Minimal Setup
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                Let's Do This!
              </h2>
              <p className="text-muted-foreground">From zero to semantic search in 10 minutes</p>
            </div>

            {/* Step 1 */}
            <StepCard step={1} title="Add Dependencies" time="2 min" icon={<Package className="h-4 w-4 text-primary" />}>
              <p className="text-muted-foreground text-sm mb-4">Open your <code className="text-primary bg-muted px-1.5 py-0.5 rounded">pom.xml</code> and add these 3 dependencies:</p>
              <CopyableCodeBlock 
                filename="pom.xml"
                language="xml"
                code={`<dependencies>
    <!-- 1. Core Module (foundation) -->
    <dependency>
        <groupId>io.github.loom-ai-labs</groupId>
        <artifactId>ai-fabric-core</artifactId>
        <version>0.3.3</version>
    </dependency>
    
    <!-- 2. ONNX Provider (local embeddings) -->
    <dependency>
        <groupId>io.github.loom-ai-labs</groupId>
        <artifactId>ai-fabric-onnx-starter</artifactId>
        <version>0.3.3</version>
    </dependency>
    
    <!-- 3. Lucene Vector DB (embedded local vector store) -->
    <dependency>
        <groupId>io.github.loom-ai-labs</groupId>
        <artifactId>ai-fabric-vector-lucene</artifactId>
        <version>0.3.3</version>
    </dependency>
</dependencies>`} 
              />
              <div className="mt-4 flex flex-wrap gap-2">
                {["LLM integration", "Embeddings (free)", "Vector DB", "Semantic search", "RAG", "Auto-indexing"].map((feature) => (
                  <span key={feature} className="inline-flex items-center gap-1 text-xs rounded-full bg-green-500/10 text-green-400 px-2 py-1">
                    <CheckCircle2 className="h-3 w-3" />
                    {feature}
                  </span>
                ))}
              </div>
            </StepCard>

            {/* Step 2 */}
            <StepCard step={2} title="Configure (Optional!)" time="1 min" icon={<Settings className="h-4 w-4 text-primary" />}>
              <p className="text-muted-foreground text-sm mb-4">Create <code className="text-primary bg-muted px-1.5 py-0.5 rounded">application.yml</code>:</p>
              <CopyableCodeBlock 
                filename="src/main/resources/application.yml"
                language="yaml"
                code={`ai:
  providers:
    embedding-provider: onnx  # Free local
  vector:
    database-type: lucene     # Free embedded`} 
              />
              <div className="mt-4 p-3 rounded-lg bg-primary/10 border border-primary/20">
                <p className="text-sm text-primary">
                  💡 <strong>Pro tip:</strong> You can skip this step! The framework auto-configures with these defaults.
                </p>
              </div>
            </StepCard>

            {/* Step 3 */}
            <StepCard step={3} title="Annotate Your Entity" time="2 min" icon={<Code2 className="h-4 w-4 text-primary" />}>
              <p className="text-muted-foreground text-sm mb-4">Add <strong>ONE annotation</strong> to your existing JPA entity:</p>
              
              <div className="grid lg:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-2">Before (existing code)</p>
                  <CopyableCodeBlock 
                    language="java"
                    code={`@Entity
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    private String name;
    private String description;
    private BigDecimal price;
}`} 
                  />
                </div>
                <div>
                  <p className="text-xs text-green-400 mb-2">After (AI-enabled!)</p>
                  <CopyableCodeBlock 
                    language="java"
                    code={`@Entity
@AICapable(
    entityType = "product",
    autoEmbedding = true,
    indexable = true
)
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    
    private String name;
    private String description;
    private BigDecimal price;
}`} 
                  />
                </div>
              </div>
              
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="text-xs text-green-400">✅ Auto-generates embeddings</span>
                <span className="text-xs text-green-400">✅ Auto-indexes for search</span>
                <span className="text-xs text-green-400">✅ Searchable by meaning</span>
              </div>
            </StepCard>

            {/* Step 4 */}
            <StepCard step={4} title="Create AI Entity Config" time="3 min" icon={<FileCode className="h-4 w-4 text-primary" />}>
              <p className="text-muted-foreground text-sm mb-4">Create <code className="text-primary bg-muted px-1.5 py-0.5 rounded">ai-entity-config.yml</code>:</p>
              <CopyableCodeBlock 
                filename="src/main/resources/ai-entity-config.yml"
                language="yaml"
                code={`ai-entities:
  product:
    auto-embedding: true
    indexable: true
    features: ["embedding", "search"]
    
    # Which fields to search
    searchable-fields:
      - name: name
        weight: 2.0      # Higher weight = more important
      - name: description
        weight: 1.0
    
    # Which fields to embed
    embeddable-fields:
      - name: description
        auto-generate: true
    
    # CRUD behavior
    crud-operations:
      create:
        generate-embedding: true
        index-for-search: true
      update:
        generate-embedding: true
        index-for-search: true
      delete:
        remove-from-search: true`} 
              />
            </StepCard>

            {/* Step 5 */}
            <StepCard step={5} title="Use It!" time="2 min" icon={<Play className="h-4 w-4 text-primary" />}>
              <p className="text-muted-foreground text-sm mb-4">Create a search service:</p>
              <CopyableCodeBlock 
                filename="ProductSearchService.java"
                language="java"
                code={`@Service
public class ProductSearchService {
    
    @Autowired
    private AISearchService searchService;
    
    @Autowired
    private AIEmbeddingService embeddingService;
    
    public List<Product> search(String query) {
        // Generate query embedding
        AIEmbeddingResponse embedding = embeddingService.generateEmbedding(
            AIEmbeddingRequest.builder()
                .text(query)
                .build()
        );
        
        // Search
        AISearchResponse results = searchService.search(
            embedding.getEmbedding(),
            AISearchRequest.builder()
                .query(query)
                .entityType("product")
                .limit(10)
                .threshold(0.7)
                .build()
        );
        
        // Convert to products
        return results.getResults().stream()
            .map(r -> productRepo.findById((String) r.get("id")))
            .filter(Optional::isPresent)
            .map(Optional::get)
            .toList();
    }
}`} 
              />
            </StepCard>

            {/* Step 6 */}
            <StepCard step={6} title="Test It!" time="2 min" icon={<Terminal className="h-4 w-4 text-primary" />}>
              <p className="text-muted-foreground text-sm mb-4">Run your app and test:</p>
              <CopyableCodeBlock 
                language="bash"
                code={`# Start your app
mvn spring-boot:run

# Create a product
curl -X POST http://localhost:8080/api/products \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "MacBook Pro M3",
    "description": "Powerful laptop for developers with M3 chip",
    "price": 2499.99
  }'

# Wait 1 second (background indexing)

# Search (semantic!)
curl "http://localhost:8080/api/products/search?q=laptop%20for%20programming"

# Returns: MacBook Pro M3 (94% match!)
# Understood: laptop = computer, programming = developers`} 
              />
              
              <div className="mt-4 p-4 rounded-lg bg-green-500/10 border border-green-500/20 text-center">
                <p className="text-xl font-bold text-green-400">🎉 IT WORKS!</p>
                <p className="text-sm text-muted-foreground mt-1">Semantic search is now live</p>
              </div>
            </StepCard>
          </motion.div>
        </section>

        {/* What You Created */}
        <section className="px-6 py-12 border-b border-border/50 bg-gradient-to-b from-background to-muted/20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">The 3 Files You Created</h2>
            </div>

            <div className="rounded-xl border border-border/50 bg-card/50 p-6 font-mono text-sm">
              <div className="space-y-2">
                <div className="text-muted-foreground">your-app/</div>
                <div className="pl-4 flex items-center gap-2">
                  <span className="text-yellow-400">├──</span>
                  <span className="text-primary">pom.xml</span>
                  <span className="text-xs text-green-400 bg-green-500/10 px-2 py-0.5 rounded">Added 3 dependencies ✅</span>
                </div>
                <div className="pl-4 text-muted-foreground">│</div>
                <div className="pl-4 text-muted-foreground">├── src/main/resources/</div>
                <div className="pl-8 flex items-center gap-2">
                  <span className="text-yellow-400">├──</span>
                  <span className="text-muted-foreground">application.yml</span>
                  <span className="text-xs text-muted-foreground">(optional)</span>
                </div>
                <div className="pl-8 flex items-center gap-2">
                  <span className="text-yellow-400">└──</span>
                  <span className="text-primary">ai-entity-config.yml</span>
                  <span className="text-xs text-green-400 bg-green-500/10 px-2 py-0.5 rounded">Created ✅</span>
                </div>
                <div className="pl-4 text-muted-foreground">│</div>
                <div className="pl-4 text-muted-foreground">└── src/main/java/com/yourapp/model/</div>
                <div className="pl-8 flex items-center gap-2">
                  <span className="text-yellow-400">└──</span>
                  <span className="text-primary">Product.java</span>
                  <span className="text-xs text-green-400 bg-green-500/10 px-2 py-0.5 rounded">Added @AICapable ✅</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-8">
              {[
                { label: "Total changes", value: "3 files" },
                { label: "Total time", value: "10 minutes" },
                { label: "Total cost", value: "$0" }
              ].map((stat) => (
                <div key={stat.label} className="text-center p-4 rounded-lg bg-primary/5 border border-primary/20">
                  <div className="text-2xl font-bold text-primary">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* What Happens Behind the Scenes */}
        <section className="px-6 py-12 border-b border-border/50">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-4">What Happens Behind the Scenes</h2>
              <p className="text-muted-foreground">The magic you didn't have to write</p>
            </div>

            <div className="space-y-4">
              {[
                { step: "You save Product", detail: "", icon: Database },
                { step: "AICapableAspect (AOP) intercepts", detail: "Automatic interception", icon: Shield },
                { step: "IndexingCoordinator queues it", detail: "Strategy = ASYNC", icon: Layers },
                { step: "HTTP Response returns", detail: "+10ms overhead only", icon: Zap },
                { step: "Background worker processes", detail: "Extract text → ONNX embedding (15ms) → Store in Lucene", icon: Brain },
                { step: "Product is searchable!", detail: "~1 second total", icon: Search }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-4"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <item.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{item.step}</p>
                    {item.detail && <p className="text-xs text-muted-foreground">{item.detail}</p>}
                  </div>
                  {i < 5 && <ArrowRight className="h-4 w-4 text-muted-foreground" />}
                  {i === 5 && <CheckCircle2 className="h-5 w-5 text-green-400" />}
                </motion.div>
              ))}
            </div>

            <div className="mt-8 p-4 rounded-lg bg-primary/5 border border-primary/20 text-center">
              <p className="text-lg font-medium text-foreground">You wrote <span className="text-primary">ZERO</span> indexing code.</p>
            </div>
          </motion.div>
        </section>

        {/* Module Overview */}
        <section className="px-6 py-12 border-b border-border/50 bg-gradient-to-b from-muted/20 to-background">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-5xl mx-auto"
          >
            <div className="text-center mb-10">
              <h2 className="text-2xl font-bold text-foreground mb-4">Add More Power</h2>
              <p className="text-muted-foreground">Each module unlocks new capabilities</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { name: "Behavior Analytics", artifact: "ai-infrastructure-behavior", features: ["Churn prediction", "Sentiment analysis", "Trend detection"], icon: TrendingUp },
                { name: "Migration", artifact: "ai-infrastructure-migration", features: ["Bulk indexing", "Pause/resume", "Progress tracking"], icon: Database },
                { name: "Relationship Query", artifact: "ai-infrastructure-relationship-query", features: ["Natural language → SQL", "64x cache speedup", "4-level fallback"], icon: MessageSquare },
                { name: "Web APIs", artifact: "ai-fabric-web", features: ["59 REST endpoints", "RAG API", "Health monitoring"], icon: Globe },
                { name: "ONNX Provider", artifact: "ai-infrastructure-onnx-starter", features: ["Local embeddings", "Local data path", "Hardware-dependent latency"], icon: Zap },
                { name: "Lucene Vector", artifact: "ai-infrastructure-vector-lucene", features: ["Embedded DB", "No setup", "< 1M vectors"], icon: Search }
              ].map((module, i) => (
                <motion.div
                  key={module.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="rounded-xl border border-border/50 bg-card/50 p-4"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <module.icon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-semibold text-foreground">{module.name}</h3>
                  </div>
                  <p className="text-xs text-muted-foreground font-mono mb-3">{module.artifact}</p>
                  <ul className="space-y-1">
                    {module.features.map((f) => (
                      <li key={f} className="text-xs text-muted-foreground flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3 text-green-400" />
                        {f}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* Bottom Line */}
        <section className="px-6 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-6">
              The Bottom Line
            </h2>
            
            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              <div className="rounded-xl border border-green-500/30 bg-green-500/5 p-4">
                <h3 className="font-semibold text-foreground mb-3">What You Get</h3>
                <ul className="text-sm text-left space-y-2">
                  {["Semantic search", "Auto-indexing", "Privacy built-in", "Production-ready", "$0 cost"].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-muted-foreground">
                      <CheckCircle2 className="h-4 w-4 text-green-400" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="rounded-xl border border-primary/30 bg-primary/5 p-4">
                <h3 className="font-semibold text-foreground mb-3">What You Don't Write</h3>
                <ul className="text-sm text-left space-y-2">
                  {["Embedding pipeline", "Vector DB integration", "Async workers", "Caching layer", "Retry logic", "Monitoring"].map((item) => (
                    <li key={item} className="flex items-center gap-2 text-muted-foreground">
                      <Zap className="h-4 w-4 text-primary" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <p className="text-lg text-muted-foreground mb-8">
              <span className="text-foreground font-medium">All handled by the framework.</span>
            </p>

            <StoryLoveButton storySlug="quickstart" />
            
            <p className="text-sm text-muted-foreground mt-6">
              Part of the AI Fabric Framework. For the latest setup, use the current Getting Started guide.
            </p>
          </motion.div>
        </section>
      </div>
    </DocsLayout>
  );
};

export default QuickStart;
