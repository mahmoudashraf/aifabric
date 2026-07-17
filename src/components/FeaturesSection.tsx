import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Plug, Shield, Zap, DollarSign, Package, TestTube, BookOpen, Rocket } from "lucide-react";

const features = [
  {
    icon: Plug,
    title: "Zero Vendor Lock-In",
    description: "Swap providers with one config change",
  },
  {
    icon: Shield,
    title: "Privacy-First",
    description: "PII detection and privacy-oriented guardrails",
  },
  {
    icon: Zap,
    title: "Production-Ready",
    description: "Async, cached, monitored by default",
  },
  {
    icon: DollarSign,
    title: "Cost-Effective",
    description: "Local options for development and controlled deployments",
  },
  {
    icon: Package,
    title: "Modular Design",
    description: "Use what you need, skip what you don't",
  },
  {
    icon: TestTube,
    title: "Easy Testing",
    description: "Profile-based mocking for dev and test",
  },
  {
    icon: BookOpen,
    title: "Well-Documented",
    description: "Guides for every module and use case",
  },
  {
    icon: Rocket,
    title: "Release-Gated",
    description: "Backed by CI, examples, and live demo smoke paths",
  },
];

const FeaturesSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="features" className="bg-surface py-20 lg:py-32">
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
              Why AI Fabric?
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Built by developers, for developers. Every decision optimized for real-world use.
            </p>
          </motion.div>

          {/* Feature Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 + index * 0.05 }}
                className="group rounded-xl border border-border bg-card p-5 text-center transition-all duration-300 hover:border-primary/30 hover:shadow-lg"
              >
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-1 font-bold text-foreground">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
