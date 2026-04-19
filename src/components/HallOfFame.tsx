import React from 'react';
import { motion } from 'framer-motion';

interface HallOfFameMember {
  name: string;
  lines: string[];
}

const hallOfFameData: HallOfFameMember[] = [
  {
    name: 'Pranjay Kumar',
    lines: ['MCA FBLA 2021 - 2022 President'],
  },
  {
    name: 'Shagun Khare',
    lines: ['MCA FBLA 2022 - 2023 President', '2021 - 2022 State Parliamentarian'],
  },
  {
    name: 'Esha Venkatanarayan',
    lines: ['MCA FBLA 2022 - 2023 President', '2022 - 2023 State Historian'],
  },
  {
    name: 'Divy Shah',
    lines: ['MCA FBLA 2022 - 2023 Vice-President', '2023 - 2024 State President'],
  },
  {
    name: 'Yuvraj Lakhotia',
    lines: ['MCA FBLA 2022 - 2023 Webmaster', '2023 - 2024 State Webmaster'],
  },
  {
    name: 'Aaditya Mittal',
    lines: ['MCA FBLA 2023 - 2024 Membership VP', '2024-2025 State Webmaster'],
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1] as const,
    },
  },
};

interface HallOfFameProps {
  stickyTopPx?: number;
}

const HallOfFameSection: React.FC<HallOfFameProps> = () => {
  return (
    <section className="relative w-full bg-background py-20">
      <div className="mx-auto max-w-6xl px-6 sm:px-10 lg:px-12">
        {/* Header */}
        <div className="mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.32em] text-foreground/70 backdrop-blur-xl">
            <span>Hall of Fame</span>
          </div>
          <h2 className="text-2xl font-semibold sm:text-3xl md:text-4xl">
            State Officers
          </h2>
        </div>

        {/* Cards Grid */}
        <motion.div
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {hallOfFameData.map((person) => (
            <motion.div
              key={person.name}
              variants={cardVariants}
              className="group relative overflow-hidden rounded-2xl border border-amber-500/30 bg-white/10 p-6 shadow-[0_24px_80px_rgba(245,158,11,0.15)] backdrop-blur-xl transition-all duration-300 hover:border-amber-500/50 hover:shadow-[0_24px_80px_rgba(245,158,11,0.25)]"
            >
              <div className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full bg-amber-500/10 blur-2xl" />
              <div className="relative z-10">
                <div className="text-lg font-semibold text-foreground">
                  {person.name}
                </div>
                <div className="mt-3 space-y-1 text-sm leading-relaxed text-muted-foreground">
                  {person.lines.map((line) => (
                    <div key={line}>{line}</div>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HallOfFameSection;
export { hallOfFameData };
