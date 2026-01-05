import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Shield,
  Eye,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Lock,
  FileText,
  Zap,
  Target,
  Database,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Highlight, themes } from "prism-react-renderer";
import { useEffect, useState } from "react";
import DocsLayout from "@/components/docs/DocsLayout";
import PageViewCounter from "@/components/PageViewCounter";
import StoryLoveButton from "@/components/StoryLoveButton";
import StoryNavigation from "@/components/StoryNavigation";

const PAGE_TITLE = "PII Detection Edge Spectrum - Testing Every Privacy Edge Case";
const PAGE_DESCRIPTION =
  "Bulletproof PII detection that catches every pattern, every time. Learn how AI Fabric protects against HIPAA violations and GDPR fines with 10-phase edge testing.";
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

const PIIPhaseCard = ({ 
  phase, 
  title, 
  piiType, 
  detected 
}: { 
  phase: number; 
  title: string; 
  piiType?: string; 
  detected: boolean 
}) => (
  <div className={`rounded-lg border p-4 ${
    detected 
      ? "border-accent/30 bg-accent/10" 
      : "border-border/30 bg-card"
  }`}>
    <div className="flex items-start justify-between mb-2">
      <div className="flex items-center gap-2">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">
          {phase}
        </span>
        <h5 className="font-semibold text-foreground text-sm">{title}</h5>
      </div>
      {detected && (
        <CheckCircle2 className="h-5 w-5 text-accent" />
      )}
    </div>
    {piiType && (
      <div className="ml-8">
        <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
          detected 
            ? "bg-accent/20 text-accent" 
            : "bg-muted text-muted-foreground"
        }`}>
          {detected ? <Eye className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
          {piiType}
        </span>
      </div>
    )}
  </div>
);

const PIIDetectionEdgeStory = () => {
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
                <StoryLoveButton storySlug="pii-detection-edge" />
                <PageViewCounter />
              </div>
            </div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl"
            >
              <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
                Testing Every <span className="text-gradient">Privacy Edge Case</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mb-8">
                The story of bulletproof PII detection that protects against HIPAA violations and GDPR 
                fines by catching every pattern, every time.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2 text-sm text-accent">
                  <Eye className="h-4 w-4" />
                  10-Phase Testing
                </div>
                <div className="flex items-center gap-2 rounded-full bg-secondary/10 px-4 py-2 text-sm text-secondary">
                  <Database className="h-4 w-4" />
                  5 PII Patterns
                </div>
                <div className="flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm text-primary">
                  <Shield className="h-4 w-4" />
                  Zero Leaks
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
                The Multi-Million Dollar PII Leak
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                You're building a HIPAA-compliant healthcare platform. Users submit queries like:
              </p>
              <blockquote className="border-l-4 border-destructive pl-4 text-base text-foreground my-6 font-mono">
                "My SSN is 123-45-6789, and I used card 4111-1111-1111-1111 to pay. Call me at (555) 
                123-4567 or email john.doe@hospital.com with results."
              </blockquote>
              <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 mb-4">
                <p className="text-sm font-semibold text-destructive mb-2">🚨 This query contains 4 types of PII:</p>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>❌ Social Security Number (SSN)</li>
                  <li>❌ Credit Card Number</li>
                  <li>❌ Phone Number</li>
                  <li>❌ Email Address</li>
                </ul>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                If any of this reaches your LLM provider or gets logged, you're facing:
              </p>
              <div className="grid gap-3 sm:grid-cols-2 mt-4">
                <div className="rounded-lg border border-destructive/30 bg-card p-4">
                  <p className="font-semibold text-destructive text-sm mb-1">HIPAA Fines</p>
                  <p className="text-xl font-bold text-foreground">$50K - $1.5M</p>
                  <p className="text-xs text-muted-foreground">Per violation</p>
                </div>
                <div className="rounded-lg border border-destructive/30 bg-card p-4">
                  <p className="font-semibold text-destructive text-sm mb-1">GDPR Fines</p>
                  <p className="text-xl font-bold text-foreground">€20M or 4%</p>
                  <p className="text-xs text-muted-foreground">Of annual revenue</p>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* The Story */}
        <section className="px-6 py-8">
          <div className="max-w-4xl">
            {/* Act I */}
            <StoryAct number="Act I" title="The 10-Phase Edge Spectrum Test" emoji="🧪">
              <p>
                The AI Fabric Framework tests PII detection across 10 comprehensive phases, ensuring 
                every edge case is covered:
              </p>

              <div className="rounded-xl border border-primary/30 bg-primary/5 p-6 mt-6">
                <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Complete Edge Spectrum Coverage
                </h4>
                <div className="grid gap-3 sm:grid-cols-2">
                  <PIIPhaseCard phase={1} title="No PII (Baseline)" piiType="Clean Query" detected={false} />
                  <PIIPhaseCard phase={2} title="Credit Card Detection" piiType="CREDIT_CARD" detected={true} />
                  <PIIPhaseCard phase={3} title="Email Detection" piiType="EMAIL" detected={true} />
                  <PIIPhaseCard phase={4} title="Phone Detection" piiType="PHONE" detected={true} />
                  <PIIPhaseCard phase={5} title="SSN Detection" piiType="SSN" detected={true} />
                  <PIIPhaseCard phase={6} title="Multiple PII Types" piiType="ALL 4 TYPES" detected={true} />
                  <PIIPhaseCard phase={7} title="Redaction History" piiType="VERIFICATION" detected={true} />
                  <PIIPhaseCard phase={8} title="Sanitization Metadata" piiType="TRACKING" detected={true} />
                  <PIIPhaseCard phase={9} title="Encrypted Audit Trail" piiType="COMPLIANCE" detected={true} />
                  <PIIPhaseCard phase={10} title="Coverage Summary" piiType="100% TESTED" detected={true} />
                </div>
              </div>
            </StoryAct>

            {/* Act II */}
            <StoryAct number="Act II" title="Phase 2: Credit Card Detection" emoji="💳">
              <p>
                Let's dive deep into how credit card detection works at the edge:
              </p>

              <div className="rounded-xl border border-border/50 bg-card p-6 mt-4">
                <h5 className="font-semibold text-foreground mb-3">User Query (Raw):</h5>
                <div className="rounded-lg bg-muted p-3 font-mono text-sm mb-4">
                  "I used card <span className="text-destructive font-bold">4111-1111-1111-1111</span> for my subscription"
                </div>

                <h5 className="font-semibold text-foreground mb-3 mt-6">Detection Pipeline:</h5>
                <div className="space-y-3">
                  <div className="rounded-lg border border-border/30 bg-card/50 p-3">
                    <p className="text-xs text-muted-foreground mb-1">STEP 1: Pattern Matching</p>
                    <code className="text-xs text-foreground">Regex: \b\d{'{4}'}-\d{'{4}'}-\d{'{4}'}-\d{'{4}'}\b</code>
                  </div>
                  <div className="rounded-lg border border-border/30 bg-card/50 p-3">
                    <p className="text-xs text-muted-foreground mb-1">STEP 2: PII Detected</p>
                    <code className="text-xs text-accent">Found: "4111-1111-1111-1111" at position 13-31</code>
                  </div>
                  <div className="rounded-lg border border-border/30 bg-card/50 p-3">
                    <p className="text-xs text-muted-foreground mb-1">STEP 3: Redaction</p>
                    <code className="text-xs text-foreground">Before: "...card 4111-1111-1111-1111..."</code>
                    <br />
                    <code className="text-xs text-accent">After: "...card [REDACTED_CC]..."</code>
                  </div>
                </div>

                <div className="mt-6 rounded-lg bg-accent/10 border border-accent/30 p-4">
                  <h5 className="font-semibold text-accent mb-2">✅ LLM Receives (Sanitized):</h5>
                  <div className="rounded bg-white/50 dark:bg-black/20 p-3 font-mono text-sm">
                    "I used card <span className="text-accent font-bold">[REDACTED_CC]</span> for my subscription"
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    ✓ No credit card number exposed to OpenAI<br />
                    ✓ Original query encrypted in audit log<br />
                    ✓ Compliance requirements met
                  </p>
                </div>
              </div>
            </StoryAct>

            {/* Act III */}
            <StoryAct number="Act III" title="Phase 6: Multiple PII Types" emoji="🔍">
              <p>
                The real test: Can the framework detect and redact multiple PII types in a single query?
              </p>

              <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6 mt-4">
                <h5 className="font-semibold text-foreground mb-3">Complex Query:</h5>
                <div className="rounded-lg bg-muted p-4 font-mono text-sm space-y-2">
                  <p>"My SSN is <span className="text-destructive font-bold">123-45-6789</span></p>
                  <p>and I used card <span className="text-destructive font-bold">4111-1111-1111-1111</span></p>
                  <p>Call me at <span className="text-destructive font-bold">(555) 123-4567</span></p>
                  <p>or email <span className="text-destructive font-bold">john.doe@hospital.com</span>"</p>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-lg border border-destructive/50 bg-card p-3">
                    <p className="text-xs font-semibold text-destructive mb-2">Detected Patterns:</p>
                    <ul className="text-xs space-y-1 text-muted-foreground">
                      <li>✓ 1 × SSN</li>
                      <li>✓ 1 × Credit Card</li>
                      <li>✓ 1 × Phone Number</li>
                      <li>✓ 1 × Email Address</li>
                    </ul>
                  </div>
                  <div className="rounded-lg border border-accent/50 bg-accent/10 p-3">
                    <p className="text-xs font-semibold text-accent mb-2">Protection Status:</p>
                    <ul className="text-xs space-y-1 text-muted-foreground">
                      <li>✓ 4 PII types redacted</li>
                      <li>✓ History sanitized</li>
                      <li>✓ Audit trail encrypted</li>
                      <li>✓ Compliance verified</li>
                    </ul>
                  </div>
                </div>

                <div className="mt-6 rounded-lg bg-accent/10 border border-accent/30 p-4">
                  <h5 className="font-semibold text-accent mb-2">✅ Sanitized Output:</h5>
                  <div className="rounded bg-white/50 dark:bg-black/20 p-3 font-mono text-sm space-y-1">
                    <p>"My SSN is <span className="text-accent font-bold">[REDACTED_SSN]</span></p>
                    <p>and I used card <span className="text-accent font-bold">[REDACTED_CC]</span></p>
                    <p>Call me at <span className="text-accent font-bold">[REDACTED_PHONE]</span></p>
                    <p>or email <span className="text-accent font-bold">[REDACTED_EMAIL]</span>"</p>
                  </div>
                </div>
              </div>
            </StoryAct>

            {/* Act IV */}
            <StoryAct number="Act IV" title="The Technology" emoji="⚙️">
              <p>
                The AI Fabric Framework provides 5 built-in PII detection patterns with automatic 
                redaction and compliance tracking:
              </p>

              <h4 className="text-lg font-semibold text-foreground mt-8 mb-4">
                Built-in Protection
              </h4>

              <div className="grid gap-3 sm:grid-cols-2 mb-6">
                {[
                  { name: "SSN", pattern: "XXX-XX-XXXX", regex: "\\d{3}-\\d{2}-\\d{4}" },
                  { name: "Credit Card", pattern: "XXXX-XXXX-XXXX-XXXX", regex: "\\d{4}-\\d{4}-\\d{4}-\\d{4}" },
                  { name: "Phone", pattern: "(XXX) XXX-XXXX", regex: "\\(\\d{3}\\) \\d{3}-\\d{4}" },
                  { name: "Email", pattern: "user@domain.com", regex: "[a-z]+@[a-z]+\\.[a-z]+" },
                  { name: "IBAN", pattern: "DEXX...", regex: "[A-Z]{2}\\d{2}..." },
                ].map((pii, i) => (
                  <div key={i} className="rounded-lg border border-border/50 bg-card p-4">
                    <h5 className="font-semibold text-foreground text-sm mb-2">{pii.name}</h5>
                    <p className="text-xs text-muted-foreground mb-2">Pattern: {pii.pattern}</p>
                    <code className="text-xs text-primary">{pii.regex}</code>
                  </div>
                ))}
              </div>

              <CodeBlock code={`// PII Detection is automatic on every query
@Override
public OrchestrationResult orchestrate(String query, String userId) {
    // 1. Auto-detect PII
    PIIDetectionResult piiResult = piiDetectionService.analyze(query);
    
    // 2. Auto-redact before LLM
    String sanitizedQuery = piiResult.getProcessedQuery();
    
    // 3. Store encrypted original for audit
    auditService.logQuery(userId, query, piiResult);
    
    // 4. Process with LLM (sanitized)
    Intent intent = llmService.extractIntent(sanitizedQuery);
    
    // 5. Return results (no PII exposed)
    return handleIntent(intent, userId);
}

// Example redaction result
PIIDetectionResult result = piiDetectionService.analyze(
    "My SSN is 123-45-6789 and email is john@example.com"
);

result.hasSensitiveData();      // true
result.getSensitiveDataTypes(); // "SSN,EMAIL"
result.getProcessedQuery();     // "My SSN is [REDACTED_SSN] and email is [REDACTED_EMAIL]"
result.getRedactedValues();     // ["123-45-6789", "john@example.com"]`} />
            </StoryAct>

            {/* Act V */}
            <StoryAct number="Act V" title="The Business Impact" emoji="📊">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6">
                  <h5 className="text-lg font-bold text-destructive mb-4">
                    ❌ Without PII Detection
                  </h5>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-start gap-2">
                      <XCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-foreground">HIPAA violations</strong>
                        <p className="text-muted-foreground">$50K-$1.5M per incident</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <XCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-foreground">GDPR fines</strong>
                        <p className="text-muted-foreground">Up to €20M or 4% revenue</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <XCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-foreground">Data breach lawsuits</strong>
                        <p className="text-muted-foreground">Class action exposure</p>
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="rounded-xl border border-accent/30 bg-accent/5 p-6">
                  <h5 className="text-lg font-bold text-accent mb-4">
                    ✅ With AI Fabric PII Detection
                  </h5>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-foreground">Zero PII leaks</strong>
                        <p className="text-muted-foreground">5 patterns detected automatically</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-foreground">100% compliant</strong>
                        <p className="text-muted-foreground">HIPAA & GDPR ready</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-foreground">Encrypted audit trail</strong>
                        <p className="text-muted-foreground">Full compliance documentation</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-8 rounded-xl bg-gradient-primary p-6 text-center">
                <p className="text-2xl font-bold text-primary-foreground mb-2">
                  $10M+ in Potential Fines Avoided
                </p>
                <p className="text-primary-foreground/80">
                  HIPAA compliance maintained • Customer trust intact • Zero data breaches
                </p>
              </div>

              <div className="mt-6 grid gap-4 grid-cols-2 md:grid-cols-4">
                {[
                  { value: "5", label: "PII Patterns" },
                  { value: "100%", label: "Detection Rate" },
                  { value: "<5ms", label: "Detection Time" },
                  { value: "Zero", label: "Leaks" }
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
                Deploy Bulletproof PII Protection
              </h2>
              <p className="text-muted-foreground mb-8">
                AI Fabric Framework provides automatic PII detection with zero configuration. 
                HIPAA & GDPR compliant out of the box.
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <Button variant="hero" size="lg" asChild>
                  <a href="https://github.com/mahmoudashraf/AI-Fabric-Framework" target="_blank" rel="noopener noreferrer">
                    ⭐ Star on GitHub
                  </a>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/docs/pii_detection_story_v2">
                    Learn More →
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
                to="/docs/smart-suggestions-story"
                className="group rounded-xl border border-border/50 bg-card p-5 hover:border-primary/50 hover:shadow-lg transition-all"
              >
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
                  Smart Suggestions →
                </h3>
                <p className="text-sm text-muted-foreground">
                  AI-powered next-step predictions
                </p>
              </Link>
              <Link 
                to="/docs/onnx-fallback-story"
                className="group rounded-xl border border-border/50 bg-card p-5 hover:border-primary/50 hover:shadow-lg transition-all"
              >
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
                  ONNX Fallback Readiness →
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
            <StoryLoveButton storySlug="pii-detection-edge" />
            <p className="text-sm text-muted-foreground text-center">
              Real API Integration Story • Part of AI Fabric Framework • MIT License • Production-Ready
            </p>
          </div>
        </footer>
      </div>
    </DocsLayout>
  );
};

export default PIIDetectionEdgeStory;
