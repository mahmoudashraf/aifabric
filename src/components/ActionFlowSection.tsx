import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Highlight, themes } from "prism-react-renderer";
import { ArrowDown, CheckCircle, MessageSquare, Shield, Zap } from "lucide-react";

const actionHandlerCode = `@Component
public class ActionHandlerImpl implements ActionHandler {
    @Autowired
    private SubscriptionService subscriptionService;
    
    @Override
    public ActionResult executeAction(...) {
        switch(actionName) {
            case "cancel_subscription":
                subscriptionService.cancel(...);
                return ActionResult.success(...);
        }
    }
}`;

const flowSteps = [
  {
    icon: MessageSquare,
    label: "User Request",
    detail: '"Cancel my subscription"',
    color: "text-primary",
  },
  {
    icon: Zap,
    label: "Extract Intents",
    detail: "Intent: type=ACTION, action=cancel_subscription",
    color: "text-secondary",
  },
  {
    icon: Shield,
    label: "Validate Action",
    detail: "Does user own subscription?",
    color: "text-yellow-500",
  },
  {
    icon: MessageSquare,
    label: "Get Confirmation",
    detail: '"Are you sure?"',
    color: "text-orange-500",
  },
  {
    icon: Zap,
    label: "Execute Action",
    detail: "subscriptionService.cancel()",
    color: "text-accent",
  },
  {
    icon: CheckCircle,
    label: "Response",
    detail: '"Subscription cancelled"',
    color: "text-accent",
  },
];

const ActionFlowSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="bg-surface py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <div ref={ref} className="mx-auto max-w-6xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="mb-12 text-center"
          >
            <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
              Natural Language → Action
            </h2>
            <p className="text-lg text-muted-foreground">
              See how AI Fabric orchestrates user intents into real business actions
            </p>
          </motion.div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Code Block */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="overflow-hidden rounded-2xl border border-code-border bg-code-bg shadow-2xl"
            >
              <div className="flex items-center gap-2 border-b border-code-border px-4 py-3">
                <div className="h-3 w-3 rounded-full bg-red-500/80" />
                <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                <div className="h-3 w-3 rounded-full bg-green-500/80" />
                <span className="ml-2 text-sm text-muted-foreground">ActionHandlerImpl.java</span>
              </div>
              <div className="p-4 sm:p-6">
                <Highlight
                  theme={themes.nightOwl}
                  code={actionHandlerCode}
                  language="java"
                >
                  {({ className, style, tokens, getLineProps, getTokenProps }) => (
                    <pre
                      className={`${className} overflow-x-auto font-mono text-sm leading-relaxed`}
                      style={{ ...style, background: "transparent" }}
                    >
                      {tokens.map((line, i) => {
                        const lineContent = line.map(t => t.content).join('');
                        const isHighlightedLine = lineContent.includes('ActionHandler') || 
                          lineContent.includes('executeAction') ||
                          lineContent.includes('ActionResult');
                        
                        return (
                          <div 
                            key={i} 
                            {...getLineProps({ line })} 
                            className={`flex ${isHighlightedLine ? 'bg-primary/20 -mx-4 px-4 sm:-mx-6 sm:px-6 rounded' : ''}`}
                          >
                            <span className="mr-4 select-none text-muted-foreground/40">
                              {(i + 1).toString().padStart(2, "0")}
                            </span>
                            <span>
                              {line.map((token, key) => {
                                const isHighlight = token.content.includes('ActionHandler') || 
                                  token.content.includes('executeAction') ||
                                  token.content.includes('ActionResult') ||
                                  token.content.includes('subscriptionService');
                                
                                const tokenProps = getTokenProps({ token });
                                
                                if (isHighlight) {
                                  return (
                                    <span 
                                      key={key} 
                                      {...tokenProps}
                                      className="font-semibold"
                                      style={{ color: 'hsl(152, 69%, 46%)' }}
                                    />
                                  );
                                }
                                
                                return <span key={key} {...tokenProps} />;
                              })}
                            </span>
                          </div>
                        );
                      })}
                    </pre>
                  )}
                </Highlight>
              </div>
            </motion.div>

            {/* Flow Diagram */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col justify-center"
            >
              <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
                <h3 className="mb-6 text-center text-lg font-semibold text-foreground font-mono">
                  orchestrator.orchestrate(userQuery, Context)
                </h3>
                <div className="space-y-3">
                  {flowSteps.map((step, index) => (
                    <div key={step.label}>
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={isInView ? { opacity: 1, y: 0 } : {}}
                        transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                        className="flex items-center gap-3 rounded-lg border border-border bg-background p-3 transition-colors hover:border-primary/30"
                      >
                        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-muted ${step.color}`}>
                          <step.icon className="h-5 w-5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-foreground">{step.label}</p>
                          <p className="truncate text-xs text-muted-foreground font-mono">{step.detail}</p>
                        </div>
                      </motion.div>
                      {index < flowSteps.length - 1 && (
                        <div className="flex justify-center py-1">
                          <ArrowDown className="h-4 w-4 text-muted-foreground/50" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ActionFlowSection;
