import React from 'react';

const FBLAContent = () => {
  return (
    <section className="w-full py-12 md:py-20 px-6 md:px-12 flex flex-col items-center bg-background text-foreground">
      <div className="relative z-10 max-w-4xl text-center space-y-6">
        <h2 className="text-3xl md:text-4xl font-semibold">What is FBLA?</h2>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
Future Business Leaders of America is the largest business Career and Technical Student Organization in the world. Each year, FBLA helps more than 230,000 members in middle school, high school, and college prepare for careers in business.</p>
        <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
Edison Academy Magnet School FBLA is one of, if not the, most successful chapter in the state of New Jersey.</p>
        {/* Aesthetic separator */}
        <div className="flex justify-center py-8">
          <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-white/60 to-transparent rounded-full" />
        </div>

        {/* Logo section */}
        <div className="flex justify-center items-center gap-8 flex-wrap">
          <a href="https://eams.mcmsnj.net/" target="_blank" rel="noopener noreferrer" className="block p-4 bg-primary-foreground/10 border border-white/20 rounded-2xl backdrop-blur-sm transition-transform duration-300 hover:scale-105 hover:border-white/30">
            <img src="/eams.png" alt="Edison Middle School Logo" className="h-16" />
          </a>
          <a href="https://njfbla.org" target="_blank" rel="noopener noreferrer" className="block p-4 bg-primary-foreground/10 border border-white/20 rounded-2xl backdrop-blur-sm transition-transform duration-300 hover:scale-105 hover:border-white/30">
            <img src="/njfbla.png" alt="NJ FBLA Logo" className="h-16" />
          </a>
          <a href="https://fbla.org" target="_blank" rel="noopener noreferrer" className="block p-4 bg-primary-foreground/10 border border-white/20 rounded-2xl backdrop-blur-sm transition-transform duration-300 hover:scale-105 hover:border-white/30">
            <img src="/natsfbla.png" alt="National FBLA Logo" className="h-16" />
          </a>
        </div>

        {/* Council button */}
        <div className="flex justify-center mt-8">
          <a 
            href="/council" 
            className="px-8 py-8 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold text-lg rounded-xl shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
          >
            Meet our 2025 Chapter Council
          </a>
        </div>
      </div>
    </section>
  );
};

export default FBLAContent;
