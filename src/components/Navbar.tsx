import { motion } from "framer-motion";
import { CalendarCheck, CalendarDays, Github, GraduationCap, Menu, X, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useCallback } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import BrandLogo from "@/components/BrandLogo";
interface HashLinkProps {
  to: string;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const HashLink = ({ to, children, className, onClick }: HashLinkProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      onClick?.();

      // Check if it's a hash link to the home page
      if (to.startsWith("/#")) {
        const hash = to.substring(2); // Remove "/#"
        
        // If already on home page, just scroll
        if (location.pathname === "/") {
          const element = document.getElementById(hash);
          if (element) {
            element.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        } else {
          // Navigate to home then scroll
          navigate("/");
          setTimeout(() => {
            const element = document.getElementById(hash);
            if (element) {
              element.scrollIntoView({ behavior: "smooth", block: "start" });
            }
          }, 100);
        }
      } else {
        navigate(to);
      }
    },
    [to, navigate, location.pathname, onClick]
  );

  return (
    <a href={to} onClick={handleClick} className={className}>
      {children}
    </a>
  );
};

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

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
          <Link 
            to="/" 
            className="flex items-center"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <BrandLogo />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-6 md:flex">
            <HashLink to="/#live-demos" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              Live Demos
            </HashLink>
            <Link to="/course" className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              <GraduationCap className="h-4 w-4" />
              Course
            </Link>
            <Link to="/docs" className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              <BookOpen className="h-4 w-4" />
              Docs
            </Link>
            <Link to="/webinars" className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              <CalendarDays className="h-4 w-4" />
              Webinars
            </Link>
            <Link to="/consultation" className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
              <CalendarCheck className="h-4 w-4" />
              Maintainer Session
            </Link>
          </div>

          {/* CTA Buttons */}
          <div className="hidden items-center gap-3 md:flex">
            <Button variant="github" size="sm" asChild>
              <a href="https://github.com/Loom-AI-Labs/ai-fabric-framework" target="_blank" rel="noopener noreferrer">
                <Github className="h-4 w-4" />
                Star on GitHub
              </a>
            </Button>
            <Button variant="hero" size="sm" asChild>
              <Link to="/consultation" className="flex items-center gap-2">
                View Times
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
              <HashLink to="/#live-demos" onClick={closeMenu} className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                Live Demos
              </HashLink>
              <Link to="/course" onClick={closeMenu} className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                <GraduationCap className="h-4 w-4" />
                Course
              </Link>
              <Link to="/docs" onClick={closeMenu} className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                <BookOpen className="h-4 w-4" />
                Docs
              </Link>
              <Link to="/webinars" onClick={closeMenu} className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                <CalendarDays className="h-4 w-4" />
                Webinars
              </Link>
              <Link to="/consultation" onClick={closeMenu} className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                <CalendarCheck className="h-4 w-4" />
                Maintainer Session
              </Link>
              <div className="flex gap-3 pt-2">
                <Button variant="github" size="sm" asChild>
                  <a href="https://github.com/Loom-AI-Labs/ai-fabric-framework" target="_blank" rel="noopener noreferrer">
                    <Github className="h-4 w-4" />
                    Star on GitHub
                  </a>
                </Button>
                <Button variant="hero" size="sm" asChild>
                  <Link to="/consultation" onClick={closeMenu} className="flex items-center gap-2">
                    View Times
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
