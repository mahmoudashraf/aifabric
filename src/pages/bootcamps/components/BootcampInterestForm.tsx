import { useMutation } from "@tanstack/react-query";
import { BellRing, CheckCircle2, Loader2, Mail, MessageCircleMore } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCourseAuth } from "@/pages/course/hooks/useCourseAuth";

import { registerBootcampInterest } from "../api/bootcampApi";
import { bootcampInterestSchema, firstValidationMessage } from "../lib/bootcampValidation";
import type { Bootcamp } from "../types";

export const BootcampInterestForm = ({ bootcamp }: { bootcamp: Bootcamp }) => {
  const auth = useCourseAuth();
  const [contactEmail, setContactEmail] = useState(auth.user?.email ?? "");
  const [phone, setPhone] = useState("");
  const [emailConsent, setEmailConsent] = useState(false);
  const [whatsappConsent, setWhatsappConsent] = useState(false);
  const [website, setWebsite] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (!contactEmail && auth.user?.email) setContactEmail(auth.user.email);
  }, [auth.user?.email, contactEmail]);

  const register = useMutation({
    mutationFn: registerBootcampInterest,
    onSuccess: () => {
      setSubmitted(true);
      toast.success("Interest registered");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Interest registration failed");
    },
  });

  if (submitted) {
    return (
      <div className="rounded-md border border-emerald-200 bg-white px-6 py-7 text-center shadow-sm">
        <CheckCircle2 className="mx-auto h-11 w-11 text-emerald-600" />
        <h2 className="mt-4 text-xl font-bold tracking-normal text-slate-950">You are on the interest list</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          We will email you when enrollment and the English cohort schedule are ready.
        </p>
      </div>
    );
  }

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const validation = bootcampInterestSchema.safeParse({
      contactEmail,
      phone,
      emailConsent,
      whatsappConsent,
      website,
    });
    if (!validation.success) {
      toast.error(firstValidationMessage(validation.error));
      return;
    }

    register.mutate({
      bootcampSlug: bootcamp.slug,
      contactEmail: validation.data.contactEmail,
      phone: validation.data.phone || undefined,
      emailConsent: validation.data.emailConsent,
      whatsappConsent: validation.data.whatsappConsent,
      website: validation.data.website,
    });
  };

  return (
    <div className="rounded-md border border-border bg-white shadow-sm">
      <div className="border-b border-border px-6 py-5">
        <span className="flex h-10 w-10 items-center justify-center rounded-md bg-amber-50 text-amber-700">
          <BellRing className="h-5 w-5" />
        </span>
        <h2 className="mt-4 text-xl font-bold tracking-normal text-slate-950">Register your interest</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Receive the enrollment announcement and schedule when the English cohort opens.
        </p>
      </div>
      <form onSubmit={submit} className="space-y-5 px-6 py-6">
        <div className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
          <Label htmlFor="bootcamp-website">Website</Label>
          <Input
            id="bootcamp-website"
            value={website}
            onChange={(event) => setWebsite(event.target.value)}
            tabIndex={-1}
            autoComplete="off"
          />
        </div>
        <div>
          <Label htmlFor="bootcamp-interest-email" className="mb-2 flex items-center gap-2">
            <Mail className="h-4 w-4 text-blue-700" />
            Email address
          </Label>
          <Input
            id="bootcamp-interest-email"
            type="email"
            value={contactEmail}
            onChange={(event) => setContactEmail(event.target.value)}
            placeholder="developer@example.com"
            autoComplete="email"
            maxLength={255}
            className="h-11"
          />
        </div>
        <div>
          <Label htmlFor="bootcamp-interest-phone" className="mb-2 flex items-center gap-2">
            <MessageCircleMore className="h-4 w-4 text-emerald-700" />
            WhatsApp phone number <span className="font-normal text-slate-400">(optional)</span>
          </Label>
          <Input
            id="bootcamp-interest-phone"
            type="tel"
            value={phone}
            onChange={(event) => {
              setPhone(event.target.value);
              if (!event.target.value.trim()) setWhatsappConsent(false);
            }}
            placeholder="+447700900123"
            autoComplete="tel"
            maxLength={32}
            className="h-11"
          />
        </div>
        <label className="flex cursor-pointer items-start gap-3 rounded-md border border-border bg-slate-50 p-4">
          <Checkbox
            checked={emailConsent}
            onCheckedChange={(checked) => setEmailConsent(checked === true)}
            className="mt-0.5"
          />
          <span className="text-sm leading-6 text-slate-700">
            Email me about enrollment and essential updates for this bootcamp.
          </span>
        </label>
        <label className="flex cursor-pointer items-start gap-3 rounded-md border border-border bg-slate-50 p-4">
          <Checkbox
            checked={whatsappConsent}
            disabled={!phone.trim()}
            onCheckedChange={(checked) => setWhatsappConsent(checked === true)}
            className="mt-0.5"
          />
          <span className="text-sm leading-6 text-slate-700">
            Also contact me through WhatsApp using the optional number above.
          </span>
        </label>
        <Button type="submit" className="w-full" disabled={register.isPending}>
          {register.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <BellRing className="h-4 w-4" />}
          {register.isPending ? "Registering..." : "Register interest"}
        </Button>
      </form>
    </div>
  );
};
