import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  MessageSquare,
  Send,
  CreditCard,
  TrendingUp,
  Shield,
  Zap,
  Search,
  Users,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Bot,
  User,
  Sparkles,
  RefreshCw,
  Calendar,
  DollarSign,
  AlertCircle,
  X,
  Check,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";

// Mock data for demo
const currentSubscription = {
  plan: "Pro Plan",
  tier: "Professional",
  price: 49,
  billingCycle: "monthly",
  nextBilling: "Feb 15, 2026",
  status: "active",
  daysUntilRenewal: 35,
  features: ["Unlimited Users", "100GB Storage", "Priority Support", "Advanced Analytics"],
};

const churnRisk = {
  level: "medium",
  score: 0.42,
  factors: [
    "Login frequency decreased 30%",
    "Feature usage dropped",
    "Support tickets increased",
  ],
  recommendations: [
    "Schedule a success call",
    "Offer feature training",
    "Consider retention offer",
  ],
};

const plans = [
  {
    id: "basic",
    name: "Basic",
    price: 19,
    features: ["5 Users", "10GB Storage", "Email Support"],
    popular: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: 49,
    features: ["Unlimited Users", "100GB Storage", "Priority Support", "Advanced Analytics"],
    popular: true,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 149,
    features: ["Unlimited Everything", "1TB Storage", "24/7 Support", "Custom Integrations", "SLA"],
    popular: false,
  },
];

interface Message {
  id: string;
  type: "user" | "ai";
  content: string;
  action?: {
    type: string;
    requiresConfirmation: boolean;
    details?: string;
  };
  timestamp: Date;
}

const suggestedQueries = [
  "When does my subscription renew?",
  "Show me plans under $50",
  "Cancel my subscription",
  "Upgrade to Enterprise",
  "What features do I have?",
];

