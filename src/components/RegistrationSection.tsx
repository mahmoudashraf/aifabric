import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2, CheckCircle, Mail, ShieldCheck, BellOff, Package } from "lucide-react";

const MODULE_OPTIONS = [
  { id: "ai-core", label: "AI Core", description: "Embeddings, Search, RAG" },
  { id: "behavior-analytics", label: "Behavior Analytics", description: "Churn, Sentiment" },
  { id: "migration", label: "Migration Module", description: "Bulk Indexing" },
  { id: "relationship-query", label: "Relationship Query", description: "NL to SQL" },
  { id: "web-module", label: "Web Module", description: "REST Endpoints" },
  { id: "onnx-provider", label: "ONNX Provider", description: "Free Embeddings" },
  { id: "openai-provider", label: "OpenAI Provider", description: "OpenAI Integration" },
  { id: "anthropic-provider", label: "Anthropic Provider", description: "Claude Integration" },
  { id: "vector-databases", label: "Vector Databases", description: "Lucene, Milvus, etc." },
  { id: "all", label: "All Modules", description: "Everything!" },
];

const RegistrationSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [email, setEmail] = useState("");
  const [selectedModules, setSelectedModules] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleModuleToggle = (moduleId: string) => {
    setSelectedModules((prev) =>
      prev.includes(moduleId) ? prev.filter((id) => id !== moduleId) : [...prev, moduleId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }
    
    if (selectedModules.length === 0) {
      toast.error("Please select at least one module");
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    toast.success("Thank you! We'll keep you updated.");
  };

  if (isSubmitted) {
    return (
      <section id="register" className="bg-background py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mx-auto max-w-lg rounded-2xl border border-accent/30 bg-accent/5 p-8 text-center"
          >
            <CheckCircle className="mx-auto mb-4 h-16 w-16 text-accent" />
            <h3 className="mb-2 text-2xl font-bold text-foreground">You're on the list!</h3>
            <p className="text-muted-foreground">
              We'll keep you updated on AI Fabric Framework's progress and let you know when v1.0 is ready.
            </p>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="register" className="bg-background py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <div ref={ref} className="mx-auto max-w-2xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
            className="mb-10 text-center"
          >
            <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
              Get Early Access
            </h2>
            <p className="text-lg text-muted-foreground">
              Register your interest for updates, early access, and priority consideration for the Pro License
            </p>
          </motion.div>

          {/* Form */}
          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-2xl border border-border bg-card p-6 shadow-card sm:p-8"
          >
            {/* Email */}
            <div className="mb-6">
              <Label htmlFor="email" className="mb-2 flex items-center gap-2 text-base font-medium">
                <Mail className="h-4 w-4 text-primary" />
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="developer@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-12"
              />
            </div>

            {/* Modules */}
            <div className="mb-6">
              <Label className="mb-3 flex items-center gap-2 text-base font-medium">
                <Package className="h-4 w-4 text-primary" />
                Which modules interest you?
                <span className="text-xs text-muted-foreground">(Select all that apply)</span>
              </Label>
              <div className="grid gap-3 sm:grid-cols-2">
                {MODULE_OPTIONS.map((module) => (
                  <label
                    key={module.id}
                    className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 transition-all ${
                      selectedModules.includes(module.id)
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/30"
                    }`}
                  >
                    <Checkbox
                      checked={selectedModules.includes(module.id)}
                      onCheckedChange={() => handleModuleToggle(module.id)}
                      className="mt-0.5"
                    />
                    <div>
                      <p className="font-medium text-foreground">{module.label}</p>
                      <p className="text-xs text-muted-foreground">{module.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="hero"
              size="lg"
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Registering...
                </>
              ) : (
                "Register Interest"
              )}
            </Button>

            {/* Trust Signals */}
            <div className="mt-6 flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-accent" />
                <span>No spam, just updates</span>
              </div>
              <div className="flex items-center gap-1.5">
                <BellOff className="h-4 w-4 text-accent" />
                <span>Unsubscribe anytime</span>
              </div>
            </div>
          </motion.form>

          {/* Social Proof */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-6 text-center text-sm text-muted-foreground"
          >
            Over <span className="font-semibold text-foreground">500 developers</span> already registered
          </motion.p>
        </div>
      </div>
    </section>
  );
};

export default RegistrationSection;
