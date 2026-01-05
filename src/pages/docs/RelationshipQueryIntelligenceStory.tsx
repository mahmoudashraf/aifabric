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
  Clock,
  DollarSign,
  Target,
  Activity,
  Sparkles,
  Database,
  Code,
  Settings,
  Search,
  Layers,
  Shield,
  Lock,
  Eye,
  Users,
  FileCode,
  BookOpen,
  Play,
  Pause,
  RotateCcw,
  Plug,
  Gavel,
  FileCheck,
  AlertTriangle,
  TrendingUp,
  BarChart3,
  Lightbulb,
  Rocket,
  Cpu,
  Calendar,
  Trash2,
  Filter
} from "lucide-react";

const PAGE_TITLE = "Relationship Query Intelligence: The Database That Reads Your Mind - AI Fabric Framework";
const PAGE_DESCRIPTION = "How automatic schema discovery, LLM intent understanding, and intelligent JPQL generation turn natural language into precise database queries—zero configuration, zero SQL knowledge required.";
const OG_IMAGE = "/assets/story-preview.png";

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

const CompleteEndToEndFlow = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const steps = [
    {
      number: 1,
      title: "User Query",
      icon: MessageSquare,
      color: "bg-blue-500",
      description: "Query: \"Find premium customers who ordered Nike products this month\"\nNatural language input"
    },
    {
      number: 2,
      title: "Schema Discovery",
      icon: Database,
      color: "bg-purple-500",
      description: "Automatic at startup\nScans JPA Metamodel\nDiscovers @AICapable entities\nMaps relationships\nCaches schema"
    },
    {
      number: 3,
      title: "LLM Intent Extraction",
      icon: Brain,
      color: "bg-orange-500",
      description: "LLM receives complete schema\nUnderstands: premium → tier=PREMIUM\nTraces: customer→order→product→brand\nExtracts filters and paths\nGenerates JSON plan"
    },
    {
      number: 4,
      title: "Plan Validation",
      icon: CheckCircle2,
      color: "bg-green-500",
      description: "Validates entities exist\nValidates relationships valid\nValidates fields exist\nType-checks values\nCreates RelationshipQueryPlan"
    },
    {
      number: 5,
      title: "JPQL Generation",
      icon: Code,
      color: "bg-red-500",
      description: "Uses JPA Metamodel field names\nBuilds SELECT, JOIN, WHERE clauses\nParameterized queries\nType-safe binding\nDeterministic output"
    },
    {
      number: 6,
      title: "Query Execution",
      icon: Zap,
      color: "bg-teal-500",
      description: "4-level fallback chain\nJPA → Metadata → Vector → Repository\nBinds parameters\nExecutes query\nReturns results"
    },
    {
      number: 7,
      title: "Results",
      icon: Target,
      color: "bg-indigo-500",
      description: "RAGResponse with documents\nTotal results count\nProcessing time\nConfidence score\nAccess control filtered"
    }
  ];

  useEffect(() => {
    if (isPlaying && activeStep < steps.length - 1) {
      const timer = setTimeout(() => {
        setActiveStep(prev => prev + 1);
      }, 2500);
      return () => clearTimeout(timer);
    } else if (activeStep >= steps.length - 1) {
      setIsPlaying(false);
    }
  }, [isPlaying, activeStep, steps.length]);

  return (
    <div className="my-16">
      <h3 className="text-2xl font-bold text-foreground mb-8 text-center">
        Complete End-to-End Flow: From Question to Answer
      </h3>
      <p className="text-sm text-muted-foreground text-center mb-6">
        Watch how natural language becomes a precise database query in 7 intelligent steps
      </p>
      
      <div className="flex items-center justify-center gap-3 mb-6">
        <button
          onClick={() => {
            setIsPlaying(!isPlaying);
            if (activeStep >= steps.length - 1) {
              setActiveStep(0);
              setIsPlaying(true);
            }
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 transition-colors"
        >
          {isPlaying ? (
            <>
              <Pause className="h-4 w-4" />
              Pause
            </>
          ) : (
            <>
              <Play className="h-4 w-4" />
              Play Flow
            </>
          )}
        </button>
        <button
          onClick={() => {
            setActiveStep(0);
            setIsPlaying(false);
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted border border-border/50 text-muted-foreground hover:text-foreground transition-colors"
        >
          <RotateCcw className="h-4 w-4" />
          Reset
        </button>
      </div>
      
      <div className="relative">
        <div className="flex flex-wrap justify-center items-center gap-3 md:gap-4">
          {steps.map((step, i) => {
            const Icon = step.icon;
            const isActive = activeStep >= i;
            return (
              <div key={i} className="flex items-center gap-2 md:gap-3">
                <motion.div
                  animate={{
                    scale: activeStep === i ? 1.1 : 1,
                    opacity: isActive ? 1 : 0.4,
                  }}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all cursor-pointer ${
                    activeStep === i
                      ? `${step.color} border-${step.color.split('-')[1]}-600 shadow-lg`
                      : 'bg-muted/30 border-border/50'
                  }`}
                  onClick={() => {
                    setActiveStep(i);
                    setIsPlaying(false);
                  }}
                  style={{ minWidth: '120px' }}
                >
                  <div className={`p-2 rounded-full ${step.color} ${!isActive ? 'opacity-50' : ''}`}>
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                  <div className="text-center">
                    <div className={`text-xs font-semibold mb-1 ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {step.number}
                    </div>
                    <div className={`text-xs font-bold ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {step.title}
                    </div>
                  </div>
                </motion.div>
                {i < steps.length - 1 && (
                  <motion.div
                    animate={{ opacity: activeStep > i ? 1 : 0.3 }}
                    className="hidden md:block"
                  >
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>
        
        {steps[activeStep] && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 p-6 rounded-xl border border-primary/30 bg-primary/5"
          >
            <div className="flex items-center gap-3 mb-3">
              {React.createElement(steps[activeStep].icon, {
                className: `h-6 w-6 text-primary`
              })}
              <div>
                <h4 className="font-bold text-foreground">PHASE {steps[activeStep].number}: {steps[activeStep].title}</h4>
                <p className="text-sm text-muted-foreground whitespace-pre-line">{steps[activeStep].description}</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

const SchemaDiscoveryFlow = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const steps = [
    {
      number: 1,
      title: "Application Startup",
      icon: Rocket,
      color: "bg-blue-500",
      description: "@PostConstruct\nRelationshipSchemaProvider.initialize()\nReady to discover schema"
    },
    {
      number: 2,
      title: "Scan JPA Metamodel",
      icon: Database,
      color: "bg-purple-500",
      description: "Metamodel metamodel = entityManager.getMetamodel()\nFor each EntityType:\nCheck @AICapable annotation\nFound: Customer, Order, Product, Brand"
    },
    {
      number: 3,
      title: "Discover Relationships",
      icon: Layers,
      color: "bg-orange-500",
      description: "For each Attribute:\nCheck if association\nExtract field name\nExtract target entity\nDetermine relationship type\nExample: Customer.orders → Order (@OneToMany)"
    },
    {
      number: 4,
      title: "Discover Fields",
      icon: Code,
      color: "bg-green-500",
      description: "For each non-association Attribute:\nExtract field name\nExtract field type\nExample: Customer.tier (String)\nExample: Order.createdAt (LocalDateTime)"
    },
    {
      number: 5,
      title: "Build Schema Map",
      icon: Settings,
      color: "bg-red-500",
      description: "EntityRelationshipSchema\nentities: {product, order, customer...}\nEach with fields and relationships\nComplete schema structure"
    },
    {
      number: 6,
      title: "Cache Schema",
      icon: Sparkles,
      color: "bg-teal-500",
      description: "this.cachedSchema = schema\nZero configuration required\nAlways accurate (from JPA)\nFast access (cached)\nReady for LLM prompts"
    }
  ];

  useEffect(() => {
    if (isPlaying && activeStep < steps.length - 1) {
      const timer = setTimeout(() => {
        setActiveStep(prev => prev + 1);
      }, 2000);
      return () => clearTimeout(timer);
    } else if (activeStep >= steps.length - 1) {
      setIsPlaying(false);
    }
  }, [isPlaying, activeStep, steps.length]);

  return (
    <div className="my-16">
      <h3 className="text-2xl font-bold text-foreground mb-8 text-center">
        Automatic Schema Discovery: Zero Configuration Magic
      </h3>
      <p className="text-sm text-muted-foreground text-center mb-6">
        Watch how the system automatically discovers your entire database schema at startup
      </p>
      
      <div className="flex items-center justify-center gap-3 mb-6">
        <button
          onClick={() => {
            setIsPlaying(!isPlaying);
            if (activeStep >= steps.length - 1) {
              setActiveStep(0);
              setIsPlaying(true);
            }
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 transition-colors"
        >
          {isPlaying ? (
            <>
              <Pause className="h-4 w-4" />
              Pause
            </>
          ) : (
            <>
              <Play className="h-4 w-4" />
              Play Flow
            </>
          )}
        </button>
        <button
          onClick={() => {
            setActiveStep(0);
            setIsPlaying(false);
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted border border-border/50 text-muted-foreground hover:text-foreground transition-colors"
        >
          <RotateCcw className="h-4 w-4" />
          Reset
        </button>
      </div>
      
      <div className="relative">
        <div className="flex flex-wrap justify-center items-center gap-3 md:gap-4">
          {steps.map((step, i) => {
            const Icon = step.icon;
            const isActive = activeStep >= i;
            return (
              <div key={i} className="flex items-center gap-2 md:gap-3">
                <motion.div
                  animate={{
                    scale: activeStep === i ? 1.1 : 1,
                    opacity: isActive ? 1 : 0.4,
                  }}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all cursor-pointer ${
                    activeStep === i
                      ? `${step.color} border-${step.color.split('-')[1]}-600 shadow-lg`
                      : 'bg-muted/30 border-border/50'
                  }`}
                  onClick={() => {
                    setActiveStep(i);
                    setIsPlaying(false);
                  }}
                  style={{ minWidth: '120px' }}
                >
                  <div className={`p-2 rounded-full ${step.color} ${!isActive ? 'opacity-50' : ''}`}>
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                  <div className="text-center">
                    <div className={`text-xs font-semibold mb-1 ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {step.number}
                    </div>
                    <div className={`text-xs font-bold ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {step.title}
                    </div>
                  </div>
                </motion.div>
                {i < steps.length - 1 && (
                  <motion.div
                    animate={{ opacity: activeStep > i ? 1 : 0.3 }}
                    className="hidden md:block"
                  >
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>
        
        {steps[activeStep] && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 p-6 rounded-xl border border-primary/30 bg-primary/5"
          >
            <div className="flex items-center gap-3 mb-3">
              {React.createElement(steps[activeStep].icon, {
                className: `h-6 w-6 text-primary`
              })}
              <div>
                <h4 className="font-bold text-foreground">STEP {steps[activeStep].number}: {steps[activeStep].title}</h4>
                <p className="text-sm text-muted-foreground whitespace-pre-line">{steps[activeStep].description}</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

const AccessControlFlow = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const steps = [
    {
      number: 1,
      title: "User Query",
      icon: MessageSquare,
      color: "bg-blue-500",
      description: "Query: \"Find customers, orders, and products\"\nUser: user-123 (Role: ANALYST)\nRequested entity types: [customer, order, product]"
    },
    {
      number: 2,
      title: "Orchestrator Access Control",
      icon: Shield,
      color: "bg-purple-500",
      description: "RAGOrchestrator.orchestrate()\nAIAccessControlService.checkAccess()\nEntityAccessPolicy.canUserAccessEntity()\nCheck: Can user execute relationship queries?\nResult: ✅ GRANTED or ❌ DENIED"
    },
    {
      number: 3,
      title: "Intent Extraction",
      icon: Brain,
      color: "bg-orange-500",
      description: "IntentQueryExtractor.extract()\nExtracts action: \"relationship_query\"\nExtracts entityTypes: [customer, order, product]\nBuilds actionParams"
    },
    {
      number: 4,
      title: "Entity Type Filtering",
      icon: Filter,
      color: "bg-green-500",
      description: "RelationshipQueryActionHandler.executeAction()\nfilterAllowedEntityTypes(userId, requestedTypes)\nFor each entityType:\n- Check role-based access\n- Check permission-based access\n- Check tenant-based access\n- Check data classification\nFiltered: [customer, order] (product denied)"
    },
    {
      number: 5,
      title: "Schema Filtering",
      icon: Database,
      color: "bg-red-500",
      description: "ReliableRelationshipQueryService.execute()\nOnly includes allowed entity types in schema\nDenied entity types excluded from LLM prompt\nLLM never sees restricted schemas\nMore efficient token usage"
    },
    {
      number: 6,
      title: "Query Execution",
      icon: Zap,
      color: "bg-teal-500",
      description: "Execute query with filtered entity types\nOnly queries allowed entities\nProduct schema never sent to LLM\nQuery executes successfully"
    },
    {
      number: 7,
      title: "Result Filtering",
      icon: Eye,
      color: "bg-indigo-500",
      description: "Filter results based on entity-level access\nFor each result:\nEntityAccessPolicy.canUserAccessEntity()\nCheck individual entity access\nReturn only accessible entities"
    },
    {
      number: 8,
      title: "Filtered Results",
      icon: CheckCircle2,
      color: "bg-pink-500",
      description: "✅ Only entities user can access\n✅ Only entity types user has permission for\n✅ Full audit trail\n✅ Defense in depth security"
    }
  ];

  useEffect(() => {
    if (isPlaying && activeStep < steps.length - 1) {
      const timer = setTimeout(() => {
        setActiveStep(prev => prev + 1);
      }, 2500);
      return () => clearTimeout(timer);
    } else if (activeStep >= steps.length - 1) {
      setIsPlaying(false);
    }
  }, [isPlaying, activeStep, steps.length]);

  return (
    <div className="my-16">
      <h3 className="text-2xl font-bold text-foreground mb-8 text-center">
        Access Control Flow: Defense in Depth Security
      </h3>
      <p className="text-sm text-muted-foreground text-center mb-6">
        Four layers of security ensure no unauthorized access—from orchestrator to entity-level filtering
      </p>
      
      <div className="flex items-center justify-center gap-3 mb-6">
        <button
          onClick={() => {
            setIsPlaying(!isPlaying);
            if (activeStep >= steps.length - 1) {
              setActiveStep(0);
              setIsPlaying(true);
            }
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 transition-colors"
        >
          {isPlaying ? (
            <>
              <Pause className="h-4 w-4" />
              Pause
            </>
          ) : (
            <>
              <Play className="h-4 w-4" />
              Play Flow
            </>
          )}
        </button>
        <button
          onClick={() => {
            setActiveStep(0);
            setIsPlaying(false);
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted border border-border/50 text-muted-foreground hover:text-foreground transition-colors"
        >
          <RotateCcw className="h-4 w-4" />
          Reset
        </button>
      </div>
      
      <div className="relative">
        <div className="flex flex-wrap justify-center items-center gap-3 md:gap-4">
          {steps.map((step, i) => {
            const Icon = step.icon;
            const isActive = activeStep >= i;
            return (
              <div key={i} className="flex items-center gap-2 md:gap-3">
                <motion.div
                  animate={{
                    scale: activeStep === i ? 1.1 : 1,
                    opacity: isActive ? 1 : 0.4,
                  }}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all cursor-pointer ${
                    activeStep === i
                      ? `${step.color} border-${step.color.split('-')[1]}-600 shadow-lg`
                      : 'bg-muted/30 border-border/50'
                  }`}
                  onClick={() => {
                    setActiveStep(i);
                    setIsPlaying(false);
                  }}
                  style={{ minWidth: '120px' }}
                >
                  <div className={`p-2 rounded-full ${step.color} ${!isActive ? 'opacity-50' : ''}`}>
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                  <div className="text-center">
                    <div className={`text-xs font-semibold mb-1 ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {step.number}
                    </div>
                    <div className={`text-xs font-bold ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {step.title}
                    </div>
                  </div>
                </motion.div>
                {i < steps.length - 1 && (
                  <motion.div
                    animate={{ opacity: activeStep > i ? 1 : 0.3 }}
                    className="hidden md:block"
                  >
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>
        
        {steps[activeStep] && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 p-6 rounded-xl border border-primary/30 bg-primary/5"
          >
            <div className="flex items-center gap-3 mb-3">
              {React.createElement(steps[activeStep].icon, {
                className: `h-6 w-6 text-primary`
              })}
              <div>
                <h4 className="font-bold text-foreground">LAYER {steps[activeStep].number}: {steps[activeStep].title}</h4>
                <p className="text-sm text-muted-foreground whitespace-pre-line">{steps[activeStep].description}</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
      
      {activeStep >= steps.length - 1 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-6 p-6 rounded-xl bg-green-500/10 border border-green-500/30 text-center"
        >
          <Shield className="h-8 w-8 text-green-400 mx-auto mb-3" />
          <p className="text-lg font-bold text-green-400 mb-2">Access Control Complete: Secure Results Returned</p>
          <p className="text-sm text-muted-foreground">
            Four layers of security: Orchestrator → Entity Type → Schema → Result filtering. Defense in depth ensures no unauthorized access.
          </p>
        </motion.div>
      )}
    </div>
  );
};

const MultiLevelFallback = () => {
  const [activeLevel, setActiveLevel] = useState(0);
  
  const levels = [
    {
      level: 1,
      name: "JPA Traversal",
      icon: Database,
      color: "text-green-400",
      borderColor: "border-green-500/30",
      bgColor: "bg-green-500/5",
      description: "Primary method - executes JPQL with proper JOINs",
      successRate: "85%",
      speed: "150-300ms",
      code: `// Level 1: JPA Traversal
SELECT DISTINCT c FROM Customer c
  JOIN c.orders o
WHERE c.tier = 'premium'
  AND o.createdAt > :lastMonth

// ✅ SUCCESS (85% of queries)
// Fast, accurate, the happy path`
    },
    {
      level: 2,
      name: "Metadata Traversal",
      icon: Layers,
      color: "text-blue-400",
      borderColor: "border-blue-500/30",
      bgColor: "bg-blue-500/5",
      description: "Fallback #1 - uses entity metadata when JPA incomplete",
      successRate: "10%",
      speed: "300-600ms",
      code: `// Level 2: Metadata Traversal
// JPA traversal failed (missing relationship?)
// Use entity metadata instead
// Navigate via reflection

// ✅ SUCCESS (10% of queries)
// Works even with incomplete JPA mappings`
    },
    {
      level: 3,
      name: "Vector Search",
      icon: Search,
      color: "text-purple-400",
      borderColor: "border-purple-500/30",
      bgColor: "bg-purple-500/5",
      description: "Fallback #2 - semantic similarity search",
      successRate: "4%",
      speed: "400-800ms",
      code: `// Level 3: Vector Search
// Metadata traversal failed
// Generate embedding for query
// Search vector database
// Return semantically similar entities

// ✅ SUCCESS (4% of queries)
// Semantic match, not exact but relevant`
    },
    {
      level: 4,
      name: "Simple Repository",
      icon: Users,
      color: "text-orange-400",
      borderColor: "border-orange-500/30",
      bgColor: "bg-orange-500/5",
      description: "Fallback #3 - basic repository findAll",
      successRate: "1%",
      speed: "30-100ms",
      code: `// Level 4: Simple Repository
// All else failed
// repository.findAll()
// Apply result limit
// At least returns correct entity type

// ✅ SUCCESS (1% of queries)
// Last resort, but always returns something`
    }
  ];

  return (
    <div className="my-16">
      <h3 className="text-2xl font-bold text-foreground mb-8 text-center">
        Multi-Level Fallback Chain: Always Gets Results
      </h3>
      <p className="text-sm text-muted-foreground text-center mb-6">
        Four levels of fallback ensure queries always return useful results, even when primary methods fail
      </p>
      
      <div className="grid grid-cols-4 gap-2 mb-6">
        {levels.map((level, i) => {
          const Icon = level.icon;
          return (
            <button
              key={i}
              onClick={() => setActiveLevel(i)}
              className={`p-3 rounded-lg border-2 transition-all ${
                activeLevel === i
                  ? `${level.borderColor} ${level.bgColor} shadow-lg`
                  : "border-border/30 bg-muted/30 hover:border-border"
              }`}
            >
              <Icon className={`h-5 w-5 mx-auto mb-1 ${activeLevel === i ? level.color : 'text-muted-foreground'}`} />
              <p className={`text-xs font-semibold text-center ${activeLevel === i ? 'text-foreground' : 'text-muted-foreground'}`}>
                Level {level.level}
              </p>
            </button>
          );
        })}
      </div>
      
      <AnimatePresence mode="wait">
        <motion.div
          key={activeLevel}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`p-6 rounded-xl border ${levels[activeLevel].borderColor} ${levels[activeLevel].bgColor}`}
        >
          <div className="flex items-center gap-3 mb-4">
            {React.createElement(levels[activeLevel].icon, {
              className: `h-6 w-6 ${levels[activeLevel].color}`
            })}
            <div>
              <h4 className="font-bold text-foreground">
                LEVEL {levels[activeLevel].level}: {levels[activeLevel].name}
              </h4>
              <p className="text-xs text-muted-foreground">{levels[activeLevel].description}</p>
            </div>
            <div className="ml-auto flex items-center gap-4">
              <div className="text-right">
                <div className="text-xs text-muted-foreground">Success Rate</div>
                <div className={`text-sm font-bold ${levels[activeLevel].color}`}>{levels[activeLevel].successRate}</div>
              </div>
              <div className="text-right">
                <div className="text-xs text-muted-foreground">Speed</div>
                <div className={`text-sm font-bold ${levels[activeLevel].color}`}>{levels[activeLevel].speed}</div>
              </div>
            </div>
          </div>
          <CodeBlock code={levels[activeLevel].code} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const IntelligenceStack = () => {
  const layers = [
    {
      layer: 1,
      title: "Automatic Schema Discovery",
      icon: Database,
      color: "bg-blue-500",
      features: ["Scans JPA Metamodel", "Discovers @AICapable entities", "Maps relationships", "Caches schema", "Zero configuration"]
    },
    {
      layer: 2,
      title: "LLM Intent Understanding",
      icon: Brain,
      color: "bg-purple-500",
      features: ["Receives complete schema", "Understands natural language", "Extracts relationship paths", "Identifies filters", "Chooses strategy"]
    },
    {
      layer: 3,
      title: "Structured Plan Generation",
      icon: Settings,
      color: "bg-orange-500",
      features: ["Validates relationships", "Validates fields", "Type-checks values", "Builds type-safe plan", "Handles multi-hop paths"]
    },
    {
      layer: 4,
      title: "Deterministic JPQL Building",
      icon: Code,
      color: "bg-green-500",
      features: ["Uses JPA Metamodel", "Parameterized queries", "Handles JOINs", "Type-safe binding", "SQL injection safe"]
    },
    {
      layer: 5,
      title: "Multi-Mode Execution",
      icon: Zap,
      color: "bg-red-500",
      features: ["STANDALONE mode", "ENHANCED mode", "SEMANTIC mode", "Automatic selection", "Fallback chain"]
    }
  ];

  return (
    <div className="my-16">
      <h3 className="text-2xl font-bold text-foreground mb-8 text-center">
        The Intelligence Stack: Five Layers of Intelligence
      </h3>
      
      <div className="space-y-4">
        {layers.map((layer, i) => {
          const Icon = layer.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`p-6 rounded-xl border-2 border-${layer.color.split('-')[1]}-500/30 bg-${layer.color.split('-')[1]}-500/5`}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className={`p-3 rounded-lg ${layer.color}`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-muted-foreground">LAYER {layer.layer}</div>
                  <h4 className="text-lg font-bold text-foreground">{layer.title}</h4>
                </div>
              </div>
              <div className="grid md:grid-cols-5 gap-2">
                {layer.features.map((feature, j) => (
                  <div key={j} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-4 w-4 text-green-400 shrink-0" />
                    <span className="text-muted-foreground">{feature}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

const RelationshipQueryIntelligenceStory = () => {
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
    updateMeta('meta[property="og:image"]', "content", absoluteOgImage);
    updateMeta('meta[property="og:type"]', "content", "article");
    updateMeta('meta[property="og:url"]', "content", window.location.href);

    updateMeta('meta[name="twitter:title"]', "content", PAGE_TITLE);
    updateMeta('meta[name="twitter:description"]', "content", PAGE_DESCRIPTION);
    updateMeta('meta[name="twitter:image"]', "content", absoluteOgImage);
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
                  <span className="text-2xl">🧠</span>
                  Relationship Query Intelligence V1
                </span>
                <Link
                  to="/docs/relationship_query_intelligence_v2"
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  View V2 (Narrative) →
                </Link>
              </div>
              <div className="flex items-center gap-3">
                <StoryLoveButton storySlug="relationship_query_intelligence_story" />
                <PageViewCounter />
              </div>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl"
            >
              <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
                Relationship Query Intelligence:{" "}
                <span className="text-gradient">The Database That Reads Your Mind</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mb-8">
                How automatic schema discovery, LLM intent understanding, and intelligent JPQL generation turn natural language 
                into precise database queries—zero configuration, zero SQL knowledge required.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2 text-sm text-accent">
                  <Brain className="h-4 w-4" />
                  Zero Configuration
                </div>
                <div className="flex items-center gap-2 rounded-full bg-secondary/10 px-4 py-2 text-sm text-secondary">
                  <Database className="h-4 w-4" />
                  Auto Schema Discovery
                </div>
                <div className="flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm text-primary">
                  <Shield className="h-4 w-4" />
                  Defense in Depth
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
            <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-8 mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-3">
                <AlertTriangle className="h-6 w-6 text-destructive" />
                The "I Don't Know My Own Database" Problem
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                <strong className="text-foreground">Senior Developer, 3 years at company:</strong>
              </p>
              <blockquote className="border-l-4 border-destructive pl-6 py-4 italic text-foreground mb-6">
                "I just spent 2 hours writing a query. Turns out the relationship is called `customerOrders`, not `orders`. 
                And `OrderItem` has a `product` field, not `productId`. I've been here 3 years and I still don't know all the relationships."
              </blockquote>
              
              <div className="space-y-3">
                <h3 className="font-semibold text-foreground">The Reality:</h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Modern applications have 50-200+ entities</li>
                  <li>Relationships change as features evolve</li>
                  <li>Developers can't memorize everything</li>
                  <li>Documentation is always outdated</li>
                  <li>Trial-and-error wastes hours</li>
                </ul>
              </div>
            </div>
          </motion.div>
        </section>

        {/* Complete End-to-End Flow */}
        <section className="px-6 py-12 border-t border-border/50 bg-muted/30">
          <div className="max-w-4xl mx-auto">
            <CompleteEndToEndFlow />
          </div>
        </section>

        {/* Schema Discovery */}
        <section className="px-6 py-12">
          <div className="max-w-4xl mx-auto">
            <SchemaDiscoveryFlow />
          </div>
        </section>

        {/* Access Control Flow */}
        <section className="px-6 py-12 border-t border-border/50 bg-muted/30">
          <div className="max-w-4xl mx-auto">
            <AccessControlFlow />
          </div>
        </section>

        {/* Multi-Level Fallback */}
        <section className="px-6 py-12">
          <div className="max-w-4xl mx-auto">
            <MultiLevelFallback />
          </div>
        </section>

        {/* Intelligence Stack */}
        <section className="px-6 py-12 border-t border-border/50 bg-muted/30">
          <div className="max-w-4xl mx-auto">
            <IntelligenceStack />
          </div>
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
                <Lightbulb className="h-6 w-6 text-primary" />
                The Solution: Zero Configuration Intelligence
              </h2>
              <p className="text-muted-foreground mb-6">
                You add one annotation. Framework discovers everything. LLM understands queries. System generates perfect JPQL.
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-6">
              <div className="p-6 rounded-xl border border-primary/30 bg-primary/5">
                <div className="flex items-center gap-3 mb-4">
                  <Code className="h-6 w-6 text-primary" />
                  <h4 className="font-bold text-foreground">1. Annotate Entities</h4>
                </div>
                <CodeBlock code={`@Entity
@AICapable(entityType = "product")
public class Product {
    @Id private UUID id;
    private String name;
    private BigDecimal price;
    
    @ManyToOne
    private Brand brand;  // ← Discovered automatically
    
    @OneToMany(mappedBy = "product")
    private List<OrderItem> orderItems;  // ← Discovered automatically
}`} />
              </div>
              
              <div className="p-6 rounded-xl border border-secondary/30 bg-secondary/5">
                <div className="flex items-center gap-3 mb-4">
                  <MessageSquare className="h-6 w-6 text-secondary" />
                  <h4 className="font-bold text-foreground">2. Ask in Natural Language</h4>
                </div>
                <CodeBlock code={`@Autowired
private ReliableRelationshipQueryService queryService;

public List<Customer> findPremiumCustomers() {
    RAGResponse response = queryService.execute(
        "Find premium customers who ordered Nike products this month"
    );
    return convertToCustomers(response.getDocuments());
}

// That's it. System handles everything.`} />
              </div>
            </div>
          </div>
        </section>

        {/* Story Navigation */}


        <StoryNavigation className="mt-12" />



        {/* Footer */}
        <section className="px-6 py-8 border-t border-border/50">
          <div className="max-w-4xl flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <Link
                to="/docs/relationship_query_intelligence_v2"
                className="flex items-center gap-2 text-sm text-primary hover:underline"
              >
                <BookOpen className="h-4 w-4" />
                Read V2 (Narrative Version)
              </Link>
              <Link
                to="/docs/guides/relationship_query_intelligence"
                className="flex items-center gap-2 text-sm text-primary hover:underline"
              >
                <FileCode className="h-4 w-4" />
                Read Full Technical Guide
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <StoryLoveButton storySlug="relationship_query_intelligence_story" />
              <PageViewCounter />
            </div>
          </div>
        </section>
      </div>
    </DocsLayout>
  );
};

export default RelationshipQueryIntelligenceStory;

