import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Highlight, themes } from "prism-react-renderer";
import { Check, Copy, ExternalLink, FileText } from "lucide-react";
import DocsLayout from "@/components/docs/DocsLayout";
import PageViewCounter from "@/components/PageViewCounter";
import gettingStartedIndex from "@/content/getting-started/README.md?raw";
import llmStartHere from "@/content/getting-started/00-llm-start-here.md?raw";
import chooseYourPath from "@/content/getting-started/01-choose-your-path.md?raw";
import installation from "@/content/getting-started/02-installation.md?raw";
import firstSemanticSearch from "@/content/getting-started/03-first-semantic-search.md?raw";
import firstRagChat from "@/content/getting-started/04-first-rag-chat.md?raw";
import firstGovernedAction from "@/content/getting-started/05-first-governed-action.md?raw";
import chatSessionMemory from "@/content/getting-started/06-chat-session-memory.md?raw";
import realProviderOpenai from "@/content/getting-started/07-real-provider-openai.md?raw";
import localOnnxEmbeddings from "@/content/getting-started/08-local-onnx-embeddings.md?raw";
import vectorStorageLucene from "@/content/getting-started/09-vector-storage-lucene.md?raw";
import securityAccessPolicy from "@/content/getting-started/10-security-access-policy.md?raw";
import testingVerification from "@/content/getting-started/11-testing-and-verification.md?raw";
import realAppsMap from "@/content/getting-started/12-real-apps-map.md?raw";
import productionChecklist from "@/content/getting-started/13-production-checklist.md?raw";
import architectureGuide from "@/content/public-docs/architecture.md?raw";
import modulesGuide from "@/content/public-docs/modules.md?raw";
import liveDemosGuide from "@/content/public-docs/live-demos.md?raw";
import contributingGuide from "@/content/public-docs/contributing.md?raw";
import roadmapGuide from "@/content/public-docs/roadmap.md?raw";
import llmContextIndex from "@/content/llm-context/README.md?raw";
import llmContextRouting from "@/content/llm-context/AI_FABRIC_CONTEXT_INDEX.md?raw";
import llmOpportunityScanner from "@/content/llm-context/AI_FABRIC_OPPORTUNITY_SCANNER.md?raw";
import llmContextRules from "@/content/llm-context/AI_FABRIC_RULES_FOR_CODING_ASSISTANTS.md?raw";
import llmCapabilityMap from "@/content/llm-context/AI_FABRIC_CAPABILITY_MAP.md?raw";
import llmDecisionTree from "@/content/llm-context/AI_FABRIC_MODULE_DECISION_TREE.md?raw";
import llmCommonRecipes from "@/content/llm-context/AI_FABRIC_COMMON_TASK_RECIPES.md?raw";
import llmTroubleshooting from "@/content/llm-context/AI_FABRIC_TROUBLESHOOTING_PLAYBOOK.md?raw";
import llmRealAppReference from "@/content/llm-context/AI_FABRIC_REAL_APP_REFERENCE.md?raw";

export type MarkdownGuideId =
  | "getting-started"
  | "start-here"
  | "choose-your-path"
  | "installation"
  | "architecture"
  | "modules"
  | "first-semantic-search"
  | "first-rag-chat"
  | "first-governed-action"
  | "chat-session-memory"
  | "real-provider-openai"
  | "local-onnx-embeddings"
  | "vector-storage-lucene"
  | "security-access-policy"
  | "testing-verification"
  | "live-demos"
  | "real-apps-map"
  | "production-checklist"
  | "contributing"
  | "roadmap"
  | "llm-context"
  | "llm-context-routing"
  | "llm-opportunity-scanner"
  | "llm-context-rules"
  | "llm-capability-map"
  | "llm-module-decision-tree"
  | "llm-common-recipes"
  | "llm-troubleshooting"
  | "llm-real-app-reference";

type MarkdownGuide = {
  title: string;
  description: string;
  content: string;
  sourcePath: string;
  sourceUrl: string;
  relatedStories?: RelatedStory[];
};

