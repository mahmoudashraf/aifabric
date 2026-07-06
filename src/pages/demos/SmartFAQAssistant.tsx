import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  Send,
  Bot,
  User,
  Sparkles,
  HelpCircle,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  BookOpen,
  Tag,
  Eye,
  Clock,
  ChevronRight,
  Lightbulb,
  FileText,
  Filter,
  TrendingUp,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";

// Mock FAQ data
const faqArticles = [
  {
    id: "1",
    title: "How do I reset my password?",
    content: "To reset your password, click on 'Forgot Password' on the login page. Enter your email address, and we'll send you a secure link to create a new password. The link expires in 24 hours for security.",
    category: "Account",
    tags: ["password", "login", "security"],
    helpfulCount: 234,
    viewCount: 1892,
    lastUpdated: "2026-01-05",
  },
  {
    id: "2",
    title: "What payment methods do you accept?",
    content: "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, and bank transfers for annual subscriptions. Enterprise customers can also pay via invoice with NET-30 terms.",
    category: "Billing",
    tags: ["payment", "credit card", "billing"],
    helpfulCount: 189,
    viewCount: 1456,
    lastUpdated: "2026-01-03",
  },
  {
    id: "3",
    title: "How do I cancel my subscription?",
    content: "You can cancel your subscription at any time from Account Settings > Subscription > Cancel Plan. Your access continues until the end of your billing period. We also offer pause options if you need a temporary break.",
    category: "Subscription",
    tags: ["cancel", "subscription", "billing"],
    helpfulCount: 156,
    viewCount: 2341,
    lastUpdated: "2026-01-08",
  },
  {
    id: "4",
    title: "How do I integrate with Slack?",
    content: "To integrate with Slack: 1) Go to Settings > Integrations, 2) Click 'Connect Slack', 3) Authorize in Slack, 4) Select channels for notifications. You can customize which events trigger notifications.",
    category: "Integrations",
    tags: ["slack", "integration", "notifications"],
    helpfulCount: 98,
    viewCount: 876,
    lastUpdated: "2025-12-20",
  },
  {
    id: "5",
    title: "What's included in the Pro plan?",
    content: "The Pro plan includes: Unlimited users, 100GB storage, Priority support (24h response), Advanced analytics, API access, Custom integrations, and SSO authentication. Perfect for growing teams.",
    category: "Plans",
    tags: ["pro", "features", "pricing"],
    helpfulCount: 267,
    viewCount: 3102,
    lastUpdated: "2026-01-10",
  },
  {
    id: "6",
    title: "How do I export my data?",
    content: "Export your data from Settings > Data > Export. Choose format (CSV, JSON, or PDF) and data range. Large exports are processed in background and you'll receive an email with download link when ready.",
    category: "Data",
    tags: ["export", "data", "download"],
    helpfulCount: 145,
    viewCount: 987,
    lastUpdated: "2026-01-02",
  },
];

const categories = ["All", "Account", "Billing", "Subscription", "Integrations", "Plans", "Data"];

const popularQuestions = [
  "How do I reset my password?",
  "What payment methods do you accept?",
  "How do I cancel my subscription?",
  "What's included in the Pro plan?",
];

interface Message {
  id: string;
  type: "user" | "ai";
  content: string;
  sources?: { id: string; title: string }[];
  timestamp: Date;
}

