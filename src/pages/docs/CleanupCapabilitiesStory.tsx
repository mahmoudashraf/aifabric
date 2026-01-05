import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Highlight, themes } from "prism-react-renderer";
import DocsLayout from "@/components/docs/DocsLayout";
import PageViewCounter from "@/components/PageViewCounter";
import StoryLoveButton from "@/components/StoryLoveButton";
import StoryNavigation from "@/components/StoryNavigation";
import { 
  Brain,
  Zap,
  MessageSquare,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Settings,
  Code,
  Package,
  FileCode,
  BookOpen,
  Clock,
  DollarSign,
  Activity,
  Sparkles,
  Heart,
  Target,
  AlertTriangle,
  Database,
  Server,
  Cpu,
  Layers,
  RefreshCw,
  TrendingUp,
  Lock,
  Shield,
  Eye,
  Search,
  FileText,
  BarChart3,
  FileCheck,
  Users,
  Calendar,
  Trash2,
  Archive,
  HardDrive,
  TrendingDown
} from "lucide-react";

const PAGE_TITLE = "Cleanup Capabilities: Automatic Data Cleanup for AI Systems - AI Fabric Framework";
const PAGE_DESCRIPTION = "How we built automatic cleanup that removes orphaned vectors, enforces retention policies, and keeps your vector database healthy—all while protecting data integrity and ensuring compliance.";

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