type RelatedStory = {
  title: string;
  description: string;
  href: string;
  label: string;
};

const frameworkRepoUrl =
  "https://github.com/Loom-AI-Labs/ai-fabric-framework/blob/main";
const siteRepoUrl = "https://github.com/mahmoudashraf/aifabric/blob/main";

const guides: Record<MarkdownGuideId, MarkdownGuide> = {
  "getting-started": {
    title: "AI Fabric Getting Started",
    description: "The canonical first path for AI Fabric developers and coding assistant sessions.",
    content: gettingStartedIndex,
    sourcePath: "docs/getting-started/README.md",
    sourceUrl: `${frameworkRepoUrl}/docs/getting-started/README.md`,
    relatedStories: [
      {
        title: "User Stories",
        description: "Narrative walkthroughs for the major framework capabilities.",
        href: "/docs/user-stories",
        label: "Story index",
      },
      {
        title: "Real API Stories",
        description: "Production-style scenario stories backed by integration behavior.",
        href: "/docs/real-api-stories",
        label: "Evidence stories",
      },
      {
        title: "Visual Quick Start",
        description: "The existing illustrated quickstart for a more guided first read.",
        href: "/docs/quickstart",
        label: "Visual guide",
      },
    ],
  },
  "start-here": {
    title: "LLM Start Here",
    description: "A compact context page for coding assistants working on AI Fabric apps.",
    content: llmStartHere,
    sourcePath: "docs/getting-started/00-llm-start-here.md",
    sourceUrl: `${frameworkRepoUrl}/docs/getting-started/00-llm-start-here.md`,
    relatedStories: [
      {
        title: "The Orchestrator Story",
        description: "Human explanation of how routing, guardrails, and request handling fit together.",
        href: "/docs/orchestrator_story",
        label: "Concept story",
      },
      {
        title: "Access Policy Story",
        description: "Why fail-closed access rules matter when an assistant writes code.",
        href: "/docs/access_policy_story",
        label: "Security story",
      },
    ],
  },
  "choose-your-path": {
    title: "Choose Your Path",
    description: "Pick the smallest AI Fabric module set for the capability you need.",
    content: chooseYourPath,
    sourcePath: "docs/getting-started/01-choose-your-path.md",
    sourceUrl: `${frameworkRepoUrl}/docs/getting-started/01-choose-your-path.md`,
    relatedStories: [
      {
        title: "User Stories",
        description: "Browse capability stories before deciding which integration path to build.",
        href: "/docs/user-stories",
        label: "Story index",
      },
      {
        title: "Real API Stories",
        description: "See which capabilities are backed by real scenario coverage.",
        href: "/docs/real-api-stories",
        label: "Evidence stories",
      },
    ],
  },
  installation: {
    title: "Installation",
    description: "Maven coordinates, modules, and baseline configuration for AI Fabric 0.3.3.",
    content: installation,
    sourcePath: "docs/getting-started/02-installation.md",
    sourceUrl: `${frameworkRepoUrl}/docs/getting-started/02-installation.md`,
    relatedStories: [
      {
        title: "OpenAI Provider Story",
        description: "How cloud LLM/provider setup fits into the framework.",
        href: "/docs/openai_provider_story",
        label: "Provider story",
      },
      {
        title: "ONNX Provider Story",
        description: "Why local embeddings are useful for cost and privacy.",
        href: "/docs/onnx_provider_story",
        label: "Provider story",
      },
      {
        title: "AI Core",
        description: "The core module story behind the starter and one-annotation entry point.",
        href: "/docs/modules/core",
        label: "Core story",
      },
    ],
  },
  architecture: {
    title: "Architecture",
    description: "How AI Fabric fits into Spring Boot applications.",
    content: architectureGuide,
    sourcePath: "src/content/public-docs/architecture.md",
    sourceUrl: `${siteRepoUrl}/src/content/public-docs/architecture.md`,
  },
  modules: {
    title: "Modules",
    description: "Choose AI Fabric modules by capability.",
    content: modulesGuide,
    sourcePath: "src/content/public-docs/modules.md",
    sourceUrl: `${siteRepoUrl}/src/content/public-docs/modules.md`,
  },
  "first-semantic-search": {
    title: "First Semantic Search",
    description: "Index app data, store vectors, and retrieve by meaning.",
    content: firstSemanticSearch,
    sourcePath: "docs/getting-started/03-first-semantic-search.md",
    sourceUrl: `${frameworkRepoUrl}/docs/getting-started/03-first-semantic-search.md`,
    relatedStories: [
      {
        title: "Semantic Search Deep Dive",
        description: "Human-friendly explanation of meaning-based retrieval with AI annotations.",
        href: "/docs/ai-annotations-semantic-search",
        label: "Search story",
      },
      {
        title: "E-Commerce Product Discovery",
        description: "Real API story for natural-language product retrieval.",
        href: "/docs/ecommerce-product-discovery-story",
        label: "Real API story",
      },
      {
        title: "Vector Lifecycle Management",
        description: "How vector create, update, remove, and reseed flows behave in practice.",
        href: "/docs/vector-lifecycle-story",
        label: "Lifecycle story",
      },
    ],
  },
  "first-rag-chat": {
    title: "First RAG Chat",
    description: "Ground answers in retrieved evidence and expose what was used.",
    content: firstRagChat,
    sourcePath: "docs/getting-started/04-first-rag-chat.md",
    sourceUrl: `${frameworkRepoUrl}/docs/getting-started/04-first-rag-chat.md`,
    relatedStories: [
      {
        title: "The RAG Story",
        description: "Narrative explanation of retrieval-augmented answers.",
        href: "/docs/rag_story",
        label: "RAG story",
      },
      {
        title: "RAG chat scenario",
        description: "A realistic support-style RAG scenario.",
        href: "/docs/rag_story_v3",
        label: "Scenario story",
      },
      {
        title: "Smart Suggestions",
        description: "How retrieved evidence can lead to next-step recommendations.",
        href: "/docs/smart-suggestions-story",
        label: "Real API story",
      },
    ],
  },
  "first-governed-action": {
    title: "First Governed Action",
    description: "Use AI Fabric actions, confirmation, and app-owned Java handlers.",
    content: firstGovernedAction,
    sourcePath: "docs/getting-started/05-first-governed-action.md",
    sourceUrl: `${frameworkRepoUrl}/docs/getting-started/05-first-governed-action.md`,
    relatedStories: [
      {
        title: "Intent Extraction Story",
        description: "How user language becomes action intent without frontend keyword routing.",
        href: "/docs/intent_story",
        label: "Intent story",
      },
      {
        title: "The Orchestrator Story",
        description: "How actions pass through orchestration and guardrails.",
        href: "/docs/orchestrator_story",
        label: "Orchestration story",
      },
      {
        title: "Access Policy Story",
        description: "Why side-effect actions need access policy and confirmation.",
        href: "/docs/access_policy_story",
        label: "Security story",
      },
    ],
  },
  "chat-session-memory": {
    title: "Chat Session Memory",
    description: "Backend-owned conversation history, pending actions, and pinned targets.",
    content: chatSessionMemory,
    sourcePath: "docs/getting-started/06-chat-session-memory.md",
    sourceUrl: `${frameworkRepoUrl}/docs/getting-started/06-chat-session-memory.md`,
    relatedStories: [
      {
        title: "Chat follow-up scenario",
        description: "Narrative context for follow-up messages and intent continuity.",
        href: "/docs/intent_story_v2",
        label: "Conversation story",
      },
      {
        title: "Smart Suggestions",
        description: "Follow-up turns often depend on remembered suggestions and targets.",
        href: "/docs/smart-suggestions-story",
        label: "Real API story",
      },
    ],
  },
  "real-provider-openai": {
    title: "Real Provider: OpenAI",
    description: "Configure OpenAI LLM and embeddings through the Spring AI provider module.",
    content: realProviderOpenai,
    sourcePath: "docs/getting-started/07-real-provider-openai.md",
    sourceUrl: `${frameworkRepoUrl}/docs/getting-started/07-real-provider-openai.md`,
    relatedStories: [
      {
        title: "OpenAI Provider Story",
        description: "Provider integration explained as a practical story.",
        href: "/docs/openai_provider_story",
        label: "Provider story",
      },
      {
        title: "OpenAI provider scenario",
        description: "Narrative version of provider wiring and operational concerns.",
        href: "/docs/openai_provider_story_v2",
        label: "Narrative story",
      },
      {
        title: "Real AI Embedding Generation",
        description: "Real API story for embedding generation and search.",
        href: "/docs/real-ai-embedding-story",
        label: "Real API story",
      },
    ],
  },
  "local-onnx-embeddings": {
    title: "Local ONNX Embeddings",
    description: "Run embeddings locally without remote embedding calls.",
    content: localOnnxEmbeddings,
    sourcePath: "docs/getting-started/08-local-onnx-embeddings.md",
    sourceUrl: `${frameworkRepoUrl}/docs/getting-started/08-local-onnx-embeddings.md`,
    relatedStories: [
      {
        title: "ONNX Provider Story",
        description: "Local embeddings, privacy, and cost tradeoffs in story form.",
        href: "/docs/onnx_provider_story",
        label: "Provider story",
      },
      {
        title: "ONNX Fallback Readiness",
        description: "Real API scenario for local fallback and no-key readiness.",
        href: "/docs/onnx-fallback-story",
        label: "Real API story",
      },
    ],
  },
  "vector-storage-lucene": {
    title: "Vector Storage: Lucene",
    description: "Use the local durable Lucene vector provider.",
    content: vectorStorageLucene,
    sourcePath: "docs/getting-started/09-vector-storage-lucene.md",
    sourceUrl: `${frameworkRepoUrl}/docs/getting-started/09-vector-storage-lucene.md`,
    relatedStories: [
      {
        title: "The Storage Story",
        description: "How storage choices shape AI application behavior.",
        href: "/docs/storage_story",
        label: "Storage story",
      },
      {
        title: "The Indexing Story",
        description: "Why indexing lifecycle matters for vector-backed apps.",
        href: "/docs/indexing_story",
        label: "Indexing story",
      },
      {
        title: "Vector Lifecycle Management",
        description: "Real lifecycle coverage for vector storage operations.",
        href: "/docs/vector-lifecycle-story",
        label: "Real API story",
      },
    ],
  },
  "security-access-policy": {
    title: "Security And Access Policy",
    description: "Make retrieval and actions tenant/user safe.",
    content: securityAccessPolicy,
    sourcePath: "docs/getting-started/10-security-access-policy.md",
    sourceUrl: `${frameworkRepoUrl}/docs/getting-started/10-security-access-policy.md`,
    relatedStories: [
      {
        title: "Access Policy Story",
        description: "Fail-closed security explained for human readers.",
        href: "/docs/access_policy_story",
        label: "Security story",
      },
      {
        title: "Access Control Mechanics",
        description: "Mechanics behind subject context, checks, and boundaries.",
        href: "/docs/access_control_mechanics_story",
        label: "Mechanics story",
      },
      {
        title: "PII Detection Edge Spectrum",
        description: "Privacy and compliance edge cases with real scenario framing.",
        href: "/docs/pii-detection-edge-story",
        label: "Real API story",
      },
    ],
  },
  "testing-verification": {
    title: "Testing And Verification",
    description: "Know what runs locally, in CI, and with real provider keys.",
    content: testingVerification,
    sourcePath: "docs/getting-started/11-testing-and-verification.md",
    sourceUrl: `${frameworkRepoUrl}/docs/getting-started/11-testing-and-verification.md`,
    relatedStories: [
      {
        title: "Real API Stories",
        description: "Scenario-style evidence for real provider and integration behavior.",
        href: "/docs/real-api-stories",
        label: "Evidence index",
      },
      {
        title: "Vector Lifecycle Management",
        description: "Concrete lifecycle verification story.",
        href: "/docs/vector-lifecycle-story",
        label: "Real API story",
      },
      {
        title: "PII Detection Edge Spectrum",
        description: "A security-heavy verification story.",
        href: "/docs/pii-detection-edge-story",
        label: "Real API story",
      },
    ],
  },
  "live-demos": {
    title: "Live Demos",
    description: "Five deployed AI Fabric real apps and what each one proves.",
    content: liveDemosGuide,
    sourcePath: "src/content/public-docs/live-demos.md",
    sourceUrl: `${siteRepoUrl}/src/content/public-docs/live-demos.md`,
  },
  "real-apps-map": {
    title: "Real Apps Map",
    description: "Pick the example app that proves the capability you need.",
    content: realAppsMap,
    sourcePath: "docs/getting-started/12-real-apps-map.md",
    sourceUrl: `${frameworkRepoUrl}/docs/getting-started/12-real-apps-map.md`,
    relatedStories: [
      {
        title: "Live Demos",
        description: "Try the deployed demos that correspond to the real app examples.",
        href: "/demos",
        label: "Demo index",
      },
      {
        title: "User Stories",
        description: "See the capability stories behind the real app examples.",
        href: "/docs/user-stories",
        label: "Story index",
      },
    ],
  },
  "production-checklist": {
    title: "Production Checklist",
    description: "Release and deployment readiness checks for AI Fabric apps.",
    content: productionChecklist,
    sourcePath: "docs/getting-started/13-production-checklist.md",
    sourceUrl: `${frameworkRepoUrl}/docs/getting-started/13-production-checklist.md`,
    relatedStories: [
      {
        title: "Audit Capabilities Story",
        description: "Production auditability in story form.",
        href: "/docs/audit_capabilities_story",
        label: "Audit story",
      },
      {
        title: "Cleanup Capabilities Story",
        description: "Operational cleanup patterns for long-running AI apps.",
        href: "/docs/cleanup_capabilities_story",
        label: "Ops story",
      },
      {
        title: "Real API Stories",
        description: "Use scenario evidence before releasing.",
        href: "/docs/real-api-stories",
        label: "Evidence index",
      },
    ],
  },
  contributing: {
    title: "Contributing",
    description: "How external users can start improving AI Fabric safely.",
    content: contributingGuide,
    sourcePath: "src/content/public-docs/contributing.md",
    sourceUrl: `${siteRepoUrl}/src/content/public-docs/contributing.md`,
  },
  roadmap: {
    title: "Roadmap",
    description: "What matters next for the framework and public adoption.",
    content: roadmapGuide,
    sourcePath: "src/content/public-docs/roadmap.md",
    sourceUrl: `${siteRepoUrl}/src/content/public-docs/roadmap.md`,
  },
  "llm-context": {
    title: "LLM Context Pack",
    description: "Compact routing docs for coding assistant sessions.",
    content: llmContextIndex,
    sourcePath: "docs/llm-context/README.md",
    sourceUrl: `${frameworkRepoUrl}/docs/llm-context/README.md`,
    relatedStories: [
      {
        title: "User Stories",
        description: "Human narrative layer to pair with coding-assistant context.",
        href: "/docs/user-stories",
        label: "Story index",
      },
      {
        title: "Getting Started",
        description: "Return to the human-first implementation path.",
        href: "/docs/getting-started",
        label: "Guide index",
      },
    ],
  },
  "llm-context-routing": {
    title: "AI Fabric Context Index",
    description: "Route a coding assistant to the smallest useful doc set.",
    content: llmContextRouting,
    sourcePath: "docs/llm-context/AI_FABRIC_CONTEXT_INDEX.md",
    sourceUrl: `${frameworkRepoUrl}/docs/llm-context/AI_FABRIC_CONTEXT_INDEX.md`,
  },
  "llm-opportunity-scanner": {
    title: "AI Fabric Opportunity Scanner",
    description: "Help coding assistants discover what AI Fabric can unlock in a Java/Spring Boot app.",
    content: llmOpportunityScanner,
    sourcePath: "docs/llm-context/AI_FABRIC_OPPORTUNITY_SCANNER.md",
    sourceUrl: `${frameworkRepoUrl}/docs/llm-context/AI_FABRIC_OPPORTUNITY_SCANNER.md`,
    relatedStories: [
      {
        title: "Real App Reference",
        description: "Use existing real apps as proof patterns after identifying an opportunity.",
        href: "/docs/llm-context/real-app-reference",
        label: "Evidence map",
      },
      {
        title: "Choose Your Path",
        description: "Move from opportunity discovery into a specific integration path.",
        href: "/docs/choose-your-path",
        label: "Implementation path",
      },
    ],
  },
  "llm-context-rules": {
    title: "Rules For Coding Assistants",
    description: "Implementation rules that protect the framework philosophy.",
    content: llmContextRules,
    sourcePath: "docs/llm-context/AI_FABRIC_RULES_FOR_CODING_ASSISTANTS.md",
    sourceUrl: `${frameworkRepoUrl}/docs/llm-context/AI_FABRIC_RULES_FOR_CODING_ASSISTANTS.md`,
  },
  "llm-capability-map": {
    title: "AI Fabric Capability Map",
    description: "Capabilities, modules, and key code/config surfaces.",
    content: llmCapabilityMap,
    sourcePath: "docs/llm-context/AI_FABRIC_CAPABILITY_MAP.md",
    sourceUrl: `${frameworkRepoUrl}/docs/llm-context/AI_FABRIC_CAPABILITY_MAP.md`,
  },
  "llm-module-decision-tree": {
    title: "AI Fabric Module Decision Tree",
    description: "Choose modules by need instead of by guesswork.",
    content: llmDecisionTree,
    sourcePath: "docs/llm-context/AI_FABRIC_MODULE_DECISION_TREE.md",
    sourceUrl: `${frameworkRepoUrl}/docs/llm-context/AI_FABRIC_MODULE_DECISION_TREE.md`,
  },
  "llm-common-recipes": {
    title: "Common Task Recipes",
    description: "Short recipes for common AI Fabric implementation tasks.",
    content: llmCommonRecipes,
    sourcePath: "docs/llm-context/AI_FABRIC_COMMON_TASK_RECIPES.md",
    sourceUrl: `${frameworkRepoUrl}/docs/llm-context/AI_FABRIC_COMMON_TASK_RECIPES.md`,
  },
  "llm-troubleshooting": {
    title: "Troubleshooting Playbook",
    description: "Diagnose common AI Fabric integration failures.",
    content: llmTroubleshooting,
    sourcePath: "docs/llm-context/AI_FABRIC_TROUBLESHOOTING_PLAYBOOK.md",
    sourceUrl: `${frameworkRepoUrl}/docs/llm-context/AI_FABRIC_TROUBLESHOOTING_PLAYBOOK.md`,
  },
  "llm-real-app-reference": {
    title: "Real App Reference",
    description: "Which real apps prove which framework patterns.",
    content: llmRealAppReference,
    sourcePath: "docs/llm-context/AI_FABRIC_REAL_APP_REFERENCE.md",
    sourceUrl: `${frameworkRepoUrl}/docs/llm-context/AI_FABRIC_REAL_APP_REFERENCE.md`,
  },
};

