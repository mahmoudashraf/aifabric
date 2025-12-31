import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Highlight, themes } from "prism-react-renderer";

const tabs = [
  {
    id: "dependency",
    label: "1. Add Dependency",
    language: "xml",
    code: `<dependency>
    <groupId>com.ai.fabric</groupId>
    <artifactId>ai-fabric-core</artifactId>
    <version>1.0.0</version>
</dependency>`,
  },
  {
    id: "entity",
    label: "2. Annotate Entity",
    language: "java",
    code: `@Entity
@AICapable(entityType = "product")
public class Product {
    @Id private UUID id;
    private String name;
    private String description;
}`,
  },
  {
    id: "config",
    label: "3. Configure AI Fabric",
    language: "yaml",
    code: `ai-entities:
  product:
    features: ["embedding", "search"]
    enable-search: true
    auto-process: true
    auto-embedding: true
    indexable: true
    searchable-fields:
      - name: name
      - name: description`,
  },
  {
    id: "search",
    label: "4. Search Semantically",
    language: "java",
    code: `@Autowired
private AISearchService searchService;

AISearchResponse results =
    searchService.search("laptop for developers");

// Returns: MacBook Pro, ThinkPad, Dell XPS
// (not laptop bags and stands)`,
  },
];

const HowItWorksSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  const activeTabData = tabs.find((tab) => tab.id === activeTab)!;

  return (
    <section id="how-it-works" className="bg-background py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <div ref={ref} className="mx-auto max-w-4xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="mb-12 text-center"
          >
            <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
              From Database to AI Context in 4 Steps
            </h2>
            <p className="text-lg text-muted-foreground">
              Make your data semantically searchable with automatic embeddings and RAG support
            </p>
          </motion.div>

          {/* Code Tabs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="overflow-hidden rounded-2xl border border-code-border bg-code-bg shadow-2xl"
          >
            {/* Tab Headers */}
            <div className="flex border-b border-code-border">
              {tabs.map((tab, index) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 px-4 py-3 text-sm font-medium transition-colors sm:px-6 ${
                    activeTab === tab.id
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-muted/10 hover:text-foreground"
                  }`}
                >
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">Step {index + 1}</span>
                </button>
              ))}
            </div>

            {/* Code Content */}
            <div className="p-4 sm:p-6">
              <Highlight
                theme={themes.nightOwl}
                code={activeTabData.code}
                language={activeTabData.language as any}
              >
                {({ className, style, tokens, getLineProps, getTokenProps }) => (
                  <pre
                    className={`${className} overflow-x-auto font-mono text-sm leading-relaxed sm:text-base`}
                    style={{ ...style, background: "transparent" }}
                  >
                    {tokens.map((line, i) => {
                      const lineContent = line.map(t => t.content).join('');
                      const isHighlightedLine = lineContent.includes('@AICapable') || 
                        lineContent.includes('AISearchService') || 
                        lineContent.includes('searchService.search');
                      
                      return (
                        <div 
                          key={i} 
                          {...getLineProps({ line })} 
                          className={`flex ${isHighlightedLine ? 'bg-primary/20 -mx-4 px-4 sm:-mx-6 sm:px-6 rounded' : ''}`}
                        >
                          <span className="mr-4 select-none text-muted-foreground/40">
                            {(i + 1).toString().padStart(2, "0")}
                          </span>
                          <span>
                            {line.map((token, key) => {
                              const isAICapable = token.content.includes('@AICapable') || 
                                (lineContent.includes('@AICapable') && (token.content.includes('entityType') || token.content.includes('"product"')));
                              
                              const isSearchHighlight = token.content.includes('AISearchService') || 
                                token.content.includes('searchService') ||
                                token.content.includes('search');
                              
                              const tokenProps = getTokenProps({ token });
                              
                              if (isAICapable || isSearchHighlight) {
                                return (
                                  <span 
                                    key={key} 
                                    {...tokenProps}
                                    className="text-accent font-semibold"
                                    style={{ color: 'hsl(152, 69%, 46%)' }}
                                  />
                                );
                              }
                              
                              return <span key={key} {...tokenProps} />;
                            })}
                          </span>
                        </div>
                      );
                    })}
                  </pre>
                )}
              </Highlight>
            </div>

            {/* Footer */}
            <div className="border-t border-code-border bg-accent/10 px-4 py-3 text-center sm:px-6">
              <p className="text-sm font-medium text-accent">That's it. Really. ✨</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
