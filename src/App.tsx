import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { MaxModeProvider } from "@/contexts/MaxModeContext";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Documentation from "./pages/Documentation";
import Demos from "./pages/Demos";
import Consultation from "./pages/Consultation";
import Webinars from "./pages/Webinars";
import CourseRoutes from "./pages/course/CourseRoutes";
import BootcampRoutes from "./pages/bootcamps/BootcampRoutes";
import AIFabricAccountResolver from "./pages/demos/AIFabricAccountResolver";
import AIFabricAgenticUI from "./pages/demos/AIFabricAgenticUI";
import AIFabricBehaviorSignals from "./pages/demos/AIFabricBehaviorSignals";
import AIFabricPrivacyShield from "./pages/demos/AIFabricPrivacyShield";
import AIFabricTenantGuard from "./pages/demos/AIFabricTenantGuard";
import DemoAboutPage from "./pages/demos/DemoAboutPage";
import AIFabricFramework from "./pages/demos/AIFabricFramework";
import { demoBackendArchitectures } from "./pages/demos/components/demoBackendArchitectures";
import DemoVideoIntro from "./pages/demos/components/DemoVideoIntro";
import { demoVideoCatalog } from "./pages/demos/components/demoVideoCatalog";
import MaxAIMode from "./pages/MaxAIMode";
import ProductDetails from "./pages/ProductDetails";
import {
  AI_SHOPPING_EXPERIENCE_ABOUT_ROUTE,
  AI_SHOPPING_EXPERIENCE_ROUTE,
  LEGACY_AI_FABRIC_FRAMEWORK_ABOUT_ROUTE,
  LEGACY_AI_FABRIC_FRAMEWORK_ROUTE,
} from "./pages/demos/AIFabricFramework/routes";
import MarkdownGuidePage, { MarkdownGuideId } from "./pages/docs/MarkdownGuidePage";
import AccessControlMechanicsFull from "./pages/docs/AccessControlMechanicsFull";
import AccessControlMechanicsStory from "./pages/docs/AccessControlMechanicsStory";
import AccessControlMechanicsStoryV2 from "./pages/docs/AccessControlMechanicsStoryV2";
import AccessPolicyFull from "./pages/docs/AccessPolicyFull";
import AccessPolicyStory from "./pages/docs/AccessPolicyStory";
import AccessPolicyStoryV2 from "./pages/docs/AccessPolicyStoryV2";
import AIAnnotationsArchitectStory from "./pages/docs/AIAnnotationsArchitectStory";
import AIAnnotationsDeveloperGuideStory from "./pages/docs/AIAnnotationsDeveloperGuideStory";
import AIAnnotationsEcommerceStory from "./pages/docs/AIAnnotationsEcommerceStory";
import AIAnnotationsEnterpriseKnowledgeStory from "./pages/docs/AIAnnotationsEnterpriseKnowledgeStory";
import AIAnnotationsKillingBoilerplateStory from "./pages/docs/AIAnnotationsKillingBoilerplateStory";
import AIAnnotationsSemanticSearchStory from "./pages/docs/AIAnnotationsSemanticSearchStory";
import AuditCapabilitiesFull from "./pages/docs/AuditCapabilitiesFull";
import AuditCapabilitiesStory from "./pages/docs/AuditCapabilitiesStory";
import AuditCapabilitiesStoryV2 from "./pages/docs/AuditCapabilitiesStoryV2";
import BehaviorFull from "./pages/docs/BehaviorFull";
import BehaviorStory from "./pages/docs/BehaviorStory";
import BehaviorStoryV2 from "./pages/docs/BehaviorStoryV2";
import CleanupCapabilitiesFull from "./pages/docs/CleanupCapabilitiesFull";
import CleanupCapabilitiesStory from "./pages/docs/CleanupCapabilitiesStory";
import CleanupCapabilitiesStoryV2 from "./pages/docs/CleanupCapabilitiesStoryV2";
import CoreFull from "./pages/docs/CoreFull";
import CoreModules from "./pages/docs/CoreModules";
import CoreStory from "./pages/docs/CoreStory";
import CoreStoryV2 from "./pages/docs/CoreStoryV2";
import CustomStorageIndexingStory from "./pages/docs/CustomStorageIndexingStory";
import ECommerceProductDiscoveryStory from "./pages/docs/ECommerceProductDiscoveryStory";
import FinancialFraudDetectionStory from "./pages/docs/FinancialFraudDetectionStory";
import IndexingStrategiesFull from "./pages/docs/IndexingStrategiesFull";
import IndexingStory from "./pages/docs/IndexingStory";
import IndexingStoryV2 from "./pages/docs/IndexingStoryV2";
import IntentFull from "./pages/docs/IntentFull";
import IntentStory from "./pages/docs/IntentStory";
import IntentStoryV2 from "./pages/docs/IntentStoryV2";
import LawFirmDocumentStory from "./pages/docs/LawFirmDocumentStory";
import MigrationFull from "./pages/docs/MigrationFull";
import MigrationStory from "./pages/docs/MigrationStory";
import MigrationStoryV2 from "./pages/docs/MigrationStoryV2";
import ONNXFallbackStory from "./pages/docs/ONNXFallbackStory";
import ONNXProviderFull from "./pages/docs/ONNXProviderFull";
import ONNXProviderStory from "./pages/docs/ONNXProviderStory";
import ONNXProviderStoryV2 from "./pages/docs/ONNXProviderStoryV2";
import OpenAIProviderFull from "./pages/docs/OpenAIProviderFull";
import OpenAIProviderStory from "./pages/docs/OpenAIProviderStory";
import OpenAIProviderStoryV2 from "./pages/docs/OpenAIProviderStoryV2";
import OrchestratorStory from "./pages/docs/OrchestratorStory";
import OrchestratorStoryFull from "./pages/docs/OrchestratorStoryFull";
import OrchestratorStoryV2 from "./pages/docs/OrchestratorStoryV2";
import PIIDetectionEdgeStory from "./pages/docs/PIIDetectionEdgeStory";
import PIIDetectionFull from "./pages/docs/PIIDetectionFull";
import PIIDetectionStory from "./pages/docs/PIIDetectionStory";
import PIIDetectionStoryV1 from "./pages/docs/PIIDetectionStoryV1";
import PIIDetectionStoryV2 from "./pages/docs/PIIDetectionStoryV2";
import RagFull from "./pages/docs/RagFull";
import RagStory from "./pages/docs/RagStory";
import RagStoryV2 from "./pages/docs/RagStoryV2";
import RagStoryV3 from "./pages/docs/RagStoryV3";
import RealAPIStories from "./pages/docs/RealAPIStories";
import RealAIEmbeddingStory from "./pages/docs/RealAIEmbeddingStory";
import RelationshipQueryFull from "./pages/docs/RelationshipQueryFull";
import RelationshipQueryIntelligenceFull from "./pages/docs/RelationshipQueryIntelligenceFull";
import RelationshipQueryIntelligenceStory from "./pages/docs/RelationshipQueryIntelligenceStory";
import RelationshipQueryIntelligenceStoryV2 from "./pages/docs/RelationshipQueryIntelligenceStoryV2";
import RelationshipQueryStory from "./pages/docs/RelationshipQueryStory";
import RelationshipQueryStoryV2 from "./pages/docs/RelationshipQueryStoryV2";
import ReviewedStoryPage from "./pages/docs/ReviewedStoryPage";
import RetentionCapabilitiesFull from "./pages/docs/RetentionCapabilitiesFull";
import RetentionCapabilitiesStory from "./pages/docs/RetentionCapabilitiesStory";
import RetentionCapabilitiesStoryV2 from "./pages/docs/RetentionCapabilitiesStoryV2";
import SmartSuggestionsStory from "./pages/docs/SmartSuggestionsStory";
import StorageFull from "./pages/docs/StorageFull";
import StorageStory from "./pages/docs/StorageStory";
import StorageStoryV2 from "./pages/docs/StorageStoryV2";
import UserStories from "./pages/docs/UserStories";
import VectorLifecycleStory from "./pages/docs/VectorLifecycleStory";
import { usePageTracking } from "./hooks/usePageTracking";
import { reviewedStories } from "./lib/reviewedStoryCatalog";

