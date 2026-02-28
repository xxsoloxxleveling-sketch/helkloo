"use client";

import { useRef, useEffect, useState, useCallback, useMemo } from "react";
import { useScroll, useTransform, motion, cubicBezier, useMotionValueEvent } from "framer-motion";

const TOTAL_FRAMES = 600;
const INITIAL_PRELOAD = 25;
const PRELOAD_BATCH = 20;

function framePath(index: number, folder: string): string {
    return `/${folder}/frame_${String(index + 1).padStart(4, "0")}.webp`;
}

export default function SystemEvolution() {
    const containerRef = useRef<HTMLElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const frameFolderCandidates = useMemo(
        () => (isMobile ? ["frames-sm/system-evolution", "frames/system-evolution"] : ["frames/system-evolution"]),
        [isMobile]
    );

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    // Map scroll progress to frame index with cubic easing
    const easeInOutCubic = cubicBezier(0.65, 0, 0.35, 1);
    const easedProgress = useTransform(scrollYProgress, (v) => easeInOutCubic(v));
    const frameIndex = useTransform(easedProgress, [0, 1], [0, TOTAL_FRAMES - 1]);

    // Canvas Logic
    const framesRef = useRef<(ImageBitmap | HTMLImageElement | null)[]>([]);
    const framePromisesRef = useRef<Map<number, Promise<ImageBitmap | HTMLImageElement>>>(new Map());
    const resolvedFrameFolderRef = useRef<string>(frameFolderCandidates[0]);
    const currentFrameRef = useRef(-1);
    const desiredFrameRef = useRef(0);
    const isReadyRef = useRef(false);

    const renderFrame = useCallback((index: number) => {
        if (index === currentFrameRef.current) return;

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d", { alpha: false });
        if (!ctx) return;

        const img = framesRef.current[index];
        if (!img) return;

        const dpr = window.devicePixelRatio || 1;
        const { width, height } = canvas.getBoundingClientRect();

        const backingW = Math.floor(width * dpr);
        const backingH = Math.floor(height * dpr);

        if (canvas.width !== backingW || canvas.height !== backingH) {
            canvas.width = backingW;
            canvas.height = backingH;
        }

        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        const imgW = 'naturalWidth' in img ? img.naturalWidth : img.width;
        const imgH = 'naturalHeight' in img ? img.naturalHeight : img.height;

        const imgRatio = imgW / imgH;
        const canvasRatio = width / height;

        let sx = 0, sy = 0, sw = imgW, sh = imgH;

        if (imgRatio > canvasRatio) {
            sw = imgH * canvasRatio;
            sx = (imgW - sw) / 2;
        } else {
            sh = imgW / canvasRatio;
            sy = (imgH - sh) / 2;
        }

        ctx.drawImage(img, sx, sy, sw, sh, 0, 0, width, height);
        currentFrameRef.current = index;
    }, []);

    useEffect(() => {
        let cancelled = false;
        framesRef.current = new Array(TOTAL_FRAMES).fill(null);
        framePromisesRef.current.clear();
        resolvedFrameFolderRef.current = frameFolderCandidates[0];
        currentFrameRef.current = -1;
        isReadyRef.current = false;

        async function loadFromUrl(url: string): Promise<ImageBitmap | HTMLImageElement> {
            try {
                const response = await fetch(url);
                if (!response.ok) throw new Error(`Failed to fetch ${url}`);
                const blob = await response.blob();

                if (typeof window !== 'undefined' && 'createImageBitmap' in window) {
                    return await window.createImageBitmap(blob);
                }

                return new Promise((resolve, reject) => {
                    const img = new Image();
                    img.decoding = "async";
                    img.src = URL.createObjectURL(blob);
                    img.onload = () => resolve(img);
                    img.onerror = () => reject(new Error(`Fallback failed for ${url}`));
                });
            } catch (err) {
                // Fallback direct image load
                return new Promise((resolve, reject) => {
                    const img = new Image();
                    img.decoding = "async";
                    img.src = url;
                    img.onload = async () => {
                        try { await img.decode(); } catch { }
                        resolve(img);
                    };
                    img.onerror = () => reject(err);
                });
            }
        }

        async function loadFrame(idx: number): Promise<ImageBitmap | HTMLImageElement> {
            const folderOrder = [
                resolvedFrameFolderRef.current,
                ...frameFolderCandidates.filter((folder) => folder !== resolvedFrameFolderRef.current),
            ];

            let lastError: unknown = null;
            for (const folder of folderOrder) {
                const url = framePath(idx, folder);
                try {
                    const img = await loadFromUrl(url);
                    resolvedFrameFolderRef.current = folder;
                    return img;
                } catch (err) {
                    lastError = err;
                }
            }

            throw lastError instanceof Error ? lastError : new Error(`Failed to load frame ${idx + 1}`);
        }

        async function ensureFrame(idx: number): Promise<ImageBitmap | HTMLImageElement> {
            if (idx >= TOTAL_FRAMES) return Promise.reject("Out of bounds");

            const existing = framesRef.current[idx];
            if (existing) return existing;

            const inFlight = framePromisesRef.current.get(idx);
            if (inFlight) return inFlight;

            const promise = loadFrame(idx).then((img) => {
                if (!cancelled) framesRef.current[idx] = img;
                return img;
            }).finally(() => {
                framePromisesRef.current.delete(idx);
            });

            framePromisesRef.current.set(idx, promise);
            return promise;
        }

        async function preload() {
            // Priority preload
            const initialCount = Math.min(INITIAL_PRELOAD, TOTAL_FRAMES);
            const batch = Array.from({ length: initialCount }, (_, i) => ensureFrame(i));
            await Promise.allSettled(batch);
            if (cancelled) return;

            const firstLoadedIndex = framesRef.current.findIndex(img => img !== null);
            const requestedIndex = desiredFrameRef.current;

            if (framesRef.current[requestedIndex]) {
                isReadyRef.current = true;
                renderFrame(requestedIndex);
            } else if (firstLoadedIndex !== -1) {
                isReadyRef.current = true;
                renderFrame(firstLoadedIndex);
            }

            // Lazy load remaining
            let nextIndex = initialCount;
            const processNextBatch = async () => {
                if (cancelled || nextIndex >= TOTAL_FRAMES) return;
                const batchSize = Math.min(PRELOAD_BATCH, TOTAL_FRAMES - nextIndex);
                const workers = Array.from({ length: batchSize }, async () => {
                    while (!cancelled && nextIndex < TOTAL_FRAMES) {
                        const i = nextIndex++;
                        try {
                            await ensureFrame(i);
                            if (cancelled) return;
                            if (i === desiredFrameRef.current) {
                                isReadyRef.current = true;
                                requestAnimationFrame(() => renderFrame(i));
                            }
                        } catch { }
                    }
                });

                await Promise.all(workers);
                if (nextIndex < TOTAL_FRAMES) {
                    setTimeout(processNextBatch, 50);
                }
            };

            setTimeout(processNextBatch, 100);
        }

        preload();
        return () => {
            cancelled = true;
        };
    }, [frameFolderCandidates, renderFrame]);

    useMotionValueEvent(frameIndex, "change", (latest) => {
        const target = Math.min(Math.max(Math.round(latest), 0), TOTAL_FRAMES - 1);
        desiredFrameRef.current = target;
        if (!isReadyRef.current) return;

        if (framesRef.current[target] && target !== currentFrameRef.current) {
            requestAnimationFrame(() => renderFrame(target));
            return;
        }
    });

    useEffect(() => {
        function handleResize() {
            if (!isReadyRef.current) return;
            const index = Math.max(0, currentFrameRef.current);
            currentFrameRef.current = -1;
            requestAnimationFrame(() => renderFrame(index));
        }
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [renderFrame]);

    // --- Content Animation Phases ---

    // Phase 1: 0 - 20%
    const p1Opacity = useTransform(scrollYProgress, [0, 0.05, 0.15, 0.20], [0, 1, 1, 0]);
    const p1Y = useTransform(scrollYProgress, [0, 0.05, 0.15, 0.20], [20, 0, 0, -20]);

    // Phase 2: 20 - 40%
    const p2Opacity = useTransform(scrollYProgress, [0.20, 0.25, 0.35, 0.40], [0, 1, 1, 0]);
    const p2Y = useTransform(scrollYProgress, [0.20, 0.25, 0.35, 0.40], [20, 0, 0, -20]);

    // Phase 3: 40 - 65%
    const p3Opacity = useTransform(scrollYProgress, [0.40, 0.45, 0.60, 0.65], [0, 1, 1, 0]);
    const p3Y = useTransform(scrollYProgress, [0.40, 0.45, 0.60, 0.65], [20, 0, 0, -20]);

    // Phase 4: 65 - 85%
    const p4Opacity = useTransform(scrollYProgress, [0.65, 0.70, 0.80, 0.85], [0, 1, 1, 0]);
    const p4Y = useTransform(scrollYProgress, [0.65, 0.70, 0.80, 0.85], [20, 0, 0, -20]);

    // Phase 5: 85 - 100%
    const p5Opacity = useTransform(scrollYProgress, [0.85, 0.90, 0.99, 1], [0, 1, 1, 1]);
    const p5Y = useTransform(scrollYProgress, [0.85, 0.90, 0.99, 1], [20, 0, 0, 0]);

    return (
        <section ref={containerRef} className="relative w-full h-[700vh] bg-[#0b0b0b]">
            <div className="sticky top-0 left-0 w-full h-screen overflow-hidden">
                <canvas
                    ref={canvasRef}
                    className="absolute inset-0 w-full h-full object-cover origin-center"
                    aria-hidden="true"
                />

                {/* Subtle Cinematic Vignette */}
                <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                        background: 'radial-gradient(circle at center, transparent 30%, rgba(11,11,11,0.6) 100%)'
                    }}
                />

                {/* Massive Breathing Space Container -> left aligned text */}
                <div className="absolute inset-0 w-full max-w-[1400px] mx-auto px-6 md:px-12 xl:px-24 flex items-center h-full z-10">

                    {/* Phase 1 */}
                    <motion.div
                        style={{ opacity: p1Opacity, y: p1Y }}
                        className="absolute max-w-2xl"
                    >
                        <h2 className="text-4xl md:text-6xl font-light text-white mb-6 tracking-tight">
                            Precision Manufacturing.
                        </h2>
                        <p className="text-lg md:text-2xl text-white/70 font-light leading-relaxed">
                            Fully automated Tier-1 production lines engineered for national-scale solar deployment.
                        </p>
                    </motion.div>

                    {/* Phase 2 */}
                    <motion.div
                        style={{ opacity: p2Opacity, y: p2Y }}
                        className="absolute max-w-2xl"
                    >
                        <h2 className="text-4xl md:text-6xl font-light text-white mb-6 tracking-tight">
                            N-Type TOPCon Modules.
                        </h2>
                        <p className="text-lg md:text-2xl text-white/70 font-light leading-relaxed">
                            22.5%+ efficiency. Low annual degradation. Optimized for extreme temperatures.
                        </p>
                    </motion.div>

                    {/* Phase 3 */}
                    <motion.div
                        style={{ opacity: p3Opacity, y: p3Y }}
                        className="absolute max-w-2xl"
                    >
                        <h2 className="text-4xl md:text-6xl font-light text-white mb-6 tracking-tight">
                            Intelligent Power Conversion.
                        </h2>
                        <p className="text-lg md:text-2xl text-white/70 font-light leading-relaxed">
                            Multi-MPPT hybrid and industrial string inverters ensuring grid stability.
                        </p>
                    </motion.div>

                    {/* Phase 4 */}
                    <motion.div
                        style={{ opacity: p4Opacity, y: p4Y }}
                        className="absolute max-w-2xl"
                    >
                        <h2 className="text-4xl md:text-6xl font-light text-white mb-6 tracking-tight">
                            Advanced LiFePO4 Storage.
                        </h2>
                        <p className="text-lg md:text-2xl text-white/70 font-light leading-relaxed">
                            6,000+ cycle life. Smart BMS. High-density lithium architecture.
                        </p>
                    </motion.div>

                    {/* Phase 5 */}
                    <motion.div
                        style={{ opacity: p5Opacity, y: p5Y }}
                        className="absolute max-w-2xl"
                    >
                        <h2 className="text-4xl md:text-6xl font-light text-white mb-8 tracking-tight">
                            Complete Industrial <br className="hidden md:block" /> Energy Systems.
                        </h2>
                        <button className="bg-white text-black px-8 py-4 rounded-full text-sm font-medium tracking-wide hover:bg-white/90 transition-colors uppercase">
                            Request Partnership
                        </button>
                    </motion.div>

                </div>
            </div>
        </section>
    );
}
