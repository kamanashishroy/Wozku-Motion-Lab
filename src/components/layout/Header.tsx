import React from 'react';
import { 
  Monitor,
  Smartphone,
  Github,
  Code,
  Sun,
  Moon,
  Settings2
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface HeaderProps {
  viewMode: 'desktop' | 'mobile';
  setViewMode: (mode: 'desktop' | 'mobile') => void;
  onShowCode: () => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  showSidebar: boolean;
  setShowSidebar: (show: boolean) => void;
}

export const Header: React.FC<HeaderProps> = ({
  viewMode,
  setViewMode,
  onShowCode,
  theme,
  setTheme,
  showSidebar,
  setShowSidebar
}) => {
  return (
    <header className="p-6 flex items-center justify-between gap-4 pointer-events-auto">
      <div className="flex items-center gap-4">
        {!showSidebar && (
          <button 
            onClick={() => setShowSidebar(true)}
            className="p-3 glass rounded-2xl transition-all shadow-sm text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
          >
            <Settings2 className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="flex items-center gap-3">
        <button 
          onClick={onShowCode}
          className="px-4 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 transition-all flex items-center gap-2 group shadow-lg shadow-indigo-600/20 backdrop-blur-md border border-white/10"
        >
          <Code className="w-4 h-4 text-white" />
          <span className="font-bold text-xs tracking-tight text-white">Export Engine</span>
        </button>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className={cn(
              "p-3 glass rounded-2xl transition-all shadow-sm",
              theme === 'dark' 
                ? "bg-white/10 text-white hover:bg-white/20" 
                : "bg-black/5 text-neutral-900 hover:bg-black/10"
            )}
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
          </button>

          <div className="flex items-center gap-1.5 glass p-1.5 rounded-2xl">
            <button 
              onClick={() => setViewMode('desktop')}
              className={cn(
                "p-1.5 rounded-xl transition-all",
                viewMode === 'desktop' ? "bg-black/5 dark:bg-white/10 text-neutral-900 dark:text-white shadow-sm" : "text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
              )}
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setViewMode('mobile')}
              className={cn(
                "p-1.5 rounded-xl transition-all",
                viewMode === 'mobile' ? "bg-black/5 dark:bg-white/10 text-neutral-900 dark:text-white shadow-sm" : "text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
              )}
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>

          <a 
            href="https://github.com" 
            target="_blank" 
            className="p-3 glass rounded-2xl hover:bg-black/5 dark:hover:bg-white/10 transition-all text-neutral-900 dark:text-white"
          >
            <Github className="w-5 h-5" />
          </a>
        </div>
      </div>
    </header>
  );
};
