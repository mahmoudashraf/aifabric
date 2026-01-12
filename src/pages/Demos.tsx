import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, CreditCard, MessageSquare, TrendingUp, Shield, Zap, HelpCircle, Search, Bot, FileText, Upload, ShoppingBag, Users, Heart, Smile, Activity, Code, Calendar, ListTodo } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";

const demos = [
  {
    id: "subscription-management-hub",
    title: "Subscription Management Hub",
    description: "AI-powered SaaS subscription management with natural language interface, churn prediction, and smart recommendations.",
    icon: CreditCard,
    status: "featured" as const,
    features: [
      { icon: MessageSquare, label: "Natural Language Interface" },
      { icon: TrendingUp, label: "Churn Prediction" },
      { icon: Shield, label: "PII Detection" },
      { icon: Zap, label: "Intent Action Handling" },
    ],
    stats: [
      { value: "20-35%", label: "Churn Reduction" },
      { value: "40-50%", label: "Fewer Tickets" },
      { value: "<30s", label: "Action Time" },
    ],
    link: "/demos/subscription-management-hub",
  },
  {
    id: "smart-faq-assistant",
    title: "Smart FAQ Assistant",
    description: "AI-powered FAQ system with semantic search, RAG-based answers, and intelligent query understanding.",
    icon: HelpCircle,
    status: "new" as const,
    features: [
      { icon: Search, label: "Semantic Search" },
      { icon: Bot, label: "RAG Generation" },
      { icon: MessageSquare, label: "Hybrid Search" },
      { icon: FileText, label: "Query Expansion" },
    ],
    stats: [
      { value: "40-60%", label: "Fewer Tickets" },
      { value: "2-3 weeks", label: "Implementation" },
      { value: "8", label: "Endpoints" },
    ],
    link: "/demos/smart-faq-assistant",
  },
  {
    id: "document-intelligence-hub",
    title: "Document Intelligence Hub",
    description: "AI-powered document processing with PII detection, semantic search, and RAG-based Q&A across all your documents.",
    icon: FileText,
    status: "new" as const,
    features: [
      { icon: Shield, label: "PII Detection" },
      { icon: Bot, label: "RAG Q&A" },
      { icon: Search, label: "Semantic Search" },
      { icon: Upload, label: "Async Processing" },
    ],
    stats: [
      { value: "50-70%", label: "Time Savings" },
      { value: "3-4 weeks", label: "Implementation" },
      { value: "12", label: "Endpoints" },
    ],
    link: "/demos/document-intelligence-hub",
  },
  {
    id: "product-discovery-engine",
    title: "Product Discovery Engine",
    description: "AI-powered e-commerce search with natural language queries, personalized recommendations, and behavior-based trending detection.",
    icon: ShoppingBag,
    status: "new" as const,
    features: [
      { icon: Search, label: "Semantic Search" },
      { icon: Users, label: "Behavior Tracking" },
      { icon: TrendingUp, label: "Recommendations" },
      { icon: Heart, label: "Query Understanding" },
    ],
    stats: [
      { value: "30-50%", label: "Conversion Lift" },
      { value: "2-3 weeks", label: "Implementation" },
      { value: "10", label: "Endpoints" },
    ],
    link: "/demos/product-discovery-engine",
  },
  {
    id: "team-sentiment-tracker",
    title: "Team Sentiment Tracker",
    description: "AI-powered team morale monitoring with 6-level sentiment analysis, trend detection, and churn prediction.",
    icon: Heart,
    status: "new" as const,
    features: [
      { icon: Activity, label: "Behavior Analytics" },
      { icon: Smile, label: "6-Level Sentiment" },
      { icon: TrendingUp, label: "Trend Detection" },
      { icon: Shield, label: "PII Protection" },
    ],
    stats: [
      { value: "Early", label: "Issue Detection" },
      { value: "2-3 weeks", label: "Implementation" },
      { value: "9", label: "Endpoints" },
    ],
    link: "/demos/team-sentiment-tracker",
  },
  {
    id: "code-documentation-search",
    title: "Code Documentation Search",
    description: "AI-powered semantic search across your codebase with RAG-based answers and code understanding.",
    icon: Code,
    status: "new" as const,
    features: [
      { icon: Search, label: "Semantic Search" },
      { icon: Bot, label: "RAG Answers" },
      { icon: FileText, label: "Code Understanding" },
      { icon: Zap, label: "Multi-Language" },
    ],
    stats: [
      { value: "10x", label: "Faster Search" },
      { value: "2 weeks", label: "Implementation" },
      { value: "7", label: "Endpoints" },
    ],
    link: "/demos/code-documentation-search",
  },
  {
    id: "meeting-notes-analyzer",
    title: "Meeting Notes Analyzer",
    description: "AI-powered meeting analysis with semantic search, action item extraction, and auto-summarization.",
    icon: Calendar,
    status: "new" as const,
    features: [
      { icon: Search, label: "Semantic Search" },
      { icon: Bot, label: "RAG Q&A" },
      { icon: ListTodo, label: "Action Extraction" },
      { icon: Sparkles, label: "Auto-Summary" },
    ],
    stats: [
      { value: "80%", label: "Time Saved" },
      { value: "2-3 weeks", label: "Implementation" },
      { value: "8", label: "Endpoints" },
    ],
    link: "/demos/meeting-notes-analyzer",
  },
];

