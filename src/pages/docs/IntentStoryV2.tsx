import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Highlight, themes } from "prism-react-renderer";
import DocsLayout from "@/components/docs/DocsLayout";
import PageViewCounter from "@/components/PageViewCounter";
import StoryLoveButton from "@/components/StoryLoveButton";
import StoryNavigation from "@/components/StoryNavigation";
import { 
  Brain,
  Zap,
  MessageSquare,
  User,
  Bot,
  CheckCircle2,
  XCircle,
  Sparkles,
  Play,
  Pause,
  RotateCcw,
  ArrowRight,
  Lightbulb,
  Cpu,
  FileCode,
  Package,
  Search,
  Layers,
  Shield
} from "lucide-react";

const PAGE_TITLE = "Intent Extraction V2: A Conversation Story - AI Fabric Framework";
const PAGE_DESCRIPTION = "Experience how AI learns to understand users through an interactive storytelling approach.";

const codeTheme = {
  ...themes.nightOwl,
  plain: {
    ...themes.nightOwl.plain,
    backgroundColor: "hsl(var(--code-bg))",
  },
};

const CodeBlock = ({ code, language = "java" }: { code: string; language?: string }) => (
  <Highlight theme={codeTheme} code={code.trim()} language={language}>
    {({ style, tokens, getLineProps, getTokenProps }) => (
      <pre
        className="overflow-x-auto rounded-lg border border-border/50 p-4 text-sm my-4"
        style={style}
      >
        {tokens.map((line, i) => (
          <div key={i} {...getLineProps({ line })}>
            {line.map((token, key) => (
              <span key={key} {...getTokenProps({ token })} />
            ))}
          </div>
        ))}
      </pre>
    )}
  </Highlight>
);

interface Message {
  speaker: "user" | "system";
  text: string;
  intent?: string;
  confidence?: number;
  action?: string;
}

