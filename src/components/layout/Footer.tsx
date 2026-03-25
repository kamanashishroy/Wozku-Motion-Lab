import React from 'react';
import { Zap, Layers, Maximize2 } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="p-8 flex justify-center pointer-events-none">
      <div className="glass px-8 py-4 rounded-3xl flex items-center gap-10">
        <div className="flex items-center gap-2.5 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-600 dark:text-neutral-400">
          <Zap className="w-3.5 h-3.5 text-indigo-500" />
          GPU ACCELERATED
        </div>
        <div className="w-px h-5 bg-black/5 dark:bg-white/10" />
        <div className="flex items-center gap-2.5 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-600 dark:text-neutral-400">
          <Layers className="w-3.5 h-3.5 text-indigo-500" />
          REACT READY
        </div>
        <div className="w-px h-5 bg-black/5 dark:bg-white/10" />
        <div className="flex items-center gap-2.5 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-600 dark:text-neutral-400">
          <Maximize2 className="w-3.5 h-3.5 text-indigo-500" />
          RESPONSIVE
        </div>
      </div>
    </footer>
  );
};
