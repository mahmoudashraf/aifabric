import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Send,
  Smile,
  Meh,
  Frown,
  TrendingUp,
  TrendingDown,
  Minus,
  Users,
  BarChart3,
  Calendar,
  MessageSquare,
  AlertTriangle,
  CheckCircle,
  Sparkles,
  Shield,
  Activity,
  Heart,
  ThumbsUp,
  Zap,
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
import { Progress } from "@/components/ui/progress";

type SentimentLevel = "DELIGHTED" | "SATISFIED" | "NEUTRAL" | "CONFUSED" | "FRUSTRATED" | "CHURNING";

interface CheckIn {
  id: string;
  memberId: string;
  memberName: string;
  message: string;
  sentiment: SentimentLevel;
  sentimentScore: number;
  topics: string[];
  date: Date;
  trend: "improving" | "stable" | "declining";
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
  currentSentiment: SentimentLevel;
  sentimentScore: number;
  trend: "improving" | "stable" | "declining";
  riskLevel: "low" | "medium" | "high";
  lastCheckIn: Date;
}

const sentimentConfig: Record<SentimentLevel, { color: string; bg: string; icon: typeof Smile; label: string }> = {
  DELIGHTED: { color: "text-green-500", bg: "bg-green-500/10", icon: Smile, label: "Delighted" },
  SATISFIED: { color: "text-emerald-500", bg: "bg-emerald-500/10", icon: ThumbsUp, label: "Satisfied" },
  NEUTRAL: { color: "text-yellow-500", bg: "bg-yellow-500/10", icon: Meh, label: "Neutral" },
  CONFUSED: { color: "text-orange-500", bg: "bg-orange-500/10", icon: Meh, label: "Confused" },
  FRUSTRATED: { color: "text-red-400", bg: "bg-red-400/10", icon: Frown, label: "Frustrated" },
  CHURNING: { color: "text-red-600", bg: "bg-red-600/10", icon: AlertTriangle, label: "At Risk" },
};

const sampleTeamMembers: TeamMember[] = [
  { id: "1", name: "Alex Chen", role: "Senior Developer", avatar: "👨‍💻", currentSentiment: "DELIGHTED", sentimentScore: 0.92, trend: "improving", riskLevel: "low", lastCheckIn: new Date() },
  { id: "2", name: "Sarah Miller", role: "Product Manager", avatar: "👩‍💼", currentSentiment: "SATISFIED", sentimentScore: 0.78, trend: "stable", riskLevel: "low", lastCheckIn: new Date() },
  { id: "3", name: "James Wilson", role: "Designer", avatar: "👨‍🎨", currentSentiment: "NEUTRAL", sentimentScore: 0.55, trend: "declining", riskLevel: "medium", lastCheckIn: new Date(Date.now() - 86400000) },
  { id: "4", name: "Emily Brown", role: "Backend Developer", avatar: "👩‍💻", currentSentiment: "CONFUSED", sentimentScore: 0.42, trend: "declining", riskLevel: "medium", lastCheckIn: new Date(Date.now() - 172800000) },
  { id: "5", name: "Mike Johnson", role: "QA Engineer", avatar: "🧑‍🔬", currentSentiment: "FRUSTRATED", sentimentScore: 0.25, trend: "declining", riskLevel: "high", lastCheckIn: new Date(Date.now() - 259200000) },
];

