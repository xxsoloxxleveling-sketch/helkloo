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

export default function WhyChooseUs() {
    const features = [
        {
            title: "Vertical Integration",
            description:
                "Complete ownership of the supply chain from raw silicon to finished modules, ensuring consistent quality and availability.",
        },
        {
            title: "Tier-1 Production",
            description:
                "State-of-the-art automated manufacturing lines adhering to the strictest international quality control standards.",
        },
        {
            title: "Bankable Reliability",
            description:
                "Comprehensive 30-year linear power warranties backed by rigorous third-party testing and validation.",
        },
        {
            title: "Strategic EPC Support",
            description:
                "Dedicated engineering teams providing localized technical support and optimal system sizing for mega-scale projects.",
        },
    ];

    return (
        <section className="w-full bg-[#0b0b0b] border-t border-[#2a2a2a] text-white py-32 px-8 lg:px-24 overflow-hidden">
            <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                className="max-w-4xl mx-auto"
            >
                <motion.h2
                    variants={itemVariants}
                    className="font-orbitron text-3xl lg:text-4xl font-bold uppercase tracking-tighter mb-16 text-center lg:text-left"
                >
                    Why Industry Partners Choose Aryan&apos;s Energy
                </motion.h2>

                <div className="flex flex-col">
                    {features.map((feature, index) => (
                        <motion.div
                            variants={itemVariants}
                            key={index}
                            className="group flex flex-col md:flex-row border-b border-[#2a2a2a] py-12 first:border-t hover:bg-[#111111] transition-colors duration-500 ease-in-out px-4 -mx-4 md:px-8 md:-mx-8"
                        >
                            <div className="md:w-1/3 mb-4 md:mb-0 md:pr-8 flex items-center">
                                <h3 className="font-orbitron text-xl uppercase tracking-tight text-white group-hover:text-white transition-colors duration-300">
                                    {feature.title}
                                </h3>
                            </div>
                            <div className="md:w-2/3 flex items-center">
                                <p className="font-rajdhani text-lg md:text-xl text-[#888888] font-medium leading-relaxed group-hover:text-[#aaaaaa] transition-colors duration-300">
                                    {feature.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </section>
    );
}
