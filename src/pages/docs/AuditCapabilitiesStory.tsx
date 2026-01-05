import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Highlight, themes } from "prism-react-renderer";
import DocsLayout from "@/components/docs/DocsLayout";
import PageViewCounter from "@/components/PageViewCounter";
import StoryLoveButton from "@/components/StoryLoveButton";
import StoryNavigation from "@/components/StoryNavigation";
import { 
  Brain,
  Zap,
  MessageSquare,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Settings,
  Code,
  Package,
  FileCode,
  BookOpen,
  Clock,
  DollarSign,
  Activity,
  Sparkles,
  Heart,
  Target,
  AlertTriangle,
  Database,
  Server,
  Cpu,
  Layers,
  RefreshCw,
  TrendingUp,
  Lock,
  Shield,
  Eye,
  Search,
  FileText,
  BarChart3,
  FileCheck,
  Users,
  Calendar
} from "lucide-react";

const PAGE_TITLE = "Audit Capabilities: Complete Audit Trail for AI Systems - AI Fabric Framework";
const PAGE_DESCRIPTION = "How we built comprehensive audit logging that tracks every AI interaction, detects anomalies, generates compliance reports, and protects user privacy—all automatically with zero code required.";

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

const ComplianceFines = () => {
  const [selectedRegulation, setSelectedRegulation] = useState(0);
  
  const regulations = [
    {
      name: "GDPR",
      icon: Shield,
      color: "text-blue-400",
      borderColor: "border-blue-500/30",
      bgColor: "bg-blue-500/5",
      fine: "€20M or 4% of revenue",
      description: "EU General Data Protection Regulation"
    },
    {
      name: "HIPAA",
      icon: FileCheck,
      color: "text-red-400",
      borderColor: "border-red-500/30",
      bgColor: "bg-red-500/5",
      fine: "$50K-$1.5M per incident",
      description: "Health Insurance Portability and Accountability Act"
    },
    {
      name: "SOC2",
      icon: Shield,
      color: "text-green-400",
      borderColor: "border-green-500/30",
      bgColor: "bg-green-500/5",
      fine: "Lost enterprise customers",
      description: "System and Organization Controls 2"
    }
  ];

  const current = regulations[selectedRegulation];

  return (
    <div className="my-16">
      <h3 className="text-2xl font-bold text-foreground mb-8 text-center">
        The Compliance Nightmare: Failed Audits = Fines
      </h3>
      
      <div className="flex gap-2 mb-6 justify-center">
        {regulations.map((reg, i) => {
          const Icon = reg.icon;
          return (
            <button
              key={i}
              onClick={() => setSelectedRegulation(i)}
              className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2 ${
                selectedRegulation === i
                  ? `${reg.bgColor} ${reg.borderColor} border-2 shadow-lg`
                  : "bg-muted/30 border border-border/50 text-muted-foreground hover:border-border"
              }`}
            >
              <Icon className={`h-4 w-4 ${selectedRegulation === i ? reg.color : 'text-muted-foreground'}`} />
              {reg.name}
            </button>
          );
        })}
      </div>
      
      <div className={`p-6 rounded-xl border-2 ${current.borderColor} ${current.bgColor}`}>
        <div className="flex items-center gap-3 mb-4">
          {React.createElement(current.icon, {
            className: `h-6 w-6 ${current.color}`
          })}
          <div>
            <h4 className="font-bold text-foreground">{current.name}</h4>
            <p className="text-xs text-muted-foreground">{current.description}</p>
          </div>
        </div>
        <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/30">
          <p className="text-xs font-semibold text-destructive mb-1">Penalty for Non-Compliance:</p>
          <p className="text-2xl font-bold text-destructive">{current.fine}</p>
        </div>
        <div className="mt-4 p-3 rounded-lg bg-muted/30 border border-border/30">
          <p className="text-xs font-semibold text-foreground mb-2">Without Audit Logging:</p>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• No record of user interactions</li>
            <li>• No compliance evidence</li>
            <li>• No security incident tracking</li>
            <li>• No anomaly detection</li>
            <li>• Failed audits → Fines → Lost trust</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

const ProblemList = () => {
  const problems = [
    { icon: XCircle, text: "No record of user interactions", color: "text-red-400" },
    { icon: XCircle, text: "No compliance evidence", color: "text-red-400" },
    { icon: XCircle, text: "No security incident tracking", color: "text-red-400" },
    { icon: XCircle, text: "No anomaly detection", color: "text-red-400" },
    { icon: XCircle, text: "No data retention compliance", color: "text-red-400" },
    { icon: XCircle, text: "Failed audits → Fines → Lost trust", color: "text-red-400" },
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

const SolutionCard = ({ title, icon: Icon, description, code, color }: { 
  title: string; 
  icon: any; 
  description: string; 
  code: string;
  color: string;
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
    <CodeBlock code={code} />
  </motion.div>
);

const FeatureCard = ({ title, icon: Icon, description, color }: {
  title: string;
  icon: any;
  description: string;
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
      <h4 className="font-bold text-foreground">{title}</h4>
    </div>
    <p className="text-sm text-muted-foreground">{description}</p>
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

const AuditCapabilitiesStory = () => {
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
        {/* Top Navigation */}
        <StoryNavigation variant="compact" className="px-6 pt-6" />

        {/* Hero */}
        <section className="relative overflow-hidden border-b border-border/50">
          <div className="absolute inset-0 bg-gradient-glow opacity-50" />
          <div className="px-6 py-16 relative">
            <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                  <span className="text-2xl">🔍</span>
                  Audit Capabilities V1
                </span>
                <Link 
                  to="/docs/audit_capabilities_story_v2"
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  View V2 (Narrative) →
                </Link>
              </div>
              <div className="flex items-center gap-3">
                <StoryLoveButton storySlug="audit_capabilities_story" />
                <PageViewCounter />
              </div>
            </div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl"
            >
              <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
                Audit Capabilities:{" "}
                <span className="text-gradient">Complete Audit Trail</span>{" "}
                for AI Systems
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mb-8">
                How we built comprehensive audit logging that tracks every AI interaction, detects anomalies, 
                generates compliance reports, and protects user privacy—all automatically with zero code required.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2 text-sm text-accent">
                  <Shield className="h-4 w-4" />
                  GDPR/HIPAA/SOC2
                </div>
                <div className="flex items-center gap-2 rounded-full bg-secondary/10 px-4 py-2 text-sm text-secondary">
                  <Lock className="h-4 w-4" />
                  Privacy Protected
                </div>
                <div className="flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm text-primary">
                  <Zap className="h-4 w-4" />
                  Zero Code
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Compliance Fines */}
        <section className="px-6 py-12">
          <div className="max-w-4xl mx-auto">
            <ComplianceFines />
          </div>
        </section>

        {/* The Problem */}
        <section className="px-6 py-12 border-t border-border/50 bg-muted/30">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl"
          >
            <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-8 mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-3">
                <AlertTriangle className="h-6 w-6 text-destructive" />
                The Compliance Nightmare: "Who Did What?" in AI Systems
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                You're building an AI application. Regulators ask:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-6">
                <li>"Who accessed what data?"</li>
                <li>"What queries were made?"</li>
                <li>"Were there any security violations?"</li>
                <li>"Can you prove compliance?"</li>
              </ul>
              <p className="text-foreground font-medium mt-6">
                <strong>What if you could track every interaction automatically, protect privacy, and generate compliance reports?</strong>
              </p>
            </div>

            <h3 className="text-xl font-bold text-foreground mb-4">Without Audit Logging:</h3>
            <ProblemList />
          </motion.div>
        </section>

        {/* The Solution */}
        <section className="px-6 py-12">
          <div className="max-w-4xl">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-3">
                <Shield className="h-6 w-6 text-primary" />
                Our Solution: Comprehensive Audit Trail
              </h2>
              <p className="text-muted-foreground mb-8">
                Track every AI interaction. Detect anomalies. Generate compliance reports. Protect privacy.
              </p>
            </motion.div>

            <SolutionCard
              title="Automatic Audit Logging"
              icon={Eye}
              description="Zero code required. Every orchestration automatically creates audit log."
              color="bg-primary"
              code={`// Automatic audit logging - zero code required
@Autowired
private RAGOrchestrator orchestrator;

// Every orchestration automatically creates audit log
OrchestrationResult result = orchestrator.orchestrate(
    "Show me my billing history",
    OrchestrationContext.builder()
        .userId("user-123")
        .sessionId("session-456")
        .ipAddress("192.168.1.1")
        .build()
);

// Audit log automatically created:
// - User ID, session ID, IP address
// - Original query (encrypted)
// - Redacted query (PII removed)
// - Intent extracted
// - Result returned
// - PII detected (types)
// - Success/failure status
// - Timestamp`}
            />
          </div>
        </section>

        {/* Features */}
        <section className="px-6 py-12 border-t border-border/50 bg-muted/30">
          <div className="max-w-4xl">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-bold text-foreground mb-8 flex items-center gap-3">
                <Sparkles className="h-6 w-6 text-primary" />
                What Gets Audited
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-4">
              <FeatureCard
                title="Every User Query"
                icon={MessageSquare}
                description="Redacted (PII removed) and encrypted (for compliance). Original query preserved securely."
                color="bg-blue-500"
              />
              <FeatureCard
                title="Intent Extraction"
                icon={Brain}
                description="All extracted intents logged with confidence scores and action routing decisions."
                color="bg-purple-500"
              />
              <FeatureCard
                title="Action Execution"
                icon={Zap}
                description="Action handler results, execution status, and response data logged."
                color="bg-green-500"
              />
              <FeatureCard
                title="RAG Responses"
                icon={Search}
                description="Semantic search queries, retrieved documents, and generated responses tracked."
                color="bg-orange-500"
              />
              <FeatureCard
                title="PII Detection"
                icon={Lock}
                description="PII types detected, locations, and redaction applied. No sensitive content stored."
                color="bg-red-500"
              />
              <FeatureCard
                title="Access Control"
                icon={Shield}
                description="Access control decisions, policy evaluations, and authorization results logged."
                color="bg-yellow-500"
              />
              <FeatureCard
                title="Compliance Violations"
                icon={AlertTriangle}
                description="GDPR, HIPAA, SOC2 violations detected and logged with full context."
                color="bg-pink-500"
              />
              <FeatureCard
                title="Security Anomalies"
                icon={Activity}
                description="Threat detection, anomaly patterns, and security incidents automatically tracked."
                color="bg-cyan-500"
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
                title="Orchestration"
                description="RAGOrchestrator processes request with security, access control, PII detection, and compliance checks"
                icon={Server}
                color="bg-blue-500"
                code={`1. Security Check
   - Content filtering
   - Threat detection
   - Anomaly detection

2. Access Control Check
   - Entity access policy
   - User permissions
   - Resource authorization

3. PII Detection (Input)
   - Pattern matching
   - PII types detected
   - Query redaction

4. Compliance Check
   - GDPR compliance
   - HIPAA compliance
   - SOC2 compliance

5. Intent Extraction
   - LLM-based intent extraction
   - Multi-intent support
   - Action routing

6. Action Execution or RAG
   - Action handler execution
   - RAG service (semantic search)
   - Response generation

7. PII Detection (Output)
   - Response sanitization
   - PII redaction

8. Response Sanitization
   - Content filtering
   - Security sanitization`}
              />
              <FlowStep
                step={2}
                title="Audit Log Creation"
                description="IntentHistoryService automatically creates audit log with sanitization and encryption"
                icon={FileText}
                color="bg-purple-500"
                code={`IntentHistory {
  userId: "user-123",
  sessionId: "session-456",
  redactedQuery: "Show me my [REDACTED]",
  encryptedQuery: "encrypted_base64_string",
  intentsJson: '{"intents":[...]}',
  resultJson: '{"response":"..."}',
  metadataJson: '{"sessionId":"...","ipAddress":"..."}',
  executionStatus: "SUCCESS",
  success: true,
  hasSensitiveData: true,
  sensitiveDataTypes: "EMAIL,PHONE",
  intentCount: 1,
  expiresAt: "2025-04-15T10:30:00"  // 90 days retention
}`}
              />
              <FlowStep
                step={3}
                title="Database Persistence"
                description="IntentHistory entity saved to database with indexes for fast queries"
                icon={Database}
                color="bg-green-500"
                code={`Table: intent_history
- Indexed by user_id (fast user queries)
- Indexed by created_at (date range queries)
- Indexed by expires_at (cleanup queries)
- TEXT columns for JSON (flexible storage)
- Automatic timestamps (created_at, updated_at)
- Automatic expiry (retention policy)`}
              />
              <FlowStep
                step={4}
                title="Compliance Report"
                description="AIComplianceService generates compliance report with violations and recommendations"
                icon={FileCheck}
                color="bg-orange-500"
                code={`AIComplianceResponse {
  overallCompliant: true,
  violations: [],
  report: {
    reportId: "COMP_2025-01-15T10:30:00",
    requestId: "req-123",
    userId: "user-123",
    timestamp: "2025-01-15T10:30:00",
    dataClassification: "CONFIDENTIAL",
    purpose: "USER_QUERY",
    regulationTypes: ["GDPR", "HIPAA"],
    notes: "Compliant"
  }
}`}
              />
            </div>
          </div>
        </section>

        {/* Privacy Protection */}
        <section className="px-6 py-12 border-t border-border/50 bg-muted/30">
          <div className="max-w-4xl">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-bold text-foreground mb-8 flex items-center gap-3">
                <Lock className="h-6 w-6 text-primary" />
                Privacy Protection: PII Redaction & Encryption
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 rounded-xl border border-red-500/30 bg-red-500/5">
                <h4 className="font-bold text-foreground mb-4 flex items-center gap-2">
                  <XCircle className="h-5 w-5 text-red-400" />
                  Original Query
                </h4>
                <CodeBlock code={`"Show me billing for john.doe@example.com"`} language="text" />
                <p className="text-xs text-muted-foreground mt-2">Contains PII: EMAIL</p>
              </div>
              
              <div className="p-6 rounded-xl border border-green-500/30 bg-green-500/5">
                <h4 className="font-bold text-foreground mb-4 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-400" />
                  Redacted Query (Audit Log)
                </h4>
                <CodeBlock code={`"Show me billing for [REDACTED]"`} language="text" />
                <p className="text-xs text-muted-foreground mt-2">PII removed, types tracked</p>
              </div>
            </div>

            <div className="mt-6 p-6 rounded-xl border border-primary/30 bg-primary/5">
              <h4 className="font-bold text-foreground mb-4 flex items-center gap-2">
                <Lock className="h-5 w-5 text-primary" />
                Encrypted Query (Optional, Access-Controlled)
              </h4>
              <CodeBlock code={`// Original query encrypted with AES-256-GCM
// Access-controlled (requires proper permissions)
// GDPR-compliant (right to access)

encryptedQuery: "encrypted_base64_string"

// Decryption requires:
// - Proper access permissions
// - Audit trail of access
// - Compliance justification`} />
            </div>

            <div className="mt-6 grid md:grid-cols-4 gap-4">
              <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30 text-center">
                <CheckCircle2 className="h-6 w-6 text-green-400 mx-auto mb-2" />
                <p className="text-sm font-semibold text-foreground">PII Redacted</p>
                <p className="text-xs text-muted-foreground">Automatic</p>
              </div>
              <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30 text-center">
                <CheckCircle2 className="h-6 w-6 text-green-400 mx-auto mb-2" />
                <p className="text-sm font-semibold text-foreground">Query Encrypted</p>
                <p className="text-xs text-muted-foreground">Optional</p>
              </div>
              <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30 text-center">
                <CheckCircle2 className="h-6 w-6 text-green-400 mx-auto mb-2" />
                <p className="text-sm font-semibold text-foreground">Types Tracked</p>
                <p className="text-xs text-muted-foreground">Not content</p>
              </div>
              <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30 text-center">
                <CheckCircle2 className="h-6 w-6 text-green-400 mx-auto mb-2" />
                <p className="text-sm font-semibold text-foreground">Access Controlled</p>
                <p className="text-xs text-muted-foreground">Secure</p>
              </div>
            </div>
          </div>
        </section>

        {/* Real-World Examples */}
        <section className="px-6 py-12">
          <div className="max-w-4xl">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-bold text-foreground mb-8 flex items-center gap-3">
                <Target className="h-6 w-6 text-primary" />
                Real-World Examples
              </h2>
            </motion.div>

            <div className="space-y-6">
              <div className="rounded-xl border border-primary/30 bg-primary/5 p-6">
                <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
                  <FileCheck className="h-5 w-5 text-primary" />
                  Healthcare Compliance (HIPAA)
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  HIPAA-compliant patient query system.
                </p>
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30">
                    <p className="text-xs font-semibold text-red-400 mb-1">Without Audit:</p>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>• No audit trail</li>
                      <li>• Can't prove who accessed what</li>
                      <li>• Failed HIPAA audit</li>
                      <li>• $50,000+ fine</li>
                    </ul>
                  </div>
                  <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/30">
                    <p className="text-xs font-semibold text-green-400 mb-1">With Audit:</p>
                    <ul className="text-xs text-muted-foreground space-y-1">
                      <li>• HIPAA-compliant audit trail</li>
                      <li>• Automatic PII redaction</li>
                      <li>• Access tracking</li>
                      <li>• Passed audit ($0 fine)</li>
                    </ul>
                  </div>
                </div>
                <CodeBlock code={`@RestController
public class PatientQueryController {
    
    @Autowired
    private RAGOrchestrator orchestrator;
    
    @PostMapping("/query")
    public ResponseEntity<?> query(@RequestBody QueryRequest request,
                                   HttpServletRequest httpRequest) {
        // Orchestration automatically creates audit log
        OrchestrationResult result = orchestrator.orchestrate(
            request.getQuery(),
            OrchestrationContext.builder()
                .userId(getCurrentUser().getId())
                .sessionId(httpRequest.getSession().getId())
                .ipAddress(httpRequest.getRemoteAddr())
                .build()
        );
        
        return ResponseEntity.ok(result);
    }
}

// Audit log automatically created:
// - userId: "doctor-123"
// - redactedQuery: "Show patient [REDACTED] records"
// - hasSensitiveData: true
// - sensitiveDataTypes: "PHI,SSN"
// - executionStatus: "SUCCESS"`} />
              </div>

              <div className="rounded-xl border border-secondary/30 bg-secondary/5 p-6">
                <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-secondary" />
                  Financial Services (SOC2)
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  SOC2-compliant financial query system.
                </p>
                <CodeBlock code={`// Every query automatically audited
// Access control decisions logged
// Security violations tracked
// Compliance reports generated

// Audit log includes:
// - User ID, session ID, IP address
// - Query (redacted + encrypted)
// - Intent extracted
// - Result returned
// - Access control decision
// - Security violations
// - Compliance status

// Result: Passed SOC2 audit`} />
              </div>

              <div className="rounded-xl border border-accent/30 bg-accent/5 p-6">
                <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-accent" />
                  GDPR Compliance
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  GDPR-compliant user query system.
                </p>
                <CodeBlock code={`// Right to access: Query audit logs
List<IntentHistory> userHistory = intentHistoryService.getUserIntentHistory(
    "user-123",
    100  // Last 100 queries
);

// Right to deletion: Automatic cleanup
@Scheduled(cron = "0 0 * * * *")
public void cleanupExpiredHistory() {
    // Automatically deletes expired records
    // GDPR-compliant retention
}

// Data portability: Export audit logs
public String exportUserData(String userId) {
    List<IntentHistory> history = 
        intentHistoryService.getUserIntentHistory(userId, Integer.MAX_VALUE);
    return objectMapper.writeValueAsString(history);
}

// Result: Passed GDPR audit`} />
              </div>
            </div>
          </div>
        </section>

        {/* The Bottom Line */}
        <section className="px-6 py-12 border-t border-border/50 bg-muted/30">
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
                      <Eye className="h-4 w-4 text-primary" />
                      Complete audit trail (every interaction logged)
                    </li>
                    <li className="flex items-center gap-2">
                      <Lock className="h-4 w-4 text-accent" />
                      Privacy protection (PII redacted, encrypted)
                    </li>
                    <li className="flex items-center gap-2">
                      <FileCheck className="h-4 w-4 text-secondary" />
                      Compliance reports (GDPR, HIPAA, SOC2)
                    </li>
                    <li className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-primary" />
                      Anomaly detection (security violations)
                    </li>
                    <li className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-accent" />
                      Retention policies (automatic cleanup)
                    </li>
                    <li className="flex items-center gap-2">
                      <Search className="h-4 w-4 text-secondary" />
                      Queryable logs (user history, date ranges)
                    </li>
                    <li className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-primary" />
                      Zero code (automatic logging)
                    </li>
                    <li className="flex items-center gap-2">
                      <Database className="h-4 w-4 text-accent" />
                      Database persistence (indexed, queryable)
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-3">What you configure:</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-accent" />
                      Optional: Retention days
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-accent" />
                      Optional: Cleanup schedule
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-accent" />
                      Optional: Encryption enabled/disabled
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-accent" />
                      Optional: PII audit logging
                    </li>
                  </ul>
                </div>
              </div>
              <div className="rounded-lg bg-gradient-primary p-6 text-center">
                <p className="text-primary-foreground font-semibold text-lg">
                  Result: Complete audit trail. Privacy-protected. Compliance-ready. Zero code. Production-tested.
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
                to="/docs/audit_capabilities_story_v2"
                className="flex items-center gap-2 text-sm text-primary hover:underline"
              >
                <BookOpen className="h-4 w-4" />
                Read V2 (Narrative Version)
              </Link>
              <Link
                to="/docs/guides/audit_capabilities"
                className="flex items-center gap-2 text-sm text-primary hover:underline"
              >
                <FileCode className="h-4 w-4" />
                Read Full Technical Guide
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <StoryLoveButton storySlug="audit_capabilities_story" />
              <PageViewCounter />
            </div>
          </div>
        </section>
      </div>
    </DocsLayout>
  );
};

export default AuditCapabilitiesStory;

