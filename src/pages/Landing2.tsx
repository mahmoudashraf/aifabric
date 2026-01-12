import { Link } from "react-router-dom";

const navLinks = [
  { label: "Docs", href: "https://ai-fabric.dev/docs" },
  { label: "GitHub", href: "https://github.com/mahmoudashraf/AI-Fabric-Framework" },
  { label: "Demo", href: "https://ai-fabric.dev/docs" },
  { label: "Roadmap", href: "https://ai-fabric.dev/docs" },
];

const chips = ["OSS", "Spring Boot starter", "Tool calling", "RAG-ready", "Streaming"];

const outcomes = [
  {
    title: "Chat + Actions",
    desc: "Expose safe tool-calling over your existing services. Auth, rate limits, audit logs.",
    icon: ChatIcon,
  },
  {
    title: "RAG Search",
    desc: "Drop-in RAG over docs + domain data. Search becomes conversational.",
    icon: DatabaseIcon,
  },
  {
    title: "Guardrails",
    desc: "Spring Security integration, policy checks, and configurable boundaries.",
    icon: ShieldIcon,
  },
  {
    title: "Shipping speed",
    desc: "A thin layer that avoids a rewrite. Keep your stack and your sanity.",
    icon: RocketIcon,
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
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* Background blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-28 -top-24 h-[520px] w-[520px] rounded-full bg-blue-400/25 blur-3xl" />
        <div className="absolute -right-24 top-28 h-[620px] w-[620px] rounded-full bg-emerald-300/20 blur-3xl" />
        <div className="absolute right-24 top-[980px] h-[680px] w-[680px] rounded-full bg-violet-400/15 blur-3xl" />
        <div className="absolute left-24 top-[1500px] h-[680px] w-[680px] rounded-full bg-orange-300/10 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 pb-24 pt-8">
        <TopNav />

        {/* HERO */}
        <section className="mt-10 rounded-3xl border border-slate-200/80 bg-white/80 p-8 shadow-[0_18px_60px_-30px_rgba(15,23,42,0.25)] backdrop-blur">
          <div className="grid gap-10 lg:grid-cols-2">
            {/* Left */}
            <div className="pt-2">
              <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl">
                Add AI to a Spring Boot app
                <br />
                without turning it into spaghetti.
              </h1>

              <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-600">
                AI Fabric turns your existing services into chat + RAG + actions with a tiny amount of code.
                No rewrite. No platform meetings. Just shipping.
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                {chips.map((c) => (
                  <span
                    key={c}
                    className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-1 text-sm text-slate-600 shadow-sm"
                  >
                    {c}
                  </span>
                ))}
              </div>

              <div className="mt-7 flex flex-wrap gap-3">
                <PrimaryButton href="https://ai-fabric.dev/docs">Run the demo</PrimaryButton>
                <SecondaryButton href="https://ai-fabric.dev/docs">See the diff</SecondaryButton>
              </div>

              <p className="mt-5 text-sm text-slate-500">
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
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="inline-flex h-3 w-3 rounded-full bg-red-400" />
                    <span className="inline-flex h-3 w-3 rounded-full bg-amber-300" />
                    <span className="inline-flex h-3 w-3 rounded-full bg-emerald-300" />
                    <span className="ml-2">support-chat-demo.gif</span>
                  </div>

                  <div className="mt-4 space-y-3">
                    <Bubble kind="user">
                      User: "Why was my payment declined?"
                    </Bubble>

                    <Bubble kind="bot">
                      Bot: "I checked your account. The card expired. Want me to update it?"
                      <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-300">
                        <span className="rounded-full bg-white/10 px-3 py-1">Action: UpdateCard</span>
                        <span className="rounded-full bg-white/10 px-3 py-1">RAG: policy.md</span>
                      </div>
                    </Bubble>

                    <Bubble kind="bot">
                      Bot: "Done. Try again."
                      <div className="mt-2 text-xs text-slate-300">Action executed • Audit logged</div>
                    </Bubble>

                    <div className="mt-3 rounded-xl border border-dashed border-slate-300 bg-white px-4 py-3 text-sm text-slate-500">
                      Replace this with a real GIF/video once you have it. Yes, you need one.
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* OUTCOMES */}
        <section className="mt-16">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            What you get (outcomes, not adjectives)
          </h2>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {outcomes.map((o) => (
              <div
                key={o.title}
                className="rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-[0_18px_60px_-40px_rgba(15,23,42,0.25)] backdrop-blur"
              >
                <div className="flex items-start gap-3">
                  <div className="mt-1 rounded-2xl border border-slate-200 bg-slate-50 p-2">
                    <o.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">{o.title}</h3>
                    <p className="mt-2 text-slate-600">{o.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* PROOF */}
        <section className="mt-14 rounded-3xl border border-slate-200 bg-white/80 p-8 shadow-[0_18px_60px_-40px_rgba(15,23,42,0.25)] backdrop-blur">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">Proof</h2>
              <p className="mt-3 text-slate-600">
                Put real signals here: stars, adopters, benchmarks, tiny case studies. Even small proof beats vague confidence.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="w-[180px] rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm"
                >
                  <div className="text-xl font-bold text-slate-900">
                    <span className="mr-2">{s.symbol}</span>
                    {s.value}
                  </div>
                  <div className="mt-1 text-sm text-slate-500">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* USE CASE */}
        <section className="mt-14 rounded-3xl border border-slate-200 bg-white/80 p-8 shadow-[0_18px_60px_-40px_rgba(15,23,42,0.25)] backdrop-blur">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            One killer use case: a support bot that can actually do things
          </h2>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {story.map((s) => (
              <div key={s.title} className="rounded-3xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
                <h3 className="text-lg font-semibold text-slate-900">{s.title}</h3>
                <p className="mt-2 text-slate-600">{s.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-2xl bg-slate-900 px-6 py-4 text-slate-100 shadow-sm">
            <p className="text-sm sm:text-base">
              User → Chat → RAG (docs) → Tools (services) → Audit log
            </p>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="mt-14 rounded-3xl border border-slate-200 bg-white/80 p-8 shadow-[0_18px_60px_-40px_rgba(15,23,42,0.25)] backdrop-blur">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">How it works</h2>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <ol className="space-y-5">
              <Step
                title="1) Add the starter"
                desc="One dependency. Your build still looks like a build."
              />
              <Step
                title="2) Annotate your controller/service"
                desc="Make a capability explicit: tools + RAG + policies."
              />
              <Step
                title="3) Configure providers + indexes"
                desc="Pick your model and your vector store."
              />
              <Step
                title="4) Run demo endpoints"
                desc="/chat • /rag/search • /tools"
              />
            </ol>

            <div className="rounded-2xl border border-slate-700 bg-slate-900 p-4">
              <div className="mb-3 flex items-center gap-2 text-xs text-slate-400">
                <span className="inline-flex h-3 w-3 rounded-full bg-red-400" />
                <span className="inline-flex h-3 w-3 rounded-full bg-amber-300" />
                <span className="inline-flex h-3 w-3 rounded-full bg-emerald-300" />
                <span className="ml-2">copy-paste</span>
              </div>

              <pre className="overflow-x-auto rounded-xl bg-slate-950 p-4 text-sm text-slate-100">
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
        </section>

        {/* FOOTER CTA */}
        <section className="mt-14 rounded-3xl bg-slate-900 p-10 text-white shadow-[0_18px_60px_-40px_rgba(15,23,42,0.45)]">
          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Stop writing glue code. Ship the feature.</h2>
              <p className="mt-3 text-slate-200">
                Run the demo locally, then decide if it deserves a place in your stack.
              </p>
            </div>

            <div className="flex gap-3">
              <SecondaryButton href="https://ai-fabric.dev/docs">Run the demo</SecondaryButton>
              <SecondaryButton href="https://ai-fabric.dev/docs">Docs</SecondaryButton>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-300">
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
        </section>
      </div>
    </main>
  );
}

/* ---------- Components ---------- */

function TopNav() {
  return (
    <header className="rounded-2xl border border-slate-200 bg-white/80 px-6 py-4 shadow-[0_18px_60px_-40px_rgba(15,23,42,0.2)] backdrop-blur">
      <div className="flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-3">
          <div className="relative h-10 w-10">
            <span className="absolute inset-0 rounded-full bg-blue-500" />
            <span className="absolute left-3 top-2 h-10 w-10 rounded-full bg-emerald-300 mix-blend-multiply" />
          </div>
          <div className="text-lg font-bold text-slate-900">AI Fabric</div>
        </Link>

        <nav className="hidden items-center gap-2 sm:flex">
          {navLinks.map((l) => (
            <a
              key={l.label}
              href={l.href}
              target={l.href.startsWith("http") ? "_blank" : undefined}
              rel={l.href.startsWith("http") ? "noopener noreferrer" : undefined}
              className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-600 shadow-sm hover:bg-white"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <a
          href="https://ai-fabric.dev/docs"
          className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
        >
          Run demo
        </a>
      </div>
    </header>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_18px_60px_-45px_rgba(15,23,42,0.25)]">
      <div className="text-sm font-semibold text-slate-900">{title}</div>
      <div className="mt-3">{children}</div>
    </div>
  );
}

type CodeTone = "normal" | "muted" | "muted2" | "blue" | "green" | "violet";
function CodeWindow({ lines }: { lines: { text: string; tone: CodeTone }[] }) {
  const toneClass: Record<CodeTone, string> = {
    normal: "text-slate-100",
    muted: "text-slate-300",
    muted2: "text-slate-400",
    blue: "text-blue-300",
    green: "text-emerald-300",
    violet: "text-violet-300",
  };

  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-900 p-4">
      <div className="mb-3 flex items-center gap-2 text-xs text-slate-400">
        <span className="inline-flex h-3 w-3 rounded-full bg-red-400" />
        <span className="inline-flex h-3 w-3 rounded-full bg-amber-300" />
        <span className="inline-flex h-3 w-3 rounded-full bg-emerald-300" />
        <span className="ml-2">diff</span>
      </div>

      <pre className="overflow-x-auto rounded-xl bg-slate-950 p-4 text-sm leading-6">
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
          "max-w-[88%] rounded-2xl border px-4 py-3 text-sm",
          isBot
            ? "border-slate-900 bg-slate-900 text-white"
            : "border-slate-200 bg-white text-slate-900",
        ].join(" ")}
      >
        {children}
      </div>
    </div>
  );
}

function Step({ title, desc }: { title: string; desc: string }) {
  return (
    <li className="rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
      <div className="font-semibold text-slate-900">{title}</div>
      <div className="mt-2 text-slate-600">{desc}</div>
    </li>
  );
}

function PrimaryButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      className="inline-flex items-center justify-center rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-slate-800"
    >
      {children}
    </a>
  );
}

function SecondaryButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
      className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow-sm hover:bg-slate-50"
    >
      {children}
    </a>
  );
}

