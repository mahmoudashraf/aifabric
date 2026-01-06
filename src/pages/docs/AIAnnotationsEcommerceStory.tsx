import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Highlight, themes } from "prism-react-renderer";
import DocsLayout from "@/components/docs/DocsLayout";
import PageViewCounter from "@/components/PageViewCounter";
import StoryLoveButton from "@/components/StoryLoveButton";
import StoryNavigation from "@/components/StoryNavigation";
import { 
  ShoppingCart,
  Search,
  XCircle,
  CheckCircle2,
  Sparkles,
  TrendingUp,
  DollarSign,
  Package,
  Tag,
  Star,
  ArrowRight,
  Zap,
  Target,
  Users,
  BarChart3,
  Heart,
  RefreshCw
} from "lucide-react";

const PAGE_TITLE = "E-Commerce Semantic Search: When 'Comfy Chair' Finds Your Ergonomic Collection";
const PAGE_DESCRIPTION = "How 4 annotations turned keyword failure into product discovery magic—and boosted conversion by 34%.";

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

// Interactive Search Simulator
const SearchSimulator = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchMode, setSearchMode] = useState<"keyword" | "semantic">("keyword");
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<Array<{name: string; description: string; price: string; rating: number; match: number}>>([]);

  const products = [
    { name: "ErgoPro Executive Chair", description: "Premium lumbar support for all-day comfort", price: "$299.99", rating: 4.8, keywords: ["ergopro", "executive", "chair", "lumbar"] },
    { name: "MeshMaster Pro Workstation Seating", description: "Breathable mesh, ergonomic design, posture support", price: "$349.99", rating: 4.7, keywords: ["meshmaster", "workstation", "mesh"] },
    { name: "ComfortZone Executive", description: "Designed for 8+ hour sitting, adjustable everything", price: "$279.99", rating: 4.6, keywords: ["comfortzone", "adjustable"] },
    { name: "Standing Desk Pro", description: "Height adjustable desk for active working", price: "$549.99", rating: 4.5, keywords: ["standing", "desk", "height"] },
    { name: "Bamboo Toothbrush", description: "Eco-friendly, sustainable dental care", price: "$12.99", rating: 4.4, keywords: ["bamboo", "toothbrush", "dental"] },
  ];

  const semanticMatches: Record<string, string[]> = {
    "comfortable": ["comfort", "ergonomic", "lumbar", "support", "cushion"],
    "office": ["workstation", "executive", "desk", "work"],
    "chair": ["seating", "chair", "sitting"],
    "eco-friendly": ["sustainable", "eco", "bamboo", "biodegradable"],
    "comfy": ["comfort", "cozy", "ergonomic", "cushion"],
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    setTimeout(() => {
      const query = searchQuery.toLowerCase();
      const queryWords = query.split(" ");
      
      if (searchMode === "keyword") {
        // Exact keyword matching
        const keywordResults = products.filter(p => 
          queryWords.some(word => 
            p.name.toLowerCase().includes(word) || 
            p.keywords.some(k => k.includes(word))
          )
        ).map(p => ({ ...p, match: 100 }));
        setResults(keywordResults);
      } else {
        // Semantic matching
        const expandedTerms = new Set<string>();
        queryWords.forEach(word => {
          expandedTerms.add(word);
          Object.entries(semanticMatches).forEach(([key, values]) => {
            if (key.includes(word) || word.includes(key)) {
              values.forEach(v => expandedTerms.add(v));
            }
          });
        });
        
        const semanticResults = products.map(p => {
          const text = `${p.name} ${p.description}`.toLowerCase();
          const matchCount = Array.from(expandedTerms).filter(term => text.includes(term)).length;
          const matchScore = Math.min(99, Math.round((matchCount / expandedTerms.size) * 100 + Math.random() * 10));
          return { ...p, match: matchScore };
        }).filter(p => p.match > 30).sort((a, b) => b.match - a.match);
        
        setResults(semanticResults);
      }
      setIsSearching(false);
    }, 800);
  };

  return (
    <div className="my-12 p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 border border-border/50">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
          <Search className="h-5 w-5 text-primary" />
          Try It: Keyword vs Semantic Search
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => setSearchMode("keyword")}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              searchMode === "keyword"
                ? "bg-red-500/20 border-2 border-red-500/50 text-red-400"
                : "bg-muted/30 border border-border/50 text-muted-foreground hover:border-border"
            }`}
          >
            <XCircle className="h-4 w-4 inline mr-1" />
            Keyword
          </button>
          <button
            onClick={() => setSearchMode("semantic")}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              searchMode === "semantic"
                ? "bg-green-500/20 border-2 border-green-500/50 text-green-400"
                : "bg-muted/30 border border-border/50 text-muted-foreground hover:border-border"
            }`}
          >
            <CheckCircle2 className="h-4 w-4 inline mr-1" />
            Semantic
          </button>
        </div>
      </div>

      <div className="flex gap-3 mb-6">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder='Try "comfortable office chair" or "eco-friendly"'
          className="flex-1 px-4 py-3 rounded-lg bg-card border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
        <button
          onClick={handleSearch}
          disabled={isSearching}
          className="px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {isSearching ? <RefreshCw className="h-5 w-5 animate-spin" /> : <Search className="h-5 w-5" />}
        </button>
      </div>

      <div className="min-h-[200px]">
        {results.length === 0 && searchQuery && !isSearching && (
          <div className="text-center py-8">
            <XCircle className="h-12 w-12 text-red-400 mx-auto mb-3" />
            <p className="text-red-400 font-semibold">0 Results Found</p>
            <p className="text-sm text-muted-foreground mt-1">
              {searchMode === "keyword" ? "Try semantic search to find by meaning!" : "Try different search terms"}
            </p>
          </div>
        )}
        
        <AnimatePresence mode="popLayout">
          {results.map((product, i) => (
            <motion.div
              key={`${product.name}-${i}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: i * 0.1 }}
              className={`p-4 rounded-xl border mb-3 ${
                product.match > 80 
                  ? "border-green-500/30 bg-green-500/5" 
                  : product.match > 50 
                    ? "border-amber-500/30 bg-amber-500/5"
                    : "border-border/30 bg-card/50"
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-foreground">{product.name}</h4>
                    {product.match > 80 && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-400">
                        Best Match
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{product.description}</p>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-primary font-semibold">{product.price}</span>
                    <span className="flex items-center gap-1 text-amber-400">
                      <Star className="h-3 w-3 fill-current" />
                      {product.rating}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-2xl font-bold ${
                    product.match > 80 ? "text-green-400" : product.match > 50 ? "text-amber-400" : "text-muted-foreground"
                  }`}>
                    {product.match}%
                  </div>
                  <div className="text-xs text-muted-foreground">match</div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="mt-4 p-4 rounded-lg bg-muted/30 border border-border/30">
        <p className="text-xs text-muted-foreground text-center">
          {searchMode === "keyword" 
            ? '⚠️ Keyword search matches exact words only. "comfortable" won\'t find "ergonomic".'
            : '✨ Semantic search understands meaning. "comfortable" finds "ergonomic", "lumbar support", etc.'
          }
        </p>
      </div>
    </div>
  );
};

// Annotation Showcase
const AnnotationShowcase = () => {
  const [activeAnnotation, setActiveAnnotation] = useState(0);
  
  const annotations = [
    {
      name: "@AICapable",
      level: "Class",
      purpose: "Enable AI features for entity",
      color: "text-purple-400",
      borderColor: "border-purple-500/30",
      bgColor: "bg-purple-500/5",
      icon: Package,
      code: `@Entity
@AICapable(entityType = "product")
public class Product {
    // AI features now enabled!
}`
    },
    {
      name: "@AISearchable",
      level: "Field",
      purpose: "Users can FIND by this",
      color: "text-blue-400",
      borderColor: "border-blue-500/30",
      bgColor: "bg-blue-500/5",
      icon: Search,
      code: `@AISearchable   // "bluetooth speakers" finds "wireless audio"
private String name;

@AISearchable   // "eco-friendly" finds "sustainable"
private String description;`
    },
    {
      name: "@AIContext",
      level: "Field",
      purpose: "AI needs to KNOW this",
      color: "text-green-400",
      borderColor: "border-green-500/30",
      bgColor: "bg-green-500/5",
      icon: Tag,
      code: `@AIContext      // AI can answer: "How much?"
private BigDecimal price;

@AIContext      // AI can answer: "Is it in stock?"
private Boolean inStock;`
    },
    {
      name: "@AIProcess",
      level: "Method",
      purpose: "Trigger AI processing",
      color: "text-amber-400",
      borderColor: "border-amber-500/30",
      bgColor: "bg-amber-500/5",
      icon: Zap,
      code: `@AIProcess(entityType = "product", processType = "create")
public Product create(Product product) {
    return repository.save(product);
    // Framework handles everything else!
}`
    }
  ];

  return (
    <div className="my-16">
      <h3 className="text-2xl font-bold text-foreground mb-8 text-center">
        The 4 Annotations That Power Everything
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {annotations.map((ann, i) => (
          <button
            key={i}
            onClick={() => setActiveAnnotation(i)}
            className={`p-4 rounded-xl border-2 transition-all ${
              activeAnnotation === i
                ? `${ann.borderColor} ${ann.bgColor} shadow-lg scale-105`
                : "border-border/30 bg-muted/30 hover:border-border"
            }`}
          >
            <ann.icon className={`h-6 w-6 mx-auto mb-2 ${activeAnnotation === i ? ann.color : 'text-muted-foreground'}`} />
            <p className={`text-sm font-bold ${activeAnnotation === i ? 'text-foreground' : 'text-muted-foreground'}`}>
              {ann.name}
            </p>
            <p className="text-xs text-muted-foreground mt-1">{ann.level}</p>
          </button>
        ))}
      </div>
      
      <AnimatePresence mode="wait">
        <motion.div
          key={activeAnnotation}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`p-6 rounded-xl border ${annotations[activeAnnotation].borderColor} ${annotations[activeAnnotation].bgColor}`}
        >
          <div className="flex items-center gap-3 mb-4">
            {React.createElement(annotations[activeAnnotation].icon, {
              className: `h-8 w-8 ${annotations[activeAnnotation].color}`
            })}
            <div>
              <h4 className="text-xl font-bold text-foreground">{annotations[activeAnnotation].name}</h4>
              <p className="text-sm text-muted-foreground">{annotations[activeAnnotation].purpose}</p>
            </div>
          </div>
          
          <CodeBlock code={annotations[activeAnnotation].code} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

// Stats Display
const StatsSection = () => {
  const stats = [
    { value: "-83%", label: "Zero-Result Searches", icon: XCircle, color: "text-green-400" },
    { value: "+122%", label: "Conversion Rate", icon: TrendingUp, color: "text-blue-400" },
    { value: "+25%", label: "Avg Order Value", icon: DollarSign, color: "text-amber-400" },
    { value: "+38%", label: "Customer Satisfaction", icon: Heart, color: "text-pink-400" },
  ];

  return (
    <div className="my-16 grid grid-cols-2 md:grid-cols-4 gap-6">
      {stats.map((stat, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.1 }}
          viewport={{ once: true }}
          className="p-6 rounded-xl bg-card border border-border/50 text-center hover:border-primary/30 transition-all"
        >
          <stat.icon className={`h-8 w-8 ${stat.color} mx-auto mb-3`} />
          <div className={`text-3xl font-bold ${stat.color} mb-1`}>{stat.value}</div>
          <div className="text-xs text-muted-foreground">{stat.label}</div>
        </motion.div>
      ))}
    </div>
  );
};

// Conversion Funnel
const ConversionFunnel = () => {
  const [showAfter, setShowAfter] = useState(false);
  
  const beforeFunnel = [
    { stage: "Searches", count: "100,000", width: "100%" },
    { stage: "Zero Results", count: "47,000 (47%)", width: "47%", isLoss: true },
    { stage: "Got Results", count: "53,000", width: "53%" },
    { stage: "Added to Cart", count: "12,000 (23%)", width: "23%" },
    { stage: "Purchased", count: "3,600 (30%)", width: "8%" },
  ];
  
  const afterFunnel = [
    { stage: "Searches", count: "100,000", width: "100%" },
    { stage: "Zero Results", count: "8,000 (8%)", width: "8%", isLoss: true },
    { stage: "Got Results", count: "92,000", width: "92%" },
    { stage: "Added to Cart", count: "25,000 (27%)", width: "27%" },
    { stage: "Purchased", count: "8,000 (32%)", width: "17%" },
  ];
  
  const funnel = showAfter ? afterFunnel : beforeFunnel;

  return (
    <div className="my-16 p-8 rounded-2xl bg-card border border-border/50">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          Conversion Funnel Impact
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => setShowAfter(false)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              !showAfter
                ? "bg-red-500/20 border-2 border-red-500/50 text-red-400"
                : "bg-muted/30 border border-border/50 text-muted-foreground"
            }`}
          >
            Before (Keyword)
          </button>
          <button
            onClick={() => setShowAfter(true)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              showAfter
                ? "bg-green-500/20 border-2 border-green-500/50 text-green-400"
                : "bg-muted/30 border border-border/50 text-muted-foreground"
            }`}
          >
            After (Semantic)
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {funnel.map((step, i) => (
          <motion.div
            key={`${step.stage}-${showAfter}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="relative"
          >
            <div className="flex items-center gap-4 mb-1">
              <span className="text-sm font-medium text-foreground w-32">{step.stage}</span>
              <span className={`text-sm font-mono ${step.isLoss ? 'text-red-400' : 'text-muted-foreground'}`}>
                {step.count}
              </span>
            </div>
            <div className="h-8 rounded-lg bg-muted/30 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: step.width }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`h-full rounded-lg ${
                  step.isLoss 
                    ? 'bg-red-500/30' 
                    : showAfter 
                      ? 'bg-gradient-to-r from-green-500/50 to-green-400/30' 
                      : 'bg-gradient-to-r from-blue-500/50 to-blue-400/30'
                }`}
              />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-8 p-4 rounded-lg bg-gradient-to-r from-green-500/10 to-blue-500/10 border border-green-500/20 text-center">
        <p className="text-lg font-bold text-foreground">
          {showAfter ? "8.0% Conversion Rate (+122%)" : "3.6% Conversion Rate"}
        </p>
        <p className="text-sm text-muted-foreground mt-1">
          {showAfter ? "Semantic search finds what customers mean" : "Keyword search only finds exact matches"}
        </p>
      </div>
    </div>
  );
};

const AIAnnotationsEcommerceStory = () => {
  useEffect(() => {
    document.title = PAGE_TITLE;
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
          <section className="relative overflow-hidden border-b border-border/50 pb-12 mb-12">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-primary/5" />
            <div className="relative">
              <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                    <ShoppingCart className="h-4 w-4" />
                    AI Annotations Story
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <StoryLoveButton storySlug="ai-annotations-ecommerce" />
                  <PageViewCounter />
                </div>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
                When "Comfy Chair" Finally Finds Your{" "}
                <span className="text-gradient">Ergonomic Collection</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mb-8">
                How 4 annotations turned keyword failure into product discovery magic—and boosted conversion by 122%.
              </p>
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 border border-border/50">
                  <Target className="h-4 w-4 text-green-400" />
                  50K+ Products
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 border border-border/50">
                  <TrendingUp className="h-4 w-4 text-blue-400" />
                  +122% Conversion
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 border border-border/50">
                  <DollarSign className="h-4 w-4 text-amber-400" />
                  $1.5M/year Impact
                </div>
              </div>
            </div>
          </section>

          {/* The Problem */}
          <section className="mb-12 p-8 rounded-2xl bg-red-500/5 border border-red-500/30">
            <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-3">
              <XCircle className="h-6 w-6 text-red-400" />
              The "Zero Results" Epidemic
            </h2>
            <p className="text-muted-foreground mb-6">
              <strong className="text-foreground">Friday, 3 PM. Analytics meeting.</strong>
            </p>
            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 mb-6">
              <p className="text-foreground italic">
                "Why did 47% of searches return zero results last month? Users searched for 'comfortable office chair'. 
                We have 847 ergonomic chairs. Zero matches."
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-muted/30 border border-border/30">
                <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-red-400" />
                  What Customers Searched
                </h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>"comfortable office chair"</li>
                  <li>"eco-friendly water bottle"</li>
                  <li>"wireless earbuds"</li>
                </ul>
              </div>
              <div className="p-4 rounded-lg bg-muted/30 border border-border/30">
                <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-400" />
                  What We Had (Not Found)
                </h4>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>"ergonomic lumbar support seating"</li>
                  <li>"sustainable BPA-free reusable"</li>
                  <li>"Bluetooth in-ear headphones"</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Interactive Search */}
          <SearchSimulator />

          {/* The Solution */}
          <section className="mb-12 p-8 rounded-2xl bg-green-500/5 border border-green-500/30">
            <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-3">
              <Sparkles className="h-6 w-6 text-green-400" />
              The Fix: 4 Annotations
            </h2>
            <p className="text-muted-foreground mb-6">
              No embedding calls. No vector DB code. No consistency nightmares.
            </p>
            <CodeBlock code={`@Entity
@AICapable(entityType = "product")
public class Product {
    
    @Id
    private Long id;
    
    @AISearchable   // "comfortable" finds "ergonomic, lumbar support"
    private String name;
    
    @AISearchable   // "eco-friendly" finds "sustainable, biodegradable"
    private String description;
    
    @AIContext      // AI knows price for "under $300" queries
    private BigDecimal price;
    
    @AIContext      // AI knows brand for recommendations
    private String brand;
    
    @AIContext      // AI knows if in stock
    private Boolean inStock;
    
    private String sku;  // Internal - not in AI system
}`} />
          </section>

          {/* Annotation Showcase */}
          <AnnotationShowcase />

          {/* Stats */}
          <StatsSection />

          {/* Conversion Funnel */}
          <ConversionFunnel />

          {/* The Service Layer */}
          <section className="mb-12">
            <h3 className="text-2xl font-bold text-foreground mb-6 text-center">
              The Service Layer (Now Boring, As It Should Be)
            </h3>
            <CodeBlock code={`@Service
@RequiredArgsConstructor
public class ProductService {
    
    private final ProductRepository repository;
    
    @AIProcess(entityType = "product", processType = "create")
    @Transactional
    public Product create(Product product) {
        return repository.save(product);
        // That's it. Framework handles:
        // ✓ Extract @AISearchable fields
        // ✓ Build metadata from @AIContext
        // ✓ Generate embedding (async)
        // ✓ Store in vector DB
        // ✓ Retry on failure
    }
}`} />
          </section>

          {/* The Revelation */}
          <section className="mb-16 p-8 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/5 border border-primary/20 text-center">
            <ShoppingCart className="h-16 w-16 text-primary mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-foreground mb-4">The Bottom Line</h3>
            <div className="max-w-2xl mx-auto space-y-4 text-muted-foreground">
              <p className="text-lg">
                "Our customers searched for 'comfortable office chair'."
              </p>
              <p className="text-lg">
                "We had 847 perfect matches with 'ergonomic lumbar support'."
              </p>
              <p className="text-lg">
                "<span className="text-primary font-semibold">Keyword search returned zero. Semantic search found them all.</span>"
              </p>
              <p className="text-lg">
                "That's $127,000/month in sales we were leaving on the table."
              </p>
            </div>
          </section>

          {/* Story Navigation */}
          <StoryNavigation className="mt-12" />

          {/* Footer */}
          <footer className="border-t border-border/50 pt-12 mt-12 flex flex-col items-center gap-6">
            <div className="flex items-center gap-4">
              <StoryLoveButton storySlug="ai-annotations-ecommerce" />
              <PageViewCounter />
            </div>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link 
                to="/docs/ai-annotations-developer-guide" 
                className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
              >
                <Zap className="h-4 w-4" />
                Developer Deep Dive
              </Link>
              <Link 
                to="/docs/ai-annotations-enterprise-knowledge" 
                className="inline-flex items-center gap-2 px-6 py-2 rounded-full border border-border bg-card text-foreground font-medium hover:bg-muted transition-colors"
              >
                Next: Enterprise Knowledge →
              </Link>
            </div>
            <p className="text-xs text-muted-foreground text-center max-w-md">
              Part of the AI Annotations Story Series — Semantic Search for E-Commerce
            </p>
          </footer>
        </motion.article>
      </div>
    </DocsLayout>
  );
};

export default AIAnnotationsEcommerceStory;
