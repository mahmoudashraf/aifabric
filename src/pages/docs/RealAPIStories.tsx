import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import DocsLayout from "@/components/docs/DocsLayout";
import StoryPreviewImage from "@/components/StoryPreviewImage";
import { 
  ShoppingCart, 
  Shield, 
  FileText, 
  Lock, 
  Sparkles, 
  Cpu, 
  Zap, 
  RefreshCw,
  ArrowRight,
  ExternalLink,
  BookOpen,
  TestTube
} from "lucide-react";

const PAGE_TITLE = "Real API Stories - AI Fabric Framework";
const PAGE_DESCRIPTION = "Integration scenarios told as interactive stories. Pair them with the current AI Fabric testing guide for exact release checks.";

const stories = [
  {
    id: "ecommerce-product-discovery",
    title: "E-Commerce Product Discovery",
    description: "When shoppers speak, AI listens—natural language product search",
    href: "/docs/ecommerce-product-discovery-story",
    icon: ShoppingCart,
    color: "bg-blue-500",
    stats: "Product retrieval",
    category: "E-Commerce",
    readTime: "8 min read"
  },
  {
    id: "financial-fraud-detection",
    title: "Financial Fraud Detection",
    description: "Track suspicious money flows through relationship queries",
    href: "/docs/financial-fraud-detection-story",
    icon: Shield,
    color: "bg-green-500",
    stats: "Graph signals",
    category: "Finance",
    readTime: "10 min read"
  },
  {
    id: "law-firm-document",
    title: "Law Firm Document Management",
    description: "Find needles in legal haystacks with semantic document search",
    href: "/docs/law-firm-document-story",
    icon: FileText,
    color: "bg-purple-500",
    stats: "Document search",
    category: "Legal",
    readTime: "12 min read"
  },
  {
    id: "pii-detection-edge",
    title: "PII Detection Edge Spectrum",
    description: "Testing every privacy edge case—HIPAA & GDPR compliant",
    href: "/docs/pii-detection-edge-story",
    icon: Lock,
    color: "bg-red-500",
    stats: "Privacy edge cases",
    category: "Security",
    readTime: "15 min read"
  },
  {
    id: "smart-suggestions",
    title: "Smart Suggestions",
    description: "AI-powered next-step predictions with confidence scores",
    href: "/docs/smart-suggestions-story",
    icon: Sparkles,
    color: "bg-yellow-500",
    stats: "Next-step hints",
    category: "UX",
    readTime: "7 min read"
  },
  {
    id: "onnx-fallback",
    title: "ONNX Fallback Readiness",
    description: "Local embedding fallback when remote providers are unavailable",
    href: "/docs/onnx-fallback-story",
    icon: Cpu,
    color: "bg-cyan-500",
    stats: "Local fallback",
    category: "Cost Optimization",
    readTime: "9 min read"
  },
  {
    id: "real-ai-embedding",
    title: "Real AI Embedding Generation",
    description: "From product data to semantic search with real embedding evidence",
    href: "/docs/real-ai-embedding-story",
    icon: Zap,
    color: "bg-orange-500",
    stats: "Embedding proof",
    category: "Performance",
    readTime: "11 min read"
  },
  {
    id: "vector-lifecycle",
    title: "Vector Lifecycle Management",
    description: "8-phase lifecycle: create, remove, clear, reseed with full audit",
    href: "/docs/vector-lifecycle-story",
    icon: RefreshCw,
    color: "bg-indigo-500",
    stats: "Lifecycle checks",
    category: "Operations",
    readTime: "13 min read"
  }
];

