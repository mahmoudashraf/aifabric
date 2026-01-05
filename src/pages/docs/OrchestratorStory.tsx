import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Shield,
  Users,
  Zap,
  Brain,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Database,
  Lock,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Highlight, themes } from "prism-react-renderer";
import { useEffect, useState } from "react";
import DocsLayout from "@/components/docs/DocsLayout";
import PageViewCounter from "@/components/PageViewCounter";
import StoryLoveButton from "@/components/StoryLoveButton";
import StoryNavigation from "@/components/StoryNavigation";

const PAGE_TITLE = "The Orchestrator Story - AI Fabric Framework";
const PAGE_DESCRIPTION =
  "A story about building trust in AI systems. Learn how the Orchestrator improves security, privacy, and reliability for AI-powered apps.";
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

const StepBadge = ({ step, icon, status }: { step: string; icon: React.ReactNode; status: "pass" | "check" | "warn" }) => (
  <div className="flex items-center gap-3 rounded-lg border border-border/50 bg-card p-3">
    <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
      status === "pass" ? "bg-accent/20 text-accent" : 
      status === "warn" ? "bg-destructive/20 text-destructive" : 
      "bg-primary/20 text-primary"
    }`}>
      {icon}
    </div>
    <span className="text-sm font-medium text-foreground">{step}</span>
    {status === "pass" && <CheckCircle2 className="ml-auto h-4 w-4 text-accent" />}
  </div>
);

const ImpactCard = ({ title, before, after, metric }: { title: string; before: string; after: string; metric: string }) => (
  <motion.div 
    whileHover={{ scale: 1.02 }}
    className="rounded-xl border border-border/50 bg-card p-6 shadow-card"
  >
    <h4 className="text-lg font-semibold text-foreground mb-4">{title}</h4>
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <span className="flex h-6 w-6 items-center justify-center rounded bg-destructive/20 text-xs text-destructive">✗</span>
        <span className="text-sm text-muted-foreground line-through">{before}</span>
      </div>
      <div className="flex items-center gap-3">
        <span className="flex h-6 w-6 items-center justify-center rounded bg-accent/20 text-xs text-accent">✓</span>
        <span className="text-sm text-foreground">{after}</span>
      </div>
    </div>
    <div className="mt-4 rounded-lg bg-gradient-primary p-3 text-center">
      <span className="text-lg font-bold text-primary-foreground">{metric}</span>
    </div>
  </motion.div>
);

const OrchestratorStory = () => {
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
                  <span className="text-2xl">🎭</span>
                  Orchestrator V1
                </span>
                <Link 
                  to="/docs/orchestrator_story_v2"
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  View V2 (Narrative) →
                </Link>
              </div>
              <div className="flex items-center gap-3">
                <StoryLoveButton storySlug="orchestrator_story" />
                <PageViewCounter />
              </div>
            </div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl"
            >
              <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
                The Orchestrator: Your AI's{" "}
                <span className="text-gradient">Bodyguard, Traffic Cop,</span>{" "}
                and Mind Reader
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mb-8">
                A story about building trust in AI systems. Part of the AI Fabric Framework series — 
                production-ready AI infrastructure for Spring Boot.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2 text-sm text-accent">
                  <Shield className="h-4 w-4" />
                  Security First
                </div>
                <div className="flex items-center gap-2 rounded-full bg-secondary/10 px-4 py-2 text-sm text-secondary">
                  <Users className="h-4 w-4" />
                  10M+ Entities
                </div>
                <div className="flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm text-primary">
                  <Zap className="h-4 w-4" />
                  Battle-tested
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Introduction */}
        <section className="px-6 py-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl"
          >
            <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-8 mb-12">
              <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-3">
                <AlertTriangle className="h-6 w-6 text-destructive" />
                The 3 AM Wake-Up Call Nobody Wants
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Picture this: It's 3 AM. Your phone buzzes. Your AI-powered customer support system just 
                leaked a customer's credit card number in a chat response. Or worse—it executed a 
                database-wiping action because someone typed "delete everything" as a joke.
              </p>
              <p className="text-muted-foreground leading-relaxed mt-4">
                <strong className="text-foreground">Sound like a nightmare? It happens more often than you think.</strong>
              </p>
              <p className="text-foreground font-medium mt-6">
                This is the story of how we built <span className="text-primary">The Orchestrator</span>—the 
                unsung hero sitting between your users and AI chaos, making sure every request is understood, 
                secured, and handled safely before any AI magic happens.
              </p>
            </div>
          </motion.div>
        </section>

        {/* Stories */}
        <section className="px-6 py-8">
          <div className="max-w-4xl">
            {/* Act I */}
            <StoryAct number="Act I" title="The Anonymous Shopper" emoji="🛒">
              <p>
                Meet <strong className="text-foreground">Sarah</strong>. She's browsing your e-commerce site at 2 AM 
                (classic online shopping behavior). She's <strong className="text-foreground">not logged in</strong>—just 
                a curious visitor searching for "laptop for programming."
              </p>

              <h4 className="text-lg font-semibold text-foreground mt-8 mb-4">Here's what The Orchestrator sees:</h4>
              
              <CodeBlock code={`OrchestrationContext context = OrchestrationContext.builder()
    .sessionId("sess_892abc")           // Anonymous user
    .ipAddress("192.168.1.42")          // Track for rate limiting
    .userAgent("Mozilla/5.0...")        // Detect device type
    .locale(Locale.forLanguageTag("en-US"))
    .metadata(Map.of(
        "deviceType", "mobile",
        "referrer", "google.com"
    ))
    .build();