const queryClient = new QueryClient();

const markdownGuideRoutes: Array<{ path: string; docId: MarkdownGuideId }> = [
  { path: "/docs/getting-started", docId: "getting-started" },
  { path: "/docs/start-here", docId: "start-here" },
  { path: "/docs/choose-your-path", docId: "choose-your-path" },
  { path: "/docs/installation", docId: "installation" },
  { path: "/docs/architecture", docId: "architecture" },
  { path: "/docs/modules", docId: "modules" },
  { path: "/docs/first-semantic-search", docId: "first-semantic-search" },
  { path: "/docs/first-rag-chat", docId: "first-rag-chat" },
  { path: "/docs/first-governed-action", docId: "first-governed-action" },
  { path: "/docs/chat-session-memory", docId: "chat-session-memory" },
  { path: "/docs/providers/openai", docId: "real-provider-openai" },
  { path: "/docs/providers/onnx", docId: "local-onnx-embeddings" },
  { path: "/docs/vector/lucene", docId: "vector-storage-lucene" },
  { path: "/docs/security", docId: "security-access-policy" },
  { path: "/docs/security/access-policy", docId: "security-access-policy" },
  { path: "/docs/testing", docId: "testing-verification" },
  { path: "/docs/testing-verification", docId: "testing-verification" },
  { path: "/docs/live-demos", docId: "live-demos" },
  { path: "/docs/real-apps-map", docId: "real-apps-map" },
  { path: "/docs/production-checklist", docId: "production-checklist" },
  { path: "/docs/contributing", docId: "contributing" },
  { path: "/docs/roadmap", docId: "roadmap" },
  { path: "/docs/llm-context", docId: "llm-context" },
  { path: "/docs/llm-context/routing", docId: "llm-context-routing" },
  { path: "/docs/llm-context/opportunity-scanner", docId: "llm-opportunity-scanner" },
  { path: "/docs/llm-context/rules", docId: "llm-context-rules" },
  { path: "/docs/llm-context/capability-map", docId: "llm-capability-map" },
  { path: "/docs/llm-context/module-decision-tree", docId: "llm-module-decision-tree" },
  { path: "/docs/llm-context/common-recipes", docId: "llm-common-recipes" },
  { path: "/docs/llm-context/troubleshooting", docId: "llm-troubleshooting" },
  { path: "/docs/llm-context/real-app-reference", docId: "llm-real-app-reference" },
];

