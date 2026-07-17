import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Shield,
  AlertTriangle,
  TrendingUp,
  CheckCircle2,
  XCircle,
  DollarSign,
  Globe,
  Activity,
  Target,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Highlight, themes } from "prism-react-renderer";
import { useEffect, useState } from "react";
import DocsLayout from "@/components/docs/DocsLayout";
import PageViewCounter from "@/components/PageViewCounter";
import StoryLoveButton from "@/components/StoryLoveButton";
import StoryNavigation from "@/components/StoryNavigation";

const PAGE_TITLE = "Financial Fraud Detection - When AI Tracks Suspicious Money Flows";
const PAGE_DESCRIPTION =
  "Track sophisticated fraud schemes through relationship queries. Learn how AI detects layered transfers, mirror counterparties, and shell company structures in real-time.";
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

const TransactionFlow = ({ 
  fromAccount, 
  toAccount, 
  amount, 
  status, 
  riskLevel 
}: { 
  fromAccount: string; 
  toAccount: string; 
  amount: string; 
  status: string; 
  riskLevel: "high" | "medium" | "low" 
}) => (
  <div className={`rounded-xl border p-6 ${
    riskLevel === "high" ? "border-destructive/50 bg-destructive/10" :
    riskLevel === "medium" ? "border-secondary/50 bg-secondary/10" :
    "border-accent/50 bg-accent/10"
  }`}>
    <div className="flex items-center justify-between mb-4">
      <span className={`text-xs font-semibold uppercase tracking-wider ${
        riskLevel === "high" ? "text-destructive" :
        riskLevel === "medium" ? "text-secondary" :
        "text-accent"
      }`}>
        {riskLevel} Risk Transaction
      </span>
      <span className={`rounded-full px-3 py-1 text-xs font-medium ${
        status === "PENDING_REVIEW" ? "bg-destructive/20 text-destructive" :
        "bg-accent/20 text-accent"
      }`}>
        {status}
      </span>
    </div>
    <div className="space-y-3">
      <div className="rounded-lg border border-border/30 bg-card/50 p-3">
        <p className="text-xs text-muted-foreground mb-1">FROM</p>
        <p className="text-sm font-medium text-foreground">{fromAccount}</p>
      </div>
      <div className="flex items-center justify-center">
        <div className="flex items-center gap-2">
          <div className="h-px w-8 bg-gradient-primary" />
          <DollarSign className={`h-5 w-5 ${
            riskLevel === "high" ? "text-destructive" : "text-primary"
          }`} />
          <span className="text-lg font-bold text-foreground">{amount}</span>
          <div className="h-px w-8 bg-gradient-primary" />
        </div>
      </div>
      <div className="rounded-lg border border-border/30 bg-card/50 p-3">
        <p className="text-xs text-muted-foreground mb-1">TO</p>
        <p className="text-sm font-medium text-foreground">{toAccount}</p>
      </div>
    </div>
  </div>
);

const RiskIndicator = ({ label, value, level }: { label: string; value: string; level: "high" | "medium" | "low" }) => (
  <div className={`rounded-lg border p-3 ${
    level === "high" ? "border-destructive/30 bg-destructive/5" :
    level === "medium" ? "border-secondary/30 bg-secondary/5" :
    "border-accent/30 bg-accent/5"
  }`}>
    <p className="text-xs text-muted-foreground mb-1">{label}</p>
    <p className={`text-lg font-bold ${
      level === "high" ? "text-destructive" :
      level === "medium" ? "text-secondary" :
      "text-accent"
    }`}>
      {value}
    </p>
  </div>
);

