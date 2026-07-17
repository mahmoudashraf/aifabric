import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Star, Eye, GitFork, Github, MessageCircle, Quote, Code2, Rocket, Lightbulb, LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

const testimonials: { quote: string; icon: LucideIcon }[] = [
  {
    quote: "Finally! Someone solving the AI infrastructure problem properly. This is what Spring Boot did for web apps.",
    icon: Code2,
  },
  {
    quote: "We were about to spend 6 months building this. Now we're just waiting for v1.0.",
    icon: Rocket,
  },
  {
    quote: "The annotation-driven approach is genius. This is how AI integration should be.",
    icon: Lightbulb,
  },
];

const CommunitySection = () => {
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
              Join the Community
            </h2>
          </motion.div>

          {/* GitHub Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-12 flex flex-wrap justify-center gap-4"
          >
            <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-6 py-4 shadow-card">
              <Star className="h-6 w-6 text-yellow-500" fill="currentColor" />
              <span className="text-muted-foreground">Star us on GitHub</span>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-6 py-4 shadow-card">
              <Eye className="h-6 w-6 text-primary" />
              <span className="text-muted-foreground">Watch for updates</span>
            </div>
            <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-6 py-4 shadow-card">
              <GitFork className="h-6 w-6 text-accent" />
              <span className="text-muted-foreground">Fork & contribute</span>
            </div>
          </motion.div>

          {/* Testimonials */}
          <div className="mb-12 grid gap-6 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                className="relative rounded-2xl border border-border bg-card p-6 shadow-card"
              >
                <Quote className="absolute right-6 top-6 h-8 w-8 text-primary/10" />
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <testimonial.icon className="h-5 w-5 text-primary" />
                </div>
                <p className="text-foreground">{testimonial.quote}</p>
              </motion.div>
            ))}
          </div>

          {/* Social Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <Button variant="github" size="lg" asChild>
              <a href="https://github.com/Loom-AI-Labs/ai-fabric-framework" target="_blank" rel="noopener noreferrer">
                <Github className="h-5 w-5" />
                Star on GitHub
              </a>
            </Button>
            <Button variant="hero-outline" size="lg" asChild>
              <a href="#" target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-5 w-5" />
                Join Discord
              </a>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default CommunitySection;
