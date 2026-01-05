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
  RotateCcw,
  Layers,
  Filter,
  Gavel,
  Target,
  Activity,
  TrendingUp,
  Lightbulb,
  Rocket,
  Cpu,
  FileCheck,
  Plug
} from "lucide-react";

const PAGE_TITLE = "Access Control Mechanics: Four Layers of Defense - AI Fabric Framework";
const PAGE_DESCRIPTION = "How multi-layered access control ensures defense-in-depth security across the AI Infrastructure Framework—fail-closed, always secure.";
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

const FourLayersFlow = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const steps = [
    {
      layer: 1,
      title: "Orchestrator Level",
      icon: Shield,
      color: "bg-blue-500",
      description: "Framework entry point - blocks unauthorized users before any processing",
      code: `RAGOrchestrator.orchestrate()
  └─→ AIAccessControlService.checkAccess()
      └─→ EntityAccessPolicy.canUserAccessEntity()
          └─→ YOUR CODE: "Can user use RAG orchestrator?"
          
Result: ✅ GRANTED or ❌ DENIED (fail-closed)`
    },
    {
      layer: 2,
      title: "Action Handler Level",
      icon: Target,
      color: "bg-purple-500",
      description: "Action-specific check - validates user can execute this action",
      code: `ActionHandler.validateActionAllowed(userId)
  └─→ YOUR CODE: "Can user execute relationship_query?"
  
ActionHandler.executeAction()
  └─→ Additional filtering (e.g., entity types)
  
Result: ✅ Action allowed or ❌ Action denied`
    },
    {
      layer: 3,
      title: "Entity Type Level",
      icon: Filter,
      color: "bg-orange-500",
      description: "Filters entity types before query planning - saves LLM tokens",
      code: `filterAllowedEntityTypes(userId, requestedTypes)
  └─→ For each entityType:
      - Check role-based access
      - Check permission-based access
      - Check tenant-based access
      - Check data classification
      
Filtered: [customer, order] (product denied)
Only allowed schemas sent to LLM`
    },
    {
      layer: 4,
      title: "Result Level",
      icon: Eye,
      color: "bg-green-500",
      description: "Final defense-in-depth check on individual results",
      code: `After query execution:
  └─→ For each result document:
      EntityAccessPolicy.canUserAccessEntity(userId, doc)
      └─→ YOUR CODE: "Can user access this specific entity?"
      
Result: Only accessible entities returned
Final safety net for row-level security`
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

  return (
    <div className="my-16">
      <h3 className="text-2xl font-bold text-foreground mb-8 text-center">
        Four Layers of Defense: Defense in Depth Security
      </h3>
      <p className="text-sm text-muted-foreground text-center mb-6">
        Watch how every request passes through four layers of security checks
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
        <div className="flex flex-col md:flex-row justify-center items-center gap-4 mb-8">
          {steps.map((step, i) => {
            const Icon = step.icon;
            const isActive = activeStep >= i;
            return (
              <div key={i} className="flex items-center gap-3">
                <motion.div
                  animate={{
                    scale: activeStep === i ? 1.1 : 1,
                    opacity: isActive ? 1 : 0.4,
                  }}
                  onClick={() => {
                    setActiveStep(i);
                    setIsPlaying(false);
                  }}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-all ${
                    activeStep === i
                      ? `${step.color} border-${step.color.split('-')[1]}-600 shadow-lg`
                      : 'bg-muted/30 border-border/50'
                  }`}
                  style={{ minWidth: '160px' }}
                >
                  <div className={`p-3 rounded-full ${step.color} ${!isActive ? 'opacity-50' : ''}`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="text-center">
                    <div className={`text-xs font-semibold mb-1 ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                      LAYER {step.layer}
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
            className="p-6 rounded-xl border border-primary/30 bg-primary/5"
          >
            <div className="flex items-center gap-3 mb-3">
              {React.createElement(steps[activeStep].icon, {
                className: `h-6 w-6 text-primary`
              })}
              <div>
                <h4 className="font-bold text-foreground">LAYER {steps[activeStep].layer}: {steps[activeStep].title}</h4>
                <p className="text-sm text-muted-foreground">{steps[activeStep].description}</p>
              </div>
            </div>
            <CodeBlock code={steps[activeStep].code} />
          </motion.div>
        )}
      </div>
      
      {activeStep >= steps.length - 1 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-6 p-6 rounded-xl bg-green-500/10 border border-green-500/30 text-center"
        >
          <Shield className="h-8 w-8 text-green-400 mx-auto mb-3" />
          <p className="text-lg font-bold text-green-400 mb-2">Defense in Depth Complete</p>
          <p className="text-sm text-muted-foreground">
            Four layers of security ensure no unauthorized access. Even if one layer fails, others provide protection.
          </p>
        </motion.div>
      )}
    </div>
  );
};

const CompleteAccessControlFlow = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const steps = [
    {
      time: "User Query",
      title: "User Initiates Request",
      icon: MessageSquare,
      color: "text-blue-400",
      bgColor: "bg-blue-500/5",
      borderColor: "border-blue-500/30",
      description: "A user sends a query to the AI system, e.g., 'Find premium customers who ordered Nike products'",
      code: `POST /api/chat
Body: 'Find premium customers who ordered Nike products'
User: user-123 (Role: ANALYST)
Requested entity types: [customer, order, product, brand]`
    },
    {
      time: "Layer 1: Orchestrator",
      title: "Framework Entry Point Check",
      icon: Shield,
      color: "text-purple-400",
      bgColor: "bg-purple-500/5",
      borderColor: "border-purple-500/30",
      description: "RAGOrchestrator intercepts and checks if user can use the orchestrator at all.",
      code: `RAGOrchestrator.orchestrate()
  └─→ AIAccessControlService.checkAccess()
      └─→ EntityAccessPolicy.canUserAccessEntity()
          resourceId: "rag:intent"
          operationType: "READ"
          
Result: ✅ GRANTED (user can use RAG)`
    },
    {
      time: "Intent Extraction",
      title: "LLM Extracts Intent",
      icon: Brain,
      color: "text-orange-400",
      bgColor: "bg-orange-500/5",
      borderColor: "border-orange-500/30",
      description: "IntentQueryExtractor identifies this as a relationship_query action.",
      code: `Intent extracted:
{
  action: "relationship_query",
  actionParams: {
    query: "Find premium customers...",
    entityTypes: [customer, order, product, brand]
  }
}`
    },
    {
      time: "Layer 2: Action Handler",
      title: "Action-Level Validation",
      icon: Target,
      color: "text-red-400",
      bgColor: "bg-red-500/5",
      borderColor: "border-red-500/30",
      description: "ActionHandler validates user can execute relationship queries.",
      code: `RelationshipQueryActionHandler.validateActionAllowed(userId)
  └─→ YOUR CODE: permissionService.hasPermission(userId, "relationship_query:execute")
  
Result: ✅ ALLOWED (user has permission)`
    },
    {
      time: "Layer 3: Entity Type",
      title: "Entity Type Filtering",
      icon: Filter,
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/5",
      borderColor: "border-yellow-500/30",
      description: "Filters which entity types user can query before expensive LLM planning.",
      code: `filterAllowedEntityTypes(userId, [customer, order, product, brand])
  └─→ For each entityType:
      canUserQueryEntityType(userId, entityType)
      
Results:
  customer: ✅ ALLOWED (ANALYST can access)
  order: ✅ ALLOWED (ANALYST can access)
  product: ❌ DENIED (ANALYST cannot access)
  brand: ❌ DENIED (ANALYST cannot access)
  
Filtered: [customer, order]`
    },
    {
      time: "Schema Filtering",
      title: "Only Allowed Schemas Sent to LLM",
      icon: Database,
      color: "text-cyan-400",
      bgColor: "bg-cyan-500/5",
      borderColor: "border-cyan-500/30",
      description: "LLM only receives schemas for allowed entity types. Token optimization.",
      code: `ReliableRelationshipQueryService.execute()
  └─→ RelationshipSchemaProvider.getSchemaDescription()
      └─→ Only includes [customer, order] in schema
          (product and brand schemas excluded)
          
LLM Prompt:
  Entity: customer (Class: Customer) ...
  Entity: order (Class: Order) ...
  (product and brand NOT included)`
    },
    {
      time: "Query Execution",
      title: "Query Executes with Filtered Types",
      icon: Zap,
      color: "text-green-400",
      bgColor: "bg-green-500/5",
      borderColor: "border-green-500/30",
      description: "Query executes successfully, but only queries allowed entity types.",
      code: `Query executed:
  - Only queries customer and order entities
  - Product and brand never queried
  - Results: [Customer entities matching criteria]`
    },
    {
      time: "Layer 4: Result",
      title: "Entity-Level Result Filtering",
      icon: Eye,
      color: "text-indigo-400",
      bgColor: "bg-indigo-500/5",
      borderColor: "border-indigo-500/30",
      description: "Final defense-in-depth check on each result entity.",
      code: `For each result document:
  EntityAccessPolicy.canUserAccessEntity(userId, document)
  └─→ YOUR CODE: Check individual entity access
      - Multi-tenant check
      - Row-level security
      - Data ownership
      
Filtered: Only accessible entities returned`
    },
    {
      time: "Results Returned",
      title: "Secure Results Delivered",
      icon: CheckCircle2,
      color: "text-lime-400",
      bgColor: "bg-lime-500/5",
      borderColor: "border-lime-500/30",
      description: "User receives only entities they can access, with full audit trail.",
      code: `RAGResponse {
  documents: [accessible Customer entities only],
  totalResults: 5,
  processingTimeMs: 450,
  accessControlLayers: [1, 2, 3, 4],
  auditTrail: [all access checks logged]
}`
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

  return (
    <div className="my-16">
      <h3 className="text-2xl font-bold text-foreground mb-8 text-center">
        Complete Access Control Flow: From Request to Secure Results
      </h3>
      <p className="text-sm text-muted-foreground text-center mb-8">
        Every request passes through four layers of security, ensuring defense in depth.
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
                <span className={`text-xs ${activeStep === i ? 'text-foreground' : ''}`}>{step.time.split(':')[0]}</span>
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
            <p className="text-sm text-muted-foreground">{steps[activeStep].description}</p>
            {steps[activeStep].code && <CodeBlock code={steps[activeStep].code} />}
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
          <p className="text-lg font-bold text-green-400 mb-2">Access Control Complete: Secure Results Delivered</p>
          <p className="text-sm text-muted-foreground">
            Four layers of security ensured only authorized data was accessed and returned.
          </p>
        </motion.div>
      )}
    </div>
  );
};

const FailClosedSecurity = () => {
  const scenarios = [
    {
      scenario: "Policy Returns False",
      icon: XCircle,
      color: "text-red-400",
      result: "❌ DENY",
      code: `@Override
public boolean canUserAccessEntity(String userId, Map<String, Object> entity) {
    return false;  // Explicit deny
}

Result: Access DENIED`
    },
    {
      scenario: "Policy Throws Exception",
      icon: AlertTriangle,
      color: "text-orange-400",
      result: "❌ DENY (Fail-Closed)",
      code: `@Override
public boolean canUserAccessEntity(String userId, Map<String, Object> entity) {
    throw new RuntimeException("Database error!");
}

Framework catches exception:
  └─→ Logs warning
  └─→ Returns DENY (fail-closed)
  
Result: Access DENIED (even on exception)`
    },
    {
      scenario: "Policy Returns True",
      icon: CheckCircle2,
      color: "text-green-400",
      result: "✅ GRANT",
      code: `@Override
public boolean canUserAccessEntity(String userId, Map<String, Object> entity) {
    return true;  // Explicit grant
}

Result: Access GRANTED`
    },
    {
      scenario: "No Policy Bean",
      icon: Ban,
      color: "text-red-600",
      result: "❌ EXCEPTION",
      code: `// No EntityAccessPolicy bean found

Framework throws:
  IllegalStateException: 
    "No EntityAccessPolicy bean available. 
     Register a bean implementing EntityAccessPolicy."

Result: Application fails to start (forces implementation)`
    }
  ];

  return (
    <div className="my-16">
      <h3 className="text-2xl font-bold text-foreground mb-8 text-center">
        Fail-Closed Security: When in Doubt, Deny
      </h3>
      <p className="text-sm text-muted-foreground text-center mb-6">
        The framework implements fail-closed security—better to deny legitimate requests than allow unauthorized access.
      </p>
      
      <div className="grid md:grid-cols-2 gap-4">
        {scenarios.map((scenario, i) => {
          const Icon = scenario.icon;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`p-6 rounded-xl border-2 ${scenario.color.replace('text-', 'border-')}/30 bg-${scenario.color.split('-')[1]}-500/5`}
            >
              <div className="flex items-center gap-3 mb-4">
                <Icon className={`h-6 w-6 ${scenario.color}`} />
                <div>
                  <h4 className="font-bold text-foreground">{scenario.scenario}</h4>
                  <p className={`text-sm font-semibold ${scenario.color}`}>{scenario.result}</p>
                </div>
              </div>
              <CodeBlock code={scenario.code} />
            </motion.div>
          );
        })}
      </div>
      
      <div className="mt-6 p-6 rounded-xl bg-red-500/10 border border-red-500/30">
        <div className="flex items-center gap-3 mb-3">
          <Ban className="h-6 w-6 text-red-400" />
          <h4 className="font-bold text-foreground">Fail-Closed Principle</h4>
        </div>
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>✅ If policy throws exception → <strong className="text-red-400">DENY</strong></li>
          <li>✅ If policy returns false → <strong className="text-red-400">DENY</strong></li>
          <li>✅ If policy not provided → <strong className="text-red-400">Exception</strong> (forces implementation)</li>
          <li>✅ If action validation fails → <strong className="text-red-400">DENY</strong></li>
          <li>✅ Better to deny legitimate request than allow unauthorized access</li>
        </ul>
      </div>
    </div>
  );
};