const retiredDemoRoutes = [
  "/demos/smart-faq-assistant",
  "/demos/document-intelligence-hub",
  "/demos/product-discovery-engine",
  "/demos/code-documentation-search",
  "/demos/meeting-notes-analyzer",
];

const richStoryRoutes = [
  { path: "/docs/orchestrator_story", element: <OrchestratorStory /> },
  { path: "/docs/orchestrator_story_v2", element: <OrchestratorStoryV2 /> },
  { path: "/docs/guides/orchestrator", element: <OrchestratorStoryFull /> },
  { path: "/docs/pii_detection", element: <PIIDetectionStory /> },
  { path: "/docs/indexing_story", element: <IndexingStory /> },
  { path: "/docs/indexing_story_v2", element: <IndexingStoryV2 /> },
  { path: "/docs/custom_storage_indexing", element: <CustomStorageIndexingStory /> },
  { path: "/docs/guides/indexing", element: <IndexingStrategiesFull /> },
  { path: "/docs/migration_story", element: <MigrationStory /> },
  { path: "/docs/migration_story_v2", element: <MigrationStoryV2 /> },
  { path: "/docs/guides/migration", element: <MigrationFull /> },
  { path: "/docs/storage_story", element: <StorageStory /> },
  { path: "/docs/storage_story_v2", element: <StorageStoryV2 /> },
  { path: "/docs/guides/storage", element: <StorageFull /> },
  { path: "/docs/rag_story", element: <RagStory /> },
  { path: "/docs/rag_story_v2", element: <RagStoryV2 /> },
  { path: "/docs/rag_story_v3", element: <RagStoryV3 /> },
  { path: "/docs/guides/rag", element: <RagFull /> },
  { path: "/docs/behavior_story", element: <BehaviorStory /> },
  { path: "/docs/behavior_story_v2", element: <BehaviorStoryV2 /> },
  { path: "/docs/behavior-signals-story", element: <BehaviorStoryV2 /> },
  { path: "/docs/guides/behavior", element: <BehaviorFull /> },
  { path: "/docs/modules/core", element: <CoreStory /> },
  { path: "/docs/core_story_v2", element: <CoreStoryV2 /> },
  { path: "/docs/core-modules", element: <CoreModules /> },
  { path: "/docs/guides/core", element: <CoreFull /> },
  { path: "/docs/features/query", element: <RelationshipQueryStory /> },
  { path: "/docs/relationship_query_story_v2", element: <RelationshipQueryStoryV2 /> },
  { path: "/docs/guides/query", element: <RelationshipQueryFull /> },
  { path: "/docs/relationship_query_intelligence_story", element: <RelationshipQueryIntelligenceStory /> },
  { path: "/docs/relationship_query_intelligence_v2", element: <RelationshipQueryIntelligenceStoryV2 /> },
  { path: "/docs/guides/relationship_query_intelligence", element: <RelationshipQueryIntelligenceFull /> },
  { path: "/docs/intent_story", element: <IntentStory /> },
  { path: "/docs/intent_story_v2", element: <IntentStoryV2 /> },
  { path: "/docs/governed_actions_story", element: <IntentStoryV2 /> },
  { path: "/docs/guides/intent", element: <IntentFull /> },
  { path: "/docs/access_policy_story", element: <AccessPolicyStory /> },
  { path: "/docs/access_policy_story_v2", element: <AccessPolicyStoryV2 /> },
  { path: "/docs/guides/access_policy", element: <AccessPolicyFull /> },
  { path: "/docs/access_policy_full", element: <AccessPolicyFull /> },
  { path: "/docs/access_control_mechanics_story", element: <AccessControlMechanicsStory /> },
  { path: "/docs/access_control_mechanics_v2", element: <AccessControlMechanicsStoryV2 /> },
  { path: "/docs/guides/access_control_mechanics", element: <AccessControlMechanicsFull /> },
  { path: "/docs/pii_detection_story_v1", element: <PIIDetectionStoryV1 /> },
  { path: "/docs/pii_detection_story_v2", element: <PIIDetectionStoryV2 /> },
  { path: "/docs/guides/pii_detection", element: <PIIDetectionFull /> },
  { path: "/docs/pii_detection_full", element: <PIIDetectionFull /> },
  { path: "/docs/openai_provider_story", element: <OpenAIProviderStory /> },
  { path: "/docs/openai_provider_story_v2", element: <OpenAIProviderStoryV2 /> },
  { path: "/docs/guides/openai_provider", element: <OpenAIProviderFull /> },
  { path: "/docs/openai_provider_full", element: <OpenAIProviderFull /> },
  { path: "/docs/onnx_provider_story", element: <ONNXProviderStory /> },
  { path: "/docs/onnx_provider_story_v2", element: <ONNXProviderStoryV2 /> },
  { path: "/docs/guides/onnx_provider", element: <ONNXProviderFull /> },
  { path: "/docs/onnx_provider_full", element: <ONNXProviderFull /> },
  { path: "/docs/onnx-fallback-story", element: <ONNXFallbackStory /> },
  { path: "/docs/audit_capabilities_story", element: <AuditCapabilitiesStory /> },
  { path: "/docs/audit_capabilities_story_v2", element: <AuditCapabilitiesStoryV2 /> },
  { path: "/docs/guides/audit_capabilities", element: <AuditCapabilitiesFull /> },
  { path: "/docs/audit_capabilities_full", element: <AuditCapabilitiesFull /> },
  { path: "/docs/cleanup_capabilities_story", element: <CleanupCapabilitiesStory /> },
  { path: "/docs/cleanup_capabilities_story_v2", element: <CleanupCapabilitiesStoryV2 /> },
  { path: "/docs/guides/cleanup_capabilities", element: <CleanupCapabilitiesFull /> },
  { path: "/docs/cleanup_capabilities_full", element: <CleanupCapabilitiesFull /> },
  { path: "/docs/retention_capabilities_story", element: <RetentionCapabilitiesStory /> },
  { path: "/docs/retention_capabilities_story_v2", element: <RetentionCapabilitiesStoryV2 /> },
  { path: "/docs/guides/retention_capabilities", element: <RetentionCapabilitiesFull /> },
  { path: "/docs/retention_capabilities_full", element: <RetentionCapabilitiesFull /> },
  { path: "/docs/ecommerce-product-discovery-story", element: <ECommerceProductDiscoveryStory /> },
  { path: "/docs/financial-fraud-detection-story", element: <FinancialFraudDetectionStory /> },
  { path: "/docs/law-firm-document-story", element: <LawFirmDocumentStory /> },
  { path: "/docs/pii-detection-edge-story", element: <PIIDetectionEdgeStory /> },
  { path: "/docs/smart-suggestions-story", element: <SmartSuggestionsStory /> },
  { path: "/docs/real-ai-embedding-story", element: <RealAIEmbeddingStory /> },
  { path: "/docs/vector-lifecycle-story", element: <VectorLifecycleStory /> },
  { path: "/docs/ai-annotations-ecommerce", element: <AIAnnotationsEcommerceStory /> },
  { path: "/docs/ai-annotations-enterprise-knowledge", element: <AIAnnotationsEnterpriseKnowledgeStory /> },
  { path: "/docs/ai-annotations-developer-guide", element: <AIAnnotationsDeveloperGuideStory /> },
  { path: "/docs/ai-annotations-architect", element: <AIAnnotationsArchitectStory /> },
  { path: "/docs/ai-annotations-killing-boilerplate", element: <AIAnnotationsKillingBoilerplateStory /> },
  { path: "/docs/ai-annotations-semantic-search", element: <AIAnnotationsSemanticSearchStory /> },
];

