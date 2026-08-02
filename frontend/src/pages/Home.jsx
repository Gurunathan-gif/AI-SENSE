import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Stats from "../components/Stats";
import Features from "../components/Features";
import Workflow from "../components/Workflow";
import ModulesPreview from "../components/ModulesPreview";
import AIPreview from "../components/AIPreview";
import WhyChoose from "../components/Whychoose";
import RunPreview from "../components/RunPreview";
import Testimonials from "../components/Testimonials";
import FAQ from "../components/FAQ";
import Footer from "../components/Footer";
import CTA from "../components/CTA";

function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Stats />
      <Features />
      <Workflow />
      <ModulesPreview />
      <AIPreview />
      <RunPreview />
      <Testimonials />

       <WhyChoose/>
       <CTA/>
      <FAQ />
      <Footer />
     
    </>
  );
}

export default Home;