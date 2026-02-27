"use client";

import { useEffect, useRef } from "react";
import { MotionValue, useMotionValueEvent, useTransform } from "framer-motion";

const TOTAL_FRAMES = 181;
const INITIAL_PRELOAD = 30;

interface CanvasSequenceProps {
    scrollYProgress: MotionValue<number>;
}

export default function CanvasSequence({ scrollYProgress }: CanvasSequenceProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const framesRef = useRef<(HTMLImageElement | null)[]>([]);
    const currentFrameRef = useRef(0);
    const isReadyRef = useRef(false);

    const frameIndex = useTransform(scrollYProgress, [0, 1], [0, TOTAL_FRAMES - 1]);

    // Initialize frames array once
    if (framesRef.current.length === 0) {
        framesRef.current = new Array(TOTAL_FRAMES).fill(null);
    }

    function renderFrame(index: number) {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
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
        const imgRatio = img.naturalWidth / img.naturalHeight;
        const canvasRatio = width / height;

        let sx = 0, sy = 0, sw = img.naturalWidth, sh = img.naturalHeight;

        if (imgRatio > canvasRatio) {
            // Image is wider: crop sides
            sw = img.naturalHeight * canvasRatio;
            sx = (img.naturalWidth - sw) / 2;
        } else {
            // Image is taller: crop top/bottom
            sh = img.naturalWidth / canvasRatio;
            sy = (img.naturalHeight - sh) / 2;
        }

        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(img, sx, sy, sw, sh, 0, 0, width, height);
    }

    // Preload frames
    useEffect(() => {
        let cancelled = false;

        function loadImage(idx: number): Promise<HTMLImageElement> {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.src = `/frames/frame_${String(idx + 1).padStart(4, "0")}.webp`;
                img.onload = () => resolve(img);
                img.onerror = () => reject(new Error(`Frame ${idx + 1} failed`));
            });
        }

        async function preload() {
            // Phase 1: load first batch concurrently
            const batch = Array.from({ length: INITIAL_PRELOAD }, (_, i) => loadImage(i));

            try {
                const imgs = await Promise.all(batch);
                if (cancelled) return;
                imgs.forEach((img, i) => { framesRef.current[i] = img; });

                isReadyRef.current = true;
                // Render the first frame immediately
                renderFrame(0);
            } catch (err) {
                console.error("Initial preload error:", err);
            }

            // Phase 2: load remaining frames one by one
            for (let i = INITIAL_PRELOAD; i < TOTAL_FRAMES; i++) {
                if (cancelled) return;
                try {
                    const img = await loadImage(i);
                    if (cancelled) return;
                    framesRef.current[i] = img;
                } catch (err) {
                    console.error(`Frame ${i + 1} load error:`, err);
                }
            }
        }

        preload();
        return () => { cancelled = true; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Listen to scroll-driven frame index changes
    useMotionValueEvent(frameIndex, "change", (latest) => {
        if (!isReadyRef.current) return;

        const target = Math.min(Math.max(Math.round(latest), 0), TOTAL_FRAMES - 1);

        if (target !== currentFrameRef.current && framesRef.current[target]) {
            currentFrameRef.current = target;
            requestAnimationFrame(() => renderFrame(target));
        }
    });

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full block"
            style={{ width: "100%", height: "100%" }}
            aria-hidden="true"
        />
    );
}
