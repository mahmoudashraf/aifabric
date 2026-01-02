import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Documentation from "./pages/Documentation";
import OrchestratorStory from "./pages/docs/OrchestratorStory";
import OrchestratorStoryV2 from "./pages/docs/OrchestratorStoryV2";
import OrchestratorStoryFull from "./pages/docs/OrchestratorStoryFull";
import IndexingStory from "./pages/docs/IndexingStory";
import IndexingStoryV2 from "./pages/docs/IndexingStoryV2";
import IndexingStrategiesFull from "./pages/docs/IndexingStrategiesFull";
import MigrationStory from "./pages/docs/MigrationStory";
import MigrationStoryV2 from "./pages/docs/MigrationStoryV2";
import MigrationFull from "./pages/docs/MigrationFull";
import StorageStory from "./pages/docs/StorageStory";
import StorageStoryV2 from "./pages/docs/StorageStoryV2";
import StorageFull from "./pages/docs/StorageFull";
import RagStory from "./pages/docs/RagStory";
import RagStoryV2 from "./pages/docs/RagStoryV2";
import RagFull from "./pages/docs/RagFull";
import BehaviorStory from "./pages/docs/BehaviorStory";
import BehaviorStoryV2 from "./pages/docs/BehaviorStoryV2";
import BehaviorFull from "./pages/docs/BehaviorFull";
import CoreStory from "./pages/docs/CoreStory";
import CoreStoryV2 from "./pages/docs/CoreStoryV2";
import CoreFull from "./pages/docs/CoreFull";
import RelationshipQueryStory from "./pages/docs/RelationshipQueryStory";
import RelationshipQueryFull from "./pages/docs/RelationshipQueryFull";
import IntentStory from "./pages/docs/IntentStory";
import IntentStoryV2 from "./pages/docs/IntentStoryV2";
import IntentFull from "./pages/docs/IntentFull";
import QuickStart from "./pages/docs/QuickStart";
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
            <Route path="/docs" element={<Documentation />} />
            <Route path="/docs/orchestrator_story" element={<OrchestratorStory />} />
            <Route path="/docs/orchestrator_story_v2" element={<OrchestratorStoryV2 />} />
            <Route path="/docs/guides/orchestrator" element={<OrchestratorStoryFull />} />
            <Route path="/docs/indexing_story" element={<IndexingStory />} />
            <Route path="/docs/indexing_story_v2" element={<IndexingStoryV2 />} />
            <Route path="/docs/guides/indexing" element={<IndexingStrategiesFull />} />
            <Route path="/docs/migration_story" element={<MigrationStory />} />
            <Route path="/docs/migration_story_v2" element={<MigrationStoryV2 />} />
            <Route path="/docs/guides/migration" element={<MigrationFull />} />
            <Route path="/docs/storage_story" element={<StorageStory />} />
            <Route path="/docs/storage_story_v2" element={<StorageStoryV2 />} />
            <Route path="/docs/guides/storage" element={<StorageFull />} />
            <Route path="/docs/rag_story" element={<RagStory />} />
            <Route path="/docs/rag_story_v2" element={<RagStoryV2 />} />
            <Route path="/docs/guides/rag" element={<RagFull />} />
            <Route path="/docs/behavior_story" element={<BehaviorStory />} />
            <Route path="/docs/behavior_story_v2" element={<BehaviorStoryV2 />} />
            <Route path="/docs/guides/behavior" element={<BehaviorFull />} />
            <Route path="/docs/modules/core" element={<CoreStory />} />
            <Route path="/docs/core_story_v2" element={<CoreStoryV2 />} />
            <Route path="/docs/guides/core" element={<CoreFull />} />
            <Route path="/docs/features/query" element={<RelationshipQueryStory />} />
            <Route path="/docs/guides/query" element={<RelationshipQueryFull />} />
            <Route path="/docs/intent_story" element={<IntentStory />} />
            <Route path="/docs/intent_story_v2" element={<IntentStoryV2 />} />
            <Route path="/docs/guides/intent" element={<IntentFull />} />
            <Route path="/docs/quickstart" element={<QuickStart />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </PageTracker>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
