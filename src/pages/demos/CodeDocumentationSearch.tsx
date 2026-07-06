import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  Code,
  FileCode,
  BookOpen,
  Copy,
  Check,
  Sparkles,
  Zap,
  GitBranch,
  Package,
  FileText,
  MessageSquare,
  ExternalLink,
  Bot,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CodeDoc {
  id: string;
  title: string;
  description: string;
  language: string;
  type: "function" | "class" | "interface" | "module";
  code: string;
  file: string;
  similarity: number;
  tags: string[];
}

interface SearchResult {
  docs: CodeDoc[];
  aiAnswer: string;
  queryTime: number;
}

const sampleDocs: CodeDoc[] = [
  {
    id: "1",
    title: "useAuth Hook",
    description: "Custom hook for authentication state management. Provides login, logout, and user state.",
    language: "TypeScript",
    type: "function",
    code: `export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const login = async (credentials: Credentials) => {
    const response = await authService.login(credentials);
    setUser(response.user);
  };

  const logout = async () => {
    await authService.logout();
    setUser(null);
  };

  return { user, loading, login, logout };
}`,
    file: "src/hooks/useAuth.ts",
    similarity: 0.95,
    tags: ["authentication", "hooks", "state"],
  },
  {
    id: "2",
    title: "ApiClient Class",
    description: "HTTP client wrapper with built-in error handling, retry logic, and request interceptors.",
    language: "TypeScript",
    type: "class",
    code: `export class ApiClient {
  private baseUrl: string;
  private headers: Record<string, string>;

  constructor(config: ApiConfig) {
    this.baseUrl = config.baseUrl;
    this.headers = config.headers || {};
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>('GET', endpoint);
  }

  async post<T>(endpoint: string, data: unknown): Promise<T> {
    return this.request<T>('POST', endpoint, data);
  }
}`,
    file: "src/lib/ApiClient.ts",
    similarity: 0.88,
    tags: ["api", "http", "client"],
  },
  {
    id: "3",
    title: "User Interface",
    description: "Type definition for user objects with authentication and profile information.",
    language: "TypeScript",
    type: "interface",
    code: `export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'admin' | 'user' | 'guest';
  permissions: string[];
  createdAt: Date;
  lastLoginAt?: Date;
}`,
    file: "src/types/User.ts",
    similarity: 0.82,
    tags: ["types", "user", "authentication"],
  },
  {
    id: "4",
    title: "validateEmail",
    description: "Utility function to validate email format with RFC 5322 compliance.",
    language: "TypeScript",
    type: "function",
    code: `export function validateEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_\`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegex.test(email);
}`,
    file: "src/utils/validation.ts",
    similarity: 0.75,
    tags: ["validation", "email", "utils"],
  },
];

const searchExamples = [
  "How do I authenticate users?",
  "Show me the API client implementation",
  "What types are available for User?",
  "How to validate form inputs?",
];

const CodeDocumentationSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [activeTab, setActiveTab] = useState("search");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    const startTime = Date.now();
    
    // Simulate AI-powered semantic search
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // Generate mock AI answer based on query
    let aiAnswer = "";
    const query = searchQuery.toLowerCase();
    
    if (query.includes("auth")) {
      aiAnswer = "For authentication, use the `useAuth` hook from `src/hooks/useAuth.ts`. It provides `login`, `logout` functions and the current `user` state. The hook handles all authentication state management automatically.";
    } else if (query.includes("api") || query.includes("http")) {
      aiAnswer = "The `ApiClient` class in `src/lib/ApiClient.ts` handles all HTTP requests. It includes built-in error handling and retry logic. Use `get<T>()` and `post<T>()` methods for type-safe requests.";
    } else if (query.includes("user") || query.includes("type")) {
      aiAnswer = "User types are defined in `src/types/User.ts`. The `User` interface includes id, email, name, role, permissions, and timestamps. Roles can be 'admin', 'user', or 'guest'.";
    } else if (query.includes("valid")) {
      aiAnswer = "For validation, use utilities from `src/utils/validation.ts`. The `validateEmail` function checks RFC 5322 compliance. Additional validators are available for common patterns.";
    } else {
      aiAnswer = "Based on your query, here are the most relevant code documentation entries. Each result includes the source file and usage examples.";
    }
    
    const queryTime = Date.now() - startTime;
    
    setSearchResult({
      docs: sampleDocs.sort((a, b) => b.similarity - a.similarity),
      aiAnswer,
      queryTime,
    });
    setIsSearching(false);
  };

  const handleCopy = async (code: string, id: string) => {
    await navigator.clipboard.writeText(code);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "function": return "fn";
      case "class": return "C";
      case "interface": return "I";
      case "module": return "M";
      default: return "?";
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "function": return "bg-purple-500/10 text-purple-500";
      case "class": return "bg-blue-500/10 text-blue-500";
      case "interface": return "bg-green-500/10 text-green-500";
      case "module": return "bg-orange-500/10 text-orange-500";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        {/* Header */}
        <section className="container mx-auto px-4 py-8">
          <Link
            to="/demos"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Demos
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-primary shadow-glow">
                <Code className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Code Documentation Search</h1>
                <p className="text-muted-foreground">
                  AI-powered semantic search across your codebase documentation
                </p>
              </div>
            </div>

            {/* AI Capabilities Tags */}
            <div className="flex flex-wrap gap-2 mt-4">
              <Badge variant="outline" className="gap-1">
                <Search className="h-3 w-3" />
                Semantic Search
              </Badge>
              <Badge variant="outline" className="gap-1">
                <Bot className="h-3 w-3" />
                RAG Answers
              </Badge>
              <Badge variant="outline" className="gap-1">
                <Code className="h-3 w-3" />
                Code Understanding
              </Badge>
              <Badge variant="outline" className="gap-1">
                <FileCode className="h-3 w-3" />
                Multi-Language
              </Badge>
            </div>
          </motion.div>
        </section>

        {/* Main Content */}
        <section className="container mx-auto px-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="search" className="gap-2">
                <Search className="h-4 w-4" />
                Search
              </TabsTrigger>
              <TabsTrigger value="browse" className="gap-2">
                <BookOpen className="h-4 w-4" />
                Browse
              </TabsTrigger>
            </TabsList>

            {/* Search Tab */}
            <TabsContent value="search" className="space-y-6">
              <div className="max-w-3xl mx-auto space-y-4">
                {/* Search Bar */}
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Ask about your codebase... e.g., 'How do I authenticate users?'"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                      className="pl-10"
                    />
                  </div>
                  <Button onClick={handleSearch} disabled={isSearching} className="gap-2">
                    {isSearching ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Sparkles className="h-4 w-4" />
                      </motion.div>
                    ) : (
                      <Sparkles className="h-4 w-4" />
                    )}
                    AI Search
                  </Button>
                </div>

                {/* Search Examples */}
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs text-muted-foreground">Try:</span>
                  {searchExamples.map((example) => (
                    <button
                      key={example}
                      onClick={() => {
                        setSearchQuery(example);
                        setTimeout(handleSearch, 100);
                      }}
                      className="text-xs text-primary hover:underline"
                    >
                      "{example}"
                    </button>
                  ))}
                </div>

                {/* AI Answer */}
                <AnimatePresence>
                  {searchResult && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4"
                    >
                      <Card className="bg-primary/5 border-primary/20">
                        <CardContent className="pt-4">
                          <div className="flex items-start gap-3">
                            <div className="p-2 rounded-full bg-primary/10">
                              <Bot className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <span className="font-medium">AI Answer</span>
                                <Badge variant="secondary" className="text-xs">
                                  {searchResult.queryTime}ms
                                </Badge>
                              </div>
                              <p className="text-sm">{searchResult.aiAnswer}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      {/* Search Results */}
                      <div className="space-y-3">
                        <h3 className="text-sm font-medium text-muted-foreground">
                          Relevant Documentation ({searchResult.docs.length} results)
                        </h3>
                        
                        {searchResult.docs.map((doc, index) => (
                          <motion.div
                            key={doc.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <Card className="hover:shadow-lg transition-all">
                              <CardContent className="pt-4">
                                <div className="flex items-start justify-between gap-4">
                                  <div className="flex items-start gap-3">
                                    <div className={`flex h-10 w-10 items-center justify-center rounded-lg font-mono font-bold ${getTypeColor(doc.type)}`}>
                                      {getTypeIcon(doc.type)}
                                    </div>
                                    <div>
                                      <div className="flex items-center gap-2">
                                        <h4 className="font-semibold">{doc.title}</h4>
                                        <Badge variant="outline" className="text-xs">
                                          {doc.language}
                                        </Badge>
                                      </div>
                                      <p className="text-sm text-muted-foreground">{doc.description}</p>
                                      <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                                        <FileCode className="h-3 w-3" />
                                        {doc.file}
                                      </div>
                                    </div>
                                  </div>
                                  <Badge className="bg-primary/10 text-primary shrink-0">
                                    {Math.round(doc.similarity * 100)}% match
                                  </Badge>
                                </div>

                                {/* Code Preview */}
                                <div className="mt-4 relative">
                                  <div className="absolute top-2 right-2 z-10">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleCopy(doc.code, doc.id)}
                                    >
                                      {copiedId === doc.id ? (
                                        <Check className="h-4 w-4 text-green-500" />
                                      ) : (
                                        <Copy className="h-4 w-4" />
                                      )}
                                    </Button>
                                  </div>
                                  <pre className="p-4 rounded-lg bg-muted overflow-x-auto">
                                    <code className="text-sm">{doc.code}</code>
                                  </pre>
                                </div>

                                {/* Tags */}
                                <div className="flex gap-2 mt-3">
                                  {doc.tags.map((tag) => (
                                    <Badge key={tag} variant="secondary" className="text-xs">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Empty State */}
                {!searchResult && !isSearching && (
                  <Card className="bg-muted/30">
                    <CardContent className="py-12 text-center">
                      <Code className="h-12 w-12 mx-auto mb-4 text-muted-foreground/30" />
                      <h3 className="font-medium mb-2">Search Your Codebase</h3>
                      <p className="text-sm text-muted-foreground max-w-md mx-auto">
                        Ask questions in natural language and get AI-powered answers 
                        with relevant code snippets from your documentation.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            {/* Browse Tab */}
            <TabsContent value="browse" className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[
                  { icon: FileCode, label: "Functions", count: 24, color: "text-purple-500 bg-purple-500/10" },
                  { icon: Package, label: "Classes", count: 12, color: "text-blue-500 bg-blue-500/10" },
                  { icon: FileText, label: "Interfaces", count: 18, color: "text-green-500 bg-green-500/10" },
                  { icon: GitBranch, label: "Modules", count: 8, color: "text-orange-500 bg-orange-500/10" },
                ].map((item) => (
                  <Card key={item.label} className="hover:shadow-lg transition-all cursor-pointer group">
                    <CardContent className="pt-6">
                      <div className={`inline-flex p-3 rounded-lg ${item.color} mb-3`}>
                        <item.icon className="h-6 w-6" />
                      </div>
                      <h3 className="font-semibold group-hover:text-primary transition-colors">{item.label}</h3>
                      <p className="text-2xl font-bold mt-1">{item.count}</p>
                      <p className="text-xs text-muted-foreground">documented items</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* All Docs */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    All Documentation
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-3">
                      {sampleDocs.map((doc, index) => (
                        <motion.div
                          key={doc.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                        >
                          <div className={`flex h-10 w-10 items-center justify-center rounded-lg font-mono font-bold ${getTypeColor(doc.type)}`}>
                            {getTypeIcon(doc.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium truncate">{doc.title}</h4>
                              <Badge variant="outline" className="text-xs shrink-0">{doc.language}</Badge>
                            </div>
                            <p className="text-sm text-muted-foreground truncate">{doc.description}</p>
                          </div>
                          <ExternalLink className="h-4 w-4 text-muted-foreground" />
                        </motion.div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* API Endpoints */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5" />
                    AI Fabric Endpoints Used
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3 md:grid-cols-2">
                    {[
                      { method: "POST", endpoint: "/api/code/search", desc: "Semantic code search" },
                      { method: "POST", endpoint: "/api/code/ask", desc: "Ask questions about code" },
                      { method: "GET", endpoint: "/api/code/docs/{id}", desc: "Get documentation by ID" },
                      { method: "POST", endpoint: "/api/code/index", desc: "Index new code files" },
                      { method: "GET", endpoint: "/api/code/suggestions", desc: "Get related suggestions" },
                    ].map((api) => (
                      <div key={api.endpoint} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                        <Badge variant={api.method === "POST" ? "default" : "secondary"} className="text-xs font-mono">
                          {api.method}
                        </Badge>
                        <div>
                          <code className="text-sm font-mono">{api.endpoint}</code>
                          <p className="text-xs text-muted-foreground">{api.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </section>

      </main>

      <Footer />
    </div>
  );
};

export default CodeDocumentationSearch;
