"use client";

import { useRef, useState, useEffect } from "react";
import { useScroll, useTransform, motion } from "framer-motion";
import CanvasSequence from "@/components/CanvasSequence";
import HUDOverlay from "@/components/HUDOverlay";
import Navbar from "@/components/Navbar";
import ImmersivePanels from "@/components/ImmersivePanels";
import EnergyEcosystem from "@/components/EnergyEcosystem";
import TechnicalValidation from "@/components/TechnicalValidation";
import WhyChooseUs from "@/components/WhyChooseUs";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";

import SystemEvolution from "@/components/SystemEvolution";


export default function Home() {
  const sequenceRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: sequenceRef,
    offset: ["start start", "end end"],
  });
  const heroFadeOpacity = useTransform(scrollYProgress, [0.95, 1], [0, 1]);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <main className="w-full bg-[#0b0b0b] min-h-screen">
      <Navbar />

      {/* Scroll Sequence Hero - dynamic height based on device */}
      <section ref={sequenceRef} className={`relative w-full ${isMobile ? "h-[400vh]" : "h-[500vh]"}`}>
        <div className="sticky top-0 left-0 w-full h-screen overflow-hidden">
          <CanvasSequence scrollYProgress={scrollYProgress} isMobile={isMobile} />
          <HUDOverlay scrollYProgress={scrollYProgress} />
          {/* Smooth visual transition to cinematic story panels */}
          <motion.div
            style={{ opacity: heroFadeOpacity }}
            className="absolute inset-0 bg-[#121212] pointer-events-none z-20"
          />
        </div>
      </section>

      {/* Post Hero Content */}
      <div className="relative z-10 w-full min-h-screen">
        <ImmersivePanels />
        <SystemEvolution />
        <WhyChooseUs />
        <FinalCTA />
        <Footer />
      </div>
    </main>
  );
}
