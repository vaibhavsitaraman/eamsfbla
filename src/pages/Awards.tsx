import React from 'react';
import Footer from '@/components/Footer';
import AwardSection from '@/components/AwardSection';
import ChapterAwards from '@/components/ChapterAwards';
import { AnimeNavBar } from '@/components/ui/anime-navbar';
import { Home, Info, Users, Award as AwardIcon } from 'lucide-react';

const navItems = [
  { name: 'Home', to: '/', icon: Home },
  { name: 'Information', to: '/information', icon: Info },
  { name: 'Council', to: '/council', icon: Users },
  { name: 'Awards', to: '/awards', icon: AwardIcon },
];

const Awards = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <AnimeNavBar items={navItems} visible />
      <main>
        <AwardSection />
        <ChapterAwards />
      </main>
      <Footer />
    </div>
  );
};

export default Awards;