const richStoryPaths = new Set(richStoryRoutes.map((route) => route.path));

const legacyStoryRedirectRoutes = [
  { path: "/docs/orchestrator_story", to: "/docs/architecture" },
  { path: "/docs/orchestrator_story_v2", to: "/docs/architecture" },
  { path: "/docs/guides/orchestrator", to: "/docs/architecture" },
  { path: "/docs/pii_detection", to: "/docs/pii_detection_story_v1" },
  { path: "/docs/pii_detection_story_v2", to: "/docs/pii_detection_story_v1" },
  { path: "/docs/pii_detection_full", to: "/docs/pii_detection_story_v1" },
  { path: "/docs/guides/pii_detection", to: "/docs/pii_detection_story_v1" },
  { path: "/docs/rag_story", to: "/docs/rag_story_v3" },
  { path: "/docs/rag_story_v2", to: "/docs/rag_story_v3" },
  { path: "/docs/behavior_story", to: "/docs/behavior-signals-story" },
  { path: "/docs/behavior_story_v2", to: "/docs/behavior-signals-story" },
  { path: "/docs/guides/behavior", to: "/docs/behavior-signals-story" },
  { path: "/docs/indexing_story_v2", to: "/docs/indexing_story" },
  { path: "/docs/guides/indexing", to: "/docs/indexing_story" },
  { path: "/docs/custom_storage_indexing", to: "/docs/first-semantic-search" },
  { path: "/docs/storage_story", to: "/docs/first-semantic-search" },
  { path: "/docs/storage_story_v2", to: "/docs/first-semantic-search" },
  { path: "/docs/guides/storage", to: "/docs/first-semantic-search" },
  { path: "/docs/intent_story", to: "/docs/governed_actions_story" },
  { path: "/docs/intent_story_v2", to: "/docs/governed_actions_story" },
  { path: "/docs/guides/intent", to: "/docs/governed_actions_story" },
  { path: "/docs/migration_story", to: "/docs/indexing_story" },
  { path: "/docs/migration_story_v2", to: "/docs/indexing_story" },
  { path: "/docs/guides/migration", to: "/docs/indexing_story" },
  { path: "/docs/access_policy_story_v2", to: "/docs/access_policy_story" },
  { path: "/docs/guides/access_policy", to: "/docs/security/access-policy" },
  { path: "/docs/openai_provider_story_v2", to: "/docs/openai_provider_story" },
  { path: "/docs/openai_provider_full", to: "/docs/providers/openai" },
  { path: "/docs/guides/openai_provider", to: "/docs/providers/openai" },
  { path: "/docs/onnx_provider_story_v2", to: "/docs/onnx_provider_story" },
  { path: "/docs/onnx_provider_full", to: "/docs/providers/onnx" },
  { path: "/docs/guides/onnx_provider", to: "/docs/providers/onnx" },
  { path: "/docs/onnx-fallback-story", to: "/docs/onnx_provider_story" },
  { path: "/docs/real-ai-embedding-story", to: "/docs/first-semantic-search" },
  { path: "/docs/audit_capabilities_story", to: "/docs/production-checklist" },
  { path: "/docs/audit_capabilities_story_v2", to: "/docs/production-checklist" },
  { path: "/docs/audit_capabilities_full", to: "/docs/production-checklist" },
  { path: "/docs/guides/audit_capabilities", to: "/docs/production-checklist" },
  { path: "/docs/cleanup_capabilities_story", to: "/docs/production-checklist" },
  { path: "/docs/cleanup_capabilities_story_v2", to: "/docs/production-checklist" },
  { path: "/docs/cleanup_capabilities_full", to: "/docs/production-checklist" },
  { path: "/docs/guides/cleanup_capabilities", to: "/docs/production-checklist" },
  { path: "/docs/retention_capabilities_story", to: "/docs/production-checklist" },
  { path: "/docs/retention_capabilities_story_v2", to: "/docs/production-checklist" },
  { path: "/docs/retention_capabilities_full", to: "/docs/production-checklist" },
  { path: "/docs/guides/retention_capabilities", to: "/docs/production-checklist" },
  { path: "/docs/financial-fraud-detection-story", to: "/docs/real-api-stories" },
  { path: "/docs/law-firm-document-story", to: "/docs/real-api-stories" },
  { path: "/docs/pii-detection-edge-story", to: "/docs/privacy-shield-story" },
  { path: "/docs/smart-suggestions-story", to: "/docs/real-api-stories" },
  { path: "/docs/vector-lifecycle-story", to: "/docs/indexing_story" },
  { path: "/docs/features/query", to: "/docs/modules" },
  { path: "/docs/guides/query", to: "/docs/modules" },
  { path: "/docs/relationship_query_intelligence_story", to: "/docs/relationship_query_story_v2" },
  { path: "/docs/relationship_query_intelligence_v2", to: "/docs/relationship_query_story_v2" },
  { path: "/docs/guides/relationship_query_intelligence", to: "/docs/relationship_query_story_v2" },
  { path: "/docs/guides/rag", to: "/docs/first-rag-chat" },
  { path: "/docs/modules/core", to: "/docs/modules" },
  { path: "/docs/core_story_v2", to: "/docs/modules" },
  { path: "/docs/guides/core", to: "/docs/modules" },
  { path: "/docs/core-modules", to: "/docs/modules" },
  { path: "/docs/access_control_mechanics_story", to: "/docs/access_policy_story" },
  { path: "/docs/access_control_mechanics_v2", to: "/docs/access_policy_story" },
  { path: "/docs/guides/access_control_mechanics", to: "/docs/access_policy_story" },
  { path: "/docs/access_policy_full", to: "/docs/security/access-policy" },
  { path: "/docs/quickstart", to: "/docs/getting-started" },
  { path: "/docs/ai-annotations-ecommerce", to: "/docs/ecommerce-product-discovery-story" },
  { path: "/docs/ai-annotations-enterprise-knowledge", to: "/docs/rag_story_v3" },
  { path: "/docs/ai-annotations-developer-guide", to: "/docs/llm-context/opportunity-scanner" },
  { path: "/docs/ai-annotations-architect", to: "/docs/llm-context/opportunity-scanner" },
  { path: "/docs/ai-annotations-killing-boilerplate", to: "/docs/llm-context/opportunity-scanner" },
  { path: "/docs/ai-annotations-semantic-search", to: "/docs/first-semantic-search" },
];

