import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Highlight, themes } from "prism-react-renderer";
import DocsLayout from "@/components/docs/DocsLayout";
import PageViewCounter from "@/components/PageViewCounter";
import StoryLoveButton from "@/components/StoryLoveButton";
import StoryNavigation from "@/components/StoryNavigation";
import { 
  BookOpen,
  Search,
  XCircle,
  CheckCircle2,
  MessageSquare,
  Clock,
  Users,
  FileText,
  HelpCircle,
  Ticket,
  TrendingDown,
  TrendingUp,
  DollarSign,
  Zap,
  Brain,
  Lightbulb,
  ThumbsUp,
  Eye
} from "lucide-react";

const PAGE_TITLE = "Enterprise Knowledge Management: When 'Password Reset' Finally Finds 'Account Recovery'";
const PAGE_DESCRIPTION = "How we cut support ticket volume by 60% with semantic search across 5,000+ documents.";

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

// Slack Thread Recreation
const SlackThread = () => {
  const [showAll, setShowAll] = useState(false);
  
  const messages = [
    { user: "Sarah", time: "10:32 AM", message: "Anyone know how to reset a user's password? Customer locked out.", avatar: "S", color: "bg-blue-500" },
    { user: "Mike", time: "10:34 AM", message: "I think there's a doc somewhere... lemme check", avatar: "M", color: "bg-green-500" },
    { user: "Sarah", time: "10:47 AM", message: "Still looking. Customer getting impatient 😬", avatar: "S", color: "bg-blue-500" },
    { user: "Kevin", time: "10:52 AM", message: 'Found it! KB-2847 "Account Recovery Steps"', avatar: "K", color: "bg-purple-500" },
    { user: "Sarah", time: "10:53 AM", message: 'Why didn\'t search find that?? I searched "password reset"', avatar: "S", color: "bg-blue-500" },
    { user: "Kevin", time: "10:55 AM", message: 'Because it\'s titled "Account Recovery" not "Password Reset" 🤷', avatar: "K", color: "bg-purple-500" },
  ];

  return (
    <div className="my-12 p-6 rounded-2xl bg-[#1a1d21] border border-[#383a3d]">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#383a3d]">
        <span className="text-white font-bold"># engineering-support</span>
      </div>
      
      <div className="space-y-4">
        {messages.slice(0, showAll ? messages.length : 3).map((msg, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="flex gap-3"
          >
            <div className={`w-9 h-9 rounded ${msg.color} flex items-center justify-center text-white font-bold text-sm shrink-0`}>
              {msg.avatar}
            </div>
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-white font-bold text-sm">{msg.user}</span>
                <span className="text-[#ababad] text-xs">{msg.time}</span>
              </div>
              <p className="text-[#d1d2d3] text-sm">{msg.message}</p>
            </div>
          </motion.div>
        ))}
      </div>
      
      {!showAll && (
        <button
          onClick={() => setShowAll(true)}
          className="mt-4 text-[#1d9bd1] text-sm hover:underline"
        >
          Show more messages...
        </button>
      )}
      
      {showAll && (
        <div className="mt-6 p-4 rounded-lg bg-red-500/10 border border-red-500/30">
          <p className="text-red-400 text-sm font-semibold">
            ⏱️ Time wasted: 23 minutes | Customer wait time: 23 minutes | Resolution time (once found): 2 minutes
          </p>
        </div>
      )}
    </div>
  );
};