const ConversationSimulator = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const conversation: Message[] = [
    { speaker: "user", text: "I want to cancel my subscription" },
    { speaker: "system", text: "Analyzing intent...", intent: "cancel_subscription", confidence: 0.95, action: "ACTION" },
    { speaker: "system", text: "✓ Understood: Cancel Subscription (95% confidence)" },
    { speaker: "system", text: "Routing to SubscriptionHandler..." },
    { speaker: "system", text: "✓ Subscription cancelled successfully" },
    { speaker: "user", text: "Actually, can you help me downgrade to Basic instead?" },
    { speaker: "system", text: "Analyzing intent...", intent: "change_plan", confidence: 0.91, action: "ACTION" },
    { speaker: "system", text: "✓ Understood: Change Plan to Basic (91% confidence)" },
    { speaker: "system", text: "✓ Plan updated successfully" },
  ];

  useEffect(() => {
    if (isPlaying && currentStep < conversation.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, 1500);
      return () => clearTimeout(timer);
    } else if (currentStep >= conversation.length - 1) {
      setIsPlaying(false);
    }
  }, [isPlaying, currentStep, conversation.length]);

  return (
    <div className="my-12 p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/20">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-primary" />
          Live Intent Detection
        </h3>
        <div className="flex gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </button>
          <button
            onClick={() => { setCurrentStep(0); setIsPlaying(false); }}
            className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      <div className="space-y-3 min-h-[400px]">
        <AnimatePresence mode="popLayout">
          {conversation.slice(0, currentStep + 1).map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className={`flex gap-3 ${msg.speaker === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className={`flex gap-3 max-w-[80%] ${msg.speaker === "user" ? "flex-row-reverse" : "flex-row"}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                  msg.speaker === "user" ? "bg-blue-500" : "bg-primary"
                }`}>
                  {msg.speaker === "user" ? (
                    <User className="h-4 w-4 text-white" />
                  ) : (
                    <Bot className="h-4 w-4 text-primary-foreground" />
                  )}
                </div>
                <div className={`rounded-2xl p-4 ${
                  msg.speaker === "user" 
                    ? "bg-blue-500/10 border border-blue-500/20" 
                    : "bg-card border border-border/50"
                }`}>
                  <p className="text-sm text-foreground">{msg.text}</p>
                  {msg.intent && (
                    <div className="mt-2 pt-2 border-t border-border/30 space-y-1">
                      <div className="text-xs text-muted-foreground flex items-center gap-2">
                        <Cpu className="h-3 w-3 text-primary" />
                        Intent: <span className="font-mono text-primary">{msg.intent}</span>
                      </div>
                      <div className="text-xs text-muted-foreground flex items-center gap-2">
                        <Zap className="h-3 w-3 text-amber-400" />
                        Confidence: <span className="text-amber-400 font-semibold">{msg.confidence}%</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      
      <div className="mt-6 p-4 rounded-lg bg-muted/50 border border-border/30">
        <p className="text-xs text-muted-foreground text-center">
          Each message is analyzed by the LLM → Intent extracted → Routed to your business logic
        </p>
      </div>
    </div>
  );
};

const BeforeAfterComparison = () => {
  const [activeTab, setActiveTab] = useState<"before" | "after">("before");
  
  return (
    <div className="my-12">
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab("before")}
          className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all ${
            activeTab === "before"
              ? "bg-red-500/20 border-2 border-red-500/50 text-red-400"
              : "bg-muted/30 border border-border/50 text-muted-foreground hover:border-border"
          }`}
        >
          <XCircle className="h-4 w-4 inline mr-2" />
          Before: The Chaos
        </button>
        <button
          onClick={() => setActiveTab("after")}
          className={`flex-1 py-3 px-6 rounded-lg font-semibold transition-all ${
            activeTab === "after"
              ? "bg-green-500/20 border-2 border-green-500/50 text-green-400"
              : "bg-muted/30 border border-border/50 text-muted-foreground hover:border-border"
          }`}
        >
          <CheckCircle2 className="h-4 w-4 inline mr-2" />
          After: The Clarity
        </button>
      </div>
      
      <AnimatePresence mode="wait">
        {activeTab === "before" ? (
          <motion.div
            key="before"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="space-y-6"
          >
            <div className="p-6 rounded-xl bg-red-500/5 border border-red-500/20">
              <h4 className="font-bold text-foreground mb-4 flex items-center gap-2">
                <XCircle className="h-5 w-5 text-red-400" />
                Sarah's Monday Morning Nightmare
              </h4>
              <div className="space-y-3 text-sm text-muted-foreground">
                <p>
                  <strong className="text-foreground">9:00 AM:</strong> Product manager: "We need to support 'cancel subscription' in chat."
                </p>
                <p>
                  <strong className="text-foreground">9:15 AM:</strong> Sarah adds: <code className="text-red-400 bg-red-500/10 px-1 rounded">if (msg.contains("cancel"))</code>
                </p>
                <p>
                  <strong className="text-foreground">10:30 AM:</strong> User says "stop billing" → doesn't work 😤
                </p>
                <p>
                  <strong className="text-foreground">11:00 AM:</strong> Sarah adds: <code className="text-red-400 bg-red-500/10 px-1 rounded">|| msg.contains("stop")</code>
                </p>
                <p>
                  <strong className="text-foreground">2:00 PM:</strong> User says "unsubscribe" → doesn't work 😤😤
                </p>
                <p>
                  <strong className="text-foreground">3:00 PM:</strong> Function now has 47 if/else statements...
                </p>
                <p>
                  <strong className="text-foreground">4:30 PM:</strong> Bug report: "stopped my subscription" triggers "stop" keyword in wrong context
                </p>
                <p className="text-red-400 font-semibold pt-2 border-t border-red-500/20">
                  5:00 PM: Sarah questions her career choices 😭
                </p>
              </div>
            </div>
            
            <CodeBlock code={`// Sarah's nightmare function (simplified)
public String handleChat(String message) {
    String lower = message.toLowerCase();
    
    // Version 1: Too simple
    if (lower.contains("cancel")) return cancel();
    
    // Version 2: Edge cases appearing
    if (lower.contains("cancel") || lower.contains("stop")) return cancel();
    
    // Version 3: False positives
    if ((lower.contains("cancel") || lower.contains("stop")) 
        && !lower.contains("stopped")) return cancel();
    
    // Version 4: More edge cases
    if ((lower.contains("cancel") || lower.contains("stop") 
         || lower.contains("unsubscribe"))
        && !lower.contains("stopped") 
        && !lower.contains("stopping")) return cancel();
    
    // ... 43 more conditions later ...
    
    return "I didn't understand that 🤷";
}`} />
          </motion.div>
        ) : (
          <motion.div
            key="after"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <div className="p-6 rounded-xl bg-green-500/5 border border-green-500/20">
              <h4 className="font-bold text-foreground mb-4 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-400" />
                Sarah's Tuesday Morning Zen
              </h4>
              <div className="space-y-3 text-sm text-muted-foreground">
                <p>
                  <strong className="text-foreground">9:00 AM:</strong> Sarah discovers AI Fabric
                </p>
                <p>
                  <strong className="text-foreground">9:05 AM:</strong> Deletes 500 lines of if/else code ✨
                </p>
                <p>
                  <strong className="text-foreground">9:10 AM:</strong> Implements one clean ActionHandler
                </p>
                <p>
                  <strong className="text-foreground">9:30 AM:</strong> Tests: "cancel", "stop billing", "unsubscribe", "I want to cancel" → ALL WORK 🎉
                </p>
                <p>
                  <strong className="text-foreground">10:00 AM:</strong> Tests edge cases: "I stopped my subscription yesterday" → Correctly ignored ✓
                </p>
                <p>
                  <strong className="text-foreground">10:30 AM:</strong> Deploys to production
                </p>
                <p className="text-green-400 font-semibold pt-2 border-t border-green-500/20">
                  11:00 AM: Sarah has coffee, feeling like a genius ☕✨
                </p>
              </div>
            </div>
            
            <CodeBlock code={`// Sarah's zen code
@PostMapping("/api/chat")
public OrchestrationResult chat(@RequestBody String message) {
    // That's it. Framework handles everything.
    return orchestrator.orchestrate(message, context);
}

// Clean, isolated business logic
@Component
public class SubscriptionHandler implements ActionHandler {
    @Override
    public ActionResult executeAction(Map params, String userId) {
        // Just focus on WHAT to do, not HOW to parse
        return subscriptionService.cancel(userId);
    }
}`} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const MagicMoment = () => {
  const examples = [
    { input: '"Cancel my subscription"', output: "cancel_subscription", color: "text-blue-400" },
    { input: '"Stop billing me"', output: "cancel_subscription", color: "text-purple-400" },
    { input: '"I want to unsubscribe"', output: "cancel_subscription", color: "text-green-400" },
    { input: '"End my plan please"', output: "cancel_subscription", color: "text-amber-400" },
    { input: '"Make me stop paying"', output: "cancel_subscription", color: "text-pink-400" },
  ];

  return (
    <div className="my-16 p-8 rounded-2xl bg-gradient-to-br from-primary/10 via-accent/5 to-primary/5 border-2 border-primary/30 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent/5 rounded-full blur-3xl" />
      
      <div className="relative">
        <div className="text-center mb-8">
          <Lightbulb className="h-12 w-12 text-primary mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-foreground mb-2">The Magic Moment</h3>
          <p className="text-muted-foreground">One intent. Infinite ways to say it.</p>
        </div>
        
        <div className="space-y-3">
          {examples.map((example, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
              className="flex items-center gap-4 p-4 rounded-xl bg-card/50 border border-border/30 backdrop-blur-sm"
            >
              <div className="flex-1">
                <p className="text-sm text-muted-foreground font-mono">{example.input}</p>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
              <div className="flex-1">
                <p className={`text-sm font-mono font-semibold ${example.color}`}>
                  {example.output}
                </p>
              </div>
              <CheckCircle2 className="h-5 w-5 text-green-400 shrink-0" />
            </motion.div>
          ))}
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            <span className="text-primary font-semibold">Zero</span> string parsing.{" "}
            <span className="text-primary font-semibold">Zero</span> regex.{" "}
            <span className="text-primary font-semibold">Zero</span> keywords.
          </p>
          <p className="text-lg font-bold text-foreground mt-2">Just pure understanding.</p>
        </div>
      </div>
    </div>
  );
};

const FourUniversalLanguages = () => {
  const intentTypes = [
    {
      type: "ACTION",
      title: "Do Something",
      desc: "When users want the system to execute an operation",
      example: '"Cancel my subscription"',
      icon: Zap,
      color: "text-amber-400",
      borderColor: "border-amber-500/30",
      bgColor: "bg-amber-500/5"
    },
    {
      type: "INFORMATION",
      title: "Find Something",
      desc: "When users are searching for information or data",
      example: '"What is your return policy?"',
      icon: Search,
      color: "text-blue-400",
      borderColor: "border-blue-500/30",
      bgColor: "bg-blue-500/5"
    },
    {
      type: "OUT_OF_SCOPE",
      title: "Beyond Boundaries",
      desc: "When requests fall outside your system's domain",
      example: '"What is the weather?"',
      icon: XCircle,
      color: "text-red-400",
      borderColor: "border-red-500/30",
      bgColor: "bg-red-500/5"
    },
    {
      type: "COMPOUND",
      title: "Multiple Things",
      desc: "When users want several actions in sequence",
      example: '"Cancel and refund me"',
      icon: Layers,
      color: "text-purple-400",
      borderColor: "border-purple-500/30",
      bgColor: "bg-purple-500/5"
    }
  ];

  return (
    <div className="my-16">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-foreground mb-2">The Four Universal Languages of Intent</h3>
        <p className="text-muted-foreground">Every user request falls into one of these categories</p>
      </div>
      
      <div className="grid md:grid-cols-2 gap-6">
        {intentTypes.map((intent, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            viewport={{ once: true }}
            className={`p-6 rounded-xl border ${intent.borderColor} ${intent.bgColor} relative overflow-hidden group hover:scale-[1.02] transition-transform`}
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <intent.icon className={`h-24 w-24 ${intent.color}`} />
            </div>
            
            <div className="relative">
              <div className="flex items-center gap-3 mb-4">
                <div className={`p-2 rounded-lg bg-muted/50`}>
                  <intent.icon className={`h-5 w-5 ${intent.color}`} />
                </div>
                <div>
                  <h4 className={`font-bold ${intent.color} text-lg`}>{intent.type}</h4>
                  <p className="text-sm text-muted-foreground">{intent.title}</p>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground mb-4">{intent.desc}</p>
              
              <div className="p-3 rounded-lg bg-muted/30 border border-border/30">
                <p className="text-xs text-muted-foreground mb-1">Example:</p>
                <p className={`text-sm font-mono ${intent.color}`}>{intent.example}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      <div className="mt-8 p-6 rounded-xl bg-card border border-border/50 text-center">
        <p className="text-sm text-muted-foreground">
          The LLM automatically categorizes every request. <span className="text-primary font-semibold">You never write parsing logic again.</span>
        </p>
      </div>
    </div>
  );
};

const WhatSarahImplemented = () => {
  const [activeMethod, setActiveMethod] = useState(0);
  
  const methods = [
    {
      name: "Metadata",
      icon: FileCode,
      title: "Define Your Action",
      description: "Tell the system what this action is called and what it does",
      code: `@Override
public AIActionMetaData getActionMetadata() {
    return AIActionMetaData.builder()
        .name("cancel_subscription")
        .description("Cancel user's subscription")
        .category("subscription_management")
        .requiresAuth(true)
        .riskLevel("HIGH")
        .build();
}`,
      color: "text-blue-400"
    },
    {
      name: "Permissions",
      icon: Shield,
      title: "Control Access",
      description: "Decide who can perform this action—isolated, testable logic",
      code: `@Override
public boolean validateActionAllowed(String userId) {
    // YOUR permission logic
    Optional<Subscription> sub = subscriptionService
        .findByUserId(userId);
    
    return sub.isPresent() && sub.get().canBeCancelled();
}`,
      color: "text-green-400"
    },
    {
      name: "Confirmations",
      icon: MessageSquare,
      title: "Ask Before Acting",
      description: "Natural language confirmation messages for sensitive actions",
      code: `@Override
public String getConfirmationMessage(Map<String, Object> params) {
    return "Cancel subscription? " +
           "You'll lose access to Pro features immediately. " +
           "Continue?";
}`,
      color: "text-amber-400"
    },
    {
      name: "Execution",
      icon: Zap,
      title: "Do The Thing",
      description: "Your core business logic—the actual work gets done here",
      code: `@Override
public ActionResult executeAction(Map params, String userId) {
    // YOUR business logic
    Subscription sub = subscriptionService.cancel(userId);
    notificationService.sendCancellationEmail(userId);
    
    return ActionResult.builder()
        .success(true)
        .message("Subscription cancelled successfully")
        .data(Map.of("cancelledAt", sub.getCancelledAt()))
        .build();
}`,
      color: "text-purple-400"
    },
    {
      name: "Error Handling",
      icon: XCircle,
      title: "Handle Failures Gracefully",
      description: "Provide meaningful feedback when things go wrong",
      code: `@Override
public ActionResult handleError(Exception e, String userId) {
    log.error("Cancellation failed for user: {}", userId, e);
    opsAlert.send("Subscription cancellation failed", e);
    
    return ActionResult.builder()
        .success(false)
        .message("We encountered an error. Our team has been notified.")
        .errorCode("INTERNAL_ERROR")
        .build();
}`,
      color: "text-red-400"
    }
  ];

  return (
    <div className="my-16">
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-foreground mb-2">What Sarah Actually Implemented</h3>
        <p className="text-muted-foreground">Five simple methods. No parsing. Just business logic.</p>
      </div>
      
      <div className="grid lg:grid-cols-5 gap-2 mb-6">
        {methods.map((method, i) => (
          <button
            key={i}
            onClick={() => setActiveMethod(i)}
            className={`p-4 rounded-lg border-2 transition-all ${
              activeMethod === i
                ? `${method.color.replace('text-', 'border-')} bg-card shadow-lg`
                : 'border-border/30 bg-muted/30 hover:border-border'
            }`}
          >
            <method.icon className={`h-6 w-6 mx-auto mb-2 ${activeMethod === i ? method.color : 'text-muted-foreground'}`} />
            <p className={`text-xs font-semibold ${activeMethod === i ? 'text-foreground' : 'text-muted-foreground'}`}>
              {method.name}
            </p>
          </button>
        ))}
      </div>
      
      <AnimatePresence mode="wait">
        <motion.div
          key={activeMethod}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="p-6 rounded-xl bg-card border border-border/50"
        >
          <div className="flex items-center gap-3 mb-4">
            {React.createElement(methods[activeMethod].icon, {
              className: `h-6 w-6 ${methods[activeMethod].color}`
            })}
            <div>
              <h4 className="font-bold text-foreground text-lg">{methods[activeMethod].title}</h4>
              <p className="text-sm text-muted-foreground">{methods[activeMethod].description}</p>
            </div>
          </div>
          
          <CodeBlock code={methods[activeMethod].code} />
          
          <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
            <CheckCircle2 className="h-4 w-4 text-green-400" />
            <span>Clean, testable, isolated from parsing logic</span>
          </div>
        </motion.div>
      </AnimatePresence>
      
      <div className="mt-8 p-6 rounded-xl bg-gradient-to-br from-primary/10 to-accent/5 border border-primary/20 text-center">
        <p className="text-foreground font-medium mb-2">
          "I went from parsing expert to business logic expert in one day."
        </p>
        <p className="text-sm text-muted-foreground">— Sarah, after implementing ActionHandler</p>
      </div>
    </div>
  );
};

const ThreeStepJourney = () => {
  const steps = [
    {
      icon: Package,
      title: "Install the Framework",
      time: "2 minutes",
      code: `<dependency>
    <groupId>com.ai.fabric</groupId>
    <artifactId>ai-fabric-orchestrator</artifactId>
</dependency>`,
      description: "One dependency. Zero configuration needed."
    },
    {
      icon: FileCode,
      title: "Implement Your Handler",
      time: "5 minutes",
      code: `@Component
public class YourActionHandler implements ActionHandler {
    public ActionResult executeAction(Map params, String userId) {
        // Your business logic here
        return yourService.doTheThing(userId);
    }
}`,
      description: "Focus on business logic, not parsing."
    },
    {
      icon: Sparkles,
      title: "Ship It",
      time: "1 minute",
      code: `// That's literally it
return orchestrator.orchestrate(userMessage, context);`,
      description: "Users can now say anything. Your code understands."
    }
  ];

  return (
    <div className="my-16">
      <h3 className="text-2xl font-bold text-foreground mb-8 text-center">Your 8-Minute Journey to Intent Mastery</h3>
      <div className="space-y-8">
        {steps.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            viewport={{ once: true }}
            className="flex gap-6"
          >
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-primary-foreground font-bold text-lg shrink-0">
                {i + 1}
              </div>
              {i < steps.length - 1 && (
                <div className="w-0.5 flex-1 bg-gradient-to-b from-primary/50 to-transparent mt-2" />
              )}
            </div>
            
            <div className="flex-1 pb-8">
              <div className="flex items-center gap-3 mb-3">
                <step.icon className="h-6 w-6 text-primary" />
                <h4 className="font-bold text-foreground text-lg">{step.title}</h4>
                <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                  {step.time}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">{step.description}</p>
              <CodeBlock code={step.code} language={i === 0 ? "xml" : "java"} />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const IntentStoryV2 = () => {
  useEffect(() => {
    document.title = PAGE_TITLE;
  }, []);

  return (
    <DocsLayout>
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Top Navigation */}
        <StoryNavigation variant="compact" className="pt-6 mb-4" />

        <motion.article 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Hero */}
          <section className="relative overflow-hidden border-b border-border/50 pb-12 mb-12">
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-primary/5" />
            <div className="relative">
              <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-2 text-sm font-medium text-accent">
                    <MessageSquare className="h-4 w-4" />
                    Intent Extraction V2
                  </span>
                  <Link 
                    to="/docs/intent_story"
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    ← View V1
                  </Link>
                </div>
                <div className="flex items-center gap-3">
                  <StoryLoveButton storySlug="intent-story-v2" />
                  <PageViewCounter />
                </div>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
                The Conversation That{" "}
                <span className="text-gradient">Changed Everything</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mb-8">
                A story about Sarah, a developer who discovered that understanding users doesn't require parsing—it requires listening.
              </p>
            </div>
          </section>

          {/* Interactive Conversation Simulator */}
          <ConversationSimulator />

          {/* Before/After Story */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
              A Tale of Two Mondays
            </h2>
            <BeforeAfterComparison />
          </section>

          {/* The Magic Moment */}
          <MagicMoment />

          {/* Four Universal Languages */}
          <FourUniversalLanguages />

          {/* What Sarah Implemented */}
          <WhatSarahImplemented />

          {/* Three Step Journey */}
          <ThreeStepJourney />

          {/* What Actually Happens */}
          <section className="mb-16 p-8 rounded-2xl bg-muted/30 border border-border/50">
            <h3 className="text-xl font-bold text-foreground mb-6 text-center">
              What Actually Happens Behind the Scenes
            </h3>
            <div className="space-y-4">
              {[
                { step: "User speaks naturally", detail: '"I want to cancel my subscription"' },
                { step: "LLM understands context", detail: "Not just keywords—actual meaning" },
                { step: "Intent extracted", detail: '{ type: "ACTION", action: "cancel_subscription" }' },
                { step: "Framework routes automatically", detail: "Finds your SubscriptionHandler" },
                { step: "Your code runs", detail: "subscriptionService.cancel(userId)" },
                { step: "Clean response", detail: "User gets confirmation" }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-4 p-4 rounded-lg bg-card/50 border border-border/30"
                >
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary text-sm shrink-0">
                    {i + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground text-sm">{item.step}</p>
                    <p className="text-xs text-muted-foreground font-mono">{item.detail}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                </motion.div>
              ))}
            </div>
          </section>

          {/* The Revelation */}
          <section className="mb-16 p-8 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/5 border border-primary/20 text-center">
            <Brain className="h-16 w-16 text-primary mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-foreground mb-4">The Revelation</h3>
            <div className="max-w-2xl mx-auto space-y-4 text-muted-foreground">
              <p className="text-lg">
                "I spent years trying to predict every possible way users might phrase things."
              </p>
              <p className="text-lg">
                "Then I realized: <span className="text-primary font-semibold">I don't need to predict. I need to understand.</span>"
              </p>
              <p className="text-lg">
                "That's what the LLM does. And that's what changed everything."
              </p>
              <p className="text-sm text-foreground italic font-semibold pt-4 border-t border-border/30">
                — Sarah, after discovering AI Fabric
              </p>
            </div>
          </section>

          {/* Story Navigation */}


          <StoryNavigation className="mt-12" />



          {/* Footer */}
          <footer className="border-t border-border/50 pt-12 mt-12 flex flex-col items-center gap-6">
            <div className="flex items-center gap-4">
              <StoryLoveButton storySlug="intent-story-v2" />
              <PageViewCounter />
            </div>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link 
                to="/docs/guides/intent" 
                className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
              >
                <FileCode className="h-4 w-4" />
                Read Technical Guide
              </Link>
              <Link 
                to="/docs/intent_story" 
                className="inline-flex items-center gap-2 px-6 py-2 rounded-full border border-border bg-card text-foreground font-medium hover:bg-muted transition-colors"
              >
                View V1 (Technical)
              </Link>
            </div>
            <p className="text-xs text-muted-foreground text-center max-w-md">
              Part of the AI Fabric Framework series — where technology meets storytelling
            </p>
          </footer>
        </motion.article>
      </div>
    </DocsLayout>
  );
};

export default IntentStoryV2;

