import { motion } from "framer-motion";
import { Github, Menu, X, Users, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [registrationCount, setRegistrationCount] = useState<number | null>(null);

  useEffect(() => {
    const fetchCount = async () => {
      const { data, error } = await supabase.rpc("get_registration_count");
      if (!error && data !== null) {
        setRegistrationCount(data);
      }
    };
    fetchCount();
  }, []);

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
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-primary">
              <span className="text-lg font-bold text-primary-foreground">AI</span>
            </div>
            <span className="text-xl font-bold text-foreground">Fabric</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-6 md:flex">
            <Link to="/#features" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              Features
            </Link>
            <Link to="/#modules" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              Modules
            </Link>
            <Link to="/#how-it-works" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              How It Works
            </Link>
            <Link to="/docs" className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              <BookOpen className="h-4 w-4" />
              Docs
            </Link>
            <Link to="/#register" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              Register
            </Link>
          </div>

          {/* CTA Buttons */}
          <div className="hidden items-center gap-3 md:flex">
            <Button variant="github" size="sm" asChild>
              <a href="https://github.com/mahmoudashraf/AI-Fabric-Framework" target="_blank" rel="noopener noreferrer">
                <Github className="h-4 w-4" />
                Star on GitHub
              </a>
            </Button>
            <Button variant="hero" size="sm" asChild>
              <Link to="/#register" className="flex items-center gap-2">
                Register Interest
                {registrationCount !== null && registrationCount > 0 && (
                  <span className="flex items-center gap-1 rounded-full bg-primary-foreground/20 px-2 py-0.5 text-xs">
                    <Users className="h-3 w-3" />
                    {registrationCount}
                  </span>
                )}
              </Link>
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
              <Link to="/#features" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                Features
              </Link>
              <Link to="/#modules" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                Modules
              </Link>
              <Link to="/#how-it-works" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                How It Works
              </Link>
              <Link to="/docs" className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                <BookOpen className="h-4 w-4" />
                Docs
              </Link>
              <Link to="/#register" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                Register
              </Link>
              <div className="flex gap-3 pt-2">
                <Button variant="github" size="sm" asChild>
                  <a href="https://github.com/mahmoudashraf/AI-Fabric-Framework" target="_blank" rel="noopener noreferrer">
                    <Github className="h-4 w-4" />
                    Star on GitHub
                  </a>
                </Button>
                <Button variant="hero" size="sm" asChild>
                  <Link to="/#register" className="flex items-center gap-2">
                    Register
                    {registrationCount !== null && registrationCount > 0 && (
                      <span className="flex items-center gap-1 rounded-full bg-primary-foreground/20 px-2 py-0.5 text-xs">
                        {registrationCount}
                      </span>
                    )}
                  </Link>
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
