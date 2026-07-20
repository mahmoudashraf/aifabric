import { ArrowLeft, LockKeyhole } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

import { Button } from "@/components/ui/button";

import { CourseLayout } from "./components/CourseLayout";
import { getLessonByRoute } from "./lib/courseCatalog";

const CourseUnavailablePage = () => {
  const location = useLocation();
  const lesson = getLessonByRoute(location.pathname);

  return (
    <CourseLayout>
      <div className="mx-auto max-w-3xl px-5 py-20 text-center sm:px-8">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-md bg-slate-100 text-slate-600">
          <LockKeyhole className="h-7 w-7" />
        </span>
        <p className="mt-6 text-xs font-bold uppercase text-blue-700">Course content gate</p>
        <h1 className="mt-2 text-3xl font-bold tracking-normal text-slate-950">
          {lesson ? `${lesson.title} is in preparation` : "Course lesson not found"}
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-base leading-7 text-slate-600">
          {lesson
            ? "The catalog includes this lesson so the learning path is transparent, but there is no reviewed lesson package to publish yet."
            : "This route is not part of the generated course manifest."}
        </p>
        <Button className="mt-7" variant="outline" asChild>
          <Link to="/course"><ArrowLeft className="h-4 w-4" />Return to course overview</Link>
        </Button>
      </div>
    </CourseLayout>
  );
};

export default CourseUnavailablePage;