const PageTracker = ({ children }: { children: React.ReactNode }) => {
  usePageTracking();
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <MaxModeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <PageTracker>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/landing-classic" element={<Navigate to="/" replace />} />
              <Route path="/landing2" element={<Navigate to="/" replace />} />

              <Route path="/demos" element={<Demos />} />
              <Route path="/consultation" element={<Consultation />} />
              <Route path="/webinars" element={<Webinars />} />
              <Route path="/course/*" element={<CourseRoutes />} />
              <Route path="/bootcamps/*" element={<BootcampRoutes />} />
              {retiredDemoRoutes.map((path) => (
                <Route key={path} path={path} element={<Navigate to="/demos" replace />} />
              ))}
              <Route
                path="/demos/ai-fabric-account-resolver/about"
                element={
                  <DemoAboutPage
                    architecture={demoBackendArchitectures.accountResolver}
                    demoLabel="AI Fabric Account Resolver"
                    demoPath="/demos/ai-fabric-account-resolver"
                  />
                }
              />
              <Route path="/demos/subscription-management-hub/about" element={<Navigate to="/demos/ai-fabric-account-resolver/about" replace />} />
              <Route
                path="/demos/ai-fabric-account-resolver"
                element={
                  <DemoVideoIntro config={demoVideoCatalog.accountResolver}>
                    <AIFabricAccountResolver />
                  </DemoVideoIntro>
                }
              />
              <Route
                path="/demos/subscription-management-hub"
                element={
                  <DemoVideoIntro config={demoVideoCatalog.accountResolver}>
                    <AIFabricAccountResolver />
                  </DemoVideoIntro>
                }
              />
              <Route path="/demos/ai-fabric-agentic-ui" element={<Navigate to="/demos/ai-fabric-behavior-signals/agentic-ui" replace />} />
              <Route path="/demos/ai-fabric-agentic-ui/about" element={<Navigate to="/demos/ai-fabric-behavior-signals/about" replace />} />
              <Route path="/demos/ai-fabric-behavior-signals/agentic-ui/about" element={<Navigate to="/demos/ai-fabric-behavior-signals/about" replace />} />
              <Route path="/demos/ai-fabric-behavior-signals/agentic-ui" element={<AIFabricAgenticUI />} />
              <Route
                path="/demos/ai-fabric-behavior-signals/about"
                element={
                  <DemoAboutPage
                    architecture={demoBackendArchitectures.behaviorSignals}
                    demoLabel="AI Fabric Behavior Signals"
                    demoPath="/demos/ai-fabric-behavior-signals"
                  />
                }
              />
              <Route
                path="/demos/ai-fabric-behavior-signals"
                element={
                  <DemoVideoIntro config={demoVideoCatalog.behaviorSignals}>
                    <AIFabricBehaviorSignals />
                  </DemoVideoIntro>
                }
              />
              <Route path="/demos/team-sentiment-tracker/about" element={<Navigate to="/demos/ai-fabric-behavior-signals/about" replace />} />
              <Route
                path="/demos/team-sentiment-tracker"
                element={
                  <DemoVideoIntro config={demoVideoCatalog.behaviorSignals}>
                    <AIFabricBehaviorSignals />
                  </DemoVideoIntro>
                }
              />
              <Route
                path="/demos/ai-fabric-privacy-shield/about"
                element={
                  <DemoAboutPage
                    architecture={demoBackendArchitectures.privacyShield}
                    demoLabel="AI Fabric Privacy Shield"
                    demoPath="/demos/ai-fabric-privacy-shield"
                  />
                }
              />
              <Route
                path="/demos/ai-fabric-privacy-shield"
                element={
                  <DemoVideoIntro config={demoVideoCatalog.privacyShield}>
                    <AIFabricPrivacyShield />
                  </DemoVideoIntro>
                }
              />
              <Route
                path="/demos/ai-fabric-tenant-guard/about"
                element={
                  <DemoAboutPage
                    architecture={demoBackendArchitectures.tenantGuard}
                    demoLabel="AI Fabric Tenant Guard"
                    demoPath="/demos/ai-fabric-tenant-guard"
                  />
                }
              />
              <Route
                path="/demos/ai-fabric-tenant-guard"
                element={
                  <DemoVideoIntro config={demoVideoCatalog.tenantGuard}>
                    <AIFabricTenantGuard />
                  </DemoVideoIntro>
                }
              />
              <Route
                path={AI_SHOPPING_EXPERIENCE_ABOUT_ROUTE}
                element={
                  <DemoAboutPage
                    architecture={demoBackendArchitectures.shopping}
                    demoLabel="AI Shopping Experience"
                    demoPath={AI_SHOPPING_EXPERIENCE_ROUTE}
                  />
                }
              />
              <Route
                path={AI_SHOPPING_EXPERIENCE_ROUTE}
                element={
                  <DemoVideoIntro config={demoVideoCatalog.shopping}>
                    <AIFabricFramework />
                  </DemoVideoIntro>
                }
              />
              <Route path={`${AI_SHOPPING_EXPERIENCE_ROUTE}/maxAI-Mode`} element={<AIFabricFramework />} />
              <Route path={`${AI_SHOPPING_EXPERIENCE_ROUTE}/product/:id`} element={<ProductDetails />} />
              <Route path={LEGACY_AI_FABRIC_FRAMEWORK_ABOUT_ROUTE} element={<Navigate to={AI_SHOPPING_EXPERIENCE_ABOUT_ROUTE} replace />} />
              <Route
                path={LEGACY_AI_FABRIC_FRAMEWORK_ROUTE}
                element={
                  <DemoVideoIntro config={demoVideoCatalog.shopping}>
                    <AIFabricFramework />
                  </DemoVideoIntro>
                }
              />
              <Route path={`${LEGACY_AI_FABRIC_FRAMEWORK_ROUTE}/maxAI-Mode`} element={<AIFabricFramework />} />
              <Route path={`${LEGACY_AI_FABRIC_FRAMEWORK_ROUTE}/product/:id`} element={<ProductDetails />} />
              <Route path="/maxAI" element={<MaxAIMode />} />

              <Route path="/docs" element={<Documentation />} />
              <Route path="/docs/user-stories" element={<UserStories />} />
              <Route path="/docs/real-api-stories" element={<RealAPIStories />} />
              {richStoryRoutes.map((route) => (
                <Route key={route.path} path={route.path} element={route.element} />
              ))}
              {reviewedStories.filter((story) => !richStoryPaths.has(story.href)).map((story) => (
                <Route
                  key={story.href}
                  path={story.href}
                  element={<ReviewedStoryPage storyId={story.id} />}
                />
              ))}
              {legacyStoryRedirectRoutes.filter((route) => !richStoryPaths.has(route.path)).map((route) => (
                <Route
                  key={route.path}
                  path={route.path}
                  element={<Navigate to={route.to} replace />}
                />
              ))}
              {markdownGuideRoutes.map((route) => (
                <Route
                  key={route.path}
                  path={route.path}
                  element={<MarkdownGuidePage docId={route.docId} />}
                />
              ))}
              <Route path="/docs/*" element={<Navigate to="/docs" replace />} />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </PageTracker>
        </BrowserRouter>
      </TooltipProvider>
    </MaxModeProvider>
  </QueryClientProvider>
);

export default App;
