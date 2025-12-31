import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { X, Check, Clock, Zap } from "lucide-react";

const oldWaySteps = [
  "Week 1-2: OpenAI integration",
  "Week 3-4: Vector DB setup",
  "Week 5-6: Embedding pipeline",
  "Week 7-8: Search implementation",
  "Week 9-10: Async processing",
  "Week 11-12: Caching layer",
  "Week 13-14: Privacy & compliance",
  "Week 15-16: Migration scripts",
];

const ProblemSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="relative bg-surface py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <div ref={ref} className="mx-auto max-w-5xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="mb-16 text-center"
          >
            <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
              The Problem Every Dev Team Faces
            </h2>
            <p className="text-xl text-muted-foreground">
              Your PM says: <span className="font-semibold text-foreground">"We need semantic search"</span>
            </p>
            <p className="mt-2 text-lg text-muted-foreground">
              You think: <span className="italic">"There goes the next 4 months..."</span>
            </p>
          </motion.div>

          {/* Comparison */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Old Way */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6 lg:p-8"
            >
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/20">
                  <X className="h-5 w-5 text-destructive" />
                </div>
                <h3 className="text-xl font-bold text-destructive">The Old Way</h3>
              </div>
              <div className="space-y-3">
                {oldWaySteps.map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={isInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.3, delay: 0.3 + index * 0.05 }}
                    className="flex items-center gap-3 text-sm text-muted-foreground"
                  >
                    <Clock className="h-4 w-4 shrink-0 text-destructive/60" />
                    <span>{step}</span>
                  </motion.div>
                ))}
              </div>
              <div className="mt-6 flex items-center gap-2 border-t border-destructive/20 pt-6">
                <span className="text-2xl font-bold text-destructive">= 4 MONTHS</span>
              </div>
            </motion.div>

            {/* New Way */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="rounded-2xl border border-accent/20 bg-accent/5 p-6 lg:p-8"
            >
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/20">
                  <Check className="h-5 w-5 text-accent" />
                </div>
                <h3 className="text-xl font-bold text-accent">With AI Fabric</h3>
              </div>
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.3, delay: 0.5 }}
                  className="flex items-center gap-3 rounded-lg bg-accent/10 p-4"
                >
                  <Zap className="h-5 w-5 text-accent" />
                  <span className="font-medium text-foreground">Add dependency</span>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.3, delay: 0.6 }}
                  className="flex items-center gap-3 rounded-lg bg-accent/10 p-4"
                >
                  <Zap className="h-5 w-5 text-accent" />
                  <span className="font-medium text-foreground">Add annotation</span>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.3, delay: 0.7 }}
                  className="flex items-center gap-3 rounded-lg bg-accent/10 p-4"
                >
                  <Check className="h-5 w-5 text-accent" />
                  <span className="font-medium text-foreground">Search works ✨</span>
                </motion.div>
              </div>
              <div className="mt-6 flex items-center gap-2 border-t border-accent/20 pt-6">
                <span className="text-2xl font-bold text-accent">= 5 MINUTES</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProblemSection;