const routeByMarkdownFile: Record<string, string> = {
  "README.md": "/docs/getting-started",
  "00-llm-start-here.md": "/docs/start-here",
  "01-choose-your-path.md": "/docs/choose-your-path",
  "02-installation.md": "/docs/installation",
  "03-first-semantic-search.md": "/docs/first-semantic-search",
  "04-first-rag-chat.md": "/docs/first-rag-chat",
  "05-first-governed-action.md": "/docs/first-governed-action",
  "06-chat-session-memory.md": "/docs/chat-session-memory",
  "07-real-provider-openai.md": "/docs/providers/openai",
  "08-local-onnx-embeddings.md": "/docs/providers/onnx",
  "09-vector-storage-lucene.md": "/docs/vector/lucene",
  "10-security-access-policy.md": "/docs/security/access-policy",
  "11-testing-and-verification.md": "/docs/testing-verification",
  "12-real-apps-map.md": "/docs/real-apps-map",
  "13-production-checklist.md": "/docs/production-checklist",
  "architecture.md": "/docs/architecture",
  "modules.md": "/docs/modules",
  "live-demos.md": "/docs/live-demos",
  "contributing.md": "/docs/contributing",
  "roadmap.md": "/docs/roadmap",
  "AI_FABRIC_CONTEXT_INDEX.md": "/docs/llm-context/routing",
  "AI_FABRIC_OPPORTUNITY_SCANNER.md": "/docs/llm-context/opportunity-scanner",
  "AI_FABRIC_RULES_FOR_CODING_ASSISTANTS.md": "/docs/llm-context/rules",
  "AI_FABRIC_CAPABILITY_MAP.md": "/docs/llm-context/capability-map",
  "AI_FABRIC_MODULE_DECISION_TREE.md": "/docs/llm-context/module-decision-tree",
  "AI_FABRIC_COMMON_TASK_RECIPES.md": "/docs/llm-context/common-recipes",
  "AI_FABRIC_TROUBLESHOOTING_PLAYBOOK.md": "/docs/llm-context/troubleshooting",
  "AI_FABRIC_REAL_APP_REFERENCE.md": "/docs/llm-context/real-app-reference",
};