const SmartFAQAssistant = () => {
  const [activeTab, setActiveTab] = useState("search");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "ai",
      content: "👋 Hi! I'm your Smart FAQ Assistant powered by AI Fabric. Ask me anything about our product, and I'll find the most relevant answers using semantic search and RAG.",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [feedback, setFeedback] = useState<Record<string, "up" | "down" | null>>({});

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    // Semantic search simulation
    const query = searchQuery.toLowerCase();
    return faqArticles.filter(
      (article) =>
        article.title.toLowerCase().includes(query) ||
        article.content.toLowerCase().includes(query) ||
        article.tags.some((tag) => tag.includes(query)) ||
        // Semantic matching simulation
        (query.includes("password") && article.tags.includes("password")) ||
        (query.includes("pay") && article.category === "Billing") ||
        (query.includes("cancel") && article.tags.includes("cancel")) ||
        (query.includes("slack") && article.tags.includes("slack")) ||
        (query.includes("pro") && article.tags.includes("pro"))
    );
  };

  const filteredArticles = searchQuery
    ? handleSearch()
    : faqArticles.filter((article) => 
        selectedCategory === "All" || article.category === selectedCategory
      );

  const generateAIResponse = (question: string): { content: string; sources: { id: string; title: string }[] } => {
    const q = question.toLowerCase();
    
    if (q.includes("password") || q.includes("reset") || q.includes("forgot")) {
      return {
        content: "To reset your password:\n\n1. Go to the login page\n2. Click 'Forgot Password'\n3. Enter your registered email\n4. Check your inbox for a reset link (expires in 24 hours)\n5. Create a new secure password\n\nIf you don't receive the email, check your spam folder or contact support.",
        sources: [{ id: "1", title: "How do I reset my password?" }],
      };
    } else if (q.includes("payment") || q.includes("pay") || q.includes("credit card")) {
      return {
        content: "We accept multiple payment methods:\n\n💳 **Credit Cards:** Visa, MasterCard, American Express\n💰 **PayPal:** For all subscription types\n🏦 **Bank Transfer:** Available for annual plans\n📄 **Invoice:** Enterprise customers with NET-30 terms\n\nAll payments are processed securely with PCI-DSS compliance.",
        sources: [{ id: "2", title: "What payment methods do you accept?" }],
      };
    } else if (q.includes("cancel") || q.includes("unsubscribe")) {
      return {
        content: "To cancel your subscription:\n\n1. Go to **Account Settings**\n2. Navigate to **Subscription**\n3. Click **Cancel Plan**\n\n⏰ Your access continues until the billing period ends.\n💡 **Tip:** We also offer pause options if you need a temporary break instead of full cancellation.",
        sources: [{ id: "3", title: "How do I cancel my subscription?" }],
      };
    } else if (q.includes("slack") || q.includes("integration")) {
      return {
        content: "To integrate with Slack:\n\n1. Go to **Settings > Integrations**\n2. Click **Connect Slack**\n3. Authorize the app in Slack\n4. Select which channels receive notifications\n\nYou can customize notification triggers for different events like new users, alerts, or updates.",
        sources: [{ id: "4", title: "How do I integrate with Slack?" }],
      };
    } else if (q.includes("pro") || q.includes("plan") || q.includes("feature")) {
      return {
        content: "The **Pro Plan** ($49/month) includes:\n\n✅ Unlimited users\n✅ 100GB storage\n✅ Priority support (24h response)\n✅ Advanced analytics\n✅ API access\n✅ Custom integrations\n✅ SSO authentication\n\nPerfect for growing teams that need advanced features and priority support.",
        sources: [{ id: "5", title: "What's included in the Pro plan?" }],
      };
    } else if (q.includes("export") || q.includes("download") || q.includes("data")) {
      return {
        content: "To export your data:\n\n1. Go to **Settings > Data > Export**\n2. Choose format: CSV, JSON, or PDF\n3. Select date range\n4. Click Export\n\nLarge exports are processed in background and you'll receive an email with the download link when ready.",
        sources: [{ id: "6", title: "How do I export my data?" }],
      };
    } else {
      return {
        content: "I couldn't find a specific answer to your question. Here are some things I can help with:\n\n• Password reset and account access\n• Payment methods and billing\n• Subscription management\n• Integrations (Slack, etc.)\n• Plan features and pricing\n• Data export options\n\nCould you rephrase your question or try one of the topics above?",
        sources: [],
      };
    }
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    setTimeout(() => {
      const response = generateAIResponse(inputValue);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: response.content,
        sources: response.sources,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleFeedback = (articleId: string, type: "up" | "down") => {
    setFeedback((prev) => ({
      ...prev,
      [articleId]: prev[articleId] === type ? null : type,
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        {/* Header */}
        <section className="container mx-auto px-4 py-6">
          <Link
            to="/demos"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Demos
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div>
              <Badge variant="secondary" className="mb-2">
                <Sparkles className="h-3 w-3 mr-1" />
                Interactive Demo
              </Badge>
              <h1 className="text-3xl font-bold">Smart FAQ Assistant</h1>
              <p className="text-muted-foreground mt-1">
                AI-powered FAQ with semantic search and RAG-based answers
              </p>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Badge variant="outline" className="gap-1">
                <Search className="h-3 w-3" />
                Semantic Search
              </Badge>
              <Badge variant="outline" className="gap-1">
                <Bot className="h-3 w-3" />
                RAG
              </Badge>
              <Badge variant="outline" className="gap-1">
                <Lightbulb className="h-3 w-3" />
                Query Expansion
              </Badge>
            </div>
          </motion.div>
        </section>

        {/* Main Content */}
        <section className="container mx-auto px-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 max-w-md">
              <TabsTrigger value="search">Search</TabsTrigger>
              <TabsTrigger value="ask">Ask AI</TabsTrigger>
              <TabsTrigger value="browse">Browse</TabsTrigger>
            </TabsList>

            {/* Search Tab */}
            <TabsContent value="search" className="space-y-6">
              {/* Search Bar */}
              <Card>
                <CardContent className="p-6">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Ask a question or search... (e.g., 'How do I reset my password?')"
                      className="pl-12 h-14 text-lg"
                      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                    />
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <Sparkles className="h-4 w-4 text-primary" />
                    <span className="text-sm text-muted-foreground">
                      Powered by semantic search - understands meaning, not just keywords
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Popular Questions */}
              {!searchQuery && (
                <div className="space-y-3">
                  <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Popular Questions
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {popularQuestions.map((question) => (
                      <Button
                        key={question}
                        variant="outline"
                        size="sm"
                        onClick={() => setSearchQuery(question)}
                        className="text-left h-auto py-2"
                      >
                        <HelpCircle className="h-3 w-3 mr-2 shrink-0" />
                        {question}
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Search Results */}
              <div className="space-y-4">
                {searchQuery && (
                  <p className="text-sm text-muted-foreground">
                    Found <span className="font-medium text-foreground">{filteredArticles?.length || 0}</span> results for "{searchQuery}"
                  </p>
                )}
                
                {filteredArticles?.map((article) => (
                  <motion.div
                    key={article.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    <Card className="hover:border-primary/30 transition-colors">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="secondary">{article.category}</Badge>
                              {article.tags.slice(0, 2).map((tag) => (
                                <Badge key={tag} variant="outline" className="text-xs">
                                  <Tag className="h-2.5 w-2.5 mr-1" />
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                            <h3 className="text-lg font-semibold mb-2">{article.title}</h3>
                            <p className="text-muted-foreground text-sm line-clamp-2">
                              {article.content}
                            </p>
                            <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <ThumbsUp className="h-3 w-3" />
                                {article.helpfulCount} found helpful
                              </span>
                              <span className="flex items-center gap-1">
                                <Eye className="h-3 w-3" />
                                {article.viewCount} views
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                Updated {article.lastUpdated}
                              </span>
                            </div>
                          </div>
                          <div className="flex flex-col gap-2">
                            <Button
                              size="sm"
                              variant={feedback[article.id] === "up" ? "default" : "outline"}
                              onClick={() => handleFeedback(article.id, "up")}
                            >
                              <ThumbsUp className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant={feedback[article.id] === "down" ? "destructive" : "outline"}
                              onClick={() => handleFeedback(article.id, "down")}
                            >
                              <ThumbsDown className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* Ask AI Tab */}
            <TabsContent value="ask" className="space-y-4">
              <Card className="h-[600px] flex flex-col">
                <CardHeader className="border-b border-border">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-primary">
                      <Bot className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div>
                      <CardTitle>AI FAQ Assistant</CardTitle>
                      <CardDescription>
                        Powered by RAG (Retrieval-Augmented Generation)
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                  <AnimatePresence>
                    {messages.map((message) => (
                      <motion.div
                        key={message.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex gap-3 ${message.type === "user" ? "flex-row-reverse" : ""}`}
                      >
                        <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                          message.type === "user" 
                            ? "bg-primary text-primary-foreground" 
                            : "bg-gradient-primary text-primary-foreground"
                        }`}>
                          {message.type === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                        </div>
                        <div className={`max-w-[80%] space-y-2 ${message.type === "user" ? "text-right" : ""}`}>
                          <div className={`inline-block rounded-2xl px-4 py-3 ${
                            message.type === "user"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          }`}>
                            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                          </div>
                          
                          {/* Sources */}
                          {message.sources && message.sources.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              <span className="text-xs text-muted-foreground">Sources:</span>
                              {message.sources.map((source) => (
                                <Badge key={source.id} variant="outline" className="text-xs">
                                  <FileText className="h-3 w-3 mr-1" />
                                  {source.title}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex gap-3"
                    >
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-primary">
                        <Bot className="h-4 w-4 text-primary-foreground" />
                      </div>
                      <div className="bg-muted rounded-2xl px-4 py-3">
                        <div className="flex gap-1">
                          <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "0ms" }} />
                          <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "150ms" }} />
                          <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "300ms" }} />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </CardContent>

                {/* Quick Questions */}
                <div className="px-4 py-2 border-t border-border">
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {popularQuestions.slice(0, 3).map((question) => (
                      <Button
                        key={question}
                        variant="ghost"
                        size="sm"
                        className="shrink-0 text-xs"
                        onClick={() => {
                          setInputValue(question);
                          setTimeout(() => {
                            setInputValue(question);
                            handleSendMessage();
                          }, 100);
                        }}
                      >
                        {question}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Input */}
                <div className="p-4 border-t border-border">
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleSendMessage();
                    }}
                    className="flex gap-2"
                  >
                    <Input
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      placeholder="Ask a question about our product..."
                      className="flex-1"
                    />
                    <Button type="submit" disabled={!inputValue.trim() || isTyping}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>
                </div>
              </Card>
            </TabsContent>

            {/* Browse Tab */}
            <TabsContent value="browse" className="space-y-6">
              {/* Category Filter */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>

              {/* Articles Grid */}
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredArticles?.map((article) => (
                  <motion.div
                    key={article.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    <Card className="h-full hover:border-primary/30 transition-colors cursor-pointer group">
                      <CardContent className="p-5">
                        <div className="flex items-center gap-2 mb-3">
                          <Badge variant="secondary" className="text-xs">{article.category}</Badge>
                        </div>
                        <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors flex items-center gap-2">
                          {article.title}
                          <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                          {article.content}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <ThumbsUp className="h-3 w-3" />
                            {article.helpfulCount}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {article.viewCount}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </section>

        {/* Framework Features */}
        <section className="container mx-auto px-4 py-12">
          <Card className="bg-muted/30">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">AI Fabric Framework Features Used</CardTitle>
              <CardDescription>
                This demo showcases the following framework capabilities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { icon: Search, label: "Semantic Search", desc: "ONNX embeddings" },
                  { icon: Bot, label: "RAG Generation", desc: "Context-aware answers" },
                  { icon: MessageSquare, label: "Hybrid Search", desc: "Vector + full-text" },
                  { icon: Lightbulb, label: "Query Expansion", desc: "Understand variations" },
                ].map((feature) => (
                  <div key={feature.label} className="text-center p-4 rounded-lg bg-card border border-border">
                    <feature.icon className="h-8 w-8 text-primary mx-auto mb-2" />
                    <h4 className="font-medium text-sm">{feature.label}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Stats */}
        <section className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { value: "40-60%", label: "Fewer Support Tickets" },
              { value: "2-3 weeks", label: "Implementation Time" },
              { value: "8", label: "REST Endpoints" },
              { value: "Medium", label: "Complexity" },
            ].map((stat) => (
              <Card key={stat.label}>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-gradient">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default SmartFAQAssistant;
