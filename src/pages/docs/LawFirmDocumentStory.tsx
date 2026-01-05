import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FileText,
  Search,
  Clock,
  CheckCircle2,
  XCircle,
  Briefcase,
  Calendar,
  User,
  Zap,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Highlight, themes } from "prism-react-renderer";
import { useEffect, useState } from "react";
import DocsLayout from "@/components/docs/DocsLayout";
import PageViewCounter from "@/components/PageViewCounter";
import StoryLoveButton from "@/components/StoryLoveButton";
import StoryNavigation from "@/components/StoryNavigation";

const PAGE_TITLE = "Law Firm Document Management - Finding Needles in Legal Haystacks";
const PAGE_DESCRIPTION =
  "Transform legal document discovery from hours of manual searching to 30-second natural language queries. Learn how AI understands client relationships, document types, and date ranges.";
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

const DocumentCard = ({ 
  title, 
  client, 
  date, 
  type, 
  status,
  match 
}: { 
  title: string; 
  client: string; 
  date: string; 
  type: string; 
  status: string;
  match: "perfect" | "partial" | "none" 
}) => (
  <div className={`rounded-lg border p-4 ${
    match === "perfect" ? "border-accent bg-accent/10" :
    match === "partial" ? "border-secondary/30 bg-card" :
    "border-border/30 bg-muted/20 opacity-60"
  }`}>
    <div className="flex items-start justify-between mb-2">
      <h5 className="font-semibold text-foreground text-sm">{title}</h5>
      {match === "perfect" && (
        <span className="rounded-full bg-accent px-2 py-0.5 text-xs text-accent-foreground shrink-0">
          Match
        </span>
      )}
    </div>
    <div className="space-y-1 text-xs text-muted-foreground">
      <p className="flex items-center gap-2">
        <User className="h-3 w-3" />
        <span className="font-medium">Client:</span> {client}
      </p>
      <p className="flex items-center gap-2">
        <Calendar className="h-3 w-3" />
        <span className="font-medium">Date:</span> {date}
      </p>
      <p className="flex items-center gap-2">
        <FileText className="h-3 w-3" />
        <span className="font-medium">Type:</span> {type}
      </p>
      <p className="flex items-center gap-2">
        <Target className="h-3 w-3" />
        <span className="font-medium">Status:</span> {status}
      </p>
    </div>
  </div>
);

