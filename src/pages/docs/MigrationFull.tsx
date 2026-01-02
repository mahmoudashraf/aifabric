import { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Highlight, themes } from 'prism-react-renderer';
import DocsLayout from '@/components/docs/DocsLayout';
import { Badge } from '@/components/ui/badge';
import StoryLoveButton from '@/components/StoryLoveButton';
import migrationContent from '@/content/migration-module-story.md?raw';

interface CodeProps {
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const CodeBlock = ({ inline, className, children }: CodeProps) => {
  const match = /language-(\w+)/.exec(className || '');
  const language = match ? match[1] : '';
  const code = String(children).replace(/\n$/, '');

  if (inline) {
    return (
      <code className="bg-secondary/50 px-1.5 py-0.5 rounded text-sm font-mono text-primary">
        {children}
      </code>
    );
  }

  // For ASCII diagrams and non-highlighted code
  if (!language || language === 'text' || language === '') {
    return (
      <div className="relative my-4">
        <pre className="bg-[#1a1b26] rounded-lg p-4 overflow-x-auto border border-border/50">
          <code className="text-sm font-mono text-gray-300 whitespace-pre">
            {code}
          </code>
        </pre>
      </div>
    );
  }

  return (
    <div className="relative my-4">
      <div className="absolute top-2 right-2 z-10">
        <Badge variant="secondary" className="text-xs">{language}</Badge>
      </div>
      <Highlight theme={themes.nightOwl} code={code} language={language as any}>
        {({ className: highlightClassName, style, tokens, getLineProps, getTokenProps }) => (
          <pre className={`${highlightClassName} rounded-lg p-4 overflow-x-auto border border-border/50`} style={style}>
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line })}>
                <span className="text-gray-500 text-xs mr-4 select-none">{String(i + 1).padStart(3, ' ')}</span>
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token })} />
                ))}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </div>
  );
};

export default function MigrationFull() {
  const [content, setContent] = useState<string>('');

  useEffect(() => {
    setContent(migrationContent);
  }, []);

  return (
    <DocsLayout>
      <article className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Badge variant="outline" className="text-yellow-400 border-yellow-400/50">
              🚧 Under Development
            </Badge>
            <Badge variant="secondary">Q1 2026</Badge>
            <Badge variant="secondary">Full Guide</Badge>
          </div>
        </header>

        {/* Markdown Content */}
        <div className="prose prose-invert prose-lg max-w-none
          prose-headings:text-foreground prose-headings:font-bold
          prose-h1:text-4xl prose-h1:mb-6 prose-h1:mt-8
          prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h2:border-b prose-h2:border-border/50 prose-h2:pb-2
          prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
          prose-h4:text-lg prose-h4:mt-4 prose-h4:mb-2
          prose-p:text-muted-foreground prose-p:leading-relaxed
          prose-a:text-primary prose-a:no-underline hover:prose-a:underline
          prose-strong:text-foreground
          prose-em:text-muted-foreground
          prose-blockquote:border-l-primary prose-blockquote:bg-secondary/30 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r-lg prose-blockquote:not-italic
          prose-ul:text-muted-foreground prose-ol:text-muted-foreground
          prose-li:marker:text-primary
          prose-hr:border-border/50
          prose-table:border-collapse
          prose-th:bg-secondary/50 prose-th:px-4 prose-th:py-2 prose-th:border prose-th:border-border/50
          prose-td:px-4 prose-td:py-2 prose-td:border prose-td:border-border/50
        ">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              code: CodeBlock as any,
            }}
          >
            {content}
          </ReactMarkdown>
        </div>

        {/* Footer */}
        <footer className="border-t border-border/50 pt-8 mt-12">
          <div className="flex flex-col items-center gap-4">
            <StoryLoveButton storySlug="migration-module-full" />
            <p className="text-sm text-muted-foreground text-center">
              Part of the AI Fabric Framework series — under active development for Q1 2026
            </p>
          </div>
        </footer>
      </article>
    </DocsLayout>
  );
}
