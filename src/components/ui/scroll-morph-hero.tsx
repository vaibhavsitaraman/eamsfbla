"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { motion, useTransform, useSpring, useMotionValue } from "framer-motion";
import { ShineBorder } from "@/components/ui/shine-border";

// --- Types ---
export type AnimationPhase = "scatter" | "line" | "circle" | "bottom-strip";

interface IntroAnimationProps {
  onNavReady?: () => void;
}

interface FlipCardProps {
  src: string;
  index: number;
  total: number;
  phase: AnimationPhase;
  target: {
    x: number;
    y: number;
    rotation: number;
    scale: number;
    opacity: number;
  };
}

// --- FlipCard Component ---
const IMG_WIDTH = 55;
const IMG_HEIGHT = 75;

function FlipCard({ src, index, total, phase, target }: FlipCardProps) {
  return (
    <motion.div
      animate={{
        x: target.x,
        y: target.y,
        rotate: target.rotation,
        scale: target.scale,
        opacity: target.opacity,
      }}
      transition={{
        type: "spring",
        stiffness: 40,
        damping: 15,
      }}
      style={{
        position: "absolute",
        width: IMG_WIDTH,
        height: IMG_HEIGHT,
        transformStyle: "preserve-3d",
        perspective: "1000px",
      }}
      className="cursor-pointer group"
    >
      <motion.div
        className="relative h-full w-full"
        style={{ transformStyle: "preserve-3d" }}
        transition={{ duration: 0.6, type: "spring", stiffness: 260, damping: 20 }}
        whileHover={{ rotateY: 180 }}
      >
        {/* Front Face */}
        <div
          className="absolute inset-0 h-full w-full overflow-hidden rounded-xl shadow-lg bg-gray-200"
          style={{ backfaceVisibility: "hidden" }}
        >
          <img src={src} alt={`hero-${index}`} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-black/10 transition-colors group-hover:bg-transparent" />
        </div>

        {/* Back Face */}
        <div
          className="absolute inset-0 h-full w-full overflow-hidden rounded-xl shadow-lg bg-gray-900 flex flex-col items-center justify-center p-4 border border-gray-700"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          <div className="text-center">
            <p className="text-[8px] font-bold text-blue-400 uppercase tracking-widest mb-1">
              View
            </p>
            <p className="text-[10px] font-medium text-white">Details</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// --- Main Hero Component ---
const TOTAL_IMAGES = 20;
const MAX_SCROLL = 3000;

// Use the same images as the rotating image gallery in HeroSection
const BASE_IMAGES = [
  "/past/fbla1.png",
  "/past/fbla2.png",
  "/past/fbla3.png",
  "/past/fbla4.png",
  "/past/fbla5.png",
  "/past/fbla6.png",
  "/past/fbla7.png",
];

const IMAGES = Array.from({ length: TOTAL_IMAGES }, (_, i) => BASE_IMAGES[i % BASE_IMAGES.length]);

// Helper for linear interpolation
const lerp = (start: number, end: number, t: number) => start * (1 - t) + end * t;

export default function IntroAnimation({ onNavReady }: IntroAnimationProps) {
  const [introPhase, setIntroPhase] = useState<AnimationPhase>("scatter");
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // --- Container Size ---
  useEffect(() => {
    if (!containerRef.current) return;

    const handleResize = (entries: ResizeObserverEntry[]) => {
      for (const entry of entries) {
        setContainerSize({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    };

    const observer = new ResizeObserver(handleResize);
    observer.observe(containerRef.current);

    setContainerSize({
      width: containerRef.current.offsetWidth,
      height: containerRef.current.offsetHeight,
    });

    return () => observer.disconnect();
  }, []);

  // --- Virtual Scroll Logic ---
  const virtualScroll = useMotionValue(0);
  const scrollRef = useRef(0);
  const navTriggeredRef = useRef(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();

      const newScroll = Math.min(Math.max(scrollRef.current + e.deltaY, 0), MAX_SCROLL);
      scrollRef.current = newScroll;
      virtualScroll.set(newScroll);

      if (!navTriggeredRef.current && newScroll >= MAX_SCROLL * 0.9) {
        navTriggeredRef.current = true;
        onNavReady?.();
      }
    };

    let touchStartY = 0;
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };
    const handleTouchMove = (e: TouchEvent) => {
      const touchY = e.touches[0].clientY;
      const deltaY = touchStartY - touchY;
      touchStartY = touchY;

      const newScroll = Math.min(Math.max(scrollRef.current + deltaY, 0), MAX_SCROLL);
      scrollRef.current = newScroll;
      virtualScroll.set(newScroll);

      if (!navTriggeredRef.current && newScroll >= MAX_SCROLL * 0.9) {
        navTriggeredRef.current = true;
        onNavReady?.();
      }
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    container.addEventListener("touchstart", handleTouchStart, { passive: false });
    container.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      container.removeEventListener("wheel", handleWheel);
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
    };
  }, [virtualScroll]);

  // 1. Morph Progress: 0 (Circle) -> 1 (Bottom Arc)
  const morphProgress = useTransform(virtualScroll, [0, 600], [0, 1]);
  const smoothMorph = useSpring(morphProgress, { stiffness: 40, damping: 20 });

  // 2. Scroll Rotation (Shuffling)
  const scrollRotate = useTransform(virtualScroll, [600, 3000], [0, 360]);
  const smoothScrollRotate = useSpring(scrollRotate, { stiffness: 40, damping: 20 });

  // --- Mouse Parallax ---
  const mouseX = useMotionValue(0);
  const smoothMouseX = useSpring(mouseX, { stiffness: 30, damping: 20 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const relativeX = e.clientX - rect.left;
      const normalizedX = (relativeX / rect.width) * 2 - 1;
      mouseX.set(normalizedX * 100);
    };
    container.addEventListener("mousemove", handleMouseMove);
    return () => container.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX]);

  // --- Intro Sequence ---
  useEffect(() => {
    const timer1 = setTimeout(() => setIntroPhase("line"), 500);
    const timer2 = setTimeout(() => setIntroPhase("circle"), 2500);
    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
    };
  }, []);

  // --- Random Scatter Positions ---
  const scatterPositions = useMemo(() => {
    return IMAGES.map(() => ({
      x: (Math.random() - 0.5) * 1500,
      y: (Math.random() - 0.5) * 1000,
      rotation: (Math.random() - 0.5) * 180,
      scale: 0.6,
      opacity: 0,
    }));
  }, []);

  // --- Render Loop (Manual Calculation for Morph) ---
  const [morphValue, setMorphValue] = useState(0);
  const [rotateValue, setRotateValue] = useState(0);
  const [parallaxValue, setParallaxValue] = useState(0);

  useEffect(() => {
    const unsubscribeMorph = smoothMorph.on("change", setMorphValue);
    const unsubscribeRotate = smoothScrollRotate.on("change", setRotateValue);
    const unsubscribeParallax = smoothMouseX.on("change", setParallaxValue);
    return () => {
      unsubscribeMorph();
      unsubscribeRotate();
      unsubscribeParallax();
    };
  }, [smoothMorph, smoothScrollRotate, smoothMouseX]);

  // --- Content Opacity - only fade in, no fade out ---
  const contentOpacity = useTransform(
    smoothMorph,
    [0.8, 1],
    [0, 1]
  );
  const contentY = useTransform(smoothMorph, [0.8, 1], [20, 0]);

  // --- Bottom Text Box Opacity - fades in after arc images exit ---
  const bottomTextOpacity = useTransform(
    virtualScroll,
    [MAX_SCROLL * 0.6, MAX_SCROLL * 0.8],
    [0, 1]
  );
  const bottomTextY = useTransform(
    virtualScroll,
    [MAX_SCROLL * 0.6, MAX_SCROLL * 0.8],
    [50, 0]
  );

  // --- Exit Animation - after arc is fully off screen ---
  const exitProgress = useTransform(
    virtualScroll,
    [MAX_SCROLL * 0.7, MAX_SCROLL],
    [0, 1]
  );
  const smoothExitProgress = useSpring(exitProgress, { stiffness: 40, damping: 20 });

  // Content slides down after arc exits
  const contentExitY = useTransform(smoothExitProgress, [0, 1], [0, 50]);
  const contentFinalY = useTransform(
    [contentY, contentExitY],
    ([y1, y2]) => (typeof y1 === 'number' ? y1 : 0) + (typeof y2 === 'number' ? y2 : 0)
  );

  // Button spread narrows to 300px after arc exits
  const buttonExitProgress = useTransform(smoothExitProgress, [0, 1], [0, 1]);
  const BUTTON_IMAGES = [
    { src: "eams.png", label: "EAMS", url: "https://eams.mcmsnj.net" },
    { src: "njfbla.png", label: "NJFBLA", url: "https://njfbla.org" },
    { src: "natsfbla.png", label: "FBLA", url: "https://fbla.org" },
  ];

  // Calculate button positions - start hidden, follow arc briefly, then lock at bottom
  const getButtonTarget = (index: number, exitProgressValue: number) => {
    // Buttons stay hidden during scatter and line phases
    if (introPhase === "scatter" || introPhase === "line") {
      return { x: 0, y: 0, rotation: 0, scale: 0.8, opacity: 0 };
    }

    const isMobile = containerSize.width < 768;
    const baseRadius = Math.min(containerSize.width, containerSize.height * 1.5);
    const arcRadius = baseRadius * (isMobile ? 1.4 : 1.1);
    const arcApexY = containerSize.height * (isMobile ? 0.35 : 0.25);
    const arcCenterY = arcApexY + arcRadius;
    const spreadAngle = isMobile ? 100 : 130;
    
    // Position buttons in the middle of the arc spread
    const buttonSpreadAngle = spreadAngle * 0.3;
    const startAngle = -90 - buttonSpreadAngle / 2;
    const step = buttonSpreadAngle / 2;
    
    const scrollProgress = Math.min(Math.max(rotateValue / 360, 0), 1);
    
    // Lock at bottom - happens as soon as scrolling starts
    const lockProgress = Math.min(scrollProgress / 0.15, 1); // Lock quickly (first 15% of scroll)
    
    const currentArcAngle = startAngle + index * step;
    const arcRad = (currentArcAngle * Math.PI) / 180;
    
    // Arc position - start from center of arc
    const arcX = Math.cos(arcRad) * arcRadius + parallaxValue;
    const arcY = Math.sin(arcRad) * arcRadius + arcCenterY;
    
    // Initial lock position - 400px spread
    const initialLockX = (index - 1) * 267;
    // Final position - 200px spread after arc exits
    const finalLockX = (index - 1) * 200;
    const lockX = lerp(initialLockX, finalLockX, exitProgressValue);
    
    // Lock Y moves down slightly after arc exits
    const initialLockY = 10;
    const finalLockY = 90; // Move down 33px
    const lockY = lerp(initialLockY, finalLockY, exitProgressValue);
    
    return {
      x: lerp(arcX, lockX, lockProgress),
      y: lerp(arcY, lockY, lockProgress),
      rotation: lerp(currentArcAngle + 90, 0, lockProgress),
      scale: lerp(isMobile ? 0.9 : 1.2, 1.0, lockProgress),
      opacity: morphValue > 0.5 ? 1 : 0, // Show as soon as arc forms
    };
  };

  return (
    <ShineBorder
      borderRadius={0}
      borderWidth={2}
      duration={12}
      color={["#3B82F6", "#60A5FA", "#2563EB"]}
      className="w-full h-full bg-slate-950 m-2"
    >
    <div ref={containerRef} className="relative w-full h-full bg-slate-950 overflow-hidden">
      <div className="flex h-full w-full flex-col items-center justify-center perspective-1000">
        {/* Intro Text */}
        <div className="absolute z-0 flex flex-col items-center justify-center text-center pointer-events-none top-1/2 -translate-y-1/2">
          <motion.h1
            initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
            animate={
              introPhase === "circle" && morphValue < 0.5
                ? { opacity: 1 - morphValue * 2, y: 0, filter: "blur(0px)" }
                : { opacity: 0, filter: "blur(10px)" }
            }
            transition={{ duration: 1 }}
            className="text-xl font-medium tracking-tight text-white md:text-3xl"
          >
            The future is built at <br></br><span className="text-blue-400">EAMS FBLA</span>.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={
              introPhase === "circle" && morphValue < 0.5
                ? { opacity: 0.5 - morphValue }
                : { opacity: 0 }
            }
            transition={{ duration: 1, delay: 0.2 }}
            className="mt-4 text-[10px] font-bold tracking-[0.2em] text-white/50"
          >
            SCROLL TO EXPLORE
          </motion.p>
        </div>

        {/* Arc Active Content - moved higher */}
        <motion.div
          style={{ opacity: contentOpacity, y: contentFinalY }}
          className="absolute top-[12%] z-10 flex flex-col items-center justify-center text-center pointer-events-none px-4"
        >
          <h2 className="text-2xl md:text-4xl font-semibold text-white tracking-tight mb-4">
            What is FBLA?
          </h2>
          <p className="text-xs md:text-sm text-white/70 max-w-lg leading-relaxed">
          Future Business Leaders of America is the largest business Career and Technical Student Organization in the world. Each year, FBLA helps more than 230,000 members in middle school, high school, and college prepare for careers in business.
          <br></br><br></br>
          Edison Academy Magnet School is one of the most successful chapters in the state of New Jersey.
          </p>
        </motion.div>

        {/* Three Lock-in Buttons - wider and linked */}
        <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
          {BUTTON_IMAGES.map((button, index) => {
            // Get current exit progress value for button positioning
            const [exitProgressValue, setExitProgressValue] = useState(0);
            useEffect(() => {
              const unsubscribe = smoothExitProgress.on("change", setExitProgressValue);
              return () => unsubscribe();
            }, [smoothExitProgress]);
            
            const target = getButtonTarget(index, exitProgressValue);
            return (
              <motion.a
                key={`button-${index}`}
                href={button.url}
                target="_blank"
                rel="noopener noreferrer"
                animate={{
                  x: target.x,
                  y: target.y,
                  rotate: target.rotation,
                  scale: target.scale,
                  opacity: target.opacity,
                }}
                transition={{
                  type: "spring",
                  stiffness: 40,
                  damping: 15,
                }}
                className="absolute pointer-events-auto cursor-pointer"
                style={{
                  width: 120,
                  height: 86,
                }}
              >
                <motion.div
                  className="relative h-full w-full rounded-xl overflow-hidden shadow-lg bg-gray-200 group"
                  whileHover={{ scale: 1.05, y: -5 }}
                  transition={{ duration: 0.3 }}
                >
                  <img 
                    src={button.src} 
                    alt={button.label} 
                    className="h-full w-full object-contain bg-white p-2"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-2 text-center">
                    <p className="text-[10px] font-bold text-white">{button.label}</p>
                  </div>
                </motion.div>
              </motion.a>
            );
          })}
        </div>

        {/* Main Container */}
        <div className="relative flex items-center justify-center w-full h-full">
          {IMAGES.slice(0, TOTAL_IMAGES).map((src, i) => {
            let target = { x: 0, y: 0, rotation: 0, scale: 1, opacity: 1 };

            if (introPhase === "scatter") {
              target = scatterPositions[i];
            } else if (introPhase === "line") {
              const lineSpacing = 47;
              const lineTotalWidth = TOTAL_IMAGES * lineSpacing;
              const lineX = i * lineSpacing - lineTotalWidth / 2;
              target = { x: lineX, y: 0, rotation: 0, scale: 1, opacity: 1 };
            } else {
              const isMobile = containerSize.width < 768;
              const minDimension = Math.min(containerSize.width, containerSize.height);

              const circleRadius = Math.min(minDimension * 0.4125, 4125);
              const circleAngle = (i / TOTAL_IMAGES) * 360;
              const circleRad = (circleAngle * Math.PI) / 180;
              const circlePos = {
                x: Math.cos(circleRad) * circleRadius,
                y: Math.sin(circleRad) * circleRadius,
                rotation: circleAngle + 90,
              };

              const baseRadius = Math.min(containerSize.width, containerSize.height * 1.5);
              const arcRadius = baseRadius * (isMobile ? 1.4 : 1.1);

              const arcApexY = containerSize.height * (isMobile ? 0.35 : 0.25);
              const arcCenterY = arcApexY + arcRadius;

              const spreadAngle = isMobile ? 100 : 130;
              const startAngle = -90 - spreadAngle / 2;
              const step = spreadAngle / (TOTAL_IMAGES - 1);

              const scrollProgress = Math.min(Math.max(rotateValue / 360, 0), 1);
              const maxRotation = spreadAngle * 0.8;
              const boundedRotation = -scrollProgress * maxRotation;

              const currentArcAngle = startAngle + i * step + boundedRotation;
              const arcRad = (currentArcAngle * Math.PI) / 180;

              const arcPos = {
                x: Math.cos(arcRad) * arcRadius + parallaxValue,
                y: Math.sin(arcRad) * arcRadius + arcCenterY,
                rotation: currentArcAngle + 90,
                scale: isMobile ? 0.9 : 1.2,
              };

              target = {
                x: lerp(circlePos.x, arcPos.x, morphValue),
                y: lerp(circlePos.y, arcPos.y, morphValue),
                rotation: lerp(circlePos.rotation, arcPos.rotation, morphValue),
                scale: lerp(1, arcPos.scale, morphValue),
                opacity: 1,
              };
            }

            return (
              <FlipCard
                key={i}
                src={src}
                index={i}
                total={TOTAL_IMAGES}
                phase={introPhase}
                target={target}
              />
            );
          })}
        </div>

        {/* Scroll to Information indicator - appears after arc exits */}
        <motion.div
          style={{ opacity: smoothExitProgress }}
          className="absolute bottom-8 left-0 right-0 z-30 flex flex-col items-center justify-center text-center px-4 pointer-events-auto"
        >
          <a 
            href="/information" 
            className="group flex flex-col items-center gap-2 text-gray-500 hover:text-gray-800 transition-colors duration-300"
          >
            <span className="text-xs font-medium tracking-wide">Go to Information Page</span>
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-6 h-10 border-2 border-current rounded-full flex items-start justify-center p-1"
            >
              <motion.div 
                className="w-1.5 h-1.5 bg-current rounded-full"
                animate={{ y: [0, 16, 0], opacity: [1, 0.3, 1] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>
          </a>
        </motion.div>

      </div>
    </div>
    </ShineBorder>
  );
}