/* ---------- Icons (inline SVG) ---------- */

function IconBase({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      {children}
    </svg>
  );
}

function ChatIcon({ className }: { className?: string }) {
  return (
    <IconBase className={className}>
      <path
        d="M7 8.5h10M7 12h7"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M5 18l2.2-2H16a4 4 0 004-4V9a4 4 0 00-4-4H8A4 4 0 004 9v8a1 1 0 001 1z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </IconBase>
  );
}

function DatabaseIcon({ className }: { className?: string }) {
  return (
    <IconBase className={className}>
      <ellipse
        cx="12"
        cy="6.5"
        rx="7"
        ry="3"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M5 6.5v10c0 1.7 3.1 3 7 3s7-1.3 7-3v-10"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M5 11c0 1.7 3.1 3 7 3s7-1.3 7-3"
        stroke="currentColor"
        strokeWidth="2"
      />
    </IconBase>
  );
}

function ShieldIcon({ className }: { className?: string }) {
  return (
    <IconBase className={className}>
      <path
        d="M12 3l8 4v6c0 5-3.4 8.4-8 9-4.6-.6-8-4-8-9V7l8-4z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M9 12l2 2 4-5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </IconBase>
  );
}

function RocketIcon({ className }: { className?: string }) {
  return (
    <IconBase className={className}>
      <path
        d="M14 4c3 1 5 4 5 7-3 1-6 0-8-2-2-2-3-5-2-8 2-1 4 0 5 3z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M10 10l-5 5v4h4l5-5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M7.5 16.5l-1 2.5 2.5-1"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </IconBase>
  );
}
