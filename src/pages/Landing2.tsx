import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MessageSquare, Database, Shield, Rocket, Github, ArrowRight, BookOpen } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const chips = ["OSS", "Spring Boot starter", "Tool calling", "RAG-ready", "Streaming"];

const outcomes = [
  {
    title: "Chat + Actions",
    desc: "Expose safe tool-calling over your existing services. Auth, rate limits, audit logs.",
    icon: MessageSquare,
  },
  {
    title: "RAG Search",
    desc: "Drop-in RAG over docs + domain data. Search becomes conversational.",
    icon: Database,
  },
  {
    title: "Guardrails",
    desc: "Spring Security integration, policy checks, and configurable boundaries.",
    icon: Shield,
  },
  {
    title: "Shipping speed",
    desc: "A thin layer that avoids a rewrite. Keep your stack and your sanity.",
    icon: Rocket,
  },
];

const stats = [
  { symbol: "⭐", value: "123", label: "GitHub stars" },
  { symbol: "⬇︎", value: "4.2k", label: "Downloads" },
  { symbol: "⚡", value: "60s", label: "Demo setup" },
];

const story = [
  { title: "Problem", desc: "Users can't find answers and tickets pile up." },
  { title: "Solution", desc: "RAG over policies + tool-calling over PaymentsService." },
  { title: "Result", desc: "Fewer tickets, faster resolutions, auditable actions." },
];

