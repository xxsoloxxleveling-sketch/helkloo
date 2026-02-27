"use client";

import { MotionValue, motion, useTransform } from "framer-motion";

interface HUDOverlayProps {
    scrollYProgress: MotionValue<number>;
}

export default function HUDOverlay({ scrollYProgress }: HUDOverlayProps) {
    // Phase 1: 0% - 30% (Headline & Subheading)
    const phase1Opacity = useTransform(scrollYProgress, [0, 0.05, 0.2, 0.3], [1, 1, 1, 0]);
    const phase1Y = useTransform(scrollYProgress, [0, 0.05, 0.2, 0.3], [0, 0, 0, -60]);

    // Phase 2: 30% - 75% (HUD Diagnostics)
    const hud1Opacity = useTransform(scrollYProgress, [0.3, 0.35, 0.65, 0.72], [0, 1, 1, 0]);
    const hud2Opacity = useTransform(scrollYProgress, [0.35, 0.4, 0.65, 0.72], [0, 1, 1, 0]);
    const hud3Opacity = useTransform(scrollYProgress, [0.4, 0.45, 0.65, 0.72], [0, 1, 1, 0]);
    const hud4Opacity = useTransform(scrollYProgress, [0.45, 0.5, 0.65, 0.72], [0, 1, 1, 0]);
    const hud5Opacity = useTransform(scrollYProgress, [0.5, 0.55, 0.65, 0.72], [0, 1, 1, 0]);

    const hud1X = useTransform(scrollYProgress, [0.3, 0.35], [30, 0]);
    const hud2X = useTransform(scrollYProgress, [0.35, 0.4], [30, 0]);
    const hud3X = useTransform(scrollYProgress, [0.4, 0.45], [30, 0]);
    const hud4X = useTransform(scrollYProgress, [0.45, 0.5], [30, 0]);
    const hud5X = useTransform(scrollYProgress, [0.5, 0.55], [30, 0]);

    // Phase 3: 75% - 100% (Final CTA)
    const phase3Opacity = useTransform(scrollYProgress, [0.75, 0.85, 1], [0, 1, 1]);
    const phase3Y = useTransform(scrollYProgress, [0.75, 0.85], [60, 0]);
    const phase3Scale = useTransform(scrollYProgress, [0.75, 0.85], [0.95, 1]);

    return (
        <div className="absolute inset-0 z-10 h-full w-full pointer-events-none text-white">
            {/* Screen reader accessible text */}
            <div className="sr-only">
                <h1>Complete Solar Systems. Manufactured in Pakistan.</h1>
                <p>High-efficiency N-Type modules, intelligent inverters, and LiFePO4 storage engineered for South Asia&apos;s toughest climates.</p>
                <p>Energy Sovereignty. Engineered Locally.</p>
            </div>

            {/* Phase 1: Headline */}
            <motion.div
                style={{ opacity: phase1Opacity, y: phase1Y }}
                className="absolute inset-0 flex flex-col justify-center px-8 md:px-16 lg:px-24 drop-shadow-[0_2px_14px_rgba(0,0,0,0.75)]"
            >
                <div className="max-w-4xl">
                    <h1 className="mb-6 font-orbitron text-4xl font-bold leading-[1.1] tracking-tight sm:text-5xl md:text-7xl lg:text-8xl">
                        Complete Solar Systems.
                        <br />
                        <span className="text-white/60">Manufactured in Pakistan.</span>
                    </h1>
                    <p className="max-w-2xl font-rajdhani text-lg font-light leading-relaxed tracking-wide text-white/70 sm:text-xl md:text-2xl">
                        High-efficiency N-Type modules, intelligent inverters, and LiFePO4
                        storage engineered for South Asia&apos;s toughest climates.
                    </p>
                </div>
            </motion.div>

            {/* Phase 2: HUD Diagnostics */}
            <div className="absolute inset-0 flex items-center justify-end px-8 md:px-16 lg:px-24">
                <div className="flex flex-col gap-5 text-right font-orbitron text-xs tracking-[0.2em] sm:text-sm md:text-base">
                    <motion.div style={{ opacity: hud1Opacity, x: hud1X }} className="flex items-center justify-end gap-4">
                        <div className="h-px w-12 bg-[#B71C1C]/50" />
                        <span className="text-[#e2e2e2] [text-shadow:0_0_8px_rgba(183,28,28,0.4)]">N-TYPE TOPCON ACTIVE</span>
                    </motion.div>
                    <motion.div style={{ opacity: hud2Opacity, x: hud2X }} className="flex items-center justify-end gap-4">
                        <div className="h-px w-16 bg-[#B71C1C]/40" />
                        <span className="text-[#e2e2e2] [text-shadow:0_0_8px_rgba(183,28,28,0.4)]">22.5%+ EFFICIENCY</span>
                    </motion.div>
                    <motion.div style={{ opacity: hud3Opacity, x: hud3X }} className="flex items-center justify-end gap-4">
                        <div className="h-px w-8 bg-[#B71C1C]/40" />
                        <span className="text-[#e2e2e2] [text-shadow:0_0_8px_rgba(183,28,28,0.4)]">6000+ CYCLE LFP</span>
                    </motion.div>
                    <motion.div style={{ opacity: hud4Opacity, x: hud4X }} className="flex items-center justify-end gap-4">
                        <div className="h-px w-20 bg-[#B71C1C]/40" />
                        <span className="text-[#e2e2e2] [text-shadow:0_0_8px_rgba(183,28,28,0.4)]">GRID-STABLE INVERSION</span>
                    </motion.div>
                    <motion.div style={{ opacity: hud5Opacity, x: hud5X }} className="flex items-center justify-end gap-4">
                        <div className="h-px w-12 bg-[#B71C1C]/50" />
                        <span className="text-[#e2e2e2] [text-shadow:0_0_8px_rgba(183,28,28,0.4)]">BUILT FOR 45{"\u00B0"}C+</span>
                    </motion.div>
                </div>
            </div>

            {/* Phase 3: Final Statement & CTA */}
            <motion.div
                style={{ opacity: phase3Opacity, y: phase3Y, scale: phase3Scale }}
                className="absolute inset-0 flex flex-col items-center justify-center px-8 text-center drop-shadow-[0_2px_16px_rgba(0,0,0,0.8)]"
            >
                <h2 className="mb-10 font-orbitron text-3xl font-bold uppercase leading-tight tracking-wide sm:text-4xl md:text-6xl lg:text-7xl">
                    Energy Sovereignty.
                    <br />
                    <span className="text-white/50">Engineered Locally.</span>
                </h2>
                <div className="pointer-events-auto flex flex-col gap-4 sm:flex-row sm:gap-6">
                    <button className="px-8 py-4 font-orbitron text-sm font-bold uppercase tracking-widest text-black transition-all duration-300 hover:scale-105 hover:bg-white/90 bg-white">
                        Request Partnership
                    </button>
                    <button className="border border-white/30 px-8 py-4 font-orbitron text-sm font-bold uppercase tracking-widest text-white transition-all duration-300 hover:bg-white/10">
                        Download Technical Portfolio
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
