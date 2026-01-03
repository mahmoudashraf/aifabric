import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Highlight, themes } from "prism-react-renderer";
import DocsLayout from "@/components/docs/DocsLayout";
import PageViewCounter from "@/components/PageViewCounter";
import StoryLoveButton from "@/components/StoryLoveButton";
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
  Play,
  Pause,
  RotateCcw
} from "lucide-react";

const PAGE_TITLE = "Custom Access Policy: Building Fail-Closed Security Into Every Request - AI Fabric Framework";
const PAGE_DESCRIPTION = "How we built a pluggable access control system that lets you define security rules while the framework enforces them—fail closed, always secure.";

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

const SecurityProblem = () => {
  const problems = [
    { icon: XCircle, text: "Security logic scattered (20 controllers, 50+ rules)", color: "text-red-400" },
    { icon: XCircle, text: "Hard to maintain (change rule = find all places)", color: "text-red-400" },
    { icon: XCircle, text: "Easy to miss edge cases", color: "text-red-400" },
    { icon: XCircle, text: "No audit trail", color: "text-red-400" },
    { icon: XCircle, text: "Can't test security independently", color: "text-red-400" },
    { icon: XCircle, text: "Framework can't enforce your rules", color: "text-red-400" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 my-6">
      {problems.map((problem, i) => {
        const Icon = problem.icon;
        return (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            viewport={{ once: true }}
            className="flex items-center gap-3 p-4 rounded-lg bg-destructive/5 border border-destructive/30"
          >
            <Icon className={`h-5 w-5 ${problem.color}`} />
            <span className="text-sm text-muted-foreground">{problem.text}</span>
          </motion.div>
        );
      })}
    </div>
  );
};

const SolutionCard = ({ title, icon: Icon, description, code, color }: { 
  title: string; 
  icon: any; 
  description: string; 
  code: string;
  color: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="rounded-xl border border-border/50 bg-card p-6"
  >
    <div className="flex items-center gap-3 mb-4">
      <div className={`w-12 h-12 rounded-lg ${color} flex items-center justify-center`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
      <div>
        <h3 className="font-bold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
    </div>
    <CodeBlock code={code} />
  </motion.div>
);

const FlowStep = ({ step, title, description, code, icon: Icon, color }: {
  step: number;
  title: string;
  description: string;
  code?: string;
  icon: any;
  color: string;
}) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    className="relative pl-8 pb-8 border-l-2 border-border/50 last:border-l-0"
  >
    <div className={`absolute left-0 top-0 w-6 h-6 rounded-full ${color} flex items-center justify-center -translate-x-[13px]`}>
      <Icon className="h-4 w-4 text-white" />
    </div>
    <div className="mb-2">
      <span className="text-xs font-semibold text-primary">STEP {step}</span>
      <h4 className="text-lg font-bold text-foreground mt-1">{title}</h4>
      <p className="text-sm text-muted-foreground mt-1">{description}</p>
    </div>
    {code && <CodeBlock code={code} />}
  </motion.div>
);

const AccessControlFlow = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const steps = [
    {
      number: 1,
      title: "User Request",
      icon: MessageSquare,
      color: "bg-blue-500",
      description: "POST /api/chat\nBody: 'Cancel my subscription'\nUser: user-123 (Pro tier)"
    },
    {
      number: 2,
      title: "Orchestrator Entry",
      icon: Brain,
      color: "bg-purple-500",
      description: "RAGOrchestrator.orchestrate()\nReceives request with context"
    },
    {
      number: 3,
      title: "Access Control Check",
      icon: Shield,
      color: "bg-green-500",
      description: "AIAccessControlService.checkAccess()\nBuilds request with resourceId & operationType"
    },
    {
      number: 4,
      title: "Build Entity Context",
      icon: Database,
      color: "bg-orange-500",
      description: "buildEntityContext()\nCreates immutable context map"
    },
    {
      number: 5,
      title: "Call Your Policy",
      icon: Code,
      color: "bg-red-500",
      description: "EntityAccessPolicy.canUserAccessEntity()\nYOUR CODE executes here"
    },
    {
      number: 6,
      title: "Evaluate Access",
      icon: CheckCircle2,
      color: "bg-teal-500",
      description: "evaluateAccess()\nFAIL CLOSED: Exception = deny"
    },
    {
      number: 7,
      title: "Return Response",
      icon: Zap,
      color: "bg-indigo-500",
      description: "AIAccessControlResponse\nAccess decision & processing time"
    },
    {
      number: 8,
      title: "Continue or Block",
      icon: ArrowRight,
      color: "bg-pink-500",
      description: "RAGOrchestrator checks response\nIf denied → error, else continue"
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
    <div className="my-16">
      <h3 className="text-2xl font-bold text-foreground mb-8 text-center">
        Complete Access Control Flow: From Request to Decision
      </h3>
      <p className="text-sm text-muted-foreground text-center mb-6">
        Watch how every request passes through the access control system
      </p>
      
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
              Play Flow
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
      
      <div className="relative">
        <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6">
          {steps.map((step, i) => {
            const Icon = step.icon;
            const isActive = activeStep >= i;
            return (
              <div key={i} className="flex items-center gap-2 md:gap-4">
                <motion.div
                  animate={{
                    scale: activeStep === i ? 1.1 : 1,
                    opacity: isActive ? 1 : 0.4,
                  }}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                    activeStep === i
                      ? `${step.color} border-${step.color.split('-')[1]}-600 shadow-lg`
                      : 'bg-muted/30 border-border/50'
                  }`}
                  onClick={() => {
                    setActiveStep(i);
                    setIsPlaying(false);
                  }}
                  style={{ cursor: 'pointer', minWidth: '140px' }}
                >
                  <div className={`p-3 rounded-full ${step.color} ${!isActive ? 'opacity-50' : ''}`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="text-center">
                    <div className={`text-xs font-semibold mb-1 ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                      STEP {step.number}
                    </div>
                    <div className={`text-sm font-bold ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {step.title}
                    </div>
                  </div>
                </motion.div>
                {i < steps.length - 1 && (
                  <motion.div
                    animate={{ opacity: activeStep > i ? 1 : 0.3 }}
                    className="hidden md:block"
                  >
                    <ArrowRight className="h-5 w-5 text-muted-foreground" />
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>
        
        {steps[activeStep] && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 p-6 rounded-xl border border-primary/30 bg-primary/5"
          >
            <div className="flex items-center gap-3 mb-3">
              {React.createElement(steps[activeStep].icon, {
                className: `h-6 w-6 text-primary`
              })}
              <div>
                <h4 className="font-bold text-foreground">STEP {steps[activeStep].number}: {steps[activeStep].title}</h4>
                <p className="text-sm text-muted-foreground whitespace-pre-line">{steps[activeStep].description}</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

const PolicyExample = () => {
  const [activeTab, setActiveTab] = useState(0);
  
  const examples = [
    {
      title: "Tier-Based Access",
      description: "Different subscription tiers have different access levels",
      code: `@Component
public class TierBasedAccessPolicy implements EntityAccessPolicy {
    
    @Autowired
    private SubscriptionService subscriptionService;
    
    @Override
    public boolean canUserAccessEntity(String userId, 
                                       Map<String, Object> entityContext) {
        String resourceId = (String) entityContext.get("resourceId");
        String operationType = (String) entityContext.get("operationType");
        
        Subscription subscription = subscriptionService.findByUserId(userId);
        String tier = subscription != null ? subscription.getTier() : "FREE";
        
        // Intent queries: all tiers allowed
        if (resourceId.equals("rag:intent") && operationType.equals("READ")) {
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
        
        return false; // Default: deny
    }
}`
    },
    {
      title: "Role-Based Access",
      description: "Different roles have different permissions",
      code: `@Component
public class RoleBasedAccessPolicy implements EntityAccessPolicy {
    
    @Autowired
    private UserService userService;
    
    @Override
    public boolean canUserAccessEntity(String userId, 
                                       Map<String, Object> entityContext) {
        String resourceId = (String) entityContext.get("resourceId");
        String operationType = (String) entityContext.get("operationType");
        
        User user = userService.findById(userId);
        if (user == null) return false;
        
        Set<String> roles = user.getRoles();
        
        // Admin: all access
        if (roles.contains("ADMIN")) {
            return true;
        }
        
        // Intent queries: all authenticated users
        if (resourceId.equals("rag:intent") && operationType.equals("READ")) {
            return true;
        }
        
        // Action execution: role-based
        if (resourceId.startsWith("action:")) {
            String action = resourceId.substring(7);
            Set<String> requiredRoles = roleService.getRequiredRoles(action);
            return roles.stream().anyMatch(requiredRoles::contains);
        }
        
        return false; // Default: deny
    }
}`
    },
    {
      title: "Time-Based Access",
      description: "Some actions only allowed during business hours",
      code: `@Component
public class TimeBasedAccessPolicy implements EntityAccessPolicy {
    
    @Autowired
    private Clock clock;
    
    @Override
    public boolean canUserAccessEntity(String userId, 
                                       Map<String, Object> entityContext) {
        String resourceId = (String) entityContext.get("resourceId");
        String operationType = (String) entityContext.get("operationType");
        
        LocalDateTime now = LocalDateTime.now(clock);
        DayOfWeek dayOfWeek = now.getDayOfWeek();
        int hour = now.getHour();
        
        // Intent queries: always allowed
        if (resourceId.equals("rag:intent") && operationType.equals("READ")) {
            return true;
        }
        
        // Critical actions: business hours only (9 AM - 5 PM, Mon-Fri)
        if (resourceId.startsWith("action:")) {
            String action = resourceId.substring(7);
            
            if (List.of("delete_account", "export_all_data", "admin_panel")
                .contains(action)) {
                
                boolean isBusinessHours = 
                    dayOfWeek != DayOfWeek.SATURDAY &&
                    dayOfWeek != DayOfWeek.SUNDAY &&
                    hour >= 9 && hour < 17;
                
                return isBusinessHours;
            }
        }
        
        return false; // Default: deny
    }
}`
    }
  ];

  return (
    <div className="my-8">
      <div className="flex gap-2 mb-4 border-b border-border/50">
        {examples.map((example, i) => (
          <button
            key={i}
            onClick={() => setActiveTab(i)}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              activeTab === i
                ? "text-primary border-b-2 border-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {example.title}
          </button>
        ))}
      </div>
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          <p className="text-sm text-muted-foreground mb-4">{examples[activeTab].description}</p>
          <CodeBlock code={examples[activeTab].code} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const AccessPolicyStory = () => {
  useEffect(() => {
    document.title = PAGE_TITLE;

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
    updateMeta('meta[property="og:type"]', "content", "article");
    updateMeta('meta[property="og:url"]', "content", window.location.href);

    updateMeta('meta[name="twitter:title"]', "content", PAGE_TITLE);
    updateMeta('meta[name="twitter:description"]', "content", PAGE_DESCRIPTION);
    updateMeta('meta[name="twitter:card"]', "content", "summary_large_image");

    updateCanonical(window.location.href);
  }, []);

  return (
    <DocsLayout>
      <div className="min-h-screen">
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-border/50">
          <div className="absolute inset-0 bg-gradient-glow opacity-50" />
          <div className="px-6 py-16 relative">
            <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                  <span className="text-2xl">🛡️</span>
                  Access Policy V1
                </span>
                <Link 
                  to="/docs/access_policy_story_v2"
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  View V2 (Narrative) →
                </Link>
              </div>
              <div className="flex items-center gap-3">
                <StoryLoveButton storySlug="access_policy_story" />
                <PageViewCounter />
              </div>
            </div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl"
            >
              <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
                Custom Access Policy:{" "}
                <span className="text-gradient">Fail-Closed Security</span>{" "}
                Into Every Request
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mb-8">
                How we built a pluggable access control system that lets you define security rules 
                while the framework enforces them—fail closed, always secure.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2 text-sm text-accent">
                  <Shield className="h-4 w-4" />
                  Fail Closed
                </div>
                <div className="flex items-center gap-2 rounded-full bg-secondary/10 px-4 py-2 text-sm text-secondary">
                  <Lock className="h-4 w-4" />
                  Centralized Security
                </div>
                <div className="flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm text-primary">
                  <Zap className="h-4 w-4" />
                  Production-Tested
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* The Problem */}
        <section className="px-6 py-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl"
          >
            <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-8 mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-3">
                <AlertTriangle className="h-6 w-6 text-destructive" />
                The Security Nightmare: Hardcoded Rules Everywhere
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Customer support chat. Users need different access levels:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-6">
                <li>Free tier: Can view profile, update email</li>
                <li>Pro tier: Can cancel subscription, export data</li>
                <li>Enterprise: Can delete account, export all data</li>
                <li>Admins: Can do everything</li>
              </ul>
              
              <CodeBlock code={`@PostMapping("/api/chat")
public OrchestrationResult chat(@RequestBody String query,
                                 @AuthenticationPrincipal User user) {
    // Security checks scattered everywhere
    if (user.getRole().equals("ADMIN")) {
        return orchestrator.orchestrate(query, context);
    }
    
    if (query.contains("cancel") && !user.getTier().equals("PRO")) {
        return OrchestrationResult.error("Upgrade to Pro to cancel");
    }
    
    if (query.contains("export") && user.getTier().equals("FREE")) {
        return OrchestrationResult.error("Upgrade to Pro for exports");
    }
    
    if (query.contains("delete") && !user.getRole().equals("ADMIN")) {
        return OrchestrationResult.error("Only admins can delete");
    }
    
    // ... 50 more hardcoded rules across 20 controllers ...
    
    return orchestrator.orchestrate(query, context);
}`} />
              
              <p className="text-foreground font-medium mt-6">
                <strong>Every security breach starts with "we thought we checked that..."</strong>
              </p>
            </div>

            <h3 className="text-xl font-bold text-foreground mb-4">Problems:</h3>
            <SecurityProblem />
          </motion.div>
        </section>

        {/* The Solution */}
        <section className="px-6 py-12 border-t border-border/50 bg-muted/30">
          <div className="max-w-4xl">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-3">
                <Shield className="h-6 w-6 text-primary" />
                Our Solution: Pluggable Policy Pattern
              </h2>
              <p className="text-muted-foreground mb-8">
                Framework provides infrastructure. You define rules. Framework enforces them everywhere.
              </p>
            </motion.div>

            <SolutionCard
              title="The Interface"
              icon={Code}
              description="One simple interface. You implement. Framework enforces."
              color="bg-primary"
              code={`@FunctionalInterface
public interface EntityAccessPolicy {
    
    /**
     * Determine if user can access entity
     * @param userId User identifier
     * @param entity Immutable entity context (resourceId, operationType, etc.)
     * @return true if access granted, false otherwise
     */
    boolean canUserAccessEntity(String userId, Map<String, Object> entity);
    
    /**
     * Optional: Log denied access (audit trail)
     * Default: no-op (you can override)
     */
    default void logAccessDenied(String userId, 
                                 Map<String, Object> entity, 
                                 String reason) {
        // Intentionally blank - override for audit logging
    }
}`}
            />

            <SolutionCard
              title="Your Implementation"
              icon={Settings}
              description="Define your business rules in one place."
              color="bg-secondary"
              code={`@Component
public class MyAccessPolicy implements EntityAccessPolicy {
    
    @Autowired
    private UserService userService;
    
    @Autowired
    private PermissionService permissionService;
    
    @Override
    public boolean canUserAccessEntity(String userId, 
                                       Map<String, Object> entityContext) {
        String resourceId = (String) entityContext.get("resourceId");
        String operationType = (String) entityContext.get("operationType");
        
        // YOUR business rules
        if (resourceId.equals("rag:intent") && operationType.equals("READ")) {
            // Everyone can read intents
            return true;
        }
        
        if (resourceId.startsWith("action:") && operationType.equals("EXECUTE")) {
            String action = resourceId.substring(7); // "action:cancel_subscription"
            
            // Check if user can perform this action
            return permissionService.canPerformAction(userId, action);
        }
        
        // Default: deny
        return false;
    }
    
    @Override
    public void logAccessDenied(String userId, 
                                Map<String, Object> entity, 
                                String reason) {
        // YOUR audit logging
        auditService.logDeniedAccess(userId, entity, reason);
        securityAlert.sendAlert(userId, entity, reason);
    }
}`}
            />

            <SolutionCard
              title="Framework Enforcement"
              icon={Shield}
              description="Framework enforces your policy on every request. No way to bypass."
              color="bg-accent"
              code={`public AIAccessControlResponse checkAccess(AIAccessControlRequest request) {
    long started = System.nanoTime();
    Objects.requireNonNull(request, "access request must not be null");
    
    EntityAccessPolicy policy = requirePolicy();
    String userId = extractUserId(request);
    
    Map<String, Object> entityContext = buildEntityContext(request);
    
    // Call YOUR policy
    Decision decision = evaluateAccess(policy, userId, entityContext);
    if (!decision.granted()) {
        logDenied(policy, userId, entityContext);
    }
    
    long durationMs = Duration.ofNanos(System.nanoTime() - started).toMillis();
    return AIAccessControlResponse.builder()
        .accessGranted(decision.granted())
        .accessDecision(decision.granted() ? "GRANT" : "DENY")
        .processingTimeMs(durationMs)
        .build();
}`}
            />
          </div>
        </section>

        {/* Visual Flow Diagram */}
        <section className="px-6 py-12 border-t border-border/50 bg-muted/30">
          <div className="max-w-4xl mx-auto">
            <AccessControlFlow />
          </div>
        </section>

        {/* The Flow */}
        <section className="px-6 py-12">
          <div className="max-w-4xl">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-bold text-foreground mb-8 flex items-center gap-3">
                <ArrowRight className="h-6 w-6 text-primary" />
                The Complete Technical Flow
              </h2>
            </motion.div>

            <div className="space-y-6">
              <FlowStep
                step={1}
                title="User Request"
                description="POST /api/chat - Body: 'Cancel my subscription' - User: user-123 (Pro tier)"
                icon={MessageSquare}
                color="bg-blue-500"
              />
              <FlowStep
                step={2}
                title="Orchestrator Entry"
                description="RAGOrchestrator.orchestrate() receives the request with context"
                icon={Brain}
                color="bg-purple-500"
              />
              <FlowStep
                step={3}
                title="Access Control Check"
                description="AIAccessControlService.checkAccess() builds request with resourceId and operationType"
                icon={Shield}
                color="bg-green-500"
                code={`Request: {
  requestId: "req-abc",
  userId: "user-123",
  resourceId: "rag:intent",
  operationType: "READ",
  context: "Cancel my subscription",
  metadata: {tier: "PRO", ip: "192.168.1.1"}
}`}
              />
              <FlowStep
                step={4}
                title="Build Entity Context"
                description="buildEntityContext() creates immutable context map with all relevant information"
                icon={Database}
                color="bg-orange-500"
                code={`entityContext: {
  resourceId: "rag:intent",
  operationType: "READ",
  timestamp: "2025-01-02T10:30:00",
  context: "Cancel my subscription",
  metadata: {tier: "PRO", ip: "192.168.1.1"},
  userAttributes: {tier: "PRO", role: "USER"}
}`}
              />
              <FlowStep
                step={5}
                title="Call Your Policy"
                description="EntityAccessPolicy.canUserAccessEntity() - YOUR CODE executes here"
                icon={Code}
                color="bg-red-500"
                code={`YOUR CODE:
{
  String resourceId = entityContext.get("resourceId");
  String operationType = entityContext.get("operationType");
  
  // Intent queries: all authenticated users allowed
  if (resourceId.equals("rag:intent") && 
      operationType.equals("READ")) {
    return true;
  }
  
  // Action execution: check permissions
  if (resourceId.startsWith("action:")) {
    String action = resourceId.substring(7);
    return permissionService.canPerformAction(userId, action);
  }
  
  // Default: deny
  return false;
}

Result: true (user-123 can read intents)`}
              />
              <FlowStep
                step={6}
                title="Evaluate Access"
                description="evaluateAccess() handles exceptions - FAIL CLOSED: Exception = deny access"
                icon={CheckCircle2}
                color="bg-teal-500"
                code={`try {
  boolean granted = policy.canUserAccessEntity(userId, entityContext);
  return new Decision(granted, false, null);
} catch (Exception ex) {
  // FAIL CLOSED: If policy throws exception, deny access
  log.warn("Policy exception: {}", ex.getMessage());
  return new Decision(false, true, ex.getMessage());
}

Result: Decision(granted=true, hookFailed=false)`}
              />
              <FlowStep
                step={7}
                title="Return Response"
                description="AIAccessControlResponse with access decision and processing time"
                icon={Zap}
                color="bg-indigo-500"
                code={`{
  requestId: "req-abc",
  userId: "user-123",
  resourceId: "rag:intent",
  operationType: "READ",
  accessGranted: true,
  accessDecision: "GRANT",
  processingTimeMs: 5,
  timestamp: "2025-01-02T10:30:00",
  success: true,
  errorMessage: null
}`}
              />
              <FlowStep
                step={8}
                title="Continue or Block"
                description="RAGOrchestrator checks response - if denied, returns error. Otherwise continues."
                icon={ArrowRight}
                color="bg-pink-500"
                code={`if (!Boolean.TRUE.equals(accessResponse.getAccessGranted())) {
  return OrchestrationResult.error("Access denied by policy.");
}

// Access granted - continue with intent extraction
MultiIntentResponse intents = intentQueryExtractor
  .extract(processedQuery, context);

// ... continue orchestration ...`}
              />
            </div>
          </div>
        </section>

        {/* Fail Closed */}
        <section className="px-6 py-12 border-t border-border/50 bg-muted/30">
          <div className="max-w-4xl">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-3">
                <Ban className="h-6 w-6 text-destructive" />
                Fail Closed Security Model (Critical)
              </h2>
              <p className="text-muted-foreground mb-6">
                <strong className="text-foreground">Key principle:</strong> If your policy throws an exception, framework denies access.
              </p>
              
              <CodeBlock code={`private Decision evaluateAccess(EntityAccessPolicy policy, 
                                String userId, 
                                Map<String, Object> entityContext) {
    try {
        boolean granted = policy.canUserAccessEntity(userId, entityContext);
        return new Decision(granted, false, null);
    } catch (Exception ex) {
        // FAIL CLOSED: If policy throws exception, deny access
        log.warn("EntityAccessPolicy threw an exception for user {}: {}", 
                 userId, ex.getMessage());
        return new Decision(false, true, ex.getMessage());
    }
}`} />

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-lg border border-accent/30 bg-accent/5 p-4">
                  <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-accent" />
                    Why fail closed?
                  </h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>✅ Better to deny legitimate request than allow unauthorized access</li>
                    <li>✅ Prevents security holes from policy bugs</li>
                    <li>✅ Forces you to handle edge cases</li>
                    <li>✅ Production-safe default</li>
                  </ul>
                </div>
                <div className="rounded-lg border border-primary/30 bg-primary/5 p-4">
                  <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <Shield className="h-5 w-5 text-primary" />
                    Your policy must be:
                  </h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>✅ Thread-safe (multiple requests concurrently)</li>
                    <li>✅ Fast (&lt; 100ms ideally, &lt; 500ms max)</li>
                    <li>✅ Never throw exceptions (or handle gracefully)</li>
                    <li>✅ Idempotent (same input = same output)</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Real-World Examples */}
        <section className="px-6 py-12">
          <div className="max-w-4xl">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-bold text-foreground mb-8 flex items-center gap-3">
                <Users className="h-6 w-6 text-primary" />
                Real-World Examples
              </h2>
              <PolicyExample />
            </motion.div>
          </div>
        </section>

        {/* The Bottom Line */}
        <section className="px-6 py-12 border-t border-border/50 bg-muted/30">
          <div className="max-w-4xl">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="rounded-2xl border border-primary/30 bg-primary/5 p-8"
            >
              <h2 className="text-2xl font-bold text-foreground mb-6">
                The Bottom Line
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="font-semibold text-foreground mb-3">What you get:</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-primary" />
                      Centralized security logic (one policy, enforced everywhere)
                    </li>
                    <li className="flex items-center gap-2">
                      <Ban className="h-4 w-4 text-destructive" />
                      Fail closed model (exception = deny access)
                    </li>
                    <li className="flex items-center gap-2">
                      <Eye className="h-4 w-4 text-accent" />
                      Audit trail (logAccessDenied callback)
                    </li>
                    <li className="flex items-center gap-2">
                      <Settings className="h-4 w-4 text-secondary" />
                      Flexible rules (any logic you need)
                    </li>
                    <li className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-primary" />
                      Fast (&lt; 100ms typical)
                    </li>
                    <li className="flex items-center gap-2">
                      <Code className="h-4 w-4 text-accent" />
                      Testable (test policy independently)
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-3">What you implement:</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-accent" />
                      One interface (EntityAccessPolicy)
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-accent" />
                      One method (canUserAccessEntity)
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-accent" />
                      Optional method (logAccessDenied)
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-accent" />
                      Your business rules
                    </li>
                  </ul>
                </div>
              </div>
              <div className="rounded-lg bg-gradient-primary p-6 text-center">
                <p className="text-primary-foreground font-semibold text-lg">
                  Result: Security logic in one place. Framework enforces everywhere. Fail closed. Always secure. Production-ready.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <section className="px-6 py-8 border-t border-border/50">
          <div className="max-w-4xl flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <Link
                to="/docs/access_policy_story_v2"
                className="flex items-center gap-2 text-sm text-primary hover:underline"
              >
                <BookOpen className="h-4 w-4" />
                Read V2 (Narrative Version)
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
              <StoryLoveButton storySlug="access_policy_story" />
              <PageViewCounter />
            </div>
          </div>
        </section>
      </div>
    </DocsLayout>
  );
};

export default AccessPolicyStory;