const sampleCheckIns: CheckIn[] = [
  { id: "c1", memberId: "1", memberName: "Alex Chen", message: "Great progress on the new feature! Team collaboration has been excellent this sprint.", sentiment: "DELIGHTED", sentimentScore: 0.92, topics: ["teamwork", "progress", "feature"], date: new Date(), trend: "improving" },
  { id: "c2", memberId: "2", memberName: "Sarah Miller", message: "Stakeholder meeting went well. Some concerns about timeline but manageable.", sentiment: "SATISFIED", sentimentScore: 0.78, topics: ["meetings", "timeline", "stakeholders"], date: new Date(Date.now() - 3600000), trend: "stable" },
  { id: "c3", memberId: "3", memberName: "James Wilson", message: "Design reviews are taking longer than expected. Need better feedback process.", sentiment: "NEUTRAL", sentimentScore: 0.55, topics: ["design", "feedback", "process"], date: new Date(Date.now() - 86400000), trend: "declining" },
  { id: "c4", memberId: "4", memberName: "Emily Brown", message: "Unclear requirements for the API integration. Need more context from product.", sentiment: "CONFUSED", sentimentScore: 0.42, topics: ["requirements", "api", "clarity"], date: new Date(Date.now() - 172800000), trend: "declining" },
  { id: "c5", memberId: "5", memberName: "Mike Johnson", message: "Too many bugs in production. Feeling overwhelmed with the backlog.", sentiment: "FRUSTRATED", sentimentScore: 0.25, topics: ["bugs", "workload", "stress"], date: new Date(Date.now() - 259200000), trend: "declining" },
];

