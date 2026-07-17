import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Check } from "lucide-react";

const communityFeatures = [
  "All core modules",
  "Full source code",
  "Apache 2.0 licensed",
  "Forever free",
  "Community support",
];

const proFeatures = [
  "Everything in CE",
  "Priority support",
  "SLA guarantees",
  "Custom modules",
  "Architecture help",
  "Training sessions",
];

const OpenSourceSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="bg-surface py-20 lg:py-32">
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
              Open Source, Forever
            </h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              AI Fabric Framework is Apache 2.0 licensed and will always remain open source and free.
            </p>
          </motion.div>

          {/* Comparison Cards */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Community Edition */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="rounded-2xl border border-border bg-card p-6 shadow-card lg:p-8"
            >
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-foreground">Community Edition</h3>
                <p className="mt-2 text-muted-foreground">For individuals and small teams</p>
              </div>
              <div className="mb-6 space-y-3">
                {communityFeatures.map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-accent" />
                    <span className="text-foreground">{feature}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-border pt-6">
                <p className="text-3xl font-bold text-foreground">$0<span className="text-lg font-normal text-muted-foreground">/month</span></p>
              </div>
            </motion.div>

            {/* Pro License */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="relative rounded-2xl border-2 border-primary bg-card p-6 shadow-xl lg:p-8"
            >
              <div className="absolute -top-3 right-6">
                <span className="rounded-full bg-primary px-3 py-1 text-xs font-semibold text-primary-foreground">
                  Coming Soon
                </span>
              </div>
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-foreground">Pro License</h3>
                <p className="mt-2 text-muted-foreground">For enterprises and scaling teams</p>
              </div>
              <div className="mb-6 space-y-3">
                {proFeatures.map((feature) => (
                  <div key={feature} className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-primary" />
                    <span className="text-foreground">{feature}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-border pt-6">
                <p className="text-xl font-bold text-foreground">Contact us</p>
              </div>
            </motion.div>
          </div>

          {/* Bottom CTA */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-8 text-center text-muted-foreground"
          >
            Using it in production? Consider contributing back to the community!
          </motion.p>
        </div>
      </div>
    </section>
  );
};

export default OpenSourceSection;