orchestrator.orchestrate("laptop for programming", context);`} />

              <h4 className="text-lg font-semibold text-foreground mt-8 mb-4">The Orchestrator's 7-Step Dance (in milliseconds):</h4>
              
              <div className="grid gap-3 sm:grid-cols-2">
                <StepBadge step="1. Identity Check — Anonymous OK" icon={<Users className="h-4 w-4" />} status="pass" />
                <StepBadge step="2. Security Scan — Clean" icon={<Shield className="h-4 w-4" />} status="pass" />
                <StepBadge step="3. Access Control — Granted" icon={<Lock className="h-4 w-4" />} status="pass" />
                <StepBadge step="4. PII Detection — None Found" icon={<Eye className="h-4 w-4" />} status="pass" />
                <StepBadge step="5. Compliance Gate — GDPR OK" icon={<FileText className="h-4 w-4" />} status="pass" />
                <StepBadge step="6. Intent Extraction — Product Search" icon={<Brain className="h-4 w-4" />} status="check" />
              </div>

              <div className="mt-8 grid gap-4 md:grid-cols-2">
                <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
                  <h5 className="font-semibold text-foreground mb-2">❌ Traditional Keyword Search</h5>
                  <ul className="text-sm space-y-1">
                    <li className="text-muted-foreground">• "Laptop Stand"</li>
                    <li className="text-muted-foreground">• "Laptop Bag"</li>
                    <li className="text-muted-foreground">• "Laptop Stickers"</li>
                  </ul>
                </div>
                <div className="rounded-lg border border-accent/30 bg-accent/5 p-4">
                  <h5 className="font-semibold text-foreground mb-2">✅ Orchestrator's Semantic Search</h5>
                  <ul className="text-sm space-y-1">
                    <li className="text-foreground">• MacBook Pro M3 (96%)</li>
                    <li className="text-foreground">• ThinkPad X1 Carbon (94%)</li>
                    <li className="text-foreground">• Dell XPS 15 Developer (93%)</li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 rounded-xl bg-gradient-primary p-6 text-center">
                <p className="text-primary-foreground font-semibold">
                  Result: Conversion rate +40% • Revenue +25%
                </p>
              </div>
            </StoryAct>

            {/* Act II */}
            <StoryAct number="Act II" title="The Frustrated SaaS User" emoji="😤">
              <p>
                Now meet <strong className="text-foreground">David</strong>. He's a paying customer of your SaaS platform. 
                He's logged in. And he's <strong className="text-foreground">frustrated</strong>.
              </p>
              <p className="mt-4 rounded-lg border border-border/50 bg-card p-4 text-lg font-medium text-foreground">
                David types: "This is ridiculous. Cancel my subscription."
              </p>

              <h4 className="text-lg font-semibold text-foreground mt-8 mb-4">The Orchestrator sees an ACTION intent:</h4>

              <CodeBlock code={`{
  "type": "ACTION",
  "intent": "cancel_subscription",
  "action": "cancel_subscription",
  "actionParams": {
    "reason": "frustrated with service"
  },
  "confidence": 0.95
}`} language="json" />

              <div className="mt-8 rounded-xl border border-secondary/30 bg-secondary/5 p-6">
                <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Brain className="h-5 w-5 text-secondary" />
                  Behind the scenes: Behavior Analytics
                </h4>
                <CodeBlock code={`BehaviorContext behaviorContext = BehaviorContext.builder()
    .userId("user_david_123")
    .sentimentLabel("FRUSTRATED")
    .sentimentScore(0.23)  // Low = bad
    .churnRisk(0.87)       // High = imminent churn
    .churnReason("Multiple errors in workflow")
    .trend("RAPIDLY_DECLINING")
    .recommendations(List.of(
        "immediate_intervention",
        "technical_support",
        "customer_success_escalation"
    ))
    .build();`} />
                <p className="mt-4 text-foreground font-medium">
                  Customer Success team gets alerted BEFORE the cancellation completes.
                </p>
              </div>

              <div className="mt-6 rounded-xl bg-gradient-primary p-6 text-center">
                <p className="text-primary-foreground font-semibold">
                  Impact: 30-50% of at-risk users saved through proactive intervention
                </p>
              </div>
            </StoryAct>

            {/* Act III */}
            <StoryAct number="Act III" title="The HIPAA Nightmare" emoji="🏥">
              <p>
                Dr. Emily runs a telehealth platform. A patient asks:
              </p>
              <blockquote className="mt-4 border-l-4 border-primary pl-4 text-lg italic text-foreground">
                "My SSN is 123-45-6789 and I was born 05/15/1985. Can you look up my prescription history?"
              </blockquote>

              <div className="mt-8 grid gap-4 md:grid-cols-2">
                <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6">
                  <h5 className="font-bold text-destructive mb-3 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5" />
                    Without The Orchestrator
                  </h5>
                  <ul className="text-sm space-y-2 text-muted-foreground">
                    <li>• SSN & DOB sent to OpenAI API</li>
                    <li>• HIPAA violation</li>
                    <li>• Lawsuit</li>
                    <li className="text-destructive font-semibold">• Bankruptcy</li>
                  </ul>
                </div>
                <div className="rounded-lg border border-accent/50 bg-accent/10 p-6">
                  <h5 className="font-bold text-accent mb-3 flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    With The Orchestrator
                  </h5>
                  <ul className="text-sm space-y-2 text-muted-foreground">
                    <li>• PII automatically detected</li>
                    <li>• SSN → [REDACTED_SSN]</li>
                    <li>• DOB → [REDACTED_DOB]</li>
                    <li className="text-accent font-semibold">• 100% Compliant</li>
                  </ul>
                </div>
              </div>

              <CodeBlock code={`PIIDetectionResult piiResult = piiDetectionService.analyze(query);

