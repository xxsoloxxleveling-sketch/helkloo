"use client";

import Link from "next/link";
import { Menu } from "lucide-react";
import { useScroll, useMotionValueEvent } from "framer-motion";
import { useState } from "react";

export default function Navbar() {
    const { scrollY } = useScroll();
    const [scrolled, setScrolled] = useState(false);

    useMotionValueEvent(scrollY, "change", (latest) => {
        if (typeof window !== "undefined") {
            setScrolled(latest > window.innerHeight * 0.05);
        }
    });

    return (
        <nav
            className={`fixed top-0 left-0 w-full z-[100] flex items-center justify-between px-6 py-4 pointer-events-none text-white transition-all duration-300 ${scrolled
                    ? "bg-[#0b0b0b]/80 backdrop-blur-md border-b border-[#2a2a2a] shadow-none"
                    : "bg-transparent mix-blend-difference border-b border-transparent"
                }`}
        >
            <div className={`font-orbitron font-bold text-xl uppercase tracking-widest pointer-events-auto transition-opacity duration-300 ${scrolled ? "mix-blend-normal" : ""}`}>
                <Link href="/">Aryan&apos;s Energy</Link>
            </div>

            <div className={`flex gap-8 items-center pointer-events-auto font-medium text-sm tracking-wider uppercase transition-opacity duration-300 ${scrolled ? "mix-blend-normal" : ""}`}>
                <Link href="#products" className="hover:text-white/70 transition-colors">Products</Link>
                <Link href="#technology" className="hover:text-white/70 transition-colors">Technology</Link>
                <Link href="#about" className="hover:text-white/70 transition-colors">About</Link>
                <button aria-label="Menu" className="p-2 border border-white/20 rounded-full hover:bg-white hover:text-black transition-colors">
                    <Menu className="w-5 h-5" />
                </button>
            </div>
        </nav>
    );
}
