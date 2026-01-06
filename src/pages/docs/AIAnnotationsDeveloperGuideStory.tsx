import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Highlight, themes } from "prism-react-renderer";
import DocsLayout from "@/components/docs/DocsLayout";
import PageViewCounter from "@/components/PageViewCounter";
import StoryLoveButton from "@/components/StoryLoveButton";
import StoryNavigation from "@/components/StoryNavigation";
import { 
  Code,
  Terminal,
  CheckCircle2,
  XCircle,
  Zap,
  Search,
  Tag,
  Package,
  FileCode,
  Play,
  Copy,
  Book,
  Lightbulb,
  ArrowRight,
  Clock,
  Database
} from "lucide-react";

const PAGE_TITLE = "The Developer's Deep Dive: Mastering AI Annotations in 15 Minutes";
const PAGE_DESCRIPTION = "Everything you need to implement semantic search—code examples, gotchas, and patterns that actually work.";

const codeTheme = {
  ...themes.nightOwl,
  plain: {
    ...themes.nightOwl.plain,
    backgroundColor: "hsl(var(--code-bg))",
  },
};

const CodeBlock = ({ code, language = "java", title }: { code: string; language?: string; title?: string }) => {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(code.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative my-4">
      {title && (
        <div className="flex items-center justify-between px-4 py-2 bg-muted/50 border border-b-0 border-border/50 rounded-t-lg">
          <span className="text-xs font-mono text-muted-foreground">{title}</span>
          <button 
            onClick={handleCopy}
            className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
          >
            {copied ? <CheckCircle2 className="h-3 w-3 text-green-400" /> : <Copy className="h-3 w-3" />}
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      )}
      <Highlight theme={codeTheme} code={code.trim()} language={language}>
        {({ style, tokens, getLineProps, getTokenProps }) => (
          <pre
            className={`overflow-x-auto border border-border/50 p-4 text-sm ${title ? 'rounded-b-lg' : 'rounded-lg'}`}
            style={style}
          >
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line })}>
                <span className="text-muted-foreground/50 select-none mr-4 text-xs w-4 inline-block text-right">
                  {i + 1}
                </span>
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token })} />
                ))}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </div>
  );
};

