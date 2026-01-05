import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Highlight, themes } from "prism-react-renderer";
import DocsLayout from "@/components/docs/DocsLayout";
import PageViewCounter from "@/components/PageViewCounter";
import StoryLoveButton from "@/components/StoryLoveButton";
import StoryNavigation from "@/components/StoryNavigation";
import { 
  Shield,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Eye,
  Lock,
  Brain,
  Zap,
  Users,
  Database,
  FileCode,
  Code,
  Key,
  Search,
  MessageSquare,
  Settings,
  BookOpen,
  ArrowRight,
  Ban,
  Clock,
  DollarSign,
  CreditCard,
  Fingerprint,
  Mail,
  Phone,
  FileText
} from "lucide-react";

const PAGE_TITLE = "PII Detection: Building Privacy Into Every Request - AI Fabric Framework";
const PAGE_DESCRIPTION = "How we built automatic PII detection that redacts sensitive data before it reaches your LLM—GDPR-compliant by default.";

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

const ProblemList = () => {
  const problems = [
    { icon: XCircle, text: "SSN sent to LLM (OpenAI, Anthropic, Azure)", color: "text-red-400" },
    { icon: XCircle, text: "Email stored in logs", color: "text-red-400" },
    { icon: XCircle, text: "Credit card in database", color: "text-red-400" },
    { icon: XCircle, text: "Phone number in vector embeddings", color: "text-red-400" },
    { icon: XCircle, text: "GDPR violation (€20M fine)", color: "text-red-400" },
    { icon: XCircle, text: "HIPAA violation ($1.5M fine)", color: "text-red-400" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 my-6">
      {problems.map((problem, i) => {
        const Icon = problem.icon;
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            viewport={{ once: true }}
            className="flex items-center gap-3 p-4 rounded-lg bg-destructive/5 border border-destructive/30"
          >
            <Icon className={`h-5 w-5 ${problem.color}`} />
            <span className="text-sm text-muted-foreground">{problem.text}</span>
          </motion.div>
        );
      })}
    </div>
  );
};

