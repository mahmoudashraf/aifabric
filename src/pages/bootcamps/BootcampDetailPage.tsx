import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, Code2, Languages, Loader2, MessageCircleMore, UsersRound } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useCourseAuth } from "@/pages/course/hooks/useCourseAuth";

import { getMyBootcampEnrollment, listBootcamps } from "./api/bootcampApi";
import { BootcampBenefits } from "./components/BootcampBenefits";
import { BootcampEnrollmentConfirmation } from "./components/BootcampEnrollmentConfirmation";
import { BootcampInterestForm } from "./components/BootcampInterestForm";
import { BootcampInvitationForm } from "./components/BootcampInvitationForm";
import { BootcampLayout } from "./components/BootcampLayout";
import { BootcampStatusBadge } from "./components/BootcampStatusBadge";
import { captureBootcampInvitationFromUrl } from "./lib/bootcampInvite";
import { teachingLanguageLabel } from "./lib/bootcampLabels";

const BootcampDetailPage = () => {
  const { slug = "" } = useParams();
  const auth = useCourseAuth();
  const [capturedCode, setCapturedCode] = useState("");
  const bootcamps = useQuery({ queryKey: ["bootcamps"], queryFn: listBootcamps });
  const bootcamp = bootcamps.data?.find((candidate) => candidate.slug === slug);
  const enrollment = useQuery({
    queryKey: ["bootcamp-enrollment", slug, auth.user?.id],
    queryFn: () => getMyBootcampEnrollment(slug),
    enabled: Boolean(auth.user && bootcamp?.registrationMode === "invitation"),
  });

  useEffect(() => {
    const captured = captureBootcampInvitationFromUrl(window.location.href, slug);
    setCapturedCode(captured.code);
    const currentPath = `${window.location.pathname}${window.location.search}${window.location.hash}`;
    if (captured.cleanPath !== currentPath) {
      window.history.replaceState(null, "", captured.cleanPath);
    }
  }, [slug]);

  useEffect(() => {
    if (bootcamp) document.title = `${bootcamp.cohortLabel} | AI Fabric Bootcamp`;
    return () => {
      document.title = "AI Fabric";
    };
  }, [bootcamp]);

  if (bootcamps.isPending || auth.loading) {
    return (
      <BootcampLayout>
        <div className="flex min-h-[60vh] items-center justify-center px-5">
          <div className="text-center">
            <Loader2 className="mx-auto h-7 w-7 animate-spin text-blue-700" />
            <p className="mt-3 text-sm font-medium text-slate-600">Loading bootcamp...</p>
          </div>
        </div>
      </BootcampLayout>
    );
  }

  if (bootcamps.isError || !bootcamp) {
    return (
      <BootcampLayout>
        <div className="mx-auto max-w-2xl px-5 py-20 text-center sm:px-8">
          <AlertTriangle className="mx-auto h-10 w-10 text-amber-600" />
          <h1 className="mt-5 text-3xl font-bold tracking-normal text-slate-950">
            {bootcamps.isError ? "Bootcamp service unavailable" : "Bootcamp not found"}
          </h1>
          <p className="mt-3 text-base leading-7 text-slate-600">
            {bootcamps.isError
              ? "The backend did not return cohort data, and this page does not use a browser fallback."
              : "This cohort is not active or publicly listed."}
          </p>
          <Button className="mt-6" variant="outline" asChild><Link to="/bootcamps">Return to bootcamps</Link></Button>
        </div>
      </BootcampLayout>
    );
  }

  return (
    <BootcampLayout>
      <section className="border-b border-border bg-white px-5 py-9 sm:px-8 lg:py-12">
        <div className="mx-auto max-w-7xl">
          <BootcampStatusBadge bootcamp={bootcamp} />
          <p className="mt-6 text-xs font-bold uppercase text-blue-700">AI Fabric Bootcamp · {bootcamp.cohortLabel}</p>
          <h1 className="mt-3 max-w-4xl text-3xl font-black leading-tight tracking-normal text-slate-950 sm:text-4xl lg:text-5xl">
            {bootcamp.title}
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-slate-600 sm:text-lg">
            {bootcamp.description}
          </p>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-9 px-5 py-10 sm:px-8 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start lg:py-14">
        <div>
          <section aria-labelledby="bootcamp-experience-heading">
            <p className="text-xs font-bold uppercase text-blue-700">Cohort experience</p>
            <h2 id="bootcamp-experience-heading" className="mt-2 text-2xl font-bold tracking-normal text-slate-950">
              Guided from architecture to capstone
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
              This is the guided layer around the AI Fabric course. You still work with real Java code and
              framework APIs, with live explanation and implementation feedback added around the labs.
            </p>
            <div className="mt-6 border-y border-border py-6">
              <BootcampBenefits benefits={bootcamp.benefits} />
            </div>
          </section>

          <section className="mt-9 grid gap-4 sm:grid-cols-3" aria-label="Bootcamp details">
            <div className="border-t-4 border-blue-600 bg-white px-4 py-5 shadow-sm">
              <Languages className="h-5 w-5 text-blue-700" />
              <p className="mt-3 text-xs font-bold uppercase text-slate-400">Teaching</p>
              <p className="mt-1 text-sm font-bold text-slate-900">{teachingLanguageLabel(bootcamp.teachingLanguage)}</p>
            </div>
            <div className="border-t-4 border-emerald-500 bg-white px-4 py-5 shadow-sm">
              <Code2 className="h-5 w-5 text-emerald-700" />
              <p className="mt-3 text-xs font-bold uppercase text-slate-400">Technical material</p>
              <p className="mt-1 text-sm font-bold text-slate-900">English code and APIs</p>
            </div>
            <div className="border-t-4 border-amber-500 bg-white px-4 py-5 shadow-sm">
              <UsersRound className="h-5 w-5 text-amber-700" />
              <p className="mt-3 text-xs font-bold uppercase text-slate-400">Format</p>
              <p className="mt-1 text-sm font-bold text-slate-900">Live guided cohort</p>
            </div>
          </section>

          <Alert className="mt-9 rounded-md border-slate-200 bg-slate-50">
            <MessageCircleMore className="h-4 w-4 text-slate-700" />
            <AlertTitle>Communication data</AlertTitle>
            <AlertDescription>
              Enrollment contact details are stored in the dedicated course backend and are not exposed in
              the public cohort catalog. They are used only to coordinate this bootcamp.
            </AlertDescription>
          </Alert>
        </div>

        <aside className="lg:sticky lg:top-36">
          {bootcamp.registrationMode === "invitation" ? (
            enrollment.data ? (
              <BootcampEnrollmentConfirmation enrollment={enrollment.data} />
            ) : enrollment.isPending && auth.user ? (
              <div className="flex min-h-64 items-center justify-center rounded-md border border-border bg-white">
                <Loader2 className="h-6 w-6 animate-spin text-blue-700" />
              </div>
            ) : enrollment.isError ? (
              <Alert variant="destructive" className="rounded-md">
                <AlertTitle>Enrollment could not be loaded</AlertTitle>
                <AlertDescription>No local enrollment fallback is being used. Please retry.</AlertDescription>
              </Alert>
            ) : (
              <BootcampInvitationForm bootcamp={bootcamp} capturedCode={capturedCode} />
            )
          ) : (
            <BootcampInterestForm bootcamp={bootcamp} />
          )}
        </aside>
      </div>
    </BootcampLayout>
  );
};

export default BootcampDetailPage;
