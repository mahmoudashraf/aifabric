export type DemoBackendArchitectureTone = "live" | "candidate" | "concept";

export interface DemoBackendArchitectureConfig {
  title: string;
  status: string;
  tone: DemoBackendArchitectureTone;
  backendApp: string;
  publicBackend?: string;
  uiRoutes: string[];
  summary: string;
  dependencies: string[];
  modules: string[];
  aiSurface: string[];
  providers: string[];
  flow: string[];
}

export const demoBackendArchitectures = {
  shopping: {
    title: "AI Shopping Experience backend",
    status: "Live backend-backed demo",
    tone: "live",
    backendApp: "examples/real-apps/chat-capabilities-demo",
    publicBackend: "https://ai-fabric-chat-capabilities-demo.46.224.145.148.sslip.io",
    uiRoutes: ["/demos/ai-shopping-experience", "/demos/ai-fabric-framework"],
    summary:
      "A Spring Boot commerce runtime that owns product/cart/order APIs and uses AI Fabric for chat orchestration, staged RAG readiness, local actions, confirmations, and runtime data sync.",
    dependencies: [
      "Spring Boot Web, Data JPA, Validation, Actuator, OpenAPI, H2, and Lombok.",
      "smoke-support for deployment metadata and no-key smoke checks.",
    ],
    modules: [
      "ai-fabric-starter",
      "ai-fabric-curated-commerce",
      "ai-fabric-provider-spring-ai",
      "ai-fabric-chat-session",
      "ai-fabric-data-sync",
      "ai-fabric-governance",
      "ai-fabric-indexing",
      "ai-fabric-rag",
      "ai-fabric-vector-lucene",
    ],
    aiSurface: [
      "Product, Policy, and Review are @AICapable with @AISearchable and @AIContext fields.",
      "ProductService, PolicyService, and ReviewService use @AIProcess for index synchronization.",
      "Local @AIAction handlers cover catalog, cart, checkout, orders, support, returns, reviews, addresses, shipments, and account lookup.",
    ],
    providers: [
      "OpenAI through ai-fabric-provider-spring-ai for live LLM and embeddings.",
      "Lucene vector retrieval and H2 commerce/chat-session storage.",
      "Local ChatLocalLlmProvider for no-key smoke runs.",
    ],
    flow: [
      "The UI posts chat turns to /api/chat/query with the selected commerce position.",
      "CommerceModeResolver maps UI position to AI Fabric orchestration mode and prompt overlay.",
      "AI Fabric loads chat memory, resolves intent, retrieves staged RAG evidence, and selects local actions when needed.",
      "Write actions return confirmation before execution; domain writes re-enter indexing through @AIProcess.",
    ],
  },
  accountResolver: {
    title: "AI Fabric Account Resolver backend",
    status: "Live backend-backed demo",
    tone: "live",
    backendApp: "examples/real-apps/ai-fabric-account-resolver",
    publicBackend: "https://ai-fabric-account-resolver.46.224.145.148.sslip.io",
    uiRoutes: ["/demos/ai-fabric-account-resolver"],
    summary:
      "A current-account resolver where AI Fabric reads factual profile state, retrieves policy evidence, explains blockers, and proposes governed account actions.",
    dependencies: [
      "Spring Boot Web, Data JPA, Validation, Actuator, H2/PostgreSQL drivers, and Lombok.",
      "smoke-support for build metadata and release smoke support.",
    ],
    modules: [
      "ai-fabric-starter",
      "ai-fabric-provider-spring-ai",
      "ai-fabric-chat-session",
      "ai-fabric-rag",
      "ai-fabric-vector-lucene",
      "ai-fabric-behavior",
      "ai-fabric-relationship-query",
    ],
    aiSurface: [
      "SubscriptionPlan and Subscription are @AICapable; account-resolution policies are config-driven.",
      "PaymentMethod, Address, and RefundRequest expose AI context fields used in action results.",
      "@AIAction handlers expose get_account_profile, payment/address updates, refunds, plan changes, cancellation, and subscribe.",
      "get_account_profile exposes @ActionFacts so blocker reasoning comes from account facts plus policies.",
    ],
    providers: [
      "OpenAI through ai-fabric-provider-spring-ai for live natural-language orchestration.",
      "Deterministic simple embeddings for account policy and plan retrieval.",
      "Lucene vector search over account-resolution-policy and subscription-plan; H2 stores session-scoped personas.",
    ],
    flow: [
      "The UI posts natural language to /api/subscriptions/query with a stable conversation id.",
      "AI Fabric resolver mode loads chat memory and can run get_account_profile with policy RAG in parallel.",
      "The LLM explains blockers from profile facts and retrieved policies.",
      "Action handlers enforce @ActionAllowed, create @ActionConfirmation cards, and execute writes through @ActionExecute.",
    ],
  },
  behaviorSignals: {
    title: "AI Fabric Behavior Signals backend",
    status: "Live backend-backed demo",
    tone: "live",
    backendApp: "examples/real-apps/behavior-churn-signals",
    publicBackend: "https://behavior-churn-signals.46.224.145.148.sslip.io",
    uiRoutes: ["/demos/ai-fabric-behavior-signals", "/demos/ai-fabric-behavior-signals/agentic-ui"],
    summary:
      "A behavior analytics runtime that turns raw app events into churn/sentiment insights, governed retention actions, and an LLM-selected user home preview.",
    dependencies: [
      "Spring Boot Web, Data JPA, Validation, Actuator, H2, and Lombok.",
      "smoke-support for shared health and deployment metadata.",
    ],
    modules: ["ai-fabric-provider-starter", "ai-fabric-provider-spring-ai", "ai-fabric-behavior"],
    aiSurface: [
      "No @AICapable entities by design; behavior analytics is fed through the ExternalEventProvider SPI.",
      "AppBehaviorEvent stores raw app events and DbExternalEventProvider exposes them to AI Fabric behavior analysis.",
      "AgenticUiComposerService asks the configured LLM for allowlisted component names and reasons only.",
    ],
    providers: [
      "OpenAI through ai-fabric-provider-spring-ai for live public insight generation.",
      "Deterministic behavior-local provider for local/no-key runs.",
      "No vector DB; H2 stores events and BehaviorInsights for session-scoped demo users.",
    ],
    flow: [
      "The UI creates an isolated browser session and clones seeded behavior scenarios.",
      "Run analysis or record a raw app event; AI Fabric BehaviorAnalysisService persists fresh insights.",
      "Retention preview and confirmation stay backend-governed with policy explanations.",
      "Agentic UI receives a validated component plan and renders trusted backend-populated props.",
    ],
  },
  tenantGuard: {
    title: "AI Fabric Tenant Guard backend",
    status: "Live backend-backed demo",
    tone: "live",
    backendApp: "examples/real-apps/tenant-knowledge-portal",
    publicBackend: "https://ai-fabric-tenant-guard.46.224.145.148.sslip.io",
    uiRoutes: ["/demos/ai-fabric-tenant-guard"],
    summary:
      "A deterministic tenant-boundary proof that shows scoped retrieval, role-aware catalog visibility, guarded actions, and tenant deletion evidence.",
    dependencies: [
      "Spring Boot Web, Actuator, and Lombok.",
      "smoke-support for shared build metadata.",
    ],
    modules: ["ai-fabric-starter", "ai-fabric-governance"],
    aiSurface: [
      "No @AICapable annotations; explicit KnowledgeDocument records make tenant metadata visible and inspectable.",
      "Each document carries tenantId and visibility metadata.",
      "ActionAccessMode models read/write access so role and confirmation decisions are explicit.",
    ],
    providers: [
      "Smoke/local provider ids through configuration.",
      "Default memory vector setting; this demo mainly proves metadata scope, role checks, and deletion evidence.",
      "In-memory TenantKnowledgeService demo data reset through /api/tenant-guard-demo/reset.",
    ],
    flow: [
      "The UI loads /api/tenant-guard-demo/dashboard for seeded proof state.",
      "/compare runs the same query as tenant A, tenant B, and platform admin.",
      "/actions/execute validates target tenant, role, access mode, and confirmation.",
      "/tenants/delete deletes only the requested tenant documents and returns evidence ids.",
    ],
  },
  smartFaq: {
    title: "Smart FAQ Assistant backend candidate",
    status: "UI page exists; backend not wired live yet",
    tone: "candidate",
    backendApp: "examples/real-apps/smart-faq-assistant",
    uiRoutes: ["/demos/smart-faq-assistant"],
    summary:
      "The current page is explanatory/static. The runnable backend candidate is a config-driven FAQ RAG service with semantic search, optional answer generation, and golden-question quality gates.",
    dependencies: [
      "Spring Boot Web, Data JPA, Validation, Actuator, H2, and Lombok.",
      "smoke-support for release smoke and build metadata.",
    ],
    modules: ["ai-fabric-starter", "ai-fabric-rag", "ai-fabric-vector-lucene"],
    aiSurface: [
      "No Java AI annotations; ai-entity-config.yml defines faq-article searchable fields, embeddable fields, and metadata.",
      "FaqArticleService owns seed, reindex, semantic search, and optional ask flow.",
      "FaqQualityService verifies expected source evidence before claiming RAG quality.",
    ],
    providers: [
      "Deterministic SimpleHashEmbeddingProvider.",
      "Lucene vector search and H2 article storage.",
      "Optional answer generation when an LLM provider is configured.",
    ],
    flow: [
      "Seed FAQ articles through /api/demo/seed.",
      "Reindex articles into the faq-article vector space.",
      "Search delegates to AICoreService.performSearch.",
      "Golden-question runs verify retrieved evidence ids.",
    ],
  },
  documentHub: {
    title: "Document Intelligence Hub backend candidate",
    status: "UI page exists; backend not wired live yet",
    tone: "candidate",
    backendApp: "examples/real-apps/document-ingestion-workbench",
    uiRoutes: ["/demos/document-intelligence-hub"],
    summary:
      "The current page is explanatory/static. The runnable backend candidate accepts trusted text/JSON documents, previews chunks, indexes them through AI Fabric, and deletes stale vector evidence.",
    dependencies: [
      "Spring Boot Web, Data JPA, Validation, Actuator, H2, and Lombok.",
      "Spring AI commons for document-reader integration.",
      "smoke-support for release smoke and build metadata.",
    ],
    modules: ["ai-fabric-starter", "ai-fabric-indexing", "ai-fabric-vector-lucene"],
    aiSurface: [
      "No Java AI annotations; ai-entity-config.yml defines generated kb chunk payloads and metadata.",
      "DocumentSource stores trusted source files.",
      "DocumentChunkManifest records generated chunks so replacement/delete can remove stale vectors.",
    ],
    providers: [
      "Configured embedding provider with Lucene vector DB by default.",
      "Deterministic local providers in smoke mode.",
      "H2 stores source and chunk manifests; trusted-root constrains filesystem reads.",
    ],
    flow: [
      "Create or update a source through /api/documents/sources.",
      "Preview chunks before indexing.",
      "Index normalized chunk payloads with source/chunk metadata.",
      "Re-upload and delete queue stale vector deletes before exposing new evidence.",
    ],
  },
  productDiscovery: {
    title: "Product Discovery backend status",
    status: "Concept page; live coverage is in Shopping",
    tone: "concept",
    backendApp: "Covered by examples/real-apps/chat-capabilities-demo",
    uiRoutes: ["/demos/product-discovery-engine", "/demos/ai-shopping-experience"],
    summary:
      "This page is a product-discovery concept page. The live product search, comparison, cart, coupon, and product RAG proof is implemented in the AI Shopping Experience backend.",
    dependencies: ["No dedicated Product Discovery backend app is wired to this route today."],
    modules: [
      "Live equivalent uses ai-fabric-rag",
      "Live equivalent uses ai-fabric-indexing",
      "Live equivalent uses ai-fabric-vector-lucene",
      "Live equivalent uses ai-fabric-curated-commerce",
    ],
    aiSurface: [
      "The live shopping backend has Product @AICapable fields and @AIAction handlers for search, list, details, cart, and checkout.",
    ],
    providers: [
      "Use the AI Shopping Experience for OpenAI-backed product discovery and Lucene retrieval.",
    ],
    flow: [
      "Concept route demonstrates UX shape only.",
      "For real AI Fabric behavior, run the Shopping demo staged RAG flow and product/cart actions.",
    ],
  },
  codeSearch: {
    title: "Code Documentation Search backend status",
    status: "Concept page only",
    tone: "concept",
    backendApp: "No dedicated real-app backend in this repo yet",
    uiRoutes: ["/demos/code-documentation-search"],
    summary:
      "This page illustrates a code-search use case, but there is no deployed backend app or framework proof wired to it yet.",
    dependencies: ["No backend dependencies are currently attached to this UI route."],
    modules: [
      "Likely future modules: ai-fabric-indexing",
      "Likely future modules: ai-fabric-rag",
      "Likely future modules: ai-fabric-vector-lucene or another vector provider",
    ],
    aiSurface: [
      "A future backend should define code document chunks, repository metadata, language tags, and source references as indexed evidence.",
    ],
    providers: ["No live provider is configured for this route today."],
    flow: [
      "Current page runs mock UI interactions.",
      "Future live flow should ingest code/docs, index chunks, retrieve source-backed evidence, and answer with citations.",
    ],
  },
  meetingNotes: {
    title: "Meeting Notes Analyzer backend status",
    status: "Concept page only",
    tone: "concept",
    backendApp: "No dedicated real-app backend in this repo yet",
    uiRoutes: ["/demos/meeting-notes-analyzer"],
    summary:
      "This page illustrates a meeting-analysis use case, but there is no deployed backend app or framework proof wired to it yet.",
    dependencies: ["No backend dependencies are currently attached to this UI route."],
    modules: [
      "Likely future modules: ai-fabric-provider-spring-ai",
      "Likely future modules: ai-fabric-indexing",
      "Likely future modules: ai-fabric-rag",
    ],
    aiSurface: [
      "A future backend should model transcript chunks, decisions, action items, speakers, and meeting metadata as trusted evidence.",
    ],
    providers: ["No live provider is configured for this route today."],
    flow: [
      "Current page runs mock UI interactions.",
      "Future live flow should ingest notes, extract structured actions, index summaries, and answer from meeting evidence.",
    ],
  },
} satisfies Record<string, DemoBackendArchitectureConfig>;
