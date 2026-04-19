import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useInView, Variants } from 'framer-motion';
import Footer from '@/components/Footer';
import { AnimeNavBar } from '@/components/ui/anime-navbar';
import { Home, Info, Users, Award } from 'lucide-react';

type CouncilMember = {
  name: string;
  position: string;
  image?: string;
};

type CouncilGroup = {
  id: string;
  title: string;
  subtitle: string;
  color: 'blue' | 'green' | 'red';
  members: CouncilMember[];
};

const councilData: CouncilGroup[] = [
  {
    id: 'presidents',
    title: 'Executive Leadership',
    subtitle: 'Presidents & Executive Vice President',
    color: 'blue',
    members: [
      {
        name: 'ISAAC CHAN',
        position: 'President',
        image: '/council/isaac.png'
      },
      {
        name: 'DHIKSHITH GAJULAPALLI',
        position: 'President',
        image: '/council/dhikshith.png'
      },
      {
        name: 'JAIVAL JARIWALA',
        position: 'Executive Vice President',
        image: '/council/jaival.jpeg'
      }
    ]
  },
  {
    id: 'vps',
    title: 'Vice Presidents',
    subtitle: 'Department Leaders',
    color: 'green',
    members: [
      {
        name: 'AVIKA SHUKLA',
        position: 'VP of Membership',
        image: '/council/avika.png'
      },
      {
        name: 'ALEX POON',
        position: 'VP of Comm. Service',
        image: '/council/alex.png'
      },
      {
        name: 'MANAN BANSIWAL',
        position: 'VP of Awards',
        image: '/council/manan.png'
      },
      {
        name: 'EKYA DOGRA',
        position: 'Webmaster',
        image: '/council/ekya.png'
      }
    ]
  },
  {
    id: 'liaisons',
    title: 'Liaisons',
    subtitle: 'Community Connectors',
    color: 'red',
    members: [
      {
        name: 'ASHWIN KIRUBAKARAN',
        position: 'Liaison of Membership',
        image: '/council/ashwinprofilepic.png'
      },
      {
        name: 'DIVYA SREEKUMAR',
        position: 'Liaison Comm. Service',
        image: '/council/divya.jpeg'
      },
      {
        name: 'DEVANSHI SAHOO',
        position: 'Liaison of Awards',
        image: '/council/devanshi.png'
      },
      {
        name: 'VAIBHAV SITARAMAN',
        position: 'Liaison of Webmaster',
        image: '/council/vaibhav.jfif'
      }
    ]
  }
];

const sectionVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.8, ease: 'easeOut' }
  }
};

const gradients: Record<CouncilGroup['color'], string> = {
  blue: 'from-blue-500/45 via-indigo-500/35 to-slate-900/70',
  green: 'from-amber-400/45 via-yellow-500/30 to-slate-900/70',
  red: 'from-blue-400/40 via-slate-900/65 to-slate-950/80'
};

const SNAP_STEP_MULT = 1.5;
const END_HOLD_MULT = 1.15;
const STACK_OFFSET_PX = 56;

type MemberCardProps = {
  member: CouncilMember;
};

const MemberCard = ({ member }: MemberCardProps) => {
  const imageSrc = member.image || `https://picsum.photos/seed/${encodeURIComponent(member.name)}/640/640`;

  return (
    <motion.article
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
        <div className="relative z-10 flex h-full flex-col gap-3 p-4 sm:p-5">
          <div className="flex justify-center">
            <img
              src={imageSrc}
              alt={member.name}
              className="h-[72px] w-[72px] rounded-full object-cover ring-1 ring-white/20 shadow-md transition duration-500 ease-out group-hover:scale-[1.05] sm:h-[84px] sm:w-[84px]"
              loading="lazy"
            />
          </div>

          <div className="flex flex-col items-center gap-2 text-center">
            <h3 className="text-base font-semibold text-white sm:text-lg">
              {member.name}
            </h3>
            <p className="text-sm font-medium uppercase tracking-[0.22em] text-white/60">
              {member.position}
            </p>
          </div>
        </div>
      </div>
    </motion.article>
  );
};

const navItems = [
  { name: 'Home', to: '/', icon: Home },
  { name: 'Information', to: '/information', icon: Info },
  { name: 'Council', to: '/council', icon: Users },
  { name: 'Awards', to: '/awards', icon: Award },
];

