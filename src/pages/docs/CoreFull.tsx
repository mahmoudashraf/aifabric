import { useEffect } from "react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Highlight, themes } from "prism-react-renderer";
import DocsLayout from "@/components/docs/DocsLayout";
import PageViewCounter from "@/components/PageViewCounter";
import StoryLoveButton from "@/components/StoryLoveButton";
import coreModuleGuide from "@/content/core-module-guide.md?raw";

const PAGE_TITLE = "AI Core Module - Complete Technical Guide";
const PAGE_DESCRIPTION = "Comprehensive technical reference for the AI Core module. Configuration, services, providers, and production-oriented code examples.";

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

const CoreFull = () => {
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

    updateMeta('meta[name="description"]', "content", PAGE_DESCRIPTION);
    updateMeta('meta[property="og:title"]', "content", PAGE_TITLE);
    updateMeta('meta[property="og:description"]', "content", PAGE_DESCRIPTION);
    updateMeta('meta[property="og:type"]', "content", "article");
  }, []);

  return (
    <DocsLayout>
      <div className="min-h-screen">
        {/* Header */}
        <section className="border-b border-border/50 px-6 py-8">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-medium text-primary mb-3">
                📖 Full Technical Guide
              </span>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                AI Core Module - Complete Reference
              </h1>
              <p className="text-muted-foreground mt-2">
                Everything you need to configure, integrate, and optimize the AI Core
              </p>
            </div>
            <div className="flex items-center gap-3">
              <StoryLoveButton storySlug="core_full_guide" />
              <PageViewCounter />
            </div>
          </div>
        </section>

        {/* Markdown Content */}
        <motion.article 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="prose prose-invert max-w-none px-6 py-8"
        >
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              h1: ({ children }) => (
                <h1 className="text-3xl font-bold text-foreground mt-8 mb-4 first:mt-0">{children}</h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-2xl font-bold text-foreground mt-8 mb-4 border-b border-border/50 pb-2">{children}</h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-xl font-semibold text-foreground mt-6 mb-3">{children}</h3>
              ),
              h4: ({ children }) => (
                <h4 className="text-lg font-semibold text-foreground mt-4 mb-2">{children}</h4>
              ),
              p: ({ children }) => (
                <p className="text-muted-foreground leading-relaxed mb-4">{children}</p>
              ),
              ul: ({ children }) => (
                <ul className="list-disc list-inside space-y-2 mb-4 text-muted-foreground">{children}</ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal list-inside space-y-2 mb-4 text-muted-foreground">{children}</ol>
              ),
              li: ({ children }) => (
                <li className="text-muted-foreground">{children}</li>
              ),
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-primary pl-4 italic text-foreground my-4 bg-primary/5 py-2 rounded-r">
                  {children}
                </blockquote>
              ),
              code: ({ className, children, ...props }) => {
                const isInline = !className;
                if (isInline) {
                  return (
                    <code className="rounded bg-muted px-1.5 py-0.5 text-sm font-mono text-primary" {...props}>
                      {children}
                    </code>
                  );
                }
                return <CodeBlock className={className}>{String(children)}</CodeBlock>;
              },
              pre: ({ children }) => <>{children}</>,
              hr: () => <hr className="border-border/50 my-8" />,
              a: ({ href, children }) => (
                <a href={href} className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                  {children}
                </a>
              ),
              strong: ({ children }) => (
                <strong className="font-semibold text-foreground">{children}</strong>
              ),
              table: ({ children }) => (
                <div className="overflow-x-auto my-4">
                  <table className="min-w-full border border-border/50 rounded-lg overflow-hidden">
                    {children}
                  </table>
                </div>
              ),
              thead: ({ children }) => (
                <thead className="bg-muted/50">{children}</thead>
              ),
              th: ({ children }) => (
                <th className="px-4 py-2 text-left font-semibold text-foreground border-b border-border/50">{children}</th>
              ),
              td: ({ children }) => (
                <td className="px-4 py-2 text-muted-foreground border-b border-border/50">{children}</td>
              ),
            }}
          >
            {coreModuleGuide}
          </ReactMarkdown>

          {/* Footer */}
          <footer className="border-t border-border/50 pt-8 mt-12">
            <div className="flex flex-col items-center gap-4">
              <StoryLoveButton storySlug="core_full_guide" />
              <p className="text-sm text-muted-foreground text-center">
                Part of the AI Fabric Framework documentation — comprehensive technical reference
              </p>
            </div>
          </footer>
        </motion.article>
      </div>
    </DocsLayout>
  );
};

export default CoreFull;
