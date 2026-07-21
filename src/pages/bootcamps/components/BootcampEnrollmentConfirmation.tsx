import { CalendarClock, CheckCircle2, Mail, MessageCircleMore } from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";

import type { BootcampEnrollment } from "../types";

const joinedDate = (value: string) =>
  new Intl.DateTimeFormat("en-GB", { dateStyle: "medium" }).format(new Date(value));

export const BootcampEnrollmentConfirmation = ({ enrollment }: { enrollment: BootcampEnrollment }) => (
  <div className="rounded-md border border-emerald-200 bg-white shadow-sm">
    <div className="border-b border-emerald-200 bg-emerald-50 px-6 py-5">
      <span className="flex h-11 w-11 items-center justify-center rounded-md bg-emerald-600 text-white">
        <CheckCircle2 className="h-6 w-6" />
      </span>
      <h2 className="mt-4 text-xl font-bold tracking-normal text-slate-950">You are registered</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">
        Your account and communication details are linked to this cohort.
      </p>
    </div>
    <dl className="divide-y divide-border px-6">
      <div className="flex items-start gap-3 py-4">
        <Mail className="mt-0.5 h-4 w-4 shrink-0 text-blue-700" />
        <div className="min-w-0">
          <dt className="text-xs font-bold uppercase text-slate-400">Email updates</dt>
          <dd className="mt-1 break-all text-sm font-medium text-slate-800">{enrollment.contactEmail}</dd>
        </div>
      </div>
      <div className="flex items-start gap-3 py-4">
        <MessageCircleMore className="mt-0.5 h-4 w-4 shrink-0 text-emerald-700" />
        <div>
          <dt className="text-xs font-bold uppercase text-slate-400">WhatsApp communication</dt>
          <dd className="mt-1 text-sm font-medium text-slate-800">{enrollment.phoneE164}</dd>
        </div>
      </div>
      <div className="flex items-start gap-3 py-4">
        <CalendarClock className="mt-0.5 h-4 w-4 shrink-0 text-amber-700" />
        <div>
          <dt className="text-xs font-bold uppercase text-slate-400">Joined</dt>
          <dd className="mt-1 text-sm font-medium text-slate-800">{joinedDate(enrollment.joinedAt)}</dd>
        </div>
      </div>
    </dl>
    <div className="px-6 py-5">
      <p className="text-sm leading-6 text-slate-600">
        Lecture times, lab access, and the first cohort update will be sent through the contact channels above.
      </p>
      <Button className="mt-4 w-full" variant="outline" asChild>
        <Link to="/course">Open the AI Fabric course</Link>
      </Button>
    </div>
  </div>
);
