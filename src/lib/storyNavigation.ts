import {
  Shield,
  Lock,
  Search,
  TrendingUp,
  Database,
  HardDrive,
  MessageSquare,
  Brain,
  FileText,
  Zap,
  Cpu,
  FileCheck,
  RefreshCw,
  Sparkles,
  ShoppingCart,
  LucideIcon,
  HelpCircle,
} from "lucide-react";

export interface Story {
  id: string;
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
  color: string;
  category: string;
  collection: "user-stories" | "real-api-stories";
}

/**
 * ============================================
 * STORY NAVIGATION DATA
 * ============================================
 * 
 * IMPORTANT: This file must be kept in sync with actual story files!
 * 
 * When ADDING a story:
 *   1. Create the story file in /src/pages/docs/
 *   2. Add the route in your router configuration
 *   3. Add an entry here in the appropriate position
 *   4. Import StoryNavigation in the new story file
 * 
 * When DELETING a story:
 *   1. Delete the story file
 *   2. Remove the route from router configuration  
 *   3. Remove the entry from this array
 * 
 * The navigation will gracefully handle:
 *   - Stories not in this list (navigation won't show)
 *   - Being at the start/end of the list (shows "All Stories" link)
 */
export const allStories: Story[] = [
  // User Stories
  {
    id: "orchestrator-story",
    title: "The Orchestrator Story",
    description: "Your AI's Bodyguard, Traffic Cop, and Mind Reader",
    href: "/docs/orchestrator_story",
    icon: Shield,
    color: "bg-blue-500",
    category: "Security",
    collection: "user-stories",
  },
  {
    id: "orchestrator-story-v2",
    title: "Orchestrator Story V2",
    description: "The 3 AM call that changed everything",
    href: "/docs/orchestrator_story_v2",
    icon: Shield,
    color: "bg-blue-500",
    category: "Security",
    collection: "user-stories",
  },
  {
    id: "pii-detection",
    title: "PII Detection Story",
    description: "The data leak that never happened",
    href: "/docs/pii_detection",
    icon: Lock,
    color: "bg-red-500",
    category: "Privacy",
    collection: "user-stories",
  },
  {
    id: "rag-story",
    title: "The RAG Story",
    description: "Building intelligent search that actually understands",
    href: "/docs/rag_story",
    icon: Search,
    color: "bg-purple-500",
    category: "Search",
    collection: "user-stories",
  },
  {
    id: "rag-story-v2",
    title: "RAG Story V2",
    description: "The $47.23 that almost cost everything",
    href: "/docs/rag_story_v2",
    icon: Search,
    color: "bg-purple-500",
    category: "Search",
    collection: "user-stories",
  },
  {
    id: "rag-story-v3",
    title: "RAG Story V3",
    description: "The support ticket that changed everything",
    href: "/docs/rag_story_v3",
    icon: Search,
    color: "bg-purple-500",
    category: "Search",
    collection: "user-stories",
  },
  {
    id: "behavior-story",
    title: "The Behavior Story",
    description: "Predict churn with 87% accuracy using AI patterns",
    href: "/docs/behavior_story",
    icon: TrendingUp,
    color: "bg-green-500",
    category: "Analytics",
    collection: "user-stories",
  },
  {
    id: "behavior-story-v2",
    title: "Behavior Story V2",
    description: "The customer we almost lost—Jessica's journey",
    href: "/docs/behavior_story_v2",
    icon: TrendingUp,
    color: "bg-green-500",
    category: "Analytics",
    collection: "user-stories",
  },
  {
    id: "indexing-story",
    title: "The Indexing Story",
    description: "Index 2000 entities per second efficiently",
    href: "/docs/indexing_story",
    icon: Database,
    color: "bg-cyan-500",
    category: "Performance",
    collection: "user-stories",
  },
  {
    id: "indexing-story-v2",
    title: "Indexing Story V2",
    description: "The Black Friday that almost broke us",
    href: "/docs/indexing_story_v2",
    icon: Database,
    color: "bg-cyan-500",
    category: "Performance",
    collection: "user-stories",
  },
  {
    id: "custom-storage-indexing",
    title: "Custom Storage Indexing",
    description: "When your database isn't SQL",
    href: "/docs/custom_storage_indexing",
    icon: HardDrive,
    color: "bg-indigo-500",
    category: "Storage",
    collection: "user-stories",
  },
  {
    id: "storage-story",
    title: "The Storage Story",
    description: "Smart storage strategies for AI applications",
    href: "/docs/storage_story",
    icon: HardDrive,
    color: "bg-indigo-500",
    category: "Storage",
    collection: "user-stories",
  },
  {
    id: "storage-story-v2",
    title: "Storage Story V2",
    description: "The table that grew too big—a growth story",
    href: "/docs/storage_story_v2",
    icon: HardDrive,
    color: "bg-indigo-500",
    category: "Storage",
    collection: "user-stories",
  },
  {
    id: "intent-story",
    title: "The Intent Extraction Story",
    description: "How AI understands what users want",
    href: "/docs/intent_story",
    icon: MessageSquare,
    color: "bg-pink-500",
    category: "NLP",
    collection: "user-stories",
  },
  {
    id: "intent-story-v2",
    title: "Intent Story V2",
    description: "A storytelling approach to understanding intent",
    href: "/docs/intent_story_v2",
    icon: MessageSquare,
    color: "bg-pink-500",
    category: "NLP",
    collection: "user-stories",
  },
  {
    id: "migration-story",
    title: "The Migration Story",
    description: "Zero-downtime migrations for enterprise systems",
    href: "/docs/migration_story",
    icon: RefreshCw,
    color: "bg-orange-500",
    category: "Operations",
    collection: "user-stories",
  },
  {
    id: "migration-story-v2",
    title: "Migration Story V2",
    description: "The weekend that never was—a migration tale",
    href: "/docs/migration_story_v2",
    icon: RefreshCw,
    color: "bg-orange-500",
    category: "Operations",
    collection: "user-stories",
  },
  {
    id: "access-policy-story",
    title: "The Access Policy Story",
    description: "Building fail-closed security into every request",
    href: "/docs/access_policy_story",
    icon: Shield,
    color: "bg-red-500",
    category: "Security",
    collection: "user-stories",
  },
  {
    id: "access-policy-story-v2",
    title: "Access Policy Story V2",
    description: "The security audit that changed everything",
    href: "/docs/access_policy_story_v2",
    icon: Shield,
    color: "bg-red-500",
    category: "Security",
    collection: "user-stories",
  },
  {
    id: "pii-detection-story-v1",
    title: "PII Detection Story V1",
    description: "Building privacy into every request",
    href: "/docs/pii_detection_story_v1",
    icon: Lock,
    color: "bg-red-500",
    category: "Privacy",
    collection: "user-stories",
  },
  {
    id: "pii-detection-story-v2",
    title: "PII Detection Story V2",
    description: "The GDPR audit that saved everything",
    href: "/docs/pii_detection_story_v2",
    icon: Lock,
    color: "bg-red-500",
    category: "Privacy",
    collection: "user-stories",
  },
  {
    id: "relationship-query-story-v2",
    title: "Relationship Query Story V2",
    description: "The Friday 4 PM question that changed everything",
    href: "/docs/relationship_query_story_v2",
    icon: Brain,
    color: "bg-violet-500",
    category: "Query",
    collection: "user-stories",
  },
  {
    id: "openai-provider-story",
    title: "OpenAI Provider Story",
    description: "Production-ready integration in one dependency",
    href: "/docs/openai_provider_story",
    icon: Zap,
    color: "bg-yellow-500",
    category: "Provider",
    collection: "user-stories",
  },
  {
    id: "openai-provider-story-v2",
    title: "OpenAI Provider Story V2",
    description: "The integration that took 5 minutes",
    href: "/docs/openai_provider_story_v2",
    icon: Zap,
    color: "bg-yellow-500",
    category: "Provider",
    collection: "user-stories",
  },
  {
    id: "onnx-provider-story",
    title: "ONNX Provider Story",
    description: "Local embeddings that cost $0 and beat cloud APIs",
    href: "/docs/onnx_provider_story",
    icon: Cpu,
    color: "bg-cyan-500",
    category: "Provider",
    collection: "user-stories",
  },
  {
    id: "onnx-provider-story-v2",
    title: "ONNX Provider Story V2",
    description: "The $12,000 bill that never came",
    href: "/docs/onnx_provider_story_v2",
    icon: Cpu,
    color: "bg-cyan-500",
    category: "Provider",
    collection: "user-stories",
  },
  {
    id: "audit-capabilities-story",
    title: "Audit Capabilities Story",
    description: "Complete audit trail for AI systems",
    href: "/docs/audit_capabilities_story",
    icon: FileCheck,
    color: "bg-emerald-500",
    category: "Compliance",
    collection: "user-stories",
  },
  {
    id: "audit-capabilities-story-v2",
    title: "Audit Capabilities Story V2",
    description: "The audit that saved everything",
    href: "/docs/audit_capabilities_story_v2",
    icon: FileCheck,
    color: "bg-emerald-500",
    category: "Compliance",
    collection: "user-stories",
  },
  {
    id: "cleanup-capabilities-story",
    title: "Cleanup Capabilities Story",
    description: "Automatic data cleanup for AI systems",
    href: "/docs/cleanup_capabilities_story",
    icon: Sparkles,
    color: "bg-teal-500",
    category: "Operations",
    collection: "user-stories",
  },
  {
    id: "cleanup-capabilities-story-v2",
    title: "Cleanup Capabilities Story V2",
    description: "The 1TB database that shrunk to 300GB",
    href: "/docs/cleanup_capabilities_story_v2",
    icon: Sparkles,
    color: "bg-teal-500",
    category: "Operations",
    collection: "user-stories",
  },
  {
    id: "retention-capabilities-story",
    title: "Retention Capabilities Story",
    description: "Pluggable data retention policy system",
    href: "/docs/retention_capabilities_story",
    icon: FileText,
    color: "bg-slate-500",
    category: "Compliance",
    collection: "user-stories",
  },
  {
    id: "retention-capabilities-story-v2",
    title: "Retention Capabilities Story V2",
    description: "The audit that almost failed",
    href: "/docs/retention_capabilities_story_v2",
    icon: FileText,
    color: "bg-slate-500",
    category: "Compliance",
    collection: "user-stories",
  },
  // Real API Stories
  {
    id: "ecommerce-product-discovery",
    title: "E-Commerce Product Discovery",
    description: "When shoppers speak, AI listens—natural language product search",
    href: "/docs/ecommerce-product-discovery-story",
    icon: ShoppingCart,
    color: "bg-blue-500",
    category: "E-Commerce",
    collection: "real-api-stories",
  },
  {
    id: "financial-fraud-detection",
    title: "Financial Fraud Detection",
    description: "Track suspicious money flows through relationship queries",
    href: "/docs/financial-fraud-detection-story",
    icon: Shield,
    color: "bg-green-500",
    category: "Finance",
    collection: "real-api-stories",
  },
  {
    id: "law-firm-document",
    title: "Law Firm Document Management",
    description: "Find needles in legal haystacks—30 seconds instead of 3 hours",
    href: "/docs/law-firm-document-story",
    icon: FileText,
    color: "bg-purple-500",
    category: "Legal",
    collection: "real-api-stories",
  },
  {
    id: "pii-detection-edge",
    title: "PII Detection Edge Spectrum",
    description: "Testing every privacy edge case—HIPAA & GDPR compliant",
    href: "/docs/pii-detection-edge-story",
    icon: Lock,
    color: "bg-red-500",
    category: "Security",
    collection: "real-api-stories",
  },
  {
    id: "smart-suggestions",
    title: "Smart Suggestions",
    description: "AI-powered next-step predictions with confidence scores",
    href: "/docs/smart-suggestions-story",
    icon: Sparkles,
    color: "bg-yellow-500",
    category: "UX",
    collection: "real-api-stories",
  },
  {
    id: "onnx-fallback",
    title: "ONNX Fallback Readiness",
    description: "$0 embeddings, 100% private, zero downtime",
    href: "/docs/onnx-fallback-story",
    icon: Cpu,
    color: "bg-cyan-500",
    category: "Cost Optimization",
    collection: "real-api-stories",
  },
  {
    id: "real-ai-embedding",
    title: "Real AI Embedding Generation",
    description: "From product data to semantic search in 15ms with $0 cost",
    href: "/docs/real-ai-embedding-story",
    icon: Zap,
    color: "bg-orange-500",
    category: "Performance",
    collection: "real-api-stories",
  },
  {
    id: "vector-lifecycle",
    title: "Vector Lifecycle Management",
    description: "8-phase lifecycle: create, remove, clear, reseed with full audit",
    href: "/docs/vector-lifecycle-story",
    icon: RefreshCw,
    color: "bg-indigo-500",
    category: "Operations",
    collection: "real-api-stories",
  },
];

/**
 * Get story by href path
 */
export function getStoryByHref(href: string): Story | undefined {
  return allStories.find(story => story.href === href);
}

/**
 * Get navigation info for a story (previous and next)
 */
export function getStoryNavigation(currentHref: string): {
  previous: Story | null;
  next: Story | null;
  currentIndex: number;
  totalStories: number;
} {
  const currentIndex = allStories.findIndex(story => story.href === currentHref);
  
  if (currentIndex === -1) {
    return { previous: null, next: null, currentIndex: -1, totalStories: allStories.length };
  }

  return {
    previous: currentIndex > 0 ? allStories[currentIndex - 1] : null,
    next: currentIndex < allStories.length - 1 ? allStories[currentIndex + 1] : null,
    currentIndex,
    totalStories: allStories.length,
  };
}

/**
 * Get stories by collection
 */
export function getStoriesByCollection(collection: "user-stories" | "real-api-stories"): Story[] {
  return allStories.filter(story => story.collection === collection);
}

/**
 * Get random stories excluding the current one
 */
export function getRandomStories(currentHref: string, count: number = 3): Story[] {
  const otherStories = allStories.filter(story => story.href !== currentHref);
  const shuffled = [...otherStories].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
