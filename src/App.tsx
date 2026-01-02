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
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </PageTracker>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
