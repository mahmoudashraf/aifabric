import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { BookOpen, Clock, ExternalLink } from "lucide-react";
import storyPreview from "@/assets/story-preview.png";

const stories = [
  {
    title: "AI Fabric: Why Adding AI to Your App Takes 5 Months Today (And 5 Minutes in 2026)",
    description: "The Spring Boot framework being built to solve the AI infrastructure problem every dev team faces. A story that every development team knows too well.",
    url: "https://medium.com/@mahmoudashraf/ai-fabric-why-adding-ai-to-your-app-takes-5-months-today-and-5-minutes-in-2026-5564a2cff9ea",
    image: storyPreview,
    readTime: "12 min read",
    date: "Dec 2025",
  },
];

const MediumStoriesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="bg-muted/30 py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <div ref={ref} className="mx-auto max-w-4xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="mb-12 text-center"
          >
            <div className="mb-4 flex items-center justify-center gap-2">
              <BookOpen className="h-6 w-6 text-primary" />
              <span className="text-sm font-medium uppercase tracking-wider text-primary">
                From Our Blog
              </span>
            </div>
            <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
              User Story Series
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Deep dives into AI Fabric Framework, development insights, and the journey to v1.0
            </p>
          </motion.div>

          {/* Stories */}
          <div className="space-y-6">
            {stories.map((story, index) => (
              <motion.a
                key={story.url}
                href={story.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
                className="group block overflow-hidden rounded-2xl border border-border bg-card transition-all hover:border-primary/50 hover:shadow-lg"
              >
                <div className="flex flex-col lg:flex-row">
                  <div className="aspect-video w-full overflow-hidden lg:aspect-auto lg:w-80 lg:flex-shrink-0">
                    <img
                      src={story.image}
                      alt={story.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-1 flex-col justify-between p-6 sm:p-8">
                    <div>
                      <h3 className="mb-3 text-xl font-bold text-foreground transition-colors group-hover:text-primary sm:text-2xl">
                        {story.title}
                      </h3>
                      <p className="mb-4 text-muted-foreground">
                        {story.description}
                      </p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {story.readTime}
                        </span>
                        <span>{story.date}</span>
                      </div>
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 transition-colors group-hover:bg-primary/20">
                        <ExternalLink className="h-5 w-5 text-primary" />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.a>
            ))}
          </div>

          {/* Follow CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10 text-center"
          >
            <a
              href="https://medium.com/@mahmoudashraf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-primary hover:underline"
            >
              Follow on Medium for more updates
              <ExternalLink className="h-4 w-4" />
            </a>
          </motion.div>

          {/* Real API Stories Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-16 rounded-2xl border border-primary/30 bg-primary/5 p-8"
          >
            <div className="mb-6 text-center">
              <h3 className="mb-3 text-2xl font-bold text-foreground">
                🧪 Real API Integration Stories
              </h3>
              <p className="mx-auto max-w-2xl text-muted-foreground">
                Production integration tests told as interactive stories. See the framework in action 
                with real-world scenarios.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <a
                href="/docs/ecommerce-product-discovery-story"
                className="group rounded-lg border border-border bg-card p-5 transition-all hover:border-primary/50 hover:shadow-lg"
              >
                <h4 className="mb-2 font-semibold text-foreground group-hover:text-primary transition-colors">
                  🛍️ E-Commerce Product Discovery
                </h4>
                <p className="text-sm text-muted-foreground">
                  Natural language product search • +40% conversion
                </p>
              </a>
              <a
                href="/docs/financial-fraud-detection-story"
                className="group rounded-lg border border-border bg-card p-5 transition-all hover:border-primary/50 hover:shadow-lg"
              >
                <h4 className="mb-2 font-semibold text-foreground group-hover:text-primary transition-colors">
                  🔒 Financial Fraud Detection
                </h4>
                <p className="text-sm text-muted-foreground">
                  Track suspicious money flows • 87% detection rate
                </p>
              </a>
              <a
                href="/docs/law-firm-document-story"
                className="group rounded-lg border border-border bg-card p-5 transition-all hover:border-primary/50 hover:shadow-lg"
              >
                <h4 className="mb-2 font-semibold text-foreground group-hover:text-primary transition-colors">
                  ⚖️ Law Firm Document Management
                </h4>
                <p className="text-sm text-muted-foreground">
                  From 3 hours to 30 seconds • 50K+ documents
                </p>
              </a>
              <a
                href="/docs/pii-detection-edge-story"
                className="group rounded-lg border border-border bg-card p-5 transition-all hover:border-primary/50 hover:shadow-lg"
              >
                <h4 className="mb-2 font-semibold text-foreground group-hover:text-primary transition-colors">
                  🛡️ PII Detection Edge Spectrum
                </h4>
                <p className="text-sm text-muted-foreground">
                  10-phase testing • $10M+ in fines avoided
                </p>
              </a>
              <a
                href="/docs/smart-suggestions-story"
                className="group rounded-lg border border-border bg-card p-5 transition-all hover:border-primary/50 hover:shadow-lg"
              >
                <h4 className="mb-2 font-semibold text-foreground group-hover:text-primary transition-colors">
                  ✨ Smart Suggestions
                </h4>
                <p className="text-sm text-muted-foreground">
                  AI predictions • +40% engagement
                </p>
              </a>
              <a
                href="/docs/onnx-fallback-story"
                className="group rounded-lg border border-border bg-card p-5 transition-all hover:border-primary/50 hover:shadow-lg"
              >
                <h4 className="mb-2 font-semibold text-foreground group-hover:text-primary transition-colors">
                  💾 ONNX Fallback Readiness
                </h4>
                <p className="text-sm text-muted-foreground">
                  $18K → $0 • 100% private • 15ms latency
                </p>
              </a>
              <a
                href="/docs/real-ai-embedding-story"
                className="group rounded-lg border border-border bg-card p-5 transition-all hover:border-primary/50 hover:shadow-lg"
              >
                <h4 className="mb-2 font-semibold text-foreground group-hover:text-primary transition-colors">
                  ⚡ Real AI Embedding Generation
                </h4>
                <p className="text-sm text-muted-foreground">
                  Product to vector in 15ms • $0 cost • 94% accuracy
                </p>
              </a>
              <a
                href="/docs/vector-lifecycle-story"
                className="group rounded-lg border border-border bg-card p-5 transition-all hover:border-primary/50 hover:shadow-lg"
              >
                <h4 className="mb-2 font-semibold text-foreground group-hover:text-primary transition-colors">
                  🔄 Vector Lifecycle Management
                </h4>
                <p className="text-sm text-muted-foreground">
                  8-phase lifecycle • Zero downtime • Full audit
                </p>
              </a>
            </div>
            <div className="mt-6 text-center">
              <a
                href="/docs"
                className="inline-flex items-center gap-2 text-primary hover:underline"
              >
                View all Real API Stories
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default MediumStoriesSection;