export default function Landing2() {
  const heroRef = useRef(null);
  const outcomesRef = useRef(null);
  const proofRef = useRef(null);
  const useCaseRef = useRef(null);
  const howItWorksRef = useRef(null);
  const footerRef = useRef(null);

  const heroInView = useInView(heroRef, { once: true, margin: "-100px" });
  const outcomesInView = useInView(outcomesRef, { once: true, margin: "-100px" });
  const proofInView = useInView(proofRef, { once: true, margin: "-100px" });
  const useCaseInView = useInView(useCaseRef, { once: true, margin: "-100px" });
  const howItWorksInView = useInView(howItWorksRef, { once: true, margin: "-100px" });
  const footerInView = useInView(footerRef, { once: true, margin: "-100px" });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        {/* HERO */}
        <section ref={heroRef} className="bg-surface py-20 lg:py-32">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-6xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={heroInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5 }}
                className="rounded-2xl border border-border bg-card p-6 shadow-lg sm:p-8 lg:p-10"
              >
                <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
                  {/* Left */}
                  <div className="flex flex-col justify-center">
                    <h1 className="mb-4 text-3xl font-extrabold leading-tight tracking-tight text-foreground sm:text-4xl lg:text-5xl">
                      Add AI to a Spring Boot app
                      <br />
                      without turning it into spaghetti.
                    </h1>

                    <p className="mb-6 text-lg leading-relaxed text-muted-foreground">
                      AI Fabric turns your existing services into chat + RAG + actions with a tiny amount of code.
                      No rewrite. No platform meetings. Just shipping.
                    </p>

                    <div className="mb-6 flex flex-wrap gap-2">
                      {chips.map((c) => (
                        <span
                          key={c}
                          className="rounded-full border border-border bg-muted px-3 py-1 text-sm text-muted-foreground"
                        >
                          {c}
                        </span>
                      ))}
                    </div>

                    <div className="mb-4 flex flex-col gap-3 sm:flex-row">
                      <Button variant="default" size="lg" asChild>
                        <a href="https://ai-fabric.dev/docs" target="_blank" rel="noopener noreferrer">
                          Run the demo
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </a>
                      </Button>
                      <Button variant="outline" size="lg" asChild>
                        <a href="https://ai-fabric.dev/docs" target="_blank" rel="noopener noreferrer">
                          See the diff
                        </a>
                      </Button>
                    </div>

                    <p className="text-sm text-muted-foreground">
                      Works with Spring Security • Configurable providers • Auditable actions
                    </p>
                  </div>

                  {/* Right */}
                  <div className="grid gap-4">
                    <Card title="Before → After (realistic diff)">
                      <CodeWindow
                        lines={[
                          { text: "// Before", tone: "muted" },
                          { text: "class SupportController {", tone: "normal" },
                          { text: "  // glue code, wiring, prompts...", tone: "muted2" },
                          { text: "}", tone: "normal" },
                          { text: "", tone: "normal" },
                          { text: "// After", tone: "muted" },
                          { text: "@RestController", tone: "blue" },
                          { text: "@AICapable(", tone: "violet" },
                          { text: "  tools = {PaymentsService.class},", tone: "normal" },
                          { text: "  rag = @Rag(index = \"docs\")", tone: "green" },
                          { text: ")", tone: "violet" },
                          { text: "class SupportController { }", tone: "normal" },
                        ]}
                      />
                    </Card>

                    <Card title="10-second demo (GIF/video)">
                      <div className="rounded-xl border border-border bg-muted/30 p-4">
                        <div className="mb-4 flex items-center gap-2 text-xs text-muted-foreground">
                          <span className="inline-flex h-3 w-3 rounded-full bg-red-400" />
                          <span className="inline-flex h-3 w-3 rounded-full bg-amber-300" />
                          <span className="inline-flex h-3 w-3 rounded-full bg-emerald-300" />
                          <span className="ml-2">support-chat-demo.gif</span>
                        </div>

                        <div className="space-y-3">
                          <Bubble kind="user">
                            User: "Why was my payment declined?"
                          </Bubble>

                          <Bubble kind="bot">
                            Bot: "I checked your account. The card expired. Want me to update it?"
                            <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
                              <span className="rounded-full bg-primary/10 px-3 py-1 text-primary">Action: UpdateCard</span>
                              <span className="rounded-full bg-primary/10 px-3 py-1 text-primary">RAG: policy.md</span>
                            </div>
                          </Bubble>

                          <Bubble kind="bot">
                            Bot: "Done. Try again."
                            <div className="mt-2 text-xs text-muted-foreground">Action executed • Audit logged</div>
                          </Bubble>

                          <div className="mt-3 rounded-lg border border-dashed border-border bg-card px-4 py-3 text-sm text-muted-foreground">
                            Replace this with a real GIF/video once you have it. Yes, you need one.
                          </div>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* OUTCOMES */}
        <section ref={outcomesRef} className="bg-background py-20 lg:py-32">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-6xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={outcomesInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5 }}
                className="mb-12 text-center"
              >
                <h2 className="mb-4 text-3xl font-bold text-foreground sm:text-4xl lg:text-5xl">
                  What you get (outcomes, not adjectives)
                </h2>
              </motion.div>

              <div className="grid gap-6 sm:grid-cols-2">
                {outcomes.map((o, index) => (
                  <motion.div
                    key={o.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={outcomesInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.1 + index * 0.05 }}
                    className="rounded-xl border border-border bg-card p-6 shadow-sm transition-all duration-300 hover:border-primary/30 hover:shadow-lg"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <o.icon className="h-6 w-6" />
                      </div>
                      <div>
                        <h3 className="mb-2 text-lg font-semibold text-foreground">{o.title}</h3>
                        <p className="text-sm text-muted-foreground">{o.desc}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* PROOF */}
        <section ref={proofRef} className="bg-surface py-20 lg:py-32">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-6xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={proofInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5 }}
                className="rounded-2xl border border-border bg-card p-6 shadow-lg sm:p-8"
              >
                <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
                  <div>
                    <h2 className="mb-3 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Proof</h2>
                    <p className="text-muted-foreground">
                      Put real signals here: stars, adopters, benchmarks, tiny case studies. Even small proof beats vague confidence.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    {stats.map((s, index) => (
                      <motion.div
                        key={s.label}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={proofInView ? { opacity: 1, scale: 1 } : {}}
                        transition={{ duration: 0.3, delay: 0.1 + index * 0.1 }}
                        className="min-w-[140px] rounded-xl border border-border bg-muted p-4 sm:min-w-[180px]"
                      >
                        <div className="text-xl font-bold text-foreground">
                          <span className="mr-2">{s.symbol}</span>
                          {s.value}
                        </div>
                        <div className="mt-1 text-sm text-muted-foreground">{s.label}</div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* USE CASE */}
        <section ref={useCaseRef} className="bg-background py-20 lg:py-32">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-6xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={useCaseInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5 }}
                className="rounded-2xl border border-border bg-card p-6 shadow-lg sm:p-8"
              >
                <h2 className="mb-6 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  One killer use case: a support bot that can actually do things
                </h2>

                <div className="mb-6 grid gap-4 sm:grid-cols-3">
                  {story.map((s, index) => (
                    <motion.div
                      key={s.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={useCaseInView ? { opacity: 1, y: 0 } : {}}
                      transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
                      className="rounded-xl border border-border bg-muted/30 p-6"
                    >
                      <h3 className="mb-2 text-lg font-semibold text-foreground">{s.title}</h3>
                      <p className="text-sm text-muted-foreground">{s.desc}</p>
                    </motion.div>
                  ))}
                </div>

                <div className="rounded-xl bg-foreground px-6 py-4 text-background">
                  <p className="text-sm font-medium sm:text-base">
                    User → Chat → RAG (docs) → Tools (services) → Audit log
                  </p>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section ref={howItWorksRef} className="bg-surface py-20 lg:py-32">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-6xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={howItWorksInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5 }}
                className="rounded-2xl border border-border bg-card p-6 shadow-lg sm:p-8"
              >
                <h2 className="mb-6 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">How it works</h2>

                <div className="grid gap-6 lg:grid-cols-2">
                  <ol className="space-y-4">
                    {[
                      { title: "1) Add the starter", desc: "One dependency. Your build still looks like a build." },
                      { title: "2) Annotate your controller/service", desc: "Make a capability explicit: tools + RAG + policies." },
                      { title: "3) Configure providers + indexes", desc: "Pick your model and your vector store." },
                      { title: "4) Run demo endpoints", desc: "/chat • /rag/search • /tools" },
                    ].map((step, index) => (
                      <motion.li
                        key={step.title}
                        initial={{ opacity: 0, x: -20 }}
                        animate={howItWorksInView ? { opacity: 1, x: 0 } : {}}
                        transition={{ duration: 0.5, delay: 0.1 + index * 0.1 }}
                        className="rounded-xl border border-border bg-muted/30 p-5"
                      >
                        <div className="font-semibold text-foreground">{step.title}</div>
                        <div className="mt-2 text-sm text-muted-foreground">{step.desc}</div>
                      </motion.li>
                    ))}
                  </ol>

                  <div className="rounded-xl border border-code-border bg-code-bg p-4">
                    <div className="mb-3 flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="inline-flex h-3 w-3 rounded-full bg-red-400" />
                      <span className="inline-flex h-3 w-3 rounded-full bg-amber-300" />
                      <span className="inline-flex h-3 w-3 rounded-full bg-emerald-300" />
                      <span className="ml-2">copy-paste</span>
                    </div>

                    <pre className="overflow-x-auto rounded-lg bg-code-bg p-4 text-sm text-foreground">
{`dependencies {
  implementation("dev.ai-fabric:ai-fabric-starter:0.x")
}

@AICapable(tools={PaymentsService.class}, rag=@Rag(index="docs"))
class SupportController { }

// run
./mvnw spring-boot:run`}
                    </pre>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* FOOTER CTA */}
        <section ref={footerRef} className="bg-foreground py-20 lg:py-32">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-6xl">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={footerInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5 }}
                className="rounded-2xl bg-foreground p-6 text-background shadow-2xl sm:p-10"
              >
                <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
                  <div>
                    <h2 className="mb-3 text-2xl font-bold tracking-tight sm:text-3xl">Stop writing glue code. Ship the feature.</h2>
                    <p className="text-muted-foreground">
                      Run the demo locally, then decide if it deserves a place in your stack.
                    </p>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button variant="secondary" size="lg" asChild>
                      <a href="https://ai-fabric.dev/docs" target="_blank" rel="noopener noreferrer">
                        Run the demo
                      </a>
                    </Button>
                    <Button variant="secondary" size="lg" asChild>
                      <Link to="/docs">
                        <BookOpen className="mr-2 h-4 w-4" />
                        Docs
                      </Link>
                    </Button>
                  </div>
                </div>

                <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 border-t border-border/20 pt-8 text-sm text-muted-foreground">
                  <span>© {new Date().getFullYear()} AI Fabric</span>
                  <span className="opacity-60">•</span>
                  <a
                    href="https://ai-fabric.dev/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline-offset-4 hover:underline"
                  >
                    ai-fabric.dev
                  </a>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

/* ---------- Components ---------- */

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="mb-3 text-sm font-semibold text-foreground">{title}</div>
      <div>{children}</div>
    </div>
  );
}

