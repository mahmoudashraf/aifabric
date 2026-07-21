import { CheckCircle2 } from "lucide-react";

export const BootcampBenefits = ({ benefits }: { benefits: string[] }) => (
  <ul className="grid gap-3 sm:grid-cols-2" aria-label="Bootcamp benefits">
    {benefits.map((benefit) => (
      <li key={benefit} className="flex items-start gap-2.5 text-sm leading-6 text-slate-700">
        <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-emerald-600" />
        <span>{benefit}</span>
      </li>
    ))}
  </ul>
);