// Interactive Annotation Explorer
const AnnotationExplorer = () => {
  const [activeTab, setActiveTab] = useState(0);
  
  const tabs = [
    {
      name: "@AICapable",
      target: "Class",
      icon: Package,
      color: "text-purple-400",
      description: "Declares an entity as AI-enabled. Required for all other annotations to work.",
      attributes: [
        { name: "entityType", type: "String", required: true, desc: "Unique identifier in AI system" },
        { name: "indexingStrategy", type: "IndexingStrategy", required: false, desc: "Default: ASYNC" },
        { name: "onCreateStrategy", type: "IndexingStrategy", required: false, desc: "Override for creates" },
        { name: "onUpdateStrategy", type: "IndexingStrategy", required: false, desc: "Override for updates" },
        { name: "onDeleteStrategy", type: "IndexingStrategy", required: false, desc: "Override for deletes" },
      ],
      code: `@Entity
@AICapable(entityType = "product")  // Minimal
public class Product { }

// Or with full control:
@AICapable(
    entityType = "product",
    indexingStrategy = IndexingStrategy.ASYNC,
    onCreateStrategy = IndexingStrategy.SYNC,  // Immediate
    onDeleteStrategy = IndexingStrategy.SYNC   // Immediate
)
public class Product { }`
    },
    {
      name: "@AISearchable",
      target: "Field",
      icon: Search,
      color: "text-blue-400",
      description: "Users can FIND this entity by searching for similar meaning. Included in embeddings.",
      attributes: [],
      whatHappens: [
        "✓ Included in embedding vector (for similarity search)",
        "✓ Stored in searchableContent",
        "✓ Included in LLM context during RAG"
      ],
      code: `@Entity
@AICapable(entityType = "product")
public class Product {
    
    @AISearchable   // "bluetooth speakers" finds "wireless audio"
    private String name;
    
    @AISearchable   // "eco-friendly" finds "sustainable"
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @AISearchable   // "electronics" finds in category
    private String category;
}`
    },
    {
      name: "@AIContext",
      target: "Field",
      icon: Tag,
      color: "text-green-400",
      description: "AI needs to KNOW this value when responding. NOT embedded, stored as metadata.",
      attributes: [],
      whatHappens: [
        "✗ NOT included in embedding vector",
        "✓ Stored in metadata JSON",
        "✓ Included in LLM context during RAG"
      ],
      code: `@Entity
@AICapable(entityType = "product")
public class Product {
    
    @AIContext      // AI can answer: "How much?"
    private BigDecimal price;
    
    @AIContext      // AI can answer: "Is it in stock?"
    private Boolean inStock;
    
    @AIContext      // AI can answer: "What's the rating?"
    private Double rating;
    
    @AIContext      // AI can filter by brand
    private String brand;
}`
    },
    {
      name: "@AIProcess",
      target: "Method",
      icon: Zap,
      color: "text-amber-400",
      description: "Triggers AI processing when the method executes. Like @Transactional for AI.",
      attributes: [
        { name: "entityType", type: "String", required: false, desc: "Can infer from return type" },
        { name: "processType", type: "String", required: true, desc: '"create", "update", "delete"' },
        { name: "generateEmbedding", type: "boolean", required: false, desc: "Default: true" },
        { name: "indexForSearch", type: "boolean", required: false, desc: "Default: true" },
        { name: "indexingStrategy", type: "IndexingStrategy", required: false, desc: "Override strategy" },
      ],
      code: `@Service
public class ProductService {
    
    @AIProcess(entityType = "product", processType = "create")
    @Transactional
    public Product create(Product product) {
        return repository.save(product);
    }
    
    @AIProcess(entityType = "product", processType = "delete",
               generateEmbedding = false)  // No embedding needed
    @Transactional
    public void delete(Long id) {
        repository.deleteById(id);
    }
}`
    }
  ];

  return (
    <div className="my-12">
      <h3 className="text-2xl font-bold text-foreground mb-6 text-center">
        Interactive Annotation Explorer
      </h3>
      
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {tabs.map((tab, i) => (
          <button
            key={i}
            onClick={() => setActiveTab(i)}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl font-semibold transition-all whitespace-nowrap ${
              activeTab === i
                ? `bg-card border-2 ${tab.color.replace('text-', 'border-')} shadow-lg`
                : "bg-muted/30 border border-border/50 text-muted-foreground hover:border-border"
            }`}
          >
            <tab.icon className={`h-4 w-4 ${activeTab === i ? tab.color : ''}`} />
            <span className={activeTab === i ? tab.color : ''}>{tab.name}</span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-muted/50">{tab.target}</span>
          </button>
        ))}
      </div>
      
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="p-6 rounded-xl bg-card border border-border/50"
        >
          <div className="flex items-start gap-4 mb-6">
            {React.createElement(tabs[activeTab].icon, {
              className: `h-8 w-8 ${tabs[activeTab].color} shrink-0`
            })}
            <div>
              <h4 className={`text-xl font-bold ${tabs[activeTab].color}`}>{tabs[activeTab].name}</h4>
              <p className="text-sm text-muted-foreground mt-1">{tabs[activeTab].description}</p>
            </div>
          </div>
          
          {tabs[activeTab].attributes && tabs[activeTab].attributes.length > 0 && (
            <div className="mb-6">
              <h5 className="font-semibold text-foreground mb-3">Attributes</h5>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border/50">
                      <th className="text-left py-2 text-muted-foreground font-medium">Name</th>
                      <th className="text-left py-2 text-muted-foreground font-medium">Type</th>
                      <th className="text-left py-2 text-muted-foreground font-medium">Required</th>
                      <th className="text-left py-2 text-muted-foreground font-medium">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tabs[activeTab].attributes.map((attr, i) => (
                      <tr key={i} className="border-b border-border/30">
                        <td className="py-2 font-mono text-primary">{attr.name}</td>
                        <td className="py-2 font-mono text-muted-foreground">{attr.type}</td>
                        <td className="py-2">
                          {attr.required ? (
                            <span className="text-amber-400">Yes</span>
                          ) : (
                            <span className="text-muted-foreground">No</span>
                          )}
                        </td>
                        <td className="py-2 text-muted-foreground">{attr.desc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          {tabs[activeTab].whatHappens && (
            <div className="mb-6">
              <h5 className="font-semibold text-foreground mb-3">What Happens</h5>
              <ul className="space-y-2">
                {tabs[activeTab].whatHappens.map((item, i) => (
                  <li key={i} className={`text-sm flex items-center gap-2 ${
                    item.startsWith('✓') ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          <CodeBlock code={tabs[activeTab].code} title="Usage Example" />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

// Decision Tree
const DecisionTree = () => {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  
  const getRecommendation = () => {
    if (answers.inAI === "no") return { annotation: "None", reason: "Internal field - not needed in AI system" };
    if (answers.searchable === "yes") return { annotation: "@AISearchable", reason: "Users can find by meaning" };
    if (answers.needsKnow === "yes") return { annotation: "@AIContext", reason: "AI needs for responses" };
    return { annotation: "None", reason: "Not needed" };
  };

  return (
    <div className="my-12 p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 border border-border/50">
      <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
        <Lightbulb className="h-5 w-5 text-amber-400" />
        Which Annotation Should I Use?
      </h3>
      
      <div className="space-y-6">
        <div className="p-4 rounded-lg bg-card border border-border/50">
          <p className="font-semibold text-foreground mb-3">
            Q1: Should this field be in the AI system at all?
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setAnswers({ ...answers, inAI: "yes" })}
              className={`px-4 py-2 rounded-lg transition-all ${
                answers.inAI === "yes"
                  ? "bg-green-500/20 border-2 border-green-500/50 text-green-400"
                  : "bg-muted/30 border border-border/50 text-muted-foreground"
              }`}
            >
              Yes
            </button>
            <button
              onClick={() => setAnswers({ inAI: "no" })}
              className={`px-4 py-2 rounded-lg transition-all ${
                answers.inAI === "no"
                  ? "bg-red-500/20 border-2 border-red-500/50 text-red-400"
                  : "bg-muted/30 border border-border/50 text-muted-foreground"
              }`}
            >
              No (internal/sensitive)
            </button>
          </div>
        </div>
        
        {answers.inAI === "yes" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-lg bg-card border border-border/50"
          >
            <p className="font-semibold text-foreground mb-3">
              Q2: Can users SEARCH by this field's meaning?
            </p>
            <p className="text-sm text-muted-foreground mb-3">
              "comfortable chair" should find "ergonomic seating"
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setAnswers({ ...answers, searchable: "yes" })}
                className={`px-4 py-2 rounded-lg transition-all ${
                  answers.searchable === "yes"
                    ? "bg-blue-500/20 border-2 border-blue-500/50 text-blue-400"
                    : "bg-muted/30 border border-border/50 text-muted-foreground"
                }`}
              >
                Yes (text with meaning)
              </button>
              <button
                onClick={() => setAnswers({ ...answers, searchable: "no" })}
                className={`px-4 py-2 rounded-lg transition-all ${
                  answers.searchable === "no"
                    ? "bg-muted/50 border-2 border-border text-foreground"
                    : "bg-muted/30 border border-border/50 text-muted-foreground"
                }`}
              >
                No (structured data)
              </button>
            </div>
          </motion.div>
        )}
        
        {answers.inAI === "yes" && answers.searchable === "no" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-lg bg-card border border-border/50"
          >
            <p className="font-semibold text-foreground mb-3">
              Q3: Does AI need to KNOW this value when responding?
            </p>
            <p className="text-sm text-muted-foreground mb-3">
              "How much does it cost?" → AI needs to know the price
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setAnswers({ ...answers, needsKnow: "yes" })}
                className={`px-4 py-2 rounded-lg transition-all ${
                  answers.needsKnow === "yes"
                    ? "bg-green-500/20 border-2 border-green-500/50 text-green-400"
                    : "bg-muted/30 border border-border/50 text-muted-foreground"
                }`}
              >
                Yes
              </button>
              <button
                onClick={() => setAnswers({ ...answers, needsKnow: "no" })}
                className={`px-4 py-2 rounded-lg transition-all ${
                  answers.needsKnow === "no"
                    ? "bg-red-500/20 border-2 border-red-500/50 text-red-400"
                    : "bg-muted/30 border border-border/50 text-muted-foreground"
                }`}
              >
                No
              </button>
            </div>
          </motion.div>
        )}
        
        {(answers.inAI === "no" || answers.searchable === "yes" || answers.needsKnow) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`p-6 rounded-xl ${
              getRecommendation().annotation === "None" 
                ? "bg-muted/30 border border-border/50" 
                : getRecommendation().annotation === "@AISearchable"
                  ? "bg-blue-500/10 border-2 border-blue-500/30"
                  : "bg-green-500/10 border-2 border-green-500/30"
            }`}
          >
            <p className="text-sm text-muted-foreground mb-2">Recommendation:</p>
            <p className={`text-2xl font-bold font-mono ${
              getRecommendation().annotation === "@AISearchable" ? "text-blue-400" :
              getRecommendation().annotation === "@AIContext" ? "text-green-400" :
              "text-muted-foreground"
            }`}>
              {getRecommendation().annotation}
            </p>
            <p className="text-sm text-muted-foreground mt-2">{getRecommendation().reason}</p>
          </motion.div>
        )}
        
        <button
          onClick={() => setAnswers({})}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Reset →
        </button>
      </div>
    </div>
  );
};

