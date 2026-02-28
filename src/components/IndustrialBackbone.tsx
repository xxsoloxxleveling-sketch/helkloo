"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, Variants } from "framer-motion";

const textContainerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.2,
        }
    }
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
};

export default function IndustrialBackbone() {
    const sectionRef = useRef<HTMLElement>(null);
    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"]
    });

    // Continuous subtle parallax for the video container
    const yParallax = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

    return (
        <section
            id="about"
            ref={sectionRef}
            className="w-full bg-[#121212] flex flex-col md:flex-row min-h-[90vh] border-t border-[#2a2a2a] overflow-hidden"
        >
            {/* Left Area (40%) - Cinematic Video / Parallax */}
            <div className="relative w-full md:w-[40%] h-[50vh] md:h-auto overflow-hidden bg-[#0a0a0a]">
                <motion.div
                    style={{ y: yParallax }}
                    className="absolute inset-0 w-full h-[120%] -top-[10%]"
                >
                    <video
                        autoPlay
                        loop
                        muted
                        playsInline
                        poster="/Place holder image.png"
                        className="w-full h-full object-cover"
                    >
                        <source src="/Place holder.mp4" type="video/mp4" />
                    </video>
                </motion.div>

                {/* Video Overlay - Gradient from left (dark) to right (transparent) */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#121212]/80 to-transparent pointer-events-none z-10"></div>

                {/* Subtle industrial texture overlay */}
                <div className="absolute inset-0 opacity-[0.05] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none z-10"></div>
            </div>

            {/* Right Area (60%) - Copy */}
            <div className="w-full md:w-[60%] flex flex-col justify-center px-8 py-20 md:py-0 lg:px-24 xl:px-32 z-20">
                <motion.div
                    variants={textContainerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    className="max-w-2xl flex flex-col text-white"
                >
                    <motion.p
                        variants={itemVariants}
                        className="font-orbitron tracking-[0.3em] text-[#ef4444] text-xs md:text-sm uppercase mb-6 font-bold"
                    >
                        Local Production Infrastructure
                    </motion.p>
                    <motion.h2
                        variants={itemVariants}
                        className="font-orbitron text-5xl lg:text-7xl xl:text-[5.5rem] font-bold uppercase tracking-tighter leading-[0.9] mb-8"
                    >
                        Manufacturing<br />Backbone
                    </motion.h2>
                    <motion.div
                        variants={itemVariants}
                        className="w-16 h-1 bg-[#ef4444] mb-8"
                    ></motion.div>
                    <motion.p
                        variants={itemVariants}
                        className="font-rajdhani text-xl lg:text-2xl text-[#888888] leading-relaxed font-medium"
                    >
                        Our fully integrated Tier-1 manufacturing lines deliver uncompromising scale, ensuring supply chain stability and continuous megawatt output.
                    </motion.p>
                </motion.div>
            </div>
        </section>
    );
}
