import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Github, Star, Zap, ArrowRight } from "lucide-react";
import TypewriterCode from "./TypewriterCode";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-hero pt-16">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-glow" />
      
      {/* Decorative Elements */}
      <div className="pointer-events-none absolute left-1/2 top-20 h-[500px] w-[800px] -translate-x-1/2 opacity-30">
        <div className="absolute left-1/4 top-1/4 h-72 w-72 rounded-full bg-primary/20 blur-[100px]" />
        <div className="absolute right-1/4 top-1/3 h-64 w-64 rounded-full bg-secondary/20 blur-[100px]" />
      </div>

      <div className="container relative mx-auto px-4 py-20 lg:py-32">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-1.5 text-sm font-medium text-accent"
          >
            <Zap className="h-4 w-4" />
            <span>Open Source Spring Boot Framework</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-6 text-4xl font-extrabold leading-tight tracking-tight text-foreground sm:text-5xl lg:text-6xl"
          >
            Stop Building AI Infrastructure.
            <br />
            <span className="text-gradient">Start Building AI Features.</span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mx-auto mb-10 max-w-2xl text-lg text-muted-foreground sm:text-xl"
          >
            Add semantic search, embeddings, RAG, and behavioral analytics to your Spring Boot app with one annotation.
          </motion.p>

          {/* Code Example */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mb-10"
          >
            <TypewriterCode />
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
          >
            <Button variant="hero" size="xl" asChild>
              <a href="#register" className="group">
                Register Interest
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </a>
            </Button>
            <Button variant="hero-outline" size="xl" asChild>
              <a href="https://github.com/mahmoudashraf/AI-Fabric-Framework" target="_blank" rel="noopener noreferrer">
                <Github className="h-5 w-5" />
                View on GitHub
              </a>
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-12 flex items-center justify-center gap-6 text-sm text-muted-foreground"
          >
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-yellow-500" fill="currentColor" />
              <span className="font-medium">2.5K stars on GitHub</span>
            </div>
            <div className="h-4 w-px bg-border" />
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 animate-pulse rounded-full bg-accent" />
              <span className="font-medium">Active Development</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default HeroSection;