type CodeTone = "normal" | "muted" | "muted2" | "blue" | "green" | "violet";
function CodeWindow({ lines }: { lines: { text: string; tone: CodeTone }[] }) {
  const toneClass: Record<CodeTone, string> = {
    normal: "text-foreground",
    muted: "text-muted-foreground",
    muted2: "text-muted-foreground/70",
    blue: "text-blue-400",
    green: "text-accent",
    violet: "text-secondary",
  };

  return (
    <div className="rounded-xl border border-code-border bg-code-bg p-4">
      <div className="mb-3 flex items-center gap-2 text-xs text-muted-foreground">
        <span className="inline-flex h-3 w-3 rounded-full bg-red-400" />
        <span className="inline-flex h-3 w-3 rounded-full bg-amber-300" />
        <span className="inline-flex h-3 w-3 rounded-full bg-emerald-300" />
        <span className="ml-2">diff</span>
      </div>

      <pre className="overflow-x-auto rounded-lg bg-code-bg p-4 text-sm leading-6">
        {lines.map((l, idx) => (
          <div key={idx} className={toneClass[l.tone]}>
            {l.text || " "}
          </div>
        ))}
      </pre>
    </div>
  );
}

function Bubble({ kind, children }: { kind: "user" | "bot"; children: React.ReactNode }) {
  const isBot = kind === "bot";
  return (
    <div className={`flex ${isBot ? "justify-end" : "justify-start"}`}>
      <div
        className={[
          "max-w-[85%] rounded-xl border px-4 py-3 text-sm sm:max-w-[88%]",
          isBot
            ? "border-foreground/20 bg-foreground/10 text-foreground"
            : "border-border bg-card text-foreground",
        ].join(" ")}
      >
        {children}
      </div>
    </div>
  );
}
