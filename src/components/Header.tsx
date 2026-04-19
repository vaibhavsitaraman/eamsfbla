
import React, { useState } from 'react';
import Logo from './Logo';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { cn } from '@/lib/utils';

const Header = () => {
  const location = useLocation();
  const [activePage, setActivePage] = useState(
    location.pathname === '/information' ? 'information' : 
    location.pathname === '/council' ? 'council' : 'home'
  );
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  const handleNavClick = (page: string) => (e: React.MouseEvent) => {
    // handled by react-router Link; close mobile menu
    setActivePage(page);
    setMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="sticky top-0 z-50 w-full bg-background border-b border-border">
      <header className="w-full max-w-7xl mx-auto py-3 px-6 md:px-8 flex items-center justify-between">
        <div className="p-3">
          <Logo />
        </div>
        
        {/* Mobile menu button */}
        <button 
          className="md:hidden p-3 rounded-2xl text-muted-foreground hover:text-foreground"
          onClick={toggleMobileMenu}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
        
        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center absolute left-1/2 transform -translate-x-1/2">
          <div className="rounded-full px-2 py-1 flex items-center gap-2">
            <Link to="/" onClick={handleNavClick('home')} className={cn('px-3 py-2 rounded-full text-sm', activePage === 'home' ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-muted')}>Home</Link>
            <Link to="/information" onClick={handleNavClick('information')} className={cn('px-3 py-2 rounded-full text-sm', activePage === 'information' ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-muted')}>Information</Link>
            <Link to="/council" onClick={handleNavClick('council')} className={cn('px-3 py-2 rounded-full text-sm', activePage === 'council' ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-muted')}>Council</Link>
          </div>
        </nav>
        
        {/* Right-side logo (desktop only) */}
        <div className="hidden md:flex items-center p-3">
          <img
            src="/eagle.webp"
            alt="FBLA eagle"
            className="h-8 w-auto select-none"
            loading="eager"
            draggable={false}
          />
        </div>
        
        {/* Mobile navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-background border-b border-border shadow-lg z-50">
            <div className="flex flex-col gap-4">
              <Link to="/" onClick={handleNavClick('home')} className={`px-3 py-2 text-sm rounded-md transition-colors ${activePage === 'home' ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-muted'}`}>Home</Link>
              <Link to="/information" onClick={handleNavClick('information')} className={`px-3 py-2 text-sm rounded-md transition-colors ${activePage === 'information' ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-muted'}`}>Information</Link>
              <Link to="/council" onClick={handleNavClick('council')} className={`px-3 py-2 text-sm rounded-md transition-colors ${activePage === 'council' ? 'bg-accent text-accent-foreground' : 'text-muted-foreground hover:text-foreground hover:bg-muted'}`}>Council</Link>
            </div>
          </div>
        )}
      </header>
    </div>
  );
};

export default Header;

