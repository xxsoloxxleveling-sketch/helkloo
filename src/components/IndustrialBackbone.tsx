"use client";

import React from "react";
import { motion, Variants } from "framer-motion";

const sectionVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.6, ease: "easeOut" }
    }
};

const textContainerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2,
            delayChildren: 0.3,
        }
    }
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
};

export default function IndustrialBackbone() {
    return (
        <motion.section
            id="about"
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="relative w-full h-[90vh] bg-[#000000] overflow-hidden flex items-center"
        >
            {/* Full-width Background Video */}
            <div className="absolute inset-0 z-0">
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

                {/* Dark Gradient Overlay (60% left to 20% right) */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 md:from-black/60 to-black/20 pointer-events-none"></div>

                {/* Subtle industrial texture overlay */}
                <div className="absolute inset-0 opacity-[0.05] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none"></div>
            </div>

            {/* Content Container */}
            <div className="relative z-10 w-full max-w-7xl mx-auto px-8 lg:px-24">
                <motion.div
                    variants={textContainerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="max-w-2xl flex flex-col justify-center text-white"
                >
                    <motion.p
                        variants={itemVariants}
                        className="font-orbitron tracking-[0.3em] text-[#ef4444] text-xs md:text-sm uppercase mb-6 font-bold"
                    >
                        Local Production Infrastructure
                    </motion.p>
                    <motion.h2
                        variants={itemVariants}
                        className="font-orbitron text-5xl lg:text-[5.5rem] font-bold uppercase tracking-tighter leading-[0.9] mb-8"
                    >
                        Manufacturing<br />Backbone
                    </motion.h2>
                    <motion.div
                        variants={itemVariants}
                        className="w-16 h-1 bg-[#ef4444] mb-8"
                    ></motion.div>
                    <motion.p
                        variants={itemVariants}
                        className="font-rajdhani text-xl lg:text-2xl text-white/80 leading-relaxed font-medium"
                    >
                        Our massive local infrastructure guarantees uncompromising scale, utilizing Tier-1 components to ensure supply chain stability and consistent megawatt output.
                    </motion.p>
                </motion.div>
            </div>
        </motion.section>
    );
}
