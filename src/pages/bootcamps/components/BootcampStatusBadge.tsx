import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

import type { Bootcamp } from "../types";
import { teachingLanguageLabel } from "../lib/bootcampLabels";

export const BootcampStatusBadge = ({ bootcamp }: { bootcamp: Bootcamp }) => (
  <div className="flex flex-wrap items-center gap-2">
    <Badge
      className={cn(
        bootcamp.status === "active"
          ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-50"
          : "border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-50",
      )}
      variant="outline"
    >
      {bootcamp.status === "active" ? "Enrollment open" : "Coming soon"}
    </Badge>
    <Badge variant="outline">{teachingLanguageLabel(bootcamp.teachingLanguage)}</Badge>
    {bootcamp.registrationMode === "invitation" && <Badge variant="outline">Invitation only</Badge>}
  </div>
);