const TeamSentimentTracker = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [checkInMessage, setCheckInMessage] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [checkIns, setCheckIns] = useState<CheckIn[]>(sampleCheckIns);
  const [teamMembers] = useState<TeamMember[]>(sampleTeamMembers);
  const [lastAnalysis, setLastAnalysis] = useState<{
    sentiment: SentimentLevel;
    score: number;
    topics: string[];
  } | null>(null);

  const handleSubmitCheckIn = async () => {
    if (!checkInMessage.trim()) return;
    
    setIsAnalyzing(true);
    
    // Simulate AI sentiment analysis
    await new Promise((resolve) => setTimeout(resolve, 1200));
    
    // Simple mock sentiment detection
    const message = checkInMessage.toLowerCase();
    let sentiment: SentimentLevel = "NEUTRAL";
    let score = 0.5;
    
    if (message.includes("great") || message.includes("excellent") || message.includes("love")) {
      sentiment = "DELIGHTED";
      score = 0.9;
    } else if (message.includes("good") || message.includes("happy") || message.includes("progress")) {
      sentiment = "SATISFIED";
      score = 0.75;
    } else if (message.includes("confused") || message.includes("unclear") || message.includes("don't understand")) {
      sentiment = "CONFUSED";
      score = 0.4;
    } else if (message.includes("frustrated") || message.includes("stressed") || message.includes("overwhelmed")) {
      sentiment = "FRUSTRATED";
      score = 0.25;
    } else if (message.includes("leaving") || message.includes("quit") || message.includes("can't continue")) {
      sentiment = "CHURNING";
      score = 0.1;
    }
    
    // Extract mock topics
    const topicKeywords = ["teamwork", "deadline", "workload", "communication", "progress", "bugs", "meetings"];
    const topics = topicKeywords.filter((t) => message.includes(t.toLowerCase())).slice(0, 3);
    if (topics.length === 0) topics.push("general");
    
    const newCheckIn: CheckIn = {
      id: `c${Date.now()}`,
      memberId: "current",
      memberName: "You",
      message: checkInMessage,
      sentiment,
      sentimentScore: score,
      topics,
      date: new Date(),
      trend: "stable",
    };
    
    setCheckIns([newCheckIn, ...checkIns]);
    setLastAnalysis({ sentiment, score, topics });
    setCheckInMessage("");
    setIsAnalyzing(false);
  };

  const averageSentiment = teamMembers.reduce((acc, m) => acc + m.sentimentScore, 0) / teamMembers.length;
  const atRiskCount = teamMembers.filter((m) => m.riskLevel === "high").length;
  const decliningCount = teamMembers.filter((m) => m.trend === "declining").length;

  const TrendIcon = ({ trend }: { trend: "improving" | "stable" | "declining" }) => {
    if (trend === "improving") return <TrendingUp className="h-4 w-4 text-green-500" />;
    if (trend === "declining") return <TrendingDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-yellow-500" />;
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
                <Heart className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-3xl font-bold">Team Sentiment Tracker</h1>
                <p className="text-muted-foreground">
                  AI-powered team morale monitoring with sentiment analysis
                </p>
              </div>
            </div>

            {/* AI Capabilities Tags */}
            <div className="flex flex-wrap gap-2 mt-4">
              <Badge variant="outline" className="gap-1">
                <Activity className="h-3 w-3" />
                Behavior Analytics
              </Badge>
              <Badge variant="outline" className="gap-1">
                <Smile className="h-3 w-3" />
                6-Level Sentiment
              </Badge>
              <Badge variant="outline" className="gap-1">
                <TrendingUp className="h-3 w-3" />
                Trend Detection
              </Badge>
              <Badge variant="outline" className="gap-1">
                <Shield className="h-3 w-3" />
                PII Protection
              </Badge>
            </div>
          </motion.div>
        </section>

        {/* Main Content */}
        <section className="container mx-auto px-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full max-w-md grid-cols-3">
              <TabsTrigger value="dashboard" className="gap-2">
                <BarChart3 className="h-4 w-4" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger value="checkin" className="gap-2">
                <MessageSquare className="h-4 w-4" />
                Check-In
              </TabsTrigger>
              <TabsTrigger value="team" className="gap-2">
                <Users className="h-4 w-4" />
                Team
              </TabsTrigger>
            </TabsList>

            {/* Dashboard Tab */}
            <TabsContent value="dashboard" className="space-y-6">
              {/* Overview Cards */}
              <div className="grid gap-4 md:grid-cols-4">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-muted-foreground">Team Morale</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-gradient">{Math.round(averageSentiment * 100)}%</div>
                    <Progress value={averageSentiment * 100} className="mt-2" />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-muted-foreground">Team Size</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{teamMembers.length}</div>
                    <p className="text-xs text-muted-foreground mt-1">Active members</p>
                  </CardContent>
                </Card>

                <Card className={atRiskCount > 0 ? "border-red-500/50" : ""}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                      At Risk
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-red-500">{atRiskCount}</div>
                    <p className="text-xs text-muted-foreground mt-1">Need attention</p>
                  </CardContent>
                </Card>

                <Card className={decliningCount > 0 ? "border-orange-500/50" : ""}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
                      <TrendingDown className="h-4 w-4 text-orange-500" />
                      Declining
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-orange-500">{decliningCount}</div>
                    <p className="text-xs text-muted-foreground mt-1">Trending down</p>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Check-Ins */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Recent Check-Ins
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-4">
                      {checkIns.map((checkIn, index) => {
                        const config = sentimentConfig[checkIn.sentiment];
                        const SentimentIcon = config.icon;
                        
                        return (
                          <motion.div
                            key={checkIn.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className={`p-4 rounded-lg border ${config.bg}`}
                          >
                            <div className="flex items-start justify-between gap-4">
                              <div className="flex items-start gap-3">
                                <div className={`p-2 rounded-full ${config.bg}`}>
                                  <SentimentIcon className={`h-5 w-5 ${config.color}`} />
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium">{checkIn.memberName}</span>
                                    <Badge variant="secondary" className="text-xs">
                                      {config.label}
                                    </Badge>
                                    <TrendIcon trend={checkIn.trend} />
                                  </div>
                                  <p className="text-sm text-muted-foreground mt-1">{checkIn.message}</p>
                                  <div className="flex gap-2 mt-2">
                                    {checkIn.topics.map((topic) => (
                                      <Badge key={topic} variant="outline" className="text-xs">
                                        {topic}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              </div>
                              <div className="text-right shrink-0">
                                <div className={`text-lg font-bold ${config.color}`}>
                                  {Math.round(checkIn.sentimentScore * 100)}%
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {checkIn.date.toLocaleDateString()}
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Check-In Tab */}
            <TabsContent value="checkin" className="space-y-6">
              <div className="max-w-2xl mx-auto">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Daily Check-In
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">
                      How are you feeling today? Share your thoughts and our AI will analyze sentiment patterns.
                    </p>
                    
                    <Textarea
                      placeholder="Share how you're feeling about work, your team, or any challenges you're facing..."
                      value={checkInMessage}
                      onChange={(e) => setCheckInMessage(e.target.value)}
                      className="min-h-[120px]"
                    />
                    
                    <div className="flex justify-between items-center">
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Shield className="h-3 w-3" />
                        PII is automatically detected and anonymized
                      </p>
                      <Button onClick={handleSubmitCheckIn} disabled={isAnalyzing || !checkInMessage.trim()}>
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
                            <Send className="h-4 w-4 mr-2" />
                            Submit Check-In
                          </>
                        )}
                      </Button>
                    </div>

                    {/* Analysis Result */}
                    <AnimatePresence>
                      {lastAnalysis && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -20 }}
                        >
                          <Card className={`mt-4 ${sentimentConfig[lastAnalysis.sentiment].bg}`}>
                            <CardContent className="pt-4">
                              <div className="flex items-center gap-3">
                                <div className={`p-3 rounded-full ${sentimentConfig[lastAnalysis.sentiment].bg}`}>
                                  {(() => {
                                    const Icon = sentimentConfig[lastAnalysis.sentiment].icon;
                                    return <Icon className={`h-6 w-6 ${sentimentConfig[lastAnalysis.sentiment].color}`} />;
                                  })()}
                                </div>
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-medium">Sentiment Detected:</span>
                                    <Badge className={sentimentConfig[lastAnalysis.sentiment].bg}>
                                      {sentimentConfig[lastAnalysis.sentiment].label}
                                    </Badge>
                                  </div>
                                  <div className="text-sm text-muted-foreground mt-1">
                                    Score: {Math.round(lastAnalysis.score * 100)}% | Topics: {lastAnalysis.topics.join(", ")}
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>

                {/* Sentiment Scale Reference */}
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="text-base">6-Level Sentiment Scale</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {Object.entries(sentimentConfig).map(([key, config]) => {
                        const Icon = config.icon;
                        return (
                          <div key={key} className={`flex items-center gap-2 p-2 rounded-lg ${config.bg}`}>
                            <Icon className={`h-4 w-4 ${config.color}`} />
                            <span className="text-sm">{config.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Team Tab */}
            <TabsContent value="team" className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {teamMembers.map((member, index) => {
                  const config = sentimentConfig[member.currentSentiment];
                  const SentimentIcon = config.icon;
                  
                  return (
                    <motion.div
                      key={member.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className={`hover:shadow-lg transition-all ${member.riskLevel === "high" ? "border-red-500/50" : ""}`}>
                        <CardContent className="pt-6">
                          <div className="flex items-start gap-4">
                            <div className="text-4xl">{member.avatar}</div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <h3 className="font-semibold">{member.name}</h3>
                                <TrendIcon trend={member.trend} />
                              </div>
                              <p className="text-sm text-muted-foreground">{member.role}</p>
                              
                              <div className="flex items-center gap-2 mt-3">
                                <div className={`p-1.5 rounded-full ${config.bg}`}>
                                  <SentimentIcon className={`h-4 w-4 ${config.color}`} />
                                </div>
                                <Badge variant="secondary" className="text-xs">
                                  {config.label}
                                </Badge>
                                <span className={`text-sm font-medium ${config.color}`}>
                                  {Math.round(member.sentimentScore * 100)}%
                                </span>
                              </div>

                              {member.riskLevel === "high" && (
                                <div className="flex items-center gap-1 mt-2 text-red-500 text-xs">
                                  <AlertTriangle className="h-3 w-3" />
                                  High churn risk - requires attention
                                </div>
                              )}
                              
                              <p className="text-xs text-muted-foreground mt-2">
                                Last check-in: {member.lastCheckIn.toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>

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
                      { method: "POST", endpoint: "/api/sentiment/check-in", desc: "Submit daily check-in" },
                      { method: "GET", endpoint: "/api/sentiment/team/{teamId}/dashboard", desc: "Team sentiment dashboard" },
                      { method: "GET", endpoint: "/api/sentiment/member/{id}/history", desc: "Individual sentiment history" },
                      { method: "GET", endpoint: "/api/sentiment/team/{teamId}/trends", desc: "Sentiment trends over time" },
                      { method: "GET", endpoint: "/api/sentiment/alerts", desc: "Get at-risk alerts" },
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

export default TeamSentimentTracker;