const Council = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [stickyTopPx, setStickyTopPx] = useState(96);
  const sectionRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLElement | null>(null);
  const isStickyInView = useInView(stickyRef, { once: true, amount: 0.15 });

  const totalCards = councilData.length;

  const updateStickyTop = useCallback(() => {
    const stickyHeader = document.querySelector('.sticky.top-0') as HTMLElement | null;
    if (!stickyHeader) {
      setStickyTopPx(96);
      return;
    }
    setStickyTopPx(stickyHeader.getBoundingClientRect().height);
  }, []);

  const updateActiveIndex = useCallback(() => {
    if (!sectionRef.current) return;

    const rect = sectionRef.current.getBoundingClientRect();
    const windowHeight = window.innerHeight;

    const scrolledPx = Math.max(0, windowHeight - rect.top);
    const stepPx = windowHeight * SNAP_STEP_MULT;
    const nextIndex = Math.max(0, Math.min(totalCards - 1, Math.floor(scrolledPx / stepPx)));
    setActiveIndex(nextIndex);
  }, [totalCards]);

  useEffect(() => {
    updateStickyTop();
    updateActiveIndex();

    const handleScroll = () => updateActiveIndex();
    const handleResize = () => {
      updateStickyTop();
      updateActiveIndex();
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
    };
  }, [updateActiveIndex, updateStickyTop]);

  const activeGroup = councilData[activeIndex];
  const gridCols = useMemo(() => {
    if (!activeGroup) return 'grid-cols-1';
    return activeGroup.members.length === 3 ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-2 sm:grid-cols-2 md:grid-cols-4';
  }, [activeGroup]);

  const isTightGroup = activeGroup?.id === 'vps' || activeGroup?.id === 'liaisons';
  const cardContentClass = isTightGroup ? 'relative z-10 flex flex-col px-7 pb-7 pt-6 sm:px-8' : 'relative z-10 flex flex-col px-8 pb-8 pt-6 sm:px-10';
  const titleClass = isTightGroup
    ? 'text-sm font-semibold text-white sm:text-xl md:text-2xl whitespace-nowrap'
    : 'text-lg font-semibold text-white sm:text-xl md:text-2xl';

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <AnimeNavBar items={navItems} visible />
      <main>
        <motion.div
          ref={sectionRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="relative bg-slate-950"
          style={{
            height: `${(totalCards * SNAP_STEP_MULT + END_HOLD_MULT) * 100}vh`,
            paddingTop: '0px',
            paddingBottom: '5rem'
          }}
        >
          <motion.section
            ref={stickyRef}
            className="sticky inset-x-0 flex h-screen items-center justify-center px-6 py-6 sm:px-6 lg:px-10"
            style={{ top: stickyTopPx, height: `calc(100vh - ${stickyTopPx}px)` }}
            variants={sectionVariants}
            initial="hidden"
            animate={isStickyInView ? 'visible' : 'hidden'}
          >
            <div className="relative h-full w-full max-w-7xl xl:max-h-[504px] 2xl:max-h-[504px]">
              <div className="absolute inset-1 rounded-[48px] border border-white/12 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 backdrop-blur-xl" />

              <div className="relative z-20 flex h-full flex-col items-center px-6 py-8 sm:px-10">
                <div className="pointer-events-none inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/10 px-6 py-3 text-xs font-semibold uppercase tracking-[0.32em] text-white/60 backdrop-blur-xl sm:text-sm">
                  <span>FBLA Council</span>
                  <motion.span
                    key={activeIndex}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    className="text-white/80"
                  >
                    0{activeIndex + 1}
                  </motion.span>
                </div>

                <div className="relative mt-6 flex w-full flex-1 items-end justify-center pb-2">
                  <div className="relative w-full max-w-6xl">
                    <AnimatePresence mode="wait">
                      {activeGroup ? (
                        <motion.div
                          key={activeGroup.id}
                          className="relative w-full"
                          initial={{ opacity: 0, y: 64, scale: 0.98 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -48, scale: 0.98 }}
                          transition={{ type: 'spring', stiffness: 240, damping: 30, mass: 0.9 }}
                        >
                          <div
                            className={`absolute inset-0 rounded-[32px] border border-white/10 bg-gradient-to-br ${gradients[activeGroup.color]} backdrop-blur-2xl`}
                            style={{ boxShadow: '0 60px 160px rgba(8, 15, 30, 0.45)' }}
                          />

                          <div className={cardContentClass}>
                            <div className="mx-auto flex flex-col items-center gap-2 text-center">
                              <motion.h2
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.35, ease: 'easeOut' }}
                                className={titleClass}
                              >
                                {activeGroup.title}
                              </motion.h2>
                            </div>

                            <motion.div
                              className={`mt-6 grid gap-6 ${gridCols}`}
                              initial="hidden"
                              animate="visible"
                              variants={{
                                hidden: {},
                                visible: {
                                  transition: {
                                    staggerChildren: 0.12,
                                    delayChildren: 0.08
                                  }
                                }
                              }}
                            >
                              {activeGroup.members.map((member) => (
                                <MemberCard key={member.name} member={member} />
                              ))}
                            </motion.div>
                          </div>
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            </div>
          </motion.section>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
};

export default Council;
