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
