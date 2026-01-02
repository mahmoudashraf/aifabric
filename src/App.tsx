import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Documentation from "./pages/Documentation";
import OrchestratorStory from "./pages/docs/OrchestratorStory";
import OrchestratorStoryFull from "./pages/docs/OrchestratorStoryFull";
import IndexingStory from "./pages/docs/IndexingStory";
import IndexingStrategiesFull from "./pages/docs/IndexingStrategiesFull";
import MigrationStory from "./pages/docs/MigrationStory";
import MigrationFull from "./pages/docs/MigrationFull";
import StorageStory from "./pages/docs/StorageStory";
import StorageFull from "./pages/docs/StorageFull";
import RagStory from "./pages/docs/RagStory";
import RagFull from "./pages/docs/RagFull";
import BehaviorStory from "./pages/docs/BehaviorStory";
import BehaviorFull from "./pages/docs/BehaviorFull";
import CoreStory from "./pages/docs/CoreStory";
import CoreFull from "./pages/docs/CoreFull";
import RelationshipQueryStory from "./pages/docs/RelationshipQueryStory";
import RelationshipQueryFull from "./pages/docs/RelationshipQueryFull";
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
            <Route path="/docs/guides/orchestrator" element={<OrchestratorStoryFull />} />
            <Route path="/docs/indexing_story" element={<IndexingStory />} />
            <Route path="/docs/guides/indexing" element={<IndexingStrategiesFull />} />
            <Route path="/docs/migration_story" element={<MigrationStory />} />
            <Route path="/docs/guides/migration" element={<MigrationFull />} />
            <Route path="/docs/storage_story" element={<StorageStory />} />
            <Route path="/docs/guides/storage" element={<StorageFull />} />
            <Route path="/docs/rag_story" element={<RagStory />} />
            <Route path="/docs/guides/rag" element={<RagFull />} />
            <Route path="/docs/behavior_story" element={<BehaviorStory />} />
            <Route path="/docs/guides/behavior" element={<BehaviorFull />} />
            <Route path="/docs/modules/core" element={<CoreStory />} />
            <Route path="/docs/guides/core" element={<CoreFull />} />
            <Route path="/docs/features/query" element={<RelationshipQueryStory />} />
            <Route path="/docs/guides/query" element={<RelationshipQueryFull />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </PageTracker>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
