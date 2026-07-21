import { ArrowLeft, UsersRound } from "lucide-react";
import type { ReactNode } from "react";
import { Link, useLocation } from "react-router-dom";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

import { BootcampAccountButton } from "./BootcampAccountButton";

export const BootcampLayout = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const detailPage = location.pathname !== "/bootcamps" && location.pathname !== "/bootcamps/";

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-950">
      <Navbar />
      <div className="pt-16">
        <div className="sticky top-16 z-30 border-b border-border bg-white/95 backdrop-blur">
          <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-5 sm:px-8">
            <Link to="/bootcamps" className="flex min-w-0 items-center gap-2 font-semibold text-slate-900">
              {detailPage ? <ArrowLeft className="h-4 w-4 shrink-0" /> : <UsersRound className="h-4 w-4 shrink-0 text-blue-700" />}
              <span className="truncate">{detailPage ? "All bootcamps" : "AI Fabric Bootcamps"}</span>
            </Link>
            <BootcampAccountButton />
          </div>
        </div>
        <main>{children}</main>
      </div>
      <Footer />
    </div>
  );
};
