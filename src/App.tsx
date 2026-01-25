import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Landing2 from "./pages/Landing2";
import NotFound from "./pages/NotFound";
import Documentation from "./pages/Documentation";
import Demos from "./pages/Demos";
import SubscriptionManagementHub from "./pages/demos/SubscriptionManagementHub";
import SmartFAQAssistant from "./pages/demos/SmartFAQAssistant";
import DocumentIntelligenceHub from "./pages/demos/DocumentIntelligenceHub";
import ProductDiscoveryEngine from "./pages/demos/ProductDiscoveryEngine";
import TeamSentimentTracker from "./pages/demos/TeamSentimentTracker";
import CodeDocumentationSearch from "./pages/demos/CodeDocumentationSearch";
import MeetingNotesAnalyzer from "./pages/demos/MeetingNotesAnalyzer";
import AIFabricFramework from "./pages/demos/AIFabricFramework";
import MaxAIMode from "./pages/MaxAIMode";
import OrchestratorStory from "./pages/docs/OrchestratorStory";
import OrchestratorStoryV2 from "./pages/docs/OrchestratorStoryV2";
import PIIDetectionStory from "./pages/docs/PIIDetectionStory";
import OrchestratorStoryFull from "./pages/docs/OrchestratorStoryFull";
import IndexingStory from "./pages/docs/IndexingStory";
import IndexingStoryV2 from "./pages/docs/IndexingStoryV2";
import CustomStorageIndexingStory from "./pages/docs/CustomStorageIndexingStory";
import IndexingStrategiesFull from "./pages/docs/IndexingStrategiesFull";
import MigrationStory from "./pages/docs/MigrationStory";
import MigrationStoryV2 from "./pages/docs/MigrationStoryV2";
import MigrationFull from "./pages/docs/MigrationFull";
import StorageStory from "./pages/docs/StorageStory";
import StorageStoryV2 from "./pages/docs/StorageStoryV2";
import StorageFull from "./pages/docs/StorageFull";
import RagStory from "./pages/docs/RagStory";
import RagStoryV2 from "./pages/docs/RagStoryV2";
import RagStoryV3 from "./pages/docs/RagStoryV3";
import RagFull from "./pages/docs/RagFull";
import BehaviorStory from "./pages/docs/BehaviorStory";
import BehaviorStoryV2 from "./pages/docs/BehaviorStoryV2";
import BehaviorFull from "./pages/docs/BehaviorFull";
import CoreStory from "./pages/docs/CoreStory";
import CoreStoryV2 from "./pages/docs/CoreStoryV2";
import CoreFull from "./pages/docs/CoreFull";
import RelationshipQueryStory from "./pages/docs/RelationshipQueryStory";
import RelationshipQueryStoryV2 from "./pages/docs/RelationshipQueryStoryV2";
import RelationshipQueryFull from "./pages/docs/RelationshipQueryFull";
import RelationshipQueryIntelligenceStory from "./pages/docs/RelationshipQueryIntelligenceStory";
import RelationshipQueryIntelligenceStoryV2 from "./pages/docs/RelationshipQueryIntelligenceStoryV2";
import RelationshipQueryIntelligenceFull from "./pages/docs/RelationshipQueryIntelligenceFull";
import IntentStory from "./pages/docs/IntentStory";
import IntentStoryV2 from "./pages/docs/IntentStoryV2";
import IntentFull from "./pages/docs/IntentFull";
import AccessPolicyStory from "./pages/docs/AccessPolicyStory";
import AccessPolicyStoryV2 from "./pages/docs/AccessPolicyStoryV2";
import AccessPolicyFull from "./pages/docs/AccessPolicyFull";
import AccessControlMechanicsStory from "./pages/docs/AccessControlMechanicsStory";
import AccessControlMechanicsStoryV2 from "./pages/docs/AccessControlMechanicsStoryV2";
import AccessControlMechanicsFull from "./pages/docs/AccessControlMechanicsFull";
import PIIDetectionStoryV1 from "./pages/docs/PIIDetectionStoryV1";
import PIIDetectionStoryV2 from "./pages/docs/PIIDetectionStoryV2";
import PIIDetectionFull from "./pages/docs/PIIDetectionFull";
import OpenAIProviderStory from "./pages/docs/OpenAIProviderStory";
import OpenAIProviderStoryV2 from "./pages/docs/OpenAIProviderStoryV2";
import OpenAIProviderFull from "./pages/docs/OpenAIProviderFull";
import ONNXProviderStory from "./pages/docs/ONNXProviderStory";
import ONNXProviderStoryV2 from "./pages/docs/ONNXProviderStoryV2";
import ONNXProviderFull from "./pages/docs/ONNXProviderFull";
import AuditCapabilitiesStory from "./pages/docs/AuditCapabilitiesStory";
import AuditCapabilitiesStoryV2 from "./pages/docs/AuditCapabilitiesStoryV2";
import AuditCapabilitiesFull from "./pages/docs/AuditCapabilitiesFull";
import CleanupCapabilitiesStory from "./pages/docs/CleanupCapabilitiesStory";
import CleanupCapabilitiesStoryV2 from "./pages/docs/CleanupCapabilitiesStoryV2";
import CleanupCapabilitiesFull from "./pages/docs/CleanupCapabilitiesFull";
import RetentionCapabilitiesStory from "./pages/docs/RetentionCapabilitiesStory";
import RetentionCapabilitiesStoryV2 from "./pages/docs/RetentionCapabilitiesStoryV2";
import RetentionCapabilitiesFull from "./pages/docs/RetentionCapabilitiesFull";
import QuickStart from "./pages/docs/QuickStart";
import RealAPIStories from "./pages/docs/RealAPIStories";
import UserStories from "./pages/docs/UserStories";
import CoreModules from "./pages/docs/CoreModules";
import ECommerceProductDiscoveryStory from "./pages/docs/ECommerceProductDiscoveryStory";
import FinancialFraudDetectionStory from "./pages/docs/FinancialFraudDetectionStory";
import LawFirmDocumentStory from "./pages/docs/LawFirmDocumentStory";
import PIIDetectionEdgeStory from "./pages/docs/PIIDetectionEdgeStory";
import SmartSuggestionsStory from "./pages/docs/SmartSuggestionsStory";
import ONNXFallbackStory from "./pages/docs/ONNXFallbackStory";
import RealAIEmbeddingStory from "./pages/docs/RealAIEmbeddingStory";
import VectorLifecycleStory from "./pages/docs/VectorLifecycleStory";
import AIAnnotationsEcommerceStory from "./pages/docs/AIAnnotationsEcommerceStory";
import AIAnnotationsEnterpriseKnowledgeStory from "./pages/docs/AIAnnotationsEnterpriseKnowledgeStory";
import AIAnnotationsDeveloperGuideStory from "./pages/docs/AIAnnotationsDeveloperGuideStory";
import AIAnnotationsArchitectStory from "./pages/docs/AIAnnotationsArchitectStory";
import AIAnnotationsKillingBoilerplateStory from "./pages/docs/AIAnnotationsKillingBoilerplateStory";
import AIAnnotationsSemanticSearchStory from "./pages/docs/AIAnnotationsSemanticSearchStory";
import { usePageTracking } from "./hooks/usePageTracking";

