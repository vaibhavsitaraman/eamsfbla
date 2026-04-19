"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import React, { useRef } from "react";

interface ScrollPathSVGProps {
  className?: string;
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
  backgroundColor?: string;
  strokeColor?: string;
  textColor?: string;
}

const ScrollPathSVG = ({
  className = "",
  title = "Hall of Fame",
  subtitle = "Honoring our State Officers and their legacy",
  children,
  backgroundColor = "bg-background",
  strokeColor = "#F59E0B",
  textColor = "text-foreground",
}: ScrollPathSVGProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
  });

  return (
    <section
      ref={ref}
      className={`relative mx-auto flex min-h-[200vh] w-full flex-col items-center overflow-hidden ${backgroundColor} px-4 ${textColor}`}
    >
      <div className="relative flex w-fit flex-col items-center justify-center gap-5 pt-24 text-center">
        <h1 className="relative z-10 text-5xl font-semibold tracking-tight md:text-7xl lg:text-8xl">
          {title}
        </h1>
        <p className="relative z-10 max-w-2xl text-lg font-medium text-muted-foreground">
          {subtitle}
        </p>

        <LinePath
          className="absolute left-1/2 top-0 z-0 h-full w-full -translate-x-1/2 opacity-30"
          scrollYProgress={scrollYProgress}
          strokeColor={strokeColor}
        />
      </div>

      <div className="relative z-10 w-full flex-1 pt-32">
        {children}
      </div>
    </section>
  );
};

const LinePath = ({
  className,
  scrollYProgress,
  strokeColor = "#F59E0B",
}: {
  className: string;
  scrollYProgress: any;
  strokeColor?: string;
}) => {
  const pathLength = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <svg
      viewBox="0 0 400 1200"
      fill="none"
      preserveAspectRatio="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <motion.path
        d="M200 0 
           C200 100, 100 150, 100 250 
           C100 350, 300 400, 300 500 
           C300 600, 100 650, 100 750 
           C100 850, 300 900, 300 1000 
           C300 1100, 200 1150, 200 1200"
        stroke={strokeColor}
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
        style={{
          pathLength,
          strokeDasharray: 1,
          strokeDashoffset: useTransform(pathLength, (value) => 1 - value),
        }}
      />
    </svg>
  );
};

export { ScrollPathSVG, LinePath };
export default ScrollPathSVG;
