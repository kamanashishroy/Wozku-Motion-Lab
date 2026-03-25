import React, { useState, useEffect } from 'react';
import { BackgroundConfig, DEFAULT_CONFIGS } from './types';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { Hero } from './components/layout/Hero';
import { Footer } from './components/layout/Footer';
import { CodeModal } from './components/layout/CodeModal';

export default function App() {
  const [config, setConfig] = useState<BackgroundConfig>(DEFAULT_CONFIGS.ribbons);
  const [showCode, setShowCode] = useState(false);
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'geometric' | 'fluid' | 'data'>('all');
  const [isEditing, setIsEditing] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [openPickerIndex, setOpenPickerIndex] = useState<number | null>(null);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved === 'light' || saved === 'dark') return saved;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'dark';
  });

  useEffect(() => {
    console.log('Theme changed to:', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.style.colorScheme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.style.colorScheme = 'light';
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;
      document.documentElement.style.setProperty('--mouse-x', `${x}%`);
      document.documentElement.style.setProperty('--mouse-y', `${y}%`);
    };
    window.addEventListener('mousemove', handleGlobalMouseMove);
    return () => window.removeEventListener('mousemove', handleGlobalMouseMove);
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-50 transition-colors duration-300">
      {/* Header - Top Layer */}
      <div className="relative z-50 w-full pointer-events-none">
        <Header 
          viewMode={viewMode}
          setViewMode={setViewMode}
          onShowCode={() => setShowCode(true)}
          theme={theme}
          setTheme={setTheme}
          showSidebar={showSidebar}
          setShowSidebar={setShowSidebar}
        />
      </div>

      {/* Sidebar & Controls */}
      <Sidebar 
        config={config}
        setConfig={setConfig}
        showSidebar={showSidebar}
        setShowSidebar={setShowSidebar}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        openPickerIndex={openPickerIndex}
        setOpenPickerIndex={setOpenPickerIndex}
        theme={theme}
        setTheme={setTheme}
      />

      {/* Main Content Area */}
      <div className="relative z-10 h-[calc(100vh-88px)] w-full pointer-events-none flex flex-col">
        <Hero viewMode={viewMode} config={config} theme={theme} />
        <Footer />
      </div>

      {/* Code Modal */}
      <CodeModal 
        config={config}
        showCode={showCode}
        setShowCode={setShowCode}
      />
    </div>
  );
}
