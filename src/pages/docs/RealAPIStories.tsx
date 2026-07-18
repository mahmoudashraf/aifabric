import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ExternalLink, FlaskConical, ShieldCheck } from "lucide-react";

import DocsLayout from "@/components/docs/DocsLayout";
import StoryPreviewImage from "@/components/StoryPreviewImage";
import { realApiStories } from "@/lib/reviewedStoryCatalog";
import { restoredRealApiStories } from "@/lib/storyNavigation";

const PAGE_TITLE = "Real App Story Library - AI Fabric Framework";
const PAGE_DESCRIPTION =
  "Real app story library for deployed AI Fabric demos, release verification, and restored classic Real API scenarios.";

const RealAPIStories = () => {
  useEffect(() => {
    document.title = PAGE_TITLE;

    const updateMeta = (selector: string, attribute: string, value: string) => {
      let element = document.querySelector(selector) as HTMLMetaElement | null;
      if (!element) {
        element = document.createElement("meta");
        if (selector.includes("property=")) {
          element.setAttribute("property", selector.match(/property="([^"]+)"/)?.[1] || "");
        } else if (selector.includes("name=")) {
          element.setAttribute("name", selector.match(/name="([^"]+)"/)?.[1] || "");
        }
        document.head.appendChild(element);
      }
      element.setAttribute(attribute, value);
    };

    updateMeta("meta[name=\"description\"]", "content", PAGE_DESCRIPTION);
    updateMeta("meta[property=\"og:title\"]", "content", PAGE_TITLE);
    updateMeta("meta[property=\"og:description\"]", "content", PAGE_DESCRIPTION);
    updateMeta("meta[property=\"og:type\"]", "content", "website");
    updateMeta("meta[property=\"og:url\"]", "content", window.location.href);
    updateMeta("meta[name=\"twitter:title\"]", "content", PAGE_TITLE);
    updateMeta("meta[name=\"twitter:description\"]", "content", PAGE_DESCRIPTION);
    updateMeta("meta[name=\"twitter:card\"]", "content", "summary_large_image");
  }, []);

  return (
    <DocsLayout>
      <div className="min-h-screen bg-background">
        <section className="border-b border-border/50 px-6 py-14">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto max-w-6xl"
          >
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
                <FlaskConical className="h-3.5 w-3.5" />
                Real app story library
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                <ShieldCheck className="h-3.5 w-3.5" />
                {restoredRealApiStories.length} classic scenarios restored
              </span>
            </div>

            <h1 className="max-w-4xl text-4xl font-black leading-tight tracking-normal text-foreground md:text-6xl">
              Real app stories that show AI Fabric through concrete scenarios.
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-muted-foreground">
              Current deployed demo stories stay first, and the restored Real API scenario pages are linked below
              with corrected wording around performance, privacy, and verification.
            </p>
          </motion.div>
        </section>

        <section className="px-6 py-12">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 max-w-3xl">
              <h2 className="text-2xl font-bold text-foreground">Reviewed Demo And Test Stories</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Each card opens a story that points to the live demo, backend architecture page, or release
                verification guide. Unsupported accuracy, revenue, uptime, or compliance claims were not carried forward.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {realApiStories.map((story, index) => (
                <motion.div
                  key={story.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.04 }}
                >
                  <Link
                    to={story.href}
                    className="group block h-full overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all hover:border-primary/40 hover:shadow-md"
                  >
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

                    <div className="flex h-full flex-col p-5">
                      <h3 className="text-xl font-bold text-foreground transition-colors group-hover:text-primary">
                        {story.title}
                      </h3>
                      <p className="mt-2 flex-1 text-sm leading-6 text-muted-foreground">
                        {story.description}
                      </p>
                      <div className="mt-5 flex items-center justify-between gap-3">
                        <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                          {story.readTime}
                        </span>
                        <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
                          Read story
                          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-border/50 px-6 py-12">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div className="max-w-3xl">
                <h2 className="text-2xl font-bold text-foreground">Restored Classic Real API Scenarios</h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  These classic scenario pages remain useful for showing how AI Fabric maps to domains like
                  commerce, finance, legal discovery, privacy testing, suggestions, embeddings, and vector lifecycle.
                </p>
              </div>
              <span className="w-fit rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                {restoredRealApiStories.length} restored scenarios
              </span>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
              {restoredRealApiStories.map((story, index) => (
                <motion.div
                  key={story.id}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(index * 0.03, 0.25) }}
                  viewport={{ once: true, margin: "-80px" }}
                >
                  <Link
                    to={story.href}
                    className="group block h-full overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all hover:border-primary/40 hover:shadow-md"
                  >
                    <div className="relative aspect-[16/8] w-full overflow-hidden">
                      <StoryPreviewImage
                        icon={story.icon}
                        title={story.title}
                        description={story.description}
                        stats="Restored scenario"
                        category={story.category}
                        color={story.color}
                        className="transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>

                    <div className="flex h-full flex-col p-5">
                      <span className="mb-2 w-fit rounded-full bg-muted px-2.5 py-1 text-[11px] font-semibold text-muted-foreground">
                        {story.category}
                      </span>
                      <h3 className="text-lg font-bold text-foreground transition-colors group-hover:text-primary">
                        {story.title}
                      </h3>
                      <p className="mt-2 flex-1 text-sm leading-6 text-muted-foreground">
                        {story.description}
                      </p>
                      <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                        Open scenario
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-border/50 bg-muted/30 px-6 py-12">
          <div className="mx-auto flex max-w-5xl flex-col gap-5 rounded-xl border border-border bg-card p-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Want to test them yourself?</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                The demo index contains the current public apps, including about pages with backend module,
                provider, data, and request-flow details.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/demos"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Open Demos
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/docs/live-demos"
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:border-primary/40 hover:text-primary"
              >
                Demo Guide
                <ExternalLink className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </DocsLayout>
  );
};

export default RealAPIStories;
