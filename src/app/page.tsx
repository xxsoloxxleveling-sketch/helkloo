"use client";

import { useRef } from "react";
import { useScroll } from "framer-motion";
import CanvasSequence from "@/components/CanvasSequence";
import HUDOverlay from "@/components/HUDOverlay";
import Navbar from "@/components/Navbar";

export default function Home() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: scrollContainerRef,
    offset: ["start start", "end end"],
  });

  return (
    <main className="w-full bg-[#0b0b0b] min-h-screen">
      <Navbar />

      {/* Scroll Sequence Hero — single 500vh container */}
      <section ref={scrollContainerRef} className="relative w-full h-[500vh]">
        <div className="sticky top-0 left-0 w-full h-screen overflow-hidden">
          <CanvasSequence scrollYProgress={scrollYProgress} />
          <HUDOverlay scrollYProgress={scrollYProgress} />
        </div>
      </section>

      {/* Post Hero Content */}
      <section className="w-full min-h-screen bg-[#0b0b0b] flex flex-col items-center justify-center p-8 text-center border-t border-white/10 z-10 relative">
        <h3 className="font-orbitron text-3xl text-white/50 mb-4">
          Post Hero Content
        </h3>
        <p className="font-rajdhani text-white/30 max-w-lg">
          Additional sections like About, Products Grid, and Footer would flow
          naturally from here.
        </p>
      </section>
    </main>
  );
}
