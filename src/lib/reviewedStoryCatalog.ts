import {
  Bot,
  Brain,
  Cpu,
  Database,
  KeyRound,
  Lock,
  LucideIcon,
  MessageSquare,
  Search,
  Shield,
  ShoppingCart,
  TestTube,
  Users,
  Zap,
} from "lucide-react";

export type StoryCollection = "user-stories" | "real-api-stories";

export interface ReviewedStory {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  color: string;
  category: string;
  collection: StoryCollection;
  readTime: string;
  stats: string;
  heroKicker: string;
  heroTitle: string;
  heroLead: string;
  whyItMatters: string;
  currentStatus: string[];
  requestFlow: string[];
  evidenceLinks: {
    label: string;
    href: string;
    detail: string;
  }[];
  nextStepHref: string;
  nextStepLabel: string;
}

export const userStories: ReviewedStory[] = [
  {
    id: "rag-evidence-search",
    title: "RAG Evidence Search",
    description: "Ground answers in indexed application evidence instead of letting the LLM guess.",
    href: "/docs/rag_story_v3",
    icon: Search,
    color: "bg-purple-500",
    category: "RAG",
    collection: "user-stories",
    readTime: "6 min read",
    stats: "Evidence-first answers",
    heroKicker: "Reviewed Framework Story",
    heroTitle: "When a Java app needs answers that cite real application data",
    heroLead:
      "AI Fabric RAG combines application-owned data, vector retrieval, access policy, and LLM generation so answers are backed by retrieved evidence.",
    whyItMatters:
      "This is the core story behind AI-enabling an existing Java app: keep your data model and business rules, then expose the right evidence to the model at request time.",
    currentStatus: [
      "Current docs describe RAG as a module layered above core generation, embeddings, vector storage, and access policy.",
      "The live shopping and account resolver demos show staged retrieval, policy documents, and action-aware answers.",
      "RAG quality depends on indexed evidence; the public demos now expose seed/reset flows instead of pretending data exists.",
    ],
    requestFlow: [
      "Application indexes selected entities or policy documents into a configured vector store.",
      "User asks a natural-language question through the app endpoint.",
      "AI Fabric retrieves relevant documents, applies access policy, and passes evidence into generation.",
      "The app renders the answer with retrieved documents so users can inspect what grounded the response.",
    ],
    evidenceLinks: [
      {
        label: "First RAG Chat",
        href: "/docs/first-rag-chat",
        detail: "Current setup path for adding the RAG module to a Spring Boot app.",
      },
      {
        label: "AI Shopping Experience",
        href: "/demos/ai-shopping-experience",
        detail: "Live staged RAG demo with products, reviews, policies, coupons, and support evidence.",
      },
      {
        label: "Module Map",
        href: "/docs/modules",
        detail: "Shows how RAG depends on core, provider, embeddings, and vector storage modules.",
      },
    ],
    nextStepHref: "/docs/first-rag-chat",
    nextStepLabel: "Build First RAG Chat",
  },
  {
    id: "access-policy",
    title: "Access Policy",
    description: "Keep retrieval and actions inside application-owned authorization boundaries.",
    href: "/docs/access_policy_story",
    icon: Shield,
    color: "bg-red-500",
    category: "Security",
    collection: "user-stories",
    readTime: "5 min read",
    stats: "Fail-closed guardrails",
    heroKicker: "Reviewed Framework Story",
    heroTitle: "When AI retrieval must respect the same rules as the Java app",
    heroLead:
      "AI Fabric expects the application to own access decisions while the framework calls those policies around AI retrieval and orchestration.",
    whyItMatters:
      "The model should not become a shortcut around permissions. This story explains the boundary: the app decides who can see or do what; AI Fabric enforces the call path.",
    currentStatus: [
      "Current docs position access policy as a production guardrail, not as a replacement for app security.",
      "Tenant Guard demonstrates tenant metadata filtering plus app-side policy checks for document retrieval.",
      "The framework policy path is designed to fail closed when an authorization decision cannot be made.",
    ],
    requestFlow: [
      "App receives a request with user, tenant, or session context.",
      "AI Fabric builds retrieval or action context from that request.",
      "Application policy decides whether the requested entity, document, or action is allowed.",
      "Denied or missing decisions stop the AI path instead of returning unrestricted evidence.",
    ],
    evidenceLinks: [
      {
        label: "Security Overview",
        href: "/docs/security",
        detail: "Current security docs for fail-closed access policy and application-owned enforcement.",
      },
      {
        label: "Tenant Guard Demo",
        href: "/demos/ai-fabric-tenant-guard",
        detail: "Live demo for tenant-scoped retrieval and cross-tenant leak prevention.",
      },
      {
        label: "Production Checklist",
        href: "/docs/production-checklist",
        detail: "Release checklist items that keep AI paths governed before public deployment.",
      },
    ],
    nextStepHref: "/docs/security/access-policy",
    nextStepLabel: "Read Access Policy Guide",
  },
  {
    id: "governed-actions",
    title: "Governed Actions",
    description: "Let users ask for work while the app keeps confirmation and execution control.",
    href: "/docs/governed_actions_story",
    icon: Zap,
    color: "bg-amber-500",
    category: "Actions",
    collection: "user-stories",
    readTime: "6 min read",
    stats: "Confirmed execution",
    heroKicker: "Reviewed Framework Story",
    heroTitle: "When a chatbot needs to do something, not just answer",
    heroLead:
      "AI Fabric governed actions turn user intent into structured action requests, require confirmation for sensitive operations, and execute through application-defined handlers.",
    whyItMatters:
      "This is where AI becomes useful inside a Java app without becoming unsafe. The LLM can propose; the application owns validation, confirmation, execution, and display.",
    currentStatus: [
      "Current docs include a first governed action path and action confirmation guidance.",
      "Shopping and Account Resolver demos both use action flows with confirmation cards before state changes.",
      "Recent demo lessons emphasize domain-specific result rendering instead of dumping raw action JSON.",
    ],
    requestFlow: [
      "User asks for an operation such as add to cart, update payment, resolve refund, or checkout.",
      "AI Fabric resolves intent and parameters from the message and current chat/session context.",
      "The app asks for missing required inputs or presents a confirmation card.",
      "After confirmation, the app action handler performs the state change and returns a user-facing result.",
    ],
    evidenceLinks: [
      {
        label: "First Governed Action",
        href: "/docs/first-governed-action",
        detail: "Current guide for registering and executing application-owned actions.",
      },
      {
        label: "Account Resolver Demo",
        href: "/demos/ai-fabric-account-resolver",
        detail: "Live resolver with current-account actions, confirmations, and policy context.",
      },
      {
        label: "AI Shopping Experience",
        href: "/demos/ai-shopping-experience",
        detail: "Live commerce demo with product search, cart, checkout, and support actions.",
      },
    ],
    nextStepHref: "/docs/first-governed-action",
    nextStepLabel: "Build First Action",
  },
  {
    id: "chat-session-memory",
    title: "Chat Session Memory",
    description: "Keep follow-up questions grounded in the backend session, not hidden UI state.",
    href: "/docs/chat_session_memory_story",
    icon: MessageSquare,
    color: "bg-blue-500",
    category: "Memory",
    collection: "user-stories",
    readTime: "5 min read",
    stats: "Backend-owned turns",
    heroKicker: "Reviewed Framework Story",
    heroTitle: "When follow-up requests must understand the prior answer",
    heroLead:
      "AI Fabric chat sessions let a backend preserve recent turns so follow-up prompts such as 'ok add it' or 'which is better?' can be interpreted in context.",
    whyItMatters:
      "Public demos taught us not to send fragile history from the UI. The backend should own the session because it is closest to actions, user identity, and safety policy.",
    currentStatus: [
      "The current docs expose chat-session memory as a module and first-class app integration point.",
      "Account Resolver was wired to backend chat sessions so the UI sends only the new message.",
      "Prompt overlays can guide the LLM to inspect recent turns, while the stored session provides the actual context.",
    ],
    requestFlow: [
      "UI sends a session id and only the latest user message.",
      "Backend loads recent AI Fabric chat turns for that session.",
      "Orchestration receives the new message plus bounded history.",
      "Actions and answers can resolve references to prior suggestions without depending on stale frontend state.",
    ],
    evidenceLinks: [
      {
        label: "Chat Session Memory",
        href: "/docs/chat-session-memory",
        detail: "Current guide for backend-managed AI Fabric chat history.",
      },
      {
        label: "Account Resolver Demo",
        href: "/demos/ai-fabric-account-resolver",
        detail: "Live demo that uses session-aware resolver follow-ups.",
      },
      {
        label: "LLM Assistant Rules",
        href: "/docs/llm-context/rules",
        detail: "Rules for coding assistants so they use framework memory instead of inventing UI history.",
      },
    ],
    nextStepHref: "/docs/chat-session-memory",
    nextStepLabel: "Add Chat Memory",
  },
  {
    id: "spring-ai-provider",
    title: "Spring AI Provider",
    description: "Use Spring AI underneath for LLM and embeddings while AI Fabric owns policy and orchestration.",
    href: "/docs/openai_provider_story",
    icon: Bot,
    color: "bg-emerald-500",
    category: "Provider",
    collection: "user-stories",
    readTime: "5 min read",
    stats: "Provider bridge",
    heroKicker: "Reviewed Framework Story",
    heroTitle: "When Java AI apps should not duplicate provider clients",
    heroLead:
      "AI Fabric 0.3.3 uses the Spring AI provider bridge for supported LLM and embedding providers, while keeping AI Fabric-specific routing, actions, RAG, diagnostics, and policy above it.",
    whyItMatters:
      "The framework should add Java application enablement, not unnecessary provider duplication. Spring AI handles model calls where it fits; AI Fabric handles app-level behavior.",
    currentStatus: [
      "Current installation docs point to ai-fabric-provider-spring-ai for OpenAI and other supported Spring AI-backed providers.",
      "Vector providers remain AI Fabric-owned where the framework needs lifecycle/admin behavior beyond simple similarity search.",
      "ONNX remains supported both through native AI Fabric paths and Spring AI ONNX where appropriate.",
    ],
    requestFlow: [
      "Application adds the Spring AI provider module and configures model keys through environment variables.",
      "AI Fabric resolves the model/provider for each generation or embedding request.",
      "Spring AI performs the provider call underneath.",
      "AI Fabric receives the result and applies framework-level orchestration, usage evidence, policy, and diagnostics.",
    ],
    evidenceLinks: [
      {
        label: "OpenAI Provider Guide",
        href: "/docs/providers/openai",
        detail: "Current provider setup for OpenAI through AI Fabric's Spring AI bridge.",
      },
      {
        label: "Installation",
        href: "/docs/installation",
        detail: "Release-backed dependency list for provider modules.",
      },
      {
        label: "Module Decision Tree",
        href: "/docs/llm-context/module-decision-tree",
        detail: "Coding-assistant friendly guidance for choosing provider and vector modules.",
      },
    ],
    nextStepHref: "/docs/providers/openai",
    nextStepLabel: "Configure OpenAI Provider",
  },
  {
    id: "indexing-data-sync",
    title: "Indexing And Data Sync",
    description: "Keep AI evidence aligned with app data through explicit seed, sync, and refresh paths.",
    href: "/docs/indexing_story",
    icon: Database,
    color: "bg-cyan-500",
    category: "Indexing",
    collection: "user-stories",
    readTime: "5 min read",
    stats: "Fresh evidence",
    heroKicker: "Reviewed Framework Story",
    heroTitle: "When AI answers depend on data that keeps changing",
    heroLead:
      "AI Fabric indexing and data-sync patterns help a Java app decide what evidence should be searchable, when to refresh it, and how demos prove vectors are present.",
    whyItMatters:
      "A RAG app is only as trustworthy as its indexed evidence. The current demos make data readiness visible with seed, reset, and vector proof flows instead of hiding stale data problems.",
    currentStatus: [
      "Current docs describe semantic search as embeddings plus a vector store plus application-selected data.",
      "The shopping demo exposes staged seeding so users can compare no evidence, partial evidence, and full RAG evidence.",
      "Demo health/build metadata and refresh paths make deployment and data freshness easier to inspect.",
    ],
    requestFlow: [
      "Application chooses which entities, policies, reviews, or tickets are AI-searchable.",
      "Indexing turns those records into embeddings and vector metadata.",
      "Readiness or demo-stage endpoints expose what is currently indexed.",
      "RAG and search requests retrieve from the current vector state rather than assumed data.",
    ],
    evidenceLinks: [
      {
        label: "First Semantic Search",
        href: "/docs/first-semantic-search",
        detail: "Current setup path for indexing and searching application data.",
      },
      {
        label: "AI Shopping Experience",
        href: "/demos/ai-shopping-experience",
        detail: "Live staged evidence demo with reset and seed controls.",
      },
      {
        label: "Module Map",
        href: "/docs/modules",
        detail: "Where indexing, embeddings, and vector stores fit in the framework.",
      },
    ],
    nextStepHref: "/docs/first-semantic-search",
    nextStepLabel: "Build Semantic Search",
  },
  {
    id: "relationship-query",
    title: "Relationship Query",
    description: "Translate natural-language questions into controlled relational queries over app entities.",
    href: "/docs/relationship_query_story_v2",
    icon: Brain,
    color: "bg-violet-500",
    category: "Query",
    collection: "user-stories",
    readTime: "6 min read",
    stats: "Natural language to data",
    heroKicker: "Reviewed Framework Story",
    heroTitle: "When business users need answers from relational data, not only documents",
    heroLead:
      "AI Fabric relationship query is the framework path for natural-language questions over JPA/relational application models with explicit schema and access constraints.",
    whyItMatters:
      "Not every AI question is a vector search problem. Existing Java apps often need controlled querying over customers, orders, accounts, deals, or support cases.",
    currentStatus: [
      "Current module docs list ai-fabric-relationship-query as the natural-language to JPA/JPQL capability.",
      "The LLM opportunity scanner now calls out repositories, query methods, and relationship schemas as places where this module fits.",
      "The framework docs treat relationship query as a governed app capability that still requires explicit schema and policy boundaries.",
    ],
    requestFlow: [
      "Application defines the entity relationships and safe query boundary.",
      "User asks a natural-language data question.",
      "AI Fabric plans a controlled relationship query against the allowed schema.",
      "The app returns structured results or a safe explanation when the query cannot be answered.",
    ],
    evidenceLinks: [
      {
        label: "Module Map",
        href: "/docs/modules",
        detail: "Current relationship-query module description and dependency guidance.",
      },
      {
        label: "Opportunity Scanner",
        href: "/docs/llm-context/opportunity-scanner",
        detail: "Coding-assistant guide for spotting relationship-query opportunities in Java apps.",
      },
      {
        label: "Real App Reference",
        href: "/docs/llm-context/real-app-reference",
        detail: "Examples and demo patterns that help choose the right module.",
      },
    ],
    nextStepHref: "/docs/modules",
    nextStepLabel: "Review Relationship Module",
  },
  {
    id: "onnx-embeddings",
    title: "ONNX Embeddings",
    description: "Use local embedding options when a Java app needs offline or private vector generation.",
    href: "/docs/onnx_provider_story",
    icon: Cpu,
    color: "bg-sky-500",
    category: "Provider",
    collection: "user-stories",
    readTime: "5 min read",
    stats: "Local embeddings",
    heroKicker: "Reviewed Framework Story",
    heroTitle: "When embeddings should run locally instead of through a remote API",
    heroLead:
      "AI Fabric supports ONNX-oriented embedding paths for apps that need local vector generation, alongside Spring AI-backed provider options where they fit.",
    whyItMatters:
      "Local embeddings can be useful for privacy, development, or offline environments. The honest story is capability and fit, not guaranteed zero cost or universal performance wins.",
    currentStatus: [
      "Current configuration docs mention native ONNX and Spring AI ONNX support around the AIEmbeddingRequest contract.",
      "The module map identifies Spring AI ONNX as an optional embedding provider path.",
      "Real provider testing includes ONNX fallback coverage as a verification scenario.",
    ],
    requestFlow: [
      "Application selects an ONNX-compatible embedding provider path.",
      "AI Fabric validates embedding request text and dimensions through the provider contract.",
      "Local embeddings are generated for indexing or search.",
      "Vector storage and RAG use those embeddings through the same framework-facing APIs.",
    ],
    evidenceLinks: [
      {
        label: "ONNX Embeddings Guide",
        href: "/docs/providers/onnx",
        detail: "Current ONNX provider setup and configuration notes.",
      },
      {
        label: "Module Map",
        href: "/docs/modules",
        detail: "Where native and Spring AI ONNX provider paths fit.",
      },
      {
        label: "Testing And Verification",
        href: "/docs/testing-verification",
        detail: "Provider smoke and fallback checks used during release verification.",
      },
    ],
    nextStepHref: "/docs/providers/onnx",
    nextStepLabel: "Review ONNX Setup",
  },
  {
    id: "privacy-shield",
    title: "Privacy Shield",
    description: "Detect sensitive input and keep unsafe text out of retrieval and logs.",
    href: "/docs/pii_detection_story_v1",
    icon: Lock,
    color: "bg-rose-500",
    category: "Privacy",
    collection: "user-stories",
    readTime: "5 min read",
    stats: "PII-safe flow",
    heroKicker: "Reviewed Framework Story",
    heroTitle: "When users paste sensitive information into an AI session",
    heroLead:
      "AI Fabric PII support lets an app detect sensitive user input, redact unsafe text, and preserve enough evidence for safe support workflows.",
    whyItMatters:
      "This is not a compliance certificate. It is a framework capability that helps Java apps implement privacy-aware AI behavior before text reaches indexing, retrieval, or generation paths.",
    currentStatus: [
      "The Privacy Shield live demo uses AI Fabric PII detection and redaction with local vector indexing.",
      "The public copy avoids formal regulatory-compliance claims; it describes privacy-oriented controls instead.",
      "The demo intentionally shows raw input withheld and search queries redacted before retrieval.",
    ],
    requestFlow: [
      "User submits a support message containing sensitive fields.",
      "AI Fabric PII detection identifies and redacts configured sensitive values.",
      "The app stores or indexes only safe text according to its policy.",
      "Search and support views show sanitized evidence rather than exposing the original unsafe message.",
    ],
    evidenceLinks: [
      {
        label: "Privacy Shield Demo",
        href: "/demos/ai-fabric-privacy-shield",
        detail: "Live privacy-first support demo with PII detection and redacted search.",
      },
      {
        label: "Security Overview",
        href: "/docs/security",
        detail: "Current security framing for privacy and policy guardrails.",
      },
      {
        label: "Production Checklist",
        href: "/docs/production-checklist",
        detail: "Release gate reminders for privacy and sensitive-data behavior.",
      },
    ],
    nextStepHref: "/demos/ai-fabric-privacy-shield",
    nextStepLabel: "Open Privacy Demo",
  },
];

