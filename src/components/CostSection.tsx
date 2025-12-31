import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Clock, DollarSign, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";

const costCards = [
  {
    icon: Clock,
    title: "TIME",
    mainStat: "4-6 months",
    subText: "infrastructure development",
    color: "primary",
  },
  {
    icon: DollarSign,
    title: "MONEY",
    mainStat: "$180K+",
    subText: "in labor costs",
    extraText: "$90K/year maintenance",
    color: "secondary",
  },
  {
    icon: Rocket,
    title: "OPPORTUNITY",
    mainStat: "10-15",
    subText: "features not shipped",
    extraText: "Competitors ship first",
    color: "accent",
  },
];

const CostSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="bg-background py-20 lg:py-32">
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
              What It Really Costs
            </h2>
            <p className="text-lg text-muted-foreground">
              Building AI infrastructure from scratch is expensive
            </p>
          </motion.div>

          {/* Cost Cards */}
          <div className="mb-12 grid gap-6 md:grid-cols-3">
            {costCards.map((card, index) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
                className="group rounded-2xl border border-border bg-card p-6 text-center shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-xl lg:p-8"
              >
                <div
                  className={`mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-xl ${
                    card.color === "primary"
                      ? "bg-primary/10 text-primary"
                      : card.color === "secondary"
                      ? "bg-secondary/10 text-secondary"
                      : "bg-accent/10 text-accent"
                  }`}
                >
                  <card.icon className="h-7 w-7" />
                </div>
                <p className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  {card.title}
                </p>
                <p className="mb-2 text-3xl font-bold text-foreground lg:text-4xl">
                  {card.mainStat}
                </p>
                <p className="text-sm text-muted-foreground">{card.subText}</p>
                {card.extraText && (
                  <p className="mt-2 text-sm font-medium text-muted-foreground">
                    {card.extraText}
                  </p>
                )}
              </motion.div>
            ))}
          </div>

          {/* Bottom Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-center"
          >
            <p className="mb-6 text-lg text-muted-foreground">
              And that's just for semantic search.{" "}
              <span className="text-foreground">
                What about churn prediction? Natural language queries? Behavioral analytics? RAG chatbots?
              </span>
            </p>
            <Button variant="hero" size="lg" asChild>
              <a href="#register">Register Interest</a>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CostSection;