const DataBloatComparison = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState(0);
  
  const timeframes = [
    {
      label: "Month 1",
      before: { size: "10GB", cost: 100, performance: "500ms", orphaned: 0 },
      after: { size: "10GB", cost: 100, performance: "500ms", orphaned: 0 }
    },
    {
      label: "Month 6",
      before: { size: "500GB", cost: 500, performance: "2s", orphaned: 50000 },
      after: { size: "200GB", cost: 200, performance: "600ms", orphaned: 0 }
    },
    {
      label: "Year 1",
      before: { size: "1TB", cost: 1000, performance: "5s", orphaned: 200000 },
      after: { size: "300GB", cost: 300, performance: "700ms", orphaned: 0 }
    }
  ];

  const current = timeframes[selectedTimeframe];

  return (
    <div className="my-16">
      <h3 className="text-2xl font-bold text-foreground mb-8 text-center">
        The Data Bloat Nightmare: Unbounded Growth
      </h3>
      
      <div className="flex gap-2 mb-6 justify-center">
        {timeframes.map((tf, i) => (
          <button
            key={i}
            onClick={() => setSelectedTimeframe(i)}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              selectedTimeframe === i
                ? "bg-primary/10 border-2 border-primary/30 shadow-lg"
                : "bg-muted/30 border border-border/50 text-muted-foreground hover:border-border"
            }`}
          >
            {tf.label}
          </button>
        ))}
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="p-6 rounded-xl border border-red-500/30 bg-red-500/5">
          <h4 className="font-bold text-foreground mb-4 flex items-center gap-2">
            <XCircle className="h-5 w-5 text-red-400" />
            Without Cleanup
          </h4>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Database Size:</p>
              <p className="text-lg font-bold text-red-400">{current.before.size}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Monthly Cost:</p>
              <p className="text-lg font-bold text-red-400">${current.before.cost}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Search Performance:</p>
              <p className="text-lg font-bold text-red-400">{current.before.performance}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Orphaned Vectors:</p>
              <p className="text-lg font-bold text-red-400">{current.before.orphaned.toLocaleString()}</p>
            </div>
          </div>
        </div>
        
        <div className="p-6 rounded-xl border border-green-500/30 bg-green-500/5">
          <h4 className="font-bold text-foreground mb-4 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-400" />
            With Cleanup
          </h4>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Database Size:</p>
              <p className="text-lg font-bold text-green-400">{current.after.size}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Monthly Cost:</p>
              <p className="text-lg font-bold text-green-400">${current.after.cost}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Search Performance:</p>
              <p className="text-lg font-bold text-green-400">{current.after.performance}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Orphaned Vectors:</p>
              <p className="text-lg font-bold text-green-400">{current.after.orphaned}</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6 p-4 rounded-lg bg-primary/10 border border-primary/20 text-center">
        <p className="text-sm font-bold text-primary">
          Result: {current.before.size} → {current.after.size}. ${current.before.cost} → ${current.after.cost}/month. {current.before.performance} → {current.after.performance}.
        </p>
      </div>
    </div>
  );
};

const ProblemList = () => {
  const problems = [
    { icon: XCircle, text: "Entities deleted but vectors remain (orphaned vectors)", color: "text-red-400" },
    { icon: XCircle, text: "Failed indexing attempts accumulate (stale metadata)", color: "text-red-400" },
    { icon: XCircle, text: "Old data never gets cleaned up (data bloat)", color: "text-red-400" },
    { icon: XCircle, text: "Vector database grows unbounded (costs increase)", color: "text-red-400" },
    { icon: XCircle, text: "Compliance violations (retention policies not enforced)", color: "text-red-400" },
    { icon: XCircle, text: "Slow searches (too many vectors)", color: "text-red-400" },
    { icon: XCircle, text: "High storage costs (unnecessary data)", color: "text-red-400" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 my-6">
      {problems.map((problem, i) => {
        const Icon = problem.icon;
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            viewport={{ once: true }}
            className="flex items-center gap-3 p-4 rounded-lg bg-destructive/5 border border-destructive/30"
          >
            <Icon className={`h-5 w-5 ${problem.color}`} />
            <span className="text-sm text-muted-foreground">{problem.text}</span>
          </motion.div>
        );
      })}
    </div>
  );
};

const SolutionCard = ({ title, icon: Icon, description, code, color }: { 
  title: string; 
  icon: any; 
  description: string; 
  code: string;
  color: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="rounded-xl border border-border/50 bg-card p-6"
  >
    <div className="flex items-center gap-3 mb-4">
      <div className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
      <div>
        <h3 className="font-bold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
    <CodeBlock code={code} />
  </motion.div>
);

const FeatureCard = ({ title, icon: Icon, description, color }: {
  title: string;
  icon: any;
  description: string;
  color: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="rounded-lg border border-border/50 bg-card p-5"
  >
    <div className="flex items-center gap-3 mb-3">
      <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center`}>
        <Icon className="h-5 w-5 text-white" />
      </div>
      <h4 className="font-bold text-foreground">{title}</h4>
    </div>
    <p className="text-sm text-muted-foreground">{description}</p>
  </motion.div>
);

const FlowStep = ({ step, title, description, code, icon: Icon, color }: {
  step: number;
  title: string;
  description: string;
  code?: string;
  icon: any;
  color: string;
}) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    className="relative pl-8 pb-8 border-l-2 border-border/50 last:border-l-0"
  >
    <div className={`absolute left-0 top-0 w-6 h-6 rounded-full ${color} flex items-center justify-center -translate-x-[13px]`}>
      <Icon className="h-4 w-4 text-white" />
    </div>
    <div className="mb-2">
      <span className="text-xs font-semibold text-primary">STEP {step}</span>
      <h4 className="text-lg font-bold text-foreground mt-1">{title}</h4>
      <p className="text-sm text-muted-foreground mt-1">{description}</p>
    </div>
    {code && <CodeBlock code={code} />}
  </motion.div>
);

