
import React, { useState } from 'react';
import HeroSection from '@/components/HeroSection';
import { AnimeNavBar } from '@/components/ui/anime-navbar';
import { Home, Info, Users, Award } from 'lucide-react';

const navItems = [
  { name: 'Home', to: '/', icon: Home },
  { name: 'Information', to: '/information', icon: Info },
  { name: 'Council', to: '/council', icon: Users },
  { name: 'Awards', to: '/awards', icon: Award },
];

const Index = () => {
  const [navVisible, setNavVisible] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <AnimeNavBar items={navItems} visible={navVisible} />
      <main>
        <HeroSection onNavReady={() => setNavVisible(true)} />
      </main>
    </div>
  );
};

export default Index;
