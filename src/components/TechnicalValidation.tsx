"use client";

import React from "react";
import { motion, Variants } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.1,
        },
    },
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
};

export default function TechnicalValidation() {
    const credentials = [
        { title: "N-Type TOPCon Certification" },
        { title: "High-Temperature Tested (45C and above)" },
        { title: "6000+ Cycle LiFePO4 Validation" },
    ];

    return (
        <section
            id="technology"
            className="w-full relative bg-[#121212] border-t border-[#2a2a2a] text-[#aaaaaa] py-16 px-8 lg:px-24 overflow-hidden"
        >
            <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                className="max-w-6xl mx-auto flex flex-col items-center"
            >
                <motion.h3
                    variants={itemVariants}
                    className="font-orbitron text-sm uppercase tracking-[0.3em] text-[#555555] mb-12"
                >
                    Engineered to Global Standards
                </motion.h3>

                <div className="flex flex-col md:flex-row w-full justify-between items-center gap-8 md:gap-4 md:divide-x divide-[#222222]">
                    {credentials.map((cred, i) => (
                        <motion.div
                            variants={itemVariants}
                            key={i}
                            className="flex items-center justify-center gap-4 w-full px-4 text-center md:text-left group"
                        >
                            <CheckCircle2 className="w-5 h-5 text-[#333333] group-hover:text-emerald-500/50 transition-colors duration-300 flex-shrink-0" />
                            <span className="font-rajdhani text-lg md:text-xl font-medium tracking-wide">
                                {cred.title}
                            </span>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </section>
    );
}
