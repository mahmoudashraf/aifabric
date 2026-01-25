/**
 * MaxAI Standalone Page
 * 
 * This is a self-contained page designed to be easily copied to a separate
 * Lovable project for subdomain deployment (e.g., maxai.ai-fabric.dev).
 * 
 * To use in a separate project:
 * 1. Copy this file and src/pages/demos/MaxMode.tsx to the new project
 * 2. Copy the required UI components (Card, Button, Textarea, Badge, etc.)
 * 3. Set up the route in App.tsx: <Route path="/" element={<MaxAIStandalone />} />
 * 4. Configure the custom domain/subdomain in project settings
 */

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Sparkles,
  Bot,
  Maximize2,
  ExternalLink,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import MaxMode from "./demos/MaxMode";

const MaxAIStandalone = () => {
  const [isMaxModeOpen, setIsMaxModeOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50/30 to-pink-50/20 dark:from-gray-900 dark:via-purple-900/10 dark:to-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-gray-900/80 border-b border-purple-200/50 dark:border-purple-800/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo & Brand */}
            <div className="flex items-center gap-3">
              <motion.div
                className="relative"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 via-pink-500 to-purple-700 flex items-center justify-center shadow-lg shadow-purple-500/30">
                  <Bot className="h-6 w-6 text-white" />
                </div>
                <motion.div
                  className="absolute -top-1 -right-1"
                  animate={{ 
                    scale: [1, 1.2, 1],
                    rotate: [0, 10, -10, 0]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                >
                  <Sparkles className="h-4 w-4 text-yellow-400" />
                </motion.div>
              </motion.div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  MaxAI
                </h1>
                <p className="text-[10px] text-muted-foreground -mt-0.5">
                  AI Shopping Assistant
                </p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-4">
              <Link to="/">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to AI Fabric
                </Button>
              </Link>
              <a 
                href="https://ai-fabric.dev" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="sm" className="gap-2">
                  <ExternalLink className="h-4 w-4" />
                  Learn More
                </Button>
              </a>
            </nav>

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-purple-200/50 dark:border-purple-800/30"
            >
              <div className="px-4 py-3 space-y-2">
                <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button variant="ghost" size="sm" className="w-full justify-start gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Back to AI Fabric
                  </Button>
                </Link>
                <a 
                  href="https://ai-fabric.dev" 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <Button variant="outline" size="sm" className="w-full justify-start gap-2">
                    <ExternalLink className="h-4 w-4" />
                    Learn More
                  </Button>
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content - MaxMode fills the rest of the viewport */}
      <main className="relative">
        {!isMaxModeOpen ? (
          <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] p-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center max-w-md"
            >
              <motion.div
                className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-purple-600 via-pink-500 to-purple-700 flex items-center justify-center shadow-2xl shadow-purple-500/30"
                animate={{
                  boxShadow: [
                    "0 25px 50px -12px rgba(147, 51, 234, 0.3)",
                    "0 25px 50px -12px rgba(236, 72, 153, 0.3)",
                    "0 25px 50px -12px rgba(147, 51, 234, 0.3)",
                  ],
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <Bot className="h-12 w-12 text-white" />
              </motion.div>
              <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                MaxAI Mode
              </h2>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                Your intelligent AI shopping assistant. Ask questions, search products, 
                manage orders, and get personalized recommendations.
              </p>
              <Button
                onClick={() => setIsMaxModeOpen(true)}
                size="lg"
                className="gap-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-purple-500/30"
              >
                <Maximize2 className="h-5 w-5" />
                Launch MaxAI
                <Sparkles className="h-5 w-5" />
              </Button>
            </motion.div>
          </div>
        ) : (
          <MaxMode isOpen={isMaxModeOpen} onClose={() => setIsMaxModeOpen(false)} />
        )}
      </main>

      {/* Footer - Only show when MaxMode is closed */}
      {!isMaxModeOpen && (
        <footer className="border-t border-purple-200/50 dark:border-purple-800/30 py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-muted-foreground">
                Powered by{" "}
                <a 
                  href="https://ai-fabric.dev" 
                  className="font-medium text-purple-600 hover:text-purple-700"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  AI Fabric Framework
                </a>
              </p>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>Built with ❤️ and AI</span>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default MaxAIStandalone;
