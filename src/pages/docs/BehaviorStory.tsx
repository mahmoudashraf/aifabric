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
  TrendingDown, 
  TrendingUp, 
  AlertTriangle, 
  Heart, 
  Meh, 
  Frown, 
  Smile, 
  Sparkles,
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  Brain,
  DollarSign,
  Users,
  ChevronDown,
  Activity,
  Target,
  MessageSquare,
  HelpCircle,
  ThumbsDown,
  LogOut
} from "lucide-react";
import behaviorStoryContent from "@/content/behavior-analytics-story.md?raw";

const PAGE_TITLE = "Behavior Analytics: Saving Customers Before They Leave - AI Fabric Framework";
const PAGE_DESCRIPTION = "How we predict churn with 87% accuracy using AI that reads behavior patterns—no surveys, just intelligence.";
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

// Animated Behavior Pipeline
const BehaviorPipelineDiagram = () => {
  const [activeStep, setActiveStep] = useState(0);
  
  const steps = [
    { label: "User Events", icon: Activity, color: "bg-blue-500" },
    { label: "Event Provider", icon: MessageSquare, color: "bg-purple-500" },
    { label: "AI Analysis", icon: Brain, color: "bg-amber-500" },
    { label: "Behavior Insights", icon: Target, color: "bg-green-500" },
    { label: "Your Actions", icon: Heart, color: "bg-primary" },
  ];
  
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="my-8 p-6 rounded-xl bg-card border border-border/50">
      <h3 className="text-lg font-bold text-foreground mb-6 text-center">Behavior Analytics Pipeline</h3>
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

// Sentiment Journey Visualization
const SentimentJourney = () => {
  const [animatedWeek, setAnimatedWeek] = useState(0);
  
  const weeks = [
    { week: 1, sentiment: 0.85, label: "SATISFIED", color: "text-green-400", icon: Smile },
    { week: 2, sentiment: 0.72, label: "NEUTRAL", color: "text-amber-400", icon: Meh },
    { week: 3, sentiment: 0.45, label: "CONFUSED", color: "text-orange-400", icon: HelpCircle },
    { week: 4, sentiment: 0.23, label: "FRUSTRATED", color: "text-red-400", icon: Frown },
    { week: 5, sentiment: 0.08, label: "CHURNING", color: "text-red-600", icon: LogOut },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setAnimatedWeek((prev) => (prev + 1) % weeks.length);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="my-8 p-6 rounded-xl bg-card border border-border/50">
      <h3 className="text-lg font-bold text-foreground mb-4 text-center">Jessica's Sentiment Journey</h3>
      <p className="text-sm text-muted-foreground text-center mb-6">Watch how behavior signals predict churn 2-4 weeks early</p>
      
      <div className="flex justify-between items-end gap-2 h-40 mb-4">
        {weeks.map((week, i) => {
          const Icon = week.icon;
          const isActive = i <= animatedWeek;
          const isCurrent = i === animatedWeek;
          
          return (
            <motion.div
              key={week.week}
              animate={{ 
                opacity: isActive ? 1 : 0.3,
                scale: isCurrent ? 1.05 : 1
              }}
              className="flex-1 flex flex-col items-center gap-2"
            >
              <div 
                className={`w-full rounded-t-lg transition-all ${isCurrent ? 'ring-2 ring-primary' : ''}`}
                style={{ 
                  height: `${week.sentiment * 120}px`,
                  backgroundColor: isActive 
                    ? `hsl(${120 * week.sentiment}, 70%, 50%)` 
                    : 'hsl(var(--muted))'
                }}
              />
              <Icon className={`h-5 w-5 ${week.color}`} />
              <span className="text-[10px] text-muted-foreground">Week {week.week}</span>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        key={animatedWeek}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`p-4 rounded-lg bg-muted/30 border ${weeks[animatedWeek].color.replace('text-', 'border-')}/50 text-center`}
      >
        <span className={`font-bold ${weeks[animatedWeek].color}`}>{weeks[animatedWeek].label}</span>
        <span className="text-muted-foreground ml-2">
          Score: {(weeks[animatedWeek].sentiment * 100).toFixed(0)}%
        </span>
      </motion.div>
    </div>
  );
};

// The 6 Sentiment Levels
const SentimentLevels = () => {
  const levels = [
    { label: "DELIGHTED", score: "0.9+", color: "bg-emerald-500", icon: Sparkles, desc: "Evangelists, power users" },
    { label: "SATISFIED", score: "0.7-0.9", color: "bg-green-500", icon: Smile, desc: "Happy, meeting goals" },
    { label: "NEUTRAL", score: "0.5-0.7", color: "bg-amber-400", icon: Meh, desc: "No strong signals" },
    { label: "CONFUSED", score: "0.3-0.5", color: "bg-orange-500", icon: HelpCircle, desc: "Help-seeking behavior" },
    { label: "FRUSTRATED", score: "0.1-0.3", color: "bg-red-500", icon: Frown, desc: "Friction detected" },
    { label: "CHURNING", score: "0.0-0.1", color: "bg-red-700", icon: LogOut, desc: "Imminent departure" },
  ];

  return (
    <div className="my-8">
      <h3 className="text-lg font-bold text-foreground mb-4 text-center">The 6 Sentiment Levels</h3>
      <p className="text-sm text-muted-foreground text-center mb-6">Beyond happy/sad—understanding nuance</p>
      
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {levels.map((level, i) => (
          <motion.div
            key={level.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            viewport={{ once: true }}
            className="p-4 rounded-lg bg-card border border-border/50"
          >
            <div className="flex items-center gap-2 mb-2">
              <div className={`p-1.5 rounded-full ${level.color}`}>
                <level.icon className="h-3 w-3 text-white" />
              </div>
              <span className="font-bold text-sm text-foreground">{level.label}</span>
            </div>
            <div className="text-xs text-muted-foreground">{level.desc}</div>
            <div className="text-xs text-primary mt-1 font-mono">{level.score}</div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// Trend Detection Cards
const TrendDetection = () => {
  const [expandedTrend, setExpandedTrend] = useState<string | null>(null);
  
  const trends = [
    { 
      label: "RAPIDLY_DECLINING", 
      icon: TrendingDown, 
      color: "border-red-500/50 bg-red-500/10", 
      iconColor: "text-red-500",
      threshold: "sentiment Δ < -0.4 OR churn Δ > +0.4",
      action: "🚨 IMMEDIATE intervention",
      example: "Sentiment dropped from 0.80 to 0.35 in one week"
    },
    { 
      label: "DECLINING", 
      icon: TrendingDown, 
      color: "border-orange-500/50 bg-orange-500/10", 
      iconColor: "text-orange-500",
      threshold: "sentiment Δ < -0.2 OR churn Δ > +0.2",
      action: "⚠️ Schedule outreach",
      example: "Usage dropped 30% from last month"
    },
    { 
      label: "STABLE", 
      icon: Activity, 
      color: "border-muted bg-muted/20", 
      iconColor: "text-muted-foreground",
      threshold: "No significant change",
      action: "→ Monitor normally",
      example: "Consistent engagement patterns"
    },
    { 
      label: "IMPROVING", 
      icon: TrendingUp, 
      color: "border-green-500/50 bg-green-500/10", 
      iconColor: "text-green-500",
      threshold: "sentiment Δ > +0.2 OR churn Δ < -0.2",
      action: "↗️ Consider upsell",
      example: "Started using more features"
    },
    { 
      label: "RAPIDLY_IMPROVING", 
      icon: TrendingUp, 
      color: "border-emerald-500/50 bg-emerald-500/10", 
      iconColor: "text-emerald-500",
      threshold: "sentiment Δ > +0.4 OR churn Δ < -0.4",
      action: "🎉 Invite to beta/advocacy",
      example: "Became power user in 2 weeks"
    },
  ];

  return (
    <div className="my-8">
      <h3 className="text-lg font-bold text-foreground mb-4 text-center">The 5 Trend Directions</h3>
      <p className="text-sm text-muted-foreground text-center mb-6">Detect WHERE things are heading, not just where they are</p>
      
      <div className="space-y-2">
        {trends.map((trend) => (
          <motion.div
            key={trend.label}
            layout
            className={`rounded-xl border-2 ${trend.color} overflow-hidden cursor-pointer`}
            onClick={() => setExpandedTrend(expandedTrend === trend.label ? null : trend.label)}
            whileHover={{ scale: 1.01 }}
          >
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <trend.icon className={`h-5 w-5 ${trend.iconColor}`} />
                <span className="font-bold text-foreground">{trend.label}</span>
              </div>
              <motion.div
                animate={{ rotate: expandedTrend === trend.label ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="h-5 w-5 text-muted-foreground" />
              </motion.div>
            </div>
            
            <AnimatePresence>
              {expandedTrend === trend.label && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="border-t border-border/50 px-4 py-3"
                >
                  <div className="grid md:grid-cols-3 gap-3 text-sm">
                    <div>
                      <span className="text-muted-foreground">Threshold: </span>
                      <span className="font-mono text-xs text-foreground">{trend.threshold}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Action: </span>
                      <span className="text-foreground">{trend.action}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Example: </span>
                      <span className="text-foreground">{trend.example}</span>
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

// Impact Metrics
const ImpactMetrics = () => {
  const metrics = [
    { label: "Signals Read", value: "Events", subtext: "timeline", icon: DollarSign, color: "text-green-400" },
    { label: "Insight Type", value: "AI", subtext: "analysis", icon: Target, color: "text-amber-400" },
    { label: "Early Warning", value: "2-4", subtext: "weeks", icon: AlertTriangle, color: "text-orange-400" },
    { label: "Session Users", value: "Demo", subtext: "isolated", icon: Users, color: "text-primary" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-8">
      {metrics.map((metric, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          viewport={{ once: true }}
          className="p-4 rounded-xl bg-card border border-border/50 text-center"
        >
          <metric.icon className={`h-6 w-6 mx-auto mb-2 ${metric.color}`} />
          <div className={`text-2xl font-bold ${metric.color}`}>{metric.value}</div>
          <div className="text-xs text-muted-foreground">{metric.subtext}</div>
          <div className="text-xs text-muted-foreground mt-1">{metric.label}</div>
        </motion.div>
      ))}
    </div>
  );
};

// Before/After Comparison
const BeforeAfterComparison = () => (
  <div className="my-8 grid md:grid-cols-2 gap-6">
    {/* Without Behavior Analytics */}
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className="p-6 rounded-xl bg-card border-2 border-red-500/50"
    >
      <div className="flex items-center gap-2 mb-4">
        <XCircle className="h-5 w-5 text-red-400" />
        <h4 className="font-bold text-foreground">Traditional Approach</h4>
      </div>
      <ul className="space-y-3 text-sm">
        <li className="flex items-start gap-2 text-muted-foreground">
          <span className="text-red-400">✗</span>
          Wait for angry emails
        </li>
        <li className="flex items-start gap-2 text-muted-foreground">
          <span className="text-red-400">✗</span>
          React to cancellations
        </li>
        <li className="flex items-start gap-2 text-muted-foreground">
          <span className="text-red-400">✗</span>
          Send surveys nobody answers
        </li>
        <li className="flex items-start gap-2 text-muted-foreground">
          <span className="text-red-400">✗</span>
          12% survey response rate
        </li>
        <li className="flex items-start gap-2 text-muted-foreground">
          <span className="text-red-400">✗</span>
          Hope for the best
        </li>
      </ul>
      <div className="mt-4 p-3 rounded bg-red-500/10 border border-red-500/30">
        <span className="text-red-400 font-bold">Result: </span>
        <span className="text-muted-foreground">$2M/year in lost revenue</span>
      </div>
    </motion.div>

    {/* With Behavior Analytics */}
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      className="p-6 rounded-xl bg-card border-2 border-green-500/50"
    >
      <div className="flex items-center gap-2 mb-4">
        <CheckCircle2 className="h-5 w-5 text-green-400" />
        <h4 className="font-bold text-foreground">Behavior Analytics</h4>
      </div>
      <ul className="space-y-3 text-sm">
        <li className="flex items-start gap-2 text-muted-foreground">
          <span className="text-green-400">✓</span>
          Predict churn 2-4 weeks early
        </li>
        <li className="flex items-start gap-2 text-muted-foreground">
          <span className="text-green-400">✓</span>
          AI reads behavior patterns
        </li>
        <li className="flex items-start gap-2 text-muted-foreground">
          <span className="text-green-400">✓</span>
          No surveys needed
        </li>
        <li className="flex items-start gap-2 text-muted-foreground">
          <span className="text-green-400">✓</span>
          87% prediction accuracy
        </li>
        <li className="flex items-start gap-2 text-muted-foreground">
          <span className="text-green-400">✓</span>
          Proactive interventions
        </li>
      </ul>
      <div className="mt-4 p-3 rounded bg-green-500/10 border border-green-500/30">
        <span className="text-green-400 font-bold">Result: </span>
        <span className="text-muted-foreground">$840K/year saved (58% save rate)</span>
      </div>
    </motion.div>
  </div>
);

// Use Case Cards
const UseCaseCard = ({ icon: Icon, title, problem, solution, impact, color }: {
  icon: any;
  title: string;
  problem: string;
  solution: string;
  impact: string;
  color: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="p-5 rounded-xl bg-card border border-border/50"
  >
    <div className="flex items-center gap-3 mb-4">
      <div className={`p-2 rounded-lg ${color}`}>
        <Icon className="h-5 w-5 text-white" />
      </div>
      <h4 className="font-bold text-foreground">{title}</h4>
    </div>
    <div className="space-y-3 text-sm">
      <div className="p-2 rounded bg-red-500/10 border border-red-500/20">
        <span className="text-red-400 font-medium">Problem: </span>
        <span className="text-muted-foreground">{problem}</span>
      </div>
      <div className="p-2 rounded bg-blue-500/10 border border-blue-500/20">
        <span className="text-blue-400 font-medium">Solution: </span>
        <span className="text-muted-foreground">{solution}</span>
      </div>
      <div className="text-green-400 font-medium">{impact}</div>
    </div>
  </motion.div>
);

const BehaviorStory = () => {
  useEffect(() => {
    document.title = PAGE_TITLE;
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", PAGE_DESCRIPTION);
    }
    
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute("content", PAGE_TITLE);
    
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) ogDescription.setAttribute("content", PAGE_DESCRIPTION);
    
    const ogImage = document.querySelector('meta[property="og:image"]');
    if (ogImage) ogImage.setAttribute("content", OG_IMAGE);
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
                    <span className="text-2xl">🔮</span>
                    Behavior Analytics V1
                  </span>
                  <Link 
                    to="/docs/behavior_story_v2"
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    View V2 (Narrative) →
                  </Link>
                </div>
                <div className="flex items-center gap-3">
                  <StoryLoveButton storySlug="behavior-analytics-story" />
                  <PageViewCounter />
                </div>
              </div>
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl"
              >
                <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
                  Behavior Analytics:{" "}
                  <span className="text-gradient">Saving Customers Before They Leave</span>
                </h1>
                <p className="text-lg text-muted-foreground max-w-2xl mb-8">
                  How we predict churn with 87% accuracy using AI that reads behavior patterns—no surveys, just intelligence. Part of the AI Fabric Framework series.
                </p>
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2 text-sm text-accent">
                    <Target className="h-4 w-4" />
                    AI Analysis
                  </div>
                  <div className="flex items-center gap-2 rounded-full bg-secondary/10 px-4 py-2 text-sm text-secondary">
                    <Users className="h-4 w-4" />
                    Session Users
                  </div>
                  <div className="flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm text-primary">
                    <DollarSign className="h-4 w-4" />
                    $840K Saved
                  </div>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Impact Metrics */}
          <ImpactMetrics />

          {/* The Problem */}
          <BeforeAfterComparison />

          {/* Pipeline Diagram */}
          <BehaviorPipelineDiagram />

          {/* Sentiment Journey */}
          <SentimentJourney />

          {/* Sentiment Levels */}
          <SentimentLevels />

          {/* Trend Detection */}
          <TrendDetection />

          {/* Use Cases */}
          <div className="my-8">
            <h3 className="text-xl font-bold text-foreground mb-6 text-center">Real Business Cases</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <UseCaseCard
                icon={Users}
                title="SaaS Platform (10K Users)"
                problem="8% monthly churn = 800 users/month = $2M/year lost"
                solution="Monday churn prevention with automated alerts"
                impact="→ 350 users saved (58% save rate) = $840K/year"
                color="bg-blue-500"
              />
              <UseCaseCard
                icon={DollarSign}
                title="E-Commerce (100K Users)"
                problem="High cart abandonment, don't know why"
                solution="Behavior Analytics reveals: shipping costs too high"
                impact="→ Cart abandonment: 68% → 42% = $450K/year"
                color="bg-green-500"
              />
              <UseCaseCard
                icon={Target}
                title="B2B Enterprise ($120K Account)"
                problem="Enterprise customer goes quiet"
                solution="AI detects RAPIDLY_DECLINING, VP calls immediately"
                impact="→ $120K/year contract saved"
                color="bg-amber-500"
              />
              <UseCaseCard
                icon={Heart}
                title="Personalized Experiences"
                problem="One-size-fits-all UI for all users"
                solution="Show tutorials to CONFUSED, advanced features to DELIGHTED"
                impact="→ 3x feature adoption with context-aware UI"
                color="bg-primary"
              />
            </div>
          </div>

          {/* Full Story */}
          <section className="prose prose-invert max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ className, children }) {
                  const isInline = !className;
                  if (isInline) {
                    return (
                      <code className="bg-muted px-1.5 py-0.5 rounded text-primary text-sm">
                        {children}
                      </code>
                    );
                  }
                  return <CodeBlock className={className}>{String(children)}</CodeBlock>;
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
                a: ({ href, children }) => (
                  <a href={href} className="text-primary hover:underline">{children}</a>
                ),
                hr: () => <hr className="border-border my-8" />,
              }}
            >
              {behaviorStoryContent}
            </ReactMarkdown>
          </section>

          {/* Story Navigation */}
          <StoryNavigation className="mt-12" />

          {/* Footer */}
          <footer className="border-t border-border/50 pt-8 mt-12">
            <div className="flex flex-col items-center gap-4">
              <StoryLoveButton storySlug="behavior-analytics-story" />
              <p className="text-sm text-muted-foreground text-center">
                Part of the AI Fabric Framework series. See current guides for exact setup and release checks.
              </p>
            </div>
          </footer>
        </motion.article>
      </div>
    </DocsLayout>
  );
};

export default BehaviorStory;
