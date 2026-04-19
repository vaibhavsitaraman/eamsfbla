import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Loader } from 'lucide-react';
import IntroAnimation from '@/components/ui/scroll-morph-hero';

// Animated word component: cycles through words with a binary scramble effect
const AnimatedWord: React.FC<{ className?: string }> = ({ className = '' }) => {
  const words = ['Leaders', 'Thinkers', 'Creators'];
  const [wordIndex, setWordIndex] = useState(0);
  const [displayText, setDisplayText] = useState(words[0]);

  // Compute longest word to reserve space and prevent layout shift
  const longest = words.reduce((a, b) => (a.length >= b.length ? a : b));

  useEffect(() => {
    const scrambleDuration = 150; // ms per character
    const pauseDuration = 750; // ms to show full binary
    const cycleDuration = 2500; // Total time for one word to be visible

    const timeouts: NodeJS.Timeout[] = [];

    const animate = () => {
      const currentWord = words[wordIndex];
      const nextWordIndex = (wordIndex + 1) % words.length;
      const nextWord = words[nextWordIndex];

      // 1. Animate out to binary
      for (let i = 0; i < currentWord.length; i++) {
        timeouts.push(setTimeout(() => {
          setDisplayText(prev => {
            let newText = '';
            for (let j = 0; j < currentWord.length; j++) {
              if (j <= i) {
                newText += Math.random() > 0.5 ? '1' : '0';
              } else {
                newText += prev[j];
              }
            }
            return newText;
          });
        }, i * scrambleDuration));
      }

      // 2. Animate in the next word
      const animateInStartTime = currentWord.length * scrambleDuration + pauseDuration;
      for (let i = 0; i < nextWord.length; i++) {
        timeouts.push(setTimeout(() => {
          setDisplayText(prev => nextWord.substring(0, i + 1) + prev.substring(i + 1));
        }, animateInStartTime + i * scrambleDuration));
      }
      
      // 3. Set up the next full cycle
      timeouts.push(setTimeout(() => {
        setWordIndex(nextWordIndex);
        setDisplayText(nextWord); // Ensure final word is correct
      }, animateInStartTime + nextWord.length * scrambleDuration));
    };

    const cycleTimeout = setTimeout(animate, cycleDuration);

    return () => {
      clearTimeout(cycleTimeout);
      timeouts.forEach(clearTimeout);
    };
  }, [wordIndex]);

  return (
    <span
      className={`${className} inline-block align-baseline font-mono`}
      aria-live="polite"
      style={{
        minWidth: `${longest.length}ch`,
        display: 'inline-block',
        textAlign: 'center',
        marginLeft: '0px'
      }}
    >
      {displayText}
    </span>
  );
};

const ImageCarousel = () => {
  const images = [
    '/past/fbla1.png',
    '/past/fbla2.png',
    '/past/fbla3.png',
    '/past/fbla4.png',
    '/past/fbla5.png',
    '/past/fbla6.png',
    '/past/fbla7.png',
  ];

  // Duplicate images for a seamless loop
  const loopedImages = [...images, ...images];

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden">
      <div
        className="absolute inset-0 w-full h-full"
        style={{
          maskImage: 'linear-gradient(to right, black 0%, transparent 40%, transparent 60%, black 90%)',
          WebkitMaskImage: 'linear-gradient(to right, black 0%, transparent 40%, transparent 60%, black 90%)',
        }}
      >
        <div className="flex h-full animate-scroll">
          {loopedImages.map((src, index) => (
            <img
              key={index}
              src={src}
              alt={`FBLA background image ${index + 1}`}
              className="h-full w-auto object-cover flex-shrink-0"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

interface HeroSectionProps {
  onNavReady?: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onNavReady }) => {
  return (
    <section className="relative w-full h-screen overflow-hidden bg-background">
      {/* New scroll morph hero using existing gallery images */}
      <IntroAnimation onNavReady={onNavReady} />
    </section>
  );
};

export default HeroSection;