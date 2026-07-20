import { Check, Copy, ExternalLink } from "lucide-react";
import { useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import { Highlight, themes } from "prism-react-renderer";
import remarkGfm from "remark-gfm";

const nodeText = (children: ReactNode): string => {
  if (typeof children === "string" || typeof children === "number") return String(children);
  if (Array.isArray(children)) return children.map(nodeText).join("");
  if (children && typeof children === "object" && "props" in children) {
    return nodeText((children as { props?: { children?: ReactNode } }).props?.children);
  }
  return "";
};

const headingId = (children: ReactNode) =>
  nodeText(children)
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");

const CodeBlock = ({ children, className }: { children: string; className?: string }) => {
  const [copied, setCopied] = useState(false);
  const language = className?.replace("language-", "") || "text";
  const value = children.replace(/\n$/, "");

  const copy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="group relative my-5 max-w-full overflow-hidden rounded-md border border-slate-700 bg-slate-950">
      <div className="flex h-10 items-center justify-between border-b border-slate-800 px-4 text-xs text-slate-400">
        <span>{language}</span>
        <button
          type="button"
          onClick={() => void copy()}
          className="inline-flex items-center gap-1.5 rounded px-2 py-1 text-slate-300 transition-colors hover:bg-slate-800 hover:text-white"
        >
          {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <Highlight theme={themes.nightOwl} code={value} language={language as never}>
        {({ className: highlightClass, style, tokens, getLineProps, getTokenProps }) => (
          <pre className={`${highlightClass} overflow-x-auto p-4 text-[13px] leading-6`} style={style}>
            {tokens.map((line, lineIndex) => (
              <div key={lineIndex} {...getLineProps({ line })}>
                {line.map((token, tokenIndex) => (
                  <span key={tokenIndex} {...getTokenProps({ token })} />
                ))}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </div>
  );
};

const isExternal = (href?: string) => Boolean(href && /^(https?:)?\/\//.test(href));

export const CourseMarkdown = ({ markdown }: { markdown: string }) => (
  <div className="max-w-none">
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ children }) => (
          <h1 id={headingId(children)} className="mt-10 scroll-mt-32 text-3xl font-bold tracking-normal text-slate-950 first:mt-0">
            {children}
          </h1>
        ),
        h2: ({ children }) => (
          <h2 id={headingId(children)} className="mt-11 scroll-mt-32 border-b border-border pb-3 text-2xl font-bold tracking-normal text-slate-950">
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 id={headingId(children)} className="mt-8 scroll-mt-32 text-xl font-bold tracking-normal text-slate-900">
            {children}
          </h3>
        ),
        h4: ({ children }) => <h4 className="mt-7 text-base font-bold text-slate-900">{children}</h4>,
        p: ({ children }) => <p className="my-4 text-[15px] leading-7 text-slate-600">{children}</p>,
        ul: ({ children }) => <ul className="my-4 list-disc space-y-2 pl-6 text-[15px] leading-7 text-slate-600">{children}</ul>,
        ol: ({ children }) => <ol className="my-4 list-decimal space-y-2 pl-6 text-[15px] leading-7 text-slate-600">{children}</ol>,
        li: ({ children }) => <li className="pl-1">{children}</li>,
        strong: ({ children }) => <strong className="font-semibold text-slate-900">{children}</strong>,
        blockquote: ({ children }) => (
          <blockquote className="my-6 border-l-4 border-amber-400 bg-amber-50 px-5 py-2 text-slate-700">
            {children}
          </blockquote>
        ),
        code: ({ className, children, ...props }) => {
          if (!className) {
            return (
              <code className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[13px] text-blue-700" {...props}>
                {children}
              </code>
            );
          }
          return <CodeBlock className={className}>{String(children)}</CodeBlock>;
        },
        pre: ({ children }) => <>{children}</>,
        table: ({ children }) => (
          <div className="my-6 max-w-full overflow-x-auto rounded-md border border-border bg-white">
            <table className="min-w-full text-sm">{children}</table>
          </div>
        ),
        thead: ({ children }) => <thead className="bg-slate-50">{children}</thead>,
        th: ({ children }) => <th className="border-b border-border px-4 py-3 text-left font-semibold text-slate-900">{children}</th>,
        td: ({ children }) => <td className="border-b border-border px-4 py-3 align-top leading-6 text-slate-600">{children}</td>,
        a: ({ href, children }) => {
          if (href?.startsWith("/")) return <Link to={href} className="font-medium text-blue-700 hover:underline">{children}</Link>;
          return (
            <a
              href={href}
              target={isExternal(href) ? "_blank" : undefined}
              rel={isExternal(href) ? "noopener noreferrer" : undefined}
              className="inline-flex items-center gap-1 font-medium text-blue-700 hover:underline"
            >
              {children}
              {isExternal(href) && <ExternalLink className="h-3.5 w-3.5" />}
            </a>
          );
        },
        hr: () => <hr className="my-10 border-border" />,
      }}
    >
      {markdown}
    </ReactMarkdown>
  </div>
);