const Demos = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        {/* Hero Section */}
        <section className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <Badge variant="secondary" className="mb-4">
              <Sparkles className="h-3 w-3 mr-1" />
              Interactive Demos
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              See AI Fabric <span className="text-gradient">in Action</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Explore real-world implementations showcasing how AI Fabric Framework 
              powers intelligent applications with natural language interfaces, 
              semantic search, and behavior analytics.
            </p>
          </motion.div>
        </section>

        {/* Demos Grid */}
        <section className="container mx-auto px-4 py-8">
          <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-1 max-w-4xl mx-auto">
            {demos.map((demo, index) => (
              <motion.div
                key={demo.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={demo.link}>
                  <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-8 shadow-card transition-all duration-300 hover:shadow-lg hover:border-primary/30">
                    {/* Status Badge */}
                    {(demo.status === "featured" || demo.status === "new") && (
                      <div className="absolute top-4 right-4">
                        <Badge className={demo.status === "featured" ? "bg-gradient-primary text-primary-foreground" : "bg-accent text-accent-foreground"}>
                          <Sparkles className="h-3 w-3 mr-1" />
                          {demo.status === "featured" ? "Featured" : "New"}
                        </Badge>
                      </div>
                    )}

                    {/* Header */}
                    <div className="flex items-start gap-4 mb-6">
                      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-primary shadow-glow">
                        <demo.icon className="h-7 w-7 text-primary-foreground" />
                      </div>
                      <div className="flex-1">
                        <h2 className="text-2xl font-bold text-foreground group-hover:text-primary transition-colors">
                          {demo.title}
                        </h2>
                        <p className="text-muted-foreground mt-1">
                          {demo.description}
                        </p>
                      </div>
                    </div>

                    {/* Features */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                      {demo.features.map((feature) => (
                        <div
                          key={feature.label}
                          className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2"
                        >
                          <feature.icon className="h-4 w-4 text-primary" />
                          <span className="text-sm text-foreground">{feature.label}</span>
                        </div>
                      ))}
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between border-t border-border pt-6">
                      <div className="flex gap-8">
                        {demo.stats.map((stat) => (
                          <div key={stat.label} className="text-center">
                            <div className="text-2xl font-bold text-gradient">{stat.value}</div>
                            <div className="text-xs text-muted-foreground">{stat.label}</div>
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center gap-2 text-primary font-medium group-hover:gap-3 transition-all">
                        Explore Demo
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Coming Soon Section */}
        <section className="container mx-auto px-4 py-12">
          <div className="text-center">
            <p className="text-muted-foreground">
              More demos coming soon. Check back for additional AI Fabric implementations!
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Demos;
