import { Header } from "@/components/landing/Header";
import { HeroSection } from "@/components/landing/HeroSection";
import { ProblemSection } from "@/components/landing/ProblemSection";
import { SolutionSection } from "@/components/landing/SolutionSection";
import { HowItWorksSection } from "@/components/landing/HowItWorksSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { AudienceSection } from "@/components/landing/AudienceSection";
import { DeploymentSection } from "@/components/landing/DeploymentSection";
import { PricingSection } from "@/components/landing/PricingSection";
import { PaystackCTASection } from "@/components/landing/PaystackCTASection";
import { DemoSection } from "@/components/landing/DemoSection";
import { TrustSection } from "@/components/landing/TrustSection";
import { FinalCTASection } from "@/components/landing/FinalCTASection";
import { Footer } from "@/components/landing/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <ProblemSection />
        <SolutionSection />
        <HowItWorksSection />
        <section id="features">
          <FeaturesSection />
        </section>
        <AudienceSection />
        <DeploymentSection />
        <PricingSection />
        <PaystackCTASection />
        <DemoSection />
        <TrustSection />
        <FinalCTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;