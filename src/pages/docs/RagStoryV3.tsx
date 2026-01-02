import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Highlight, themes } from "prism-react-renderer";
import DocsLayout from "@/components/docs/DocsLayout";
import PageViewCounter from "@/components/PageViewCounter";
import StoryLoveButton from "@/components/StoryLoveButton";
import { 
  MessageSquare,
  Search,
  Brain,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  DollarSign,
  Shield,
  Zap,
  Cpu,
  Cloud,
  HardDrive,
  FileText,
  Play,
  Pause,
  RotateCcw,
  ArrowRight,
  Timer,
  TrendingUp,
  Eye,
  Database,
  Sparkles,
  Heart,
  Activity,
  Users,
  HelpCircle,
  BookOpen
} from "lucide-react";

const PAGE_TITLE = "RAG V3: The Support Ticket That Changed Everything - AI Fabric Framework";
const PAGE_DESCRIPTION = "A realistic RAG story: How a customer support chatbot went from guessing to answering from your knowledge base—zero hallucinations, real answers.";

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

const TheSupportCrisis = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const steps = [
    {
      time: "Monday 2:00 PM",
      title: "The Question",
      icon: MessageSquare,
      color: "text-blue-400",
      bgColor: "bg-blue-500/5",
      borderColor: "border-blue-500/30",
      events: [
        { emoji: "💬", text: "Customer: 'What's your return policy?'", type: "normal" },
        { emoji: "🤖", text: "Chatbot: 'Let me check that for you...'", type: "normal" }
      ]
    },
    {
      time: "Monday 2:01 PM",
      title: "The Hallucination",
      icon: Brain,
      color: "text-amber-400",
      bgColor: "bg-amber-500/5",
      borderColor: "border-amber-500/30",
      events: [
        { emoji: "❌", text: "LLM guesses (no knowledge base access)", type: "error" },
        { emoji: "💭", text: "Chatbot: 'Most companies offer 30 days. We probably do too.'", type: "error" },
        { emoji: "😊", text: "Customer: 'Great! I'll return my item then.'", type: "warning" }
      ]
    },
    {
      time: "Monday 2:15 PM",
      title: "The Reality",
      icon: AlertTriangle,
      color: "text-red-400",
      bgColor: "bg-red-500/5",
      borderColor: "border-red-500/30",
      events: [
        { emoji: "📞", text: "Customer calls support: FURIOUS", type: "critical" },
        { emoji: "❌", text: "Actual policy: 90 days (not 30!)", type: "critical" },
        { emoji: "😱", text: "Customer: 'Your chatbot lied to me!'", type: "critical" }
      ]
    },
    {
      time: "Monday 2:30 PM",
      title: "The Aftermath",
      icon: XCircle,
      color: "text-red-600",
      bgColor: "bg-red-600/5",
      borderColor: "border-red-600/50",
      events: [
        { emoji: "📧", text: "Support ticket #4,892 created", type: "critical" },
        { emoji: "⚖️", text: "Legal team notified", type: "critical" },
        { emoji: "💔", text: "Trust destroyed. Customer lost.", type: "critical" }
      ]
    },
    {
      time: "Monday 3:00 PM",
      title: "The Discovery",
      icon: Sparkles,
      color: "text-green-400",
      bgColor: "bg-green-500/5",
      borderColor: "border-green-500/30",
      events: [
        { emoji: "💡", text: "Developer discovers RAG + ONNX", type: "positive" },
        { emoji: "🔍", text: "RAG: Retrieves facts from knowledge base", type: "positive" },
        { emoji: "💰", text: "ONNX: Free local embeddings ($0)", type: "positive" },
        { emoji: "✅", text: "No more guessing. Facts from YOUR docs.", type: "positive" }
      ]
    },
    {
      time: "Monday 3:30 PM",
      title: "The Solution",
      icon: CheckCircle2,
      color: "text-green-600",
      bgColor: "bg-green-600/5",
      borderColor: "border-green-600/50",
      events: [
        { emoji: "⚡", text: "Implements RAG with knowledge base", type: "positive" },
        { emoji: "📚", text: "Chatbot reads from help articles", type: "positive" },
        { emoji: "🎉", text: "70% of questions auto-answered correctly", type: "positive" },
        { emoji: "💰", text: "$35K/year saved on support costs", type: "positive" }
      ]
    }
  ];

  useEffect(() => {
    if (isPlaying && activeStep < steps.length - 1) {
      const timer = setTimeout(() => {
        setActiveStep(prev => prev + 1);
      }, 3000);
      return () => clearTimeout(timer);
    } else if (activeStep >= steps.length - 1) {
      setIsPlaying(false);
    }
  }, [isPlaying, activeStep, steps.length]);

  const getEventColor = (type: string) => {
    switch(type) {
      case "critical": return "text-red-400 font-semibold";
      case "error": return "text-red-400";
      case "warning": return "text-amber-400";
      case "positive": return "text-green-400";
      default: return "text-muted-foreground";
    }
  };

  return (
    <div className="my-12 p-8 rounded-2xl bg-gradient-to-br from-red-500/5 to-green-500/5 border border-border/50">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            The Support Crisis: When AI Guesses Wrong
          </h3>
          <p className="text-sm text-muted-foreground mt-1">Watch how one wrong answer about policy led to discovering RAG</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            disabled={activeStep >= steps.length - 1}
            className="p-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </button>
          <button
            onClick={() => { setActiveStep(0); setIsPlaying(false); }}
            className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {steps.map((step, i) => (
          <button
            key={i}
            onClick={() => { setActiveStep(i); setIsPlaying(false); }}
            className={`flex-shrink-0 px-3 py-2 rounded-lg font-semibold transition-all ${
              activeStep === i
                ? `${step.bgColor} ${step.borderColor} border-2 shadow-lg`
                : "bg-muted/30 border border-border/50 text-muted-foreground hover:border-border"
            }`}
          >
            <div className="flex items-center gap-2">
              {React.createElement(step.icon, {
                className: `h-4 w-4 ${activeStep === i ? step.color : 'text-muted-foreground'}`
              })}
              <span className={`text-xs ${activeStep === i ? 'text-foreground' : ''}`}>
                {step.time.split(' ')[1]}
              </span>
            </div>
          </button>
        ))}
      </div>
      
      <AnimatePresence mode="wait">
        <motion.div
          key={activeStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`p-6 rounded-xl border ${steps[activeStep].borderColor} ${steps[activeStep].bgColor}`}
        >
          <div className="flex items-center gap-3 mb-4">
            {React.createElement(steps[activeStep].icon, {
              className: `h-6 w-6 ${steps[activeStep].color}`
            })}
            <div>
              <h4 className="text-lg font-bold text-foreground">{steps[activeStep].title}</h4>
              <p className="text-xs text-muted-foreground">{steps[activeStep].time}</p>
            </div>
          </div>
          
          <div className="space-y-2">
            {steps[activeStep].events.map((event, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-2 text-sm"
              >
                <span className="text-xl">{event.emoji}</span>
                <span className={getEventColor(event.type)}>{event.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
      
      {activeStep >= steps.length - 1 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-6 p-6 rounded-xl bg-green-500/10 border border-green-500/30 text-center"
        >
          <CheckCircle2 className="h-8 w-8 text-green-400 mx-auto mb-3" />
          <p className="text-lg font-bold text-green-400 mb-2">RAG + ONNX: The Solution</p>
          <p className="text-sm text-muted-foreground">
            No more guessing. Facts from YOUR knowledge base. Free local embeddings.
          </p>
        </motion.div>
      )}
    </div>
  );
};

const RAGFlowSimulator = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const steps = [
    {
      step: 1,
      name: "User Question",
      icon: MessageSquare,
      color: "text-blue-400",
      input: "What's your return policy?",
      output: "Query received"
    },
    {
      step: 2,
      name: "PII Detection",
      icon: Shield,
      color: "text-red-400",
      input: "Query scanned",
      output: "No PII detected ✓"
    },
    {
      step: 3,
      name: "Generate Embedding",
      icon: Cpu,
      color: "text-purple-400",
      input: "Query text",
      output: "384-dim vector (ONNX, 15ms, $0)"
    },
    {
      step: 4,
      name: "Search Knowledge Base",
      icon: Search,
      color: "text-amber-400",
      input: "Query vector",
      output: "Top 3 relevant help articles (similarity > 0.8)"
    },
    {
      step: 5,
      name: "Build Context",
      icon: FileText,
      color: "text-green-400",
      input: "Retrieved articles",
      output: "Context: 'Our return policy is 90 days...'"
    },
    {
      step: 6,
      name: "LLM Generation",
      icon: Brain,
      color: "text-primary",
      input: "Context + Question",
      output: "Answer: 'Our return policy is 90 days from purchase.' ✓"
    }
  ];

  useEffect(() => {
    if (isPlaying && activeStep < steps.length - 1) {
      const timer = setTimeout(() => {
        setActiveStep(prev => prev + 1);
      }, 2000);
      return () => clearTimeout(timer);
    } else if (activeStep >= steps.length - 1) {
      setIsPlaying(false);
    }
  }, [isPlaying, activeStep, steps.length]);

  return (
    <div className="my-16 p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 border border-border/50">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-2xl font-bold text-foreground">The RAG Flow: Knowledge Base to Answer</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            disabled={activeStep >= steps.length - 1}
            className="p-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </button>
          <button
            onClick={() => { setActiveStep(0); setIsPlaying(false); }}
            className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      <div className="space-y-4">
        {steps.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ 
              opacity: activeStep >= i ? 1 : 0.3,
              x: 0
            }}
            className={`p-4 rounded-lg border-2 transition-all ${
              activeStep === i
                ? "border-primary bg-primary/10 shadow-lg scale-105"
                : activeStep > i
                ? "border-green-500/30 bg-green-500/5"
                : "border-border/30 bg-muted/30"
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                {React.createElement(step.icon, {
                  className: `h-6 w-6 ${step.color}`
                })}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono text-muted-foreground">Step {step.step}</span>
                  <span className="font-bold text-foreground">{step.name}</span>
                  {activeStep > i && <CheckCircle2 className="h-4 w-4 text-green-400" />}
                  {activeStep === i && <Activity className="h-4 w-4 text-primary animate-pulse" />}
                </div>
                <div className="grid md:grid-cols-2 gap-3 text-sm">
                  <div className="p-2 rounded bg-muted/30">
                    <span className="text-muted-foreground">Input: </span>
                    <span className="text-foreground font-mono text-xs">{step.input}</span>
                  </div>
                  <div className="p-2 rounded bg-primary/10">
                    <span className="text-primary">Output: </span>
                    <span className="text-foreground font-mono text-xs">{step.output}</span>
                  </div>
                </div>
              </div>
              {i < steps.length - 1 && (
                <ArrowRight className="h-5 w-5 text-muted-foreground hidden md:block" />
              )}
            </div>
          </motion.div>
        ))}
      </div>
      
      {activeStep >= steps.length - 1 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-6 p-4 rounded-lg bg-green-500/10 border border-green-500/30 text-center"
        >
          <p className="text-sm font-bold text-green-400">Result: Accurate Answer from YOUR Knowledge Base</p>
          <p className="text-xs text-muted-foreground mt-1">No hallucinations. No guessing. Just facts from your help articles.</p>
        </motion.div>
      )}
    </div>
  );
};

const RealisticUseCases = () => {
  const useCases = [
    {
      title: "Customer Support",
      icon: HelpCircle,
      color: "bg-blue-500",
      question: "What's your return policy?",
      withoutRAG: "LLM guesses: 'Probably 30 days'",
      withRAG: "From knowledge base: '90 days from purchase'",
      impact: "70% questions auto-answered, $35K/year saved"
    },
    {
      title: "Product Information",
      icon: Search,
      color: "bg-green-500",
      question: "Does this laptop have USB-C?",
      withoutRAG: "LLM guesses based on training data",
      withRAG: "From product documentation: 'Yes, 2x USB-C ports'",
      impact: "Accurate product specs, fewer returns"
    },
    {
      title: "Technical Documentation",
      icon: BookOpen,
      color: "bg-purple-500",
      question: "How do I reset my password?",
      withoutRAG: "LLM makes up steps",
      withRAG: "From help articles: Step-by-step guide",
      impact: "92% satisfaction, 60% faster resolution"
    },
    {
      title: "FAQ Answers",
      icon: MessageSquare,
      color: "bg-amber-500",
      question: "What payment methods do you accept?",
      withoutRAG: "LLM guesses: 'Credit cards probably'",
      withRAG: "From FAQ: 'Credit cards, PayPal, Apple Pay'",
      impact: "100% accurate, no support tickets"
    }
  ];

  return (
    <div className="my-16">
      <h3 className="text-2xl font-bold text-foreground mb-8 text-center">
        Realistic RAG Use Cases
      </h3>
      <p className="text-muted-foreground text-center mb-8">
        RAG works best for knowledge base queries, not transactional data
      </p>
      <div className="grid md:grid-cols-2 gap-6">
        {useCases.map((useCase, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            viewport={{ once: true }}
            className="p-6 rounded-xl bg-card border border-border/50"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2 rounded-lg ${useCase.color}`}>
                <useCase.icon className="h-5 w-5 text-white" />
              </div>
              <h4 className="font-bold text-foreground">{useCase.title}</h4>
            </div>
            <div className="space-y-3 text-sm">
              <div className="p-3 rounded bg-muted/30">
                <p className="text-muted-foreground mb-1">Question:</p>
                <p className="text-foreground font-mono text-xs">{useCase.question}</p>
              </div>
              <div className="p-3 rounded bg-red-500/10 border border-red-500/20">
                <p className="text-red-400 font-medium mb-1">Without RAG:</p>
                <p className="text-muted-foreground text-xs">{useCase.withoutRAG}</p>
              </div>
              <div className="p-3 rounded bg-green-500/10 border border-green-500/20">
                <p className="text-green-400 font-medium mb-1">With RAG:</p>
                <p className="text-muted-foreground text-xs">{useCase.withRAG}</p>
              </div>
              <div className="p-3 rounded bg-primary/10 border border-primary/20">
                <p className="text-primary font-semibold text-xs">{useCase.impact}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const WhatNotToUseRAGFor = () => {
  return (
    <div className="my-16 p-8 rounded-2xl bg-red-500/5 border-2 border-red-500/30">
      <div className="flex items-center gap-3 mb-6">
        <AlertTriangle className="h-8 w-8 text-red-400" />
        <h3 className="text-2xl font-bold text-foreground">What NOT to Use RAG For</h3>
      </div>
      
      <div className="space-y-4">
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
          <div className="flex items-start gap-3">
            <XCircle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-400 mb-1">Account Balance</p>
              <p className="text-sm text-muted-foreground">
                ❌ Use direct database query: <code className="bg-muted px-1 rounded">SELECT balance FROM accounts WHERE id = ?</code>
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Account balance is transactional data, not knowledge base content
              </p>
            </div>
          </div>
        </div>
        
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
          <div className="flex items-start gap-3">
            <XCircle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-400 mb-1">Order Status</p>
              <p className="text-sm text-muted-foreground">
                ❌ Use direct database query: <code className="bg-muted px-1 rounded">SELECT status FROM orders WHERE id = ?</code>
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Order status is real-time transactional data
              </p>
            </div>
          </div>
        </div>
        
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
          <div className="flex items-start gap-3">
            <XCircle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-400 mb-1">User Profile Data</p>
              <p className="text-sm text-muted-foreground">
                ❌ Use direct database query: <code className="bg-muted px-1 rounded">SELECT * FROM users WHERE id = ?</code>
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                User data is personal and transactional, not knowledge base content
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-6 p-4 rounded-lg bg-green-500/10 border border-green-500/30">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-green-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-green-400 mb-2">Use RAG For:</p>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>Knowledge base queries (policies, FAQs, documentation)</li>
                <li>Product information from documentation</li>
                <li>Help articles and support content</li>
                <li>Technical documentation searches</li>
                <li>General information that doesn't change frequently</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const BeforeAfterComparison = () => {
  return (
    <div className="my-16 grid lg:grid-cols-2 gap-8">
      {/* Without RAG */}
      <div className="p-8 rounded-2xl bg-red-500/5 border-2 border-red-500/30">
        <div className="flex items-center gap-3 mb-6">
          <XCircle className="h-8 w-8 text-red-400" />
          <h4 className="text-xl font-bold text-foreground">Without RAG (The Old Way)</h4>
        </div>
        
        <div className="space-y-4 text-sm">
          <div className="p-3 rounded bg-muted/30">
            <p className="text-muted-foreground mb-1">User:</p>
            <p className="text-foreground">"What's the return policy?"</p>
          </div>
          
          <div className="p-3 rounded bg-red-500/10 border border-red-500/30">
            <p className="text-muted-foreground mb-1">LLM (guessing):</p>
            <p className="text-foreground">"Most companies offer 30 days. We probably do too."</p>
          </div>
          
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-400">HALLUCINATION</p>
              <p className="text-muted-foreground">Actual policy: 90 days</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <DollarSign className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-foreground">Cost</p>
              <p className="text-muted-foreground">$1,200-1,800/year (cloud APIs)</p>
            </div>
          </div>
        </div>
        
        <div className="mt-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20">
          <p className="text-sm text-red-400 font-bold">Result: Wrong Answers, High Costs</p>
          <p className="text-xs text-muted-foreground mt-1">AI guesses. Customers get wrong info. Trust destroyed.</p>
        </div>
      </div>
      
      {/* With RAG */}
      <div className="p-8 rounded-2xl bg-green-500/5 border-2 border-green-500/30">
        <div className="flex items-center gap-3 mb-6">
          <CheckCircle2 className="h-8 w-8 text-green-400" />
          <h4 className="text-xl font-bold text-foreground">With RAG + ONNX (The New Way)</h4>
        </div>
        
        <div className="space-y-4 text-sm">
          <div className="p-3 rounded bg-muted/30">
            <p className="text-muted-foreground mb-1">User:</p>
            <p className="text-foreground">"What's the return policy?"</p>
          </div>
          
          <div className="p-3 rounded bg-green-500/10 border border-green-500/30">
            <p className="text-muted-foreground mb-1">LLM (from YOUR knowledge base):</p>
            <p className="text-foreground">"Based on our return policy document, you have 90 days from the date of purchase to return any product in its original condition."</p>
          </div>
          
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-green-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-green-400">ACCURATE</p>
              <p className="text-muted-foreground">From YOUR knowledge base, not imagination</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <DollarSign className="h-5 w-5 text-green-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-foreground">Cost</p>
              <p className="text-muted-foreground">$0/year (ONNX local embeddings)</p>
            </div>
          </div>
        </div>
        
        <div className="mt-6 p-4 rounded-lg bg-green-500/10 border border-green-500/20">
          <p className="text-sm text-green-400 font-bold">Result: Accurate Answers, Zero Cost</p>
          <p className="text-xs text-muted-foreground mt-1">AI reads YOUR knowledge base. Customers get correct info. Trust restored.</p>
        </div>
      </div>
    </div>
  );
};

const WhatYouImplement = () => {
  return (
    <div className="my-16">
      <h3 className="text-2xl font-bold text-foreground mb-8 text-center">
        What You Actually Implement
      </h3>
      <p className="text-muted-foreground text-center mb-8">
        One config line. Free embeddings. Zero hallucinations. Facts from YOUR knowledge base.
      </p>
      
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="p-6 rounded-xl bg-card border border-border/50"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <FileText className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <h4 className="font-bold text-foreground">Step 1: Index Your Knowledge Base</h4>
              <p className="text-xs text-muted-foreground">Add @AICapable to help articles</p>
            </div>
          </div>
          
          <CodeBlock code={`@Entity
@AICapable(
    entityType = "help-article",
    autoEmbedding = true,
    indexable = true
)
public class HelpArticle {
    @Id private UUID id;
    private String title;
    private String content;  // Your knowledge base content
    private String category; // "policies", "faq", "troubleshooting"
}

// Save article
helpArticleRepo.save(article);
// ↑ Auto-indexed with ONNX embeddings ($0)`} />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="p-6 rounded-xl bg-card border border-border/50"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
              <Search className="h-5 w-5 text-green-400" />
            </div>
            <div>
              <h4 className="font-bold text-foreground">Step 2: Use RAG for Support Queries</h4>
              <p className="text-xs text-muted-foreground">One method call. Facts from YOUR knowledge base.</p>
            </div>
          </div>
          
          <CodeBlock code={`@Autowired
private RAGService ragService;

@PostMapping("/api/support/chat")
public String answerSupportQuestion(@RequestBody String question) {
    // RAG: Retrieves facts from YOUR knowledge base
    RAGResponse response = ragService.performRag(
        RAGRequest.builder()
            .query(question)
            .entityType("help-article")  // YOUR knowledge base
            .limit(3)                     // Top 3 relevant articles
            .threshold(0.8)               // High confidence only
            .build()
    );
    
    // LLM answers from YOUR knowledge base, not imagination
    return response.getResponse();
}

// What happens automatically:
// 1. Generate embedding (ONNX, $0, 15ms)
// 2. Search YOUR knowledge base vectors
// 3. Find relevant articles (similarity > 0.8)
// 4. Build context from YOUR articles
// 5. LLM answers from facts, not guesses
// 6. Return answer + sources`} />
        </motion.div>
      </div>
    </div>
  );
};

const RagStoryV3 = () => {
  useEffect(() => {
    document.title = PAGE_TITLE;
  }, []);

  return (
    <DocsLayout>
      <div className="max-w-4xl mx-auto px-6 py-8">
        <motion.article 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Hero */}
          <section className="relative overflow-hidden border-b border-border/50 pb-12 mb-12">
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-green-500/5" />
            <div className="relative">
              <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                    <MessageSquare className="h-4 w-4" />
                    RAG + ONNX V3
                  </span>
                  <Link 
                    to="/docs/rag_story"
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    ← View V1
                  </Link>
                  <Link 
                    to="/docs/rag_story_v2"
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    ← View V2
                  </Link>
                </div>
                <div className="flex items-center gap-3">
                  <StoryLoveButton storySlug="rag-story-v3" />
                  <PageViewCounter />
                </div>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
                The Support Ticket That{" "}
                <span className="text-gradient">Changed Everything</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mb-8">
                A realistic RAG story: How a customer support chatbot went from guessing to answering from your knowledge base—zero hallucinations, real answers from help articles.
              </p>
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 border border-border/50">
                  <Shield className="h-4 w-4 text-green-400" />
                  Zero Hallucinations
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 border border-border/50">
                  <DollarSign className="h-4 w-4 text-green-400" />
                  $18K Saved/Year
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 border border-border/50">
                  <Zap className="h-4 w-4 text-blue-400" />
                  10-50ms Latency
                </div>
              </div>
            </div>
          </section>

          {/* The Support Crisis */}
          <TheSupportCrisis />

          {/* RAG Flow Simulator */}
          <RAGFlowSimulator />

          {/* Realistic Use Cases */}
          <RealisticUseCases />

          {/* What NOT to Use RAG For */}
          <WhatNotToUseRAGFor />

          {/* Before/After Comparison */}
          <BeforeAfterComparison />

          {/* What You Implement */}
          <WhatYouImplement />

          {/* The Revelation */}
          <section className="mb-16 p-8 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/5 border border-primary/20 text-center">
            <MessageSquare className="h-16 w-16 text-primary mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-foreground mb-4">The Revelation</h3>
            <div className="max-w-2xl mx-auto space-y-4 text-muted-foreground">
              <p className="text-lg">
                "I thought RAG was for everything. That I could use it for account balances, order status, anything."
              </p>
              <p className="text-lg">
                "I was wrong. <span className="text-primary font-semibold">RAG is for knowledge base queries—policies, FAQs, documentation.</span>"
              </p>
              <p className="text-lg">
                "Account balance? Query the database. Order status? Query the database. Return policy? Use RAG from knowledge base."
              </p>
              <p className="text-lg">
                "The support crisis? Never happened again. Because the chatbot reads the knowledge base, not its imagination."
              </p>
              <p className="text-lg">
                "<span className="text-primary font-semibold">RAG for knowledge. Database for data. That's the difference.</span>"
              </p>
              <p className="text-sm text-foreground italic font-semibold pt-4 border-t border-border/30">
                — Developer, after implementing RAG correctly for knowledge base queries
              </p>
            </div>
          </section>

          {/* Bottom Line */}
          <section className="mb-16 p-8 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/5 border-2 border-primary/30">
            <h3 className="text-2xl font-bold text-foreground mb-6 text-center">The Bottom Line</h3>
            <div className="text-center space-y-6">
              <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
                <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30">
                  <p className="text-sm text-muted-foreground mb-1">Don't Use RAG For</p>
                  <p className="text-sm font-bold text-red-400">Transactional Data</p>
                  <p className="text-xs text-muted-foreground mt-1">Account balance, order status, user data</p>
                </div>
                <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/30">
                  <p className="text-sm text-muted-foreground mb-1">Use RAG For</p>
                  <p className="text-sm font-bold text-green-400">Knowledge Base</p>
                  <p className="text-xs text-muted-foreground mt-1">Policies, FAQs, documentation, help articles</p>
                </div>
              </div>
              <div className="flex flex-wrap justify-center gap-2 mt-6">
                {["Knowledge Base", "Help Articles", "FAQs", "Policies", "Documentation"].map((use, i) => (
                  <span key={i} className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm">
                    ✓ {use}
                  </span>
                ))}
              </div>
              <p className="text-foreground font-semibold mt-6">
                RAG for knowledge. Database for data. That's how you build trust.
              </p>
            </div>
          </section>

          {/* Footer */}
          <footer className="border-t border-border/50 pt-12 mt-12 flex flex-col items-center gap-6">
            <div className="flex items-center gap-4">
              <StoryLoveButton storySlug="rag-story-v3" />
              <PageViewCounter />
            </div>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link 
                to="/docs/guides/rag" 
                className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
              >
                <FileText className="h-4 w-4" />
                Read Technical Guide
              </Link>
              <Link 
                to="/docs/rag_story" 
                className="inline-flex items-center gap-2 px-6 py-2 rounded-full border border-border bg-card text-foreground font-medium hover:bg-muted transition-colors"
              >
                View V1 (Technical)
              </Link>
              <Link 
                to="/docs/rag_story_v2" 
                className="inline-flex items-center gap-2 px-6 py-2 rounded-full border border-border bg-card text-foreground font-medium hover:bg-muted transition-colors"
              >
                View V2 (Previous)
              </Link>
            </div>
            <p className="text-xs text-muted-foreground text-center max-w-md">
              Part of the AI Fabric Framework series — where RAG is for knowledge, not transactional data
            </p>
          </footer>
        </motion.article>
      </div>
    </DocsLayout>
  );
};

export default RagStoryV3;

