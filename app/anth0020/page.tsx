'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';

interface ProjectPageProps {
  // Project metadata
  projectTitle: string;
  projectSubtitle?: string;
  projectDate?: string;
  
  // Navigation sections (for left sidebar)
  sections: {
    id: string;
    label: string;
  }[];
  
  // Main content (for right side)
  children: React.ReactNode;
}

export default function ProjectPage({ 
  projectTitle, 
  projectSubtitle, 
  projectDate,
  sections,
  children 
}: ProjectPageProps) {
  const [activeSection, setActiveSection] = useState<string>(sections[0]?.id || '');

  // Track scroll position to highlight active section
  useEffect(() => {
    const handleScroll = () => {
      const sectionElements = sections.map(section => ({
        id: section.id,
        element: document.getElementById(section.id),
      }));

      const scrollPosition = window.scrollY + 200;

      for (const { id, element } of sectionElements) {
        if (element) {
          const top = element.offsetTop;
          const bottom = top + element.offsetHeight;

          if (scrollPosition >= top && scrollPosition < bottom) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [sections]);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100; // Offset for fixed header
      const top = element.offsetTop - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Top Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 h-20 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 z-50">
        <div className="max-w-[1400px] mx-auto h-full px-8 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="text-3xl font-serif italic text-gray-900 dark:text-white">
            JZL
          </Link>

          {/* Nav Links */}
          <div className="flex items-center gap-12">
            <Link href="/about" className="body-small hover:text-gray-600 dark:hover:text-gray-400 transition-colors">
              about
            </Link>
            <Link href="/research" className="body-small hover:text-gray-600 dark:hover:text-gray-400 transition-colors">
              research
            </Link>
            <Link href="/art-design" className="body-small hover:text-gray-600 dark:hover:text-gray-400 transition-colors">
              art/design
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content Container */}
      <div className="max-w-[1400px] mx-auto pt-20">
        <div className="flex">
          {/* Left Sidebar - Navigation */}
          <aside className="w-64 fixed left-8 top-32 h-[calc(100vh-8rem)] flex flex-col">
            {/* Back Button */}
            <Link 
              href="/"
              className="flex items-center gap-2 mb-12 body-small hover:text-gray-600 dark:hover:text-gray-400 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Return
            </Link>

            {/* Section Navigation */}
            <nav className="flex flex-col gap-6">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`text-left body transition-colors ${
                    activeSection === section.id
                      ? 'text-gray-900 dark:text-white font-medium'
                      : 'text-gray-500 dark:text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  {section.label}
                </button>
              ))}
            </nav>
          </aside>

          {/* Right Content Area */}
          <main className="flex-1 ml-72 mr-8 py-12">
            {/* Hero Image Placeholder */}
            <div className="w-full h-80 bg-gray-200 dark:bg-gray-800 rounded-lg mb-8"></div>

            {/* Project Header */}
            <header className="mb-12">
              {projectDate && (
                <p className="caption uppercase mb-2">{projectDate}</p>
              )}
              <h1 className="display mb-4">{projectTitle}</h1>
              {projectSubtitle && (
                <p className="body-large text-gray-600 dark:text-gray-400">
                  {projectSubtitle}
                </p>
              )}
            </header>

            {/* Main Content */}
            <div className="prose dark:prose-invert max-w-none">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}