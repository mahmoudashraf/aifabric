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
  FileCode,
  Sparkles,
  ChevronDown,
  AlertTriangle,
  Shield,
  Search,
  Target,
  Cpu
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

const IntentStory = () => {
  const [isExpanded, setIsExpanded] = useState(false);

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
    updateMeta('meta[property="og:image"]', "content", `${window.location.origin}${OG_IMAGE}`);
    updateMeta('meta[property="og:type"]', "content", "website");
    updateMeta('meta[property="og:url"]', "content", window.location.href);

    updateMeta('meta[name="twitter:title"]', "content", PAGE_TITLE);
    updateMeta('meta[name="twitter:description"]', "content", PAGE_DESCRIPTION);
    updateMeta('meta[name="twitter:image"]', "content", `${window.location.origin}${OG_IMAGE}`);
    updateMeta('meta[name="twitter:card"]', "content", "summary_large_image");

    updateCanonical(window.location.href);
  }, []);

  return (
    <DocsLayout>
      <div className="min-h-screen bg-background">
        {/* Top Navigation */}
        <StoryNavigation variant="compact" className="pt-6 mb-4" />

        {/* Hero Section */}
        <section className="relative overflow-hidden border-b border-border/50 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
          <div className="absolute inset-0 bg-gradient-glow opacity-30" />
          <div className="relative px-6 py-16">
            <div className="mx-auto max-w-4xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <div className="mb-4 flex items-center justify-center gap-2">
                  <Brain className="h-6 w-6 text-primary" />
                  <span className="text-sm font-medium uppercase tracking-wider text-primary">
                    Intent Extraction
                  </span>
                </div>
                <h1 className="mb-4 text-4xl font-bold text-foreground sm:text-5xl lg:text-6xl">
                  🧠 Intent Extraction Story
                </h1>
                <p className="mx-auto max-w-3xl text-lg text-muted-foreground sm:text-xl">
                  How we taught AI to understand what users want and route to the right action—no if/else spaghetti, just elegant delegation.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Content */}
        <section className="px-6 py-12">
          <div className="mx-auto max-w-4xl">
            {/* Intent Flow Diagram */}
            <IntentFlowDiagram />

            {/* Markdown Content */}
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || "");
                    return !inline && match ? (
                      <CodeBlock className={className || ""}>{String(children).replace(/\n$/, "")}</CodeBlock>
                    ) : (
                      <code className={className} {...props}>
                        {children}
                      </code>
                    );
                  },
                }}
              >
                {intentStoryContent}
              </ReactMarkdown>
            </div>

            {/* CTA Section */}
            <div className="mt-12 rounded-2xl border border-primary/30 bg-primary/5 p-8 text-center">
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
            </div>

            {/* Love Button & View Counter */}
            <div className="mt-8 flex items-center justify-center gap-6">
              <StoryLoveButton storySlug="intent_story" />
              <PageViewCounter pagePath="/docs/intent_story" />
            </div>
          </div>
        </section>

        {/* Story Navigation */}
        <section className="px-6 py-12 border-t border-border/50 bg-muted/30">
          <div className="mx-auto max-w-4xl">
            <StoryNavigation />
          </div>
        </section>
      </div>
    </DocsLayout>
  );
};

export default IntentStory;
