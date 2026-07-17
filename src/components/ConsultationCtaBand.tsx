import { ArrowRight, CalendarCheck, Linkedin, MessageCircle, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const LINKEDIN_URL = "https://www.linkedin.com/in/engmahmoudalgammal/";
const WHATSAPP_URL = "https://wa.me/message/O3RF2KNXTHQDF1";

interface ConsultationCtaBandProps {
  className?: string;
  eyebrow?: string;
  title?: string;
  body?: string;
  compact?: boolean;
}

export default function ConsultationCtaBand({
  className = "",
  eyebrow = "Free initial discussion",
  title = "Evaluating AI Fabric for a similar app?",
  body = "Book a focused 30-minute architecture discussion with Mahmoud Elgammal. Bring one real Java/Spring Boot workflow and leave with a clearer module path, risk map, and proof-of-concept shape.",
  compact = false,
}: ConsultationCtaBandProps) {
  return (
    <section className={`px-4 sm:px-6 ${className}`}>
      <div className="mx-auto max-w-7xl overflow-hidden rounded-lg border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-emerald-50 shadow-sm">
        <div className={`grid gap-6 ${compact ? "p-5 md:p-6" : "p-6 md:p-8"} lg:grid-cols-[1fr_0.82fr] lg:items-center`}>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="border-blue-200 bg-white text-blue-700" variant="outline">
                <CalendarCheck className="mr-1 h-3.5 w-3.5" />
                {eyebrow}
              </Badge>
              <Badge className="border-emerald-200 bg-emerald-50 text-emerald-800" variant="outline">
                <Sparkles className="mr-1 h-3.5 w-3.5" />
                Java/Spring Boot AI architecture
              </Badge>
            </div>
            <h2 className={`${compact ? "mt-3 text-2xl md:text-3xl" : "mt-4 text-3xl md:text-5xl"} font-black tracking-normal text-slate-950`}>
              {title}
            </h2>
            <p className={`${compact ? "mt-3" : "mt-4"} max-w-3xl text-sm leading-7 text-slate-600 md:text-base md:leading-8`}>
              {body}
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            <Button asChild size={compact ? "default" : "lg"} className="bg-slate-950 text-white hover:bg-slate-800">
              <Link to="/consultation">
                <CalendarCheck className="mr-2 h-4 w-4" />
                Book discussion
              </Link>
            </Button>
            <Button asChild size={compact ? "default" : "lg"} variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-800 hover:bg-emerald-100">
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="mr-2 h-4 w-4" />
                WhatsApp
              </a>
            </Button>
            <Button asChild size={compact ? "default" : "lg"} variant="outline" className="border-slate-300 bg-white text-slate-950 hover:bg-slate-50">
              <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">
                <Linkedin className="mr-2 h-4 w-4" />
                LinkedIn
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
