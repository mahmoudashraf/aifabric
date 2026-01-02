import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Highlight, themes } from "prism-react-renderer";
import DocsLayout from "@/components/docs/DocsLayout";
import PageViewCounter from "@/components/PageViewCounter";
import StoryLoveButton from "@/components/StoryLoveButton";
import { 
  Database,
  Clock,
  Coffee,
  Moon,
  Sun,
  Zap,
  CheckCircle2,
  XCircle,
  Pause,
  Play,
  RotateCcw,
  ArrowRight,
  AlertTriangle,
  Heart,
  Laptop,
  Home,
  CalendarClock,
  Timer,
  Target,
  Shield,
  Settings,
  TrendingUp,
  FileCode,
  Sparkles,
  Activity
} from "lucide-react";

const PAGE_TITLE = "Indexing V2: The Weekend That Never Was - AI Fabric Framework";
const PAGE_DESCRIPTION = "A developer's journey from indexing nightmare to peaceful weekend—processing 10 million records for AI search with embeddings.";

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

const Timeline = () => {
  const [activeDay, setActiveDay] = useState<"friday" | "saturday" | "monday">("friday");
  
  const timelines = {
    friday: [
      { time: "5:00 PM", event: "CTO drops the bomb", icon: AlertTriangle, emoji: "💣", stress: "high" },
      { time: "5:15 PM", event: "Team panic meeting", icon: AlertTriangle, emoji: "😰", stress: "high" },
      { time: "5:30 PM", event: "Alex discovers AI Fabric", icon: Sparkles, emoji: "💡", stress: "medium" },
      { time: "6:00 PM", event: "Indexing job started", icon: Play, emoji: "🚀", stress: "low" },
      { time: "6:05 PM", event: "Alex goes home", icon: Home, emoji: "🏠", stress: "none" }
    ],
    saturday: [
      { time: "9:00 AM", event: "Alex wakes up naturally", icon: Coffee, emoji: "☕", stress: "none" },
      { time: "10:30 AM", event: "Checks progress: 45% done", icon: Activity, emoji: "📊", stress: "none" },
      { time: "2:00 PM", event: "Goes hiking with family", icon: Sun, emoji: "🏔️", stress: "none" },
      { time: "7:00 PM", event: "Quick check: 78% done", icon: CheckCircle2, emoji: "✨", stress: "none" },
      { time: "11:00 PM", event: "Sleeps peacefully", icon: Moon, emoji: "😴", stress: "none" }
    ],
    monday: [
      { time: "8:00 AM", event: "Arrives at office", icon: Laptop, emoji: "💻", stress: "none" },
      { time: "8:05 AM", event: "Indexing: COMPLETED", icon: CheckCircle2, emoji: "🎉", stress: "none" },
      { time: "8:10 AM", event: "10M records indexed for AI search", icon: Database, emoji: "✅", stress: "none" },
      { time: "8:30 AM", event: "Team celebrates", icon: Heart, emoji: "❤️", stress: "none" },
      { time: "9:00 AM", event: "Alex: Coffee, smiling", icon: Coffee, emoji: "😊", stress: "none" }
    ]
  };

  const getStressColor = (stress: string) => {
    switch(stress) {
      case "high": return "bg-red-500/20 border-red-500/30";
      case "medium": return "bg-yellow-500/20 border-yellow-500/30";
      case "low": return "bg-blue-500/20 border-blue-500/30";
      default: return "bg-green-500/20 border-green-500/30";
    }
  };

  return (
    <div className="my-12 p-8 rounded-2xl bg-muted/30 border border-border/50">
      <h3 className="text-xl font-bold text-foreground mb-6 text-center">The Weekend That Changed Everything</h3>
      
      <div className="flex gap-2 mb-6 justify-center">
        {[
          { key: "friday" as const, label: "Friday", emoji: "💣" },
          { key: "saturday" as const, label: "Saturday", emoji: "🏔️" },
          { key: "monday" as const, label: "Monday", emoji: "🎉" }
        ].map(day => (
          <button
            key={day.key}
            onClick={() => setActiveDay(day.key)}
            className={`px-4 py-2 rounded-lg font-semibold transition-all ${
              activeDay === day.key
                ? "bg-primary text-primary-foreground shadow-lg scale-105"
                : "bg-muted/50 text-muted-foreground hover:bg-muted"
            }`}
          >
            {day.emoji} {day.label}
          </button>
        ))}
      </div>
      
      <AnimatePresence mode="wait">
        <motion.div
          key={activeDay}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="space-y-3 min-h-[300px]"
        >
          {timelines[activeDay].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`flex items-center gap-4 p-4 rounded-lg border ${getStressColor(item.stress)}`}
            >
              <span className="text-2xl">{item.emoji}</span>
              <div className="flex-1">
                <p className="text-sm font-bold text-foreground">{item.event}</p>
                <p className="text-xs text-muted-foreground font-mono">{item.time}</p>
              </div>
              <item.icon className="h-5 w-5 text-primary shrink-0" />
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
      
      <div className="mt-6 text-center p-4 rounded-lg bg-green-500/10 border border-green-500/20">
        <p className="text-sm text-green-400 font-semibold">
          Total Alex's weekend stress level: <span className="text-xl">0%</span> 🎯
        </p>
      </div>
    </div>
  );
};

