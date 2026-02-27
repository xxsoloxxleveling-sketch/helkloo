"use client";

import Link from "next/link";
import { motion } from "framer-motion";

type Panel = {
    id?: string;
    title: string;
    subtitle: string;
    videoSrc?: string;
    backgroundClass: string;
    showGrid?: boolean;
    cta?: {
        label: string;
        href: string;
    };
};

const PANELS: Panel[] = [
    {
        id: "about",
        title: "Engineered at Scale.",
        subtitle: "Tier-1 manufacturing flow designed for precision, speed, and consistency.",
        videoSrc: "/Manufacturing%20panel%20video.mp4",
        backgroundClass:
            "bg-[radial-gradient(circle_at_20%_20%,rgba(183,28,28,0.22),transparent_45%),linear-gradient(120deg,#0e0e0e_0%,#1a1a1a_45%,#0b0b0b_100%)]",
    },
    {
        title: "Intelligent Energy Systems.",
        subtitle: "Inverter, storage, and control layers coordinated as one resilient stack.",
        videoSrc: "/System%20Panel%20Video.mp4",
        backgroundClass:
            "bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.12),transparent_40%),linear-gradient(140deg,#0a0a0a_0%,#101418_60%,#0b0b0b_100%)]",
        showGrid: true,
    },
    {
        title: "Powering Pakistan's Industrial Future.",
        subtitle: "National-scale deployment strategy backed by local execution capacity.",
        videoSrc: "/national%20Impact%20Panel.mp4",
        backgroundClass:
            "bg-[radial-gradient(circle_at_50%_20%,rgba(255,196,0,0.22),transparent_42%),linear-gradient(120deg,#111111_0%,#1d1b16_50%,#0b0b0b_100%)]",
        cta: {
            label: "Request Partnership",
            href: "#contact",
        },
    },
];

export default function ImmersivePanels() {
    return (
        <div className="relative w-full bg-[#0b0b0b] border-t border-white/10">
            {PANELS.map((panel, index) => (
                <section
                    key={`${panel.title}-${index}`}
                    id={panel.id}
                    className="relative h-screen w-full overflow-hidden"
                >
                    <div className={`absolute inset-0 ${panel.backgroundClass}`} />

                    {panel.videoSrc ? (
                        <video
                            autoPlay
                            loop
                            muted
                            playsInline
                            preload="metadata"
                            className="absolute inset-0 h-full w-full object-cover"
                        >
                            <source src={panel.videoSrc} type="video/mp4" />
                        </video>
                    ) : null}

                    {panel.showGrid ? (
                        <div className="absolute inset-0 opacity-[0.08] bg-[linear-gradient(rgba(255,255,255,0.8)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.8)_1px,transparent_1px)] [background-size:34px_34px]" />
                    ) : null}

                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.48)_0%,rgba(0,0,0,0.72)_100%)]" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_80%,transparent_0%,rgba(0,0,0,0.25)_55%,rgba(0,0,0,0.52)_100%)]" />

                    <div className="pointer-events-none absolute inset-4 md:inset-8 border border-white/20 rounded-xl bg-black/15" />

                    <motion.div
                        initial={{ opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-120px" }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="relative z-10 mx-auto flex h-full max-w-6xl flex-col items-center justify-center px-8 text-center"
                    >
                        <h2 className="max-w-4xl font-orbitron text-4xl font-bold uppercase leading-[1.03] tracking-tight text-white sm:text-5xl md:text-7xl">
                            {panel.title}
                        </h2>
                        <p className="mt-5 max-w-2xl font-rajdhani text-base tracking-wide text-white/70 md:text-xl">
                            {panel.subtitle}
                        </p>
                        {panel.cta ? (
                            <Link
                                href={panel.cta.href}
                                className="mt-10 border border-white/40 bg-white px-7 py-3 font-orbitron text-xs font-bold uppercase tracking-[0.22em] text-black transition-colors hover:bg-white/85"
                            >
                                {panel.cta.label}
                            </Link>
                        ) : null}
                    </motion.div>

                    {index < PANELS.length - 1 ? (
                        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-36 bg-gradient-to-b from-transparent to-[#0b0b0b]" />
                    ) : null}
                </section>
            ))}
        </div>
    );
}
