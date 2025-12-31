import { motion } from "framer-motion";
import { Github, Star, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-lg"
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-primary">
              <span className="text-lg font-bold text-primary-foreground">AI</span>
            </div>
            <span className="text-xl font-bold text-foreground">Fabric</span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-6 md:flex">
            <a href="#features" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              Features
            </a>
            <a href="#modules" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              Modules
            </a>
            <a href="#how-it-works" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              How It Works
            </a>
            <a href="#register" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              Register
            </a>
          </div>

          {/* CTA Buttons */}
          <div className="hidden items-center gap-3 md:flex">
            <Button variant="github" size="sm" asChild>
              <a href="https://github.com/mahmoudashraf/AI-Fabric-Framework" target="_blank" rel="noopener noreferrer">
                <Github className="h-4 w-4" />
                <Star className="h-3.5 w-3.5" />
                <span>2.5K</span>
              </a>
            </Button>
            <Button variant="hero" size="sm" asChild>
              <a href="#register">Register Interest</a>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-border md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="border-t border-border py-4 md:hidden"
          >
            <div className="flex flex-col gap-4">
              <a href="#features" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                Features
              </a>
              <a href="#modules" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                Modules
              </a>
              <a href="#how-it-works" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                How It Works
              </a>
              <a href="#register" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                Register
              </a>
              <div className="flex gap-3 pt-2">
                <Button variant="github" size="sm" asChild>
                  <a href="https://github.com/mahmoudashraf/AI-Fabric-Framework" target="_blank" rel="noopener noreferrer">
                    <Github className="h-4 w-4" />
                    <Star className="h-3.5 w-3.5" />
                    <span>2.5K</span>
                  </a>
                </Button>
                <Button variant="hero" size="sm" asChild>
                  <a href="#register">Register Interest</a>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;