export const realApiStories: ReviewedStory[] = [
  {
    id: "shopping-experience",
    title: "AI Shopping Experience",
    description: "A commerce app that stages RAG evidence and uses governed cart/checkout actions.",
    href: "/docs/ecommerce-product-discovery-story",
    icon: ShoppingCart,
    color: "bg-blue-500",
    category: "Commerce",
    collection: "real-api-stories",
    readTime: "7 min read",
    stats: "Live OpenAI demo",
    heroKicker: "Reviewed Real App Story",
    heroTitle: "A real commerce demo that proves evidence quality before AI answers",
    heroLead:
      "The shopping demo shows how products, reviews, policies, coupons, and tickets change answer quality as the user seeds more RAG evidence.",
    whyItMatters:
      "It makes RAG readiness visible. Users can test before-data, partial-data, and full-data behavior instead of seeing a polished answer with hidden prerequisites.",
    currentStatus: [
      "The demo has staged seeding/reset flows for product, review, policy, coupon, and support evidence.",
      "Commerce actions render domain-specific cards for cart, checkout, product lists, and support requests.",
      "Mode selection is explicit in the UI and mapped to backend commerce modes instead of being silently forced.",
    ],
    requestFlow: [
      "User selects a scenario and evidence stage.",
      "Backend seeds or clears the relevant demo data and vectors.",
      "User runs the AI prompt through the demo chat endpoint.",
      "UI displays answer, retrieved evidence, action confirmations, and domain-specific results.",
    ],
    evidenceLinks: [
      {
        label: "Live Demo",
        href: "/demos/ai-shopping-experience",
        detail: "Public shopping demo using the deployed backend.",
      },
      {
        label: "About This Demo",
        href: "/demos/ai-shopping-experience/about",
        detail: "Backend architecture, modules, providers, and request flow.",
      },
      {
        label: "Live Demos Guide",
        href: "/docs/live-demos",
        detail: "Current catalog of release-backed deployed demos.",
      },
    ],
    nextStepHref: "/demos/ai-shopping-experience",
    nextStepLabel: "Open Shopping Demo",
  },
  {
    id: "account-resolver",
    title: "Account Resolver",
    description: "Resolve blocked accounts with policy-aware RAG, session memory, and confirmed actions.",
    href: "/docs/account-resolver-story",
    icon: KeyRound,
    color: "bg-fuchsia-500",
    category: "Support",
    collection: "real-api-stories",
    readTime: "7 min read",
    stats: "Live resolver app",
    heroKicker: "Reviewed Real App Story",
    heroTitle: "A support resolver that lets AI inspect profile data and choose the next governed action",
    heroLead:
      "The Account Resolver demo exposes current-user profile data and policy docs to the AI, then lets it explain blockers and propose confirmed fixes.",
    whyItMatters:
      "It demonstrates the clean boundary for resolver apps: policies are human-readable guidance, profile data is read from the backend, and state changes happen only through app actions.",
    currentStatus: [
      "Backend chat sessions preserve follow-up context so the UI sends only the latest message.",
      "Readiness is no longer the only intelligence source; the AI can inspect profile data against policies.",
      "Demo sessions isolate users so multiple public visitors do not share the same mutable account state.",
    ],
    requestFlow: [
      "User asks why an account cannot continue or requests a billing/account change.",
      "AI Fabric retrieves policy docs and invokes current-account read actions when needed.",
      "AI explains blockers from profile data and proposes a governed action.",
      "User confirms the action; backend updates only the current demo session account.",
    ],
    evidenceLinks: [
      {
        label: "Live Demo",
        href: "/demos/ai-fabric-account-resolver",
        detail: "Public account resolver with profile reads, policies, session memory, and actions.",
      },
      {
        label: "About This Demo",
        href: "/demos/ai-fabric-account-resolver/about",
        detail: "Backend app architecture and framework modules used.",
      },
      {
        label: "First Governed Action",
        href: "/docs/first-governed-action",
        detail: "Current action implementation path behind resolver state changes.",
      },
    ],
    nextStepHref: "/demos/ai-fabric-account-resolver",
    nextStepLabel: "Open Resolver Demo",
  },
  {
    id: "behavior-signals",
    title: "Behavior Signals",
    description: "Analyze user behavior and let AI recommend a genuine agentic UI component mix.",
    href: "/docs/behavior-signals-story",
    icon: Users,
    color: "bg-emerald-500",
    category: "Analytics",
    collection: "real-api-stories",
    readTime: "7 min read",
    stats: "Live behavior app",
    heroKicker: "Reviewed Real App Story",
    heroTitle: "A behavior analytics demo where AI changes the product surface",
    heroLead:
      "Behavior Signals records raw app events, asks AI Fabric for behavior insight, and renders a user-home preview from LLM-selected component names.",
    whyItMatters:
      "This is a concrete agentic UI story: the AI does not just label a user; it recommends which real product components should be shown for that user's current behavior.",
    currentStatus: [
      "The demo feeds previous insight plus new events since the last insight to the LLM for follow-up analysis.",
      "No deterministic fallback hides LLM failure in the AI analysis path.",
      "The UI exposes raw event types used for the insight and a separate agentic home preview.",
    ],
    requestFlow: [
      "User records realistic raw app events for a selected demo account.",
      "Backend sends prior insight plus new events to AI Fabric for behavior analysis.",
      "LLM returns behavior insight and component names from a described component catalog.",
      "UI renders a preview such as retention offer, upgrade panel, points card, or simplified shortcuts.",
    ],
    evidenceLinks: [
      {
        label: "Live Demo",
        href: "/demos/ai-fabric-behavior-signals",
        detail: "Public behavior demo with event recording and AI analysis.",
      },
      {
        label: "Agentic UI Preview",
        href: "/demos/ai-fabric-behavior-signals/agentic-ui",
        detail: "Sub-page that renders components selected by AI for the current user insight.",
      },
      {
        label: "About This Demo",
        href: "/demos/ai-fabric-behavior-signals/about",
        detail: "Backend architecture and framework modules used.",
      },
    ],
    nextStepHref: "/demos/ai-fabric-behavior-signals",
    nextStepLabel: "Open Behavior Demo",
  },
  {
    id: "tenant-guard",
    title: "Tenant Guard",
    description: "Prove tenant-scoped retrieval and leak prevention with live metadata-filtered RAG.",
    href: "/docs/tenant-guard-story",
    icon: Shield,
    color: "bg-indigo-500",
    category: "Multi-tenant",
    collection: "real-api-stories",
    readTime: "6 min read",
    stats: "Live tenant app",
    heroKicker: "Reviewed Real App Story",
    heroTitle: "A multi-tenant AI app where retrieval has to stay inside the tenant boundary",
    heroLead:
      "Tenant Guard demonstrates tenant metadata filtering, visibility rules, access checks, and no-fallback live verification for cross-tenant retrieval questions.",
    whyItMatters:
      "Tenant-safe RAG is one of the hardest parts of enterprise AI. The demo shows the app still owns tenant context while AI Fabric applies it during retrieval.",
    currentStatus: [
      "The demo uses tenant-aware metadata filters and application-side access control for retrieval.",
      "The UI includes clear tenant scenarios and live backend build metadata so deployment freshness is visible.",
      "Recent verification focused on no fallback behavior when LLM or backend checks fail.",
    ],
    requestFlow: [
      "User selects a tenant scenario and asks about documents or restricted information.",
      "Backend builds an AI Fabric retrieval request with tenant and visibility constraints.",
      "Vector retrieval returns only documents allowed for that tenant/session.",
      "The answer and evidence panel make it clear which tenant-scoped documents were used.",
    ],
    evidenceLinks: [
      {
        label: "Live Demo",
        href: "/demos/ai-fabric-tenant-guard",
        detail: "Public tenant guard demo with tenant-scoped retrieval scenarios.",
      },
      {
        label: "About This Demo",
        href: "/demos/ai-fabric-tenant-guard/about",
        detail: "Backend architecture and framework modules used.",
      },
      {
        label: "Security Overview",
        href: "/docs/security",
        detail: "Current docs for tenant/user-safe retrieval guardrails.",
      },
    ],
    nextStepHref: "/demos/ai-fabric-tenant-guard",
    nextStepLabel: "Open Tenant Demo",
  },
  {
    id: "privacy-support",
    title: "Privacy Shield Support",
    description: "Handle support messages that contain sensitive information without exposing raw text.",
    href: "/docs/privacy-shield-story",
    icon: Lock,
    color: "bg-rose-500",
    category: "Privacy",
    collection: "real-api-stories",
    readTime: "6 min read",
    stats: "Live privacy app",
    heroKicker: "Reviewed Real App Story",
    heroTitle: "A customer-facing support app that redacts sensitive text before search",
    heroLead:
      "Privacy Shield demonstrates AI Fabric PII detection and redaction in a support workflow where users may paste account numbers, emails, or other sensitive details.",
    whyItMatters:
      "The point is operational safety: protect indexing/search paths and make the UI obvious about what was detected, redacted, withheld, and searched.",
    currentStatus: [
      "The deployed app uses AI Fabric PII detection, local vector indexing, and privacy-simple embeddings.",
      "Live LLM generation is intentionally disabled in this demo; the intelligence being demonstrated is privacy detection and safe retrieval.",
      "The OpenAI key may be configured for the environment, but the app does not pretend to use generation when it does not.",
    ],
    requestFlow: [
      "User creates or opens a privacy demo support session.",
      "User submits a message containing sensitive information.",
      "AI Fabric detects and redacts PII before storage/search.",
      "UI shows withheld raw input, redacted message, and safe retrieval results.",
    ],
    evidenceLinks: [
      {
        label: "Live Demo",
        href: "/demos/ai-fabric-privacy-shield",
        detail: "Public privacy support demo with PII redaction and safe search.",
      },
      {
        label: "About This Demo",
        href: "/demos/ai-fabric-privacy-shield/about",
        detail: "Backend architecture and framework modules used.",
      },
      {
        label: "Production Checklist",
        href: "/docs/production-checklist",
        detail: "Release gate reminders for sensitive data behavior.",
      },
    ],
    nextStepHref: "/demos/ai-fabric-privacy-shield",
    nextStepLabel: "Open Privacy Demo",
  },
  {
    id: "release-verification",
    title: "Release Verification",
    description: "Use real provider smoke tests and demo health checks as release evidence.",
    href: "/docs/release-verification-story",
    icon: TestTube,
    color: "bg-cyan-500",
    category: "Testing",
    collection: "real-api-stories",
    readTime: "5 min read",
    stats: "Release gate",
    heroKicker: "Reviewed Real App Story",
    heroTitle: "A release process that treats AI behavior as something to verify, not hope for",
    heroLead:
      "AI Fabric's public release story includes unit tests, CI-equivalent checks, real provider smoke tests, demo health endpoints, and live verification after deployment.",
    whyItMatters:
      "AI app frameworks fail when behavior is only demonstrated manually. The release story makes provider keys, Docker-backed local tests, and live demos part of the quality path.",
    currentStatus: [
      "Current docs separate ordinary CI checks from manual/live provider verification.",
      "Demos expose health endpoints with build metadata so deployed commit freshness can be inspected.",
      "Real API suites are documented as an external proof path because they depend on live provider keys and services.",
    ],
    requestFlow: [
      "Developer runs normal unit/module tests locally and in CI.",
      "For large changes, developer runs Docker-backed real provider smoke tests with private auth material.",
      "Release notes and migration docs are checked before publishing.",
      "After deployment, public demo health and scenario checks verify the release is live.",
    ],
    evidenceLinks: [
      {
        label: "Testing And Verification",
        href: "/docs/testing-verification",
        detail: "Current test and release verification guide.",
      },
      {
        label: "Production Checklist",
        href: "/docs/production-checklist",
        detail: "Release gate checklist before public publishing.",
      },
      {
        label: "Live Demos Guide",
        href: "/docs/live-demos",
        detail: "Public demo verification entry points.",
      },
    ],
    nextStepHref: "/docs/testing-verification",
    nextStepLabel: "Review Test Guide",
  },
];

export const reviewedStories: ReviewedStory[] = [...userStories, ...realApiStories];

export const getReviewedStory = (storyId: string) =>
  reviewedStories.find((story) => story.id === storyId);
