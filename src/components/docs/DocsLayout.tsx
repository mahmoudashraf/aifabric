import { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";
import { Info } from "lucide-react";
import DocsSidebar from "./DocsSidebar";
import Navbar from "../Navbar";

interface DocsLayoutProps {
  children: ReactNode;
}

const legacyStoryGuideLinks: Record<string, { to: string; label: string }> = {
  "/docs/quickstart": { to: "/docs/start-here", label: "Open current start guide" },
  "/docs/user-stories": { to: "/docs/getting-started", label: "Open current guide index" },
  "/docs/real-api-stories": { to: "/docs/testing-verification", label: "Open current testing guide" },
  "/docs/orchestrator_story": { to: "/docs/start-here", label: "Open current framework guide" },
  "/docs/orchestrator_story_v2": { to: "/docs/start-here", label: "Open current framework guide" },
  "/docs/modules/core": { to: "/docs/installation", label: "Open current installation guide" },
  "/docs/core_story_v2": { to: "/docs/installation", label: "Open current installation guide" },
  "/docs/access_policy_story": { to: "/docs/security/access-policy", label: "Open current access guide" },
  "/docs/access_policy_story_v2": { to: "/docs/security/access-policy", label: "Open current access guide" },
  "/docs/access_control_mechanics_story": { to: "/docs/security/access-policy", label: "Open current access guide" },
  "/docs/access_control_mechanics_v2": { to: "/docs/security/access-policy", label: "Open current access guide" },
  "/docs/pii_detection": { to: "/docs/security/access-policy", label: "Open current security guide" },
  "/docs/pii_detection_story_v1": { to: "/docs/security/access-policy", label: "Open current security guide" },
  "/docs/pii_detection_story_v2": { to: "/docs/security/access-policy", label: "Open current security guide" },
  "/docs/pii-detection-edge-story": { to: "/docs/security/access-policy", label: "Open current security guide" },
  "/docs/openai_provider_story": { to: "/docs/providers/openai", label: "Open current OpenAI guide" },
  "/docs/openai_provider_story_v2": { to: "/docs/providers/openai", label: "Open current OpenAI guide" },
  "/docs/onnx_provider_story": { to: "/docs/providers/onnx", label: "Open current ONNX guide" },
  "/docs/onnx_provider_story_v2": { to: "/docs/providers/onnx", label: "Open current ONNX guide" },
  "/docs/onnx-fallback-story": { to: "/docs/providers/onnx", label: "Open current ONNX guide" },
  "/docs/rag_story": { to: "/docs/first-rag-chat", label: "Open current RAG guide" },
  "/docs/rag_story_v2": { to: "/docs/first-rag-chat", label: "Open current RAG guide" },
  "/docs/rag_story_v3": { to: "/docs/first-rag-chat", label: "Open current RAG guide" },
  "/docs/smart-suggestions-story": { to: "/docs/first-rag-chat", label: "Open current RAG guide" },
  "/docs/intent_story": { to: "/docs/first-governed-action", label: "Open current actions guide" },
  "/docs/intent_story_v2": { to: "/docs/first-governed-action", label: "Open current actions guide" },
  "/docs/ecommerce-product-discovery-story": { to: "/docs/first-semantic-search", label: "Open current semantic search guide" },
  "/docs/ai-annotations-semantic-search": { to: "/docs/first-semantic-search", label: "Open current semantic search guide" },
  "/docs/real-ai-embedding-story": { to: "/docs/first-semantic-search", label: "Open current embedding guide" },
  "/docs/indexing_story": { to: "/docs/first-semantic-search", label: "Open current indexing guide" },
  "/docs/indexing_story_v2": { to: "/docs/first-semantic-search", label: "Open current indexing guide" },
  "/docs/storage_story": { to: "/docs/vector/lucene", label: "Open current vector guide" },
  "/docs/storage_story_v2": { to: "/docs/vector/lucene", label: "Open current vector guide" },
  "/docs/vector-lifecycle-story": { to: "/docs/vector/lucene", label: "Open current vector guide" },
  "/docs/audit_capabilities_story": { to: "/docs/production-checklist", label: "Open current release checklist" },
  "/docs/audit_capabilities_story_v2": { to: "/docs/production-checklist", label: "Open current release checklist" },
  "/docs/cleanup_capabilities_story": { to: "/docs/production-checklist", label: "Open current release checklist" },
  "/docs/cleanup_capabilities_story_v2": { to: "/docs/production-checklist", label: "Open current release checklist" },
  "/docs/behavior_story": { to: "/docs/real-apps-map", label: "Open current real app map" },
  "/docs/behavior_story_v2": { to: "/docs/real-apps-map", label: "Open current real app map" },
  "/docs/financial-fraud-detection-story": { to: "/docs/real-apps-map", label: "Open current real app map" },
  "/docs/law-firm-document-story": { to: "/docs/real-apps-map", label: "Open current real app map" },
};

export const DocsLayout = ({ children }: DocsLayoutProps) => {
  const location = useLocation();
  const legacyGuide = legacyStoryGuideLinks[location.pathname];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20">
        <DocsSidebar />
        <main className="md:pl-72">
          {legacyGuide && (
            <div className="relative z-50 border-b border-blue-200/70 bg-blue-50/90 px-6 py-3 dark:border-blue-900/50 dark:bg-blue-950/20">
              <div className="mx-auto flex max-w-6xl items-center gap-3 text-sm text-blue-950 dark:text-blue-100">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/60 dark:text-blue-200">
                  <Info className="h-4 w-4" />
                </span>
                <p className="leading-6">
                  <span className="font-semibold">Legacy story companion.</span>{" "}
                  Use the current AI Fabric 0.3.2 implementation guide for exact setup.{" "}
                  <Link
                    to={legacyGuide.to}
                    className="font-semibold text-blue-700 underline underline-offset-4 transition-colors hover:text-blue-950 dark:text-blue-200 dark:hover:text-white"
                  >
                    {legacyGuide.label}
                  </Link>
                </p>
              </div>
            </div>
          )}
          {children}
        </main>
      </div>
    </div>
  );
};

export default DocsLayout;
