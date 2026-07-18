import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Highlight, themes } from "prism-react-renderer";
import DocsLayout from "@/components/docs/DocsLayout";
import PageViewCounter from "@/components/PageViewCounter";
import StoryLoveButton from "@/components/StoryLoveButton";
import StoryNavigation from "@/components/StoryNavigation";
import { 
  Database, 
  Layers, 
  Table2, 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  Server,
  HardDrive,
  Scale,
  Boxes,
  Building2,
  Users,
  Shield,
  TrendingUp,
  ChevronDown,
  Zap,
  Settings2,
  GitBranch
} from "lucide-react";
import storageStoryContent from "@/content/storage-strategy-story.md?raw";

const PAGE_TITLE = "The Storage Dilemma - AI Fabric Framework";
const PAGE_DESCRIPTION = "One Table vs Many Tables: How we built a flexible metadata storage system that auto-creates tables and adapts to your database.";
const OG_IMAGE = "/assets/story-preview.png";

const codeTheme = {
  ...themes.nightOwl,
  plain: {
    ...themes.nightOwl.plain,
    backgroundColor: "hsl(var(--code-bg))",
  },
};

const CodeBlock = ({ children, className }: { children: string; className?: string }) => {
  const match = /language-(\w+)/.exec(className || "");
  const language = match ? match[1] : "text";

  return (
    <Highlight theme={codeTheme} code={children.trim()} language={language}>
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
};

// Interactive Strategy Comparison Card
const StrategyCard = ({ 
  strategy, 
  icon: Icon, 
  color, 
  example, 
  description, 
  pros, 
  cons, 
  bestFor,
  isExpanded,
  onToggle
}: {
  strategy: string;
  icon: any;
  color: string;
  example: string;
  description: string;
  pros: string[];
  cons: string[];
  bestFor: string[];
  isExpanded: boolean;
  onToggle: () => void;
}) => (
  <motion.div 
    layout
    className={`rounded-xl border-2 ${color} bg-card overflow-hidden cursor-pointer`}
    onClick={onToggle}
    whileHover={{ scale: 1.01 }}
  >
    <div className="p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-lg bg-gradient-to-br ${color.replace('border-', 'from-')}/20 to-transparent`}>
            <Icon className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-foreground">{strategy}</h3>
            <p className="text-sm text-muted-foreground font-mono">{example}</p>
          </div>
        </div>
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="h-5 w-5 text-muted-foreground" />
        </motion.div>
      </div>
      <p className="mt-3 text-muted-foreground">{description}</p>
    </div>
    
    <AnimatePresence>
      {isExpanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          className="border-t border-border/50"
        >
          <div className="p-6 grid md:grid-cols-3 gap-4">
            <div>
              <h4 className="font-semibold text-green-400 flex items-center gap-2 mb-2">
                <CheckCircle2 className="h-4 w-4" /> Pros
              </h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                {pros.map((pro, i) => <li key={i}>• {pro}</li>)}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-red-400 flex items-center gap-2 mb-2">
                <XCircle className="h-4 w-4" /> Cons
              </h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                {cons.map((con, i) => <li key={i}>• {con}</li>)}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-primary flex items-center gap-2 mb-2">
                <Zap className="h-4 w-4" /> Best For
              </h4>
              <ul className="space-y-1 text-sm text-muted-foreground">
                {bestFor.map((bf, i) => <li key={i}>• {bf}</li>)}
              </ul>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </motion.div>
);

// Animated Storage Flow Diagram
const StorageFlowDiagram = () => {
  const [activeStep, setActiveStep] = useState(0);
  
  const steps = [
    { label: "Entity Saved", icon: Database, color: "bg-blue-500" },
    { label: "AICapable Intercept", icon: Zap, color: "bg-purple-500" },
    { label: "Strategy Resolver", icon: Settings2, color: "bg-amber-500" },
    { label: "Storage Strategy", icon: GitBranch, color: "bg-green-500" },
    { label: "Table Created/Used", icon: Table2, color: "bg-primary" },
  ];
  
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="my-8 p-6 rounded-xl bg-card border border-border/50">
      <h3 className="text-lg font-bold text-foreground mb-6 text-center">Storage Pipeline Flow</h3>
      <div className="flex flex-wrap justify-center items-center gap-2 md:gap-4">
        {steps.map((step, i) => (
          <div key={i} className="flex items-center gap-2 md:gap-4">
            <motion.div
              animate={{
                scale: activeStep === i ? 1.1 : 1,
                opacity: activeStep >= i ? 1 : 0.4,
              }}
              className={`flex flex-col items-center gap-2 p-3 rounded-lg ${activeStep === i ? 'bg-primary/20' : 'bg-muted/30'}`}
            >
              <div className={`p-2 rounded-full ${step.color}`}>
                <step.icon className="h-4 w-4 text-white" />
              </div>
              <span className="text-xs text-center text-muted-foreground max-w-[80px]">{step.label}</span>
            </motion.div>
            {i < steps.length - 1 && (
              <motion.div
                animate={{ opacity: activeStep > i ? 1 : 0.3 }}
              >
                <ArrowRight className="h-4 w-4 text-muted-foreground hidden md:block" />
              </motion.div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Table Structure Visual
const TableStructureVisual = () => (
  <div className="my-8 grid md:grid-cols-2 gap-6">
    {/* Single Table */}
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className="p-6 rounded-xl bg-card border-2 border-blue-500/50"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-blue-500/20">
          <Table2 className="h-5 w-5 text-blue-400" />
        </div>
        <h3 className="text-lg font-bold text-foreground">SINGLE_TABLE</h3>
      </div>
      <div className="bg-muted/30 rounded-lg p-4 font-mono text-sm">
        <div className="text-muted-foreground mb-2">ai_searchable_entities</div>
        <div className="space-y-1 text-xs">
          <div className="flex gap-4 py-1 border-b border-border/30">
            <span className="text-blue-400 w-24">entity_type</span>
            <span className="text-muted-foreground">entity_id</span>
          </div>
          <div className="flex gap-4 py-1">
            <span className="text-amber-400 w-24">product</span>
            <span className="text-muted-foreground">prod-1</span>
          </div>
          <div className="flex gap-4 py-1">
            <span className="text-green-400 w-24">user</span>
            <span className="text-muted-foreground">user-1</span>
          </div>
          <div className="flex gap-4 py-1">
            <span className="text-purple-400 w-24">order</span>
            <span className="text-muted-foreground">order-1</span>
          </div>
        </div>
      </div>
      <p className="mt-4 text-sm text-muted-foreground">All entity types in ONE table, distinguished by entity_type column</p>
    </motion.div>

    {/* Per-Type Table */}
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className="p-6 rounded-xl bg-card border-2 border-green-500/50"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-green-500/20">
          <Boxes className="h-5 w-5 text-green-400" />
        </div>
        <h3 className="text-lg font-bold text-foreground">PER_TYPE_TABLE</h3>
      </div>
      <div className="space-y-3">
        <div className="bg-muted/30 rounded-lg p-3 font-mono text-xs">
          <div className="text-amber-400 mb-1">ai_searchable_product</div>
          <div className="text-muted-foreground">prod-1, prod-2, prod-3...</div>
        </div>
        <div className="bg-muted/30 rounded-lg p-3 font-mono text-xs">
          <div className="text-green-400 mb-1">ai_searchable_user</div>
          <div className="text-muted-foreground">user-1, user-2, user-3...</div>
        </div>
        <div className="bg-muted/30 rounded-lg p-3 font-mono text-xs">
          <div className="text-purple-400 mb-1">ai_searchable_order</div>
          <div className="text-muted-foreground">order-1, order-2, order-3...</div>
        </div>
      </div>
      <p className="mt-4 text-sm text-muted-foreground">Separate table for EACH entity type, better isolation</p>
    </motion.div>
  </div>
);

// Decision Tree Component
const DecisionTree = () => (
  <div className="my-8 p-6 rounded-xl bg-card border border-border/50">
    <h3 className="text-lg font-bold text-foreground mb-6 text-center">Storage Strategy Decision Tree</h3>
    <div className="flex flex-col items-center gap-4">
      {/* Root Question */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        className="px-6 py-3 rounded-lg bg-primary/20 border border-primary/50 text-center"
      >
        <span className="text-foreground font-medium">How many entity types?</span>
      </motion.div>
      
      <div className="flex gap-8 md:gap-16">
        {/* 1-5 Branch */}
        <div className="flex flex-col items-center gap-2">
          <span className="text-blue-400 font-semibold text-sm">1-5 types</span>
          <div className="w-px h-4 bg-blue-400"></div>
          <div className="px-4 py-2 rounded-lg bg-blue-500/20 border border-blue-500/50 text-center">
            <span className="text-blue-400 font-bold text-sm">SINGLE_TABLE</span>
            <div className="text-xs text-muted-foreground mt-1">Simple is beautiful</div>
          </div>
        </div>
        
        {/* 6+ Branch */}
        <div className="flex flex-col items-center gap-2">
          <span className="text-green-400 font-semibold text-sm">6+ types</span>
          <div className="w-px h-4 bg-green-400"></div>
          <div className="px-4 py-2 rounded-lg bg-muted/50 border border-border/50 text-center">
            <span className="text-muted-foreground text-sm">Total entities?</span>
          </div>
          
          <div className="flex gap-6">
            <div className="flex flex-col items-center gap-2">
              <span className="text-amber-400 text-xs">&lt;1M</span>
              <div className="w-px h-3 bg-amber-400"></div>
              <div className="px-3 py-1.5 rounded-lg bg-blue-500/20 border border-blue-500/50">
                <span className="text-blue-400 font-bold text-xs">SINGLE</span>
              </div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <span className="text-green-400 text-xs">&gt;1M</span>
              <div className="w-px h-3 bg-green-400"></div>
              <div className="px-3 py-1.5 rounded-lg bg-green-500/20 border border-green-500/50">
                <span className="text-green-400 font-bold text-xs">PER_TYPE</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Architecture Diagram
const ArchitectureDiagram = () => (
  <div className="my-8 p-6 rounded-xl bg-card border border-border/50 overflow-x-auto">
    <h3 className="text-lg font-bold text-foreground mb-6 text-center">Complete Storage Architecture</h3>
    <div className="min-w-[600px]">
      <svg viewBox="0 0 800 450" className="w-full h-auto">
        {/* Background Grid */}
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="hsl(var(--border))" strokeWidth="0.5" opacity="0.3"/>
          </pattern>
        </defs>
        <rect width="800" height="450" fill="url(#grid)"/>
        
        {/* Your Entities Box */}
        <rect x="20" y="30" width="160" height="80" rx="8" fill="hsl(var(--primary))" opacity="0.2" stroke="hsl(var(--primary))" strokeWidth="2"/>
        <text x="100" y="55" textAnchor="middle" fill="hsl(var(--foreground))" fontSize="12" fontWeight="bold">Your Entities</text>
        <text x="100" y="75" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="10">@AICapable</text>
        <text x="100" y="90" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="9">products, users, orders</text>
        
        {/* Arrow Down */}
        <path d="M 100 115 L 100 155" stroke="hsl(var(--muted-foreground))" strokeWidth="2" markerEnd="url(#arrow)"/>
        
        {/* Strategy Interface */}
        <rect x="20" y="160" width="160" height="60" rx="8" fill="hsl(var(--accent))" opacity="0.2" stroke="hsl(var(--accent))" strokeWidth="2"/>
        <text x="100" y="185" textAnchor="middle" fill="hsl(var(--foreground))" fontSize="11" fontWeight="bold">StorageStrategy</text>
        <text x="100" y="202" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="9">(Interface)</text>
        
        {/* Fork to strategies */}
        <path d="M 100 225 L 100 260" stroke="hsl(var(--muted-foreground))" strokeWidth="2"/>
        <path d="M 100 260 L 250 260" stroke="#3b82f6" strokeWidth="2"/>
        <path d="M 100 260 L 250 340" stroke="#22c55e" strokeWidth="2"/>
        
        {/* Single Table Strategy */}
        <rect x="260" y="230" width="140" height="60" rx="8" fill="#3b82f6" opacity="0.2" stroke="#3b82f6" strokeWidth="2"/>
        <text x="330" y="255" textAnchor="middle" fill="hsl(var(--foreground))" fontSize="10" fontWeight="bold">SINGLE_TABLE</text>
        <text x="330" y="272" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="9">JPA Repository</text>
        
        {/* Per-Type Strategy */}
        <rect x="260" y="310" width="140" height="60" rx="8" fill="#22c55e" opacity="0.2" stroke="#22c55e" strokeWidth="2"/>
        <text x="330" y="335" textAnchor="middle" fill="hsl(var(--foreground))" fontSize="10" fontWeight="bold">PER_TYPE_TABLE</text>
        <text x="330" y="352" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="9">JDBC + Factory</text>
        
        {/* Arrows to databases */}
        <path d="M 405 260 L 480 260" stroke="#3b82f6" strokeWidth="2"/>
        <path d="M 405 340 L 480 340" stroke="#22c55e" strokeWidth="2"/>
        
        {/* Single Table DB */}
        <rect x="490" y="220" width="140" height="80" rx="8" fill="hsl(var(--chart-1))" opacity="0.2" stroke="hsl(var(--chart-1))" strokeWidth="2"/>
        <text x="560" y="245" textAnchor="middle" fill="hsl(var(--foreground))" fontSize="10" fontWeight="bold">ai_searchable_entities</text>
        <text x="560" y="262" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="8">product | prod-1</text>
        <text x="560" y="274" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="8">user | user-1</text>
        <text x="560" y="286" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="8">order | order-1</text>
        
        {/* Per-Type Tables */}
        <rect x="490" y="305" width="90" height="35" rx="6" fill="hsl(var(--chart-2))" opacity="0.2" stroke="hsl(var(--chart-2))" strokeWidth="1.5"/>
        <text x="535" y="327" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="8">ai_searchable_product</text>
        
        <rect x="590" y="305" width="90" height="35" rx="6" fill="hsl(var(--chart-3))" opacity="0.2" stroke="hsl(var(--chart-3))" strokeWidth="1.5"/>
        <text x="635" y="327" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="8">ai_searchable_user</text>
        
        <rect x="690" y="305" width="90" height="35" rx="6" fill="hsl(var(--chart-4))" opacity="0.2" stroke="hsl(var(--chart-4))" strokeWidth="1.5"/>
        <text x="735" y="327" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="8">ai_searchable_order</text>
        
        {/* Vector DB + Your Tables */}
        <rect x="490" y="370" width="140" height="50" rx="8" fill="hsl(var(--chart-5))" opacity="0.2" stroke="hsl(var(--chart-5))" strokeWidth="2"/>
        <text x="560" y="392" textAnchor="middle" fill="hsl(var(--foreground))" fontSize="10" fontWeight="bold">Vector Database</text>
        <text x="560" y="407" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="9">Embeddings (384 dims)</text>
        
        <rect x="650" y="370" width="130" height="50" rx="8" fill="hsl(var(--primary))" opacity="0.2" stroke="hsl(var(--primary))" strokeWidth="2"/>
        <text x="715" y="392" textAnchor="middle" fill="hsl(var(--foreground))" fontSize="10" fontWeight="bold">Your JPA Tables</text>
        <text x="715" y="407" textAnchor="middle" fill="hsl(var(--muted-foreground))" fontSize="9">Full Business Data</text>
        
        {/* Legend */}
        <text x="20" y="430" fill="hsl(var(--muted-foreground))" fontSize="9">3 Storage Systems: Metadata → SQL | Vectors → Vector DB | Business Data → Your DB</text>
        
        {/* Arrow marker */}
        <defs>
          <marker id="arrow" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto" markerUnits="strokeWidth">
            <path d="M0,0 L0,6 L9,3 z" fill="hsl(var(--muted-foreground))"/>
          </marker>
        </defs>
      </svg>
    </div>
  </div>
);

// Scale Impact Metrics
const ScaleMetrics = () => {
  const metrics = [
    { label: "Databases Supported", value: "9+", icon: Database, color: "text-blue-400" },
    { label: "Entity Metadata", value: "Typed", icon: Layers, color: "text-green-400" },
    { label: "Config Change", value: "1 line", icon: Settings2, color: "text-amber-400" },
    { label: "Code Changes", value: "0", icon: Zap, color: "text-primary" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-8">
      {metrics.map((metric, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          viewport={{ once: true }}
          className="p-4 rounded-xl bg-card border border-border/50 text-center"
        >
          <metric.icon className={`h-6 w-6 mx-auto mb-2 ${metric.color}`} />
          <div className={`text-2xl font-bold ${metric.color}`}>{metric.value}</div>
          <div className="text-xs text-muted-foreground">{metric.label}</div>
        </motion.div>
      ))}
    </div>
  );
};

// Use Case Cards
const UseCaseCard = ({ icon: Icon, title, description, strategy, color }: {
  icon: any;
  title: string;
  description: string;
  strategy: string;
  color: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="p-5 rounded-xl bg-card border border-border/50"
  >
    <div className="flex items-center gap-3 mb-3">
      <div className={`p-2 rounded-lg ${color}`}>
        <Icon className="h-5 w-5 text-white" />
      </div>
      <h4 className="font-bold text-foreground">{title}</h4>
    </div>
    <p className="text-sm text-muted-foreground mb-3">{description}</p>
    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${strategy === 'SINGLE_TABLE' ? 'bg-blue-500/20 text-blue-400' : 'bg-green-500/20 text-green-400'}`}>
      {strategy}
    </span>
  </motion.div>
);

const StorageStory = () => {
  const [expandedStrategy, setExpandedStrategy] = useState<string | null>(null);

  useEffect(() => {
    document.title = PAGE_TITLE;
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", PAGE_DESCRIPTION);
    }
    
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute("content", PAGE_TITLE);
    
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) ogDescription.setAttribute("content", PAGE_DESCRIPTION);
    
    const ogImage = document.querySelector('meta[property="og:image"]');
    if (ogImage) ogImage.setAttribute("content", OG_IMAGE);
  }, []);

  const strategies = [
    {
      strategy: "SINGLE_TABLE",
      icon: Table2,
      color: "border-blue-500",
      example: "ai_searchable_entities",
      description: "All entity types share ONE table, distinguished by entity_type column. Simple and elegant.",
      pros: ["Simple schema", "Easy backup/restore", "Great for <1M entities", "Perfect for startups"],
      cons: ["Large table at scale", "Index bloat", "Harder to partition"],
      bestFor: ["Startups", "MVPs", "Development", "<5 entity types"],
    },
    {
      strategy: "PER_TYPE_TABLE",
      icon: Boxes,
      color: "border-green-500",
      example: "ai_searchable_product, ai_searchable_user...",
      description: "Separate table for EACH entity type. Better isolation and performance at scale.",
      pros: ["Fast queries (smaller tables)", "Independent indexes", "Multi-tenant friendly", "Easy to optimize each table"],
      cons: ["More tables to manage", "Slightly complex schema", "Need entity type for queries"],
      bestFor: ["Scale-ups", "Enterprise", ">1M entities", "Multi-tenant SaaS"],
    },
  ];

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
          <section className="relative overflow-hidden border-b border-border/50 mb-12">
            <div className="absolute inset-0 bg-gradient-glow opacity-50" />
            <div className="py-12 relative">
              <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                    <span className="text-2xl">💾</span>
                    Storage Strategy V1
                  </span>
                  <Link 
                    to="/docs/storage_story_v2"
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    View V2 (Narrative) →
                  </Link>
                </div>
                <div className="flex items-center gap-3">
                  <StoryLoveButton storySlug="storage-strategy-story" />
                  <PageViewCounter />
                </div>
              </div>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl"
              >
                <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
                  The Storage Dilemma:{" "}
                  <span className="text-gradient">One Table vs Many Tables</span>
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl mb-8">
                  How we built a flexible metadata storage system that auto-creates tables and adapts to your database. Part of the AI Fabric Framework series.
                </p>
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2 text-sm text-accent">
                    <Settings2 className="h-4 w-4" />
                    Auto-Create Tables
                  </div>
                  <div className="flex items-center gap-2 rounded-full bg-secondary/10 px-4 py-2 text-sm text-secondary">
                    <Database className="h-4 w-4" />
                    Multi-Database
                  </div>
                  <div className="flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm text-primary">
                    <Zap className="h-4 w-4" />
                    Strategy Pattern
                  </div>
                </div>
              </motion.div>
            </div>
          </section>


          {/* The Question */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-6">The Question Every AI Framework Must Answer</h2>
            
            <div className="p-6 rounded-xl bg-card border border-border/50 mb-6">
              <p className="text-lg text-foreground mb-4">
                <strong>You have 50 different entity types.</strong> Each needs AI search. Each needs metadata tracking.
              </p>
              <p className="text-xl font-bold text-primary mb-4">Where do you store the metadata?</p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
                  <span className="font-bold text-blue-400">Option A:</span>
                  <p className="text-muted-foreground">One giant <code className="bg-muted px-1 rounded">ai_searchable_entities</code> table for everything</p>
                </div>
                <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30">
                  <span className="font-bold text-green-400">Option B:</span>
                  <p className="text-muted-foreground">Separate table per entity type (<code className="bg-muted px-1 rounded">ai_searchable_product</code>, etc.)</p>
                </div>
              </div>
              
              <p className="mt-4 text-foreground font-medium">
                <strong>We built both. You choose with one config line.</strong>
              </p>
            </div>
          </section>

          {/* Scale Metrics */}
          <ScaleMetrics />

          {/* Storage Flow */}
          <StorageFlowDiagram />

          {/* Strategy Cards */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-6">Choose Your Strategy</h2>
            <div className="space-y-4">
              {strategies.map((s) => (
                <StrategyCard
                  key={s.strategy}
                  {...s}
                  isExpanded={expandedStrategy === s.strategy}
                  onToggle={() => setExpandedStrategy(expandedStrategy === s.strategy ? null : s.strategy)}
                />
              ))}
            </div>
          </section>

          {/* Table Structure Visual */}
          <TableStructureVisual />

          {/* Decision Tree */}
          <DecisionTree />

          {/* Architecture */}
          <ArchitectureDiagram />

          {/* Use Cases */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-6">Real Business Cases</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <UseCaseCard
                icon={Building2}
                title="Startup → Scale-Up"
                description="Start with SINGLE_TABLE for MVP, switch to PER_TYPE_TABLE as you grow. One config change, zero code changes."
                strategy="SINGLE_TABLE → PER_TYPE_TABLE"
                color="bg-gradient-to-br from-blue-500 to-green-500"
              />
              <UseCaseCard
                icon={Users}
                title="Multi-Tenant SaaS"
                description="500 tenants, 12M records. Perfect isolation with per-tenant entity types. Easy backup per tenant."
                strategy="PER_TYPE_TABLE"
                color="bg-green-500"
              />
              <UseCaseCard
                icon={Shield}
                title="GDPR Compliance"
                description="Delete all user data within 24 hours. Per-type tables make user data isolation and deletion faster."
                strategy="PER_TYPE_TABLE"
                color="bg-amber-500"
              />
              <UseCaseCard
                icon={Scale}
                title="Simple E-commerce"
                description="3 entity types, 50K records. Simple schema, easy queries, perfect for small-medium scale."
                strategy="SINGLE_TABLE"
                color="bg-blue-500"
              />
            </div>
          </section>

          {/* The Bottom Line */}
          <section className="mb-12">
            <div className="p-6 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20">
              <h2 className="text-2xl font-bold text-foreground mb-4">The Bottom Line</h2>
              <p className="text-muted-foreground mb-4">
                Storage strategy isn't about fancy AI. It's about <strong className="text-foreground">picking the right architecture</strong> for your scale and complexity:
              </p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-center gap-2">
                  <span className="text-blue-400">•</span>
                  <span><strong className="text-blue-400">SINGLE_TABLE</strong> = Simple, great for small-medium datasets</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-400">•</span>
                  <span><strong className="text-green-400">PER_TYPE_TABLE</strong> = Performance, great for large-scale or multi-tenant</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-purple-400">•</span>
                  <span><strong className="text-purple-400">CUSTOM</strong> = Total control, for special requirements</span>
                </li>
              </ul>
              <p className="mt-4 text-foreground font-semibold">
                Config-first storage selection with app-level verification.
              </p>
            </div>
          </section>

          {/* Love Button */}
          <div className="my-8 flex justify-center">
            <StoryLoveButton storySlug="storage_story" />
          </div>

          {/* Full Story */}
          <section className="prose prose-invert max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ className, children }) {
                  const isInline = !className;
                  if (isInline) {
                    return (
                      <code className="bg-muted px-1.5 py-0.5 rounded text-primary text-sm">
                        {children}
                      </code>
                    );
                  }
                  return <CodeBlock className={className}>{String(children)}</CodeBlock>;
                },
                h1: ({ children }) => (
                  <h1 className="text-3xl font-bold text-foreground mt-12 mb-6">{children}</h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-2xl font-bold text-foreground mt-10 mb-4">{children}</h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-xl font-semibold text-foreground mt-8 mb-3">{children}</h3>
                ),
                p: ({ children }) => (
                  <p className="text-muted-foreground leading-relaxed mb-4">{children}</p>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4">{children}</ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal list-inside space-y-2 text-muted-foreground mb-4">{children}</ol>
                ),
                li: ({ children }) => (
                  <li className="text-muted-foreground">{children}</li>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground my-4">
                    {children}
                  </blockquote>
                ),
                a: ({ href, children }) => (
                  <a href={href} className="text-primary hover:underline">{children}</a>
                ),
                hr: () => <hr className="border-border my-8" />,
              }}
            >
              {storageStoryContent}
            </ReactMarkdown>
          </section>

          {/* Story Navigation */}
          <StoryNavigation className="mt-12" />

          {/* Footer */}
          <footer className="border-t border-border/50 pt-8 mt-12">
            <div className="flex flex-col items-center gap-4">
              <StoryLoveButton storySlug="storage-strategy-story" />
              <p className="text-sm text-muted-foreground text-center">
                Part of the AI Fabric Framework series. See current guides for exact setup and release checks.
              </p>
            </div>
          </footer>
        </motion.article>
      </div>
    </DocsLayout>
  );
};

export default StorageStory;