// Search Results Comparison
const SearchComparison = () => {
  const [mode, setMode] = useState<"keyword" | "semantic">("keyword");
  
  const keywordResults = [
    { title: "Password Reset Policy", type: "HR Document", match: false, desc: "Policy about password complexity requirements" },
    { title: "Reset Factory Defaults", type: "Hardware Guide", match: false, desc: "How to reset hardware to factory settings" },
  ];
  
  const semanticResults = [
    { title: "Account Recovery Steps", type: "KB Article", match: true, rating: 4.9, views: 12847, similarity: 94 },
    { title: "User can't login after password change", type: "Ticket #4521", match: true, resolved: true, time: "15min", similarity: 91 },
    { title: "Locked out after multiple failed attempts", type: "Ticket #3892", match: true, resolved: true, time: "8min", similarity: 89 },
    { title: "User Authentication Troubleshooting", type: "Runbook", match: true, team: "Support", similarity: 87 },
  ];

  return (
    <div className="my-12 p-8 rounded-2xl bg-card border border-border/50">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
          <Search className="h-5 w-5 text-primary" />
          Search: "password reset"
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
            Keyword Search
          </button>
          <button
            onClick={() => setMode("semantic")}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              mode === "semantic"
                ? "bg-green-500/20 border-2 border-green-500/50 text-green-400"
                : "bg-muted/30 border border-border/50 text-muted-foreground"
            }`}
          >
            Semantic Search
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {mode === "keyword" ? (
          <motion.div
            key="keyword"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-4"
          >
            <div className="p-4 rounded-lg bg-red-500/5 border border-red-500/20">
              <p className="text-red-400 font-semibold mb-2">Results: 2 (irrelevant)</p>
              <p className="text-sm text-muted-foreground">
                ❌ Missing: "Account Recovery Steps" (the actual solution)
              </p>
            </div>
            {keywordResults.map((result, i) => (
              <div key={i} className="p-4 rounded-lg bg-muted/30 border border-border/30 opacity-60">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold text-foreground">{result.title}</h4>
                    <p className="text-xs text-muted-foreground">{result.type}</p>
                    <p className="text-sm text-muted-foreground mt-1">{result.desc}</p>
                  </div>
                  <XCircle className="h-5 w-5 text-red-400 shrink-0" />
                </div>
              </div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="semantic"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            <div className="p-4 rounded-lg bg-green-500/5 border border-green-500/20">
              <p className="text-green-400 font-semibold mb-2">Results: 23 (ranked by relevance)</p>
              <p className="text-sm text-muted-foreground">
                ✓ Found across KB articles, tickets, and runbooks
              </p>
            </div>
            {semanticResults.map((result, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="p-4 rounded-lg bg-green-500/5 border border-green-500/30"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-foreground">{result.title}</h4>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-muted/50 text-muted-foreground">
                        {result.type}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
                      {result.rating && (
                        <span className="flex items-center gap-1">
                          <ThumbsUp className="h-3 w-3" /> {result.rating}
                        </span>
                      )}
                      {result.views && (
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" /> {result.views.toLocaleString()} views
                        </span>
                      )}
                      {result.resolved && (
                        <span className="flex items-center gap-1 text-green-400">
                          <CheckCircle2 className="h-3 w-3" /> Resolved in {result.time}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-green-400">{result.similarity}%</div>
                    <div className="text-xs text-muted-foreground">match</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Support Assistant Mockup
const SupportAssistant = () => {
  const [step, setStep] = useState(0);
  
  const steps = [
    { label: "New Ticket", icon: Ticket },
    { label: "AI Analysis", icon: Brain },
    { label: "Similar Found", icon: Search },
    { label: "Solution Ready", icon: Lightbulb },
  ];

  return (
    <div className="my-12 p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 border border-border/50">
      <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
        <Brain className="h-5 w-5 text-primary" />
        Real-Time Support Assistant
      </h3>

      <div className="flex gap-2 mb-6">
        {steps.map((s, i) => (
          <button
            key={i}
            onClick={() => setStep(i)}
            className={`flex-1 p-3 rounded-lg transition-all ${
              step === i
                ? "bg-primary/20 border-2 border-primary/50"
                : step > i
                  ? "bg-green-500/10 border border-green-500/30"
                  : "bg-muted/30 border border-border/30"
            }`}
          >
            <s.icon className={`h-5 w-5 mx-auto mb-1 ${
              step === i ? "text-primary" : step > i ? "text-green-400" : "text-muted-foreground"
            }`} />
            <p className="text-xs font-medium text-muted-foreground">{s.label}</p>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {step === 0 && (
          <motion.div
            key="ticket"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-6 rounded-xl bg-card border border-border/50"
          >
            <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
              <Ticket className="h-4 w-4 text-primary" />
              NEW TICKET: "App crashes when uploading large files"
            </h4>
            <p className="text-sm text-muted-foreground">
              User reports: "Every time I try to upload a file over 50MB, the app freezes and then crashes. 
              This started happening after the last update."
            </p>
          </motion.div>
        )}
        
        {step === 1 && (
          <motion.div
            key="analysis"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-6 rounded-xl bg-card border border-border/50"
          >
            <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Brain className="h-4 w-4 text-primary animate-pulse" />
              AI Analyzing...
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-400" />
                <span className="text-muted-foreground">Extracted: "upload", "large files", "crashes"</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-400" />
                <span className="text-muted-foreground">Category: Technical / File Upload</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-400" />
                <span className="text-muted-foreground">Searching similar tickets and KB articles...</span>
              </div>
            </div>
          </motion.div>
        )}
        
        {step === 2 && (
          <motion.div
            key="similar"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-6 rounded-xl bg-card border border-border/50"
          >
            <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Search className="h-4 w-4 text-primary" />
              Similar Resolved Tickets Found
            </h4>
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-green-500/5 border border-green-500/30">
                <p className="font-medium text-foreground text-sm">#4521 - "Upload fails with OutOfMemory error"</p>
                <p className="text-xs text-green-400">94% match • Resolved in 2h 15m</p>
              </div>
              <div className="p-3 rounded-lg bg-green-500/5 border border-green-500/30">
                <p className="font-medium text-foreground text-sm">#4398 - "Large file upload timeout"</p>
                <p className="text-xs text-green-400">91% match • Resolved in 45m</p>
              </div>
            </div>
          </motion.div>
        )}
        
        {step === 3 && (
          <motion.div
            key="solution"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-6 rounded-xl bg-green-500/5 border border-green-500/30"
          >
            <h4 className="font-semibold text-green-400 mb-4 flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              Suggested Solution (Ready to Send)
            </h4>
            <div className="p-4 rounded-lg bg-card border border-border/30">
              <p className="text-sm text-foreground">
                "This appears to be a known issue with large file uploads. Based on similar tickets, the solution typically involves:
              </p>
              <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                <li>1. Increase JVM heap size to 2GB</li>
                <li>2. Increase upload timeout to 300s</li>
                <li>3. Configure nginx proxy_read_timeout</li>
              </ul>
              <p className="mt-2 text-sm text-foreground">
                Would you like me to send the detailed configuration guide?"
              </p>
            </div>
            <p className="mt-4 text-xs text-green-400">
              ✓ Agent time saved: 18 minutes • Customer wait: 3 minutes (instead of 45)
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Stats Grid
const StatsGrid = () => {
  const stats = [
    { before: "34%", after: "87%", label: "Search Success Rate", icon: Search, improvement: "+156%" },
    { before: "18.4 min", after: "3.2 min", label: "Time to Answer", icon: Clock, improvement: "-83%" },
    { before: "2,340", after: "936", label: "Tickets/Month", icon: Ticket, improvement: "-60%" },
    { before: "12%", after: "78%", label: "Knowledge Utilization", icon: BookOpen, improvement: "+550%" },
  ];

  return (
    <div className="my-12 grid md:grid-cols-2 gap-6">
      {stats.map((stat, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          viewport={{ once: true }}
          className="p-6 rounded-xl bg-card border border-border/50"
        >
          <div className="flex items-center gap-3 mb-4">
            <stat.icon className="h-6 w-6 text-primary" />
            <span className="font-semibold text-foreground">{stat.label}</span>
          </div>
          <div className="flex items-end justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Before</p>
              <p className="text-2xl font-bold text-red-400 line-through opacity-60">{stat.before}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">After</p>
              <p className="text-2xl font-bold text-green-400">{stat.after}</p>
            </div>
          </div>
          <div className="mt-4 p-2 rounded-lg bg-green-500/10 text-center">
            <span className="text-green-400 font-bold">{stat.improvement}</span>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

const AIAnnotationsEnterpriseKnowledgeStory = () => {
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
                  <BookOpen className="h-4 w-4" />
                  AI Annotations Story
                </span>
                <div className="flex items-center gap-3">
                  <StoryLoveButton storySlug="ai-annotations-enterprise-knowledge" />
                  <PageViewCounter />
                </div>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
                When "Password Reset" Finally Finds{" "}
                <span className="text-gradient">"Account Recovery"</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mb-8">
                How we cut support ticket volume by 60% with semantic search across 5,000+ documents—zero retraining, zero manual tagging.
              </p>
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 border border-border/50">
                  <FileText className="h-4 w-4 text-blue-400" />
                  5,000+ Documents
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 border border-border/50">
                  <TrendingDown className="h-4 w-4 text-green-400" />
                  -60% Tickets
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 border border-border/50">
                  <DollarSign className="h-4 w-4 text-amber-400" />
                  $2.2M/year Saved
                </div>
              </div>
            </div>
          </section>

          {/* The Knowledge Graveyard */}
          <section className="mb-12 p-8 rounded-2xl bg-red-500/5 border border-red-500/30">
            <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-3">
              <BookOpen className="h-6 w-6 text-red-400" />
              The Knowledge Graveyard
            </h2>
            <p className="text-muted-foreground mb-6">
              <strong className="text-foreground">Every enterprise has one.</strong>
            </p>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="p-4 rounded-lg bg-muted/30 border border-border/30">
                <p className="text-2xl font-bold text-foreground">5,000</p>
                <p className="text-sm text-muted-foreground">Support articles</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/30 border border-border/30">
                <p className="text-2xl font-bold text-foreground">2,000</p>
                <p className="text-sm text-muted-foreground">Closed tickets with solutions</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/30 border border-border/30">
                <p className="text-2xl font-bold text-foreground">$2.3M</p>
                <p className="text-sm text-muted-foreground">Cost to create</p>
              </div>
              <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30">
                <p className="text-2xl font-bold text-red-400">12%</p>
                <p className="text-sm text-red-400">Actually found when needed</p>
              </div>
            </div>
            <p className="text-foreground font-medium">
              The knowledge exists. Nobody can find it.
            </p>
          </section>

          {/* Slack Thread */}
          <SlackThread />

          {/* Search Comparison */}
          <SearchComparison />

          {/* Support Assistant */}
          <SupportAssistant />

          {/* The Solution Code */}
          <section className="mb-12">
            <h3 className="text-2xl font-bold text-foreground mb-6 text-center">
              The Code That Makes It Work
            </h3>
            <CodeBlock code={`@Entity
@AICapable(
    entityType = "kb-article",
    onCreateStrategy = IndexingStrategy.SYNC  // Searchable immediately
)
public class KnowledgeBaseArticle {
    
    @Id
    private Long id;
    
    @AISearchable   // "password reset" finds "Account Recovery Steps"
    private String title;
    
    @AISearchable   // Rich semantic content for deep matching
    @Column(columnDefinition = "TEXT")
    private String content;
    
    @AISearchable   // "I can't log in" finds related issues
    private String problemDescription;
    
    @AISearchable   // Solutions are searchable too!
    private String solution;
    
    @AIContext      // "Most helpful articles"
    private Double helpfulnessRating;
    
    @AIContext      // "Articles about billing"
    private String category;
    
    @AIContext      // "Who wrote this?"
    private String author;
    
    private String internalNotes;  // NOT in AI - internal only
}`} />
          </section>

          {/* Stats */}
          <StatsGrid />

          {/* The Revelation */}
          <section className="mb-16 p-8 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/5 border border-primary/20 text-center">
            <BookOpen className="h-16 w-16 text-primary mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-foreground mb-4">The Revelation</h3>
            <div className="max-w-2xl mx-auto space-y-4 text-muted-foreground">
              <p className="text-lg">
                "Our engineers spent 30% of their time searching for answers that already existed."
              </p>
              <p className="text-lg">
                "The document was there. It was titled 'Account Recovery'."
              </p>
              <p className="text-lg">
                "<span className="text-primary font-semibold">They searched 'password reset'. Keyword search didn't connect the dots.</span>"
              </p>
              <p className="text-lg">
                "Now they find it in 3 seconds. That's 12 hours/week back per engineer."
              </p>
            </div>
          </section>

          {/* Story Navigation */}
          <StoryNavigation className="mt-12" />

          {/* Footer */}
          <footer className="border-t border-border/50 pt-12 mt-12 flex flex-col items-center gap-6">
            <div className="flex items-center gap-4">
              <StoryLoveButton storySlug="ai-annotations-enterprise-knowledge" />
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
                to="/docs/ai-annotations-architect" 
                className="inline-flex items-center gap-2 px-6 py-2 rounded-full border border-border bg-card text-foreground font-medium hover:bg-muted transition-colors"
              >
                Next: Architect's Guide →
              </Link>
            </div>
            <p className="text-xs text-muted-foreground text-center max-w-md">
              Part of the AI Annotations Story Series — Enterprise Knowledge Management
            </p>
          </footer>
        </motion.article>
      </div>
    </DocsLayout>
  );
};

export default AIAnnotationsEnterpriseKnowledgeStory;
