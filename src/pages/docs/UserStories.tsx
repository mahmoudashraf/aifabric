import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, ExternalLink, Library, ShieldCheck } from "lucide-react";

import DocsLayout from "@/components/docs/DocsLayout";
import StoryPreviewImage from "@/components/StoryPreviewImage";
import { userStories } from "@/lib/reviewedStoryCatalog";

const PAGE_TITLE = "Reviewed User Stories - AI Fabric Framework";
const PAGE_DESCRIPTION =
  "Reviewed narrative stories for current AI Fabric capabilities. Each story links back to release-backed docs, demos, or implementation evidence.";

const UserStories = () => {
  useEffect(() => {
    document.title = PAGE_TITLE;

    const updateMeta = (selector: string, attribute: string, value: string) => {
      let element = document.querySelector(selector) as HTMLMetaElement | null;
      if (!element) {
        element = document.createElement("meta");
        if (selector.includes("property=")) {
          element.setAttribute("property", selector.match(/property=\"([^\"]+)\"/)?.[1] || "");
        } else if (selector.includes("name=")) {
          element.setAttribute("name", selector.match(/name=\"([^\"]+)\"/)?.[1] || "");
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
                <Library className="h-3.5 w-3.5" />
                Reviewed framework stories
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                <ShieldCheck className="h-3.5 w-3.5" />
                Checked against current 0.3.3 docs
              </span>
            </div>

            <h1 className="max-w-4xl text-4xl font-black leading-tight tracking-normal text-foreground md:text-6xl">
              User stories that explain what AI Fabric opens up for Java apps.
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-muted-foreground">
              These are the restored story pages, rebuilt carefully around current framework behavior.
              Older draft stories with unsupported compliance, revenue, accuracy, or outdated API claims stay retired.
            </p>
          </motion.div>
        </section>

        <section className="px-6 py-12">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 max-w-3xl">
              <h2 className="text-2xl font-bold text-foreground">Reviewed Capability Stories</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Each story links to live demos or release-backed guides so a reader can move from narrative
                to implementation without relying on stale screenshots or old package names.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {userStories.map((story, index) => (
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

        <section className="border-t border-border/50 bg-muted/30 px-6 py-12">
          <div className="mx-auto flex max-w-5xl flex-col gap-5 rounded-xl border border-border bg-card p-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Need implementation detail?</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                Start from the release-backed docs when you are ready to add dependencies, configure
                providers, or wire a Spring Boot app.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/docs/getting-started"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/docs"
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-5 py-3 text-sm font-semibold text-foreground transition-colors hover:border-primary/40 hover:text-primary"
              >
                Docs Home
                <ExternalLink className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </DocsLayout>
  );
};

export default UserStories;
