import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Award, Globe, Medal, ShieldCheck } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import HallOfFameSection from './HallOfFame';

const STICKY_TOP_EXTRA_PX = -90;
const END_PADDING_PX = 160;

const HOF_END_PADDING_PX = 160;
const HOF_SCROLL_PX = 900;

const awards = [
  {
    title: 'Passport of Progress (1-100)',
    description:
      "The Passport of Progress program is designed to increase integral parts of the organization: local member and chapter engagement in membership recruitment, retention, and state/national programs. A chapter is awarded based on its commitment to three categories: Service, Education, and Progress. Middlesex County Academy received the Passport of Progress award for chapters of less than 100 members in 2023.",
    icon: ShieldCheck,
    accent: 'from-sky-400/35 via-indigo-400/15 to-transparent'
  },
  {
    title: 'BEST SMALL DELEGATION (1-100)',
    description:
      "At SLC 2023, Middlesex County Academy's students received the most amount of awards amongst all the chapters consisting of less than 100 members. This is an incredible achievement that would not be possible without the dedication and commitment of all our members.",
    icon: Medal,
    accent: 'from-amber-300/35 via-yellow-200/15 to-transparent'
  },
  {
    title: 'CHAPTER WEBSITE OF MERIT',
    description:
      "Middlesex County Academy received the Chapter Website of Merit award in 2023 for their high-quality chapter website. Great job to Yuvraj Lakhotia and Aditya Kirubakaran, MCA's webmasters at the time, for creating and maintaining the website.",
    icon: Globe,
    accent: 'from-cyan-300/30 via-sky-300/15 to-transparent'
  },
  {
    title: 'GOLD SEAL CHAPTER',
    description:
      "The Gold Seal Chapter award recognizes outstanding local chapters that have actively participated in projects and programs identified with the goals of FBLA. Active local chapters must be nominated by the state chair and be on record in the national center as having paid dues by March 1 of the current school year. Each state may select two chapters or up to 15 percent of its total number of active local chapters, whichever is greater. Middlesex County Academy received the Gold Seal Chapter award in 2023.",
    icon: Award,
    accent: 'from-yellow-300/30 via-amber-200/15 to-transparent'
  }
];

const columnGradients = [
  'from-sky-500/22 via-indigo-500/12 to-transparent',
  'from-amber-400/22 via-yellow-300/12 to-transparent',
  'from-cyan-400/20 via-sky-400/12 to-transparent'
];

