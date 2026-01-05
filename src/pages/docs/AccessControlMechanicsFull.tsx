import { useEffect } from "react";
import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Highlight, themes } from "prism-react-renderer";
import DocsLayout from "@/components/docs/DocsLayout";
import PageViewCounter from "@/components/PageViewCounter";
import StoryLoveButton from "@/components/StoryLoveButton";
import accessControlMechanicsContent from "@/content/ACCESS_CONTROL_MECHANICS.md?raw";

const PAGE_TITLE = "Access Control Mechanics: Complete Technical Guide - AI Fabric Framework";
const PAGE_DESCRIPTION = "Complete technical guide to multi-layered access control: four layers of defense, SPI pattern, fail-closed security, and implementation patterns.";
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

const AccessControlMechanicsFull = () => {
  useEffect(() => {
    document.title = PAGE_TITLE;

    const absoluteOgImage = `${window.location.origin}${OG_IMAGE}`;

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
    updateMeta('meta[property="og:image"]', "content", absoluteOgImage);
    updateMeta('meta[property="og:type"]', "content", "article");
    updateMeta('meta[property="og:url"]', "content", window.location.href);

    updateMeta('meta[name="twitter:title"]', "content", PAGE_TITLE);
    updateMeta('meta[name="twitter:description"]', "content", PAGE_DESCRIPTION);
    updateMeta('meta[name="twitter:image"]', "content", absoluteOgImage);
    updateMeta('meta[name="twitter:card"]', "content", "summary_large_image");

    updateCanonical(window.location.href);
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
                Access Control Mechanics: Complete Guide
              </h1>
              <p className="text-muted-foreground mt-2 max-w-2xl">
                Complete technical guide to multi-layered access control: four layers of defense, SPI pattern, fail-closed security, and implementation patterns.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <StoryLoveButton storySlug="access_control_mechanics_full" />
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
                <h1 className="text-3xl font-bold text-foreground mt-12 mb-6 first:mt-0 border-b border-border/50 pb-3">{children}</h1>
              ),
              h2: ({ children }) => (
                <h2 className="text-2xl font-bold text-foreground mt-10 mb-4 border-b border-border/30 pb-2">{children}</h2>
              ),
              h3: ({ children }) => (
                <h3 className="text-xl font-semibold text-foreground mt-8 mb-3">{children}</h3>
              ),
              h4: ({ children }) => (
                <h4 className="text-lg font-semibold text-foreground mt-6 mb-2">{children}</h4>
              ),
              p: ({ children }) => (
                <p className="text-muted-foreground leading-relaxed mb-4">{children}</p>
              ),
              ul: ({ children }) => (
                <ul className="list-disc list-inside space-y-2 mb-4 text-muted-foreground ml-4">{children}</ul>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal list-inside space-y-2 mb-4 text-muted-foreground ml-4">{children}</ol>
              ),
              li: ({ children }) => (
                <li className="text-muted-foreground">{children}</li>
              ),
              blockquote: ({ children }) => (
                <blockquote className="border-l-4 border-primary pl-4 italic text-muted-foreground my-4 bg-primary/5 py-2 rounded-r-lg">
                  {children}
                </blockquote>
              ),
              code({ className, children }) {
                const isInline = !className;
                if (isInline) {
                  return (
                    <code className="bg-muted px-1.5 py-0.5 rounded text-primary text-sm font-mono">
                      {children}
                    </code>
                  );
                }
                return <CodeBlock className={className}>{String(children)}</CodeBlock>;
              },
              pre: ({ children }) => <>{children}</>,
              table: ({ children }) => (
                <div className="overflow-x-auto my-6">
                  <table className="min-w-full border-collapse border border-border/50 rounded-lg">
                    {children}
                  </table>
                </div>
              ),
              thead: ({ children }) => (
                <thead className="bg-muted/50">{children}</thead>
              ),
              tbody: ({ children }) => (
                <tbody>{children}</tbody>
              ),
              tr: ({ children }) => (
                <tr className="border-b border-border/30">{children}</tr>
              ),
              th: ({ children }) => (
                <th className="px-4 py-3 text-left font-semibold text-foreground border-r border-border/30 last:border-r-0">
                  {children}
                </th>
              ),
              td: ({ children }) => (
                <td className="px-4 py-3 text-muted-foreground border-r border-border/30 last:border-r-0">
                  {children}
                </td>
              ),
              a: ({ href, children }) => (
                <a href={href} className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                  {children}
                </a>
              ),
              hr: () => <hr className="border-border my-8" />,
              strong: ({ children }) => (
                <strong className="text-foreground font-semibold">{children}</strong>
              ),
              em: ({ children }) => (
                <em className="text-muted-foreground italic">{children}</em>
              ),
            }}
          >
            {accessControlMechanicsContent}
          </ReactMarkdown>
        </motion.article>

        {/* Footer */}
        <section className="border-t border-border/50 px-6 py-8">
          <div className="flex items-center justify-center gap-4">
            <StoryLoveButton storySlug="access_control_mechanics_full" />
            <p className="text-sm text-muted-foreground text-center">
              Part of the AI Fabric Framework series — under active development for Q1 2026
            </p>
          </div>
        </section>
      </div>
    </DocsLayout>
  );
};

export default AccessControlMechanicsFull;






