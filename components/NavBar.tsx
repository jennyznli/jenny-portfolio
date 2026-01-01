'use client';

import Link from 'next/link';
import { Sun, Moon } from 'lucide-react';
import { useState, useEffect } from 'react';

interface NavbarProps {
  showThemeToggle?: boolean;  // Optional: show/hide theme toggle
  theme?: 'light' | 'dark';   // Optional: current theme
  onThemeToggle?: () => void; // Optional: theme toggle handler
}

export default function Navbar({ 
  showThemeToggle = false, 
  theme = 'light',
  onThemeToggle 
}: NavbarProps) {
  return (
    <nav className="fixed top-0 left-0 right-0 h-20 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 z-50">
      <div className="max-w-[1400px] mx-auto h-full px-8 flex items-center justify-between">
        {/* Logo */}
        <Link 
          href="/" 
          className="text-3xl font-serif italic text-gray-900 dark:text-white hover:opacity-70 transition-opacity"
        >
          JZL
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-12">
          <Link 
            href="/about" 
            className="body-small text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            about
          </Link>
          <Link 
            href="/research" 
            className="body-small text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            research
          </Link>
          <Link 
            href="/art-design" 
            className="body-small text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            art/design
          </Link>

          {/* Optional Theme Toggle */}
          {showThemeToggle && onThemeToggle && (
            <button
              onClick={onThemeToggle}
              className="w-10 h-10 rounded-full flex items-center justify-center bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              ) : (
                <Moon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              )}
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