const ChapterAwards: React.FC = () => {
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const stickyRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);

  const [containerHeight, setContainerHeight] = useState<number>(typeof window !== 'undefined' ? window.innerHeight : 800);
  const [scrollDistance, setScrollDistance] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);
  const [stickyTopPx, setStickyTopPx] = useState<number>(96);

  const effectiveStickyTopPx = stickyTopPx + STICKY_TOP_EXTRA_PX;

  const updateStickyTop = useCallback(() => {
    const stickyHeader = document.querySelector('.sticky.top-0') as HTMLElement | null;
    if (!stickyHeader) {
      setStickyTopPx(96);
      return;
    }
    setStickyTopPx(stickyHeader.getBoundingClientRect().height);
  }, []);

  const measure = useCallback(() => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const trackWidth = trackRef.current ? trackRef.current.scrollWidth : vw;
    const distance = Math.max(0, trackWidth - vw);
    setScrollDistance(distance);
    setContainerHeight(vh + distance + END_PADDING_PX);
  }, []);

  const onScroll = useCallback(() => {
    if (!sectionRef.current) return;
    const rect = sectionRef.current.getBoundingClientRect();
    const vh = window.innerHeight;
    const stickyViewportHeight = Math.max(1, vh - effectiveStickyTopPx);
    const sectionHeight = sectionRef.current.offsetHeight;
    const max = Math.max(1, sectionHeight - stickyViewportHeight);
    const current = Math.min(max, Math.max(0, -rect.top));
    const p = current / max;
    setProgress(p);
  }, [effectiveStickyTopPx]);

  useEffect(() => {
    updateStickyTop();
    measure();
    const ro = new ResizeObserver(() => measure());
    if (trackRef.current) ro.observe(trackRef.current);
    window.addEventListener('resize', measure, { passive: true });
    window.addEventListener('resize', updateStickyTop, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      if (trackRef.current) ro.unobserve(trackRef.current);
      ro.disconnect();
      window.removeEventListener('resize', measure);
      window.removeEventListener('resize', updateStickyTop);
      window.removeEventListener('scroll', onScroll);
    };
  }, [measure, onScroll, updateStickyTop]);

  const translateX = -(progress * scrollDistance);

  const scrollLabel = useMemo(() => {
    if (progress <= 0.01) return 'Scroll';
    if (progress >= 0.99) return 'Done';
    return `${Math.round(progress * 100)}%`;
  }, [progress]);

  return (
    <>
      <section
        ref={sectionRef}
        className="relative w-full bg-background text-foreground"
        style={{ height: `${containerHeight}px` }}
      >
        <div
          ref={stickyRef}
          className="sticky overflow-hidden"
          style={{ top: effectiveStickyTopPx, height: `calc(100vh - ${effectiveStickyTopPx}px)` }}
        >
          <div className="relative z-20 flex w-full flex-col">
            <div className="px-6 pt-10 sm:px-10 sm:pt-12">
              <div className="flex items-end justify-between gap-6">
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.32em] text-foreground/70 backdrop-blur-xl supports-[backdrop-filter]:bg-white/10">
                    <span>Awards</span>
                  </div>
                  <h2 className="text-2xl font-semibold sm:text-3xl md:text-4xl">Chapter Awards</h2>
                </div>
                <div className="hidden sm:block text-sm text-muted-foreground">{scrollLabel}</div>
              </div>
            </div>

            <div className="px-6 pt-10 sm:px-10 sm:pt-12">
              <motion.div
                ref={trackRef}
                className="relative flex items-stretch h-[62vh] md:h-[68vh] gap-6 pr-6 sm:pr-10"
                style={{ x: translateX }}
              >
                {awards.map((a, i) => {
                  const Icon = a.icon;
                  return (
                    <Card
                      key={i}
                      className="group relative shrink-0 w-[88vw] sm:w-[72vw] md:w-[60vw] lg:w-[48vw] h-full overflow-hidden rounded-3xl border border-white/12 bg-white/10 p-[1px] shadow-[0_40px_120px_rgba(0,0,0,0.45)] backdrop-blur-xl supports-[backdrop-filter]:bg-white/10"
                    >
                      <div className="relative h-full w-full overflow-hidden rounded-[inherit] bg-gradient-to-br from-white/12 via-white/5 to-transparent">
                        <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${a.accent}`} />
                        <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10 blur-3xl" />
                        <div className="pointer-events-none absolute -left-10 -bottom-10 h-56 w-56 rounded-full bg-white/5 blur-3xl" />

                        <div className="relative z-10 flex h-full flex-col">
                          <CardHeader className="space-y-4 px-6 pt-6 sm:px-8 sm:pt-8">
                            <div className="flex items-center justify-between gap-4">
                              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-foreground/70 backdrop-blur-xl supports-[backdrop-filter]:bg-white/10">
                                <Icon className="h-4 w-4 text-foreground/80" />
                                <span>Chapter</span>
                              </div>
                              <div className="text-xs font-semibold uppercase tracking-[0.28em] text-foreground/40">0{i + 1}</div>
                            </div>

                            <CardTitle className="text-balance text-2xl md:text-3xl leading-tight">
                              {a.title}
                            </CardTitle>
                          </CardHeader>

                          <CardContent className="flex-1 px-6 pb-6 sm:px-8 sm:pb-8">
                            <p className="text-base md:text-lg leading-relaxed text-muted-foreground">
                              {a.description}
                            </p>
                          </CardContent>
                        </div>
                      </div>
                    </Card>
                  );
                })}

                <div aria-hidden className="shrink-0 w-6 sm:w-10" />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      <HallOfFameSection stickyTopPx={effectiveStickyTopPx} />
    </>
  );
};

export default ChapterAwards;
