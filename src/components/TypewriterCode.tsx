import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const codeLines = [
  { text: "@Entity", type: "annotation" },
  { text: '@AICapable(entityType = "product")', type: "annotation" },
  { text: "public class Product {", type: "keyword" },
  { text: "    // That's it. AI-powered. ✨", type: "comment" },
  { text: "}", type: "keyword" },
];

const TypewriterCode = () => {
  const [displayedLines, setDisplayedLines] = useState<number>(0);
  const [currentChar, setCurrentChar] = useState<number>(0);

  useEffect(() => {
    const lineDelay = 400;
    const charDelay = 30;

    if (displayedLines < codeLines.length) {
      const currentLine = codeLines[displayedLines].text;
      
      if (currentChar < currentLine.length) {
        const timer = setTimeout(() => {
          setCurrentChar(currentChar + 1);
        }, charDelay);
        return () => clearTimeout(timer);
      } else {
        const timer = setTimeout(() => {
          setDisplayedLines(displayedLines + 1);
          setCurrentChar(0);
        }, lineDelay);
        return () => clearTimeout(timer);
      }
    }
  }, [displayedLines, currentChar]);

  const getLineColor = (type: string) => {
    switch (type) {
      case "annotation":
        return "text-yellow-400";
      case "keyword":
        return "text-blue-400";
      case "comment":
        return "text-emerald-400";
      default:
        return "text-slate-300";
    }
  };

  return (
    <motion.div
      className="mx-auto max-w-xl overflow-hidden rounded-xl border border-code-border bg-code-bg shadow-2xl"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Window Header */}
      <div className="flex items-center gap-2 border-b border-code-border bg-code-bg/80 px-4 py-3">
        <div className="h-3 w-3 rounded-full bg-red-500/80" />
        <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
        <div className="h-3 w-3 rounded-full bg-green-500/80" />
        <span className="ml-3 text-xs text-muted-foreground">Product.java</span>
      </div>

      {/* Code Content */}
      <div className="p-4 font-mono text-sm leading-relaxed sm:p-6 sm:text-base">
        {codeLines.map((line, lineIndex) => (
          <div
            key={lineIndex}
            className={`flex ${getLineColor(line.type)} ${
              lineIndex > displayedLines ? "opacity-0" : "opacity-100"
            } transition-opacity duration-200`}
          >
            <span className="mr-4 select-none text-muted-foreground/50">
              {(lineIndex + 1).toString().padStart(2, "0")}
            </span>
            <span>
              {lineIndex < displayedLines
                ? line.text
                : lineIndex === displayedLines
                ? line.text.slice(0, currentChar)
                : ""}
              {lineIndex === displayedLines && (
                <span className="ml-0.5 inline-block h-5 w-2 animate-blink bg-primary" />
              )}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default TypewriterCode;