const LawFirmDocumentStory = () => {
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
                <Briefcase className="h-4 w-4" />
                Real API Story
              </span>
              <div className="flex items-center gap-3">
                <StoryLoveButton storySlug="law-firm-document" />
                <PageViewCounter />
              </div>
            </div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl"
            >
              <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
                Finding Needles in <span className="text-gradient">Legal Haystacks</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mb-8">
                The story of how natural language document search transformed legal research from 
                2-3 hours of manual searching to 30-second queries.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2 text-sm text-accent">
                  <Search className="h-4 w-4" />
                  Semantic Search
                </div>
                <div className="flex items-center gap-2 rounded-full bg-secondary/10 px-4 py-2 text-sm text-secondary">
                  <FileText className="h-4 w-4" />
                  50,000+ Documents
                </div>
                <div className="flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm text-primary">
                  <Clock className="h-4 w-4" />
                  30 Seconds
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
                <Clock className="h-6 w-6 text-destructive" />
                The 2-Hour Document Hunt
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                You're managing documents at a mid-sized law firm. Your archive contains <strong className="text-foreground">50,000+ 
                contracts, briefs, and case files</strong> spanning 15 years. A partner urgently asks:
              </p>
              <blockquote className="border-l-4 border-primary pl-4 text-lg italic text-foreground my-6">
                "Find all contracts related to John Smith in Q4 2023"
              </blockquote>
              <p className="text-muted-foreground leading-relaxed">
                With traditional document management systems, you'd spend <strong className="text-foreground">2-3 hours</strong>: 
                Open SQL tool, write complex date range queries, filter by client name, search metadata manually, export 
                results, send to partner. By then, the deadline has passed.
              </p>
            </div>
          </motion.div>
        </section>

        {/* The Story */}
        <section className="px-6 py-8">
          <div className="max-w-4xl">
            {/* Act I */}
            <StoryAct number="Act I" title="The Document Archive" emoji="📚">
              <p>
                Your firm's document system contains thousands of files organized by client, date, type, and status:
              </p>

              <div className="grid gap-4 md:grid-cols-2 mt-6">
                <div className="space-y-3">
                  <h5 className="text-sm font-semibold text-foreground">John Smith Documents</h5>
                  <DocumentCard 
                    title="Employment Contract"
                    client="John Smith"
                    date="Nov 15, 2023"
                    type="Contract"
                    status="ACTIVE"
                    match="perfect"
                  />
                  <DocumentCard 
                    title="Service Agreement"
                    client="John Smith"
                    date="Sep 20, 2023"
                    type="Contract"
                    status="ACTIVE"
                    match="partial"
                  />
                  <DocumentCard 
                    title="NDA (Archived)"
                    client="John Smith"
                    date="Oct 5, 2023"
                    type="Contract"
                    status="ARCHIVED"
                    match="partial"
                  />
                </div>

                <div className="space-y-3">
                  <h5 className="text-sm font-semibold text-foreground">Other Clients</h5>
                  <DocumentCard 
                    title="Partnership Agreement"
                    client="Jane Doe"
                    date="Nov 8, 2023"
                    type="Contract"
                    status="ACTIVE"
                    match="none"
                  />
                </div>
              </div>

              <div className="mt-6 rounded-lg border border-accent/30 bg-accent/5 p-4">
                <p className="text-foreground text-sm">
                  <strong>Perfect Match:</strong> Employment Contract for John Smith created on Nov 15, 2023 — falls 
                  within Q4 (Oct 1 - Dec 31), active status, correct client relationship.
                </p>
              </div>
            </StoryAct>

            {/* Act II */}
            <StoryAct number="Act II" title="The Natural Language Query" emoji="🔍">
              <p>
                Instead of spending 2 hours in SQL queries, the paralegal simply asks:
              </p>

              <div className="rounded-xl border border-primary/30 bg-primary/5 p-6 mt-4">
                <p className="text-lg font-medium text-foreground text-center">
                  "Find all contracts related to John Smith in Q4 2023"
                </p>
              </div>

              <h4 className="text-lg font-semibold text-foreground mt-8 mb-4">
                AI Processing: Understanding Legal Context
              </h4>

              <div className="space-y-4">
                <div className="rounded-lg border border-border/50 bg-card p-4">
                  <h5 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/20 text-xs text-primary">1</span>
                    Context Parsing
                  </h5>
                  <ul className="text-sm space-y-1 ml-8 text-muted-foreground">
                    <li>• "contracts" → document type filter</li>
                    <li>• "related to John Smith" → author/client relationship</li>
                    <li>• "Q4 2023" → date range (Oct 1 - Dec 31, 2023)</li>
                  </ul>
                </div>

                <div className="rounded-lg border border-border/50 bg-card p-4">
                  <h5 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-secondary/20 text-xs text-secondary">2</span>
                    Smart Query Generation
                  </h5>
                  <CodeBlock code={`SELECT d FROM LegalDocumentEntity d
JOIN d.author a
WHERE d.documentType = 'Contract'
  AND a.name = 'John Smith'
  AND d.createdAt BETWEEN '2023-10-01' AND '2023-12-31'
  AND d.status = 'ACTIVE'
ORDER BY d.createdAt DESC`} language="sql" />
                </div>

                <div className="rounded-lg border border-border/50 bg-card p-4">
                  <h5 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent/20 text-xs text-accent">3</span>
                    Results in 30 Seconds
                  </h5>
                  <div className="ml-8 text-sm text-muted-foreground">
                    <p>Query executed • Documents retrieved • Ranked by relevance • Ready for partner review</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-xl bg-gradient-primary p-6">
                <h5 className="text-lg font-semibold text-primary-foreground mb-3">
                  Found: 1 Perfect Match
                </h5>
                <div className="rounded-lg bg-white/10 backdrop-blur p-4">
                  <DocumentCard 
                    title="Employment Contract - John Smith"
                    client="John Smith"
                    date="Nov 15, 2023"
                    type="Contract"
                    status="ACTIVE"
                    match="perfect"
                  />
                  <p className="text-sm text-primary-foreground/80 mt-3">
                    <strong>Query Time:</strong> 28ms • <strong>Documents Scanned:</strong> 50,000+ • 
                    <strong>Time Saved:</strong> 2+ hours
                  </p>
                </div>
              </div>
            </StoryAct>

            {/* Act III */}
            <StoryAct number="Act III" title="The Technology" emoji="⚙️">
              <p>
                The AI Fabric Framework makes legal document discovery instant through <strong className="text-foreground">Relationship 
                Query Intelligence</strong> + <strong className="text-foreground">Semantic Search</strong>.
              </p>

              <h4 className="text-lg font-semibold text-foreground mt-8 mb-4">
                Implementation: Production-Ready
              </h4>

              <CodeBlock code={`// 1. Define legal document search action
@AIAction(
    name = "document_search",
    description = "Search legal documents using natural language"
)

// 2. Execute semantic search
RAGResponse response = queryService.execute(
    "Find all contracts related to John Smith in Q4 2023",
    List.of("LegalDocumentEntity", "AuthorEntity"),
    RAGQueryOptions.builder()
        .maxResults(50)
        .similarityThreshold(0.80)
        .build()
);

// 3. Get filtered results
List<LegalDocument> documents = response.getResults();`} />

              <div className="grid gap-3 sm:grid-cols-2 mt-6">
                {[
                  "Natural language parsing",
                  "Client relationship mapping",
                  "Date range understanding (Q1-Q4)",
                  "Document type filtering",
                  "Status-based filtering",
                  "Semantic similarity ranking",
                  "Multi-entity joins",
                  "Instant results (<100ms)",
                ].map((feature, i) => (
                  <div key={i} className="flex items-start gap-3 rounded-lg border border-border/50 bg-card p-3">
                    <CheckCircle2 className="h-5 w-5 shrink-0 text-accent mt-0.5" />
                    <span className="text-sm text-foreground">{feature}</span>
                  </div>
                ))}
              </div>
            </StoryAct>

            {/* Act IV */}
            <StoryAct number="Act IV" title="The Business Impact" emoji="📊">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-6">
                  <h5 className="text-lg font-bold text-destructive mb-4">
                    ❌ Manual Document Search
                  </h5>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-start gap-2">
                      <Clock className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-foreground">2-3 hours per search</strong>
                        <p className="text-muted-foreground">Manual SQL + metadata review</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <XCircle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-foreground">Missed deadlines</strong>
                        <p className="text-muted-foreground">Partners wait days for documents</p>
                      </div>
                    </li>
                  </ul>
                </div>

                <div className="rounded-xl border border-accent/30 bg-accent/5 p-6">
                  <h5 className="text-lg font-bold text-accent mb-4">
                    ✅ AI-Powered Search
                  </h5>
                  <ul className="space-y-3 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-foreground">30 seconds per search</strong>
                        <p className="text-muted-foreground">Natural language queries</p>
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                      <div>
                        <strong className="text-foreground">Instant results</strong>
                        <p className="text-muted-foreground">Partners get docs immediately</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-8 rounded-xl bg-gradient-primary p-6 text-center">
                <p className="text-2xl font-bold text-primary-foreground mb-2">
                  98% Faster Document Retrieval
                </p>
                <p className="text-primary-foreground/80">
                  From 2-3 hours to 30 seconds • 50,000+ documents searchable
                </p>
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
                Deploy This in Your Law Firm
              </h2>
              <p className="text-muted-foreground mb-8">
                The AI Fabric Framework provides instant document discovery. MIT License, production-ready.
              </p>

              <div className="flex flex-wrap items-center gap-4">
                <Button variant="hero" size="lg" asChild>
                  <a href="https://github.com/mahmoudashraf/AI-Fabric-Framework" target="_blank" rel="noopener noreferrer">
                    ⭐ Star on GitHub
                  </a>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link to="/docs/relationship_query_story_v2">
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
                to="/docs/ecommerce-product-discovery-story"
                className="group rounded-xl border border-border/50 bg-card p-5 hover:border-primary/50 hover:shadow-lg transition-all"
              >
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
                  E-Commerce Product Discovery →
                </h3>
                <p className="text-sm text-muted-foreground">
                  Natural language product search
                </p>
              </Link>
              <Link 
                to="/docs/financial-fraud-detection-story"
                className="group rounded-xl border border-border/50 bg-card p-5 hover:border-primary/50 hover:shadow-lg transition-all"
              >
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-2">
                  Financial Fraud Detection →
                </h3>
                <p className="text-sm text-muted-foreground">
                  Track suspicious money flows with AI
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
            <StoryLoveButton storySlug="law-firm-document" />
            <p className="text-sm text-muted-foreground text-center">
              Real API Integration Story • Part of AI Fabric Framework • MIT License • Production-Ready
            </p>
          </div>
        </footer>
      </div>
    </DocsLayout>
  );
};

export default LawFirmDocumentStory;