const CleanupStrategies = () => {
  const [selectedStrategy, setSelectedStrategy] = useState(0);
  
  const strategies = [
    {
      name: "SOFT_DELETE",
      icon: Trash2,
      color: "text-blue-400",
      borderColor: "border-blue-500/30",
      bgColor: "bg-blue-500/5",
      description: "Mark as deleted, keep metadata",
      features: [
        "Evicts vector from vector database",
        "Marks entity as deleted in metadata",
        "Clears searchable content",
        "Keeps entity record (for audit)",
        "Recoverable (can restore)"
      ],
      code: `// SOFT_DELETE Strategy
private void softDelete(AISearchableEntity entity) {
    // Evict vector from vector database
    evictVector(entity);
    
    // Update metadata to mark as soft deleted
    metadataNode.put("_softDeleted", true);
    metadataNode.put("_deletedAt", LocalDateTime.now().toString());
    
    // Clear searchable content and vector ID
    entity.setSearchableContent(null);
    entity.setVectorId(null);
    
    // Save updated entity
    storageStrategy.save(entity);
}

// Result: Entity marked as deleted, recoverable`
    },
    {
      name: "ARCHIVE",
      icon: Archive,
      color: "text-purple-400",
      borderColor: "border-purple-500/30",
      bgColor: "bg-purple-500/5",
      description: "Move to archive, remove from search",
      features: [
        "Evicts vector from vector database",
        "Deletes entity (moved to archive)",
        "Can be restored from archive",
        "Removed from search index"
      ],
      code: `// ARCHIVE Strategy
private void archiveEntity(AISearchableEntity entity) {
    // Evict vector from vector database
    evictVector(entity);
    
    // Delete entity (moved to archive)
    storageStrategy.delete(entity);
}

// Result: Entity archived, can be restored`
    },
    {
      name: "HARD_DELETE",
      icon: HardDrive,
      color: "text-red-400",
      borderColor: "border-red-500/30",
      bgColor: "bg-red-500/5",
      description: "Permanently delete",
      features: [
        "Evicts vector from vector database",
        "Permanently deletes entity",
        "Not recoverable",
        "Removed from all indexes"
      ],
      code: `// HARD_DELETE Strategy
private void deleteEntity(AISearchableEntity entity) {
    // Evict vector from vector database
    evictVector(entity);
    
    // Permanently delete entity
    storageStrategy.delete(entity);
}

// Result: Entity permanently deleted, not recoverable`
    },
    {
      name: "CASCADE",
      icon: RefreshCw,
      color: "text-orange-400",
      borderColor: "border-orange-500/30",
      bgColor: "bg-orange-500/5",
      description: "Delete entity and related vectors",
      features: [
        "Evicts vector from vector database",
        "Deletes entity",
        "Deletes related vectors",
        "Not recoverable"
      ],
      code: `// CASCADE Strategy
private void cascadeDelete(AISearchableEntity entity) {
    // Evict vector from vector database
    evictVector(entity);
    
    // Delete related vectors
    deleteRelatedVectors(entity);
    
    // Delete entity
    storageStrategy.delete(entity);
}

// Result: Entity and related vectors deleted`
    }
  ];

  const current = strategies[selectedStrategy];

  return (
    <div className="my-16">
      <h3 className="text-2xl font-bold text-foreground mb-8 text-center">
        Cleanup Strategies: Four Powerful Options
      </h3>
      
      <div className="grid grid-cols-4 gap-2 mb-6">
        {strategies.map((strategy, i) => {
          const Icon = strategy.icon;
          return (
            <button
              key={i}
              onClick={() => setSelectedStrategy(i)}
              className={`p-3 rounded-lg border-2 transition-all ${
                selectedStrategy === i
                  ? `${strategy.borderColor} ${strategy.bgColor} shadow-lg`
                  : "border-border/30 bg-muted/30 hover:border-border"
              }`}
            >
              <Icon className={`h-5 w-5 mx-auto mb-1 ${selectedStrategy === i ? strategy.color : 'text-muted-foreground'}`} />
              <p className={`text-xs font-semibold text-center ${selectedStrategy === i ? 'text-foreground' : 'text-muted-foreground'}`}>
                {strategy.name.split('_')[0]}
              </p>
            </button>
          );
        })}
      </div>
      
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedStrategy}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`p-6 rounded-xl border ${current.borderColor} ${current.bgColor}`}
        >
          <div className="flex items-center gap-3 mb-4">
            {React.createElement(current.icon, {
              className: `h-6 w-6 ${current.color}`
            })}
            <div>
              <h4 className="font-bold text-foreground">{current.name}</h4>
              <p className="text-xs text-muted-foreground">{current.description}</p>
            </div>
          </div>
          
          <div className="mb-4">
            <p className="text-xs font-semibold text-foreground mb-2">Features:</p>
            <ul className="space-y-1">
              {current.features.map((feat, i) => (
                <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                  <CheckCircle2 className="h-3 w-3 text-primary shrink-0" />
                  {feat}
                </li>
              ))}
            </ul>
          </div>
          
          <CodeBlock code={current.code} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const CleanupCapabilitiesStory = () => {
  useEffect(() => {
    document.title = PAGE_TITLE;

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

    const updateCanonical = (href: string) => {
      let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement("link");
        link.setAttribute("rel", "canonical");
        document.head.appendChild(link);
      }
      link.setAttribute("href", href);
    };

    updateMeta('meta[name="description"]', "content", PAGE_DESCRIPTION);
    updateMeta('meta[property="og:title"]', "content", PAGE_TITLE);
    updateMeta('meta[property="og:description"]', "content", PAGE_DESCRIPTION);
    updateMeta('meta[property="og:type"]', "content", "article");
    updateMeta('meta[property="og:url"]', "content", window.location.href);

    updateMeta('meta[name="twitter:title"]', "content", PAGE_TITLE);
    updateMeta('meta[name="twitter:description"]', "content", PAGE_DESCRIPTION);
    updateMeta('meta[name="twitter:card"]', "content", "summary_large_image");

    updateCanonical(window.location.href);
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
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                  <span className="text-2xl">🧹</span>
                  Cleanup Capabilities V1
                </span>
                <Link 
                  to="/docs/cleanup_capabilities_story_v2"
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  View V2 (Narrative) →
                </Link>
              </div>
              <div className="flex items-center gap-3">
                <StoryLoveButton storySlug="cleanup_capabilities_story" />
                <PageViewCounter />
              </div>
            </div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl"
            >
              <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
                Cleanup Capabilities:{" "}
                <span className="text-gradient">Automatic Data Cleanup</span>{" "}
                for AI Systems
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mb-8">
                How we built automatic cleanup that removes orphaned vectors, enforces retention policies, 
                and keeps your vector database healthy—all while protecting data integrity and ensuring compliance.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2 text-sm text-accent">
                  <Trash2 className="h-4 w-4" />
                  Zero Code
                </div>
                <div className="flex items-center gap-2 rounded-full bg-secondary/10 px-4 py-2 text-sm text-secondary">
                  <Shield className="h-4 w-4" />
                  Compliance Ready
                </div>
                <div className="flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm text-primary">
                  <TrendingDown className="h-4 w-4" />
                  Cost Reduction
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Data Bloat Comparison */}
        <section className="px-6 py-12">
          <div className="max-w-4xl mx-auto">
            <DataBloatComparison />
          </div>
        </section>

        {/* The Problem */}
        <section className="px-6 py-12 border-t border-border/50 bg-muted/30">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl"
          >
            <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-8 mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-3">
                <AlertTriangle className="h-6 w-6 text-destructive" />
                The Data Bloat Nightmare: Orphaned Vectors and Unbounded Growth
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                You're building an AI application. Over time, orphaned vectors accumulate, old data never gets cleaned up, 
                and your vector database grows unbounded.
              </p>
              <p className="text-foreground font-medium mt-6">
                <strong>What if you could automatically clean up orphaned vectors, enforce retention policies, and keep your database healthy?</strong>
              </p>
            </div>

            <h3 className="text-xl font-bold text-foreground mb-4">Real-World Impact:</h3>
            <ProblemList />
          </motion.div>
        </section>

        {/* The Solution */}
        <section className="px-6 py-12">
          <div className="max-w-4xl">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-3">
                <Trash2 className="h-6 w-6 text-primary" />
                Our Solution: Automatic Cleanup System
              </h2>
              <p className="text-muted-foreground mb-8">
                Remove orphaned vectors. Enforce retention policies. Keep database healthy. Zero code.
              </p>
            </motion.div>

            <SolutionCard
              title="Automatic Scheduled Cleanup"
              icon={Clock}
              description="Zero code required. Scheduled cleanup runs automatically."
              color="bg-primary"
              code={`// Automatic cleanup - zero code required
// Scheduled cleanup runs automatically:

// 1. Orphaned entities: Every Sunday at 4 AM
@Scheduled(cron = "0 0 4 * * SUN")
public void cleanupOrphanedEntities() {
    // Find entities with vector IDs
    // Check if vector exists
    // Delete if orphaned
}

// 2. No-vector entities: Every Sunday at 5 AM
@Scheduled(cron = "0 0 5 * * SUN")
public void cleanupEntitiesWithoutVectors() {
    // Find entities without vector IDs
    // Check retention period (default: 24h)
    // Delete if older than retention
}

// 3. Retention policy: Daily at 3:30 AM
@Scheduled(cron = "0 30 3 * * *")
public void cleanupByRetentionPolicy() {
    // For each entity type
    // Apply retention policy
    // Apply cleanup strategy
}`}
            />
          </div>
        </section>

        {/* Cleanup Strategies */}
        <section className="px-6 py-12 border-t border-border/50 bg-muted/30">
          <div className="max-w-4xl mx-auto">
            <CleanupStrategies />
          </div>
        </section>

        {/* Features */}
        <section className="px-6 py-12">
          <div className="max-w-4xl">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-bold text-foreground mb-8 flex items-center gap-3">
                <Sparkles className="h-6 w-6 text-primary" />
                What Gets Cleaned Up
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-4">
              <FeatureCard
                title="Orphaned Entities"
                icon={Trash2}
                description="Entities with vector IDs but no actual vector. Automatically detected and removed."
                color="bg-blue-500"
              />
              <FeatureCard
                title="No-Vector Entities"
                icon={XCircle}
                description="Entities without vector IDs (failed indexing). Removed after retention period (default: 24h)."
                color="bg-purple-500"
              />
              <FeatureCard
                title="Retention Policy"
                icon={Calendar}
                description="Entities older than retention period. Per-entity-type retention policies enforced."
                color="bg-green-500"
              />
              <FeatureCard
                title="Vector Eviction"
                icon={Database}
                description="Vectors automatically evicted from vector database when entities are cleaned up."
                color="bg-orange-500"
              />
              <FeatureCard
                title="Stale Metadata"
                icon={FileText}
                description="Stale searchable content and metadata automatically removed during cleanup."
                color="bg-red-500"
              />
              <FeatureCard
                title="Failed Indexing"
                icon={AlertTriangle}
                description="Failed indexing attempts automatically cleaned up after retention period."
                color="bg-yellow-500"
              />
            </div>
          </div>
        </section>

        {/* The Complete Flow */}
        <section className="px-6 py-12 border-t border-border/50 bg-muted/30">
          <div className="max-w-4xl">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-bold text-foreground mb-8 flex items-center gap-3">
                <ArrowRight className="h-6 w-6 text-primary" />
                The Complete Technical Flow
              </h2>
            </motion.div>

            <div className="space-y-6">
              <FlowStep
                step={1}
                title="Orphaned Entities Cleanup"
                description="Every Sunday at 4 AM - Removes entities with vector IDs but no actual vector"
                icon={Trash2}
                color="bg-blue-500"
                code={`@Scheduled(cron = "0 0 4 * * SUN")
public void cleanupOrphanedEntities() {
    // 1. Find entities with vector IDs
    List<AISearchableEntity> entities = 
        storageStrategy.findByVectorIdIsNotNull();
    
    // 2. Check if vector exists
    for (AISearchableEntity entity : entities) {
        if (!vectorExists(entity)) {
            // 3. Delete orphaned entity
            deleteEntity(entity);
            orphaned++;
        }
    }
    
    // 4. Log results
    log.info("Cleaned {} orphaned entities", orphaned);
}

// Result: Orphaned entities removed`}
              />
              <FlowStep
                step={2}
                title="No-Vector Entities Cleanup"
                description="Every Sunday at 5 AM - Removes entities without vector IDs older than retention"
                icon={XCircle}
                color="bg-purple-500"
                code={`@Scheduled(cron = "0 0 5 * * SUN")
public void cleanupEntitiesWithoutVectors() {
    // 1. Calculate cutoff date (default: 24 hours)
    Duration retention = properties.getNoVectorEntities().getRetention();
    LocalDateTime cutoff = LocalDateTime.now().minus(retention);
    
    // 2. Find entities without vector IDs
    List<AISearchableEntity> entities = 
        storageStrategy.findByVectorIdIsNull();
    
    // 3. Delete if older than retention
    for (AISearchableEntity entity : entities) {
        if (shouldCleanup(entity.getCreatedAt(), cutoff)) {
            deleteEntity(entity);
            cleaned++;
        }
    }
    
    // Result: Stale entities removed`}
              />
              <FlowStep
                step={3}
                title="Retention Policy Cleanup"
                description="Daily at 3:30 AM - Enforces retention policies per entity type"
                icon={Calendar}
                color="bg-green-500"
                code={`@Scheduled(cron = "0 30 3 * * *")
public void cleanupByRetentionPolicy() {
    // 1. For each entity type
    for (Map.Entry<String, Integer> entry : 
         properties.getRetentionDays().entrySet()) {
        String entityType = entry.getKey();
        int retentionDays = entry.getValue();
        
        // 2. Calculate cutoff date
        LocalDateTime cutoff = 
            LocalDateTime.now().minusDays(retentionDays);
        
        // 3. Find entities older than retention
        List<AISearchableEntity> entities = 
            storageStrategy.findByEntityType(entityType);
        
        // 4. Apply cleanup strategy
        for (AISearchableEntity entity : entities) {
            if (shouldCleanup(entity.getCreatedAt(), cutoff)) {
                applyPolicy(entityType, entity);
                // SOFT_DELETE, ARCHIVE, HARD_DELETE, or CASCADE
            }
        }
    }
    
    // Result: Retention policies enforced`}
              />
            </div>
          </div>
        </section>

        {/* Real-World Examples */}
        <section className="px-6 py-12">
          <div className="max-w-4xl">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-bold text-foreground mb-8 flex items-center gap-3">
                <Target className="h-6 w-6 text-primary" />
                Real-World Examples
              </h2>
            </motion.div>

            <div className="space-y-6">
              <div className="rounded-xl border border-primary/30 bg-primary/5 p-6">
                <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
                  <Package className="h-5 w-5 text-primary" />
                  E-Commerce Cleanup
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Clean up old orders, products, and analytics data.
                </p>
                <CodeBlock code={`ai:
  cleanup:
    enabled: true
    
    # Retention policies (days)
    retention-days:
      order: 2555      # 7 years (compliance)
      user: 365        # 1 year
      product: 180     # 6 months
      behavior: 90     # 3 months
      analytics: 30    # 1 month
      default: 180     # 6 months default
    
    # Cleanup strategies
    strategies:
      order: ARCHIVE      # Archive orders (compliance)
      user: ARCHIVE       # Archive users (GDPR)
      product: SOFT_DELETE # Soft delete products
      behavior: HARD_DELETE # Hard delete behavior data
      analytics: HARD_DELETE # Hard delete analytics
    
    # Schedule
    orphaned-entities:
      enabled: true
      cron: "0 0 4 * * SUN"  # Sunday 4 AM
    
    no-vector-entities:
      enabled: true
      cron: "0 0 5 * * SUN"  # Sunday 5 AM
      retention: PT24H       # 24 hours
    
    retention-cron: "0 30 3 * * *"  # Daily 3:30 AM

// Impact:
// - Orphaned vectors removed (Sunday 4 AM)
// - Stale entities removed (Sunday 5 AM)
// - Retention policies enforced (Daily 3:30 AM)
// - Database size: 1TB → 300GB
// - Costs: $1,000/month → $300/month
// - Compliance maintained (7-year order retention)`} language="yaml" />
              </div>

              <div className="rounded-xl border border-secondary/30 bg-secondary/5 p-6">
                <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
                  <FileCheck className="h-5 w-5 text-secondary" />
                  Healthcare Compliance (HIPAA)
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  HIPAA-compliant data retention and cleanup.
                </p>
                <CodeBlock code={`ai:
  cleanup:
    enabled: true
    
    # HIPAA retention: 6 years minimum
    retention-days:
      patient-record: 2190    # 6 years (HIPAA)
      appointment: 2190       # 6 years
      prescription: 2190      # 6 years
      default: 2190           # 6 years default
    
    # Archive for compliance
    strategies:
      patient-record: ARCHIVE
      appointment: ARCHIVE
      prescription: ARCHIVE
    
    # Daily cleanup
    retention-cron: "0 0 2 * * *"  # Daily 2 AM

// Impact:
// - HIPAA-compliant retention (6 years)
// - Archive strategy (recoverable)
// - Automatic cleanup (daily)
// - Passed HIPAA audit`} language="yaml" />
              </div>

              <div className="rounded-xl border border-accent/30 bg-accent/5 p-6">
                <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-accent" />
                  GDPR Compliance
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  GDPR-compliant data retention and right to deletion.
                </p>
                <CodeBlock code={`ai:
  cleanup:
    enabled: true
    
    # GDPR retention: 1 year default
    retention-days:
      user: 365        # 1 year
      consent: 365     # 1 year
      analytics: 90    # 3 months
      default: 365     # 1 year default
    
    # Soft delete for recovery
    strategies:
      user: SOFT_DELETE
      consent: SOFT_DELETE
      analytics: HARD_DELETE
    
    # Weekly cleanup
    retention-cron: "0 0 3 * * SUN"  # Sunday 3 AM

// Impact:
// - GDPR-compliant retention (1 year)
// - Soft delete (recoverable for right to access)
// - Automatic cleanup (weekly)
// - Passed GDPR audit`} language="yaml" />
              </div>
            </div>
          </div>
        </section>

        {/* The Bottom Line */}
        <section className="px-6 py-12 border-t border-border/50 bg-muted/30">
          <div className="max-w-4xl">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-2xl border border-primary/30 bg-primary/5 p-8"
            >
              <h2 className="text-2xl font-bold text-foreground mb-6">
                The Bottom Line
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="font-semibold text-foreground mb-3">What you get:</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <Trash2 className="h-4 w-4 text-primary" />
                      Orphaned vector cleanup (automatic detection & removal)
                    </li>
                    <li className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-accent" />
                      Retention policy enforcement (per entity type)
                    </li>
                    <li className="flex items-center gap-2">
                      <XCircle className="h-4 w-4 text-secondary" />
                      Stale entity cleanup (failed indexing attempts)
                    </li>
                    <li className="flex items-center gap-2">
                      <Archive className="h-4 w-4 text-primary" />
                      Configurable strategies (SOFT_DELETE, ARCHIVE, HARD_DELETE, CASCADE)
                    </li>
                    <li className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-accent" />
                      Zero code (automatic scheduled cleanup)
                    </li>
                    <li className="flex items-center gap-2">
                      <Settings className="h-4 w-4 text-secondary" />
                      Configurable schedules (cron-based)
                    </li>
                    <li className="flex items-center gap-2">
                      <TrendingDown className="h-4 w-4 text-primary" />
                      Cost reduction (database size control)
                    </li>
                    <li className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-accent" />
                      Compliance-ready (GDPR, HIPAA retention)
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-3">What you configure:</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-accent" />
                      Optional: Retention days per entity type
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-accent" />
                      Optional: Cleanup strategies per entity type
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-accent" />
                      Optional: Cleanup schedules (cron)
                    </li>
                  </ul>
                </div>
              </div>
              <div className="rounded-lg bg-gradient-primary p-6 text-center">
                <p className="text-primary-foreground font-semibold text-lg">
                  Result: Automatic cleanup. Retention policies enforced. Database healthy. Zero code. Production-tested.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Story Navigation */}


        <StoryNavigation className="mt-12" />



        {/* Footer */}
        <section className="px-6 py-8 border-t border-border/50">
          <div className="max-w-4xl flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <Link
                to="/docs/cleanup_capabilities_story_v2"
                className="flex items-center gap-2 text-sm text-primary hover:underline"
              >
                <BookOpen className="h-4 w-4" />
                Read V2 (Narrative Version)
              </Link>
              <Link
                to="/docs/guides/cleanup_capabilities"
                className="flex items-center gap-2 text-sm text-primary hover:underline"
              >
                <FileCode className="h-4 w-4" />
                Read Full Technical Guide
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <StoryLoveButton storySlug="cleanup_capabilities_story" />
              <PageViewCounter />
            </div>
          </div>
        </section>
      </div>
    </DocsLayout>
  );
};

export default CleanupCapabilitiesStory;

