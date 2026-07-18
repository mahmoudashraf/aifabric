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
  ArrowRight,
  CheckCircle2,
  XCircle,
  Settings,
  Code,
  Package,
  FileCode,
  BookOpen,
  Clock,
  DollarSign,
  Activity,
  Sparkles,
  Heart,
  Target,
  AlertTriangle,
  Database,
  Server,
  Cpu,
  Layers,
  RefreshCw,
  TrendingUp,
  Play,
  Pause,
  RotateCcw,
  Users,
  Search,
  TrendingDown,
  Rocket,
  Lightbulb
} from "lucide-react";

const PAGE_TITLE = "OpenAI Provider V2: The Integration That Took 5 Minutes - AI Fabric Framework";
const PAGE_DESCRIPTION = "A developer's journey from 200 lines of boilerplate to one dependency—how OpenAI integration became trivial.";
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

const ProviderIntegrationFlow = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const steps = [
    {
      number: 1,
      title: "Add Dependency",
      icon: Package,
      color: "bg-blue-500",
      description: "One line in pom.xml\nai-fabric-provider-openai\nAuto-configuration enabled"
    },
    {
      number: 2,
      title: "Auto-Configuration",
      icon: Settings,
      color: "bg-purple-500",
      description: "Spring Boot auto-config\nDetects OpenAI provider\nLoads from application.yml\nHealth checks enabled"
    },
    {
      number: 3,
      title: "Health Check",
      icon: CheckCircle2,
      color: "bg-green-500",
      description: "Health endpoint: /actuator/health\nValidates API key\nTests connection\nMetrics enabled"
    },
    {
      number: 4,
      title: "Request Processing",
      icon: MessageSquare,
      color: "bg-orange-500",
      description: "LLM request received\nRate limiting check\nRetry logic ready\nRequest queued"
    },
    {
      number: 5,
      title: "API Call",
      icon: Server,
      color: "bg-red-500",
      description: "OpenAI API call\nWith retry on failure\nExponential backoff\nTimeout handling"
    },
    {
      number: 6,
      title: "Response Processing",
      icon: Database,
      color: "bg-teal-500",
      description: "Parse response\nExtract tokens used\nCalculate costs\nUpdate metrics"
    },
    {
      number: 7,
      title: "Return Result",
      icon: Zap,
      color: "bg-indigo-500",
      description: "AILLMResponse returned\nTokens tracked\nCosts calculated\nMetrics updated"
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
        Provider Integration Flow: From Dependency to Production
      </h3>
      <p className="text-sm text-muted-foreground text-center mb-6">
        Watch how OpenAI integration becomes automatic with health checks, retries, and metrics
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
        <div className="flex flex-wrap justify-center items-center gap-3 md:gap-4">
          {steps.map((step, i) => {
            const Icon = step.icon;
            const isActive = activeStep >= i;
            return (
              <div key={i} className="flex items-center gap-2 md:gap-3">
                <motion.div
                  animate={{
                    scale: activeStep === i ? 1.1 : 1,
                    opacity: isActive ? 1 : 0.4,
                  }}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all cursor-pointer ${
                    activeStep === i
                      ? `${step.color} border-${step.color.split('-')[1]}-600 shadow-lg`
                      : 'bg-muted/30 border-border/50'
                  }`}
                  onClick={() => {
                    setActiveStep(i);
                    setIsPlaying(false);
                  }}
                  style={{ minWidth: '120px' }}
                >
                  <div className={`p-2 rounded-full ${step.color} ${!isActive ? 'opacity-50' : ''}`}>
                    <Icon className="h-4 w-4 text-white" />
                  </div>
                  <div className="text-center">
                    <div className={`text-xs font-semibold mb-1 ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {step.number}
                    </div>
                    <div className={`text-xs font-bold ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                      {step.title}
                    </div>
                  </div>
                </motion.div>
                {i < steps.length - 1 && (
                  <motion.div
                    animate={{ opacity: activeStep > i ? 1 : 0.3 }}
                    className="hidden md:block"
                  >
                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
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

const TheIntegrationJourney = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const steps = [
    {
      time: "Monday 9:00 AM",
      title: "The Request",
      icon: MessageSquare,
      color: "text-blue-400",
      bgColor: "bg-blue-500/5",
      borderColor: "border-blue-500/30",
      events: [
        { emoji: "💼", text: "PM: 'We need GPT-4 integration for customer support chatbot'", type: "normal" },
        { emoji: "😊", text: "Developer: 'Sure, I'll integrate OpenAI API'", type: "positive" },
        { emoji: "☕", text: "Coffee in hand, ready to code", type: "info" }
      ]
    },
    {
      time: "Monday 9:30 AM",
      title: "The Research",
      icon: Search,
      color: "text-orange-400",
      bgColor: "bg-orange-500/5",
      borderColor: "border-orange-500/30",
      events: [
        { emoji: "🔍", text: "Googles: 'OpenAI Java integration'", type: "warning" },
        { emoji: "📖", text: "Reads: 'Use RestTemplate, build headers, parse JSON...'", type: "warning" },
        { emoji: "😅", text: "Developer: 'This looks like a lot of boilerplate'", type: "warning" }
      ]
    },
    {
      time: "Monday 10:00 AM",
      title: "The Boilerplate",
      icon: Code,
      color: "text-red-400",
      bgColor: "bg-red-500/5",
      borderColor: "border-red-500/30",
      events: [
        { emoji: "💻", text: "Starts writing: RestTemplate, HttpHeaders, request building...", type: "error" },
        { emoji: "😰", text: "50 lines: Just for headers and request", type: "error" },
        { emoji: "💔", text: "100 lines: Error handling, retries, rate limiting...", type: "error" },
        { emoji: "😤", text: "200 lines: Still need metrics, health checks, tests...", type: "critical" }
      ]
    },
    {
      time: "Monday 2:00 PM",
      title: "The Frustration",
      icon: AlertTriangle,
      color: "text-red-600",
      bgColor: "bg-red-600/5",
      borderColor: "border-red-600/50",
      events: [
        { emoji: "😫", text: "Developer: 'This is taking forever'", type: "critical" },
        { emoji: "🐛", text: "Found: Rate limit errors not handled", type: "critical" },
        { emoji: "❌", text: "Found: No retry logic for 5xx errors", type: "critical" },
        { emoji: "💭", text: "Flashback: 'AI Fabric has provider modules...'", type: "positive" }
      ]
    },
    {
      time: "Monday 2:15 PM",
      title: "The Discovery",
      icon: Lightbulb,
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/5",
      borderColor: "border-yellow-500/30",
      events: [
        { emoji: "💡", text: "Discovers: ai-fabric-provider-openai", type: "positive" },
        { emoji: "📦", text: "Adds dependency: One line in pom.xml", type: "positive" },
        { emoji: "⚙️", text: "Configures: 5 lines in application.yml", type: "positive" },
        { emoji: "✅", text: "Framework handles everything automatically", type: "positive" }
      ]
    },
    {
      time: "Monday 2:20 PM",
      title: "The Magic",
      icon: Rocket,
      color: "text-green-400",
      bgColor: "bg-green-500/5",
      borderColor: "border-green-500/30",
      events: [
        { emoji: "⚡", text: "5 minutes: Integration complete", type: "intervention" },
        { emoji: "🎉", text: "Zero boilerplate: Just use AICoreService", type: "intervention" },
        { emoji: "📊", text: "Health checks: Built-in", type: "intervention" },
        { emoji: "📈", text: "Metrics: Automatic", type: "intervention" }
      ]
    },
    {
      time: "3 Months Later",
      title: "The Impact",
      icon: TrendingUp,
      color: "text-green-400",
      bgColor: "bg-green-500/5",
      borderColor: "border-green-500/30",
      events: [
        { emoji: "💰", text: "Time saved: 200+ lines of boilerplate eliminated", type: "positive" },
        { emoji: "⚡", text: "Integration time: 5 hours → 5 minutes", type: "positive" },
        { emoji: "🔄", text: "Swapped to Anthropic: Changed one config line", type: "positive" },
        { emoji: "🎯", text: "Production-ready: Health checks, metrics, retries all included", type: "positive" }
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
        The Integration Journey: From 5 Hours to 5 Minutes
      </h3>
      <p className="text-sm text-muted-foreground text-center mb-8">
        A developer's transformation from boilerplate hell to one dependency
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
                <span className={`text-xs ${activeStep === i ? 'text-foreground' : ''}`}>
                  {step.time.split(' ')[0]}
                </span>
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
          <Rocket className="h-8 w-8 text-green-400 mx-auto mb-3" />
          <p className="text-lg font-bold text-green-400 mb-2">OpenAI Provider Enabled: Integration Complete</p>
          <p className="text-sm text-muted-foreground">
            One dependency. Zero boilerplate. Production-ready. Health checks, metrics, and error handling all included.
          </p>
        </motion.div>
      )}
    </div>
  );
};

const BeforeAfterComparison = () => {
  return (
    <div className="my-16">
      <h3 className="text-2xl font-bold text-foreground mb-8 text-center">
        Before & After: The Boilerplate Elimination
      </h3>
      
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Before */}
        <div className="p-6 rounded-xl border-2 border-red-500/30 bg-red-500/5">
          <div className="flex items-center gap-3 mb-4">
            <XCircle className="h-6 w-6 text-red-400" />
            <h4 className="font-bold text-foreground">Before: Manual Integration</h4>
          </div>
          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-muted/30 border border-border/30">
              <p className="text-xs font-semibold text-foreground mb-2">Problems:</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• 200+ lines of boilerplate</li>
                <li>• Error handling scattered</li>
                <li>• No retry logic</li>
                <li>• No rate limiting</li>
                <li>• No metrics</li>
                <li>• No health checks</li>
                <li>• Hard to test</li>
                <li>• Hard to swap providers</li>
              </ul>
            </div>
            <CodeBlock code={`@Service
public class ChatbotService {
    
    private final RestTemplate restTemplate;
    private final String apiKey;
    
    public String generateResponse(String userMessage) {
        try {
            // Build headers (20 lines)
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "Bearer " + apiKey);
            
            // Build request (30 lines)
            Map<String, Object> request = new HashMap<>();
            request.put("model", "gpt-4");
            List<Map<String, String>> messages = new ArrayList<>();
            messages.add(Map.of("role", "system", 
                               "content", "You are a helpful assistant"));
            messages.add(Map.of("role", "user", 
                               "content", userMessage));
            request.put("messages", messages);
            request.put("temperature", 0.7);
            request.put("max_tokens", 1000);
            
            // Make request (15 lines)
            HttpEntity<Map<String, Object>> entity = 
                new HttpEntity<>(request, headers);
            ResponseEntity<Map> response = restTemplate.exchange(
                baseUrl + "/chat/completions",
                HttpMethod.POST,
                entity,
                Map.class
            );
            
            // Parse response (25 lines)
            Map<String, Object> body = response.getBody();
            List<Map<String, Object>> choices = 
                (List<Map<String, Object>>) body.get("choices");
            Map<String, String> message = 
                (Map<String, String>) choices.get(0).get("message");
            String content = message.get("content");
            
            return content;
            
        } catch (HttpClientErrorException e) {
            // Error handling (50 lines)
            // ...
        } catch (HttpServerErrorException e) {
            // Error handling (30 lines)
            // ...
        }
        // Still need: retries, rate limiting, metrics, health checks...
    }
}

// Total: 200+ lines of boilerplate`} />
          </div>
        </div>
        
        {/* After */}
        <div className="p-6 rounded-xl border-2 border-green-500/30 bg-green-500/5">
          <div className="flex items-center gap-3 mb-4">
            <CheckCircle2 className="h-6 w-6 text-green-400" />
            <h4 className="font-bold text-foreground">After: One Dependency</h4>
          </div>
          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-muted/30 border border-border/30">
              <p className="text-xs font-semibold text-foreground mb-2">Benefits:</p>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• One dependency in pom.xml</li>
                <li>• 5 lines of configuration</li>
                <li>• Zero boilerplate</li>
                <li>• Auto-configuration</li>
                <li>• Health checks built-in</li>
                <li>• Metrics automatic</li>
                <li>• Easy to test</li>
                <li>• Swappable providers</li>
              </ul>
            </div>
            <CodeBlock code={`// 1. Add dependency (pom.xml)
<dependency>
    <groupId>com.ai.fabric</groupId>
    <artifactId>ai-fabric-provider-openai</artifactId>
    <version>1.0.0</version>
</dependency>

// 2. Configure (application.yml)
ai:
  providers:
    llm-provider: openai
    openai:
      api-key: \${OPENAI_API_KEY}
      model: gpt-4o

// 3. Use (your service)
@Autowired
private AICoreService coreService;

public String generateResponse(String userMessage) {
    AIGenerationResponse response = coreService.generateContent(
        AIGenerationRequest.builder()
            .prompt(userMessage)
            .systemPrompt("You are a helpful assistant")
            .build()
    );
    return response.getContent();
}

// Total: 3 lines of code
// Framework handles: headers, requests, parsing, errors, retries, 
//                     rate limiting, metrics, health checks`} />
          </div>
        </div>
      </div>
      
      <div className="mt-6 p-4 rounded-lg bg-primary/10 border border-primary/20 text-center">
        <p className="text-sm font-bold text-primary">
          Result: 200+ lines → 3 lines. Integration time: 5 hours → 5 minutes. Production-ready out of the box.
        </p>
      </div>
    </div>
  );
};

const TheThreeSteps = () => {
  const [activeStep, setActiveStep] = useState(0);
  
  const steps = [
    {
      step: 1,
      title: "Add Dependency",
      icon: Package,
      color: "text-blue-400",
      borderColor: "border-blue-500/30",
      bgColor: "bg-blue-500/5",
      description: "One line in pom.xml",
      code: `<dependency>
    <groupId>com.ai.fabric</groupId>
    <artifactId>ai-fabric-provider-openai</artifactId>
    <version>1.0.0</version>
</dependency>`,
      time: "30 seconds"
    },
    {
      step: 2,
      title: "Configure",
      icon: Settings,
      color: "text-green-400",
      borderColor: "border-green-500/30",
      bgColor: "bg-green-500/5",
      description: "5 lines in application.yml",
      code: `ai:
  providers:
    llm-provider: openai
    openai:
      api-key: \${OPENAI_API_KEY}
      model: gpt-4o`,
      time: "1 minute"
    },
    {
      step: 3,
      title: "Use",
      icon: Code,
      color: "text-purple-400",
      borderColor: "border-purple-500/30",
      bgColor: "bg-purple-500/5",
      description: "3 lines of code",
      code: `@Autowired
private AICoreService coreService;

public String generateResponse(String userMessage) {
    AIGenerationResponse response = coreService.generateContent(
        AIGenerationRequest.builder()
            .prompt(userMessage)
            .build()
    );
    return response.getContent();
}`,
      time: "2 minutes"
    }
  ];

  return (
    <div className="my-16">
      <h3 className="text-2xl font-bold text-foreground mb-8 text-center">
        The 3 Steps: From Zero to Production
      </h3>
      <p className="text-sm text-muted-foreground text-center mb-8">
        Three simple steps. Total time: 3.5 minutes. Production-ready.
      </p>
      
      <div className="grid grid-cols-3 gap-2 mb-6">
        {steps.map((step, i) => {
          const Icon = step.icon;
          return (
            <button
              key={i}
              onClick={() => setActiveStep(i)}
              className={`p-3 rounded-lg border-2 transition-all ${
                activeStep === i
                  ? `${step.borderColor} ${step.bgColor} shadow-lg`
                  : "border-border/30 bg-muted/30 hover:border-border"
              }`}
            >
              <Icon className={`h-5 w-5 mx-auto mb-1 ${activeStep === i ? step.color : 'text-muted-foreground'}`} />
              <p className={`text-xs font-semibold text-center ${activeStep === i ? 'text-foreground' : 'text-muted-foreground'}`}>
                Step {step.step}
              </p>
            </button>
          );
        })}
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
              <h4 className="font-bold text-foreground">
                Step {steps[activeStep].step}: {steps[activeStep].title}
              </h4>
              <p className="text-xs text-muted-foreground">{steps[activeStep].description}</p>
            </div>
            <div className="ml-auto">
              <span className="text-xs font-semibold text-primary">{steps[activeStep].time}</span>
            </div>
          </div>
          <CodeBlock code={steps[activeStep].code} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const ProviderFeatures = () => {
  const features = [
    {
      title: "LLM Generation",
      icon: Brain,
      color: "text-blue-400",
      borderColor: "border-blue-500/30",
      bgColor: "bg-blue-500/5",
      models: ["GPT-4", "GPT-4o", "GPT-3.5-turbo"],
      features: ["System prompts", "Temperature control", "Max tokens", "Usage tracking"]
    },
    {
      title: "Embedding Generation",
      icon: Layers,
      color: "text-purple-400",
      borderColor: "border-purple-500/30",
      bgColor: "bg-purple-500/5",
      models: ["text-embedding-3-small", "text-embedding-3-large", "ada-002"],
      features: ["Batch support", "Dimension tracking", "Fast generation"]
    },
    {
      title: "Auto-Configuration",
      icon: Settings,
      color: "text-green-400",
      borderColor: "border-green-500/30",
      bgColor: "bg-green-500/5",
      models: ["Spring Boot", "Auto-discovery", "Conditional beans"],
      features: ["Zero code", "Just config", "Auto-wiring"]
    },
    {
      title: "Health & Metrics",
      icon: Activity,
      color: "text-orange-400",
      borderColor: "border-orange-500/30",
      bgColor: "bg-orange-500/5",
      models: ["Health checks", "Success rates", "Response times"],
      features: ["Automatic tracking", "Actuator endpoint", "Production-ready"]
    }
  ];

  const [selectedFeature, setSelectedFeature] = useState(0);

  return (
    <div className="my-16">
      <h3 className="text-2xl font-bold text-foreground mb-8 text-center">
        What You Get: Four Powerful Features
      </h3>
      
      <div className="grid grid-cols-4 gap-2 mb-6">
        {features.map((feature, i) => {
          const Icon = feature.icon;
          return (
            <button
              key={i}
              onClick={() => setSelectedFeature(i)}
              className={`p-3 rounded-lg border-2 transition-all ${
                selectedFeature === i
                  ? `${feature.borderColor} ${feature.bgColor} shadow-lg`
                  : "border-border/30 bg-muted/30 hover:border-border"
              }`}
            >
              <Icon className={`h-5 w-5 mx-auto mb-1 ${selectedFeature === i ? feature.color : 'text-muted-foreground'}`} />
              <p className={`text-xs font-semibold text-center ${selectedFeature === i ? 'text-foreground' : 'text-muted-foreground'}`}>
                {feature.title.split(' ')[0]}
              </p>
            </button>
          );
        })}
      </div>
      
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedFeature}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className={`p-6 rounded-xl border ${features[selectedFeature].borderColor} ${features[selectedFeature].bgColor}`}
        >
          <div className="flex items-center gap-3 mb-4">
            {React.createElement(features[selectedFeature].icon, {
              className: `h-6 w-6 ${features[selectedFeature].color}`
            })}
            <h4 className="font-bold text-foreground">{features[selectedFeature].title}</h4>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-semibold text-foreground mb-2">Supported Models:</p>
              <ul className="space-y-1">
                {features[selectedFeature].models.map((model, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                    <CheckCircle2 className="h-3 w-3 text-primary shrink-0" />
                    {model}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold text-foreground mb-2">Features:</p>
              <ul className="space-y-1">
                {features[selectedFeature].features.map((feat, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                    <CheckCircle2 className="h-3 w-3 text-accent shrink-0" />
                    {feat}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

const SwappableProviders = () => {
  return (
    <div className="my-16">
      <h3 className="text-2xl font-bold text-foreground mb-8 text-center">
        Swappable Providers: Change in One Line
      </h3>
      <p className="text-sm text-muted-foreground text-center mb-8">
        Same interface. Different providers. Switch anytime.
      </p>
      
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="p-6 rounded-xl border border-blue-500/30 bg-blue-500/5">
          <div className="flex items-center gap-3 mb-4">
            <Brain className="h-6 w-6 text-blue-400" />
            <h4 className="font-bold text-foreground">OpenAI</h4>
          </div>
          <CodeBlock code={`ai:
  providers:
    llm-provider: openai
    openai:
      api-key: \${OPENAI_API_KEY}
      model: gpt-4o`} language="yaml" />
        </div>
        
        <div className="p-6 rounded-xl border border-purple-500/30 bg-purple-500/5">
          <div className="flex items-center gap-3 mb-4">
            <Server className="h-6 w-6 text-purple-400" />
            <h4 className="font-bold text-foreground">Anthropic</h4>
          </div>
          <CodeBlock code={`ai:
  providers:
    llm-provider: anthropic
    anthropic:
      api-key: \${ANTHROPIC_API_KEY}
      model: claude-3-opus`} language="yaml" />
        </div>
        
        <div className="p-6 rounded-xl border border-green-500/30 bg-green-500/5">
          <div className="flex items-center gap-3 mb-4">
            <Cpu className="h-6 w-6 text-green-400" />
            <h4 className="font-bold text-foreground">ONNX (Local)</h4>
          </div>
          <CodeBlock code={`ai:
  providers:
    llm-provider: onnx
    onnx:
      model-path: ./models/onnx-model`} language="yaml" />
        </div>
      </div>
      
      <div className="mt-6 p-4 rounded-lg bg-primary/10 border border-primary/20 text-center">
        <p className="text-sm font-bold text-primary">
          Your code stays the same. Just change the provider in config. Framework handles the rest.
        </p>
      </div>
    </div>
  );
};

const WhatYouImplement = () => {
  return (
    <div className="my-16">
      <h3 className="text-2xl font-bold text-foreground mb-8 text-center">
        What You Actually Do
      </h3>
      
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-xl border border-primary/30 bg-primary/5">
          <div className="flex items-center gap-3 mb-4">
            <Package className="h-6 w-6 text-primary" />
            <h4 className="font-bold text-foreground">1. Add Dependency</h4>
          </div>
          <CodeBlock code={`<dependency>
    <groupId>com.ai.fabric</groupId>
    <artifactId>ai-fabric-provider-openai</artifactId>
    <version>1.0.0</version>
</dependency>`} language="xml" />
        </div>
        
        <div className="p-6 rounded-xl border border-secondary/30 bg-secondary/5">
          <div className="flex items-center gap-3 mb-4">
            <Settings className="h-6 w-6 text-secondary" />
            <h4 className="font-bold text-foreground">2. Configure</h4>
          </div>
          <CodeBlock code={`ai:
  providers:
    llm-provider: openai
    openai:
      api-key: \${OPENAI_API_KEY}
      model: gpt-4o
      temperature: 0.7
      max-tokens: 1000`} language="yaml" />
        </div>
        
        <div className="p-6 rounded-xl border border-accent/30 bg-accent/5 col-span-2">
          <div className="flex items-center gap-3 mb-4">
            <Code className="h-6 w-6 text-accent" />
            <h4 className="font-bold text-foreground">3. Use (Same Interface as Any Provider)</h4>
          </div>
          <CodeBlock code={`@Autowired
private AICoreService coreService;

public String generateResponse(String userMessage) {
    AIGenerationResponse response = coreService.generateContent(
        AIGenerationRequest.builder()
            .prompt(userMessage)
            .systemPrompt("You are a helpful assistant")
            .temperature(0.7)
            .maxTokens(1000)
            .build()
    );
    return response.getContent();
}

// Framework handles:
// - Headers, requests, parsing
// - Error handling, retries
// - Rate limiting, metrics
// - Health checks
// - All the boilerplate!`} />
        </div>
      </div>
      
      <div className="mt-6 p-6 rounded-xl bg-gradient-primary text-center">
        <p className="text-primary-foreground font-semibold text-lg">
          That's it. Three steps. Zero boilerplate. Production-ready. Swappable. Health checks. Metrics. All included.
        </p>
      </div>
    </div>
  );
};

const OpenAIProviderStoryV2 = () => {
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
                  <span className="text-2xl">🤖</span>
                  OpenAI Provider V2 (Narrative)
                </span>
                <Link 
                  to="/docs/openai_provider_story"
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  View V1 →
                </Link>
              </div>
              <div className="flex items-center gap-3">
                <StoryLoveButton storySlug="openai_provider_story_v2" />
                <PageViewCounter />
              </div>
            </div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl"
            >
              <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
                The Integration That{" "}
                <span className="text-gradient">Took 5 Minutes</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mb-8">
                A developer's journey from 200 lines of boilerplate to one dependency—how OpenAI integration 
                became easier to verify and operate.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2 text-sm text-accent">
                  <Clock className="h-4 w-4" />
                  5 Hours → 5 Minutes
                </div>
                <div className="flex items-center gap-2 rounded-full bg-secondary/10 px-4 py-2 text-sm text-secondary">
                  <Code className="h-4 w-4" />
                  200 Lines → 3 Lines
                </div>
                <div className="flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm text-primary">
                  <Package className="h-4 w-4" />
                  One Dependency
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* The Integration Journey Timeline */}
        <section className="px-6 py-12">
          <div className="max-w-4xl mx-auto">
            <TheIntegrationJourney />
          </div>
        </section>

        {/* Provider Integration Flow */}
        <section className="px-6 py-12 border-t border-border/50 bg-muted/30">
          <div className="max-w-4xl mx-auto">
            <ProviderIntegrationFlow />
          </div>
        </section>

        {/* Before & After */}
        <section className="px-6 py-12">
          <div className="max-w-4xl mx-auto">
            <BeforeAfterComparison />
          </div>
        </section>

        {/* The 3 Steps */}
        <section className="px-6 py-12">
          <div className="max-w-4xl mx-auto">
            <TheThreeSteps />
          </div>
        </section>

        {/* Provider Features */}
        <section className="px-6 py-12 border-t border-border/50 bg-muted/30">
          <div className="max-w-4xl mx-auto">
            <ProviderFeatures />
          </div>
        </section>

        {/* Swappable Providers */}
        <section className="px-6 py-12">
          <div className="max-w-4xl mx-auto">
            <SwappableProviders />
          </div>
        </section>

        {/* What You Implement */}
        <section className="px-6 py-12 border-t border-border/50 bg-muted/30">
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
                to="/docs/openai_provider_story"
                className="flex items-center gap-2 text-sm text-primary hover:underline"
              >
                <BookOpen className="h-4 w-4" />
                Read V1 (Visual Version)
              </Link>
              <Link
                to="/docs/openai_provider_full"
                className="flex items-center gap-2 text-sm text-primary hover:underline"
              >
                <FileCode className="h-4 w-4" />
                Read Full Technical Guide
              </Link>
            </div>
            <div className="flex items-center gap-3">
              <StoryLoveButton storySlug="openai_provider_story_v2" />
              <PageViewCounter />
            </div>
          </div>
        </section>
      </div>
    </DocsLayout>
  );
};

export default OpenAIProviderStoryV2;
