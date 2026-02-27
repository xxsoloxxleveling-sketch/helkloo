"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { MotionValue, useMotionValueEvent, useTransform, cubicBezier, motion } from "framer-motion";
import { Volume2, VolumeX } from "lucide-react";

interface CanvasSequenceProps {
    scrollYProgress: MotionValue<number>;
    isMobile: boolean;
}

function normalizeBasePath(path: string): string {
    if (!path) return "";
    return `/${path.replace(/^\/+|\/+$/g, "")}`;
}

function inferBasePathFromNextScripts(): string {
    if (typeof document === "undefined") return "";

    const nextScript = document.querySelector<HTMLScriptElement>('script[src*="/_next/"]');
    const src = nextScript?.getAttribute("src");
    if (!src) return "";

    const pathname = src.startsWith("http") ? new URL(src).pathname : src;
    const markerIndex = pathname.indexOf("/_next/");
    if (markerIndex <= 0) return "";

    return normalizeBasePath(pathname.slice(0, markerIndex));
}

function frameFileName(index: number): string {
    return `frame_${String(index + 1).padStart(4, "0")}.webp`;
}

export default function CanvasSequence({ scrollYProgress, isMobile }: CanvasSequenceProps) {
    // Mobile refinements: 30% fewer frames, different folder
    const TOTAL_FRAMES = isMobile ? Math.floor(181 * 0.7) : 181;
    const INITIAL_PRELOAD = 15; // Performance: only 15 immediately
    const PRELOAD_BATCH = 10;
    const PRELOAD_CONCURRENCY = 4;
    const frameFolderCandidates = useMemo(
        () => (isMobile ? ["frames-sm", "frames"] : ["frames"]),
        [isMobile]
    );

    function frameUrl(basePath: string, file: string, folder: string): string {
        return basePath ? `${basePath}/${folder}/${file}` : `/${folder}/${file}`;
    }

    const canvasRef = useRef<HTMLCanvasElement>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    // Support createImageBitmap for performance
    const framesRef = useRef<(ImageBitmap | HTMLImageElement | null)[]>([]);

    // Re-initialize frames array when TOTAL_FRAMES changes
    useEffect(() => {
        framesRef.current = new Array(TOTAL_FRAMES).fill(null);
    }, [TOTAL_FRAMES]);

    const framePromisesRef = useRef<Map<number, Promise<ImageBitmap | HTMLImageElement>>>(new Map());
    const resolvedBasePathRef = useRef<string>("");
    const resolvedFrameFolderRef = useRef<string>(frameFolderCandidates[0]);
    const ensureFrameRef = useRef<((index: number) => Promise<ImageBitmap | HTMLImageElement>) | null>(null);
    const currentFrameRef = useRef(-1); // Start at -1 to force initial redraw
    const desiredFrameRef = useRef(0);
    const isReadyRef = useRef(false);

    // Audio State
    const [isMuted, setIsMuted] = useState(true);
    const [audioStarted, setAudioStarted] = useState(false);
    const [audioAvailable, setAudioAvailable] = useState(false);

    // Apply a subtle ease-in-out curve to the scroll progress for a "heavy" mechanical feel
    const easeInOutCubic = cubicBezier(0.65, 0, 0.35, 1);
    const easedProgress = useTransform(scrollYProgress, (v) => easeInOutCubic(v));
    const frameIndex = useTransform(easedProgress, [0, 1], [0, TOTAL_FRAMES - 1]);

    // Add cinematic zoom: starts slightly zoomed in and pulls back
    const scale = useTransform(scrollYProgress, [0, 1], [1.05, 1.0]);

    const renderFrame = useCallback((index: number) => {
        if (index === currentFrameRef.current) return; // Prevent redundant redraws

        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d", { alpha: false }); // Performance optimization
        if (!ctx) return;

        const img = framesRef.current[index];
        if (!img) return;

        const dpr = window.devicePixelRatio || 1;
        const { width, height } = canvas.getBoundingClientRect();

        // Only resize the backing store when needed
        const backingW = Math.floor(width * dpr);
        const backingH = Math.floor(height * dpr);

        if (canvas.width !== backingW || canvas.height !== backingH) {
            canvas.width = backingW;
            canvas.height = backingH;
        }

        // Reset transform and scale for DPR
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        // object-fit: cover math
        const imgW = 'naturalWidth' in img ? img.naturalWidth : img.width;
        const imgH = 'naturalHeight' in img ? img.naturalHeight : img.height;

        const imgRatio = imgW / imgH;
        const canvasRatio = width / height;

        let sx = 0, sy = 0, sw = imgW, sh = imgH;

        if (imgRatio > canvasRatio) {
            // Image is wider: crop sides
            sw = imgH * canvasRatio;
            sx = (imgW - sw) / 2;
        } else {
            // Image is taller: crop top/bottom
            sh = imgW / canvasRatio;
            sy = (imgH - sh) / 2;
        }

        ctx.drawImage(img, sx, sy, sw, sh, 0, 0, width, height);
        currentFrameRef.current = index;
    }, []);

    // Initialize Audio
    useEffect(() => {
        let cancelled = false;

        void fetch("/audio/industrial-hum.mp3", { method: "HEAD" })
            .then((res) => {
                if (!cancelled) {
                    setAudioAvailable(res.ok);
                }
            })
            .catch(() => {
                if (!cancelled) {
                    setAudioAvailable(false);
                }
            });

        return () => {
            cancelled = true;
        };
    }, []);

    useEffect(() => {
        if (!audioAvailable) return;

        audioRef.current = new Audio('/audio/industrial-hum.mp3'); // We'll assume a placeholder exists or handle fail gracefully
        audioRef.current.loop = true;
        audioRef.current.volume = 0.15; // Volume below 20%

        const handleInteraction = () => {
            if (!audioStarted && !isMuted && audioRef.current) {
                audioRef.current.play().catch(() => { });
                setAudioStarted(true);
            }
        };

        window.addEventListener('scroll', handleInteraction, { once: true });
        window.addEventListener('click', handleInteraction, { once: true });

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
            }
            window.removeEventListener('scroll', handleInteraction);
            window.removeEventListener('click', handleInteraction);
        }
    }, [isMuted, audioStarted, audioAvailable]);

    const toggleMute = () => {
        if (!audioAvailable) return;

        setIsMuted(!isMuted);
        if (audioRef.current) {
            if (isMuted) { // It was muted, now playing
                audioRef.current.play().catch(() => { });
                setAudioStarted(true);
            } else {
                audioRef.current.pause();
            }
        }
    }

    // Preload frames
    useEffect(() => {
        let cancelled = false;

        framesRef.current = new Array(TOTAL_FRAMES).fill(null);
        framePromisesRef.current.clear();
        resolvedBasePathRef.current = "";
        resolvedFrameFolderRef.current = frameFolderCandidates[0];
        currentFrameRef.current = -1;
        isReadyRef.current = false;

        const configuredBasePath = normalizeBasePath(process.env.NEXT_PUBLIC_BASE_PATH || "");
        const inferredBasePath = inferBasePathFromNextScripts();
        const basePathCandidates = Array.from(
            new Set([configuredBasePath, inferredBasePath, ""])
        );

        async function loadFromUrl(url: string): Promise<ImageBitmap | HTMLImageElement> {
            try {
                const response = await fetch(url);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const blob = await response.blob();

                // Use createImageBitmap if supported (better performance, no main thread blocking)
                if (typeof window !== 'undefined' && 'createImageBitmap' in window) {
                    return await window.createImageBitmap(blob);
                }

                // Fallback
                return new Promise((resolve, reject) => {
                    const img = new Image();
                    img.decoding = "async";
                    img.src = URL.createObjectURL(blob);
                    img.onload = () => resolve(img);
                    img.onerror = () => reject(new Error(`Fallback failed for ${url}`));
                });

            } catch {
                // Classic fallback if fetch fails
                return new Promise((resolve, reject) => {
                    const img = new Image();
                    img.decoding = "async";
                    img.src = url;
                    img.onload = async () => {
                        try {
                            await img.decode();
                        } catch { }
                        resolve(img);
                    };
                    img.onerror = () => reject(new Error(`Failed to load ${url}`));
                });
            }
        }

        async function resolveWorkingAssetRoot(): Promise<{ basePath: string; folder: string }> {
            if (resolvedBasePathRef.current) {
                return {
                    basePath: resolvedBasePathRef.current,
                    folder: resolvedFrameFolderRef.current,
                };
            }

            const probeFile = frameFileName(0);
            let lastError: unknown = null;
            for (const folder of frameFolderCandidates) {
                for (const basePath of basePathCandidates) {
                    const url = frameUrl(basePath, probeFile, folder);
                    try {
                        const probe = await loadFromUrl(url);
                        if (!framesRef.current[0]) {
                            framesRef.current[0] = probe;
                        }
                        resolvedBasePathRef.current = basePath;
                        resolvedFrameFolderRef.current = folder;
                        return { basePath, folder };
                    } catch (err) {
                        lastError = err;
                    }
                }
            }

            throw new Error(`Failed to resolve frame base path. ${String(lastError)}`);
        }

        async function loadFrame(idx: number): Promise<ImageBitmap | HTMLImageElement> {
            const preloaded = framesRef.current[idx];
            if (preloaded) return preloaded;

            const preferred = await resolveWorkingAssetRoot();
            const file = frameFileName(idx);
            const orderedCandidates = [
                preferred,
                ...frameFolderCandidates.flatMap((folder) =>
                    basePathCandidates.map((basePath) => ({ basePath, folder }))
                ),
            ].filter(
                (candidate, index, arr) =>
                    arr.findIndex(
                        (entry) =>
                            entry.basePath === candidate.basePath && entry.folder === candidate.folder
                    ) === index
            );

            const existing = framesRef.current[idx];
            if (existing) return existing;

            let lastError: unknown = null;
            for (const candidate of orderedCandidates) {
                const url = frameUrl(candidate.basePath, file, candidate.folder);
                try {
                    const img = await loadFromUrl(url);
                    resolvedBasePathRef.current = candidate.basePath;
                    resolvedFrameFolderRef.current = candidate.folder;
                    return img;
                } catch (err) {
                    lastError = err;
                }
            }

            throw new Error(`Failed to load frame ${idx + 1}. ${String(lastError)}`);
        }

        async function ensureFrame(idx: number): Promise<ImageBitmap | HTMLImageElement> {
            if (idx >= TOTAL_FRAMES) return Promise.reject("Out of bounds");

            const existing = framesRef.current[idx];
            if (existing) return existing;

            const inFlight = framePromisesRef.current.get(idx);
            if (inFlight) return inFlight;

            const promise = loadFrame(idx)
                .then((img) => {
                    if (!cancelled) {
                        framesRef.current[idx] = img;
                    }
                    return img;
                })
                .finally(() => {
                    framePromisesRef.current.delete(idx);
                });

            framePromisesRef.current.set(idx, promise);
            return promise;
        }

        ensureFrameRef.current = ensureFrame;

        async function preload() {
            // Phase 1: load first batch immediately
            const initialCount = Math.min(INITIAL_PRELOAD, TOTAL_FRAMES);
            const batch = Array.from({ length: initialCount }, (_, i) => ensureFrame(i));
            await Promise.allSettled(batch);
            if (cancelled) return;

            const firstLoadedIndex = framesRef.current.findIndex((img) => img !== null);
            const requestedIndex = desiredFrameRef.current;
            if (framesRef.current[requestedIndex]) {
                isReadyRef.current = true;
                renderFrame(requestedIndex);
            } else if (firstLoadedIndex !== -1) {
                isReadyRef.current = true;
                renderFrame(firstLoadedIndex);
            }

            // Phase 2: Lazy loading batches
            let nextIndex = initialCount;

            const processNextBatch = async () => {
                if (cancelled || nextIndex >= TOTAL_FRAMES) return;

                const batchSize = Math.min(PRELOAD_BATCH, TOTAL_FRAMES - nextIndex);
                const workers = Array.from({ length: Math.min(PRELOAD_CONCURRENCY, batchSize) }, async () => {
                    while (!cancelled && nextIndex < TOTAL_FRAMES) {
                        const i = nextIndex++;
                        try {
                            await ensureFrame(i);
                            if (cancelled) return;
                            if (!isReadyRef.current && i === desiredFrameRef.current) {
                                isReadyRef.current = true;
                                requestAnimationFrame(() => renderFrame(i));
                            } else if (i === desiredFrameRef.current && currentFrameRef.current !== i) {
                                requestAnimationFrame(() => renderFrame(i));
                            }
                        } catch {
                            // Silently handle load errors for batch
                        }
                    }
                });

                await Promise.all(workers);

                // Continue yielding to main thread
                if (nextIndex < TOTAL_FRAMES) {
                    if ("requestIdleCallback" in window) {
                        const win = window as Window & {
                            requestIdleCallback?: (callback: IdleRequestCallback) => number;
                        };
                        win.requestIdleCallback?.(processNextBatch);
                    } else {
                        setTimeout(processNextBatch, 50);
                    }
                }
            };

            // Kick off batch loading when idle
            if ("requestIdleCallback" in window) {
                const win = window as Window & {
                    requestIdleCallback?: (callback: IdleRequestCallback) => number;
                };
                win.requestIdleCallback?.(processNextBatch);
            } else {
                setTimeout(processNextBatch, 100);
            }
        }

        preload();
        return () => {
            cancelled = true;
            ensureFrameRef.current = null;
            framePromisesRef.current.clear();
        };
    }, [TOTAL_FRAMES, frameFolderCandidates, renderFrame]);

    useEffect(() => {
        function handleResize() {
            if (!isReadyRef.current) return;
            // Force redraw on resize by resetting currentFrameRef tracking temporarily
            const index = Math.max(0, currentFrameRef.current);
            currentFrameRef.current = -1;
            requestAnimationFrame(() => renderFrame(index));
        }

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [renderFrame]);

    // Listen to scroll-driven frame index changes
    useMotionValueEvent(frameIndex, "change", (latest) => {
        const target = Math.min(Math.max(Math.round(latest), 0), TOTAL_FRAMES - 1);
        desiredFrameRef.current = target;
        if (!isReadyRef.current) return;

        if (target !== currentFrameRef.current && framesRef.current[target]) {
            requestAnimationFrame(() => renderFrame(target));
            return;
        }

        if (framesRef.current[target]) return;

        const ensureFrame = ensureFrameRef.current;
        if (!ensureFrame) return;

        void ensureFrame(target)
            .then(() => {
                if (desiredFrameRef.current !== target) return;
                if (!framesRef.current[target]) return;
                requestAnimationFrame(() => renderFrame(target));
            })
            .catch(() => { });
    });

    return (
        <>
            <motion.canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full block"
                style={{ width: "100%", height: "100%", scale }}
                aria-hidden="true"
            />
            {/* Audio Toggle Control */}
            {audioAvailable ? (
                <div className="absolute top-24 right-6 z-[60]">
                    <button
                        onClick={toggleMute}
                        className="p-3 border border-white/20 bg-black/50 backdrop-blur-md rounded-full text-white/50 hover:text-white hover:border-white/50 transition-all pointer-events-auto"
                        aria-label={isMuted ? "Unmute sound" : "Mute sound"}
                    >
                        {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                    </button>
                </div>
            ) : null}
        </>
    );
}
