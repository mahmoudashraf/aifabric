import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { CheckCircle, RefreshCw, Calendar } from "lucide-react";

const completed = [
  "Modular architecture",
  "Provider abstraction",
  "Annotation system",
  "Privacy/PII detection",
  "Async processing",
  "Vector DB support",
];

const inProgress = [
  "Production testing",
  "Performance tuning",
  "Documentation",
  "Real-world validation",
  "Developer experience",
  "Integration guides",
];

const comingSoon = [
  "v1.0 release",
  "Advanced caching",
  "Multi-tenancy",
  "Advanced RAG",
  "Custom providers",
  "Cloud deployment",
];

const StatusSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="bg-background py-20 lg:py-32">
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
              Current Status
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              AI Fabric Framework is under active development. Here's what's happening:
            </p>
          </motion.div>

          {/* Status Grid */}
          <div className="grid gap-6 md:grid-cols-3">
            {/* Completed */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="rounded-2xl border border-accent/30 bg-accent/5 p-6"
            >
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/20">
                  <CheckCircle className="h-5 w-5 text-accent" />
                </div>
                <h3 className="text-lg font-bold text-foreground">Completed</h3>
              </div>
              <ul className="space-y-2">
                {completed.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* In Progress */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="rounded-2xl border border-primary/30 bg-primary/5 p-6"
            >
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20">
                  <RefreshCw className="h-5 w-5 animate-spin text-primary" style={{ animationDuration: "3s" }} />
                </div>
                <h3 className="text-lg font-bold text-foreground">In Progress</h3>
              </div>
              <ul className="space-y-2">
                {inProgress.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Coming Soon */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="rounded-2xl border border-secondary/30 bg-secondary/5 p-6"
            >
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/20">
                  <Calendar className="h-5 w-5 text-secondary" />
                </div>
                <h3 className="text-lg font-bold text-foreground">Coming Soon</h3>
              </div>
              <ul className="space-y-2">
                {comingSoon.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Bottom CTA */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-8 text-center text-muted-foreground"
          >
            Want to influence the roadmap?{" "}
            <a href="#register" className="font-medium text-primary hover:underline">
              Register your interest above!
            </a>
          </motion.p>
        </div>
      </div>
    </section>
  );
};

export default StatusSection;
