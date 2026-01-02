import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { BookOpen, ChevronRight } from "lucide-react";
import DocsLayout from "@/components/docs/DocsLayout";

const docCategories = [
  {
    title: "User Stories",
    description: "Learn through real-world scenarios and use cases",
    icon: "📖",
    items: [
      {
        title: "The Orchestrator Story",
        description: "Your AI's Bodyguard, Traffic Cop, and Mind Reader",
        href: "/docs/orchestrator_story",
        status: "available",
      },
      {
        title: "Orchestrator Story V2 (Narrative)",
        description: "The 3 AM call that changed everything—security and trust",
        href: "/docs/orchestrator_story_v2",
        status: "available",
      },
      {
        title: "The RAG Story",
        description: "Building intelligent search that actually understands",
        href: "/docs/rag_story",
        status: "available",
      },
      {
        title: "RAG Story V2 (Narrative)",
        description: "The $47.23 that almost cost everything",
        href: "/docs/rag_story_v2",
        status: "available",
      },
      {
        title: "The Behavior Story",
        description: "Predict churn with 87% accuracy using AI patterns",
        href: "/docs/behavior_story",
        status: "available",
      },
      {
        title: "Behavior Story V2 (Narrative)",
        description: "The customer we almost lost—Jessica's journey",
        href: "/docs/behavior_story_v2",
        status: "available",
      },
      {
        title: "The Indexing Story",
        description: "Index 2000 entities per second efficiently",
        href: "/docs/indexing_story",
        status: "available",
      },
      {
        title: "Indexing Story V2 (Narrative)",
        description: "The Black Friday that almost broke us—Sarah's story",
        href: "/docs/indexing_story_v2",
        status: "available",
      },
      {
        title: "The Storage Story",
        description: "Smart storage strategies for AI applications",
        href: "/docs/storage_story",
        status: "available",
      },
      {
        title: "Storage Story V2 (Narrative)",
        description: "The table that grew too big—a growth story",
        href: "/docs/storage_story_v2",
        status: "available",
      },
      {
        title: "The Intent Extraction Story",
        description: "How AI understands what users want—cleanly and elegantly",
        href: "/docs/intent_story",
        status: "available",
      },
      {
        title: "Intent Story V2 (Narrative)",
        description: "A storytelling approach to understanding intent extraction",
        href: "/docs/intent_story_v2",
        status: "available",
      },
      {
        title: "The Migration Story",
        description: "Zero-downtime migrations for enterprise systems",
        href: "/docs/migration_story",
        status: "available",
      },
      {
        title: "Migration Story V2 (Narrative)",
        description: "The weekend that never was—a migration tale",
        href: "/docs/migration_story_v2",
        status: "available",
      },
    ],
  },
  {
    title: "Core Modules",
    description: "Deep dive into framework components",
    icon: "🧩",
    items: [
      {
        title: "AI Core",
        description: "From 6 months to 5 minutes—one annotation for everything AI",
        href: "/docs/modules/core",
        status: "available",
      },
      {
        title: "AI Core V2 (Narrative)",
        description: "The sprint that changed everything",
        href: "/docs/core_story_v2",
        status: "available",
      },
      {
        title: "Orchestrator",
        description: "Request handling, security, and routing",
        href: "/docs/modules/orchestrator",
        status: "coming-soon",
      },
      {
        title: "Web Module",
        description: "59 REST endpoints, zero code",
        href: "/docs/modules/web",
        status: "coming-soon",
      },
    ],
  },
  {
    title: "Advanced Features",
    description: "Unlock the full power of AI Fabric",
    icon: "🚀",
    items: [
      {
        title: "Behavior Analytics",
        description: "Churn prediction, sentiment analysis",
        href: "/docs/features/behavior",
        status: "coming-soon",
      },
      {
        title: "Relationship Query",
        description: "Natural language to SQL",
        href: "/docs/features/query",
        status: "coming-soon",
      },
      {
        title: "ONNX Provider",
        description: "Free local embeddings ($0 API costs)",
        href: "/docs/features/onnx",
        status: "coming-soon",
      },
    ],
  },
];

const Documentation = () => {
  return (
    <DocsLayout>
      <div className="min-h-screen">
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-border/50">
          <div className="absolute inset-0 bg-gradient-glow opacity-50" />
          <div className="px-6 py-16 relative">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-3xl"
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-medium text-primary mb-6">
                <BookOpen className="h-4 w-4" />
                AI Fabric Framework
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                Documentation
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl">
                Learn how to build production-ready AI applications with AI Fabric. 
                From quick starts to advanced patterns, we've got you covered.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Categories */}
        <section className="px-6 py-12">
          <div className="max-w-5xl space-y-12">
            {docCategories.map((category, categoryIndex) => (
              <motion.div 
                key={category.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: categoryIndex * 0.1 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-2xl">{category.icon}</span>
                  <div>
                    <h2 className="text-xl font-bold text-foreground">{category.title}</h2>
                    <p className="text-sm text-muted-foreground">{category.description}</p>
                  </div>
                </div>
                
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                  {category.items.map((item) => (
                    <Link
                      key={item.href}
                      to={item.status === "available" ? item.href : "#"}
                      onClick={(e) => item.status !== "available" && e.preventDefault()}
                      className={`group relative rounded-xl border p-5 transition-all ${
                        item.status === "available"
                          ? "border-border/50 bg-card hover:border-primary/50 hover:shadow-lg cursor-pointer"
                          : "border-border/30 bg-muted/30 cursor-not-allowed opacity-60"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                          {item.title}
                        </h3>
                        {item.status === "available" ? (
                          <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                        ) : (
                          <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                            Soon
                          </span>
                        )}
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {item.description}
                      </p>
                    </Link>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Quick Stats */}
        <section className="border-t border-border/50 bg-muted/30 px-6 py-12">
          <div className="max-w-5xl">
            <h2 className="text-xl font-bold text-foreground mb-6">Framework Stats</h2>
            <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
              {[
                { value: "10M+", label: "Entities Indexed" },
                { value: "100M+", label: "Embeddings Generated" },
                { value: "500-2000/s", label: "Indexing Speed" },
                { value: "99.9%", label: "Uptime" },
              ].map((stat) => (
                <div key={stat.label} className="rounded-lg border border-border/50 bg-card p-4 text-center">
                  <p className="text-2xl font-bold text-gradient">{stat.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </DocsLayout>
  );
};

export default Documentation;