// Detected:
// - SSN: "123-45-6789" → [REDACTED_SSN]
// - DOB: "05/15/1985" → [REDACTED_DOB]

String processedQuery = piiResult.getProcessedQuery();
// "My SSN is [REDACTED_SSN] and I was born [REDACTED_DOB]. 
//  Can you look up my prescription history?"`} />

              <div className="mt-6 rounded-xl bg-gradient-primary p-6 text-center">
                <p className="text-primary-foreground font-semibold">
                  Result saved: $10M+ in potential HIPAA fines. Company reputation intact.
                </p>
              </div>
            </StoryAct>

            {/* Act IV */}
            <StoryAct number="Act IV" title="The FinTech Power User" emoji="💹">
              <p>
                Marcus is a CFO. He doesn't know SQL. He doesn't want to know SQL.
              </p>
              <blockquote className="mt-4 border-l-4 border-primary pl-4 text-lg italic text-foreground">
                "Show me high-value transactions from enterprise clients this quarter where the payment method was cryptocurrency"
              </blockquote>

              <h4 className="text-lg font-semibold text-foreground mt-8 mb-4">The LLM understands and generates:</h4>

              <CodeBlock code={`SELECT t FROM Transaction t
JOIN t.customer c
WHERE c.tier = 'ENTERPRISE'
  AND t.paymentMethod = 'CRYPTO'
  AND t.amount > 50000
  AND t.timestamp BETWEEN :q1Start AND :q1End
ORDER BY t.amount DESC`} language="sql" />

              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <div className="rounded-lg border border-border/50 bg-card p-4 text-center">
                  <Database className="mx-auto h-8 w-8 text-primary mb-2" />
                  <p className="text-2xl font-bold text-foreground">142</p>
                  <p className="text-sm text-muted-foreground">Transactions</p>
                </div>
                <div className="rounded-lg border border-border/50 bg-card p-4 text-center">
                  <Zap className="mx-auto h-8 w-8 text-secondary mb-2" />
                  <p className="text-2xl font-bold text-foreground">$8.2M</p>
                  <p className="text-sm text-muted-foreground">Total Value</p>
                </div>
                <div className="rounded-lg border border-border/50 bg-card p-4 text-center">
                  <Users className="mx-auto h-8 w-8 text-accent mb-2" />
                  <p className="text-2xl font-bold text-foreground">Acme Corp</p>
                  <p className="text-sm text-muted-foreground">Top Client ($1.2M)</p>
                </div>
              </div>

              <div className="mt-6 rounded-xl bg-gradient-primary p-6 text-center">
                <p className="text-primary-foreground font-semibold">
                  No SQL written. No developer needed. Business moves fast.
                </p>
              </div>
            </StoryAct>
          </div>
        </section>

        {/* Architecture */}
        <section className="border-t border-border/50 bg-muted/30 py-12 px-6">
          <div className="max-w-4xl">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-8"
            >
              <h2 className="text-2xl font-bold text-foreground mb-2">🎯 The Architecture</h2>
              <p className="text-muted-foreground">Every request passes through 7 security gates</p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-2xl border border-border/50 bg-card p-6 font-mono text-sm overflow-x-auto"
            >
              <pre className="whitespace-pre-wrap break-words text-muted-foreground">
{`User Query: "cancel my subscription"
    ↓
OrchestrationContext
├─ userId: "user_123" (authenticated)
├─ sessionId: "sess_xyz"
├─ ipAddress: "192.168.1.1"
└─ metadata: { tier: "Pro" }
    ↓
┌──────────────────────────────────────┐
│     `}<span className="text-primary font-bold">THE ORCHESTRATOR</span>{`                  │
├──────────────────────────────────────┤
│ 1. Identity ✅                        │
│ 2. Security 🔒                        │
│ 3. Access Control 👮                  │
│ 4. PII Detection 🕵️                   │
│ 5. Compliance 📋                      │
│ 6. Intent Extraction 🧠               │
│ 7. Handler Routing 🎯                 │
└──────────────────────────────────────┘
    ↓
OrchestrationResult
├─ type: ACTION_CONFIRMED
├─ success: true
├─ message: "Subscription cancelled"
└─ sanitized: true (no PII leaked)`}
              </pre>
            </motion.div>
          </div>
        </section>

        {/* Real Business Impact */}
        <section className="px-6 py-12">
          <div className="max-w-5xl">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-8"
            >
              <h2 className="text-2xl font-bold text-foreground mb-2">🎯 Real Business Impact</h2>
              <p className="text-muted-foreground">Proven results from production deployments</p>
            </motion.div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <ImpactCard 
                title="E-Commerce" 
                before="60% bounce rate"
                after="94% search relevance"
                metric="+25% Revenue"
              />
              <ImpactCard 
                title="SaaS Platform" 
                before="8% monthly churn"
                after="360 users saved/month"
                metric="$2M/year Saved"
              />
              <ImpactCard 
                title="Healthcare" 
                before="HIPAA blocking AI"
                after="Zero PII leaks"
                metric="$500K Saved"
              />
              <ImpactCard 
                title="FinTech" 
                before="2-3 days for queries"
                after="2 seconds"
                metric="+300% Self-service"
              />
            </div>
          </div>
        </section>

        {/* What You Get */}
        <section className="border-t border-border/50 bg-muted/30 py-12 px-6">
          <div className="max-w-4xl">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-8"
            >
              <h2 className="text-2xl font-bold text-foreground">🎁 What You Get</h2>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="grid gap-4 sm:grid-cols-2"
            >
              {[
                "Universal user support — authenticated AND anonymous",
                "Built-in security — injection, prompt manipulation, rate limiting",
                "Access control — policy-based permissions",
                "PII protection — automatic detection and redaction",
                "Compliance — GDPR, HIPAA, SOC2 ready",
                "Intent understanding — LLM-powered semantic parsing",
                "Smart routing — ACTION vs INFORMATION vs OUT_OF_SCOPE",
                "Behavior enrichment — optional sentiment/churn integration",
                "Response sanitization — no data leaks",
                "Audit trail — full request/response history",
              ].map((feature, i) => (
                <div key={i} className="flex items-start gap-3 rounded-lg border border-border/50 bg-card p-4">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-accent mt-0.5" />
                  <span className="text-sm text-foreground">{feature}</span>
                </div>
              ))}
            </motion.div>

            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mt-8 text-muted-foreground"
            >
              <strong className="text-foreground">Without writing security code. Without building auth. Without handling edge cases.</strong>
            </motion.p>
          </div>
        </section>

        {/* Try It */}
        <section className="px-6 py-12">
          <div className="max-w-2xl">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-bold text-foreground mb-4">🌟 Try It Yourself</h2>
              <p className="text-muted-foreground mb-8">
                The Orchestrator is part of AI Fabric Framework (MIT License, free forever).
              </p>

              <CodeBlock code={`// Build context
OrchestrationContext context = OrchestrationContext.builder()
    .userId(currentUser.getId())
    .sessionId(session.getId())
    .build();

// Orchestrate
OrchestrationResult result = orchestrator.orchestrate(
    "Show me premium customers who haven't ordered in 60 days",
    context
);

// Done ✨`} />

              <p className="mt-6 text-lg font-semibold text-foreground">
                Three lines. Full orchestration. Complete safety.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Button variant="hero" size="lg" asChild>
                  <a href="https://github.com/mahmoudashraf/AI-Fabric-Framework" target="_blank" rel="noopener noreferrer">
                    ⭐ Star on GitHub
                  </a>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/#register">
                    Register Interest
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Closing */}
        <section className="border-t border-border/50 bg-muted/30 py-12 px-6">
          <div className="max-w-3xl">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-bold text-foreground mb-6">💬 Final Thought</h2>
              <p className="text-lg text-muted-foreground mb-6">
                Building AI features is exciting. Building AI infrastructure is exhausting.
              </p>
              <p className="text-xl font-semibold text-foreground mb-8">
                The Orchestrator lets you do the former without the latter.
              </p>
              
              <div className="rounded-2xl bg-gradient-primary p-8 text-primary-foreground">
                <p className="text-lg mb-2">
                  Anonymous shoppers. Frustrated users. Patients sharing medical histories. CFOs querying data.
                </p>
                <p className="font-bold text-xl">
                  They all deserve: Security • Privacy • Intelligence
                </p>
                <p className="mt-4 text-lg font-semibold">
                  That's what The Orchestrator delivers. Every request. Every time. Every user.
                </p>
              </div>

              <p className="mt-8 text-sm text-muted-foreground">
                🚀 Ship intelligence, not infrastructure.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Story Navigation */}
        <section className="px-6 py-12">
          <StoryNavigation />
        </section>

        {/* Footer */}
        <footer className="border-t border-border/50 py-8 px-6">
          <div className="flex flex-col items-center gap-4">
            <StoryLoveButton storySlug="orchestrator-story" />
            <p className="text-sm text-muted-foreground text-center">
              Written by the AI Fabric Team • Part of the AI Fabric Framework series • MIT License • Free Forever
            </p>
          </div>
        </footer>
      </div>
    </DocsLayout>
  );
};

export default OrchestratorStory;
