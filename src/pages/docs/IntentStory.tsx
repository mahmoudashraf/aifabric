import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Highlight, themes } from "prism-react-renderer";
import DocsLayout from "@/components/docs/DocsLayout";
import PageViewCounter from "@/components/PageViewCounter";
import StoryLoveButton from "@/components/StoryLoveButton";
import { 
  Brain,
  Zap,
  MessageSquare,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Settings,
  Shield,
  Layers,
  Code2,
  ChevronDown,
  Sparkles,
  Search,
  Target,
  Clock,
  ChevronRight,
  BookOpen
} from "lucide-react";

const PAGE_TITLE = "Intent Extraction: Teaching AI to Understand Users - AI Fabric Framework";
const PAGE_DESCRIPTION = "How to replace brittle if/else spaghetti with elegant LLM-powered intent routing and action delegation.";

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

const IntentTypesGrid = () => {
  const types = [
    { 
      title: "ACTION", 
      desc: "Do something (Cancel, Update, Request)", 
      icon: Zap, 
      color: "text-amber-400",
      example: '"Cancel my subscription"'
    },
    { 
      title: "INFORMATION", 
      desc: "Find something (Search, Policy, Orders)", 
      icon: Search, 
      color: "text-blue-400",
      example: '"What is your return policy?"'
    },
    { 
      title: "OUT_OF_SCOPE", 
      desc: "Graceful rejection for unsupported topics", 
      icon: XCircle, 
      color: "text-red-400",
      example: '"What is the weather?"'
    },
    { 
      title: "COMPOUND", 
      desc: "Multiple intents handled in sequence", 
      icon: Layers, 
      color: "text-purple-400",
      example: '"Cancel and refund me"'
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-8">
      {types.map((type, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          viewport={{ once: true }}
          className="p-5 rounded-xl bg-card border border-border/50 hover:border-primary/30 transition-all group"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className={`p-2 rounded-lg bg-muted/50 group-hover:bg-primary/10 transition-colors`}>
              <type.icon className={`h-5 w-5 ${type.color}`} />
            </div>
            <h4 className="font-bold text-foreground">{type.title}</h4>
          </div>
          <p className="text-sm text-muted-foreground mb-3">{type.desc}</p>
          <div className="text-xs font-mono bg-muted/30 p-2 rounded italic text-primary">
            {type.example}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

const FlowDiagram = () => {
  const steps = [
    { label: "User Input", sub: '"Cancel my plan"', icon: MessageSquare, color: "bg-blue-500" },
    { label: "Intent Extraction", sub: "LLM analyzes intent", icon: Brain, color: "bg-purple-500" },
    { label: "Routing", sub: "Find ActionHandler", icon: Target, color: "bg-amber-500" },
    { label: "Business Logic", sub: "Your service runs", icon: Settings, color: "bg-green-500" },
    { label: "Response", sub: "Clean JSON returned", icon: CheckCircle2, color: "bg-primary" },
  ];

  return (
    <div className="my-12 p-8 rounded-2xl bg-muted/30 border border-border/50 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4 opacity-5">
        <Sparkles className="h-24 w-24 text-primary" />
      </div>
      <h3 className="text-xl font-bold text-foreground mb-8 text-center">The Intent-to-Action Pipeline</h3>
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        {steps.map((step, i) => (
          <div key={i} className="flex flex-col md:flex-row items-center gap-4 flex-1">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col items-center text-center"
            >
              <div className={`w-12 h-12 rounded-xl ${step.color} flex items-center justify-center mb-3 shadow-lg`}>
                <step.icon className="h-6 w-6 text-white" />
              </div>
              <div className="text-sm font-bold text-foreground">{step.label}</div>
              <div className="text-[10px] text-muted-foreground mt-1">{step.sub}</div>
            </motion.div>
            {i < steps.length - 1 && (
              <div className="hidden md:block">
                <ChevronRight className="h-5 w-5 text-muted-foreground/30" />
              </div>
            )}
            {i < steps.length - 1 && (
              <div className="md:hidden">
                <ChevronDown className="h-5 w-5 text-muted-foreground/30" />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const IntentStory = () => {
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
                  <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                    <Brain className="h-4 w-4" />
                    Intent Extraction V1
                  </span>
                  <Link 
                    to="/docs/intent_story_v2"
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    View V2 (Narrative) →
                  </Link>
                </div>
                <div className="flex items-center gap-3">
                  <StoryLoveButton storySlug="intent-story" />
                  <PageViewCounter />
                </div>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
                Intent Extraction:{" "}
                <span className="text-gradient">Teaching AI to Understand Users</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mb-8">
                How we replaced 500 lines of brittle if/else spaghetti with elegant LLM-powered intent routing and action delegation.
              </p>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 border border-border/50">
                  <Zap className="h-4 w-4 text-amber-400" />
                  95% Accuracy
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 border border-border/50">
                  <Clock className="h-4 w-4 text-blue-400" />
                  Ship in Minutes
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 border border-border/50">
                  <Code2 className="h-4 w-4 text-green-400" />
                  Clean Architecture
                </div>
              </div>
            </div>
          </section>

          {/* The Problem */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
              <XCircle className="h-6 w-6 text-red-400" />
              The If/Else Monster
            </h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Traditional keyword matching is a developer's nightmare. One typo, one variation, or one unexpected phrase, and the system breaks.
            </p>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <p className="text-sm font-semibold text-red-400 mb-2">The Traditional Mess:</p>
                <CodeBlock code={`if (message.contains("cancel") && 
    (message.contains("subscription") || 
     message.contains("plan"))) {
    return handleCancel();
} else if (message.contains("refund")) {
    return handleRefund();
} // ... 500 lines more`} />
              </div>
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-red-500/5 border border-red-500/20">
                  <p className="text-sm text-foreground font-semibold mb-1">Brittle & Fragile</p>
                  <p className="text-xs text-muted-foreground">Fails on "Stop my billing" or "Unsubscribe me".</p>
                </div>
                <div className="p-4 rounded-lg bg-red-500/5 border border-red-500/20">
                  <p className="text-sm text-foreground font-semibold mb-1">Context-Blind</p>
                  <p className="text-xs text-muted-foreground">Can't understand sentiment or user history.</p>
                </div>
                <div className="p-4 rounded-lg bg-red-500/5 border border-red-500/20">
                  <p className="text-sm text-foreground font-semibold mb-1">Maintenance Nightmare</p>
                  <p className="text-xs text-muted-foreground">Adding one feature requires editing a giant monster function.</p>
                </div>
              </div>
            </div>
          </section>

          {/* The Solution */}
          <section className="mb-16 p-8 rounded-2xl bg-primary/5 border border-primary/20 relative">
            <div className="absolute top-4 right-4">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
              <CheckCircle2 className="h-6 w-6 text-green-400" />
              The AI Fabric Way
            </h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Let the LLM do what it does best: understand natural language. The framework then routes that understanding to your clean, isolated business logic.
            </p>
            
            <div className="grid lg:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">1</div>
                  <h3 className="font-bold text-foreground">One Orchestrator Call</h3>
                </div>
                <CodeBlock code={`@PostMapping("/api/chat")
public OrchestrationResult chat(@RequestBody String message) {
    // Framework handles everything: extraction, routing, security
    return orchestrator.orchestrate(message, context);
}`} />
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-white font-bold text-sm">2</div>
                  <h3 className="font-bold text-foreground">Clean Action Handlers</h3>
                </div>
                <CodeBlock code={`@Component
public class SubscriptionHandler implements ActionHandler {
    @Override
    public ActionResult executeAction(Map params, String userId) {
        // YOUR business logic here
        return service.cancel(userId);
    }
}`} />
              </div>
            </div>
          </section>

          {/* Intent Types */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-foreground mb-2 text-center">Understand Every Word</h2>
            <p className="text-muted-foreground text-center mb-8">Four powerful intent types that cover every user scenario.</p>
            <IntentTypesGrid />
          </section>

          {/* Flow Diagram */}
          <FlowDiagram />

          {/* Technical Implementation */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-foreground mb-6">What You Implement</h2>
            <p className="text-muted-foreground mb-8">
              Forget string parsing. Just implement the <code>ActionHandler</code> interface and focus on your business logic.
            </p>
            <div className="space-y-3">
              {[
                { title: "Metadata", desc: "Define name, description, and required parameters.", icon: Code2 },
                { title: "Permissions", desc: "Isolated validation: can this user perform this action?", icon: Shield },
                { title: "Confirmations", desc: "Natural language confirmation messages before execution.", icon: MessageSquare },
                { title: "Execution", desc: "The core business logic that actually gets things done.", icon: Zap },
                { title: "Error Handling", desc: "Graceful fallbacks and meaningful user feedback.", icon: XCircle },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 p-4 rounded-xl border border-border/50 bg-card/50">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <item.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground text-sm">{item.title}</h4>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                  <CheckCircle2 className="h-4 w-4 text-green-400 ml-auto" />
                </div>
              ))}
            </div>
          </section>

          {/* Business Impact */}
          <section className="mb-16 p-8 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/5 border border-primary/20">
            <h2 className="text-2xl font-bold text-foreground mb-6 text-center">The Bottom Line</h2>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-primary mb-2">90%</div>
                <div className="text-sm text-muted-foreground">Code Reduction</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2">100%</div>
                <div className="text-sm text-muted-foreground">Natural Language Support</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary mb-2">Sub-1s</div>
                <div className="text-sm text-muted-foreground">Intent Resolution</div>
              </div>
            </div>
            <p className="mt-8 text-center text-foreground font-medium italic">
              "Stop parsing strings. Start understanding intent. Ship elegant code."
            </p>
          </section>

          {/* Footer */}
          <footer className="border-t border-border/50 pt-12 mt-12 flex flex-col items-center gap-6">
            <StoryLoveButton storySlug="intent-story" />
            <div className="flex gap-4">
               <Link to="/docs/guides/intent" className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors">
                <BookOpen className="h-4 w-4" />
                Read Technical Guide
              </Link>
            </div>
            <p className="text-xs text-muted-foreground text-center max-w-md">
              Part of the AI Fabric Framework series — teaching machines to understand humans, one action at a time.
            </p>
          </footer>
        </motion.article>
      </div>
    </DocsLayout>
  );
};

export default IntentStory;

