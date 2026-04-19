import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Award, BarChart, BookOpen, Users, Briefcase, Network } from 'lucide-react';
import { motion, useInView, Variants, useMotionValue, useTransform } from 'framer-motion';

const winnersData = [
  {
    id: 'winners-1',
    sectionClass: 'is-product-blue',
    title: 'NLC 1st Place Awards',
    winners: [
      { name: 'Ashwath Ram', achievement: '1st Place', event: 'Intro to Financial Math', image: '/api/placeholder/400/300', icon: Award },
      { name: 'Muye Chen', achievement: '1st Place', event: 'Economics', image: '/api/placeholder/400/300', icon: BarChart }
    ]
  },
  {
    id: 'winners-2',
    sectionClass: 'is-product-gold',
    title: 'NLC Top 4 Awards',
    winners: [
      { name: 'Jonathan Lee', achievement: '3rd Place', event: 'UX Design', image: '/api/placeholder/400/300', icon: BookOpen },
      { name: 'Sunidhi Mitikiri', achievement: '4th Place', event: 'Accounting 2', image: '/api/placeholder/400/300', icon: Users }
    ]
  },
  {
    id: 'winners-3',
    sectionClass: 'is-product-mono',
    title: 'NLC Top 8 Awards',
    winners: [
      { name: 'Aditi Desai, Aaditya Mittal, Jonathan Lee', achievement: '5th Place', event: 'American Enterprise Project', image: '/api/placeholder/400/300', icon: Briefcase },
      { name: 'Jaival Jariwala', achievement: '8th Place', event: 'Networking Infrastructure', image: '/api/placeholder/400/300', icon: Network }
    ]
  }
];

const backgroundVariants: Variants = {
  hidden: { opacity: 0, y: 60, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.8, ease: 'easeOut' }
  }
};

const gradients: Record<string, string> = {
  'is-product-blue': 'from-blue-600/55 via-slate-900/65 to-slate-950/80',
  'is-product-gold': 'from-amber-500/55 via-slate-900/60 to-slate-950/85',
  'is-product-mono': 'from-slate-100/10 via-slate-900/65 to-slate-950/85'
};

const STICKY_TOP_REM = 6; // 6rem == top-24
const CARD_HEIGHT = 100; // vh units
const CARD_SPACING = 20; // spacing between cards when stacked

interface StickyCardProps {
  data: any;
  id: string;
  index: number;
  scrollProgress: number;
  totalCards: number;
}

