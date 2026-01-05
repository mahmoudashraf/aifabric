import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Highlight, themes } from "prism-react-renderer";
import DocsLayout from "@/components/docs/DocsLayout";
import PageViewCounter from "@/components/PageViewCounter";
import StoryLoveButton from "@/components/StoryLoveButton";
import StoryNavigation from "@/components/StoryNavigation";
import { 
  Heart,
  TrendingDown,
  TrendingUp,
  Smile,
  Meh,
  Frown,
  HelpCircle,
  LogOut,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Brain,
  DollarSign,
  Target,
  MessageSquare,
  Activity,
  Clock,
  Users,
  Sparkles,
  ArrowRight,
  FileCode,
  PhoneCall,
  Mail,
  Calendar
} from "lucide-react";

const PAGE_TITLE = "Behavior Analytics V2: The Customer We Almost Lost - AI Fabric Framework";
const PAGE_DESCRIPTION = "Jessica's journey from satisfied customer to cancellation—and how AI behavior detection saved a $28,800 account.";

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

const JessicasJourney = () => {
  const [activeWeek, setActiveWeek] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const weeks = [
    {
      week: 1,
      title: "Week 1: Happy User",
      sentiment: 0.85,
      sentimentLabel: "SATISFIED",
      churnRisk: 0.08,
      icon: Smile,
      color: "text-green-400",
      bgColor: "bg-green-500/5",
      borderColor: "border-green-500/30",
      events: [
        { emoji: "✅", text: "Logged in 5 days", type: "positive" },
        { emoji: "🎯", text: "Used 3 key features", type: "positive" },
        { emoji: "📊", text: "Created 12 reports", type: "positive" },
        { emoji: "😊", text: "Zero errors encountered", type: "positive" }
      ],
      aiThought: "Healthy engagement. Power user behavior detected."
    },
    {
      week: 2,
      title: "Week 2: Something's Off",
      sentiment: 0.68,
      sentimentLabel: "NEUTRAL",
      churnRisk: 0.23,
      icon: Meh,
      color: "text-amber-400",
      bgColor: "bg-amber-500/5",
      borderColor: "border-amber-500/30",
      events: [
        { emoji: "📅", text: "Logged in 3 days (down 40%)", type: "warning" },
        { emoji: "❌", text: "Error: Export failed (Tue)", type: "error" },
        { emoji: "❌", text: "Error: Report timeout (Thu)", type: "error" },
        { emoji: "🔍", text: "Viewed help docs 3 times", type: "warning" }
      ],
      aiThought: "Engagement declining. Error patterns emerging. Watch closely."
    },
    {
      week: 3,
      title: "Week 3: Frustration Building",
      sentiment: 0.42,
      sentimentLabel: "CONFUSED",
      churnRisk: 0.54,
      icon: HelpCircle,
      color: "text-orange-400",
      bgColor: "bg-orange-500/5",
      borderColor: "border-orange-500/30",
      events: [
        { emoji: "❌", text: "Error: Export failed again", type: "error" },
        { emoji: "❌", text: "Error: Data sync issue", type: "error" },
        { emoji: "🎫", text: "Support ticket opened", type: "error" },
        { emoji: "⏰", text: "Response time: 48 hours", type: "error" },
        { emoji: "😤", text: "Ticket closed without fix", type: "error" }
      ],
      aiThought: "ALERT: Repeated failures. Support dissatisfaction. Churn risk rising."
    },
    {
      week: 4,
      title: "Week 4: Critical Danger",
      sentiment: 0.19,
      sentimentLabel: "FRUSTRATED",
      churnRisk: 0.87,
      icon: Frown,
      color: "text-red-400",
      bgColor: "bg-red-500/5",
      borderColor: "border-red-500/30",
      events: [
        { emoji: "🔍", text: "Searched: 'alternatives to...'", type: "critical" },
        { emoji: "📧", text: "Viewed pricing page 4x", type: "critical" },
        { emoji: "⚙️", text: "Visited: Account > Cancel", type: "critical" },
        { emoji: "📊", text: "Exported all data", type: "critical" },
        { emoji: "👋", text: "Zero feature usage this week", type: "critical" }
      ],
      aiThought: "🚨 CRITICAL: Imminent churn. RAPIDLY_DECLINING. Immediate action required."
    },
    {
      week: 5,
      title: "Week 5: The Intervention",
      sentiment: 0.78,
      sentimentLabel: "SATISFIED",
      churnRisk: 0.15,
      icon: Smile,
      color: "text-green-400",
      bgColor: "bg-green-500/5",
      borderColor: "border-green-500/30",
      events: [
        { emoji: "📞", text: "CS manager called (Mon 9 AM)", type: "intervention" },
        { emoji: "🛠️", text: "Export bug fixed same day", type: "intervention" },
        { emoji: "💳", text: "Credit applied for downtime", type: "intervention" },
        { emoji: "✅", text: "Issue resolved, user happy", type: "positive" },
        { emoji: "🎉", text: "Back to daily usage", type: "positive" }
      ],
      aiThought: "Recovery successful. Sentiment restored. Account saved. $28.8K retained."
    }
  ];

  useEffect(() => {
    if (isPlaying && activeWeek < weeks.length - 1) {
      const timer = setTimeout(() => {
        setActiveWeek(prev => prev + 1);
      }, 2500);
      return () => clearTimeout(timer);
    } else if (activeWeek >= weeks.length - 1) {
      setIsPlaying(false);
    }
  }, [isPlaying, activeWeek, weeks.length]);

  const getEventColor = (type: string) => {
    switch(type) {
      case "positive": return "text-green-400";
      case "warning": return "text-amber-400";
      case "error": return "text-red-400";
      case "critical": return "text-red-600";
      case "intervention": return "text-blue-400";
      default: return "text-muted-foreground";
    }
  };

  return (
    <div className="my-12 p-8 rounded-2xl bg-gradient-to-br from-primary/5 to-accent/5 border border-border/50">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-400" />
            Jessica's Journey: 5 Weeks from Satisfied to Nearly Gone
          </h3>
          <p className="text-sm text-muted-foreground mt-1">Watch AI detect the warning signs</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            disabled={activeWeek >= weeks.length - 1}
            className="p-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {isPlaying ? <Activity className="h-4 w-4 animate-pulse" /> : <ArrowRight className="h-4 w-4" />}
          </button>
          <button
            onClick={() => { setActiveWeek(0); setIsPlaying(false); }}
            className="p-2 rounded-lg bg-muted hover:bg-muted/80 transition-colors"
          >
            ↻
          </button>
        </div>
      </div>
      
      {/* Week Timeline */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {weeks.map((week, i) => (
          <button
            key={i}
            onClick={() => { setActiveWeek(i); setIsPlaying(false); }}
            className={`flex-shrink-0 px-4 py-2 rounded-lg font-semibold transition-all ${
              activeWeek === i
                ? `${week.bgColor} ${week.borderColor} border-2 shadow-lg`
                : "bg-muted/30 border border-border/50 text-muted-foreground hover:border-border"
            }`}
          >
            <div className="flex items-center gap-2">
              <week.icon className={`h-4 w-4 ${activeWeek === i ? week.color : 'text-muted-foreground'}`} />
              <span className={`text-sm ${activeWeek === i ? 'text-foreground' : ''}`}>Week {i + 1}</span>
            </div>
          </button>
        ))}
      </div>
      
      {/* Sentiment Chart */}
      <div className="mb-6 p-4 rounded-lg bg-card/50 border border-border/30">
        <div className="flex justify-between items-end h-32 gap-2">
          {weeks.map((week, i) => {
            const isActive = i <= activeWeek;
            const isCurrent = i === activeWeek;
            
            return (
              <motion.div
                key={i}
                animate={{ 
                  opacity: isActive ? 1 : 0.3,
                  scale: isCurrent ? 1.05 : 1
                }}
                className="flex-1 flex flex-col items-center gap-2"
              >
                <div 
                  className={`w-full rounded-t-lg transition-all ${isCurrent ? 'ring-2 ring-primary' : ''}`}
                  style={{ 
                    height: `${week.sentiment * 100}px`,
                    backgroundColor: isActive 
                      ? `hsl(${120 * week.sentiment}, 70%, 50%)` 
                      : 'hsl(var(--muted))'
                  }}
                />
                <span className="text-[10px] text-muted-foreground">W{i + 1}</span>
              </motion.div>
            );
          })}
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
          <div>
            <span className="text-muted-foreground">Sentiment: </span>
            <span className={`font-bold ${weeks[activeWeek].color}`}>
              {weeks[activeWeek].sentimentLabel}
            </span>
            <span className="text-muted-foreground ml-1">
              ({(weeks[activeWeek].sentiment * 100).toFixed(0)}%)
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">Churn Risk: </span>
            <span className={`font-bold ${weeks[activeWeek].churnRisk > 0.7 ? 'text-red-400' : weeks[activeWeek].churnRisk > 0.4 ? 'text-amber-400' : 'text-green-400'}`}>
              {(weeks[activeWeek].churnRisk * 100).toFixed(0)}%
            </span>
          </div>
        </div>
      </div>
      
      {/* Week Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeWeek}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`p-6 rounded-xl border ${weeks[activeWeek].borderColor} ${weeks[activeWeek].bgColor}`}
        >
          <div className="flex items-center gap-3 mb-4">
            {React.createElement(weeks[activeWeek].icon, {
              className: `h-6 w-6 ${weeks[activeWeek].color}`
            })}
            <h4 className="text-lg font-bold text-foreground">{weeks[activeWeek].title}</h4>
          </div>
          
          <div className="space-y-2 mb-4">
            {weeks[activeWeek].events.map((event, i) => (
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
          
          <div className="mt-4 p-3 rounded-lg bg-muted/30 border border-border/30">
            <p className="text-xs text-muted-foreground">
              <Brain className="h-3 w-3 inline mr-1 text-primary" />
              AI Analysis: <span className="italic">{weeks[activeWeek].aiThought}</span>
            </p>
          </div>
        </motion.div>
      </AnimatePresence>
      
      {activeWeek >= weeks.length - 1 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-6 p-6 rounded-xl bg-green-500/10 border border-green-500/30 text-center"
        >
          <CheckCircle2 className="h-8 w-8 text-green-400 mx-auto mb-3" />
          <p className="text-lg font-bold text-green-400 mb-2">Account Saved: $28,800/year</p>
          <p className="text-sm text-muted-foreground">
            Without AI: Jessica would have cancelled. With AI: She's satisfied again.
          </p>
        </motion.div>
      )}
    </div>
  );
};

const SixSentimentLevels = () => {
  const [selectedLevel, setSelectedLevel] = useState(0);
  
  const levels = [
    {
      label: "DELIGHTED",
      score: "90-100%",
      icon: Sparkles,
      color: "text-emerald-400",
      borderColor: "border-emerald-500/30",
      bgColor: "bg-emerald-500/5",
      description: "Power users, evangelists, feature champions",
      behaviors: [
        "Daily active usage",
        "Advanced feature adoption",
        "Invites team members",
        "Leaves positive reviews"
      ],
      action: "Invite to beta, advocacy program, referral incentives"
    },
    {
      label: "SATISFIED",
      score: "70-90%",
      icon: Smile,
      color: "text-green-400",
      borderColor: "border-green-500/30",
      bgColor: "bg-green-500/5",
      description: "Happy customers meeting their goals consistently",
      behaviors: [
        "Regular engagement",
        "Achieving outcomes",
        "Low support needs",
        "Stable usage patterns"
      ],
      action: "Monitor normally, occasional check-ins, upsell opportunities"
    },
    {
      label: "NEUTRAL",
      score: "50-70%",
      icon: Meh,
      color: "text-amber-400",
      borderColor: "border-amber-500/30",
      bgColor: "bg-amber-500/5",
      description: "No strong signals either way—potential at risk",
      behaviors: [
        "Inconsistent usage",
        "Basic features only",
        "No clear patterns",
        "Passive engagement"
      ],
      action: "Send engagement campaigns, feature tutorials, value reminders"
    },
    {
      label: "CONFUSED",
      score: "30-50%",
      icon: HelpCircle,
      color: "text-orange-400",
      borderColor: "border-orange-500/30",
      bgColor: "bg-orange-500/5",
      description: "Help-seeking behavior detected—struggling to succeed",
      behaviors: [
        "High help doc views",
        "Feature errors",
        "Incomplete workflows",
        "Low task completion"
      ],
      action: "Proactive onboarding, guided tutorials, customer success check-in"
    },
    {
      label: "FRUSTRATED",
      score: "10-30%",
      icon: Frown,
      color: "text-red-400",
      borderColor: "border-red-500/30",
      bgColor: "bg-red-500/5",
      description: "Clear friction detected—intervention needed now",
      behaviors: [
        "Error patterns",
        "Support tickets",
        "Usage declining",
        "Negative signals"
      ],
      action: "Immediate outreach, escalate to management, fix issues ASAP"
    },
    {
      label: "CHURNING",
      score: "0-10%",
      icon: LogOut,
      color: "text-red-600",
      borderColor: "border-red-600/50",
      bgColor: "bg-red-600/5",
      description: "Imminent departure—last chance intervention",
      behaviors: [
        "Cancel button clicks",
        "Data exports",
        "Competitor research",
        "Zero engagement"
      ],
      action: "Executive intervention, retention offers, save-the-account mode"
    }
  ];

  return (
    <div className="my-16">
      <h3 className="text-2xl font-bold text-foreground mb-8 text-center">
        The 6 Sentiment Levels: Beyond Happy/Sad
      </h3>
      
      <div className="grid grid-cols-2 md:grid-cols-6 gap-2 mb-6">
        {levels.map((level, i) => (
          <button
            key={i}
            onClick={() => setSelectedLevel(i)}
            className={`p-3 rounded-lg border-2 transition-all ${
              selectedLevel === i
                ? `${level.borderColor} ${level.bgColor} shadow-lg scale-105`
                : "border-border/30 bg-muted/30 hover:border-border"
            }`}
          >
            {React.createElement(level.icon, {
              className: `h-5 w-5 mx-auto mb-1 ${selectedLevel === i ? level.color : 'text-muted-foreground'}`
            })}
            <p className={`text-[10px] font-semibold text-center ${selectedLevel === i ? 'text-foreground' : 'text-muted-foreground'}`}>
              {level.label}
            </p>
          </button>
        ))}
      </div>
      
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedLevel}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`p-6 rounded-xl border ${levels[selectedLevel].borderColor} ${levels[selectedLevel].bgColor}`}
        >
          <div className="flex items-center gap-3 mb-4">
            {React.createElement(levels[selectedLevel].icon, {
              className: `h-8 w-8 ${levels[selectedLevel].color}`
            })}
            <div>
              <h4 className="text-lg font-bold text-foreground">{levels[selectedLevel].label}</h4>
              <p className="text-xs text-muted-foreground font-mono">{levels[selectedLevel].score}</p>
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground mb-4">{levels[selectedLevel].description}</p>
          
          <div className="space-y-3">
            <div>
              <p className="text-xs font-semibold text-foreground mb-2">Behavioral Signals:</p>
              <ul className="space-y-1">
                {levels[selectedLevel].behaviors.map((behavior, i) => (
                  <li key={i} className="text-xs text-muted-foreground flex items-center gap-2">
                    <CheckCircle2 className="h-3 w-3 text-primary shrink-0" />
                    {behavior}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="p-3 rounded-lg bg-primary/10 border border-primary/20">
              <p className="text-xs font-semibold text-primary mb-1">Recommended Action:</p>
              <p className="text-xs text-foreground">{levels[selectedLevel].action}</p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const TrendDirections = () => {
  const trends = [
    {
      label: "RAPIDLY_DECLINING",
      icon: TrendingDown,
      color: "text-red-600",
      emoji: "🚨",
      threshold: "sentiment Δ < -0.4 OR churn Δ > +0.4",
      meaning: "Major negative shift in one week",
      action: "Immediate executive intervention",
      example: "Jessica week 3→4: sentiment 0.42 → 0.19 (Δ -0.23) + churn spike"
    },
    {
      label: "DECLINING",
      icon: TrendingDown,
      color: "text-orange-400",
      emoji: "⚠️",
      threshold: "sentiment Δ < -0.2 OR churn Δ > +0.2",
      meaning: "Negative trend over 2-3 weeks",
      action: "Schedule customer success check-in",
      example: "Usage dropped 30%, help doc views increased"
    },
    {
      label: "STABLE",
      icon: Activity,
      color: "text-muted-foreground",
      emoji: "→",
      threshold: "No significant change",
      meaning: "Consistent patterns, no alerts",
      action: "Normal monitoring, quarterly reviews",
      example: "Same usage patterns, same sentiment, predictable"
    },
    {
      label: "IMPROVING",
      icon: TrendingUp,
      color: "text-green-400",
      emoji: "↗️",
      threshold: "sentiment Δ > +0.2 OR churn Δ < -0.2",
      meaning: "Positive shift over time",
      action: "Consider upsell opportunities",
      example: "Started using new features, engagement increasing"
    },
    {
      label: "RAPIDLY_IMPROVING",
      icon: TrendingUp,
      color: "text-emerald-400",
      emoji: "🎉",
      threshold: "sentiment Δ > +0.4 OR churn Δ < -0.4",
      meaning: "Major positive transformation",
      action: "Invite to advocacy, beta programs",
      example: "Jessica week 4→5: After intervention, engagement restored"
    }
  ];

  return (
    <div className="my-16">
      <h3 className="text-2xl font-bold text-foreground mb-8 text-center">
        The 5 Trend Directions: Where Are Things Heading?
      </h3>
      <p className="text-sm text-muted-foreground text-center mb-8">
        Trends matter more than absolute scores. A SATISFIED user trending DOWN is more at risk than a NEUTRAL user trending UP.
      </p>
      
      <div className="space-y-4">
        {trends.map((trend, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            viewport={{ once: true }}
            className="p-5 rounded-xl bg-card border border-border/50 hover:border-primary/30 transition-all"
          >
            <div className="flex items-start gap-4">
              <div className="flex flex-col items-center gap-1 shrink-0">
                <span className="text-2xl">{trend.emoji}</span>
                <trend.icon className={`h-5 w-5 ${trend.color}`} />
              </div>
              
              <div className="flex-1">
                <h4 className="font-bold text-foreground mb-1">{trend.label}</h4>
                <p className="text-sm text-muted-foreground mb-3">{trend.meaning}</p>
                
                <div className="grid md:grid-cols-3 gap-3 text-xs">
                  <div className="p-2 rounded bg-muted/30">
                    <span className="text-muted-foreground">Threshold: </span>
                    <span className="font-mono text-foreground">{trend.threshold}</span>
                  </div>
                  <div className="p-2 rounded bg-primary/10">
                    <span className="text-muted-foreground">Action: </span>
                    <span className="text-primary font-semibold">{trend.action}</span>
                  </div>
                  <div className="p-2 rounded bg-muted/30">
                    <span className="text-muted-foreground">Example: </span>
                    <span className="text-foreground">{trend.example}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const CustomerSuccessStory = () => {
  return (
    <div className="my-16 grid lg:grid-cols-2 gap-8">
      {/* Without AI */}
      <div className="p-8 rounded-2xl bg-red-500/5 border-2 border-red-500/30">
        <div className="flex items-center gap-3 mb-6">
          <XCircle className="h-8 w-8 text-red-400" />
          <h4 className="text-xl font-bold text-foreground">Maria Without AI</h4>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Calendar className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-foreground text-sm">Monday Morning</p>
              <p className="text-xs text-muted-foreground">"Check emails. 5 cancellation requests. Didn't see them coming."</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <Mail className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-foreground text-sm">Tuesday</p>
              <p className="text-xs text-muted-foreground">"Send surveys. 12% response rate. Mostly 'it's fine' responses."</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <Users className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-foreground text-sm">End of Month</p>
              <p className="text-xs text-muted-foreground">"68 customers cancelled. Lost $163K ARR. Why didn't they tell us?"</p>
            </div>
          </div>
        </div>
        
        <div className="mt-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20">
          <p className="text-sm text-red-400 font-bold">Result: Reactive & Late</p>
          <p className="text-xs text-muted-foreground mt-1">$2M+ lost per year</p>
        </div>
      </div>
      
      {/* With AI */}
      <div className="p-8 rounded-2xl bg-green-500/5 border-2 border-green-500/30">
        <div className="flex items-center gap-3 mb-6">
          <CheckCircle2 className="h-8 w-8 text-green-400" />
          <h4 className="text-xl font-bold text-foreground">Maria With AI</h4>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <Brain className="h-5 w-5 text-green-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-foreground text-sm">Monday Morning 9 AM</p>
              <p className="text-xs text-muted-foreground">"AI alert: 15 users RAPIDLY_DECLINING. Jessica at 87% churn risk."</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <PhoneCall className="h-5 w-5 text-green-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-foreground text-sm">Monday 10 AM</p>
              <p className="text-xs text-muted-foreground">"Called Jessica. She mentioned export errors. We didn't know! Fixed same day."</p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <Heart className="h-5 w-5 text-green-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-foreground text-sm">End of Month</p>
              <p className="text-xs text-muted-foreground">"12/15 at-risk users saved. $345K ARR retained. Best month ever."</p>
            </div>
          </div>
        </div>
        
        <div className="mt-6 p-4 rounded-lg bg-green-500/10 border border-green-500/20">
          <p className="text-sm text-green-400 font-bold">Result: Proactive & Early</p>
          <p className="text-xs text-muted-foreground mt-1">58% save rate, $840K/year saved</p>
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
        One interface. Your events. AI does the rest.
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
              <h4 className="font-bold text-foreground">Implement ExternalEventProvider</h4>
              <p className="text-xs text-muted-foreground">Bridge YOUR data to the behavior module</p>
            </div>
          </div>
          
          <CodeBlock code={`@Component
public class MyEventProvider implements ExternalEventProvider {
    
    @Autowired
    private MyAnalyticsService analytics;
    
    @Override
    public List<ExternalEvent> getEventsForUser(
        UUID userId,
        LocalDateTime since,
        LocalDateTime until
    ) {
        // YOUR events from YOUR database
        return analytics.getUserEvents(userId, since, until)
            .stream()
            .map(this::toExternalEvent)
            .toList();
    }
    
    private ExternalEvent toExternalEvent(MyEvent event) {
        return ExternalEvent.builder()
            .eventType(event.getType())        // "login", "error", "purchase"
            .eventValue(event.getValue())      // "payment_failed"
            .timestamp(event.getTimestamp())
            .metadata(event.getMetadata())
            .build();
    }
}`} />
          
          <div className="mt-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
            <p className="text-xs text-green-400">
              ✓ That's it. AI handles analysis, sentiment, churn prediction, recommendations.
            </p>
          </div>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="p-6 rounded-xl bg-card border border-border/50"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
              <Target className="h-5 w-5 text-green-400" />
            </div>
            <div>
              <h4 className="font-bold text-foreground">Use the Insights</h4>
              <p className="text-xs text-muted-foreground">Query and act on AI-generated behavior data</p>
            </div>
          </div>
          
          <CodeBlock code={`// Find at-risk users
List<BehaviorInsights> atRisk = behaviorRepository
    .findRapidlyDecliningUsers();

atRisk.forEach(insight -> {
    if (insight.getChurnRisk() > 0.8) {
        // HIGH RISK - Act now
        customerSuccess.createUrgentTask(
            insight.getUserId(),
            insight.getChurnReason(),      // AI tells you WHY
            insight.getRecommendations()   // AI tells you WHAT TO DO
        );
    }
});

// Personalize UI
Optional<BehaviorInsights> insight = 
    behaviorRepository.findByUserId(userId);

if (insight.isPresent() && insight.get().getSentimentLabel() == CONFUSED) {
    // Show tutorial for confused users
    return "onboarding-mode";
}`} />
        </motion.div>
      </div>
    </div>
  );
};

const BehaviorStoryV2 = () => {
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
            <div className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-primary/5" />
            <div className="relative">
              <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-2 text-sm font-medium text-accent">
                    <Heart className="h-4 w-4" />
                    Behavior Analytics V2
                  </span>
                  <Link 
                    to="/docs/behavior_story"
                    className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                  >
                    ← View V1
                  </Link>
                </div>
                <div className="flex items-center gap-3">
                  <StoryLoveButton storySlug="behavior-story-v2" />
                  <PageViewCounter />
                </div>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
                The Customer We{" "}
                <span className="text-gradient">Almost Lost</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mb-8">
                This is Jessica's story. A satisfied customer who silently spiraled toward cancellation—until AI noticed what humans couldn't.
              </p>
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 border border-border/50">
                  <Target className="h-4 w-4 text-green-400" />
                  87% Accuracy
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 border border-border/50">
                  <Clock className="h-4 w-4 text-amber-400" />
                  2-4 Weeks Early
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 border border-border/50">
                  <DollarSign className="h-4 w-4 text-blue-400" />
                  $840K Saved/Year
                </div>
              </div>
            </div>
          </section>

          {/* Jessica's Journey */}
          <JessicasJourney />

          {/* The Six Levels */}
          <SixSentimentLevels />

          {/* Trend Directions */}
          <TrendDirections />

          {/* Customer Success Comparison */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
              Two Customer Success Managers. Same Job. Different Tools.
            </h2>
            <CustomerSuccessStory />
          </section>

          {/* What You Implement */}
          <WhatYouImplement />

          {/* The Revelation */}
          <section className="mb-16 p-8 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/5 border border-primary/20 text-center">
            <Heart className="h-16 w-16 text-primary mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-foreground mb-4">The Revelation</h3>
            <div className="max-w-2xl mx-auto space-y-4 text-muted-foreground">
              <p className="text-lg">
                "Jessica never said she was unhappy. She never filled out a survey."
              </p>
              <p className="text-lg">
                "But her behavior screamed it. Three errors. Support ticket ignored. Usage dropped."
              </p>
              <p className="text-lg">
                "<span className="text-primary font-semibold">The AI saw what I missed. It read between the clicks.</span>"
              </p>
              <p className="text-lg">
                "We called her Monday morning. Fixed her issue same day. She's still our customer."
              </p>
              <p className="text-lg">
                "<span className="text-primary font-semibold">That's $28,800 we would have lost. Because I was too busy to notice.</span>"
              </p>
              <p className="text-sm text-foreground italic font-semibold pt-4 border-t border-border/30">
                — Maria, Customer Success Manager, after saving Jessica's account
              </p>
            </div>
          </section>

          {/* Bottom Line */}
          <section className="mb-16 p-8 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/5 border-2 border-primary/30">
            <h3 className="text-2xl font-bold text-foreground mb-6 text-center">The Numbers Don't Lie</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                { value: "87%", label: "Churn Prediction", icon: Target },
                { value: "2-4 wks", label: "Early Warning", icon: Clock },
                { value: "58%", label: "Save Rate", icon: Heart },
                { value: "$840K", label: "Saved/Year", icon: DollarSign }
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
              "Every customer has a story. AI helps you hear it before it's too late."
            </p>
          </section>

          {/* Story Navigation */}
          <StoryNavigation className="mt-12" />

          {/* Footer */}
          <footer className="border-t border-border/50 pt-12 mt-12 flex flex-col items-center gap-6">
            <div className="flex items-center gap-4">
              <StoryLoveButton storySlug="behavior-story-v2" />
              <PageViewCounter />
            </div>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link 
                to="/docs/guides/behavior" 
                className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors"
              >
                <FileCode className="h-4 w-4" />
                Read Technical Guide
              </Link>
              <Link 
                to="/docs/behavior_story" 
                className="inline-flex items-center gap-2 px-6 py-2 rounded-full border border-border bg-card text-foreground font-medium hover:bg-muted transition-colors"
              >
                View V1 (Technical)
              </Link>
            </div>
            <p className="text-xs text-muted-foreground text-center max-w-md">
              Part of the AI Fabric Framework series — where AI reads between the clicks
            </p>
          </footer>
        </motion.article>
      </div>
    </DocsLayout>
  );
};

export default BehaviorStoryV2;

