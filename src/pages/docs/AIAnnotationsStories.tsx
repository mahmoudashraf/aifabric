import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import DocsLayout from "@/components/docs/DocsLayout";
import PageViewCounter from "@/components/PageViewCounter";
import StoryLoveButton from "@/components/StoryLoveButton";
import StoryNavigation from "@/components/StoryNavigation";
import { 
  ShoppingCart, 
  BookOpen, 
  Code, 
  Building2, 
  Trash2, 
  Brain,
  ArrowRight,
  Sparkles,
  Tag,
  Search,
  Zap,
  Package,
  CheckCircle2,
  TrendingUp
} from "lucide-react";

const PAGE_TITLE = "AI Annotations Stories - AI Fabric Framework";
const PAGE_DESCRIPTION = "Discover the power of declarative AI with 4 simple annotations. From e-commerce search to enterprise knowledge—see how annotations transform your codebase.";

const stories = [
  {
    id: "ecommerce",
    title: "E-Commerce Semantic Search",
    subtitle: 'When "Comfy Chair" Finds Your Ergonomic Collection',
    description: "How 4 annotations turned keyword failure into product discovery magic—and boosted conversion by 122%.",
    href: "/docs/ai-annotations-ecommerce",
    icon: ShoppingCart,
    color: "from-blue-500 to-cyan-500",
    stats: "+122% Conversion",
    category: "Use Case",
    readTime: "8 min read",
    highlights: ["Interactive search simulator", "Conversion funnel visualization", "Real product examples"]
  },
  {
    id: "enterprise-knowledge",
    title: "Enterprise Knowledge Management",
    subtitle: 'When "Password Reset" Finally Finds "Account Recovery"',
    description: "How we cut support ticket volume by 60% with semantic search across 5,000+ documents.",
    href: "/docs/ai-annotations-enterprise-knowledge",
    icon: BookOpen,
    color: "from-purple-500 to-pink-500",
    stats: "-60% Tickets",
    category: "Use Case",
    readTime: "10 min read",
    highlights: ["Slack thread recreation", "Real-time support assistant", "Search comparison"]
  },
  {
    id: "developer-guide",
    title: "Developer Deep Dive",
    subtitle: "Mastering AI Annotations in 15 Minutes",
    description: "Everything you need to implement semantic search—code examples, gotchas, and patterns that actually work.",
    href: "/docs/ai-annotations-developer-guide",
    icon: Code,
    color: "from-green-500 to-emerald-500",
    stats: "15 min",
    category: "Audience",
    readTime: "15 min read",
    highlights: ["Interactive annotation explorer", "Decision tree wizard", "Copy-paste ready code"]
  },
  {
    id: "architect",
    title: "Architect's Guide",
    subtitle: "Why Declarative AI Wins (Every Time)",
    description: "Imperative vs Declarative AI—technical debt, scalability, and the architectural decision that changes everything.",
    href: "/docs/ai-annotations-architect",
    icon: Building2,
    color: "from-amber-500 to-orange-500",
    stats: "-90% Code",
    category: "Audience",
    readTime: "12 min read",
    highlights: ["Code comparison", "Architecture diagrams", "ADR example"]
  },
  {
    id: "killing-boilerplate",
    title: "Killing Boilerplate",
    subtitle: "A Murder Mystery (The Victim Deserved It)",
    description: "How 4 annotations eliminated 2,400 lines of repetitive AI infrastructure code across 12 services.",
    href: "/docs/ai-annotations-killing-boilerplate",
    icon: Trash2,
    color: "from-red-500 to-rose-500",
    stats: "-2,400 Lines",
    category: "Problem",
    readTime: "7 min read",
    highlights: ["Crime scene animation", "Git diff visualization", "Kill list tracker"]
  },
  {
    id: "semantic-search",
    title: "Semantic Search That Works",
    subtitle: 'When "Running Shoes" Finds "Athletic Footwear"',
    description: "The fundamental difference between finding strings and finding meaning—and why it changes everything.",
    href: "/docs/ai-annotations-semantic-search",
    icon: Brain,
    color: "from-indigo-500 to-violet-500",
    stats: "87% Relevance",
    category: "Problem",
    readTime: "9 min read",
    highlights: ["Embedding space visualization", "Live examples", "Search flow comparison"]
  },
];

