export type DemoBackendArchitectureTone = "live" | "candidate" | "concept";

export interface DemoBackendArchitectureConfig {
  title: string;
  status: string;
  tone: DemoBackendArchitectureTone;
  backendApp: string;
  publicBackend?: string;
  uiRoutes: string[];
  summary: string;
  diagram?: DemoArchitectureStage[];
  developer?: DemoDeveloperDetails;
  dependencies: string[];
  modules: string[];
  aiSurface: string[];
  providers: string[];
  flow: string[];
}

export type DemoArchitectureStageTone = "ui" | "api" | "framework" | "rag" | "provider" | "storage" | "guard";

export interface DemoArchitectureStage {
  title: string;
  subtitle: string;
  tone: DemoArchitectureStageTone;
  items: string[];
}

export interface DemoDeveloperDetails {
  sourcePath: string;
  dockerfilePath: string;
  healthEndpoint: string;
  primaryEndpoints: string[];
  localRun: string[];
  envVars: string[];
  codeHotspots: string[];
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
    diagram: [
      {
        title: "React demo UI",
        subtitle: "ai-fabric.dev",
        tone: "ui",
        items: ["RAG journey controls", "Commerce tabs and cart", "Chat widget positions"],
      },
      {
        title: "Commerce API",
        subtitle: "Spring Boot app",
        tone: "api",
        items: ["/api/chat/query", "/api/demo/stages/{stage}", "/api/products and /api/carts"],
      },
      {
        title: "AI Fabric runtime",
        subtitle: "Curated commerce",
        tone: "framework",
        items: ["Mode resolver", "Chat-session memory", "Intent, actions, confirmations"],
      },
      {
        title: "RAG and indexing",
        subtitle: "Evidence pipeline",
        tone: "rag",
        items: ["@AICapable products, policies, reviews", "@AIProcess data sync", "Lucene vector spaces"],
      },
      {
        title: "Providers and state",
        subtitle: "Runtime backing",
        tone: "provider",
        items: ["Spring AI OpenAI", "H2 commerce data", "Local smoke provider"],
      },
    ],
    developer: {
      sourcePath: "examples/real-apps/chat-capabilities-demo",
      dockerfilePath: "examples/real-apps/chat-capabilities-demo/Dockerfile",
      healthEndpoint: "GET /api/demo/health",
      primaryEndpoints: [
        "POST /api/chat/query",
        "POST /api/chat/suggestions",
        "GET /api/chat/conversations",
        "GET /api/demo/readiness",
        "POST /api/demo/stages/{stage}",
        "POST /api/demo/reset",
        "GET /api/runtime/vector-search",
      ],
      localRun: [
        "mvn -pl examples/real-apps/chat-capabilities-demo spring-boot:run",
        "Use OPENAI_ENABLED=true with OpenAI model and embedding variables for live AI.",
        "Use the demo controls API key when calling stage/reset endpoints outside the UI.",
      ],
      envVars: [
        "PORT",
        "OPENAI_ENABLED",
        "OPENAI_API_KEY",
        "OPENAI_MODEL",
        "OPENAI_EMBEDDING_MODEL",
        "OPENAI_EMBEDDING_DIMENSIONS",
        "AI_DATA_SYNC_ENABLED",
        "APP_ADMIN_API_KEY",
        "CORS_ALLOWED_ORIGINS",
      ],
      codeHotspots: [
        "web/ChatController.java",
        "web/CommerceModeResolver.java",
        "demo/web/DemoController.java",
        "catalog/domain/Product.java",
        "policies/domain/Policy.java",
        "cart/action/AddToCartActionHandler.java",
        "cart/action/CheckoutCartActionHandler.java",
      ],
    },
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
    diagram: [
      {
        title: "Resolver UI",
        subtitle: "Session-scoped personas",
        tone: "ui",
        items: ["Scenario queue", "Natural chat", "Confirmation cards"],
      },
      {
        title: "Account API",
        subtitle: "Spring Boot app",
        tone: "api",
        items: ["/api/subscriptions/query", "/api/account-resolver/demo/sessions", "/api/account-resolver/users/{userId}/readiness"],
      },
      {
        title: "AI Fabric resolver",
        subtitle: "Iterative orchestration",
        tone: "framework",
        items: ["Chat-session memory", "Current-account target guard", "Action facts and policies"],
      },
      {
        title: "Actions and RAG",
        subtitle: "Governed resolution",
        tone: "rag",
        items: ["get_account_profile", "Payment, address, refund, plan actions", "Policy and plan vector lookup"],
      },
      {
        title: "Providers and state",
        subtitle: "Live backend",
        tone: "provider",
        items: ["Spring AI OpenAI", "Lucene policy vectors", "H2 session users"],
      },
    ],
    developer: {
      sourcePath: "examples/real-apps/ai-fabric-account-resolver",
      dockerfilePath: "examples/real-apps/ai-fabric-account-resolver/Dockerfile",
      healthEndpoint: "GET /api/account-resolver/health",
      primaryEndpoints: [
        "POST /api/subscriptions/query",
        "POST /api/account-resolver/demo/sessions",
        "GET /api/account-resolver/policies",
        "GET /api/account-resolver/users/{userId}/readiness",
        "POST /api/account-resolver/subscriptions/{subscriptionId}/payment-method",
        "POST /api/account-resolver/subscriptions/{subscriptionId}/refund",
        "POST /api/demo/indexing/reindex/plans",
      ],
      localRun: [
        "mvn -pl examples/real-apps/ai-fabric-account-resolver spring-boot:run",
        "Run with OPENAI_ENABLED=true for live natural-language orchestration.",
        "Use /api/account-resolver/demo/sessions to isolate browser sessions before testing writes.",
      ],
      envVars: [
        "PORT",
        "OPENAI_ENABLED",
        "OPENAI_API_KEY",
        "OPENAI_MODEL",
        "OPENAI_EMBEDDING_MODEL",
        "OPENAI_EMBEDDING_DIMENSIONS",
        "CORS_ALLOWED_ORIGINS",
      ],
      codeHotspots: [
        "controller/NaturalLanguageController.java",
        "controller/AccountResolverController.java",
        "service/AccountResolutionService.java",
        "action/handler/GetAccountProfileActionHandler.java",
        "action/handler/UpdatePaymentMethodActionHandler.java",
        "action/handler/RequestRefundActionHandler.java",
        "ai/ResolverAccountOwnedTargetResolutionStep.java",
      ],
    },
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
    diagram: [
      {
        title: "Behavior UI",
        subtitle: "Operator and home preview",
        tone: "ui",
        items: ["Scenario sessions", "Raw event recording", "Agentic UI preview"],
      },
      {
        title: "Behavior API",
        subtitle: "Spring Boot app",
        tone: "api",
        items: ["/api/behavior-demo/dashboard", "/api/behavior-demo/scenarios/{userId}/analyze", "/api/behavior-demo/scenarios/{userId}/agentic-ui"],
      },
      {
        title: "Event provider",
        subtitle: "AI Fabric SPI",
        tone: "storage",
        items: ["DbExternalEventProvider", "AppBehaviorEvent rows", "Session-scoped demo users"],
      },
      {
        title: "AI Fabric behavior",
        subtitle: "Insight engine",
        tone: "framework",
        items: ["BehaviorAnalysisService", "Sentiment and churn insight", "Persisted recommendations"],
      },
      {
        title: "LLM and actions",
        subtitle: "User experience control",
        tone: "provider",
        items: ["Spring AI OpenAI", "Retention offer preview", "Allowlisted component plan"],
      },
    ],
    developer: {
      sourcePath: "examples/real-apps/behavior-churn-signals",
      dockerfilePath: "examples/real-apps/behavior-churn-signals/Dockerfile",
      healthEndpoint: "GET /api/behavior-demo/health",
      primaryEndpoints: [
        "POST /api/behavior-demo/sessions",
        "GET /api/behavior-demo/dashboard",
        "POST /api/behavior-demo/scenarios/{userId}/analyze",
        "POST /api/behavior-demo/scenarios/{userId}/signals",
        "POST /api/behavior-demo/scenarios/{userId}/positive-recovery",
        "POST /api/behavior-demo/scenarios/{userId}/agentic-ui",
        "POST /api/behavior-demo/scenarios/{userId}/retention-offer",
      ],
      localRun: [
        "mvn -pl examples/real-apps/behavior-churn-signals spring-boot:run",
        "Run with OpenAI variables for real LLM-generated insights.",
        "Use /api/behavior-demo/sessions to clone isolated demo users per browser session.",
      ],
      envVars: [
        "PORT",
        "OPENAI_ENABLED",
        "OPENAI_API_KEY",
        "OPENAI_MODEL",
        "CORS_ALLOWED_ORIGINS",
      ],
      codeHotspots: [
        "web/BehaviorDemoController.java",
        "service/BehaviorDemoScenarioService.java",
        "spi/DbExternalEventProvider.java",
        "service/AgenticUiComposerService.java",
        "service/RetentionStudioService.java",
        "ai/BehaviorLocalLlmProvider.java",
      ],
    },
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
      "A tenant-boundary proof that combines AI Fabric metadata-filtered vector retrieval, role-aware catalog visibility, guarded actions, session-isolated mutation, and tenant deletion evidence.",
    diagram: [
      {
        title: "Tenant Guard UI",
        subtitle: "Boundary and RAG proof",
        tone: "ui",
        items: ["AI Fabric indexed retrieval", "Tenant search comparison", "Guarded write and deletion evidence"],
      },
      {
        title: "Demo API",
        subtitle: "Spring Boot app",
        tone: "api",
        items: ["/api/tenant-guard-demo/query", "/api/tenant-guard-demo/index/proof", "/api/tenant-guard-demo/actions/execute"],
      },
      {
        title: "AI Fabric runtime",
        subtitle: "Search and guardrails",
        tone: "framework",
        items: ["AICoreService.performSearch", "tenant/session metadata filters", "app-side fail-closed verification"],
      },
      {
        title: "RAG and indexing",
        subtitle: "Tenant document evidence",
        tone: "rag",
        items: ["KnowledgeDocument rows", "tenantId visibility", "visibleToUser metadata"],
      },
      {
        title: "Provider and cleanup",
        subtitle: "Lucene vector index",
        tone: "provider",
        items: ["metadata-filtered Lucene search", "session-scoped vectors", "delete removes document and vector evidence"],
      },
    ],
    developer: {
      sourcePath: "examples/real-apps/tenant-knowledge-portal",
      dockerfilePath: "examples/real-apps/tenant-knowledge-portal/Dockerfile",
      healthEndpoint: "GET /api/demo/health",
      primaryEndpoints: [
        "GET /api/demo/health",
        "GET /api/tenant-guard-demo/dashboard",
        "POST /api/tenant-guard-demo/reset",
        "POST /api/tenant-guard-demo/query",
        "POST /api/tenant-guard-demo/index/seed",
        "GET /api/tenant-guard-demo/index/proof",
        "GET /api/tenant-guard-demo/compare",
        "POST /api/tenant-guard-demo/actions/execute",
        "POST /api/tenant-guard-demo/tenants/delete",
        "GET /api/tenant-knowledge/search",
        "GET /api/tenant-knowledge/catalog",
      ],
      localRun: [
        "mvn -pl examples/real-apps/tenant-knowledge-portal spring-boot:run",
        "Use /query and /index/proof to prove AI Fabric metadata-filtered retrieval.",
        "Pass sessionId to isolate browser mutations while testing write/delete paths.",
        "Use the smoke provider locally, or OpenAI-compatible provider settings when testing live embeddings.",
      ],
      envVars: ["PORT", "CORS_ALLOWED_ORIGINS", "AI_LLM_PROVIDER", "AI_EMBEDDING_PROVIDER", "AI_VECTOR_DB_TYPE", "VECTOR_INDEX_PATH"],
      codeHotspots: [
        "web/TenantGuardDemoController.java",
        "web/TenantKnowledgeController.java",
        "service/TenantKnowledgeService.java",
        "src/main/resources/application.yml",
      ],
    },
    dependencies: [
      "Spring Boot Web, Actuator, and Lombok.",
      "smoke-support for shared build metadata.",
    ],
    modules: ["ai-fabric-starter", "ai-fabric-governance", "ai-fabric-vector-lucene"],
    aiSurface: [
      "Explicit KnowledgeDocument records are indexed into AI Fabric vector storage with tenantId, sessionId, visibility, and visibleToUser metadata.",
      "AI Fabric semantic search runs with exact metadata filters before the app performs a second fail-closed boundary check.",
      "ActionAccessMode models read/write access so role and confirmation decisions are explicit.",
      "BoundaryProof is produced by the backend so the UI does not infer tenant policy outcomes.",
    ],
    providers: [
      "Smoke/local provider ids through configuration for no-key local runs.",
      "Lucene vector provider by default with provider diagnostics exposed in /index/proof.",
      "Browser-session scoped document maps and vector metadata prevent one visitor's delete action from changing another visitor's proof state.",
      "Tenant deletion removes matching document rows and their indexed vector entities.",
    ],
    flow: [
      "The UI loads /api/demo/health and /api/tenant-guard-demo/dashboard?sessionId=... for deployed proof state.",
      "/index/seed stores the session's documents as tenant-document vectors with sessionId, tenantId, visibility, and visibleToUser metadata.",
      "/query builds an AI Fabric search request with session and tenant filters, then verifies returned evidence before displaying it.",
      "/compare runs the same query as tenant A, tenant B, and platform admin.",
      "/actions/execute validates target tenant, role, access mode, and confirmation.",
      "/tenants/delete deletes only the requested tenant documents and vector ids, then returns remaining index proof.",
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
