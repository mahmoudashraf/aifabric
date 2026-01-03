import { useEffect } from "react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Highlight, themes } from "prism-react-renderer";
import DocsLayout from "@/components/docs/DocsLayout";
import PageViewCounter from "@/components/PageViewCounter";
import StoryLoveButton from "@/components/StoryLoveButton";
import { Brain, BookOpen, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import behaviorStoryContent from "@/content/behavior-analytics-story.md?raw";

const PAGE_TITLE = "Behavior Analytics - Full Guide | AI Fabric Framework";
const PAGE_DESCRIPTION = "Complete technical guide to Behavior Analytics: sentiment analysis, churn prediction, trend detection, and implementation details.";
const OG_IMAGE = "/assets/story-preview.png";

const codeTheme = {
  ...themes.nightOwl,
  plain: {
    ...themes.nightOwl.plain,
    backgroundColor: "hsl(var(--code-bg))",
  },
};

const CodeBlock = ({ children, className }: { children: string; className?: string }) => {
  const match = /language-(\w+)/.exec(className || "");
  const language = match ? match[1] : "text";

  return (
    <Highlight theme={codeTheme} code={children.trim()} language={language}>
      {({ style, tokens, getLineProps, getTokenProps }) => (
        <pre
          className="overflow-x-auto rounded-lg border border-border/50 p-4 text-sm my-4"
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
  );
};

const BehaviorFull = () => {
  useEffect(() => {
    document.title = PAGE_TITLE;
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", PAGE_DESCRIPTION);
    }
    
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle) ogTitle.setAttribute("content", PAGE_TITLE);
    
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) ogDescription.setAttribute("content", PAGE_DESCRIPTION);
    
    const ogImage = document.querySelector('meta[property="og:image"]');
    if (ogImage) ogImage.setAttribute("content", OG_IMAGE);
  }, []);

  return (
    <DocsLayout>
      <div className="max-w-4xl mx-auto">
        <motion.article 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="py-8"
        >
          {/* Back Link */}
          <Link to="/docs/behavior_story">
            <Button variant="ghost" size="sm" className="mb-6 -ml-2">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Visual Story
            </Button>
          </Link>

          {/* Hero Section */}
          <header className="mb-12">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <Brain className="h-4 w-4" />
              <span>Full Technical Guide</span>
              <span className="mx-2">•</span>
              <BookOpen className="h-4 w-4" />
              <span>Complete Documentation</span>
              <span className="mx-2">•</span>
              <PageViewCounter />
            </div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-bold text-foreground mb-6"
            >
              🔮 Behavior Analytics - Full Guide
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-muted-foreground leading-relaxed"
            >
              Complete technical documentation for Behavior Analytics including sentiment analysis, churn prediction, evolutionary AI analysis, and implementation details.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-6 p-4 rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/20"
            >
              <p className="text-sm text-muted-foreground">
                🚧 <strong className="text-foreground">Under active development</strong> | Q1 2026 release | Tested with 10M+ users internally
              </p>
            </motion.div>
          </header>

          {/* Table of Contents */}
          <nav className="mb-12 p-6 rounded-xl bg-card border border-border/50">
            <h2 className="text-lg font-bold text-foreground mb-4">📚 Table of Contents</h2>
            <ul className="space-y-2 text-sm">
              <li><a href="#problem" className="text-primary hover:underline">• The $2M Problem</a></li>
              <li><a href="#how-it-works" className="text-primary hover:underline">• How It Works</a></li>
              <li><a href="#sentiment-levels" className="text-primary hover:underline">• The 6 Sentiment Levels</a></li>
              <li><a href="#trend-directions" className="text-primary hover:underline">• The 5 Trend Directions</a></li>
              <li><a href="#data-flow" className="text-primary hover:underline">• Complete Data Flow</a></li>
              <li><a href="#business-cases" className="text-primary hover:underline">• Real Business Cases</a></li>
              <li><a href="#implementation" className="text-primary hover:underline">• Implementation Guide</a></li>
              <li><a href="#configuration" className="text-primary hover:underline">• Configuration Reference</a></li>
            </ul>
          </nav>

          {/* Love Button */}
          <div className="my-8 flex justify-center">
            <StoryLoveButton storySlug="behavior-analytics-full" />
          </div>

          {/* Main Content */}
          <section className="prose prose-invert max-w-none">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                code({ className, children }) {
                  const isInline = !className;
                  if (isInline) {
                    return (
                      <code className="bg-muted px-1.5 py-0.5 rounded text-primary text-sm">
                        {children}
                      </code>
                    );
                  }
                  return <CodeBlock className={className}>{String(children)}</CodeBlock>;
                },
                h1: ({ children }) => (
                  <h1 className="text-3xl font-bold text-foreground mt-12 mb-6">{children}</h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-2xl font-bold text-foreground mt-10 mb-4 pt-6 border-t border-border">{children}</h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-xl font-semibold text-foreground mt-8 mb-3">{children}</h3>
                ),
                p: ({ children }) => (
                  <p className="text-muted-foreground leading-relaxed mb-4">{children}</p>
                ),
                ul: ({ children }) => (
                  <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-4">{children}</ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal list-inside space-y-2 text-muted-foreground mb-4">{children}</ol>
                ),
                li: ({ children }) => (
                  <li className="text-muted-foreground">{children}</li>
                ),
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground my-4">
                    {children}
                  </blockquote>
                ),
                a: ({ href, children }) => (
                  <a href={href} className="text-primary hover:underline">{children}</a>
                ),
                hr: () => <hr className="border-border my-8" />,
                table: ({ children }) => (
                  <div className="overflow-x-auto my-6">
                    <table className="w-full border border-border/50 rounded-lg overflow-hidden">
                      {children}
                    </table>
                  </div>
                ),
                thead: ({ children }) => (
                  <thead className="bg-muted/50">{children}</thead>
                ),
                th: ({ children }) => (
                  <th className="px-4 py-3 text-left font-semibold text-foreground border-b border-border/50">{children}</th>
                ),
                td: ({ children }) => (
                  <td className="px-4 py-3 text-muted-foreground border-b border-border/30">{children}</td>
                ),
              }}
            >
              {behaviorStoryContent}
            </ReactMarkdown>
          </section>

          {/* Footer CTA */}
          <section className="mt-12 p-6 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">Ready to Get Started?</h2>
            <p className="text-muted-foreground mb-6">
              Part of AI Fabric Framework—production-ready AI infrastructure for Spring Boot.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/docs/behavior_story">
                <Button variant="outline">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Visual Story
                </Button>
              </Link>
              <Link to="/">
                <Button>
                  Explore AI Fabric
                </Button>
              </Link>
            </div>
          </section>

          {/* Footer */}
          <footer className="border-t border-border/50 pt-8 mt-12">
            <div className="flex flex-col items-center gap-4">
              <StoryLoveButton storySlug="behavior-analytics-full" />
              <p className="text-sm text-muted-foreground text-center">
                Part of the AI Fabric Framework series — under active development for Q1 2026
              </p>
            </div>
          </footer>
        </motion.article>
      </div>
    </DocsLayout>
  );
};

export default BehaviorFull;
