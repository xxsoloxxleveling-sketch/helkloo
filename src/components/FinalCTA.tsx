"use client";

import React from "react";
import { motion, Variants } from "framer-motion";

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

export default function FinalCTA() {
    return (
        <section
            id="contact"
            className="w-full bg-[#121212] border-t border-[#2a2a2a] text-white py-32 px-8 flex flex-col items-center justify-center overflow-hidden"
        >
            <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                className="max-w-4xl mx-auto flex flex-col items-center text-center"
            >
                <motion.h2
                    variants={itemVariants}
                    className="font-orbitron text-4xl md:text-6xl font-black uppercase tracking-tighter leading-tight mb-12 text-[#eeeeee]"
                >
                    Build The Next Gigawatt With Aryan&apos;s Energy.
                </motion.h2>

                <motion.div variants={itemVariants}>
                    <button className="group relative px-8 py-4 bg-white text-black font-orbitron font-bold uppercase tracking-widest text-sm overflow-hidden transition-transform hover:scale-105 duration-300">
                        <span className="relative z-10 transition-colors duration-300 group-hover:text-white">
                            Request Partnership
                        </span>
                        <div className="absolute inset-0 bg-[#b71c1c] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-in-out z-0"></div>
                    </button>
                    {/* Minimalist subtile underline text */}
                    <p className="mt-6 font-rajdhani text-[#666666] tracking-widest text-xs uppercase">
                        Dedicated engineering teams &bull; Tier-1 Quality
                    </p>
                </motion.div>
            </motion.div>
        </section>
    );
}