const FinancialFraudDetectionStory = () => {
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
                <Shield className="h-4 w-4" />
                Real API Story
              </span>
              <div className="flex items-center gap-3">
                <StoryLoveButton storySlug="financial-fraud-detection" />
                <PageViewCounter />
              </div>
            </div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl"
            >
              <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
                When AI Tracks <span className="text-gradient">Suspicious Money Flows</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mb-8">
                The story of how natural language fraud detection transformed compliance from drowning 
                in false positives to pinpointing sophisticated schemes in milliseconds.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2 text-sm text-accent">
                  <Activity className="h-4 w-4" />
                  Relationship Intelligence
                </div>
                <div className="flex items-center gap-2 rounded-full bg-secondary/10 px-4 py-2 text-sm text-secondary">
                  <Globe className="h-4 w-4" />
                  Global Transactions
                </div>
                <div className="flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm text-primary">
                  <Target className="h-4 w-4" />
                  87% Detection Rate
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
            <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-8 mb-12">
              <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-3">
                <AlertTriangle className="h-6 w-6 text-destructive" />
                The Billion-Dollar Blind Spot
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                You're a compliance engineer at a global financial institution. Every day, <strong className="text-foreground">billions 
                of dollars</strong> flow through your wire transfer system. Hidden within this tsunami of legitimate transactions 
                are sophisticated fraud schemes: layered transfers, mirror counterparty networks, and shell company structures.
              </p>
              <div className="grid gap-4 md:grid-cols-2 mt-6">
                <div className="rounded-xl border border-destructive/50 bg-destructive/10 p-6">
                  <h5 className="font-bold text-destructive mb-3 flex items-center gap-2">
                    <XCircle className="h-5 w-5" />
                    Traditional Rule-Based Systems
                  </h5>
                  <ul className="text-sm space-y-2 text-muted-foreground">
                    <li>• 10,000+ false positives daily</li>
                    <li>• Compliance team drowning in alerts</li>
                    <li>• Can't detect relationship patterns</li>
                    <li>• SQL queries take 30+ seconds</li>
                    <li>• Sophisticated schemes slip through</li>
                  </ul>
                </div>
                <div className="rounded-xl border border-accent/50 bg-accent/10 p-6">
                  <h5 className="font-bold text-accent mb-3 flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5" />
                    AI Relationship Intelligence
                  </h5>
                  <ul className="text-sm space-y-2 text-muted-foreground">
                    <li>• Natural language queries</li>
                    <li>• Cross-account relationship mapping</li>
                    <li>• Geographic risk analysis</li>
                    <li>• Mirror ownership detection</li>
                    <li>• Results in milliseconds</li>
                  </ul>
                </div>
              </div>
              <p className="text-foreground font-medium mt-6">
                <strong>You need AI that understands relationships</strong> between accounts, transactions, and 
                risk patterns—and you need it fast.
              </p>
            </div>
          </motion.div>
        </section>

        {/* The Story */}
        <section className="px-6 py-8">
          <div className="max-w-4xl">
            {/* Act I: The Setup */}
            <StoryAct number="Act I" title="The Suspicious Wire Transfer" emoji="🚨">
              <p>
                Your fraud detection system monitors three accounts. One transaction immediately triggers 
                multiple red flags:
              </p>

              <div className="grid gap-6 mt-6">
                <TransactionFlow 
                  fromAccount="High-Risk Origin Account (Risk: 0.83)"
                  toAccount="Counterparty Account (Same Owner!)"
                  amount="$40,000"
                  status="PENDING_REVIEW"
                  riskLevel="high"
                />

                <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6">
                  <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-destructive" />
                    Red Flags Detected
                  </h4>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <RiskIndicator label="Amount" value="$40,000" level="high" />
                    <RiskIndicator label="Threshold" value="> $25,000" level="high" />
                    <RiskIndicator label="Risk Score" value="0.83" level="high" />
                    <RiskIndicator label="Channel" value="Wire Transfer" level="high" />
                  </div>
                  <div className="mt-4 p-4 rounded-lg bg-destructive/10 border border-destructive/30">
                    <p className="text-sm font-medium text-foreground mb-2">🔍 Critical Pattern:</p>
                    <p className="text-sm text-muted-foreground">
                      <strong className="text-destructive">Mirror Ownership:</strong> Origin and counterparty accounts 
                      have the SAME owner in a HIGH-RISK geographic corridor
                    </p>
                  </div>
                </div>

                <div>
                  <h5 className="text-sm font-semibold text-foreground mb-3">Compare to Legitimate Transaction:</h5>
                  <TransactionFlow 
                    fromAccount="Sunrise Foods (Stable Region, Risk: 0.35)"
                    toAccount="Supplier Account (Different Owner)"
                    amount="$50,000"
                    status="CLEARED"
                    riskLevel="low"
                  />
                  <div className="mt-3 grid gap-2 grid-cols-2 md:grid-cols-4">
                    <RiskIndicator label="Risk Score" value="0.35" level="low" />
                    <RiskIndicator label="Channel" value="ACH" level="medium" />
                    <RiskIndicator label="Business" value="Legitimate" level="low" />
                    <RiskIndicator label="Ownership" value="Different" level="low" />
                  </div>
                </div>
              </div>
            </StoryAct>

            {/* Act II: The Natural Language Query */}
            <StoryAct number="Act II" title="The Compliance Analyst's Query" emoji="🔍">
              <p>
                Your compliance analyst doesn't know SQL. They don't need to. They simply ask in natural language:
              </p>

              <div className="rounded-xl border border-primary/30 bg-primary/5 p-6 mt-4">
                <p className="text-lg font-medium text-foreground text-center">
                  "List suspicious transactions over $25k from high-risk regions routed through the same counterparty"
                </p>
              </div>

              <h4 className="text-lg font-semibold text-foreground mt-8 mb-4">
                Behind the Scenes: AI Processing Pipeline
              </h4>

              <div className="space-y-4">
                <div className="rounded-lg border border-border/50 bg-card p-4">
                  <h5 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-xs text-primary">1</span>
                    Context Understanding
                  </h5>
                  <ul className="text-sm space-y-1 ml-8 text-muted-foreground">
                    <li>• "suspicious" → high risk score, pending status</li>
                    <li>• "over $25k" → amount threshold filter</li>
                    <li>• "high-risk regions" → geographic risk analysis</li>
                    <li>• "same counterparty" → relationship matching</li>
                  </ul>
                </div>

                <div className="rounded-lg border border-border/50 bg-card p-4">
                  <h5 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary/20 text-xs text-secondary">2</span>
                    Complex Relationship Query Generation
                  </h5>
                  <CodeBlock code={`SELECT t FROM TransactionEntity t
JOIN t.originAccount origin
JOIN origin.accountHolder originHolder
JOIN t.counterpartyAccount counterparty
JOIN counterparty.accountHolder counterHolder
WHERE t.amount > 25000
  AND t.status = 'PENDING_REVIEW'
  AND t.channel = 'WIRE'
  AND origin.region LIKE '%high-risk%'
  AND originHolder.ownerName = counterHolder.ownerName
  -- ^ MIRROR OWNERSHIP DETECTION
ORDER BY t.riskScore DESC, t.amount DESC`} language="sql" />
                </div>

                <div className="rounded-lg border border-border/50 bg-card p-4">
                  <h5 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent/20 text-xs text-accent">3</span>
                    Semantic Pattern Recognition
                  </h5>
                  <div className="ml-8 space-y-2 text-sm text-muted-foreground">
                    <p>• Embeds fraud patterns: "layered wire transfers mirror counterparty shell structure"</p>
                    <p>• Matches similar historical fraud cases</p>
                    <p>• Cross-references known risk corridors</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-xl bg-gradient-primary p-6">
                <h5 className="text-lg font-semibold text-primary-foreground mb-3">
                  Detection Result: Fraud Pattern Identified
                </h5>
                <div className="rounded-lg bg-white/10 backdrop-blur p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-primary-foreground/80">Transaction ID:</span>
                    <span className="font-mono text-sm text-primary-foreground">TXN-40K-WIRE</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-primary-foreground/80">Amount:</span>
                    <span className="font-bold text-lg text-primary-foreground">$40,000</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-primary-foreground/80">Risk Score:</span>
                    <span className="font-bold text-lg text-destructive">0.83 (HIGH)</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-primary-foreground/80">Pattern:</span>
                    <span className="font-medium text-sm text-primary-foreground">Mirror Ownership + Geographic Risk</span>
                  </div>
                  <div className="mt-4 p-3 rounded bg-destructive/20 border border-destructive/30">
                    <p className="text-xs text-primary-foreground">
                      <strong>⚠️ ALERT:</strong> Escalated to senior compliance • Law enforcement notified • 
                      Account frozen pending investigation
                    </p>
                  </div>
                </div>
              </div>
            </StoryAct>

            {/* Act III: The Technology */}
            <StoryAct number="Act III" title="The Framework Behind Detection" emoji="⚙️">
              <p>
                The AI Fabric Framework makes sophisticated fraud detection accessible through its 
                <strong className="text-foreground"> Relationship Query Intelligence</strong> module.
              </p>

              <h4 className="text-lg font-semibold text-foreground mt-8 mb-4">
                Implementation: Production-Ready Fraud Detection
              </h4>

              <CodeBlock code={`// 1. Define fraud detection action
@AIAction(
    name = "fraud_detection",
    description = "Detect suspicious financial transactions",
    requiresConfirmation = false  // Auto-execute for monitoring
)

// 2. Execute relationship query
RAGResponse response = queryService.execute(
    "suspicious transactions over $25k from high-risk regions",
    List.of("TransactionEntity", "AccountEntity", "AccountHolderEntity"),
    RAGQueryOptions.builder()
        .enableRelationshipQueries(true)
        .maxResults(100)
        .similarityThreshold(0.80)
        .build()
);

// 3. Analyze relationships and risk patterns
List<Transaction> suspicious = response.getResults().stream()
    .filter(tx -> tx.getRiskScore() > 0.75)
    .filter(tx -> hasMirrorOwnership(tx))
    .sorted(Comparator.comparing(Transaction::getRiskScore).reversed())
    .toList();

// 4. Trigger compliance workflow
suspicious.forEach(tx -> {
    complianceService.escalate(tx);
    auditService.logSuspiciousActivity(tx);
    if (tx.getRiskScore() > 0.90) {
        lawEnforcementService.notify(tx);
    }
});`} />

              <h4 className="text-lg font-semibold text-foreground mt-8 mb-4">
                What the Framework Provides
              </h4>

              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  "Natural language fraud queries",
                  "Multi-entity relationship joins",
                  "Geographic risk scoring",
                  "Mirror ownership detection",
                  "Real-time pattern matching",
                  "Semantic similarity ranking",
                  "Automatic SQL generation",
                  "Audit trail logging",
                  "Compliance workflow integration",
                  "Historical pattern analysis"
                ].map((feature, i) => (
                  <div key={i} className="flex items-start gap-3 rounded-lg border border-border/50 bg-card p-3">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-accent mt-0.5" />
                    <span className="text-sm text-foreground">{feature}</span>
                  </div>
                ))}
              </div>
            </StoryAct>

            {/* Act IV: The Impact */}
            <StoryAct number="Act IV" title="The Business Impact" emoji="📊">
              <h4 className="text-lg font-semibold text-foreground mb-4">
                Transformation Metrics: Before vs After
              </h4>

              <div className="grid gap-6 md:grid-cols-2 mb-6">
                <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6">
                  <h5 className="text-lg font-bold text-destructive mb-4">
                    ❌ Traditional Systems
                  </h5>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-start gap-2">
                      <XCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-foreground">10,000+ daily alerts</strong>
                        <p className="text-muted-foreground">95% false positives</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <XCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-foreground">30+ second queries</strong>
                        <p className="text-muted-foreground">Manual SQL required</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <XCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-foreground">$2.5M annual losses</strong>
                        <p className="text-muted-foreground">From missed fraud patterns</p>
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="rounded-xl border border-accent/30 bg-accent/5 p-6">
                  <h5 className="text-lg font-bold text-accent mb-4">
                    ✅ AI-Powered Detection
                  </h5>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-foreground">200 daily alerts</strong>
                        <p className="text-muted-foreground">87% true positive rate</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-foreground">120ms query time</strong>
                        <p className="text-muted-foreground">Natural language interface</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-foreground">$2.1M prevented</strong>
                        <p className="text-muted-foreground">First year fraud prevention</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="rounded-xl bg-gradient-primary p-6 text-center mb-6">
                <p className="text-2xl font-bold text-primary-foreground mb-2">
                  98% Reduction in False Positives
                </p>
                <p className="text-primary-foreground/80">
                  Compliance team now focuses on real threats, not noise
                </p>
              </div>

              <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
                {[
                  { value: "120ms", label: "Query Response" },
                  { value: "87%", label: "Detection Rate" },
                  { value: "$2.1M", label: "Fraud Prevented" },
                  { value: "98%", label: "Fewer Alerts" }
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

        {/* Try It Yourself */}
        <section className="border-t border-border/50 bg-muted/30 py-12 px-6">
          <div className="max-w-4xl">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-3">
                <Zap className="h-6 w-6 text-primary" />
                Deploy This in Your Compliance System
              </h2>
              <p className="text-muted-foreground mb-8">
                The AI Fabric Framework provides enterprise-grade fraud detection out of the box. 
                Validate exact dependencies, policy behavior, and release checks in the current AI Fabric guides.
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <Button variant="hero" size="lg" asChild>
                  <a href="https://github.com/Loom-AI-Labs/ai-fabric-framework" target="_blank" rel="noopener noreferrer">
                    ⭐ Star on GitHub
                  </a>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/docs/relationship_query_story_v2">
                    Learn About Relationship Queries →
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
                to="/docs/ecommerce-product-discovery-story"
                className="group rounded-xl border border-border/50 bg-card p-5 hover:border-primary/50 hover:shadow-lg transition-all"
              >
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
                  E-Commerce Product Discovery →
                </h3>
                <p className="text-sm text-muted-foreground">
                  Natural language product search that understands context
                </p>
              </Link>
              <Link 
                to="/docs/law-firm-document-story"
                className="group rounded-xl border border-border/50 bg-card p-5 hover:border-primary/50 hover:shadow-lg transition-all"
              >
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
                  Law Firm Document Management →
                </h3>
                <p className="text-sm text-muted-foreground">
                  Find critical documents in seconds, not hours
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
            <StoryLoveButton storySlug="financial-fraud-detection" />
            <p className="text-sm text-muted-foreground text-center">
              Real API Integration Story • Part of AI Fabric Framework • See current guides for exact setup
            </p>
          </div>
        </footer>
      </div>
    </DocsLayout>
  );
};

export default FinancialFraudDetectionStory;
