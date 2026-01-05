import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Highlight, themes } from "prism-react-renderer";
import DocsLayout from "@/components/docs/DocsLayout";
import PageViewCounter from "@/components/PageViewCounter";
import StoryLoveButton from "@/components/StoryLoveButton";
import StoryNavigation from "@/components/StoryNavigation";
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
  FileCode,
  Play,
  Pause,
  RotateCcw,
  ArrowRight,
  Timer,
  TrendingUp,
  TrendingDown,
  Eye,
  Database,
  FileText,
  Sparkles,
  Heart,
  Activity
} from "lucide-react";

const PAGE_TITLE = "RAG V2: The $47.23 That Almost Cost Everything - AI Fabric Framework";
const PAGE_DESCRIPTION = "A developer's journey from hallucination disaster to RAG-powered truth—how one wrong answer led to discovering free local embeddings.";

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

const TheDisaster = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const steps = [
    {
      time: "Monday 2:30 PM",
      title: "The Question",
      icon: MessageSquare,
      color: "text-blue-400",
      bgColor: "bg-blue-500/5",
      borderColor: "border-blue-500/30",
      events: [
        { emoji: "💬", text: "Customer: 'What's my account balance?'", type: "normal" },
        { emoji: "🤖", text: "Chatbot: 'Let me check that for you...'", type: "normal" }
      ]
    },
    {
      time: "Monday 2:31 PM",
      title: "The Hallucination",
      icon: Brain,
      color: "text-amber-400",
      bgColor: "bg-amber-500/5",
      borderColor: "border-amber-500/30",
      events: [
        { emoji: "❌", text: "LLM guesses (no database access)", type: "error" },
        { emoji: "💭", text: "LLM: 'Based on typical accounts, your balance is $10,000'", type: "error" },
        { emoji: "😊", text: "Customer: 'Great! I'll transfer $9,000 to pay rent'", type: "warning" }
      ]
    },
    {
      time: "Monday 2:35 PM",
      title: "The Transfer",
      icon: DollarSign,
      color: "text-orange-400",
      bgColor: "bg-orange-500/5",
      borderColor: "border-orange-500/30",
      events: [
        { emoji: "💸", text: "Customer initiates $9,000 transfer", type: "warning" },
        { emoji: "⏳", text: "Bank processing...", type: "warning" }
      ]
    },
    {
      time: "Monday 2:36 PM",
      title: "The Reality",
      icon: AlertTriangle,
      color: "text-red-400",
      bgColor: "bg-red-500/5",
      borderColor: "border-red-500/30",
      events: [
        { emoji: "❌", text: "Transfer rejected: Insufficient funds", type: "critical" },
        { emoji: "😱", text: "Actual balance: $47.23", type: "critical" },
        { emoji: "📞", text: "Customer calls support: FURIOUS", type: "critical" }
      ]
    },
    {
      time: "Monday 3:00 PM",
      title: "The Aftermath",
      icon: XCircle,
      color: "text-red-600",
      bgColor: "bg-red-600/5",
      borderColor: "border-red-600/50",
      events: [
        { emoji: "⚖️", text: "Legal team notified", type: "critical" },
        { emoji: "📧", text: "Support ticket #3,492 created", type: "critical" },
        { emoji: "😰", text: "Customer: 'I'm being evicted because of your AI'", type: "critical" },
        { emoji: "💔", text: "Trust destroyed. Reputation damaged.", type: "critical" }
      ]
    },
    {
      time: "Monday 4:00 PM",
      title: "The Discovery",
      icon: Sparkles,
      color: "text-green-400",
      bgColor: "bg-green-500/5",
      borderColor: "border-green-500/30",
      events: [
        { emoji: "💡", text: "Developer discovers RAG + ONNX", type: "positive" },
        { emoji: "🔍", text: "RAG: Retrieves facts from database", type: "positive" },
        { emoji: "💰", text: "ONNX: Free local embeddings ($0)", type: "positive" },
        { emoji: "✅", text: "No more hallucinations. No more guessing.", type: "positive" }
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
            <AlertTriangle className="h-5 w-5 text-red-400" />
            The $47.23 Disaster: When AI Guesses Wrong
          </h3>
          <p className="text-sm text-muted-foreground mt-1">Watch how one hallucination led to a complete transformation</p>
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
      
      {/* Timeline Navigation */}
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
      
      {/* Current Step */}
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
            No more guessing. No more hallucinations. Facts from YOUR database. Free local embeddings.
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
      input: "What's my account balance?",
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
      name: "Vector Search",
      icon: Search,
      color: "text-amber-400",
      input: "Query vector",
      output: "Top 3 relevant docs (similarity > 0.8)"
    },
    {
      step: 5,
      name: "Build Context",
      icon: FileText,
      color: "text-green-400",
      input: "Retrieved docs",
      output: "Context: 'Your balance is $47.23...'"
    },
    {
      step: 6,
      name: "LLM Generation",
      icon: Brain,
      color: "text-primary",
      input: "Context + Question",
      output: "Answer: 'Your account balance is $47.23' ✓"
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
        <h3 className="text-2xl font-bold text-foreground">The RAG Flow: How It Actually Works</h3>
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
      
      {/* Flow Steps */}
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
          <p className="text-sm font-bold text-green-400">Result: Accurate Answer from YOUR Database</p>
          <p className="text-xs text-muted-foreground mt-1">No hallucinations. No guessing. Just facts.</p>
        </motion.div>
      )}
    </div>
  );
};

