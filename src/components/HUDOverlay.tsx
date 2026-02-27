"use client";

import { MotionValue, useTransform, motion } from "framer-motion";

interface HUDOverlayProps {
    scrollYProgress: MotionValue<number>;
}

export default function HUDOverlay({ scrollYProgress }: HUDOverlayProps) {
    // Phase 1: 0% - 30% (Headline & Subheading)
    const phase1Opacity = useTransform(scrollYProgress, [0, 0.05, 0.2, 0.3], [0, 1, 1, 0]);
    const phase1Y = useTransform(scrollYProgress, [0, 0.05, 0.2, 0.3], [40, 0, 0, -60]);

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
        <div className="absolute inset-0 w-full h-full pointer-events-none z-10">
            {/* Screen reader accessible text */}
            <div className="sr-only">
                <h1>Complete Solar Systems. Manufactured in Pakistan.</h1>
                <p>High-efficiency N-Type modules, intelligent inverters, and LiFePO4 storage engineered for South Asia&apos;s toughest climates.</p>
                <p>Energy Sovereignty. Engineered Locally.</p>
            </div>

            {/* Phase 1: Headline */}
            <motion.div
                style={{ opacity: phase1Opacity, y: phase1Y }}
                className="absolute inset-0 flex flex-col justify-center px-8 md:px-16 lg:px-24"
            >
                <div className="max-w-4xl">
                    <h1 className="font-orbitron font-bold text-4xl sm:text-5xl md:text-7xl lg:text-8xl leading-[1.1] mb-6 tracking-tight">
                        Complete Solar Systems.
                        <br />
                        <span className="text-white/60">Manufactured in Pakistan.</span>
                    </h1>
                    <p className="font-rajdhani text-lg sm:text-xl md:text-2xl text-white/70 max-w-2xl font-light tracking-wide leading-relaxed">
                        High-efficiency N-Type modules, intelligent inverters, and LiFePO4
                        storage engineered for South Asia&apos;s toughest climates.
                    </p>
                </div>
            </motion.div>

            {/* Phase 2: HUD Diagnostics */}
            <div className="absolute inset-0 flex items-center justify-end px-8 md:px-16 lg:px-24">
                <div className="flex flex-col gap-5 font-orbitron text-xs sm:text-sm md:text-base tracking-[0.2em] text-right">
                    <motion.div style={{ opacity: hud1Opacity, x: hud1X }} className="flex items-center justify-end gap-4">
                        <div className="h-px w-12 bg-emerald-400/50" />
                        <span className="text-emerald-400">N-TYPE TOPCON ACTIVE</span>
                    </motion.div>
                    <motion.div style={{ opacity: hud2Opacity, x: hud2X }} className="flex items-center justify-end gap-4">
                        <div className="h-px w-16 bg-white/40" />
                        <span className="text-white/90">22.5%+ EFFICIENCY</span>
                    </motion.div>
                    <motion.div style={{ opacity: hud3Opacity, x: hud3X }} className="flex items-center justify-end gap-4">
                        <div className="h-px w-8 bg-white/40" />
                        <span className="text-white/90">6000+ CYCLE LFP</span>
                    </motion.div>
                    <motion.div style={{ opacity: hud4Opacity, x: hud4X }} className="flex items-center justify-end gap-4">
                        <div className="h-px w-20 bg-white/40" />
                        <span className="text-white/90">GRID-STABLE INVERSION</span>
                    </motion.div>
                    <motion.div style={{ opacity: hud5Opacity, x: hud5X }} className="flex items-center justify-end gap-4">
                        <div className="h-px w-12 bg-orange-400/50" />
                        <span className="text-orange-400">BUILT FOR 45°C+</span>
                    </motion.div>
                </div>
            </div>

            {/* Phase 3: Final Statement & CTA */}
            <motion.div
                style={{ opacity: phase3Opacity, y: phase3Y, scale: phase3Scale }}
                className="absolute inset-0 flex flex-col justify-center items-center text-center px-8"
            >
                <h2 className="font-orbitron font-bold text-3xl sm:text-4xl md:text-6xl lg:text-7xl mb-10 uppercase tracking-wide leading-tight">
                    Energy Sovereignty.
                    <br />
                    <span className="text-white/50">Engineered Locally.</span>
                </h2>
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 pointer-events-auto">
                    <button className="px-8 py-4 bg-white text-black font-orbitron text-sm font-bold tracking-widest uppercase hover:bg-white/90 transition-all duration-300 hover:scale-105">
                        Request Partnership
                    </button>
                    <button className="px-8 py-4 border border-white/30 text-white font-orbitron text-sm font-bold tracking-widest uppercase hover:bg-white/10 transition-all duration-300">
                        Download Technical Portfolio
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
