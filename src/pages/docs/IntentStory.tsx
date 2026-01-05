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
  MessageSquare, 
  Brain, 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  Zap,
  Code,
  Target,
  Shield,
  Search,
  Layers
} from "lucide-react";
import intentStoryContent from "@/content/Intent-Action-Story-SHORT.md?raw";

const PAGE_TITLE = "Intent Extraction: When 'Cancel my subscription' Becomes Code - AI Fabric Framework";
const PAGE_DESCRIPTION = "How we taught AI to understand what users want and route to the right action—no if/else spaghetti, just elegant delegation.";
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

// Intent Flow Diagram
const IntentFlowDiagram = () => {
  const [activeStep, setActiveStep] = useState(0);
  
  const steps = [
    { label: "User Message", icon: MessageSquare, color: "bg-blue-500" },
    { label: "LLM Analysis", icon: Brain, color: "bg-purple-500" },
    { label: "Intent Extract", icon: Target, color: "bg-amber-500" },
    { label: "Route Action", icon: Zap, color: "bg-green-500" },
    { label: "Execute", icon: Code, color: "bg-primary" },
  ];
  
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="my-8 p-6 rounded-xl bg-card border border-border/50">
      <h3 className="text-lg font-bold text-foreground mb-6 text-center">Intent Extraction Flow</h3>
      <div className="flex flex-wrap justify-center items-center gap-2 md:gap-4">
        {steps.map((step, i) => (
          <div key={i} className="flex items-center gap-2 md:gap-4">
            <motion.div
              animate={{
                scale: activeStep === i ? 1.15 : 1,
                opacity: activeStep >= i ? 1 : 0.4,
              }}
              className={`flex flex-col items-center gap-2 p-3 rounded-lg ${activeStep === i ? 'bg-primary/20 ring-2 ring-primary/50' : 'bg-muted/30'}`}
            >
              <div className={`p-2 rounded-full ${step.color}`}>
                <step.icon className="h-4 w-4 text-white" />
              </div>
              <span className="text-[10px] text-center text-muted-foreground max-w-[70px]">{step.label}</span>
            </motion.div>
            {i < steps.length - 1 && (
              <motion.div animate={{ opacity: activeStep > i ? 1 : 0.3 }}>
                <ArrowRight className="h-3 w-3 text-muted-foreground hidden md:block" />
              </motion.div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// Four Intent Types
const FourIntentTypes = () => {
  const intentTypes = [
    {
      type: "ACTION",
      title: "Do Something",
      desc: "Execute business operation",
      example: '"Cancel my subscription"',
      icon: Zap,
      color: "text-amber-400",
      borderColor: "border-amber-500/30",
      bgColor: "bg-amber-500/5"
    },
    {
      type: "INFORMATION",
      title: "Find Something",
      desc: "Search/retrieve data",
      example: '"What is your return policy?"',
      icon: Search,
      color: "text-blue-400",
      borderColor: "border-blue-500/30",
      bgColor: "bg-blue-500/5"
    },
    {
      type: "OUT_OF_SCOPE",
      title: "Beyond Boundaries",
      desc: "Not supported",
      example: '"What is the weather?"',
      icon: XCircle,
      color: "text-red-400",
      borderColor: "border-red-500/30",
      bgColor: "bg-red-500/5"
    },
    {
      type: "COMPOUND",
      title: "Multiple Things",
      desc: "Multiple intents",
      example: '"Cancel and refund me"',
      icon: Layers,
      color: "text-purple-400",
      borderColor: "border-purple-500/30",
      bgColor: "bg-purple-500/5"
    }
  ];

  return (
    <div className="my-8">
      <h3 className="text-xl font-bold text-foreground mb-6 text-center">The 4 Intent Types</h3>
      <div className="grid md:grid-cols-2 gap-4">
        {intentTypes.map((intent, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            viewport={{ once: true }}
            className={`p-5 rounded-xl border ${intent.borderColor} ${intent.bgColor}`}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-muted/50">
                <intent.icon className={`h-5 w-5 ${intent.color}`} />
              </div>
              <div>
                <h4 className={`font-bold ${intent.color}`}>{intent.type}</h4>
                <p className="text-xs text-muted-foreground">{intent.title}</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-3">{intent.desc}</p>
            <div className="p-2 rounded bg-muted/30 border border-border/30">
              <p className={`text-sm font-mono ${intent.color}`}>{intent.example}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const IntentStory = () => {
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

    const absoluteOgImage = `${window.location.origin}${OG_IMAGE}`;
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
          <section className="relative overflow-hidden border-b border-border/50 mb-12">
            <div className="absolute inset-0 bg-gradient-glow opacity-50" />
            <div className="py-12 relative">
              <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                    <span className="text-2xl">🧠</span>
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
                  <StoryLoveButton storySlug="intent_story" />
                  <PageViewCounter />
                </div>
              </div>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl"
              >
                <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
                  Intent Extraction:{" "}
                  <span className="text-gradient">From If/Else Hell to Elegance</span>
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl mb-8">
                  How we taught AI to understand what users want and route to the right action—no if/else spaghetti, just elegant delegation.
                </p>
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2 text-sm text-accent">
                    <Brain className="h-4 w-4" />
                    LLM-Powered
                  </div>
                  <div className="flex items-center gap-2 rounded-full bg-secondary/10 px-4 py-2 text-sm text-secondary">
                    <Shield className="h-4 w-4" />
                    95%+ Accuracy
                  </div>
                  <div className="flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm text-primary">
                    <Zap className="h-4 w-4" />
                    Zero If/Else
                  </div>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Intent Flow Diagram */}
          <IntentFlowDiagram />

          {/* Four Intent Types */}
          <FourIntentTypes />

          {/* Markdown Content */}
          <section className="mb-12">
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ node, inline, className, children, ...props }: any) {
                    const match = /language-(\w+)/.exec(className || "");
                    return !inline && match ? (
                      <CodeBlock className={className || ""}>{String(children).replace(/\n$/, "")}</CodeBlock>
                    ) : (
                      <code className="bg-muted px-1.5 py-0.5 rounded text-primary text-sm" {...props}>
                        {children}
                      </code>
                    );
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
                  hr: () => <hr className="border-border my-8" />,
                }}
              >
                {intentStoryContent}
              </ReactMarkdown>
            </div>
          </section>

          {/* CTA Section */}
          <section className="mb-12 rounded-2xl border border-primary/30 bg-primary/5 p-8 text-center">
            <h2 className="mb-4 text-2xl font-bold text-foreground">
              Ready to Build Your Own Intent System?
            </h2>
            <p className="mb-6 text-muted-foreground">
              Start using AI Fabric Framework to extract intents and route actions elegantly.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/docs/guides/intent"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-lg"
              >
                Read Full Guide
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/docs/intent_story_v2"
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-6 py-3 font-semibold text-foreground transition-all hover:border-primary/50 hover:bg-primary/5"
              >
                Read Narrative Version
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </section>

          {/* Story Navigation */}
          <StoryNavigation className="mt-12" />

          {/* Footer */}
          <footer className="border-t border-border/50 pt-8 mt-12">
            <div className="flex flex-col items-center gap-4">
              <StoryLoveButton storySlug="intent_story" />
              <p className="text-sm text-muted-foreground text-center">
                Part of the AI Fabric Framework series — under active development for Q1 2026
              </p>
            </div>
          </footer>
        </motion.article>
      </div>
    </DocsLayout>
  );
};

export default IntentStory;
