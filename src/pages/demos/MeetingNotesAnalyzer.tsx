import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Search,
  FileText,
  Calendar,
  Users,
  CheckCircle,
  Clock,
  Tag,
  Sparkles,
  Zap,
  MessageSquare,
  ListTodo,
  Bot,
  Upload,
  Play,
  AlertCircle,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

interface MeetingNote {
  id: string;
  title: string;
  date: Date;
  duration: number;
  attendees: string[];
  summary: string;
  keyPoints: string[];
  actionItems: ActionItem[];
  decisions: string[];
  topics: string[];
  similarity?: number;
}

interface ActionItem {
  id: string;
  task: string;
  assignee: string;
  dueDate: Date;
  status: "pending" | "in-progress" | "completed";
  priority: "low" | "medium" | "high";
}

const sampleMeetings: MeetingNote[] = [
  {
    id: "1",
    title: "Q1 Product Roadmap Planning",
    date: new Date(Date.now() - 86400000),
    duration: 60,
    attendees: ["Alex Chen", "Sarah Miller", "James Wilson", "Emily Brown"],
    summary: "Discussed Q1 priorities focusing on user onboarding improvements and API v2 development. Agreed on feature prioritization and resource allocation.",
    keyPoints: [
      "User onboarding flow needs simplification",
      "API v2 development starts next week",
      "Mobile app delayed to Q2 due to resource constraints",
    ],
    actionItems: [
      { id: "a1", task: "Create wireframes for new onboarding flow", assignee: "James Wilson", dueDate: new Date(Date.now() + 604800000), status: "pending", priority: "high" },
      { id: "a2", task: "Draft API v2 specification document", assignee: "Alex Chen", dueDate: new Date(Date.now() + 432000000), status: "in-progress", priority: "high" },
      { id: "a3", task: "Update stakeholders on mobile app timeline", assignee: "Sarah Miller", dueDate: new Date(Date.now() + 172800000), status: "completed", priority: "medium" },
    ],
    decisions: [
      "Prioritize onboarding over mobile app",
      "Allocate 2 developers to API v2",
      "Weekly check-ins for Q1 progress",
    ],
    topics: ["roadmap", "planning", "q1", "api", "onboarding"],
  },
  {
    id: "2",
    title: "Weekly Engineering Standup",
    date: new Date(Date.now() - 172800000),
    duration: 30,
    attendees: ["Alex Chen", "Emily Brown", "Mike Johnson"],
    summary: "Team discussed blockers and progress on current sprint. Database migration completed successfully. Performance issues identified in search feature.",
    keyPoints: [
      "Database migration completed without downtime",
      "Search performance needs optimization",
      "New team member onboarding scheduled",
    ],
    actionItems: [
      { id: "a4", task: "Profile search queries for optimization", assignee: "Emily Brown", dueDate: new Date(Date.now() + 259200000), status: "pending", priority: "high" },
      { id: "a5", task: "Prepare onboarding materials for new hire", assignee: "Alex Chen", dueDate: new Date(Date.now() + 518400000), status: "pending", priority: "medium" },
    ],
    decisions: [
      "Use query caching for search optimization",
      "New team member starts Monday",
    ],
    topics: ["engineering", "standup", "database", "performance"],
  },
  {
    id: "3",
    title: "Customer Feedback Review",
    date: new Date(Date.now() - 432000000),
    duration: 45,
    attendees: ["Sarah Miller", "James Wilson", "Customer Success Team"],
    summary: "Reviewed recent customer feedback and NPS scores. Identified common pain points around documentation and export features.",
    keyPoints: [
      "NPS score improved to 45 from 38",
      "Documentation is top requested improvement",
      "Export feature has frequent bug reports",
    ],
    actionItems: [
      { id: "a6", task: "Create comprehensive API documentation", assignee: "Alex Chen", dueDate: new Date(Date.now() + 1209600000), status: "pending", priority: "high" },
      { id: "a7", task: "Fix export bugs in priority order", assignee: "Emily Brown", dueDate: new Date(Date.now() + 604800000), status: "in-progress", priority: "high" },
    ],
    decisions: [
      "Documentation sprint in February",
      "Export feature audit required",
    ],
    topics: ["customer-feedback", "nps", "documentation", "bugs"],
  },
];

const searchExamples = [
  "What action items are assigned to Alex?",
  "Meetings about API development",
  "What decisions were made about mobile app?",
  "Show me all high priority tasks",
];

