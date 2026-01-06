import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Highlight, themes } from "prism-react-renderer";
import DocsLayout from "@/components/docs/DocsLayout";
import PageViewCounter from "@/components/PageViewCounter";
import StoryLoveButton from "@/components/StoryLoveButton";
import StoryNavigation from "@/components/StoryNavigation";
import { 
  Search,
  Brain,
  CheckCircle2,
  XCircle,
  Zap,
  Sparkles,
  ArrowRight,
  Target,
  TrendingUp,
  Lightbulb,
  Eye,
  Equal,
  Diff,
  Waves,
  MessageSquare,
  RefreshCw
} from "lucide-react";

const PAGE_TITLE = "Semantic Search That Works: When 'Running Shoes' Finds 'Athletic Footwear'";
const PAGE_DESCRIPTION = "The fundamental difference between finding strings and finding meaning—and why it changes everything.";

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

// Visual comparison of keyword vs semantic
const SearchVisualization = () => {
  const [mode, setMode] = useState<"keyword" | "semantic">("keyword");
  
  const keywordProcess = [
    { step: '"running shoes"', label: "Query" },
    { step: 'contains("running")?', label: "Check 1" },
    { step: 'contains("shoes")?', label: "Check 2" },
    { step: 'NO MATCH ❌', label: 'Result for "Athletic Footwear"' },
  ];
  
  const semanticProcess = [
    { step: '"running shoes"', label: "Query" },
    { step: '[0.23, -0.14, 0.87, ...]', label: "Query Embedding" },
    { step: 'cos_sim = 0.92', label: 'vs "Athletic Footwear"' },
    { step: 'MATCH ✓ (92%)', label: "Result" },
  ];

  return (
    <div className="my-12 p-8 rounded-2xl bg-card border border-border/50">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          How Search Actually Works
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => setMode("keyword")}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              mode === "keyword"
                ? "bg-red-500/20 border-2 border-red-500/50 text-red-400"
                : "bg-muted/30 border border-border/50 text-muted-foreground"
            }`}
          >
            Keyword (String)
          </button>
          <button
            onClick={() => setMode("semantic")}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              mode === "semantic"
                ? "bg-green-500/20 border-2 border-green-500/50 text-green-400"
                : "bg-muted/30 border border-border/50 text-muted-foreground"
            }`}
          >
            Semantic (Meaning)
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-4">
        {(mode === "keyword" ? keywordProcess : semanticProcess).map((item, i) => (
          <React.Fragment key={i}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.15 }}
              className={`p-4 rounded-xl border-2 text-center flex-1 ${
                item.label === "Result" || item.label.includes("Result")
                  ? mode === "keyword"
                    ? "border-red-500/50 bg-red-500/10"
                    : "border-green-500/50 bg-green-500/10"
                  : "border-border/50 bg-muted/30"
              }`}
            >
              <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
              <p className={`font-mono text-sm ${
                item.step.includes('NO MATCH') ? 'text-red-400' :
                item.step.includes('MATCH ✓') ? 'text-green-400' :
                'text-foreground'
              }`}>
                {item.step}
              </p>
            </motion.div>
            {i < (mode === "keyword" ? keywordProcess : semanticProcess).length - 1 && (
              <ArrowRight className="h-5 w-5 text-muted-foreground shrink-0 hidden md:block" />
            )}
          </React.Fragment>
        ))}
      </div>

      <div className={`mt-6 p-4 rounded-lg ${
        mode === "keyword" ? "bg-red-500/10 border border-red-500/20" : "bg-green-500/10 border border-green-500/20"
      }`}>
        <p className={`text-sm ${mode === "keyword" ? "text-red-400" : "text-green-400"}`}>
          {mode === "keyword" 
            ? '❌ Keyword search asks: "Do these strings match?"'
            : '✓ Semantic search asks: "Do these concepts relate?"'
          }
        </p>
      </div>
    </div>
  );
};

