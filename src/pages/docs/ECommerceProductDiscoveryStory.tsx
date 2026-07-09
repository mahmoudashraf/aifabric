import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ShoppingBag,
  Search,
  TrendingUp,
  CheckCircle2,
  XCircle,
  Sparkles,
  DollarSign,
  Filter,
  Zap,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Highlight, themes } from "prism-react-renderer";
import { useEffect, useState } from "react";
import DocsLayout from "@/components/docs/DocsLayout";
import PageViewCounter from "@/components/PageViewCounter";
import StoryLoveButton from "@/components/StoryLoveButton";
import StoryNavigation from "@/components/StoryNavigation";

const PAGE_TITLE = "E-Commerce Product Discovery - When Shoppers Speak, AI Listens";
const PAGE_DESCRIPTION =
  "The story of how natural language product search transformed e-commerce. Learn how semantic search understands relationships between products, brands, colors, and prices.";
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

const ComparisonCard = ({ 
  title, 
  items, 
  isGood 
}: { 
  title: string; 
  items: string[]; 
  isGood: boolean 
}) => (
  <motion.div 
    whileHover={{ scale: 1.02 }}
    className={`rounded-xl border p-6 ${
      isGood 
        ? "border-accent/30 bg-accent/5" 
        : "border-destructive/30 bg-destructive/5"
    }`}
  >
    <h5 className={`font-semibold mb-3 flex items-center gap-2 ${
      isGood ? "text-accent" : "text-destructive"
    }`}>
      {isGood ? <CheckCircle2 className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
      {title}
    </h5>
    <ul className="space-y-2">
      {items.map((item, i) => (
        <li key={i} className="text-sm flex items-start gap-2">
          <span className={isGood ? "text-accent" : "text-destructive"}>
            {isGood ? "✓" : "✗"}
          </span>
          <span className={isGood ? "text-foreground" : "text-muted-foreground"}>
            {item}
          </span>
        </li>
      ))}
    </ul>
  </motion.div>
);

const ProductCard = ({ 
  name, 
  brand, 
  price, 
  color, 
  match 
}: { 
  name: string; 
  brand: string; 
  price: string; 
  color: string; 
  match: "perfect" | "partial" | "none" 
}) => (
  <div className={`rounded-lg border p-4 ${
    match === "perfect" ? "border-accent bg-accent/10" :
    match === "partial" ? "border-secondary/30 bg-card" :
    "border-border/30 bg-muted/20 opacity-60"
  }`}>
    <div className="flex items-start justify-between mb-2">
      <h5 className="font-semibold text-foreground">{name}</h5>
      {match === "perfect" && (
        <span className="rounded-full bg-accent px-2 py-0.5 text-xs text-accent-foreground">
          Perfect Match
        </span>
      )}
    </div>
    <div className="space-y-1 text-sm text-muted-foreground">
      <p><span className="font-medium">Brand:</span> {brand}</p>
      <p><span className="font-medium">Color:</span> {color}</p>
      <p><span className="font-medium">Price:</span> {price}</p>
    </div>
  </div>
);

const ECommerceProductDiscoveryStory = () => {
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
                <ShoppingBag className="h-4 w-4" />
                Real API Story
              </span>
              <div className="flex items-center gap-3">
                <StoryLoveButton storySlug="ecommerce-product-discovery" />
                <PageViewCounter />
              </div>
            </div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl"
            >
              <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
                When Shoppers Speak, <span className="text-gradient">AI Listens</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mb-8">
                The story of how natural language product search transformed e-commerce from frustrating 
                keyword battles to intuitive conversational discovery.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2 text-sm text-accent">
                  <Search className="h-4 w-4" />
                  Semantic Search
                </div>
                <div className="flex items-center gap-2 rounded-full bg-secondary/10 px-4 py-2 text-sm text-secondary">
                  <Target className="h-4 w-4" />
                  50,000+ Products
                </div>
                <div className="flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm text-primary">
                  <TrendingUp className="h-4 w-4" />
                  +40% Conversion
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
                <Search className="h-6 w-6 text-destructive" />
                The $2 Million Search Problem
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                You're the CTO of a fast-growing e-commerce platform. Your catalog has <strong className="text-foreground">50,000+ products</strong> across 
                hundreds of brands. Customers search for "blue shoes under $100 from Nike," but your keyword-based 
                search returns everything except what they want.
              </p>
              <div className="grid gap-4 md:grid-cols-2 mt-6">
                <ComparisonCard 
                  title="What Customers Get"
                  items={[
                    "Red Nike shoes ($89) - wrong color",
                    "Blue Adidas shoes ($95) - wrong brand",
                    "Blue Nike jackets ($79) - wrong category",
                    "Blue Nike shoes ($85) - buried on page 3"
                  ]}
                  isGood={false}
                />
                <ComparisonCard 
                  title="What Customers Want"
                  items={[
                    "Blue Nike shoes - exact match",
                    "Price under $100 - automatic filter",
                    "Active products only - smart filtering",
                    "Top of results - semantic ranking"
                  ]}
                  isGood={true}
                />
              </div>
              <p className="text-foreground font-medium mt-6">
                <strong>The damage:</strong> 60% bounce rate • $2M in lost annual revenue • Competitors 
                winning on product discovery
              </p>
            </div>
          </motion.div>
        </section>

        {/* The Story */}
        <section className="px-6 py-8">
          <div className="max-w-4xl">
            {/* Act I: The Catalog */}
            <StoryAct number="Act I" title="The Product Catalog" emoji="📦">
              <p>
                Your e-commerce platform has a sophisticated product catalog with relationships between 
                products, brands, categories, and attributes. Here's what's in stock:
              </p>

              <div className="grid gap-4 md:grid-cols-2 mt-6">
                <div className="rounded-xl border border-border/50 bg-card p-6">
                  <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    Nike Products
                  </h4>
                  <div className="space-y-3">
                    <ProductCard 
                      name="Blue Runner"
                      brand="Nike"
                      color="Blue"
                      price="$85.00"
                      match="perfect"
                    />
                    <ProductCard 
                      name="Premium Trail Boot"
                      brand="Nike"
                      color="Blue"
                      price="$180.00"
                      match="partial"
                    />
                    <ProductCard 
                      name="Red Runner"
                      brand="Nike"
                      color="Red"
                      price="$90.00"
                      match="none"
                    />
                  </div>
                </div>

                <div className="rounded-xl border border-border/50 bg-card p-6">
                  <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Filter className="h-5 w-5 text-secondary" />
                    Competitor Products
                  </h4>
                  <div className="space-y-3">
                    <ProductCard 
                      name="Adidas Flex"
                      brand="Adidas"
                      color="Blue"
                      price="$95.00"
                      match="partial"
                    />
                    <ProductCard 
                      name="Adidas Runner Elite"
                      brand="Adidas"
                      color="Red"
                      price="$110.00"
                      match="none"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-lg border border-accent/30 bg-accent/5 p-4">
                <p className="text-foreground">
                  <strong>The Perfect Match:</strong> Nike Blue Runner at $85 — exactly what the customer wants, 
                  but traditional keyword search can't understand the relationship between brand, color, price, and category.
                </p>
              </div>
            </StoryAct>

            {/* Act II: The Natural Language Query */}
            <StoryAct number="Act II" title="The AI-Powered Search" emoji="🤖">
              <p>
                A customer arrives at your store and types naturally, like they'd talk to a sales assistant:
              </p>

              <div className="rounded-xl border border-primary/30 bg-primary/5 p-6 mt-4">
                <p className="text-lg font-medium text-foreground text-center">
                  "Show me blue shoes under $100 from Nike"
                </p>
              </div>

              <h4 className="text-lg font-semibold text-foreground mt-8 mb-4">
                Behind the Scenes: AI Processing Pipeline
              </h4>

              <div className="space-y-4">
                <div className="rounded-lg border border-border/50 bg-card p-4">
                  <h5 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-xs text-primary">1</span>
                    Context Understanding
                  </h5>
                  <ul className="text-sm space-y-1 ml-8 text-muted-foreground">
                    <li>• "blue shoes" → color filter + category filter</li>
                    <li>• "under $100" → price range constraint</li>
                    <li>• "from Nike" → brand relationship lookup</li>
                  </ul>
                </div>

                <div className="rounded-lg border border-border/50 bg-card p-4">
                  <h5 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary/20 text-xs text-secondary">2</span>
                    Smart JPQL Generation
                  </h5>
                  <CodeBlock code={`SELECT p FROM ProductEntity p
JOIN p.brand b
WHERE p.color = 'blue'
  AND p.price < 100
  AND b.name = 'Nike'
  AND p.status = 'ACTIVE'
ORDER BY p.price ASC`} language="sql" />
                </div>

                <div className="rounded-lg border border-border/50 bg-card p-4">
                  <h5 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent/20 text-xs text-accent">3</span>
                    Semantic Search Enhancement
                  </h5>
                  <p className="text-sm text-muted-foreground ml-8">
                    Query embedding: "affordable Nike blue athletic footwear" → Vector similarity search → 
                    Contextual product ranking
                  </p>
                </div>
              </div>

              <div className="mt-6 rounded-xl bg-gradient-primary p-6">
                <h5 className="text-lg font-semibold text-primary-foreground mb-3">
                  The Result: Perfect Product Match
                </h5>
                <div className="rounded-lg bg-white/10 backdrop-blur p-4">
                  <ProductCard 
                    name="Nike Blue Runner"
                    brand="Nike"
                    color="Blue"
                    price="$85.00"
                    match="perfect"
                  />
                  <p className="text-sm text-primary-foreground/80 mt-3">
                    <strong>Match Confidence:</strong> 96% • <strong>Found in:</strong> 47ms • 
                    <strong>Customer Action:</strong> Add to Cart
                  </p>
                </div>
              </div>
            </StoryAct>

            {/* Act III: The Technology */}
            <StoryAct number="Act III" title="The Framework Behind the Magic" emoji="⚙️">
              <p>
                The AI Fabric Framework makes this possible through its <strong className="text-foreground">Relationship 
                Query Intelligence</strong> module combined with <strong className="text-foreground">Semantic Search</strong>.
              </p>

              <h4 className="text-lg font-semibold text-foreground mt-8 mb-4">
                Implementation: Three Lines of Code
              </h4>

              <CodeBlock code={`// 1. Configure natural language query handler
@AIAction(
    name = "product_search",
    description = "Search products using natural language"
)

// 2. Execute semantic search
RAGResponse response = queryService.execute(
    userQuery,
    List.of("ProductEntity", "BrandEntity"),
    RAGQueryOptions.builder()
        .maxResults(10)
        .similarityThreshold(0.75)
        .build()
);

// 3. Get filtered, ranked results
List<Product> products = response.getResults();`} />

              <h4 className="text-lg font-semibold text-foreground mt-8 mb-4">
                What the Framework Handles Automatically
              </h4>

              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  "Natural language parsing",
                  "Entity relationship mapping",
                  "JPQL query generation",
                  "Vector embedding creation",
                  "Semantic similarity ranking",
                  "Multi-entity joins",
                  "Price range filtering",
                  "Status-based filtering",
                  "Brand relationship lookup",
                  "Performance optimization"
                ].map((feature, i) => (
                  <div key={i} className="flex items-start gap-3 rounded-lg border border-border/50 bg-card p-3">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-accent mt-0.5" />
                    <span className="text-sm text-foreground">{feature}</span>
                  </div>
                ))}
              </div>
            </StoryAct>

            {/* Act IV: The Business Impact */}
            <StoryAct number="Act IV" title="The Business Impact" emoji="📈">
              <h4 className="text-lg font-semibold text-foreground mb-4">
                Before vs After: The Transformation
              </h4>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6">
                  <h5 className="text-lg font-bold text-destructive mb-4">
                    ❌ Keyword-Based Search
                  </h5>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-start gap-2">
                      <DollarSign className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-foreground">60% bounce rate</strong>
                        <p className="text-muted-foreground">Customers couldn't find products</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <XCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-foreground">3.2% conversion</strong>
                        <p className="text-muted-foreground">Poor search relevance</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <TrendingUp className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-foreground">$2M lost revenue</strong>
                        <p className="text-muted-foreground">Annually from search issues</p>
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="rounded-xl border border-accent/30 bg-accent/5 p-6">
                  <h5 className="text-lg font-bold text-accent mb-4">
                    ✅ AI-Powered Semantic Search
                  </h5>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-foreground">94% search relevance</strong>
                        <p className="text-muted-foreground">Customers find what they want</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-foreground">4.5% conversion (+40%)</strong>
                        <p className="text-muted-foreground">Better product discovery</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-foreground">+$500K revenue</strong>
                        <p className="text-muted-foreground">In first quarter alone</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-8 rounded-xl bg-gradient-primary p-6 text-center">
                <p className="text-2xl font-bold text-primary-foreground mb-2">
                  +25% Revenue Growth
                </p>
                <p className="text-primary-foreground/80">
                  From improved product discovery alone • Measured over 6 months
                </p>
              </div>

              <div className="mt-6 grid gap-4 grid-cols-2 md:grid-cols-4">
                {[
                  { value: "47ms", label: "Avg Query Time" },
                  { value: "96%", label: "Match Accuracy" },
                  { value: "50K+", label: "Products Indexed" },
                  { value: "10K+", label: "Daily Searches" }
                ].map((stat) => (
                  <div key={stat.label} className="rounded-lg border border-border/50 bg-card p-4 text-center">
                    <p className="text-2xl font-bold text-gradient">{stat.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            </StoryAct>
          </div>
        </section>

        {/* Try It Yourself */}
        <section className="border-t border-border/50 bg-muted/30 py-12 px-6">
          <div className="max-w-4xl">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-3">
                <Zap className="h-6 w-6 text-primary" />
                Bring This to Your E-Commerce Platform
              </h2>
              <p className="text-muted-foreground mb-8">
                The AI Fabric Framework provides the building blocks for natural language product discovery.
                Validate exact dependencies and release checks in the current Getting Started guide.
              </p>

              <div className="grid gap-6 md:grid-cols-2 mb-8">
                <div className="rounded-lg border border-border/50 bg-card p-6">
                  <h3 className="font-semibold text-foreground mb-3">What You Get</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                      Natural language query understanding
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                      Automatic JPQL generation
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                      Semantic similarity ranking
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                      Multi-entity relationship queries
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                      Real-time vector embeddings
                    </li>
                  </ul>
                </div>

                <div className="rounded-lg border border-border/50 bg-card p-6">
                  <h3 className="font-semibold text-foreground mb-3">Integration Time</h3>
                  <div className="space-y-4">
                    <div>
                      <p className="text-2xl font-bold text-primary mb-1">30 minutes</p>
                      <p className="text-sm text-muted-foreground">Add dependency + annotate entities</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-secondary mb-1">2 hours</p>
                      <p className="text-sm text-muted-foreground">Index products + configure search</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-accent mb-1">Production</p>
                      <p className="text-sm text-muted-foreground">Deploy semantic search live</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <Button variant="hero" size="lg" asChild>
                  <a href="https://github.com/mahmoudashraf/AI-Fabric-Framework" target="_blank" rel="noopener noreferrer">
                    ⭐ Star on GitHub
                  </a>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/docs/relationship_query_story_v2">
                    Learn More About Relationship Queries →
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
                to="/docs/financial-fraud-detection-story"
                className="group rounded-xl border border-border/50 bg-card p-5 hover:border-primary/50 hover:shadow-lg transition-all"
              >
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
                  Financial Fraud Detection →
                </h3>
                <p className="text-sm text-muted-foreground">
                  Track suspicious money flows through relationship queries
                </p>
              </Link>
              <Link 
                to="/docs/law-firm-document-story"
                className="group rounded-xl border border-border/50 bg-card p-5 hover:border-primary/50 hover:shadow-lg transition-all"
              >
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
                  Law Firm Document Management →
                </h3>
                <p className="text-sm text-muted-foreground">
                  Find needles in legal haystacks with natural language
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
            <StoryLoveButton storySlug="ecommerce-product-discovery" />
            <p className="text-sm text-muted-foreground text-center">
              Real API Integration Story • Part of AI Fabric Framework • See current guides for exact setup
            </p>
          </div>
        </footer>
      </div>
    </DocsLayout>
  );
};

export default ECommerceProductDiscoveryStory;
