import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Sparkles,
  Brain,
  TrendingUp,
  CheckCircle2,
  Lightbulb,
  Target,
  Zap,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Highlight, themes } from "prism-react-renderer";
import { useEffect, useState } from "react";
import DocsLayout from "@/components/docs/DocsLayout";
import PageViewCounter from "@/components/PageViewCounter";
import StoryLoveButton from "@/components/StoryLoveButton";
import StoryNavigation from "@/components/StoryNavigation";

const PAGE_TITLE = "Smart Suggestions - When AI Predicts What You Need Next";
const PAGE_DESCRIPTION =
  "AI-powered smart suggestions that predict logical next steps with confidence scores. Learn how the framework proactively suggests related topics and actions.";
const OG_IMAGE = "/images/orchestrator-story-og.png";

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
        className="overflow-x-auto rounded-lg border border-border/50 p-4 text-sm"
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

const StoryAct = ({ 
  number, 
  title, 
  emoji, 
  children 
}: { 
  number: string; 
  title: string; 
  emoji: string; 
  children: React.ReactNode 
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="mb-12"
    >
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="group flex w-full items-center gap-4 text-left"
      >
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-primary text-2xl shadow-glow">
          {emoji}
        </span>
        <div className="flex-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-primary">{number}</span>
          <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">{title}</h3>
        </div>
        <motion.span 
          animate={{ rotate: isExpanded ? 180 : 0 }}
          className="text-muted-foreground"
        >
          ▼
        </motion.span>
      </button>
      
      <motion.div 
        initial={false}
        animate={{ height: isExpanded ? "auto" : 0, opacity: isExpanded ? 1 : 0 }}
        className="overflow-hidden"
      >
        <div className="mt-6 pl-16 space-y-6 text-muted-foreground">
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
};

const SuggestionCard = ({ 
  suggestion, 
  confidence, 
  reason 
}: { 
  suggestion: string; 
  confidence: number; 
  reason: string 
}) => (
  <motion.div 
    whileHover={{ scale: 1.02 }}
    className={`rounded-lg border p-4 ${
      confidence > 0.8 ? "border-accent/30 bg-accent/10" : 
      confidence > 0.6 ? "border-secondary/30 bg-secondary/10" : 
      "border-border/30 bg-card"
    }`}
  >
    <div className="flex items-start justify-between mb-2">
      <h5 className="font-semibold text-foreground text-sm">{suggestion}</h5>
      <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
        confidence > 0.8 ? "bg-accent/20 text-accent" :
        confidence > 0.6 ? "bg-secondary/20 text-secondary" :
        "bg-muted text-muted-foreground"
      }`}>
        {Math.round(confidence * 100)}%
      </span>
    </div>
    <p className="text-xs text-muted-foreground">{reason}</p>
  </motion.div>
);

const SmartSuggestionsStory = () => {
  useEffect(() => {
    document.title = PAGE_TITLE;
    const absoluteOgImage = `${window.location.origin}${OG_IMAGE}`;
    const updateMeta = (selector: string, attribute: string, value: string) => {
      let element = document.querySelector(selector) as HTMLMetaElement | null;
      if (!element) {
        element = document.createElement("meta");
        if (selector.includes("property=")) {
          element.setAttribute("property", selector.match(/property="([^"]+)"/)?.[1] || "");
        } else if (selector.includes("name=")) {
          element.setAttribute("name", selector.match(/name="([^"]+)"/)?.[1] || "");
        }
        document.head.appendChild(element);
      }
      element.setAttribute(attribute, value);
    };

    updateMeta('meta[name="description"]', "content", PAGE_DESCRIPTION);
    updateMeta('meta[property="og:title"]', "content", PAGE_TITLE);
    updateMeta('meta[property="og:description"]', "content", PAGE_DESCRIPTION);
    updateMeta('meta[property="og:image"]', "content", absoluteOgImage);
    updateMeta('meta[property="og:type"]', "content", "article");
    updateMeta('meta[name="twitter:title"]', "content", PAGE_TITLE);
    updateMeta('meta[name="twitter:description"]', "content", PAGE_DESCRIPTION);
    updateMeta('meta[name="twitter:image"]', "content", absoluteOgImage);
    updateMeta('meta[name="twitter:card"]', "content", "summary_large_image");
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
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                <Sparkles className="h-4 w-4" />
                Real API Story
              </span>
              <div className="flex items-center gap-3">
                <StoryLoveButton storySlug="smart-suggestions" />
                <PageViewCounter />
              </div>
            </div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl"
            >
              <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
                When AI Predicts <span className="text-gradient">What You Need Next</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mb-8">
                The story of smart suggestions that proactively guide users to related topics and 
                next steps with AI-powered confidence scoring.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2 text-sm text-accent">
                  <Brain className="h-4 w-4" />
                  Intent Analysis
                </div>
                <div className="flex items-center gap-2 rounded-full bg-secondary/10 px-4 py-2 text-sm text-secondary">
                  <Lightbulb className="h-4 w-4" />
                  Smart Predictions
                </div>
                <div className="flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm text-primary">
                  <Target className="h-4 w-4" />
                  Confidence Scores
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* The Story */}
        <section className="px-6 py-8">
          <div className="max-w-4xl">
            {/* Act I */}
            <StoryAct number="Act I" title="The Discovery Problem" emoji="🔍">
              <p>
                A security engineer searches your enterprise platform for "threat detection systems." 
                Traditional search shows 3 documents and stops. The user doesn't know what they don't know.
              </p>

              <div className="grid gap-6 md:grid-cols-2 mt-6">
                <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6">
                  <h5 className="font-semibold text-destructive mb-3">❌ Traditional Search</h5>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>✓ Shows 3 threat detection documents</p>
                    <p>✗ No suggestions</p>
                    <p>✗ User has to guess next steps</p>
                    <p className="text-destructive font-medium mt-4">Result: User leaves, missed opportunities</p>
                  </div>
                </div>

                <div className="rounded-xl border border-accent/30 bg-accent/5 p-6">
                  <h5 className="font-semibold text-accent mb-3">✅ Smart Suggestions</h5>
                  <div className="space-y-2 text-sm text-muted-foreground">
                    <p>✓ Shows 3 relevant documents</p>
                    <p>✓ Predicts 3 related topics</p>
                    <p>✓ Confidence scores for each</p>
                    <p className="text-accent font-medium mt-4">Result: +40% deeper engagement</p>
                  </div>
                </div>
              </div>
            </StoryAct>

            {/* Act II */}
            <StoryAct number="Act II" title="The AI-Powered Suggestion Pipeline" emoji="🤖">
              <p>
                After showing search results, the AI analyzes the user's intent and knowledge base 
                to predict logical next steps:
              </p>

              <div className="rounded-xl border border-primary/30 bg-primary/5 p-6 mt-4">
                <h4 className="text-lg font-semibold text-foreground mb-4">Query: "threat detection systems"</h4>
                
                <div className="space-y-3 mb-6">
                  <div className="rounded-lg border border-border/30 bg-card p-3">
                    <p className="text-xs text-muted-foreground mb-1">STEP 1: Intent Extraction</p>
                    <p className="text-sm text-foreground">Type: INFORMATION • Topic: Security, Threat Detection • Confidence: 0.95</p>
                  </div>
                  <div className="rounded-lg border border-border/30 bg-card p-3">
                    <p className="text-xs text-muted-foreground mb-1">STEP 2: Semantic Search</p>
                    <p className="text-sm text-foreground">Found: 3 documents • Avg confidence: 0.92</p>
                  </div>
                  <div className="rounded-lg border border-border/30 bg-card p-3">
                    <p className="text-xs text-muted-foreground mb-1">STEP 3: LLM Analysis</p>
                    <p className="text-sm text-foreground">Analyzing user intent + retrieved docs + knowledge coverage...</p>
                  </div>
                </div>

                <h5 className="font-semibold text-foreground mb-3">Generated Smart Suggestions:</h5>
                <div className="space-y-3">
                  <SuggestionCard 
                    suggestion="Network traffic analysis"
                    confidence={0.89}
                    reason="Related capability mentioned in threat detection docs"
                  />
                  <SuggestionCard 
                    suggestion="Compliance monitoring"
                    confidence={0.82}
                    reason="Common next step for security implementations"
                  />
                  <SuggestionCard 
                    suggestion="Threat intelligence integration"
                    confidence={0.78}
                    reason="Complementary feature for threat detection"
                  />
                </div>
              </div>
            </StoryAct>

            {/* Act III */}
            <StoryAct number="Act III" title="The Technology" emoji="⚙️">
              <CodeBlock code={`// Smart Suggestions are automatic
@Override
public OrchestrationResult orchestrate(String query, String userId) {
    // 1. Extract intent
    Intent intent = intentExtractionService.extract(query, userId);
    
    // 2. Execute semantic search
    RAGResponse response = queryService.execute(
        query, entityTypes, options
    );
    
    // 3. Generate smart suggestions
    List<SmartSuggestion> suggestions = 
        suggestionService.generateSuggestions(
            intent, 
            response.getDocuments(),
            userId
        );
    
    // 4. Return with enriched metadata
    return OrchestrationResult.builder()
        .type(OrchestrationResultType.INFORMATION)
        .data(response.getDocuments())
        .smartSuggestions(suggestions)  // ← Auto-generated
        .build();
}

// Example suggestion structure
SmartSuggestion {
    text: "Network traffic analysis"
    confidence: 0.89
    reason: "Related capability"
    intent: INFORMATION
    entityTypes: ["SecurityProduct"]
}`} />

              <div className="grid gap-3 sm:grid-cols-2 mt-6">
                {[
                  "Intent understanding",
                  "Document analysis",
                  "Knowledge base coverage",
                  "Confidence scoring",
                  "PII sanitization",
                  "Risk level calculation",
                ].map((feature, i) => (
                  <div key={i} className="flex items-start gap-3 rounded-lg border border-border/50 bg-card p-3">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-accent mt-0.5" />
                    <span className="text-sm text-foreground">{feature}</span>
                  </div>
                ))}
              </div>
            </StoryAct>

            {/* Act IV */}
            <StoryAct number="Act IV" title="The Business Impact" emoji="📈">
              <div className="rounded-xl bg-gradient-primary p-6 text-center mb-6">
                <p className="text-2xl font-bold text-primary-foreground mb-2">
                  +40% Deeper User Engagement
                </p>
                <p className="text-primary-foreground/80">
                  Users discover 3x more relevant content • Session time +2.5 minutes
                </p>
              </div>

              <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
                {[
                  { value: "3-5", label: "Suggestions" },
                  { value: "89%", label: "Avg Confidence" },
                  { value: "+40%", label: "Engagement" },
                  { value: "100%", label: "PII Safe" }
                ].map((stat) => (
                  <div key={stat.label} className="rounded-lg border border-border/50 bg-card p-4 text-center">
                    <p className="text-2xl font-bold text-gradient">{stat.value}</p>
                    <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            </StoryAct>
          </div>
        </section>

        {/* Try It */}
        <section className="border-t border-border/50 bg-muted/30 py-12 px-6">
          <div className="max-w-4xl">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-3">
                <Zap className="h-6 w-6 text-primary" />
                Add Smart Suggestions to Your Platform
              </h2>
              <p className="text-muted-foreground mb-8">
                AI Fabric Framework provides automatic smart suggestions with confidence scoring.
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <Button variant="hero" size="lg" asChild>
                  <a href="https://github.com/mahmoudashraf/AI-Fabric-Framework" target="_blank" rel="noopener noreferrer">
                    ⭐ Star on GitHub
                  </a>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/docs">
                    Explore More →
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Related Stories */}
        <section className="border-t border-border/50 px-6 py-12">
          <div className="max-w-4xl">
            <h2 className="text-xl font-bold text-foreground mb-6">Related Real API Stories</h2>
            <div className="grid gap-4 md:grid-cols-2">
              <Link 
                to="/docs/pii-detection-edge-story"
                className="group rounded-xl border border-border/50 bg-card p-5 hover:border-primary/50 hover:shadow-lg transition-all"
              >
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-2 flex items-center gap-2">
                  PII Detection Edge Spectrum <ArrowRight className="h-4 w-4" />
                </h3>
                <p className="text-sm text-muted-foreground">
                  Testing every privacy edge case
                </p>
              </Link>
              <Link 
                to="/docs/onnx-fallback-story"
                className="group rounded-xl border border-border/50 bg-card p-5 hover:border-primary/50 hover:shadow-lg transition-all"
              >
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-2 flex items-center gap-2">
                  ONNX Fallback Readiness <ArrowRight className="h-4 w-4" />
                </h3>
                <p className="text-sm text-muted-foreground">
                  $0 embeddings, 100% private
                </p>
              </Link>
            </div>
          </div>
        </section>

        {/* Story Navigation */}
        <section className="px-6 py-12">
          <div className="max-w-4xl">
            <StoryNavigation />
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border/50 py-8 px-6">
          <div className="flex flex-col items-center gap-4">
            <StoryLoveButton storySlug="smart-suggestions" />
            <p className="text-sm text-muted-foreground text-center">
              Real API Integration Story • Part of AI Fabric Framework • MIT License • Production-Ready
            </p>
          </div>
        </footer>
      </div>
    </DocsLayout>
  );
};

export default SmartSuggestionsStory;