const DetectionModeCard = ({ title, icon: Icon, description, example, color, mode }: { 
  title: string; 
  icon: any; 
  description: string; 
  example: { input: string; output: string };
  color: string;
  mode: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="rounded-xl border border-border/50 bg-card p-6"
  >
    <div className="flex items-center gap-3 mb-4">
      <div className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
      <div>
        <h3 className="font-bold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
    <div className="space-y-3">
      <div className="p-3 rounded-lg bg-muted/30 border border-border/30">
        <p className="text-xs font-semibold text-foreground mb-1">Input:</p>
        <p className="text-sm text-muted-foreground font-mono">{example.input}</p>
      </div>
      <ArrowRight className="h-4 w-4 text-primary mx-auto" />
      <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
        <p className="text-xs font-semibold text-primary mb-1">Output:</p>
        <p className="text-sm text-foreground font-mono">{example.output}</p>
      </div>
    </div>
    <div className="mt-4 p-2 rounded-lg bg-muted/30 text-center">
      <span className="text-xs font-semibold text-muted-foreground">Mode: {mode}</span>
    </div>
  </motion.div>
);

const PatternCard = ({ name, icon: Icon, pattern, example, replacement, color }: {
  name: string;
  icon: any;
  pattern: string;
  example: string;
  replacement: string;
  color: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="rounded-lg border border-border/50 bg-card p-5"
  >
    <div className="flex items-center gap-3 mb-3">
      <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center`}>
        <Icon className="h-5 w-5 text-white" />
      </div>
      <h4 className="font-bold text-foreground">{name}</h4>
    </div>
    <div className="space-y-2">
      <div>
        <p className="text-xs font-semibold text-muted-foreground mb-1">Pattern:</p>
        <code className="text-xs bg-muted px-2 py-1 rounded">{pattern}</code>
      </div>
      <div>
        <p className="text-xs font-semibold text-muted-foreground mb-1">Example:</p>
        <p className="text-sm text-foreground font-mono">{example}</p>
      </div>
      <div>
        <p className="text-xs font-semibold text-muted-foreground mb-1">Redacted to:</p>
        <p className="text-sm text-primary font-mono">{replacement}</p>
      </div>
    </div>
  </motion.div>
);

const FlowStep = ({ step, title, description, code, icon: Icon, color }: {
  step: number;
  title: string;
  description: string;
  code?: string;
  icon: any;
  color: string;
}) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    className="relative pl-8 pb-8 border-l-2 border-border/50 last:border-l-0"
  >
    <div className={`absolute left-0 top-0 w-6 h-6 rounded-full ${color} flex items-center justify-center -translate-x-[13px]`}>
      <Icon className="h-4 w-4 text-white" />
    </div>
    <div className="mb-2">
      <span className="text-xs font-semibold text-primary">STEP {step}</span>
      <h4 className="text-lg font-bold text-foreground mt-1">{title}</h4>
      <p className="text-sm text-muted-foreground mt-1">{description}</p>
    </div>
    {code && <CodeBlock code={code} />}
  </motion.div>
);

const PIIDetectionStoryV1 = () => {
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
    updateMeta('meta[property="og:type"]', "content", "article");
    updateMeta('meta[property="og:url"]', "content", window.location.href);

    updateMeta('meta[name="twitter:title"]', "content", PAGE_TITLE);
    updateMeta('meta[name="twitter:description"]', "content", PAGE_DESCRIPTION);
    updateMeta('meta[name="twitter:card"]', "content", "summary_large_image");

    updateCanonical(window.location.href);
  }, []);

  return (
    <DocsLayout>
      <div className="min-h-screen">
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-border/50">
          <div className="absolute inset-0 bg-gradient-glow opacity-50" />
          <div className="px-6 py-16 relative">
            <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                  <span className="text-2xl">🔒</span>
                  PII Detection V1
                </span>
                <Link 
                  to="/docs/pii_detection_story_v2"
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  View V2 (Narrative) →
                </Link>
              </div>
              <div className="flex items-center gap-3">
                <StoryLoveButton storySlug="pii_detection_story_v1" />
                <PageViewCounter />
              </div>
            </div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl"
            >
              <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
                PII Detection: Building{" "}
                <span className="text-gradient">Privacy Into Every Request</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mb-8">
                How we built automatic PII detection that redacts sensitive data before it reaches 
                your LLM—GDPR-compliant by default, production-tested, encryption-ready.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2 text-sm text-accent">
                  <Shield className="h-4 w-4" />
                  GDPR Compliant
                </div>
                <div className="flex items-center gap-2 rounded-full bg-secondary/10 px-4 py-2 text-sm text-secondary">
                  <Lock className="h-4 w-4" />
                  HIPAA Ready
                </div>
                <div className="flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm text-primary">
                  <Zap className="h-4 w-4" />
                  Zero Code Changes
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
            <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-8 mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-3">
                <AlertTriangle className="h-6 w-6 text-destructive" />
                The Privacy Nightmare: Users Share Everything
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Customer support chat. Users share sensitive data:
              </p>
              
              <CodeBlock code={`"My SSN is 123-45-6789, email is john@example.com, 
credit card is 4532-1234-5678-9010, and my phone is (555) 123-4567"`} language="text" />
              
              <p className="text-foreground font-medium mt-6">
                <strong>Every AI application's worst nightmare.</strong>
              </p>
            </div>

            <h3 className="text-xl font-bold text-foreground mb-4">Without PII Detection:</h3>
            <ProblemList />
          </motion.div>
        </section>

        {/* The Solution */}
        <section className="px-6 py-12 border-t border-border/50 bg-muted/30">
          <div className="max-w-4xl">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-3">
                <Shield className="h-6 w-6 text-primary" />
                Our Solution: Automatic Detection & Redaction
              </h2>
              <p className="text-muted-foreground mb-8">
                Framework detects PII automatically. Redacts before LLM. Encrypts for audit. Zero code changes.
              </p>
            </motion.div>

            <CodeBlock code={`// User input
String query = "My SSN is 123-45-6789";

// Framework detects & redacts automatically
PIIDetectionResult result = piiDetectionService.detectAndProcess(query);

// Output: "My SSN is ***-**-****"
String safeQuery = result.getProcessedQuery();

// PII never reaches LLM or database`} />

            <CodeBlock code={`public PIIDetectionResult detectAndProcess(String query) {
    if (!properties.isEnabled()) {
        return buildResult(query, query, Collections.emptyList(), false, 
                          PIIMode.PASS_THROUGH, null);
    }
    
    PIIMode mode = properties.getMode();
    List<DetectionMatch> detections = detect(query);
    boolean hasPii = !detections.isEmpty();
    
    String processedQuery = query;
    if (hasPii && mode == PIIMode.REDACT) {
        processedQuery = redact(query, detections);
    }
    
    // Optional: Encrypt original for audit
    if (hasPii && properties.isStoreEncryptedOriginal()) {
        EncryptionPayload payload = securePayload(query);
        // Store encrypted version
    }
    
    return buildResult(query, processedQuery, detections, hasPii, mode, metadata);
}`} />
          </div>
        </section>

        {/* The 3 Detection Modes */}
        <section className="px-6 py-12">
          <div className="max-w-4xl">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-bold text-foreground mb-8 flex items-center gap-3">
                <Settings className="h-6 w-6 text-primary" />
                The 3 Detection Modes
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6">
              <DetectionModeCard
                title="REDACT"
                icon={Shield}
                description="Production mode - detects and redacts PII"
                example={{
                  input: "My SSN is 123-45-6789",
                  output: "My SSN is ***-**-****"
                }}
                color="bg-green-500"
                mode="REDACT"
              />
              <DetectionModeCard
                title="DETECT_ONLY"
                icon={Eye}
                description="Logging mode - detects but doesn't redact"
                example={{
                  input: "My SSN is 123-45-6789",
                  output: "My SSN is 123-45-6789 (logged)"
                }}
                color="bg-blue-500"
                mode="DETECT_ONLY"
              />
              <DetectionModeCard
                title="PASS_THROUGH"
                icon={Ban}
                description="Disabled - no detection or redaction"
                example={{
                  input: "My SSN is 123-45-6789",
                  output: "My SSN is 123-45-6789"
                }}
                color="bg-gray-500"
                mode="PASS_THROUGH"
              />
            </div>
          </div>
        </section>

        {/* Built-in Detection Patterns */}
        <section className="px-6 py-12 border-t border-border/50 bg-muted/30">
          <div className="max-w-4xl">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-bold text-foreground mb-8 flex items-center gap-3">
                <Fingerprint className="h-6 w-6 text-primary" />
                Built-in Detection Patterns
              </h2>
              <p className="text-muted-foreground mb-8">
                Five built-in patterns ready to use. Add unlimited custom patterns.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-4">
              <PatternCard
                name="SSN"
                icon={Fingerprint}
                pattern="\\b\\d{3}-?\\d{2}-?\\d{4}\\b"
                example="123-45-6789"
                replacement="***-**-****"
                color="bg-red-500"
              />
              <PatternCard
                name="Email"
                icon={Mail}
                pattern="[A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}"
                example="john@example.com"
                replacement="***@***.***"
                color="bg-blue-500"
              />
              <PatternCard
                name="Phone"
                icon={Phone}
                pattern="(?:(?:\\+?\\d{1,3}[\\s.-]?)?(?:\\(\\d{3}\\)|\\d{3})[\\s.-]?\\d{3}[\\s.-]?\\d{4})"
                example="(555) 123-4567"
                replacement="***-***-****"
                color="bg-green-500"
              />
              <PatternCard
                name="Credit Card"
                icon={CreditCard}
                pattern="(?<!\\d)(?:\\d[ -]?){13,16}(?!\\d)"
                example="4532-1234-5678-9010"
                replacement="****-****-****-****"
                color="bg-purple-500"
              />
            </div>
          </div>
        </section>

        {/* The Complete Flow */}
        <section className="px-6 py-12">
          <div className="max-w-4xl">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-bold text-foreground mb-8 flex items-center gap-3">
                <ArrowRight className="h-6 w-6 text-primary" />
                The Complete Technical Flow
              </h2>
            </motion.div>

            <div className="space-y-6">
              <FlowStep
                step={1}
                title="User Input"
                description="User types: 'My SSN is 123-45-6789, email is john@example.com'"
                icon={MessageSquare}
                color="bg-blue-500"
              />
              <FlowStep
                step={2}
                title="Orchestrator Entry"
                description="RAGOrchestrator.orchestrate() receives the query"
                icon={Brain}
                color="bg-purple-500"
              />
              <FlowStep
                step={3}
                title="PII Detection Service"
                description="PIIDetectionService.detectAndProcess() checks if enabled and runs detection"
                icon={Eye}
                color="bg-green-500"
                code={`if (!properties.isEnabled()) {
    return buildResult(query, query, [], false, PIIMode.PASS_THROUGH, null);
}

List<DetectionMatch> detections = detect(query);
boolean hasPii = !detections.isEmpty();`}
              />
              <FlowStep
                step={4}
                title="Pattern Matching"
                description="detect() runs regex patterns against the query"
                icon={Search}
                color="bg-orange-500"
                code={`Patterns:
├─ SSN: \\b\\d{3}-?\\d{2}-?\\d{4}\\b
├─ EMAIL: [A-Z0-9._%+-]+@[A-Z0-9.-]+\\.[A-Z]{2,}
├─ PHONE: (?:(?:\\+?\\d{1,3}...))
└─ CREDIT_CARD: (?<!\\d)(?:\\d[ -]?){13,16}(?!\\d)

Matches found:
[
  {type: "SSN", start: 11, end: 22, value: "123-45-6789"},
  {type: "EMAIL", start: 37, end: 53, value: "john@example.com"}
]`}
              />
              <FlowStep
                step={5}
                title="Redaction"
                description="redact() replaces detected PII with masked values"
                icon={Shield}
                color="bg-red-500"
                code={`Original: "My SSN is 123-45-6789, email is john@example.com"

Replace "123-45-6789" with "***-**-****"
Replace "john@example.com" with "***@***.***"

Result: "My SSN is ***-**-****, email is ***@***.***"`}
              />
              <FlowStep
                step={6}
                title="Encryption (Optional)"
                description="securePayload() encrypts original for audit trail"
                icon={Lock}
                color="bg-indigo-500"
                code={`if (storeEncryptedOriginal) {
    // AES-GCM encryption
    byte[] iv = new byte[12];
    secureRandom.nextBytes(iv);
    
    Cipher cipher = Cipher.getInstance("AES/GCM/NoPadding");
    cipher.init(Cipher.ENCRYPT_MODE, deriveAesKey(secret), 
                new GCMParameterSpec(128, iv));
    
    byte[] encrypted = cipher.doFinal(query.getBytes(UTF_8));
    // Store encrypted version + IV
}`}
              />
              <FlowStep
                step={7}
                title="Return Result"
                description="PIIDetectionResult with processed query and detection metadata"
                icon={CheckCircle2}
                color="bg-teal-500"
                code={`{
  originalQuery: "My SSN is 123-45-6789...",
  processedQuery: "My SSN is ***-**-****...",
  piiDetected: true,
  detections: [
    {type: "SSN", startIndex: 11, endIndex: 22, maskedValue: "***-**-****"},
    {type: "EMAIL", startIndex: 37, endIndex: 53, maskedValue: "***@***.***"}
  ],
  modeApplied: "REDACT",
  encryptedOriginalQuery: "ENCRYPTED:a8f3...",
  encryptionSalt: "SALT:xyz..."
}`}
              />
              <FlowStep
                step={8}
                title="Continue with Safe Query"
                description="RAGOrchestrator uses processedQuery (redacted) for LLM"
                icon={ArrowRight}
                color="bg-pink-500"
                code={`processedQuery = result.getProcessedQuery();
// "My SSN is ***-**-****, email is ***@***.***"

// Safe query sent to LLM
MultiIntentResponse intents = intentQueryExtractor
    .extract(processedQuery, context);

// PII never reaches LLM`}
              />
            </div>
          </div>
        </section>

        {/* Real-World Examples */}
        <section className="px-6 py-12 border-t border-border/50 bg-muted/30">
          <div className="max-w-4xl">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-bold text-foreground mb-8 flex items-center gap-3">
                <Users className="h-6 w-6 text-primary" />
                Real-World Examples
              </h2>
            </motion.div>

            <div className="space-y-6">
              <div className="rounded-xl border border-primary/30 bg-primary/5 p-6">
                <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Healthcare Chatbot (HIPAA Compliance)
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Patients share medical info, SSNs, insurance numbers, medical record numbers.
                </p>
                <CodeBlock code={`User input:
"My SSN is 123-45-6789, MRN is MRN-12345678, 
insurance is INS-9876543210, DOB is 01/15/1980"

Processed (sent to LLM):
"My SSN is ***-**-****, MRN is MRN-********, 
insurance is INS-**********, DOB is **/**/****"

Result: HIPAA-compliant. PII never in logs. Safe for LLM.`} />
              </div>

              <div className="rounded-xl border border-secondary/30 bg-secondary/5 p-6">
                <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-secondary" />
                  Financial Services (PCI-DSS Compliance)
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Customers share credit cards, SSNs, account numbers.
                </p>
                <CodeBlock code={`User input:
"My credit card is 4532-1234-5678-9010, 
SSN is 123-45-6789, account is ACC-9876543210"

Processed:
"My credit card is ****-****-****-****, 
SSN is ***-**-****, account is ACC-**********"

Result: PCI-DSS compliant. Credit cards never stored. Safe for LLM.`} />
              </div>
            </div>
          </div>
        </section>

        {/* The Bottom Line */}
        <section className="px-6 py-12">
          <div className="max-w-4xl">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-2xl border border-primary/30 bg-primary/5 p-8"
            >
              <h2 className="text-2xl font-bold text-foreground mb-6">
                The Bottom Line
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="font-semibold text-foreground mb-3">What you get:</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-primary" />
                      Automatic detection (5 built-in patterns, unlimited custom)
                    </li>
                    <li className="flex items-center gap-2">
                      <Settings className="h-4 w-4 text-accent" />
                      Multiple modes (REDACT, DETECT_ONLY, PASS_THROUGH)
                    </li>
                    <li className="flex items-center gap-2">
                      <Lock className="h-4 w-4 text-secondary" />
                      Encryption support (AES-GCM for audit trail)
                    </li>
                    <li className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-primary" />
                      Audit logging (compliance-ready)
                    </li>
                    <li className="flex items-center gap-2">
                      <Code className="h-4 w-4 text-accent" />
                      Configurable patterns (add your own regex)
                    </li>
                    <li className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-primary" />
                      Zero code changes (automatic in orchestrator)
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-3">What you configure:</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-accent" />
                      Enable/disable detection
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-accent" />
                      Choose mode (REDACT/DETECT_ONLY)
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-accent" />
                      Add custom patterns (regex + replacement)
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-accent" />
                      Set encryption secret
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-accent" />
                      Control detection direction
                    </li>
                  </ul>
                </div>
              </div>
              <div className="rounded-lg bg-gradient-primary p-6 text-center">
                <p className="text-primary-foreground font-semibold text-lg">
                  Result: GDPR-compliant by default. HIPAA-ready. PII never reaches LLM. Safe for production. Audit trail encrypted.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Story Navigation */}


        <StoryNavigation className="mt-12" />



        {/* Footer */}
        <section className="px-6 py-8 border-t border-border/50">
          <div className="max-w-4xl flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <Link
                to="/docs/pii_detection_story_v2"
                className="flex items-center gap-2 text-sm text-primary hover:underline"
              >
                <BookOpen className="h-4 w-4" />
                Read V2 (Narrative Version)
              </Link>
              <Link
                to="/docs/pii_detection_full"
                className="flex items-center gap-2 text-sm text-primary hover:underline"
              >
                <FileCode className="h-4 w-4" />
                Read Full Technical Guide
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <StoryLoveButton storySlug="pii_detection_story_v1" />
              <PageViewCounter />
            </div>
          </div>
        </section>
      </div>
    </DocsLayout>
  );
};

export default PIIDetectionStoryV1;