const queryClient = new QueryClient();

const PageTracker = ({ children }: { children: React.ReactNode }) => {
  usePageTracking();
  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <PageTracker>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/landing2" element={<Landing2 />} />
            <Route path="/demos" element={<Demos />} />
            <Route path="/demos/subscription-management-hub" element={<SubscriptionManagementHub />} />
            <Route path="/demos/smart-faq-assistant" element={<SmartFAQAssistant />} />
            <Route path="/demos/document-intelligence-hub" element={<DocumentIntelligenceHub />} />
            <Route path="/demos/product-discovery-engine" element={<ProductDiscoveryEngine />} />
            <Route path="/demos/team-sentiment-tracker" element={<TeamSentimentTracker />} />
            <Route path="/demos/code-documentation-search" element={<CodeDocumentationSearch />} />
            <Route path="/demos/meeting-notes-analyzer" element={<MeetingNotesAnalyzer />} />
            <Route path="/demos/ai-fabric-framework" element={<AIFabricFramework />} />
            <Route path="/demos/ai-fabric-framework/maxAI-Mode" element={<AIFabricFramework />} />
            <Route path="/maxAI" element={<MaxAIMode />} />
            <Route path="/docs" element={<Documentation />} />
            <Route path="/docs/orchestrator_story" element={<OrchestratorStory />} />
            <Route path="/docs/orchestrator_story_v2" element={<OrchestratorStoryV2 />} />
            <Route path="/docs/pii_detection" element={<PIIDetectionStory />} />
            <Route path="/docs/guides/orchestrator" element={<OrchestratorStoryFull />} />
            <Route path="/docs/indexing_story" element={<IndexingStory />} />
            <Route path="/docs/indexing_story_v2" element={<IndexingStoryV2 />} />
            <Route path="/docs/custom_storage_indexing" element={<CustomStorageIndexingStory />} />
            <Route path="/docs/guides/indexing" element={<IndexingStrategiesFull />} />
            <Route path="/docs/migration_story" element={<MigrationStory />} />
            <Route path="/docs/migration_story_v2" element={<MigrationStoryV2 />} />
            <Route path="/docs/guides/migration" element={<MigrationFull />} />
            <Route path="/docs/storage_story" element={<StorageStory />} />
            <Route path="/docs/storage_story_v2" element={<StorageStoryV2 />} />
            <Route path="/docs/guides/storage" element={<StorageFull />} />
            <Route path="/docs/rag_story" element={<RagStory />} />
            <Route path="/docs/rag_story_v2" element={<RagStoryV2 />} />
            <Route path="/docs/rag_story_v3" element={<RagStoryV3 />} />
            <Route path="/docs/guides/rag" element={<RagFull />} />
            <Route path="/docs/behavior_story" element={<BehaviorStory />} />
            <Route path="/docs/behavior_story_v2" element={<BehaviorStoryV2 />} />
            <Route path="/docs/guides/behavior" element={<BehaviorFull />} />
            <Route path="/docs/modules/core" element={<CoreStory />} />
            <Route path="/docs/core_story_v2" element={<CoreStoryV2 />} />
            <Route path="/docs/guides/core" element={<CoreFull />} />
            <Route path="/docs/features/query" element={<RelationshipQueryStory />} />
            <Route path="/docs/relationship_query_story_v2" element={<RelationshipQueryStoryV2 />} />
            <Route path="/docs/guides/query" element={<RelationshipQueryFull />} />
            <Route path="/docs/relationship_query_intelligence_story" element={<RelationshipQueryIntelligenceStory />} />
            <Route path="/docs/relationship_query_intelligence_v2" element={<RelationshipQueryIntelligenceStoryV2 />} />
            <Route path="/docs/guides/relationship_query_intelligence" element={<RelationshipQueryIntelligenceFull />} />
            <Route path="/docs/intent_story" element={<IntentStory />} />
            <Route path="/docs/intent_story_v2" element={<IntentStoryV2 />} />
            <Route path="/docs/guides/intent" element={<IntentFull />} />
            <Route path="/docs/access_policy_story" element={<AccessPolicyStory />} />
            <Route path="/docs/access_policy_story_v2" element={<AccessPolicyStoryV2 />} />
            <Route path="/docs/guides/access_policy" element={<AccessPolicyFull />} />
            <Route path="/docs/access_policy_full" element={<AccessPolicyFull />} />
            <Route path="/docs/access_control_mechanics_story" element={<AccessControlMechanicsStory />} />
            <Route path="/docs/access_control_mechanics_v2" element={<AccessControlMechanicsStoryV2 />} />
            <Route path="/docs/guides/access_control_mechanics" element={<AccessControlMechanicsFull />} />
            <Route path="/docs/pii_detection_story_v1" element={<PIIDetectionStoryV1 />} />
            <Route path="/docs/pii_detection_story_v2" element={<PIIDetectionStoryV2 />} />
            <Route path="/docs/guides/pii_detection" element={<PIIDetectionFull />} />
            <Route path="/docs/pii_detection_full" element={<PIIDetectionFull />} />
            <Route path="/docs/openai_provider_story" element={<OpenAIProviderStory />} />
            <Route path="/docs/openai_provider_story_v2" element={<OpenAIProviderStoryV2 />} />
            <Route path="/docs/guides/openai_provider" element={<OpenAIProviderFull />} />
            <Route path="/docs/openai_provider_full" element={<OpenAIProviderFull />} />
            <Route path="/docs/onnx_provider_story" element={<ONNXProviderStory />} />
            <Route path="/docs/onnx_provider_story_v2" element={<ONNXProviderStoryV2 />} />
            <Route path="/docs/guides/onnx_provider" element={<ONNXProviderFull />} />
            <Route path="/docs/onnx_provider_full" element={<ONNXProviderFull />} />
            <Route path="/docs/audit_capabilities_story" element={<AuditCapabilitiesStory />} />
            <Route path="/docs/audit_capabilities_story_v2" element={<AuditCapabilitiesStoryV2 />} />
            <Route path="/docs/guides/audit_capabilities" element={<AuditCapabilitiesFull />} />
            <Route path="/docs/audit_capabilities_full" element={<AuditCapabilitiesFull />} />
            <Route path="/docs/cleanup_capabilities_story" element={<CleanupCapabilitiesStory />} />
            <Route path="/docs/cleanup_capabilities_story_v2" element={<CleanupCapabilitiesStoryV2 />} />
            <Route path="/docs/guides/cleanup_capabilities" element={<CleanupCapabilitiesFull />} />
            <Route path="/docs/cleanup_capabilities_full" element={<CleanupCapabilitiesFull />} />
            <Route path="/docs/retention_capabilities_story" element={<RetentionCapabilitiesStory />} />
            <Route path="/docs/retention_capabilities_story_v2" element={<RetentionCapabilitiesStoryV2 />} />
            <Route path="/docs/guides/retention_capabilities" element={<RetentionCapabilitiesFull />} />
            <Route path="/docs/retention_capabilities_full" element={<RetentionCapabilitiesFull />} />
            <Route path="/docs/quickstart" element={<QuickStart />} />
            <Route path="/docs/real-api-stories" element={<RealAPIStories />} />
            <Route path="/docs/user-stories" element={<UserStories />} />
            <Route path="/docs/core-modules" element={<CoreModules />} />
            <Route path="/docs/ecommerce-product-discovery-story" element={<ECommerceProductDiscoveryStory />} />
            <Route path="/docs/financial-fraud-detection-story" element={<FinancialFraudDetectionStory />} />
            <Route path="/docs/law-firm-document-story" element={<LawFirmDocumentStory />} />
            <Route path="/docs/pii-detection-edge-story" element={<PIIDetectionEdgeStory />} />
            <Route path="/docs/smart-suggestions-story" element={<SmartSuggestionsStory />} />
            <Route path="/docs/onnx-fallback-story" element={<ONNXFallbackStory />} />
            <Route path="/docs/real-ai-embedding-story" element={<RealAIEmbeddingStory />} />
            <Route path="/docs/vector-lifecycle-story" element={<VectorLifecycleStory />} />
            {/* AI Annotations Stories */}
            <Route path="/docs/ai-annotations-ecommerce" element={<AIAnnotationsEcommerceStory />} />
            <Route path="/docs/ai-annotations-enterprise-knowledge" element={<AIAnnotationsEnterpriseKnowledgeStory />} />
            <Route path="/docs/ai-annotations-developer-guide" element={<AIAnnotationsDeveloperGuideStory />} />
            <Route path="/docs/ai-annotations-architect" element={<AIAnnotationsArchitectStory />} />
            <Route path="/docs/ai-annotations-killing-boilerplate" element={<AIAnnotationsKillingBoilerplateStory />} />
            <Route path="/docs/ai-annotations-semantic-search" element={<AIAnnotationsSemanticSearchStory />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </PageTracker>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
