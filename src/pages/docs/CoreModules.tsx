import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import DocsLayout from "@/components/docs/DocsLayout";
import StoryPreviewImage from "@/components/StoryPreviewImage";
import { 
  Brain, 
  Shield, 
  Globe, 
  ArrowRight,
  ExternalLink,
  Puzzle
} from "lucide-react";

const PAGE_TITLE = "Core Modules - AI Fabric Framework";
const PAGE_DESCRIPTION = "Deep dive into framework components. Learn how each module works and how to use them in your applications.";

const modules = [
  {
    id: "ai-core",
    title: "AI Core",
    description: "Core annotations, orchestration, providers, actions, and policy hooks",
    href: "/docs/modules/core",
    icon: Brain,
    color: "bg-purple-500",
    category: "Core",
    status: "available",
  },
  {
    id: "ai-core-v2",
    title: "AI Core V2 (Narrative)",
    description: "The sprint that changed everything",
    href: "/docs/core_story_v2",
    icon: Brain,
    color: "bg-purple-500",
    category: "Core",
    status: "available",
  },
  {
    id: "orchestrator",
    title: "Orchestrator",
    description: "Request handling, security, and routing",
    href: "/docs/modules/orchestrator",
    icon: Shield,
    color: "bg-blue-500",
    category: "Security",
    status: "coming-soon",
  },
  {
    id: "web-module",
    title: "Web Module",
    description: "59 REST endpoints, zero code",
    href: "/docs/modules/web",
    icon: Globe,
    color: "bg-green-500",
    category: "API",
    status: "coming-soon",
  },
];

const CoreModules = () => {
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
                  <Puzzle className="h-6 w-6 text-primary" />
                  <span className="text-sm font-medium uppercase tracking-wider text-primary">
                    Framework Components
                  </span>
                </div>
                <h1 className="mb-4 text-4xl font-bold text-foreground sm:text-5xl lg:text-6xl">
                  🧩 Core Modules
                </h1>
                <p className="mx-auto max-w-3xl text-lg text-muted-foreground sm:text-xl">
                  Deep dive into framework components. Learn how each module works 
                  and how to use them in your applications.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Modules Grid */}
        <section className="px-6 py-16">
          <div className="mx-auto max-w-7xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-12 text-center"
            >
              <h2 className="mb-4 text-3xl font-bold text-foreground">
                Explore Core Modules
              </h2>
              <p className="mx-auto max-w-2xl text-muted-foreground">
                Each module is designed to solve specific problems in AI application development.
              </p>
            </motion.div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {modules.map((module, index) => {
                const Icon = module.icon;
                return (
                  <motion.div
                    key={module.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Link
                      to={module.status === "available" ? module.href : "#"}
                      onClick={(e) => module.status !== "available" && e.preventDefault()}
                      className={`group block h-full overflow-hidden rounded-2xl border transition-all ${
                        module.status === "available"
                          ? "border-border/50 bg-card hover:border-primary/50 hover:shadow-xl cursor-pointer"
                          : "border-border/30 bg-muted/30 cursor-not-allowed opacity-60"
                      }`}
                    >
                      {/* Preview Image */}
                      <div className="relative aspect-video w-full overflow-hidden">
                        <StoryPreviewImage
                          icon={module.icon}
                          title={module.title}
                          description={module.description}
                          stats={module.category}
                          category={module.category}
                          color={module.color}
                          className="transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>

                      {/* Content */}
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-xl font-bold text-foreground transition-colors group-hover:text-primary">
                            {module.title}
                          </h3>
                          {module.status === "coming-soon" && (
                            <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                              Soon
                            </span>
                          )}
                        </div>
                        <p className="mb-4 text-sm text-muted-foreground line-clamp-2">
                          {module.description}
                        </p>
                        
                        {/* CTA */}
                        {module.status === "available" && (
                          <div className="flex items-center gap-2 text-sm font-medium text-primary group-hover:gap-3 transition-all">
                            <span>Learn More</span>
                            <ArrowRight className="h-4 w-4" />
                          </div>
                        )}
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
                Ready to Explore More?
              </h2>
              <p className="mb-8 text-lg text-muted-foreground">
                Check out our user stories and real API integration examples.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link
                  to="/docs/user-stories"
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-semibold text-primary-foreground transition-all hover:bg-primary/90 hover:shadow-lg"
                >
                  View User Stories
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

export default CoreModules;

