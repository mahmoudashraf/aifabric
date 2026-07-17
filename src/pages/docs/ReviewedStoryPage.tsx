import { useEffect } from "react";
import { Link, Navigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  FileText,
  GitBranch,
  Layers,
  ShieldCheck,
} from "lucide-react";

import DocsLayout from "@/components/docs/DocsLayout";
import StoryNavigation from "@/components/StoryNavigation";
import { getReviewedStory } from "@/lib/reviewedStoryCatalog";

interface ReviewedStoryPageProps {
  storyId: string;
}

const ReviewedStoryPage = ({ storyId }: ReviewedStoryPageProps) => {
  const story = getReviewedStory(storyId);

  useEffect(() => {
    if (!story) {
      return;
    }

    document.title = `${story.title} - AI Fabric Framework`;

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

    updateMeta("meta[name=\"description\"]", "content", story.description);
    updateMeta("meta[property=\"og:title\"]", "content", `${story.title} - AI Fabric Framework`);
    updateMeta("meta[property=\"og:description\"]", "content", story.description);
    updateMeta("meta[property=\"og:type\"]", "content", "article");
    updateMeta("meta[property=\"og:url\"]", "content", window.location.href);
    updateMeta("meta[name=\"twitter:title\"]", "content", `${story.title} - AI Fabric Framework`);
    updateMeta("meta[name=\"twitter:description\"]", "content", story.description);
    updateMeta("meta[name=\"twitter:card\"]", "content", "summary_large_image");
  }, [story]);

  if (!story) {
    return <Navigate to="/docs" replace />;
  }

  const Icon = story.icon;

  return (
    <DocsLayout>
      <div className="min-h-screen bg-background">
        <StoryNavigation variant="compact" className="px-6 pt-6" />

        <section className="border-b border-border/50 px-6 py-14">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-auto max-w-5xl"
          >
            <div className="mb-5 flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
                <Icon className="h-3.5 w-3.5" />
                {story.heroKicker}
              </span>
              <span className="rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
                Reviewed for AI Fabric 0.3.3
              </span>
            </div>

            <h1 className="max-w-4xl text-4xl font-black leading-tight tracking-normal text-foreground md:text-6xl">
              {story.heroTitle}
            </h1>
            <p className="mt-5 max-w-3xl text-lg leading-8 text-muted-foreground">
              {story.heroLead}
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              <div className="rounded-lg border border-border bg-card p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Capability
                </p>
                <p className="mt-2 text-2xl font-black text-foreground">{story.category}</p>
              </div>
              <div className="rounded-lg border border-border bg-card p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Story Type
                </p>
                <p className="mt-2 text-2xl font-black text-foreground">
                  {story.collection === "user-stories" ? "Framework" : "Real App"}
                </p>
              </div>
              <div className="rounded-lg border border-border bg-card p-4">
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Proof
                </p>
                <p className="mt-2 text-2xl font-black text-foreground">{story.stats}</p>
              </div>
            </div>
          </motion.div>
        </section>

        <section className="px-6 py-12">
          <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <motion.article
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="rounded-xl border border-border bg-card p-6 shadow-sm"
            >
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Layers className="h-5 w-5" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">Why This Story Matters</h2>
              </div>
              <p className="text-base leading-7 text-muted-foreground">{story.whyItMatters}</p>
              <div className="mt-6 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
                This is a narrative companion, not a separate API reference. Use the linked guides and
                demo architecture pages for exact dependencies, endpoints, and release checks.
              </div>
            </motion.article>

            <motion.aside
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="rounded-xl border border-border bg-card p-6 shadow-sm"
            >
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h2 className="text-2xl font-bold text-foreground">Current Status</h2>
              </div>
              <div className="space-y-3">
                {story.currentStatus.map((item) => (
                  <div key={item} className="flex gap-3 text-sm leading-6 text-muted-foreground">
                    <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-emerald-600" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </motion.aside>
          </div>
        </section>

        <section className="border-y border-border/50 bg-muted/30 px-6 py-12">
          <div className="mx-auto max-w-6xl">
            <div className="mb-6 flex items-center gap-3">
              <GitBranch className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-bold text-foreground">Request Flow</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-4">
              {story.requestFlow.map((step, index) => (
                <motion.div
                  key={step}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="rounded-lg border border-border bg-background p-4"
                >
                  <span className="mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                    {index + 1}
                  </span>
                  <p className="text-sm leading-6 text-muted-foreground">{step}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-6 py-12">
          <div className="mx-auto max-w-6xl">
            <div className="mb-6 flex items-center gap-3">
              <FileText className="h-5 w-5 text-primary" />
              <h2 className="text-2xl font-bold text-foreground">Code-Backed Evidence</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {story.evidenceLinks.map((link) => (
                <Link
                  key={link.href}
                  to={link.href}
                  className="group rounded-xl border border-border bg-card p-5 shadow-sm transition-all hover:border-primary/40 hover:shadow-md"
                >
                  <h3 className="text-lg font-bold text-foreground transition-colors group-hover:text-primary">
                    {link.label}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{link.detail}</p>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                    Open evidence
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-border/50 px-6 py-12">
          <div className="mx-auto flex max-w-6xl flex-col gap-5 rounded-xl border border-primary/20 bg-primary/5 p-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground">Try The Current Path</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                This reviewed story is wired to current docs or live demos instead of older draft pages.
              </p>
            </div>
            <Link
              to={story.nextStepHref}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
            >
              {story.nextStepLabel}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="mx-auto mt-10 max-w-6xl">
            <StoryNavigation />
          </div>
        </section>
      </div>
    </DocsLayout>
  );
};

export default ReviewedStoryPage;
