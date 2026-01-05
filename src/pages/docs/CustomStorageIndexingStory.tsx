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
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Zap,
  Clock,
  Layers,
  Code,
  Server,
  ArrowRight,
  Play,
  Pause,
  RotateCcw,
  FileCode,
  Sparkles,
  TrendingUp,
  RefreshCw,
  Target,
  ChevronDown
} from "lucide-react";

const PAGE_TITLE = "Custom Storage Indexing: When Your Database Isn't SQL - AI Fabric Framework";
const PAGE_DESCRIPTION = "A developer's journey from MongoDB chaos to seamless indexing—how indexing strategies work with custom storage backends.";

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

const TheDiscovery = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const steps = [
    {
      time: "Monday 9:00 AM",
      title: "The Requirement",
      icon: Database,
      color: "text-blue-400",
      bgColor: "bg-blue-500/5",
      borderColor: "border-blue-500/30",
      events: [
        { emoji: "💼", text: "PM: 'We're using MongoDB. All our data is there.'", type: "normal" },
        { emoji: "🤔", text: "Developer: 'But AI Fabric uses SQL for metadata...'", type: "warning" },
        { emoji: "❓", text: "Question: How do indexing strategies work with MongoDB?", type: "warning" }
      ]
    },
    {
      time: "Monday 9:30 AM",
      title: "The Problem",
      icon: AlertTriangle,
      color: "text-amber-400",
      bgColor: "bg-amber-500/5",
      borderColor: "border-amber-500/30",
      events: [
        { emoji: "🔍", text: "Tries SYNC indexing with MongoDB", type: "error" },
        { emoji: "❌", text: "Error: 'No SQL table found'", type: "error" },
        { emoji: "😰", text: "Indexing strategies assume SQL storage", type: "error" }
      ]
    },
    {
      time: "Monday 10:00 AM",
      title: "The Research",
      icon: Code,
      color: "text-purple-400",
      bgColor: "bg-purple-500/5",
      borderColor: "border-purple-500/30",
      events: [
        { emoji: "📖", text: "Reads: 'Storage Strategy: CUSTOM'", type: "positive" },
        { emoji: "💡", text: "Discovers: Custom storage interface", type: "positive" },
        { emoji: "🔧", text: "Can implement MongoDB storage strategy", type: "positive" }
      ]
    },
    {
      time: "Monday 10:30 AM",
      title: "The Solution",
      icon: Sparkles,
      color: "text-green-400",
      bgColor: "bg-green-500/5",
      borderColor: "border-green-500/30",
      events: [
        { emoji: "✅", text: "Implements AISearchableEntityStorageStrategy", type: "positive" },
        { emoji: "⚡", text: "All indexing strategies work automatically", type: "positive" },
        { emoji: "🎉", text: "SYNC, ASYNC, BATCH, AUTO all work!", type: "positive" }
      ]
    }
  ];

  useEffect(() => {
    if (isPlaying && activeStep < steps.length - 1) {
      const timer = setTimeout(() => {
        setActiveStep(prev => prev + 1);
      }, 3000);
      return () => clearTimeout(timer);
    } else if (activeStep >= steps.length - 1) {
      setIsPlaying(false);
    }
  }, [isPlaying, activeStep, steps.length]);

  const getEventColor = (type: string) => {
    switch(type) {
      case "error": return "text-red-400";
      case "warning": return "text-amber-400";
      case "positive": return "text-green-400";
      default: return "text-muted-foreground";
    }
  };

  return (
    <div className="my-12 p-8 rounded-2xl bg-gradient-to-br from-amber-500/5 to-green-500/5 border border-border/50">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Database className="h-5 w-5 text-primary" />
            The MongoDB Discovery
          </h3>
          <p className="text-sm text-muted-foreground mt-1">From SQL assumption to custom storage solution</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            disabled={activeStep >= steps.length - 1}
            className="p-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </button>
          <button
            onClick={() => { setActiveStep(0); setIsPlaying(false); }}
            className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {steps.map((step, i) => (
          <button
            key={i}
            onClick={() => { setActiveStep(i); setIsPlaying(false); }}
            className={`flex-shrink-0 px-3 py-2 rounded-lg font-semibold transition-all ${
              activeStep === i
                ? `${step.bgColor} ${step.borderColor} border-2 shadow-lg`
                : "bg-muted/30 border border-border/50 text-muted-foreground hover:border-border"
            }`}
          >
            <div className="flex items-center gap-2">
              {React.createElement(step.icon, {
                className: `h-4 w-4 ${activeStep === i ? step.color : 'text-muted-foreground'}`
              })}
              <span className={`text-xs ${activeStep === i ? 'text-foreground' : ''}`}>
                {step.time.split(' ')[1]}
              </span>
            </div>
          </button>
        ))}
      </div>
      
      <AnimatePresence mode="wait">
        <motion.div
          key={activeStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`p-6 rounded-xl border ${steps[activeStep].borderColor} ${steps[activeStep].bgColor}`}
        >
          <div className="flex items-center gap-3 mb-4">
            {React.createElement(steps[activeStep].icon, {
              className: `h-6 w-6 ${steps[activeStep].color}`
            })}
            <div>
              <h4 className="text-lg font-bold text-foreground">{steps[activeStep].title}</h4>
              <p className="text-xs text-muted-foreground">{steps[activeStep].time}</p>
            </div>
          </div>
          
          <div className="space-y-2">
            {steps[activeStep].events.map((event, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-2 text-sm"
              >
                <span className="text-xl">{event.emoji}</span>
                <span className={getEventColor(event.type)}>{event.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
      
      {activeStep >= steps.length - 1 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-6 p-6 rounded-xl bg-green-500/10 border border-green-500/30 text-center"
        >
          <CheckCircle2 className="h-8 w-8 text-green-400 mx-auto mb-3" />
          <p className="text-lg font-bold text-green-400 mb-2">Custom Storage = All Strategies Work</p>
          <p className="text-sm text-muted-foreground">
            Implement the interface. Get all indexing strategies. Zero assumptions about your storage.
          </p>
        </motion.div>
      )}
    </div>
  );
};

const StorageComparison = () => {
  const [selectedStorage, setSelectedStorage] = useState<"sql" | "mongodb" | "dynamodb" | "custom">("sql");
  
  const storages = [
    {
      name: "SQL (Default)",
      icon: Database,
      color: "text-blue-400",
      borderColor: "border-blue-500/30",
      bgColor: "bg-blue-500/5",
      description: "PostgreSQL, MySQL, SQL Server",
      code: `@Entity
@AICapable(entityType = "product")
public class Product {
    @Id private UUID id;
    private String name;
}

// Framework auto-creates:
// - ai_searchable_product table
// - Indexes
// - Everything automatic`,
      indexing: "All strategies work automatically"
    },
    {
      name: "MongoDB",
      icon: Server,
      color: "text-green-400",
      borderColor: "border-green-500/30",
      bgColor: "bg-green-500/5",
      description: "Document database",
      code: `@Document
@AICapable(entityType = "product")
public class Product {
    @Id private String id;
    private String name;
}

// Custom storage strategy:
@Component
public class MongoStorageStrategy 
    implements AISearchableEntityStorageStrategy {
    // Implement MongoDB operations
}`,
      indexing: "All strategies work via custom implementation"
    },
    {
      name: "DynamoDB",
      icon: Layers,
      color: "text-purple-400",
      borderColor: "border-purple-500/30",
      bgColor: "bg-purple-500/5",
      description: "AWS NoSQL database",
      code: `@DynamoDBTable
@AICapable(entityType = "product")
public class Product {
    @DynamoDBHashKey
    private String id;
    private String name;
}

// Custom storage strategy:
@Component
public class DynamoStorageStrategy 
    implements AISearchableEntityStorageStrategy {
    // Implement DynamoDB operations
}`,
      indexing: "All strategies work via custom implementation"
    },
    {
      name: "Custom (Any)",
      icon: Code,
      color: "text-amber-400",
      borderColor: "border-amber-500/30",
      bgColor: "bg-amber-500/5",
      description: "Redis, Cassandra, etc.",
      code: `@AICapable(entityType = "product")
public class Product {
    private String id;
    private String name;
}

// Your storage strategy:
@Component
public class MyCustomStorageStrategy 
    implements AISearchableEntityStorageStrategy {
    // Your storage logic
    // Redis? Cassandra? File system?
    // Your choice!
}`,
      indexing: "All strategies work via your implementation"
    }
  ];

  return (
    <div className="my-16">
      <h3 className="text-2xl font-bold text-foreground mb-8 text-center">
        Storage Backend: Your Choice, Our Strategies
      </h3>
      <p className="text-muted-foreground text-center mb-8">
        Indexing strategies don't care about your storage. Implement the interface. Get all strategies.
      </p>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {storages.map((storage, i) => (
          <button
            key={i}
            onClick={() => setSelectedStorage(storage.name.toLowerCase().replace(' ', '') as any)}
            className={`p-4 rounded-lg border-2 transition-all ${
              selectedStorage === storage.name.toLowerCase().replace(' ', '') as any
                ? `${storage.borderColor} ${storage.bgColor} shadow-lg scale-105`
                : "border-border/30 bg-muted/30 hover:border-border"
            }`}
          >
            {React.createElement(storage.icon, {
              className: `h-6 w-6 mx-auto mb-2 ${selectedStorage === storage.name.toLowerCase().replace(' ', '') as any ? storage.color : 'text-muted-foreground'}`
            })}
            <p className={`text-sm font-semibold text-center ${selectedStorage === storage.name.toLowerCase().replace(' ', '') as any ? 'text-foreground' : 'text-muted-foreground'}`}>
              {storage.name}
            </p>
          </button>
        ))}
      </div>
      
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedStorage}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`p-6 rounded-xl border ${storages.find(s => s.name.toLowerCase().replace(' ', '') === selectedStorage)?.borderColor} ${storages.find(s => s.name.toLowerCase().replace(' ', '') === selectedStorage)?.bgColor}`}
        >
          <div className="flex items-center gap-3 mb-4">
            {React.createElement(storages.find(s => s.name.toLowerCase().replace(' ', '') === selectedStorage)?.icon || Database, {
              className: `h-8 w-8 ${storages.find(s => s.name.toLowerCase().replace(' ', '') === selectedStorage)?.color}`
            })}
            <div>
              <h4 className="text-lg font-bold text-foreground">
                {storages.find(s => s.name.toLowerCase().replace(' ', '') === selectedStorage)?.name}
              </h4>
              <p className="text-sm text-muted-foreground">
                {storages.find(s => s.name.toLowerCase().replace(' ', '') === selectedStorage)?.description}
              </p>
            </div>
          </div>
          
          <CodeBlock code={storages.find(s => s.name.toLowerCase().replace(' ', '') === selectedStorage)?.code || ''} />
          
          <div className="mt-4 p-4 rounded-lg bg-primary/10 border border-primary/30">
            <p className="text-sm font-semibold text-primary">
              ✓ {storages.find(s => s.name.toLowerCase().replace(' ', '') === selectedStorage)?.indexing}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const TheInterface = () => {
  const [expanded, setExpanded] = useState<number | null>(0);
  
  const methods = [
    {
      name: "save()",
      desc: "Store an entity",
      icon: Database,
      color: "border-blue-500/50 bg-blue-500/10",
      iconColor: "text-blue-400",
      code: `@Override
public void save(AISearchableEntity entity) {
    // Your storage logic here
    // MongoDB: collection.insertOne(...)
    // DynamoDB: dynamoDB.putItem(...)
    // Redis: redis.set(...)
    // Whatever you need!
    
    mongoCollection.insertOne(
        new Document()
            .append("id", entity.getId())
            .append("entityType", entity.getEntityType())
            .append("entityId", entity.getEntityId())
            .append("searchableContent", entity.getSearchableContent())
            .append("vectorId", entity.getVectorId())
            .append("metadata", entity.getMetadata())
    );
}`,
      note: "Called by all indexing strategies (SYNC, ASYNC, BATCH, AUTO)"
    },
    {
      name: "findByEntityTypeAndEntityId()",
      desc: "Find an entity",
      icon: Target,
      color: "border-green-500/50 bg-green-500/10",
      iconColor: "text-green-400",
      code: `@Override
public Optional<AISearchableEntity> findByEntityTypeAndEntityId(
        String entityType, 
        String entityId
) {
    // Your lookup logic
    Document doc = mongoCollection
        .find(Filters.and(
            Filters.eq("entityType", entityType),
            Filters.eq("entityId", entityId)
        ))
        .first();
    
    if (doc == null) {
        return Optional.empty();
    }
    
    return Optional.of(mapToEntity(doc));
}`,
      note: "Used for deduplication and updates"
    },
    {
      name: "deleteByEntityTypeAndEntityId()",
      desc: "Delete an entity",
      icon: XCircle,
      color: "border-red-500/50 bg-red-500/10",
      iconColor: "text-red-400",
      code: `@Override
public void deleteByEntityTypeAndEntityId(
        String entityType, 
        String entityId
) {
    // Your delete logic
    mongoCollection.deleteOne(
        Filters.and(
            Filters.eq("entityType", entityType),
            Filters.eq("entityId", entityId)
        )
    );
}`,
      note: "Called when entities are deleted"
    },
    {
      name: "findAllByEntityType()",
      desc: "Find all entities of a type",
      icon: RefreshCw,
      color: "border-purple-500/50 bg-purple-500/10",
      iconColor: "text-purple-400",
      code: `@Override
public List<AISearchableEntity> findAllByEntityType(
        String entityType
) {
    // Your query logic
    return mongoCollection
        .find(Filters.eq("entityType", entityType))
        .map(this::mapToEntity)
        .into(new ArrayList<>());
}`,
      note: "Used for batch operations and migrations"
    }
  ];

  return (
    <div className="my-16">
      <h3 className="text-2xl font-bold text-foreground mb-8 text-center">
        The Interface: 4 Methods, Infinite Possibilities
      </h3>
      <p className="text-muted-foreground text-center mb-8">
        Implement these 4 methods. Get all indexing strategies. That's it.
      </p>
      <div className="space-y-3">
        {methods.map((method, i) => (
          <motion.div
            key={i}
            layout
            className={`rounded-xl border-2 ${method.color} overflow-hidden cursor-pointer`}
            onClick={() => setExpanded(expanded === i ? null : i)}
          >
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <method.icon className={`h-6 w-6 ${method.iconColor}`} />
                <div>
                  <span className="font-bold text-foreground">{method.name}</span>
                  <span className="text-muted-foreground ml-2 text-sm">— {method.desc}</span>
                </div>
              </div>
              <motion.div
                animate={{ rotate: expanded === i ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="h-5 w-5 text-muted-foreground" />
              </motion.div>
            </div>
            
            <AnimatePresence>
              {expanded === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-t border-border/50"
                >
                  <div className="p-4">
                    <CodeBlock code={method.code} />
                    <div className="mt-4 p-3 rounded-lg bg-muted/30">
                      <p className="text-xs text-muted-foreground">
                        <strong>Note:</strong> {method.note}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const StrategyCompatibility = () => {
  return (
    <div className="my-16 grid lg:grid-cols-2 gap-8">
      {/* Without Custom Storage */}
      <div className="p-8 rounded-2xl bg-red-500/5 border-2 border-red-500/30">
        <div className="flex items-center gap-3 mb-6">
          <XCircle className="h-8 w-8 text-red-400" />
          <h4 className="text-xl font-bold text-foreground">Without Custom Storage Support</h4>
        </div>
        
        <div className="space-y-4 text-sm">
          <div className="p-3 rounded bg-muted/30">
            <p className="text-muted-foreground mb-1">Scenario:</p>
            <p className="text-foreground">Using MongoDB, but framework assumes SQL</p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <span className="text-red-400">✗</span> SYNC indexing fails
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <span className="text-red-400">✗</span> ASYNC indexing fails
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <span className="text-red-400">✗</span> BATCH indexing fails
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <span className="text-red-400">✗</span> AUTO indexing fails
            </div>
          </div>
          
          <div className="mt-4 p-4 rounded-lg bg-red-500/10 border border-red-500/30">
            <p className="text-red-400 font-semibold mb-1">Error:</p>
            <p className="text-muted-foreground text-xs">"No SQL table found"</p>
            <p className="text-red-400 text-xs mt-2">Locked into SQL. Can't use your existing database.</p>
          </div>
        </div>
      </div>
      
      {/* With Custom Storage */}
      <div className="p-8 rounded-2xl bg-green-500/5 border-2 border-green-500/30">
        <div className="flex items-center gap-3 mb-6">
          <CheckCircle2 className="h-8 w-8 text-green-400" />
          <h4 className="text-xl font-bold text-foreground">With Custom Storage Support</h4>
        </div>
        
        <div className="space-y-4 text-sm">
          <div className="p-3 rounded bg-muted/30">
            <p className="text-muted-foreground mb-1">Scenario:</p>
            <p className="text-foreground">Using MongoDB with custom storage strategy</p>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-foreground">
              <span className="text-green-400">✓</span> SYNC indexing works
            </div>
            <div className="flex items-center gap-2 text-foreground">
              <span className="text-green-400">✓</span> ASYNC indexing works
            </div>
            <div className="flex items-center gap-2 text-foreground">
              <span className="text-green-400">✓</span> BATCH indexing works
            </div>
            <div className="flex items-center gap-2 text-foreground">
              <span className="text-green-400">✓</span> AUTO indexing works
            </div>
          </div>
          
          <div className="mt-4 p-4 rounded-lg bg-green-500/10 border border-green-500/30">
            <p className="text-green-400 font-semibold mb-1">Result:</p>
            <p className="text-muted-foreground text-xs">All strategies work with your storage backend</p>
            <p className="text-green-400 text-xs mt-2">Use your existing database. No migration needed.</p>
          </div>
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
        One interface. Four methods. All indexing strategies work automatically.
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
              <FileCode className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <h4 className="font-bold text-foreground">Step 1: Configure Custom Storage</h4>
              <p className="text-xs text-muted-foreground">One line in application.yml</p>
            </div>
          </div>
          
          <CodeBlock code={`# application.yml
ai-infrastructure:
  storage:
    strategy: CUSTOM
    custom-strategy-class: com.myapp.storage.MongoStorageStrategy`} language="yaml" />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="p-6 rounded-xl bg-card border border-border/50"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
              <Code className="h-5 w-5 text-green-400" />
            </div>
            <div>
              <h4 className="font-bold text-foreground">Step 2: Implement the Interface</h4>
              <p className="text-xs text-muted-foreground">Four methods. Your storage logic.</p>
            </div>
          </div>
          
          <CodeBlock code={`@Component
public class MongoStorageStrategy 
        implements AISearchableEntityStorageStrategy {
    
    @Autowired
    private MongoTemplate mongoTemplate;
    
    @Override
    public void save(AISearchableEntity entity) {
        // Your MongoDB save logic
        mongoTemplate.save(mapToDocument(entity), "ai_searchable");
    }
    
    @Override
    public Optional<AISearchableEntity> findByEntityTypeAndEntityId(
            String entityType, String entityId) {
        // Your MongoDB find logic
        Document doc = mongoTemplate.findOne(
            Query.query(Criteria.where("entityType").is(entityType)
                .and("entityId").is(entityId)),
            Document.class, "ai_searchable"
        );
        return doc != null ? Optional.of(mapToEntity(doc)) : Optional.empty();
    }
    
    @Override
    public void deleteByEntityTypeAndEntityId(
            String entityType, String entityId) {
        // Your MongoDB delete logic
        mongoTemplate.remove(
            Query.query(Criteria.where("entityType").is(entityType)
                .and("entityId").is(entityId)),
            "ai_searchable"
        );
    }
    
    @Override
    public List<AISearchableEntity> findAllByEntityType(String entityType) {
        // Your MongoDB find all logic
        List<Document> docs = mongoTemplate.find(
            Query.query(Criteria.where("entityType").is(entityType)),
            Document.class, "ai_searchable"
        );
        return docs.stream().map(this::mapToEntity).toList();
    }
}

// That's it! All indexing strategies now work with MongoDB:
// - SYNC: Works
// - ASYNC: Works  
// - BATCH: Works
// - AUTO: Works`} />
        </motion.div>
      </div>
    </div>
  );
};

const CustomStorageIndexingStory = () => {
  useEffect(() => {
    document.title = PAGE_TITLE;
  }, []);

  return (
    <DocsLayout>
      <div className="max-w-4xl mx-auto px-6 py-8">
        <motion.article 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Hero */}
          <section className="relative overflow-hidden border-b border-border/50 pb-12 mb-12">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 via-transparent to-green-500/5" />
            <div className="relative">
              <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                    <Database className="h-4 w-4" />
                    Custom Storage Indexing
                  </span>
                  <Link 
                    to="/docs/indexing_story"
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    ← View Indexing Strategies
                  </Link>
                </div>
                <div className="flex items-center gap-3">
                  <StoryLoveButton storySlug="custom-storage-indexing-story" />
                  <PageViewCounter />
                </div>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
                When Your Database{" "}
                <span className="text-gradient">Isn't SQL</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mb-8">
                A developer's journey from MongoDB chaos to seamless indexing—how indexing strategies work with custom storage backends. No SQL required.
              </p>
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 border border-border/50">
                  <Database className="h-4 w-4 text-blue-400" />
                  MongoDB, DynamoDB, Redis
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 border border-border/50">
                  <Zap className="h-4 w-4 text-green-400" />
                  All Strategies Work
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 border border-border/50">
                  <Code className="h-4 w-4 text-purple-400" />
                  One Interface
                </div>
              </div>
            </div>
          </section>

          {/* The Discovery */}
          <TheDiscovery />

          {/* Storage Comparison */}
          <StorageComparison />

          {/* Strategy Compatibility */}
          <StrategyCompatibility />

          {/* The Interface */}
          <TheInterface />

          {/* What You Implement */}
          <WhatYouImplement />

          {/* The Revelation */}
          <section className="mb-16 p-8 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/5 border border-primary/20 text-center">
            <Database className="h-16 w-16 text-primary mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-foreground mb-4">The Revelation</h3>
            <div className="max-w-2xl mx-auto space-y-4 text-muted-foreground">
              <p className="text-lg">
                "I thought indexing strategies were locked to SQL. That I'd have to migrate everything to PostgreSQL."
              </p>
              <p className="text-lg">
                "I was wrong. <span className="text-primary font-semibold">One interface. Four methods. That's it.</span>"
              </p>
              <p className="text-lg">
                "MongoDB? Works. DynamoDB? Works. Redis? Works. Whatever storage you have."
              </p>
              <p className="text-lg">
                "SYNC, ASYNC, BATCH, AUTO—all strategies work automatically. No assumptions about your database."
              </p>
              <p className="text-lg">
                "<span className="text-primary font-semibold">Your storage. Your choice. All strategies. Zero lock-in.</span>"
              </p>
              <p className="text-sm text-foreground italic font-semibold pt-4 border-t border-border/30">
                — Developer, after implementing MongoDB storage strategy in 30 minutes
              </p>
            </div>
          </section>

          {/* Bottom Line */}
          <section className="mb-16 p-8 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/5 border-2 border-primary/30">
            <h3 className="text-2xl font-bold text-foreground mb-6 text-center">The Bottom Line</h3>
            <div className="text-center space-y-6">
              <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30">
                  <p className="text-sm text-muted-foreground mb-1">Without Custom Storage</p>
                  <p className="text-xl font-bold text-red-400">SQL Only</p>
                </div>
                <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30">
                  <p className="text-sm text-muted-foreground mb-1">With Custom Storage</p>
                  <p className="text-xl font-bold text-green-400">Any Storage</p>
                </div>
              </div>
              <div className="flex flex-wrap justify-center gap-2 mt-6">
                {["MongoDB", "DynamoDB", "Redis", "Cassandra", "Your Choice"].map((storage, i) => (
                  <span key={i} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
                    ✓ {storage}
                  </span>
                ))}
              </div>
              <p className="text-foreground font-semibold mt-6">
                One interface. Four methods. All indexing strategies. Your storage backend.
              </p>
            </div>
          </section>

          {/* Story Navigation */}


          <StoryNavigation className="mt-12" />



          {/* Footer */}
          <footer className="border-t border-border/50 pt-12 mt-12 flex flex-col items-center gap-6">
            <div className="flex items-center gap-4">
              <StoryLoveButton storySlug="custom-storage-indexing-story" />
              <PageViewCounter />
            </div>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link 
                to="/docs/indexing_story" 
                className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
              >
                <FileCode className="h-4 w-4" />
                View Indexing Strategies
              </Link>
              <Link 
                to="/docs/storage_story" 
                className="inline-flex items-center gap-2 px-6 py-2 rounded-full border border-border bg-card text-foreground font-medium hover:bg-muted transition-colors"
              >
                View Storage Strategies
              </Link>
            </div>
            <p className="text-xs text-muted-foreground text-center max-w-md">
              Part of the AI Fabric Framework series — where your storage choice doesn't limit your indexing strategies
            </p>
          </footer>
        </motion.article>
      </div>
    </DocsLayout>
  );
};

export default CustomStorageIndexingStory;