const CrashSimulator = () => {
  const [simStep, setSimStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  
  const steps = [
    { label: "Indexing starts", progress: 0, icon: Play, color: "text-blue-400" },
    { label: "Indexing: 2M/10M (20%)", progress: 20, icon: Activity, color: "text-blue-400" },
    { label: "Indexing: 4M/10M (40%)", progress: 40, icon: Activity, color: "text-blue-400" },
    { label: "Indexing: 6M/10M (60%)", progress: 60, icon: Activity, color: "text-purple-400" },
    { label: "💥 SERVER CRASH", progress: 60, icon: AlertTriangle, color: "text-red-400" },
    { label: "Server restarts...", progress: 60, icon: RotateCcw, color: "text-yellow-400" },
    { label: "Resume from checkpoint (6M)", progress: 60, icon: Play, color: "text-green-400" },
    { label: "Indexing: 8M/10M (80%)", progress: 80, icon: Activity, color: "text-green-400" },
    { label: "Indexing: 10M/10M (100%)", progress: 100, icon: CheckCircle2, color: "text-green-400" },
    { label: "✅ COMPLETED", progress: 100, icon: CheckCircle2, color: "text-green-400" }
  ];

  useEffect(() => {
    if (isRunning && simStep < steps.length - 1) {
      const timer = setTimeout(() => {
        setSimStep(prev => prev + 1);
      }, 1500);
      return () => clearTimeout(timer);
    } else if (simStep >= steps.length - 1) {
      setIsRunning(false);
    }
  }, [isRunning, simStep, steps.length]);

  return (
    <div className="my-12 p-8 rounded-2xl bg-gradient-to-br from-red-500/5 to-green-500/5 border border-border/50">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-red-400" />
          The Crash That Didn't Matter
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="p-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </button>
          <button
            onClick={() => { setSimStep(0); setIsRunning(false); }}
            className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="h-4 bg-muted/50 rounded-full overflow-hidden border border-border/30">
          <motion.div
            className={`h-full ${
              simStep === 4 ? 'bg-red-500' : 
              simStep >= 6 ? 'bg-green-500' : 
              'bg-blue-500'
            }`}
            initial={{ width: 0 }}
            animate={{ width: `${steps[simStep]?.progress || 0}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
        <p className="text-xs text-muted-foreground text-center mt-2">
          {steps[simStep]?.progress}% Complete
        </p>
      </div>
      
      {/* Current Step */}
      <div className="space-y-2 min-h-[250px]">
        <AnimatePresence mode="popLayout">
          {steps.slice(0, simStep + 1).map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className={`flex items-center gap-3 p-3 rounded-lg border ${
                i === 4 ? 'bg-red-500/10 border-red-500/30' :
                i >= 6 ? 'bg-green-500/10 border-green-500/30' :
                'bg-card/50 border-border/30'
              }`}
            >
              <step.icon className={`h-5 w-5 ${step.color}`} />
              <p className="text-sm text-foreground font-medium flex-1">{step.label}</p>
              {i === simStep && <Activity className="h-4 w-4 text-primary animate-pulse" />}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      
      {simStep >= steps.length - 1 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-6 p-4 rounded-lg bg-green-500/10 border border-green-500/30 text-center"
        >
          <p className="text-lg font-bold text-green-400">Zero Records Lost. Zero Re-processing.</p>
          <p className="text-xs text-muted-foreground mt-1">The checkpoint system saved 6 million records from being re-indexed and re-embedded</p>
        </motion.div>
      )}
    </div>
  );
};

const MigrationJourney = () => {
  const [activePhase, setActivePhase] = useState(0);
  
  const phases = [
    {
      title: "The Panic",
      subtitle: "Friday 5 PM",
      icon: AlertTriangle,
      color: "text-red-400",
      bgColor: "bg-red-500/5",
      borderColor: "border-red-500/30",
      content: {
        situation: "CTO: \"Index 8 million existing user records for AI search by Monday. Generate embeddings. No downtime.\"",
        thoughts: "\"That's 60 hours. Process each record: generate embedding, store in vector DB. One crash = game over. Weekend = gone.\"",
        oldWay: [
          "Write custom script to process each record",
          "Generate embeddings (OpenAI API calls)",
          "Store in vector database (Pinecone/Weaviate)",
          "If crashes at 6M → start from 0",
          "Monitor every hour all weekend",
          "Cancel family plans 😢"
        ]
      }
    },
    {
      title: "The Discovery",
      subtitle: "Friday 5:30 PM",
      icon: Sparkles,
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/5",
      borderColor: "border-yellow-500/30",
      content: {
        situation: "Alex finds AI Fabric Framework documentation",
        thoughts: "\"Wait... pause/resume? Checkpoint recovery? This sounds too good to be true.\"",
        newWay: [
          "One method call to start",
          "Go home immediately",
          "Checkpoints auto-saved every batch",
          "If crashes → resume from checkpoint",
          "Weekend saved! 🎉"
        ]
      }
    },
    {
      title: "The Implementation",
      subtitle: "Friday 6:00 PM",
      icon: Laptop,
      color: "text-blue-400",
      bgColor: "bg-blue-500/5",
      borderColor: "border-blue-500/30",
      content: {
        situation: "15 minutes of coding. That's it.",
        thoughts: "\"If this actually works, I'm buying the team pizza.\"",
        code: `// Index existing user data for AI search
MigrationJob job = migrationService.startMigration(
    MigrationRequest.builder()
        .entityType("user-profile")  // Existing entities in DB
        .batchSize(2000)              // Process 2000 at a time
        .rateLimit(500)                // 500/min = production-safe
        .build()
);

// What this does:
// 1. Reads existing user records from database
// 2. Generates embeddings (vector representations)
// 3. Stores in vector database for AI search
// 4. Makes them searchable via semantic search

System.out.println("Job ID: " + job.getId());
System.out.println("Total records to index: " + job.getTotalEntities());

// That's it. Go home.`
      }
    },
    {
      title: "The Weekend",
      subtitle: "Saturday & Sunday",
      icon: Home,
      color: "text-green-400",
      bgColor: "bg-green-500/5",
      borderColor: "border-green-500/30",
      content: {
        situation: "Alex actually enjoys the weekend",
        thoughts: "\"I keep checking my phone. Embeddings are being generated. Records are being indexed. No errors. This is surreal.\"",
        activities: [
          "Saturday morning: Hiking ⛰️",
          "Saturday evening: Family dinner 🍽️",
          "Sunday: Actual rest 😴",
          "Random checks: Progress looks good ✅",
          "Sleep: 16 hours recovered 🌙"
        ]
      }
    },
    {
      title: "The Victory",
      subtitle: "Monday 8 AM",
      icon: CheckCircle2,
      color: "text-primary",
      bgColor: "bg-primary/5",
      borderColor: "border-primary/30",
      content: {
        situation: "Migration status: COMPLETED",
        thoughts: "\"I actually slept this weekend. And it worked. This is the future.\"",
        results: [
          "8,000,000 records indexed for AI search ✅",
          "8,000,000 embeddings generated ✅",
          "Success rate: 99.987% ✅",
          "Downtime: 0 seconds ✅",
          "Alex's weekend: Saved ✅",
          "Team morale: Through the roof 🚀"
        ]
      }
    }
  ];

  return (
    <div className="my-16">
      <h3 className="text-2xl font-bold text-foreground mb-8 text-center">Alex's Journey: From Panic to Peace</h3>
      
      {/* Phase Tabs */}
      <div className="flex flex-wrap gap-2 mb-6 justify-center">
        {phases.map((phase, i) => (
          <button
            key={i}
            onClick={() => setActivePhase(i)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-semibold transition-all ${
              activePhase === i
                ? `${phase.bgColor} ${phase.borderColor} border-2 shadow-lg`
                : "bg-muted/30 border border-border/50 text-muted-foreground hover:border-border"
            }`}
          >
            <phase.icon className={`h-4 w-4 ${activePhase === i ? phase.color : 'text-muted-foreground'}`} />
            <span className={activePhase === i ? 'text-foreground' : ''}>{phase.title}</span>
          </button>
        ))}
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
              <p className="text-sm text-muted-foreground italic">"{phases[activePhase].content.situation}"</p>
            </div>
            
            <div>
              <p className="text-sm font-semibold text-foreground mb-2">Alex's Thoughts:</p>
              <p className="text-sm text-muted-foreground italic">"{phases[activePhase].content.thoughts}"</p>
            </div>
            
            {phases[activePhase].content.oldWay && (
              <div>
                <p className="text-sm font-semibold text-red-400 mb-2">The Old Nightmare:</p>
                <ul className="space-y-1">
                  {phases[activePhase].content.oldWay.map((item, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                      <XCircle className="h-3 w-3 text-red-400 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {phases[activePhase].content.newWay && (
              <div>
                <p className="text-sm font-semibold text-green-400 mb-2">The AI Fabric Way:</p>
                <ul className="space-y-1">
                  {phases[activePhase].content.newWay.map((item, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                      <CheckCircle2 className="h-3 w-3 text-green-400 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {phases[activePhase].content.code && (
              <CodeBlock code={phases[activePhase].content.code} />
            )}
            
            {phases[activePhase].content.activities && (
              <div>
                <p className="text-sm font-semibold text-green-400 mb-2">What Alex Did:</p>
                <ul className="space-y-1">
                  {phases[activePhase].content.activities.map((item, i) => (
                    <li key={i} className="text-sm text-muted-foreground">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            
            {phases[activePhase].content.results && (
              <div>
                <p className="text-sm font-semibold text-primary mb-2">The Results:</p>
                <ul className="space-y-1">
                  {phases[activePhase].content.results.map((item, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                      <CheckCircle2 className="h-3 w-3 text-green-400 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const SuperpowersShowcase = () => {
  const superpowers = [
    {
      title: "Pause/Resume/Cancel",
      icon: Pause,
      color: "text-blue-400",
      story: "Production spike at 2 PM? Hit pause. Job stops gracefully. Resume at midnight. Continues from exact spot.",
      code: `// Graceful control
migrationService.pauseMigration(jobId);
// Job finishes current batch, saves checkpoint, stops

migrationService.resumeMigration(jobId);
// Continues from saved checkpoint`
    },
    {
      title: "Checkpoint Recovery",
      icon: RotateCcw,
      color: "text-green-400",
      story: "Server crashes at 6M records? Resume. Skips to record 6,000,001. Zero re-indexing. Zero re-embedding. Your team sleeps better.",
      code: `// Crash at 2:30 AM after indexing 6M records
MigrationJob job = jobRepo.findById(jobId);
job.getCurrentPage(); // 3000 (checkpoint!)

// After restart
migrationService.resumeMigration(jobId);
// Starts from page 3000, not 0
// Skips already-indexed records ✅`
    },
    {
      title: "Real-Time ETA",
      icon: Timer,
      color: "text-purple-400",
      story: "Like your food delivery app, but for data. Accurate predictions based on actual speed, not guesses.",
      code: `MigrationProgress p = migrationService.getProgress(jobId);

System.out.println(p.getPercentComplete());  // 47.3%
System.out.println(p.getEstimatedTimeRemaining()); // "4h 23m"
// Updates in real-time based on actual processing speed`
    },
    {
      title: "Smart Filtering",
      icon: Target,
      color: "text-amber-400",
      story: "Don't index everything. Date ranges, specific IDs, custom logic. Index only what matters for AI search.",
      code: `// Only index VIP customers from last 90 days
MigrationRequest.builder()
    .entityType("user-profile")
    .filters(MigrationFilters.builder()
        .entityIds(vipCustomerIds)
        .createdAfter(LocalDate.now().minusDays(90))
        .build())
    .build()
// Processes only matching records for embedding generation`
    },
    {
      title: "Deduplication",
      icon: Shield,
      color: "text-cyan-400",
      story: "Already indexed? Skip it. Don't waste API calls generating embeddings again. Don't re-process. Save time and money.",
      code: `// Automatically skips already-indexed entities
if (alreadyIndexed(entityType, entityId)) {
    continue;  // Skip - embedding already exists in vector DB
}

// Force re-index when needed (e.g., embedding model upgrade)
.reindexExisting(true)  // Re-generate embeddings for all records`
    },
    {
      title: "Rate Limiting",
      icon: Settings,
      color: "text-pink-400",
      story: "Production safety first. Control throughput. Database stays happy. Users stay happy. You stay employed.",
      code: `// Off-hours: Fast
.rateLimit(1200)  // 1200/min = 20/sec

// Business hours: Safe
.rateLimit(100)   // 100/min = 1.6/sec
// Production unaffected ✅`
    }
  ];

  return (
    <div className="my-16">
      <h3 className="text-2xl font-bold text-foreground mb-8 text-center">The 6 Superpowers That Saved Alex's Weekend</h3>
      <div className="space-y-6">
        {superpowers.map((power, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            viewport={{ once: true }}
            className="p-6 rounded-xl bg-card border border-border/50 hover:border-primary/30 transition-all"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                <power.icon className={`h-6 w-6 ${power.color}`} />
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-bold text-foreground mb-1">{power.title}</h4>
                <p className="text-sm text-muted-foreground italic">"{power.story}"</p>
              </div>
            </div>
            <CodeBlock code={power.code} />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const RealWorldComparison = () => {
  return (
    <div className="my-16 grid lg:grid-cols-2 gap-8">
      {/* Traditional Way */}
      <div className="p-8 rounded-2xl bg-red-500/5 border-2 border-red-500/30">
        <div className="flex items-center gap-3 mb-6">
          <XCircle className="h-8 w-8 text-red-400" />
          <h4 className="text-xl font-bold text-foreground">The Traditional Nightmare</h4>
        </div>
        
        <div className="space-y-4 text-sm">
          <div className="flex items-start gap-3">
            <Clock className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-foreground">Friday 6 PM</p>
              <p className="text-muted-foreground">Start custom script to process records. Generate embeddings. Fingers crossed. 🤞</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <Moon className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-foreground">Saturday 2 AM</p>
              <p className="text-muted-foreground">Wake up to check. Can't sleep anyway.</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-foreground">Sunday 3 AM</p>
              <p className="text-muted-foreground">Script crashes at 6M. 6M embeddings lost. START OVER. 😭</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <XCircle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-foreground">Monday 8 AM</p>
              <p className="text-muted-foreground">Still running. Not done. CTO unhappy. Team stressed.</p>
            </div>
          </div>
        </div>
        
        <div className="mt-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-center">
          <p className="text-red-400 font-bold">Weekend Destroyed: ∞</p>
          <p className="text-xs text-muted-foreground mt-1">Success Rate: Questionable</p>
        </div>
      </div>
      
      {/* AI Fabric Way */}
      <div className="p-8 rounded-2xl bg-green-500/5 border-2 border-green-500/30">
        <div className="flex items-center gap-3 mb-6">
          <CheckCircle2 className="h-8 w-8 text-green-400" />
          <h4 className="text-xl font-bold text-foreground">The AI Fabric Way</h4>
        </div>
        
        <div className="space-y-4 text-sm">
          <div className="flex items-start gap-3">
            <Play className="h-5 w-5 text-green-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-foreground">Friday 6:15 PM</p>
              <p className="text-muted-foreground">Job started. Go home immediately. 🏠</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <Home className="h-5 w-5 text-green-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-foreground">Saturday</p>
              <p className="text-muted-foreground">Family time. Hiking. Actual relaxation. 😊</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <Moon className="h-5 w-5 text-green-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-foreground">Sunday</p>
              <p className="text-muted-foreground">Sleep. Job running smoothly in background.</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-green-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-foreground">Monday 8 AM</p>
              <p className="text-muted-foreground">COMPLETED. 8M records indexed. 8M embeddings generated. 99.9% success. ✨</p>
            </div>
          </div>
        </div>
        
        <div className="mt-6 p-4 rounded-lg bg-green-500/10 border border-green-500/20 text-center">
          <p className="text-green-400 font-bold">Weekend Saved: 1</p>
          <p className="text-xs text-muted-foreground mt-1">Sleep Recovered: 16 hours</p>
        </div>
      </div>
    </div>
  );
};

const MigrationStoryV2 = () => {
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
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
            <div className="relative">
              <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-2 text-sm font-medium text-accent">
                    <Database className="h-4 w-4" />
                    Indexing V2
                  </span>
                  <Link 
                    to="/docs/migration_story"
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    ← View V1
                  </Link>
                </div>
                <div className="flex items-center gap-3">
                  <StoryLoveButton storySlug="migration-story-v2" />
                  <PageViewCounter />
                </div>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
                The Weekend That{" "}
                <span className="text-gradient">Never Was</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mb-8">
                A story about Alex, who was told to index 8 million existing records for AI search over the weekend—processing them to generate embeddings and store in a vector database. They discovered a framework that let them actually enjoy the weekend.
              </p>
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 border border-border/50">
                  <Database className="h-4 w-4 text-blue-400" />
                  10M+ Indexed
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 border border-border/50">
                  <Timer className="h-4 w-4 text-green-400" />
                  Zero Downtime
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 border border-border/50">
                  <Coffee className="h-4 w-4 text-amber-400" />
                  Weekend Saved
                </div>
              </div>
            </div>
          </section>

          {/* Clarification Box */}
          <section className="mb-12 p-6 rounded-xl bg-blue-500/10 border-2 border-blue-500/30">
            <div className="flex items-start gap-4">
              <Database className="h-6 w-6 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <h3 className="text-lg font-bold text-foreground mb-2">What This Story Is About</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  This is <strong className="text-foreground">NOT about migrating data between databases</strong>. This is about:
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 mt-0.5">•</span>
                    <span><strong className="text-foreground">Indexing existing data</strong> that's already in your database (users, products, etc.)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 mt-0.5">•</span>
                    <span><strong className="text-foreground">Generating embeddings</strong> (vector representations) for AI search</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 mt-0.5">•</span>
                    <span><strong className="text-foreground">Storing in vector databases</strong> (Pinecone, Weaviate, etc.) to enable semantic search</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-400 mt-0.5">•</span>
                    <span>Making your existing data <strong className="text-foreground">searchable via AI</strong> without moving it anywhere</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Timeline */}
          <Timeline />

          {/* Journey */}
          <MigrationJourney />

          {/* Crash Simulator */}
          <CrashSimulator />

          {/* Superpowers */}
          <SuperpowersShowcase />

          {/* Real World Comparison */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
              Two Developers. Same Task. Different Outcomes.
            </h2>
            <RealWorldComparison />
          </section>

          {/* The Revelation */}
          <section className="mb-16 p-8 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/5 border border-primary/20 text-center">
            <Moon className="h-16 w-16 text-primary mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-foreground mb-4">The Revelation</h3>
            <div className="max-w-2xl mx-auto space-y-4 text-muted-foreground">
              <p className="text-lg">
                "For years, I thought indexing millions of records for AI search had to be stressful."
              </p>
              <p className="text-lg">
                "That weekends had to be sacrificed. That sleep was optional."
              </p>
              <p className="text-lg">
                "Then I learned: <span className="text-primary font-semibold">processing existing data for embeddings doesn't fail because of complexity. It fails because of lack of infrastructure.</span>"
              </p>
              <p className="text-lg">
                "Checkpoints. Pause/resume. Rate limiting. ETA tracking."
              </p>
              <p className="text-lg">
                "<span className="text-primary font-semibold">These aren't luxuries. They're necessities.</span>"
              </p>
              <p className="text-sm text-foreground italic font-semibold pt-4 border-t border-border/30">
                — Alex, Sunday morning, from a hiking trail, checking their phone: "99% complete ✅"
              </p>
            </div>
          </section>

          {/* Bottom Line */}
          <section className="mb-16 p-8 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/5 border-2 border-primary/30">
            <h3 className="text-2xl font-bold text-foreground mb-6 text-center">The Numbers Tell the Story</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { value: "10M+", label: "Records Indexed", icon: Database },
                { value: "99.9%", label: "Success Rate", icon: Target },
                { value: "0", label: "Weekends Lost", icon: CalendarClock },
                { value: "16hrs", label: "Sleep Recovered", icon: Moon }
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
          </section>

          {/* Footer */}
          <footer className="border-t border-border/50 pt-12 mt-12 flex flex-col items-center gap-6">
            <div className="flex items-center gap-4">
              <StoryLoveButton storySlug="migration-story-v2" />
              <PageViewCounter />
            </div>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link 
                to="/docs/guides/migration" 
                className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
              >
                <FileCode className="h-4 w-4" />
                Read Technical Guide
              </Link>
              <Link 
                to="/docs/migration_story" 
                className="inline-flex items-center gap-2 px-6 py-2 rounded-full border border-border bg-card text-foreground font-medium hover:bg-muted transition-colors"
              >
                View V1 (Technical)
              </Link>
            </div>
            <p className="text-xs text-muted-foreground text-center max-w-md">
              Part of the AI Fabric Framework series — where technology saves weekends
            </p>
          </footer>
        </motion.article>
      </div>
    </DocsLayout>
  );
};

export default MigrationStoryV2;

