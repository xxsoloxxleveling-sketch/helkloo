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

export default function Footer() {
    return (
        <footer className="w-full bg-[#050505] border-t border-[#1a1a1a] py-20 px-8 flex flex-col items-center justify-center overflow-hidden">
            <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                className="flex flex-col items-center w-full"
            >
                <motion.h2
                    variants={itemVariants}
                    className="font-orbitron text-4xl md:text-5xl font-extrabold uppercase tracking-widest text-[#aaaaaa] mb-4 text-center"
                >
                    ARYAN&apos;S ENERGY
                </motion.h2>
                <motion.div
                    variants={itemVariants}
                    className="w-12 h-[1px] bg-[#333333] mb-6"
                ></motion.div>

                <motion.div
                    variants={itemVariants}
                    className="font-rajdhani text-sm md:text-base text-[#555555] tracking-widest uppercase flex flex-col md:flex-row gap-2 md:gap-6 lg:gap-12"
                >
                    <a href="mailto:sales@aryansenergy.com" className="hover:text-white transition-colors duration-300">
                        sales@aryansenergy.com
                    </a>
                    <span className="hidden md:inline text-[#222222]">|</span>
                    <a href="tel:+923000000000" className="hover:text-white transition-colors duration-300">
                        +92 300 000 0000
                    </a>
                    <span className="hidden md:inline text-[#222222]">|</span>
                    <span className="cursor-default">
                        Lahore, Pakistan
                    </span>
                </motion.div>

                <motion.p
                    variants={itemVariants}
                    className="font-rajdhani text-[#333333] tracking-widest text-xs mt-16 uppercase text-center"
                >
                    &copy; {new Date().getFullYear()} Aryan&apos;s Energy. All rights reserved.
                </motion.p>
            </motion.div>
        </footer>
    );
}