// Common Patterns
const CommonPatterns = () => {
  const [activePattern, setActivePattern] = useState(0);
  
  const patterns = [
    {
      name: "E-Commerce Product",
      code: `@Entity
@AICapable(entityType = "product")
public class Product {
    @Id private Long id;
    
    // Searchable content
    @AISearchable private String name;
    @AISearchable private String description;
    @AISearchable private String category;
    
    // Contextual metadata
    @AIContext private BigDecimal price;
    @AIContext private Double rating;
    @AIContext private Boolean inStock;
    @AIContext private String brand;
    
    // Internal only
    private String sku;
    private BigDecimal costPrice;  // Sensitive!
}`
    },
    {
      name: "Support Ticket",
      code: `@Entity
@AICapable(entityType = "support-ticket")
public class SupportTicket {
    @Id private Long id;
    
    // Searchable (find similar issues)
    @AISearchable private String subject;
    @AISearchable private String issueDescription;
    @AISearchable private String resolution;  // GOLD!
    
    // Context (AI knows for responses)
    @AIContext private String status;
    @AIContext private String priority;
    @AIContext private Duration resolutionTime;
    
    // NEVER in AI (privacy)
    private String customerId;
    private String customerEmail;
}`
    },
    {
      name: "Knowledge Article",
      code: `@Entity
@AICapable(
    entityType = "kb-article",
    onCreateStrategy = IndexingStrategy.SYNC  // Immediate
)
public class KnowledgeBaseArticle {
    @Id private Long id;
    
    @AISearchable private String title;
    @AISearchable private String content;
    @AISearchable private String problemDescription;
    @AISearchable private String solution;
    
    @AIContext private Double helpfulnessRating;
    @AIContext private Integer viewCount;
    @AIContext private String category;
    @AIContext private LocalDateTime lastUpdated;
    
    private String internalNotes;  // Internal
}`
    }
  ];

  return (
    <div className="my-12">
      <h3 className="text-2xl font-bold text-foreground mb-6 text-center">
        Common Patterns
      </h3>
      
      <div className="flex gap-2 mb-4">
        {patterns.map((p, i) => (
          <button
            key={i}
            onClick={() => setActivePattern(i)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              activePattern === i
                ? "bg-primary/20 border-2 border-primary/50 text-primary"
                : "bg-muted/30 border border-border/50 text-muted-foreground"
            }`}
          >
            {p.name}
          </button>
        ))}
      </div>
      
      <CodeBlock code={patterns[activePattern].code} title={patterns[activePattern].name} />
    </div>
  );
};

// Gotchas Section
const GotchasSection = () => {
  return (
    <div className="my-12 grid md:grid-cols-2 gap-6">
      <div className="p-6 rounded-xl bg-green-500/5 border border-green-500/30">
        <h4 className="font-bold text-green-400 mb-4 flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5" />
          DO ✅
        </h4>
        <ul className="space-y-3 text-sm">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-400 mt-0.5 shrink-0" />
            <span className="text-muted-foreground">Always specify <code className="text-green-400">entityType</code></span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-400 mt-0.5 shrink-0" />
            <span className="text-muted-foreground">Use <code className="text-green-400">@AISearchable</code> for text with semantic meaning</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-400 mt-0.5 shrink-0" />
            <span className="text-muted-foreground">Use <code className="text-green-400">@AIContext</code> for structured data</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-400 mt-0.5 shrink-0" />
            <span className="text-muted-foreground">Disable embedding on delete operations</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-400 mt-0.5 shrink-0" />
            <span className="text-muted-foreground">Use BATCH for bulk imports</span>
          </li>
        </ul>
      </div>
      
      <div className="p-6 rounded-xl bg-red-500/5 border border-red-500/30">
        <h4 className="font-bold text-red-400 mb-4 flex items-center gap-2">
          <XCircle className="h-5 w-5" />
          DON'T ❌
        </h4>
        <ul className="space-y-3 text-sm">
          <li className="flex items-start gap-2">
            <XCircle className="h-4 w-4 text-red-400 mt-0.5 shrink-0" />
            <span className="text-muted-foreground">Don't forget <code className="text-red-400">entityType</code> (won't work!)</span>
          </li>
          <li className="flex items-start gap-2">
            <XCircle className="h-4 w-4 text-red-400 mt-0.5 shrink-0" />
            <span className="text-muted-foreground">Don't use <code className="text-red-400">@AISearchable</code> for numbers (use @AIContext)</span>
          </li>
          <li className="flex items-start gap-2">
            <XCircle className="h-4 w-4 text-red-400 mt-0.5 shrink-0" />
            <span className="text-muted-foreground">Don't annotate sensitive fields (PII, internal)</span>
          </li>
          <li className="flex items-start gap-2">
            <XCircle className="h-4 w-4 text-red-400 mt-0.5 shrink-0" />
            <span className="text-muted-foreground">Don't use SYNC everywhere (performance!)</span>
          </li>
          <li className="flex items-start gap-2">
            <XCircle className="h-4 w-4 text-red-400 mt-0.5 shrink-0" />
            <span className="text-muted-foreground">Don't put <code className="text-red-400">@AIProcess</code> on classes (methods only!)</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

const AIAnnotationsDeveloperGuideStory = () => {
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
                  <Code className="h-4 w-4" />
                  Developer Guide
                </span>
                <div className="flex items-center gap-3">
                  <StoryLoveButton storySlug="ai-annotations-developer-guide" />
                  <PageViewCounter />
                </div>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
                The Developer's{" "}
                <span className="text-gradient">Deep Dive</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mb-8">
                Everything you need to implement semantic search in 15 minutes—code examples, gotchas, and the patterns that actually work.
              </p>
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 border border-border/50">
                  <Clock className="h-4 w-4 text-green-400" />
                  15 min read
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 border border-border/50">
                  <Terminal className="h-4 w-4 text-blue-400" />
                  Code Examples
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 border border-border/50">
                  <FileCode className="h-4 w-4 text-amber-400" />
                  Copy-Paste Ready
                </div>
              </div>
            </div>
          </section>

          {/* TL;DR */}
          <section className="mb-12 p-6 rounded-xl bg-primary/5 border border-primary/20">
            <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              TL;DR for Impatient Developers
            </h2>
            <CodeBlock code={`@Entity
@AICapable(entityType = "product")
public class Product {
    
    @AISearchable   // Users can FIND by this (embedded, searchable)
    private String name;
    
    @AISearchable   // Rich text? AI finds by meaning
    private String description;
    
    @AIContext      // AI KNOWS this (metadata, not embedded)
    private BigDecimal price;
}

@AIProcess(entityType = "product", processType = "create")
public Product create(Product p) {
    return repo.save(p);
    // Done. Framework handles embedding, vector DB, retries.
}`} />
          </section>

          {/* Interactive Explorer */}
          <AnnotationExplorer />

          {/* Decision Tree */}
          <DecisionTree />

          {/* Common Patterns */}
          <CommonPatterns />

          {/* Gotchas */}
          <GotchasSection />

          {/* Cheat Sheet */}
          <section className="mb-12 p-8 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/5 border border-primary/20">
            <h3 className="text-xl font-bold text-foreground mb-6 text-center">
              Quick Reference Cheat Sheet
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-4 rounded-lg bg-card border border-border/50">
                <h4 className="font-semibold text-foreground mb-3">Question → Annotation</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">Can users find by meaning?</span>
                    <span className="text-blue-400 font-mono">@AISearchable</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">Does AI need to know?</span>
                    <span className="text-green-400 font-mono">@AIContext</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">Both?</span>
                    <span className="text-blue-400 font-mono">@AISearchable</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">Neither?</span>
                    <span className="text-muted-foreground">Don't annotate</span>
                  </li>
                </ul>
              </div>
              <div className="p-4 rounded-lg bg-card border border-border/50">
                <h4 className="font-semibold text-foreground mb-3">Field Type → Annotation</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">name, description</span>
                    <span className="text-blue-400 font-mono">@AISearchable</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">price, rating</span>
                    <span className="text-green-400 font-mono">@AIContext</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-muted-foreground">sku, internalNotes</span>
                    <span className="text-muted-foreground">(none)</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Story Navigation */}
          <StoryNavigation className="mt-12" />

          {/* Footer */}
          <footer className="border-t border-border/50 pt-12 mt-12 flex flex-col items-center gap-6">
            <div className="flex items-center gap-4">
              <StoryLoveButton storySlug="ai-annotations-developer-guide" />
              <PageViewCounter />
            </div>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link 
                to="/docs/ai-annotations-architect" 
                className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
              >
                Architect's Guide →
              </Link>
              <Link 
                to="/docs/ai-annotations-killing-boilerplate" 
                className="inline-flex items-center gap-2 px-6 py-2 rounded-full border border-border bg-card text-foreground font-medium hover:bg-muted transition-colors"
              >
                Killing Boilerplate
              </Link>
            </div>
            <p className="text-xs text-muted-foreground text-center max-w-md">
              Part of the AI Annotations Story Series — Developer Deep Dive
            </p>
          </footer>
        </motion.article>
      </div>
    </DocsLayout>
  );
};

export default AIAnnotationsDeveloperGuideStory;