const codeTheme = {
  ...themes.nightOwl,
  plain: {
    ...themes.nightOwl.plain,
    backgroundColor: "hsl(var(--code-bg))",
  },
};

const CodeBlock = ({ children, className }: { children: string; className?: string }) => {
  const [copied, setCopied] = useState(false);
  const match = /language-(\w+)/.exec(className || "");
  const language = match ? match[1] : "text";

  const handleCopy = () => {
    navigator.clipboard.writeText(children.trim());
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  return (
    <div className="group relative my-4">
      <Highlight theme={codeTheme} code={children.trim()} language={language}>
        {({ style, tokens, getLineProps, getTokenProps }) => (
          <pre
            className="overflow-x-auto rounded-lg border border-border/50 p-4 pr-12 text-sm"
            style={style}
          >
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line })}>
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token })} />
                ))}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
      <button
        type="button"
        onClick={handleCopy}
        className="absolute right-2 top-2 rounded-md bg-muted/70 p-2 opacity-0 transition-opacity hover:bg-muted group-hover:opacity-100"
        aria-label="Copy code"
      >
        {copied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4 text-muted-foreground" />}
      </button>
    </div>
  );
};

const resolveMarkdownHref = (href?: string) => {
  if (!href) {
    return undefined;
  }
  if (/^(https?:|mailto:|#)/.test(href)) {
    return href;
  }
  const fileName = href.split("#")[0].split("/").pop() || href;
  const hash = href.includes("#") ? `#${href.split("#").slice(1).join("#")}` : "";
  return routeByMarkdownFile[fileName] ? `${routeByMarkdownFile[fileName]}${hash}` : href;
};

const isExternalHref = (href?: string) => Boolean(href && /^(https?:|mailto:)/.test(href));

export const MarkdownGuidePage = ({ docId }: { docId: MarkdownGuideId }) => {
  const guide = guides[docId];
  const renderedContent = guide.content.replace(/^# .+(\r?\n)+/, "");

  useEffect(() => {
    document.title = `${guide.title} - AI Fabric Docs`;
    let description = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!description) {
      description = document.createElement("meta");
      description.setAttribute("name", "description");
      document.head.appendChild(description);
    }
    description.setAttribute("content", guide.description);
  }, [guide.description, guide.title]);

  return (
    <DocsLayout>
      <div className="min-h-screen">
        <section className="border-b border-border/50 px-6 py-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="max-w-3xl">
              <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                <FileText className="h-3.5 w-3.5" />
                Canonical framework guide
              </span>
              <h1 className="text-2xl font-bold text-foreground md:text-3xl">{guide.title}</h1>
              <p className="mt-3 text-muted-foreground">{guide.description}</p>
            </div>
            <div className="flex items-center gap-3">
              <PageViewCounter />
              <a
                href={guide.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary/50 hover:text-primary"
              >
                Source
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
          <div className="mt-5 rounded-lg border border-border/60 bg-muted/30 px-4 py-3 font-mono text-xs text-muted-foreground">
            Source of truth: {guide.sourcePath}
          </div>
        </section>

        <motion.article
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="prose prose-invert max-w-none px-6 py-8"
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ children }) => (
                <h1 className="mt-8 text-3xl font-bold text-foreground first:mt-0">{children}</h1>
              ),
              h2: ({ children }) => (
                <h2 className="mt-8 border-b border-border/50 pb-2 text-2xl font-bold text-foreground">{children}</h2>
              ),
              h3: ({ children }) => (
                <h3 className="mt-6 text-xl font-semibold text-foreground">{children}</h3>
              ),
              h4: ({ children }) => (
                <h4 className="mt-5 text-lg font-semibold text-foreground">{children}</h4>
              ),
              p: ({ children }) => (
                <p className="mb-4 leading-relaxed text-muted-foreground">{children}</p>
              ),
              ul: ({ children }) => (
                <ul className="mb-4 list-disc space-y-2 pl-6 text-muted-foreground">{children}</ul>
              ),
              ol: ({ children }) => (
                <ol className="mb-4 list-decimal space-y-2 pl-6 text-muted-foreground">{children}</ol>
              ),
              li: ({ children }) => <li className="text-muted-foreground">{children}</li>,
              blockquote: ({ children }) => (
                <blockquote className="my-4 rounded-r-lg border-l-4 border-primary bg-secondary/30 py-2 pl-4 text-foreground">
                  {children}
                </blockquote>
              ),
              code: ({ className, children, ...props }) => {
                if (!className) {
                  return (
                    <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm text-primary" {...props}>
                      {children}
                    </code>
                  );
                }
                return <CodeBlock className={className}>{String(children)}</CodeBlock>;
              },
              pre: ({ children }) => <>{children}</>,
              hr: () => <hr className="my-8 border-border/50" />,
              a: ({ href, children }) => {
                const resolvedHref = resolveMarkdownHref(href);
                if (!isExternalHref(resolvedHref) && resolvedHref?.startsWith("/")) {
                  return (
                    <Link to={resolvedHref} className="font-medium text-primary hover:underline">
                      {children}
                    </Link>
                  );
                }
                return (
                  <a
                    href={resolvedHref}
                    className="font-medium text-primary hover:underline"
                    target={isExternalHref(resolvedHref) ? "_blank" : undefined}
                    rel={isExternalHref(resolvedHref) ? "noopener noreferrer" : undefined}
                  >
                    {children}
                  </a>
                );
              },
              strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
              table: ({ children }) => (
                <div className="my-4 overflow-x-auto">
                  <table className="min-w-full overflow-hidden rounded-lg border border-border/50">{children}</table>
                </div>
              ),
              thead: ({ children }) => <thead className="bg-muted/50">{children}</thead>,
              th: ({ children }) => (
                <th className="border-b border-border/50 px-4 py-2 text-left font-semibold text-foreground">{children}</th>
              ),
              td: ({ children }) => (
                <td className="border-b border-border/50 px-4 py-2 align-top text-muted-foreground">{children}</td>
              ),
            }}
          >
            {renderedContent}
          </ReactMarkdown>
        </motion.article>
      </div>
    </DocsLayout>
  );
};

export default MarkdownGuidePage;
