import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Highlight, themes } from "prism-react-renderer";
import DocsLayout from "@/components/docs/DocsLayout";
import PageViewCounter from "@/components/PageViewCounter";
import StoryLoveButton from "@/components/StoryLoveButton";
import StoryNavigation from "@/components/StoryNavigation";
import { 
  Shield,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Lock,
  Eye,
  Brain,
  Zap,
  Users,
  Database,
  FileCode,
  Code,
  Key,
  Search,
  MessageSquare,
  Settings,
  BookOpen,
  ArrowRight,
  Ban,
  Clock,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Activity,
  Sparkles,
  Heart,
  Target,
  Play,
  Pause,
  RotateCcw
} from "lucide-react";

const PAGE_TITLE = "Access Policy V2: The Security Audit That Changed Everything - AI Fabric Framework";
const PAGE_DESCRIPTION = "A developer's journey from security chaos to fail-closed peace—how custom access policies saved the day.";
const OG_IMAGE = "/assets/story-preview.png";

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

const TheSecurityAudit = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const steps = [
    {
      time: "Monday 9:00 AM",
      title: "The Audit Begins",
      icon: Eye,
      color: "text-blue-400",
      bgColor: "bg-blue-500/5",
      borderColor: "border-blue-500/30",
      events: [
        { emoji: "📋", text: "Security audit scheduled: 'Review access control'", type: "info" },
        { emoji: "😊", text: "Team: 'We got this, security is everywhere'", type: "positive" },
        { emoji: "☕", text: "Coffee in hand, ready to impress", type: "info" }
      ]
    },
    {
      time: "Monday 10:30 AM",
      title: "The Discovery",
      icon: AlertTriangle,
      color: "text-orange-400",
      bgColor: "bg-orange-500/5",
      borderColor: "border-orange-500/30",
      events: [
        { emoji: "🔍", text: "Auditor: 'Where are your access control rules?'", type: "warning" },
        { emoji: "😅", text: "Team: 'They're... everywhere?'", type: "warning" },
        { emoji: "📁", text: "Found: 20 controllers, 50+ hardcoded rules", type: "error" },
        { emoji: "❌", text: "No centralized policy", type: "error" }
      ]
    },
    {
      time: "Monday 2:00 PM",
      title: "The Horror",
      icon: XCircle,
      color: "text-red-400",
      bgColor: "bg-red-500/5",
      borderColor: "border-red-500/30",
      events: [
        { emoji: "😱", text: "Found: Rule in Controller A doesn't match Controller B", type: "critical" },
        { emoji: "💔", text: "Found: Missing check in new feature (shipped last week)", type: "critical" },
        { emoji: "⚖️", text: "Auditor: 'This is a compliance risk'", type: "critical" },
        { emoji: "📉", text: "Security score: 3/10", type: "critical" }
      ]
    },
    {
      time: "Monday 4:00 PM",
      title: "The Panic",
      icon: AlertTriangle,
      color: "text-red-600",
      bgColor: "bg-red-600/5",
      borderColor: "border-red-600/50",
      events: [
        { emoji: "🚨", text: "CEO: 'Fix this. Now.'", type: "critical" },
        { emoji: "⏰", text: "Deadline: 48 hours", type: "critical" },
        { emoji: "😰", text: "Team: 'How do we fix 20 controllers in 48 hours?'", type: "critical" },
        { emoji: "💭", text: "Flashback: 'We thought we checked that...'", type: "critical" }
      ]
    },
    {
      time: "Tuesday 9:00 AM",
      title: "The Solution",
      icon: Brain,
      color: "text-blue-400",
      bgColor: "bg-blue-500/5",
      borderColor: "border-blue-500/30",
      events: [
        { emoji: "💡", text: "Remember: AI Fabric has Access Policy module", type: "positive" },
        { emoji: "🛡️", text: "EntityAccessPolicy: One interface, enforced everywhere", type: "positive" },
        { emoji: "✅", text: "Fail-closed: Exception = deny access", type: "positive" },
        { emoji: "📋", text: "Audit trail built-in", type: "positive" }
      ]
    },
    {
      time: "Tuesday 2:00 PM",
      title: "The Implementation",
      icon: Code,
      color: "text-green-400",
      bgColor: "bg-green-500/5",
      borderColor: "border-green-500/30",
      events: [
        { emoji: "⚡", text: "30 minutes: Implement EntityAccessPolicy", type: "intervention" },
        { emoji: "🔧", text: "1 hour: Remove hardcoded rules from controllers", type: "intervention" },
        { emoji: "✅", text: "Framework enforces policy automatically", type: "intervention" },
        { emoji: "📊", text: "Security score: 9/10", type: "intervention" }
      ]
    },
    {
      time: "Wednesday 10:00 AM",
      title: "The Victory",
      icon: CheckCircle2,
      color: "text-green-400",
      bgColor: "bg-green-500/5",
      borderColor: "border-green-500/30",
      events: [
        { emoji: "🎉", text: "Auditor: 'This is exactly what we needed'", type: "positive" },
        { emoji: "✅", text: "Compliance: PASSED", type: "positive" },
        { emoji: "😴", text: "Team: 'We can finally sleep'", type: "positive" },
        { emoji: "🛡️", text: "Security: Centralized, testable, fail-closed", type: "positive" }
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
    switch (type) {
      case "critical": return "text-red-400";
      case "error": return "text-orange-400";
      case "warning": return "text-yellow-400";
      case "positive": return "text-green-400";
      case "intervention": return "text-blue-400";
      default: return "text-muted-foreground";
    }
  };

  return (
    <div className="my-16">
      <h3 className="text-2xl font-bold text-foreground mb-8 text-center">
        The Security Audit Timeline: From Chaos to Control
      </h3>
      <p className="text-sm text-muted-foreground text-center mb-8">
        A 48-hour journey that changed how we think about security
      </p>
      
      {/* Controls */}
      <div className="flex items-center justify-center gap-3 mb-6">
        <button
          onClick={() => {
            setIsPlaying(!isPlaying);
            if (activeStep >= steps.length - 1) {
              setActiveStep(0);
              setIsPlaying(true);
            }
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 transition-colors"
        >
          {isPlaying ? (
            <>
              <Pause className="h-4 w-4" />
              Pause
            </>
          ) : (
            <>
              <Play className="h-4 w-4" />
              Play Timeline
            </>
          )}
        </button>
        <button
          onClick={() => {
            setActiveStep(0);
            setIsPlaying(false);
          }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted border border-border/50 text-muted-foreground hover:text-foreground transition-colors"
        >
          <RotateCcw className="h-4 w-4" />
          Reset
        </button>
      </div>
      
      {/* Step Navigation */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 justify-center">
        {steps.map((step, i) => {
          const Icon = step.icon;
          return (
            <button
              key={i}
              onClick={() => {
                setActiveStep(i);
                setIsPlaying(false);
              }}
              className={`flex-shrink-0 px-3 py-2 rounded-lg font-semibold transition-all ${
                activeStep === i
                  ? `${step.bgColor} ${step.borderColor} border-2 shadow-lg`
                  : "bg-muted/30 border border-border/50 text-muted-foreground hover:border-border"
              }`}
            >
              <div className="flex items-center gap-2">
                <Icon className={`h-4 w-4 ${activeStep === i ? step.color : 'text-muted-foreground'}`} />
                <span className={`text-xs ${activeStep === i ? 'text-foreground' : ''}`}>{step.time.split(' ')[0]}</span>
              </div>
            </button>
          );
        })}
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
          <Shield className="h-8 w-8 text-green-400 mx-auto mb-3" />
          <p className="text-lg font-bold text-green-400 mb-2">Access Policy Enabled: Security Centralized</p>
          <p className="text-sm text-muted-foreground">
            All access control rules in one place. Framework enforces everywhere. Fail-closed by default.
          </p>
        </motion.div>
      )}
    </div>
  );
};

const TheFailClosedPrinciple = () => {
  const [selectedExample, setSelectedExample] = useState(0);
  
  const examples = [
    {
      title: "Bad: Throws Exception",
      icon: XCircle,
      color: "text-red-400",
      borderColor: "border-red-500/30",
      bgColor: "bg-red-500/5",
      code: `@Override
public boolean canUserAccessEntity(String userId, 
                                   Map<String, Object> entityContext) {
    // BAD: Throws exception if user not found
    User user = userRepository.findById(userId);  // Might be null!
    return user.getTier().equals("PRO");  // NullPointerException!
}`,
      result: "Framework catches exception → Denies access → Logs warning"
    },
    {
      title: "Good: Handles Gracefully",
      icon: CheckCircle2,
      color: "text-green-400",
      borderColor: "border-green-500/30",
      bgColor: "bg-green-500/5",
      code: `@Override
public boolean canUserAccessEntity(String userId, 
                                   Map<String, Object> entityContext) {
    // GOOD: Handle gracefully
    Optional<User> userOpt = userRepository.findById(userId);
    if (userOpt.isEmpty()) {
        return false;  // User not found = deny access
    }
    User user = userOpt.get();
    return "PRO".equals(user.getTier());  // Safe comparison
}`,
      result: "Framework evaluates → Returns decision → Access granted/denied"
    }
  ];

  return (
    <div className="my-16">
      <h3 className="text-2xl font-bold text-foreground mb-8 text-center">
        The Fail-Closed Principle: Exception = Deny
      </h3>
      <p className="text-sm text-muted-foreground text-center mb-8">
        If your policy throws an exception, the framework denies access. Better safe than sorry.
      </p>
      
      <div className="grid grid-cols-2 gap-2 mb-6">
        {examples.map((example, i) => {
          const Icon = example.icon;
          return (
            <button
              key={i}
              onClick={() => setSelectedExample(i)}
              className={`p-3 rounded-lg border-2 transition-all ${
                selectedExample === i
                  ? `${example.borderColor} ${example.bgColor} shadow-lg`
                  : "border-border/30 bg-muted/30 hover:border-border"
              }`}
            >
              <div className="flex items-center gap-2 justify-center">
                <Icon className={`h-5 w-5 ${selectedExample === i ? example.color : 'text-muted-foreground'}`} />
                <p className={`text-xs font-semibold ${selectedExample === i ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {example.title}
                </p>
              </div>
            </button>
          );
        })}
      </div>
      
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedExample}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`p-6 rounded-xl border ${examples[selectedExample].borderColor} ${examples[selectedExample].bgColor}`}
        >
          <div className="flex items-center gap-3 mb-4">
            {React.createElement(examples[selectedExample].icon, {
              className: `h-6 w-6 ${examples[selectedExample].color}`
            })}
            <h4 className="font-bold text-foreground">{examples[selectedExample].title}</h4>
          </div>
          <CodeBlock code={examples[selectedExample].code} />
          <div className="mt-4 p-3 rounded-lg bg-primary/10 border border-primary/20">
            <p className="text-xs font-semibold text-primary mb-1">Framework Behavior:</p>
            <p className="text-sm text-muted-foreground">{examples[selectedExample].result}</p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const BeforeAfterComparison = () => {
  return (
    <div className="my-16">
      <h3 className="text-2xl font-bold text-foreground mb-8 text-center">
        Before & After: The Transformation
      </h3>
      
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Before */}
        <div className="p-6 rounded-xl border-2 border-red-500/30 bg-red-500/5">
          <div className="flex items-center gap-3 mb-4">
            <XCircle className="h-6 w-6 text-red-400" />
            <h4 className="font-bold text-foreground">Before: Hardcoded Chaos</h4>
          </div>
          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-muted/30 border border-border/30">
              <p className="text-xs font-semibold text-foreground mb-2">Problems:</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• 20 controllers with hardcoded rules</li>
                <li>• 50+ security checks scattered everywhere</li>
                <li>• No way to test security independently</li>
                <li>• Easy to miss edge cases</li>
                <li>• No audit trail</li>
                <li>• Framework can't enforce rules</li>
              </ul>
            </div>
            <CodeBlock code={`@PostMapping("/api/chat")
public OrchestrationResult chat(@RequestBody String query,
                                 @AuthenticationPrincipal User user) {
    // Security checks scattered everywhere
    if (user.getRole().equals("ADMIN")) {
        return orchestrator.orchestrate(query, context);
    }
    
    if (query.contains("cancel") && !user.getTier().equals("PRO")) {
        return OrchestrationResult.error("Upgrade to Pro");
    }
    
    // ... 50 more hardcoded rules ...
    
    return orchestrator.orchestrate(query, context);
}`} />
          </div>
        </div>
        
        {/* After */}
        <div className="p-6 rounded-xl border-2 border-green-500/30 bg-green-500/5">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle2 className="h-6 w-6 text-green-400" />
            <h4 className="font-bold text-foreground">After: Centralized Policy</h4>
          </div>
          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-muted/30 border border-border/30">
              <p className="text-xs font-semibold text-foreground mb-2">Benefits:</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• One policy interface, enforced everywhere</li>
                <li>• All security logic in one place</li>
                <li>• Testable independently</li>
                <li>• Fail-closed by default</li>
                <li>• Built-in audit trail</li>
                <li>• Framework enforces automatically</li>
              </ul>
            </div>
            <CodeBlock code={`@Component
public class MyAccessPolicy implements EntityAccessPolicy {
    
    @Override
    public boolean canUserAccessEntity(String userId, 
                                       Map<String, Object> entityContext) {
        String resourceId = (String) entityContext.get("resourceId");
        String operationType = (String) entityContext.get("operationType");
        
        // YOUR business rules in one place
        if (resourceId.equals("rag:intent") && 
            operationType.equals("READ")) {
            return true;
        }
        
        if (resourceId.startsWith("action:")) {
            String action = resourceId.substring(7);
            return permissionService.canPerformAction(userId, action);
        }
        
        return false; // Default: deny
    }
}

// Framework enforces automatically on every request`} />
          </div>
        </div>
      </div>
      
      <div className="mt-6 p-4 rounded-lg bg-primary/10 border border-primary/20 text-center">
        <p className="text-sm font-bold text-primary">
          Result: Security score 3/10 → 9/10. Compliance: PASSED. Team: Happy.
        </p>
      </div>
    </div>
  );
};

const PolicyTypes = () => {
  const [activePolicy, setActivePolicy] = useState(0);
  
  const policies = [
    {
      name: "Tier-Based",
      icon: Users,
      color: "text-blue-400",
      borderColor: "border-blue-500/30",
      bgColor: "bg-blue-500/5",
      description: "Different subscription tiers have different access levels",
      code: `@Component
public class TierBasedAccessPolicy implements EntityAccessPolicy {
    
    @Autowired
    private SubscriptionService subscriptionService;
    
    @Override
    public boolean canUserAccessEntity(String userId, 
                                       Map<String, Object> entityContext) {
        Subscription subscription = subscriptionService
            .findByUserId(userId);
        String tier = subscription != null ? 
            subscription.getTier() : "FREE";
        
        // Intent queries: all tiers allowed
        if (resourceId.equals("rag:intent") && 
            operationType.equals("READ")) {
            return true;
        }
        
        // Action execution: tier-based
        if (resourceId.startsWith("action:")) {
            String action = resourceId.substring(7);
            
            if ("FREE".equals(tier)) {
                return List.of("view_profile", "update_email")
                    .contains(action);
            }
            
            if ("PRO".equals(tier)) {
                return !List.of("delete_account", "export_all_data")
                    .contains(action);
            }
            
            if ("ENTERPRISE".equals(tier)) {
                return true;
            }
        }
        
        return false;
    }
}`
    },
    {
      name: "Role-Based",
      icon: Key,
      color: "text-purple-400",
      borderColor: "border-purple-500/30",
      bgColor: "bg-purple-500/5",
      description: "Different roles have different permissions",
      code: `@Component
public class RoleBasedAccessPolicy implements EntityAccessPolicy {
    
    @Autowired
    private UserService userService;
    
    @Override
    public boolean canUserAccessEntity(String userId, 
                                       Map<String, Object> entityContext) {
        User user = userService.findById(userId);
        if (user == null) return false;
        
        Set<String> roles = user.getRoles();
        
        // Admin: all access
        if (roles.contains("ADMIN")) {
            return true;
        }
        
        // Intent queries: all authenticated users
        if (resourceId.equals("rag:intent") && 
            operationType.equals("READ")) {
            return true;
        }
        
        // Action execution: role-based
        if (resourceId.startsWith("action:")) {
            String action = resourceId.substring(7);
            Set<String> requiredRoles = roleService
                .getRequiredRoles(action);
            return roles.stream()
                .anyMatch(requiredRoles::contains);
        }
        
        return false;
    }
}`
    },
    {
      name: "Time-Based",
      icon: Clock,
      color: "text-amber-400",
      borderColor: "border-amber-500/30",
      bgColor: "bg-amber-500/5",
      description: "Some actions only allowed during business hours",
      code: `@Component
public class TimeBasedAccessPolicy implements EntityAccessPolicy {
    
    @Autowired
    private Clock clock;
    
    @Override
    public boolean canUserAccessEntity(String userId, 
                                       Map<String, Object> entityContext) {
        LocalDateTime now = LocalDateTime.now(clock);
        DayOfWeek dayOfWeek = now.getDayOfWeek();
        int hour = now.getHour();
        
        // Intent queries: always allowed
        if (resourceId.equals("rag:intent") && 
            operationType.equals("READ")) {
            return true;
        }
        
        // Critical actions: business hours only
        if (resourceId.startsWith("action:")) {
            String action = resourceId.substring(7);
            
            if (List.of("delete_account", "export_all_data")
                .contains(action)) {
                
                boolean isBusinessHours = 
                    dayOfWeek != DayOfWeek.SATURDAY &&
                    dayOfWeek != DayOfWeek.SUNDAY &&
                    hour >= 9 && hour < 17;
                
                return isBusinessHours;
            }
        }
        
        return false;
    }
}`
    }
  ];

  return (
    <div className="my-16">
      <h3 className="text-2xl font-bold text-foreground mb-8 text-center">
        Three Policy Types: Choose Your Security Model
      </h3>
      <p className="text-sm text-muted-foreground text-center mb-8">
        Implement any combination. Framework enforces them all.
      </p>
      
      <div className="grid grid-cols-3 gap-2 mb-6">
        {policies.map((policy, i) => {
          const Icon = policy.icon;
          return (
            <button
              key={i}
              onClick={() => setActivePolicy(i)}
              className={`p-3 rounded-lg border-2 transition-all ${
                activePolicy === i
                  ? `${policy.borderColor} ${policy.bgColor} shadow-lg`
                  : "border-border/30 bg-muted/30 hover:border-border"
              }`}
            >
              <Icon className={`h-5 w-5 mx-auto mb-1 ${activePolicy === i ? policy.color : 'text-muted-foreground'}`} />
              <p className={`text-xs font-semibold text-center ${activePolicy === i ? 'text-foreground' : 'text-muted-foreground'}`}>
                {policy.name}
              </p>
            </button>
          );
        })}
      </div>
      
      <AnimatePresence mode="wait">
        <motion.div
          key={activePolicy}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`p-6 rounded-xl border ${policies[activePolicy].borderColor} ${policies[activePolicy].bgColor}`}
        >
          <div className="flex items-center gap-3 mb-4">
            {React.createElement(policies[activePolicy].icon, {
              className: `h-6 w-6 ${policies[activePolicy].color}`
            })}
            <div>
              <h4 className="font-bold text-foreground">{policies[activePolicy].name} Access Policy</h4>
              <p className="text-xs text-muted-foreground">{policies[activePolicy].description}</p>
            </div>
          </div>
          <CodeBlock code={policies[activePolicy].code} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const WhatYouImplement = () => {
  return (
    <div className="my-16">
      <h3 className="text-2xl font-bold text-foreground mb-8 text-center">
        What You Actually Implement
      </h3>
      
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-xl border border-primary/30 bg-primary/5">
          <div className="flex items-center gap-3 mb-4">
            <Code className="h-6 w-6 text-primary" />
            <h4 className="font-bold text-foreground">The Interface</h4>
          </div>
          <CodeBlock code={`@FunctionalInterface
public interface EntityAccessPolicy {
    
    boolean canUserAccessEntity(
        String userId, 
        Map<String, Object> entity
    );
    
    default void logAccessDenied(
        String userId, 
        Map<String, Object> entity, 
        String reason
    ) {
        // Optional: Override for audit logging
    }
}`} />
        </div>
        
        <div className="p-6 rounded-xl border border-secondary/30 bg-secondary/5">
          <div className="flex items-center gap-3 mb-4">
            <Settings className="h-6 w-6 text-secondary" />
            <h4 className="font-bold text-foreground">Your Implementation</h4>
          </div>
          <CodeBlock code={`@Component
public class MyAccessPolicy 
    implements EntityAccessPolicy {
    
    @Override
    public boolean canUserAccessEntity(
        String userId, 
        Map<String, Object> entityContext
    ) {
        // YOUR business rules
        String resourceId = (String) 
            entityContext.get("resourceId");
        String operationType = (String) 
            entityContext.get("operationType");
        
        // ... your logic ...
        
        return false; // Default: deny
    }
}`} />
        </div>
      </div>
      
      <div className="mt-6 p-6 rounded-xl bg-gradient-primary text-center">
        <p className="text-primary-foreground font-semibold text-lg">
          That's it. Framework handles the rest. Fail-closed. Always secure.
        </p>
      </div>
    </div>
  );
};

const AccessPolicyStoryV2 = () => {
  useEffect(() => {
    document.title = PAGE_TITLE;

    const absoluteOgImage = `${window.location.origin}${OG_IMAGE}`;

    const updateMeta = (selector: string, attribute: string, value: string) => {
      let element = document.querySelector(selector) as HTMLMetaElement | null;
      if (!element) {
        element = document.createElement("meta");
        if (selector.includes("property=")) {
          element.setAttribute(
            "property",
            selector.match(/property="([^"]+)"/)?.[1] || ""
          );
        } else if (selector.includes("name=")) {
          element.setAttribute(
            "name",
            selector.match(/name="([^"]+)"/)?.[1] || ""
          );
        }
        document.head.appendChild(element);
      }
      element.setAttribute(attribute, value);
    };

    const updateCanonical = (href: string) => {
      let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement("link");
        link.setAttribute("rel", "canonical");
        document.head.appendChild(link);
      }
      link.setAttribute("href", href);
    };

    updateMeta('meta[name="description"]', "content", PAGE_DESCRIPTION);
    updateMeta('meta[property="og:title"]', "content", PAGE_TITLE);
    updateMeta('meta[property="og:description"]', "content", PAGE_DESCRIPTION);
    updateMeta('meta[property="og:image"]', "content", absoluteOgImage);
    updateMeta('meta[property="og:type"]', "content", "article");
    updateMeta('meta[property="og:url"]', "content", window.location.href);

    updateMeta('meta[name="twitter:title"]', "content", PAGE_TITLE);
    updateMeta('meta[name="twitter:description"]', "content", PAGE_DESCRIPTION);
    updateMeta('meta[name="twitter:image"]', "content", absoluteOgImage);
    updateMeta('meta[name="twitter:card"]', "content", "summary_large_image");

    updateCanonical(window.location.href);
  }, []);

  return (
    <DocsLayout>
      <div className="min-h-screen">
        {/* Top Navigation */}
        <StoryNavigation variant="compact" className="px-6 pt-6" />

        {/* Hero */}
        <section className="relative overflow-hidden border-b border-border/50">
          <div className="absolute inset-0 bg-gradient-glow opacity-50" />
          <div className="px-6 py-16 relative">
            <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                  <span className="text-2xl">🛡️</span>
                  Access Policy V2 (Narrative)
                </span>
                <Link 
                  to="/docs/access_policy_story"
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  View V1 →
                </Link>
              </div>
              <div className="flex items-center gap-3">
                <StoryLoveButton storySlug="access_policy_story_v2" />
                <PageViewCounter />
              </div>
            </div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl"
            >
              <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
                The Security Audit That{" "}
                <span className="text-gradient">Changed Everything</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mb-8">
                A developer's journey from security chaos to fail-closed peace—how custom access policies 
                saved the day in 48 hours.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2 text-sm text-accent">
                  <Shield className="h-4 w-4" />
                  Fail Closed
                </div>
                <div className="flex items-center gap-2 rounded-full bg-secondary/10 px-4 py-2 text-sm text-secondary">
                  <Lock className="h-4 w-4" />
                  Centralized
                </div>
                <div className="flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm text-primary">
                  <Zap className="h-4 w-4" />
                  48 Hours
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* The Security Audit Timeline */}
        <section className="px-6 py-12">
          <div className="max-w-4xl mx-auto">
            <TheSecurityAudit />
          </div>
        </section>

        {/* Before & After */}
        <section className="px-6 py-12 border-t border-border/50 bg-muted/30">
          <div className="max-w-4xl mx-auto">
            <BeforeAfterComparison />
          </div>
        </section>

        {/* The Fail-Closed Principle */}
        <section className="px-6 py-12">
          <div className="max-w-4xl mx-auto">
            <TheFailClosedPrinciple />
          </div>
        </section>

        {/* Policy Types */}
        <section className="px-6 py-12 border-t border-border/50 bg-muted/30">
          <div className="max-w-4xl mx-auto">
            <PolicyTypes />
          </div>
        </section>

        {/* What You Implement */}
        <section className="px-6 py-12">
          <div className="max-w-4xl mx-auto">
            <WhatYouImplement />
          </div>
        </section>

        {/* Story Navigation */}


        <StoryNavigation className="mt-12" />



        {/* Footer */}
        <section className="px-6 py-8 border-t border-border/50">
          <div className="max-w-4xl mx-auto flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <Link
                to="/docs/access_policy_story"
                className="flex items-center gap-2 text-sm text-primary hover:underline"
              >
                <BookOpen className="h-4 w-4" />
                Read V1 (Visual Version)
              </Link>
              <Link
                to="/docs/access_policy_full"
                className="flex items-center gap-2 text-sm text-primary hover:underline"
              >
                <FileCode className="h-4 w-4" />
                Read Full Technical Guide
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <StoryLoveButton storySlug="access_policy_story_v2" />
              <PageViewCounter />
            </div>
          </div>
        </section>
      </div>
    </DocsLayout>
  );
};

export default AccessPolicyStoryV2;

