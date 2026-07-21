import { useMutation, useQueryClient } from "@tanstack/react-query";
import { KeyRound, Loader2, LockKeyhole, LogIn, Mail, MessageCircleMore } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCourseAuth } from "@/pages/course/hooks/useCourseAuth";

import { redeemBootcampInvitation } from "../api/bootcampApi";
import {
  clearBootcampInvitationCode,
  storeBootcampInvitationCode,
} from "../lib/bootcampInvite";
import {
  bootcampEnrollmentSchema,
  firstValidationMessage,
} from "../lib/bootcampValidation";
import type { Bootcamp } from "../types";

export const BootcampInvitationForm = ({
  bootcamp,
  capturedCode,
}: {
  bootcamp: Bootcamp;
  capturedCode: string;
}) => {
  const auth = useCourseAuth();
  const queryClient = useQueryClient();
  const [invitationCode, setInvitationCode] = useState(capturedCode);
  const [phone, setPhone] = useState("");
  const [whatsappConsent, setWhatsappConsent] = useState(false);

  useEffect(() => {
    if (capturedCode && !invitationCode) setInvitationCode(capturedCode);
  }, [capturedCode, invitationCode]);

  const redeem = useMutation({
    mutationFn: redeemBootcampInvitation,
    onSuccess: (enrollment) => {
      clearBootcampInvitationCode(bootcamp.slug);
      queryClient.setQueryData(["bootcamp-enrollment", bootcamp.slug, auth.user?.id], enrollment);
      void queryClient.invalidateQueries({ queryKey: ["bootcamps"] });
      toast.success("Bootcamp registration confirmed");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Bootcamp registration failed");
    },
  });

  const updateInvitationCode = (value: string) => {
    setInvitationCode(value);
    storeBootcampInvitationCode(bootcamp.slug, value);
  };

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const validation = bootcampEnrollmentSchema.safeParse({ invitationCode, phone, whatsappConsent });
    if (!validation.success) {
      toast.error(firstValidationMessage(validation.error));
      return;
    }

    redeem.mutate({
      bootcampSlug: bootcamp.slug,
      invitationCode: validation.data.invitationCode,
      phone: validation.data.phone,
      whatsappConsent: validation.data.whatsappConsent,
    });
  };

  return (
    <div className="rounded-md border border-border bg-white shadow-sm">
      <div className="border-b border-border px-6 py-5">
        <span className="flex h-10 w-10 items-center justify-center rounded-md bg-blue-50 text-blue-700">
          <KeyRound className="h-5 w-5" />
        </span>
        <h2 className="mt-4 text-xl font-bold tracking-normal text-slate-950">Join this cohort</h2>
        <p className="mt-2 text-sm leading-6 text-slate-600">
          Use the shared invitation code, then confirm the contact details used for cohort communication.
        </p>
      </div>

      <form onSubmit={submit} className="space-y-5 px-6 py-6">
        <div>
          <Label htmlFor="bootcamp-invitation-code" className="mb-2 flex items-center gap-2">
            <LockKeyhole className="h-4 w-4 text-blue-700" />
            Invitation code
          </Label>
          <Input
            id="bootcamp-invitation-code"
            value={invitationCode}
            onChange={(event) => updateInvitationCode(event.target.value)}
            placeholder="Enter invitation code"
            autoComplete="off"
            maxLength={128}
            className="h-11 font-mono uppercase"
          />
          <p className="mt-2 text-xs leading-5 text-slate-500">
            The same code can be used by multiple invited participants while this cohort remains active.
          </p>
        </div>

        {!auth.user ? (
          <div className="space-y-4">
            <Alert className="rounded-md border-blue-200 bg-blue-50">
              <LogIn className="h-4 w-4 text-blue-700" />
              <AlertTitle>Sign in before registering</AlertTitle>
              <AlertDescription>
                Your invitation is kept in this browser while GitHub authentication completes.
              </AlertDescription>
            </Alert>
            <Button
              type="button"
              className="w-full bg-blue-700 hover:bg-blue-800"
              disabled={auth.loading || !auth.githubAvailable}
              onClick={() => {
                storeBootcampInvitationCode(bootcamp.slug, invitationCode);
                void auth.signInWithGitHub().catch((error) =>
                  toast.error(error instanceof Error ? error.message : "GitHub sign-in failed"),
                );
              }}
            >
              <LogIn className="h-4 w-4" />
              Sign in with GitHub
            </Button>
            {(auth.authenticationIssue || auth.configurationIssue) && (
              <p className="text-sm leading-6 text-rose-700">
                {auth.authenticationIssue ?? auth.configurationIssue}
              </p>
            )}
          </div>
        ) : (
          <>
            <div>
              <Label htmlFor="bootcamp-email" className="mb-2 flex items-center gap-2">
                <Mail className="h-4 w-4 text-blue-700" />
                Account email
              </Label>
              <Input id="bootcamp-email" value={auth.user.email ?? ""} readOnly className="h-11 bg-slate-50" />
              <p className="mt-2 text-xs leading-5 text-slate-500">
                This verified account email will be linked to your bootcamp enrollment.
              </p>
            </div>
            <div>
              <Label htmlFor="bootcamp-phone" className="mb-2 flex items-center gap-2">
                <MessageCircleMore className="h-4 w-4 text-emerald-700" />
                WhatsApp phone number
              </Label>
              <Input
                id="bootcamp-phone"
                type="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                placeholder="+447700900123"
                autoComplete="tel"
                maxLength={32}
                className="h-11"
              />
              <p className="mt-2 text-xs leading-5 text-slate-500">Include the country code.</p>
            </div>
            <label className="flex cursor-pointer items-start gap-3 rounded-md border border-border bg-slate-50 p-4">
              <Checkbox
                checked={whatsappConsent}
                onCheckedChange={(checked) => setWhatsappConsent(checked === true)}
                className="mt-0.5"
              />
              <span className="text-sm leading-6 text-slate-700">
                I agree that AI Fabric may use my account email and phone number to coordinate this
                bootcamp through email and WhatsApp.
              </span>
            </label>
            <Button type="submit" className="w-full bg-blue-700 hover:bg-blue-800" disabled={redeem.isPending}>
              {redeem.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />}
              {redeem.isPending ? "Confirming registration..." : "Join bootcamp"}
            </Button>
          </>
        )}
      </form>
    </div>
  );
};