const StickyCard = ({ data, id, index, scrollProgress, totalCards }: StickyCardProps) => {
  const cardRef = useRef<HTMLElement | null>(null);
  const isInView = useInView(cardRef, { once: true, amount: 0.2 });

  const gradient = gradients[data.sectionClass] ?? gradients['is-product-blue'];
  
  // Calculate when this card should start moving
  const cardStartProgress = index / totalCards;
  const cardEndProgress = (index + 1) / totalCards;
  
  // For cards 1 & 2: they stick until card 3 is in place
  // For card 3: it moves normally
  let yOffset = 0;
  let scale = 1;
  let opacity = 1;
  
  if (index < totalCards - 1) {
    // Cards 1 & 2: stick until the last card (card 3) reaches its position
    const lastCardProgress = Math.max(0, Math.min(1, (scrollProgress - (totalCards - 1) / totalCards) * totalCards));
    yOffset = lastCardProgress * index * CARD_SPACING;
    scale = 1 - (lastCardProgress * 0.05 * index); // Slight scale down as they get pushed up
  } else {
    // Last card (card 3): moves based on its own progress
    const cardProgress = Math.max(0, Math.min(1, (scrollProgress - cardStartProgress) * totalCards));
    yOffset = (1 - cardProgress) * 100; // Start from below, move to final position
  }

  const zIndex = 10 + index; // Higher index = higher z-index (card 3 on top)

  return (
    <motion.section
      id={id}
      ref={cardRef}
      className="sticky inset-x-0 flex h-screen items-center justify-center px-4 py-16 sm:px-6 lg:px-10"
      style={{ 
        top: `${STICKY_TOP_REM}rem`,
        zIndex,
        transform: `translateY(${yOffset}vh) scale(${scale})`,
        opacity
      }}
      variants={backgroundVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
    >
      <motion.div
        className={`absolute inset-4 rounded-[32px] border border-white/10 bg-gradient-to-br ${gradient} backdrop-blur-2xl`}
        style={{ boxShadow: '0 60px 160px rgba(8, 15, 30, 0.45)' }}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 40 }}
        transition={{ duration: 0.8, delay: index * 0.08, ease: 'easeOut' }}
      />

      <div className="relative z-10 w-full max-w-6xl space-y-12">
        <div className="mx-auto flex flex-col items-center gap-3 text-center">
          <div className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/10 px-5 py-2 text-xs font-semibold uppercase tracking-[0.32em] text-white/60">
            <span>Awards</span>
            <span className="text-white/40">0{index + 1}</span>
          </div>
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 16 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 + index * 0.04 }}
            className="text-3xl font-semibold text-white sm:text-4xl md:text-5xl"
          >
            {data.title}
          </motion.h2>
        </div>

        <motion.div
          className="grid gap-6 sm:grid-cols-2"
          initial="hidden"
          animate={isInView ? 'visible' : 'hidden'}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.12,
                delayChildren: 0.2
              }
            }
          }}
        >
          {data.winners.map((winner: any, cardIndex: number) => (
            <motion.article
              key={cardIndex}
              variants={{
                hidden: { opacity: 0, y: 22, scale: 0.96 },
                visible: {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: { duration: 0.6, ease: 'easeOut' }
                }
              }}
              whileHover={{
                y: -8,
                borderColor: 'rgba(255, 255, 255, 0.22)',
                transition: { duration: 0.3 }
              }}
              className="group relative overflow-hidden rounded-3xl border border-white/12 bg-white/10 p-[1px] backdrop-blur-md"
            >
              <div className="relative h-full w-full overflow-hidden rounded-[inherit] bg-gradient-to-br from-white/10 via-white/5 to-transparent">
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-white/10 opacity-70" />
                <div className="relative z-10 flex h-full flex-col gap-6 p-6 sm:p-8">
                  <div className="relative overflow-hidden rounded-2xl border border-white/10">
                    <img
                      src={winner.image}
                      alt={winner.name}
                      className="h-48 w-full rounded-2xl object-cover transition duration-500 ease-out group-hover:scale-[1.05]"
                    />
                    <div className="absolute inset-x-3 top-3 flex items-center gap-2 rounded-full border border-white/30 bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.32em] text-white/80">
                      <winner.icon className="h-4 w-4" />
                      <span>{winner.achievement}</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <h3 className="text-lg font-semibold text-white sm:text-xl">
                      {winner.name}
                    </h3>
                    <p className="text-sm text-white/60">
                      {winner.event}
                    </p>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
};

const AwardSection = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const sectionRef = useRef<HTMLDivElement>(null);

  const updateScrollProgress = useCallback(() => {
    if (!sectionRef.current) return;

    const rect = sectionRef.current.getBoundingClientRect();
    const sectionHeight = sectionRef.current.offsetHeight;
    const windowHeight = window.innerHeight;
    
    // Calculate scroll progress through the section
    const sectionTop = rect.top;
    const sectionBottom = rect.bottom;
    
    // Progress starts when section enters viewport and ends when it leaves
    const startScroll = windowHeight;
    const endScroll = -sectionHeight;
    const totalScrollDistance = startScroll - endScroll;
    
    const currentScroll = sectionTop;
    const progress = Math.max(0, Math.min(1, (startScroll - currentScroll) / totalScrollDistance));
    
    setScrollProgress(progress);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      updateScrollProgress();
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', updateScrollProgress, { passive: true });
    
    // Initial calculation
    updateScrollProgress();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', updateScrollProgress);
    };
  }, [updateScrollProgress]);

  useEffect(() => {
    document.documentElement.style.setProperty('--award-section-padding', '120px');
    return () => {
      document.documentElement.style.removeProperty('--award-section-padding');
    };
  }, []);

  const totalCards = winnersData.length;

  return (
    <motion.div
      ref={sectionRef}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="relative bg-slate-950"
      style={{ 
        height: `${(totalCards + 1) * 100-50}vh`, // Tighten height to avoid dead space
        paddingTop: '5rem',
        paddingBottom: '5rem'
      }}
    >
      <div className="relative">
        {winnersData.map((section, index) => (
          <StickyCard
            key={section.id}
            data={section}
            id={section.id}
            index={index}
            scrollProgress={scrollProgress}
            totalCards={totalCards}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default AwardSection;