// Embedding Visualization
const EmbeddingVisualization = () => {
  const words = [
    { word: "running shoes", x: 80, y: 20, group: "footwear" },
    { word: "athletic footwear", x: 85, y: 25, group: "footwear" },
    { word: "sneakers", x: 75, y: 30, group: "footwear" },
    { word: "jogging trainers", x: 82, y: 18, group: "footwear" },
    { word: "toaster", x: 20, y: 70, group: "appliance" },
    { word: "car engine", x: 60, y: 80, group: "vehicle" },
    { word: "laptop", x: 40, y: 40, group: "tech" },
  ];

  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <div className="my-16 p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 border border-border/50">
      <h3 className="text-xl font-bold text-foreground mb-4 text-center">
        🧠 The Embedding Space: Where Meaning Lives
      </h3>
      <p className="text-muted-foreground text-center mb-8 max-w-2xl mx-auto">
        In embedding space, similar concepts cluster together. Distance = semantic difference.
      </p>
      
      <div className="relative h-[300px] rounded-xl bg-card border border-border/50 overflow-hidden">
        {/* Grid lines */}
        <div className="absolute inset-0 opacity-10">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="absolute w-full border-t border-muted-foreground" style={{ top: `${i * 10}%` }} />
          ))}
          {[...Array(10)].map((_, i) => (
            <div key={i} className="absolute h-full border-l border-muted-foreground" style={{ left: `${i * 10}%` }} />
          ))}
        </div>
        
        {/* Words */}
        {words.map((w) => (
          <motion.div
            key={w.word}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: 1, 
              scale: hovered && hovered !== w.word && words.find(x => x.word === hovered)?.group !== w.group ? 0.5 : 1 
            }}
            transition={{ duration: 0.3 }}
            onMouseEnter={() => setHovered(w.word)}
            onMouseLeave={() => setHovered(null)}
            className={`absolute px-3 py-1.5 rounded-full text-sm font-medium cursor-pointer transition-all ${
              w.group === "footwear" 
                ? "bg-green-500/20 border border-green-500/50 text-green-400"
                : "bg-muted/50 border border-border/50 text-muted-foreground"
            } ${hovered === w.word ? 'ring-2 ring-primary z-10' : ''}`}
            style={{ 
              left: `${w.x}%`, 
              top: `${w.y}%`,
              transform: 'translate(-50%, -50%)'
            }}
          >
            {w.word}
          </motion.div>
        ))}
        
        {/* Connection lines for footwear cluster */}
        <svg className="absolute inset-0 pointer-events-none">
          {hovered && words.find(w => w.word === hovered)?.group === "footwear" && (
            words.filter(w => w.group === "footwear").map((w, i, arr) => (
              arr.slice(i + 1).map((w2, j) => (
                <motion.line
                  key={`${w.word}-${w2.word}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.3 }}
                  x1={`${w.x}%`} y1={`${w.y}%`}
                  x2={`${w2.x}%`} y2={`${w2.y}%`}
                  stroke="rgb(74, 222, 128)"
                  strokeWidth="1"
                  strokeDasharray="4"
                />
              ))
            ))
          )}
        </svg>
      </div>
      
      <div className="mt-6 grid md:grid-cols-2 gap-4">
        <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30">
          <p className="text-green-400 font-semibold mb-1">Footwear Cluster</p>
          <p className="text-xs text-muted-foreground">
            "running shoes", "athletic footwear", "sneakers", "jogging trainers" are all CLOSE in embedding space
          </p>
        </div>
        <div className="p-4 rounded-lg bg-muted/30 border border-border/30">
          <p className="text-foreground font-semibold mb-1">Unrelated Words</p>
          <p className="text-xs text-muted-foreground">
            "toaster", "car engine" are FAR from footwear cluster—different concepts
          </p>
        </div>
      </div>
    </div>
  );
};

// Live Examples
const LiveExamples = () => {
  const [activeExample, setActiveExample] = useState(0);
  
  const examples = [
    {
      query: "laptop for coding",
      keyword: {
        results: [
          { name: "Coding Keyboard", match: false, reason: "Has 'coding'" },
          { name: "USB Laptop Stand", match: false, reason: "Has 'laptop'" },
        ],
        missed: "MacBook Pro M3, Dell XPS Developer Edition, ThinkPad X1"
      },
      semantic: {
        results: [
          { name: "MacBook Pro M3 14-inch", score: 94, reason: "Developer favorite" },
          { name: "Dell XPS 15 Developer Edition", score: 91, reason: "Programming workstation" },
          { name: "ThinkPad X1 Carbon", score: 89, reason: "Professional laptop" },
        ]
      }
    },
    {
      query: "eco-friendly water bottle",
      keyword: {
        results: [
          { name: "Water Purifier", match: false, reason: "Has 'water'" },
          { name: "Eco Car Wash", match: false, reason: "Has 'eco'" },
        ],
        missed: "Hydro Flask Sustainable, Bamboo Reusable Bottle, Zero-Waste Tumbler"
      },
      semantic: {
        results: [
          { name: "Hydro Flask Sustainable Series", score: 96, reason: "Eco materials" },
          { name: "Bamboo Reusable Water Bottle", score: 93, reason: "Sustainable material" },
          { name: "Zero-Waste Stainless Tumbler", score: 90, reason: "Environmentally friendly" },
        ]
      }
    },
    {
      query: "comfortable office chair",
      keyword: {
        results: [
          { name: "Chair Mat", match: false, reason: "Has 'chair'" },
          { name: "Office Desk", match: false, reason: "Has 'office'" },
        ],
        missed: "Ergonomic Executive, Herman Miller Aeron, Lumbar Support Seating"
      },
      semantic: {
        results: [
          { name: "Herman Miller Aeron", score: 97, reason: "Premium ergonomic" },
          { name: "ErgoChair Pro+", score: 94, reason: "Ergonomic design" },
          { name: "Secretlab Titan Evo", score: 91, reason: "Comfort-focused" },
        ]
      }
    }
  ];

  return (
    <div className="my-16">
      <h3 className="text-2xl font-bold text-foreground mb-6 text-center">
        Real-World Examples
      </h3>
      
      <div className="flex gap-2 mb-6 justify-center flex-wrap">
        {examples.map((ex, i) => (
          <button
            key={i}
            onClick={() => setActiveExample(i)}
            className={`px-4 py-2 rounded-lg text-sm transition-all ${
              activeExample === i
                ? "bg-primary/20 border-2 border-primary/50 text-primary"
                : "bg-muted/30 border border-border/50 text-muted-foreground"
            }`}
          >
            "{ex.query}"
          </button>
        ))}
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Keyword Results */}
        <div className="p-6 rounded-xl bg-red-500/5 border border-red-500/30">
          <h4 className="font-bold text-red-400 mb-4 flex items-center gap-2">
            <XCircle className="h-5 w-5" />
            Keyword Search Results
          </h4>
          <div className="space-y-3">
            {examples[activeExample].keyword.results.map((r, i) => (
              <div key={i} className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                <p className="font-medium text-foreground">{r.name}</p>
                <p className="text-xs text-red-400">{r.reason}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 rounded-lg bg-muted/30 border border-border/30">
            <p className="text-xs text-muted-foreground">
              <span className="text-red-400 font-semibold">Missed:</span> {examples[activeExample].keyword.missed}
            </p>
          </div>
        </div>
        
        {/* Semantic Results */}
        <div className="p-6 rounded-xl bg-green-500/5 border border-green-500/30">
          <h4 className="font-bold text-green-400 mb-4 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5" />
            Semantic Search Results
          </h4>
          <div className="space-y-3">
            {examples[activeExample].semantic.results.map((r, i) => (
              <div key={i} className="p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-foreground">{r.name}</p>
                    <p className="text-xs text-muted-foreground">{r.reason}</p>
                  </div>
                  <span className="text-green-400 font-bold">{r.score}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// The Simple Code
const SimpleCode = () => {
  return (
    <div className="my-16">
      <h3 className="text-2xl font-bold text-foreground mb-6 text-center">
        Making It Happen: Surprisingly Simple
      </h3>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="p-6 rounded-xl bg-card border border-border/50">
          <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <Search className="h-5 w-5 text-blue-400" />
            @AISearchable = In the Embedding
          </h4>
          <CodeBlock code={`// "running shoes" can find this product
// even if it's called "Athletic Footwear"

@AISearchable
private String name;

@AISearchable  
private String description;

@AISearchable
private String category;`} />
          <p className="text-sm text-muted-foreground mt-2">
            Text with semantic meaning → embedded for similarity search
          </p>
        </div>
        
        <div className="p-6 rounded-xl bg-card border border-border/50">
          <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-green-400" />
            @AIContext = AI Knows This
          </h4>
          <CodeBlock code={`// Not embedded, but AI can use this info
// to answer: "How much does it cost?"

@AIContext
private BigDecimal price;

@AIContext
private Boolean inStock;

@AIContext
private Double rating;`} />
          <p className="text-sm text-muted-foreground mt-2">
            Structured data → stored as metadata for LLM context
          </p>
        </div>
      </div>
    </div>
  );
};

// Why It Matters
const WhyItMatters = () => {
  const stats = [
    { keyword: "47%", semantic: "8%", label: "Zero-Result Searches", improvement: "-83%" },
    { keyword: "2.3%", semantic: "5.1%", label: "Search → Purchase", improvement: "+122%" },
    { keyword: "34%", semantic: "87%", label: "First-Result Relevance", improvement: "+156%" },
    { keyword: "4.2", semantic: "1.8", label: "Searches to Find", improvement: "-57%" },
  ];

  return (
    <div className="my-16 p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 border border-border/50">
      <h3 className="text-xl font-bold text-foreground mb-6 text-center">
        The Numbers Tell the Story
      </h3>
      
      <div className="grid md:grid-cols-2 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            viewport={{ once: true }}
            className="p-4 rounded-xl bg-card border border-border/50"
          >
            <p className="text-sm text-muted-foreground mb-3">{stat.label}</p>
            <div className="flex items-center justify-between">
              <div className="text-center">
                <p className="text-xl font-bold text-red-400 line-through opacity-60">{stat.keyword}</p>
                <p className="text-xs text-muted-foreground">Keyword</p>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground" />
              <div className="text-center">
                <p className="text-xl font-bold text-green-400">{stat.semantic}</p>
                <p className="text-xs text-muted-foreground">Semantic</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-primary">{stat.improvement}</p>
                <p className="text-xs text-muted-foreground">Impact</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const AIAnnotationsSemanticSearchStory = () => {
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
                  <Brain className="h-4 w-4" />
                  Semantic Search
                </span>
                <div className="flex items-center gap-3">
                  <StoryLoveButton storySlug="ai-annotations-semantic-search" />
                  <PageViewCounter />
                </div>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
                Semantic Search That{" "}
                <span className="text-gradient">Actually Works</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mb-8">
                When "running shoes" finds "athletic footwear"—the fundamental difference between matching strings and understanding meaning.
              </p>
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 border border-border/50">
                  <Target className="h-4 w-4 text-green-400" />
                  87% Relevance
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 border border-border/50">
                  <TrendingUp className="h-4 w-4 text-blue-400" />
                  +122% Conversion
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 border border-border/50">
                  <Sparkles className="h-4 w-4 text-amber-400" />
                  -83% Zero Results
                </div>
              </div>
            </div>
          </section>

          {/* The Problem */}
          <section className="mb-12 p-8 rounded-2xl bg-red-500/5 border border-red-500/30">
            <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-3">
              <Equal className="h-6 w-6 text-red-400" />
              The Problem with "Equals"
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-4 rounded-lg bg-muted/30 border border-border/30">
                <p className="font-mono text-red-400 mb-2">Keyword Search Logic:</p>
                <CodeBlock language="sql" code={`SELECT * FROM products 
WHERE name LIKE '%running%' 
   OR name LIKE '%shoes%'

-- "Athletic Footwear"? 
-- Not found. No match.`} />
              </div>
              <div className="space-y-3">
                <p className="text-muted-foreground">
                  <strong className="text-foreground">The fundamental flaw:</strong> Keyword search treats language as strings, not meaning.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-red-400" />
                    "running shoes" ≠ "athletic footwear"
                  </li>
                  <li className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-red-400" />
                    "eco-friendly" ≠ "sustainable"
                  </li>
                  <li className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-red-400" />
                    "comfortable" ≠ "ergonomic"
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Search Visualization */}
          <SearchVisualization />

          {/* Embedding Visualization */}
          <EmbeddingVisualization />

          {/* Live Examples */}
          <LiveExamples />

          {/* The Simple Code */}
          <SimpleCode />

          {/* Why It Matters */}
          <WhyItMatters />

          {/* The Mental Model */}
          <section className="mb-12 p-8 rounded-2xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-border/50">
            <h3 className="text-xl font-bold text-foreground mb-6 text-center">
              🧠 The Mental Model
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-center">
                <Diff className="h-8 w-8 text-red-400 mx-auto mb-3" />
                <p className="font-bold text-foreground mb-2">Keyword Search</p>
                <p className="text-sm text-muted-foreground">"Do these characters match?"</p>
                <p className="text-xs text-red-400 mt-2">String comparison</p>
              </div>
              <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30 text-center">
                <Waves className="h-8 w-8 text-green-400 mx-auto mb-3" />
                <p className="font-bold text-foreground mb-2">Semantic Search</p>
                <p className="text-sm text-muted-foreground">"Do these ideas relate?"</p>
                <p className="text-xs text-green-400 mt-2">Meaning comparison</p>
              </div>
            </div>
          </section>

          {/* The Revelation */}
          <section className="mb-16 p-8 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/5 border border-primary/20 text-center">
            <Brain className="h-16 w-16 text-primary mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-foreground mb-4">The Eureka Moment</h3>
            <div className="max-w-2xl mx-auto space-y-4 text-muted-foreground">
              <p className="text-lg">
                "For years, we optimized string matching algorithms."
              </p>
              <p className="text-lg">
                "We built synonym dictionaries. Stemming rules. Fuzzy matchers."
              </p>
              <p className="text-lg">
                "<span className="text-primary font-semibold">Then we realized: we were solving the wrong problem.</span>"
              </p>
              <p className="text-lg">
                "Users don't search for strings. They search for meaning."
              </p>
              <p className="text-lg">
                "Now we embed meaning. And everything just... works."
              </p>
            </div>
          </section>

          {/* Story Navigation */}
          <StoryNavigation className="mt-12" />

          {/* Footer */}
          <footer className="border-t border-border/50 pt-12 mt-12 flex flex-col items-center gap-6">
            <div className="flex items-center gap-4">
              <StoryLoveButton storySlug="ai-annotations-semantic-search" />
              <PageViewCounter />
            </div>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link 
                to="/docs/ai-annotations-ecommerce" 
                className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
              >
                <Zap className="h-4 w-4" />
                E-Commerce Story
              </Link>
              <Link 
                to="/docs/ai-annotations-developer-guide" 
                className="inline-flex items-center gap-2 px-6 py-2 rounded-full border border-border bg-card text-foreground font-medium hover:bg-muted transition-colors"
              >
                Developer Guide
              </Link>
            </div>
            <p className="text-xs text-muted-foreground text-center max-w-md">
              Part of the AI Annotations Story Series — Semantic Search That Works
            </p>
          </footer>
        </motion.article>
      </div>
    </DocsLayout>
  );
};

export default AIAnnotationsSemanticSearchStory;