const RealAPIStories = () => {
  useEffect(() => {
    document.title = PAGE_TITLE;

    const updateMeta = (selector: string, attribute: string, value: string) => {
      let element = document.querySelector(selector) as HTMLMetaElement | null;
      if (!element) {
        element = document.createElement("meta");
        if (selector.includes("property=")) {
          element.setAttribute(
            "property",
            selector.match(/property="([^"]+)"/)?.[1] || ""
          );
        } else if (selector.includes("name=")) {
          element.setAttribute(
            "name",
            selector.match(/name="([^"]+)"/)?.[1] || ""
          );
        }
        document.head.appendChild(element);
      }
      element.setAttribute(attribute, value);
    };

    const updateCanonical = (href: string) => {
      let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement("link");
        link.setAttribute("rel", "canonical");
        document.head.appendChild(link);
      }
      link.setAttribute("href", href);
    };

    updateMeta('meta[name="description"]', "content", PAGE_DESCRIPTION);
    updateMeta('meta[property="og:title"]', "content", PAGE_TITLE);
    updateMeta('meta[property="og:description"]', "content", PAGE_DESCRIPTION);
    updateMeta('meta[property="og:image"]', "content", `${window.location.origin}/assets/story-preview.png`);
    updateMeta('meta[property="og:type"]', "content", "website");
    updateMeta('meta[property="og:url"]', "content", window.location.href);

    updateMeta('meta[name="twitter:title"]', "content", PAGE_TITLE);
    updateMeta('meta[name="twitter:description"]', "content", PAGE_DESCRIPTION);
    updateMeta('meta[name="twitter:image"]', "content", `${window.location.origin}/assets/story-preview.png`);
    updateMeta('meta[name="twitter:card"]', "content", "summary_large_image");

    updateCanonical(window.location.href);
  }, []);

  return (
    <DocsLayout>
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative overflow-hidden border-b border-border/50 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
          <div className="absolute inset-0 bg-gradient-glow opacity-30" />
          <div className="relative px-6 py-16">
            <div className="mx-auto max-w-6xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center"
              >
                <div className="mb-4 flex items-center justify-center gap-2">
                  <TestTube className="h-6 w-6 text-primary" />
                  <span className="text-sm font-medium uppercase tracking-wider text-primary">
                    Production Integration Tests
                  </span>
                </div>
                <h1 className="mb-4 text-4xl font-bold text-foreground sm:text-5xl lg:text-6xl">
                  🧪 Real API Stories
                </h1>
                <p className="mx-auto max-w-3xl text-lg text-muted-foreground sm:text-xl">
                  Production integration tests told as interactive stories. See the AI Fabric Framework 
                  in action with real-world scenarios, actual API calls, and measurable results.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Stories Grid */}
        <section className="px-6 py-16">
          <div className="mx-auto max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-12 text-center"
            >
              <h2 className="mb-4 text-3xl font-bold text-foreground">
                Explore Real-World Integrations
              </h2>
              <p className="mx-auto max-w-2xl text-muted-foreground">
                Each story demonstrates a complete integration with real API calls, performance metrics, 
                and business impact.
              </p>
            </motion.div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {stories.map((story, index) => {
                const Icon = story.icon;
                return (
                  <motion.div
                    key={story.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Link
                      to={story.href}
                      className="group block h-full overflow-hidden rounded-2xl border border-border/50 bg-card transition-all hover:border-primary/50 hover:shadow-xl"
                    >
                      {/* Preview Image */}
                      <div className="relative aspect-video w-full overflow-hidden">
                        <StoryPreviewImage
                          icon={story.icon}
                          title={story.title}
                          description={story.description}
                          stats={story.stats}
                          category={story.category}
                          color={story.color}
                          className="transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <h3 className="mb-2 text-xl font-bold text-foreground transition-colors group-hover:text-primary">
                          {story.title}
                        </h3>
                        <p className="mb-4 text-sm text-muted-foreground line-clamp-2">
                          {story.description}
                        </p>
                        
                        {/* Stats */}
                        <div className="mb-4 flex items-center justify-between">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <BookOpen className="h-3 w-3" />
                            {story.readTime}
                          </div>
                          <div className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                            {story.stats}
                          </div>
                        </div>

                        {/* CTA */}
                        <div className="flex items-center gap-2 text-sm font-medium text-primary group-hover:gap-3 transition-all">
                          <span>Read Story</span>
                          <ArrowRight className="h-4 w-4" />
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="border-t border-border/50 bg-muted/30 px-6 py-16">
          <div className="mx-auto max-w-4xl text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <h2 className="mb-4 text-3xl font-bold text-foreground">
                Ready to Build Your Own Story?
              </h2>
              <p className="mb-8 text-lg text-muted-foreground">
                Start integrating AI Fabric Framework into your application today. 
                These stories show you exactly how.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link
                  to="/docs/quickstart"
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-lg"
                >
                  Get Started
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  to="/docs"
                  className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-6 py-3 font-semibold text-foreground transition-all hover:border-primary/50 hover:bg-primary/5"
                >
                  View Documentation
                  <ExternalLink className="h-4 w-4" />
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </div>
    </DocsLayout>
  );
};

export default RealAPIStories;