const ImplementationPatterns = () => {
  const [activePattern, setActivePattern] = useState(0);
  
  const patterns = [
    {
      name: "Role-Based",
      icon: Users,
      color: "bg-blue-500",
      description: "Different user roles have different access levels",
      code: `@Component
public class RoleBasedAccessPolicy implements EntityAccessPolicy {
    
    @Override
    public boolean canUserAccessEntity(String userId, Map<String, Object> entity) {
        User user = userService.getUser(userId);
        
        // Admin: all access
        if (user.getRole().equals("ADMIN")) {
            return true;
        }
        
        // Analyst: read only
        if (user.getRole().equals("ANALYST")) {
            return "READ".equals(entity.get("operationType"));
        }
        
        // User: limited access
        return canRegularUserAccess(entity);
    }
}`
    },
    {
      name: "Permission-Based",
      icon: Key,
      color: "bg-purple-500",
      description: "Fine-grained permissions for specific resources",
      code: `@Component
public class PermissionBasedAccessPolicy implements EntityAccessPolicy {
    
    @Override
    public boolean canUserAccessEntity(String userId, Map<String, Object> entity) {
        String resourceId = (String) entity.get("resourceId");
        String operationType = (String) entity.get("operationType");
        
        // Build permission: "rag:customer:read"
        String permission = "rag:" + extractEntityType(resourceId) + 
                           ":" + operationType.toLowerCase();
        
        return permissionService.hasPermission(userId, permission);
    }
}`
    },
    {
      name: "Tenant-Based",
      icon: Layers,
      color: "bg-orange-500",
      description: "Multi-tenant isolation - users can only access their tenant's data",
      code: `@Component
public class TenantBasedAccessPolicy implements EntityAccessPolicy {
    
    @Override
    public boolean canUserAccessEntity(String userId, Map<String, Object> entity) {
        String userTenant = tenantService.getTenantId(userId);
        String entityTenant = getEntityTenant(entity);
        
        // Tenant isolation: must match
        return userTenant.equals(entityTenant);
    }
}`
    },
    {
      name: "Classification-Based",
      icon: Gavel,
      color: "bg-green-500",
      description: "Data classification determines access requirements",
      code: `@Component
public class ClassificationBasedAccessPolicy implements EntityAccessPolicy {
    
    @Override
    public boolean canUserAccessEntity(String userId, Map<String, Object> entity) {
        EntityClassification classification = 
            classificationService.getClassification(entity);
        
        switch (classification) {
            case PUBLIC: return true;
            case INTERNAL: return userId != null;
            case SENSITIVE: 
                return permissionService.hasPermission(userId, "rag:sensitive:read");
            case RESTRICTED: 
                return permissionService.hasRole(userId, "ADMIN");
        }
    }
}`
    },
    {
      name: "Hybrid (Recommended)",
      icon: Shield,
      color: "bg-red-500",
      description: "Combine multiple strategies for comprehensive security",
      code: `@Component
public class HybridAccessPolicy implements EntityAccessPolicy {
    
    @Override
    public boolean canUserAccessEntity(String userId, Map<String, Object> entity) {
        // Step 1: Role check (admins bypass)
        if (roleService.hasRole(userId, "ADMIN")) {
            return true;
        }
        
        // Step 2: Classification check
        if (classification == RESTRICTED) {
            return false;
        }
        
        // Step 3: Tenant isolation
        if (!tenantMatches(userId, entity)) {
            return false;
        }
        
        // Step 4: Permission check
        return permissionService.hasPermission(userId, buildPermission(entity));
    }
}`
    }
  ];

  return (
    <div className="my-16">
      <h3 className="text-2xl font-bold text-foreground mb-8 text-center">
        Implementation Patterns: Choose Your Security Strategy
      </h3>
      <p className="text-sm text-muted-foreground text-center mb-6">
        Five proven patterns for implementing access control in your application
      </p>
      
      <div className="grid grid-cols-5 gap-2 mb-6">
        {patterns.map((pattern, i) => {
          const Icon = pattern.icon;
          return (
            <button
              key={i}
              onClick={() => setActivePattern(i)}
              className={`p-3 rounded-lg border-2 transition-all ${
                activePattern === i
                  ? `${pattern.color.replace('bg-', 'border-')} bg-${pattern.color.split('-')[1]}-500/10 shadow-lg`
                  : "border-border/30 bg-muted/30 hover:border-border"
              }`}
            >
              <Icon className={`h-5 w-5 mx-auto mb-1 ${activePattern === i ? pattern.color.replace('bg-', 'text-') : 'text-muted-foreground'}`} />
              <p className={`text-xs font-semibold text-center ${activePattern === i ? 'text-foreground' : 'text-muted-foreground'}`}>
                {pattern.name}
              </p>
            </button>
          );
        })}
      </div>
      
      <AnimatePresence mode="wait">
        <motion.div
          key={activePattern}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`p-6 rounded-xl border-2 border-${patterns[activePattern].color.split('-')[1]}-500/30 bg-${patterns[activePattern].color.split('-')[1]}-500/5`}
        >
          <div className="flex items-center gap-3 mb-4">
            {React.createElement(patterns[activePattern].icon, {
              className: `h-6 w-6 ${patterns[activePattern].color.replace('bg-', 'text-')}`
            })}
            <div>
              <h4 className="font-bold text-foreground">Pattern: {patterns[activePattern].name}</h4>
              <p className="text-sm text-muted-foreground">{patterns[activePattern].description}</p>
            </div>
          </div>
          <CodeBlock code={patterns[activePattern].code} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const SPIPattern = () => {
  return (
    <div className="my-16">
      <h3 className="text-2xl font-bold text-foreground mb-8 text-center">
        SPI Pattern: Framework Defines, You Implement
      </h3>
      
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-xl border border-primary/30 bg-primary/5">
          <div className="flex items-center gap-3 mb-4">
            <Plug className="h-6 w-6 text-primary" />
            <h4 className="font-bold text-foreground">Framework Defines Interface</h4>
          </div>
          <CodeBlock code={`// Framework provides interface
@FunctionalInterface
public interface EntityAccessPolicy {
    boolean canUserAccessEntity(String userId, Map<String, Object> entity);
    default void logAccessDenied(...) { }
}

// Framework uses your implementation
public class AIAccessControlService {
    private final EntityAccessPolicy policy;
    
    public AIAccessControlResponse checkAccess(...) {
        // Calls YOUR implementation
        boolean granted = policy.canUserAccessEntity(userId, entityContext);
        return buildResponse(granted);
    }
}`} />
        </div>
        
        <div className="p-6 rounded-xl border border-secondary/30 bg-secondary/5">
          <div className="flex items-center gap-3 mb-4">
            <Code className="h-6 w-6 text-secondary" />
            <h4 className="font-bold text-foreground">You Implement Business Logic</h4>
          </div>
          <CodeBlock code={`// You implement interface
@Component
public class MyEntityAccessPolicy implements EntityAccessPolicy {
    
    @Override
    public boolean canUserAccessEntity(String userId, Map<String, Object> entity) {
        // YOUR business logic
        return permissionService.hasPermission(userId, "rag:query");
    }
}

// Framework automatically discovers and uses it
// No configuration needed!
// No circular dependencies!`} />
        </div>
      </div>
      
      <div className="mt-6 p-6 rounded-xl bg-gradient-primary text-center">
        <p className="text-primary-foreground font-semibold text-lg">
          Framework provides infrastructure. You define rules. Framework enforces them everywhere.
        </p>
      </div>
    </div>
  );
};

const AccessControlMechanicsStory = () => {
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
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-border/50">
          <div className="absolute inset-0 bg-gradient-glow opacity-50" />
          <div className="px-6 py-16 relative">
            <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
              <div className="flex items-center gap-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-medium text-primary">
                  <span className="text-2xl">🛡️</span>
                  Access Control Mechanics V1
                </span>
                <Link
                  to="/docs/access_control_mechanics_v2"
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  View V2 (Narrative) →
                </Link>
              </div>
              <div className="flex items-center gap-3">
                <StoryLoveButton storySlug="access_control_mechanics_story" />
                <PageViewCounter />
              </div>
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl"
            >
              <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
                Access Control Mechanics:{" "}
                <span className="text-gradient">Four Layers of Defense</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mb-8">
                How multi-layered access control ensures defense-in-depth security across the AI Infrastructure Framework—fail-closed, always secure.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2 text-sm text-accent">
                  <Shield className="h-4 w-4" />
                  Defense in Depth
                </div>
                <div className="flex items-center gap-2 rounded-full bg-secondary/10 px-4 py-2 text-sm text-secondary">
                  <Ban className="h-4 w-4" />
                  Fail-Closed
                </div>
                <div className="flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm text-primary">
                  <Plug className="h-4 w-4" />
                  SPI Pattern
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
                The Security Nightmare: Single Point of Failure
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Traditional access control: One check, one failure point. If it fails, everything fails.
              </p>
              
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30">
                  <h3 className="font-semibold text-foreground mb-2">The Problem:</h3>
                  <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
                    <li>Single access check at entry point</li>
                    <li>If check is bypassed, entire system is compromised</li>
                    <li>No defense in depth</li>
                    <li>Hard to audit (one check, one log entry)</li>
                    <li>No granular control (all-or-nothing)</li>
                  </ul>
                </div>
                
                <CodeBlock code={`// Traditional approach: One check
@PostMapping("/api/query")
public Result query(@RequestBody String query, @AuthenticationPrincipal User user) {
    // Single access check
    if (!user.hasPermission("query")) {
        return Result.error("Access denied");
    }
    
    // If this check fails, user gets full access
    // No additional layers of protection
    return service.execute(query);
}`} />
              </div>
            </div>
          </motion.div>
        </section>

        {/* Four Layers Flow */}
        <section className="px-6 py-12 border-t border-border/50 bg-muted/30">
          <div className="max-w-4xl mx-auto">
            <FourLayersFlow />
          </div>
        </section>

        {/* Complete Flow */}
        <section className="px-6 py-12">
          <div className="max-w-4xl mx-auto">
            <CompleteAccessControlFlow />
          </div>
        </section>

        {/* Fail-Closed Security */}
        <section className="px-6 py-12 border-t border-border/50 bg-muted/30">
          <div className="max-w-4xl mx-auto">
            <FailClosedSecurity />
          </div>
        </section>

        {/* SPI Pattern */}
        <section className="px-6 py-12">
          <div className="max-w-4xl mx-auto">
            <SPIPattern />
          </div>
        </section>

        {/* Implementation Patterns */}
        <section className="px-6 py-12 border-t border-border/50 bg-muted/30">
          <div className="max-w-4xl mx-auto">
            <ImplementationPatterns />
          </div>
        </section>

        {/* The Solution */}
        <section className="px-6 py-12">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-3">
                <Lightbulb className="h-6 w-6 text-primary" />
                The Solution: Multi-Layered Defense
              </h2>
              <p className="text-muted-foreground mb-6">
                Four layers of security ensure no unauthorized access. Even if one layer fails, others provide protection.
              </p>
            </motion.div>

            <div className="grid lg:grid-cols-2 gap-6">
              <div className="p-6 rounded-xl border border-primary/30 bg-primary/5">
                <div className="flex items-center gap-3 mb-4">
                  <Code className="h-6 w-6 text-primary" />
                  <h4 className="font-bold text-foreground">1. Implement EntityAccessPolicy</h4>
                </div>
                <CodeBlock code={`@Component
public class MyEntityAccessPolicy implements EntityAccessPolicy {
    
    @Override
    public boolean canUserAccessEntity(String userId, Map<String, Object> entity) {
        // YOUR business logic
        return permissionService.hasPermission(userId, "rag:query");
    }
    
    @Override
    public void logAccessDenied(String userId, Map<String, Object> entity, String reason) {
        // YOUR audit logging
        auditService.logDenial(userId, entity, reason);
    }
}`} />
              </div>
              
              <div className="p-6 rounded-xl border border-secondary/30 bg-secondary/5">
                <div className="flex items-center gap-3 mb-4">
                  <Settings className="h-6 w-6 text-secondary" />
                  <h4 className="font-bold text-foreground">2. Framework Enforces Everywhere</h4>
                </div>
                <CodeBlock code={`// Framework automatically:
// - Calls your policy at Layer 1 (Orchestrator)
// - Calls your policy at Layer 4 (Results)
// - Enforces fail-closed security
// - Logs all access decisions
// - Provides audit trail

// You just implement the interface.
// Framework handles the rest.`} />
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <section className="px-6 py-8 border-t border-border/50">
          <div className="max-w-4xl flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <Link
                to="/docs/access_control_mechanics_v2"
                className="flex items-center gap-2 text-sm text-primary hover:underline"
              >
                <BookOpen className="h-4 w-4" />
                Read V2 (Narrative Version)
              </Link>
              <Link
                to="/docs/guides/access_control_mechanics"
                className="flex items-center gap-2 text-sm text-primary hover:underline"
              >
                <FileCode className="h-4 w-4" />
                Read Full Technical Guide
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <StoryLoveButton storySlug="access_control_mechanics_story" />
              <PageViewCounter />
            </div>
          </div>
        </section>
      </div>
    </DocsLayout>
  );
};

export default AccessControlMechanicsStory;





