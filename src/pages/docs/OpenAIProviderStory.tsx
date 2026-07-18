import { useEffect, useState } from "react";
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
  TrendingUp
} from "lucide-react";

const PAGE_TITLE = "OpenAI Provider: Spring AI-Backed Wiring - AI Fabric Framework";
const PAGE_DESCRIPTION = "How AI Fabric uses Spring AI for OpenAI LLM and embeddings while keeping AI Fabric policy, RAG, actions, and diagnostics above it.";

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

const ProblemList = () => {
  const problems = [
    { icon: XCircle, text: "200+ lines of boilerplate", color: "text-red-400" },
    { icon: XCircle, text: "Error handling scattered", color: "text-red-400" },
    { icon: XCircle, text: "No retry logic", color: "text-red-400" },
    { icon: XCircle, text: "No rate limiting", color: "text-red-400" },
    { icon: XCircle, text: "No metrics", color: "text-red-400" },
    { icon: XCircle, text: "No health checks", color: "text-red-400" },
    { icon: XCircle, text: "Hard to test", color: "text-red-400" },
    { icon: XCircle, text: "Hard to swap providers", color: "text-red-400" },
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

const FeatureCard = ({ title, icon: Icon, description, color }: {
  title: string;
  icon: any;
  description: string;
  color: string;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className="rounded-lg border border-border/50 bg-card p-5"
  >
    <div className="flex items-center gap-3 mb-3">
      <div className={`w-10 h-10 rounded-lg ${color} flex items-center justify-center`}>
        <Icon className="h-5 w-5 text-white" />
      </div>
      <h4 className="font-bold text-foreground">{title}</h4>
    </div>
    <p className="text-sm text-muted-foreground">{description}</p>
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

const OpenAIProviderStory = () => {
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
                  OpenAI Provider V1
                </span>
                <Link 
                  to="/docs/openai_provider_story_v2"
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  View V2 (Narrative) →
                </Link>
              </div>
              <div className="flex items-center gap-3">
                <StoryLoveButton storySlug="openai_provider_story" />
                <PageViewCounter />
              </div>
            </div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl"
            >
              <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
                OpenAI Provider:{" "}
                <span className="text-gradient">Spring AI-Backed Wiring</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mb-8">
                How AI Fabric uses Spring AI for OpenAI LLM and embeddings while keeping AI Fabric policy,
                RAG, actions, and diagnostics above the provider.
              </p>
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-2 rounded-full bg-accent/10 px-4 py-2 text-sm text-accent">
                  <Package className="h-4 w-4" />
                  Provider Starter
                </div>
                <div className="flex items-center gap-2 rounded-full bg-secondary/10 px-4 py-2 text-sm text-secondary">
                  <Zap className="h-4 w-4" />
                  Zero Boilerplate
                </div>
                <div className="flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-sm text-primary">
                  <CheckCircle2 className="h-4 w-4" />
                  Current Guide Available
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
                The Integration Nightmare: 200 Lines of Boilerplate
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Customer support chatbot. Need GPT-4 integration.
              </p>
              
              <CodeBlock code={`@Service
public class ChatbotService {
    
    private final RestTemplate restTemplate;
    private final String apiKey;
    private final String baseUrl = "https://api.openai.com/v1";
    
    public String generateResponse(String userMessage) {
        try {
            // Build headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.set("Authorization", "Bearer " + apiKey);
            
            // Build request
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
            
            // Make request
            HttpEntity<Map<String, Object>> entity = 
                new HttpEntity<>(request, headers);
            
            ResponseEntity<Map> response = restTemplate.exchange(
                baseUrl + "/chat/completions",
                HttpMethod.POST,
                entity,
                Map.class
            );
            
            // Parse response
            Map<String, Object> body = response.getBody();
            List<Map<String, Object>> choices = 
                (List<Map<String, Object>>) body.get("choices");
            Map<String, String> message = 
                (Map<String, String>) choices.get(0).get("message");
            String content = message.get("content");
            
            return content;
            
        } catch (HttpClientErrorException e) {
            // Handle 4xx errors
            if (e.getStatusCode() == HttpStatus.TOO_MANY_REQUESTS) {
                throw new RateLimitException("OpenAI rate limit exceeded");
            }
            throw new RuntimeException("OpenAI API error: " + e.getMessage(), e);
        } catch (HttpServerErrorException e) {
            // Handle 5xx errors
            throw new RuntimeException("OpenAI server error: " + e.getMessage(), e);
        } catch (Exception e) {
            // Handle other errors
            throw new RuntimeException("Failed to call OpenAI: " + e.getMessage(), e);
        }
    }
    
    // Need to add:
    // - Retry logic
    // - Rate limiting
    // - Metrics
    // - Health checks
    // - Timeout handling
    // - Error recovery
    // - ... 100 more lines
}`} />
              
              <p className="text-foreground font-medium mt-6">
                <strong>Every developer's integration nightmare.</strong>
              </p>
            </div>

            <h3 className="text-xl font-bold text-foreground mb-4">Problems:</h3>
            <ProblemList />
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
                <Package className="h-6 w-6 text-primary" />
                Our Solution: Just Add a Dependency
              </h2>
              <p className="text-muted-foreground mb-8">
                Add dependency. Configure. Use. That's it.
              </p>
            </motion.div>

            <SolutionCard
              title="1. Add Dependency"
              icon={Package}
              description="Use the Spring AI-backed provider starter."
              color="bg-primary"
              code={`<dependency>
    <groupId>io.github.loom-ai-labs</groupId>
    <artifactId>ai-fabric-provider-spring-ai</artifactId>
    <version>0.3.3</version>
</dependency>`}
            />

            <SolutionCard
              title="2. Configure"
              icon={Settings}
              description="Simple YAML configuration."
              color="bg-secondary"
              code={`# application.yml
ai:
  providers:
    llm-provider: openai
    embedding-provider: openai  # Optional
    openai:
      enabled: true
      api-key: \${OPENAI_API_KEY}
      model: gpt-4o
      embedding-model: text-embedding-3-small
      temperature: 0.7
      max-tokens: 1000
      timeout: 30`}
            />

            <SolutionCard
              title="3. Use"
              icon={Code}
              description="Same interface as any provider. Zero boilerplate."
              color="bg-accent"
              code={`@Autowired
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
}`} />
          </div>
        </section>

        {/* Features */}
        <section className="px-6 py-12">
          <div className="max-w-4xl">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-bold text-foreground mb-8 flex items-center gap-3">
                <Sparkles className="h-6 w-6 text-primary" />
                What You Get Out of the Box
              </h2>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-4">
              <FeatureCard
                title="LLM Generation"
                icon={Brain}
                description="GPT-4, GPT-4o, GPT-3.5-turbo with system prompts, temperature control, and usage tracking"
                color="bg-blue-500"
              />
              <FeatureCard
                title="Embedding Generation"
                icon={Layers}
                description="text-embedding-3-small/large, ada-002 with batch support and dimension tracking"
                color="bg-purple-500"
              />
              <FeatureCard
                title="Auto-Configuration"
                icon={Settings}
                description="Spring Boot auto-configuration reduces wiring after the provider starter is added."
                color="bg-green-500"
              />
              <FeatureCard
                title="Health Checks"
                icon={Activity}
                description="Built-in health checks with success rates, response times, and availability status"
                color="bg-orange-500"
              />
              <FeatureCard
                title="Metrics"
                icon={TrendingUp}
                description="Track total requests, success/failure counts, average response time, and success rate"
                color="bg-red-500"
              />
              <FeatureCard
                title="Error Handling"
                icon={AlertTriangle}
                description="Automatic retries, rate limit handling, timeout management, and graceful fallbacks"
                color="bg-yellow-500"
              />
              <FeatureCard
                title="Swappable Providers"
                icon={RefreshCw}
                description="Change provider in config. Same interface. Works with Anthropic, Azure, ONNX, etc."
                color="bg-cyan-500"
              />
              <FeatureCard
                title="Usage Tracking"
                icon={Database}
                description="Track prompt tokens, completion tokens, total tokens, and costs per request"
                color="bg-pink-500"
              />
            </div>
          </div>
        </section>

        {/* The Complete Flow */}
        <section className="px-6 py-12 border-t border-border/50 bg-muted/30">
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
                description="POST /api/chat - Body: 'What's your return policy?'"
                icon={MessageSquare}
                color="bg-blue-500"
              />
              <FlowStep
                step={2}
                title="Your Service Code"
                description="ChatbotService.generateResponse() calls AICoreService"
                icon={Code}
                color="bg-purple-500"
                code={`AIGenerationRequest request = AIGenerationRequest
    .builder()
    .prompt(userMessage)
    .systemPrompt("You are a helpful assistant")
    .temperature(0.7)
    .maxTokens(1000)
    .build();

AIGenerationResponse response = 
    coreService.generateContent(request);`}
              />
              <FlowStep
                step={3}
                title="AI Core Service"
                description="AICoreService routes to configured provider (OpenAI)"
                icon={Brain}
                color="bg-green-500"
                code={`1. Get configured provider (OpenAI)
2. Check if available
3. Delegate to provider
4. Handle errors (fallback if configured)
5. Cache response (if enabled)`}
              />
              <FlowStep
                step={4}
                title="OpenAI Provider"
                description="OpenAIProvider.generateContent() builds request and calls API"
                icon={Server}
                color="bg-orange-500"
                code={`1. Track metrics (start timer)
2. Build request URL
3. Build headers (Authorization, Content-Type)
4. Build messages (system + user)
5. Build request body (model, messages, params)
6. Make HTTP request
7. Parse response
8. Update metrics (success/failure, response time)
9. Return AIGenerationResponse`}
              />
              <FlowStep
                step={5}
                title="OpenAI API Request"
                description="POST https://api.openai.com/v1/chat/completions"
                icon={Database}
                color="bg-red-500"
                code={`Headers: {
  "Authorization": "Bearer sk-...",
  "Content-Type": "application/json"
}

Body: {
  "model": "gpt-4o",
  "messages": [
    {"role": "system", "content": "You are a helpful assistant"},
    {"role": "user", "content": "What's your return policy?"}
  ],
  "temperature": 0.7,
  "max_tokens": 1000
}`}
              />
              <FlowStep
                step={6}
                title="Parse Response"
                description="Extract content, model, usage, and processing time"
                icon={CheckCircle2}
                color="bg-teal-500"
                code={`Response: {
  "choices": [{
    "message": {
      "content": "Our return policy allows..."
    }
  }],
  "usage": {
    "prompt_tokens": 15,
    "completion_tokens": 50,
    "total_tokens": 65
  }
}

AIGenerationResponse: {
  content: "Our return policy allows...",
  model: "gpt-4o",
  usage: {...},
  processingTimeMs: 1234
}`}
              />
            </div>
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
                <Target className="h-6 w-6 text-primary" />
                Real-World Examples
              </h2>
            </motion.div>

            <div className="space-y-6">
              <div className="rounded-xl border border-primary/30 bg-primary/5 p-6">
                <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-primary" />
                  Customer Support Chatbot
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Generate helpful responses using GPT-4.
                </p>
                <CodeBlock code={`@Service
public class SupportChatbotService {
    
    @Autowired
    private AICoreService coreService;
    
    public String respondToCustomer(String customerMessage, 
                                    String context) {
        String systemPrompt = String.format(
            "You are a helpful customer support agent. " +
            "Context: %s",
            context
        );
        
        AIGenerationResponse response = coreService.generateContent(
            AIGenerationRequest.builder()
                .prompt(customerMessage)
                .systemPrompt(systemPrompt)
                .temperature(0.7)
                .maxTokens(500)
                .build()
        );
        
        return response.getContent();
    }
}

// Result: High-quality support responses. Zero boilerplate.`} />
              </div>

              <div className="rounded-xl border border-secondary/30 bg-secondary/5 p-6">
                <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
                  <Package className="h-5 w-5 text-secondary" />
                  Product Description Generator
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Generate product descriptions using GPT-4.
                </p>
                <CodeBlock code={`@Service
public class ProductDescriptionService {
    
    @Autowired
    private AICoreService coreService;
    
    public String generateDescription(Product product) {
        String prompt = String.format(
            "Write a compelling product description for: %s. " +
            "Category: %s. Price: $%.2f. Features: %s",
            product.getName(),
            product.getCategory(),
            product.getPrice(),
            String.join(", ", product.getFeatures())
        );
        
        AIGenerationResponse response = coreService.generateContent(
            AIGenerationRequest.builder()
                .prompt(prompt)
                .systemPrompt("You are a creative marketing writer")
                .temperature(0.8)
                .maxTokens(300)
                .build()
        );
        
        return response.getContent();
    }
}

// Result: High-quality product descriptions. Creative. Consistent.`} />
              </div>

              <div className="rounded-xl border border-accent/30 bg-accent/5 p-6">
                <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
                  <Layers className="h-5 w-5 text-accent" />
                  Semantic Search with OpenAI Embeddings
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Use OpenAI embeddings for semantic search.
                </p>
                <CodeBlock code={`@Service
public class SemanticSearchService {
    
    @Autowired
    private AIEmbeddingService embeddingService;
    
    @Autowired
    private AISearchService searchService;
    
    public List<Product> searchSimilar(String query) {
        // Generate embedding using OpenAI
        AIEmbeddingResponse embedding = embeddingService.generateEmbedding(
            AIEmbeddingRequest.builder()
                .text(query)
                .build()
        );
        
        // Search using embedding
        AISearchResponse results = searchService.search(
            embedding.getEmbedding(),
            AISearchRequest.builder()
                .query(query)
                .entityType("product")
                .limit(10)
                .build()
        );
        
        return convertToProducts(results);
    }
}

// Result: High-quality semantic search. OpenAI embeddings. Zero boilerplate.`} />
              </div>
            </div>
          </div>
        </section>

        {/* Health Checks & Metrics */}
        <section className="px-6 py-12 border-t border-border/50 bg-muted/30">
          <div className="max-w-4xl">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-2xl font-bold text-foreground mb-8 flex items-center gap-3">
                <Activity className="h-6 w-6 text-primary" />
                Health Checks & Metrics
              </h2>
              <p className="text-muted-foreground mb-8">
                Production-ready monitoring out of the box.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="rounded-xl border border-border/50 bg-card p-6">
                <h4 className="font-bold text-foreground mb-4 flex items-center gap-2">
                  <Activity className="h-5 w-5 text-primary" />
                  Health Check Endpoint
                </h4>
                <CodeBlock code={`GET /actuator/health/ai

{
  "status": "UP",
  "llmProvider": "openai",
  "embeddingProvider": "openai",
  "openai": {
    "available": true,
    "healthy": true,
    "totalRequests": 1250,
    "successfulRequests": 1245,
    "failedRequests": 5,
    "successRate": 0.996,
    "averageResponseTime": 1234.5,
    "lastSuccess": "2025-01-02T10:30:00",
    "lastError": null
  }
}`} language="json" />
              </div>

              <div className="rounded-xl border border-border/50 bg-card p-6">
                <h4 className="font-bold text-foreground mb-4 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-secondary" />
                  Metrics Tracked
                </h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-accent" />
                    Total requests
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-accent" />
                    Successful requests
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-accent" />
                    Failed requests
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-accent" />
                    Success rate
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-accent" />
                    Average response time
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-accent" />
                    Last success timestamp
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-accent" />
                    Last error timestamp
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-accent" />
                    Last error message
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* The Bottom Line */}
        <section className="px-6 py-12">
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
                      <Brain className="h-4 w-4 text-primary" />
                      LLM generation (GPT-4, GPT-4o, GPT-3.5-turbo)
                    </li>
                    <li className="flex items-center gap-2">
                      <Layers className="h-4 w-4 text-accent" />
                      Embedding generation (text-embedding-3-small/large, ada-002)
                    </li>
                    <li className="flex items-center gap-2">
                      <Settings className="h-4 w-4 text-secondary" />
                      Auto-configuration (Spring Boot)
                    </li>
                    <li className="flex items-center gap-2">
                      <Activity className="h-4 w-4 text-primary" />
                      Health checks & metrics (production-oriented)
                    </li>
                    <li className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-accent" />
                      Fast (optimized API calls)
                    </li>
                    <li className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-secondary" />
                      Error handling (retries, fallbacks)
                    </li>
                    <li className="flex items-center gap-2">
                      <RefreshCw className="h-4 w-4 text-primary" />
                      Same interface (swappable providers)
                    </li>
                    <li className="flex items-center gap-2">
                      <Database className="h-4 w-4 text-accent" />
                      Usage tracking (token counts)
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-3">What you configure:</h3>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-accent" />
                      API key (environment variable)
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-accent" />
                      Model selection (GPT-4, GPT-3.5, etc.)
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-accent" />
                      Temperature, max tokens
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-accent" />
                      Timeout settings
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-accent" />
                      Embedding model
                    </li>
                  </ul>
                </div>
              </div>
              <div className="rounded-lg bg-gradient-primary p-6 text-center">
                <p className="text-primary-foreground font-semibold text-lg">
                  Result: Best-in-class LLM. Zero boilerplate. Production-ready. Swappable. Health checks. Metrics. All included.
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Story Navigation */}


        <StoryNavigation className="mt-12" />



        {/* Footer */}
        <section className="px-6 py-8 border-t border-border/50">
          <div className="max-w-4xl flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <Link
                to="/docs/openai_provider_story_v2"
                className="flex items-center gap-2 text-sm text-primary hover:underline"
              >
                <BookOpen className="h-4 w-4" />
                Read V2 (Narrative Version)
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
              <StoryLoveButton storySlug="openai_provider_story" />
              <PageViewCounter />
            </div>
          </div>
        </section>
      </div>
    </DocsLayout>
  );
};

export default OpenAIProviderStory;
