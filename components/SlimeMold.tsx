'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import type { ThemeName } from '@/lib/themes';
import { themes } from '@/lib/themes';
import { Sun, Moon, MoveRight } from 'lucide-react';

const P5Canvas = dynamic(
  () => import('@p5-wrapper/react').then((mod) => mod.P5Canvas),
  {
    ssr: false,
  }
);

import { createSketch } from './sketch';

export default function SlimeMold() {
  const [currentThemeName, setCurrentThemeName] = useState<ThemeName>('light');
  const currentTheme = themes[currentThemeName];

  useEffect(() => {
    if (currentThemeName === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [currentThemeName]);

  const toggleTheme = () => {
    const newTheme: ThemeName = currentThemeName === 'light' ? 'dark' : 'light';
    setCurrentThemeName(newTheme);
    localStorage.setItem('portfolioTheme', newTheme);
  };

  const isDark = currentThemeName === 'dark';

  return (
    <>
      {/* White-turquoise multiply overlay */}
      <div 
        className="fixed inset-0 w-screen h-screen pointer-events-none z-[900]"
        style={{
          backgroundColor: 'rgb(224, 255, 255)',
          mixBlendMode: 'screen',
          opacity: 0.8,
        }}
      />

      <div className="fixed left-10 top-1/2 -translate-y-1/2 z-[900] max-w-md pointer-events-none">
        <h1 className="heading-xanh-sm mb-2">
          Jenny studies Computational<br />
          Biology and Design at UPenn.
        </h1>
        
        <p className="body-mono-small flex items-center gap-2">
          <MoveRight className="w-4 h-4" />
          <span className="italic">biology of this page</span>
        </p>
      </div>

      <button
        onClick={toggleTheme}
        className="fixed top-5 right-5 z-[1000] w-12 h-12 rounded-full cursor-pointer transition-all flex items-center justify-center bg-transparent hover:bg-white/5 dark:hover:bg-black/5"
        style={{ backdropFilter: 'blur(3px)' }}
        aria-label="Toggle theme"
      >
        {isDark ? (
          <Sun className="w-6 h-6 text-white" />
        ) : (
          <Moon className="w-6 h-6 text-black" />
        )}
      </button>

      <div
        className="popup-card fixed hidden z-[1000] pointer-events-none opacity-0 transition-opacity duration-500 ease-out"
        id="node-popup"
        style={{
          left: '0',
          top: '0',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <div
          className="absolute top-0 left-0 rounded-full animate-pulse"
          style={{
            background: isDark 
              ? 'radial-gradient(circle, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0) 70%)' 
              : 'radial-gradient(circle, rgba(100, 100, 100, 0.6) 0%, rgba(100, 100, 100, 0) 70%)',
            filter: 'blur(10px)',
            width: '300%',
            height: '300%',
            left: '0%',
            top: '0%',
            animation: 'pulse-glow 3s ease-in-out infinite',
            zIndex: -1,
          }}
        />
        
        <div
          id="popup-clickable"
          className="relative rounded-full shadow-2xl cursor-pointer pointer-events-auto transition-all duration-300 hover:scale-105 bg-white dark:bg-gray-800"
          style={{
            width: '70px',
            height: '70px',
            boxShadow: isDark
              ? '0 0 60px rgba(100, 100, 100, 0.5), 0 20px 60px rgba(0, 0, 0, 0.3)'
              : '0 0 60px rgba(255, 255, 255, 0.9), 0 20px 60px rgba(0, 0, 0, 0.15)',
          }}
        >
          <img
            alt=""
            className="popup-image absolute inset-0 w-full h-full object-cover rounded-full"
            id="popup-image"
            style={{ display: 'none' }}
          />
          
          <div
            id="popup-placeholder"
            className="absolute inset-0 flex items-center justify-center text-gray-400 dark:text-gray-500"
          />
        </div>
        
        {/* Title using heading-6 from design system */}
        <div className="absolute left-1/2 -translate-x-1/2 text-center" style={{ top: '-40px', width: '250px' }}>
          <h3 className="subheading-mono drop-shadow-sm" id="popup-title"></h3>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse-glow {
          0%, 100% {
            opacity: 0.6;
            transform: scale(1);
          }
          50% {
            opacity: 1;
            transform: scale(1.1);
          }
        }
      `}</style>

      <P5Canvas sketch={createSketch()} currentTheme={currentTheme} />
    </>
  );
}
