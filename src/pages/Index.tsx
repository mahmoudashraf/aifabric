import { useEffect } from "react";

import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ProblemSection from "@/components/ProblemSection";
import CostSection from "@/components/CostSection";
import ModulesSection from "@/components/ModulesSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import ActionFlowSection from "@/components/ActionFlowSection";
import FeaturesSection from "@/components/FeaturesSection";
import RegistrationSection from "@/components/RegistrationSection";
import OpenSourceSection from "@/components/OpenSourceSection";
import StatusSection from "@/components/StatusSection";
import MediumStoriesSection from "@/components/MediumStoriesSection";
import CommunitySection from "@/components/CommunitySection";
import Footer from "@/components/Footer";

const Index = () => {
  useEffect(() => {
    let raf: number | null = null;

    const scrollToHash = () => {
      const hash = window.location.hash?.replace("#", "");
      if (!hash) return;

      let tries = 0;
      const attempt = () => {
        const el = document.getElementById(hash);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
          return;
        }
        tries += 1;
        if (tries < 10) raf = window.requestAnimationFrame(attempt);
      };

      raf = window.requestAnimationFrame(attempt);
    };

    // Handle first visit with a hash before content is fully rendered
    scrollToHash();

    // Also handle subsequent in-page hash navigation
    window.addEventListener("hashchange", scrollToHash);

    return () => {
      window.removeEventListener("hashchange", scrollToHash);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <ProblemSection />
        <CostSection />
        <ModulesSection />
        <HowItWorksSection />
        <ActionFlowSection />
        <FeaturesSection />
        <RegistrationSection />
        <OpenSourceSection />
        <StatusSection />
        <MediumStoriesSection />
        <CommunitySection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
