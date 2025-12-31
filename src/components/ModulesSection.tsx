import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Brain, BarChart3, RefreshCw, MessageSquare, Globe, Cpu, ArrowRight } from "lucide-react";

const modules = [
  {
    icon: Brain,
    title: "AI Core",
    description: "Embeddings, search, RAG, LLM integration",
    color: "primary",
  },
  {
    icon: BarChart3,
    title: "Behavior Analytics",
    description: "Sentiment analysis, churn prediction",
    color: "secondary",
  },
  {
    icon: RefreshCw,
    title: "Migration Module",
    description: "Bulk indexing with pause/resume",
    color: "accent",
  },
  {
    icon: MessageSquare,
    title: "Relationship Query",
    description: "Natural language to database queries",
    color: "primary",
  },
  {
    icon: Globe,
    title: "Web Module",
    description: "59 REST endpoints, zero code",
    color: "secondary",
  },
  {
    icon: Cpu,
    title: "ONNX Provider",
    description: "Free local embeddings, zero API costs",
    color: "accent",
  },
];

const ModulesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="modules" className="bg-surface py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <div ref={ref} className="mx-auto max-w-6xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="mb-16 text-center"
          >
            <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
              The Complete Ecosystem
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Everything you need to add AI capabilities to your Spring Boot application
            </p>
          </motion.div>

          {/* Module Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {modules.map((module, index) => (
              <motion.div
                key={module.title}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 + index * 0.08 }}
                className="group cursor-pointer rounded-2xl border border-border bg-card p-6 shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-xl"
              >
                <div
                  className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:scale-110 ${
                    module.color === "primary"
                      ? "bg-primary/10 text-primary"
                      : module.color === "secondary"
                      ? "bg-secondary/10 text-secondary"
                      : "bg-accent/10 text-accent"
                  }`}
                >
                  <module.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-xl font-bold text-foreground">{module.title}</h3>
                <p className="mb-4 text-muted-foreground">{module.description}</p>
                <div className="flex items-center gap-1 text-sm font-medium text-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  Learn More <ArrowRight className="h-4 w-4" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ModulesSection;