const CloudVsOnnx = () => {
  const [selectedOption, setSelectedOption] = useState(0);
  
  const options = [
    {
      name: "Cloud APIs",
      icon: Cloud,
      color: "text-red-400",
      borderColor: "border-red-500/30",
      bgColor: "bg-red-500/5",
      cost: "$1,200-1,800/year",
      features: [
        { label: "Cost per 1M embeddings", value: "$100-150/month", good: false },
        { label: "Data Privacy", value: "Leaves servers", good: false },
        { label: "HIPAA/GDPR", value: "Questionable", good: false },
        { label: "Internet Required", value: "Yes", good: false },
        { label: "Latency", value: "100-500ms", good: false },
        { label: "Usage Tracking", value: "By third party", good: false }
      ]
    },
    {
      name: "ONNX Local",
      icon: HardDrive,
      color: "text-green-400",
      borderColor: "border-green-500/30",
      bgColor: "bg-green-500/5",
      cost: "$0 forever",
      features: [
        { label: "Cost per 1M embeddings", value: "$0/month", good: true },
        { label: "Data Privacy", value: "On your servers", good: true },
        { label: "HIPAA/GDPR", value: "100% compliant", good: true },
        { label: "Internet Required", value: "No (offline)", good: true },
        { label: "Latency", value: "10-50ms", good: true },
        { label: "Usage Tracking", value: "None", good: true }
      ]
    }
  ];

  return (
    <div className="my-16">
      <h3 className="text-2xl font-bold text-foreground mb-8 text-center">
        The $18,000 Question: Cloud vs Local?
      </h3>
      <p className="text-sm text-muted-foreground text-center mb-8">
        Same embeddings. Different cost. Different privacy. Different speed.
      </p>
      
      <div className="grid grid-cols-2 gap-2 mb-6">
        {options.map((option, i) => (
          <button
            key={i}
            onClick={() => setSelectedOption(i)}
            className={`p-4 rounded-lg border-2 transition-all ${
              selectedOption === i
                ? `${option.borderColor} ${option.bgColor} shadow-lg scale-105`
                : "border-border/30 bg-muted/30 hover:border-border"
            }`}
          >
            {React.createElement(option.icon, {
              className: `h-6 w-6 mx-auto mb-2 ${selectedOption === i ? option.color : 'text-muted-foreground'}`
            })}
            <p className={`text-sm font-semibold text-center ${selectedOption === i ? 'text-foreground' : 'text-muted-foreground'}`}>
              {option.name}
            </p>
            <p className={`text-xs text-center mt-1 ${selectedOption === i ? option.color : 'text-muted-foreground'}`}>
              {option.cost}
            </p>
          </button>
        ))}
      </div>
      
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedOption}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`p-6 rounded-xl border ${options[selectedOption].borderColor} ${options[selectedOption].bgColor}`}
        >
          <div className="flex items-center gap-3 mb-4">
            {React.createElement(options[selectedOption].icon, {
              className: `h-8 w-8 ${options[selectedOption].color}`
            })}
            <div>
              <h4 className="text-lg font-bold text-foreground">{options[selectedOption].name}</h4>
              <p className={`text-sm ${options[selectedOption].color} font-semibold`}>
                {options[selectedOption].cost}
              </p>
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-3">
            {options[selectedOption].features.map((feature, i) => (
              <div
                key={i}
                className={`p-3 rounded-lg border ${
                  feature.good
                    ? "bg-green-500/10 border-green-500/20"
                    : "bg-red-500/10 border-red-500/20"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{feature.label}</span>
                  <span className={`text-xs font-semibold ${feature.good ? 'text-green-400' : 'text-red-400'}`}>
                    {feature.good ? '✓' : '✗'} {feature.value}
                  </span>
                </div>
              </div>
            ))}
          </div>
          
          {selectedOption === 1 && (
            <div className="mt-4 p-4 rounded-lg bg-green-500/10 border border-green-500/30 text-center">
              <p className="text-sm font-bold text-green-400">Annual Savings: $1,200-18,000</p>
              <p className="text-xs text-muted-foreground mt-1">10M embeddings/month = $12K-18K/year saved</p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
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
            <p className="text-foreground">"Probably 30 days. Most companies do that."</p>
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
            <p className="text-muted-foreground mb-1">LLM (from YOUR docs):</p>
            <p className="text-foreground">"Based on our policy document, you have 90 days to return any product."</p>
          </div>
          
          <div className="flex items-start gap-3">
            <CheckCircle2 className="h-5 w-5 text-green-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-green-400">ACCURATE</p>
              <p className="text-muted-foreground">From YOUR database, not imagination</p>
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
          <p className="text-xs text-muted-foreground mt-1">AI reads YOUR docs. Customers get correct info. Trust restored.</p>
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
        One config line. Free embeddings. Zero hallucinations. Facts from YOUR database.
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
              <FileCode className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <h4 className="font-bold text-foreground">Enable ONNX (Free Embeddings)</h4>
              <p className="text-xs text-muted-foreground">One line in application.yml</p>
            </div>
          </div>
          
          <CodeBlock code={`# application.yml
ai:
  providers:
    embedding-provider: onnx  # Free local embeddings!

# That's it! Framework handles:
# - Downloads ONNX model (86MB, bundled)
# - Runs on your CPU/GPU
# - 10-50ms latency
# - $0 cost forever`} language="yaml" />
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
              <h4 className="font-bold text-foreground">Use RAG (Stop Hallucinations)</h4>
              <p className="text-xs text-muted-foreground">One method call. Facts from YOUR database.</p>
            </div>
          </div>
          
          <CodeBlock code={`@Autowired
private RAGService ragService;

public String answerQuestion(String question) {
    // RAG: Retrieves facts from YOUR database
    RAGResponse response = ragService.performRag(
        RAGRequest.builder()
            .query(question)
            .entityType("help-article")  // YOUR docs
            .limit(3)                     // Top 3 relevant
            .threshold(0.8)               // High confidence
            .build()
    );
    
    // LLM answers from YOUR docs, not imagination
    return response.getResponse();
}

// What happens automatically:
// 1. Generate embedding (ONNX, $0, 15ms)
// 2. Search YOUR database vectors
// 3. Find relevant docs (similarity > 0.8)
// 4. Build context from YOUR docs
// 5. LLM answers from facts, not guesses
// 6. Return answer + sources`} />
        </motion.div>
      </div>
    </div>
  );
};

const RagStoryV2 = () => {
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
            <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-green-500/5" />
            <div className="relative">
              <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-2 rounded-full border border-red-500/30 bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400">
                    <Brain className="h-4 w-4" />
                    RAG + ONNX V2
                  </span>
                  <Link 
                    to="/docs/rag_story"
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    ← View V1
                  </Link>
                  <Link 
                    to="/docs/rag_story_v3"
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    View V3 (Realistic) →
                  </Link>
                </div>
                <div className="flex items-center gap-3">
                  <StoryLoveButton storySlug="rag-story-v2" />
                  <PageViewCounter />
                </div>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
                The $47.23 That{" "}
                <span className="text-gradient">Almost Cost Everything</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mb-8">
                This is a story about hallucinations, trust, and one wrong answer. How a chatbot's guess led to discovering RAG + ONNX—the solution that stops hallucinations and costs $0.
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

          {/* The Disaster */}
          <TheDisaster />

          {/* RAG Flow Simulator */}
          <RAGFlowSimulator />

          {/* Cloud vs ONNX */}
          <CloudVsOnnx />

          {/* Before/After Comparison */}
          <BeforeAfterComparison />

          {/* What You Implement */}
          <WhatYouImplement />

          {/* The Revelation */}
          <section className="mb-16 p-8 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/5 border border-primary/20 text-center">
            <Brain className="h-16 w-16 text-primary mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-foreground mb-4">The Revelation</h3>
            <div className="max-w-2xl mx-auto space-y-4 text-muted-foreground">
              <p className="text-lg">
                "I thought AI hallucinations were inevitable. That wrong answers were the cost of using LLMs."
              </p>
              <p className="text-lg">
                "I was wrong. <span className="text-primary font-semibold">RAG stops hallucinations by giving AI facts from YOUR database.</span>"
              </p>
              <p className="text-lg">
                "And ONNX? <span className="text-primary font-semibold">Free local embeddings. $0 forever. 10x faster than cloud APIs.</span>"
              </p>
              <p className="text-lg">
                "The $47.23 disaster? Never happened again. Because the AI reads the database, not its imagination."
              </p>
              <p className="text-lg">
                "<span className="text-primary font-semibold">One config line. Zero hallucinations. $18K saved per year.</span>"
              </p>
              <p className="text-sm text-foreground italic font-semibold pt-4 border-t border-border/30">
                — Developer, after implementing RAG + ONNX, after the $47.23 disaster
              </p>
            </div>
          </section>

          {/* Bottom Line */}
          <section className="mb-16 p-8 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/5 border-2 border-primary/30">
            <h3 className="text-2xl font-bold text-foreground mb-6 text-center">The Numbers Don't Lie</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { value: "$18K+", label: "Saved/Year", icon: DollarSign },
                { value: "0", label: "Hallucinations", icon: Shield },
                { value: "10-50ms", label: "Latency", icon: Timer },
                { value: "100%", label: "Private", icon: Eye }
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <stat.icon className="h-8 w-8 text-primary mx-auto mb-2" />
                  <div className="text-3xl font-bold text-primary mb-1">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </motion.div>
              ))}
            </div>
            <p className="mt-8 text-center text-foreground font-medium italic">
              "RAG solves hallucinations. ONNX makes it free. Together, they change everything."
            </p>
          </section>

          {/* Story Navigation */}
          <StoryNavigation className="mt-12" />

          {/* Footer */}
          <footer className="border-t border-border/50 pt-12 mt-12 flex flex-col items-center gap-6">
            <div className="flex items-center gap-4">
              <StoryLoveButton storySlug="rag-story-v2" />
              <PageViewCounter />
            </div>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link 
                to="/docs/guides/rag" 
                className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
              >
                <FileCode className="h-4 w-4" />
                Read Technical Guide
              </Link>
              <Link 
                to="/docs/rag_story" 
                className="inline-flex items-center gap-2 px-6 py-2 rounded-full border border-border bg-card text-foreground font-medium hover:bg-muted transition-colors"
              >
                View V1 (Technical)
              </Link>
            </div>
            <p className="text-xs text-muted-foreground text-center max-w-md">
              Part of the AI Fabric Framework series — where facts beat imagination, and free beats expensive
            </p>
          </footer>
        </motion.article>
      </div>
    </DocsLayout>
  );
};

export default RagStoryV2;

