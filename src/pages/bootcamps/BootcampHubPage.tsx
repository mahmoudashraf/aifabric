import { useQuery } from "@tanstack/react-query";
import {
  ArrowRight,
  BookOpenCheck,
  Code2,
  FlaskConical,
  GraduationCap,
  MessageCircleMore,
  ShieldCheck,
  UsersRound,
} from "lucide-react";
import { Link } from "react-router-dom";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

import { listBootcamps } from "./api/bootcampApi";
import { BootcampBenefits } from "./components/BootcampBenefits";
import { BootcampLayout } from "./components/BootcampLayout";
import { BootcampStatusBadge } from "./components/BootcampStatusBadge";
import { teachingLanguageLabel } from "./lib/bootcampLabels";

const programSteps = [
  { icon: GraduationCap, title: "Learn live", description: "Instructor-led architecture and implementation sessions." },
  { icon: FlaskConical, title: "Build in labs", description: "Guided work against real Spring Boot application boundaries." },
  { icon: BookOpenCheck, title: "Finish a capstone", description: "Apply the framework with review and project guidance." },
];

const BootcampHubPage = () => {
  const bootcamps = useQuery({ queryKey: ["bootcamps"], queryFn: listBootcamps });

  return (
    <BootcampLayout>
      <section className="relative overflow-hidden border-b border-slate-800 bg-slate-950 px-5 py-12 text-white sm:px-8 lg:py-16">
        <img
          src="/brand/ai-fabric-logo-mark-square.png"
          alt=""
          className="pointer-events-none absolute -right-16 -top-24 h-96 w-96 opacity-[0.08] mix-blend-screen"
        />
        <div className="relative mx-auto max-w-7xl">
          <Badge className="border-blue-300/30 bg-blue-300/10 text-blue-100" variant="outline">
            <UsersRound className="mr-1 h-3.5 w-3.5" />
            Instructor-guided learning
          </Badge>
          <h1 className="mt-5 max-w-4xl text-3xl font-black leading-tight tracking-normal sm:text-4xl lg:text-5xl">
            Build AI-enabled Java applications with guidance from the framework maintainer.
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-slate-300 sm:text-lg">
            Move through live lectures, implementation labs, and a supported capstone while learning how
            AI Fabric fits real Spring Boot applications.
          </p>
          <div className="mt-7 flex flex-wrap gap-3 text-sm text-slate-300">
            <span className="inline-flex items-center gap-2"><Code2 className="h-4 w-4 text-blue-300" />Java and Spring Boot</span>
            <span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-emerald-300" />Governed AI workflows</span>
            <span className="inline-flex items-center gap-2"><MessageCircleMore className="h-4 w-4 text-cyan-300" />Cohort communication</span>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 lg:py-14">
        <section className="grid gap-4 border-b border-border pb-10 md:grid-cols-3" aria-label="Bootcamp format">
          {programSteps.map(({ icon: Icon, title, description }, index) => (
            <div key={title} className="flex gap-4 border-l-4 border-blue-600 bg-white px-5 py-5 shadow-sm">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-blue-50 text-blue-700">
                <Icon className="h-4 w-4" />
              </span>
              <div>
                <p className="text-xs font-bold uppercase text-slate-400">Step {index + 1}</p>
                <h2 className="mt-1 font-bold text-slate-950">{title}</h2>
                <p className="mt-1 text-sm leading-6 text-slate-600">{description}</p>
              </div>
            </div>
          ))}
        </section>

        <section className="py-10" aria-labelledby="cohorts-heading">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-bold uppercase text-blue-700">Available cohorts</p>
              <h2 id="cohorts-heading" className="mt-2 text-2xl font-bold tracking-normal text-slate-950">
                Choose your teaching language
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
                Both cohorts use the same English course title, Java code, APIs, and technical terminology.
                The teaching and live guidance use the language shown below.
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link to="/course">Explore the self-paced course</Link>
            </Button>
          </div>

          {bootcamps.isPending && (
            <div className="mt-7 grid gap-5 lg:grid-cols-2" aria-label="Loading bootcamp cohorts">
              <Skeleton className="h-96 rounded-md" />
              <Skeleton className="h-96 rounded-md" />
            </div>
          )}

          {bootcamps.isError && (
            <Alert variant="destructive" className="mt-7 rounded-md">
              <AlertTitle>Bootcamp registration is unavailable</AlertTitle>
              <AlertDescription>
                The cohort service did not respond. No local fallback is being shown; please retry shortly.
              </AlertDescription>
            </Alert>
          )}

          {bootcamps.data && (
            <div className="mt-7 grid gap-5 lg:grid-cols-2">
              {bootcamps.data.map((bootcamp) => (
                <article
                  key={bootcamp.id}
                  className="flex min-h-[390px] flex-col rounded-md border border-border bg-white p-6 shadow-sm sm:p-7"
                >
                  <BootcampStatusBadge bootcamp={bootcamp} />
                  <p className="mt-6 text-xs font-bold uppercase text-blue-700">{bootcamp.cohortLabel}</p>
                  <h3 className="mt-2 text-2xl font-bold leading-tight tracking-normal text-slate-950">
                    {bootcamp.title}
                  </h3>
                  <p className="mt-4 text-sm leading-6 text-slate-600">{bootcamp.description}</p>
                  <div className="my-6 border-y border-border py-5">
                    <BootcampBenefits benefits={bootcamp.benefits} />
                  </div>
                  <div className="mt-auto flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                      <p className="text-xs font-semibold uppercase text-slate-400">Delivery</p>
                      <p className="mt-1 text-sm font-semibold text-slate-800">
                        {teachingLanguageLabel(bootcamp.teachingLanguage)}
                      </p>
                    </div>
                    <Button asChild className={bootcamp.status === "active" ? "bg-blue-700 hover:bg-blue-800" : ""}>
                      <Link to={`/bootcamps/${bootcamp.slug}`}>
                        {bootcamp.enrolled
                          ? "View enrollment"
                          : bootcamp.registrationMode === "invitation"
                            ? "Join with invitation"
                            : "Register interest"}
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </BootcampLayout>
  );
};

export default BootcampHubPage;