const MeetingNotesAnalyzer = () => {
  const [activeTab, setActiveTab] = useState("search");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<MeetingNote[] | null>(null);
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);
  const [meetings] = useState<MeetingNote[]>(sampleMeetings);
  const [newMeetingText, setNewMeetingText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    setAiAnswer(null);
    
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    const query = searchQuery.toLowerCase();
    
    // Generate AI answer based on query
    if (query.includes("alex") && query.includes("action")) {
      setAiAnswer("Alex Chen has 2 action items: 1) Draft API v2 specification document (in progress, high priority, due in 5 days), 2) Prepare onboarding materials for new hire (pending, medium priority, due in 6 days).");
    } else if (query.includes("api")) {
      setAiAnswer("API development was discussed in the Q1 Product Roadmap Planning meeting. Key decisions: API v2 development starts next week with 2 developers allocated. Alex Chen is drafting the specification document.");
    } else if (query.includes("mobile")) {
      setAiAnswer("The mobile app was discussed in Q1 Planning. Decision: Mobile app development is delayed to Q2 due to resource constraints. Priority given to user onboarding improvements instead.");
    } else if (query.includes("high priority")) {
      setAiAnswer("There are 4 high priority tasks: 1) Create wireframes for new onboarding flow (James), 2) Draft API v2 specification (Alex), 3) Profile search queries for optimization (Emily), 4) Create comprehensive API documentation (Alex).");
    } else {
      setAiAnswer("Based on your search, I found relevant meeting notes that discuss this topic. The results show the most semantically similar meetings to your query.");
    }
    
    // Filter meetings by relevance
    const results = meetings.map((m) => ({
      ...m,
      similarity: Math.random() * 0.3 + 0.7, // Mock similarity score
    })).sort((a, b) => (b.similarity || 0) - (a.similarity || 0));
    
    setSearchResults(results);
    setIsSearching(false);
  };

  const handleAnalyzeMeeting = async () => {
    if (!newMeetingText.trim()) return;
    
    setIsAnalyzing(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsAnalyzing(false);
    setNewMeetingText("");
    // In a real app, this would add the analyzed meeting to the list
  };

  const allActionItems = meetings.flatMap((m) => 
    m.actionItems.map((a) => ({ ...a, meetingTitle: m.title }))
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "text-green-500 bg-green-500/10";
      case "in-progress": return "text-blue-500 bg-blue-500/10";
      default: return "text-orange-500 bg-orange-500/10";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "text-red-500";
      case "medium": return "text-yellow-500";
      default: return "text-gray-500";
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
                <FileText className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Meeting Notes Analyzer</h1>
                <p className="text-muted-foreground">
                  AI-powered meeting analysis with semantic search and action tracking
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
                RAG Q&A
              </Badge>
              <Badge variant="outline" className="gap-1">
                <ListTodo className="h-3 w-3" />
                Action Extraction
              </Badge>
              <Badge variant="outline" className="gap-1">
                <Sparkles className="h-3 w-3" />
                Auto-Summarization
              </Badge>
            </div>
          </motion.div>
        </section>

        {/* Main Content */}
        <section className="container mx-auto px-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full max-w-lg grid-cols-4">
              <TabsTrigger value="search" className="gap-2">
                <Search className="h-4 w-4" />
                Search
              </TabsTrigger>
              <TabsTrigger value="meetings" className="gap-2">
                <Calendar className="h-4 w-4" />
                Meetings
              </TabsTrigger>
              <TabsTrigger value="actions" className="gap-2">
                <ListTodo className="h-4 w-4" />
                Actions
              </TabsTrigger>
              <TabsTrigger value="analyze" className="gap-2">
                <Sparkles className="h-4 w-4" />
                Analyze
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
                      placeholder="Search meetings... e.g., 'What action items are assigned to Alex?'"
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
                  {aiAnswer && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <Card className="bg-primary/5 border-primary/20">
                        <CardContent className="pt-4">
                          <div className="flex items-start gap-3">
                            <div className="p-2 rounded-full bg-primary/10">
                              <Bot className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                              <span className="font-medium">AI Answer</span>
                              <p className="text-sm mt-1">{aiAnswer}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Search Results */}
                <AnimatePresence>
                  {searchResults && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-3"
                    >
                      <h3 className="text-sm font-medium text-muted-foreground">
                        Relevant Meetings ({searchResults.length})
                      </h3>
                      
                      {searchResults.map((meeting, index) => (
                        <motion.div
                          key={meeting.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Card className="hover:shadow-lg transition-all">
                            <CardContent className="pt-4">
                              <div className="flex items-start justify-between gap-4">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <h4 className="font-semibold">{meeting.title}</h4>
                                    {meeting.similarity && (
                                      <Badge className="bg-primary/10 text-primary text-xs">
                                        {Math.round(meeting.similarity * 100)}% match
                                      </Badge>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                      <Calendar className="h-3 w-3" />
                                      {meeting.date.toLocaleDateString()}
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <Clock className="h-3 w-3" />
                                      {meeting.duration} min
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <Users className="h-3 w-3" />
                                      {meeting.attendees.length}
                                    </span>
                                  </div>
                                  <p className="text-sm mt-2">{meeting.summary}</p>
                                  <div className="flex gap-2 mt-2">
                                    {meeting.topics.slice(0, 4).map((topic) => (
                                      <Badge key={topic} variant="secondary" className="text-xs">
                                        {topic}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </TabsContent>

            {/* Meetings Tab */}
            <TabsContent value="meetings" className="space-y-6">
              <div className="grid gap-4">
                {meetings.map((meeting, index) => (
                  <motion.div
                    key={meeting.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle>{meeting.title}</CardTitle>
                            <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {meeting.date.toLocaleDateString()}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {meeting.duration} min
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            {meeting.attendees.slice(0, 3).map((a, i) => (
                              <div key={i} className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-medium">
                                {a.split(" ").map((n) => n[0]).join("")}
                              </div>
                            ))}
                            {meeting.attendees.length > 3 && (
                              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs">
                                +{meeting.attendees.length - 3}
                              </div>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <h5 className="text-sm font-medium mb-2">Summary</h5>
                          <p className="text-sm text-muted-foreground">{meeting.summary}</p>
                        </div>

                        <div>
                          <h5 className="text-sm font-medium mb-2">Key Points</h5>
                          <ul className="space-y-1">
                            {meeting.keyPoints.map((point, i) => (
                              <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                                <CheckCircle className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                                {point}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h5 className="text-sm font-medium mb-2">Decisions ({meeting.decisions.length})</h5>
                          <div className="flex flex-wrap gap-2">
                            {meeting.decisions.map((decision, i) => (
                              <Badge key={i} variant="secondary">{decision}</Badge>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h5 className="text-sm font-medium mb-2">Action Items ({meeting.actionItems.length})</h5>
                          <div className="space-y-2">
                            {meeting.actionItems.map((action) => (
                              <div key={action.id} className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                                <div className={`p-1 rounded ${getStatusColor(action.status)}`}>
                                  {action.status === "completed" ? (
                                    <CheckCircle className="h-4 w-4" />
                                  ) : action.status === "in-progress" ? (
                                    <Play className="h-4 w-4" />
                                  ) : (
                                    <AlertCircle className="h-4 w-4" />
                                  )}
                                </div>
                                <div className="flex-1">
                                  <p className="text-sm">{action.task}</p>
                                  <p className="text-xs text-muted-foreground">
                                    {action.assignee} • Due {action.dueDate.toLocaleDateString()}
                                  </p>
                                </div>
                                <Badge variant="outline" className={`text-xs ${getPriorityColor(action.priority)}`}>
                                  {action.priority}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            {/* Actions Tab */}
            <TabsContent value="actions" className="space-y-6">
              <div className="grid gap-4 md:grid-cols-3">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-muted-foreground">Total Actions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{allActionItems.length}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-muted-foreground">Pending</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-orange-500">
                      {allActionItems.filter((a) => a.status === "pending").length}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-muted-foreground">Completed</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-green-500">
                      {allActionItems.filter((a) => a.status === "completed").length}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ListTodo className="h-5 w-5" />
                    All Action Items
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-3">
                      {allActionItems.map((action, index) => (
                        <motion.div
                          key={action.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="flex items-center gap-4 p-3 rounded-lg border"
                        >
                          <div className={`p-2 rounded ${getStatusColor(action.status)}`}>
                            {action.status === "completed" ? (
                              <CheckCircle className="h-4 w-4" />
                            ) : action.status === "in-progress" ? (
                              <Play className="h-4 w-4" />
                            ) : (
                              <AlertCircle className="h-4 w-4" />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{action.task}</p>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                              <Users className="h-3 w-3" />
                              {action.assignee}
                              <span>•</span>
                              <Calendar className="h-3 w-3" />
                              {action.dueDate.toLocaleDateString()}
                            </div>
                          </div>
                          <Badge variant="outline" className={getPriorityColor(action.priority)}>
                            {action.priority}
                          </Badge>
                        </motion.div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Analyze Tab */}
            <TabsContent value="analyze" className="space-y-6">
              <div className="max-w-2xl mx-auto">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5" />
                      Analyze New Meeting Notes
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">
                      Paste your meeting notes and let AI extract summaries, action items, decisions, and key points.
                    </p>
                    
                    <Textarea
                      placeholder="Paste your meeting transcript or notes here..."
                      value={newMeetingText}
                      onChange={(e) => setNewMeetingText(e.target.value)}
                      className="min-h-[200px]"
                    />
                    
                    <Button 
                      onClick={handleAnalyzeMeeting} 
                      disabled={isAnalyzing || !newMeetingText.trim()}
                      className="w-full"
                    >
                      {isAnalyzing ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          >
                            <Sparkles className="h-4 w-4 mr-2" />
                          </motion.div>
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4 mr-2" />
                          Analyze Meeting Notes
                        </>
                      )}
                    </Button>
                  </CardContent>
                </Card>

                {/* API Endpoints */}
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="h-5 w-5" />
                      AI Fabric Endpoints Used
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-3">
                      {[
                        { method: "POST", endpoint: "/api/meetings/analyze", desc: "Analyze meeting notes with AI" },
                        { method: "POST", endpoint: "/api/meetings/search", desc: "Semantic search across meetings" },
                        { method: "POST", endpoint: "/api/meetings/ask", desc: "Ask questions about meetings" },
                        { method: "GET", endpoint: "/api/meetings/{id}/actions", desc: "Get extracted action items" },
                        { method: "GET", endpoint: "/api/meetings/{id}/summary", desc: "Get AI-generated summary" },
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
              </div>
            </TabsContent>
          </Tabs>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default MeetingNotesAnalyzer;