const SubscriptionManagementHub = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "ai",
      content: "👋 Hello! I'm your AI subscription assistant. How can I help you today? You can ask me about your subscription, search for plans, or manage your account using natural language.",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [pendingAction, setPendingAction] = useState<Message | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const processUserMessage = (message: string) => {
    const lowerMessage = message.toLowerCase();
    
    // Intent detection simulation
    if (lowerMessage.includes("cancel")) {
      return {
        content: "I understand you want to cancel your subscription. This will end your access to Pro Plan features on Feb 15, 2026.",
        action: {
          type: "cancel_subscription",
          requiresConfirmation: true,
          details: "Your Pro Plan subscription will be cancelled. You'll retain access until the end of your billing period.",
        },
      };
    } else if (lowerMessage.includes("upgrade") || lowerMessage.includes("enterprise")) {
      return {
        content: "Great choice! Upgrading to Enterprise will give you unlimited everything, 1TB storage, 24/7 support, and custom integrations. The price difference is $100/month.",
        action: {
          type: "upgrade_subscription",
          requiresConfirmation: true,
          details: "Upgrade from Pro ($49/mo) to Enterprise ($149/mo). You'll be charged a prorated amount for this billing cycle.",
        },
      };
    } else if (lowerMessage.includes("renew") || lowerMessage.includes("when")) {
      return {
        content: `Your Pro Plan subscription renews on **${currentSubscription.nextBilling}** (${currentSubscription.daysUntilRenewal} days from now). You'll be charged **$${currentSubscription.price}/month** automatically.`,
        action: undefined,
      };
    } else if (lowerMessage.includes("plans") || lowerMessage.includes("$50") || lowerMessage.includes("under")) {
      return {
        content: "I found **2 plans** under $50/month:\n\n🔹 **Basic** - $19/mo (5 Users, 10GB Storage)\n🔹 **Pro** - $49/mo (Unlimited Users, 100GB Storage, Priority Support)\n\nWould you like more details on any of these?",
        action: undefined,
      };
    } else if (lowerMessage.includes("features") || lowerMessage.includes("have")) {
      return {
        content: `With your **Pro Plan**, you have access to:\n\n✅ Unlimited Users\n✅ 100GB Storage\n✅ Priority Support\n✅ Advanced Analytics\n\nWant to explore upgrading for even more features?`,
        action: undefined,
      };
    } else if (lowerMessage.includes("downgrade") || lowerMessage.includes("basic")) {
      return {
        content: "You can downgrade to the Basic plan at $19/month. Note that you'll lose access to Priority Support and Advanced Analytics.",
        action: {
          type: "downgrade_subscription",
          requiresConfirmation: true,
          details: "Downgrade from Pro ($49/mo) to Basic ($19/mo). Changes will take effect at the start of your next billing cycle.",
        },
      };
    } else {
      return {
        content: "I'm here to help with your subscription! You can ask me to:\n\n• Check your renewal date\n• Search for plans\n• Upgrade or downgrade\n• Cancel your subscription\n• View your current features\n\nWhat would you like to do?",
        action: undefined,
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

    // Simulate AI processing
    setTimeout(() => {
      const response = processUserMessage(inputValue);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "ai",
        content: response.content,
        action: response.action,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);

      if (response.action?.requiresConfirmation) {
        setPendingAction(aiMessage);
      }
    }, 1200);
  };

  const handleConfirmAction = (confirmed: boolean) => {
    if (pendingAction) {
      const responseMessage: Message = {
        id: Date.now().toString(),
        type: "ai",
        content: confirmed
          ? `✅ Done! Your ${pendingAction.action?.type?.replace("_", " ")} has been processed successfully.`
          : "❌ Action cancelled. No changes have been made to your subscription.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, responseMessage]);
      setPendingAction(null);
    }
  };

  const filteredPlans = plans.filter((plan) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    if (query.includes("under") || query.includes("$")) {
      const priceMatch = query.match(/\$?(\d+)/);
      if (priceMatch) {
        return plan.price <= parseInt(priceMatch[1]);
      }
    }
    return plan.name.toLowerCase().includes(query) || 
           plan.features.some((f) => f.toLowerCase().includes(query));
  });

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
              <h1 className="text-3xl font-bold">Subscription Management Hub</h1>
              <p className="text-muted-foreground mt-1">
                AI-powered subscription management with natural language interface
              </p>
            </div>
            <div className="flex gap-2">
              <Badge variant="outline" className="gap-1">
                <MessageSquare className="h-3 w-3" />
                Intent Handling
              </Badge>
              <Badge variant="outline" className="gap-1">
                <Search className="h-3 w-3" />
                Semantic Search
              </Badge>
              <Badge variant="outline" className="gap-1">
                <TrendingUp className="h-3 w-3" />
                Analytics
              </Badge>
            </div>
          </motion.div>
        </section>

        {/* Main Content */}
        <section className="container mx-auto px-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 max-w-xl">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="chat">AI Chat</TabsTrigger>
              <TabsTrigger value="plans">Plans</TabsTrigger>
              <TabsTrigger value="management">Management</TabsTrigger>
            </TabsList>

            {/* Dashboard Tab */}
            <TabsContent value="dashboard" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Current Subscription Card */}
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-primary" />
                      Current Subscription
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-2xl font-bold">{currentSubscription.plan}</h3>
                          <Badge className="bg-accent text-accent-foreground">Active</Badge>
                        </div>
                        <p className="text-muted-foreground">{currentSubscription.tier}</p>
                      </div>
                      <div className="text-right">
                        <div className="text-3xl font-bold text-gradient">
                          ${currentSubscription.price}
                          <span className="text-sm text-muted-foreground font-normal">/mo</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                      <div className="flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Next Billing</p>
                          <p className="font-medium">{currentSubscription.nextBilling}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <RefreshCw className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="text-sm text-muted-foreground">Days Until Renewal</p>
                          <p className="font-medium">{currentSubscription.daysUntilRenewal} days</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-4">
                      {currentSubscription.features.map((feature) => (
                        <Badge key={feature} variant="secondary" className="gap-1">
                          <CheckCircle2 className="h-3 w-3" />
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Churn Risk Card */}
                <Card className={`border-l-4 ${
                  churnRisk.level === "low" ? "border-l-accent" :
                  churnRisk.level === "medium" ? "border-l-yellow-500" :
                  "border-l-destructive"
                }`}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Churn Risk
                    </CardTitle>
                    <CardDescription>Powered by Behavior Analytics</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className={`flex h-16 w-16 items-center justify-center rounded-full ${
                        churnRisk.level === "low" ? "bg-accent/20 text-accent" :
                        churnRisk.level === "medium" ? "bg-yellow-500/20 text-yellow-600" :
                        "bg-destructive/20 text-destructive"
                      }`}>
                        <span className="text-xl font-bold">{Math.round(churnRisk.score * 100)}%</span>
                      </div>
                      <div>
                        <Badge variant={churnRisk.level === "low" ? "default" : churnRisk.level === "medium" ? "secondary" : "destructive"}>
                          {churnRisk.level.charAt(0).toUpperCase() + churnRisk.level.slice(1)} Risk
                        </Badge>
                        <p className="text-sm text-muted-foreground mt-1">Based on behavior patterns</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <p className="text-sm font-medium">Risk Factors:</p>
                      {churnRisk.factors.map((factor, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <AlertTriangle className="h-3 w-3 text-yellow-500" />
                          {factor}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card className="lg:col-span-3">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="h-5 w-5 text-primary" />
                      Quick Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <Button 
                        variant="outline" 
                        className="h-auto py-4 flex-col gap-2"
                        onClick={() => setActiveTab("chat")}
                      >
                        <MessageSquare className="h-5 w-5 text-primary" />
                        <span>Ask AI Assistant</span>
                      </Button>
                      <Button 
                        variant="outline" 
                        className="h-auto py-4 flex-col gap-2"
                        onClick={() => setActiveTab("plans")}
                      >
                        <Search className="h-5 w-5 text-primary" />
                        <span>View Plans</span>
                      </Button>
                      <Button 
                        variant="outline" 
                        className="h-auto py-4 flex-col gap-2"
                        onClick={() => setActiveTab("management")}
                      >
                        <CreditCard className="h-5 w-5 text-primary" />
                        <span>Manage Subscription</span>
                      </Button>
                      <Button 
                        variant="outline" 
                        className="h-auto py-4 flex-col gap-2"
                        onClick={() => setActiveTab("management")}
                      >
                        <Shield className="h-5 w-5 text-primary" />
                        <span>Update Address</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Chat Tab */}
            <TabsContent value="chat" className="space-y-4">
              <Card className="h-[600px] flex flex-col">
                <CardHeader className="border-b border-border">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-primary">
                      <Bot className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div>
                      <CardTitle>AI Subscription Assistant</CardTitle>
                      <CardDescription>
                        Powered by Intent Action Handling & Semantic Search
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
                          <div className={`inline-block rounded-2xl px-4 py-2 ${
                            message.type === "user"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          }`}>
                            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                          </div>

                          {/* Action Confirmation */}
                          {message.action?.requiresConfirmation && pendingAction?.id === message.id && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="p-4 rounded-xl border border-border bg-card shadow-lg"
                            >
                              <div className="flex items-start gap-3 mb-3">
                                <AlertCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                                <div>
                                  <p className="font-medium">Confirm Action</p>
                                  <p className="text-sm text-muted-foreground">{message.action.details}</p>
                                </div>
                              </div>
                              <div className="flex gap-2 justify-end">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleConfirmAction(false)}
                                >
                                  <X className="h-4 w-4 mr-1" />
                                  Cancel
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() => handleConfirmAction(true)}
                                >
                                  <Check className="h-4 w-4 mr-1" />
                                  Confirm
                                </Button>
                              </div>
                            </motion.div>
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
                      <div className="bg-muted rounded-2xl px-4 py-2">
                        <div className="flex gap-1">
                          <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "0ms" }} />
                          <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "150ms" }} />
                          <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "300ms" }} />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </CardContent>

                {/* Suggested Queries */}
                <div className="px-4 py-2 border-t border-border">
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {suggestedQueries.map((query) => (
                      <Button
                        key={query}
                        variant="ghost"
                        size="sm"
                        className="shrink-0 text-xs"
                        onClick={() => {
                          setInputValue(query);
                          setTimeout(() => handleSendMessage(), 100);
                        }}
                      >
                        {query}
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
                      placeholder="Type your message... (e.g., 'Cancel my subscription')"
                      className="flex-1"
                    />
                    <Button type="submit" disabled={!inputValue.trim() || isTyping}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>
                </div>
              </Card>
            </TabsContent>

            {/* Plans Tab */}
            <TabsContent value="plans" className="space-y-6">
              {/* Search */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search plans... (e.g., 'plans under $50', 'unlimited storage')"
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">
                    <Sparkles className="h-3 w-3 inline mr-1" />
                    Powered by Semantic Search - understands natural language
                  </p>
                </CardContent>
              </Card>

              {/* Plans Grid */}
              <div className="grid gap-6 md:grid-cols-3">
                {filteredPlans.map((plan) => (
                  <Card
                    key={plan.id}
                    className={`relative ${plan.popular ? "border-primary shadow-glow" : ""}`}
                  >
                    {plan.popular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <Badge className="bg-gradient-primary text-primary-foreground">
                          Most Popular
                        </Badge>
                      </div>
                    )}
                    <CardHeader className="text-center pt-8">
                      <CardTitle>{plan.name}</CardTitle>
                      <div className="mt-4">
                        <span className="text-4xl font-bold">${plan.price}</span>
                        <span className="text-muted-foreground">/month</span>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        {plan.features.map((feature) => (
                          <div key={feature} className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-accent" />
                            <span className="text-sm">{feature}</span>
                          </div>
                        ))}
                      </div>
                      <Button 
                        className="w-full" 
                        variant={plan.popular ? "default" : "outline"}
                      >
                        {plan.name === currentSubscription.plan.replace(" Plan", "") 
                          ? "Current Plan" 
                          : plan.price > currentSubscription.price 
                            ? "Upgrade" 
                            : "Downgrade"
                        }
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Recommendations */}
              <Card className="bg-muted/30">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    Recommended for You
                  </CardTitle>
                  <CardDescription>Based on your usage patterns and behavior analytics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-4 rounded-lg bg-card border border-border">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-primary">
                        <ArrowUpRight className="h-6 w-6 text-primary-foreground" />
                      </div>
                      <div>
                        <h4 className="font-semibold">Consider Enterprise Plan</h4>
                        <p className="text-sm text-muted-foreground">
                          You're using 85% of your storage. Enterprise offers 10x more capacity.
                        </p>
                      </div>
                    </div>
                    <Button>Learn More</Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Management Tab */}
            <TabsContent value="management" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Subscription Details */}
                <Card>
                  <CardHeader>
                    <CardTitle>Subscription Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-border">
                      <span className="text-muted-foreground">Plan</span>
                      <span className="font-medium">{currentSubscription.plan}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-border">
                      <span className="text-muted-foreground">Billing Cycle</span>
                      <span className="font-medium capitalize">{currentSubscription.billingCycle}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-border">
                      <span className="text-muted-foreground">Next Billing</span>
                      <span className="font-medium">{currentSubscription.nextBilling}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-border">
                      <span className="text-muted-foreground">Amount</span>
                      <span className="font-medium">${currentSubscription.price}/month</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-muted-foreground">Auto-Renewal</span>
                      <Badge variant="secondary">Enabled</Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* Usage Statistics */}
                <Card>
                  <CardHeader>
                    <CardTitle>Usage Statistics</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Storage Used</span>
                        <span className="font-medium">85GB / 100GB</span>
                      </div>
                      <Progress value={85} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Active Users</span>
                        <span className="font-medium">12 / Unlimited</span>
                      </div>
                      <Progress value={12} className="h-2" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>API Calls (this month)</span>
                        <span className="font-medium">45,230 / 100,000</span>
                      </div>
                      <Progress value={45} className="h-2" />
                    </div>
                  </CardContent>
                </Card>

                {/* Actions */}
                <Card className="md:col-span-2">
                  <CardHeader>
                    <CardTitle>Subscription Actions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                        <ArrowUpRight className="h-5 w-5 text-accent" />
                        <span>Upgrade Plan</span>
                      </Button>
                      <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                        <ArrowDownRight className="h-5 w-5 text-yellow-500" />
                        <span>Downgrade Plan</span>
                      </Button>
                      <Button variant="outline" className="h-auto py-4 flex-col gap-2">
                        <DollarSign className="h-5 w-5 text-primary" />
                        <span>Update Payment</span>
                      </Button>
                      <Button variant="outline" className="h-auto py-4 flex-col gap-2 text-destructive hover:text-destructive">
                        <X className="h-5 w-5" />
                        <span>Cancel Subscription</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
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
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {[
                  { icon: MessageSquare, label: "Intent Extraction", desc: "Natural language to actions" },
                  { icon: Search, label: "Semantic Search", desc: "Meaning-based queries" },
                  { icon: TrendingUp, label: "Behavior Analytics", desc: "Churn prediction" },
                  { icon: Shield, label: "PII Detection", desc: "Address validation" },
                  { icon: Zap, label: "Action Handlers", desc: "Subscribe, cancel, upgrade" },
                  { icon: Users, label: "RAG Provider", desc: "Context-aware answers" },
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
      </main>

      <Footer />
    </div>
  );
};

export default SubscriptionManagementHub;