const annotations = [
  { name: "@AICapable", desc: "Enable AI features for entity", icon: Package, color: "text-purple-400" },
  { name: "@AISearchable", desc: "Users can FIND by this", icon: Search, color: "text-blue-400" },
  { name: "@AIContext", desc: "AI needs to KNOW this", icon: Tag, color: "text-green-400" },
  { name: "@AIProcess", desc: "Trigger AI processing", icon: Zap, color: "text-amber-400" },
];

const AIAnnotationsStories = () => {
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

    updateMeta('meta[name="description"]', "content", PAGE_DESCRIPTION);
    updateMeta('meta[property="og:title"]', "content", PAGE_TITLE);
    updateMeta('meta[property="og:description"]', "content", PAGE_DESCRIPTION);
  }, []);

  return (
    <DocsLayout>
      <div className="max-w-6xl mx-auto">
        {/* Top Navigation */}
        <StoryNavigation variant="compact" className="pt-6" />

        {/* Hero */}
        <motion.section 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden border-b border-border/50 pb-12 mb-12 pt-8"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
          <div className="relative">
            <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
              <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                <Sparkles className="h-4 w-4" />
                AI Annotations Series
              </span>
              <div className="flex items-center gap-3">
                <StoryLoveButton storySlug="ai-annotations-stories" />
                <PageViewCounter />
              </div>
            </div>
            
            <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
              The Power of{" "}
              <span className="text-gradient">4 Annotations</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mb-8">
              Declarative AI that actually works. No embedding code. No vector DB boilerplate. 
              Just annotate your entities and let the framework handle the magic.
            </p>

            {/* The 4 Annotations */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              {annotations.map((ann, i) => (
                <motion.div
                  key={ann.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-4 rounded-xl bg-card border border-border/50 hover:border-primary/30 transition-all group"
                >
                  <ann.icon className={`h-6 w-6 ${ann.color} mb-2 group-hover:scale-110 transition-transform`} />
                  <p className={`font-mono font-bold ${ann.color}`}>{ann.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">{ann.desc}</p>
                </motion.div>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 border border-border/50">
                <CheckCircle2 className="h-4 w-4 text-green-400" />
                6 Stories
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 border border-border/50">
                <TrendingUp className="h-4 w-4 text-blue-400" />
                Interactive Examples
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 border border-border/50">
                <Code className="h-4 w-4 text-amber-400" />
                Copy-Paste Ready
              </div>
            </div>
          </div>
        </motion.section>

        {/* Stories Grid */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-8">All Stories</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            {stories.map((story, i) => (
              <motion.div
                key={story.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <Link 
                  to={story.href}
                  className="group block h-full"
                >
                  <div className="h-full p-6 rounded-2xl bg-card border border-border/50 hover:border-primary/50 hover:shadow-xl transition-all duration-300">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-br ${story.color}`}>
                        <story.icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs px-2 py-1 rounded-full bg-muted/50 text-muted-foreground">
                          {story.category}
                        </span>
                        <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-bold">
                          {story.stats}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-bold text-foreground mb-1 group-hover:text-primary transition-colors">
                      {story.title}
                    </h3>
                    <p className="text-sm text-primary/80 mb-3">{story.subtitle}</p>
                    <p className="text-sm text-muted-foreground mb-4">{story.description}</p>

                    {/* Highlights */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {story.highlights.map((highlight, j) => (
                        <span 
                          key={j}
                          className="text-xs px-2 py-1 rounded-full bg-muted/30 text-muted-foreground"
                        >
                          {highlight}
                        </span>
                      ))}
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-border/30">
                      <span className="text-xs text-muted-foreground">{story.readTime}</span>
                      <span className="flex items-center gap-1 text-sm font-medium text-primary group-hover:gap-2 transition-all">
                        Read Story <ArrowRight className="h-4 w-4" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Categories */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-8">Browse by Category</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl bg-blue-500/5 border border-blue-500/30">
              <h3 className="font-bold text-blue-400 mb-3">📦 By Use Case</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/docs/ai-annotations-ecommerce" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
                    <ShoppingCart className="h-4 w-4" /> E-Commerce Semantic Search
                  </Link>
                </li>
                <li>
                  <Link to="/docs/ai-annotations-enterprise-knowledge" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
                    <BookOpen className="h-4 w-4" /> Enterprise Knowledge Management
                  </Link>
                </li>
              </ul>
            </div>
            
            <div className="p-6 rounded-xl bg-green-500/5 border border-green-500/30">
              <h3 className="font-bold text-green-400 mb-3">👥 By Audience</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/docs/ai-annotations-developer-guide" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
                    <Code className="h-4 w-4" /> For Developers
                  </Link>
                </li>
                <li>
                  <Link to="/docs/ai-annotations-architect" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
                    <Building2 className="h-4 w-4" /> For Tech Leads/Architects
                  </Link>
                </li>
              </ul>
            </div>
            
            <div className="p-6 rounded-xl bg-amber-500/5 border border-amber-500/30">
              <h3 className="font-bold text-amber-400 mb-3">🎯 By Problem</h3>
              <ul className="space-y-2">
                <li>
                  <Link to="/docs/ai-annotations-killing-boilerplate" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
                    <Trash2 className="h-4 w-4" /> Killing Boilerplate
                  </Link>
                </li>
                <li>
                  <Link to="/docs/ai-annotations-semantic-search" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
                    <Brain className="h-4 w-4" /> Semantic Search That Works
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Quick Start */}
        <section className="mb-16 p-8 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/5 border border-primary/20">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-foreground mb-4">Start in 5 Minutes</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              All you need is 4 annotations. No embedding service setup. No vector database configuration. Just declare and go.
            </p>
          </div>
          
          <div className="bg-card rounded-xl border border-border/50 p-6 max-w-2xl mx-auto">
            <pre className="text-sm overflow-x-auto">
              <code className="text-muted-foreground">
{`@Entity
@AICapable(entityType = "product")
public class Product {
    
    @AISearchable   // "comfortable" finds "ergonomic"
    private String name;
    
    @AISearchable   // Search by meaning, not keywords
    private String description;
    
    @AIContext      // AI knows for "under $100" queries
    private BigDecimal price;
}

// That's it. Semantic search is now enabled.`}
              </code>
            </pre>
          </div>
          
          <div className="flex justify-center gap-4 mt-8">
            <Link 
              to="/docs/ai-annotations-developer-guide"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-colors"
            >
              <Code className="h-4 w-4" />
              Developer Guide
            </Link>
            <Link 
              to="/docs/ai-annotations-ecommerce"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-border bg-card text-foreground font-semibold hover:bg-muted transition-colors"
            >
              See It In Action →
            </Link>
          </div>
        </section>

        {/* Story Navigation */}
        <StoryNavigation className="mt-12" />

        {/* Footer */}
        <footer className="border-t border-border/50 pt-12 mt-12 flex flex-col items-center gap-6">
          <div className="flex items-center gap-4">
            <StoryLoveButton storySlug="ai-annotations-stories" />
            <PageViewCounter />
          </div>
          <p className="text-sm text-muted-foreground text-center max-w-md">
            Part of the AI Fabric Framework Documentation — Declarative AI Made Simple
          </p>
        </footer>
      </div>
    </DocsLayout>
  );
};

export default AIAnnotationsStories;
