import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Highlight, themes } from "prism-react-renderer";
import DocsLayout from "@/components/docs/DocsLayout";
import PageViewCounter from "@/components/PageViewCounter";
import StoryLoveButton from "@/components/StoryLoveButton";
import StoryNavigation from "@/components/StoryNavigation";
import { 
  Database,
  Table2,
  Boxes,
  ArrowRight,
  CheckCircle2,
  XCircle,
  TrendingUp,
  TrendingDown,
  Zap,
  Settings2,
  FileCode,
  Play,
  Pause,
  RotateCcw,
  Clock,
  Activity,
  Sparkles,
  HardDrive,
  Layers,
  Building2,
  Users,
  Scale,
  AlertTriangle,
  Rocket,
  Timer
} from "lucide-react";

const PAGE_TITLE = "Storage Strategy V2: The Table That Grew Too Big - AI Fabric Framework";
const PAGE_DESCRIPTION = "A developer's journey from simple startup to scale-up—how one table became many, and why that's beautiful.";

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

const TheJourney = () => {
  const [activePhase, setActivePhase] = useState(0);
  
  const phases = [
    {
      title: "The Startup",
      subtitle: "Month 1-6",
      icon: Rocket,
      color: "text-blue-400",
      bgColor: "bg-blue-500/5",
      borderColor: "border-blue-500/30",
      metrics: { entities: "50K", types: 3, table: "1 table", strategy: "SINGLE_TABLE" },
      situation: "MVP launched. 3 entity types. 50K records. Life is simple.",
      thoughts: "\"One table for everything? Perfect. Simple queries. Easy to understand.\"",
      config: `ai-infrastructure:
  storage:
    strategy: SINGLE_TABLE  # Simple is beautiful`,
      status: "happy"
    },
    {
      title: "The Growth",
      subtitle: "Month 7-12",
      icon: TrendingUp,
      color: "text-green-400",
      bgColor: "bg-green-500/5",
      borderColor: "border-green-500/30",
      metrics: { entities: "500K", types: 5, table: "1 table", strategy: "SINGLE_TABLE" },
      situation: "Product-market fit. 5 entity types. 500K records. Still manageable.",
      thoughts: "\"One table is still fine. Queries are fast. No complaints.\"",
      config: `ai-infrastructure:
  storage:
    strategy: SINGLE_TABLE  # Still working great`,
      status: "ok"
    },
    {
      title: "The Warning Signs",
      subtitle: "Month 13-18",
      icon: AlertTriangle,
      color: "text-amber-400",
      bgColor: "bg-amber-500/5",
      borderColor: "border-amber-500/30",
      metrics: { entities: "2M", types: 8, table: "1 table", strategy: "SINGLE_TABLE" },
      situation: "Scaling fast. 8 entity types. 2M records. Queries getting slower.",
      thoughts: "\"Hmm, that product query took 800ms. Index is getting big. Should I worry?\"",
      config: `ai-infrastructure:
  storage:
    strategy: SINGLE_TABLE  # Starting to feel the pain`,
      status: "concerned"
    },
    {
      title: "The Breaking Point",
      subtitle: "Month 19",
      icon: TrendingDown,
      color: "text-red-400",
      bgColor: "bg-red-500/5",
      borderColor: "border-red-500/30",
      metrics: { entities: "5M", types: 12, table: "1 table", strategy: "SINGLE_TABLE" },
      situation: "5M records. 12 entity types. One giant table. Queries timing out.",
      thoughts: "\"Product search: 3.2 seconds. User lookup: 2.8 seconds. This is not sustainable.\"",
      config: `ai-infrastructure:
  storage:
    strategy: SINGLE_TABLE  # 😰`,
      status: "critical"
    },
    {
      title: "The Solution",
      subtitle: "Month 19 (Same Day)",
      icon: Sparkles,
      color: "text-purple-400",
      bgColor: "bg-purple-500/5",
      borderColor: "border-purple-500/30",
      metrics: { entities: "5M", types: 12, table: "12 tables", strategy: "PER_TYPE_TABLE" },
      situation: "Discover AI Fabric supports PER_TYPE_TABLE. One config change.",
      thoughts: "\"Wait, I just change one line? No code changes? No migration scripts?\"",
      config: `ai-infrastructure:
  storage:
    strategy: PER_TYPE_TABLE  # That's it!`,
      status: "discovery"
    },
    {
      title: "The Victory",
      subtitle: "Month 20+",
      icon: CheckCircle2,
      color: "text-green-400",
      bgColor: "bg-green-500/5",
      borderColor: "border-green-500/30",
      metrics: { entities: "10M+", types: 15, table: "15 tables", strategy: "PER_TYPE_TABLE" },
      situation: "10M+ records. 15 entity types. Separate tables. Queries: 50ms average.",
      thoughts: "\"Product search: 45ms. User lookup: 38ms. Life is good again.\"",
      config: `ai-infrastructure:
  storage:
    strategy: PER_TYPE_TABLE  # Perfect for scale`,
      status: "victory"
    }
  ];

  return (
    <div className="my-16">
      <h3 className="text-2xl font-bold text-foreground mb-8 text-center">
        The Journey: From Startup to Scale-Up
      </h3>
      <p className="text-sm text-muted-foreground text-center mb-8">
        Watch how one table became many—and why that's exactly what you want
      </p>
      
      {/* Phase Navigation */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 justify-center">
        {phases.map((phase, i) => (
          <button
            key={i}
            onClick={() => setActivePhase(i)}
            className={`flex-shrink-0 px-3 py-2 rounded-lg font-semibold transition-all ${
              activePhase === i
                ? `${phase.bgColor} ${phase.borderColor} border-2 shadow-lg`
                : "bg-muted/30 border border-border/50 text-muted-foreground hover:border-border"
            }`}
          >
            <div className="flex items-center gap-2">
              {React.createElement(phase.icon, {
                className: `h-4 w-4 ${activePhase === i ? phase.color : 'text-muted-foreground'}`
              })}
              <span className={`text-xs ${activePhase === i ? 'text-foreground' : ''}`}>
                {phase.title.split(' ')[0]}
              </span>
            </div>
          </button>
        ))}
      </div>
      
      {/* Metrics Dashboard */}
      <div className="mb-6 p-4 rounded-lg bg-card/50 border border-border/30">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-xs text-muted-foreground mb-1">Total Entities</div>
            <div className="text-2xl font-bold text-primary">{phases[activePhase].metrics.entities}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground mb-1">Entity Types</div>
            <div className="text-2xl font-bold text-amber-400">{phases[activePhase].metrics.types}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground mb-1">Tables</div>
            <div className="text-2xl font-bold text-blue-400">{phases[activePhase].metrics.table}</div>
          </div>
          <div className="text-center">
            <div className="text-xs text-muted-foreground mb-1">Strategy</div>
            <div className={`text-lg font-bold ${
              phases[activePhase].strategy === 'SINGLE_TABLE' ? 'text-blue-400' : 'text-green-400'
            }`}>
              {phases[activePhase].strategy === 'SINGLE_TABLE' ? 'SINGLE' : 'PER_TYPE'}
            </div>
          </div>
        </div>
      </div>
      
      {/* Phase Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activePhase}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`p-8 rounded-xl border ${phases[activePhase].borderColor} ${phases[activePhase].bgColor}`}
        >
          <div className="flex items-center gap-3 mb-6">
            {React.createElement(phases[activePhase].icon, {
              className: `h-8 w-8 ${phases[activePhase].color}`
            })}
            <div>
              <h4 className="text-xl font-bold text-foreground">{phases[activePhase].title}</h4>
              <p className="text-sm text-muted-foreground">{phases[activePhase].subtitle}</p>
            </div>
          </div>
          
          <div className="space-y-6">
            <div>
              <p className="text-sm font-semibold text-foreground mb-2">The Situation:</p>
              <p className="text-sm text-muted-foreground italic">"{phases[activePhase].situation}"</p>
            </div>
            
            <div>
              <p className="text-sm font-semibold text-foreground mb-2">Developer's Thoughts:</p>
              <p className="text-sm text-muted-foreground italic">"{phases[activePhase].thoughts}"</p>
            </div>
            
            <div className="p-4 rounded-lg bg-muted/30 border border-border/30">
              <p className="text-xs font-semibold text-foreground mb-2">Configuration:</p>
              <CodeBlock code={phases[activePhase].config} language="yaml" />
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const TheTwoStrategies = () => {
  const [selectedStrategy, setSelectedStrategy] = useState(0);
  
  const strategies = [
    {
      name: "SINGLE_TABLE",
      icon: Table2,
      color: "text-blue-400",
      borderColor: "border-blue-500/30",
      bgColor: "bg-blue-500/5",
      description: "All entity types in ONE table",
      tableName: "ai_searchable_entities",
      structure: `CREATE TABLE ai_searchable_entities (
    id VARCHAR PRIMARY KEY,
    entity_type VARCHAR,        -- "product", "user", etc.
    entity_id VARCHAR,
    searchable_content TEXT,
    vector_id VARCHAR,
    metadata TEXT,
    created_at TIMESTAMP
);

-- All types mixed together
-- Distinguished by entity_type column`,
      query: `-- Find a product
SELECT * FROM ai_searchable_entities
WHERE entity_type = 'product' 
  AND entity_id = 'prod-123';`,
      pros: [
        "Simple schema (one table)",
        "Easy backup/restore",
        "Great for < 1M entities",
        "Perfect for startups"
      ],
      cons: [
        "Large table at scale",
        "Index bloat",
        "Harder to partition",
        "Can't optimize per type"
      ],
      bestFor: "Startups, MVPs, <5 entity types, <1M entities"
    },
    {
      name: "PER_TYPE_TABLE",
      icon: Boxes,
      color: "text-green-400",
      borderColor: "border-green-500/30",
      bgColor: "bg-green-500/5",
      description: "Separate table for EACH entity type",
      tableName: "ai_searchable_product, ai_searchable_user, ...",
      structure: `-- Auto-created: One table per entity type
CREATE TABLE ai_searchable_product (
    id VARCHAR PRIMARY KEY,
    entity_id VARCHAR,          -- No entity_type needed!
    searchable_content TEXT,
    vector_id VARCHAR,
    metadata TEXT,
    created_at TIMESTAMP
);

CREATE TABLE ai_searchable_user (...);
CREATE TABLE ai_searchable_order (...);
-- One table per type`,
      query: `-- Find a product (searches smaller table!)
SELECT * FROM ai_searchable_product
WHERE entity_id = 'prod-123';

-- No entity_type filter needed!`,
      pros: [
        "Fast queries (smaller tables)",
        "Independent indexes per type",
        "Easy to partition/archive",
        "Multi-tenant friendly"
      ],
      cons: [
        "More tables to manage",
        "Slightly complex schema",
        "Need entity type for queries"
      ],
      bestFor: "Scale-ups, enterprise, >1M entities, multi-tenant"
    }
  ];

  return (
    <div className="my-16">
      <h3 className="text-2xl font-bold text-foreground mb-8 text-center">
        The Two Strategies: Choose Your Path
      </h3>
      <p className="text-sm text-muted-foreground text-center mb-8">
        Same data. Different architecture. One config line to switch.
      </p>
      
      <div className="grid grid-cols-2 gap-2 mb-6">
        {strategies.map((strategy, i) => (
          <button
            key={i}
            onClick={() => setSelectedStrategy(i)}
            className={`p-4 rounded-lg border-2 transition-all ${
              selectedStrategy === i
                ? `${strategy.borderColor} ${strategy.bgColor} shadow-lg scale-105`
                : "border-border/30 bg-muted/30 hover:border-border"
            }`}
          >
            {React.createElement(strategy.icon, {
              className: `h-6 w-6 mx-auto mb-2 ${selectedStrategy === i ? strategy.color : 'text-muted-foreground'}`
            })}
            <p className={`text-sm font-semibold text-center ${selectedStrategy === i ? 'text-foreground' : 'text-muted-foreground'}`}>
              {strategy.name}
            </p>
          </button>
        ))}
      </div>
      
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedStrategy}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`p-6 rounded-xl border ${strategies[selectedStrategy].borderColor} ${strategies[selectedStrategy].bgColor}`}
        >
          <div className="flex items-center gap-3 mb-4">
            {React.createElement(strategies[selectedStrategy].icon, {
              className: `h-8 w-8 ${strategies[selectedStrategy].color}`
            })}
            <div>
              <h4 className="text-lg font-bold text-foreground">{strategies[selectedStrategy].name}</h4>
              <p className="text-xs text-muted-foreground">{strategies[selectedStrategy].description}</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <p className="text-xs font-semibold text-foreground mb-1">Table Name:</p>
              <p className="text-sm text-muted-foreground font-mono">{strategies[selectedStrategy].tableName}</p>
            </div>
            
            <div>
              <p className="text-xs font-semibold text-foreground mb-1">Structure:</p>
              <CodeBlock code={strategies[selectedStrategy].structure} language="sql" />
            </div>
            
            <div>
              <p className="text-xs font-semibold text-foreground mb-1">Example Query:</p>
              <CodeBlock code={strategies[selectedStrategy].query} language="sql" />
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-xs font-semibold text-green-400 mb-2 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3" /> Pros
                </p>
                <ul className="space-y-1">
                  {strategies[selectedStrategy].pros.map((pro, i) => (
                    <li key={i} className="text-xs text-muted-foreground flex items-center gap-2">
                      <span className="text-green-400">•</span>
                      {pro}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="text-xs font-semibold text-red-400 mb-2 flex items-center gap-1">
                  <XCircle className="h-3 w-3" /> Cons
                </p>
                <ul className="space-y-1">
                  {strategies[selectedStrategy].cons.map((con, i) => (
                    <li key={i} className="text-xs text-muted-foreground flex items-center gap-2">
                      <span className="text-red-400">•</span>
                      {con}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
              <p className="text-xs font-semibold text-primary mb-1">Best For:</p>
              <p className="text-xs text-foreground">{strategies[selectedStrategy].bestFor}</p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const TheSwitch = () => {
  return (
    <div className="my-16 grid lg:grid-cols-2 gap-8">
      {/* Before: The Problem */}
      <div className="p-8 rounded-2xl bg-red-500/5 border-2 border-red-500/30">
        <div className="flex items-center gap-3 mb-6">
          <XCircle className="h-8 w-8 text-red-400" />
          <h4 className="text-xl font-bold text-foreground">The Breaking Point</h4>
        </div>
        
        <div className="space-y-4 text-sm">
          <div className="flex items-start gap-3">
            <Database className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-foreground">5M records in ONE table</p>
              <p className="text-muted-foreground">12 entity types all mixed together</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <Timer className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-foreground">Query Performance</p>
              <p className="text-muted-foreground">Product search: 3.2 seconds 😰</p>
              <p className="text-muted-foreground">User lookup: 2.8 seconds 😰</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-foreground">Index Bloat</p>
              <p className="text-muted-foreground">Single index on (entity_type, entity_id) = 2GB</p>
            </div>
          </div>
        </div>
        
        <div className="mt-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20">
          <p className="text-sm text-red-400 font-bold">Result: Unsustainable</p>
          <p className="text-xs text-muted-foreground mt-1">Users complaining. Database crying. Developer panicking.</p>
        </div>
      </div>
      
      {/* After: The Solution */}
      <div className="p-8 rounded-2xl bg-green-500/5 border-2 border-green-500/30">
        <div className="flex items-center gap-3 mb-6">
          <CheckCircle2 className="h-8 w-8 text-green-400" />
          <h4 className="text-xl font-bold text-foreground">The One-Line Fix</h4>
        </div>
        
        <div className="space-y-4 text-sm">
          <div className="flex items-start gap-3">
            <Boxes className="h-5 w-5 text-green-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-foreground">12 separate tables</p>
              <p className="text-muted-foreground">One table per entity type (auto-created!)</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <Zap className="h-5 w-5 text-green-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-foreground">Query Performance</p>
              <p className="text-muted-foreground">Product search: 45ms ⚡</p>
              <p className="text-muted-foreground">User lookup: 38ms ⚡</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <Settings2 className="h-5 w-5 text-green-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-foreground">The Change</p>
              <p className="text-muted-foreground font-mono text-xs">strategy: PER_TYPE_TABLE</p>
              <p className="text-muted-foreground">That's it. One line. Zero code changes.</p>
            </div>
          </div>
        </div>
        
        <div className="mt-6 p-4 rounded-lg bg-green-500/10 border border-green-500/20">
          <p className="text-sm text-green-400 font-bold">Result: 70x Faster</p>
          <p className="text-xs text-muted-foreground mt-1">3.2s → 45ms. Users happy. Database happy. Developer sleeping.</p>
        </div>
      </div>
    </div>
  );
};

const DecisionTree = () => {
  const [selectedPath, setSelectedPath] = useState<string | null>(null);
  
  return (
    <div className="my-16 p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 border border-border/50">
      <h3 className="text-2xl font-bold text-foreground mb-8 text-center">
        The Decision Tree: How to Choose
      </h3>
      
      <div className="max-w-2xl mx-auto">
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-card border border-border/50">
            <p className="font-semibold text-foreground mb-2">1. How many entity types?</p>
            <div className="flex gap-4">
              <button
                onClick={() => setSelectedPath("single")}
                className={`flex-1 p-3 rounded-lg border-2 transition-all ${
                  selectedPath === "single"
                    ? "border-blue-500/50 bg-blue-500/10"
                    : "border-border/30 bg-muted/30 hover:border-border"
                }`}
              >
                <p className="font-bold text-sm mb-1">1-5 types</p>
                <p className="text-xs text-muted-foreground">→ SINGLE_TABLE</p>
              </button>
              <button
                onClick={() => setSelectedPath("check-entities")}
                className={`flex-1 p-3 rounded-lg border-2 transition-all ${
                  selectedPath === "check-entities"
                    ? "border-green-500/50 bg-green-500/10"
                    : "border-border/30 bg-muted/30 hover:border-border"
                }`}
              >
                <p className="font-bold text-sm mb-1">6+ types</p>
                <p className="text-xs text-muted-foreground">→ Continue...</p>
              </button>
            </div>
          </div>
          
          {selectedPath === "check-entities" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 rounded-lg bg-card border border-border/50"
            >
              <p className="font-semibold text-foreground mb-2">2. Total entities?</p>
              <div className="flex gap-4">
                <button
                  onClick={() => setSelectedPath("single-large")}
                  className={`flex-1 p-3 rounded-lg border-2 transition-all ${
                    selectedPath === "single-large"
                      ? "border-blue-500/50 bg-blue-500/10"
                      : "border-border/30 bg-muted/30 hover:border-border"
                  }`}
                >
                  <p className="font-bold text-sm mb-1">&lt; 1M</p>
                  <p className="text-xs text-muted-foreground">→ SINGLE_TABLE works</p>
                </button>
                <button
                  onClick={() => setSelectedPath("per-type")}
                  className={`flex-1 p-3 rounded-lg border-2 transition-all ${
                    selectedPath === "per-type"
                      ? "border-green-500/50 bg-green-500/10"
                      : "border-border/30 bg-muted/30 hover:border-border"
                  }`}
                >
                  <p className="font-bold text-sm mb-1">&gt; 1M</p>
                  <p className="text-xs text-muted-foreground">→ PER_TYPE_TABLE</p>
                </button>
              </div>
            </motion.div>
          )}
          
          {selectedPath && (selectedPath === "single" || selectedPath === "single-large" || selectedPath === "per-type") && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-6 rounded-xl bg-primary/10 border-2 border-primary/30 text-center"
            >
              <CheckCircle2 className="h-12 w-12 text-primary mx-auto mb-4" />
              <p className="text-xl font-bold text-foreground mb-2">
                {selectedPath === "single" || selectedPath === "single-large" ? "SINGLE_TABLE Strategy" : "PER_TYPE_TABLE Strategy"}
              </p>
              <p className="text-sm text-muted-foreground">
                {selectedPath === "single" || selectedPath === "single-large" 
                  ? "Perfect for simplicity and small-medium scale. Simple is beautiful."
                  : "Perfect for scale and performance. Separate tables for better isolation."}
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

const WhatYouImplement = () => {
  return (
    <div className="my-16">
      <h3 className="text-2xl font-bold text-foreground mb-8 text-center">
        What You Actually Implement
      </h3>
      <p className="text-muted-foreground text-center mb-8">
        One config line. Auto-creates tables. Supports 9+ databases. Zero code.
      </p>
      
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="p-6 rounded-xl bg-card border border-border/50"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Settings2 className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <h4 className="font-bold text-foreground">Choose Your Strategy</h4>
              <p className="text-xs text-muted-foreground">One line in application.yml</p>
            </div>
          </div>
          
          <CodeBlock code={`# application.yml
ai-infrastructure:
  storage:
    strategy: SINGLE_TABLE      # or PER_TYPE_TABLE

# That's it! Framework handles:
# - Auto-detects your database (MySQL, PostgreSQL, etc.)
# - Generates correct SQL
# - Creates tables automatically
# - Supports 9+ databases`} language="yaml" />
          
          <div className="mt-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
            <p className="text-xs text-green-400">
              ✓ Auto-creates tables on startup
            </p>
            <p className="text-xs text-green-400">
              ✓ Supports MySQL, PostgreSQL, SQL Server, Oracle, H2, SQLite, DB2, Derby, Sybase
            </p>
            <p className="text-xs text-green-400">
              ✓ Zero code changes to switch strategies
            </p>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="p-6 rounded-xl bg-card border border-border/50"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
              <Database className="h-5 w-5 text-green-400" />
            </div>
            <div>
              <h4 className="font-bold text-foreground">Use It (No Code Changes)</h4>
              <p className="text-xs text-muted-foreground">Your existing @AICapable entities work automatically</p>
            </div>
          </div>
          
          <CodeBlock code={`@Entity
@AICapable(entityType = "product")
public class Product {
    @Id private UUID id;
    private String name;
    private String description;
}

// Save a product
productRepository.save(product);

// Framework automatically:
// 1. Detects @AICapable annotation
// 2. Uses your chosen storage strategy
// 3. Saves to correct table(s)
// 4. No code changes needed!`} />
        </motion.div>
      </div>
    </div>
  );
};

const StorageStoryV2 = () => {
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
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-green-500/5" />
            <div className="relative">
              <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-2 rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-400">
                    <Database className="h-4 w-4" />
                    Storage Strategy V2
                  </span>
                  <Link 
                    to="/docs/storage_story"
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    ← View V1
                  </Link>
                </div>
                <div className="flex items-center gap-3">
                  <StoryLoveButton storySlug="storage-story-v2" />
                  <PageViewCounter />
                </div>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
                The Table That{" "}
                <span className="text-gradient">Grew Too Big</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mb-8">
                This is a story about growth, performance, and one config line. How a simple startup table became a scale-up challenge—and how switching strategies took 30 seconds.
              </p>
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 border border-border/50">
                  <Table2 className="h-4 w-4 text-blue-400" />
                  1 → 12 Tables
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 border border-border/50">
                  <Zap className="h-4 w-4 text-green-400" />
                  70x Faster
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 border border-border/50">
                  <Settings2 className="h-4 w-4 text-amber-400" />
                  1 Config Line
                </div>
              </div>
            </div>
          </section>

          {/* The Journey */}
          <TheJourney />

          {/* The Two Strategies */}
          <TheTwoStrategies />

          {/* The Switch */}
          <TheSwitch />

          {/* Decision Tree */}
          <DecisionTree />

          {/* What You Implement */}
          <WhatYouImplement />

          {/* The Revelation */}
          <section className="mb-16 p-8 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/5 border border-primary/20 text-center">
            <Database className="h-16 w-16 text-primary mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-foreground mb-4">The Revelation</h3>
            <div className="max-w-2xl mx-auto space-y-4 text-muted-foreground">
              <p className="text-lg">
                "I thought switching storage strategies meant rewriting code. Migrating data. Weeks of work."
              </p>
              <p className="text-lg">
                "I was wrong. <span className="text-primary font-semibold">One config line. Restart. Done.</span>"
              </p>
              <p className="text-lg">
                "3.2 seconds → 45ms. 70x faster. Zero code changes."
              </p>
              <p className="text-lg">
                "<span className="text-primary font-semibold">The framework auto-creates tables. Auto-detects my database. Auto-optimizes queries.</span>"
              </p>
              <p className="text-lg">
                "I spent more time choosing the strategy than implementing it."
              </p>
              <p className="text-sm text-foreground italic font-semibold pt-4 border-t border-border/30">
                — Developer, after switching from SINGLE_TABLE to PER_TYPE_TABLE in 30 seconds
              </p>
            </div>
          </section>

          {/* Bottom Line */}
          <section className="mb-16 p-8 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/5 border-2 border-primary/30">
            <h3 className="text-2xl font-bold text-foreground mb-6 text-center">The Numbers Don't Lie</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { value: "9+", label: "Databases", icon: Database },
                { value: "1 line", label: "Config Change", icon: Settings2 },
                { value: "0", label: "Code Changes", icon: FileCode },
                { value: "70x", label: "Speed Improvement", icon: Zap }
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <stat.icon className="h-8 w-8 text-primary mx-auto mb-2" />
                  <div className="text-3xl font-bold text-primary mb-1">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </div>
            <p className="mt-8 text-center text-foreground font-medium italic">
              "Storage strategy isn't about fancy AI. It's about picking the right architecture for your scale."
            </p>
          </section>

          {/* Story Navigation */}


          <StoryNavigation className="mt-12" />



          {/* Footer */}
          <footer className="border-t border-border/50 pt-12 mt-12 flex flex-col items-center gap-6">
            <div className="flex items-center gap-4">
              <StoryLoveButton storySlug="storage-story-v2" />
              <PageViewCounter />
            </div>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link 
                to="/docs/guides/storage" 
                className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
              >
                <FileCode className="h-4 w-4" />
                Read Technical Guide
              </Link>
              <Link 
                to="/docs/storage_story" 
                className="inline-flex items-center gap-2 px-6 py-2 rounded-full border border-border bg-card text-foreground font-medium hover:bg-muted transition-colors"
              >
                View V1 (Technical)
              </Link>
            </div>
            <p className="text-xs text-muted-foreground text-center max-w-md">
              Part of the AI Fabric Framework series — where one table becomes many, and that's beautiful
            </p>
          </footer>
        </motion.article>
      </div>
    </DocsLayout>
  );
};

export default StorageStoryV2;

