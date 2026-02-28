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

export default function EnergyEcosystem() {
    const categories = [
        {
            title: "Solar Modules",
            features: [
                "N-Type TOPCon Technology",
                "Dual-Glass Bifacial Design",
                "High Efficiency Yield",
            ],
            iconPlaceholder: "[ Module Icon ]",
        },
        {
            title: "Energy Storage",
            features: [
                "Lithium Iron Phosphate (LiFePO4)",
                "Scalable Rack Systems",
                "Advanced BMS Integration",
            ],
            iconPlaceholder: "[ Storage Icon ]",
        },
        {
            title: "Power Conversion",
            features: [
                "High-Frequency Inverters",
                "Grid-Tied & Hybrid Modes",
                "Smart Load Management",
            ],
            iconPlaceholder: "[ Inverter Icon ]",
        },
    ];

    return (
        <section
            id="products"
            className="w-full relative bg-[#0b0b0b] border-t border-[#2a2a2a] text-white py-32 px-8 lg:px-24 overflow-hidden"
        >
            {/* Subtle Blueprint Grid Layer */}
            <div className="absolute inset-0 z-0 opacity-[0.03] bg-[linear-gradient(rgba(255,255,255,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.5)_1px,transparent_1px)] [background-size:40px_40px] pointer-events-none"></div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                className="max-w-7xl mx-auto relative z-10"
            >
                <motion.h2
                    variants={itemVariants}
                    className="font-orbitron text-4xl lg:text-5xl font-bold uppercase tracking-tighter mb-16 text-center"
                >
                    Complete Energy Ecosystem
                </motion.h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {categories.map((category, index) => (
                        <motion.div
                            variants={itemVariants}
                            key={index}
                            className="relative border border-[#2a2a2a] bg-[#0f0f0f] p-8 flex flex-col group hover:border-[#b71c1c]/40 hover:-translate-y-1 transition-all duration-200"
                        >
                            <div className="w-12 h-12 border border-[#2a2a2a] bg-[#1a1a1a] mb-8 flex items-center justify-center font-rajdhani text-xs text-white/30 uppercase tracking-widest group-hover:border-white/20 transition-colors duration-300">
                                {category.iconPlaceholder}
                            </div>

                            <h3 className="font-orbitron text-2xl uppercase tracking-tight mb-6">
                                {category.title}
                            </h3>

                            <ul className="space-y-4 font-rajdhani text-lg font-medium text-[#888888]">
                                {category.features.map((feature, fIndex) => (
                                    <li key={fIndex} className="flex items-start">
                                        <span className="text-[#333333] mr-3 mt-1">&gt;</span>
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </section>
    );
}
