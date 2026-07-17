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
import AIFabricAccountResolver from "./pages/demos/AIFabricAccountResolver";
import AIFabricAgenticUI from "./pages/demos/AIFabricAgenticUI";
import AIFabricBehaviorSignals from "./pages/demos/AIFabricBehaviorSignals";
import AIFabricPrivacyShield from "./pages/demos/AIFabricPrivacyShield";
import AIFabricTenantGuard from "./pages/demos/AIFabricTenantGuard";
import DemoAboutPage from "./pages/demos/DemoAboutPage";
import AIFabricFramework from "./pages/demos/AIFabricFramework";
import { demoBackendArchitectures } from "./pages/demos/components/demoBackendArchitectures";
import MaxAIMode from "./pages/MaxAIMode";
import ProductDetails from "./pages/ProductDetails";
import {
  AI_SHOPPING_EXPERIENCE_ABOUT_ROUTE,
  AI_SHOPPING_EXPERIENCE_ROUTE,
  LEGACY_AI_FABRIC_FRAMEWORK_ABOUT_ROUTE,
  LEGACY_AI_FABRIC_FRAMEWORK_ROUTE,
} from "./pages/demos/AIFabricFramework/routes";
import MarkdownGuidePage, { MarkdownGuideId } from "./pages/docs/MarkdownGuidePage";
import { usePageTracking } from "./hooks/usePageTracking";

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
              <Route path="/demos/ai-fabric-account-resolver" element={<AIFabricAccountResolver />} />
              <Route path="/demos/subscription-management-hub" element={<AIFabricAccountResolver />} />
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
              <Route path="/demos/ai-fabric-behavior-signals" element={<AIFabricBehaviorSignals />} />
              <Route path="/demos/team-sentiment-tracker/about" element={<Navigate to="/demos/ai-fabric-behavior-signals/about" replace />} />
              <Route path="/demos/team-sentiment-tracker" element={<AIFabricBehaviorSignals />} />
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
              <Route path="/demos/ai-fabric-privacy-shield" element={<AIFabricPrivacyShield />} />
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
              <Route path="/demos/ai-fabric-tenant-guard" element={<AIFabricTenantGuard />} />
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
              <Route path={AI_SHOPPING_EXPERIENCE_ROUTE} element={<AIFabricFramework />} />
              <Route path={`${AI_SHOPPING_EXPERIENCE_ROUTE}/maxAI-Mode`} element={<AIFabricFramework />} />
              <Route path={`${AI_SHOPPING_EXPERIENCE_ROUTE}/product/:id`} element={<ProductDetails />} />
              <Route path={LEGACY_AI_FABRIC_FRAMEWORK_ABOUT_ROUTE} element={<Navigate to={AI_SHOPPING_EXPERIENCE_ABOUT_ROUTE} replace />} />
              <Route path={LEGACY_AI_FABRIC_FRAMEWORK_ROUTE} element={<AIFabricFramework />} />
              <Route path={`${LEGACY_AI_FABRIC_FRAMEWORK_ROUTE}/maxAI-Mode`} element={<AIFabricFramework />} />
              <Route path={`${LEGACY_AI_FABRIC_FRAMEWORK_ROUTE}/product/:id`} element={<ProductDetails />} />
              <Route path="/maxAI" element={<MaxAIMode />} />

              <Route path="/docs" element={<Documentation />} />
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
